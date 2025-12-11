using AltenShop.API.Models;
using AltenShop.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AltenShop.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductsController : ControllerBase
{
    private readonly JsonDbService _db;

    public ProductsController(JsonDbService db)
    {
        _db = db;
    }

    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetProducts()
    {
        return Ok(_db.Store.Products);
    }

    [HttpGet("{id}")]
    public ActionResult<Product> GetProduct(int id)
    {
        var product = _db.Store.Products.FirstOrDefault(p => p.Id == id);
        return product == null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Policy = "AdminOnly")]
    public ActionResult<Product> PostProduct(Product product)
    {
        // GESTION MANUELLE DE L'ID (Simulation Auto-Increment)
        int newId = _db.Store.Products.Any() ? _db.Store.Products.Max(p => p.Id) + 1 : 1;
        product.Id = newId;
        
        // Gestion des dates
        long now = DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        product.CreatedAt = now;
        product.UpdatedAt = now;

        _db.Store.Products.Add(product);
        _db.SaveChanges(); // Écriture disque

        return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
    }

    [HttpPatch("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult UpdateProduct(int id, Product product)
    {
        var existingProduct = _db.Store.Products.FirstOrDefault(p => p.Id == id);
        if (existingProduct == null) return NotFound();

        // Mise à jour des champs
        existingProduct.Name = product.Name;
        existingProduct.Description = product.Description;
        existingProduct.Price = product.Price;
        existingProduct.Quantity = product.Quantity;
        existingProduct.Category = product.Category;
        existingProduct.InventoryStatus = product.InventoryStatus;
        existingProduct.UpdatedAt = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        _db.SaveChanges(); // Écriture disque
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "AdminOnly")]
    public IActionResult DeleteProduct(int id)
    {
        var product = _db.Store.Products.FirstOrDefault(p => p.Id == id);
        if (product == null) return NotFound();

        _db.Store.Products.Remove(product);
        _db.SaveChanges(); // Écriture disque
        return NoContent();
    }
}