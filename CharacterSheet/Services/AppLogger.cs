using System;

namespace CharacterSheet.Services
{
    public class AppLogger
    {
        private string _className;

        public AppLogger(string className)
        {
            this._className = className;
        }

        public void Trace(string fmt, params string[] list)
        {
            Log("TRACE", fmt, list);
        }

        public void Debug(string fmt, params string[] list)
        {
            Log("DEBUG", fmt, list);
        }
        public void Info(string fmt, params string[] list)
        {
            Log("INFO", fmt, list);
        }
        public void Error(string fmt, params string[] list)
        {
            Log("ERROR", fmt, list);
        }
        public void Critical(string fmt, params string[] list)
        {
            Log("CRIT", fmt, list);
        }

        private void Log(string lvl, string fmt, params string[] list)
        {
            string msg = string.Format(fmt, list);
            System.Diagnostics.Debug.WriteLine(
                string.Format("### {0} [{1}] {2} # {3}", DateTime.Now, _className, lvl, msg));
        }
    }
}