using System.Threading.Tasks;
using CharacterSheet.Models;

namespace CharacterSheet.Services
{
    public class Notifier
    {
        private static AppLogger logger = new AppLogger(typeof(Notifier).FullName);
        #region Singleton Design Pattern
        private static Notifier instance = null;

        private Notifier()
        {
            logger.Trace("Creating new Notifier service");
        }

        public static Notifier Instance
        {
            get
            {
                if (instance == null) {
                    instance = new Notifier();
                }
                return instance;
            }
        }
        #endregion

        public async Task<NotificationResult> SendConfirmationLinkAsync(ApplicationUser user, string url)
        {
            logger.Trace("Entering SendConfirmationLinkAsync");
            logger.Trace("User = {0}", user.Email);
            logger.Trace("Link = {0}", url);

            logger.Error("NOTIFICATION SERVICE NOT IMPLEMENTED YET = SEND FAILED");
            var result = new NotificationResult
            {
                Successful = false,
                Error = "Not Implemented"
            };
            return await Task.FromResult(result);
        }

        public async Task<NotificationResult> SendResetPasswordLinkAsync(ApplicationUser user, string url)
        {
            logger.Trace("Entering SendResetPasswordLinkAsync");
            logger.Trace("User = {0}", user.Email);
            logger.Trace("Link = {0}", url);

            logger.Error("NOTIFICATION SERVICE NOT IMPLEMENTED YET = SEND FAILED");
            var result = new NotificationResult
            {
                Successful = false,
                Error = "Not Implemented"
            };
            return await Task.FromResult(result);
        }
    }
}