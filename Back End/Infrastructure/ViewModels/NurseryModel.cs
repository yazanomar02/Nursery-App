namespace Infrastructure.ViewModels
{
    public class NurseryModel
    {
        public required string Name { get; set; }
        public required string Address { get; set; }
        public Guid CompanyId { get; set; }
        public List<Guid> CategoryIds { get; set; } = new List<Guid>();
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
