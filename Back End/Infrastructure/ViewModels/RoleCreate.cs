using System.ComponentModel.DataAnnotations;

namespace Infrastructure.ViewModels
{
    public class RoleCreate
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
