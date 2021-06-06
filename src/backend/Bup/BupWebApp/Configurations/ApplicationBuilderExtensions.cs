using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Npgsql;

namespace Bup.WebApp.Configurations
{
    public static class ApplicationBuilderExtensions
    {
        public static void MigrateDbContext<TContext>(this IApplicationBuilder applicationBuilder)
            where TContext : DbContext
        {
            using var scope = applicationBuilder.ApplicationServices.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<TContext>().Database;
            db.Migrate();

            using var connection = (NpgsqlConnection) db.GetDbConnection();
            connection.Open();
            connection.ReloadTypes();
        }
    }
}