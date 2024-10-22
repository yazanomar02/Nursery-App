using Application.Domain.Models;
using Infrastructure.DbContexts;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys
{
    public class GenericRepository<T> : IRepository<T> where T : class
    {
        private readonly AppDbContext context;

        public GenericRepository(AppDbContext context)
        {
            this.context = context;
        }


        public virtual async Task<T>? AddAsync(T entity)
        {
            var NewEntity = await context.AddAsync(entity);
            return NewEntity.Entity;
        }

        public virtual async Task<T?> GetAsync(Guid id, bool isInclude = false)
        {
            return await context.FindAsync<T>(id);
        }
        /*
        public virtual async Task<(IList<Company>, PaginationMetaData)> GetAllAsync(int pageNumber = 1, int pageSize = 10, bool isInclude = false)
        {
            return (null, null);
        }
        */
        public async Task<int> SaveChangesAsync()
        {
            return await context.SaveChangesAsync();
        }

        public T Update(T entity)
        {
            return context.Update(entity).Entity;
        }

        public async Task<bool> ExistsAsync(Guid id)
        {
            return await context.Set<T>().FindAsync(id) != null;
        }

        public virtual async Task<T?> DeleteAsync(Guid id)
        {
            var entity = await context.FindAsync<T>(id);
            if (entity == null)
                return null;

            // التأكد من أن الكيان يحتوي على prop IsActive
            if (typeof(T).GetProperty("IsActive") != null)
            {
                typeof(T).GetProperty("IsActive")?.SetValue(entity, false);
            }

            context.Update(entity);
            await context.SaveChangesAsync();
            return entity;
        }
    }
}
