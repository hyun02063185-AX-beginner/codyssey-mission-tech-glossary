// Separate, reproducible fixture; never updates the historical Golden Baseline.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';
const root = process.cwd();
const fixturePath = 'src/missionConceptMap/fixtures/b31-main-2149a66-geometry.json';
const generating = process.argv.includes('--generate');
const ref = '2149a66b9f9ecda0a4d2373d67c8d13b614f52ad';
const read = path => generating ? execFileSync('git', ['show', `${ref}:${path}`], { encoding: 'utf8' }) : readFileSync(path, 'utf8');
const bundled = await build({ stdin: { contents: read('src/missionConceptMap/conceptMapAdapter.ts'), loader: 'ts', resolveDir: `${root}/src/missionConceptMap` }, bundle: true, platform: 'node', format: 'esm', write: false });
const engine = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const data = JSON.parse(read('data/mission-story-maps/main-m05/concept-map.json'));
const ordered = map => [...map].sort(([a], [b]) => a.localeCompare(b));
const geometry = b => ({ width: b.width, height: b.height, positions: ordered(b.positions), layouts: ordered(b.layouts), routes: ordered(b.routes) });
const hash = o => createHash('sha256').update(JSON.stringify(o)).digest('hex');
const expectedEmphasis = generating ? {} : JSON.parse(readFileSync('scripts/b31_network_basics_emphasis.json', 'utf8'));
const fixture = generating ? { sourceCommit: ref, views: {}, states: {} } : JSON.parse(readFileSync(fixturePath, 'utf8'));
const otherMissionChecks = {};
let checked = 0; const differences = [], highlights = [], unexpectedHighlights = [];
for (const view of ['all', 'general', 'aws']) {
  const def = data.views.find(v => v.id === view);
  const selections = [null, ...data.nodes.filter(n => def.nodeDomains.includes(n.domain)).map(n => ({ kind: 'node', id: n.id })), ...data.relations.filter(r => def.relationScopes.includes(r.scope)).map(r => ({ kind: r.path ? 'flow' : 'rel', id: r.id }))];
  for (const selection of selections) for (const more of [false, true]) for (const override of [undefined, 'core', 'full']) {
    const graph = engine.adaptConceptMap(data, { view, more, selection }, override);
    const key = `${view}/${selection ? selection.kind + ':' + selection.id : 'overview'}/${more}/${override ?? 'auto'}`;
    const projection = hash(geometry(engine.layoutConceptMap(graph)));
    const graphHash = hash({ nodes: graph.nodes.map(n => n.id), relations: graph.relations.map(r => r.id), edges: graph.edges.map(e => [e.id, e.from, e.to, e.step ?? null, e.omitted ?? null]), highlightedEdges: [...graph.highlightedEdges].sort(), highlightedNodes: [...graph.highlightedNodes].sort(), contrastIds: [...graph.contrastIds].sort(), temporary: graph.temporary.map(n => n.id), flows: graph.flows.map(f => f.id) });
    if (generating) { fixture.views[view] = geometry(graph.layoutBasis); fixture.states[key] = { projection, graph: graphHash }; }
    else {
      if (hash(fixture.views[view]) !== hash(geometry(graph.layoutBasis)) || fixture.states[key]?.projection !== projection) differences.push(key);
      if (fixture.states[key]?.graph !== graphHash) {
        highlights.push(key);
        if (expectedEmphasis[key] !== graphHash) unexpectedHighlights.push(key);
      }
    }
    checked++;
  }
}
// The two other mission adapters reuse this engine for geometry only.
function geometryData(id, nodes, relations, areas, orderOf) {
  return { mapId:id, nodes:nodes.map((n,i)=>({...n, region:n.area, order:orderOf(n,i), domain:'common', importance:'core'})),
    relations:relations.map(r=>({...r, type:'연관', scope:'geometry', importance:'core'})),
    regions:areas.map((a,order)=>({...a, domain:'common', order})),
    views:[{id:'all', nodeDomains:['common'], relationScopes:['geometry'], initialImportance:['core']}], contrasts:[] };
}
const b61 = JSON.parse(read('src/b61ConceptMap/data.json'));
const b21 = JSON.parse(read('drafts/b2-1-story-map/scene-08/candidate-map.json'));
const b61Order = ['erd','relationship','fk','pk','table','row','column','database','dbms','sql','join'];
if (generating) fixture.otherMissions = {};
for (const [name, mission] of [['B6-1',geometryData('b61-geometry',b61.nodes,b61.relations,b61.areas,n=>b61Order.indexOf(n.id))],
  ['B2-1',geometryData('b21-private-geometry',b21.nodes,b21.relations.map(r=>({id:r.id,from:r.from,to:r.to})),b21.areas,(n,i)=>i)]]) {
  const graph = engine.adaptConceptMap(mission,{view:'all',more:true,selection:null});
  const value = { basis:geometry(graph.layoutBasis), projection:geometry(engine.layoutConceptMap(graph)) };
  if (generating) fixture.otherMissions[name] = value;
  else { otherMissionChecks[name] = hash(value) === hash(fixture.otherMissions[name]); if (!otherMissionChecks[name]) differences.push(name); }
}
if (generating) { writeFileSync(fixturePath, JSON.stringify(fixture, null, 2) + '\n'); console.log(`Generated from main ${ref}: ${checked} states`); }
else {
  // CB01 intentionally reveals the comparison counterpart in all/AWS, in six visibility modes.
  const unexpected = unexpectedHighlights;
  console.log(JSON.stringify({ sourceCommit: ref, checked, viewGeometrySha256: Object.fromEntries(Object.entries(fixture.views).map(([id, value]) => [id, hash(value)])), otherMissionChecks, geometryDifferences: differences, highlightChanges: highlights, unexpectedHighlightChanges: unexpected }, null, 2));
  if (differences.length || unexpected.length) process.exitCode = 1;
}
