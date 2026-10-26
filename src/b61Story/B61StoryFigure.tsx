import {useLayoutEffect,useRef,useState} from 'react';
import type {DiagramId,DiagramState} from './content';
import erdPC from '../../content/mission-stories/main-m11/assets/erd-story-desktop.svg?raw';
import erdMobile from '../../content/mission-stories/main-m11/assets/erd-story-mobile.svg?raw';
import splitPC from '../../content/mission-stories/main-m11/assets/split-story-desktop.svg?raw';
import splitMobile from '../../content/mission-stories/main-m11/assets/split-story-mobile.svg?raw';
import samePC from '../../content/mission-stories/main-m11/assets/same-structure-desktop.svg?raw';
import sameMobile from '../../content/mission-stories/main-m11/assets/same-structure-mobile.svg?raw';
import joinPC from '../../content/mission-stories/main-m11/assets/join-compare-desktop.svg?raw';
import joinMobile from '../../content/mission-stories/main-m11/assets/join-compare-mobile.svg?raw';

// Only these approved repository assets can enter innerHTML. Asset safety is checked by content.test.ts.
const assets:Record<DiagramId,readonly [string,string]>={
  'erd-story':[erdPC,erdMobile],'split-story':[splitPC,splitMobile],
  'same-structure':[samePC,sameMobile],'join-compare':[joinPC,joinMobile],
};
export default function B61StoryFigure({diagram,state}:{diagram:DiagramId;state:DiagramState}){
  const frame=useRef<HTMLDivElement>(null),host=useRef<HTMLDivElement>(null);
  const [mobile,setMobile]=useState(()=>typeof window!=='undefined'&&window.innerWidth<900);
  useLayoutEffect(()=>{
    const observer=new ResizeObserver(([entry])=>setMobile(entry.contentRect.width<900));
    observer.observe(frame.current!);return()=>observer.disconnect();
  },[]);
  const raw=assets[diagram][mobile?1:0];
  useLayoutEffect(()=>{
    const shadow=host.current!.shadowRoot??host.current!.attachShadow({mode:'open'});
    // Shadow DOM also isolates marker IDs and the authored SVG's style rules from the site.
    shadow.innerHTML=raw+'<style>:host{display:block;line-height:normal;letter-spacing:normal}svg{display:block;width:100%;height:auto;font-family:"Pretendard VF","Apple SD Gothic Neo","Malgun Gothic",sans-serif}</style>';
  },[raw]);
  useLayoutEffect(()=>{
    const svg=host.current?.shadowRoot?.querySelector('svg');
    if(svg?.getAttribute('data-states')?.split(' ').includes(state))svg.setAttribute('data-state',state);
  },[raw,state]);
  return <div ref={frame} className="b61-art-frame" data-layout={mobile?'mobile':'desktop'} data-diagram={diagram}>
    <div ref={host} className="b61-art-host"/>
  </div>;
}
