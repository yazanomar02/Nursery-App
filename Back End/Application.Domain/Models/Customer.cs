using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class Customer
    {
        //public required string Address { get; set; }
        public Guid Id { get; set; }
        public required string FullName { get; set; }

        //public required string FirstName { get; set; }
        //public required string LastName { get; set; }
        public required string Email { get; set; }
        //public required string PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;

        public List<Order> Orders { get; set; } = new List<Order>();

        public Customer()
        {
            Id = Guid.NewGuid();
        }
    }
}
