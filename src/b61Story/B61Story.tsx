import {useEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import {PresentationSurface,PresentationThemeSelector} from '../missionUI/PresentationTheme';
import {b61StoryPath,storyTitle,storyQuestion,scenes,screens,guideChapters} from './content';
import {guideHref,readStoryState,screenHref} from './navigation';
import B61StoryFigure from './B61StoryFigure';
import B61StoryLayers from './B61StoryLayers';
import './b61Story.css';

const sceneLinks=scenes.map(scene=>({id:scene.id,label:`Scene ${scene.id}`,title:scene.title,href:screenHref(screens.findIndex(screen=>screen.scene===scene.id))}));
const orientation=<><p>강사 대면 설명으로 시작해 스토리의 흐름을 살펴봅니다. 강의 이후에는 같은 자료로 자유롭게 복습하세요.</p><ol><li>ERD에서 표와 관계를 읽는다.</li><li>표를 나누고 PK·FK로 잇는 이유를 말한다.</li><li>JOIN이 키를 따라 답을 모으는 과정과 INNER·LEFT의 차이를 설명한다.</li><li>내 ERD에서 같은 구조를 찾는다.</li></ol><p>설계도 보기 → 나누고 잇기 → 다시 모아 답 찾기 → 구조를 아는 이유</p></>;
export default function B61Story(){
  const location=useLocation(),navigate=useNavigate(),state=readStoryState(location.search);
  const screen=screens[state.index],sceneIndex=scenes.findIndex(scene=>scene.id===screen.scene),scene=scenes[sceneIndex];
  const [notice,setNotice]=useState(state.notice);
  const heading=useRef<HTMLHeadingElement>(null);
  useEffect(()=>{
    if(state.notice)setNotice(state.notice);
    if(!state.overview&&location.pathname+location.search!==state.canonical)navigate(state.canonical,{replace:true});
  },[state.overview,state.canonical,state.notice,location.pathname,location.search,navigate]);
  useEffect(()=>{
    document.title=state.overview?`B6-1 · ${storyTitle}`:`${screen.id} · B6-1 미션 스토리`;
    if(!state.overview){heading.current?.focus({preventScroll:true});window.scrollTo(0,0);}
    return()=>{document.title='코디세이 기술용어 사전';};
  },[screen.id,state.overview]);
  if(state.overview)return <div className="b61-story-overview"><LearningFocusNav missionId="main-m11" active="story"/><MissionStoryOverview missionCode="B6-1" title={storyTitle} question={storyQuestion} orientation={orientation} scenes={sceneLinks}/></div>;
  const move=(index:number)=>{if(screens[index])navigate(screenHref(index));};
  return <PresentationSurface><div className="b61-story">
    <LearningFocusNav missionId="main-m11" active="story" storyHref={screenHref(state.index)} guideHref={guideHref(state.index)}><Link to={b61StoryPath}>강의 소개 보기</Link><Link to={guideHref(state.index,guideChapters[sceneIndex])}>이 Scene 학습가이드</Link><PresentationThemeSelector/></LearningFocusNav>
    <article className="b61-lesson" aria-labelledby="b61-message" data-screen={screen.id} onKeyDown={event=>{
      if(event.altKey||event.ctrlKey||event.metaKey||(event.target as Element).closest('select,input,textarea,summary'))return;
      if(['ArrowRight','PageDown'].includes(event.key)){event.preventDefault();move(state.index+1);}
      if(['ArrowLeft','PageUp'].includes(event.key)){event.preventDefault();move(state.index-1);}
    }}>
      {notice&&<p role="status" className="b61-recovery">{notice} <button type="button" onClick={()=>setNotice('')}>안내 닫기</button></p>}
      <header className="b61-heading"><p className="b61-scene">Scene {scene.id} · {scene.question}</p><h1 ref={heading} id="b61-message" tabIndex={-1}>{screen.message}</h1><p className="b61-caption">{screen.caption}</p></header>
      <nav className="b61-controls" aria-label="B6-1 강의 조작"><label>Scene <select aria-label="Scene 선택" value={scene.id} onChange={event=>move(screens.findIndex(item=>item.scene===event.target.value))}>{scenes.map(item=><option key={item.id} value={item.id}>{item.id} · {item.title}</option>)}</select></label><span className="b61-position">{screen.id} · {state.index+1} / {screens.length}</span><Link to={screenHref(0)}>전체 ERD</Link><button type="button" disabled={state.index===0} onClick={()=>move(state.index-1)}>이전</button><button type="button" disabled={state.index===screens.length-1} onClick={()=>move(state.index+1)}>다음</button></nav>
      <div className="b61-stage">{screen.diagram&&screen.state&&<B61StoryFigure diagram={screen.diagram} state={screen.state}/>}{screen.html&&<B61StoryLayers kind={screen.html}/>}</div>
    </article>
  </div></PresentationSurface>;
}
