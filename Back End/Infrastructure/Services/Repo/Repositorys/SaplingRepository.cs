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
    public class SaplingRepository : GenericRepository<Sapling>, ISaplingRepository
    {
        private readonly AppDbContext context;

        public SaplingRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public override async Task<Sapling?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Sapling> query = context.Saplings.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.Sectors);
            }

            return await query.FirstOrDefaultAsync();
        }
        public override async Task<Sapling>? AddAsync(Sapling sapling)
        {
            if (sapling == null || sapling.Amount <= 0) return null;
            var nursery = context.Nurseries.FirstOrDefault(n => n.Id == sapling.NurseryId);
            if (nursery == null) return null;
            sapling.Nursery = nursery;

            var sectors = await context.Sectors
                .Where(s => s.IsActive && s.CurrentQuantity < s.Capacity)
                .OrderBy(s => s.Number) // لترتيب القطاعات حسب رقم القطاع
                .ToListAsync();

            decimal remainingAmount = sapling.Amount;

            foreach (var sector in sectors)
            {
                int availableCapacity = sector.Capacity - sector.CurrentQuantity;

                if (availableCapacity > 0)
                {
                    decimal amountToAdd = Math.Min(remainingAmount, availableCapacity);

                    sector.CurrentQuantity += (int)amountToAdd;

                    sector.Saplings.Add(sapling);
                    sapling.Sectors.Add(sector);
                    context.Update(sector);
                    remainingAmount -= amountToAdd;

                    if (remainingAmount <= 0)
                        break;
                }
            }

            if (remainingAmount > 0)
            {
                return null;
            }
            sapling.Name = context.SaplingsCategories.FirstOrDefault(s => s.Id == sapling.SaplingsCategoryId).Name;
            await context.Saplings.AddAsync(sapling);

            try
            {
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // سجل رسالة الخطأ لفحصها
                Console.WriteLine(ex.Message);
                return null;
            }


            return sapling;
        }
 
        public override async Task<Sapling?> DeleteAsync(Guid id)
        {
            var sapling = await context.Saplings
                .Include(s => s.Sectors) 
                .FirstOrDefaultAsync(s => s.Id == id && s.IsActive);

            if (sapling == null)
            {
                return null; 
            }

            foreach (var sector in sapling.Sectors.ToList())
            {
                if (sector.CurrentQuantity > 0)
                {
                    sector.CurrentQuantity -= (int)sapling.Amount;
                    context.Update(sector);
                }
            }

            await context.SaveChangesAsync();

            sapling.IsActive = false;
            context.Update(sapling);
            await context.SaveChangesAsync();

            return sapling;
        }


        public async Task<(IList<Sapling>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.Saplings.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.Sectors);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }

        public string GenerateBarCode()
        {
            return Guid.NewGuid().ToString().Substring(0, 10);
        }
    }
}
