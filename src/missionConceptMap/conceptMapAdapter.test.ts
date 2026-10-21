import { describe, expect, it } from 'vitest';
import source from '../../data/mission-story-maps/main-m05/concept-map.json';
import draft from '../../drafts/b3-1-visual-story/concept-map-v2/concept-map-v2.json';
import { adaptConceptMap, changeView, layoutConceptMap, readMapState, stateParams } from './conceptMapAdapter';
import type { ConceptMapData, MapState, ViewId } from './conceptMapTypes';
const data = source as ConceptMapData;
const initial: MapState = { view: 'all', more: false, selection: null };

describe('runtime candidate and views', () => {
  it('preserves the design except the authorized SH01 wording', () => {
    const changed = structuredClone(source);
    changed.relations = changed.relations.map(rel => rel.id === 'SH01' ? draft.relations.find(item => item.id === 'SH01')! : rel);
    expect(changed).toEqual(draft);
    const relation = data.relations.find(rel => rel.id === 'SH01')!;
    expect(relation.label).toBe('주소 변환 관계');
    expect(relation.perSystem?.general).toContain('항상 1:1이라는 뜻은 아니다');
  });
  for (const [view, mode, nodes, relations] of [
    ['all', 'core', 23, 31], ['all', 'full', 36, 57], ['general', 'core', 15, 15],
    ['general', 'full', 26, 34], ['aws', 'core', 12, 12], ['aws', 'full', 15, 17],
  ] as const) {
    it(`${view}/${mode} has the approved counts, no orphan or overlapping cards`, () => {
      const graph = adaptConceptMap(data, { ...initial, view }, mode);
      expect(graph.nodes).toHaveLength(nodes); expect(graph.relations).toHaveLength(relations);
      const connected = new Set(graph.edges.flatMap(edge => [edge.from, edge.to]));
      expect(graph.nodes.filter(node => !connected.has(node.id))).toEqual([]);
      const positions = [...layoutConceptMap(graph).positions.values()];
      for (let i = 0; i < positions.length; i++) for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i], b = positions[j];
        expect(a.x + a.width <= b.x || b.x + b.width <= a.x || a.y + a.height <= b.y || b.y + b.height <= a.y).toBe(true);
      }
    });
  }
  it('defaults to supplementary concepts in the two focused views', () => {
    expect(adaptConceptMap(data, { ...initial, view: 'general' }).nodes).toHaveLength(26);
    expect(adaptConceptMap(data, { ...initial, view: 'aws' }).nodes).toHaveLength(15);
  });
});
describe('selection and safe flow rendering', () => {
  it('reveals firewall neighbours and only adjacent flow segments', () => {
    const graph = adaptConceptMap(data, { ...initial, selection: { kind: 'node', id: 'gen:firewall' } });
    expect(graph.nodes.map(node => node.id)).toEqual(expect.arrayContaining(['gen:border-zone', 'gen:stateful-tracking', 'gen:switch']));
    expect([...graph.highlightedEdges]).toEqual(expect.arrayContaining(['GN13', 'GN14', 'GN16']));
    expect(graph.highlightedEdges.has('GF01#0')).toBe(false);
    expect(graph.highlightedNodes.has('com:visitor')).toBe(false);
  });
  for (const id of ['GF01', 'GF02', 'AF01']) it(`${id} reveals every waypoint with the original step identifiers`, () => {
    const graph = adaptConceptMap(data, { ...initial, selection: { kind: 'flow', id } });
    const flow = data.relations.find(rel => rel.id === id)!;
    expect([...graph.highlightedNodes].sort()).toEqual([...flow.path!].sort());
    expect(graph.edges.filter(edge => edge.relation.id === id).map(edge => edge.step)).toEqual(flow.pathStepIds);
    expect(graph.edges.filter(edge => edge.relation.id === id).flatMap(edge => edge.omitted ?? [])).toEqual([]);
    expect(graph.highlightedNodes.has('aws:route-table')).toBe(false);
    expect(graph.highlightedNodes.has('aws:security-group')).toBe(false);
  });
  it('marks the omitted switch in the unselected overview', () => {
    const graph = adaptConceptMap(data, initial);
    expect(graph.edges.find(edge => edge.relation.id === 'GF01' && edge.from === 'gen:firewall')).toMatchObject({ to: 'gen:public-web-server', step: 'A4–A5', omitted: ['gen:switch'] });
  });
  it('uses contrast outlines without adding false correspondence lines', () => {
    const graph = adaptConceptMap(data, { ...initial, selection: { kind: 'node', id: 'gen:dmz' } });
    expect(graph.contrastIds.has('aws:subnet')).toBe(true);
    for (const card of data.contrasts) expect(data.relations.some(rel => card.nodeIds.includes(rel.from) && card.nodeIds.includes(rel.to))).toBe(false);
  });
});
describe('URL and view transitions', () => {
  const read = (query: string) => readMapState(data, new URLSearchParams(query));
  it('restores terms, supplementary nodes, relations and selection priority', () => {
    expect(read('term=security-group').state.selection).toEqual({ kind: 'node', id: 'aws:security-group' });
    expect(read('view=general&node=aws:region').state.view).toBe('all');
    expect(read('node=gen:nat&flow=GF01&rel=CR03').state.selection).toEqual({ kind: 'rel', id: 'CR03' });
    expect(read('more=1&flow=GF02').state.more).toBe(true);
  });
  for (const query of ['view=bad', 'node=bad', 'rel=bad', 'flow=GN01', 'term=bad', 'more=bad']) it(`recovers from ${query}`, () => {
    const result = read(query);
    expect(result.notices.length).toBeGreaterThan(0);
    expect(adaptConceptMap(data, result.state).nodes).toHaveLength(23);
  });
  it('round trips each selection through canonical URLs', () => {
    for (const query of ['view=general&node=gen:firewall', 'view=aws&flow=AF01', 'more=1&rel=SH01', 'term=public-subnet']) {
      const state = read(query).state;
      expect(readMapState(data, stateParams(state)).state).toEqual(state);
    }
  });
  it('preserves common nodes and removes incompatible selection with an explanation', () => {
    for (const view of ['all', 'general', 'aws'] as ViewId[]) expect(changeView(data, { ...initial, selection: { kind: 'node', id: 'com:public-ip' } }, view).state.selection?.id).toBe('com:public-ip');
    const result = changeView(data, { ...initial, selection: { kind: 'node', id: 'gen:access-control' } }, 'aws');
    expect(result.state.selection).toBeNull(); expect(result.notice).toContain('선택을 해제'); expect(result.counterpart).toBe('aws:security-group');
    expect(changeView(data, { ...initial, selection: { kind: 'rel', id: 'CR01' } }, 'general').state.selection).toEqual({ kind: 'node', id: 'gen:routing' });
  });
});
