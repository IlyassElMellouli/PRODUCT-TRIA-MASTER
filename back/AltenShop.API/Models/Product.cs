namespace AltenShop.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public string InternalReference { get; set; } = string.Empty;
    public int ShellId { get; set; }
    public string InventoryStatus { get; set; } = "INSTOCK"; 
    public int Rating { get; set; }
    public long CreatedAt { get; set; }
    public long UpdatedAt { get; set; }
}