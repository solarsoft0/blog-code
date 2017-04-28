using TaskList.Abstractions;
using TaskList.Helpers;
using TaskList.Services;
using Xamarin.Forms;

namespace TaskList
{
    public class App : Application
    {
        public App()
        {
            ServiceLocator.Add<ICloudService, ServerlessCloudService>();
            MainPage = new NavigationPage(new Pages.EntryPage());
        }
    }
}
