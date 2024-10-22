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
    public class NurseryRepository : GenericRepository<Nursery>, INurseryRepository
    {
        private readonly AppDbContext context;

        public NurseryRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public override async Task<Nursery?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Nursery> query = context.Nurseries.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query
                    .Include(c => c.Sectors)
                    .Include(c => c.Categories)
                    .Include(c => c.Saplings);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<Nursery>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.Nurseries.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query
                     .Include(c => c.Sectors)
                     .Include(c => c.Categories);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }
    }
}
