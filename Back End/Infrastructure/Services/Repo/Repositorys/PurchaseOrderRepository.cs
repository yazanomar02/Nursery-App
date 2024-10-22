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
    public class PurchaseOrderRepository : GenericRepository<PurchaseOrder> , IPurchaseOrderRepository
    {
        private readonly AppDbContext context;
        private readonly ISaplingRepository saplingRepository;

        public PurchaseOrderRepository(AppDbContext context , ISaplingRepository saplingRepository) : base(context)
        {
            this.context = context;
            this.saplingRepository = saplingRepository;
        }

        public override async Task<PurchaseOrder?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<PurchaseOrder> query = context.PurchaseOrders.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.OrderDetails);
            }

            return await query.FirstOrDefaultAsync();
        }
        public async Task<(IList<PurchaseOrder>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.PurchaseOrders.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.OrderDetails);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }
    }
}
