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
    public class SaplingsCategoryController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ISaplingsCategoryRepository repository;

        public SaplingsCategoryController(ISaplingsCategoryRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public async Task<ActionResult<SaplingsCategory>> Create(SaplingsCategoryModel saplingsCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newSaplingsCategory = new SaplingsCategory()
            {
                Name = saplingsCategory.Name,
                SaplingTypeId = saplingsCategory.SaplingTypeId
            };

            var createResult = await repository.AddAsync(newSaplingsCategory)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetSaplingsCategory", new { saplingsCategoryId = newSaplingsCategory.Id }, newSaplingsCategory);
        }


        [HttpPut("{saplingsCategoryId}")]
        public async Task<ActionResult<SaplingsCategory>> Update(Guid saplingsCategoryId, SaplingsCategoryModel saplingsCategory)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSaplingsCategory = await repository.GetAsync(saplingsCategoryId);

            if (existingSaplingsCategory != null)
            {
                var check = existingSaplingsCategory.Name == saplingsCategory.Name &&
                            existingSaplingsCategory.SaplingTypeId == saplingsCategory.SaplingTypeId;
                // تحقق من وجود تغييرات قبل التحديث
                if (check)
                {
                    return NoContent(); // لا توجد تغييرات
                }

                existingSaplingsCategory.Name = saplingsCategory.Name;
                existingSaplingsCategory.SaplingTypeId = saplingsCategory.SaplingTypeId;

                repository.Update(existingSaplingsCategory);
                await repository.SaveChangesAsync();

                return Ok(existingSaplingsCategory);
            }

            return NotFound();
        }


        [HttpDelete("{saplingsCategoryId}")]
        public async Task<ActionResult<SaplingsCategory>> Delete(Guid saplingsCategoryId)
        {
            var existingSaplingsCategory = await repository.GetAsync(saplingsCategoryId);

            if (existingSaplingsCategory != null)
            {
                await repository.DeleteAsync(saplingsCategoryId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{saplingsCategoryId}", Name = "GetSaplingsCategory")]
        public async Task<ActionResult<SaplingsCategory>> Get(Guid saplingsCategoryId)
        {
            var existingSaplingsCategory = await repository.GetAsync(saplingsCategoryId, false);

            if (existingSaplingsCategory == null)
                return NotFound();

            return Ok(existingSaplingsCategory);
        }


        [HttpGet]
        public async Task<ActionResult<SaplingsCategory>> GetAll(int pageNumber = 1, int pageSize = 10)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (saplingsCategorys, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize);

            if (saplingsCategorys == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(saplingsCategorys);
        }
    }
}
