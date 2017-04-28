using System.Threading.Tasks;
using Microsoft.WindowsAzure.MobileServices;

namespace TaskList.Abstractions
{
    public interface ILoginProvider
    {
        Task<MobileServiceUser> LoginAsync(MobileServiceClient client);
    }
}
