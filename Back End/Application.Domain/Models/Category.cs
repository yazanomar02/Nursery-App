using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    // كلاس الصنف 
    public class Category
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; } = true;

        public List<SaplingType> SaplingTypes { get; set; } = new List<SaplingType>();
        public List<Nursery> Nurseries { get; set; } = new List<Nursery>();

        public Category()
        {
            Id = Guid.NewGuid();
        }
    }
}
