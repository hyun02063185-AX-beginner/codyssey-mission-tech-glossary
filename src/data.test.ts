import { describe, expect, it } from 'vitest';
import glossary from './data/generated/glossary.json';
import missions from './data/generated/missions.json';
import webtoons from './data/generated/webtoons.json';
import openbook from './data/generated/openbook-main-m01.json';
import map from './data/generated/frontend-knowledge-map.json';
import m01Overlay from './data/generated/frontend-overlay-main-m01.json';

describe('web glossary data',()=>{
  it('loads the curated corpus and M01 detailed coverage',()=>{
    expect(glossary).toHaveLength(549);expect(Object.keys(missions)).toHaveLength(16);expect(webtoons).toHaveLength(10);
    expect(glossary.filter(term=>term.hasDetailedContent)).toHaveLength(65);
    const quick=new Set(openbook.quick_terms);for(const term of glossary.filter(term=>quick.has(term.id)))expect(term.hasDetailedContent).toBe(true);
  });
  it('provides Deep content for the five published webtoon terms',()=>{
    for(const id of ['local-storage','javascript','dom','defer','fetch-api']){
      const term=glossary.find(t=>t.id===id);
      expect(term).toBeTruthy();
      for(const field of ['summary','easyExplanation','technicalExplanation','howItWorks','missionContext','codeExample','limitationsOrEdgeCases','commonMisconceptions','comparisons','peerReviewQuestions']){
        expect(String((term as Record<string,unknown>)[field]??'').trim()).not.toBe('');
      }
      expect(term!.hasWebtoon).toBe(true);
    }
    expect(glossary.find(t=>t.id==='masking')).toBeUndefined();
    expect(glossary.find(t=>t.id==='data-masking')?.missionRefs).toHaveLength(2);
  });
  it('publishes the five webtoon pilots with real images',()=>{
    const published=webtoons.filter(w=>w.hasImage);const candidates=webtoons.filter(w=>!w.hasImage);
    expect(published).toHaveLength(5);expect(candidates).toHaveLength(5);
    expect(published.map(w=>w.termId).sort()).toEqual(['defer','dom','fetch-api','javascript','local-storage']);
    for(const w of published){expect(w.imageSrc).toMatch(/^webtoons\/.+\.webp$/);expect(w.alt).not.toBe('')}
    for(const w of candidates){expect(w.imageSrc).toBe('')}
  });
  it('keeps M01 context complete and non-generic',()=>{
    const fields=['quick_explanation','mission_relevance','screen_check','code_check','peer_question','common_trap','aliases'];const contexts=openbook.quick_term_context as Record<string,Record<string,string|string[]>>;
    expect(openbook.quick_terms).toHaveLength(23);expect(Object.keys(contexts).sort()).toEqual([...openbook.quick_terms].sort());
    for(const id of openbook.quick_terms){const item=contexts[id];expect(Object.keys(item).sort()).toEqual([...fields].sort());for(const field of fields.filter(field=>field!=='aliases'))expect((item[field] as string).trim()).not.toBe('');}
  });
  it('resolves canonical terms and aliases to M01 context cards',()=>{
    const contexts=openbook.quick_term_context as Record<string,{aliases:string[]}>;const normalize=(value:string)=>value.toLowerCase().replace(/[\s_.\-/]/g,'');const find=(query:string)=>glossary.find(term=>contexts[term.id]&&[term.termKo,term.termEn,...term.aliases,...contexts[term.id].aliases].some(value=>normalize(value)===normalize(query)))?.id;
    for(const [query,id] of Object.entries({JavaScript:'javascript',HTML:'html',DOM:'dom',localStorage:'local-storage','Intersection Observer':'intersection-observer-api','GitHub API':'github-api',로컬스토리지:'local-storage','이벤트 리스너':'add-event-listener'}))expect(find(query)).toBe(id);
  });
  it('ships the frontend field map and derives the M01 overlay from its Quick Terms',()=>{
    expect(map.nodes).toHaveLength(37);expect(map.edges).toHaveLength(50);
    expect(map.mapId).toBe('frontend');
    expect(map.nodes.filter(node=>node.nodeRole==='core')).not.toHaveLength(0);
    expect(map.nodes.filter(node=>node.nodeRole==='foundation')).not.toHaveLength(0);
    expect(map.nodes.filter(node=>node.nodeRole==='boundary')).not.toHaveLength(0);
    expect(m01Overlay.mapId).toBe('frontend');
    expect(m01Overlay.missionId).toBe('main-m01');
    expect(m01Overlay.nodeRefs.map(node=>node.termId).sort()).toEqual([...openbook.quick_terms].sort());
    expect(map.learningRoutes).toHaveLength(4);
    expect(map.learningRoutes.every(route=>route.scope==='field')).toBe(true);
    expect(map.learningRoutes.find(route=>route.id==='theme-preference')?.nodeIds).toEqual(expect.arrayContaining(['term:dark-mode','term:javascript','term:local-storage']));
  });
});
