using Application.Domain.Models;
using Infrastructure.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys.Interfaces
{
    public interface IOrderDetailsRepository : IRepository<OrderDetails>
    {
        Task<(IList<OrderDetails>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude);
    }
}
