using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [HttpGet]
        public IActionResult Index()
        {
            // Let's add the username to the ViewBag
            ViewBag.UserName = User.Identity.Name;
            //Then return the view
            return View();
        }
    }
}
