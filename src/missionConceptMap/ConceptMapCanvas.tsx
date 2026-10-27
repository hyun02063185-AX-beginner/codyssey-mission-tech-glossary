import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { layoutConceptMap } from './conceptMapAdapter';
import type { adaptConceptMap } from './conceptMapAdapter';
import { conceptTypeLabel, domainLabel } from './conceptMapTypes';
import type { MapSelection, Position } from './conceptMapTypes';

export type CanvasControls = { fit: () => void; read: () => void; zoom: (factor: number) => void; region: (id: string) => void };
type Props = {
  title?:string;initialFit?:boolean;
  graph: ReturnType<typeof adaptConceptMap>; selection: MapSelection; frameKey: string;
  focusRequest: number; detailOpen: boolean; onNode: (id: string) => void; onRelation: (id: string) => void;
};
function labelLines(label: string) {
  if (label.length <= 17) return [label];
  const split = label.lastIndexOf(' ', 17);
  const at = split > 3 ? split : 17;
  return [label.slice(0, at), label.slice(at).trim()];
}

const ConceptMapCanvas = forwardRef<CanvasControls, Props>(function ConceptMapCanvas({title="B3-1 통합 개념지도",initialFit=false, graph, selection, frameKey, focusRequest, detailOpen, onNode, onRelation }, ref) {
  const layout = useMemo(() => layoutConceptMap(graph), [graph]);
  const svgRef = useRef<SVGSVGElement>(null), shellRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0, visibleWidth: 0, safeWidth: 0, safeHeight: 0 });
  const cameraMode = useRef<'reading' | 'fit' | 'manual'>('reading');
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef<{ id: number; x: number; y: number; cameraX: number; cameraY: number } | null>(null);
  const fitScale = Math.min(box.safeWidth / layout.width, box.safeHeight / layout.height) * .96;
  const clampScale = (scale: number) => Math.max(Math.min(.2, fitScale), Math.min(2.4, scale));
  function fit() {
    if (!box.width || !box.height) return;
    cameraMode.current = 'fit';
    setCamera({ x: (layout.width - box.safeWidth / fitScale) / 2,
      y: (layout.height - box.safeHeight / fitScale) / 2, scale: fitScale });
    if (shellRef.current) shellRef.current.scrollLeft = 0;
  }
  function focus(position: Position, scale = .875) {
    setCamera({ x: position.x + position.width / 2 - box.safeWidth / scale / 2,
      y: position.y + position.height / 2 - box.safeHeight / scale / 2, scale });
    if (shellRef.current) shellRef.current.scrollLeft = 0;
  }
  function read() {
    cameraMode.current = 'reading';
    const selected = selection?.kind === 'node' ? layout.positions.get(selection.id) : undefined;
    if (selected) focus(selected);
    else { setCamera({ x: 0, y: 0, scale: .875 }); if (shellRef.current) shellRef.current.scrollLeft = 0; }
  }
  function zoom(factor: number) {
    cameraMode.current = 'manual';
    setCamera(current => {
      const scale = clampScale(current.scale * factor);
      return { scale, x: current.x + box.visibleWidth / 2 / current.scale - box.visibleWidth / 2 / scale,
        y: current.y + box.height / 2 / current.scale - box.height / 2 / scale };
    });
  }
  useImperativeHandle(ref, () => ({ fit, read, zoom, region: id => { cameraMode.current = 'reading'; const position = layout.layouts.get(id); if (position) focus(position, .875); } }));
  useEffect(() => {
    if (selection?.kind === 'node' && cameraMode.current === 'fit') cameraMode.current = 'reading';
  }, [selection?.kind, selection?.id]);
  useEffect(() => {
    const svg = svgRef.current, shell = shellRef.current;
    if (!svg || !shell) return;
    const panel = shell.parentElement?.querySelector<HTMLElement>('.map-detail-panel');
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      // Use layout offsets: entrance animations must not move the camera each frame.
      const mobile = window.matchMedia('(max-width:700px)').matches;
      const next = { width: rect.width, height: rect.height, visibleWidth: shell.clientWidth,
        safeWidth: Math.max(1, panel && !mobile ? Math.min(shell.clientWidth, panel.offsetLeft - shell.offsetLeft - 12) : shell.clientWidth),
        safeHeight: Math.max(1, panel && mobile ? Math.min(rect.height, panel.offsetTop - shell.offsetTop - 12) : rect.height) };
      setBox(current => Object.keys(next).every(key => current[key as keyof typeof current] === next[key as keyof typeof next]) ? current : next);
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(svg); observer.observe(shell);
    if (panel) observer.observe(panel);
    return () => observer.disconnect();
  }, [detailOpen, selection?.id]);
  const framedKey = useRef<string | null>(null);
  // Resize keeps the chosen zoom mode. Only view/filter/flow changes request a new frame.
  useEffect(() => {
    if (!box.width || !box.height) return;
    const first = framedKey.current === null;
    if (first || framedKey.current !== frameKey) {
      framedKey.current = frameKey;
      if (selection?.kind === 'node' || (first && !selection && !initialFit)) read(); else fit();
    } else if (cameraMode.current === 'fit') fit();
    else if (selection?.kind === 'node') {
      const position = layout.positions.get(selection.id);
      if (position) focus(position, camera.scale);
    }
  }, [frameKey, box.width, box.height, box.visibleWidth, box.safeWidth, box.safeHeight]);
  useEffect(() => { if (focusRequest > 0) read(); }, [focusRequest]);
  // World positions stay fixed. Move the camera only to keep the selected card
  // readable and outside the detail panel, retaining the user's manual zoom.
  useEffect(() => {
    if (selection?.kind !== 'node' || !box.width || cameraMode.current === 'fit') return;
    const position = layout.positions.get(selection.id);
    if (!position) return;
    const left = (position.x - camera.x) * camera.scale, top = (position.y - camera.y) * camera.scale;
    if (camera.scale < .875 || left < 0 || left + position.width * camera.scale > box.safeWidth || top < 0 || top + position.height * camera.scale > box.safeHeight) focus(position, Math.max(.875, camera.scale));
  }, [selection?.id, layout, box.safeWidth, box.safeHeight]);

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || (event.target as Element).closest('[data-map-node], [data-relation-hit]')) return;
    event.preventDefault(); window.getSelection()?.removeAllRanges();
    cameraMode.current = 'manual';
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, cameraX: camera.x, cameraY: camera.y };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function pointerMove(event: PointerEvent<SVGSVGElement>) {
    const active = drag.current;
    if (!active || active.id !== event.pointerId) return;
    event.preventDefault(); window.getSelection()?.removeAllRanges();
    setCamera(current => ({ ...current, x: active.cameraX - (event.clientX - active.x) / current.scale,
      y: active.cameraY - (event.clientY - active.y) / current.scale }));
  }
  function pointerEnd(event: PointerEvent<SVGSVGElement>) {
    if (drag.current?.id === event.pointerId) { drag.current = null; window.getSelection()?.removeAllRanges(); }
  }
  const orderedEdges = [...graph.edges].sort((a, b) => Number(graph.highlightedEdges.has(a.id)) - Number(graph.highlightedEdges.has(b.id)));
  return <div className="map-canvas-shell" ref={shellRef}>
    <svg ref={svgRef} className={`map-canvas ${selection ? 'has-focus' : ''}`} role="group" aria-label={title}
      viewBox={`${camera.x} ${camera.y} ${(box.width || 960) / camera.scale} ${(box.height || 600) / camera.scale}`}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd}>
      <defs>
        {['role', 'request', 'response'].flatMap(kind => ['', '-muted'].map(tone => <marker key={`${kind}${tone}`} id={`cm-arrow-${kind}${tone}`} viewBox="0 0 8 8" refX="8" refY="4" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto"><path className={tone ? 'cm-marker-muted' : `cm-marker-${kind}`} d="M0 0 L8 4 L0 8 Z" /></marker>))}
        {['', '-muted'].map(tone => <marker key={`diamond${tone}`} id={`cm-diamond${tone}`} viewBox="0 0 8 8" refX="4" refY="4" markerUnits="userSpaceOnUse" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path className={tone ? 'cm-marker-muted' : 'cm-marker-cross'} d="M0 4 L4 0 L8 4 L4 8 Z" /></marker>)}
      </defs>
      {graph.regions.map(region => {
        const p = layout.layouts.get(region.id)!;
        return <g className={`map-region cm-domain-${region.domain} cm-region-${region.id}`} key={region.id}>
          <rect {...p} rx="14" /><text x={p.x + 14} y={p.y + 26}>{region.label}</text>
          <title>{region.description}</title>
        </g>;
      })}
      {graph.annotations?.map(note=><g className="cm-annotation" key={note.title} transform={`translate(${note.x} ${note.y})`}><text y="0">{note.title}</text><text y="24">{note.caption}</text></g>)}
      {orderedEdges.map(edge => {
        const rel = edge.relation, route = layout.routes.get(edge.id)!, path = route.path;
        const kind = rel.type === '대응' ? 'cross' : rel.type === '역할' ? 'role' : rel.type === '포함' ? 'contains' : rel.path ? (rel.pathStepIds?.[0]?.startsWith('R') ? 'response' : 'request') : 'associated';
        const highlighted = graph.highlightedEdges.has(edge.id);
        const tone = highlighted ? '' : '-muted';
        const arrow = ['role', 'request', 'response'].includes(kind) ? `url(#cm-arrow-${kind}${tone})` : kind === 'cross' ? `url(#cm-diamond${tone})` : undefined;
        return <g key={edge.id} className={`cm-edge-group ${highlighted ? 'is-highlighted' : ''}`} data-relation={rel.id} data-step={edge.step}>
          {highlighted && <path className="cm-edge-halo" d={path} />}
          <path className={`map-edge is-visible cm-${kind} ${highlighted ? 'is-highlighted' : ''}`} d={path} markerEnd={arrow} markerStart={kind === 'cross' ? arrow : undefined} />
          <path className="cm-relation-hit" data-relation-hit={rel.id} d={path} onClick={() => onRelation(rel.id)}>
            <title>{`${rel.type} · ${rel.label}: ${rel.description}${edge.omitted?.length ? ' (개요에서는 경유지 축약, 선택하면 전체 경로 표시)' : ''}`}</title>
          </path>
          {highlighted && selection?.kind !== 'node' && <text className={`cm-edge-label cm-${kind}`}>
            <textPath href={`#cm-label-${edge.id}`} startOffset="50%" textAnchor="middle">{edge.step ? `${edge.step}${edge.omitted?.length ? ' · 경유지 축약' : ''}` : rel.label}</textPath>
          </text>}
          <path id={`cm-label-${edge.id}`} d={route.labelPath} fill="none" stroke="none" />
        </g>;
      })}
      {graph.nodes.map(node => {
        const p = layout.positions.get(node.id)!, lines = labelLines(node.label);
        const selected = selection?.kind === 'node' && selection.id === node.id;
        return <g key={node.id} data-map-node={node.id} role="button" tabIndex={0}
          aria-label={`${node.label}, ${domainLabel[node.domain]}, ${conceptTypeLabel[node.conceptType] ?? node.conceptType}`}
          aria-pressed={selected}
          onClick={() => onNode(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onNode(node.id); } }}
          className={`map-node cm-domain-${node.domain} ${node.importance === 'core' ? 'core' : 'foundation'} ${selected ? 'is-selected' : ''} ${graph.highlightedNodes.has(node.id) ? 'is-highlighted' : ''} ${graph.contrastIds.has(node.id) ? 'is-contrast' : ''}`}
          transform={`translate(${p.x} ${p.y})`}>
          <rect width={p.width} height={p.height} rx="9" />
          <text className="map-node-marker" x="10" y="15">{selected ? '선택 · ' : ''}{node.importance === 'core' ? '핵심' : '보충'}{graph.contrastIds.has(node.id) ? ' · ≠ 비교 대상' : ''}</text>
          {lines.map((line, i) => <text className="map-node-label" key={i} x="10" y={33 + i * 17}>{line}</text>)}
          <text className="map-node-layer" x="10" y="66">{domainLabel[node.domain]} · {conceptTypeLabel[node.conceptType] ?? node.conceptType}{node.implementationStatus === 'general-example' ? ' · 예시' : ''}</text>
        </g>;
      })}
    </svg>
  </div>;
});
export default ConceptMapCanvas;
