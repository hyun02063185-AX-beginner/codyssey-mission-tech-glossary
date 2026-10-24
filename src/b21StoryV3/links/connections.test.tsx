import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import B21StoryReturn from '../B21StoryReturn';
import B31LearningReturn from '../../B31LearningReturn';
import { scenes } from '../content';
import { routeURL } from '../routing/storyRoute';
import { termConnections, guideConnections, heldTermIds, extensionNotice } from './catalog';
import { connectionsForSource } from './contextLinks';
import { parseStorySource, readStoryReturn, storySource, termStoryHref } from './returnAddress';
import { missionGuidePaths } from '../../missionLearning';
import { guides } from '../../missionGuideContent';
import glossary from '../../data/generated/glossary.json';
import graph from '../../data/generated/encyclopedia-graph.json';
import registry from '../../data/generated/map-registry.json';

const markdownSources=import.meta.glob<string>('../../../content/terms/*.md',{query:'?raw',import:'default',eager:true});
const expected=['cli','module','repository-pattern','layered-architecture','crud','summary-aggregation','persistence','file-io','json-lines','csv','iterator','generator','yield','decorator','function','exception-handling','type-hint','input-validation'];
const source={scene:4,step:1,back:6,presenter:false};
const banner=(path:string)=>renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><B31LearningReturn/><B21StoryReturn/></MemoryRouter>);
describe('U4 sidecar and destination evidence',()=>{
  it('contains exactly 18 approved IDs and no held substitutions',()=>{
    expect(termConnections.map(t=>t.termId)).toEqual(expected);
    expect(new Set(expected).size).toBe(18);
    for(const id of heldTermIds){expect(expected).not.toContain(id);expect(()=>termStoryHref(id,source)).toThrow('Unapproved');}
  });
  it.each(expected)('matches %s Markdown, glossary and generated term node',id=>{
    const md=markdownSources[`../../../content/terms/${id}.md`];
    const term=glossary.find(t=>t.id===id)!;
    const node=(graph.nodes as unknown as Record<string,{termId?:string;labelKo:string;hasDetail?:boolean}>)[`term:${id}`];
    expect(node.termId).toBe(id);expect(node.labelKo).toBe(term.termKo);expect(node.hasDetail).toBe(true);
    expect([term.termKo,term.termEn,...term.aliases].map(x=>x.toLowerCase().trim())).toContain(md.match(/^# (.+)/m)?.[1].trim().toLowerCase());
    const plain=(s:string)=>s.replace(/[`*]/g,'').replace(/\s+/g,'');
    expect(plain(md)).toContain(plain(term.summary));
  });
  it('retains approved anchor steps and explicitly qualifies wider term scopes',()=>{
    for(const term of termConnections){
      for(const anchor of term.sources)expect(parseStorySource(new URLSearchParams({scene:anchor.scene,step:anchor.step}).toString())).not.toBeNull();
      if(term.mode==='extension')expect(term.notice?.length).toBeGreaterThan(20);
    }
    expect(termConnections.filter(t=>t.mode==='extension').map(t=>t.termId)).toEqual(['module','layered-architecture','summary-aggregation','json-lines','iterator','decorator','input-validation']);
    expect(extensionNotice).toContain('이 강의보다 넓');
    expect(termConnections.find(t=>t.termId==='summary-aggregation')?.notice).toContain('같은 계산 기능의 정의가 아닙니다');
  });
  it('validates all guide recommendations against actual mission path and chapters',()=>{
    expect(guides['main-M03'].guidePath).toBe(missionGuidePaths['main-m03']);
    for(const [scene,chapters] of Object.entries(guideConnections))for(const chapter of chapters){
      expect(guides['main-M03'].guideChapters.some(c=>c.id===chapter)).toBe(true);
      const links=connectionsForSource({scene:scenes.findIndex(s=>s.id===scene),step:0,back:null,presenter:false});
      expect(links.guides.map(g=>g.href)).toContain(`${missionGuidePaths['main-m03']}/${chapter}`);
    }
    expect(registry.maps.some(m=>m.mapId==='data-database'&&m.status==='implemented'&&m.availableMissions.includes('main-m03'))).toBe(true);
    expect(connectionsForSource({scene:3,step:0,back:null,presenter:false}).maps[0].href).toBe('/maps/data-database?mission=main-m03');
    expect(connectionsForSource({scene:0,step:0,back:null,presenter:false}).maps).toEqual([]);
  });
});
describe('strict Story return contract',()=>{
  it('round trips every step/term with one encoding, preserving semantic IDs and back',()=>{
    for(const [scene,s] of scenes.entries())for(const [step] of s.steps.entries())for(const term of expected){
      const route={scene,step,back:scene===7?null:6,presenter:true};
      const href=termStoryHref(term,route),[path,search]=href.split('?');
      expect(href).not.toContain('%25');expect(href).not.toContain('presenter');
      const parsed=readStoryReturn(path,'?'+search)!;
      expect(parsed).toEqual({...route,presenter:false});expect(routeURL(parsed)).toBe(routeURL({...route,presenter:false}));
    }
  });
  it('normalizes valid legacy numeric IDs but refuses invalid recovery contexts',()=>{
    expect(parseStorySource('step=2&scene=05')).toEqual({scene:4,step:15,back:null,presenter:false});
    expect(storySource(source)).toBe('scene=05&step=iterable&back=6');
    expect(parseStorySource('scene=08&step=6')).toEqual({scene:7,step:5,back:null,presenter:false});
  });
  it.each(['','scene=99&step=1','scene=05&step=missing','scene=05&step=0','scene=05','step=iterable','scene=05&step=iterable&back=0','scene=05&step=iterable&back=18','scene=08&step=6&back=6','scene=05&step=iterable&view=presenter','scene=05&step=iterable&b21-story=scene=01','scene=05&step=iterable&b31-map=x','scene=05&scene=06&step=iterable','https://evil.test','//evil.test','/missions/main-M03/story?scene=05&step=iterable','scene%3D05%26step%3Diterable','scene=05&step=iterable%2526back%253D6','scene=05&step=iterable#x','x'.repeat(513)])('rejects unsafe payload %s',value=>expect(parseStorySource(value)).toBeNull());
  it('renders only on real connected term routes; B3-1 always has priority',()=>{
    const href=termStoryHref('iterator',source);
    expect(banner(href)).toContain('B2-1 Story로 돌아가기');
    expect(banner(href)).toContain('Scene 05 · 2단계');
    expect(banner(href+'&b31-map=node%3Dvpc')).toContain('B3-1 개념지도로 돌아가기');
    expect(banner(href+'&b31-map=node%3Dvpc')).not.toContain('B2-1 Story로 돌아가기');
    expect(banner(href+'&b31-map=')).not.toContain('B2-1 Story로 돌아가기');
    expect(banner(href+'&b21-story=scene%3D01%26step%3D1')).not.toContain('B2-1 Story로 돌아가기');
    for(const path of ['/terms/loop','/terms/iterator/more','/terms','/maps/data-database','/missions/main-M03/story'])expect(banner(path+'?'+href.split('?')[1])).not.toContain('B2-1 Story로 돌아가기');
  });
  it('builds Scene 08 and review links with the actual current source, not the catalog anchor',()=>{
    for(const route of [{scene:7,step:5,back:null,presenter:false},source]){
      const links=connectionsForSource(route);
      expect(links.terms.some(t=>t.termId==='generator')).toBe(true);
      for(const link of links.terms)expect(readStoryReturn(link.href.split('?')[0],'?'+link.href.split('?')[1])).toEqual(route);
    }
  });
});
