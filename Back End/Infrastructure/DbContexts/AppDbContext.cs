using Application.Domain.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic.FileIO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DbContexts
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {
            
        }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CartItem>()
                .Property(c => c.RowVersion)
                .IsRowVersion();
            modelBuilder.Entity<Sapling>()
                 .HasOne(s => s.Nursery)
                 .WithMany(n => n.Saplings)
                 .HasForeignKey(s => s.NurseryId)
                 .OnDelete(DeleteBehavior.Restrict);
        }
        public static void CreateAdmin(AppDbContext context , User user)
        {
            //  الى القاعدة في حال كانت فارغة قاعدة البيانات Attachment اضافة 
            if (!context.Users.Any(a => a.Role == "admin"))
            {
                //context.Users.Add(new User () { Email = "admin@gmail.com" , FullName ="ADMIN" , Password="P@ssword" , Role = "admin",IsDeleted = false  });
                if(user is not null)
                {
                    context.Users.Add(user);
                    context.SaveChanges();
                }
            }
        }

        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    optionsBuilder.UseSqlServer("Data Source = (localdb)\\MSSQLLocalDB; Initial Catalog = DB-Nursery-App");
        //}
        public DbSet<Category> Categories { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Nursery> Nurseries { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetails> OrdersDetails { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<Sapling> Saplings { get; set; }
        public DbSet<Supplier> Suppliers { get; set; }
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; }
        public DbSet<SaplingsCategory> SaplingsCategories { get; set; }
        public DbSet<Sector> Sectors { get; set; }
        public DbSet<SaplingType> SaplingTypes { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
