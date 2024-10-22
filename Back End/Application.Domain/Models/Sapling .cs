using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    //كلاس الشتلة 
    public class Sapling
    {
        public Guid Id { get; set; }
        public  string BarCode { get; set; }
        public  string Name { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime SellDate { get; set; }
        public decimal BuyPrice { get; set; }
        public decimal SellPrice { get; set; }
        public decimal Amount { get; set; }
        public bool IsImported { get; set; }
        public bool IsActive { get; set; } = true;
        public Guid NurseryId { get; set; }
        public Nursery? Nursery { get; set; }
        public string SaplingImage {  get; set; }

        public Guid SaplingsCategoryId {  get; set; }
        public SaplingsCategory? SaplingsCategory { get; set; }
        public List<Sector> Sectors { get; set; } = new List<Sector>();

        public Sapling()
        {
            Id = Guid.NewGuid();
        }
    }
}
