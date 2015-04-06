using System;
using System.Threading.Tasks;
using CharacterSheet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Framework.DependencyInjection;

namespace CharacterSheet.Services
{
    /// <summary>
    /// Transient Service for the ApplicationUser so that the ApplicationUser can be
    /// accessed via Razor imperitives.
    /// </summary>
    public class UserProfile
    {
        private static AppLogger logger = new AppLogger(typeof(UserProfile).FullName);

        // Storage for the user manager that we pull from the services registry
        private UserManager<ApplicationUser> userManager;

        /// <summary>
        /// Create a new UserProfile Transient Service
        /// </summary>
        /// <param name="services">Services Registry</param>
        public UserProfile(IServiceProvider services)
        {
            logger.Trace("Creating new UserProfile object");
            userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        }

        /// <summary>
        /// Async Transient Service for getting the Display Name.  Use
        /// 
        /// @await UserProfile.DisplayName(User.Identity.Name)
        /// 
        /// </summary>
        /// <param name="username">The username</param>
        /// <returns>The display name</returns>
        public async Task<string> DisplayName(string username)
        {
            logger.Trace("Razor Request for DisplayName of {0}", username);
            ApplicationUser user = await userManager.FindByNameAsync(username);
            return user.DisplayName;
        }
    }
}