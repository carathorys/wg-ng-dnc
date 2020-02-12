using System.Collections.Generic;
using System.Reflection;
using IdentityServer4.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Wireguard.Dashboard.Data;
using Wireguard.Dashboard.Services;
using Wireguard.Dashboard.Services.Validators;

namespace Wireguard.Dashboard
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var migrationsAssembly = typeof(Startup).GetTypeInfo().Assembly.GetName().Name;
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                    builder => { builder.CharSet(Pomelo.EntityFrameworkCore.MySql.Storage.CharSet.Utf8Mb4); });
            });

            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });

            services.AddControllers();

            services.AddIdentityServer(builder =>
                {
                    builder.InputLengthRestrictions.Password = ushort.MaxValue;
                    builder.Events.RaiseErrorEvents = true;
                    builder.Events.RaiseFailureEvents = true;
                    builder.Events.RaiseInformationEvents = true;
                    builder.Events.RaiseSuccessEvents = true;
                    builder.Discovery.ShowTokenEndpointAuthenticationMethods = true;
                })
                .AddDeveloperSigningCredential()
                .AddConfigurationStore(o =>
                {
                    o.ConfigureDbContext = b => b.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                        m =>
                        {
                            m.MigrationsAssembly(migrationsAssembly);
                            m.CharSet(Pomelo.EntityFrameworkCore.MySql.Storage.CharSet.Utf8Mb4);
                        });
                })
                .AddOperationalStore(o =>
                {
                    o.ConfigureDbContext = b => b.UseMySql(Configuration.GetConnectionString("DefaultConnection"),
                        m =>
                        {
                            m.MigrationsAssembly(migrationsAssembly);
                            m.CharSet(Pomelo.EntityFrameworkCore.MySql.Storage.CharSet.Utf8Mb4);
                        });
                })
                .AddResourceOwnerValidator<UsernamePasswordValidator>()
                .AddProfileService<ProfileService>();
                // .AddInMemoryClients(new[]
                // {
                //     new Client()
                //     {
                //         Enabled = true,
                //         ClientId = "ng_wg_dashboard2",
                //         ClientSecrets = new[] {new Secret("abc123")},
                //         RequireClientSecret = false,
                //         ProtocolType = "oidc",
                //
                //         ClientUri = "https://localhost:5001",
                //         RedirectUris = new[]
                //         {
                //             "https://localhost:5001/assets/signin-callback.html",
                //             "https://localhost:5001/assets/silent-refresh.html"
                //         },
                //         AccessTokenType = AccessTokenType.Jwt,
                // AllowedGrantTypes = GrantTypes.ResourceOwnerPassword
                //     }
                // })
                ;

            services.AddMemoryCache();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseIdentityServer();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                    // spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}