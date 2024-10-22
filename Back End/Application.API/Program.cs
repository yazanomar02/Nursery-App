using Application.API.Controllers;
using Application.API.Extensions;
using Application.API.Models;
using Application.Domain.Models;
using Infrastructure.DbContexts;
using Infrastructure.Services.Repo.Repositorys;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
    {
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
    });


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


builder.Services.AddSwaggerExplorer()
                .InjectDbContext(builder.Configuration)
                .AddAppConfig(builder.Configuration)
                .ConfigureIdentityOptions()
                .AddIdentityHandlerAndStores()
                .AddIdentityAuth(builder.Configuration);




builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NurseryDbConnectionString")));

builder.Services.AddDbContext<UsersDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NurseryDbConnectionString")));

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICompanyRepository, CompanyRepository>();
builder.Services.AddScoped<ISectorRepository, SectorRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ISaplingRepository, SaplingRepository>();
builder.Services.AddScoped<INurseryRepository, NurseryRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ISaplingTypeRepository, SaplingTypeRepository>();
builder.Services.AddScoped<ISaplingsCategoryRepository, SaplingsCategoryRepository>();
builder.Services.AddScoped<IOrderDetailsRepository, OrderDetailsRepository>();
builder.Services.AddScoped<IPurchaseOrderRepository, PurchaseOrderRepository>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

//--------------------
var fullName = builder.Configuration.GetValue<string>("AdminInformation:fullName");
var email = builder.Configuration.GetValue<string>("AdminInformation:email");
var password = builder.Configuration.GetValue<string>("AdminInformation:password");
var role = builder.Configuration.GetValue<string>("AdminInformation:role");

var Admin = new User()
{
    FullName = fullName!,
    Email = email!,
    Password = password!,
    Role = role!
};
//--------------------


builder.Services.AddCors(option =>
{
    option.AddPolicy("app-cors-policy", builder =>
    {
        builder.WithOrigins("http://localhost:4200")
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

var app = builder.Build();



//app.UseStaticFiles();

app .ConfguereSwaggerExplorer()
    .ConfigCORS(builder.Configuration)
    .AddIdentityAuthMiddlewares();


app.UseHttpsRedirection();


app.MapControllers();

app
    .MapGroup("/api")
    .MapIdentityApi<AppUser>();
app
    .MapGroup("/api")
    .MapIdentityUserEndpoints();

app.UseStaticFiles();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    AppDbContext.CreateAdmin(context , Admin);
}
app.Run();

