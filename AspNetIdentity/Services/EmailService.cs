using System;
using System.Diagnostics;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Framework.ConfigurationModel;

namespace AspNetIdentity.Services
{

    public class EmailService
    {
        #region Properties
        public string FromAddress
        {
            get;
            private set;
        }

        public string Hostname
        {
            get;
            private set;
        }

        public int Port
        {
            get;
            private set;
        }

        public string Encryption
        {
            get;
            private set;
        }

        public bool Authenticated
        {
            get;
            private set;
        }

        public string Username
        {
            get;
            private set;
        }

        public string Password
        {
            get;
            private set;
        }
        public bool IsConfigured
        {
            get;
            private set;
        }
        #endregion

        #region SetConfiguration
        public void SetConfiguration(IConfiguration config)
        {
            this.IsConfigured = false;
            string s;

            Debug.WriteLine("EmailConfiguration: Configuring Email Settings");
            if (config.TryGet("Email:Disabled", out s))
            {
                Debug.WriteLine("EmailConfiguration: Disabled field = " + s);
                if (s.Equals("true"))
                {
                    Debug.WriteLine("EmailConfiguration: Disabled is set to true - no email for you!");
                    return;
                }
            }

            if (!config.TryGet("Email:From", out s))
            {
                Debug.WriteLine("EmailConfiguration: No From Address - aborting!");
                return;
            }
            else
            {
                Debug.WriteLine("EmailConfiguration: From Address = " + s);
                this.FromAddress = s;
            }

            if (!config.TryGet("Email:Host", out s))
            {
                Debug.WriteLine("EmailConfiguration: No Host Address - aborting!");
                return;
            }
            else
            {
                Debug.WriteLine("EmailConfiguration: Host Address = " + s);
                this.Hostname = s;
            }

            if (!config.TryGet("Email:Port", out s))
            {
                Debug.WriteLine("EmailConfiguration: No Port - assuming port 25");
                this.Port = 25;
            }
            else
            {
                try
                {
                    this.Port = Int32.Parse(s);
                    if (this.Port < 1 || this.Port > 65534)
                    {
                        Debug.WriteLine("EmailConfiguration: Port " + s + " is out of range - aborting!");
                        return;
                    }
                }
                catch (Exception)
                {
                    Debug.WriteLine("EmailConfiguration: Port " + s + " was invalid - aborting!");
                    return;
                }

            }

            if (!config.TryGet("Email:Security", out s))
            {
                Debug.WriteLine("EmailConfiguration: No Security - assuming TLS");
                this.Encryption = "TLS";
            }
            else
            {
                this.Encryption = s.ToUpper();
                if (!this.Encryption.Equals("TLS"))
                {
                    Debug.WriteLine("EmailConfiguration: Only TLS Security is allowed right now");
                    this.Encryption = "TLS";
                }
            }

            this.IsConfigured = true;

            if (!config.TryGet("Email:Username", out s))
            {
                Debug.WriteLine("EmailConfiguration: Authentication Disabled (no username)");
                this.Authenticated = false;
                return;
            }
            else
            {
                Debug.WriteLine("EmailConfiguration: Authentication Username Found");
                this.Username = s;
            }

            if (!config.TryGet("Email:Password", out s))
            {
                Debug.WriteLine("EmailConfiguration: Authentication Disabled (no password)");
                this.Authenticated = false;
                return;
            }
            else
            {
                Debug.WriteLine("EmailConfiguration: Authentication Enabled");
                this.Password = s;
                this.Authenticated = true;
            }

        }
        #endregion

        public Task SendEmailAsync(string email, string subject, string message)
        {
            if (!this.IsConfigured)
            {
                Debug.WriteLine("EmailService is not configured");
                Debug.WriteLine("SendEmailAsync: " + message);
                return Task.FromResult(0);
            }

            SmtpClient client = new SmtpClient(this.Hostname, this.Port);
            client.EnableSsl = this.Encryption.Equals("TLS");
            if (this.Authenticated)
            {
                client.Credentials = new System.Net.NetworkCredential(this.Username, this.Password);
            }

            MailAddress fromAddr = new MailAddress(this.FromAddress);
            MailAddress toAddr = new MailAddress(email);
            MailMessage mailmsg = new MailMessage(fromAddr, toAddr);
            mailmsg.Body = message + "\r\n";
            mailmsg.BodyEncoding = System.Text.Encoding.UTF8;
            mailmsg.Subject = subject;
            mailmsg.SubjectEncoding = System.Text.Encoding.UTF8;

            Debug.WriteLine("SendEmailAsync: Sending email to " + email);
            Debug.WriteLine("SendEmailAsync: " + message);
            return client.SendMailAsync(mailmsg);
        }

        #region Singleton Design Pattern
        private static EmailService instance;

        private EmailService() { }

        public static EmailService Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new EmailService();
                }
                return instance;
            }
        }
        #endregion
    }

}