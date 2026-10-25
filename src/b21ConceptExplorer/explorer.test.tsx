import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import candidate from '../../drafts/b2-1-story-map/scene-08/candidate-map.json';
import { explorerData, explorerLayout, nodeById, termForNode, nodeReviews, itemReviews, relatedRelations } from './adapter';
import { initialExplorer, readExplorer, explorerHref, validExplorerReturn } from './state';
import { parseStorySource } from '../b21StoryV3/links/returnAddress';
import { termConnections, heldTermIds } from '../b21StoryV3/links/catalog';
import ConceptExplorer from './ConceptExplorer';

describe('C1 source preservation and geometry adapter',()=>{
  it('preserves all source fields and original 7 areas, without teaching-area substitutions',()=>{
    expect(explorerData).toEqual(candidate);
    expect([explorerData.nodes.length,explorerData.relations.length,explorerData.comparisons.length,explorerData.areas.length]).toEqual([45,24,10,7]);
    expect(new Set(explorerData.nodes.map(n=>n.id)).size).toBe(45);
    expect(explorerData.areas.map(a=>a.id)).toEqual(['area-execution','area-structure','area-responsibility','area-storage','area-iteration','area-decoration','area-validation']);
    for(const r of explorerData.relations){expect(nodeById.has(r.from)&&nodeById.has(r.to)).toBe(true);expect(r.scope).toBeTruthy();}
    for(const c of explorerData.comparisons)expect(nodeById.has(c.left)&&nodeById.has(c.right)).toBe(true);
  });
  it('gets stable node slots and distinct reciprocal relation routes from the unchanged B3-1 engine',()=>{
    expect(explorerLayout.positions.size).toBe(45);expect(explorerLayout.routes.size).toBe(24);
    for(const p of explorerLayout.positions.values())expect(Object.values(p).every(Number.isFinite)).toBe(true);
    for(const r of explorerLayout.routes.values())expect(r.path).not.toMatch(/NaN|undefined|Infinity/);
    expect(explorerLayout.routes.get('R22')!.path).not.toBe(explorerLayout.routes.get('R41')!.path);
    expect(explorerData.relations.find(r=>r.id==='R23')!.type).toBe('종류');
    expect(explorerData.relations.find(r=>r.id==='R27')!.type).toBe('호출');
  });
  it('filters only actual incident relations and never creates comparison edges',()=>{
    expect(relatedRelations('generator').map(r=>r.id)).toEqual(['R23','R24']);
    expect(relatedRelations('generator','종류').map(r=>r.id)).toEqual(['R23']);
    expect(relatedRelations('cli')).toEqual([]);
    expect(explorerData.relations.some(r=>r.id==='C30')).toBe(false);
  });
});
describe('C1 evidence-based links',()=>{
  it('only reuses approved U4 terms and qualifications, keeping init and Iterable held',()=>{
    for(const n of explorerData.nodes){const term=termForNode(n);if(term){expect(termConnections).toContain(term);expect(heldTermIds).not.toContain(term.termId);}}
    expect(termForNode(nodeById.get('object-init')!)).toBeUndefined();
    expect(termForNode(nodeById.get('iterable')!)).toBeUndefined();
    expect(termForNode(nodeById.get('module')!)?.notice).toContain('JavaScript');
    expect(termForNode(nodeById.get('service')!)?.mode).toBe('extension');
  });
  it('never converts v2-only 03a/03b scenes; holds uncertain nodes, relations and comparisons',()=>{
    for(const id of ['object-init','function-call','index','ledger-main','return','module-dependency','call-flow'])expect(nodeReviews(id)).toEqual([]);
    expect(nodeReviews('crud')[0].target).toEqual({scene:'03',step:'1'}); // U4 evidence, not v2 03b conversion
    expect(nodeReviews('service')[0].target).toEqual({scene:'02',step:'2'}); // explicit v3 area projection
    for(const n of explorerData.nodes)for(const review of nodeReviews(n.id))expect(parseStorySource(new URLSearchParams({...review.target}).toString())).not.toBeNull();
    expect(explorerData.relations.filter(r=>itemReviews('relation',r.id).length).map(r=>r.id)).toEqual(['R09','R28','R37']);
    expect(explorerData.comparisons.filter(c=>itemReviews('comparison',c.id).length).map(c=>c.id)).toEqual(['C30','C13']);
    expect(itemReviews('relation','R17')).toEqual([]);expect(itemReviews('comparison','C20')).toEqual([]);
  });
});
describe('C1 private navigation state',()=>{
  it.each(candidate.teacherPaths)('preserves $id prompts and every guide stop',path=>{
    for(const [at,step] of path.steps.entries()){
      const state=readExplorer(new URLSearchParams({mode:'guided',path:path.id,at:String(at)}).toString()).state;
      expect(state.node).toBe(step.nodeId);expect(state.area).toBe(nodeById.get(step.nodeId)!.area);
      expect(readExplorer(explorerHref(state).split('?')[1]).state).toEqual(state);
    }
  });
  it('round trips the full selection plus original review back context',()=>{
    const state={...initialExplorer,area:'area-iteration',node:'generator',comparison:'C30',type:'種類',origin:'scene=05&step=gen&back=6'};
    // A valid type survives; unsupported values are diagnosed instead of becoming edges.
    state.type='종류';const href=explorerHref(state);
    expect(validExplorerReturn(href)).toBe(href);expect(readExplorer(href.split('?')[1]).state).toEqual(state);
    expect(validExplorerReturn('/concept-explorer?type=unknown')).toBeNull();
  });
  it.each(['https://evil.test','//evil.test','/concept-explorer-other','/concept-explorer?origin=https%3A%2F%2Fevil.test',
    '/concept-explorer?node=unknown','/concept-explorer?node=cli&node=module','/concept-explorer?return=/terms/cli','/concept-explorer?origin=scene%3D03a%26step%3D1'])('rejects untrusted return %s',value=>expect(validExplorerReturn(value)).toBeNull());
  it('renders the complete map immediately with collapsed panels and explicit held state, without guessed links',()=>{
    const render=(entry:string)=>renderToStaticMarkup(<MemoryRouter initialEntries={[entry]}><ConceptExplorer/></MemoryRouter>);
    const overview=render('/concept-explorer');expect(overview).toContain('지도 표시 범위');expect(overview).toContain('<svg');expect(overview.match(/data-explorer-node=/g)).toHaveLength(45);expect(overview.match(/data-explorer-relation=/g)).toHaveLength(24);expect(overview).not.toContain('b21ce-area-panel');expect(overview).toContain('id="b21ce-info-panel" hidden=""');
    const held=render('/concept-explorer?node=index');expect(held).toContain('강의 연결 보류');expect(held).toContain('용어사전 연결 보류');expect(held).not.toContain('/terms/');
    const rel=render('/concept-explorer?relation=R17');expect(rel).toContain('모든 설계의 강제 경로 아님');expect(rel).toContain('강의 연결 보류');
  });
});
