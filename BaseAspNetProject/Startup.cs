using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using Microsoft.AspNet.Diagnostics;

namespace $safeprojectname$
{
    public class Startup
    {
        // For more information on how to configure your application, 
        // visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
            // Add the MVC6 Service
            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app)
        {
            // Configure the error page to show useful information
            app.UseErrorPage(ErrorPageOptions.ShowAll);

            // Configure access to the wwwroot area
            app.UseStaticFiles();

            // We want to use BrowserLink
            app.UseBrowserLink();

            // Configure MVC6
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
