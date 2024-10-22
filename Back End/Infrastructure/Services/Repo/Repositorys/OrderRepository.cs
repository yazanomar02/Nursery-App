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
    public class OrderRepository : GenericRepository<Order>, IOrderRepository
    {
        private readonly AppDbContext context;

        public OrderRepository(AppDbContext context) : base(context)
        {
            this.context = context;
        }
        public override async Task<Order?> GetAsync(Guid id, bool isInclude = false)
        {
            IQueryable<Order> query = context.Orders.Where(c => c.Id == id && c.IsActive);

            if (isInclude)
            {
                query = query.Include(c => c.OrderDetails);
            }

            return await query.FirstOrDefaultAsync();
        }
        public async Task<(IList<Order>, PaginationMetaData)> GetAllAsync(int pageNumber, int pageSize, bool isInclude)
        {
            var query = context.Orders.Where(c => c.IsActive).AsQueryable();

            var totalItemCount = await query.CountAsync();
            var paginationdata = new PaginationMetaData(totalItemCount, pageSize, pageNumber);

            if (isInclude)
                query = query.Include(c => c.OrderDetails);

            var all = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (all, paginationdata);
        }


        public async Task<Order> CreateOrder(OrderModelForCreate order, int disCount = 0)
        {
            var newOrder = new Order()
            {
                AfterDisCount = 0,
                //CustomerId = order.CustomerId,
                UserId = order.UserId,
                DateOrder = order.DateOrder,
                IsActive = true,
                /*NurseryId = order.NurseryId,*/
                TotalPrice = 0,
            };

            var listOfOrderDetails = new List<OrderDetails>();
            decimal totalPrice = 0;
            foreach (var item in order.OrderDetails)
            {
                var sapling = context.Saplings.FirstOrDefault(s => s.Id == item.SaplingId && s.IsActive);
                if (sapling == null)
                {
                    return null; 
                }

                var sectors = context.Sectors.Where(c => c.Saplings.Any(ss => ss.Id == item.SaplingId));

                var od = new OrderDetails()
                {
                    IsActive = true,
                    OrderId = newOrder.Id,
                    Order = newOrder,
                    Price = sapling.SellPrice * item.Quantity,
                    Quantity = item.Quantity,
                    SaplingId = item.SaplingId
                };
                totalPrice += od.Price;
                listOfOrderDetails.Add(od);

                sapling.Amount -= od.Quantity;
                foreach (var sector in sectors)
                {
                    if (sector.CurrentQuantity >= od.Quantity)
                    {
                        sector.CurrentQuantity -= od.Quantity;
                        od.Quantity = 0;
                    }
                    else if(sector.CurrentQuantity < od.Quantity) 
                    {
                        var newOdQuantity = od.Quantity - sector.CurrentQuantity;
                        sector.CurrentQuantity = 0;
                        od.Quantity = newOdQuantity;
                    }    
                }
            }

            newOrder.OrderDetails = listOfOrderDetails;
            if (disCount > 0)
                newOrder.AfterDisCount = totalPrice - (totalPrice * (disCount / 100));
            else
                newOrder.AfterDisCount = totalPrice;

            newOrder.TotalPrice = totalPrice;
            context.Orders.Add(newOrder);

            context.SaveChanges();

            return newOrder;
        }

    }
}
