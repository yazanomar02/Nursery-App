using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    // قطاع 
    public class Sector
    {
        public Guid Id { get; set; }
        public int Number { get; set; }
        public int Capacity { get; set; } // السعة 
        public int CurrentQuantity { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid NurseryId { get; set; }
        public Nursery? Nursery { get; set; }
        public List<Sapling> Saplings { get; set; } = new List<Sapling>();


        public Sector()
        {
            Id = Guid.NewGuid();
        }
    }
}
