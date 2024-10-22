using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class OrderDetailsForCreate
    {
        public int Quantity { get; set; }
        public Guid SaplingId { get; set; }
    }
}
