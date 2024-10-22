using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Infrastructure.ViewModels.Users;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NurseryController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly IUserRepository userRepository;
        private readonly IConfiguration configuration;
        private readonly INurseryRepository nurseryRepository;
        private readonly ICategoryRepository categoryRepository;

        public NurseryController(IUserRepository userRepository, IConfiguration configuration,
                                 INurseryRepository nurseryRepository,
                                 ICategoryRepository categoryRepository)
        {
            this.userRepository = userRepository;
            this.configuration = configuration;
            this.nurseryRepository = nurseryRepository;
            this.categoryRepository = categoryRepository;
        }


        [HttpPost]
        public async Task<ActionResult<Nursery>> Create(NurseryModel nursery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newNursery = new Nursery()
            {
                Address = nursery.Address,
                Name = nursery.Name,
                CompanyId = nursery.CompanyId
            };

            // إضافة الفئات
            if (nursery.CategoryIds != null && nursery.CategoryIds.Any())
            {
                foreach (var categoryId in nursery.CategoryIds)
                {
                    var category = await categoryRepository.GetAsync(categoryId);
                    if (category != null) 
                    {
                        newNursery.Categories.Add(category);
                    }
                }
            }
            var createResult = await nurseryRepository.AddAsync(newNursery)!;
            await nurseryRepository.SaveChangesAsync();

            var userModel = new USerRegistrationModel()
            {
                Email = nursery.Email,
                Role = "nursery",
                FullName = nursery.Name,
                Password = nursery.Password,
                NurseryId = newNursery.Id,
            };

            var newUser = await userRepository.RegisterAsync(userModel);

            if (newUser == null)
            {
                return BadRequest("User registration failed");
            }
            if (createResult == null)
                return BadRequest();

            await nurseryRepository.SaveChangesAsync();
            return CreatedAtRoute("GetNursery", new { nurseryId = newNursery.Id }, newNursery);
        }


        [HttpPut("{nurseryId}")]
        public async Task<ActionResult<Nursery>> Update(Guid nurseryId, NurseryModel nursery)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingNursery = await nurseryRepository.GetAsync(nurseryId);

            if (existingNursery != null)
            {
                var check = existingNursery.Name == nursery.Name &&
                            existingNursery.CompanyId == nursery.CompanyId &&
                            existingNursery.Address == nursery.Address;
                if (check)
                {
                    return NoContent();
                }

                existingNursery.Name = nursery.Name;
                existingNursery.CompanyId = nursery.CompanyId;
                existingNursery.Address = nursery.Address;

                nurseryRepository.Update(existingNursery);
                await nurseryRepository.SaveChangesAsync();

                return Ok(existingNursery);
            }

            return NotFound();
        }


        [HttpDelete("{nurseryId}")]
        public async Task<ActionResult<Nursery>> Delete(Guid nurseryId)
        {
            var existingNursery = await nurseryRepository.GetAsync(nurseryId);

            if (existingNursery != null)
            {
                await nurseryRepository.DeleteAsync(nurseryId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{nurseryId}", Name = "GetNursery")]
        public async Task<ActionResult<Nursery>> Get(Guid nurseryId, bool isInclude = false)
        {
            var existingNursery = await nurseryRepository.GetAsync(nurseryId, isInclude);

            if (existingNursery == null)
                return NotFound();

            return Ok(existingNursery);
        }


        [HttpGet]
        public async Task<ActionResult<Nursery>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (nurseries, paginationMetaData) = await nurseryRepository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (nurseries == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(nurseries);
        }
    }
}
