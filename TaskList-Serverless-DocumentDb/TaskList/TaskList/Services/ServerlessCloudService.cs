using System.Threading.Tasks;
using Microsoft.Azure.Documents;
using Microsoft.Azure.Documents.Client;
using Microsoft.Azure.Documents.Linq;
using Microsoft.WindowsAzure.MobileServices;
using TaskList.Abstractions;
using Xamarin.Forms;
using TaskList.Models;
using System.Net.Http;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Net;

namespace TaskList.Services
{
    public class ServerlessCloudService : ICloudService
    {
        MobileServiceClient client;
        DocumentDbServiceAccess serviceAccess;

        public ServerlessCloudService()
        {
            client = new MobileServiceClient(Constants.BackendUrl);
        }

        public async Task<MobileServiceUser> LoginAsync()
        {
            var loginProvider = DependencyService.Get<ILoginProvider>();
            var currentUser = await loginProvider.LoginAsync(client);

            serviceAccess = await client.InvokeApiAsync<DocumentDbServiceAccess>(
                "documentdb", HttpMethod.Get, new Dictionary<string, string>());

            DocumentClient = new DocumentClient(new Uri(serviceAccess.Host), serviceAccess.Token);
            CollectionLink = UriFactory.CreateDocumentCollectionUri(serviceAccess.Database, serviceAccess.Collection);

            return currentUser;
        }

        private DocumentClient DocumentClient { get; set; }

        private Uri CollectionLink { get; set; }

        public async Task<List<TaskItem>> GetAllItemsAsync()
        {
            try
            {
                var query = DocumentClient.CreateDocumentQuery<TaskItem>(
                    CollectionLink,
                    new FeedOptions
                    {
                        MaxItemCount = -1,
                        PartitionKey = new PartitionKey(serviceAccess.UserId)
                    })
                    .Where(item => item.Complete == false)
                    .AsDocumentQuery();

                var tlist = new List<TaskItem>();
                while (query.HasMoreResults)
                {
                    tlist.AddRange(await query.ExecuteNextAsync<TaskItem>());
                }
                return tlist;
            }
            catch (DocumentClientException ex)
            {
                if (ex.StatusCode == HttpStatusCode.BadRequest)
                {
                    if (ex.Message.StartsWith("Partition key provided either doesn't correspond to definition in the collection or doesn't match partition key field values specified in the document."))
                    {
                        // This means there are no records in the partition, which is perfectly normal
                        return new List<TaskItem>();
                    }
                }
                throw ex;
            }
        }

        public async Task<TaskItem> InsertItemAsync(TaskItem item)
        {
            item.UserId = serviceAccess.UserId;
            var result = await DocumentClient.CreateDocumentAsync(CollectionLink, item);
            item.Id = result.Resource.Id;
            return item;
        }

        public async Task<TaskItem> UpdateItemAsync(TaskItem item)
        {
            var uri = UriFactory.CreateDocumentUri(serviceAccess.Database, serviceAccess.Collection, item.Id);
            var result = await DocumentClient.ReplaceDocumentAsync(uri, item);
            return item;
        }
    }
}
