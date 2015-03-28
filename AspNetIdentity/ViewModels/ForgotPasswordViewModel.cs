using System.ComponentModel.DataAnnotations;

namespace AspNetIdentity.ViewModels
{
    public class ForgotPasswordViewModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}