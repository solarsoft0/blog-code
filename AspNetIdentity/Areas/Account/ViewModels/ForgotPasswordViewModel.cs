using System.ComponentModel.DataAnnotations;

namespace AspNetIdentity.Areas.Account.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}