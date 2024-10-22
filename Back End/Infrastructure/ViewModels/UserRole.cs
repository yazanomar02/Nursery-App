using System.ComponentModel.DataAnnotations;

namespace Infrastructure.ViewModels
{
    public class UserRole
    {
        [Key]
        public int Id { get; set; }
        [Display(Name ="User")]
        public string userId { get; set; }
        [Display(Name = "Role")]
        public string roleName { get; set; }
    }
}
