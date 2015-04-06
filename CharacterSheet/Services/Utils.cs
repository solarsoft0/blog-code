using System;
using System.Text.RegularExpressions;

namespace CharacterSheet.Services
{
    /// <summary>
    /// A set of utility methods as statics.
    /// </summary>
    public class Utils
    {
        public static bool IsValidEmail(string s)
        {
            if (string.IsNullOrEmpty(s))
                return false;

            // Return true if strIn is in valid e-mail format.
            try {
                return Regex.IsMatch(s, @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$",
                      RegexOptions.IgnoreCase, System.TimeSpan.FromMilliseconds(250));
            }
            catch (RegexMatchTimeoutException) {
                return false;
            }
        }
    }
}