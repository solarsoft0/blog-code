using System;
using System.Threading.Tasks;
using TaskList.Abstractions;
using TaskList.Helpers;
using TaskList.Models;
using Xamarin.Forms;

namespace TaskList.ViewModels
{
    public class TaskDetailViewModel : BaseViewModel
    {
        public TaskDetailViewModel(TaskItem item = null)
        {
            CloudService = ServiceLocator.Resolve<ICloudService>();

            if (item != null)
            {
                Item = item;
                Title = item.Text;
            }
            else
            {
                Item = new TaskItem { Text = "New Item", Complete = false };
                Title = "New Item";
            }

            SaveCommand = new Command(async () => await ExecuteSaveCommand());
        }

        public TaskItem Item { get; set; }
        public ICloudService CloudService { get; }
        public Command SaveCommand { get; }
        public Command DeleteCommand { get; }

        async Task ExecuteSaveCommand()
        {
            if (IsBusy)
                return;
            IsBusy = true;

            try
            {
                if (Item.Id == null)
                {
                    await CloudService.InsertItemAsync(Item);
                }
                else
                {
                    await CloudService.UpdateItemAsync(Item);
                }
                MessagingCenter.Send<TaskDetailViewModel>(this, "ItemsChanged");
                await Application.Current.MainPage.Navigation.PopAsync();
            }
            catch (Exception ex)
            {
                await Application.Current.MainPage.DisplayAlert("Save Item Failed", ex.Message, "OK");
            }
            finally
            {
                IsBusy = false;
            }
        }
    }
}
