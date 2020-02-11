using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Security;

namespace Wireguard.Dashboard.Models
{
    public class Peer
    {
        /// <summary>
        /// The ID of the peer
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Publicly visible name of the device
        /// </summary>
        public string DeviceName { get; set; }

        /// <summary>
        /// Public key of the device
        /// </summary>
        [NotMapped]
        public string PublicKey { get; }

        /// <summary>
        /// PreShared key
        /// </summary>
        public string PreSharedKey { get; set; }

        /// <summary>
        /// PrivateKey of the device
        /// </summary>
        public string PrivateKey { get; set; }

        /// <summary>
        /// Virtual IP address of the device
        /// </summary>
        public IPAddress VirtualIp { get; set; }
    }
}