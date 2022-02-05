using System;
using System.IO;
using System.Text.Json.Serialization;
using Bup.Infrastructure.DbContext;
using Bup.WebApp.Configurations;
using Bup.WebApp.Core.Middlewares;
using Hellang.Middleware.ProblemDetails;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Polly;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
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
                options.Filters.Add(new ProducesAttribute("application/json"));
            }).AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });;
            
            services.ConfigureProblemDetails();
            
            services.RegisterConfigurations(Configuration);
            services.ConfigureDatabase(Configuration);
            services.RegisterServices();
            
            services.AddAutoMapper(typeof(Startup));
            
            services.AddHttpContextAccessor();
            
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo(){Title = "BUP API", Version = "v1"});
            });
            
            services.AddVersionedApiExplorer(o =>
            {
                o.GroupNameFormat = "'v'VVV";
                o.SubstituteApiVersionInUrl = true;   // this is needed to work
            });
            
            services.AddApiVersioning(v =>
            {
                v.ReportApiVersions = true;
                v.AssumeDefaultVersionWhenUnspecified = true;
                v.DefaultApiVersion = new ApiVersion(2, 0);
            });
            
            services.AddMvc(options => options.EnableEndpointRouting = false);
        }
        
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // swagger
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("v1/swagger.json", "BUP API v1");
            });

            app.UseProblemDetails();
            
            app.UseDefaultFiles();
            app.UseStaticFiles();
            
            // global cors policy
            app.UseCors(x =>
            {
                if (env.IsDevelopment())
                {
                    x.WithOrigins("http://localhost:3000");
                    x.WithOrigins("https://localhost:5001");
                }
                x.AllowAnyMethod()
                    .AllowAnyHeader();
            });
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            
            // custom jwt auth middleware
            app.UseMiddleware<JwtMiddleware>();
            
            app.MapWhen(x => x.Request.Path.Value.StartsWith("/api"), builder =>
            {
                app.UseMvc();
            });
            
            app.MapWhen(x => !x.Request.Path.Value.ToLower().StartsWith("/api"), builder =>
            {
                app.Run(async (context) =>
                {
                    var s=  context.Request.Path.Value.ToLower().StartsWith("/api");
                    context.Response.ContentType = "text/html";
                    context.Response.Headers[HeaderNames.CacheControl] = "no-store, no-cache, must-revalidate";
                    var filePath = Path.Combine(env.WebRootPath, "index.html");
                    await context.Response.SendFileAsync(filePath);
                });
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