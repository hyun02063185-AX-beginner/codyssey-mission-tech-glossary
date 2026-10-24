import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import B21TeachingStory from '../B21TeachingStory';
import { scenes } from '../content';
import { InstructorNotes } from '../components/InstructorNotes';
import { adjacent, resolveStoryRoute, routeURL, type StoryRoute } from './storyRoute';
import { usePresenterChannel, type LectureSnapshot, type PresenterCommand } from './presenterChannel';
import './storyRouter.css';

export default function B21StoryRouter() {
  const location=useLocation(),navigate=useNavigate();
  const resolved=resolveStoryRoute(location.pathname,location.search),route=resolved.route;
  const routeRef=useRef(route);routeRef.current=route;
  const [notice,setNotice]=useState(resolved.notice),[revealState,setRevealState]=useState({key:location.key,value:false});
  const [received,setReceived]=useState<LectureSnapshot|null>(null);
  const [popupNotice,setPopupNotice]=useState(''),[opened,setOpened]=useState(false),[hadConnection,setHadConnection]=useState(false);
  const revealed=revealState.key===location.key&&revealState.value;
  const setRevealed=(value:boolean|((value:boolean)=>boolean))=>setRevealState(previous=>({key:location.key,value:typeof value==='function'?value(previous.key===location.key&&previous.value):value}));
  const popup=useRef<Window|null>(null);
  const [session]=useState(()=>{
    const query=new URLSearchParams(window.location.search), supplied=query.get('sync');
    if(route.presenter)return supplied;
    try{let id=sessionStorage.getItem('b21-u3-session');if(!id){id=crypto.randomUUID();sessionStorage.setItem('b21-u3-session',id);}return id;}catch{return crypto.randomUUID();}
  });
  useEffect(()=>{if(resolved.notice)setNotice(resolved.notice);if(resolved.changed)navigate(resolved.canonical,{replace:true,state:location.state});},[resolved.canonical,resolved.changed,resolved.notice,navigate,location.state]);
  const move=useCallback((scene:number,step:number,kind:'replace'|'push'|'review'|'return',_key?:string,returnFocus?:string)=>{
    if(!scenes[scene]?.steps[step])return;
    const current=routeRef.current;
    const back=scene===7?null:kind==='review'&&current.scene===7?current.step+1:current.back;
    const next:StoryRoute={scene,step,back,presenter:false};
    setRevealed(false);
    navigate(routeURL(next),{replace:kind==='replace'||kind==='return',state:{...((location.state&&typeof location.state==='object')?location.state:{}),b21ReviewFocus:kind==='review'?returnFocus:location.state?.b21ReviewFocus}});
  },[navigate,location.state]);
  const command=useCallback((cmd:PresenterCommand)=>{
    if(cmd==='reveal') {if(scenes[routeRef.current.scene].steps[routeRef.current.step].reveal){setRevealed(v=>!v);}return;}
    const next=adjacent(routeRef.current,cmd==='next'?1:-1);move(next.scene,next.step,'replace');
  },[move,location.key]);
  const apply=useCallback((state:LectureSnapshot)=>{
    setReceived(previous=>JSON.stringify(previous)===JSON.stringify(state)?previous:state);
    const target=routeURL({...state.route,presenter:true});
    if(location.pathname+location.search!==target)navigate(target,{replace:true,state:location.state});
  },[location.pathname,location.search,location.state,navigate]);
  const sync=usePresenterChannel(session,route.presenter,{route:{...route,presenter:false},reveal:revealed},apply,command);
  useEffect(()=>{if(sync.connected)setHadConnection(true);},[sync.connected]);
  const disconnected=hadConnection&&!sync.connected;
  useEffect(()=>{
    if(!opened)return;
    const timer=setInterval(()=>{if(popup.current?.closed){setOpened(false);setPopupNotice('발표자 창이 닫혔습니다. 다시 열거나 강사 노트 서랍을 사용하세요.');}else if(!sync.connected)setPopupNotice('발표자 창 연결을 기다립니다. 연결되지 않으면 강사 노트 서랍을 사용하세요.');else setPopupNotice('');},1000);
    return ()=>clearInterval(timer);
  },[opened,sync.connected]);
  const openPresenter=()=>{
    if(sync.unavailable){setPopupNotice('이 브라우저에서는 창 동기화를 사용할 수 없습니다. 강사 노트 서랍을 사용하세요.');return;}
    const url=new URL(window.location.href);url.search=new URLSearchParams({view:'v3-router',sync:session??''}).toString();url.hash=routeURL({...route,presenter:true});
    popup.current=window.open(url.href,`b21-presenter-${session}`,'popup,width=1060,height=850');
    if(!popup.current){setPopupNotice('팝업이 차단되었습니다. 팝업을 허용한 뒤 다시 열거나 강사 노트 서랍을 사용하세요.');return;}
    setOpened(true);setPopupNotice('발표자 창 연결을 기다립니다. 강사 노트 서랍도 사용할 수 있습니다.');popup.current.focus();
  };
  if(route.presenter){
    const state=received??{route,reveal:false},current=scenes[state.route.scene],step=current.steps[state.route.step],next=adjacent(state.route,1),nextStep=scenes[next.scene].steps[next.step];
    return <main className="b21-presenter">
      <header><p>강사용 발표자 창</p><h1>Scene {current.id} · {state.route.step+1} / {current.steps.length} · {step.title}</h1><p role="status" data-testid="presenter-status">{sync.connected?'투영 창과 연결됨':sync.unavailable?'동기화 불가 · 투영 창의 강사 노트 서랍을 사용하세요.':'투영 창 연결 대기 · 투영 창을 열거나 새로고침하세요. 강사 노트 서랍도 사용할 수 있습니다.'}</p></header>
      <nav aria-label="발표자 조작"><button disabled={!sync.connected||(state.route.scene===0&&state.route.step===0)} onClick={()=>sync.request('previous')}>이전 단계</button><button disabled={!sync.connected||(next.scene===state.route.scene&&next.step===state.route.step)} onClick={()=>sync.request('next')}>다음 단계</button><button disabled={!sync.connected||!step.reveal} aria-pressed={state.reveal} onClick={()=>sync.request('reveal')}>{state.reveal?'답 숨기기 요청':'답 공개 요청'}</button></nav>
      <section><h2>핵심 질문</h2><p>{current.question}</p><p>{step.say}</p></section>
      <section className="b21-presenter-notes"><h2>강사 대본·기대 답</h2><InstructorNotes scene={current} step={step} index={state.route.step} expanded/></section>
      <section><h2>다음 단계 미리보기</h2><p>{next.scene===state.route.scene&&next.step===state.route.step?'강의 마지막 단계입니다.':`Scene ${scenes[next.scene].id} · ${next.step+1} · ${nextStep.title}`}</p><p>{nextStep.say}</p></section>
    </main>;
  }
  return <>{(notice||popupNotice||sync.unavailable||disconnected)&&<aside className="b21-route-notice" role="status">{notice&&<span>{notice} <button onClick={()=>setNotice('')}>안내 닫기</button></span>}{popupNotice&&<span>{popupNotice}</span>}{disconnected&&<span>발표자 창 연결이 끊겼습니다. 다시 열거나 강사 노트 서랍을 사용하세요.</span>}{sync.unavailable&&<span>창 동기화를 사용할 수 없습니다. 강사 노트 서랍을 사용하세요.</span>}</aside>}
    <B21TeachingStory control={{position:route,reveal:revealed,back:route.back===null?null:{scene:7,step:route.back-1,key:typeof location.state?.b21ReviewFocus==='string'?location.state.b21ReviewFocus:undefined},move,toggleReveal:()=>{setRevealed(v=>!v);},openPresenter}}/>
  </>;
}
