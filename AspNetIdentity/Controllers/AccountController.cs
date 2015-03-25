using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

using AspNetIdentity.Models;
using AspNetIdentity.ViewModels;
using System.Diagnostics;

namespace AspNetIdentity.Controllers
{
    public class AccountController : Controller
    {
        public AccountController(
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

        #region /Account/Login
        /**
         * GET /Account/Login
         */
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Login(string returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }

        /**
         * POST /Account/Login
         */
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string returnUrl = null)
        {
            ViewBag.ReturnUrl = returnUrl;
            if (ModelState.IsValid)
            {
                var result = await SignInManager.PasswordSignInAsync(model.UserName, model.Password, model.RememberMe, shouldLockout: false);
                if (result.Succeeded)
                {
                    return RedirectToLocal(returnUrl);
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
        #endregion

        #region /Account/Register
        /**
         * GET: /Account/Register
         */
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Register()
        {
            return View();
        }

        /**
         * POST: /Account/Register
         */
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            if (ModelState.IsValid)
            {
                Debug.WriteLine("Register: Creating new ApplicationUser");
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                Debug.WriteLine(string.Format("Register: New Application User = {0}", user.UserName));
                var result = await UserManager.CreateAsync(user, model.Password);
                Debug.WriteLine(string.Format("Register: Registration = {0}", result.Succeeded));
                if (result.Succeeded)
                {
                    // Success - redirect to the login page
                    return RedirectToAction("Index", "Home");
                }
                foreach (var error in result.Errors)
                {
                    Debug.WriteLine(string.Format("Register: Adding Error: {0}:{1}", error.Code, error.Description));
                    ModelState.AddModelError("", error.Description);
                }
                return View(model);
            }
            // Somethign went wrong, but we don't know what
            return View(model);
        }
        #endregion

        #region Logoff
        /**
         * POST: /Account/Logout
         */
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Logout()
        {
            SignInManager.SignOut();
            return RedirectToAction("Index", "Home");
        }
        #endregion

        #region Helpers
        private IActionResult RedirectToLocal(string returnUrl)
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
        #endregion
    }
}
