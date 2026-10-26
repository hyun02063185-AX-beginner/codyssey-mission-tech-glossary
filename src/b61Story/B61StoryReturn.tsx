import {Link,useLocation} from 'react-router-dom';
import './storyReturn.css';
import {readMapReturn} from '../b61ConceptMap/navigation';
import {b61StoryPath} from './content';
import {readGuideReturn} from './navigation';
export default function B61StoryReturn(){
  const location=useLocation(),href=readGuideReturn(location.pathname,location.search);
  const map=readMapReturn(location.pathname,location.search);
  if(map)return <nav className="b61-story-return" aria-label="B6-1 학습으로 복귀"><Link to={map.canonical}>← B6-1 개념지도로 돌아가기</Link>{map.origin&&<Link to={b61StoryPath+'?'+map.origin}>스토리의 이전 화면으로 돌아가기</Link>}</nav>;
  if(!href)return null;
  return <nav className="b61-story-return" aria-label="B6-1 강의로 복귀"><Link to={href}>← B6-1 스토리의 이전 화면으로 돌아가기</Link></nav>;
}
