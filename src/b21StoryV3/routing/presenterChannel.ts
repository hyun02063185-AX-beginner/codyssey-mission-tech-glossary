import { useEffect, useRef, useState } from 'react';
import { scenes } from '../content';
import type { StoryRoute } from './storyRoute';
export interface LectureSnapshot { route: StoryRoute; reveal: boolean }
export type PresenterCommand = 'previous' | 'next' | 'reveal';
const commands: readonly string[] = ['previous','next','reveal'];
export function isSnapshot(value: unknown): value is LectureSnapshot {
  if (!value || typeof value !== 'object') return false;
  const {route,reveal}=value as LectureSnapshot;
  return !!route && Number.isInteger(route.scene) && Number.isInteger(route.step) && !!scenes[route.scene]?.steps[route.step] && !route.presenter && typeof reveal==='boolean' && (route.back===null || (route.scene!==7 && Number.isInteger(route.back) && route.back>=1 && route.back<=scenes[7].steps.length));
}
/** A scoped channel: only projector publishes state, presenter sends deduplicated requests. */
export function usePresenterChannel(session: string | null, presenter: boolean, snapshot: LectureSnapshot, apply: (snapshot: LectureSnapshot)=>void, command: (command: PresenterCommand)=>void) {
  const [connected,setConnected]=useState(false),[unavailable,setUnavailable]=useState(false);
  const channel=useRef<BroadcastChannel|null>(null), latest=useRef({snapshot,apply,command});
  const seen=useRef(new Set<string>()), peer=useRef(0);
  latest.current={snapshot,apply,command};
  useEffect(()=>{
    if(!session || !/^[a-zA-Z0-9-]{16,80}$/.test(session) || typeof BroadcastChannel==='undefined') {setUnavailable(true);return;}
    let stopped=false;
    const send=(message:object)=>{try{channel.current?.postMessage({version:1,...message});}catch{channel.current?.close();channel.current=null;setConnected(false);setUnavailable(true);}};
    const publish=()=>send({type:'state',payload:latest.current.snapshot});
    const open=()=>{
      if(stopped||channel.current)return;
      try {
        const c=new BroadcastChannel(`b21-u3-${session}`);channel.current=c;setUnavailable(false);
        c.onmessage=event=>{
          const m=event.data;
          if(!m || m.version!==1)return;
          if(presenter && m.type==='state' && isSnapshot(m.payload)) {
            peer.current=Date.now();setConnected(true);latest.current.apply(m.payload);send({type:'ack'});
          } else if(!presenter && (m.type==='hello'||m.type==='ack')) {
            peer.current=Date.now();setConnected(true);if(m.type==='hello')publish();
          } else if(!presenter && m.type==='request' && typeof m.id==='string' && m.id.length<=100 && commands.includes(m.command) && !seen.current.has(m.id)) {
            seen.current.add(m.id);if(seen.current.size>512)seen.current.delete(seen.current.values().next().value!);
            latest.current.command(m.command);
          }
        };
        c.onmessageerror=()=>{c.close();channel.current=null;setConnected(false);setUnavailable(true);};
        if(presenter)send({type:'hello'});else publish();
      }catch{setUnavailable(true);}
    };
    open();
    const timer=setInterval(()=>{
      open();if(presenter)send({type:'hello'});else publish();
      if(Date.now()-peer.current>4000)setConnected(false);
    },1000);
    return ()=>{stopped=true;clearInterval(timer);channel.current?.close();channel.current=null;peer.current=0;};
  },[session,presenter]);
  useEffect(()=>{if(!presenter)try{channel.current?.postMessage({version:1,type:'state',payload:snapshot});}catch{setConnected(false);}},[presenter,snapshot]);
  const request=(cmd:PresenterCommand)=>{
    if(!connected||!channel.current)return;
    try{channel.current.postMessage({version:1,type:'request',id:crypto.randomUUID(),command:cmd});}catch{setConnected(false);}
  };
  return {connected,unavailable,request};
}
