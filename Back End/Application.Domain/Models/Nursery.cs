using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    // كلاس المشتل 
    public class Nursery
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; } = true;
        public required string Address { get; set; }
        public Guid CompanyId { get; set; }
        public Company? Company { get; set; }
        public List<Category> Categories { get; set; } = new List<Category>();
        public List<Sapling> Saplings { get; set; } = new List<Sapling>();
        public List<Sector> Sectors { get; set; } = new List<Sector>();

        public Nursery()
        {
            Id = Guid.NewGuid();
        }
    }
}
