using Newtonsoft.Json;

namespace UserSecretWeb.Settings
{
    public class Auth0Settings
    {
        public string Domain
        {
            get;
            set;
        }

        public string ClientID
        {
            get;
            set;
        }

        [JsonIgnore]
        public string ClientSecret
        {
            get;
            set;
        }
    }
}
