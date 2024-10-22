namespace Infrastructure.ViewModels
{
    public class SaplingTypeModel
    {
        public required string Name { get; set; }
        public required string Description { get; set; }
        public Guid CategoryId { get; set; }
    }
}
