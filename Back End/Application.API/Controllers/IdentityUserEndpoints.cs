using Application.API.Models;
using Application.Domain.Models;
using Infrastructure.ViewModels.Users;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static Application.API.Controllers.IdentityUserEndpoints;

namespace Application.API.Controllers
{
    public static class IdentityUserEndpoints
    {


     


        public static IEndpointRouteBuilder MapIdentityUserEndpoints(this IEndpointRouteBuilder app)
        {
            app.MapPost("/signup", CreateUser);
            app.MapPost("/signin", SignIn);
       
            return app;
        }

        private static async Task<IResult> CreateUser(UserManager<AppUser> userManager,
                [FromBody] USerRegistrationModel userRegistrationModel)
        {
            AppUser user = new AppUser()
            {
                UserName = userRegistrationModel.Email,
                Email = userRegistrationModel.Email,
                FullName = userRegistrationModel.FullName,
            };
            var result = await userManager.CreateAsync(user, userRegistrationModel.Password);
            if (result.Succeeded)
                return Results.Ok(result);
            else
                return Results.BadRequest(result);
        }

        private static async Task<IResult> SignIn(
                UserManager<AppUser> userManager,
                [FromBody] LoginModel loginModel,
                IOptions<AppSettings> appSetting)
        {
            var user = await userManager.FindByEmailAsync(loginModel.Email);
            if (user != null && await userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                var signInKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(appSetting.Value.JWTSecret));
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(10),
                    SigningCredentials = new SigningCredentials(
                        signInKey,
                        SecurityAlgorithms.HmacSha256Signature
                    )
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Results.Ok(new { token });
            }
            else
                return Results.BadRequest(new { message = "Username or password is incorrect" });
        }
        /*
        private static async Task<IResult> CreateRole(
            RoleManager<IdentityRole> roleManager,
            [FromBody] string roleName)
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var result = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (result.Succeeded)
                    return Results.Ok(result);
                else
                    return Results.BadRequest(result);
            }
            return Results.BadRequest(new { message = "Role already exists" });
        }

        private static async Task<IResult> AssignRoleToUser(
              UserManager<AppUser> userManager,
              RoleManager<IdentityRole> roleManager,
              [FromBody] RoleAssignmentModel model)
        {
            var user = await userManager.FindByIdAsync(model.UserId);
            if (user != null)
            {
                if (!await roleManager.RoleExistsAsync(model.RoleName))
                {
                    return Results.BadRequest(new { message = "Role does not exist" });
                }
                var result = await userManager.AddToRoleAsync(user, model.RoleName);
                if (result.Succeeded)
                    return Results.Ok(result);
                else
                    return Results.BadRequest(result);
            }
            return Results.BadRequest(new { message = "User not found" });
        }
        */

    }
}
