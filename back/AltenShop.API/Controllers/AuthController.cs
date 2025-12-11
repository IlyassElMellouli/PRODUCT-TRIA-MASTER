using AltenShop.API.Models;
using AltenShop.API.Services;
using Microsoft.AspNetCore.Mvc;

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
        var token = await _authService.Login(request.Email, request.Password);
        if (token == null) return Unauthorized(new { message = "Identifiants invalides" });
        return Ok(new { token });
    }
}

public class LoginRequest { public string Email { get; set; } = ""; public string Password { get; set; } = ""; }