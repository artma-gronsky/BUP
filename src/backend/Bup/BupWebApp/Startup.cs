using System;
using System.Text.Json.Serialization;
using Bup.Infrastructure.DbContext;
using Bup.WebApp.Configurations;
using Bup.WebApp.Core.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Polly;
using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;


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
            services.AddControllers(options =>
            {
                // options.Filters.Add<ValidationModelAttribute>();
                // options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ServiceStatusCodeProblemDetails), StatusCodes.Status401Unauthorized));
                // options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ServiceStatusCodeProblemDetails), StatusCodes.Status422UnprocessableEntity));
                // options.Filters.Add(new ProducesResponseTypeAttribute(typeof(ServiceStatusCodeProblemDetails), StatusCodes.Status424FailedDependency));
                options.Filters.Add(new ProducesAttribute("application/json"));
            }).AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });;
            
            services.RegisterConfigurations(Configuration);
            services.ConfigureDatabase(Configuration);
            services.RegisterServices();
            
            services.AddAutoMapper(typeof(Startup));
            
            services.AddHttpContextAccessor();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo(){Title = "BUP API", Version = "v1"});
            });
            
            
            services.AddApiVersioning(v =>
            {
                v.ReportApiVersions = true;
                v.AssumeDefaultVersionWhenUnspecified = true;
                v.DefaultApiVersion = new ApiVersion(1, 0);
            });
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // if (env.IsDevelopment())
            // {
            //     app.UseDeveloperExceptionPage();
            // }

            // swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("v1/swagger.json", "BUP API v1");
            });

            app.UseRouting();

            // global cors policy
            app.UseCors(x => x
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();

            app.UseRouting();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            
            InitializeDatabase(app);
        }
        
        protected virtual void InitializeDatabase(IApplicationBuilder app)
        {
            var retryOnFailPolicy = Policy.Handle<Exception>().WaitAndRetry(3, _ => TimeSpan.FromSeconds(10));

            retryOnFailPolicy.Execute(app.MigrateDbContext<BupDbContext>);
        }
    }
}