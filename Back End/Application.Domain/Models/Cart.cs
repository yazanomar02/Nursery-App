using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class Cart
    {
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public decimal TotalPrice => CartItems.Sum(item => item.Total); // حساب السعر الإجمالي بناءً على الكميات والأسعار
        public bool IsActive { get; set; } = true;

        //public Guid CustomerId { get; set; }
        //public Customer? Customer { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public List<CartItem> CartItems { get; set; }
        [Timestamp] // Add this line
        public byte[] RowVersion { get; set; }

        public Cart()
        {
            Id = Guid.NewGuid();
            DateCreated = DateTime.Now;
            CartItems = new List<CartItem>();
        }
    }

}
