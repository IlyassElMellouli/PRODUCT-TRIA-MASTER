using AltenShop.API.Models;
using AltenShop.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AltenShop.API.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize] 
public class CartController : ControllerBase
{
    private readonly JsonDbService _db;

    public CartController(JsonDbService db)
    {
        _db = db;
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userIdClaim == null) throw new UnauthorizedAccessException("User ID not found in token.");
        return int.Parse(userIdClaim);
    }

    [HttpGet]
    public ActionResult<List<CartItem>> GetCart()
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = _db.Store.Users.FirstOrDefault(u => u.Id == userId);
            
            if (user == null) return Unauthorized();
            
            return Ok(user.Cart);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }


    // [POST] /api/cart
    // Payload attendu du Front: { productId: 1, quantity: 2 }
    [HttpPost]
    public IActionResult AddToCart([FromBody] CartItem item)
    {
        if (item.Quantity <= 0) return BadRequest("Quantity must be positive.");
        
        try
        {
            var userId = GetCurrentUserId();
            var user = _db.Store.Users.FirstOrDefault(u => u.Id == userId);
            
            if (user == null) return Unauthorized();

            // 1. Chercher si l'item est déjà dans le panier
            var existingItem = user.Cart.FirstOrDefault(ci => ci.ProductId == item.ProductId);

            if (existingItem != null)
            {
                // Si oui, on met à jour la quantité
                existingItem.Quantity += item.Quantity;
            }
            else
            {
                // Si non, on ajoute le nouvel item
                user.Cart.Add(item);
            }

            _db.SaveChanges(); // Sauvegarde dans le fichier JSON
            
            // On renvoie 200 OK avec le panier mis à jour
            return Ok(user.Cart);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
    }
}