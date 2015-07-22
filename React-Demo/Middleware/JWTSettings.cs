using Newtonsoft.Json;

namespace React_Demo.Middleware
{
    public class JWTSettings
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
