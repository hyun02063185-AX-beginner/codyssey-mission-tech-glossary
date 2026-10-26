import {Link,useLocation} from 'react-router-dom';
import './storyReturn.css';
import {readGuideReturn} from './navigation';
export default function B61StoryReturn(){
  const location=useLocation(),href=readGuideReturn(location.pathname,location.search);
  if(!href)return null;
  return <nav className="b61-story-return" aria-label="B6-1 강의로 복귀"><Link to={href}>← B6-1 스토리의 이전 화면으로 돌아가기</Link></nav>;
}
