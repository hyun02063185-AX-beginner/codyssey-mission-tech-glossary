import {useLayoutEffect,useRef,useState} from 'react';
import {PresentationThemeSelector} from '../missionUI/PresentationTheme';
import desktop from '../../content/mission-stories/main-m11/assets/detail/erd-detail-desktop.svg?raw';
import mobile from '../../content/mission-stories/main-m11/assets/detail/erd-detail-mobile.svg?raw';
import './detailErd.css';

function DetailDialog({onClose,opener}:{onClose:()=>void;opener:HTMLButtonElement|null}){
  const dialog=useRef<HTMLDialogElement>(null),viewport=useRef<HTMLDivElement>(null),host=useRef<HTMLDivElement>(null),close=useRef<HTMLButtonElement>(null);
  const [compact,setCompact]=useState(()=>window.innerWidth<=700),[zoom,setZoom]=useState(1);
  const width=compact?360:1240;
  const changeZoom=(value:number)=>setZoom(Math.max(.5,Math.min(3,value)));
  const fit=()=>changeZoom(Math.min(1,(viewport.current?.clientWidth??width)/width));
  useLayoutEffect(()=>{
    const element=dialog.current!,scroll={x:window.scrollX,y:window.scrollY},overflow=document.body.style.overflow;
    element.showModal();document.body.style.overflow='hidden';close.current?.focus({preventScroll:true});
    let lastWidth=-1;
    const observer=new ResizeObserver(([entry])=>{
      if(Math.abs(entry.contentRect.width-lastWidth)<1)return;
      lastWidth=entry.contentRect.width;
      const nextCompact=entry.contentRect.width<=700,nextWidth=nextCompact?360:1240;
      setCompact(nextCompact);setZoom(Math.max(nextCompact ? .5 : .9,Math.min(1,entry.contentRect.width/nextWidth)));
    });
    observer.observe(viewport.current!);
    return()=>{observer.disconnect();element.close();document.body.style.overflow=overflow;opener?.focus({preventScroll:true});window.scrollTo(scroll.x,scroll.y);};
  },[opener]);
  useLayoutEffect(()=>{
    // Only the two pinned, repository-owned detailed SVGs can enter this isolated root.
    const root=host.current!.shadowRoot??host.current!.attachShadow({mode:'open'});
    root.innerHTML=(compact?mobile:desktop)+'<style>:host{display:block;line-height:normal;letter-spacing:normal}svg{display:block;width:100%;height:auto}</style>';
  },[compact]);
  return <dialog ref={dialog} className="b61-detail-dialog" aria-labelledby="b61-detail-title" onCancel={event=>{event.preventDefault();onClose();}} onKeyDown={event=>{
    event.stopPropagation();
    if(event.key==='Tab'){
      const targets=[...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(element=>element.getClientRects().length>0);
      if(event.shiftKey&&document.activeElement===targets[0]){event.preventDefault();targets.at(-1)?.focus();}
      else if(!event.shiftKey&&document.activeElement===targets.at(-1)){event.preventDefault();targets[0]?.focus();}
    }
  }}>
    <header className="b61-detail-header"><h2 id="b61-detail-title">B6-1 · 상세 ERD</h2><button ref={close} type="button" onClick={onClose}>닫기</button></header>
    <div className="b61-detail-tools" role="group" aria-label="상세 ERD 보기 도구">
      <button type="button" aria-label="상세 ERD 축소" disabled={zoom<=.5} onClick={()=>changeZoom(zoom-.25)}>−</button>
      <output aria-live="polite" aria-label="상세 ERD 확대 비율">{Math.round(zoom*100)}%</output>
      <button type="button" aria-label="상세 ERD 확대" disabled={zoom>=3} onClick={()=>changeZoom(zoom+.25)}>+</button>
      <button type="button" onClick={fit}>너비 맞춤</button><button type="button" onClick={()=>changeZoom(1)}>100%</button>
      <PresentationThemeSelector/>
    </div>
    <div ref={viewport} className="b61-detail-viewport" tabIndex={0} role="region" aria-label="상세 ERD 이동" aria-describedby="b61-detail-keys" onKeyDown={event=>{
      if(event.ctrlKey||event.metaKey||event.altKey)return;
      if(['+','=','-','0'].includes(event.key)){event.preventDefault();if(event.key==='0')changeZoom(1);else changeZoom(zoom+(event.key==='-'?-.25:.25));}
    }}>
      <div className="b61-detail-size" style={{width:width*zoom}}><div ref={host} className="b61-detail-art" data-layout={compact?'mobile':'desktop'}/></div>
    </div>
    <footer className="b61-detail-footer"><span id="b61-detail-keys">방향키·스크롤로 이동 · + / − 확대 · 0 원래 크기</span><span>PK 기본키 · FK 외래키</span></footer>
  </dialog>;
}

/** Optional schema viewer only; it never navigates or edits the twelve lecture screens. */
export default function B61DetailErd(){
  const [open,setOpen]=useState(false),opener=useRef<HTMLButtonElement>(null);
  return <><button ref={opener} type="button" aria-haspopup="dialog" onClick={()=>setOpen(true)}>ERD 상세 보기</button>{open&&<DetailDialog opener={opener.current} onClose={()=>setOpen(false)}/>}</>;
}
