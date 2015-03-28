using System;
using System.Diagnostics;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AspNetIdentity.Models;
using AspNetIdentity.Services;
using AspNetIdentity.ViewModels;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

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
                Debug.WriteLine("Register: Validating Email Address");
                if (!IsValidEmail(model.Email))
                {
                    Debug.WriteLine(string.Format("Register: Email Address is not valid"));
                    ModelState.AddModelError("", "Invalid email address");
                    return View(model);
                }

                Debug.WriteLine("Register: Creating new ApplicationUser");
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                Debug.WriteLine(string.Format("Register: New Application User = {0}", user.UserName));
                var result = await UserManager.CreateAsync(user, model.Password);
                Debug.WriteLine(string.Format("Register: Registration = {0}", result.Succeeded));
                if (result.Succeeded)
                {
                    Debug.WriteLine("Register: Sending Email Code");
                    var code = await UserManager.GenerateEmailConfirmationTokenAsync(user);
                    Debug.WriteLine(string.Format("Register: Email for code {0} is {1}", model.Email, code));
                    var callBackUrl = Url.Action("ConfirmEmail", "Account",
                        new { userId = user.Id, code = code },
                        protocol: Context.Request.Scheme);
                    try
                    {
                        await EmailService.Instance.SendEmailAsync(model.Email,
                            "Confirm your account",
                            "Please confirm your account by clicking this link: <a href=\"" + callBackUrl + "\">link</a>");
                        ViewBag.Link = callBackUrl;
                        return View("RegisterEmail");
                    }
                    catch (SmtpException ex)
                    {
                        Debug.WriteLine("Could not send email: " + ex.InnerException.Message);
                        ModelState.AddModelError("", "Could not send email");
                        return View(model);
                    }
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

        /**
         * GET: /Account/ConfirmEmail
         */
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            Debug.WriteLine("ConfirmEmail: Checking for userId = " + userId);
            if (userId == null || code == null)
            {
                Debug.WriteLine("ConfirmEmail: Invalid Parameters");
                return View("ConfirmEmailError");
            }
            Debug.WriteLine("ConfirmEmail: Looking for userId");
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                Debug.WriteLine("ConfirmEmail: Could not find user");
                return View("ConfirmEmailError");
            }
            Debug.WriteLine("ConfirmEmail: Found user - checking confirmation code");
            var result = await UserManager.ConfirmEmailAsync(user, code);
            Debug.WriteLine("ConfirmEmail: Code Confirmation = " + result.Succeeded.ToString());
            return View(result.Succeeded ? "ConfirmEmail" : "ConfirmEmailError");
        }
        #endregion

        #region /Account/Forgot
        /**
         * GET /Account/Forgot
         */
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Forgot()
        {
            return View();
        }

        /**
         * POST /Account/Forgot
         */
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Forgot(ForgotPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                Debug.WriteLine("Forgot: Checking for user ID = " + model.Email);
                var user = await UserManager.FindByNameAsync(model.Email);
                // If the user does not exist or the user has not confirmed their email,
                // then say we confirmed, but don't actually do anything.
                if (user == null || !(await UserManager.IsEmailConfirmedAsync(user)))
                {
                    Debug.WriteLine("Forgot: User does not exist - lying to the user");
                    return View("ForgotConfirmation");
                }

                // If we found a user and it's valid, then work out the code and send
                // it via email.
                var code = await UserManager.GeneratePasswordResetTokenAsync(user);
                Debug.WriteLine("Forgot: Code = " + code);
                var callBackUrl = Url.Action("ResetPassword", "Account",
                    new { userId = user.Id, code = code },
                    protocol: Context.Request.Scheme);
                Debug.WriteLine("Forgot: Link = " + callBackUrl);
                await EmailService.Instance.SendEmailAsync(model.Email, "Reset Password",
                    "We received a request to reset your password.  If you did not request a " +
                    "password change, then please dis-regard this email with our apologies.\n\n" +
                    "To reset your password, click here: <a href=\"" + callBackUrl + "\">link</a>");
                return View("ForgotConfirmation");
            }

            // If the model was not valid, re-display the form
            return View(model);
        }

        /**
         * GET /Account/ResetPassword
         */
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string userId = null, string code = null)
        {
            Debug.WriteLine("ResetPassword: Checking for userId = " + userId);
            if (userId == null || code == null)
            {
                Debug.WriteLine("ResetPassword: Invalid Parameters");
                return View("ResetPasswordError");
            }
            Debug.WriteLine("ResetPassword: Looking for userId");
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                Debug.WriteLine("ResetPassword: Could not find user");
                return View("ResetPasswordError");
            }

            ResetPasswordViewModel model = new ResetPasswordViewModel();
            model.Email = user.UserName;
            return View(model);
        }

        /**
         * POST /Account/ResetPassword
         */
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                Debug.WriteLine("ResetPassword: Checking for user = " + model.Email);
                var user = await UserManager.FindByNameAsync(model.Email);
                if (user == null)
                {
                    Debug.WriteLine("ResetPassword: User does not exist - lie to the user");
                    return RedirectToAction("ResetConfirmation", "Account");
                }
                var result = await UserManager.ResetPasswordAsync(user, model.Code, model.Password);
                if (result.Succeeded)
                {
                    Debug.WriteLine("ResetPassword: Password is reset - confirm to the user");
                    return RedirectToAction("ResetConfirmation", "Account");
                }
                foreach (var error in result.Errors)
                {
                    Debug.WriteLine(string.Format("Register: Adding Error: {0}:{1}", error.Code, error.Description));
                    ModelState.AddModelError("", error.Description);
                }
                return View(model);
            }
            Debug.WriteLine("ResetPassword: Model is invalid - just re-state the form");
            return View(model);
        }

        /**
         * GET /Account/ResetConfirmation
         */
        [HttpGet]
        [AllowAnonymous]
        public IActionResult ResetConfirmation()
        {
            return View();
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

        public bool IsValidEmail(string s)
        {
            if (string.IsNullOrEmpty(s))
                return false;

            // Return true if strIn is in valid e-mail format.
            try
            {
                return Regex.IsMatch(s, @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException)
            {
                return false;
            }
        }
        #endregion
    }
}
