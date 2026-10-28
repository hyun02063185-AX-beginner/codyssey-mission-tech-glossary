import {useEffect, useState} from 'react';
import {steps} from './data';
export type Flight = {from: number; to: number; progress: number};

export function usePacketPlayer() {
  const [index,setIndex] = useState(0), [playing,setPlaying] = useState(false);
  const [flight,setFlight] = useState<Flight|null>(null), [moving,setMoving] = useState(false);
  const [reduced,setReduced] = useState(() => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media=matchMedia('(prefers-reduced-motion: reduce)'), update=()=>setReduced(media.matches);
    update(); media.addEventListener('change',update);return ()=>media.removeEventListener('change',update);
  },[]);
  function advance() {
    if (flight) {setMoving(true);return;}
    if (index===steps.length-1) return;
    const next=index+1;
    if (reduced || steps[next].p!==steps[index].p) setIndex(next);
    else {setFlight({from:index,to:next,progress:0});setMoving(true);}
  }
  // A paused flight retains its progress; only an active flight owns an RAF.
  useEffect(() => {
    if (!moving || !flight) return;
    const {from,to,progress}=flight;
    const finish=()=>{setIndex(to);setFlight(null);setMoving(false);};
    if (reduced) {finish();return;}
    let frame=0, start:number|undefined;
    const tick=(now:number)=>{
      start??=now;
      const value=Math.min(1,progress+(now-start)/800);
      if (value===1) {finish();return;}
      setFlight(previous=>previous?.from===from&&previous.to===to?{...previous,progress:value}:previous);
      frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);return ()=>cancelAnimationFrame(frame);
    // Progress is deliberately not a dependency: an uninterrupted flight has one clock.
  },[moving,flight?.from,flight?.to,reduced]);
  useEffect(() => {
    if (!playing || flight) return;
    if (index===steps.length-1) {setPlaying(false);return;}
    const timer=setTimeout(advance,900);return ()=>clearTimeout(timer);
  },[playing,index,Boolean(flight),reduced]);
  function pause() {setPlaying(false);setMoving(false);}
  function restart() {pause();setFlight(null);setIndex(0);}
  function play() {
    if (playing) {pause();return;}
    setPlaying(true);
    if (index===steps.length-1) {setIndex(0);setFlight(null);}
    else advance();
  }
  return {index,playing,flight,moving,reduced,play,pause,restart,
    next:()=>{setPlaying(false);advance();},
    previous:()=>{pause();setFlight(null);setIndex(Math.max(0,index-1));}};
}
