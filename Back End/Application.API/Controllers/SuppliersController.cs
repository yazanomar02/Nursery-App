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
    public class SuppliersController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ISupplierRepository repository;

        public SuppliersController(ISupplierRepository repository)
        {
            this.repository = repository;
        }


        [HttpPost]
        public async Task<ActionResult<Supplier>> Create(SupplierModel supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newSupplier = new Supplier()
            {
                Email = supplier.Email,
                PhoneNumber = supplier.PhoneNumber,
                Address = supplier.Address,
                FirstName = supplier.FirstName,
                LastName = supplier.LastName
            };

            var createResult = await repository.AddAsync(newSupplier)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetSupplier", new { supplierId = newSupplier.Id }, newSupplier);
        }


        [HttpPut("{supplierId}")]
        public async Task<ActionResult<Supplier>> Update(Guid supplierId, SupplierModel supplier)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSupplier = await repository.GetAsync(supplierId);

            if (existingSupplier != null)
            {
                // تحقق من وجود تغييرات قبل التحديث
                if (existingSupplier.FirstName == supplier.FirstName && existingSupplier.LastName == supplier.LastName)
                {
                    return NoContent(); // لا توجد تغييرات
                }

                existingSupplier.FirstName = supplier.FirstName;
                existingSupplier.LastName = supplier.LastName;

                repository.Update(existingSupplier);
                await repository.SaveChangesAsync();

                return Ok(existingSupplier);
            }

            return NotFound();
        }


        [HttpDelete("{supplierId}")]
        public async Task<ActionResult<Supplier>> Delete(Guid supplierId)
        {
            var existingSupplier = await repository.GetAsync(supplierId);

            if (existingSupplier != null)
            {
                await repository.DeleteAsync(supplierId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{supplierId}", Name = "GetSupplier")]
        public async Task<ActionResult<Supplier>> Get(Guid supplierId, bool isInclude = false)
        {
            var existingSupplier = await repository.GetAsync(supplierId, isInclude);

            if (existingSupplier == null)
                return NotFound();

            return Ok(existingSupplier);
        }


        [HttpGet]
        public async Task<ActionResult<Supplier>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (suppliers, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (suppliers == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(suppliers);
        }
    }
}
