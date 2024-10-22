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
    public class SaplingsCategoryRepository : GenericRepository<SaplingsCategory>, ISaplingsCategoryRepository
    {
        private readonly AppDbContext context;

        public SaplingsCategoryRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public override async Task<SaplingsCategory?> GetAsync(Guid id, bool IsInclude = false)
        {
            IQueryable<SaplingsCategory> query = context.SaplingsCategories.Where(c => c.Id == id && c.IsActive);

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<SaplingsCategory>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize)
        {
            var query = context.SaplingsCategories.Where(c => c.IsActive).AsQueryable();

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
