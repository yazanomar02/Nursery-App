using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class User
    {
        public Guid Id { get; set; }

        [Required]
        public required string FullName { get; set; }

        [Required]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; }

        [Required]
        public string Role { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? NurseryId { get; set; }
        public bool IsDeleted { get; set; } = false;
        public List<Cart> Carts { get; set; } = new List<Cart>();
        public User()
        {
            Id = Guid.NewGuid();
        }
    }
}
