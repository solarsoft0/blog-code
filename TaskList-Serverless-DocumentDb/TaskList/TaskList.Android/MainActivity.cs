using Android.App;
using Android.Content.PM;
using Android.OS;
using TaskList.Abstractions;
using TaskList.Droid.Services;
using Xamarin.Forms;

namespace TaskList.Droid
{
    [Activity (Label = "TaskList", Icon = "@drawable/icon", Theme="@style/MainTheme", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
	public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
	{
		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

            Microsoft.WindowsAzure.MobileServices.CurrentPlatform.Init();

			global::Xamarin.Forms.Forms.Init (this, bundle);

            ((DroidLoginProvider)DependencyService.Get<ILoginProvider>()).Init(this);

			LoadApplication (new TaskList.App ());
		}
	}
}

