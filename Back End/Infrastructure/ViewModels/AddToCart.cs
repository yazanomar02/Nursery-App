using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class AddToCart
    {
        public Guid? CartId { get; set; }
        public SaplingForCart? Sapling { get; set; }
    }
}
