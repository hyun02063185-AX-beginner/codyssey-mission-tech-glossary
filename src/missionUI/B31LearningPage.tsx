import {useLocation} from 'react-router-dom';
import B31StoryMap from '../B31StoryMap';
import MissionConceptMap from '../missionConceptMap/MissionConceptMap';
import {conceptHref,mapQuery,storyHref,storyScene} from '../b31StoryNavigation';
import {b31StoryScenes} from '../b31StoryMapContent';
import MissionStoryOverview from './MissionStoryOverview';
import LearningFocusNav from './LearningFocusNav';

const overviewScenes=b31StoryScenes.map(item=>({id:item.id,label:item.label,title:item.title,href:storyHref(item.id)}));
// Existing B3-1 introduction copy; the scene renderer retains the original lesson content.
const orientation=<>
  <p>강사 대면 설명으로 시작해 스토리의 흐름과 개념지도의 관계를 살펴봅니다. 강의 이후에는 같은 자료로 자유롭게 복습하세요.</p>
  <ul><li>네트워크의 구역·장비·역할을 구별합니다.</li><li>요청·응답을 따라가고 일반망과 AWS의 공통점·차이점을 설명합니다.</li><li>학습가이드로 직접 실습하고 결과를 검증한 뒤, 필요한 용어를 찾아 이해를 넓힙니다.</li></ul>
  <p>전체 구조 → 요청·응답 → 역할 비교 → AWS 접속 조건 → 개념지도 탐색 → 실습·이해 확인</p>
</>;

export default function B31LearningPage({concepts=false}:{concepts?:boolean}){
  const location=useLocation(),query=new URLSearchParams(location.search),scene=storyScene(query.get('scene'));
  if(concepts)return <MissionConceptMap/>;
  const overview=!query.has('scene')&&!query.has('map');
  const currentStory=overview?'/missions/main-M05/story-map':storyHref(scene??'scene-01',query.has('map')?mapQuery(query.get('map')!):undefined);
  return <div className="mission-focus-story" data-learning-page="b31-story">
    <LearningFocusNav missionId="main-m05" active="story" storyHref={currentStory} conceptHref={conceptHref(query.get('map')??'',scene??undefined)}/>
    {overview
      ?<MissionStoryOverview missionCode="B3-1" title="AWS로 다시 이해하는 네트워크" question="내 웹사이트는 어떻게 인터넷에서 열릴까?" scenes={overviewScenes} orientation={orientation}/>
      :<B31StoryMap/>}
  </div>;
}
