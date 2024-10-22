using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class CartItem
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public decimal Total => Quantity * Price;
        public bool IsActive { get; set; } = true;
        [Timestamp]
        public byte[] RowVersion { get; set; }
        public Guid CartId { get; set; }
        public Cart? Cart { get; set; }
        public Guid SaplingId { get; set; }
        public Sapling? Sapling { get; set; }

        public CartItem()
        {
            Id = Guid.NewGuid();
        }
    }
}
