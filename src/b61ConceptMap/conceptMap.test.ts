import {describe,it,expect} from 'vitest';
import plan from '../../content/mission-concept-maps/main-m11/concept-map-plan-v0.1.md?raw';
import glossary from '../data/generated/glossary.json';
import {data,layout} from './adapter';
import {conceptHref,conceptPath,readConceptState,readMapReturn,learningHref,carryMapReturn} from './navigation';
import {screenHref} from '../b61Story/navigation';

describe('approved B6-1 content and geometry',()=>{
 it('matches all eleven concepts and twelve directed relationships in d948ecf',()=>{
  expect(data.nodes).toHaveLength(11);expect(data.relations).toHaveLength(12);expect(data.comparisons).toHaveLength(3);
  expect(data.areas.map(a=>a.label)).toEqual(['데이터 관계','데이터 구조','중심','데이터 활용']);
  expect(data.relations.filter(r=>r.core)).toHaveLength(7);
  expect(new Set(data.relations.map(r=>r.type))).toEqual(new Set(['포함','역할']));
  const rows=plan.split('\n').filter(l=>/^\| R\d\d \|/.test(l)).map(l=>l.split('|').slice(1,-1).map(x=>x.trim()));
  for(const row of rows){const r=data.relations.find(r=>r.id===row[0])!;expect(r.type).toBe(row[2]);expect(r.label).toBe(row[3]);expect(r.description).toBe(row[4]);
   const from=data.nodes.find(n=>n.id===r.from)!,to=data.nodes.find(n=>n.id===r.to)!;
   expect(row[1].replace('PK','기본키').replace('FK','외래키')).toBe(`${from.label} → ${to.label}`);
  }
  for(const n of data.nodes){expect(plan).toContain(n.easy);expect(layout.positions.has(n.id)).toBe(true);}
  expect(data.relations.some(r=>r.from==='join'&&['pk','fk'].includes(r.to))).toBe(false);
 });
 it('only links actual dictionary terms and preserves extension/none policy',()=>{
  expect(data.nodes.filter(n=>n.glossary.mode==='direct')).toHaveLength(7);
  expect(data.nodes.find(n=>n.id==='dbms')!.glossary.termId).toBeNull();
  for(const n of data.nodes)for(const id of [n.glossary.termId,...n.related].filter(Boolean))expect(glossary.some(t=>t.id===id&&t.hasDetailedContent)).toBe(true);
  // Every routed segment stays outside the interior of all eleven cards.
  for(const r of layout.routes.values())for(let i=1;i<r.points.length;i++){
   const [a,b]=[r.points[i-1],r.points[i]];
   for(const p of layout.positions.values())expect(a[0]===b[0]?a[0]>p.x&&a[0]<p.x+p.width&&Math.max(a[1],b[1])>p.y&&Math.min(a[1],b[1])<p.y+p.height:a[1]>p.y&&a[1]<p.y+p.height&&Math.max(a[0],b[0])>p.x&&Math.min(a[0],b[0])<p.x+p.width).toBe(false);
  }
 });
});
describe('allowlisted learning round trips',()=>{
 it('carries all twelve validated Story positions through map, term and guide',()=>{
  for(let i=0;i<12;i++){
   const href=conceptHref(i)+'&node=join',s=readConceptState('?'+href.split('?')[1]);
   expect(s.origin).toBe(screenHref(i).split('?')[1]);
   for(const path of ['/terms/join','/missions/main-M11/guide/06-sql-joins']){
    const out=learningHref(path,s.canonical),back=readMapReturn(path,'?'+out.split('?')[1]);expect(back?.canonical).toBe(s.canonical);
    const onward=carryMapReturn('/missions/main-M11/guide/03-keys-relations',path,'?'+out.split('?')[1]);expect(readMapReturn(onward.split('?')[0],'?'+onward.split('?')[1])?.canonical).toBe(s.canonical);
   }
  }
 });
 it.each(['?node=bad','?node=pk&node=fk','?relation=R99','?return=https://evil.test','?b61-story=https://evil.test','?b61-story=scene%3D99%26screen%3D1','?b61-story=scene%3D01%26screen%3D1%26return%3Dhttps%3A%2F%2Fevil.test','?node=join&relation=R06','?'+ 'x'.repeat(3000)])('cleans malformed map input %s',q=>{
  const state=readConceptState(q);expect(state.notice).not.toBe('');expect(readConceptState(state.canonical.slice(conceptPath.length)).notice).toBe('');expect(state.canonical).not.toContain('evil.test');
 });
 it('rejects arbitrary destinations, nested payloads and returns on other missions',()=>{
  for(const p of ['/missions/main-M03/guide','/terms','//evil.test','/missions/main-M11/story'])expect(readMapReturn(p,'?b61-map=all')).toBeNull();
  for(const value of ['https://evil.test','/missions/main-M11/story/concepts','node=unknown','node=pk&node=fk','b61-map=all'])expect(readMapReturn('/terms/join','?'+new URLSearchParams({'b61-map':value}))).toBeNull();
  expect(readMapReturn('/terms/join','?b61-map=all&b61-map=all')).toBeNull();
 });
});
