using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using IdentityServer4.Validation;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Wireguard.Dashboard.Services.Validators
{
    public class UsernamePasswordValidator : IResourceOwnerPasswordValidator
    {
        private readonly ILogger<UsernamePasswordValidator> _logger;

        public UsernamePasswordValidator(ILogger<UsernamePasswordValidator> logger)
        {
            _logger = logger;
        }

        public Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
        {
            context.Result = new GrantValidationResult(
                context.UserName,
                context.Request.GrantType,
                DateTime.Now,
                new[]
                {
                    new Claim(ClaimTypes.Authentication, context.Request.GrantType),
                    new Claim(ClaimTypes.Email, context.UserName),
                    new Claim(ClaimTypes.Name, "Who knows?"),
                })
            {
                IsError = false,
            };
            // TODO: Implement username/password validation;

            return Task.CompletedTask;
        }
    }
}