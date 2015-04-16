using Microsoft.AspNet.Mvc;

namespace TestWeb.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
