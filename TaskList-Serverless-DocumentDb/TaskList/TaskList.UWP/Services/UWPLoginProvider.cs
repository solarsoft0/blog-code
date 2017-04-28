using Microsoft.WindowsAzure.MobileServices;
using System.Threading.Tasks;
using TaskList.Abstractions;
using TaskList.UWP.Services;

[assembly: Xamarin.Forms.Dependency(typeof(UWPLoginProvider))]
namespace TaskList.UWP.Services
{
    public class UWPLoginProvider : ILoginProvider
    {
        public async Task<MobileServiceUser> LoginAsync(MobileServiceClient client)
        {
            return await client.LoginAsync("facebook");
        }
    }
}
