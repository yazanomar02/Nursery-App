using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class UpdateQuantityModel
    {
        public Guid? CartId { get; set; }
        public List<SaplingModel>? Sapling { get; set; }
    }
}
