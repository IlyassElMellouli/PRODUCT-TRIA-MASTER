using System.Text.Json;
using AltenShop.API.Data;
using AltenShop.API.Models;

namespace AltenShop.API.Services;

public class JsonDbService
{
    private readonly string _filePath = "database.json";
    private readonly object _lock = new(); 
    
    public JsonDataStore Store { get; private set; }

    public JsonDbService()
    {
        if (File.Exists(_filePath))
        {
            var json = File.ReadAllText(_filePath);
            Store = JsonSerializer.Deserialize<JsonDataStore>(json) ?? new JsonDataStore();
        }
        else
        {
            Store = new JsonDataStore();
            SaveChanges(); 
        }
    }

    public void SaveChanges()
    {
        lock (_lock) 
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(Store, options);
            File.WriteAllText(_filePath, json);
        }
    }
}