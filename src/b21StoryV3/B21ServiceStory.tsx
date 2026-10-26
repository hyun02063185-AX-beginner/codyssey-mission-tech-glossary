import { Link, useLocation } from 'react-router-dom';
import B21StoryRouter from './routing/B21StoryRouter';
import { resolveStoryRoute, routeURL, storyPath } from './routing/storyRoute';
import { learningLinkExtensions } from './components/StoryLearningLinks';
import { b21ConceptPath } from '../b21Learning/paths';
import { LearningServiceConnected } from '../b21Learning/availability';
import { explorerHref, initialExplorer } from '../b21ConceptExplorer/state';
import { storySource } from './links/returnAddress';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import B21ReturnGate from '../b21Learning/B21ReturnGate';
import '../b21Learning/service.css';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import {PresentationSurface,PresentationThemeSelector} from '../missionUI/PresentationTheme';
import {scenes} from './content';
import {learningForMission} from '../missionLearning';

export default function B21ServiceStory() {
  const location=useLocation(),route=resolveStoryRoute(location.pathname,location.search).route;
  const overview=!location.search&&!location.state?.b21Explorer;
  const mission=learningForMission('main-m03')!;
  const sceneLinks=scenes.map((scene,index)=>({id:scene.id,label:`Scene ${scene.id}`,title:scene.title,href:routeURL({scene:index,step:0,back:null,presenter:false})}));
  const href=explorerHref({...initialExplorer,origin:storySource(route)},b21ConceptPath);
  const extensions=learningLinkExtensions(route,{service:true});
  const afterLecture=<>{route.scene===7&&<nav className="b21-service-map-entry" aria-label="Scene 08 전체 지도 연결"><Link to={href}>전체 개념지도에서 관계 탐색 →</Link><p>45개 개념의 관계와 비교를 탐색한 뒤 지금의 강의 위치로 돌아올 수 있습니다.</p></nav>}{extensions.afterLecture}</>;
  if(overview)return <div className="b21-service-page">
    <LearningFocusNav missionId="main-m03" active="story" storyHref={storyPath} conceptHref={b21ConceptPath}/>
    <MissionStoryOverview missionCode="B2-1" title={mission.materials.find(item=>item.kind==='story')!.title} question={mission.question!} scenes={sceneLinks} orientation={<>
      <p>강사 대면 설명으로 시작해 스토리의 흐름과 개념지도의 관계를 살펴봅니다. 강의 이후에는 같은 자료로 자유롭게 복습하세요.</p>
      <p>{mission.intro}</p><ol>{scenes.map(scene=><li key={scene.id}>{scene.question}</li>)}</ol>
    </>}/>
  </div>;
  return <PresentationSurface><LearningServiceConnected.Provider value={true}><div className="b21-service-page b21-service-story">
    {!route.presenter&&<><LearningFocusNav missionId="main-m03" active="story" storyHref={routeURL(route)} conceptHref={href}><Link to={storyPath}>강의 소개 보기</Link><PresentationThemeSelector/></LearningFocusNav><B21ReturnGate/></>}
    <B21StoryRouter presenterHost="service" extensions={{...extensions,afterLecture}}/>
  </div></LearningServiceConnected.Provider></PresentationSurface>;
}
