using Microsoft.EntityFrameworkCore;
using AltenShop.API.Models;

namespace AltenShop.API.Data;

public class ShopContext : DbContext
{
    public ShopContext(DbContextOptions<ShopContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<User> Users { get; set; }
}