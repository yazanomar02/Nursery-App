using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly IOrderRepository repository;
        private readonly IOrderDetailsRepository orderDetailsRepository;

        public OrderController(IOrderRepository repository ,
            IOrderDetailsRepository orderDetailsRepository )
        {
            this.repository = repository;
            this.orderDetailsRepository = orderDetailsRepository;
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Create(OrderModelForCreate order , int disCount = 0)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var newOrder = await repository.CreateOrder(order , disCount);
            return CreatedAtRoute("GetOrder", new { orderId = newOrder.Id }, newOrder);
        }


        [HttpPut("{orderId}")]
        public async Task<ActionResult<Order>> Update(Guid orderId, OrderModel order)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingOrder = await repository.GetAsync(orderId);

            if (existingOrder != null)
            {
                var check = existingOrder.DateOrder == order.DateOrder &&
                            existingOrder.AfterDisCount == order.AfterDisCount &&
                            existingOrder.TotalPrice == order.TotalPrice;
                            
                if (check)
                {
                    return NoContent();
                }

                existingOrder.AfterDisCount = order.AfterDisCount;
                existingOrder.TotalPrice = order.TotalPrice;
                existingOrder.DateOrder = order.DateOrder;

                repository.Update(existingOrder);
                await repository.SaveChangesAsync();

                return Ok(existingOrder);
            }

            return NotFound();
        }


        [HttpDelete("{orderId}")]
        public async Task<ActionResult<Order>> Delete(Guid orderId)
        {
            var existingOrder = await repository.GetAsync(orderId);

            if (existingOrder != null)
            {
                await repository.DeleteAsync(orderId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{orderId}", Name = "GetOrder")]
        public async Task<ActionResult<Order>> Get(Guid orderId, bool isInclude = false)
        {
            var existingOrder = await repository.GetAsync(orderId, isInclude);

            if (existingOrder == null)
                return NotFound();

            return Ok(existingOrder);
        }


        [HttpGet]
        public async Task<ActionResult<Order>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (orders, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (orders == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(orders);
        }
    }
}
