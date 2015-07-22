using System.Collections.Generic;
using Microsoft.AspNet.Authorization;
using Microsoft.AspNet.Mvc;

namespace React_Demo.Controllers
{
    [Route("api/[controller]")]
    public class SpellsController : Controller
    {
        // GET: api/spells
        [Authorize]
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }
    }
}
