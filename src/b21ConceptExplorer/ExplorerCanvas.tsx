import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import { explorerData, explorerLayout as layout, nodeById } from './adapter';
import type { ExplorerState } from './state';
import { fitMap, resizeCamera } from './camera';

export default function ExplorerCanvas({state,onNode,onRelation,onGuide,expanded,onExpand}: {state:ExplorerState;onNode:(id:string)=>void;onRelation:(id:string)=>void;onGuide?:()=>void;expanded:boolean;onExpand:()=>void}) {
  const svg=useRef<SVGSVGElement>(null);
  const [size,setSize]=useState({width:0,height:0});
  const [camera,setCamera]=useState({x:0,y:0,scale:.9});
  const prior=useRef({key:'',width:0,height:0});
  const cameraMode=useRef<'all'|'read'|'manual'>('all');
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const pinch=useRef<{distance:number;scale:number;worldX:number;worldY:number}|null>(null);
  const drag=useRef<{id:number;x:number;y:number;cx:number;cy:number}|null>(null);
  function focusNode(id: string, fitConnections=false) {
    cameraMode.current='read';
    const rels=explorerData.relations.filter(r=>state.relation?r.id===state.relation:
      (r.from===id||r.to===id)&&(state.type==='all'||r.type===state.type));
    const ids=new Set([id,...rels.flatMap(r=>[r.from,r.to])]);
    const cards=[...ids].map(key=>layout.positions.get(key)!);
    const points=rels.flatMap(r=>layout.routes.get(r.id)!.points);
    const left=Math.min(...cards.map(p=>p.x),...points.map(p=>p[0]))-24;
    const top=Math.min(...cards.map(p=>p.y),...points.map(p=>p[1]))-24;
    const right=Math.max(...cards.map(p=>p.x+p.width),...points.map(p=>p[0]))+24;
    const bottom=Math.max(...cards.map(p=>p.y+p.height),...points.map(p=>p[1]))+24;
    const fit=Math.min(1.05,size.width/(right-left),size.height/(bottom-top));
    const scale=fitConnections?fit:Math.max(.9,fit);
    const p=layout.positions.get(id)!;
    const halfWidth=size.width/scale/2,halfHeight=size.height/scale/2;
    // Keep the selected card readable; use the remaining space for its neighbours.
    const cx=fitConnections?(left+right)/2:Math.max(p.x+p.width-halfWidth+12,Math.min((left+right)/2,p.x+halfWidth-12));
    const cy=fitConnections?(top+bottom)/2:Math.max(p.y+p.height-halfHeight+12,Math.min((top+bottom)/2,p.y+halfHeight-12));
    setCamera({x:cx-size.width/scale/2,y:cy-size.height/scale/2,scale});
  }
  useEffect(()=>{
    const el=svg.current!;
    const observer=new ResizeObserver(()=>setSize({width:el.clientWidth,height:el.clientHeight}));
    observer.observe(el);return ()=>observer.disconnect();
  },[]);
  useLayoutEffect(()=>{
    if(!size.width||!size.height)return;
    const key=[state.node,state.area,state.relation,state.type].join('|'),old=prior.current;
    if(old.key!==key||!old.width){
      const id=state.node??explorerData.areas.find(a=>a.id===state.area)?.representativeNodeId;
      if(id)focusNode(id);else {cameraMode.current='all';setCamera(fitMap(size,layout.width,layout.height));}
    }else if(cameraMode.current==='all')setCamera(fitMap(size,layout.width,layout.height));
    else setCamera(c=>resizeCamera(c,old,size));
    prior.current={key,...size};
  },[state.node,state.area,state.relation,state.type,size.width,size.height]);
  function zoom(factor: number) {
    cameraMode.current='manual';
    setCamera(c=>{const scale=Math.max(.14,Math.min(1.8,c.scale*factor));return {scale,
      x:c.x+size.width/2/c.scale-size.width/2/scale,y:c.y+size.height/2/c.scale-size.height/2/scale};});
  }
  function down(e: PointerEvent<SVGSVGElement>) {
    if(e.button!==0||(e.target as Element).closest('[data-explorer-node],[data-explorer-edge]'))return;
    e.preventDefault();cameraMode.current='manual';pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y};e.currentTarget.setPointerCapture(e.pointerId);
    if(pointers.current.size===2){const [a,b]=[...pointers.current.values()],r=e.currentTarget.getBoundingClientRect();pinch.current={distance:Math.hypot(a.x-b.x,a.y-b.y),scale:camera.scale,worldX:camera.x+((a.x+b.x)/2-r.left)/camera.scale,worldY:camera.y+((a.y+b.y)/2-r.top)/camera.scale};drag.current=null;}
  }
  function finish(e:PointerEvent<SVGSVGElement>){pointers.current.delete(e.pointerId);pinch.current=null;drag.current=null;}
  const selected=state.relation?explorerData.relations.filter(r=>r.id===state.relation):explorerData.relations.filter(r=>
    (state.type==='all'||r.type===state.type)&&(!state.node||r.from===state.node||r.to===state.node));
  const related=new Set(selected.flatMap(r=>[r.from,r.to]));
  const current=nodeById.get(state.node??''),relation=explorerData.relations.find(r=>r.id===state.relation);
  const readTarget=state.node??explorerData.areas.find(a=>a.id===state.area)?.representativeNodeId;
  return <section className={`b21ce-diagram${expanded?' is-expanded':''}`} aria-label="관계 Canvas">
    <h2 className="b21ce-selection-heading" tabIndex={-1}>{relation?`${relation.id} · ${relation.type} 관계 지도`:current?`${current.label} 관계 지도`:'관계 지도'}</h2>
    <div className="b21ce-row b21ce-camera">
      <button aria-label="전체 맞춤" onClick={()=>{cameraMode.current='all';setCamera(fitMap(size,layout.width,layout.height));}}><span className="ce-wide">전체 맞춤</span><span className="ce-short" aria-hidden="true">전체</span></button>
      <button aria-label="선택 영역 읽기" disabled={!readTarget} onClick={()=>readTarget&&focusNode(readTarget)}><span className="ce-wide">선택 영역 읽기</span><span className="ce-short" aria-hidden="true">읽기</span></button>
      <button aria-label="연결 맞춤" disabled={!readTarget} onClick={()=>readTarget&&focusNode(readTarget,true)}><span className="ce-wide">연결 맞춤</span><span className="ce-short" aria-hidden="true">연결</span></button>
      <button aria-label="지도 확대" onClick={()=>zoom(1.25)}>＋</button><button aria-label="지도 축소" onClick={()=>zoom(.8)}>−</button>
      <button className="b21ce-expand" aria-label={expanded?'지도 기본 크기':'지도 크게 보기'} aria-expanded={expanded} aria-controls="b21ce-map-svg" onClick={onExpand}><span className="ce-wide">{expanded?'원래 화면으로':'지도 크게 보기'}</span><span className="ce-short" aria-hidden="true">{expanded?'돌아가기':'큰 화면'}</span></button>
    </div>
    {relation&&<p className="b21ce-direction">{nodeById.get(relation.from)!.label} → {nodeById.get(relation.to)!.label} · {relation.type} · {relation.label}</p>}
    <svg ref={svg} id="b21ce-map-svg" className="b21ce-svg" role="group" aria-label="B2-1 개념 관계 지도" tabIndex={0}
      viewBox={`${camera.x} ${camera.y} ${Math.max(1,size.width)/camera.scale} ${Math.max(1,size.height)/camera.scale}`}
      onKeyDown={e=>{if(e.target!==e.currentTarget)return;const delta={ArrowLeft:[-60,0],ArrowRight:[60,0],ArrowUp:[0,-60],ArrowDown:[0,60]}[e.key];if(delta){e.preventDefault();cameraMode.current='manual';setCamera(c=>({...c,x:c.x+delta[0]/c.scale,y:c.y+delta[1]/c.scale}));}else if(e.key==='+'||e.key==='='){e.preventDefault();zoom(1.25);}else if(e.key==='-'){e.preventDefault();zoom(.8);}else if(e.key==='Home'){e.preventDefault();cameraMode.current='all';setCamera(fitMap(size,layout.width,layout.height));}}}
      onPointerDown={down} onPointerMove={e=>{
        if(pointers.current.has(e.pointerId))pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
        const gesture=pinch.current;
        if(gesture&&pointers.current.size===2){const [a,b]=[...pointers.current.values()],r=e.currentTarget.getBoundingClientRect(),scale=Math.max(.14,Math.min(1.8,gesture.scale*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,gesture.distance)));e.preventDefault();setCamera({scale,x:gesture.worldX-((a.x+b.x)/2-r.left)/scale,y:gesture.worldY-((a.y+b.y)/2-r.top)/scale});return;}
        const d=drag.current;if(d&&d.id===e.pointerId){e.preventDefault();setCamera(c=>({...c,x:d.cx-(e.clientX-d.x)/c.scale,y:d.cy-(e.clientY-d.y)/c.scale}));}}}
      onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish}>
      <defs><marker id="b21ce-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill="#24675e"/></marker></defs>
      {explorerData.areas.map(area=>{const p=layout.layouts.get(area.id)!;return <g key={area.id} className="b21ce-region"><rect {...p} rx="12"/><text x={p.x+12} y={p.y+27}>{area.label}</text></g>;})}
      {selected.map(rel=>{const route=layout.routes.get(rel.id)!;return <g key={rel.id} data-explorer-relation={rel.id}>
        <path d={route.path} className={`b21ce-line ${rel.type==='사용'?'is-dashed':''}`} markerEnd="url(#b21ce-arrow)"/>
        <path d={route.path} className="b21ce-hit" data-explorer-edge={rel.id} onClick={()=>onRelation(rel.id)}><title>{`${rel.id} · ${rel.type} · ${rel.label}`}</title></path>
      </g>;})}
      {explorerData.nodes.map(node=>{const p=layout.positions.get(node.id)!;const active=state.node===node.id;return <g key={node.id} role="button" tabIndex={0}
        aria-label={`${node.label} 개념 선택`} aria-pressed={active} data-explorer-node={node.id}
        className={`b21ce-node ${active?'is-selected':state.node&&related.has(node.id)?'is-related':''} ${!state.node||active||related.has(node.id)?'':'is-muted'}`}
        transform={`translate(${p.x} ${p.y})`} onClick={()=>onNode(node.id)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))focusNode(node.id);}}
        onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onNode(node.id);}}}>
        <rect width={p.width} height={p.height} rx="9"/>
        <text className="b21ce-node-kicker" x="12" y="20">{active?'선택한 개념':state.node&&related.has(node.id)?'연결된 개념':explorerData.areas.find(a=>a.id===node.area)!.label}</text>
        <text x="12" y="45">{node.label}</text><title>{`${node.label} · ${node.easy}`}</title>
      </g>;})}
    </svg>
    {onGuide&&<button className="b21ce-guide-return" onClick={onGuide}>강사 안내로 돌아가기</button>}
  </section>;
}
