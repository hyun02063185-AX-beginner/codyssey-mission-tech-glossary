import {useLayoutEffect,useRef,useState} from 'react';
const assets=import.meta.glob('../../content/mission-stories/main-m06/assets/*.svg',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
export default function B32Figure({desktop,mobile,journey=false}:{desktop:string[];mobile:string[];journey?:boolean}){
  const host=useRef<HTMLDivElement>(null),[narrow,setNarrow]=useState(()=>window.innerWidth<900);
  useLayoutEffect(()=>{const media=window.matchMedia('(max-width:899px)'),change=()=>setNarrow(media.matches);change();media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  const [name,state]=narrow?mobile:desktop;
  useLayoutEffect(()=>{const shadow=host.current!.shadowRoot??host.current!.attachShadow({mode:'open'});shadow.innerHTML=assets[`../../content/mission-stories/main-m06/assets/${name}`]+'<style>:host{display:flex;width:100%;height:100%;align-items:center;justify-content:center;line-height:normal;letter-spacing:normal}svg{display:block;max-width:100%;max-height:100%;width:auto;height:auto}</style>';shadow.querySelector('svg')?.setAttribute('data-state',state);},[name,state]);
  return <div className={journey?'b32-journey':'b32-figure'} data-figure={name} data-state={state} ref={host}/>;
}
