using AltenShop.API.Models;
using AltenShop.API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims; // Pour potentiellement lire l'email après génération

namespace AltenShop.API.Controllers;

[Route("api")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("account")]
    public async Task<IActionResult> Register(User user)
    {
        await _authService.Register(user);
        return Ok(new { message = "Compte créé avec succès" });
    }

    [HttpPost("token")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var tokenString = await _authService.Login(request.Email, request.Password);
        
        if (tokenString == null) 
            return Unauthorized(new { message = "Identifiants invalides" });
        
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true, 
            Expires = DateTime.UtcNow.AddDays(7), 
            Secure = false, 
            SameSite = SameSiteMode.Strict, 
        };

        Response.Cookies.Append("jwt_token", tokenString, cookieOptions);

        return Ok(new { 
            token = tokenString, 
            email = request.Email, 
            message = "Connexion réussie. Le token est dans le corps et dans le cookie."
        });
    }
}