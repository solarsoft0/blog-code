using Microsoft.WindowsAzure.MobileServices;
using System.Collections.Generic;
using System.Threading.Tasks;
using TaskList.Models;

namespace TaskList.Abstractions
{
    public interface ICloudService
    {
        Task<MobileServiceUser> LoginAsync();

        Task<List<TaskItem>> GetAllItemsAsync();

        Task<TaskItem> InsertItemAsync(TaskItem item);

        Task<TaskItem> UpdateItemAsync(TaskItem item);
    }
}
