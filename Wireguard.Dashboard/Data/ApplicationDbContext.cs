using System;
using IdentityServer4.EntityFramework.DbContexts;
using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Wireguard.Dashboard.Models;

namespace Wireguard.Dashboard.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
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
        public DbSet<Peer> Peers { get; set; }
    }
}