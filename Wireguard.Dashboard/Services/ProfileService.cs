using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Extensions;
using IdentityServer4.Models;
using IdentityServer4.Services;

namespace Wireguard.Dashboard.Services
{
    public class ProfileService : IProfileService
    {
        public Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            var claims = new List<Claim>
            {
                new Claim("userId", context.Subject.GetSubjectId()),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Authentication),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Email),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Name),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.GivenName),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.Surname),
                context.Subject.Claims.SingleOrDefault(x => x.Type == ClaimTypes.System),
            };

            context.AddRequestedClaims(claims);
            return Task.CompletedTask;
        }

        public Task IsActiveAsync(IsActiveContext context)
        {
            context.IsActive = true;
            return Task.CompletedTask;
        }
    }
}