import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { scenes, type StepAddress } from './content';
import { FigureContext, type FigureActions } from './figures/FigureContext';
import { StoryStage } from './components/StoryStage';
import { InstructorNotes } from './components/InstructorNotes';
import './b21StoryV3.css';

export interface StoryControl {
  position: {scene:number;step:number}; reveal: boolean; back: {scene:number;step:number;key?:string}|null;
  move: (scene:number,step:number,kind:'replace'|'push'|'review'|'return',key?:string,returnFocus?:string)=>void;
  toggleReveal: ()=>void; openPresenter: ()=>void;
}
export interface StoryExtensions { instructorNotesFooter?: ReactNode; afterLecture?: ReactNode }
interface Props { initialScene?: number; initialStep?: number; control?: StoryControl; extensions?: StoryExtensions }
/** U2 remains state-only; the private U3 adapter optionally owns position and reveal. */
export default function B21TeachingStory({initialScene=0,initialStep=0,control,extensions}: Props) {
  const [localPosition,setPosition]=useState({scene:initialScene,step:initialStep});
  const [localReveal,setReveal]=useState(false),[file,setFile]=useState('model');
  const [panel,setPanel]=useState<'toc'|'note'|null>(null);
  const [localBack,setBack]=useState<{scene:number;step:number;key?:string}|null>(null);
  const position=control?.position??localPosition, reveal=control?.reveal??localReveal, back=control?control.back:localBack;
  const root=useRef<HTMLDivElement>(null), focus=useRef<string|null>('b21t-root');
  const pendingMove=useRef<{scene:number;step:number;key:string|null}|null>(null);
  const buttons=useRef(new Map<string,HTMLButtonElement>());
  const scene=scenes[position.scene],step=scene.steps[position.step];
  const move=(sc:number,i:number,key?:string,kind:'replace'|'push'|'review'|'return'='replace',returnFocus?:string)=>{
    if(!scenes[sc]?.steps[i])return;
    const focusKey=key??(sc!==position.scene?'q':null);
    if(control){pendingMove.current={scene:sc,step:i,key:focusKey};control.move(sc,i,kind,key,returnFocus);return;}
    focus.current=focusKey;
    setPosition({scene:sc,step:i});setReveal(false);
    if(sc===7)setBack(null);
  };
  const advance=(delta:number)=>{
    let sc=position.scene,i=position.step+delta;
    if(i<0){sc--;i=scenes[sc]?.steps.length-1;}
    else if(i>=scenes[sc].steps.length){sc++;i=0;}
    move(sc,i);
  };
  const close=()=>{focus.current=panel==='toc'?'tocBtn':'noteBtn';setPanel(null);};
  const open=(id:'toc'|'note')=>{
    if(panel===id){close();return;}focus.current=id==='toc'?'toc-current':'note-close';setPanel(id);
  };
  useLayoutEffect(()=>{
    if(pendingMove.current){
      if(pendingMove.current.scene!==position.scene||pendingMove.current.step!==position.step)return;
      focus.current=pendingMove.current.key;pendingMove.current=null;
    }
    const key=focus.current;focus.current=null;
    if(key) {
      const target=buttons.current.get(key)??root.current?.querySelector<HTMLElement>(`#${key}`);
      if(target){// Match the approved HTML replacement-focus behavior, including mobile scrolling.
        target.blur();target.focus();}
      else root.current?.focus({preventScroll:true});
    }
    else if(document.activeElement===document.body)root.current?.focus({preventScroll:true});
  });
  const actions:FigureActions={reveal,file,
    register:(key,button)=>{if(button)buttons.current.set(key,button);else buttons.current.delete(key);},
    select:(id,key,selectedFile)=>{
      if(selectedFile)setFile(selectedFile);
      const target=step.id===id&&id!=='module'?(step.home??scene.home):id;
      move(position.scene,scene.steps.findIndex(s=>s.id===target),key);
    },
    scene:sc=>move(sc,0,'q'),
    review:(address:StepAddress,key)=>{
      const sc=scenes.findIndex(s=>s.id===address.scene);
      const i=scenes[sc].addressing==='id'?scenes[sc].steps.findIndex(s=>s.id===address.step):Number(address.step)-1;
      setBack({scene:position.scene,step:position.step,key});move(sc,i,'q','review',key);
    },
    toggleReveal:key=>{focus.current=key??null;if(control)control.toggleReveal();else setReveal(value=>!value);},
  };
  const keydown=(event:React.KeyboardEvent)=>{
    if(event.altKey||event.ctrlKey||event.metaKey)return;
    if(event.key==='Escape'){if(panel){event.preventDefault();close();}return;}
    if(panel==='toc'||(event.target as HTMLElement).closest('summary,input,select,textarea'))return;
    const fn:Record<string,()=>void>={ArrowLeft:()=>advance(-1),ArrowRight:()=>advance(1),PageUp:()=>advance(-1),PageDown:()=>advance(1),Home:()=>move(position.scene,0),End:()=>move(position.scene,scene.steps.length-1)};
    if(fn[event.key]){event.preventDefault();fn[event.key]();}
  };
  return <div className="b21t" id="b21t-root" tabIndex={-1} ref={root} onKeyDown={keydown}>
    <FigureContext.Provider value={actions}><div className="app">
      <header className="top"><span className="ctx" id="ctx">{scene.ctx}</span><span className={`tag${step.real?' real':''}`} id="tag">{step.real?'실제 사례 · 용돈 기입장 ledger':scene.tag??'가상 todo 예시'}</span>
        <button className="backmap" id="backMap" hidden={!back} onClick={()=>{if(back)move(back.scene,back.step,back.key,'return');}}>← 개념지도로 돌아가기 (Scene 08 · {(back?.step??0)+1}단계)</button>
        <h1 id="q" tabIndex={-1}>{scene.question}</h1></header>
      <StoryStage step={step}/>
      <p className="say" id="say" aria-live="polite"><span>{step.say.split(/(__main__\.py)/).map((text,i)=>text==='__main__.py'?<code key={i}>{text}</code>:text)}</span></p>
      <nav className="ctl" aria-label="강사 조작">
        <button id="tocBtn" aria-expanded={panel==='toc'} aria-controls="toc" onClick={()=>open('toc')}><span className="long">목차</span><span className="short">목차</span></button>
        <button id="noteBtn" aria-expanded={panel==='note'} aria-controls="note" onClick={()=>open('note')}><span className="long">강사 노트</span><span className="short">노트</span></button>
        {control&&<button id="presenterBtn" onClick={control.openPresenter}>발표자 창</button>}
        <div className="pos" aria-live="off"><span className="t" id="pos">Scene {scene.id} · {position.step+1} / {scene.steps.length} · {step.title}</span><span className="bar" aria-hidden="true"><i id="barFill" style={{width:`${(position.step+1)/scene.steps.length*100}%`}}/></span></div>
        <button id="homeBtn" onClick={()=>move(position.scene,scene.steps.findIndex(s=>s.id===(step.home??scene.home)))}><span className="long">전체 구조</span><span className="short">전체</span></button>
        <button id="prev" aria-label="이전" disabled={position.scene===0&&position.step===0} onClick={()=>advance(-1)}>‹<span className="long"> 이전</span></button>
        <button id="next" aria-label="다음" disabled={position.scene===7&&position.step===scene.steps.length-1} onClick={()=>advance(1)}><span className="long">다음 </span>›</button>
      </nav>
    </div>{extensions?.afterLecture}</FigureContext.Provider>
    <div className={`shade${panel?' on':''}`} id="shade" onClick={close}/>
    <aside className={`drawer${panel==='toc'?' on':''}`} id="toc" aria-label="목차와 핵심 문장" inert={panel!=='toc'}><header><h2>목차 · 핵심 문장 한눈에 보기</h2><button onClick={close}>닫기</button></header><div className="body toc" id="tocBody">{scenes.map((s,sc)=><div key={s.id} style={{display:'contents'}}><div className="scene-h">Scene {s.id} · {s.question}</div>{s.steps.map((t,i)=><button key={t.id} id={sc===position.scene&&i===position.step?'toc-current':undefined} aria-current={sc===position.scene&&i===position.step?'step':undefined} onClick={()=>{setPanel(null);move(sc,i,'q','push');}}><span>{s.id}-{i+1}</span><span><b>{t.title}</b>{t.say}</span></button>)}</div>)}</div></aside>
    <aside className={`drawer${panel==='note'?' on':''}`} id="note" aria-label="강사 노트" inert={panel!=='note'}><header><h2>강사 노트</h2><button id="note-close" onClick={close}>닫기</button></header><div className="body" id="noteBody"><InstructorNotes key={`${scene.id}-${step.id}-${reveal}`} scene={scene} step={step} index={position.step}/>{extensions?.instructorNotesFooter}</div></aside>
  </div>;
}
