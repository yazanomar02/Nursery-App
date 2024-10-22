    using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class Order
    {
        public Guid Id { get; set; }    
        public DateTime DateOrder { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal AfterDisCount { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid UserId { get; set; }
        public User? User { get; set; }
        //public Guid CustomerId { get; set; }
        //public Customer? Customer { get; set; }
        /*public Guid NurseryId { get; set; } 
        public Nursery? Nursery { get; set; }*/
        public List<OrderDetails> OrderDetails { get; set; } = new List<OrderDetails>();

        public Order()
        {
            Id = Guid.NewGuid();
        }
    }
}
