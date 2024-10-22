namespace Infrastructure.ViewModels
{
    public class SaplingsCategoryModel
    {
        public required string Name { get; set; }
        public Guid SaplingTypeId { get; set; }
    }
}
