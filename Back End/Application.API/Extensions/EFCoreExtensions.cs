using Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Extensions
{
    public static class EFCoreExtensions
    {
        public static IServiceCollection InjectDbContext(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<UsersDbContext>(options =>
                  options.UseSqlServer(config.GetConnectionString("NurseryDbConnectionString")));

            return services;
        }
    }
}
