import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { b31StoryScenes } from './b31StoryMapContent';
import type { StoryArt, StoryScene } from './b31StoryMapContent';
import { conceptHref, mapQuery, storyHref, storyScene } from './b31StoryNavigation';
import './b31StoryMap.css';

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

export default function B31StoryMap() {
  const [params] = useSearchParams();
  const id = storyScene(params.get('scene')) ?? 'scene-01';
  const index = b31StoryScenes.findIndex(scene => scene.id === id), scene = b31StoryScenes[index];
  const returnMap = params.has('map') ? mapQuery(params.get('map') ?? '') : undefined;
  const heading = useRef<HTMLHeadingElement>(null), lastScene = useRef(id);
  useEffect(() => {
    document.title = `${scene.label} · B3-1 미션 스토리맵`;
    if (lastScene.current !== id) { heading.current?.focus(); heading.current?.scrollIntoView({ block: 'start' }); }
    lastScene.current = id;
    return () => { document.title = '코디세이 기술용어 사전'; };
  }, [id, scene.label]);
  return <article className="b31-story-page">
    <header className="b31-story-heading"><Link to="/missions/main-M05">← B3-1 미션</Link><p className="eyebrow">미션 스토리맵</p><h1>B3-1 — AWS로 다시 이해하는 네트워크</h1><p className="b31-story-question">내 웹사이트는 어떻게 인터넷에서 열릴까?</p>
      <details className="b31-story-orientation"><summary>학습 목표와 강의 흐름</summary><p>강사 대면 설명으로 시작해 스토리의 흐름과 개념지도의 관계를 살펴봅니다. 강의 이후에는 같은 자료로 자유롭게 복습하세요.</p><ul><li>네트워크의 구역·장비·역할을 구별합니다.</li><li>요청·응답을 따라가고 일반망과 AWS의 공통점·차이점을 설명합니다.</li><li>학습가이드로 직접 실습하고 결과를 검증한 뒤, 필요한 용어를 찾아 이해를 넓힙니다.</li></ul><p>전체 구조 → 요청·응답 → 역할 비교 → AWS 접속 조건 → 개념지도 탐색 → 실습·이해 확인</p></details>
    </header>
    <nav className="b31-scene-nav" aria-label="Scene 목차"><ol>{b31StoryScenes.map((item, position) => <li key={item.id}><Link to={storyHref(item.id, returnMap)} aria-current={id === item.id ? 'step' : undefined}><span>{item.label}</span><b>{item.title}</b><small>{position + 1} / 5</small></Link></li>)}</ol></nav>
    {params.has('scene') && !storyScene(params.get('scene')) && <p role="status">찾는 장면이 없어 첫 장면을 표시합니다. 목차에서 장면을 선택해 주세요.</p>}
    <section className="b31-current-scene" aria-labelledby="b31-scene-title" data-scene={id}>
      <header className="b31-scene-heading"><p className="eyebrow">{scene.label} · {index + 1} / 5</p><h2 ref={heading} tabIndex={-1} id="b31-scene-title">{scene.title}</h2><p className="b31-scene-question">{scene.question}</p><p className="b31-scene-context">{scene.context}</p></header>
      <StoryFigure key={id} scene={scene} />
      <div className="b31-scene-reading"><div><h3>핵심 설명</h3>{scene.explanation.map(text => <p key={text}>{text}</p>)}</div>
        <aside className="b31-story-map-links" aria-label="관련 개념 탐색"><h3>{scene.id === 'scene-04' ? '직접 탐색해 보세요' : '이 장면의 개념과 관계'}</h3><Link className="b31-story-primary" to={conceptHref(scene.map, id)}>{id === 'scene-04' ? '인터랙티브 개념지도 열기 →' : '관련 개념을 지도에서 보기 →'}</Link>{scene.concepts.map(item => <Link key={item.query} to={conceptHref(item.query, id)}>{item.label} →</Link>)}{returnMap !== undefined && <Link className="b31-map-return" to={conceptHref(returnMap)}>← 이전 선택으로 개념지도 돌아가기</Link>}</aside>
      </div>
      <details className="b31-instructor-notes"><summary>강사용 안내</summary><p>{scene.instructor}</p></details>
      {(id === 'scene-01' || id === 'scene-02') && <p className="b31-scene-context">직원 게시·DB 조회는 <Link to="/missions/main-M05/guide?document=supplement">기존 기업망 보강 자료</Link>에서 이어 볼 수 있습니다.</p>}
      <section className="b31-story-checks" aria-labelledby="b31-check-title"><h3 id="b31-check-title">내 말로 설명해 보기</h3><ol>{scene.checks.map(question => <li key={question}>{question}</li>)}</ol></section>
      {id === 'scene-04' && <section className="b31-story-practice"><h3>이제 직접 해 보고 확인하세요</h3><p>학습가이드의 실행·오류 해결·검증 절차로 실습을 이어 갑니다. 실제 미션 요구 충족과 개념 이해를 각각 확인하세요.</p><Link to="/missions/main-M05/guide/07-verify-operate">실습 결과 검증·운영 가이드 →</Link><Link to="/missions/main-M05/guide">B3-1 학습가이드 전체 보기 →</Link></section>}
    </section>
    <nav className="b31-story-pagination" aria-label="이전 다음 장면">{index > 0 && <Link rel="prev" to={storyHref(b31StoryScenes[index - 1].id, returnMap)}>← 이전 장면<span>{b31StoryScenes[index - 1].label} · {b31StoryScenes[index - 1].title}</span></Link>}{index < b31StoryScenes.length - 1 && <Link rel="next" to={storyHref(b31StoryScenes[index + 1].id, returnMap)}>다음 장면 →<span>{b31StoryScenes[index + 1].label} · {b31StoryScenes[index + 1].title}</span></Link>}<Link to="/missions/main-M05">B3-1 미션으로 돌아가기</Link></nav>
  </article>;
}
