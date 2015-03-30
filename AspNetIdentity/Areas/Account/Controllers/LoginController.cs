using System.Threading.Tasks;
using AspNetIdentity.Areas.Account.ViewModels;
using AspNetIdentity.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Areas.Account.Controllers
{
    [Area("Account")]
    public class LoginController : Controller
    {
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
            return View();
        }

        // POST: /Account/Login/Index
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(LoginViewModel model, string returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                if (result.Succeeded)
                {
                    if (Url.IsLocalUrl(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                if (result.IsLockedOut)
                {
                    ModelState.AddModelError("", "Locked Out");
                }
                else if (result.IsNotAllowed)
                {
                    ModelState.AddModelError("", "Not Allowed");
                }
                else if (result.RequiresTwoFactor)
                {
                    ModelState.AddModelError("", "Requires Two-Factor Authentication");
                }
                else
                {
                    ModelState.AddModelError("", "Invalid username or password.");
                }
                return View(model);
            }

            // If we got this far, something failed - redisplay the form
            return View(model);
        }

        // (GET|POST): /Account/Login/Logout
        public IActionResult Logout()
        {
            SignInManager.SignOut();
            return RedirectToAction("Index", "Home");
        }

    }
}
