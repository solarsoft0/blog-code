using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;
using TemplateStarterApp.Settings;

namespace TemplateStarterApp.Controllers
{
    public class HomeController : Controller
    {
        private DbSettings dbSettings = null;

        public HomeController(IOptions<DbSettings> dbSettings)
        {
            this.dbSettings = dbSettings.Options;
        }

        // GET: /<controller>/
        public IActionResult Index()
        {
            return View();
        }
    }
}
