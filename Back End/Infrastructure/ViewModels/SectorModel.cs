namespace Infrastructure.ViewModels
{
    public class SectorModel
    {
        public int Number { get; set; }
        public int Capacity { get; set; }
        //public int CurrentQuantity { get; set; } 
        public Guid NurseryId { get; set; }
    }
}
