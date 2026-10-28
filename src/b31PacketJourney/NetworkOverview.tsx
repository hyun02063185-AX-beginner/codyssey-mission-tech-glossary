import {useEffect,useId,useRef,useState} from 'react';
import {definitions,links,topology,type NodeId} from './data';
/** Same topology as the interactive journey, without paths or packet states. */
export default function NetworkOverview(){
  const frame=useRef<HTMLDivElement>(null),[width,setWidth]=useState(736),id=useId().replaceAll(':','');
  useEffect(()=>{const obs=new ResizeObserver(([entry])=>setWidth(Math.round(entry.contentRect.width)));obs.observe(frame.current!);return()=>obs.disconnect();},[]);
  const map=topology(width);
  return <figure className="b31-overview-figure">
    <figcaption>연결된 길을 먼저 살펴보고, 다음 장에서 패킷을 직접 보냅니다.</figcaption>
    <div ref={frame} className="b31-overview-scroll" role="region" aria-label="전체 연결망 그림, 필요할 때 좌우로 스크롤" tabIndex={0}>
      <svg viewBox={`0 0 ${map.width} ${map.height}`} width={map.width} height={map.height} role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>방문자에서 DNS와 회사 웹 서버까지 연결된 교육용 네트워크</title>
        <desc id={`${id}-description`}>내 PC와 공유기, 인터넷의 R1부터 R4와 DNS 서버, 회사 경계 라우터, 방화벽과 NAT, DMZ 웹 서버가 회색 선으로 연결되어 있습니다. 연결은 통신이 허용되거나 데이터가 흐른다는 뜻이 아닙니다.</desc>
        {map.zones.map(([x,y,w,h,label])=><g className="b31-overview-zone" key={label}><rect x={x} y={y} width={w} height={h} rx="12"/><text x={x+12} y={y+16}>{label}</text></g>)}
        <g className="b31-overview-lines">{links.map(([a,b])=><line key={`${a}-${b}`} x1={map.positions[a][0]} y1={map.positions[a][1]} x2={map.positions[b][0]} y2={map.positions[b][1]}/>)}</g>
        {(Object.entries(definitions) as [NodeId,typeof definitions.pc][]).map(([key,item])=><g key={key} className="b31-overview-node" transform={`translate(${map.positions[key].join(',')})`}>
          <rect x={-item.width/2} y={-24} width={item.width} height={48} rx="8"/><text textAnchor="middle" y={-3}>{item.label}</text><text textAnchor="middle" y={15}>{item.sub}</text>
        </g>)}
      </svg>
    </div>
    <p>회색 선은 연결된 통로입니다. 패킷이 모든 선으로 동시에 흐르거나, 연결만으로 통신이 허용된다는 뜻은 아닙니다.</p>
    <small>방문자 접속을 확장한 별도 교육용 토폴로지이며 실제 인터넷 경로나 AWS의 현재 상태가 아닙니다.</small>
  </figure>;
}
