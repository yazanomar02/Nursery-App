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
    public class SectorController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ISectorRepository repository;

        public SectorController(ISectorRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public async Task<ActionResult<Sector>> Create(SectorModel sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newSector = new Sector()
            {
                Number = sector.Number,
                Capacity = sector.Capacity,
                NurseryId = sector.NurseryId,
                CurrentQuantity = 0

            };

            var createResult = await repository.AddAsync(newSector)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetSector", new { sectorId = newSector.Id }, newSector);
        }


        [HttpPut("{sectorId}")]
        public async Task<ActionResult<Sector>> Update(Guid sectorId, SectorModel sector)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSector = await repository.GetAsync(sectorId);

            if (existingSector != null)
            {
                var check = existingSector.Number == sector.Number &&
                            existingSector.Capacity == sector.Capacity &&   
                            existingSector.NurseryId == sector.NurseryId;
                // تحقق من وجود تغييرات قبل التحديث
                if (check)
                {
                    return NoContent(); // لا توجد تغييرات
                }

                existingSector.Number = sector.Number;
                existingSector.Capacity = sector.Capacity;
                existingSector.NurseryId = sector.NurseryId;

                repository.Update(existingSector);
                await repository.SaveChangesAsync();

                return Ok(existingSector);
            }

            return NotFound();
        }


        [HttpDelete("{sectorId}")]
        public async Task<ActionResult<Sector>> Delete(Guid sectorId)
        {
            var existingSector = await repository.GetAsync(sectorId);

            if (existingSector != null)
            {
                await repository.DeleteAsync(sectorId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{sectorId}", Name = "GetSector")]
        public async Task<ActionResult<Sector>> Get(Guid sectorId)
        {
            var existingSector = await repository.GetAsync(sectorId);

            if (existingSector == null)
                return NotFound();

            return Ok(existingSector);
        }


        [HttpGet]
        public async Task<ActionResult<Sector>> GetAll(int pageNumber = 1, int pageSize = 10)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (sectors, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize);

            if (sectors == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(sectors);
        }
    }
}
