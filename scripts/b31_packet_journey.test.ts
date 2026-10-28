import {describe,it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {createHash} from 'node:crypto';
import {definitions,links,phases,steps,packet,description,decision,natChange,routeReason,topology,traces} from '../src/b31PacketJourney/data';

const original='drafts/b3-1-packet-journey/original/b3-1-network-animation-handoff/';
const source=readFileSync(original+'network-packet-journey.source.html','utf8');
// Run the supplied data/functions, not a second hand-authored expected model.
const code=source.slice(source.indexOf('    const definitions ='),source.indexOf('    function zone('));
const reference=runInNewContext(code+`;({definitions,links,phases,steps,states:steps.map(s=>({packet:packet(s),description:description(s),decision:decision(s)}))})`,{window:{matchMedia:()=>({matches:false})}});
const plain=(value:unknown)=>JSON.parse(JSON.stringify(value));
describe('Owner handoff contract: all 26 original stages',()=>{
  it('preserves the supplied ZIP and source as evidence',()=>{
    expect(createHash('sha256').update(readFileSync('drafts/b3-1-packet-journey/handoff.zip')).digest('hex')).toBe('b811dbb9c6a12aea6368d299ba2d831b73bd623cd904a20cd7131c065452de5d');
    expect(createHash('sha256').update(source).digest('hex')).toBe('24e3c557520bb57a6044648d985a1445da1dba2a3a4324066f732fbef7430410');
  });
  it('keeps topology, phase routes, device rules and packet calculations identical',()=>{
    expect(definitions).toEqual(plain(reference.definitions));expect(links).toEqual(plain(reference.links));expect(phases).toEqual(plain(reference.phases));expect(steps).toEqual(plain(reference.steps));
    expect(steps.map(s=>({packet:packet(s),description:description(s),decision:decision(s)}))).toEqual(plain(reference.states));
    expect(phases.map(p=>p.route.length)).toEqual([5,5,8,8]);expect(steps).toHaveLength(26);
  });
  it('shows reversible NAT mappings at six processing stages',()=>{
    const changes=steps.flatMap((s,i)=>natChange(s)?[{step:i+1,...natChange(s)!}]:[]);
    expect(changes.map(c=>[c.step,c.before[c.field],c.after[c.field]])).toEqual([
      [2,'192.168.0.20:53000','203.0.113.10:61000'],[9,'203.0.113.10:61000','192.168.0.20:53000'],
      [12,'192.168.0.20:50000','203.0.113.10:62000'],[17,'198.51.100.80:80','10.20.10.20:80'],
      [20,'10.20.10.20:80','198.51.100.80:80'],[25,'203.0.113.10:62000','192.168.0.20:50000'],
    ]);
  });
  it('matches each router destination to the selected next hop and a real connection',()=>{
    for(const s of steps.filter(s=>/^r\d$/.test(s.node)||s.node==='edge')){
      const selected=decision(s).rows.filter(r=>r[2]);expect(selected).toHaveLength(1);
      expect(routeReason(s)).toContain(packet(s).destination.split(':')[0]);expect(routeReason(s)).toContain(selected[0][0]);expect(routeReason(s)).toContain(selected[0][1]);
    }
    for(const phase of phases)phase.route.slice(1).forEach((node,i)=>expect(links.some(([a,b])=>a===phase.route[i]&&b===node||b===phase.route[i]&&a===node)).toBe(true));
    expect(decision(steps[21]).rows.find(r=>r[2])?.[1]).toBe('R3');
  });
  it('retains completed phases without highlighting future communication',()=>{
    expect(traces(0)).toEqual([]);expect(traces(5)).toHaveLength(4);expect(traces(5).every(t=>!t.current&&t.p===0)).toBe(true);
    expect(traces(10)).toHaveLength(8);expect(traces(18)).toHaveLength(15);expect(traces(25)).toHaveLength(22);
    expect(traces(25).filter(t=>t.current).map(t=>[t.from,t.to])).toContainEqual(['r4','r3']);
  });
  it.each([320,360,390,679,680,736,1144])('keeps all ten device boxes inside the %ipx topology without overlap',width=>{
    const t=topology(width),boxes=Object.entries(definitions).map(([id,d])=>{const [x,y]=t.positions[id as keyof typeof definitions];return {id,x:x-d.width/2,y:y-24,w:d.width,h:48};});
    for(const b of boxes){expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.w).toBeLessThanOrEqual(width);expect(b.y).toBeGreaterThanOrEqual(0);expect(b.y+b.h).toBeLessThanOrEqual(t.height);}
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(Math.min(a.x+a.w,b.x+b.w)>Math.max(a.x,b.x)&&Math.min(a.y+a.h,b.y+b.h)>Math.max(a.y,b.y),`${a.id}/${b.id}`).toBe(false);}
  });
});
