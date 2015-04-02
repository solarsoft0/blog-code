using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AspNetIdentity.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
    }

    public class ApplicationUser : IdentityUser
    {
        public string DisplayName { get; set; }
    }
}