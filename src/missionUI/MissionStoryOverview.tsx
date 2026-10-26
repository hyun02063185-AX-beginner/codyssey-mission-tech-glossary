import type {ReactNode} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './missionStoryOverview.css';

export type MissionStorySceneLink={id:string;label:string;title:string;href:string};
type Props={missionCode:string;title:string;question:string;orientation:ReactNode;scenes:readonly MissionStorySceneLink[]};
/** Shared lecture entrance only. Scene content and navigation contracts stay mission owned. */
export default function MissionStoryOverview({missionCode,title,question,orientation,scenes}:Props){
  return <article className="mission-story-overview" aria-labelledby="mission-story-overview-title">
    <header className="mission-story-overview-heading"><p className="eyebrow">미션 스토리 · {missionCode}</p><h1 id="mission-story-overview-title">{missionCode} — {title}</h1><p className="mission-story-overview-question">{question}</p>
      <details className="mission-story-orientation"><summary>학습 목표와 강의 흐름</summary>{orientation}</details>
    </header>
    {scenes.length>0&&<Link className="mission-story-start" to={scenes[0].href}>강의 시작하기 →</Link>}
    <nav className="mission-story-scenes" aria-label="Scene 목차"><ol>{scenes.map((scene,index)=><li key={scene.id}><Link to={scene.href}><span>{scene.label}</span><b>{scene.title}</b><small>{index+1} / {scenes.length}</small></Link></li>)}</ol></nav>
  </article>;
}
/** Compact navigation while a diagram lecture is running; never repeats the overview grid. */
export function MissionStoryScenePicker({scenes,current,overviewHref}:{scenes:readonly MissionStorySceneLink[];current:string;overviewHref:string}){
  const navigate=useNavigate();
  return <nav className="mission-story-scene-picker" aria-label="강의 Scene 이동"><Link to={overviewHref}>← 강의 소개</Link><label>Scene 선택 <select aria-label="Scene 선택" value={current} onChange={event=>{const scene=scenes.find(item=>item.id===event.target.value);if(scene)navigate(scene.href);}}>{scenes.map(scene=><option key={scene.id} value={scene.id}>{scene.label} · {scene.title}</option>)}</select></label></nav>;
}
