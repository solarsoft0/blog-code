using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

using CharacterSheet.Models;
using CharacterSheet.Areas.Account.ViewModels;
using CharacterSheet.Services;

namespace CharacterSheet.Areas.Account.Controllers
{
    [Area("Account")]
    public class LoginController : Controller
    {
        private static AppLogger logger = new AppLogger(typeof(LoginController).FullName);

        // Private storage for the sign-in manager from ASP.NET Identity Framework
        private UserManager<ApplicationUser> userManager = null;
        private SignInManager<ApplicationUser> signInManager = null;

        /// <summary>
        /// Constructor - store the DI objects we are passed
        /// </summary>
        /// <param name="userManager">ASP.NET Identity Framework UserManager</param>
        /// <param name="signInManager">ASP.NET Identity Framework Sign-in Manager</param>
        public LoginController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
        }

        /// <summary>
        /// GET /Account/Login - display the login form
        /// </summary>
        /// <returns>IActionResult (generally a view)</returns>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            logger.Trace("GET Index()");
            return View();
        }

        /// <summary>
        /// POST Submission to /Account/Login/Index - process the login form
        /// </summary>
        /// <param name="model">The Login ViewModel</param>
        /// <param name="returnUrl">Where to redirect to (if not Home)</param>
        /// <returns>IActionResult (async)</returns>
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Index(LoginVM model, string returnUrl = null)
        {
            logger.Trace("POST Index()");
            ViewBag.ReturnUrl = returnUrl;

            if (!ModelState.IsValid)
            {
                // Model is invalid - return straight away, representing the form
                return View(model);
            }

            // Find the user first
            logger.Trace("Looking up user {0}", model.UserName);
            var user = await userManager.FindByNameAsync(model.UserName);
            // If the user does not exist, then bypass the password check
            if (user == null) {
                logger.Trace("User {0} does not exist", model.UserName);
                ModelState.AddModelError("", "Invalid Username or Password");
                return View(model);
            }
            // If the user account is not confirmed, then print a warning
            if (!user.EmailConfirmed) {
                logger.Trace("User {0} is not activated", model.UserName);
                ModelState.AddModelError("", "Please activate your account first");
                return View(model);
            }

            // Now try to sign-in
            logger.Trace("Validating password for user {0}", model.UserName);
            var result = await signInManager.PasswordSignInAsync(
                model.UserName, model.Password, model.RememberMe, shouldLockout: false);
            if (result.Succeeded)
            {
                if (Url.IsLocalUrl(returnUrl))
                    return Redirect(returnUrl);
                else
                    return RedirectToAction("Index", "Home", new { area = "Main" });
            }

            if (result.IsLockedOut)
                ModelState.AddModelError("", "Locked Out");
            else if (result.IsNotAllowed)
                ModelState.AddModelError("", "Not Allowed");
            else
                ModelState.AddModelError("", "Invalid Username or Password");
            return View(model);
        }

        public IActionResult Logout()
        {
            logger.Trace("{0} Logout()", Request.Method);
            signInManager.SignOut();
            return RedirectToAction("Index", "Home", new { area = "Main" });
        }
    }
}
