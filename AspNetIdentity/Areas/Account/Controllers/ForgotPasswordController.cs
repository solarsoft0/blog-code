using System.Threading.Tasks;
using AspNetIdentity.Areas.Account.ViewModels;
using AspNetIdentity.Models;
using AspNetIdentity.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Areas.Account.Controllers
{
    [Area("Account")]
    public class ForgotPasswordController : Controller
    {
        private static Logger logger = Logger.GetLogger(typeof(ForgotPasswordController).Name);

        public ForgotPasswordController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public UserManager<ApplicationUser> UserManager
        {
            get;
            private set;
        }

        public SignInManager<ApplicationUser> SignInManager
        {
            get;
            private set;
        }

        // GET: /Account/ForgotPassword/Index
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            logger.Trace("GET /Account/ForgotPassword/Index");
            return View();
        }

        // POST: /Account/ForgotPassword/Index
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                logger.Trace("POST:Index: Checking for user ID = " + model.Email);
                var user = await UserManager.FindByNameAsync(model.Email);
                // If the user does not exist or the user has not confirmed their email,
                // then say we confirmed, but don't actually do anything.
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user)))
                {
                    logger.Trace("POST:Index: User does not exist - lying to the user");
                    return View("ConfirmationRequired");
                }

                // If we found a user and it's valid, then work out the code and send
                // it via email.
                var code = await UserManager.GeneratePasswordResetTokenAsync(user);
                logger.Trace("POST:Index: Code = " + code);
                var callBackUrl = Url.Action("ResetPassword", "ForgotPassword",
                    new { userId = user.Id, code = code, area = "Account" },
                    protocol: Context.Request.Scheme);
                logger.Trace("POST:Index: Link = " + callBackUrl);
                await EmailService.Instance.SendEmailAsync(model.Email, "Reset Password",
                    "We received a request to reset your password.  If you did not request a " +
                    "password change, then please dis-regard this email with our apologies.\n\n" +
                    "To reset your password, click here: <a href=\"" + callBackUrl + "\">link</a>");
                return View("ConfirmationRequired");
            }

            // If the model was not valid, re-display the form
            logger.Error("POST:Index - Model was not valid");
            return View(model);
        }

        // GET: /Account/ForgotPassword/ResetPassword
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string userId = null, string code = null)
        {
            logger.Trace("ResetPassword: Checking for userId = " + userId);
            if (userId == null || code == null)
            {
                logger.Trace("ResetPassword: Invalid Parameters");
                return View("ResetPasswordError");
            }
            logger.Trace("ResetPassword: Looking for userId");
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                logger.Trace("ResetPassword: Could not find user");
                return View("ResetPasswordError");
            }

            ResetPasswordViewModel model = new ResetPasswordViewModel();
            model.Email = user.UserName;
            return View(model);
        }

        // POST: /Account/ForgotPassword/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                logger.Trace("ResetPassword: Checking for user = " + model.Email);
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null)
                {
                    logger.Trace("ResetPassword: User does not exist - lie to the user");
                    return RedirectToAction("ResetSuccess", "ForgotPassword", new { area = "Account" });
                }
                var result = await UserManager.ResetPasswordAsync(user, model.Code, model.Password);
                if (result.Succeeded)
                {
                    logger.Trace("ResetPassword: Password is reset - confirm to the user");
                    return RedirectToAction("ResetSuccess", "ForgotPassword", new { area = "Account" });
                }
                foreach (var error in result.Errors)
                {
                    logger.Trace(string.Format("Register: Adding Error: {0}:{1}", error.Code, error.Description));
                    ModelState.AddModelError("", error.Description);
                }
                return View(model);
            }
            logger.Trace("ResetPassword: Model is invalid - just re-state the form");
            return View(model);
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetSuccess()
        {
            logger.Trace("ResetSuccess: Displaying Form");
            return View();
        }
    }
}
