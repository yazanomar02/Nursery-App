using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class SaplingType
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public List<SaplingsCategory> Saplings { get; set; } = new List<SaplingsCategory>();

        public SaplingType() 
        {
            Id = Guid.NewGuid();
        }

    }
}
