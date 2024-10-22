using Application.Domain.Models;
using Infrastructure.DbContexts;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Application.API.Extensions
{
    public static class IdentityExtensions
    {
        public static IServiceCollection AddIdentityHandlerAndStores(this  IServiceCollection services)
        {
            services.AddIdentityApiEndpoints<AppUser>()
                    .AddEntityFrameworkStores<UsersDbContext>();
            //services.AddIdentity<AppUser, IdentityRole>()
            //    .AddEntityFrameworkStores<UsersDbContext>()
            //    .AddDefaultTokenProviders();

            return services;
        }
        public static IServiceCollection ConfigureIdentityOptions(this IServiceCollection services)
        {
            services.Configure<IdentityOptions>(
                    options =>
                    {
                        options.Password.RequireDigit = false;
                        options.Password.RequireUppercase = false;
                        options.Password.RequireLowercase = false;
                        options.User.RequireUniqueEmail = true;

                    } );
            return services;

        }

        public static WebApplication AddIdentityAuthMiddlewares(this WebApplication app)
        {
            app.UseAuthentication();
            app.UseAuthorization();
            return app;
        }

        public static IServiceCollection AddIdentityAuth(this IServiceCollection services, IConfiguration config)
        {
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme =
                x.DefaultChallengeScheme =
                x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(y =>
            {
                y.SaveToken = false;
                y.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            config["AppSettings:JWTSecret"]!))
                };
            });
            return services;

        }
    }
}
