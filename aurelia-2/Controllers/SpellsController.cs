using aurelia_2.Settings;
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

        [Route("")]
        public string GetAll()
        {
            if (this.Context.Request.Headers.ContainsKey("Authorization"))
            {
                var authHeader = this.Context.Request.Headers["Authorization"];
                var authBits = authHeader.Split(' ');
                if (authBits.Length != 2)
                {
                    return "{error:\"auth bits needs to be length 2\"}";
                }
                if (!authBits[0].ToLowerInvariant().Equals("bearer"))
                {
                    return "{error:\"authBits[0] must be bearer\"}";
                }
                var b64secret = auth_settings.Options.ClientSecret
                        .Replace('_', '/').Replace('-', '+');
                var secret = System.Convert.FromBase64String(b64secret);
                string claims = JWT.JsonWebToken.Decode(authBits[1], secret);
                return claims;
            }
            return "{id:1}";
        }
    }
}

