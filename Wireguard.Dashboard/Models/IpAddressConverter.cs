using System;
using System.Linq.Expressions;
using System.Net;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.ValueGeneration;

namespace Wireguard.Dashboard.Models
{
    public class IpAddressConverter : ValueConverter<IPAddress, byte[]>
    {
        public IpAddressConverter() : base(IpToBytes, BytesToIpAddress, new ConverterMappingHints(IPAddress.IPv6Any.GetAddressBytes().Length))
        {
        }

        public static readonly Expression<Func<IPAddress, byte[]>> IpToBytes = ipAddress => ipAddress.GetAddressBytes();
        public static readonly Expression<Func<byte[], IPAddress>> BytesToIpAddress = bytes => new IPAddress(bytes);
    }
}