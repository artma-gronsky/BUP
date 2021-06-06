using Bup.Infrastructure.DbContext;
using Bup.Infrastructure.Entities;
using Bup.Infrastructure.Repositories;
using Bup.WebApp.Configurations.Models;
using Bup.WebApp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Bup.WebApp.Configurations
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterConfigurations(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AuthSettings>(configuration.GetSection(nameof(AuthSettings)));
        }

        public static void RegisterServices(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
        }
        
        public static void ConfigureDatabase(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<BupDbContext>((provider, options) =>
            {
                options.UseNpgsql(configuration.GetConnectionString("BupDb"));
            }, ServiceLifetime.Scoped, ServiceLifetime.Singleton);

            services.AddScoped<IBaseGenericRepository<User>, BaseGenericRepository<User>>();

        }

    }
}