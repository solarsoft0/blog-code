using Microsoft.AspNet.Mvc;

using CharacterSheet.Services;

namespace CharacterSheet.Areas.Main.Controllers
{
    [Area("Main")]
    [Authorize]
    public class HomeController : Controller
    {
        private static AppLogger logger = new AppLogger(typeof(HomeController).FullName);

        [HttpGet]
        public IActionResult Index()
        {
            logger.Trace("{0} {1}", Request.Method, Request.Path.Value);

            return View();
        }
    }
}
