using Microsoft.AspNet.Builder;
using Microsoft.Framework.DependencyInjection;
using Microsoft.AspNet.Diagnostics;

namespace BaseAspNetApplication
{
	public class Startup
	{
		public void Configure(IApplicationBuilder app)
		{
			app.UseErrorPage(ErrorPageOptions.ShowAll);
			app.UseStaticFiles();
		}
	}
}