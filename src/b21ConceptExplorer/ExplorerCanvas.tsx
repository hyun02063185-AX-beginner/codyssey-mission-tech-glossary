import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { explorerData, explorerLayout as layout, nodeById, typeMeanings } from './adapter';
import type { ExplorerState } from './state';

export default function ExplorerCanvas({state,onNode,onRelation}: {state:ExplorerState;onNode:(id:string)=>void;onRelation:(id:string)=>void}) {
  const svg=useRef<SVGSVGElement>(null);
  const [size,setSize]=useState({width:700,height:440});
  const [camera,setCamera]=useState({x:0,y:0,scale:.9});
  const drag=useRef<{id:number;x:number;y:number;cx:number;cy:number}|null>(null);
  function focusNode(id: string) {
    const rels=explorerData.relations.filter(r=>state.relation?r.id===state.relation:
      (r.from===id||r.to===id)&&(state.type==='all'||r.type===state.type));
    const ids=new Set([id,...rels.flatMap(r=>[r.from,r.to])]);
    const cards=[...ids].map(key=>layout.positions.get(key)!);
    const points=rels.flatMap(r=>layout.routes.get(r.id)!.points);
    const left=Math.min(...cards.map(p=>p.x),...points.map(p=>p[0]))-24;
    const top=Math.min(...cards.map(p=>p.y),...points.map(p=>p[1]))-24;
    const right=Math.max(...cards.map(p=>p.x+p.width),...points.map(p=>p[0]))+24;
    const bottom=Math.max(...cards.map(p=>p.y+p.height),...points.map(p=>p[1]))+24;
    const scale=Math.min(.9,size.width/(right-left),size.height/(bottom-top));
    setCamera({x:(left+right-size.width/scale)/2,y:(top+bottom-size.height/scale)/2,scale});
  }
  useEffect(()=>{
    const el=svg.current!;
    const observer=new ResizeObserver(()=>setSize({width:el.clientWidth,height:el.clientHeight}));
    observer.observe(el);return ()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    const id=state.node??explorerData.areas.find(a=>a.id===state.area)?.representativeNodeId;
    if(id)focusNode(id);
  },[state.node,state.area,state.relation,state.type,size.width,size.height]);
  function zoom(factor: number) {
    setCamera(c=>{const scale=Math.max(.14,Math.min(1.8,c.scale*factor));return {scale,
      x:c.x+size.width/2/c.scale-size.width/2/scale,y:c.y+size.height/2/c.scale-size.height/2/scale};});
  }
  function down(e: PointerEvent<SVGSVGElement>) {
    if(e.button!==0||(e.target as Element).closest('[data-explorer-node],[data-explorer-edge]'))return;
    e.preventDefault();drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y};e.currentTarget.setPointerCapture(e.pointerId);
  }
  const selected=state.relation?explorerData.relations.filter(r=>r.id===state.relation):explorerData.relations.filter(r=>
    (state.type==='all'||r.type===state.type)&&(!state.node||r.from===state.node||r.to===state.node));
  const related=new Set(selected.flatMap(r=>[r.from,r.to]));
  return <section className="b21ce-diagram" aria-label="관계 Canvas">
    <div className="b21ce-row b21ce-camera"><strong>관계 지도</strong>
      <button onClick={()=>{const scale=Math.min(size.width/layout.width,size.height/layout.height)*.95;setCamera({x:0,y:0,scale});}}>전체 맞춤</button>
      <button onClick={()=>focusNode(state.node??explorerData.areas.find(a=>a.id===state.area)!.representativeNodeId)}>선택 영역 읽기</button>
      <button aria-label="지도 확대" onClick={()=>zoom(1.25)}>＋</button><button aria-label="지도 축소" onClick={()=>zoom(.8)}>−</button>
    </div>
    <p className="b21ce-caption">배경을 드래그해 이동하세요. 작은 화면에서는 아래 개념 목록과 관계 목록으로도 탐색할 수 있습니다.</p>
    <svg ref={svg} className="b21ce-svg" role="group" aria-label="B2-1 개념 관계 지도"
      viewBox={`${camera.x} ${camera.y} ${size.width/camera.scale} ${size.height/camera.scale}`}
      onPointerDown={down} onPointerMove={e=>{const d=drag.current;if(d&&d.id===e.pointerId){e.preventDefault();setCamera(c=>({...c,x:d.cx-(e.clientX-d.x)/c.scale,y:d.cy-(e.clientY-d.y)/c.scale}));}}}
      onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
      <defs><marker id="b21ce-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="8" markerHeight="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L8 4 L0 8 Z" fill="#24675e"/></marker></defs>
      {explorerData.areas.map(area=>{const p=layout.layouts.get(area.id)!;return <g key={area.id} className="b21ce-region"><rect {...p} rx="12"/><text x={p.x+12} y={p.y+27}>{area.label}</text></g>;})}
      {selected.map(rel=>{const route=layout.routes.get(rel.id)!;return <g key={rel.id} data-explorer-relation={rel.id}>
        <path d={route.path} className={`b21ce-line ${rel.type==='사용'?'is-dashed':''}`} markerEnd="url(#b21ce-arrow)"/>
        <path d={route.path} className="b21ce-hit" data-explorer-edge={rel.id} onClick={()=>onRelation(rel.id)}><title>{`${rel.id} · ${rel.type} · ${rel.label}`}</title></path>
      </g>;})}
      {explorerData.nodes.map(node=>{const p=layout.positions.get(node.id)!;const active=state.node===node.id;return <g key={node.id} role="button" tabIndex={0}
        aria-label={`${node.label} 개념 선택`} aria-pressed={active} data-explorer-node={node.id}
        className={`b21ce-node ${active?'is-selected':''} ${!state.node||active||related.has(node.id)?'':'is-muted'}`}
        transform={`translate(${p.x} ${p.y})`} onClick={()=>onNode(node.id)} onFocus={e=>{if(e.currentTarget.matches(':focus-visible'))focusNode(node.id);}}
        onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onNode(node.id);}}}>
        <rect width={p.width} height={p.height} rx="9"/>
        <text className="b21ce-node-kicker" x="12" y="20">{active?'선택한 개념':explorerData.areas.find(a=>a.id===node.area)!.label}</text>
        <text x="12" y="45">{node.label.length>19?node.label.slice(0,18)+'…':node.label}</text><title>{`${node.label} · ${node.easy}`}</title>
      </g>;})}
    </svg>
    <div className="b21ce-legend">{Object.keys(typeMeanings).map(type=><span key={type}>{type}</span>)}<span>→ 원본 관계 방향</span><span>사용: 점선</span></div>
    {state.relation&&<p className="b21ce-caption">{nodeById.get(selected[0].from)!.label} → {nodeById.get(selected[0].to)!.label} · {selected[0].type} · {selected[0].label}</p>}
  </section>;
}
