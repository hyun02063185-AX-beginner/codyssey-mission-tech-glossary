import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { layoutConceptMap, relationPath } from './conceptMapAdapter';
import type { adaptConceptMap } from './conceptMapAdapter';
import { conceptTypeLabel, domainLabel } from './conceptMapTypes';
import type { MapSelection, Position } from './conceptMapTypes';

export type CanvasControls = { fit: () => void; read: () => void; zoom: (factor: number) => void; region: (id: string) => void };
type Props = {
  graph: ReturnType<typeof adaptConceptMap>; selection: MapSelection; frameKey: string;
  focusRequest: number; detailOpen: boolean; onNode: (id: string) => void; onRelation: (id: string) => void;
};
function labelLines(label: string) {
  if (label.length <= 17) return [label];
  const split = label.lastIndexOf(' ', 17);
  const at = split > 3 ? split : 17;
  return [label.slice(0, at), label.slice(at).trim()];
}

const ConceptMapCanvas = forwardRef<CanvasControls, Props>(function ConceptMapCanvas({ graph, selection, frameKey, focusRequest, detailOpen, onNode, onRelation }, ref) {
  const layout = useMemo(() => layoutConceptMap(graph), [graph]);
  const svgRef = useRef<SVGSVGElement>(null), shellRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0, visibleWidth: 0 });
  const [camera, setCamera] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef<{ id: number; x: number; y: number; cameraX: number; cameraY: number } | null>(null);
  const mobile = box.visibleWidth <= 700;
  const coveredWidth = detailOpen && !mobile ? Math.min(400, Math.max(340, box.visibleWidth * .31)) + 32 : 0;
  const coveredHeight = detailOpen && mobile ? Math.min(window.innerHeight * .43, box.height * .6) : 0;
  const fitScale = Math.min((box.visibleWidth - coveredWidth) / layout.width, (box.height - coveredHeight) / layout.height) * .96;
  const clampScale = (scale: number) => Math.max(Math.min(.2, fitScale), Math.min(2.4, scale));
  function fit() {
    setCamera({ x: (layout.width - (box.visibleWidth - coveredWidth) / fitScale) / 2,
      y: (layout.height - (box.height - coveredHeight) / fitScale) / 2, scale: fitScale });
    if (shellRef.current) shellRef.current.scrollLeft = 0;
  }
  function focus(position: Position, scale = .875) {
    const safeWidth = box.visibleWidth - (detailOpen && !mobile ? Math.min(400, Math.max(340, box.visibleWidth * .31)) + 32 : 0);
    const safeHeight = box.height - (detailOpen && mobile ? Math.min(window.innerHeight * .43, box.height * .6) : 0);
    setCamera({ x: position.x + position.width / 2 - safeWidth / scale / 2,
      y: position.y + position.height / 2 - safeHeight / scale / 2, scale });
    if (shellRef.current) shellRef.current.scrollLeft = 0;
  }
  function read() {
    const selected = selection?.kind === 'node' ? layout.positions.get(selection.id) : undefined;
    if (selected) focus(selected);
    else { setCamera({ x: 0, y: 0, scale: .875 }); if (shellRef.current) shellRef.current.scrollLeft = 0; }
  }
  function zoom(factor: number) {
    setCamera(current => {
      const scale = clampScale(current.scale * factor);
      return { scale, x: current.x + box.visibleWidth / 2 / current.scale - box.visibleWidth / 2 / scale,
        y: current.y + box.height / 2 / current.scale - box.height / 2 / scale };
    });
  }
  useImperativeHandle(ref, () => ({ fit, read, zoom, region: id => { const position = layout.layouts.get(id); if (position) focus(position, .875); } }));
  useEffect(() => {
    const svg = svgRef.current, shell = shellRef.current;
    if (!svg || !shell) return;
    const measure = () => {
      const rect = svg.getBoundingClientRect();
      if (rect.width && rect.height) setBox({ width: rect.width, height: rect.height, visibleWidth: shell.clientWidth });
    };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(svg); observer.observe(shell);
    return () => observer.disconnect();
  }, []);
  // Reframe on view/size changes, never on every URL selection or drag.
  const initialized = useRef(false);
  useEffect(() => {
    if (!box.width || !box.height) return;
    if (!initialized.current || selection?.kind === 'node') read(); else fit();
    initialized.current = true;
  }, [frameKey, box.width, box.height, box.visibleWidth]);
  useEffect(() => { if (focusRequest > 0) read(); }, [focusRequest]);
  // Reveal may move a card. Keep the selected card in the uncovered portion of the map.
  useEffect(() => {
    if (selection?.kind !== 'node') return;
    const position = layout.positions.get(selection.id);
    if (!position) return;
    const panelWidth = detailOpen && !mobile ? Math.min(400, Math.max(340, box.visibleWidth * .31)) + 32 : 0;
    const safeHeight = box.height - (detailOpen && mobile ? Math.min(window.innerHeight * .43, box.height * .6) : 0);
    const left = (position.x - camera.x) * camera.scale, top = (position.y - camera.y) * camera.scale;
    if (camera.scale < .875 || left < 0 || left + position.width * camera.scale > box.visibleWidth - panelWidth || top < 0 || top + position.height * camera.scale > safeHeight) focus(position, Math.max(.875, camera.scale));
  }, [selection?.id, layout, detailOpen]);

  function pointerDown(event: PointerEvent<SVGSVGElement>) {
    if (event.button !== 0 || (event.target as Element).closest('[data-map-node], [data-relation-hit]')) return;
    event.preventDefault(); window.getSelection()?.removeAllRanges();
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
    <svg ref={svgRef} className={`map-canvas ${selection ? 'has-focus' : ''}`} role="group" aria-label="B3-1 통합 개념지도"
      viewBox={`${camera.x} ${camera.y} ${(box.width || 960) / camera.scale} ${(box.height || 600) / camera.scale}`}
      onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd} onLostPointerCapture={pointerEnd}>
      <defs>
        {['role', 'request', 'response'].map(kind => <marker key={kind} id={`cm-arrow-${kind}`} viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path className={`cm-marker-${kind}`} d="M0 0 L8 4 L0 8 Z" /></marker>)}
        <marker id="cm-diamond" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path className="cm-marker-cross" d="M0 4 L4 0 L8 4 L4 8 Z" /></marker>
      </defs>
      {graph.regions.map(region => {
        const p = layout.layouts.get(region.id)!;
        return <g className={`map-region cm-domain-${region.domain}`} key={region.id}>
          <rect {...p} rx="14" /><text x={p.x + 14} y={p.y + 26}>{region.label}</text>
          <title>{region.description}</title>
        </g>;
      })}
      {orderedEdges.map(edge => {
        const from = layout.positions.get(edge.from)!, to = layout.positions.get(edge.to)!;
        const index = graph.edges.indexOf(edge), rel = edge.relation;
        const path = relationPath(from, to, index);
        const kind = rel.type === '대응' ? 'cross' : rel.type === '역할' ? 'role' : rel.type === '포함' ? 'contains' : rel.path ? (rel.pathStepIds?.[0]?.startsWith('R') ? 'response' : 'request') : 'associated';
        const arrow = ['role', 'request', 'response'].includes(kind) ? `url(#cm-arrow-${kind})` : kind === 'cross' ? 'url(#cm-diamond)' : undefined;
        const highlighted = graph.highlightedEdges.has(edge.id);
        return <g key={edge.id} className={`cm-edge-group ${highlighted ? 'is-highlighted' : ''}`} data-relation={rel.id} data-step={edge.step}>
          <path className={`map-edge is-visible cm-${kind} ${highlighted ? 'is-highlighted' : ''}`} d={path} markerEnd={arrow} markerStart={kind === 'cross' ? 'url(#cm-diamond)' : undefined} />
          <path className="cm-relation-hit" data-relation-hit={rel.id} d={path} onClick={() => onRelation(rel.id)}>
            <title>{`${rel.type} · ${rel.label}: ${rel.description}${edge.omitted?.length ? ' (개요에서는 경유지 축약, 선택하면 전체 경로 표시)' : ''}`}</title>
          </path>
          {((highlighted && selection?.kind !== 'node') || (!selection && kind === 'cross')) && <text className={`cm-edge-label cm-${kind}`}>
            <textPath href={`#cm-label-${edge.id}`} startOffset="50%" textAnchor="middle">{edge.step ? `${edge.step}${edge.omitted?.length ? ' · 경유지 축약' : ''}` : rel.label}</textPath>
          </text>}
          <path id={`cm-label-${edge.id}`} d={from.x > to.x ? relationPath(to, from, index) : path} fill="none" stroke="none" />
        </g>;
      })}
      {graph.nodes.map(node => {
        const p = layout.positions.get(node.id)!, lines = labelLines(node.label);
        return <g key={node.id} data-map-node={node.id} role="button" tabIndex={0}
          aria-label={`${node.label}, ${domainLabel[node.domain]}, ${conceptTypeLabel[node.conceptType] ?? node.conceptType}`}
          aria-pressed={selection?.kind === 'node' && selection.id === node.id}
          onClick={() => onNode(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onNode(node.id); } }}
          className={`map-node cm-domain-${node.domain} ${node.importance === 'core' ? 'core' : 'foundation'} ${selection?.kind === 'node' && selection.id === node.id ? 'is-selected' : ''} ${graph.highlightedNodes.has(node.id) ? 'is-highlighted' : ''} ${graph.contrastIds.has(node.id) ? 'is-contrast' : ''}`}
          transform={`translate(${p.x} ${p.y})`}>
          <rect width={p.width} height={p.height} rx="9" />
          <text className="map-node-marker" x="10" y="15">{node.importance === 'core' ? '핵심' : '보충'}{graph.contrastIds.has(node.id) ? ' · ≠ 비교 대상' : ''}</text>
          {lines.map((line, i) => <text className="map-node-label" key={i} x="10" y={33 + i * 17}>{line}</text>)}
          <text className="map-node-layer" x="10" y="66">{domainLabel[node.domain]} · {conceptTypeLabel[node.conceptType] ?? node.conceptType}{node.implementationStatus === 'general-example' ? ' · 예시' : ''}</text>
        </g>;
      })}
    </svg>
  </div>;
});
export default ConceptMapCanvas;
