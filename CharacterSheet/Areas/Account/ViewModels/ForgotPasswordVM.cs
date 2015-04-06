using System.ComponentModel.DataAnnotations;

namespace CharacterSheet.Areas.Account.ViewModels
{
    public class ForgotPasswordVM
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }

    }
}