using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;
using TaskList.Abstractions;
using Xamarin.Forms;

namespace TaskList.Services
{
    public class ServerlessCloudService : ICloudService
    {
        MobileServiceClient client;

        public ServerlessCloudService()
        {
            client = new MobileServiceClient(Constants.BackendUrl);
        }

        public async Task<MobileServiceUser> LoginAsync()
        {
            var loginProvider = DependencyService.Get<ILoginProvider>();
            var currentUser = await loginProvider.LoginAsync(client);
            return currentUser;
        }
    }
}
