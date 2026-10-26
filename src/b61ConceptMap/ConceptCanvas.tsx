import {useEffect,useLayoutEffect,useRef,useState,type PointerEvent} from 'react';
import {data,layout,nodeById} from './adapter';
import {fitBounds,fitMap,resizeCamera,type Camera} from '../b21ConceptExplorer/camera';

// Labels live in reserved gutters, outside every card. These are B6-1 presentation coordinates.
const labels:Record<string,{x:number;y:number;lines:string[]}>= {
 R01:{x:861,y:148,lines:['관리한다']},R02:{x:555,y:48,lines:['테이블에','나누어 담는다']},
 R03:{x:562,y:183,lines:['기록 한 건']},R04:{x:556,y:322,lines:['정보의 종류']},
 R05:{x:254,y:323,lines:['행을 하나씩','구별한다']},R06:{x:258,y:413,lines:['다른 테이블의','PK를 가리킨다']},
 R07:{x:258,y:260,lines:['관계를 데이터로','남긴다']},R08:{x:255,y:92,lines:['상자로 그린다']},
 R09:{x:254,y:157,lines:['선으로 그린다']},R10:{x:867,y:195,lines:['DBMS에','요청한다']},
 R11:{x:1164,y:158,lines:['조회에서','쓰는 방법']},R12:{x:711,y:278,lines:['조건에 맞는','행끼리 잇는다']},
};

export default function ConceptCanvas({node,relation,onNode,onRelation,full,onFull}:{node:string|null;relation:string|null;onNode:(id:string)=>void;onRelation:(id:string)=>void;full:boolean;onFull:()=>void}){
 const svg=useRef<SVGSVGElement>(null),fullButton=useRef<HTMLButtonElement>(null),previousFull=useRef(full),[size,setSize]=useState({width:0,height:0}),[camera,setCamera]=useState<Camera>({x:0,y:0,scale:1});
 const prior=useRef({key:'',width:0,height:0}),mode=useRef('all');
 const pointers=useRef(new Map<number,{x:number;y:number}>());
 const gesture=useRef<{camera:Camera;x:number;y:number;distance:number}|null>(null);
 const focus=(id:string)=>{
  const p=layout.positions.get(id)!,rels=data.relations.filter(r=>r.from===id||r.to===id),cards=[p,...rels.flatMap(r=>[layout.positions.get(r.from)!,layout.positions.get(r.to)!])];
  const left=Math.min(...cards.map(p=>p.x),...rels.map(r=>labels[r.id].x-60))-12,right=Math.max(...cards.map(p=>p.x+p.width),...rels.map(r=>labels[r.id].x+60))+12;
  const top=Math.min(...cards.map(p=>p.y))-12,bottom=Math.max(...cards.map(p=>p.y+p.height))+12;
  mode.current='read';const scale=Math.max(.95,Math.min(1.1,size.width/(right-left),size.height/(bottom-top))),hw=size.width/scale/2,hh=size.height/scale/2;
  // Keep the selected card readable and uncovered; spend spare space on its connections.
  const cx=Math.max(p.x+p.width-hw+12,Math.min((left+right)/2,p.x+hw-12)),cy=Math.max(p.y+p.height-hh+12,Math.min((top+bottom)/2,p.y+hh-12));
  setCamera({scale,x:cx-hw,y:cy-hh});
 };
 const fit=()=>{mode.current='all';setCamera(fitMap(size,layout.width,layout.height));};
 useEffect(()=>{if(full!==previousFull.current){previousFull.current=full;requestAnimationFrame(()=>fullButton.current?.focus());}},[full]);
 useEffect(()=>{const el=svg.current!,observer=new ResizeObserver(()=>setSize({width:el.clientWidth,height:el.clientHeight}));observer.observe(el);return()=>observer.disconnect();},[]);
 useLayoutEffect(()=>{
  if(!size.width||!size.height)return;
  const key=`${node}|${relation}`,old=prior.current;
  if(key!==old.key||!old.width){if(node)focus(node);else if(relation){
   const r=data.relations.find(r=>r.id===relation)!,cards=[r.from,r.to].map(id=>layout.positions.get(id)!),points=layout.routes.get(r.id)!.points,l=labels[r.id];
   mode.current='relation';setCamera(fitBounds(size,{left:Math.min(...cards.map(p=>p.x),...points.map(p=>p[0]),l.x-64)-16,right:Math.max(...cards.map(p=>p.x+p.width),...points.map(p=>p[0]),l.x+64)+16,top:Math.min(...cards.map(p=>p.y),...points.map(p=>p[1]),l.y-28)-16,bottom:Math.max(...cards.map(p=>p.y+p.height),...points.map(p=>p[1]),l.y+28)+16}));
  }else fit();}
  else if(mode.current==='all')fit();
  else setCamera(c=>{const next=resizeCamera(c,old,size),p=node?layout.positions.get(node):null;if(!p)return next;return {...next,x:Math.min(p.x-12,Math.max(next.x,p.x+p.width+12-size.width/next.scale)),y:Math.min(p.y-12,Math.max(next.y,p.y+p.height+12-size.height/next.scale))};});
  prior.current={key,...size};
 },[node,relation,size.width,size.height]);
 const zoom=(factor:number)=>{mode.current='manual';setCamera(c=>{const scale=Math.max(.15,Math.min(2,c.scale*factor));return {scale,x:c.x+size.width/2/c.scale-size.width/2/scale,y:c.y+size.height/2/c.scale-size.height/2/scale};});};
 const highlighted=data.relations.filter(r=>relation?r.id===relation:node?r.from===node||r.to===node:r.core);
 const activeIds=new Set(highlighted.map(r=>r.id)),neighbours=new Set(highlighted.flatMap(r=>[r.from,r.to]));
 function start(e:PointerEvent<SVGSVGElement>){
  if(e.button!==0||(e.target as Element).closest('[data-node],[data-edge],[data-label]'))return;
  e.preventDefault();mode.current='manual';pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);
  const pts=[...pointers.current.values()],a=pts[0],b=pts[1]??a;
  gesture.current={camera,x:(a.x+b.x)/2,y:(a.y+b.y)/2,distance:Math.hypot(a.x-b.x,a.y-b.y)};
 }
 function finish(e:PointerEvent<SVGSVGElement>){pointers.current.delete(e.pointerId);gesture.current=null;}
 return <section className="b61cm-canvas" aria-label="개념지도 탐색">
  <div className="b61cm-camera"><button onClick={fit}>전체 보기</button><button disabled={!node&&!relation} onClick={()=>focus(node??data.relations.find(r=>r.id===relation)!.from)}>읽기 크기</button><button aria-label="지도 확대" onClick={()=>zoom(1.25)}>＋</button><button aria-label="지도 축소" onClick={()=>zoom(.8)}>−</button><button ref={fullButton} aria-label={full?'일반 보기로 돌아가기':'지도 크게 보기'} onClick={onFull}>{full?'원래 크기':'큰 화면'}</button></div>
  <svg ref={svg} className="b61cm-svg" role="group" aria-label="B6-1 데이터베이스 개념지도" tabIndex={0} viewBox={`${camera.x} ${camera.y} ${Math.max(1,size.width)/camera.scale} ${Math.max(1,size.height)/camera.scale}`}
   onKeyDown={e=>{if(e.target!==e.currentTarget)return;const delta={ArrowLeft:[-60,0],ArrowRight:[60,0],ArrowUp:[0,-60],ArrowDown:[0,60]}[e.key];if(delta){e.preventDefault();mode.current='manual';setCamera(c=>({...c,x:c.x+delta[0]/c.scale,y:c.y+delta[1]/c.scale}));}else if(['+','=','-'].includes(e.key)){e.preventDefault();zoom(e.key==='-'?.8:1.25);}else if(e.key==='Home'){e.preventDefault();fit();}}}
   onPointerDown={start} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onPointerMove={e=>{
    const g=gesture.current;if(!g||!pointers.current.has(e.pointerId))return;e.preventDefault();pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const pts=[...pointers.current.values()],a=pts[0],b=pts[1]??a,r=e.currentTarget.getBoundingClientRect(),x=(a.x+b.x)/2,y=(a.y+b.y)/2,scale=g.distance?Math.max(.15,Math.min(2,g.camera.scale*Math.hypot(a.x-b.x,a.y-b.y)/g.distance)):g.camera.scale;
    setCamera({scale,x:g.camera.x+(g.x-r.left)/g.camera.scale-(x-r.left)/scale,y:g.camera.y+(g.y-r.top)/g.camera.scale-(y-r.top)/scale});
   }}>
   <defs><marker id="b61cm-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill="context-stroke"/></marker></defs>
   {data.areas.map(a=>{const p=layout.regions.get(a.id)!;return <g key={a.id} className={`b61cm-region area-${a.id}`}><rect {...p} rx="16"/><text x={p.x+14} y={p.y+29}>{a.label}</text></g>;})}
   {data.relations.map(r=>{const route=layout.routes.get(r.id)!;const active=activeIds.has(r.id);return <g key={r.id} data-relation={r.id} className={`b61cm-relation ${active?'is-active':'is-muted'} ${r.core?'is-core':'is-supporting'}`}>
    <path d={route.path} className="b61cm-line" markerEnd="url(#b61cm-arrow)"/>
    <path d={route.path} className="b61cm-hit" data-edge={r.id} onClick={()=>onRelation(r.id)}><title>{`${nodeById.get(r.from)!.label} → ${nodeById.get(r.to)!.label} · ${r.label}`}</title></path>
   </g>;})}
   {data.relations.filter(r=>r.core||activeIds.has(r.id)).map(r=>{const l=labels[r.id],height=l.lines.length*18+10;return <g key={'label-'+r.id} className={`b61cm-edge-label ${activeIds.has(r.id)?'':'is-muted'}`} data-label={r.id} role="button" tabIndex={0} aria-label={`${r.type} 관계: ${r.label}`} transform={`translate(${l.x} ${l.y})`} onClick={()=>onRelation(r.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onRelation(r.id);}}}>
    <rect x="-57" y={-height/2} width="114" height={height} rx="6"/><text textAnchor="middle">{l.lines.map((line,i)=><tspan key={line} x="0" y={(i-(l.lines.length-1)/2)*18+5}>{line}</tspan>)}</text>
   </g>;})}
   {data.nodes.map(n=>{const p=layout.positions.get(n.id)!;return <g key={n.id} data-node={n.id} role="button" aria-label={`${n.label} 개념 선택`} aria-pressed={node===n.id} tabIndex={0} className={`b61cm-node ${node===n.id?'is-selected':node||relation?neighbours.has(n.id)?'is-related':'is-muted':''}`} transform={`translate(${p.x} ${p.y})`} onClick={()=>onNode(n.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onNode(n.id);}}} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))focus(n.id);}}>
    <rect width={p.width} height={p.height} rx="12"/><text className="b61cm-node-name" x="14" y="32">{n.label}</text><text className="b61cm-node-subtitle" x="14" y="56">{n.subtitle}</text><title>{n.easy}</title>
   </g>;})}
  </svg>
 </section>;
}
