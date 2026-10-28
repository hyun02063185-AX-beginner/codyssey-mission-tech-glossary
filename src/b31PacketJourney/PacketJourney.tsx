import {useEffect,useId,useRef,useState} from 'react';
import {Link} from 'react-router-dom';
import {conceptHref} from '../b31StoryNavigation';
import {decision,definitions,description,links,natChange,packet,phases,routeReason,steps,topology,traces,type Kind,type NodeId} from './data';
import {usePacketPlayer} from './usePacketPlayer';
import './packetJourney.css';

const kinds:Kind[]=['dns','request','response'];
const kindNames={dns:'DNS 조회·응답',request:'웹 요청',response:'웹 응답'};
const termLinks=[['packet','패킷'],['ip-address','IP 주소'],['public-ip','공인 IP'],['private-ip','사설 IP'],['network-protocol','프로토콜'],['socket-port','포트'],['route-table','AWS Route Table'],['tcp','TCP'],['http','HTTP'],['domain-name-system','DNS'],['internet-gateway','IGW'],['security-group','Security Group']];
export default function PacketJourney() {
  const player=usePacketPlayer(), {index,flight}=player, step=steps[index],phase=phases[step.p];
  const info=packet(step),rule=decision(step),nat=natChange(step);
  const [theme,setTheme]=useState('light'),[width,setWidth]=useState(736),[zoom,setZoom]=useState(1);
  const viewport=useRef<HTMLDivElement>(null),uid=useId().replaceAll(':','');
  useEffect(()=>{
    const element=viewport.current!;
    const observer=new ResizeObserver(([entry])=>setWidth(Math.round(entry.contentRect.width)));
    observer.observe(element);return()=>observer.disconnect();
  },[]);
  const map=topology(width),point=map.positions[step.node];
  let marker:[number,number]=[point[0]+definitions[step.node].width/2-10,point[1]-15];
  if(flight){const a=map.positions[steps[flight.from].node],b=map.positions[steps[flight.to].node];marker=[a[0]+(b[0]-a[0])*flight.progress,a[1]+(b[1]-a[1])*flight.progress];}
  const status=`${index+1} / 26 · ${phase.name} · ${definitions[step.node].label}`;
  return <section className="packet-journey" data-step={index} data-phase={phase.name} data-playing={player.playing} data-moving={player.moving} data-journey-theme={theme} aria-label="패킷의 여행 체험">
    <div className="pj-toolbar"><p>접속 대상 <code>http://example.com/</code></p><label>체험 화면 <select aria-label="패킷 체험 테마" value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label></div>
    <div className="pj-controls" role="group" aria-label="패킷 진행 제어">
      <button type="button" className="pj-primary" disabled={player.moving||index===25} onClick={player.next}>한 단계 진행</button>
      <button type="button" onClick={player.play} aria-pressed={player.playing}>{player.playing?'일시정지':index===25?'처음부터 재생':flight?'이어서 재생':'자동 재생'}</button>
      <button type="button" onClick={player.previous} disabled={index===0&&!flight}>이전 단계</button>
      <button type="button" onClick={player.restart}>처음부터 재시작</button>
    </div>
    <p className="pj-progress" role="status" aria-live="polite" aria-atomic="true">{status}{flight&&` · ${definitions[steps[flight.to].node].label}로 ${player.moving?'이동 중':'이동 일시정지'}`}</p>
    <p className="pj-explanation">{description(step)}</p>
    <div className="pj-legend" aria-label="연결선과 전달 표시">
      <span><i className="pj-wire"/>회색: 연결된 길</span>
      {kinds.map(kind=><span key={kind} className={`pj-${kind}`} aria-current={kind===step.kind?'step':undefined}><i className={`pj-shape pj-${kind}`}/>{kindNames[kind]}</span>)}
    </div>
    <p className="pj-hint">색 선은 이미 전달된 구간, 움직이는 표식은 현재 패킷입니다. 연결된 모든 장비로 동시에 흐르는 것은 아닙니다. 이전 통신은 옅게 남고, 웹 응답은 점선으로 표시됩니다.</p>
    <div className="pj-workspace"><div className="pj-map-panel">
    <div className="pj-map-tools"><button type="button" onClick={()=>setZoom(zoom===1?1.5:1)} aria-pressed={zoom!==1}>{zoom===1?'그림 확대':'전체 크기로'}</button><span id={`${uid}-scroll-help`}>좁은 화면이나 확대 상태에서는 그림을 좌우로 밀어 보세요. 그림에 초점을 두고 방향키로도 이동할 수 있습니다.</span></div>
    <div ref={viewport} className="pj-map-scroll" role="region" aria-label="전체 네트워크 구성도, 가로 스크롤 가능" aria-describedby={`${uid}-scroll-help`} tabIndex={0}>
      <svg className="pj-map" viewBox={`0 0 ${map.width} ${map.height}`} width={map.width*zoom} height={map.height*zoom} role="img" aria-labelledby={`${uid}-title ${uid}-desc`}>
        <title id={`${uid}-title`}>DNS 조회 후 웹 서버에 접속하고 다른 인터넷 경로로 응답받는 예시</title>
        <desc id={`${uid}-desc`}>PC·공유기·R1~R4·DNS·회사 경계·방화벽/NAT·DMZ 웹 서버가 연결되어 있습니다. 요청은 R2, 응답은 R3를 거치며 같은 NAT와 방화벽을 지나갑니다. 현재 {definitions[step.node].label}, {phase.name} {index+1}/26 단계입니다.</desc>
        <defs>{kinds.map(kind=><marker key={kind} id={`${uid}-${kind}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" className={`pj-fill-${kind}`}/></marker>)}</defs>
        <g className="pj-zones">{map.zones.map(([x,y,w,h,label])=><g key={label}><rect x={x} y={y} width={w} height={h} rx="12"/><text x={x+12} y={y+16}>{label}</text></g>)}</g>
        <g className="pj-edges">{links.map(([a,b])=><line key={`${a}-${b}`} x1={map.positions[a][0]} y1={map.positions[a][1]} x2={map.positions[b][0]} y2={map.positions[b][1]}/>)}</g>
        <g className="pj-traces">{traces(index).map(trace=>{
          const a=map.positions[trace.from],b=map.positions[trace.to],offset=(trace.p-1.5)*2;
          return <line key={`${trace.p}-${trace.from}-${trace.to}`} data-trace-phase={trace.p} data-current={trace.current} className={`pj-stroke-${trace.kind}`} x1={a[0]+offset} y1={a[1]+offset} x2={b[0]+offset} y2={b[1]+offset} strokeWidth={trace.current?4:2.5} opacity={trace.current?1:.48} strokeDasharray={trace.kind==='response'?'8 5':undefined} markerEnd={`url(#${uid}-${trace.kind})`}/>;
        })}</g>
        {flight&&<line data-flight-path="true" className={`pj-stroke-${step.kind}`} x1={map.positions[steps[flight.from].node][0]} y1={map.positions[steps[flight.from].node][1]} x2={map.positions[steps[flight.to].node][0]} y2={map.positions[steps[flight.to].node][1]} strokeWidth="3" strokeDasharray="3 5"/>}
        <g className="pj-nodes">{(Object.entries(definitions) as [NodeId,typeof definitions.pc][]).map(([id,d])=><g key={id} data-node={id} data-active={id===step.node} transform={`translate(${map.positions[id].join(',')})`}>
          <rect x={-d.width/2} y={-24} width={d.width} height={48} rx="8"/>
          <text textAnchor="middle" y={-3}>{d.label}</text><text textAnchor="middle" y={15} className="pj-sub">{d.sub}</text>
        </g>)}</g>
        <g className={`pj-marker pj-fill-${step.kind}`} transform={`translate(${marker.join(',')})`} aria-hidden="true" data-from={flight?steps[flight.from].node:step.node} data-to={flight?steps[flight.to].node:step.node}>
          {step.kind==='dns'?<rect x={-6} y={-6} width={12} height={12} rx="1"/>:step.kind==='request'?<polygon points="0,-8 8,0 0,8 -8,0"/>:<circle r="7"/>}
        </g>
      </svg>
    </div>
    {player.reduced&&<p className="pj-hint">동작 줄이기 설정: 패킷 이동 애니메이션을 생략합니다. 수동·자동 단계 진행은 계속 사용할 수 있습니다.</p>}
    </div><div className="pj-information">
      <section><h4>현재 처리 이후 패킷</h4><p className="pj-hint">이 예시는 IP 주소와 TCP·UDP 포트를 함께 적습니다. 포트는 IP 헤더 자체의 정보가 아닙니다.</p>
        <dl className="pj-packet"><dt>출발지 IP:포트</dt><dd data-packet="source"><code>{info.source}</code></dd><dt>목적지 IP:포트</dt><dd data-packet="destination"><code>{info.destination}</code></dd><dt>프로토콜</dt><dd>{phase.protocol}</dd><dt>데이터 예시</dt><dd>{phase.payload}</dd></dl>
        {nat&&<div className="pj-nat"><h4>NAT 변환 전 → 후</h4><p>{nat.field==='source'?'출발지':'목적지'} IP:포트</p><p><code data-nat="before">{nat.before[nat.field]}</code><br/><span aria-hidden="true">↓ </span><code data-nat="after">{nat.after[nat.field]}</code></p><p>주소·포트 변환은 다음 길을 고르는 라우팅이나 통신 허용 판단과 다른 기능입니다.</p></div>}
      </section>
      <section className="pj-decision"><h4>{rule.title}</h4><table aria-label={rule.title}><thead><tr><th scope="col">판단 기준</th><th scope="col">다음 전달·처리</th></tr></thead><tbody>{rule.rows.map(([criterion,result,match],i)=><tr key={i} data-selected={match}><td>{criterion}</td><td>{match&&<strong>✓ 선택 · </strong>}{result}</td></tr>)}</tbody></table>
        <p className="pj-reason">{routeReason(step)}</p>
        <p className="pj-hint">경로표는 이 장비의 다음 길을 고르는 정보입니다. 인터넷 전체 경로를 미리 정하지 않습니다. 이 표는 간소화한 예시이며, 실제 라우터는 더 구체적인 일치 경로를 우선하는 최장 접두사 일치 등의 규칙을 사용합니다.</p>
      </section>
    </div>
    </div><p className="pj-return-path">요청: R1 → R2 → R4 / 응답: R4 → R3 → R1. 인터넷 경로가 달라도 이 예시의 공유기 NAT와 회사 방화벽/NAT는 왕복 모두 거칩니다. 기록한 NAT 매핑과 방화벽 연결 상태가 유지되어야 합니다.</p>
    <details className="pj-boundaries"><summary>이 교육용 예시가 생략한 것과 실제 AWS와의 차이</summary><ul>
      <li>실제 인터넷 라우터의 물리 경로나 패킷 캡처가 아닙니다. 203.0.113.10, 198.51.100.80, 192.0.2.53은 문서용 주소이며 example.com의 실제 DNS 결과가 아닙니다.</li>
      <li>DNS 캐시에 답이 있는 UDP DNS 조회·응답 이후, PC가 별도의 TCP HTTP 요청을 보냅니다. DNS가 웹 요청을 대신 전달하지 않습니다.</li>
      <li>TCP 연결 설정·확인 응답 일부, TLS·HTTP/3·ARP는 생략했습니다. HTTP 데이터 전체나 페이지 전체가 패킷 하나에 담긴다는 뜻이 아닙니다.</li>
      <li>실제 방화벽·NAT 내부 처리 순서는 장비·설정마다 다를 수 있습니다. 한 장비가 여러 기능을 맡기도 합니다.</li>
      <li>실제 B3-1 AWS의 현재 상태가 아닙니다. B3-1의 Route Table은 장비가 아닌 규칙표, IGW는 공인·사설 IPv4 대응, ENI의 Security Group은 허용 판단을 맡습니다. 일반망 방화벽/NAT와 같은 장비가 아니며 별도 NAT Gateway도 아닙니다.</li>
    </ul></details>
    <nav className="pj-learning-links" aria-label="패킷 학습 연결"><p>현재 단계를 남겨 두고 새 탭에서 관계와 용어를 확인합니다.</p>
      <Link target="_blank" rel="noopener noreferrer" to={conceptHref('view=general&node=gen:routing')}>개념지도: 라우터와 경로 선택 ↗</Link>{' · '}
      <Link target="_blank" rel="noopener noreferrer" to={conceptHref('view=general&node=gen:nat')}>개념지도: NAT와 주소 변환 ↗</Link>{' · '}
      <Link target="_blank" rel="noopener noreferrer" to={conceptHref('view=basics&node=bas:packet')}>개념지도: 패킷과 IP ↗</Link>
      <div>{termLinks.map(([id,label])=><Link target="_blank" rel="noopener noreferrer" key={id} to={`/terms/${id}`}>{label} ↗</Link>)}</div>
    </nav>
  </section>;
}
