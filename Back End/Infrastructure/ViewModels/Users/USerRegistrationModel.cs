using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.ViewModels.Users
{
    public class USerRegistrationModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public Guid? CompanyId { get; set; }
        public Guid? NurseryId { get; set; }
        public string? Role { get; set; }
    }
}
