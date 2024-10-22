using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class Supplier
    {
        public Guid Id { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;

        public List<PurchaseOrder> Orders { get; set; } = new List<PurchaseOrder>();
        public required string Address { get; set; }
        public Supplier()
        {
            Id = Guid.NewGuid();
        }
    }
}
