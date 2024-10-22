using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class PurchaseOrder
    {
        public Guid Id { get; set; }
        public DateTime DateOrder { get; set; }
        public decimal TotalPrice { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid SupplierId { get; set; }  
        public Supplier? Supplier { get; set; }  
        public Guid NurseryId { get; set; }
        public Nursery? Nursery { get; set; }
        public List<PurchaseOrderDetails> OrderDetails { get; set; } = new List<PurchaseOrderDetails>();

        public PurchaseOrder()
        {
            Id = Guid.NewGuid();
        }
    }

}
