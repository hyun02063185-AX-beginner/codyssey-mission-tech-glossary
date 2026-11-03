import {describe,it,expect} from 'vitest';
import {compareNetworks,ipv4Number,ipv4Text,networkAddress,prefixMask} from './ipv4';
describe('IPv4 prefix masks and network comparison',()=>{
  it.each([
    [16,'255.255.0.0',['192.168.0.0','192.168.0.0'],true],
    [24,'255.255.255.0',['192.168.1.0','192.168.2.0'],false],
    [26,'255.255.255.192',['192.168.1.0','192.168.2.0'],false],
  ] as const)('/%s calculates the requested example', (prefix,mask,networks,same)=>{
    expect(compareNetworks(prefix)).toEqual({mask,networks:[...networks],same});
  });
  it('uses bits for arbitrary addresses and partial octets, including /0 and /32',()=>{
    expect(networkAddress('10.20.30.40',12)).toBe('10.16.0.0');
    expect(networkAddress('192.168.1.63',26)).toBe('192.168.1.0');
    expect(networkAddress('192.168.1.64',26)).toBe('192.168.1.64');
    expect(networkAddress('255.255.255.255',0)).toBe('0.0.0.0');
    expect(networkAddress('255.255.255.255',32)).toBe('255.255.255.255');
    expect(prefixMask(0)).toBe(0);expect(prefixMask(32)).toBe(0xffffffff);
    expect(ipv4Text(ipv4Number('203.0.113.255'))).toBe('203.0.113.255');
  });
  it('rejects invalid IPv4 addresses and prefix lengths',()=>{
    for(const ip of ['192.168.1','256.1.1.1','-1.1.1.1','1..1.1','a.1.1.1'])expect(()=>ipv4Number(ip)).toThrow(RangeError);
    for(const prefix of [-1,33,24.5,NaN])expect(()=>prefixMask(prefix)).toThrow(RangeError);
  });
});
