using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PurchaseOrdersController : ControllerBase
    {
        private readonly IPurchaseOrderRepository purchaseOrderRepository;
        private readonly ISaplingsCategoryRepository saplingsCategoryRepository;
        private readonly ISaplingRepository saplingRepository;

        public PurchaseOrdersController(IPurchaseOrderRepository purchaseOrderRepository ,
            ISaplingsCategoryRepository saplingsCategoryRepository,
            ISaplingRepository saplingRepository)
        {
            this.purchaseOrderRepository = purchaseOrderRepository;
            this.saplingsCategoryRepository = saplingsCategoryRepository;
            this.saplingRepository = saplingRepository;
        }

        [HttpPost]
        public async Task<ActionResult<PurchaseOrder>> CreatePurchaseOrder(PurchaseOrderModelForCreate order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newOrder = new PurchaseOrder()
            {
                DateOrder = order.DateOrder,
                IsActive = true,
                NurseryId = order.NurseryId,
                SupplierId = order.SupplierId,
                TotalPrice = 0 ,
            };
            var orderDetails = order.OrderDetails;
            decimal totalPrice = 0;

            foreach (var item in orderDetails)
            {
                var saplingsCategory = await saplingsCategoryRepository.GetAsync(item.SaplingsCategoryId);
                if (saplingsCategory == null)
                    return BadRequest();
                var sapling = new Sapling()
                {
                    Amount = item.Quantity,
                    BirthDate = item.BirthDate,
                    BuyPrice = item.BuyPrice,
                    IsActive = true,
                    IsImported = item.IsImported,
                    SaplingsCategoryId = item.SaplingsCategoryId,
                    SellPrice = item.SellPrice,
                    SellDate = item.SellDate,
                    BarCode = saplingRepository.GenerateBarCode()
                };
                await saplingRepository.AddAsync(sapling);
                totalPrice += item.BuyPrice * item.Quantity;
            }

            newOrder.TotalPrice = totalPrice;

            await purchaseOrderRepository.AddAsync(newOrder);


            return CreatedAtRoute("GetPurchaseOrder", new { orderId = newOrder.Id }, newOrder);
        }


        [HttpGet("{purchaseOrderId}", Name = "GetPurchaseOrder")]
        public async Task<ActionResult<PurchaseOrder>> GetPurchaseOrder(Guid purchaseOrderId)
        {
            var existingOrder = await purchaseOrderRepository.GetAsync(purchaseOrderId);

            if (existingOrder == null)
                return NotFound();

            return Ok(existingOrder);
        }
    }
}
