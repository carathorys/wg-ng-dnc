using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Wireguard.Dashboard.Data.Migrations
{
    public partial class PeerTableAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Server",
                keyColumn: "Id",
                keyValue: new Guid("cdaa7c28-014a-4d2d-982e-86bf9ab3b6bf"));

            migrationBuilder.CreateTable(
                name: "Peer",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DeviceName = table.Column<string>(nullable: true),
                    PreSharedKey = table.Column<string>(nullable: true),
                    PrivateKey = table.Column<string>(nullable: true),
                    VirtualIp = table.Column<byte[]>(type: "binary(8)", fixedLength: true, maxLength: 16, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Peer", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Server",
                columns: new[] { "Id", "CIDR", "EnableSecureDns", "NetworkAdapter", "Port", "PublicIp", "SecureDnsAddress", "VirtualAddress", "WireguardAdapterName" },
                values: new object[] { new Guid("888b5fb9-a897-4081-b08a-5427047dd0fb"), (byte)24, false, "eth0", (ushort)8019, new byte[] { 0, 0, 0, 0 }, null, new byte[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 }, "wg0" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Peer");

            migrationBuilder.DeleteData(
                table: "Server",
                keyColumn: "Id",
                keyValue: new Guid("888b5fb9-a897-4081-b08a-5427047dd0fb"));

            migrationBuilder.InsertData(
                table: "Server",
                columns: new[] { "Id", "CIDR", "EnableSecureDns", "NetworkAdapter", "Port", "PublicIp", "SecureDnsAddress", "VirtualAddress", "WireguardAdapterName" },
                values: new object[] { new Guid("cdaa7c28-014a-4d2d-982e-86bf9ab3b6bf"), (byte)24, false, "eth0", (ushort)8019, new byte[] { 0, 0, 0, 0 }, null, new byte[] { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 }, "wg0" });
        }
    }
}
