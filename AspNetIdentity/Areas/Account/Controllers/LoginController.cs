using System.Threading.Tasks;
using AspNetIdentity.Areas.Account.ViewModels;
using AspNetIdentity.Models;
using AspNetIdentity.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Areas.Account.Controllers
{
    [Area("Account")]
    public class LoginController : Controller
    {
        private static Logger logger = Logger.GetLogger(typeof(LoginController).Name);

        public LoginController(
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

        // GET: /Account/Login/Index
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            logger.Trace("GET:Index: Displaying the form");
            return View();
        }

        // POST: /Account/Login/Index
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(LoginViewModel model, string returnUrl = null)
        {
            logger.Trace("POST:Index: Checking ModelState is Valid");
            ViewBag.ReturnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                logger.Trace("POST:Index - does user exist? finding the user");
                var user = await UserManager.FindByNameAsync(model.UserName);
                if (user == null) {
                    logger.Trace("POST:Index - user is not found");
                    ModelState.AddModelError("", "Invalid username or password.");
                    return View(model);
                }
                if (!user.EmailConfirmed) {
                    logger.Trace("POST:Index - user does not have a confirmed email");
                    ModelState.AddModelError("", "Invalid username or password");
                    return View(model);
                }

                logger.Trace("POST:Index - checking password");
                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                if (result.Succeeded)
                {
                    logger.Trace("POST:Index: Login for {0} is successful - redirecting", model.UserName);
                    if (Url.IsLocalUrl(returnUrl))
                    {
                        logger.Trace("POST:Index: redirecting to {0}", returnUrl);
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        logger.Trace("POST:Index: redirecting to /Home/Index");
                        return RedirectToAction("Index", "Home");
                    }
                }
                if (result.IsLockedOut)
                {
                    logger.Error("POST:Index: Error for {0} - locked out", model.UserName);
                    ModelState.AddModelError("", "Locked Out");
                }
                else if (result.IsNotAllowed)
                {
                    logger.Error("POST:Index: Error for {0} - not allowed", model.UserName);
                    ModelState.AddModelError("", "Not Allowed");
                }
                else if (result.RequiresTwoFactor)
                {
                    logger.Error("POST:Index: Error for {0} - 2factor auth required", model.UserName);
                    ModelState.AddModelError("", "Requires Two-Factor Authentication");
                }
                else
                {
                    logger.Error("POST:Index: Error for {0} - invalid username or password", model.UserName);
                    ModelState.AddModelError("", "Invalid username or password.");
                }
                logger.Error("POST:Index: Something went wrong - reposting form");
                return View(model);
            }

            logger.Error("POST:Index: Model was not valid - reposting form");
            return View(model);
        }

        // (GET|POST): /Account/Login/Logout
        public IActionResult Logout()
        {
            logger.Info("Post:Logout");
            SignInManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

    }
}
