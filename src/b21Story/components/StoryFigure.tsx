import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import type { LoadedStory } from '../content/storyTypes';
export function figureLayout(width: number, assets: NonNullable<LoadedStory['assets']>, zoom = 1) {
  const variant = Number.isFinite(width) && width >= 960 ? 'desktop' : 'mobile';
  const asset = assets[variant];
  // Keep original font sizes. Narrow slots scroll rather than shrinking below
  // native SVG dimensions; mobile artwork never grows beyond a readable 420px.
  const renderedWidth = (variant === 'desktop' ? Math.max(asset.width, width) : Math.max(asset.width, Math.min(420, width || asset.width))) * zoom;
  return { variant, asset, width: renderedWidth, height: renderedWidth * asset.height / asset.width };
}
export default function StoryFigure({ story }: { story: LoadedStory }) {
  const frame = useRef<HTMLDivElement>(null), trigger = useRef<HTMLButtonElement>(null), dialog = useRef<HTMLDialogElement>(null);
  const [width, setWidth] = useState(0), [expanded, setExpanded] = useState(false), [zoom, setZoom] = useState(1);
  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => setWidth(element.getBoundingClientRect().width);
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(element); return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!expanded) return;
    dialog.current?.showModal();
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; if (trigger.current?.isConnected) trigger.current.focus(); };
  }, [expanded]);
  if (!story.assets) return null;
  const layout = figureLayout(width, story.assets), asset = layout.asset;
  const caption = `${story.id}-figure-caption`;
  function close() { dialog.current?.close(); setExpanded(false); setZoom(1); }
  function keepDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = [...(dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]') ?? [])].filter(el => el.getClientRects().length > 0);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  return <figure className="b21-story-figure" aria-labelledby={caption}>
    <div className="b21-story-figure-toolbar"><button ref={trigger} type="button" onClick={() => setExpanded(true)}>전체 그림 확대</button>
      <a href={asset.url} download>SVG 원본 내려받기</a></div>
    <div ref={frame} className="b21-story-figure-frame" data-layout={layout.variant}>
      <div className="b21-story-figure-scroll" tabIndex={0} role="region" aria-label="원본 크기 그림 (가로 스크롤 가능)">
        <img src={asset.url} alt={asset.alt} aria-describedby={caption} width={layout.width} height={layout.height} />
      </div>
    </div>
    <figcaption id={caption}>{asset.alt}. 원본 전체 그림입니다. 좁은 영역에서는 가로로 이동해 읽을 수 있습니다.</figcaption>
    <details><summary>그림 설명 읽기</summary><p>{asset.description}</p></details>
    {expanded && <dialog ref={dialog} className="b21-story-figure-dialog" aria-labelledby={`${story.id}-zoom-title`} onCancel={e => { e.preventDefault(); close(); }} onClose={() => setExpanded(false)} onKeyDown={keepDialogFocus}>
      <header><h2 id={`${story.id}-zoom-title`}>{story.label} · 전체 그림</h2><button type="button" autoFocus onClick={close}>닫고 원래 위치로</button></header>
      <div className="b21-story-figure-toolbar"><button type="button" disabled={zoom <= 1} onClick={() => setZoom(v => Math.max(1, v - .25))}>축소</button><button type="button" disabled={zoom >= 3} onClick={() => setZoom(v => Math.min(3, v + .25))}>확대</button><span role="status">{Math.round(zoom * 100)}%</span></div>
      <div className="b21-story-figure-scroll" tabIndex={0} role="region" aria-label="확대한 전체 그림 이동"><img src={asset.url} alt={asset.alt} width={layout.width * zoom} height={layout.height * zoom} /></div>
    </dialog>}
  </figure>;
}
