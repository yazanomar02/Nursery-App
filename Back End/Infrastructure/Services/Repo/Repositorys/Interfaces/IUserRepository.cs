using Application.Domain.Models;
using Microsoft.Extensions.Configuration;
using Infrastructure.ViewModels.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        User CheckUser(string email, string password);
        User FindByEmail(string email);
        Task Delete(Guid id);
        Task<(User, string)> LoginAsync(string email, string password, IConfiguration configuration);
        Task<User> RegisterAsync(USerRegistrationModel userModel);
        User FindById(Guid userId);
    }
}
