using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class SaplingSector
    {
        public Guid Id { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid SaplingId { get; set; }
        public Sapling? Sapling { get; set; }
        public Guid SectorId { get; set; }
        public Sector? Sector { get; set; }

        public SaplingSector()
        {
            Id = Guid.NewGuid();
        }
    }
}
