using System;
using System.Threading.Tasks;
using CharacterSheet.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Data.Entity.SqlServer;
using Microsoft.Framework.DependencyInjection;

namespace CharacterSheet.Services
{
    /// <summary>
    /// Entity Framework Database Context
    /// </summary>
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        private static AppLogger logger = new AppLogger(typeof(ApplicationDbContext).FullName);

        #region Database Initialization
        /// <summary>
        /// Static routine to ensure that a minimally viable database is set up.
        /// </summary>
        /// <param name="serviceProvider">The services object</param>
        /// <returns>Async Task</returns>
        public static async Task InitializeDatabaseAsync(IServiceProvider services)
        {
            logger.Trace("Entering InitializeDatabaseAsync");

            using (var dbp = services.GetRequiredService<ApplicationDbContext>())
            {
                var db = dbp.Database as SqlServerDatabase;
                if (db != null)
                {
                    logger.Trace("dbp.Database is not null - checking db exists");
                    await db.EnsureCreatedAsync();

                    logger.Trace("checking role admin exists");
                    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
                    if (!await roleManager.RoleExistsAsync(WebConfiguration.Instance.AdminRole))
                    {
                        logger.Trace("role admin does not exist - creating it");
                        await roleManager.CreateAsync(new IdentityRole(WebConfiguration.Instance.AdminRole));
                    }

                    logger.Trace("checking user admin exists");
                    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
                    var user = await userManager.FindByNameAsync(WebConfiguration.Instance.AdminUser);
                    if (user == null)
                    {
                        logger.Trace("user admin does not exist - creating it");
                        user = new ApplicationUser
                        {
                            UserName = WebConfiguration.Instance.AdminUser,
                            DisplayName = "Administrator",
                            EmailConfirmed = true
                        };
                        var userCreated = await userManager.CreateAsync(user, WebConfiguration.Instance.AdminPassword);
                        if (userCreated.Succeeded)
                        {
                            logger.Trace("adding user admin to role admin");
                            await userManager.AddToRoleAsync(user, WebConfiguration.Instance.AdminRole);
                        } else
                        {
                            logger.Error("user.CreateAsync returned !Succeeded");
                        }
                    }
                } else
                {
                    logger.Trace("dbp.Database is null");
                }
            }
        }
        #endregion
    }
}