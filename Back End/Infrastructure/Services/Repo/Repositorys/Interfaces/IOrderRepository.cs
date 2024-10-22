using Application.Domain.Models;
using Infrastructure.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys.Interfaces
{
    public interface IOrderRepository : IRepository<Order>
    {
        Task<(IList<Order>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude);
        Task<Order> CreateOrder(OrderModelForCreate order , int disCount);
    }
}
