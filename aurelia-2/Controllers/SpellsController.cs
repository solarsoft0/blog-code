using aurelia_2.Settings;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;

namespace aurelia_2.Controllers
{
    [Route("api/[controller]")]
    public class SpellsController : Controller
    {
        private readonly IOptions<Auth0Settings> auth_settings;

        public SpellsController(IOptions<Auth0Settings> settings)
        {
            this.auth_settings = settings;
        }

        [Authorize]
        [Route("")]
        public string GetAll()
        {
            return "{id:1}";
        }
    }
}

