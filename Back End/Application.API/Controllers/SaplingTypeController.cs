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
    public class SaplingTypeController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ISaplingTypeRepository repository;

        public SaplingTypeController(ISaplingTypeRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public async Task<ActionResult<SaplingType>> Create(SaplingTypeModel saplingType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newSaplingType = new SaplingType()
            {
                Name = saplingType.Name,
                Description = saplingType.Description,
                CategoryId = saplingType.CategoryId
            };

            var createResult = await repository.AddAsync(newSaplingType)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetSaplingType", new { saplingTypeId = newSaplingType.Id }, newSaplingType);
        }


        [HttpPut("{saplingTypeId}")]
        public async Task<ActionResult<SaplingType>> Update(Guid saplingTypeId, SaplingTypeModel saplingType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSaplingType = await repository.GetAsync(saplingTypeId);

            if (existingSaplingType != null)
            {
                var check = existingSaplingType.Name == saplingType.Name &&
                            existingSaplingType.Description == saplingType.Description &&
                            existingSaplingType.CategoryId == saplingType.CategoryId;
                // تحقق من وجود تغييرات قبل التحديث
                if (check)
                {
                    return NoContent(); // لا توجد تغييرات
                }

                existingSaplingType.Name = saplingType.Name;
                existingSaplingType.Description = saplingType.Description;
                existingSaplingType.CategoryId = saplingType.CategoryId;

                repository.Update(existingSaplingType);
                await repository.SaveChangesAsync();

                return Ok(existingSaplingType);
            }

            return NotFound();
        }


        [HttpDelete("{saplingTypeId}")]
        public async Task<ActionResult<SaplingType>> Delete(Guid saplingTypeId)
        {
            var existingSaplingType = await repository.GetAsync(saplingTypeId);

            if (existingSaplingType != null)
            {
                await repository.DeleteAsync(saplingTypeId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{saplingTypeId}", Name = "GetSaplingType")]
        public async Task<ActionResult<SaplingType>> Get(Guid saplingTypeId, bool isInclude = false)
        {
            var existingSaplingType = await repository.GetAsync(saplingTypeId, isInclude);

            if (existingSaplingType == null)
                return NotFound();

            return Ok(existingSaplingType);
        }


        [HttpGet]
        public async Task<ActionResult<Customer>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (saplingtypes, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (saplingtypes == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(saplingtypes);
        }
    }
}
