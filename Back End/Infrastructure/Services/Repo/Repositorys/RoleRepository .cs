//using Application.Domain.Models.Identity;
//using Infrastructure.DbContexts;
//using Infrastructure.Services.Repo.Repositorys.Interfaces;
//using Microsoft.EntityFrameworkCore;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Infrastructure.Services.Repo.Repositorys
//{
//    public class RoleRepository : IRoleRepository
//    {
//        private readonly UsersDbContext _context;

//        public RoleRepository(UsersDbContext context)
//        {
//            _context = context;
//        }

//        public async Task<IEnumerable<AspNetRole>> GetAllAsync()
//        {
//            return await _context.AspNetRoles.ToListAsync();
//        }

//        public async Task<AspNetRole> GetByIdAsync(string id)
//        {
//            return await _context.AspNetRoles.FindAsync(id);
//        }

//        public async Task AddAsync(AspNetRole entity)
//        {
//            await _context.AspNetRoles.AddAsync(entity);
//            await _context.SaveChangesAsync();
//        }

//        public async Task UpdateAsync(AspNetRole entity)
//        {
//            _context.AspNetRoles.Update(entity);
//            await _context.SaveChangesAsync();
//        }

//        public async Task DeleteAsync(AspNetRole entity)
//        {
//            _context.AspNetRoles.Remove(entity);
//            await _context.SaveChangesAsync();
//        }

//        public async Task<bool> ExistsAsync(string id)
//        {
//            return await _context.AspNetRoles.AnyAsync(e => e.Id == id);
//        }
//    }

//}
