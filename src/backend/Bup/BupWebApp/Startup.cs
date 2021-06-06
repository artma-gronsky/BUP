using System;
using Bup.Infrastructure.DbContext;
using Bup.WebApp.Configurations;
using Bup.WebApp.Core.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Polly;

namespace Bup.WebApp
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.RegisterConfigurations(Configuration);
            services.ConfigureDatabase(Configuration);
            services.RegisterServices();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            
            // global cors policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
            
            InitializeDatabase(app);
        }
        
        protected virtual void InitializeDatabase(IApplicationBuilder app)
        {
            var retryOnFailPolicy = Policy.Handle<Exception>().WaitAndRetry(3, _ => TimeSpan.FromSeconds(10));

            retryOnFailPolicy.Execute(app.MigrateDbContext<BupDbContext>);
        }
    }
}