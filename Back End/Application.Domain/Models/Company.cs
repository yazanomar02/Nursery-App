using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    //كلاس الشركة 
    public class Company
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public bool IsActive { get; set; } = true;
     

        public List<Nursery> Nurseries { get; set; }  = new List<Nursery>();

        public Company()
        {
            Id = Guid.NewGuid();
        }
    }
}
