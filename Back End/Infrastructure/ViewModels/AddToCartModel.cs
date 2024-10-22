using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class AddToCartModel
    {
        public Guid? CartId { get; set; }
        public Guid SaplingId { get; set; }
        public int Quantity { get; set; }
    }

}
