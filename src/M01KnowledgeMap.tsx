import { KeyboardEvent, PointerEvent, WheelEvent, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import glossary from './data/generated/glossary.json';
import graphSource from './data/generated/m01-knowledge-map.json';
import { searchTerms } from './searchTerms';

type Origin = 'mission' | 'foundation';
type Node = { id: string; termId?: string; label: string; labelKo: string; nodeOrigin: Origin; layer: string; primaryRegion: string; summary: string; standardsOrProviders?: string[]; foundationRationale?: string };
type Edge = { from: string; to: string; relation: string; reason: string; confidence: 'HIGH' | 'MEDIUM' | 'LOW'; evidenceType: string; source: string };
type Region = { id: string; label: string; description: string };
type LearningRoute = { id: string; label: string; description: string; nodeIds: string[] };
type Graph = { regions: Region[]; nodes: Node[]; edges: Edge[]; learningRoutes: LearningRoute[] };
type Position = { x: number; y: number; width: number; height: number };

const graph = graphSource as Graph;
const terms = glossary as Array<{ id: string; termKo: string; termEn: string; aliases: string[]; importance: string; missionRefs: Array<{ course: string; mission: string; context: string }>; missionContext: string }>;
const WIDTH = 1280;
const HEIGHT = 750;
const REGION_LAYOUT: Record<string, Position & { columns: number }> = {
  'document-structure': { x: 24, y: 38, width: 260, height: 306, columns: 2 },
  'presentation-ui': { x: 306, y: 38, width: 350, height: 376, columns: 3 },
  'javascript-language': { x: 674, y: 38, width: 250, height: 170, columns: 2 },
  'browser-web-api': { x: 942, y: 38, width: 314, height: 252, columns: 2 },
  'async-execution': { x: 674, y: 228, width: 250, height: 250, columns: 2 },
  'network-external-api': { x: 942, y: 310, width: 314, height: 404, columns: 2 },
  'state-persistence': { x: 306, y: 434, width: 350, height: 270, columns: 3 },
  'development-platform': { x: 24, y: 364, width: 260, height: 180, columns: 2 }
};

function labelLines(label: string) {
  if (label.length <= 15) return [label];
  const words = label.split(' ');
  if (words.length > 1) {
    const split = Math.ceil(words.length / 2);
    return [words.slice(0, split).join(' '), words.slice(split).join(' ')];
  }
  return [label.slice(0, 15), label.slice(15, 30)];
}

function graphPositions(nodes: Node[]) {
  const positions = new Map<string, Position>();
  for (const [regionId, layout] of Object.entries(REGION_LAYOUT)) {
    const inRegion = nodes.filter(node => node.primaryRegion === regionId).sort((a, b) => Number(a.nodeOrigin === 'foundation') - Number(b.nodeOrigin === 'foundation') || a.label.localeCompare(b.label));
    const gap = 8;
    const cardWidth = (layout.width - 24 - gap * (layout.columns - 1)) / layout.columns;
    const cardHeight = 48;
    inRegion.forEach((node, index) => {
      const col = index % layout.columns;
      const row = Math.floor(index / layout.columns);
      positions.set(node.id, { x: layout.x + 12 + col * (cardWidth + gap), y: layout.y + 48 + row * 58, width: cardWidth, height: cardHeight });
    });
  }
  return positions;
}

function edgePath(from: Position, to: Position) {
  const startX = from.x + from.width / 2;
  const startY = from.y + from.height / 2;
  const endX = to.x + to.width / 2;
  const endY = to.y + to.height / 2;
  const bend = Math.max(26, Math.abs(endX - startX) * .34);
  return `M ${startX} ${startY} C ${startX + (endX >= startX ? bend : -bend)} ${startY}, ${endX - (endX >= startX ? bend : -bend)} ${endY}, ${endX} ${endY}`;
}

export default function M01KnowledgeMap() {
  const [params, setParams] = useSearchParams();
  const termQuery = params.get('term') ?? '';
  const nodeById = useMemo(() => new Map(graph.nodes.map(node => [node.id, node])), []);
  const nodeByTerm = useMemo(() => new Map(graph.nodes.filter(node => node.termId).map(node => [node.termId!, node])), []);
  const positions = useMemo(() => graphPositions(graph.nodes), []);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(() => nodeByTerm.get(termQuery)?.id ?? null);
  const [routeId, setRouteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState({ x: 0, y: 0, zoom: 1 });
  const drag = useRef<{ x: number; y: number; viewX: number; viewY: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const selected = selectedNodeId ? nodeById.get(selectedNodeId) ?? null : null;
  const invalidTerm = Boolean(termQuery && !nodeByTerm.has(termQuery));
  const selectedRoute = graph.learningRoutes.find(route => route.id === routeId) ?? null;
  const routeNodeIds = new Set(selectedRoute?.nodeIds ?? []);
  const selectedEdges = graph.edges.filter(edge => selected && (edge.from === selected.id || edge.to === selected.id));
  const routeEdges = new Set(graph.edges.filter(edge => routeNodeIds.has(edge.from) && routeNodeIds.has(edge.to)).map(edge => edge));
  const highlightedNodeIds = new Set([...(selected ? [selected.id] : []), ...selectedEdges.flatMap(edge => [edge.from, edge.to]), ...routeNodeIds]);
  const searchResults = search ? searchTerms(terms, search).filter(term => nodeByTerm.has(term.id)).slice(0, 6) : [];

  useEffect(() => {
    const deepLinkedNode = nodeByTerm.get(termQuery);
    if (deepLinkedNode) setSelectedNodeId(deepLinkedNode.id);
  }, [nodeByTerm, termQuery]);

  function selectNode(node: Node) {
    setSelectedNodeId(node.id);
    if (node.termId) setParams({ term: node.termId });
    else setParams({});
  }
  function resetMap() {
    setSelectedNodeId(null); setRouteId(null); setSearch(''); setParams({}); setView({ x: 0, y: 0, zoom: 1 });
  }
  function zoomBy(amount: number) { setView(current => ({ ...current, zoom: Math.max(.65, Math.min(1.8, Number((current.zoom + amount).toFixed(2)))) })); }
  function onWheel(event: WheelEvent<SVGSVGElement>) { event.preventDefault(); zoomBy(event.deltaY > 0 ? -.12 : .12); }
  function onPointerDown(event: PointerEvent<SVGSVGElement>) {
    if ((event.target as Element).closest('[data-map-node]')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, viewX: view.x, viewY: view.y };
  }
  function onPointerMove(event: PointerEvent<SVGSVGElement>) {
    if (!drag.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setView(current => ({ ...current, x: drag.current!.viewX - (event.clientX - drag.current!.x) * WIDTH / rect.width / current.zoom, y: drag.current!.viewY - (event.clientY - drag.current!.y) * HEIGHT / rect.height / current.zoom }));
  }
  function endPointer() { drag.current = null; }
  function selectFromKeyboard(event: KeyboardEvent<SVGGElement>, node: Node) {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectNode(node); }
  }

  return <section className="knowledge-map-page" aria-labelledby="map-title">
    <div className="map-intro">
      <div><p className="eyebrow">본과정 M01 · 기술 개념 지도</p><h1 id="map-title">나를 소개하는 웹페이지의 기술 지도</h1><p>기술의 위치와 연결을 먼저 보고, 필요할 때 한 노드에 집중해 보세요.</p></div>
      <button type="button" className="map-reset" onClick={resetMap}>전체 지도 보기</button>
    </div>
    {invalidTerm && <p className="notice" role="status">찾으려는 M01 지도 용어를 찾지 못해 전체 지도를 표시합니다.</p>}
    <div className="map-legend" aria-label="지도 범례"><span><b className="legend-marker mission">M01</b> 미션 용어</span><span><b className="legend-marker foundation">기초</b> 이해를 돕는 Foundation</span><span><i className="legend-line" /> 핵심 관계</span></div>
    <div className="map-controls" aria-label="지도 탐색">
      <label htmlFor="map-search">M01 용어 찾기</label>
      <input id="map-search" value={search} onChange={event => setSearch(event.target.value)} placeholder="예: fetch, 로컬스토리지" />
      {searchResults.length > 0 && <div className="map-search-results" role="listbox" aria-label="용어 검색 결과">{searchResults.map(term => <button type="button" role="option" key={term.id} onClick={() => { selectNode(nodeByTerm.get(term.id)!); setSearch(''); }}>{term.termKo} <small>{term.termEn}</small></button>)}</div>}
      <div className="map-zoom" aria-label="지도 확대와 축소"><button type="button" onClick={() => zoomBy(.15)} aria-label="지도 확대">+</button><button type="button" onClick={() => zoomBy(-.15)} aria-label="지도 축소">−</button><button type="button" onClick={() => setView({ x: 0, y: 0, zoom: 1 })}>맞춤</button></div>
    </div>
    <div className="map-mobile-navigation">
      <h2>지역으로 찾기</h2><div>{graph.regions.map(region => <button type="button" key={region.id} onClick={() => { const first = graph.nodes.find(node => node.primaryRegion === region.id); if (first) selectNode(first); }}>{region.label}</button>)}</div>
    </div>
    <div className="map-workspace">
      <div className="map-canvas-shell" aria-label="M01 기술 관계 지도. 노드를 선택하면 상세 정보를 볼 수 있습니다.">
        <svg ref={svgRef} className="map-canvas" viewBox={`${view.x} ${view.y} ${WIDTH / view.zoom} ${HEIGHT / view.zoom}`} role="group" aria-label="M01 기술 관계 지도" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endPointer} onPointerCancel={endPointer}>
          <defs><marker id="map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto"><path d="M 0 0 L 8 4 L 0 8 z" /></marker></defs>
          {graph.regions.map(region => { const layout = REGION_LAYOUT[region.id]; return <g className="map-region" key={region.id}><rect x={layout.x} y={layout.y} width={layout.width} height={layout.height} rx="16" /><text x={layout.x + 14} y={layout.y + 24}>{region.label}</text><text className="map-region-description" x={layout.x + 14} y={layout.y + 39}>{region.description}</text></g>; })}
          {graph.edges.map((edge, index) => {
            const from = positions.get(edge.from); const to = positions.get(edge.to); if (!from || !to) return null;
            const connected = selected && (edge.from === selected.id || edge.to === selected.id);
            const isRouteEdge = routeEdges.has(edge);
            const overview = ['prerequisite', 'mission_uses', 'provided_by', 'defined_by', 'evolved_from', 'is_a'].includes(edge.relation) && edge.confidence === 'HIGH';
            const visible = Boolean(connected || isRouteEdge || (!selected && !selectedRoute && overview));
            return <path key={`${edge.from}-${edge.relation}-${edge.to}-${index}`} className={`map-edge relation-${edge.relation} ${visible ? 'is-visible' : ''} ${connected || isRouteEdge ? 'is-highlighted' : ''}`} d={edgePath(from, to)} markerEnd="url(#map-arrow)"><title>{`${edge.relation}: ${edge.reason}`}</title></path>;
          })}
          {graph.nodes.map(node => { const position = positions.get(node.id)!; const isSelected = selected?.id === node.id; const isHighlighted = highlightedNodeIds.has(node.id); const lines = labelLines(node.label); return <g key={node.id} data-map-node="true" role="button" tabIndex={0} aria-label={`${node.label}, ${node.layer}, ${node.nodeOrigin === 'mission' ? 'M01 미션 용어' : 'Foundation 용어'}`} onClick={() => selectNode(node)} onKeyDown={event => selectFromKeyboard(event, node)} className={`map-node ${node.nodeOrigin} ${isSelected ? 'is-selected' : ''} ${isHighlighted ? 'is-highlighted' : ''}`} transform={`translate(${position.x} ${position.y})`}>
              <rect width={position.width} height={position.height} rx="8" />
              <text className="map-node-marker" x="7" y="11">{node.nodeOrigin === 'mission' ? 'M01' : '기초'}</text>
              {lines.map((line, lineIndex) => <text key={line} className="map-node-label" x="7" y={lineIndex === 0 ? 26 : 36}>{line}</text>)}
              <text className="map-node-layer" x="7" y={lines.length === 1 ? 41 : 45}>{node.layer}</text>
            </g>; })}
        </svg>
        <p className="map-canvas-help">마우스 또는 터치로 이동 · 휠 또는 +/−로 확대 · Tab과 Enter로 노드 선택</p>
      </div>
      <aside className="map-detail-panel" aria-live="polite" aria-labelledby="map-detail-title">
        {selected ? <NodeDetail node={selected} edges={selectedEdges} nodeById={nodeById} /> : <><p className="eyebrow">선택한 기술</p><h2 id="map-detail-title">지도에서 도시를 선택해 보세요</h2><p>미션 용어는 M01에서 실제 쓰이고, Foundation은 그 용어를 정확히 이해하도록 연결합니다.</p></>}
      </aside>
    </div>
    <section className="map-routes" aria-labelledby="route-title"><div><p className="eyebrow">대표 탐색 경로</p><h2 id="route-title">한 번에 한 길씩 따라가기</h2></div><div className="map-route-list">{graph.learningRoutes.map(route => <button type="button" key={route.id} className={routeId === route.id ? 'is-active' : ''} onClick={() => { setRouteId(current => current === route.id ? null : route.id); setSelectedNodeId(null); setParams({}); }}><b>{route.label}</b><span>{route.description}</span><small>{routeId === route.id ? '경로 강조 중' : '지도에서 경로 보기'}</small></button>)}</div>{selectedRoute && <p className="notice">{selectedRoute.label}는 관련 노드와 그 사이의 실제 graph edge를 강조합니다. 단계가 갈라지는 곳은 하나의 직선 인과가 아니라 함께 선택하는 설계 요소입니다.</p>}</section>
  </section>;
}

function NodeDetail({ node, edges, nodeById }: { node: Node; edges: Edge[]; nodeById: Map<string, Node> }) {
  const term = node.termId ? terms.find(item => item.id === node.termId) : undefined;
  const m01Context = term?.missionRefs.find(ref => ref.course === 'main' && ref.mission === 'M01')?.context ?? term?.missionContext;
  const evolution = edges.filter(edge => edge.relation === 'evolved_from');
  const foundations = edges.filter(edge => edge.relation === 'cs_foundation' || edge.to.startsWith('foundation:') || edge.from.startsWith('foundation:'));
  return <><p className="eyebrow">{node.nodeOrigin === 'mission' ? 'M01 용어' : 'Foundation 용어'} · {node.layer}</p><h2 id="map-detail-title">{node.label}</h2><p className="map-detail-summary">{node.summary}</p><dl className="map-facts"><div><dt>이 기술은 어디에 있나?</dt><dd>{graph.regions.find(region => region.id === node.primaryRegion)?.label} · {node.layer}</dd></div>{node.standardsOrProviders?.length ? <div><dt>표준 / Provider</dt><dd>{node.standardsOrProviders.join(' · ')}</dd></div> : null}{node.foundationRationale ? <div><dt>추가 이유</dt><dd>{node.foundationRationale}</dd></div> : null}{m01Context ? <div><dt>M01에서는</dt><dd>{m01Context}</dd></div> : null}</dl>
    {edges.length > 0 && <section className="map-panel-section"><h3>연결 관계</h3><ul>{edges.map((edge, index) => { const isFrom = edge.from === node.id; const other = nodeById.get(isFrom ? edge.to : edge.from); return <li key={`${edge.relation}-${index}`}><b>{isFrom ? '→' : '←'} {edge.relation}</b><span>{other?.label}</span><small>{edge.reason}</small></li>; })}</ul></section>}
    {evolution.length > 0 && <section className="map-panel-section"><h3>어디서 왔나</h3>{evolution.map((edge, index) => <p key={index}><b>{nodeById.get(edge.to)?.label}</b>와 비교해 발전한 맥락입니다. <small>역사 경로이며 단일 인과를 뜻하지 않습니다.</small></p>)}</section>}
    {foundations.length > 0 && <section className="map-panel-section"><h3>CS / 기반 연결</h3><p>{foundations.map(edge => nodeById.get(edge.from === node.id ? edge.to : edge.from)?.label).filter(Boolean).join(' · ')}</p></section>}
    {node.termId && <Link className="map-term-link" to={`/terms/${node.termId}`}>상세 사전에서 보기 <span aria-hidden="true">→</span></Link>}
  </>;
}
