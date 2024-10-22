using Application.Domain.Models;
using Infrastructure.DbContexts;
using Infrastructure.Services.Repo.Repositorys.Interfaces;
using Infrastructure.ViewModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Infrastructure.Services.Repo.Repositorys
{
    public class CartRepository : GenericRepository<Cart>, ICartRepository
    {
        private readonly AppDbContext context;
        private readonly IOrderRepository orderRepository;

        public CartRepository(AppDbContext context, IOrderRepository orderRepository) : base(context)
        {
            this.context = context;
            this.orderRepository = orderRepository; // حقن OrderRepository
        }


        public async Task<Order> ConfirmOrder(/*Guid userId,*/ Guid cartId, int discount = 0)
        {
            // الحصول على العربة مع تفاصيل العناصر
            var cart = context.Carts
                .Include(c => c.CartItems)
                .FirstOrDefault(c => c.Id == cartId);

            if (cart == null) throw new Exception("Cart not found");

            // بناء OrderModelForCreate بناءً على عناصر السلة
            var orderModel = new OrderModelForCreate
            {
                //CustomerId = cart.CustomerId,
                UserId = cart.UserId,
                DateOrder = DateTime.Now,
                /*NurseryId = nurseryId,*/
                OrderDetails = cart.CartItems.Select(ci => new OrderDetailsForCreate
                {
                    SaplingId = ci.SaplingId,
                    Quantity = ci.Quantity
                }).ToList()
            };

            // إنشاء الطلب باستخدام OrderRepository
            var order = await orderRepository.CreateOrder(orderModel, discount);

            // بعد التأكيد يمكن إفراغ العربة
            cart.CartItems.Clear();
            context.SaveChanges();

            return order;
        }
        // دالة لإنشاء أو تحديث العربة


        public Cart CreateOrUpdate(Guid? cartId, Guid userId, Guid saplingId, int quantity = 1)
        {
            Cart? cart;
            var user = context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }

            if (cartId == null)
            {
                cart = new Cart
                {
                    DateCreated = DateTime.Now,
                    CartItems = new List<CartItem>(),
                    UserId = userId,
                    User = user
                };

                context.Carts.Add(cart);
            }
            else
            {
                cart = context.Carts
                        .Include(c => c.CartItems)
                        .FirstOrDefault(c => c.Id == cartId);

                if (cart == null) throw new Exception("Cart not found");
            }

            var existingCartItem = cart.CartItems.FirstOrDefault(ci => ci.SaplingId == saplingId);

            if (existingCartItem != null)
            {
                existingCartItem.IsActive = true;
                // Update the quantity
                existingCartItem.Quantity += quantity;
                context.Entry(existingCartItem).State = EntityState.Modified;
            }
            else
            {
                // Add new cart item
                var sapling = context.Saplings
                                    .FirstOrDefault(s => s.Id == saplingId && s.IsActive);
                if (sapling == null) throw new Exception("Sapling not found or inactive");

                var newCartItem = new CartItem
                {
                    SaplingId = saplingId,
                    Quantity = quantity,
                    Price = sapling.SellPrice,
                    CartId = cart.Id,
                    IsActive = true
                };

                cart.CartItems.Add(newCartItem);
                context.Entry(newCartItem).State = EntityState.Added;
            }

            context.SaveChanges();


            return cart;
        }




        public Cart GetCartWithDetails(Guid cartId)
        {
            return context.Carts
                .Include(c => c.CartItems.Where(s => s.IsActive))
                .ThenInclude(ci => ci.Sapling)
                .FirstOrDefault(c => c.Id == cartId && c.IsActive) ?? throw new Exception("Cart not found");
        }
        public void DeleteCartItem(Guid cartItemId)
        {
            var cartItem = context.CartItems.FirstOrDefault(c => c.Id == cartItemId);
            if (cartItem is not null)
            {
                cartItem.IsActive = false;
                context.Update(cartItem);
                context.SaveChanges();
            }
        }
        // دالة مفترضة للحصول على معرف العميل الحالي (يمكن تخصيصها حسب النظام الخاص بك)
        private Guid GetCurrentCustomerId()
        {
            // هنا يمكن وضع منطق الحصول على العميل الحالي، مثلًا من الـ HttpContext أو session
            return Guid.NewGuid(); // هذا مجرد مثال
        }
    }

}
