using Application.Domain.Models;
using Infrastructure.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys.Interfaces
{
    public interface IPurchaseOrderRepository : IRepository<PurchaseOrder>
    {
        Task<(IList<PurchaseOrder>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude);
    }
}
