using Application.Domain.Models;

namespace Infrastructure.ViewModels
{
    public class OrderDetailsModel
    {
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total => Quantity * Price;

        public Guid SaplingId { get; set; }
    }
}
