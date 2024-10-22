using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class OrderModelForCreate
    {
        public DateTime DateOrder { get; set; }  
        public Guid  UserId { get; set; }
        //public Guid CustomerId { get; set; }
        /*public Guid NurseryId { get; set; }*/
        public List<OrderDetailsForCreate> OrderDetails { get; set; } = new List<OrderDetailsForCreate>();
    }
}
