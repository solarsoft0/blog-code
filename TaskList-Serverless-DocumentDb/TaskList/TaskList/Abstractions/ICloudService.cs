using System;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;

namespace TaskList.Abstractions
{
    public interface ICloudService
    {
        Task<MobileServiceUser> LoginAsync(); 
    }
}
