import { Link, useLocation } from 'react-router-dom';
import B21StoryRouter from './routing/B21StoryRouter';
import { resolveStoryRoute } from './routing/storyRoute';
import { learningLinkExtensions } from './components/StoryLearningLinks';
import { b21ConceptPath, b21MissionPath } from '../b21Learning/paths';
import { LearningServiceConnected } from '../b21Learning/availability';
import { explorerHref, initialExplorer } from '../b21ConceptExplorer/state';
import { storySource } from './links/returnAddress';
import B21ReturnGate from '../b21Learning/B21ReturnGate';
import '../b21Learning/service.css';

export default function B21ServiceStory() {
  const location=useLocation(),route=resolveStoryRoute(location.pathname,location.search).route;
  const href=explorerHref({...initialExplorer,origin:storySource(route)},b21ConceptPath);
  const extensions=learningLinkExtensions(route,{service:true});
  const afterLecture=<>{route.scene===7&&<nav className="b21-service-map-entry" aria-label="Scene 08 전체 지도 연결"><Link to={href}>전체 개념지도에서 관계 탐색 →</Link><p>45개 개념의 관계와 비교를 탐색한 뒤 지금의 강의 위치로 돌아올 수 있습니다.</p></nav>}{extensions.afterLecture}</>;
  return <LearningServiceConnected.Provider value={true}><div className="b21-service-page b21-service-story">
    {!route.presenter&&<><nav className="b21-service-nav" aria-label="B2-1 학습 자료"><Link to={b21MissionPath}>← B2-1 미션 상세</Link><Link to={href}>전체 개념지도</Link></nav><B21ReturnGate/></>}
    <B21StoryRouter presenterHost="service" extensions={{...extensions,afterLecture}}/>
  </div></LearningServiceConnected.Provider>;
}
