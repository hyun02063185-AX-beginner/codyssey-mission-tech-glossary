import {describe,it,expect} from 'vitest';
import authored from '../../content/mission-stories/main-m01/storyboard-v0.2.md?raw';
import {intro,screens,authoredScreen,chapters} from './content';
import {guideHref,readStoryState,readGuideReturn,carryGuideReturn,screenHref} from './navigation';
import {conceptHref,referenceHref,readMapReturn,mapQuery,data} from '../b11ConceptMap/navigation';
import {adaptConceptMap,layoutConceptMap,readMapState} from '../missionConceptMap/conceptMapAdapter';
import baseline from '../../reports/b11-web/baseline-missions.json';
import {learningForMission} from '../missionLearning';
describe('B1-1 approved content and local navigation',()=>{
  it('reuses every approved screen, caption and teaching note without rewriting the source',()=>{
    expect(screens).toHaveLength(12);expect(new Set(screens.map(s=>s.scene)).size).toBe(4);expect(chapters).toHaveLength(9);
    expect(authored).toContain(intro.title);expect(authored).toContain(intro.question);
    for(const screen of screens){for(const value of [screen.title,screen.question,screen.message,screen.caption,screen.chip].filter(Boolean))expect(authored).toContain(value);for(const text of Object.values(authoredScreen(screen.id)))expect(text.length).toBeGreaterThan(20);}
  });
  it('round trips all 12 screens and rejects arbitrary return URLs, duplicate or malformed parameters',()=>{
    expect(readStoryState('').overview).toBe(true);
    for(let i=0;i<12;i++){
      expect(readStoryState(screenHref(i).split('?')[1]? '?'+screenHref(i).split('?')[1]:'').index).toBe(i);
      const guide=guideHref(i),[path,query]=guide.split('?');expect(readGuideReturn(path,'?'+query)).toBe(screenHref(i));
      expect(carryGuideReturn('/missions/main-M01/guide',path,'?'+query)).toContain('b11-story=');
      const map=conceptHref(i),params=new URLSearchParams({'b11-map':map.split('?')[1]});expect(readMapReturn('/terms/html','?'+params)?.canonical).toBe(map);
    }
    for(const search of ['?scene=9&screen=-1','?scene=1&scene=2','?return=https://evil.test','?scene=1&screen=2&x=3'])expect(readStoryState(search).notice).not.toBe('');
    for(const value of ['https://evil.test','node=unknown','node=N02&return=https://evil.test','node=N02&node=N03'])expect(readMapReturn('/terms/html','?'+new URLSearchParams({'b11-map':value}))).toBeNull();
  });
  it('makes every authored node/relation/comparison/extension reference reachable',()=>{
    for(const [i,screen] of screens.entries())for(const ref of screen.map){const url=referenceHref(i,ref),query=url.split('?')[1];expect(readMapState(data,new URLSearchParams(query)).state.selection).not.toBeNull();expect(mapQuery(query)).toBe(query);}
  });
  it('preserves all world coordinates when selecting or revealing supplementary concepts',()=>{
    const core=layoutConceptMap(adaptConceptMap(data,{view:'all',more:false,selection:null}));
    expect(core.positions.size).toBe(14);expect(data.relations).toHaveLength(21);expect(data.contrasts).toHaveLength(4);expect(data.nodes.flatMap(n=>n.extensions??[])).toHaveLength(5);
    for(const node of data.nodes){const layout=layoutConceptMap(adaptConceptMap(data,{view:'all',more:true,selection:{kind:'node',id:node.id}}));for(const [id,position]of core.positions)expect(layout.positions.get(id)).toEqual(position);}
    expect(data.relations.some(rel=>['N04','N05'].includes(rel.from)&&rel.to==='N11')).toBe(false);
    expect(data.nodes.find(node=>node.id==='N01')?.storyScenes).toEqual(['intro','S4-3']);
    expect(data.nodes.find(node=>node.id==='N13')?.storyScenes).toEqual(['S3-2','S4-2']);
  });
  it('keeps the original B1-1 introduction, question, guide and field map separate',()=>{
    const before=baseline.find(mission=>mission.id==='main-m01')!,after=learningForMission('main-m01')!;
    expect(after.intro).toBe(before.intro);expect(after.question).toBe(before.question);
    expect(after.materials.find(material=>material.kind==='guide')).toEqual(before.materials.find(material=>material.kind==='guide'));
    expect(after.materials.map(material=>material.href)).toEqual(['/missions/main-M01/story','/missions/main-M01/story/concepts','/missions/main-M01/guide']);
  });
});
