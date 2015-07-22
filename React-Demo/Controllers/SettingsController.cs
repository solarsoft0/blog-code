using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.Framework.OptionsModel;
using React_Demo.Middleware;

namespace React_Demo.Controllers
{
    [Route("api/[controller]")]
    public class SettingsController : Controller
    {
        private JWTSettings jwtSettings = null;

        public SettingsController(IOptions<JWTSettings> obj)
        {
            this.jwtSettings = obj.Options;
        }

        // GET: api/settings
        [HttpGet]
        public JWTSettings Get()
        {
            return jwtSettings;
        }
    }
}
