import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { b31StoryScenes } from './b31StoryMapContent';
import type { StoryArt, StoryScene } from './b31StoryMapContent';
import { conceptHref, mapQuery, storyHref, storyScene } from './b31StoryNavigation';
import './b31StoryMap.css';
import {MissionStoryScenePicker} from './missionUI/MissionStoryOverview';
import B31Foundations from './b31Foundations/B31Foundations';
import PacketJourney from './b31PacketJourney/PacketJourney';
import NetworkOverview from './b31PacketJourney/NetworkOverview';
import {lectureSlides} from './b31SlideFlow';

type Flow = 'both' | 'request' | 'response';
const artStyle = `<style>
  :host{display:block;background:#fff;color-scheme:light;line-height:normal;letter-spacing:-.192px}
  svg{display:block;width:100%;height:auto;max-width:none}
  :host([data-flow="request"]) [data-flow^="R"],
  :host([data-flow="response"]) [data-flow^="A"]{opacity:.12}
</style>`;

function StoryArtView({ art, flow, zoom = 1 }: { art: StoryArt; flow: Flow; zoom?: number }) {
  const frame = useRef<HTMLDivElement>(null), host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const target = frame.current!;
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  const desktop = width >= art.breakpoint;
  const raw = desktop ? art.desktop : art.mobile;
  useLayoutEffect(() => {
    // These are static repository SVGs, never user/remote HTML. A shadow root
    // isolates the original styles and marker IDs from the map and other figures.
    const shadow = host.current!.shadowRoot ?? host.current!.attachShadow({ mode: 'open' });
    shadow.innerHTML = raw + artStyle;
  }, [raw]);
  return <div className="b31-art-frame" ref={frame} data-layout={desktop ? 'desktop' : 'mobile'} data-breakpoint={art.breakpoint}>
    <div className="b31-art-scroll" tabIndex={zoom > 1 ? 0 : undefined} role={zoom > 1 ? 'region' : undefined} aria-label={zoom > 1 ? '확대한 그림 이동' : undefined}>
      <div className="b31-art-size" style={{ width: `${(desktop ? width : Math.min(width, 420)) * zoom}px` }}>
        <div ref={host} className="b31-story-art" data-flow={flow} />
      </div>
    </div>
  </div>;
}

function StoryFigure({ scene }: { scene: StoryScene }) {
  const [flow, setFlow] = useState<Flow>('both'), [zoom, setZoom] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null), enlarge = useRef<HTMLButtonElement>(null);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!expanded) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [expanded]);
  function close() { dialog.current?.close(); setExpanded(false); setZoom(1); enlarge.current?.focus(); }
  const flowControls = scene.id === 'scene-02' && <div className="b31-flow-controls" role="group" aria-label="그림의 흐름 강조">
    {([['both', '함께 보기'], ['request', '요청 강조'], ['response', '응답 강조']] as const).map(([id, label]) => <button type="button" key={id} aria-pressed={flow === id} onClick={() => setFlow(id)}>{label}</button>)}
  </div>;
  if (!scene.art) return null;
  return <figure className="b31-story-figure">
    <div className="b31-figure-controls">{flowControls}<button ref={enlarge} type="button" onClick={() => setExpanded(true)}>그림 확대하기</button></div>
    <StoryArtView art={scene.art} flow={flow} />
    <figcaption>{scene.art.alt}</figcaption>
    {expanded && <dialog ref={dialog} className="b31-figure-dialog" aria-labelledby="b31-enlarged-title" onCancel={event => { event.preventDefault(); close(); }}>
      <header><h2 id="b31-enlarged-title">{scene.label} · {scene.title}</h2><button type="button" autoFocus onClick={close}>원래 화면으로 돌아가기</button></header>
      <div className="b31-figure-controls"><button type="button" aria-label="그림 축소" disabled={zoom <= 1} onClick={() => setZoom(value => Math.max(1, value - .25))}>−</button><button type="button" aria-label="그림 확대" disabled={zoom >= 3} onClick={() => setZoom(value => Math.min(3, value + .25))}>+</button><button type="button" onClick={() => setZoom(1)}>맞춤</button><span aria-live="polite">{Math.round(zoom * 100)}%</span>{flowControls}</div>
      <StoryArtView art={scene.art} flow={flow} zoom={zoom} />
    </dialog>}
  </figure>;
}

const networkCards = [
  ['네트워크', '연결된 기기가 데이터를 주고받는 체계입니다.'],
  ['IP 주소', '통신할 네트워크 인터페이스를 찾는 주소입니다.'],
  ['공인 IP / 사설 IP', '공인 주소는 인터넷 라우팅에, 사설 주소는 내부 네트워크에 사용합니다.'],
  ['서브넷', 'IP 주소 범위를 나눠 구역과 경로를 관리합니다.'],
];
const packetCards = [
  ['패킷', '네트워크로 전달되는 데이터 단위입니다. IP 정보에는 출발지와 목적지 주소가 있습니다.'],
  ['IP', '목적지 주소를 따라 다음 네트워크로 전달합니다.'],
  ['TCP · 포트', '포트로 통신할 프로그램을 구분하고, 바이트의 순서와 누락을 관리합니다.'],
  ['HTTP', '웹 요청과 응답이 무엇을 뜻하는지 정합니다.'],
];
const instructorGuidance:Record<string,string> = {
  'scene-01':'PC에서 공유기·인터넷 라우터·DNS와 회사 경계·방화벽/NAT·웹 서버의 위치를 짚습니다. 회색 연결선은 패킷이 흐른다는 뜻이 아닙니다.',
  'scene-02':'DNS 조회부터 한 단계씩 진행하고 라우터의 목적지와 경로표, NAT 전후 주소를 비교합니다. 요청은 R2, 응답은 R3를 지나며 이 예시의 NAT·방화벽 상태는 유지됩니다.',
  'scene-03a':'여섯 대응 카드를 따라 기능을 비교합니다. AWS Route Table은 규칙표이며 IGW·Security Group은 일반망 장비와 동일하지 않습니다.',
  'scene-03b':'공인 주소·경로·ENI 보안 규칙·Nginx 수신이 모두 필요한지 확인하고 실습 가이드로 연결합니다.',
};
const awsCards = [
  ['네트워크', 'VPC'], ['주소 구역', 'Subnet'], ['다음 길', 'Route Table'],
  ['인터넷 연결·IPv4 주소 대응', 'Internet Gateway'], ['접근 허용', 'Security Group'], ['웹 응답', 'EC2 + Nginx'],
];

function Cards({items}:{items:string[][]}) {
  return <div className="b31-slide-cards">{items.map(([title,body])=><section key={title}><h3>{title}</h3><p>{body}</p></section>)}</div>;
}

export default function B31StoryMap() {
  const [params] = useSearchParams();
  const id = storyScene(params.get('scene')) ?? 'slide-intro';
  const index = lectureSlides.findIndex(slide=>slide.id===id), slide=lectureSlides[index];
  const original=b31StoryScenes.find(scene=>scene.id===id);
  const returnMap = params.has('map') ? mapQuery(params.get('map') ?? '') : undefined;
  const heading = useRef<HTMLHeadingElement>(null), lastScene = useRef(id);
  useEffect(() => {
    document.title = `Slide ${index+1} · B3-1 미션 스토리맵`;
    if (lastScene.current !== id) { heading.current?.focus({preventScroll:true}); heading.current?.scrollIntoView({ block: 'start' }); }
    lastScene.current = id;
    return () => { document.title = '코디세이 기술용어 사전'; };
  }, [id,index]);
  const mapQueryForSlide=original?.map ?? (id==='slide-network'?'view=basics&node=bas%3Aip-address':id==='slide-packet'?'view=basics&node=bas%3Apacket':'view=general&node=gen%3Afirewall');
  return <article className="b31-story-page b31-slide-page">
    <MissionStoryScenePicker scenes={lectureSlides.map((item,i)=>({id:item.id,label:`Slide ${i+1}`,title:item.title,href:storyHref(item.id,returnMap)}))} current={id} overviewHref="/missions/main-M05/story-map"/>
    {params.has('scene') && !storyScene(params.get('scene')) && <p role="status">찾는 장면이 없어 첫 장면을 표시합니다. 목차에서 장면을 선택해 주세요.</p>}
    <section key={id} className={`b31-current-scene b31-slide${id==='scene-02'?' b31-slide-journey':''}`} aria-labelledby="b31-scene-title" data-scene={id}>
      <header className="b31-slide-heading"><p className="eyebrow">Slide {index+1} / {lectureSlides.length}</p><h2 ref={heading} tabIndex={-1} id="b31-scene-title">{slide.title}</h2></header>
      <nav className="b31-scene-traversal" aria-label="강의 슬라이드 이동">
        {index>0?<Link aria-label="이전 슬라이드" rel="prev" to={storyHref(lectureSlides[index-1].id,returnMap)}>← 이전</Link>:<button aria-label="이전 슬라이드" disabled>← 이전</button>}
        <div className="b31-traversal-current"><span>Slide {index+1} / {lectureSlides.length}</span><strong>{slide.title}</strong></div>
        {index<lectureSlides.length-1?<Link aria-label="다음 슬라이드" rel="next" to={storyHref(lectureSlides[index+1].id,returnMap)}>다음 →</Link>:<button aria-label="다음 슬라이드" disabled>다음 →</button>}
      </nav>
      {id==='slide-intro'&&<div className="b31-slide-main"><p className="b31-slide-lead">내 웹사이트는 어떻게 인터넷에서 열릴까요? B3-1에서 직접 배포한 웹 접속을 네트워크와 AWS의 역할로 다시 읽습니다.</p><h3>오늘의 학습 목표</h3><ol className="b31-slide-goals"><li>IP 주소와 네트워크 구역을 구분합니다.</li><li>패킷이 주소를 따라 이동하는 과정을 설명합니다.</li><li>라우팅·NAT·방화벽의 역할을 구별합니다.</li><li>이 역할을 AWS 설정과 웹 서버에 연결합니다.</li></ol></div>}
      {id==='slide-network'&&<div className="b31-slide-main"><p className="b31-slide-lead">주소는 상대를 찾고, 서브넷은 주소 범위를 나눕니다.</p><Cards items={networkCards}/><p className="b31-slide-note">공인 IP가 있어도 경로·허용 규칙·서버 응답 조건이 필요합니다.</p><B31Foundations scene="scene-01" origin={id}/></div>}
      {id==='slide-packet'&&<div className="b31-slide-main"><p className="b31-slide-lead">선이 연결된 것과 데이터가 전달되는 것은 다릅니다. 실제 통신에서는 패킷을 보냅니다.</p><Cards items={packetCards}/><p className="b31-slide-note">포트는 TCP·UDP의 정보이며 모든 IP 패킷에 있는 것은 아닙니다. HTTP 요청 전체가 항상 한 패킷에 담기지도 않습니다.</p><B31Foundations scene="scene-02" origin={id}/></div>}
      {id==='scene-01'&&<div className="b31-slide-main"><NetworkOverview/><details className="b31-slide-extra"><summary>기존 기업망 전체 구조도 더 보기</summary><StoryFigure scene={original!}/><p>{original!.context}</p></details></div>}
      {id==='scene-02'&&<div className="b31-slide-main b31-packet-lesson" aria-label="패킷의 여행 직접 시연"><p className="b31-slide-lead">한 단계씩 진행하며 목적지 IP, 경로표의 선택, NAT 변환을 살펴보세요.</p><p className="b31-slide-note">DNS 조회·응답 뒤 PC가 별도의 HTTP 요청을 보냅니다. 주소와 경로는 설명용 예시입니다.</p><PacketJourney/><details className="b31-slide-extra"><summary>기존 요청·응답 상세 그림 더 보기</summary><p>이 그림은 별도의 HTTPS 443 예시입니다. 위 체험의 HTTP 80·DNS 경로와 장비 배치 및 주소가 같지는 않습니다.</p><StoryFigure scene={original!}/></details></div>}
      {id==='scene-03a'&&<div className="b31-slide-main"><p className="b31-slide-lead">일반 네트워크에서 하던 일을 B3-1의 AWS 구성과 비교합니다.</p><div className="b31-aws-cards">{awsCards.map(([a,b])=><div key={a}><span>{a}</span><span aria-hidden="true">→</span><strong>{b}</strong></div>)}</div><p className="b31-slide-note">역할의 비교입니다. Route Table은 규칙표이고 Security Group은 ENI에 적용되는 허용 규칙입니다. IGW와 일반 방화벽/NAT를 같은 장비로 보지 않습니다.</p><details className="b31-slide-extra"><summary>기존 AWS 역할 비교 그림 더 보기</summary><StoryFigure scene={original!}/></details></div>}
      {id==='scene-03b'&&<div className="b31-slide-main"><p className="b31-slide-lead">Public Subnet이라는 이름만으로는 웹사이트가 열리지 않습니다.</p><ol className="b31-slide-goals"><li>공인 IPv4와 IGW 연결</li><li>Subnet에 연결된 Route Table의 경로</li><li>ENI에 적용되는 Security Group의 TCP 80 허용</li><li>EC2의 Nginx가 요청을 받고 응답</li></ol><p className="b31-slide-note">2026-10-14 B3-1 배포 기록의 HTTP 80 사례이며 현재 AWS 상태가 아닙니다.</p><details className="b31-slide-extra"><summary>기존 AWS 접속 조건 그림과 기초 비교 더 보기</summary><StoryFigure scene={original!}/><B31Foundations scene="scene-03b"/></details></div>}
      {id==='scene-04'&&<div className="b31-slide-main"><p className="b31-slide-lead">다음 질문을 동료에게 자신의 말로 설명해 보세요.</p><ol className="b31-slide-goals"><li>연결선과 실제 패킷 이동은 어떻게 다를까요?</li><li>라우터는 목적지를 보고 다음 길을 어떻게 고를까요?</li><li>NAT의 주소 변환과 방화벽의 허용 판단은 어떻게 다를까요?</li><li>이 역할은 B3-1의 Route Table·IGW·Security Group과 어떻게 이어질까요?</li></ol><p><Link to={conceptHref('',id)}>개념지도에서 관계 살펴보기 →</Link></p><p><Link to="/missions/main-M05/guide/07-verify-operate">실습 결과 검증·운영 가이드 →</Link></p></div>}
      <details className="b31-slide-extra b31-slide-links"><summary>관련 개념·용어와 강사용 안내</summary>
        <Link className="b31-story-primary" to={conceptHref(mapQueryForSlide,id)}>관련 개념을 지도에서 보기 →</Link>
        {original?.concepts.map(item=><p key={item.query}><Link to={conceptHref(item.query,id)}>{item.label} →</Link></p>)}
        {(id==='scene-01'||id==='scene-02')&&<p><Link to={`/missions/main-M05/guide?document=supplement${id==='scene-02'?'#packet-journey':''}`}>기존 기업망 보강 자료 →</Link></p>}
        <p><Link to={`/terms/packet?${new URLSearchParams({'b31-map':`scene=${id}`})}`}>패킷 · 용어사전 →</Link> · <Link to={`/terms/route-table?${new URLSearchParams({'b31-map':`scene=${id}`})}`}>Route Table · 용어사전 →</Link></p>
        <p><strong>강사용 안내:</strong> {instructorGuidance[id] ?? '화면의 핵심 질문을 짚고 학습자가 자신의 말로 설명하도록 합니다.'}</p>
      </details>
      {returnMap !== undefined && <p><Link className="b31-map-return" to={conceptHref(returnMap)}>← 이전 선택으로 개념지도 돌아가기</Link></p>}
      <nav className="b31-slide-bottom-nav" aria-label="슬라이드 끝 이동">
        {index>0&&<Link aria-label="이전 슬라이드로 이동" to={storyHref(lectureSlides[index-1].id,returnMap)}>← 이전 슬라이드</Link>}
        {index<lectureSlides.length-1&&<Link aria-label="다음 슬라이드로 이동" to={storyHref(lectureSlides[index+1].id,returnMap)}>다음 슬라이드 →</Link>}
      </nav>
    </section>
  </article>;
}
