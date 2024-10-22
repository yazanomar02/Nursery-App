﻿using Application.Domain.Models;
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
    public class SupplierRepository : GenericRepository<Supplier> , ISupplierRepository
    {
        private readonly AppDbContext context;

        public SupplierRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }

        public override async Task<Supplier?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Supplier> query = context.Suppliers.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.Orders);
            }

            return await query.FirstOrDefaultAsync();
        }

        public async Task<(IList<Supplier>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.Suppliers.Where(c => c.IsActive).AsQueryable();

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
    }
}