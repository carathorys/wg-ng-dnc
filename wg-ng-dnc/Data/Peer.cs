using System;
using System.ComponentModel.DataAnnotations;

namespace wg_ng_dnc.Data
{
    public class Peer
    {
        [Key]
        public Guid Id { get; set; }
    }
} 