using Infrastructure.Services.Repo.Repositorys;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static Application.API.Controllers.IdentityUserEndpoints;
using System.Security.Claims;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Application.Domain.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Infrastructure.ViewModels.Users;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository userRepository;
        private readonly IConfiguration configuration;

        public UserController(IUserRepository userRepository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.configuration = configuration;
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("login")]
        public async Task<IActionResult> Login(LoginModel loginModel)
        {
            if (loginModel == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            var (user, token) = await userRepository.LoginAsync(loginModel.Email, loginModel.Password, configuration);

            if (user == null)
            {
                return BadRequest();
            }
            Guid? ManageId = null;
            if (user.NurseryId != null)
            {
                ManageId = user.NurseryId;
            }
            else if (user.CompanyId != null)
            {
                ManageId = user.CompanyId;
            }
            else
                ManageId = user.Id;

            return Ok(new { token, userRole = user.Role, userId = user.Id.ToString() , manageId = ManageId.Value.ToString() });
        }

        /*        [HttpPost]
                [AllowAnonymous]
                [Route("login")]
                public async Task<IActionResult> Login(LoginModel loginModel)
                {
                    if (loginModel is null)
                    {
                        return BadRequest();
                    }

                    if (!ModelState.IsValid)
                    {
                        return BadRequest();
                    }

                    var user = userRepository.CheckUser(loginModel.Email, loginModel.Password);

                    if (user is null)
                    {
                        return BadRequest();
                    }


                    var claims = new List<Claim>()
                        {
                            new Claim(ClaimTypes.GivenName, user.FullName),
                            new Claim(ClaimTypes.Role, user.Role)
                        };


                    var secretKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(configuration["Authentication:SecretKey"])); // إعداد المفتاح

                    var signingCredantial = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256); // HmacSha256: خوارزمية التشفير

                    // إعداد خصائص ال Token
                    var securityToken = new JwtSecurityToken
                        (configuration["Authentication:Issuer"],
                        configuration["Authentication:Audience"],
                        claims,
                        DateTime.UtcNow,
                        DateTime.UtcNow.AddHours(10),
                        signingCredantial
                        );

                    // Object --> String        (Token)
                    var token = new JwtSecurityTokenHandler().WriteToken(securityToken);
                    var userRole = user.Role;
                    var userId = user.Id.ToString();

                    return Ok(new { token , userRole , userId});
                }

        */
        /*        [HttpPost]
                [Route("register")]
                [AllowAnonymous]
                public async Task<IActionResult> Register(USerRegistrationModel userModel)
                {
                    if (userModel == null)
                    {
                        return BadRequest();
                    }

                    if (!ModelState.IsValid)
                        return BadRequest();


                    var existingUser = userRepository.FindByEmail(userModel.Email);
                    if (existingUser != null)
                    {
                        return BadRequest();
                    }

                    var newUser = new User()
                    {
                        FullName = userModel.FullName,
                        Email = userModel.Email,
                        Password = userModel.Password,
                        Role = "user"
                    };

                    await userRepository.AddAsync(newUser);
                    await userRepository.SaveChangesAsync();

                    return Ok(newUser);
                }*/
       
        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register(USerRegistrationModel userModel)
        {
            if (userModel == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            var newUser = await userRepository.RegisterAsync(userModel);

            if (newUser == null)
            {
                return BadRequest("User already exists");
            }

            return Ok(newUser);
        }


        [HttpGet("{userId}", Name = "GetUser")]
        public async Task<ActionResult<User>> Get(Guid userId)
        {
            var existingUser = await userRepository.GetAsync(userId);

            if (existingUser == null)
            {
                return NotFound();
            }

            return Ok(existingUser);
        }

    }
}
