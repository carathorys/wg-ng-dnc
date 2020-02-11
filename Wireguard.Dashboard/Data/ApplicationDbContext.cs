using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Wireguard.Dashboard.Models;

namespace Wireguard.Dashboard.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            var converter = new IpAddressConverter();
            builder.Entity<Server>(e =>
            {
                e.Property(x => x.PublicIp)
                    .HasMaxLength(16)
                    .IsFixedLength()
                    .HasConversion(converter);

                e.Property(x => x.VirtualAddress)
                    .IsRequired()
                    .HasMaxLength(16)
                    .IsFixedLength()
                    .HasConversion(converter);

                e.Property(x => x.SecureDnsAddress)
                    .HasMaxLength(16)
                    .IsFixedLength()
                    .HasConversion(converter);

                e.HasData(new Server()
                {
                    Id = Guid.NewGuid(),
                    Port = 8019,
                    NetworkAdapter = "eth0",
                    PublicIp = IPAddress.Any,
                    VirtualAddress = IPAddress.IPv6Loopback,
                    EnableSecureDns = false,
                    WireguardAdapterName = "wg0",
                    CIDR = 24
                });
            });

            builder.Entity<Peer>(e =>
            {
                e.Property(x => x.VirtualIp)
                    .HasMaxLength(16)
                    .IsFixedLength()
                    .HasConversion(converter)
                    .IsRequired();
            });

            base.OnModelCreating(builder);
        }

        public DbSet<Server> Server { get; set; }
        // public DbSet<Peer> Peers { get; set; }
    }
}