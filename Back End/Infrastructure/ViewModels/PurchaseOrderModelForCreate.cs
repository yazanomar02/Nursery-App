using Application.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class PurchaseOrderModelForCreate
    {
        public DateTime DateOrder { get; set; }
        public Guid SupplierId { get; set; }
        public Guid NurseryId { get; set; }
        public List<PurchaseOrderDetailsModelForCreate> OrderDetails { get; set; } = new List<PurchaseOrderDetailsModelForCreate>();

    }
}
