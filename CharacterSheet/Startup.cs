using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.AspNet.Identity;
using Microsoft.Data.Entity;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;

using CharacterSheet.Models;
using CharacterSheet.Services;

namespace CharacterSheet
{
    /// <summary>
    /// ASP.NET Web Application Initialization and Configuration
    /// </summary>
    public class Startup
    {
        private static AppLogger logger = new AppLogger(typeof(Startup).Name);

        /// <summary>
        /// Constructor - read in the configuration file
        /// </summary>
        public Startup()
        {
            logger.Trace("Initializing Startup");

            logger.Trace("Loading config.json and env. variables");
            // Read in the configuration file
            var config = new Configuration()
                .AddJsonFile("config.json")
                .AddEnvironmentVariables();

            // WebConfiguration is a single instance version of the config.json
            // file.  This sets it up.
            logger.Trace("Initializing WebConfiguration");
            WebConfiguration.Instance.SetConfiguration(config);
        }

        /// <summary>
        /// Configure the ASP.NET Services
        /// </summary>
        /// <param name="services">The Service Collection</param>
        public void ConfigureServices(IServiceCollection services)
        {
            logger.Trace("Entering ConfigureServices");

            // Configure the Entity Framework to use our SQL Server
            logger.Trace("Configuring Entity Framework");
            services.AddEntityFramework()
                .AddSqlServer()
                .AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(WebConfiguration.Instance.DatabaseConnectionString));

            // Configure ASP.NET Identity Framework to use Entity Framework
            logger.Trace("Configuring ASP.NET Identity Framework");
            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Use MVC Routing
            logger.Trace("Configuring ASP.NET MVC6");
            services.AddMvc();

            // Add in a transient Razor Service for UserProfile lookup
            logger.Trace("Adding Transient Service for User Profile");
            services.AddTransient<UserProfile>();

            logger.Trace("Leaving ConfigureServices");
        }

        /// <summary>
        /// Configure the ASP.NET Application
        /// </summary>
        /// <param name="app">The Application Builder</param>
        public void Configure(IApplicationBuilder app)
        {
            logger.Trace("Entering Configure");

            if (WebConfiguration.Instance.DevelopmentMode)
            {
                logger.Trace("Enabling Development Mode");
                app.UseErrorPage(ErrorPageOptions.ShowAll);
                app.UseBrowserLink();
            }

            // Serve up the stuff in wwwroot
            logger.Trace("Adding Static Files Serving");
            app.UseStaticFiles();

            // Add in ASP.NET Identity Framework
            logger.Trace("Adding ASP.NET Identity Framework");
            app.UseIdentity();

            // Configure the ASP.NET MVC6 routes
            logger.Trace("Adding ASP.NET MVC6");
            app.UseMvc(routes =>
            {
                routes.MapRoute(name: "default",
                    template: "{area=Main}/{controller=Home}/{action=Index}/{id?}");
            });

            // Initialize the Application database
            logger.Trace("Initializing the Database");
            ApplicationDbContext.InitializeDatabaseAsync(app.ApplicationServices).Wait();
        }
    }
}
