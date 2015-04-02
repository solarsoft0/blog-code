using System;
using System.Threading.Tasks;
using AspNetIdentity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Framework.DependencyInjection;

namespace AspNetIdentity.Services
{
    public class UserProfile
    {
        public UserProfile(IServiceProvider services)
        {
            UserManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        }

        public UserManager<ApplicationUser> UserManager { get; set; }

        public async Task<string> DisplayName(string username)
        {
            ApplicationUser result = await UserManager.FindByNameAsync(username);
            return result.DisplayName;
        }
    }
}