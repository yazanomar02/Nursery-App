using System.Globalization;

namespace Infrastructure.ViewModels
{
    public class CompanyModel
    {
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required string Description { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public string Password { get; set; }
    }
}
