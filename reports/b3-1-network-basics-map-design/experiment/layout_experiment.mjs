// B3-1 네트워크 기초 보기 — 읽기 전용 배치·탐색 실험(설계 검증용, 프로덕션 코드 아님).
// 실행: node layout_experiment.mjs <repo-root> <work-dir>
//   <work-dir>/engine-original.mjs : 현재 src/missionConceptMap/conceptMapAdapter.ts를 esbuild로 묶은 것
//   <work-dir>/engine-patched.mjs  : 설계 문서 §6.2의 최소 엔진 변경을 적용한 임시 사본
//   <work-dir>/phase1.json, candidate-A.json, candidate-B.json : build_candidate.py 출력
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const [repo, work] = process.argv.slice(2);
const load = path => JSON.parse(readFileSync(path, 'utf8'));
const original = await import(`${work}/engine-original.mjs`);
const patched = await import(`${work}/engine-patched.mjs`);
const current = load(`${repo}/data/mission-story-maps/main-m05/concept-map.json`);
const phase1 = load(`${work}/phase1.json`);
const candidates = Object.fromEntries(['A', 'B', 'C', 'D'].map(id => [id, load(`${work}/candidate-${id}.json`)]));
const candA = candidates.A;
const sha = value => createHash('sha256').update(value).digest('hex').slice(0, 16);
const sorted = map => [...map].sort(([a], [b]) => a.localeCompare(b));

function geometry(basis) {
  return JSON.stringify({ width: basis.width, height: basis.height, positions: sorted(basis.positions),
    layouts: sorted(basis.layouts), routes: sorted(basis.routes) });
}
function snapshot(engine, data, state, override) {
  const graph = engine.adaptConceptMap(data, state, override);
  const layout = engine.layoutConceptMap(graph);
  return {
    basis: geometry(graph.layoutBasis),
    projection: JSON.stringify({ width: layout.width, height: layout.height, positions: sorted(layout.positions),
      layouts: sorted(layout.layouts), routes: sorted(layout.routes) }),
    graph: JSON.stringify({ nodes: graph.nodes.map(n => n.id), relations: graph.relations.map(r => r.id),
      edges: graph.edges.map(e => [e.id, e.from, e.to, e.step ?? null, e.omitted ?? null]),
      highlightedEdges: [...graph.highlightedEdges].sort(), highlightedNodes: [...graph.highlightedNodes].sort(),
      contrastIds: [...graph.contrastIds].sort(), temporary: graph.temporary.map(n => n.id), flows: graph.flows.map(f => f.id) }),
  };
}
// The same selection universe as conceptMapAdapter.test.ts, taken from the CURRENT data only.
function states(data, view) {
  const def = data.views.find(v => v.id === view);
  const inView = n => def.nodeDomains.includes(n.domain) || def.sharedNodeIds?.includes(n.id);
  const selections = [null, ...data.nodes.filter(inView).map(n => ({ kind: 'node', id: n.id })),
    ...data.relations.filter(r => def.relationScopes.includes(r.scope)).map(r => ({ kind: r.path ? 'flow' : 'rel', id: r.id }))];
  const out = [];
  for (const selection of selections) for (const more of [false, true]) for (const override of [undefined, 'core', 'full'])
    out.push({ state: { view, more, selection }, override });
  return out;
}
function compare(label, engineA, dataA, engineB, dataB, views, selectionSource = dataA) {
  const result = { label, views: {}, compared: 0, geometryDiffs: [], projectionDiffs: [], graphDiffs: [] };
  for (const view of views) {
    const list = states(selectionSource, view);
    const a0 = snapshot(engineA, dataA, list[0].state, list[0].override);
    result.views[view] = { states: list.length, geometrySha: sha(a0.basis) };
    for (const { state, override } of list) {
      const a = snapshot(engineA, dataA, state, override), b = snapshot(engineB, dataB, state, override);
      const key = `${view}/${state.selection ? state.selection.kind + ':' + state.selection.id : 'overview'}/more=${state.more}/${override ?? 'auto'}`;
      result.compared++;
      if (a.basis !== b.basis) result.geometryDiffs.push(key);
      if (a.projection !== b.projection) result.projectionDiffs.push(key);
      if (a.graph !== b.graph) result.graphDiffs.push({ key, before: JSON.parse(a.graph).contrastIds, after: JSON.parse(b.graph).contrastIds });
    }
  }
  return result;
}

const three = ['all', 'general', 'aws'];
const report = { generatedFrom: { repo: 'codyssey-mission-tech-glossary', data: 'data/mission-story-maps/main-m05/concept-map.json' } };
report.E1_phase1_original_engine = compare('E1 현재 엔진: 현재 데이터 vs 1차(용어 링크만)', original, current, original, phase1, three);
report.E2_engine_noop_current_data = compare('E2 현재 데이터: 현재 엔진 vs 패치 엔진', original, current, patched, current, three);
for (const [id, data] of Object.entries(candidates))
  report[`E3_candidate${id}_three_views`] = compare(`E3 현재 엔진+현재 데이터 vs 패치 엔진+2차 후보 ${id} (기존 세 보기)`, original, current, patched, data, three, current);

// E4: B6-1·B2-1 geometry-only use of the same engine (mirrors their adapters).
function geometryData(id, nodes, relations, areas, orderOf) {
  return { mapId: id, title: '', question: '',
    nodes: nodes.map((n, i) => ({ id: n.id, label: n.label, region: n.area, order: orderOf(n, i), domain: 'common', importance: 'core',
      conceptType: '', implementationStatus: '', summary: '', description: '', termIds: [], storyScenes: [] })),
    relations: relations.map(r => ({ ...r, type: '연관', scope: 'geometry', importance: 'core', label: r.label ?? '', description: r.description ?? '', source: [], storyScenes: [] })),
    regions: areas.map((a, order) => ({ ...a, description: '', domain: 'common', order })),
    views: [{ id: 'all', label: '', nodeDomains: ['common'], relationScopes: ['geometry'], initialImportance: ['core'], description: '' }],
    contrasts: [], scenes: [], sources: [], learningOrder: [], linkPolicy: { doNotAutoLink: [], conceptConnection: { id: '' } } };
}
const b61 = load(`${repo}/src/b61ConceptMap/data.json`);
const b61Order = ['erd', 'relationship', 'fk', 'pk', 'table', 'row', 'column', 'database', 'dbms', 'sql', 'join'];
const b21 = load(`${repo}/drafts/b2-1-story-map/scene-08/candidate-map.json`);
report.E4_other_missions = {};
for (const [name, data] of [['B6-1', geometryData('b61-geometry', b61.nodes, b61.relations, b61.areas, n => b61Order.indexOf(n.id))],
  ['B2-1', geometryData('b21-private-geometry', b21.nodes, b21.relations.map(r => ({ id: r.id, from: r.from, to: r.to })), b21.areas, (n, i) => i)]]) {
  const state = { view: 'all', more: true, selection: null };
  const a = snapshot(original, data, state), b = snapshot(patched, data, state);
  report.E4_other_missions[name] = { nodes: data.nodes.length, relations: data.relations.length,
    geometryIdentical: a.basis === b.basis, projectionIdentical: a.projection === b.projection, geometrySha: sha(a.basis) };
}

// E5: basics view geometry checks (same assertions as conceptMapAdapter.test.ts corridors/stable world) + readability metrics.
function basicsChecks(data, label) {
  const view = 'basics', def = data.views.find(v => v.id === view);
  const problems = [], seenNodes = new Map(), seenRoutes = new Map();
  for (const { state, override } of states(data, view)) {
    const graph = patched.adaptConceptMap(data, state, override), layout = patched.layoutConceptMap(graph), endpoints = new Set();
    if (layout.routes.size !== graph.edges.length) problems.push(`route count ${state.selection?.id}`);
    for (const [id, route] of layout.routes) {
      if (/NaN|undefined|Infinity/.test(route.path)) problems.push(`bad path ${id}`);
      for (const p of [route.points[0], route.points.at(-1)]) { const k = p.join(','); if (endpoints.has(k)) problems.push(`shared endpoint ${id}`); endpoints.add(k); }
      for (let i = 1; i < route.points.length; i++) {
        const [ax, ay] = route.points[i - 1], [bx, by] = route.points[i];
        if (!(ax === bx || ay === by)) problems.push(`diagonal ${id}`);
        if (Math.min(ax, bx) < 0 || Math.max(ax, bx) > layout.width || Math.min(ay, by) < 0 || Math.max(ay, by) > layout.height) problems.push(`out of bounds ${id}`);
        for (const c of layout.positions.values())
          if (Math.max(ax, bx) > c.x - 3 && Math.min(ax, bx) < c.x + c.width + 3 && Math.max(ay, by) > c.y - 3 && Math.min(ay, by) < c.y + c.height + 3)
            problems.push(`${id} crosses a card`);
      }
    }
    for (const [id, p] of layout.positions) { const v = JSON.stringify(p); if (seenNodes.has(id) && seenNodes.get(id) !== v) problems.push(`${id} moved`); seenNodes.set(id, v); }
    for (const e of graph.edges) { const v = JSON.stringify(layout.routes.get(e.id)); if (seenRoutes.has(e.id) && seenRoutes.get(e.id) !== v) problems.push(`${e.id} rerouted`); seenRoutes.set(e.id, v); }
  }
  const full = patched.adaptConceptMap(data, { view, more: true, selection: null }, 'full');
  const layout = patched.layoutConceptMap(full);
  const columns = [...new Set([...layout.positions.values()].map(p => p.x))].sort((a, b) => a - b);
  const colOf = id => columns.indexOf(layout.positions.get(id).x);
  const longEdges = full.edges.filter(e => Math.abs(colOf(e.from) - colOf(e.to)) > 1).map(e => e.id);
  const segs = [...layout.routes].map(([id, r]) => [id, r.points.slice(1).map((p, i) => [r.points[i], p])]);
  let crossings = 0; const crossingPairs = [];
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    let hit = false;
    for (const [[ax, ay], [bx, by]] of segs[i][1]) for (const [[cx, cy], [dx, dy]] of segs[j][1]) {
      const h1 = ay === by, h2 = cy === dy;
      if (h1 === h2) continue;
      const [hx1, hx2, hy] = h1 ? [Math.min(ax, bx), Math.max(ax, bx), ay] : [Math.min(cx, dx), Math.max(cx, dx), cy];
      const [vy1, vy2, vx] = h1 ? [Math.min(cy, dy), Math.max(cy, dy), cx] : [Math.min(ay, by), Math.max(ay, by), ax];
      if (vx > hx1 && vx < hx2 && hy > vy1 && hy < vy2) { crossings++; hit = true; }
    }
    if (hit) crossingPairs.push(`${segs[i][0]}×${segs[j][0]}`);
  }
  const allLayout = patched.layoutConceptMap(patched.adaptConceptMap(data, { view: 'all', more: true, selection: null }, 'full'));
  return { label, problems: [...new Set(problems)], statesChecked: states(data, view).length,
    nodes: full.nodes.length, relations: full.relations.length, width: layout.width, height: layout.height,
    columns: full.regions.map(r => r.label), longEdges, crossings, crossingPairs,
    coreFirstScreen: { nodes: patched.adaptConceptMap(data, { view, more: false, selection: null }, 'core').nodes.length,
      relations: patched.adaptConceptMap(data, { view, more: false, selection: null }, 'core').relations.length },
    referenceAllViewSize: { width: allLayout.width, height: allLayout.height } };
}
report.E5_basics_view = Object.entries(candidates).map(([id, data]) => basicsChecks(data, id));

// E6: URL/selection behaviour for basics targets. Original engine shows the current fallback problem.
const queries = ['node=bas:tcp', 'term=tcp', 'term=subnet', 'view=all&node=bas:ip-address', 'view=general&rel=BA03', 'view=basics&node=com:public-ip',
  'view=basics&node=aws:vpc', 'view=basics&rel=SH01', 'view=basics&node=bas:subnet&more=1'];
report.E6_navigation = queries.map(query => {
  const row = { query };
  for (const [name, engine] of [['original', original], ['patched', patched]]) {
    const { state, notices } = engine.readMapState(candA, new URLSearchParams(query));
    let visible = null, error = null;
    // The current engine assumes every in-scope endpoint belongs to the view; record a crash instead of stopping.
    try {
      visible = state.selection?.kind === 'node' ? engine.adaptConceptMap(candA, state).nodes.some(n => n.id === state.selection.id)
        : state.selection ? engine.adaptConceptMap(candA, state).relations.some(r => r.id === state.selection.id) : null;
    } catch (e) { error = `${e.name}: ${e.message}`; }
    row[name] = { view: state.view, selection: state.selection, selectionVisible: visible, error, notices,
      roundTrip: JSON.stringify(engine.readMapState(candA, engine.stateParams(state)).state) === JSON.stringify(state) };
  }
  return row;
});
report.E6_changeView = [
  ['com:public-ip', ['all', 'general', 'aws', 'basics']], ['bas:tcp', ['all', 'general', 'aws']], ['com:visitor', ['basics']], ['gen:zone-subnets', ['basics']],
].flatMap(([id, views]) => views.map(view => {
  const r = patched.changeView(candA, { view: 'basics', more: false, selection: { kind: 'node', id } }, view);
  return { from: id, to: view, kept: r.state.selection?.id ?? null, notice: r.notice, counterpart: r.counterpart ?? null };
}));

writeFileSync(`${work}/layout-results.json`, JSON.stringify(report, null, 2) + '\n');
const brief = r => `${r.label}: 상태 ${r.compared} · 좌표/경로 차이 ${r.geometryDiffs.length} · 화면 투영 차이 ${r.projectionDiffs.length} · 선택 강조 차이 ${r.graphDiffs.length}`;
for (const k of Object.keys(report).filter(k => /^E[123]/.test(k))) console.log(brief(report[k]));
console.log('E3 graph diffs:', JSON.stringify(report.E3_candidateA_three_views.graphDiffs.map(d => d.key + ' ' + JSON.stringify(d.after))).slice(0, 900));
console.log('E4', JSON.stringify(report.E4_other_missions));
for (const b of report.E5_basics_view) console.log('E5', JSON.stringify({ ...b, crossingPairs: b.crossingPairs }));
for (const r of report.E6_navigation) console.log('E6', r.query, '| original:', r.original.view, r.original.error ?? r.original.selectionVisible, '| patched:', r.patched.view, r.patched.error ?? r.patched.selectionVisible, r.patched.notices.join(' / '));
for (const r of report.E6_changeView) console.log('E6 changeView', r.from, '→', r.to, 'kept=', r.kept, r.notice ? '| ' + r.notice : '', r.counterpart ? '| counterpart ' + r.counterpart : '');
