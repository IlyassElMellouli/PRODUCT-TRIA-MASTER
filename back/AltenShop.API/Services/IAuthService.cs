using AltenShop.API.Models;

namespace AltenShop.API.Services;

public interface IAuthService
{
    Task<string> Register(User user);
    Task<string?> Login(string email, string password);
}