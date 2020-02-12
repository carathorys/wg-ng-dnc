using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Net;
using System.Security;

namespace Wireguard.Dashboard.Models
{
    public class Peer: IEntity
    {
        /// <summary>
        /// The ID of the peer
        /// </summary>
        public Guid Id { get; set; }

        // public ApplicationUser CreatedBy { get; set; }
        // public ApplicationUser UpdatedBy { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }

        /// <summary>
        /// Publicly visible name of the device
        /// </summary>
        [MaxLength(255)]
        public string DeviceName { get; set; }

        /// <summary>
        /// Public key of the device
        /// </summary>
        [NotMapped]
        public string PublicKey { get; }

        /// <summary>
        /// PreShared key
        /// </summary>
        [MaxLength(255)]
        public string PreSharedKey { get; set; }

        /// <summary>
        /// PrivateKey of the device
        /// </summary>
        [MaxLength(255)]
        public string PrivateKey { get; set; }

        /// <summary>
        /// Virtual IP address of the device
        /// </summary>
        [Column(TypeName = "binary(8)")]
        public IPAddress VirtualIp { get; set; }
    }
}