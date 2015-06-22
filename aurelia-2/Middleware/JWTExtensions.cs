using aurelia_2.Middleware;

namespace Microsoft.AspNet.Builder
{
    public static class JWTExtensions
    {
        public static IApplicationBuilder UseJsonWebTokenAuthorization(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<JsonWebTokenAuthorization>();
        }
    }
}