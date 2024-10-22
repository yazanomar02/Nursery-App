using Microsoft.AspNetCore.Http;

namespace Infrastructure.ViewModels
{
    public class SaplingModel
    {
       //public  string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime SellDate { get; set; }
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal Amount { get; set; }
        public bool IsImported { get; set; }
        public Guid SaplingsCategoryId { get; set; }
        public IFormFile saplingImage { get; set; }
        public Guid NurseryId { get; set; }
    }
}
