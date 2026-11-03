import {describe,it,expect} from 'vitest';
import {comparePacketSteps} from './packetChanges';
import {steps} from './data';
describe('packet panel differences preserve routing and NAT semantics',()=>{
  it('highlights only the changed NAT address at the six existing NAT stages',()=>{
    for(const [index,field] of [[1,'source'],[8,'destination'],[11,'source'],[16,'destination'],[19,'source'],[24,'destination']] as const){
      const diff=comparePacketSteps(index-1,index);
      expect(diff.changed).toEqual([field]);expect(diff.newPacket).toBe(false);
    }
  });
  it('never highlights unchanged IPs at normal forwarding steps',()=>{
    for(let index=1;index<steps.length;index++){
      const previous=steps[index-1],current=steps[index];
      if(previous.p===current.p&&!['home','firewall'].includes(current.node))expect(comparePacketSteps(index-1,index).changed).toEqual([]);
    }
  });
  it('distinguishes a different communication phase from NAT and compares backward movement',()=>{
    expect(comparePacketSteps(4,5).newPacket).toBe(true);
    expect(comparePacketSteps(9,10).changed).toContain('protocol');
    expect(comparePacketSteps(17,18).changed).not.toContain('protocol');
    expect(comparePacketSteps(2,1).changed).toEqual([]);
    expect(comparePacketSteps(16,15).changed).toEqual(['destination']);
    expect(comparePacketSteps(0,0).changed).toEqual([]);
  });
});
