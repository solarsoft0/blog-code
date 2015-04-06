using System.ComponentModel.DataAnnotations;

namespace CharacterSheet.Areas.Account.ViewModels
{
    /// <summary>
    /// ViewModel for the Account/Login/Index POST method
    /// </summary>
    public class LoginVM
    {
        [Required]
        [Display(Name = "Email Address")]
        public string UserName { get; set; }

        [Required]
        [Display(Name = "Password")]
        public string Password { get; set; }

        [Display(Name = "Remember me?")]
        public bool RememberMe { get; set; }
    }
}