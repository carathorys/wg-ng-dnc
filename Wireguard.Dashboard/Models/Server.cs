﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Runtime.CompilerServices;

namespace Wireguard.Dashboard.Models
{
    public class Server: IEntity
    {
        /// <summary>
        /// (Optional) The public IP address of this host
        /// </summary>
        public IPAddress PublicIp { get; set; }

        /// <summary>
        /// The port which should be used to listen incoming connections
        /// </summary>
        public ushort? Port { get; set; }

        /// <summary>
        /// The network adapter which should be used to forward the traffic
        /// </summary>
        [MaxLength(255)]
        public string NetworkAdapter { get; set; }

        /// <summary>
        /// Virtual IP address of the server
        /// </summary>
        public IPAddress VirtualAddress { get; set; }

        /// <summary>
        /// Wireguard adapter name
        /// </summary>
        [MaxLength(255)]
        public string WireguardAdapterName { get; set; }

        /// <summary>
        /// IP range to be used
        /// </summary>
        public byte CIDR { get; set; }

        /// <summary>
        /// Enable SecureDNS
        /// </summary>
        public bool EnableSecureDns { get; set; }

        /// <summary>
        /// SecureDNS address 
        /// </summary>
        public IPAddress SecureDnsAddress { get; set; }

        public Guid Id { get; set; }
        // public ApplicationUser CreatedBy { get; set; }
        // public ApplicationUser UpdatedBy { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}