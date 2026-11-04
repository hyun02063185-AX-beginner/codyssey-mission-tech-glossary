import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import {PresentationSurface,PresentationThemeSelector} from '../missionUI/PresentationTheme';
import {intro,scenes,screens,storyPath,screenHref,readStoryState,authoredScreen,introNotes,demoNotes,guideLinks} from './content';
import B32Figure from './B32Figure';
import './b32Story.css';
const sceneLinks=Object.entries(scenes).map(([id,scene])=>({id,label:`Scene ${id}`,title:scene.title,href:screenHref(screens.findIndex(screen=>screen.scene===id))}));
export default function B32Story(){
  const location=useLocation(),navigate=useNavigate(),state=readStoryState(location.search),screen=screens[state.index],authored=authoredScreen(screen.id);
  const heading=useRef<HTMLHeadingElement>(null),[notice,setNotice]=useState('');
  useEffect(()=>{if(state.notice)setNotice(state.notice);if(!state.overview&&location.pathname+location.search!==state.canonical)navigate(state.canonical,{replace:true});},[state.notice,state.overview,state.canonical,location.pathname,location.search,navigate]);
  useEffect(()=>{document.title=state.overview?`B3-2 · ${intro.title}`:`${screen.id} · B3-2 미션 스토리`;if(!state.overview){heading.current?.focus({preventScroll:true});window.scrollTo(0,0);}return()=>{document.title='코디세이 기술용어 사전';};},[state.overview,screen.id]);
  if(state.overview)return <><LearningFocusNav missionId="main-m06" active="story"/><MissionStoryOverview missionCode="B3-2" title={intro.title} question={intro.question} scenes={sceneLinks} orientation={<><p>{intro.draftDefinition}</p><ol><li>git status·git diff에서 무엇이 바뀌었는지 읽는다</li><li>Python이 subprocess로 Git을 실행하고 returncode로 다음 작업을 정한다는 것을 설명한다</li><li>AI에게 보내는 데이터와 API 요청·응답의 흐름을 말한다</li><li>AI 초안을 검증하고 사람이 확인한 뒤에 쓰는 이유를 설명한다</li></ol><p>변경을 읽는다 → Git을 실행한다 → AI에게 묻는다 → 초안을 확인한다</p><PresentationSurface><div className="b32-intro-figure"><B32Figure desktop={intro.desktop} mobile={intro.mobile}/></div></PresentationSurface><details><summary>발표자 노트 · 시작</summary><Markdown>{introNotes}</Markdown></details></>}/></>;
  const move=(index:number)=>{if(screens[index])navigate(screenHref(index));};
  return <PresentationSurface><div className="b32-story"><LearningFocusNav missionId="main-m06" active="story" storyHref={screenHref(state.index)}><Link to={storyPath}>강의 소개 보기</Link><PresentationThemeSelector/></LearningFocusNav>
    <article className="b32-lesson" data-screen={screen.id} aria-labelledby="b32-message" onKeyDown={event=>{if(event.altKey||event.ctrlKey||event.metaKey||(event.target as Element).closest('button,a,select,input,textarea,summary'))return;if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();move(state.index+1);}if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();move(state.index-1);}}}>
      {notice&&<p role="status">{notice} <button onClick={()=>setNotice('')}>안내 닫기</button></p>}
      <header className="b32-heading"><div className="b32-heading-top"><p className="b32-technology" aria-label="현재 학습 기술">{screen.technology}</p><nav className="b32-controls b32-top-controls" aria-label="슬라이드 상단 탐색"><button disabled={!state.index} onClick={()=>move(state.index-1)}>이전</button><span aria-label="현재 슬라이드">{state.index+1} / {screens.length}</span><button disabled={state.index===screens.length-1} onClick={()=>move(state.index+1)}>다음</button></nav></div><h1 id="b32-message" tabIndex={-1} ref={heading}>{screen.message}</h1><p className="b32-caption">{screen.caption}</p></header>
      <B32Figure journey desktop={['f0-journey-desktop.svg',screen.journey]} mobile={['f0-journey-mobile.svg',screen.journey]}/>
      <B32Figure desktop={screen.desktop} mobile={screen.mobile}/>
      <nav className="b32-controls" aria-label="B3-2 강의 조작"><label>Scene <select aria-label="Scene 선택" value={screen.scene} onChange={event=>move(screens.findIndex(item=>item.scene===event.target.value))}>{Object.entries(scenes).map(([id,item])=><option key={id} value={id}>{id} · {item.title}</option>)}</select></label><span>{state.index+1} / {screens.length}</span><button disabled={!state.index} onClick={()=>move(state.index-1)}>이전</button><button disabled={state.index===screens.length-1} onClick={()=>move(state.index+1)}>다음</button></nav>
    </article>
    <div className="b32-review" key={screen.id}><details><summary>학습자 접힘 설명 · 이해 확인</summary><Markdown>{authored.explanation}</Markdown><Markdown>{authored.check}</Markdown></details>
      {authored.output&&<details><summary>실제 COMMIT·PR 출력 전문</summary><Markdown remarkPlugins={[remarkGfm]}>{authored.output}</Markdown></details>}
      <details><summary>발표자 노트 · 강사 스크립트</summary><p>학습 질문: {screen.question}</p><Markdown urlTransform={url=>url==='review.md'?'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/264cb6983974a6bfafe143e805249716771e6ec3/content/mission-stories/main-m06/review.md':url}>{authored.notes}</Markdown>{authored.output&&<Markdown>{authored.output}</Markdown>}</details>
      <details><summary>실제 시연 · 발표자 노트</summary><Markdown>{demoNotes}</Markdown></details>
      <details><summary>관련 용어사전 · 학습가이드</summary><p>개념지도 준비 중 · 미제공</p><div className="b32-links">{screen.terms.map(id=><Link key={id} to={`/terms/${id}?b32-story=${encodeURIComponent(screenHref(state.index).split('?')[1])}`}>{id} · 용어사전</Link>)}{screen.guide.map(chapter=><a key={chapter} href={guideLinks[chapter]} target="_blank" rel="noreferrer">{chapter} 학습가이드 ↗</a>)}</div></details>
    </div></div></PresentationSurface>;
}
