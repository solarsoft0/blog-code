using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;

namespace React_Demo
{
    public class Startup
    {
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app)
        {
            app.UseStaticFiles();
        }
    }
}
