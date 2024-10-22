using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class SaplingsCategory
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid SaplingTypeId { get; set; }
        public SaplingType? SaplingType { get; set; }
        List<Sapling> Saplings { get; set; } = new List<Sapling>();

        public SaplingsCategory()
        {
            Id = Guid.NewGuid();
        }
    }
}
