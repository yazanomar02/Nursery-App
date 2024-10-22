using Application.Domain.Models;

namespace Infrastructure.ViewModels
{
    public class OrderModel
    {
        public DateTime DateOrder { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal AfterDisCount { get; set; }
        public Guid CustomerId { get; set; }
        /*public Guid NurseryId { get; set; }*/
        public List<OrderDetailsModel> OrderDetails { get; set; } = new List<OrderDetailsModel>();
    }
}
