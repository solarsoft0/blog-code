using System;
using System.Collections.Generic;

namespace TaskList.Helpers
{
    public sealed class ServiceLocator
    {
        static readonly Lazy<ServiceLocator> instance = new Lazy<ServiceLocator>(() => new ServiceLocator());
        readonly Dictionary<Type, Lazy<object>> registeredServices = new Dictionary<Type, Lazy<object>>();

        private static ServiceLocator Instance => instance.Value;

        public static void Add<TContract, TService>() where TService : new()
        {
            Instance.InternalAdd<TContract, TService>();
        }

        public static T Resolve<T>() where T : class
        {
            return Instance.InternalResolve<T>();
        }

        private void InternalAdd<TContract, TService>() where TService : new()
        { 
            registeredServices[typeof(TContract)] = new Lazy<object>(() => Activator.CreateInstance(typeof(TService)));
        }

        /// <summary>
        /// Resolve the service type into the implementation.  This assumes the key used to register the
        /// object is of the appropriate type - throws InvalidCastException if you get this wrong (at runtime)
        /// </summary>
        /// <typeparam name="T">The type of service</typeparam>
        /// <returns>The service implementation</returns>
        public T InternalResolve<T>() where T : class
        {
            Lazy<object> service;
            if (registeredServices.TryGetValue(typeof(T), out service))
            {
                return (T)service.Value;
            }
            return null;
        }
    }
}