using Bup.Infrastructure.Entities;
using Bup.Infrastructure.EntityConfiguration;
using Microsoft.EntityFrameworkCore;

namespace Bup.Infrastructure.DbContext
{
    public class BupDbContext: Microsoft.EntityFrameworkCore.DbContext
    {

        public DbSet<User> Users { get; set; }

        public BupDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserConfiguration());
        }
    }
}