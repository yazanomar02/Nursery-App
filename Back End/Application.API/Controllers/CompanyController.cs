using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Infrastructure.ViewModels.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompanyController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly IUserRepository userRepository;
        private readonly ICompanyRepository repository;
        private readonly IConfiguration configuration;

        public CompanyController(IUserRepository userRepository, ICompanyRepository repository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.repository = repository;
            this.configuration = configuration;
        }

        [HttpPost]
        public async Task<ActionResult<Company>> Create(CompanyModel company)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newCompany = new Company()
            {
                Email = company.Email,
                PhoneNumber = company.PhoneNumber,
                Address = company.Address,
                Name = company.Name,
                Description = company.Description
            };

            var CompanyCreated = await repository.AddAsync(newCompany);

            await repository.SaveChangesAsync();

            var userModel = new USerRegistrationModel()
            {
                Email = company.Email,
                Role = "company",
                FullName = company.Name,
                Password = company.Password,
                CompanyId = CompanyCreated.Id,
            };

            var newUser = await userRepository.RegisterAsync(userModel);

            if (newUser == null)
            {
                return BadRequest("User registration failed");
            }

            return CreatedAtRoute("GetCompany", new { companyId = newCompany.Id }, newCompany);
        }


        [HttpPut("{companyId}")]
        public async Task<ActionResult<Company>> Update(Guid companyId, CompanyModel company)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCompany = await repository.GetAsync(companyId);

            if (existingCompany != null)
            {
                var check = existingCompany.Name == company.Name &&
                            existingCompany.Description == company.Description &&
                            existingCompany.Address == company.Address &&
                            existingCompany.PhoneNumber == company.PhoneNumber &&
                            existingCompany.Email == company.Email;
                if (check)
                {
                    return NoContent();
                }

                existingCompany.Name = company.Name;
                existingCompany.Description = company.Description;
                existingCompany.Address = company.Address;
                existingCompany.PhoneNumber = company.PhoneNumber;
                existingCompany.Email = company.Email;

                repository.Update(existingCompany);
                await repository.SaveChangesAsync();

                return Ok(existingCompany);
            }

            return NotFound();
        }


        [HttpDelete("{companyId}")]
        public async Task<ActionResult<Company>> Delete(Guid companyId)
        {
            var existingCompany = await repository.GetAsync(companyId);

            if (existingCompany != null)
            {
                await repository.DeleteAsync(companyId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{companyId}", Name = "GetCompany")]
        public async Task<ActionResult<Company>> Get(Guid companyId, bool isInclude = false)
        {
            var existingCompany = await repository.GetAsync(companyId, isInclude);

            if (existingCompany == null)
                return NotFound();

            return Ok(existingCompany);
        }


        [HttpGet]
        public async Task<ActionResult<Company>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (companyies, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (companyies == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(companyies);
        }
    }
}
