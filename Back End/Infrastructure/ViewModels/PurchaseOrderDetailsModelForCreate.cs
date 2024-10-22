using Application.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels
{
    public class PurchaseOrderDetailsModelForCreate
    {
        public int Quantity { get; set; }

        public Guid SaplingsCategoryId { get; set; }

        public DateTime BirthDate { get; set; }
        public DateTime SellDate { get; set; }
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public bool IsImported { get; set; }
    }
}
