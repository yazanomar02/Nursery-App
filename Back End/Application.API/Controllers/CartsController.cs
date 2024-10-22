using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartsController : ControllerBase
    {
        private readonly ICartRepository repository;
        private readonly IUserRepository userRepository;
        private readonly ICustomerRepository customerRepository;

        public CartsController(ICartRepository repository, IUserRepository userRepository, ICustomerRepository customerRepository)
        {
            this.repository = repository;
            this.userRepository = userRepository;
            this.customerRepository = customerRepository;
        }


        [HttpPost("{cartId}/{userId}/ConfirmOrder")]
        public async Task<IActionResult> ConfirmOrder(Guid userId, Guid cartId, int discount = 0)
        {
            try
            {
                var order = await repository.ConfirmOrder(cartId, discount);

                var user = userRepository.FindById(userId);


                if (user is not null)
                {
                    var customer = customerRepository.FindByEmail(user.Email);
                    if (customer is not null)
                    {
                        customer.Orders.Add(order);

                        customerRepository.Update(customer);
                        await customerRepository.SaveChangesAsync();
                    }

                    else
                    {
                        var newCustomer = new Customer()
                        {
                            Email = user.Email,
                            FullName = user.FullName,
                        };
                        newCustomer.Orders.Add(order);

                        await customerRepository.AddAsync(newCustomer);
                        await customerRepository.SaveChangesAsync();
                    }
                }

                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPost("AddItem")]
        public IActionResult AddItemToCart(Guid? cartId, Guid userId, Guid saplingId, int quantity = 1)
        {
            try
            {
                var cart = repository.CreateOrUpdate(cartId, userId, saplingId, quantity);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{cartId}")]
        public IActionResult GetCartDetails(Guid cartId)
        {
            try
            {
                var cart = repository.GetCartWithDetails(cartId);
                return Ok(cart); 
            }
            catch (Exception ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("RemoveItem/{cartId}/{cartItemId}")]
        public IActionResult RemoveItemFromCart(Guid cartId, Guid cartItemId)
        {
            try
            {
                var cart = repository.GetCartWithDetails(cartId);
                var item = cart.CartItems.FirstOrDefault(ci => ci.Id == cartItemId);
                if (item == null) return NotFound(new { message = "Item not found in cart" });

                repository.DeleteCartItem(cartItemId);
                cart.CartItems.FirstOrDefault(c => c.Id == cartItemId)!.IsActive = false;
                repository.Update(cart);
                return Ok(cart); 
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("ClearCart/{cartId}")]
        public IActionResult ClearCart(Guid cartId)
        {
            try
            {
                var cart = repository.GetCartWithDetails(cartId);
                cart.CartItems.Clear();
                repository.Update(cart);
                return Ok(new { message = "Cart cleared successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
