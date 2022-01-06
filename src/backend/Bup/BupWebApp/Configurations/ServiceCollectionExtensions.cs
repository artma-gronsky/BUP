using System;
using System.Threading.Tasks;
using Bup.Infrastructure.DbContext;
using Bup.Infrastructure.Entities;
using Bup.Infrastructure.Repositories;
using Bup.WebApp.Configurations.Models;
using Bup.WebApp.Services;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Http;
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

        public static void ConfigureProblemDetails(this IServiceCollection services)
        {
            services.AddProblemDetails(c =>
            {
                c.Map<TaskCanceledException>(ex => new StatusCodeProblemDetails(StatusCodes.Status423Locked)
                    { Detail = ex.Message });
                c.Map<Exception>(ex => new StatusCodeProblemDetails(500));
            });
        }

    }
}