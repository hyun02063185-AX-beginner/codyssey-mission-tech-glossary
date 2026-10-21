import type { ConceptMapData, ConceptRelation, DrawEdge, MapSelection, MapState, Position, ViewId } from './conceptMapTypes';

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
  if ((selectedNode && !definition.nodeDomains.includes(selectedNode.domain)) ||
      (selectedRel && !definition.relationScopes.includes(selectedRel.scope))) {
    view = 'all';
    notices.push('선택한 개념·관계를 볼 수 있도록 전체 관계 보기로 전환했습니다.');
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
    if (!definition.nodeDomains.includes(node.domain)) {
      notice = `'${node.label}'은 ${definition.label} 보기에 없어 선택을 해제했습니다. 전체 관계 보기에서 비교할 수 있습니다.`;
      const cross = data.relations.find(rel => rel.scope === 'cross' && (rel.from === node.id || rel.to === node.id));
      counterpart = cross ? (cross.from === node.id ? cross.to : cross.from) : undefined;
      selection = null;
    }
  } else if (selection) {
    const relation = data.relations.find(item => item.id === selection!.id)!;
    if (!definition.relationScopes.includes(relation.scope)) {
      const endpoint = data.nodes.find(node => [relation.from, relation.to].includes(node.id) && definition.nodeDomains.includes(node.domain));
      notice = '이 보기에는 선택한 관계·흐름이 없어 선택을 변경했습니다.';
      selection = selection.kind === 'rel' && endpoint ? { kind: 'node', id: endpoint.id } : null;
    }
  }
  return { state: { ...state, view, selection }, notice, counterpart };
}

export function adaptConceptMap(data: ConceptMapData, state: MapState, importanceOverride?: 'core' | 'full') {
  const definition = data.views.find(item => item.id === state.view)!;
  const full = importanceOverride ? importanceOverride === 'full' : state.more || definition.initialImportance.includes('supplementary');
  const selection = state.selection;
  const eligible = data.nodes.filter(node => definition.nodeDomains.includes(node.domain));
  const eligibleIds = new Set(eligible.map(node => node.id));
  const inScope = data.relations.filter(rel => definition.relationScopes.includes(rel.scope));
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
      return { id: `${rel.id}#${previous.index}`, relation: rel, from: previous.id, to: item.id,
        step: rel.pathStepIds?.slice(previous.index, item.index).join('–'),
        omitted: rel.path!.slice(previous.index + 1, item.index) };
    });
  });
  const highlightedEdges = new Set(edges.filter(edge => selection?.kind === 'node'
    ? edge.from === selection.id || edge.to === selection.id : selection && edge.relation.id === selection.id).map(edge => edge.id));
  const highlightedNodes = new Set(edges.filter(edge => highlightedEdges.has(edge.id)).flatMap(edge => [edge.from, edge.to]));
  if (selection?.kind === 'node') highlightedNodes.add(selection.id);
  const regions = data.regions.filter(region => nodes.some(node => node.region === region.id)).sort((a, b) => a.order - b.order);
  return { nodes, relations, edges, regions, highlightedEdges, highlightedNodes, contrastIds,
    flows: inScope.filter(rel => rel.path),
    temporary: nodes.filter(node => !full && node.importance === 'supplementary'),
  };
}

export function layoutConceptMap(graph: ReturnType<typeof adaptConceptMap>) {
  const positions = new Map<string, Position>();
  const layouts = new Map<string, Position>();
  const width = graph.regions.length * 264 + 24;
  let height = 0;
  graph.regions.forEach((region, column) => {
    const items = graph.nodes.filter(node => node.region === region.id).sort((a, b) => a.order - b.order);
    const regionHeight = items.length * 102 + 62;
    const x = 16 + column * 264;
    layouts.set(region.id, { x, y: 16, width: 234, height: regionHeight });
    items.forEach((node, row) => positions.set(node.id, { x: x + 14, y: 68 + row * 102, width: 206, height: 76 }));
    height = Math.max(height, regionHeight + 32);
  });
  return { positions, layouts, width, height };
}

// Lines attach to card boundaries. Same-column arcs use the gutter, avoiding card text.
export function relationPath(from: Position, to: Position, index: number) {
  if (from.x === to.x) {
    const x = from.x + from.width, sy = from.y + from.height / 2, ey = to.y + to.height / 2;
    const bend = 22 + (index % 3) * 7;
    return `M ${x} ${sy} C ${x + bend} ${sy}, ${x + bend} ${ey}, ${x} ${ey}`;
  }
  const right = to.x > from.x;
  const sx = from.x + (right ? from.width : 0), ex = to.x + (right ? 0 : to.width);
  const sy = from.y + from.height / 2 + (index % 3 - 1) * 8;
  const ey = to.y + to.height / 2 + (index % 3 - 1) * 8;
  const bend = Math.max(24, Math.abs(ex - sx) * .45);
  return `M ${sx} ${sy} C ${sx + (right ? bend : -bend)} ${sy}, ${ex - (right ? bend : -bend)} ${ey}, ${ex} ${ey}`;
}

export function relationTouches(rel: ConceptRelation, id: string) {
  return rel.from === id || rel.to === id || Boolean(rel.path?.includes(id));
}
