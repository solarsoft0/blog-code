using TaskList.Models;
using Xamarin.Forms;
using Xamarin.Forms.Xaml;

namespace TaskList.Pages
{
    [XamlCompilation(XamlCompilationOptions.Compile)]
	public partial class TaskDetail : ContentPage
	{
		public TaskDetail (TaskItem item = null)
		{
			InitializeComponent ();
            BindingContext = new ViewModels.TaskDetailViewModel(item);
		}
	}
}
