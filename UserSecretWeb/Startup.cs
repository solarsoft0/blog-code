using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.DependencyInjection;
using Microsoft.Framework.Runtime;

using UserSecretWeb.Settings;

namespace UserSecretWeb
{
    public class Startup
    {
        public Startup(IHostingEnvironment env, IApplicationEnvironment appEnv)
        {
            var configBuilder = new ConfigurationBuilder(appEnv.ApplicationBasePath);
            configBuilder.AddJsonFile("config.json", optional: true);
            configBuilder.AddJsonFile($"config.{env.EnvironmentName}.json", optional: true);
            configBuilder.AddEnvironmentVariables();

            Configuration = configBuilder.Build();
        }

        public IConfiguration Configuration
        {
            get;
            private set;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<Auth0Settings>(this.Configuration.GetConfigurationSection("Auth0"));

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseMvc();
        }
    }
}
