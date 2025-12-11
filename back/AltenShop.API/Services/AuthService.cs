using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AltenShop.API.Data;
using AltenShop.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BCrypt.Net;

namespace AltenShop.API.Services;

public class AuthService : IAuthService
{
    private readonly JsonDbService _db; 
    private readonly IConfiguration _config;

    public AuthService(JsonDbService db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public async Task<string> Register(User user)
    {
        // Vérif email unique
        if (_db.Store.Users.Any(u => u.Email == user.Email)) 
            throw new Exception("Email déjà pris");

        // ID Auto-increment
        user.Id = _db.Store.Users.Any() ? _db.Store.Users.Max(u => u.Id) + 1 : 1;
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

        _db.Store.Users.Add(user);
        _db.SaveChanges(); // Sauvegarde JSON

        return "User created";
    }

    public async Task<string?> Login(string email, string password)
    {
        // Recherche en mémoire (LINQ simple)
        var user = _db.Store.Users.FirstOrDefault(u => u.Email == email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            return null;

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}