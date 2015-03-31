using System;
using System.Diagnostics;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using AspNetIdentity.Areas.Account.ViewModels;
using AspNetIdentity.Models;
using AspNetIdentity.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Mvc;

namespace AspNetIdentity.Areas.Account.Controllers
{
    [Area("Account")]
    public class RegisterController : Controller
    {
        private static Logger logger = Logger.GetLogger(typeof(RegisterController).Name);

        public RegisterController(
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

        // GET: /Account/Register/Index
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Index()
        {
            logger.Trace("GET:Index - posting form");
            return View();
        }

        // POST: /Account/Register/Index
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Index(RegisterViewModel model)
        {
            logger.Enter("POST:Index");
            if (ModelState.IsValid)
            {
                logger.Trace("Register: Validating Email Address");
                if (!IsValidEmail(model.Email))
                {
                    logger.Trace(string.Format("Register: Email Address is not valid"));
                    ModelState.AddModelError("", "Invalid email address");
                    return View(model);
                }

                logger.Trace("Register: Creating new ApplicationUser");
                var user = new ApplicationUser { UserName = model.Email, Email = model.Email };
                logger.Trace(string.Format("Register: New Application User = {0}", user.UserName));
                var result = await UserManager.CreateAsync(user, model.Password);
                logger.Trace(string.Format("Register: Registration = {0}", result.Succeeded));
                if (result.Succeeded)
                {
                    logger.Trace("Register: Sending Email Code");
                    var code = await UserManager.GenerateEmailConfirmationTokenAsync(user);
                    logger.Trace(string.Format("Register: Email for code {0} is {1}", model.Email, code));
                    var callBackUrl = Url.Action("ConfirmEmail", "Register",
                        new { userId = user.Id, code = code, area = "Account" },
                        protocol: Context.Request.Scheme);
                    try
                    {
                        await EmailService.Instance.SendEmailAsync(model.Email,
                            "Confirm your account",
                            "Please confirm your account by clicking this link: <a href=\"" + callBackUrl + "\">link</a>");
                        ViewBag.Link = callBackUrl;
                        return View("ConfirmationRequired");
                    }
                    catch (SmtpException ex)
                    {
                        logger.Trace("Could not send email: " + ex.InnerException.Message);
                        ModelState.AddModelError("", "Could not send email");
                        return View(model);
                    }
                }
                foreach (var error in result.Errors)
                {
                    logger.Trace(string.Format("Register: Adding Error: {0}:{1}", error.Code, error.Description));
                    ModelState.AddModelError("", error.Description);
                }
                return View(model);
            }
            // Something went wrong, but we don't know what
            return View(model);
        }

        // GET: /Account/Register/ConfirmEmail
        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string userId, string code)
        {
            logger.Trace("ConfirmEmail: Checking for userId = " + userId);
            if (userId == null || code == null)
            {
                logger.Trace("ConfirmEmail: Invalid Parameters");
                return View("ConfirmationError");
            }
            logger.Trace("ConfirmEmail: Looking for userId");
            var user = await UserManager.FindByIdAsync(userId);
            if (user == null)
            {
                logger.Trace("ConfirmEmail: Could not find user");
                return View("ConfirmationError");
            }
            logger.Trace("ConfirmEmail: Found user - checking confirmation code");
            var result = await UserManager.ConfirmEmailAsync(user, code);
            logger.Trace("ConfirmEmail: Code Confirmation = " + result.Succeeded.ToString());
            return View(result.Succeeded ? "ConfirmationSuccess" : "ConfirmationError");
        }

        private bool IsValidEmail(string s)
        {
            logger.Enter("IsValidEmail", s);
            if (string.IsNullOrEmpty(s))
            {
                logger.Error("IsValidEmail - null or empty string");
                return false;
            }

            // Return true if strIn is in valid e-mail format.
            try
            {
                logger.Trace("Checking string against regular expression");
                var b = Regex.IsMatch(s, @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
                logger.Trace("Regular Expression {0}", b ? "Match" : "Does not match");
                return b;
            }
            catch (RegexMatchTimeoutException)
            {
                logger.Error("Regular Expression Timeout Exception");
                return false;
            }
        }
    }
}
