using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Domain.Models
{
    public class AppUser : IdentityUser
    {
        [PersonalData]
        [Column(TypeName ="nvarchar(110)")]
        public string FullName { get; set; }
    }
}
