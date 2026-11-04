import {Link,useLocation} from 'react-router-dom';
import {readStoryState} from './content';
import '../b61Story/storyReturn.css';
export default function B32LearningReturn(){
  const location=useLocation(),params=new URLSearchParams(location.search),query=params.get('b32-story');
  if(!/^\/terms\/[a-z0-9-]+$/.test(location.pathname)||!query||params.getAll('b32-story').length!==1||query.length>1024)return null;
  const state=readStoryState('?'+query);
  return state.notice||state.canonical.split('?')[1]!==query?null:<nav className="b61-story-return" aria-label="B3-2 학습으로 복귀"><Link to={state.canonical}>← B3-2 스토리의 이전 화면으로 돌아가기</Link></nav>;
}
