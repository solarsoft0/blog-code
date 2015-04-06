using Microsoft.AspNet.Mvc;

using CharacterSheet.Services;

namespace CharacterSheet.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return RedirectToAction("Index", "Home", new { area = "Main" });
        }
    }
}
