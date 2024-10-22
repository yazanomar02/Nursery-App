using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class SaplingForCart
    {
        public Guid Id { get; set; }
        public int Quantity { get; set; } = 1;
    }
}
