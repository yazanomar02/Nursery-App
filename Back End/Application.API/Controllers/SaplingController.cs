using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using static System.Net.Mime.MediaTypeNames;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaplingController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ISaplingRepository repository;
        private readonly IWebHostEnvironment hostingEnvironment;
        private readonly string _storagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        public SaplingController(ISaplingRepository repository, IWebHostEnvironment hostingEnvironment)
        {
            this.repository = repository;
            this.hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Sapling>> Create(SaplingModel sapling)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newBarCode = repository.GenerateBarCode();
            var newSapling = new Sapling()
            {
                //Name = sapling.Name,
                BarCode = newBarCode,
                BirthDate = sapling.BirthDate,
                SellDate = sapling.SellDate,
                BuyPrice = sapling.BuyPrice,
                SellPrice = sapling.SellPrice,
                Amount = sapling.Amount,
                IsImported = sapling.IsImported,
                SaplingsCategoryId = sapling.SaplingsCategoryId,
                SaplingImage = null,
                NurseryId  = sapling.NurseryId,
            };

            if (sapling.saplingImage != null)
            {
                // تعديل اسم الصورة باستخدام أول 5 أحرف من Id أو يمكنك تغيير العدد حسب الحاجة
                var saplingIdPart = newSapling.Id.ToString().Substring(0, 5);
                var fileExtension = Path.GetExtension(sapling.saplingImage.FileName);
                var newFileName = $"{saplingIdPart}_{fileExtension}";

                var filePath = Path.Combine(
                    hostingEnvironment.WebRootPath, // للحصول على مسار wwwroot الفعلي
                    "uploads", // مجلد uploads
                    "images",  // مجلد images
                    newFileName // اسم الملف الجديد
                );

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await sapling.saplingImage.CopyToAsync(stream);
                }

                // بناء URL للصورة
                var imageUrl = $"{Request.Scheme}://{Request.Host}/uploads/images/{newFileName}";

                newSapling.SaplingImage = imageUrl; // حفظ URL الصورة في قاعدة البيانات
            }

            var createResult = await repository.AddAsync(newSapling)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetSapling", new { saplingId = newSapling.Id }, newSapling);
        }

        [HttpPut("{saplingId}")]
        public async Task<ActionResult<Sapling>> Update(Guid saplingId, SaplingModel sapling)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingSapling = await repository.GetAsync(saplingId);

            if (existingSapling != null)
            {
                var check = existingSapling.BirthDate == sapling.BirthDate &&
                            existingSapling.SellDate == sapling.SellDate &&
                            existingSapling.SellPrice == sapling.SellPrice &&
                            existingSapling.BuyPrice == sapling.BuyPrice &&
                            existingSapling.Amount == sapling.Amount &&
                            existingSapling.IsImported == sapling.IsImported &&
                            existingSapling.SaplingsCategoryId == sapling.SaplingsCategoryId;
                // تحقق من وجود تغييرات قبل التحديث
                if (check)
                {
                    return NoContent(); // لا توجد تغييرات
                }

                existingSapling.BirthDate = sapling.BirthDate;
                existingSapling.SellPrice = sapling.SellPrice;
                existingSapling.BuyPrice = sapling.BuyPrice;
                existingSapling.Amount = sapling.Amount;
                existingSapling.SellDate = sapling.SellDate;
                existingSapling.IsImported = sapling.IsImported;
                existingSapling.SaplingsCategoryId = sapling.SaplingsCategoryId;

                repository.Update(existingSapling);
                await repository.SaveChangesAsync();

                return Ok(existingSapling);
            }

            return NotFound();
        }


        [HttpDelete("{saplingId}")]
        public async Task<ActionResult<Sapling>> Delete(Guid saplingId)
        {
            var existingSapling = await repository.GetAsync(saplingId);

            if (existingSapling != null)
            {
                await repository.DeleteAsync(saplingId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{saplingId}", Name = "GetSapling")]
        public async Task<ActionResult<Sapling>> Get(Guid saplingId, bool isInclude = false)
        {
            var existingSapling = await repository.GetAsync(saplingId, isInclude);

            if (existingSapling == null)
                return NotFound();

            return Ok(existingSapling);
        }


        [HttpGet]
        public async Task<ActionResult<Sapling>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false , Guid? NurseryId = null)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (Saplings, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (Saplings == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));
            if(NurseryId == null)
                return Ok(Saplings);
            else
            {
                var SaplingForNursery = Saplings.Where(s => s.NurseryId == NurseryId).ToList();
                return Ok(SaplingForNursery);
            }
        }
    }
}
