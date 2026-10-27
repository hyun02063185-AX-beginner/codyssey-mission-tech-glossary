import type { ConceptMapData, ConceptNode, ConceptRelation, DrawEdge, MapSelection, MapState, Position, ViewId } from './conceptMapTypes';

type ViewDefinition = ConceptMapData['views'][number];
// A view shows its domains plus explicitly shared common nodes. Existing views list no shared nodes.
export function viewHasNode(view: ViewDefinition, node: ConceptNode) {
  return view.nodeDomains.includes(node.domain) || Boolean(view.sharedNodeIds?.includes(node.id));
}
// Scope and membership are one contract for navigation, projection and layout.
export function viewHasRelation(data: ConceptMapData, view: ViewDefinition, relation: ConceptRelation) {
  const ids = new Set(data.nodes.filter(node => viewHasNode(view, node)).map(node => node.id));
  return view.relationScopes.includes(relation.scope) &&
    [relation.from, relation.to, ...(relation.path ?? [])].every(id => ids.has(id));
}
// Prefer the overview; a node or relation outside it opens in the first view that shows it.
export function homeView(data: ConceptMapData, target: { node?: ConceptNode; relation?: ConceptRelation }): ViewId {
  const fits = (view: ViewDefinition) => target.node ? viewHasNode(view, target.node) : viewHasRelation(data, view, target.relation!);
  return (data.views.find(view => view.id === 'all' && fits(view)) ?? data.views.find(fits) ?? data.views[0]).id;
}

export function nodeForTerm(data: ConceptMapData, term: string) {
  return data.nodes.find(node => node.termIds.includes(term))?.id;
}

export function readMapState(data: ConceptMapData, params: URLSearchParams): { state: MapState; notices: string[] } {
  const notices: string[] = [];
  const requestedView = params.get('view') || 'all';
  let view = data.views.find(item => item.id === requestedView)?.id ?? 'all';
  if (view !== requestedView) notices.push('요청한 보기를 찾지 못해 전체 관계를 표시합니다.');
  const moreValue = params.get('more');
  if (moreValue && moreValue !== '1' && moreValue !== '0') notices.push('보충 개념 표시 값을 확인할 수 없어 기본 표시를 사용합니다.');
  let selection: MapSelection = null;
  if (params.has('rel')) {
    const relation = data.relations.find(item => item.id === params.get('rel'));
    if (relation) selection = { kind: 'rel', id: relation.id };
    else notices.push('찾으려는 관계가 없어 기본 지도를 표시합니다.');
  } else if (params.has('flow')) {
    const flow = data.relations.find(item => item.id === params.get('flow') && item.path);
    if (flow) selection = { kind: 'flow', id: flow.id };
    else notices.push('찾으려는 흐름이 없어 기본 지도를 표시합니다.');
  } else if (params.has('node') || params.has('term')) {
    const id = params.has('node') ? params.get('node') : nodeForTerm(data, params.get('term') ?? '');
    if (data.nodes.some(node => node.id === id)) selection = { kind: 'node', id: id! };
    else notices.push('찾으려는 지도 개념을 찾지 못해 기본 지도를 표시합니다.');
  }
  const definition = data.views.find(item => item.id === view)!;
  const selectedNode = selection?.kind === 'node' ? data.nodes.find(node => node.id === selection.id) : null;
  const selectedRel = selection && selection.kind !== 'node' ? data.relations.find(rel => rel.id === selection.id) : null;
  if ((selectedNode && !viewHasNode(definition, selectedNode)) ||
      (selectedRel && !viewHasRelation(data, definition, selectedRel))) {
    view = homeView(data, selectedNode ? { node: selectedNode } : { relation: selectedRel! });
    notices.push(`선택한 개념·관계를 볼 수 있도록 ${data.views.find(item => item.id === view)!.label} 보기로 전환했습니다.`);
  }
  return { state: { view, more: moreValue === '1', selection }, notices };
}

export function stateParams(state: MapState) {
  const params = new URLSearchParams();
  if (state.view !== 'all') params.set('view', state.view);
  if (state.more) params.set('more', '1');
  if (state.selection) params.set(state.selection.kind, state.selection.id);
  return params;
}

export function changeView(data: ConceptMapData, state: MapState, view: ViewId) {
  const definition = data.views.find(item => item.id === view)!;
  let selection = state.selection;
  let notice = '';
  let counterpart: string | undefined;
  if (selection?.kind === 'node') {
    const node = data.nodes.find(item => item.id === selection!.id)!;
    if (!viewHasNode(definition, node)) {
      notice = `'${node.label}'은 ${definition.label} 보기에 없어 선택을 해제했습니다. 다른 보기에서 다시 선택할 수 있습니다.`;
      const cross = data.relations.find(rel => rel.scope === 'cross' && (rel.from === node.id || rel.to === node.id));
      counterpart = cross ? (cross.from === node.id ? cross.to : cross.from) : undefined;
      selection = null;
    }
  } else if (selection) {
    const relation = data.relations.find(item => item.id === selection!.id)!;
    if (!viewHasRelation(data, definition, relation)) {
      const endpoint = data.nodes.find(node => [relation.from, relation.to].includes(node.id) && viewHasNode(definition, node));
      notice = '이 보기에는 선택한 관계·흐름이 없어 선택을 변경했습니다.';
      selection = selection.kind === 'rel' && endpoint ? { kind: 'node', id: endpoint.id } : null;
    }
  }
  return { state: { ...state, view, selection }, notice, counterpart };
}

function pathSegment(relation: ConceptRelation, start: number, end: number): DrawEdge {
  return { id: `${relation.id}#${start}${end === start + 1 ? '' : `-${end}`}`, relation,
    from: relation.path![start], to: relation.path![end],
    step: relation.pathStepIds?.slice(start, end).join('–'), omitted: relation.path!.slice(start + 1, end) };
}

type LayoutGraph = Pick<ConceptMapData, 'nodes' | 'regions'> & { edges: DrawEdge[] };
const viewLayouts = new WeakMap<ConceptMapData, Map<ViewId, ReturnType<typeof routeConceptMap>>>();
function layoutForView(data: ConceptMapData, view: ViewId) {
  if(data.layout)return {
    positions:new Map(Object.entries(data.layout.positions)),layouts:new Map(Object.entries(data.layout.regions)),
    routes:new Map(Object.entries(data.layout.routes).map(([id,points])=>[id,{points,path:relationPath(points),labelPath:relationPath(points)}])),
    width:data.layout.width,height:data.layout.height,fixed:true,
  };
  let views = viewLayouts.get(data);
  if (!views) { views = new Map(); viewLayouts.set(data, views); }
  const cached = views.get(view);
  if (cached) return cached;
  const definition = data.views.find(item => item.id === view)!;
  const nodes = data.nodes.filter(node => viewHasNode(definition, node));
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const regions = data.regions.filter(region => nodes.some(node => node.region === region.id)).sort((a, b) => a.order - b.order);
  // Guard: a relation is laid out only when every endpoint and waypoint is in this view.
  const edges: DrawEdge[] = data.relations.filter(rel => viewHasRelation(data, definition, rel)).flatMap(rel => {
    if (!rel.path) return [{ id: rel.id, relation: rel, from: rel.from, to: rel.to }];
    const segments: DrawEdge[] = [];
    for (let start = 0; start < rel.path.length - 1; start++) {
      for (let end = start + 1; end < rel.path.length; end++) {
        segments.push(pathSegment(rel, start, end));
        // Core nodes are always present. Reserve shortcuts only across hidden
        // supplementary waypoints, as well as all complete path segments.
        if (nodeById.get(rel.path[end])!.importance === 'core') break;
      }
    }
    return segments;
  });
  const layout = routeConceptMap({ nodes, regions, edges });
  views.set(view, layout);
  return layout;
}

export function adaptConceptMap(data: ConceptMapData, state: MapState, importanceOverride?: 'core' | 'full') {
  const definition = data.views.find(item => item.id === state.view)!;
  const full = importanceOverride ? importanceOverride === 'full' : state.more || definition.initialImportance.includes('supplementary');
  const selection = state.selection;
  const eligible = data.nodes.filter(node => viewHasNode(definition, node));
  const eligibleIds = new Set(eligible.map(node => node.id));
  const inScope = data.relations.filter(rel => viewHasRelation(data, definition, rel));
  const revealed = new Set<string>();
  const contrastIds = new Set<string>();
  if (selection?.kind === 'node') {
    revealed.add(selection.id);
    for (const rel of inScope) {
      if (rel.path) {
        const index = rel.path.indexOf(selection.id);
        if (index >= 0) rel.path.slice(Math.max(0, index - 1), index + 2).forEach(id => revealed.add(id));
      } else if (rel.from === selection.id || rel.to === selection.id) {
        revealed.add(rel.from); revealed.add(rel.to);
      }
    }
    data.contrasts.filter(card => card.nodeIds.includes(selection.id)).forEach(card => card.nodeIds.forEach(id => {
      if (id !== selection.id && eligibleIds.has(id)) { contrastIds.add(id); revealed.add(id); }
    }));
  } else if (selection) {
    const rel = inScope.find(item => item.id === selection.id);
    (rel?.path ?? (rel ? [rel.from, rel.to] : [])).forEach(id => revealed.add(id));
  }
  const nodes = eligible.filter(node => full || node.importance === 'core' || revealed.has(node.id));
  const visibleIds = new Set(nodes.map(node => node.id));
  const relations = inScope.filter(rel => visibleIds.has(rel.from) && visibleIds.has(rel.to) &&
    (full || rel.importance === 'core' || selection?.id === rel.id ||
      (selection?.kind === 'node' && (rel.path?.includes(selection.id) || rel.from === selection.id || rel.to === selection.id))));
  const edges: DrawEdge[] = relations.flatMap(rel => {
    if (!rel.path) return [{ id: rel.id, relation: rel, from: rel.from, to: rel.to }];
    const path = rel.path.map((id, index) => ({ id, index })).filter(item => visibleIds.has(item.id));
    return path.slice(1).map((item, index) => {
      const previous = path[index];
      return pathSegment(rel, previous.index, item.index);
    });
  });
  const highlightedEdges = new Set(edges.filter(edge => selection?.kind === 'node'
    ? edge.from === selection.id || edge.to === selection.id : selection && edge.relation.id === selection.id).map(edge => edge.id));
  const highlightedNodes = new Set(edges.filter(edge => highlightedEdges.has(edge.id)).flatMap(edge => [edge.from, edge.to]));
  if (selection?.kind === 'node') highlightedNodes.add(selection.id);
  const regions = data.regions.filter(region => nodes.some(node => node.region === region.id)).sort((a, b) => a.order - b.order);
  return { nodes, relations, edges, regions, highlightedEdges, highlightedNodes, contrastIds, annotations:data.layout?.annotations,
    layoutBasis: layoutForView(data, state.view),
    flows: inScope.filter(rel => rel.path),
    temporary: nodes.filter(node => !full && node.importance === 'supplementary'),
  };
}

export function layoutConceptMap(graph: ReturnType<typeof adaptConceptMap>) {
  // Project visibility and bounds only. Node positions, ports and complete SVG
  // routes come from the cached, selection-independent layout for this view.
  const basis = graph.layoutBasis;
  const positions = new Map(graph.nodes.map(node => [node.id, basis.positions.get(node.id)!]));
  const routes = new Map(graph.edges.map(edge => [edge.id, basis.routes.get(edge.id)!]));
  if('fixed' in basis)return {positions,routes,layouts:new Map(graph.regions.map(region=>[region.id,basis.layouts.get(region.id)!])),width:basis.width,height:basis.height};
  const layouts = new Map(graph.regions.map(region => {
    const bottom = Math.max(...graph.nodes.filter(node => node.region === region.id).map(node => {
      const p = positions.get(node.id)!;
      return p.y + p.height;
    }));
    return [region.id, { ...basis.layouts.get(region.id)!, height: bottom + 20 }];
  }));
  const height = Math.max(...[...layouts.values()].map(p => p.y + p.height + 16),
    ...[...routes.values()].flatMap(route => route.points.map(([, y]) => y + 24)));
  return { positions, layouts, routes, width: basis.width, height };
}

function routeConceptMap(graph: LayoutGraph) {
  const positions = new Map<string, Position>();
  const layouts = new Map<string, Position>();
  const columns = new Map<string, number>();
  let height = 0;
  graph.regions.forEach((region, column) => {
    // Keep core rows compact; supplementary slots extend the column below them.
    // Hiding those slots never leaves holes between the core cards.
    const items = graph.nodes.filter(node => node.region === region.id).sort((a, b) =>
      Number(a.importance === 'supplementary') - Number(b.importance === 'supplementary') || a.order - b.order);
    const regionHeight = items.length * 102 + 62;
    layouts.set(region.id, { x: 0, y: 16, width: 234, height: regionHeight });
    items.forEach((node, row) => {
      positions.set(node.id, { x: 0, y: 68 + row * 102, width: 206, height: 76 });
      columns.set(node.id, column);
    });
    height = Math.max(height, regionHeight + 32);
  });

  const intents = graph.edges.map(edge => {
    const from = columns.get(edge.from)!, to = columns.get(edge.to)!;
    return { edge, from, to, right: to >= from, long: Math.abs(to - from) > 1 };
  });
  // Assign distinct ports by the opposite endpoint, then stable edge ID. Request and
  // response paths between the same cards must not share an arrowhead or hit area.
  const ports = new Map<string, { key: string; oppositeY: number }[]>();
  for (const intent of intents) {
    for (const source of [true, false]) {
      const id = source ? intent.edge.from : intent.edge.to;
      const right = (source || intent.from === intent.to) ? intent.right : !intent.right;
      const key = `${id}:${right ? 'right' : 'left'}`;
      const items = ports.get(key) ?? [];
      items.push({ key: `${intent.edge.id}:${source ? 'from' : 'to'}`,
        oppositeY: positions.get(source ? intent.edge.to : intent.edge.from)!.y });
      ports.set(key, items);
    }
  }
  const portY = new Map<string, number>();
  for (const [key, items] of ports) {
    const id = key.slice(0, key.lastIndexOf(':')), p = positions.get(id)!;
    items.sort((a, b) => a.oppositeY - b.oppositeY || a.key.localeCompare(b.key));
    items.forEach((item, index) => portY.set(item.key, p.y + (items.length === 1 ? p.height / 2 : 8 + index * (p.height - 16) / (items.length - 1))));
  }

  // Long edges cross intervening columns only in the 26px gaps between card rows.
  // Reuse a rail for disjoint column spans; overlapping spans get a separate rail.
  const railSpans = new Map<number, [number, number][]>();
  const rails = new Map<string, number>();
  for (const intent of intents.filter(item => item.long).sort((a, b) => a.edge.id.localeCompare(b.edge.id))) {
    const sy = portY.get(`${intent.edge.id}:from`)!, ey = portY.get(`${intent.edge.id}:to`)!;
    const left = Math.min(intent.from, intent.to), right = Math.max(intent.from, intent.to);
    const candidates = Array.from({ length: graph.nodes.length + 1 }, (_, row) => [152 + row * 102, 162 + row * 102]).flat()
      .sort((a, b) => (Math.abs(sy - a) + Math.abs(ey - a)) - (Math.abs(sy - b) + Math.abs(ey - b)) ||
        Math.abs(a - (sy + ey) / 2) - Math.abs(b - (sy + ey) / 2) || a - b);
    const y = candidates.find(value => !(railSpans.get(value) ?? []).some(([a, b]) => left <= b && right >= a))!;
    railSpans.set(y, [...(railSpans.get(y) ?? []), [left, right]]);
    rails.set(intent.edge.id, y);
    height = Math.max(height, y + 24);
  }

  // Interval colouring keeps overlapping vertical runs 12px apart inside each
  // shared gutter. Gutter width grows with demand instead of squeezing the cards.
  const runs = new Map<number, { key: string; start: number; end: number }[]>();
  for (const intent of intents) {
    const sy = portY.get(`${intent.edge.id}:from`)!, ey = portY.get(`${intent.edge.id}:to`)!;
    const add = (gutter: number, suffix: string, a: number, b: number) => {
      const items = runs.get(gutter) ?? [];
      items.push({ key: `${intent.edge.id}:${suffix}`, start: Math.min(a, b), end: Math.max(a, b) });
      runs.set(gutter, items);
    };
    if (intent.long) {
      const rail = rails.get(intent.edge.id)!;
      add(intent.from - Number(!intent.right), 'from', sy, rail);
      add(intent.to - Number(intent.right), 'to', ey, rail);
    } else add(Math.min(intent.from, intent.to), 'from', sy, ey);
  }
  const tracks = new Map<string, number>(), trackCounts = new Map<number, number>();
  for (const [gutter, items] of runs) {
    const ends: number[] = [];
    items.sort((a, b) => a.start - b.start || a.end - b.end || a.key.localeCompare(b.key));
    for (const item of items) {
      let track = ends.findIndex(end => end + 12 < item.start);
      if (track < 0) track = ends.length;
      ends[track] = item.end;
      tracks.set(item.key, track);
    }
    trackCounts.set(gutter, ends.length);
  }
  const gutterWidth = Math.max(144, (Math.max(1, ...trackCounts.values()) - 1) * 12 + 48);
  const pitch = 234 + gutterWidth;
  graph.regions.forEach((region, column) => { layouts.get(region.id)!.x = 16 + column * pitch; });
  positions.forEach((position, id) => { position.x = 30 + columns.get(id)! * pitch; });
  const laneX = (gutter: number, key: string) => 16 + gutter * pitch + 234 + gutterWidth / 2 +
    (tracks.get(key)! - (trackCounts.get(gutter)! - 1) / 2) * 12;
  const routes = new Map<string, { points: RoutePoint[]; path: string; labelPath: string }>();
  for (const intent of intents) {
    const from = positions.get(intent.edge.from)!, to = positions.get(intent.edge.to)!;
    const sy = portY.get(`${intent.edge.id}:from`)!, ey = portY.get(`${intent.edge.id}:to`)!;
    // Ten map units leave the arrow tip/diamond clear of the card border.
    const sx = from.x + (intent.right ? from.width + 10 : -10);
    const ex = to.x + (intent.from === intent.to || !intent.right ? to.width + 10 : -10);
    let points: RoutePoint[];
    if (intent.long) {
      const a = laneX(intent.from - Number(!intent.right), `${intent.edge.id}:from`);
      const b = laneX(intent.to - Number(intent.right), `${intent.edge.id}:to`), y = rails.get(intent.edge.id)!;
      points = [[sx, sy], [a, sy], [a, y], [b, y], [b, ey], [ex, ey]];
    } else {
      const lane = laneX(Math.min(intent.from, intent.to), `${intent.edge.id}:from`);
      points = [[sx, sy], [lane, sy], [lane, ey], [ex, ey]];
    }
    routes.set(intent.edge.id, { points, path: relationPath(points),
      labelPath: relationPath(sx > ex || (sx === ex && sy > ey) ? [...points].reverse() : points) });
  }
  return { positions, layouts, routes, width: graph.regions.length * pitch + 24, height };
}

type RoutePoint = [number, number];
// Round only the corners of an orthogonal route; never curve through card space.
export function relationPath(points: RoutePoint[]) {
  const clean = points.filter((p, i) => !i || p[0] !== points[i - 1][0] || p[1] !== points[i - 1][1]);
  let path = `M ${clean[0].join(' ')}`;
  for (let i = 1; i < clean.length - 1; i++) {
    const [x, y] = clean[i], [px, py] = clean[i - 1], [nx, ny] = clean[i + 1];
    const before = Math.hypot(x - px, y - py), after = Math.hypot(nx - x, ny - y);
    const radius = Math.min(6, before / 2, after / 2);
    path += ` L ${x + (px - x) / before * radius} ${y + (py - y) / before * radius}` +
      ` Q ${x} ${y} ${x + (nx - x) / after * radius} ${y + (ny - y) / after * radius}`;
  }
  return `${path} L ${clean[clean.length - 1].join(' ')}`;
}

export function relationTouches(rel: ConceptRelation, id: string) {
  return rel.from === id || rel.to === id || Boolean(rel.path?.includes(id));
}
