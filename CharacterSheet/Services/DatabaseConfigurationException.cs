using System;

namespace CharacterSheet.Services
{
    /// <summary>
    /// Exception that is thrown when the database is not configured properly in config.json
    /// </summary>
    public class DatabaseConfigurationException : Exception
    {
        /// <summary>
        /// Create a new DatabaseConfigurationException with a custom message
        /// </summary>
        /// <param name="message">The new nessage</param>
        public DatabaseConfigurationException(string message) : base(message)
        {
        }
    }
}