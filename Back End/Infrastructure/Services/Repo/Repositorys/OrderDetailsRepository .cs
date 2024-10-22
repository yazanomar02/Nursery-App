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
    public class OrderDetailsRepository : GenericRepository<OrderDetails>, IOrderDetailsRepository
    {
        private readonly AppDbContext context;

        public OrderDetailsRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public override async Task<OrderDetails?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<OrderDetails> query = context.OrdersDetails.Where(c => c.Id == id && c.IsActive);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<OrderDetails>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.OrdersDetails.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }
    }
}
