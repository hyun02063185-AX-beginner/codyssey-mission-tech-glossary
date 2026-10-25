import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { scenes } from '../b21StoryV3/content';
import { InstructorNotes } from '../b21StoryV3/components/InstructorNotes';
import { FigS8 } from '../b21StoryV3/figures/ApprovedFigures';
import { FigureContext } from '../b21StoryV3/figures/FigureContext';
import { LearningServiceConnected, serviceMapCaption, serviceNote } from './availability';
import { b21ConceptPath, b21PreviewConceptPath, b21StoryPath } from './paths';
import { explorerHref, explorerTrail, initialExplorer, readExplorer, validExplorerReturn } from '../b21ConceptExplorer/state';
import { learningDestinationHref, readExplorerTermReturn, readLearningReturn, readReviewReturn } from './returnContext';
import { presenterURL } from '../b21StoryV3/routing/presenterURL';
import { routeURL } from '../b21StoryV3/routing/storyRoute';
import { termStoryHref } from '../b21StoryV3/links/returnAddress';
import { guideConnections } from '../b21StoryV3/links/catalog';
import { learningMissions, learningForMission, materialLabel } from '../missionLearning';
import baseline from '../../reports/b21-u5/baseline-missions.json';

const state={...initialExplorer,area:'area-iteration',node:'generator',origin:'scene=05&step=gen&back=6'};
const publicHref=explorerHref(state,b21ConceptPath),privateHref=explorerHref(state);
const termURL=(returnTo:string,extra='')=>'?'+new URLSearchParams({'b21-explorer':returnTo})+extra;
const source={scene:4,step:1,back:6,presenter:false};
describe('U5 fixed service paths and bounded returns',()=>{
  it('keeps private and service URLs separate while preserving the same state',()=>{
    expect(privateHref.startsWith(b21PreviewConceptPath+'?')).toBe(true);
    expect(publicHref.startsWith(b21ConceptPath+'?')).toBe(true);
    expect(readExplorer(privateHref.split('?')[1]).state).toEqual(readExplorer(publicHref.split('?')[1]).state);
    expect(validExplorerReturn(privateHref)).toBe(privateHref);
    expect(validExplorerReturn(publicHref,b21ConceptPath)).toBe(publicHref);
    expect(validExplorerReturn(privateHref,b21ConceptPath)).toBeNull();
    expect(validExplorerReturn(publicHref)).toBeNull();
  });
  it('bounds previous choices to fixed routes in the active host',()=>{
    expect(explorerTrail([publicHref,'https://evil.test',privateHref],b21ConceptPath)).toEqual([publicHref]);
    expect(explorerTrail(Array(21).fill(publicHref),b21ConceptPath)).toEqual([]);
    expect(explorerTrail({returnUrl:publicHref},b21ConceptPath)).toEqual([]);
  });
  it('restores a matching approved term only to an authorized service map',()=>{
    expect(readExplorerTermReturn('/terms/generator',termURL(publicHref))).toBe(publicHref);
    expect(readExplorerTermReturn('/terms/iterator',termURL(publicHref))).toBeNull();
    expect(readExplorerTermReturn('/terms/generator',termURL(privateHref))).toBeNull();
    expect(readExplorerTermReturn('/terms/generator',termURL(publicHref,'&b31-map='))).toBeNull();
    expect(readExplorerTermReturn('/terms/generator',termURL(publicHref)+'&'+new URLSearchParams({'b21-explorer':publicHref}))).toBeNull();
  });
  it.each(['https://evil.test','//evil.test','/concept-explorer?node=generator',b21ConceptPath+'-other',b21ConceptPath+'?node=unknown',b21ConceptPath+'?origin=scene%3D03a%26step%3D1',b21ConceptPath+'?returnUrl=https://evil.test'])('rejects malformed map return %s',value=>{
    expect(readExplorerTermReturn('/terms/generator',termURL(value))).toBeNull();
    expect(readReviewReturn(b21StoryPath,value)).toBeNull();
  });
  it('only accepts review state on the fixed Story route',()=>{
    expect(readReviewReturn(b21StoryPath,publicHref)).toBe(publicHref);
    expect(readReviewReturn('/missions/main-M05/story-map',publicHref)).toBeNull();
  });
  it('reuses the existing 18-term Story return contract and B3 priority',()=>{
    const href=termStoryHref('generator',source),[path,search]=href.split('?');
    expect(readLearningReturn(path,'?'+search)).toEqual(source);
    expect(readLearningReturn(path,'?'+search+'&b31-map=')).toBeNull();
    expect(()=>termStoryHref('iterable',source)).toThrow();
  });
  it('round trips every approved guide chapter with the original scene/step/back',()=>{
    for(const [scene,definition] of scenes.entries())for(const chapter of guideConnections[definition.id]){
      const route={scene,step:definition.steps.length-1,back:scene===7?null:6,presenter:false};
      const href=learningDestinationHref(`/missions/main-M03/guide/${chapter}`,route),[path,query]=href.split('?');
      expect(readLearningReturn(path,'?'+query)).toEqual(route);
    }
  });
  it('only carries field returns for Scenes 04/05/08 and the original mission overlay',()=>{
    for(const scene of [3,4,7]){
      const route={...source,scene,step:0,back:scene===7?null:6};
      const href=learningDestinationHref('/maps/data-database?mission=main-m03',route),[path,query]=href.split('?');
      expect(readLearningReturn(path,'?'+query)).toEqual(route);
      expect(readLearningReturn(path,'?'+query.replace('mission=main-m03','mission=main-m05'))).toBeNull();
    }
    for(const href of ['https://evil.test','/missions/main-M05/guide/01-cli-execution','/terms/iterable','/maps/frontend?mission=main-m03'])expect(()=>learningDestinationHref(href,source)).toThrow();
  });
});
describe('U5 host-independent presenter and read-only availability',()=>{
  it('uses the actual site base and Story hash without a private view parameter',()=>{
    const route={scene:4,step:19,back:6,presenter:false};
    const url=new URL(presenterURL('https://example.test/glossary/index.html?old=1#old',route,'session-valid-123456','service'));
    expect(url.pathname).toBe('/glossary/index.html');expect([...url.searchParams.keys()]).toEqual(['sync']);
    expect(url.hash).toBe('#'+routeURL({...route,presenter:true}));
    const preview=new URL(presenterURL('http://127.0.0.1:4179/?view=v3-links',route,'session-valid-123456','preview'));
    expect(preview.searchParams.get('view')).toBe('v3-router');
  });
  it('only changes the feature-status tail, keeping original manuscript notes immutable',()=>{
    const scene=scenes[7],snapshot=JSON.stringify(scene),old=scene.instructor.notes.find(n=>n.includes('미연결'))!;
    expect(serviceNote(old)).not.toContain('미연결');expect(serviceNote(old).startsWith(old.split('실제 서비스')[0])).toBe(true);
    const independent=renderToStaticMarkup(<InstructorNotes scene={scene} step={scene.steps[0]} index={0}/>);
    const connected=renderToStaticMarkup(<LearningServiceConnected.Provider value={true}><InstructorNotes scene={scene} step={scene.steps[0]} index={0}/></LearningServiceConnected.Provider>);
    expect(independent).toContain('미연결');expect(connected).not.toContain('미연결');expect(connected).toContain('독립 HTML');expect(JSON.stringify(scene)).toBe(snapshot);
  });
  it('leaves the approved figure DOM untouched except its service status caption',()=>{
    const step=scenes[7].steps.at(-1)!;
    const actions={reveal:false,file:'',select:()=>{},scene:()=>{},review:()=>{},toggleReveal:()=>{},register:()=>{}};
    const figure=<FigureContext.Provider value={actions}><FigS8 step={step}/></FigureContext.Provider>;
    const independent=renderToStaticMarkup(figure);
    const service=renderToStaticMarkup(<LearningServiceConnected.Provider value={true}>{figure}</LearningServiceConnected.Provider>);
    const caption='영역을 누르면 그 장면으로 복습 이동 · 자세한 개념지도(45개념·24관계·10비교)는 별도 탐색 시안 · 용어사전 연결은 미연결';
    expect(independent.replace(caption,serviceMapCaption)).toBe(service);
  });
});
describe('U5 main-m03-only mission materials',()=>{
  it('keeps all fifteen other mission definitions byte-equivalent as data',()=>{
    expect(learningMissions.filter(m=>m.id!=='main-m03')).toEqual(baseline.filter(m=>m.id!=='main-m03'));
  });
  it('uses the requested cards and keeps the original B2 guide unchanged',()=>{
    const mission=learningForMission('main-M03')!,old=baseline.find(m=>m.id==='main-m03')!;
    expect(mission.materials.map(m=>m.kind)).toEqual(['story','concepts','guide']);
    expect(mission.materials[0]).toMatchObject({title:'명령 한 줄부터 개념지도까지',description:'Python 용돈 기입장의 핵심 개념을 8개 장면으로 배우고, 관계를 확인합니다.',href:b21StoryPath});
    expect(mission.materials[1]).toMatchObject({title:'45개 개념의 연결 관계 탐색',description:'개념과 관계를 선택하고, 헷갈리는 개념을 비교하며 복습합니다.',href:b21ConceptPath});
    expect(mission.materials[2]).toEqual(old.materials.find(m=>m.kind==='guide'));
    expect(materialLabel('main-m03','concepts')).toBe('전체 개념지도');expect(materialLabel('main-m05','concepts')).toBe('개념지도');
  });
});
