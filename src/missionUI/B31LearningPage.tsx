import {useLocation} from 'react-router-dom';
import B31StoryMap from '../B31StoryMap';
import MissionConceptMap from '../missionConceptMap/MissionConceptMap';
import {conceptHref,mapQuery,storyHref,storyScene} from '../b31StoryNavigation';
import LearningFocusNav from './LearningFocusNav';
export default function B31LearningPage({concepts=false}:{concepts?:boolean}){
  const location=useLocation(),query=new URLSearchParams(location.search),scene=storyScene(query.get('scene'));
  if(concepts)return <MissionConceptMap/>;
  return <div className="mission-focus-story" data-learning-page="b31-story"><LearningFocusNav missionId="main-m05" active="story" storyHref={storyHref(scene??'scene-01',query.has('map')?mapQuery(query.get('map')!):undefined)} conceptHref={conceptHref(query.get('map')??'',scene??undefined)}/><B31StoryMap/></div>;
}
