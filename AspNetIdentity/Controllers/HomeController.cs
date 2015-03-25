using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
