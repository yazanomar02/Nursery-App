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
    public class CompanyRepository : GenericRepository<Company>, ICompanyRepository
    {
        private readonly AppDbContext context;

        public CompanyRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }

        public override async Task<Company?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Company> query = context.Companies.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.Nurseries);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<Company>, PaginationMetaData)> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            var query = context.Companies.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.Nurseries);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }
    }
}
