using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wireguard.Dashboard.Data.Migrations.ApplicationDb
{
    public partial class InitialWgDashboardDbMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Peers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(nullable: false),
                    DeviceName = table.Column<string>(maxLength: 255, nullable: true),
                    PreSharedKey = table.Column<string>(maxLength: 255, nullable: true),
                    PrivateKey = table.Column<string>(maxLength: 255, nullable: true),
                    VirtualIp = table.Column<byte[]>(type: "binary(8)", fixedLength: true, maxLength: 16, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Peers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Server",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    PublicIp = table.Column<byte[]>(fixedLength: true, maxLength: 16, nullable: true),
                    Port = table.Column<ushort>(nullable: true),
                    NetworkAdapter = table.Column<string>(maxLength: 255, nullable: true),
                    VirtualAddress = table.Column<byte[]>(fixedLength: true, maxLength: 16, nullable: false),
                    WireguardAdapterName = table.Column<string>(maxLength: 255, nullable: true),
                    CIDR = table.Column<byte>(nullable: false),
                    EnableSecureDns = table.Column<bool>(nullable: false),
                    SecureDnsAddress = table.Column<byte[]>(fixedLength: true, maxLength: 16, nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Server", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Peers");

            migrationBuilder.DropTable(
                name: "Server");
        }
    }
}
