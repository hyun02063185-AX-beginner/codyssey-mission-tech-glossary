import {
  createContext, useContext, useLayoutEffect, useRef, useState, useSyncExternalStore,
  type KeyboardEvent, type ReactNode, type RefObject,
} from 'react';
import { Link, useLocation } from 'react-router-dom';
import Markdown from './B32MarkdownV04';
import { storyPath } from './content';
import { learningLocation, type LearningPosition, type LearningScene } from './learningIndexV05';
import './b32LearningIndex.css';

export const learningIndexKey = 'b32-v05-learning-index';
const panelId = 'b32-learning-index-panel';
const drawerId = 'b32-learning-index-drawer';
const indexHeadingId = 'b32-learning-index-heading';
const mobileQuery = '(width < 1000px)';
const railQuery = '(1240px <= width < 1440px)';

function subscribeWidth(change: () => void) {
  const queries = [window.matchMedia(mobileQuery), window.matchMedia(railQuery)];
  queries.forEach(query => query.addEventListener('change', change));
  return () => queries.forEach(query => query.removeEventListener('change', change));
}

function widthMode() {
  if (window.matchMedia(mobileQuery).matches) return 'mobile';
  return window.matchMedia(railQuery).matches ? 'rail' : 'desktop';
}

function readPinned() {
  try { return localStorage.getItem(learningIndexKey) === 'open'; } catch { return false; }
}

function SceneDetails({ scene, showQuestion = true }: { scene: LearningScene; showQuestion?: boolean }) {
  return <>
    <dl className="b32-index-description">
      {showQuestion && <><dt>학습 질문</dt><dd><Markdown>{scene.question}</Markdown></dd></>}
      <dt>도달 목표</dt><dd><Markdown>{scene.goal}</Markdown></dd>
    </dl>
    <ul className="b32-index-concepts" aria-label="핵심 개념">
      {scene.concepts.map(concept => <li key={concept}>{concept}</li>)}
    </ul>
  </>;
}

function ScreenLinks({ scene, currentId }: { scene: LearningScene; currentId?: string }) {
  return <ol className="b32-index-screen-list">
    {scene.screens.map(screen => <li key={screen.id}>
      <Link to={screen.href} aria-current={screen.id === currentId ? 'page' : undefined}>
        <span>{screen.id} · {screen.title}</span>
        {screen.id === currentId && <strong>현재 화면</strong>}
      </Link>
    </li>)}
  </ol>;
}

function RoadmapScene({ scene, compact }: { scene: LearningScene; compact: boolean }) {
  const count = `화면 ${scene.screens.length}개`;
  const start = <Link to={scene.screens[0].href}>이 Scene 시작 <span className="b32-index-visually-hidden">· Scene {scene.id}</span></Link>;
  return <li className="b32-roadmap-scene">
    <p className="b32-roadmap-scene-label">Scene {scene.id} · {scene.perspective}</p>
    <h3>{scene.title}</h3>
    {compact ? <>
      <div className="b32-roadmap-question"><Markdown>{scene.question}</Markdown></div>
      <div className="b32-roadmap-start"><span>{count}</span>{start}</div>
    </> : <><SceneDetails scene={scene}/><p>{count}</p>{start}</>}
    <details>
      <summary>{compact ? '자세히' : '화면 목록'} <span className="b32-index-visually-hidden">· Scene {scene.id}</span></summary>
      {compact && <><SceneDetails scene={scene} showQuestion={false}/><p><strong>화면 목록</strong></p></>}
      <ScreenLinks scene={scene}/>
    </details>
  </li>;
}

export function LearningRoadmap({ scenes, description }: { scenes: readonly LearningScene[]; description?: string }) {
  const compact = useSyncExternalStore(subscribeWidth, widthMode, () => 'desktop' as const) === 'mobile';
  return <section className="b32-roadmap" data-compact={compact || undefined} aria-labelledby="b32-roadmap-title">
    <h2 id="b32-roadmap-title">학습 로드맵</h2>
    <Markdown>{description}</Markdown>
    <ol className="b32-roadmap-path" aria-label="Scene 학습 순서">
      <RoadmapScene scene={scenes[0]} compact={compact}/>
      <li className="b32-roadmap-pipeline">
        <h3>메모 한 줄이 이동하는 길</h3>
        <ol aria-label="데이터 이동 순서">
          {scenes.slice(1, -1).map(scene => <RoadmapScene key={scene.id} scene={scene} compact={compact}/>)}
        </ol>
      </li>
      <RoadmapScene scene={scenes[scenes.length - 1]} compact={compact}/>
    </ol>
  </section>;
}

export function LearningPositionStrip({ scenes, current }: { scenes: readonly LearningScene[]; current: LearningPosition }) {
  return <div className="b32-position">
    <nav aria-label="Scene 위치">
      <ol>
        {scenes.map(({ id, perspective, screens }, index) => {
          const active = id === current.scene.id;
          return <li key={id} data-flow={index > 0 && index < scenes.length - 2 || undefined}>
            <Link to={screens[0].href} aria-current={active ? 'step' : undefined}
              aria-label={`Scene ${id} · ${perspective}${active ? ` · 화면 ${current.withinScene} / ${screens.length}` : ''}`}>
              {id} <span className="b32-position-perspective">{perspective}</span>
              {active && <span className="b32-position-screen">화면 {current.withinScene}/{screens.length}</span>}
            </Link>
          </li>;
        })}
      </ol>
    </nav>
    <p className="b32-position-summary">{learningLocation(current, scenes.length)}</p>
  </div>;
}

type IndexControls = { trigger: RefObject<HTMLButtonElement | null>; open: boolean; mobile: boolean; toggle: () => void };
const IndexContext = createContext<IndexControls | null>(null);

export function LearningIndexTrigger() {
  const controls = useContext(IndexContext)!;
  return <button className="b32-index-trigger" type="button" ref={controls.trigger}
    aria-expanded={controls.open} aria-controls={controls.mobile ? drawerId : panelId}
    aria-haspopup={controls.mobile ? 'dialog' : undefined} onClick={controls.toggle}>학습 인덱스</button>;
}

function IndexPanel({ scenes, current, expanded, setExpanded, close, visible, titleRef }: {
  scenes: readonly LearningScene[];
  current: LearningPosition;
  expanded: ReadonlySet<string>;
  setExpanded: (next: Set<string>) => void;
  close: () => void;
  visible: boolean;
  titleRef: RefObject<HTMLHeadingElement | null>;
}) {
  const scroll = useRef<HTMLDivElement>(null);
  const activeExpanded = expanded.has(current.scene.id);
  useLayoutEffect(() => {
    if (!visible || !activeExpanded) return;
    const frame = requestAnimationFrame(() => {
      const region = scroll.current;
      const link = region?.querySelector('[aria-current="page"]');
      if (!region || !link) return;
      const bounds = region.getBoundingClientRect();
      const item = link.getBoundingClientRect();
      if (item.top < bounds.top) region.scrollTop += item.top - bounds.top;
      else if (item.bottom > bounds.bottom) region.scrollTop += item.bottom - bounds.bottom;
    });
    return () => cancelAnimationFrame(frame);
  }, [visible, current.id, activeExpanded]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  }

  const allExpanded = expanded.size === scenes.length;
  return <nav className="b32-index-panel" aria-label="학습 인덱스" onKeyDown={onKeyDown}>
    <div className="b32-index-head">
      <h2 id={indexHeadingId} ref={titleRef} tabIndex={-1}>학습 인덱스</h2>
      <div className="b32-index-actions">
        <button type="button" onClick={() => setExpanded(new Set(allExpanded ? [] : scenes.map(scene => scene.id)))}>
          {allExpanded ? '모두 접기' : '모두 펼치기'}
        </button>
        <button type="button" onClick={close}>닫기</button>
      </div>
      <p>지금 Scene {current.scene.id} · {current.scene.perspective} · 화면 {current.withinScene} / {current.scene.screens.length} · 전체 {current.overall} / {current.total}</p>
    </div>
    <div className="b32-index-scroll" ref={scroll}>
      <ol className="b32-index-scenes">
        {scenes.map(scene => {
          const isOpen = expanded.has(scene.id);
          const isCurrent = scene.id === current.scene.id;
          const id = `b32-index-scene-${scene.id}`;
          return <li key={scene.id}>
            <button className="b32-index-scene-toggle" type="button" aria-expanded={isOpen} aria-controls={id}
              data-current={isCurrent || undefined} onClick={() => {
                const next = new Set(expanded);
                if (isOpen) next.delete(scene.id);
                else next.add(scene.id);
                setExpanded(next);
              }}>
              <span>Scene {scene.id} · {scene.perspective}</span>
              <strong>{scene.title}</strong>
              <span>화면 {scene.screens.length}개 {isCurrent && <strong>· 지금 여기</strong>}</span>
            </button>
            <div id={id} hidden={!isOpen} className="b32-index-scene-content">
              <SceneDetails scene={scene}/>
              <ScreenLinks scene={scene} currentId={current.id}/>
            </div>
          </li>;
        })}
      </ol>
      <Link className="b32-index-intro-link" to={storyPath}>강의 소개와 학습 로드맵</Link>
    </div>
  </nav>;
}

export function LearningIndexLayout({ scenes, current, explanationOpen, children }: {
  scenes: readonly LearningScene[];
  current: LearningPosition;
  explanationOpen: boolean;
  children: ReactNode;
}) {
  const mode = useSyncExternalStore(subscribeWidth, widthMode, () => 'desktop' as const);
  const { key: locationKey } = useLocation();
  const [pinned, setPinned] = useState(readPinned);
  const [drawerKey, setDrawerKey] = useState<string>();
  const [overlay, setOverlay] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>();
  const trigger = useRef<HTMLButtonElement>(null);
  const railTrigger = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusTitle = useRef(false);
  const mobile = mode === 'mobile';
  const rail = mode === 'rail' && explanationOpen;
  const drawerOpen = mobile && drawerKey === locationKey;
  const desktopOpen = !mobile && pinned;
  const panelVisible = desktopOpen && (!rail || overlay);
  const sceneId = current.scene.id;
  const displayedScenes = expanded ?? new Set([sceneId]);

  useLayoutEffect(() => {
    setExpanded(previous => previous && !previous.has(sceneId) ? new Set([...previous, sceneId]) : previous);
  }, [sceneId]);
  useLayoutEffect(() => {
    if (desktopOpen || drawerOpen) setExpanded(previous => previous ?? new Set([sceneId]));
  }, [desktopOpen, drawerOpen, sceneId]);
  useLayoutEffect(() => {
    if (!drawerOpen) setDrawerKey(undefined);
    if (!rail) setOverlay(false);
  }, [drawerOpen, rail]);
  useLayoutEffect(() => {
    const modal = dialog.current;
    if (!drawerOpen || !modal) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    modal.showModal();
    return () => {
      modal.close();
      root.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);
  useLayoutEffect(() => {
    if (!(drawerOpen || desktopOpen) || !focusTitle.current) return;
    focusTitle.current = false;
    const target = rail && !panelVisible ? railTrigger.current : titleRef.current;
    target?.focus({ preventScroll: true });
  }, [drawerOpen, desktopOpen, panelVisible, rail]);

  function savePinned(open: boolean) {
    setPinned(open);
    try { localStorage.setItem(learningIndexKey, open ? 'open' : 'closed'); } catch { /* Keep the current view usable. */ }
  }

  function close() {
    focusTitle.current = false;
    if (mobile) {
      dialog.current?.close();
      setDrawerKey(undefined);
    } else if (rail && overlay) {
      setOverlay(false);
      railTrigger.current?.focus({ preventScroll: true });
      return;
    } else {
      savePinned(false);
    }
    trigger.current?.focus({ preventScroll: true });
  }

  function toggle() {
    if (mobile ? drawerOpen : desktopOpen) {
      if (!mobile && rail && overlay) {
        setOverlay(false);
        savePinned(false);
      } else close();
      return;
    }
    focusTitle.current = true;
    if (mobile) {
      setDrawerKey(locationKey);
    } else {
      savePinned(true);
    }
  }

  function trapTab(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const links = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')]
      .filter(element => !element.closest('[hidden]'));
    const first = links[0], last = links.at(-1);
    const hasTabFocus = links.includes(document.activeElement as HTMLElement);
    if (!hasTabFocus || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  }

  const panel = <IndexPanel scenes={scenes} current={current} expanded={displayedScenes} setExpanded={setExpanded}
    close={close} titleRef={titleRef} visible={mobile ? drawerOpen : panelVisible}/>;
  return <IndexContext.Provider value={{ trigger, open: mobile ? drawerOpen : desktopOpen, mobile, toggle }}>
    <div className="b32-index-layout" data-index={desktopOpen ? (rail ? 'rail' : 'column') : 'closed'}
      data-index-overlay={rail && panelVisible || undefined}>
      {mobile ? <dialog id={drawerId} className="b32-index-drawer" ref={dialog} aria-modal="true"
        aria-labelledby={indexHeadingId} onKeyDown={trapTab} onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (event.target === event.currentTarget) close(); }}>{panel}</dialog>
        : <aside id={panelId} className="b32-index-aside" hidden={!desktopOpen}>
          {rail && <nav className="b32-index-rail" aria-label="학습 인덱스 레일" onKeyDown={event => {
            if (event.key === 'Escape') { event.preventDefault(); close(); }
          }}>
            <button type="button" ref={railTrigger} aria-label="학습 인덱스 펼치기" aria-controls="b32-index-full" aria-expanded={panelVisible}
              onClick={() => {
                if (panelVisible) close();
                else { focusTitle.current = true; setOverlay(true); }
              }}><span className="b32-index-rail-icon" aria-hidden="true">»</span></button>
            <ol>{scenes.map(scene => <li key={scene.id}><Link to={scene.screens[0].href}
              aria-label={`Scene ${scene.id} · ${scene.perspective}`}
              aria-current={scene.id === sceneId ? 'step' : undefined}>{scene.id}</Link></li>)}</ol>
          </nav>}
          <div id="b32-index-full" className="b32-index-full" hidden={!panelVisible}>{panel}</div>
        </aside>}
      <div key="lesson" className="b32-index-stage">{children}</div>
    </div>
  </IndexContext.Provider>;
}
