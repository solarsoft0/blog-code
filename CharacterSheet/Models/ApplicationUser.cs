using Microsoft.AspNet.Identity;

namespace CharacterSheet.Models
{
    /// <summary>
    /// ASP.NET Identity: A user of the system
    /// </summary>
    public class ApplicationUser : IdentityUser
    {
        public string DisplayName
        {
            get;
            set;
        }

    }
}