using System;
using System.Threading.Tasks;
using TaskList.Abstractions;
using TaskList.Helpers;
using TaskList.Models;
using Xamarin.Forms;

namespace TaskList.ViewModels
{
    public class TaskListViewModel : BaseViewModel
    {
        public TaskListViewModel()
        {
            Title = "Task List";

            CloudService = ServiceLocator.Resolve<ICloudService>();

            RefreshCommand = new Command(async () => await ExecuteRefreshCommand());
            AddNewItemCommand = new Command(async () => await ExecuteAddNewItemCommand());

            RefreshCommand.Execute(null);
            MessagingCenter.Subscribe<TaskDetailViewModel>(this, "ItemsChanged", async (sender) =>
            {
                await ExecuteRefreshCommand();
            });
        }

        ICloudService CloudService { get; }
        public Command RefreshCommand { get; }
        public Command AddNewItemCommand { get; }

        ObservableRangeCollection<TaskItem> items = new ObservableRangeCollection<TaskItem>();
        public ObservableRangeCollection<TaskItem> Items
        {
            get { return items; }
            set {
                SetProperty(ref items, value, "Items");
                if (selectedItem != null)
                {
                    Application.Current.MainPage.Navigation.PushAsync(new Pages.TaskDetail(selectedItem));
                    SelectedItem = null;
                }
            }
        }

        TaskItem selectedItem = null;
        public TaskItem SelectedItem
        {
            get { return selectedItem; }
            set { SetProperty(ref selectedItem, value, "SelectedItem"); }
        }

        async Task ExecuteRefreshCommand()
        {
            if (IsBusy)
                return;
            IsBusy = true;

            try
            {
                var items = await CloudService.GetAllItemsAsync();
                Items.ReplaceRange(items);
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Refresh Failed", ex.Message, "OK");
            }
            finally
            {
                IsBusy = false;
            }
        }

        async Task ExecuteAddNewItemCommand()
        {
            if (IsBusy)
                return;
            IsBusy = true;

            try
            {
                await Application.Current.MainPage.Navigation.PushAsync(new Pages.TaskDetail());
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Add New Item Failed", ex.Message, "OK");
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}
