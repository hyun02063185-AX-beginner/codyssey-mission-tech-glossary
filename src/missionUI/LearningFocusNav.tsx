import type {ReactNode} from 'react';
import {Link} from 'react-router-dom';
import {learningForMission,materialLabels} from '../missionLearning';
import './missionUI.css';
import ThemeSelector from './ThemeSelector';

type Props={missionId:string;active:'story'|'concepts';storyHref?:string;conceptHref?:string;storyState?:unknown;compact?:boolean;children?:ReactNode};
/** Shared navigation only: lesson renderers and graph engines remain mission owned. */
export default function LearningFocusNav({missionId,active,storyHref,conceptHref,storyState,compact=false,children}:Props){
  const mission=learningForMission(missionId)!;
  return <nav className={`learning-focus-nav${compact?' is-compact':''}`} aria-label="미션 학습 메뉴" data-menu-mode="learning-focus">
    <Link className="learning-focus-back" to={mission.href} aria-label={`${mission.courseLabel} 미션 소개로 돌아가기`}>← 미션</Link>
    <strong>{mission.courseLabel}<span> · {materialLabels[active]}</span></strong>
    <details className="learning-focus-menu" onKeyDown={event=>{if(event.key==='Escape'){event.currentTarget.open=false;event.currentTarget.querySelector('summary')?.focus();event.stopPropagation();}}}><summary>학습자료</summary><div>{mission.materials.filter(item=>['story','concepts','guide'].includes(item.kind)).map(item=><Link key={item.kind} state={item.kind==='story'?storyState:undefined} aria-current={item.kind===active?'page':undefined} to={item.kind==='story'?(storyHref??item.href):item.kind==='concepts'?(conceptHref??item.href):item.href} onClick={event=>event.currentTarget.closest('details')?.removeAttribute('open')}>{materialLabels[item.kind]}</Link>)}<ThemeSelector/>{children}</div></details>
  </nav>;
}
