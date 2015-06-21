using Microsoft.AspNet.Mvc;

namespace aurelia_2.Controllers
{
    [Route("api/[controller]")]
    public class SpellsController : Controller
    {
        [Route("")]
        public string GetAll()
        {
            return "{id:1}";
        }
    }
}
