using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

using CharacterSheet.Services;
using CharacterSheet.Models;
using CharacterSheet.Areas.Account.ViewModels;

namespace CharacterSheet.Areas.Account.Controllers
{
    [Area("Account")]
    public class RegisterAccountController : Controller
    {
        private static AppLogger logger = new AppLogger(typeof(RegisterAccountController).FullName);

        // Private storage for the user manager from ASP.NET Identity Framework
        private UserManager<ApplicationUser> userManager = null;

        /// <summary>
        /// Constructor - store the DI objects we are passed
        /// </summary>
        /// <param name="userManager">ASP.NET Identity Framework UserManager</param>
        /// <param name="signInManager">ASP.NET Identity Framework Sign-in Manager</param>
        public RegisterAccountController(UserManager<ApplicationUser> userManager)
        {
            this.userManager = userManager;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            logger.Trace("GET Index()");
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(RegisterAccountVM model)
        {
            logger.Trace("POST Index()");

            if (!ModelState.IsValid) {
                logger.Info("Model is not valid - displaying form");
                return View(model);
            }

            if (!Utils.IsValidEmail(model.Email)) {
                logger.Info("Email Address {0} is not valid", model.Email);
                ModelState.AddModelError("Email", "Invalid email address");
                return View(model);
            }

            logger.Trace("Finding user {0} in database", model.Email);
            var user = await userManager.FindByNameAsync(model.Email);
            if (user != null) {
                logger.Trace("User {0} already exists - checking activation", model.Email);
                if (!user.EmailConfirmed) {
                    logger.Trace("User {0} is not activated - candidate for deletion", model.Email);
                    if (user.UserName.Equals(WebConfiguration.Instance.AdminUser)) {
                        logger.Trace("You can't fix {0} this way though!", user.UserName);
                    } else {
                        logger.Trace("Attempting to delete user {0}", model.Email);
                        var deleted = await userManager.DeleteAsync(user);
                        if (!deleted.Succeeded) {
                            logger.Error("Could not delete {0} record", model.Email);
                        }
                    }
                }
            }

            logger.Trace("Creating new user object");
            user = new ApplicationUser { UserName = model.Email, Email = model.Email };
            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded) {
                logger.Trace("User creation successful - creating new Confirmation Token");
                var code = await userManager.GenerateEmailConfirmationTokenAsync(user);
                logger.Trace("Code = {0}", code);
                var callbackUrl = Url.Action("Callback", "RegisterAccount",
                    new { userId = user.Id, code = code, area = "Account" },
                    protocol: Context.Request.Scheme);
                logger.Trace("callBack URL = {0}", callbackUrl);
                if (!WebConfiguration.Instance.DevelopmentMode) {
                    logger.Trace("In Prod Mode - initiating email confirmation");
                    var notified = await Notifier.Instance.SendConfirmationLinkAsync(user, callbackUrl);
                    if (!notified.Successful) {
                        logger.Error("Notification to {0} failed", model.Email);
                        ModelState.AddModelError("", "Could not send confirmation");
                        return View(model);
                    }
                }
                ViewBag.CallbackUrl = callbackUrl;
                return View("ConfirmAccount");
            }
            logger.Trace("User creation failed - adding errors into ModelState");
            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error.Description);
            }
            logger.Trace("displaying registration form (with errors");
            return View(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Callback(string userId, string code)
        {
            logger.Trace("GET Callback({0},{1})", userId, code);
            if (userId == null || code == null) {
                logger.Error("User is null or code is null");
                return View("CallbackError");
            }
            var user = await userManager.FindByIdAsync(userId);
            if (user == null) {
                logger.Error("User ID = {0} does not exist", userId);
                return View("CallbackError");
            }
            logger.Trace("Found user {0}", user.Email);
            var confirmed = await userManager.ConfirmEmailAsync(user, code);
            logger.Trace("Confirmation Result = {0}", confirmed.Succeeded ? "confirmed" : "not confirmed");
            if (confirmed.Succeeded) {
                return View("EmailConfirmed");
            } else {
                logger.Error("Error confirming {0}", user.Email);
                foreach (var error in confirmed.Errors) {
                    logger.Error("Error#{0}: {1}", error.Code, error.Description);
                }
                return View("CallbackError");
            }
        }
    }
}
