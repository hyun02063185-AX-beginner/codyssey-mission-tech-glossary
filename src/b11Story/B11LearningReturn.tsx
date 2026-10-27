import {Link,useLocation} from 'react-router-dom';
import {readGuideReturn} from './navigation';
import {readMapReturn} from '../b11ConceptMap/navigation';
import '../b61Story/storyReturn.css';
export default function B11LearningReturn(){
  const location=useLocation(),map=readMapReturn(location.pathname,location.search),guide=readGuideReturn(location.pathname,location.search);
  if(!map&&!guide)return null;
  return <nav className="b61-story-return" aria-label="B1-1 학습으로 복귀">{map?<><Link to={map.canonical}>← B1-1 개념지도로 돌아가기</Link>{map.origin&&<Link to={map.origin}>스토리의 이전 화면으로 돌아가기</Link>}</>:<Link to={guide!}>← B1-1 스토리의 이전 화면으로 돌아가기</Link>}</nav>;
}
