using Android.Content;
using Microsoft.WindowsAzure.MobileServices;
using System.Threading.Tasks;
using TaskList.Abstractions;
using TaskList.Droid.Services;

[assembly: Xamarin.Forms.Dependency(typeof(DroidLoginProvider))]
namespace TaskList.Droid.Services
{
    public class DroidLoginProvider : ILoginProvider
    {
        public Context RootView { get; private set; }

        public void Init(Context context)
        {
            RootView = context;
        }

        public async Task<MobileServiceUser> LoginAsync(MobileServiceClient client)
        {
            return await client.LoginAsync(RootView, "facebook");
        }
    }
}