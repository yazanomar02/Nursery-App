using Application.Domain.Models;
using Infrastructure.DbContexts;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        private readonly AppDbContext context;

        public UserRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public async Task<User> RegisterAsync(USerRegistrationModel userModel)
        {
            var existingUser = context.Users.FirstOrDefault(u => u.Email == userModel.Email);

            if (existingUser != null)
            {
                return null;
            }
            if (userModel.Role == null)
            {
                userModel.Role = "user";
            }
            var newUser = new User
            {
                FullName = userModel.FullName,
                Email = userModel.Email,
                Password = userModel.Password,
                Role = userModel.Role
            };
            if (userModel.NurseryId != null)
            {                
                newUser.NurseryId = userModel.NurseryId;
            }
            if (userModel.CompanyId != null)
            {
                newUser.CompanyId = userModel.CompanyId;
            }

            await context.Users.AddAsync(newUser);
            await context.SaveChangesAsync();

            return newUser;
        }
        public async Task<(User, string)> LoginAsync(string email, string password, IConfiguration configuration)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == email && !u.IsDeleted);

            if (user == null || user.Password != password)
            {
                return (null, null);
            }

            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.GivenName, user.FullName),
            new Claim(ClaimTypes.Role, user.Role)
        };

            var secretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:SecretKey"]));
            var signingCredential = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var securityToken = new JwtSecurityToken(
                configuration["Authentication:Issuer"],
                configuration["Authentication:Audience"],
                claims,
                expires: DateTime.UtcNow.AddHours(10),
                signingCredentials: signingCredential
            );

            var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
            return (user, token);
        }

        public User CheckUser(string email, string password)
        {
            var user = context.Users.FirstOrDefault(u => u.Email == email && !u.IsDeleted);

            if (user is not null)
            {
                if (user.Password == password)
                    return user;
            }

            return null;
        }

        public async Task Delete(Guid id)
        {
            var user = await context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user is not null)
            {
                user.IsDeleted = true;
            }

            context.Users.Update(user);
        }

        public User FindByEmail(string email)
        {
            return context.Users.FirstOrDefault(u => u.Email == email);
        }

        public User FindById(Guid userId)
        {
            return context.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
