using Application.API.Models;
using Infrastructure.DbContexts;
using Microsoft.EntityFrameworkCore;

namespace Application.API.Extensions
{
    public static class AppConfigExtensions
    {
        public static WebApplication ConfigCORS(this WebApplication app , IConfiguration config)
        {
            //app.UseCors(options =>
            //    options.WithOrigins("http://localhost:42000")
            //    .AllowAnyMethod()
            //    .AllowAnyHeader()
            //);
            app.UseCors("app-cors-policy");

            return app;
        }
        public static IServiceCollection AddAppConfig(this IServiceCollection services, IConfiguration config)
        {
           services.Configure<AppSettings>(config.GetSection("AppSettings"));
            return services;
        }
    }
}
