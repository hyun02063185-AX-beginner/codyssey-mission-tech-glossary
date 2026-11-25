import {Link,useLocation} from 'react-router-dom';
import {readStoryState} from './content';
import { b32Review, labPath } from './reviewMode';
import '../b61Story/storyReturn.css';
export default function B32LearningReturn(){
  const location=useLocation(),params=new URLSearchParams(location.search),query=params.get('b32-story');
  const [lab, duplicate] = params.getAll('b32-lab');
  if (b32Review && /^\/terms\/[a-z0-9-]+$/.test(location.pathname) && lab && !duplicate) {
    const lesson = lab.match(/^(0[1-9]):(intro|S[1-4]-[12])$/);
    const result = lab.match(/^index:(\d{1,2})$/);
    const target = lesson ? `${labPath}/${lesson[1]}?from=${lesson[2]}`
      : result ? `${labPath}#결과-${result[1]}` : null;
    if (target) return <nav className="b61-story-return" aria-label="B3-2 Lab으로 복귀"><Link to={target}>← B3-2 Lab의 이전 화면으로 돌아가기</Link></nav>;
  }
  if(!/^\/terms\/[a-z0-9-]+$/.test(location.pathname)||!query||params.getAll('b32-story').length!==1||query.length>1024)return null;
  const state=readStoryState('?'+query);
  return state.notice||state.canonical.split('?')[1]!==query?null:<nav className="b61-story-return" aria-label="B3-2 학습으로 복귀"><Link to={state.canonical}>← B3-2 스토리의 이전 화면으로 돌아가기</Link></nav>;
}
