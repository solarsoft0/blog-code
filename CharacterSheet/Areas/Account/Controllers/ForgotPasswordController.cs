using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

using CharacterSheet.Services;
using CharacterSheet.Models;
using CharacterSheet.Areas.Account.ViewModels;

namespace CharacterSheet.Areas.Account.Controllers
{
    [Area("Account")]
    public class ForgotPasswordController : Controller
    {
        private static AppLogger logger = new AppLogger(typeof(ForgotPasswordController).FullName);

        // Private storage for the user manager from ASP.NET Identity Framework
        private UserManager<ApplicationUser> userManager = null;

        /// <summary>
        /// Constructor - store the DI objects we are passed
        /// </summary>
        /// <param name="userManager">ASP.NET Identity Framework UserManager</param>
        /// <param name="signInManager">ASP.NET Identity Framework Sign-in Manager</param>
        public ForgotPasswordController(UserManager<ApplicationUser> userManager)
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
        public async Task<IActionResult> Index(ForgotPasswordVM model)
        {
            logger.Trace("POST Index()");
            if (!ModelState.IsValid) {
                logger.Trace("Model is not valid - displaying form");
                return View(model);
            }

            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null) {
                logger.Trace("User {0} does not exist - pretending to send notification", model.Email);
                ViewBag.CallbackUrl = "/";
                return View("CheckEmail");
            }
            if (!(await userManager.IsEmailConfirmedAsync(user))) {
                logger.Trace("User {0} has not confirmed yet - redirecting to registration", model.Email);
                return RedirectToAction("Index", "RegisterAccount");
            }

            logger.Trace("Generating code for password reset");
            var code = await userManager.GeneratePasswordResetTokenAsync(user);
            logger.Trace("Code = {0}", code);
            var callbackUrl = Url.Action("Callback", "ForgotPassword",
                new { userId = user.Id, code = code, area = "Account" },
                protocol: Context.Request.Scheme);
            logger.Trace("Callback URL = {0}", code);
            if (!WebConfiguration.Instance.DevelopmentMode) {
                logger.Trace("In Prod Mode - initiating email confirmation");
                var notified = await Notifier.Instance.SendResetPasswordLinkAsync(user, callbackUrl);
                if (!notified.Successful) {
                    logger.Error("Notification to {0} failed", model.Email);
                    ModelState.AddModelError("", "Could not send reset password link");
                    return View(model);
                }
            }
            ViewBag.CallbackUrl = callbackUrl;
            return View("CheckEmail");
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> Callback(string userId = null, string code = null)
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
            ResetPasswordVM model = new ResetPasswordVM { Email = user.Email, Code = code };
            return View("ResetPassword", model);
        }

        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordVM model)
        {
            logger.Trace("POST ResetPassword()");
            if (!ModelState.IsValid) {
                logger.Trace("Model is not valid - showing view again");
                return View(model);
            }

            logger.Trace("Finding user by email {0}", model.Email);
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user == null) {
                logger.Trace("User does not exist: pretending to be successful");
                return RedirectToAction("Success", "ForgotPassword");
            }
            logger.Trace("Resetting password with code = {0}", model.Code);
            var result = await userManager.ResetPasswordAsync(user, model.Code, model.Password);
            if (result.Succeeded) {
                logger.Trace("Reset Password for {0} succeeded", model.Email);
                return RedirectToAction("Success", "ForgotPassword");
            }
            foreach (var error in result.Errors) {
                ModelState.AddModelError("", error.Description);
            }
            logger.Error("Reset Password form had issues - re-displaying");
            return View(model);
        }

        [AllowAnonymous]
        public IActionResult Success()
        {
            logger.Trace("{0} Success()", Request.Method);
            return View();
        }
    }
}
