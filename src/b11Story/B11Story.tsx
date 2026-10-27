import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import {PresentationSurface,PresentationThemeSelector} from '../missionUI/PresentationTheme';
import {intro,scenes,screens,authoredScreen,introNotes,storyPath,type Screen} from './content';
import {guideHref,readStoryState,screenHref} from './navigation';
import {conceptHref,referenceHref,referenceLabel} from '../b11ConceptMap/navigation';
import B11Figure from './B11Figure';
import B11Sample from './B11Sample';
import './b11Story.css';
const captures=import.meta.glob('../../content/mission-stories/main-m01/assets/captures/*.png',{query:'?url',import:'default',eager:true}) as Record<string,string>;
const sceneLinks=Object.entries(scenes).map(([id,scene])=>({id,label:`Scene ${id}`,title:scene.title,href:screenHref(screens.findIndex(screen=>screen.scene===id))}));
function Visual({screen}:{screen:Screen}){
  return <div className={`b11-stage${screen.captures&&screen.desktop?' has-both':''}`}>
    {screen.captures&&<div className={`b11-captures${screen.captures.some(([src])=>!src.includes('mobile'))?' stack-mobile':''}`}>{screen.captures.map(([src,label])=><figure key={src} className={`b11-shot${src.includes('mobile')?' is-phone':''}`}><div className="b11-browser-bar">● ● ● <span>교육용 예시 페이지</span></div><img src={captures[`../../content/mission-stories/main-m01/assets/captures/${src}`]} alt={label}/><figcaption>{label}</figcaption></figure>)}</div>}
    {screen.desktop&&screen.mobile&&<B11Figure desktop={screen.desktop} mobile={screen.mobile}/>}
  </div>;
}
export default function B11Story(){
  const location=useLocation(),navigate=useNavigate(),state=readStoryState(location.search),screen=screens[state.index];
  const scene=scenes[screen.scene as keyof typeof scenes],authored=authoredScreen(screen.id),heading=useRef<HTMLHeadingElement>(null),dialog=useRef<HTMLDialogElement>(null),focusButton=useRef<HTMLButtonElement>(null);
  const [notice,setNotice]=useState(state.notice);
  useEffect(()=>{if(state.notice)setNotice(state.notice);if(!state.overview&&location.pathname+location.search!==state.canonical)navigate(state.canonical,{replace:true});},[state.canonical,state.overview,state.notice,location.pathname,location.search,navigate]);
  useEffect(()=>{document.title=state.overview?`B1-1 · ${intro.title}`:`${screen.id} · B1-1 미션 스토리`;if(!state.overview){heading.current?.focus({preventScroll:true});window.scrollTo(0,0);}return()=>{document.title='코디세이 기술용어 사전';};},[screen.id,state.overview]);
  if(state.overview)return <><LearningFocusNav missionId="main-m01" active="story"/><MissionStoryOverview missionCode="B1-1" title={intro.title} question={intro.question} orientation={<><ol><li>HTML이 내용과 그 의미를 적는다는 것을 말한다</li><li>본문 내용과 구조는 그대로 둔 채 CSS 규칙으로 다른 모습을 만들 수 있음을 설명한다</li><li>버튼 클릭이 JavaScript 처리와 DOM 변경을 거쳐 화면 변화가 되는 흐름을 말한다</li><li>화면의 어떤 변화를 원할 때 어느 파일을 열지 고를 수 있다</li></ol><p>문서에서 시작한다 → 다르게 표현한다 → 행동에 반응한다 → 하나의 웹페이지가 된다</p><PresentationSurface><B11Figure desktop={intro.desktop} mobile={intro.mobile}/></PresentationSurface><Markdown>{introNotes}</Markdown></>} scenes={sceneLinks}/></>;
  const move=(index:number)=>{if(screens[index])navigate(screenHref(index));};
  return <PresentationSurface><div className="b11-story"><LearningFocusNav missionId="main-m01" active="story" storyHref={screenHref(state.index)} conceptHref={conceptHref(state.index)} guideHref={guideHref(state.index)}><Link to={storyPath}>강의 소개 보기</Link><PresentationThemeSelector/></LearningFocusNav>
    <article className="b11-lesson" data-screen={screen.id} aria-labelledby="b11-message" onKeyDown={event=>{if(event.altKey||event.ctrlKey||event.metaKey||(event.target as Element).closest('button,a,select,input,textarea,summary,dialog'))return;if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();move(state.index+1);}if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();move(state.index-1);}}}>
      {notice&&<p role="status">{notice} <button type="button" onClick={()=>setNotice('')}>안내 닫기</button></p>}
      <header className="b11-heading"><p>Scene {screen.scene} · {scene.title} — {scene.role}</p><p>{screen.id} · {screen.question}</p><h1 id="b11-message" ref={heading} tabIndex={-1}>{screen.message}</h1><p className="b11-caption">{screen.caption}</p></header>
      <Visual screen={screen}/>{screen.chip&&<p className="b11-chip">{screen.chip}</p>}
      <p className="b11-example">교육용 예시 페이지 (실제 교육생 프로젝트 아님)</p>
      <nav className="b11-controls" aria-label="B1-1 강의 조작"><label>Scene <select aria-label="Scene 선택" value={screen.scene} onChange={event=>move(screens.findIndex(item=>item.scene===event.target.value))}>{Object.entries(scenes).map(([id,item])=><option key={id} value={id}>{id} · {item.title}</option>)}</select></label><span>{state.index+1} / 12</span><button type="button" disabled={!state.index} onClick={()=>move(state.index-1)}>이전</button><button type="button" disabled={state.index===11} onClick={()=>move(state.index+1)}>다음</button><button ref={focusButton} type="button" onClick={()=>dialog.current?.showModal()}>그림 집중 보기</button></nav>
    </article>
    <div className="b11-review" key={screen.id}><details><summary>학습자 접힘 설명 · 이해 확인</summary><Markdown>{authored.explanation}</Markdown><Markdown>{authored.check}</Markdown></details><details><summary>강사 스크립트 · 실제 시연</summary><Markdown remarkPlugins={[remarkGfm]}>{authored.notes}</Markdown><B11Sample/></details><details><summary>개념지도 · 용어사전 · 학습가이드</summary><div className="b11-links">{screen.map.map(id=><Link key={id} to={referenceHref(state.index,id)}>{referenceLabel(id)}</Link>)}{screen.terms.map(id=><Link key={id} to={`/terms/${id}?${new URLSearchParams({'b11-map':conceptHref(state.index).split('?')[1]})}`}>{id} · 용어사전</Link>)}{screen.guide.map(chapter=><Link key={chapter} to={guideHref(state.index,chapter)}>{chapter} 학습가이드 →</Link>)}</div></details></div>
    <dialog className="b11-focus" ref={dialog} onClose={()=>focusButton.current?.focus()}><header><h2>{screen.title}</h2><button type="button" onClick={()=>dialog.current?.close()}>집중 보기 닫기</button></header><div className="b11-focus-visual"><Visual screen={screen}/></div><p>{screen.caption}</p></dialog>
  </div></PresentationSurface>;
}
