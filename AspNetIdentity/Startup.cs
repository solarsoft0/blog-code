using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Identity;
using Microsoft.Data.Entity;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.ConfigurationModel;

using AspNetIdentity.Models;
using AspNetIdentity.Services;

namespace AspNetIdentity
{
    public class Startup
    {
        public Startup()
        {
            Configuration = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();
        }

        public IConfiguration Configuration
        {
            get;
            private set;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Entity Framework Service backed by SQL Server
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(Configuration.Get("Database:ConnectionString")));

            // Configure the identity service based on our configuration
            services.Configure<IdentityDbContextOptions>(options =>
            {
                options.DefaultAdminUserName = Configuration.Get("AdminUser:Username");
                options.DefaultAdminPassword = Configuration.Get("AdminUser:Password");
            });

            // Now add the entity framework backed identity service
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Configure the Email Service
            EmailService.Instance.SetConfiguration(Configuration);

            // ASP.NET MVC6 Service
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            // A 404 Error Page with useful information
            app.UseErrorPage(ErrorPageOptions.ShowAll);

            // Serve up the stuff in wwwroot
            app.UseStaticFiles();

            // Authentication and Authorization
            app.UseIdentity();

            // Configure ASP.NET MVC6
            app.UseMvc(routes =>
                {
                    routes.MapRoute(
                        name: "areaDefault",
                        template: "{area:exists}/{controller}/{action=Index}/{id?}");

                    routes.MapRoute(
                        name: "default",
                        template: "{controller=Home}/{action=Index}/{id?}"
                    );
                });

            // Create a default user
            IdentityDbOperations.InitializeIdentityDbAsync(app.ApplicationServices).Wait();
        }
    }
}
