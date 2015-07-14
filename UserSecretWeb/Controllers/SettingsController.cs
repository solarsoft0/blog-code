using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;
using UserSecretWeb.Settings;

namespace UserSecretWeb.Controllers
{
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {
        private Auth0Settings auth0Settings = null;

        public SettingsController(IOptions<Auth0Settings> settings)
        {
            this.auth0Settings = settings.Options;
        }

        // GET: api/settings
        [HttpGet]
        public Auth0Settings Get()
        {
            return auth0Settings;
        }
    }
}
