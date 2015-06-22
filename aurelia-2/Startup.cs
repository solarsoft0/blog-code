using aurelia_2.Settings;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Diagnostics;
using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.DependencyInjection;

namespace aurelia_2
{
    public class Startup
    {
        /// <summary>
        /// Constructor - load the configuration files and store in the
        /// static area.
        /// </summary>
        public Startup()
        {
            Configuration = new Configuration()
                .AddJsonFile("config.json", optional: true)
                .AddJsonFile("config-local.json", optional: true)
                .AddEnvironmentVariables();
        }

        #region Application Configuration
        /// <summary>
        /// Static Configuration Details
        /// </summary>
        public static IConfiguration Configuration {
            get;
            private set;
        }
        #endregion

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<Auth0Settings>(Configuration.GetSubKey("Auth0"));
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseErrorPage(ErrorPageOptions.ShowAll);
            app.UseStaticFiles();
            app.UseMvc();

        }
    }
}
