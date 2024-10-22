using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ICategoryRepository repository;

        public CategoryController(ICategoryRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public async Task<ActionResult<Category>> Create(CategoryModel category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newCategory = new Category()
            {
                Name = category.Name
            };

            var createResult = await repository.AddAsync(newCategory)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetCategory", new { categoryId = newCategory.Id }, newCategory);
        }


        [HttpPut("{categoryId}")]
        public async Task<ActionResult<Category>> Update(Guid categoryId, CategoryModel category)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCategory = await repository.GetAsync(categoryId);

            if (existingCategory != null)
            {
                if (existingCategory.Name == category.Name)
                {
                    return NoContent();
                }

                existingCategory.Name = category.Name;

                repository.Update(existingCategory);
                await repository.SaveChangesAsync();

                return Ok(existingCategory);
            }

            return NotFound();
        }


        [HttpDelete("{categoryId}")]
        public async Task<ActionResult<Category>> Delete(Guid categoryId)
        {
            var existingCategory = await repository.GetAsync(categoryId);

            if (existingCategory != null)
            {
                await repository.DeleteAsync(categoryId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{categoryId}", Name = "GetCategory")]
        public async Task<ActionResult<Category>> Get(Guid categoryId, bool isInclude = false)
        {
            var existingCategory = await repository.GetAsync(categoryId, isInclude);

            if (existingCategory == null)
                return NotFound();

            return Ok(existingCategory);
        }


        [HttpGet]
        public async Task<ActionResult<Category>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (categories, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (categories == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(categories);
        }
    }
}
