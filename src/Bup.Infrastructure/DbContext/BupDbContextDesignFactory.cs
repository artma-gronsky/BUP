using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Bup.Infrastructure.DbContext
{
    public class BupDbContextDesignFactory: IDesignTimeDbContextFactory<BupDbContext>
    {
        public BupDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", false)
                .AddEnvironmentVariables()
                .Build();
            
            var connectionString = configuration.GetConnectionString("DevelopmentConnection");
                
            var optionsBuilder = new DbContextOptionsBuilder<BupDbContext>()
                .UseNpgsql(connectionString ?? "blank");
                
            return new BupDbContext(optionsBuilder.Options);
        }
    }
}