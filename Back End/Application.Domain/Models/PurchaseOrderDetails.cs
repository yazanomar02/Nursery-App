using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class PurchaseOrderDetails
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; } 
        public decimal Price { get; set; }  
        public decimal Total => Quantity * Price;  
        public bool IsActive { get; set; } = true;

        public Guid PurchaseOrderId { get; set; } 
        public PurchaseOrder? PurchaseOrder { get; set; }  

        public Guid SaplingsCategoryId { get; set; }  
        public SaplingsCategory? SaplingsCategory { get; set; } 

        public PurchaseOrderDetails()
        {
            Id = Guid.NewGuid();
        }
    }

}
