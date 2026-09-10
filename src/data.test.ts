import { describe, expect, it } from 'vitest';
import glossary from './data/generated/glossary.json';
import missions from './data/generated/missions.json';
import webtoons from './data/generated/webtoons.json';
import openbook from './data/generated/openbook-main-m01.json';
import map from './data/generated/frontend-knowledge-map.json';
import m01Overlay from './data/generated/frontend-overlay-main-m01.json';
import m02Overlay from './data/generated/frontend-overlay-main-m02.json';
import gitMap from './data/generated/git-collaboration-knowledge-map.json';
import m04Overlay from './data/generated/git-collaboration-overlay-main-m04.json';
import dataMap from './data/generated/data-database-knowledge-map.json';
import m11Overlay from './data/generated/data-database-overlay-main-m11.json';
import linuxMap from './data/generated/linux-runtime-knowledge-map.json';
import m07Overlay from './data/generated/linux-runtime-overlay-main-m07.json';
import m08Overlay from './data/generated/linux-runtime-overlay-main-m08.json';
import devopsMap from './data/generated/devops-infrastructure-knowledge-map.json';
import prelimM01Overlay from './data/generated/devops-infrastructure-overlay-preliminary-m01.json';
import networkMap from './data/generated/network-web-protocol-knowledge-map.json';
import m05Overlay from './data/generated/network-web-protocol-overlay-main-m05.json';
import backendMap from './data/generated/backend-server-api-knowledge-map.json';
import m12Overlay from './data/generated/backend-server-api-overlay-main-m12.json';
import securityMap from './data/generated/security-identity-knowledge-map.json';
import m13Overlay from './data/generated/security-identity-overlay-main-m13.json';
import mapRegistry from './data/generated/map-registry.json';

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
  it('ships the expanded frontend field map while preserving the M01 Quick Term overlay',()=>{
    expect(map.nodes).toHaveLength(49);expect(map.edges).toHaveLength(63);
    expect(map.mapId).toBe('frontend');
    expect(map.nodes.filter(node=>node.nodeRole==='core')).not.toHaveLength(0);
    expect(map.nodes.filter(node=>node.nodeRole==='foundation')).not.toHaveLength(0);
    expect(map.nodes.filter(node=>node.nodeRole==='boundary')).not.toHaveLength(0);
    expect(m01Overlay.mapId).toBe('frontend');
    expect(m01Overlay.missionId).toBe('main-m01');
    expect(m01Overlay.nodeRefs.map(node=>node.termId).sort()).toEqual([...openbook.quick_terms].sort());
    expect(m02Overlay.mapId).toBe('frontend');expect(m02Overlay.missionId).toBe('main-m02');
    expect(m02Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['react','react-state','react-router','client-side-routing']));
    expect(map.learningRoutes).toHaveLength(7);
    expect(map.learningRoutes.every(route=>route.scope==='field')).toBe(true);
    expect(map.learningRoutes.find(route=>route.id==='theme-preference')?.nodeIds).toEqual(expect.arrayContaining(['term:dark-mode','term:javascript','term:local-storage']));
  });
  it('registers eight field maps and keeps the Wave 1 overlays intact',()=>{
    expect(mapRegistry.maps.filter(map=>map.status==='implemented').map(map=>map.mapId).sort()).toEqual(['backend-server-api','data-database','devops-infrastructure','frontend','git-collaboration','linux-runtime','network-web-protocol','security-identity']);
    expect(gitMap.nodes.length).toBeGreaterThanOrEqual(20);expect(gitMap.edges.length).toBeGreaterThan(15);expect(m04Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['git','pull-request','code-review','merge']));
    expect(dataMap.nodes.length).toBeGreaterThanOrEqual(20);expect(dataMap.edges.length).toBeGreaterThan(15);expect(m11Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['sql','table','primary-key','foreign-key','join']));
  });
  it('ships runtime and infrastructure maps with distinct M01 namespaces',()=>{
    expect(linuxMap.mapId).toBe('linux-runtime');expect(linuxMap.nodes.length).toBeGreaterThanOrEqual(20);
    expect(m07Overlay.missionId).toBe('main-m07');expect(m08Overlay.missionId).toBe('main-m08');
    expect(m08Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['process','thread','scheduler','cpu-usage']));
    expect(devopsMap.mapId).toBe('devops-infrastructure');expect(prelimM01Overlay.missionId).toBe('preliminary-m01');
    expect(prelimM01Overlay.missionId).not.toBe('main-m01');
  });
  it('ships protocol, backend, and identity mission overlays through the generic contract',()=>{
    expect(m05Overlay.mapId).toBe(networkMap.mapId);expect(m05Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['virtual-private-cloud','subnet','route-table']));
    expect(m12Overlay.mapId).toBe(backendMap.mapId);expect(m12Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['fastapi','crud','service-layer','sqlalchemy']));
    expect(m13Overlay.mapId).toBe(securityMap.mapId);expect(m13Overlay.nodeRefs.map(node=>node.termId)).toEqual(expect.arrayContaining(['authentication','json-web-token','oauth-2-0','authorization']));
    expect(mapRegistry.maps.filter(map=>map.status==='cross-field-layer').map(map=>map.mapId).sort()).toEqual(['developer-workflow-tools','programming-foundations']);
  });
});
