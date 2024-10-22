using Application.Domain.Models;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using System.Text.Json;

namespace Application.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly int maxPageSize = 10;
        private readonly ICustomerRepository repository;
        private readonly IUserRepository userRepository;

        public CustomerController(ICustomerRepository repository, IUserRepository userRepository)
        {
            this.repository = repository;
            this.userRepository = userRepository;
        }


        [HttpPost]
        public async Task<ActionResult<Customer>> Create(CustomerModel customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = userRepository.FindByEmail(customer.Email);

            if (user == null)
            {
                return BadRequest();
            }

            var newCustomer = new Customer()
            {
                Email = customer.Email,
                FullName = customer.FullName,
            };

            var createResult = await repository.AddAsync(newCustomer)!;

            if (createResult == null)
                return BadRequest();

            await repository.SaveChangesAsync();
            return CreatedAtRoute("GetCustomer", new { customerId = newCustomer.Id }, newCustomer);
        }


        [HttpPut("{customerId}")]
        public async Task<ActionResult<Customer>> Update(Guid customerId, CustomerModel customer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCustomer = await repository.GetAsync(customerId);

            if (existingCustomer != null)
            {
                if (existingCustomer.FullName == customer.FullName && existingCustomer.Email == customer.Email)
                {
                    return NoContent(); 
                }

                existingCustomer.FullName = customer.FullName;
                existingCustomer.Email = customer.Email;

                repository.Update(existingCustomer);
                await repository.SaveChangesAsync();

                return Ok(existingCustomer);
            }

            return NotFound();
        }


        [HttpDelete("{customerId}")]
        public async Task<ActionResult<Customer>> Delete(Guid customerId)
        {
            var existingCustomer = await repository.GetAsync(customerId);

            if (existingCustomer != null)
            {
                await repository.DeleteAsync(customerId);

                return NoContent();
            }

            return NotFound();
        }


        [HttpGet("{customerId}", Name = "GetCustomer")]
        public async Task<ActionResult<Customer>> Get(Guid customerId, bool isInclude = false)
        {
            var existingCustomer = await repository.GetAsync(customerId, isInclude);

            if (existingCustomer == null)
                return NotFound();

            return Ok(existingCustomer);
        }


        [HttpGet]
        public async Task<ActionResult<Customer>> GetAll(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            if (pageSize > maxPageSize)
                pageSize = maxPageSize;

            var (customers, paginationMetaData) = await repository.GetAllAsync(pageNumber, pageSize, isInclude);

            if (customers == null)
                return NotFound();

            Response.Headers.Add("X-Pagination", JsonSerializer.Serialize(paginationMetaData));

            return Ok(customers);
        }
    }
}
