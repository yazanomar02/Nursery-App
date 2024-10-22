using Application.Domain.Models;
using Infrastructure.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys.Interfaces
{
    public interface ICartRepository : IRepository<Cart>
    {
        Cart CreateOrUpdate(Guid? carteId, Guid userId,Guid saplingId, int Quantity = 1);
        Cart GetCartWithDetails(Guid cartId);
        Task<Order> ConfirmOrder(/*Guid nurseryId,*/ Guid cartId, int discount = 0);
        void DeleteCartItem(Guid cartItemId);

    }
}
