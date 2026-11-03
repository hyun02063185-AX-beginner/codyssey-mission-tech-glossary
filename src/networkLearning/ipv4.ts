// IPv4 values are unsigned: JavaScript bitwise operators otherwise return signed ints.
export function ipv4Number(address:string):number {
  const octets=address.split('.');
  if(octets.length!==4||octets.some(n=>!/^\d{1,3}$/.test(n)||Number(n)>255))throw new RangeError('Invalid IPv4 address');
  return octets.reduce((value,n)=>((value<<8)|Number(n))>>>0,0);
}
export function ipv4Text(value:number):string {
  return [24,16,8,0].map(shift=>(value>>>shift)&255).join('.');
}
export function prefixMask(prefix:number):number {
  if(!Number.isInteger(prefix)||prefix<0||prefix>32)throw new RangeError('Invalid IPv4 prefix');
  return prefix===0?0:(0xffffffff<<(32-prefix))>>>0;
}
export function networkAddress(address:string,prefix:number):string {
  return ipv4Text((ipv4Number(address)&prefixMask(prefix))>>>0);
}
export const exampleAddresses=['192.168.1.10','192.168.2.20'] as const;
export function compareNetworks(prefix:number){
  const networks=exampleAddresses.map(ip=>networkAddress(ip,prefix));
  return {mask:ipv4Text(prefixMask(prefix)),networks,same:networks[0]===networks[1]};
}
