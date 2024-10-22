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
    public class SaplingTypeRepository : GenericRepository<SaplingType>, ISaplingTypeRepository
    {
        private readonly AppDbContext context;

        public SaplingTypeRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }

        public override async Task<SaplingType?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<SaplingType> query = context.SaplingTypes.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.Saplings);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<SaplingType>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.SaplingTypes.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.Saplings);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }
    }
}
