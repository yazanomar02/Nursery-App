using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class NurseryCategory
    {
        public Guid Id { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid NurseryId { get; set; }
        public Nursery? Nursery { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }

        public NurseryCategory()
        {
            Id = Guid.NewGuid();
        }
    }
}
