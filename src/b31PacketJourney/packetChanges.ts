import {packet,phases,steps} from './data';
export const packetFields=[['source','출발지 IP:포트'],['destination','목적지 IP:포트'],['protocol','프로토콜'],['payload','데이터 예시']] as const;
export function packetSnapshot(index:number){
  const step=steps[index],phase=phases[step.p];
  return {...packet(step),protocol:phase.protocol,payload:phase.payload};
}
export function comparePacketSteps(previous:number,current:number){
  const before=packetSnapshot(previous),after=packetSnapshot(current);
  return {before,changed:packetFields.map(([key])=>key).filter(key=>before[key]!==after[key]),newPacket:steps[previous].p!==steps[current].p};
}
