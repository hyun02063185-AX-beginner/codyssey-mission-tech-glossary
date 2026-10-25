import {describe,it,expect} from 'vitest';
import {graphForScope,areaBounds,scopeForNode,scopeForPair} from './scope';
import {explorerData,explorerLayout} from './adapter';
import {initialExplorer,readExplorer,explorerHref,validExplorerReturn} from './state';
import {fitBounds} from './camera';
const expected=[['area-execution',4,1],['area-structure',11,6],['area-responsibility',6,2],['area-storage',8,2],['area-iteration',6,6],['area-decoration',5,3],['area-validation',5,2]] as const;
describe('Area Focus independent display scope',()=>{
 it('preserves the complete graph and default meaning of legacy node/area URLs',()=>{
  const graph=graphForScope('all');expect([graph.nodes.length,graph.relations.length,graph.areas.length]).toEqual([45,24,7]);
  for(const query of ['node=generator','area=area-iteration','area=area-structure&node=generator']){
   const {state,notice}=readExplorer(query);expect(state.scope).toBe('all');expect(notice).toBe('');expect(explorerHref(state)).not.toContain('scope=');
  }
 });
 it.each(expected)('%s projects %i original nodes and %i internal relations', (id,nodes,relations)=>{
  const snapshot=JSON.stringify(explorerData),positions=JSON.stringify([...explorerLayout.positions]);
  const graph=graphForScope(id),ids=new Set(graph.nodes.map(n=>n.id));
  expect([graph.areas.length,graph.nodes.length,graph.relations.length]).toEqual([1,nodes,relations]);
  expect(graph.nodes.every(n=>n.area===id)).toBe(true);
  expect(graph.relations.every(r=>ids.has(r.from)&&ids.has(r.to))).toBe(true);
  expect(graph.external.every(r=>ids.has(r.from)!==ids.has(r.to))).toBe(true);
  expect(graph.relations.length+graph.external.length).toBe(explorerData.relations.filter(r=>ids.has(r.from)||ids.has(r.to)).length);
  const bounds=areaBounds(id);expect(Object.values(bounds).every(Number.isFinite)).toBe(true);
  for(const node of graph.nodes){const p=explorerLayout.positions.get(node.id)!;expect(p.x>=bounds.left&&p.y>=bounds.top&&p.x+p.width<=bounds.right&&p.y+p.height<=bounds.bottom).toBe(true);}
  expect(JSON.stringify(explorerData)).toBe(snapshot);expect(JSON.stringify([...explorerLayout.positions])).toBe(positions);
  const size={width:332,height:520},camera=fitBounds(size,bounds,true);
  expect(camera.scale*18).toBeGreaterThanOrEqual(13.5);expect(camera.x+size.width/camera.scale/2).toBeCloseTo((bounds.left+bounds.right)/2,10);expect(camera.y+size.height/camera.scale/2).toBeCloseTo((bounds.top+bounds.bottom)/2,10);
  const overview=fitBounds(size,bounds);expect(overview.x).toBeLessThan(bounds.left);expect(overview.x+size.width/overview.scale).toBeGreaterThan(bounds.right);
 });
 it('keeps in-area node choices focused and sends external nodes/pairs to the complete graph',()=>{
  expect(scopeForNode('all','generator')).toBe('all');expect(scopeForNode('area-iteration','generator')).toBe('area-iteration');expect(scopeForNode('area-structure','generator')).toBe('all');
  expect(scopeForPair('area-iteration',['iterator','generator'])).toBe('area-iteration');expect(scopeForPair('area-storage',['jsonl','generator'])).toBe('all');
 });
 it('round trips focused service/private bookmarks and the origin back context',()=>{
  const state={...initialExplorer,scope:'area-iteration',area:'area-iteration',node:'generator',origin:'scene=05&step=gen&back=6'};
  const href=explorerHref(state);expect(validExplorerReturn(href)).toBe(href);expect(readExplorer(href.split('?')[1]).state).toEqual(state);
 });
 it('never lets focused context hide a bookmarked node, external relation, cross-area comparison or instructor stop',()=>{
  for(const query of ['scope=area-structure&node=generator','scope=area-execution&relation=R04','scope=area-storage&comparison=C30','scope=area-storage&mode=guided&path=P3&at=1'])expect(readExplorer(query).state.scope).toBe('all');
  expect(readExplorer('scope=area-iteration&relation=R23').state.scope).toBe('area-iteration');
  expect(readExplorer('scope=area-iteration&comparison=C11').state.scope).toBe('area-iteration');
 });
 it.each(['scope=evil','scope=area-iteration&scope=area-structure','scope=https://evil.test'])('rejects invalid scope %s',query=>{expect(readExplorer(query).notice).not.toBe('');expect(validExplorerReturn('/concept-explorer?'+query)).toBeNull();});
});
