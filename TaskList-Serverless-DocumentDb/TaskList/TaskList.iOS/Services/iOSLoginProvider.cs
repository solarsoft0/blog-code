using Facebook.LoginKit;
using Foundation;
using Microsoft.WindowsAzure.MobileServices;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using TaskList.Abstractions;
using TaskList.iOS.Services;
using UIKit;

[assembly: Xamarin.Forms.Dependency(typeof(iOSLoginProvider))]
namespace TaskList.iOS.Services
{
    public class iOSLoginProvider : ILoginProvider
    {
        UIViewController RootView => UIApplication.SharedApplication.KeyWindow.RootViewController;

        public async Task<MobileServiceUser> LoginAsync(MobileServiceClient client)
        {
            var accessToken = await LoginFacebookAsync();
            var zumoPayload = new JObject();
            zumoPayload["access_token"] = accessToken;
            return await client.LoginAsync("facebook", zumoPayload);
        }

        TaskCompletionSource<string> facebook_task;

        async Task<string> LoginFacebookAsync()
        {
            facebook_task = new TaskCompletionSource<string>();
            var loginManager = new LoginManager();
            loginManager.LogInWithReadPermissions(new[] { "public_profile" }, RootView, LoginTokenHandler);
            return await facebook_task.Task;
        }

        private void LoginTokenHandler(LoginManagerLoginResult loginResult, NSError error)
        {
            if (loginResult.Token != null)
            {
                facebook_task.TrySetResult(loginResult.Token.TokenString);
            }
            else
            {
                facebook_task.TrySetException(new Exception("Facebook Client Flow Login Failed"));
            }
        }
    }
}