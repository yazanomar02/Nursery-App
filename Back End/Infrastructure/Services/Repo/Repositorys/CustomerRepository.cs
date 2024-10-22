using Application.Domain.Models;
using Infrastructure.DbContexts;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys
{
    public class CustomerRepository : GenericRepository<Customer>, ICustomerRepository
    {
        private readonly AppDbContext context;

        public CustomerRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }

        public override async Task<Customer?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Customer> query = context.Customers.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.Orders);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<Customer>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.Customers.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.Orders);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }


        public Customer FindByEmail(string email)
        {
            return context.Customers.FirstOrDefault(c => c.Email == email);
        }
    }
}
