namespace TaskList.Models
{
    public class DocumentDbServiceAccess
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public string Host { get; set; }
        public string Collection { get; set; }
        public string Database { get; set; }
    }
}
