import {useLocation} from 'react-router-dom';
import B31StoryMap from '../B31StoryMap';
import MissionConceptMap from '../missionConceptMap/MissionConceptMap';
import {conceptHref,mapQuery,storyHref,storyScene} from '../b31StoryNavigation';
import {lectureSlides} from '../b31SlideFlow';
import MissionStoryOverview from './MissionStoryOverview';
import LearningFocusNav from './LearningFocusNav';
import {PresentationSurface,PresentationThemeSelector} from './PresentationTheme';

const overviewScenes=lectureSlides.map((item,index)=>({id:item.id,label:`Slide ${index+1}`,title:item.title,href:storyHref(item.id)}));
// Existing B3-1 introduction copy; the scene renderer retains the original lesson content.
const orientation=<>
  <p>강사 대면 설명으로 시작해 스토리의 흐름과 개념지도의 관계를 살펴봅니다. 강의 이후에는 같은 자료로 자유롭게 복습하세요.</p>
  <ul><li>네트워크의 구역·장비·역할을 구별합니다.</li><li>요청·응답을 따라가고 일반망과 AWS의 공통점·차이점을 설명합니다.</li><li>학습가이드로 직접 실습하고 결과를 검증한 뒤, 필요한 용어를 찾아 이해를 넓힙니다.</li></ul>
  <p>목표 → 주소와 구역 → 패킷과 프로토콜 → 전체 연결망 → 패킷의 여행 → AWS 대응 → 접속 조건 → 이해 확인</p>
</>;

export default function B31LearningPage({concepts=false}:{concepts?:boolean}){
  const location=useLocation(),query=new URLSearchParams(location.search),scene=storyScene(query.get('scene'));
  if(concepts)return <MissionConceptMap/>;
  const overview=!query.has('scene')&&!query.has('map');
  const currentStory=overview?'/missions/main-M05/story-map':storyHref(scene??'slide-intro',query.has('map')?mapQuery(query.get('map')!):undefined);
  const content=<div className="mission-focus-story" data-learning-page="b31-story">
    <LearningFocusNav missionId="main-m05" active="story" storyHref={currentStory} conceptHref={conceptHref(query.get('map')??'',scene??undefined)}>{!overview&&<PresentationThemeSelector/>}</LearningFocusNav>
    {overview
      ?<MissionStoryOverview missionCode="B3-1" title="AWS로 다시 이해하는 네트워크" question="내 웹사이트는 어떻게 인터넷에서 열릴까?" scenes={overviewScenes} orientation={orientation}/>
      :<B31StoryMap/>}
  </div>;
  return overview?content:<PresentationSurface>{content}</PresentationSurface>;
}
