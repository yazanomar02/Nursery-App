using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class CreateOrderModel
    {
        public Guid? CartId { get; set; }
        public Guid CustomerId { get; set; }
    }
}
