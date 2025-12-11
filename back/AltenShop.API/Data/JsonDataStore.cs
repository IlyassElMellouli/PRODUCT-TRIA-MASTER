using AltenShop.API.Models;

namespace AltenShop.API.Data;

public class JsonDataStore
{
    public List<Product> Products { get; set; } = new();
    public List<User> Users { get; set; } = new();
}