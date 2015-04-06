using System;
using Microsoft.Framework.ConfigurationModel;

namespace CharacterSheet.Services
{
    public class WebConfiguration
    {
        private static AppLogger logger = new AppLogger(typeof(WebConfiguration).FullName);

        #region Singleton Design Pattern
        // Storage for the singleton element
        private static WebConfiguration instance = null;

        /// <summary>
        /// Returns the Singleton object
        /// </summary>
        public static WebConfiguration Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new WebConfiguration();
                }
                return instance;
            }
        }
        #endregion

        /// <summary>
        /// Constructor for the WebConfiguration object - only called
        /// from the singleton design pattern
        /// </summary>
        private WebConfiguration()
        {
            logger.Trace("Creating new WebConfiguration object");
        }

        // Storage for the configuration object
        private IConfiguration configuration = null;

        /// <summary>
        /// Set the configuration we are returning to the parameter
        /// </summary>
        /// <param name="configuration">The new configuration</param>
        public void SetConfiguration(IConfiguration configuration)
        {
            logger.Trace("New configuration received");
            this.configuration = configuration;
        }

        /// <summary>
        /// Determine if we are in development mode.  Assume we are not
        /// unless specific criteria are met.
        /// </summary>
        public bool DevelopmentMode
        {
            get
            {
                // No configuration set should never happen so assume development mode
                if (this.configuration == null)
                    return true;
                string s;
                var found = this.configuration.TryGet("Mode:Development", out s);
                if (found)
                {
                    // If Mode:Development == true then we are in development mode
                    return s.ToLower().Equals("true");
                }
                // Anything else and we are not in development mode
                return false;
            }
        }

        /// <summary>
        /// Returns the database instance.
        /// </summary>
        /// <exception cref="DatabaseConfigurationException">If no database instance configured</exception>
        public string DatabaseInstance
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Database:Instance", out s);
                if (!found)
                {
                    throw new DatabaseConfigurationException("Database:Instance configuration not found");
                }
                return s;
            }
        }

        /// <summary>
        /// Returns the database name.
        /// </summary>
        /// <exception cref="DatabaseConfigurationException">If no database name configured</exception>
        public string DatabaseName
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Database:Name", out s);
                if (!found)
                {
                    throw new DatabaseConfigurationException("Database:Name configuration not found");
                }
                return s;
            }
        }

        /// <summary>
        /// Returns the database options  Return the empty string if not set.
        /// </summary>
        public string DatabaseOptions
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Database:Options", out s);
                if (!found)
                {
                    return "";
                }
                return s;
            }
        }

        /// <summary>
        /// Returns the composite database connection string.
        /// </summary>
        /// <exception cref="DatabaseConfigurationException">If the config file does not hold all the information required</exception>
        public string DatabaseConnectionString
        {
            get
            {
                return String.Format("Server={0};Database={1};{2}",
                    DatabaseInstance, DatabaseName, DatabaseOptions);
            }
        }

        /// <summary>
        /// Returns the admin role name (if configured): default = admin
        /// </summary>
        public string AdminRole
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Identity:AdminRole", out s);
                return found == true ? s : "admin";
            }
        }

        /// <summary>
        /// Returns the admin user name (if configured): default = admin
        /// </summary>
        public string AdminUser
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Identity:AdminUser", out s);
                return found == true ? s : "admin";
            }
        }

        /// <summary>
        /// Returns the admin user password (if configured): default = admin
        /// </summary>
        public string AdminPassword
        {
            get
            {
                string s;
                var found = this.configuration.TryGet("Identity:AdminPassword", out s);
                return found == true ? s : "Chang3Me!";
            }
        }
    }
}