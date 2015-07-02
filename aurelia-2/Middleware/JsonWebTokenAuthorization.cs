using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Http;
using Microsoft.Framework.ConfigurationModel;
using Newtonsoft.Json;

namespace aurelia_2.Middleware
{
    public class JsonWebTokenAuthorization
    {
        private readonly RequestDelegate next;
        private readonly IConfiguration config;
        private const string xmlString = "http://www.w3.org/2001/XMLSchema#string";

        public JsonWebTokenAuthorization(RequestDelegate next)
        {
            this.next = next;
            this.config = Startup.Configuration;
        }

        public Task Invoke(HttpContext context)
        {
            if (context.Request.Headers.ContainsKey("Authorization"))
            {
                var authHeader = context.Request.Headers["Authorization"];
                var authBits = authHeader.Split(' ');
                if (authBits.Length != 2)
                {
                    Debug.WriteLine("[JsonWebTokenAuthorization] Ignoring Bad Authorization Header (count!=2)");
                    return next(context);
                }
                if (!authBits[0].ToLowerInvariant().Equals("bearer"))
                {
                    Debug.WriteLine("[JsonWebTokenAuthorization] Ignoring Bad Authorization Header (type!=bearer)");
                    return next(context);
                }

                string claims;
                try
                {
                    var b64secret = config.Get("Auth0:ClientSecret").Replace('_', '/').Replace('-', '+');
                    var secret = Convert.FromBase64String(b64secret);
                    claims = JWT.JsonWebToken.Decode(authBits[1], secret);
                }
                catch (JWT.SignatureVerificationException)
                {
                    Debug.WriteLine("[JsonWebTokenAuthorization] Ignoring Bad Authorization (JWT signature doesn't match)");
                    return next(context);
                }
                catch (FormatException)
                {
                    Debug.WriteLine("[JsonWebTokenAuthorization] Ignoring Bad Client Secret");
                    return next(context);
                }

                var jwt = JsonConvert.DeserializeObject<JsonWebToken>(claims,new JsonSerializerSettings
                {
                    MissingMemberHandling = MissingMemberHandling.Ignore
                });

                var identity = new ClaimsIdentity(
                    new[]
                    {
                        new Claim(ClaimTypes.NameIdentifier, jwt.Subject, xmlString, jwt.Issuer),
                        new Claim(ClaimTypes.Name, jwt.Subject, xmlString, jwt.Issuer),
                        new Claim(ClaimTypes.UserData, claims, xmlString, jwt.Issuer)
                    },
                    jwt.Issuer,
                    ClaimsIdentity.DefaultNameClaimType,
                    ClaimsIdentity.DefaultRoleClaimType);
                context.User.AddIdentity(identity);

                Debug.WriteLine("[JsonWebTokenAuthorization] JWT Decoded");
            }
            Debug.WriteLine("In JsonWebTokenAuthorization.Invoke");
            return next(context);
        }
    }
}
