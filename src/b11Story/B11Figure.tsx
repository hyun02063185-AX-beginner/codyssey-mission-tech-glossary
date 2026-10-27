import {useLayoutEffect,useRef,useState} from 'react';
const assets=import.meta.glob('../../content/mission-stories/main-m01/assets/*.svg',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export default function B11Figure({desktop,mobile}:{desktop:string[];mobile:string[]}) {
  const host=useRef<HTMLDivElement>(null);
  const [narrow,setNarrow]=useState(()=>window.innerWidth<900);
  useLayoutEffect(()=>{const media=window.matchMedia('(max-width:899px)'),change=()=>setNarrow(media.matches);media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  const [name,state]=(narrow?mobile:desktop);
  useLayoutEffect(()=>{
    const shadow=host.current!.shadowRoot??host.current!.attachShadow({mode:'open'});
    shadow.innerHTML=assets[`../../content/mission-stories/main-m01/assets/${name}`]+'<style>:host{display:flex;width:100%;height:100%;align-items:center;justify-content:center;line-height:normal;letter-spacing:normal}svg{display:block;max-width:100%;max-height:100%;width:auto;height:auto;font-family:var(--font-body)}</style>';
    shadow.querySelector('svg')?.setAttribute('data-state',state);
  },[name,state]);
  return <div className="b11-figure" data-figure={name} ref={host}/>;
}
