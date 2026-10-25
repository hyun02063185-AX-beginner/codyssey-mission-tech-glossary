// Read-only approval check. There is deliberately no --write/refresh mode.
// Paths resolve from this file (not cwd); only CRLF is normalized to LF for Git checkouts.
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { runInNewContext } from 'node:vm';
import { isDeepStrictEqual } from 'node:util';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

const root = fileURLToPath(new URL('../', import.meta.url));
const contentPath = 'src/b21StoryV3/content/';
const sceneIds = ['01', '02', '03', '04', '05', '06', '07', '08'];
const counts = [13, 17, 12, 14, 22, 18, 15, 17];
const relationIds = ['R09', 'R23', 'R28', 'R37', 'R41'];
const comparisonIds = ['C13', 'C30'];
// QA v3.8 §6.1: existence only. These IDs are intentionally absent from runtime content.
export const glossaryCandidates = [
  'cli', 'module', 'repository-pattern', 'layered-architecture', 'crud', 'summary-aggregation',
  'persistence', 'file-io', 'json-lines', 'csv', 'iterator', 'generator', 'yield', 'decorator',
  'function', 'exception-handling', 'type-hint', 'input-validation',
];
export const sha256 = text => createHash('sha256').update(text.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
const fail = (ok, message) => { if (!ok) throw Error(`B21 v3: ${message}`); };
const equal = (a, b, message) => fail(isDeepStrictEqual(a, b), message);
const textOf = node => node.value ?? (node.children ?? []).map(textOf).join('');
const parser = unified().use(remarkParse).use(remarkGfm);
// Keep punctuation, underscores, case and words; normalize only markup and whitespace.
export const normalize = text => textOf(ast(text)).replace(/\s+/g, ' ').trim();
// Reuse immutable parses across source/sentence checks and mutation tests.
const parseCache = new Map();
function ast(markdown) {
  const lf = markdown.replace(/\r\n/g, '\n');
  if (!parseCache.has(lf)) {
    if (parseCache.size >= 256) parseCache.clear();
    parseCache.set(lf, parser.parse(lf));
  }
  return parseCache.get(lf);
}
const rowsOf = table => table.children.map(row => row.children.map(textOf));
function section(markdown, title) {
  const nodes = ast(markdown).children;
  const start = nodes.findIndex(n => n.type === 'heading' && title.test(textOf(n)));
  fail(start >= 0, `missing manuscript section: ${title}`);
  const end = nodes.findIndex((n, i) => i > start && n.type === 'heading' && n.depth <= nodes[start].depth);
  return nodes.slice(start + 1, end < 0 ? undefined : end);
}
export function manuscriptSteps(markdown) {
  const table = section(markdown, /단계별 강의 진행/).find(n => n.type === 'table');
  fail(table, 'missing manuscript step table');
  const rows = rowsOf(table), header = rows.shift();
  const sentenceIndex = header.indexOf('화면 한 문장'), addressIndex = header.indexOf('주소');
  fail(sentenceIndex >= 0, 'missing sentence column');
  const steps = rows.filter(row => /^\d+$/.test(row[0])).map(row => ({
    number: Number(row[0]), say: row[sentenceIndex],
    ...(addressIndex < 0 ? {} : { id: row[addressIndex].replace(/^#\d-/, '') }),
  }));
  equal(steps.map(s => s.number), steps.map((_, i) => i + 1), 'manuscript step order/duplicates');
  return steps;
}
/** Expand only the explicit approved v3.6 ranges/lists; never infer by current order. */
export function legacyFromManuscript(markdown, scene) {
  const table = section(markdown, /v3\.6 → v3\.7 단계 대응/).find(n => n.type === 'table');
  fail(table, `${scene}: missing legacy table`);
  const result = [];
  for (const row of rowsOf(table).slice(1)) {
    const addresses = [...row[0].matchAll(new RegExp(`#${Number(scene)}-(\\d+)`, 'g'))].map(m => Number(m[1]));
    if (!addresses.length) continue;
    const old = row[0].includes('~') ? Array.from({ length: addresses[1] - addresses[0] + 1 }, (_, i) => addresses[0] + i) : addresses;
    const targets = [...row[2].matchAll(new RegExp(`#${Number(scene)}-([a-z][a-z0-9]*)`, 'g'))].map(m => m[1]);
    fail(targets.length === old.length || targets.length === 1, `${scene}: ambiguous legacy row`);
    old.forEach((number, i) => {
      fail(result[number - 1] === undefined, `${scene}: duplicate legacy address ${number}`);
      result[number - 1] = targets.length === 1 ? targets[0] : targets[i];
    });
  }
  fail(Array.from(result).every(Boolean), `${scene}: missing legacy address`);
  return result;
}
export function readApprovedPreview(html) {
  // Execute only the pinned, repository-owned data/figure declarations. No DOM,
  // navigation, filesystem, process or network globals enter this isolated context.
  const script = html.split('<script>')[1]?.split('/* ---------------- 상태')[0];
  fail(script?.includes('const SCENES='), 'approved preview declarations missing');
  return JSON.parse(runInNewContext(script + ';JSON.stringify({scenes:SCENES,areas:AREAS8,relationTypes:TYPES8,relationReviews:REL8_REVIEW,comparisonReviews:CMP8_REVIEW,tasks:TASKS8,map:MAP8_SRC})', {}, { timeout: 1000 }));
}
export function readValidationInputs(repoRoot = root) {
  const read = path => readFileSync(resolve(repoRoot, path), 'utf8');
  const integrity = JSON.parse(read(contentPath + 'integrity.json'));
  const graph = JSON.parse(read('src/data/generated/encyclopedia-graph.json'));
  return {
    integrity,
    manuscripts: Object.fromEntries(sceneIds.map(id => [id, read(`drafts/b2-1-story-map/v3/scene-${id}/storyboard.md`)])),
    previewText: read('drafts/b2-1-story-map/v3/teaching-preview/index.html'),
    mapText: read('drafts/b2-1-story-map/scene-08/candidate-map.json'),
    termFiles: glossaryCandidates.filter(id => existsSync(resolve(repoRoot, `content/terms/${id}.md`))),
    graphTermIds: Object.keys(graph.nodes),
  };
}
const addressOf = value => {
  const [scene, ...step] = value.split('-');
  return { scene: scene.padStart(2, '0'), step: step.join('-') };
};
const reviewLinks = value => Object.fromEntries(Object.entries(value).map(([id, links]) => [id, links.map(([hash, label]) => ({ label, target: addressOf(hash) }))]));

function checkSentences(scene, markdown) {
  const rows = manuscriptSteps(markdown);
  // 01/02 predate step tables for closing questions/summary. 02 F3 was
  // expanded into three screens in the approved v3.3 preview, retained in v3.7.
  const expectedRows = scene.id === '01' ? 10 : scene.id === '02' ? 13 : scene.steps.length;
  equal(rows.length, expectedRows, `${scene.id}: manuscript step count`);
  for (const [i, step] of scene.steps.entries()) {
    const n = i + 1, key = `${scene.id}-${n}`, say = normalize(step.say);
    if (key === '01-11' || key === '02-16') {
      equal(say, '설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.', `${key}: approved check instruction`);
    } else if (key === '02-8' || key === '02-9') {
      const storage = n === 8;
      equal(say, storage ? '파일 형식을 바꾸고 싶다면, 기록을 읽고 저장하는 Repository부터 살펴봅니다.' : '목록을 표 모양으로 보여 주고 싶다면, 결과를 보여 주는 CLI부터 살펴봅니다.', `${key}: approved F3 combined sentence`);
      const table = ast(markdown).children.find(node => node.type === 'table' && rowsOf(node)[0][0] === '바꾸고 싶은 것');
      const row = rowsOf(table)[storage ? 1 : 2];
      fail(row[0].includes(storage ? '저장하는 파일 형식' : '목록을 표 모양') && row[1].includes(storage ? 'Repository' : 'CLI'), `${key}: F3 source row`);
    } else if ((scene.id === '01' && n >= 12) || (scene.id === '02' && n === 17)) {
      fail(normalize(markdown).includes(say), `${key}: closing sentence missing from manuscript`);
    } else {
      const number = scene.id === '02' && n >= 10 ? n - 2 : n;
      const row = rows[number - 1];
      equal(say, normalize(row.say), `${key}: manuscript sentence mismatch`);
      if (row.id) equal(step.id, row.id, `${key}: manuscript semantic ID/order`);
    }
  }
}

export function validateContent(input) {
  const { scenes, mapData, integrity, manuscripts, previewText, mapText, termFiles, graphTermIds } = input;
  equal(integrity.schemaVersion, 1, 'integrity schema');
  equal(scenes.map(s => s.id), sceneIds, 'scene count/order/duplicate ID');
  equal(integrity.scenes.map(s => s.id), sceneIds, 'integrity scene order');
  equal(scenes.map(s => s.steps.length), counts, 'step count (8 scenes / 128 steps)');
  for (const [i, scene] of scenes.entries()) {
    equal(scene.steps.map(s => s.id), integrity.scenes[i].stepIds, `${scene.id}: missing/duplicate step ID or order`);
    equal(new Set(scene.steps.map(s => s.id)).size, scene.steps.length, `${scene.id}: duplicate step ID`);
  }
  equal(sha256(previewText), integrity.preview.sha256, 'approved preview SHA-256 changed; do not auto-refresh');
  equal(sha256(mapText), integrity.candidateMap.sha256, 'candidate map SHA-256 changed; do not auto-refresh');
  const preview = readApprovedPreview(previewText);
  const validAddress = address => {
    const scene = scenes.find(s => s.id === address.scene);
    return !!scene && (scene.addressing === 'id' ? scene.steps.some(s => s.id === address.step) : /^[1-9]\d*$/.test(address.step) && Number(address.step) <= scene.steps.length);
  };
  const figureParams = ['mode', 'sub', 'home', 'hl', 'sel', 'opt', 'sit', 'op', 'sr', 'st', 'kind', 'rel', 'cmp'];
  for (const [i, scene] of scenes.entries()) {
    const pin = integrity.scenes[i], approved = preview.scenes[i], md = manuscripts[scene.id];
    const path = `drafts/b2-1-story-map/v3/scene-${scene.id}/storyboard.md`;
    equal(pin.path, path, `${scene.id}: pinned path`);
    equal(sha256(md), pin.sha256, `${scene.id}: manuscript SHA-256 changed; approval required, do not auto-refresh`);
    equal(scene.source, { storyboard: path, sha256: pin.sha256 }, `${scene.id}: source provenance`);
    equal(scene.title, md.split(/\r?\n/)[0].split(' — ')[1], `${scene.id}: title`);
    equal(scene.question, approved.q, `${scene.id}: question`);
    fail(normalize(md).includes(scene.question), `${scene.id}: manuscript question`);
    equal(scene.ctx, approved.ctx, `${scene.id}: context`);
    equal(scene.tag, approved.tag, `${scene.id}: example label`);
    equal(scene.addressing, ['05', '06'].includes(scene.id) ? 'id' : 'number', `${scene.id}: addressing`);
    equal(scene.home, approved.home, `${scene.id}: home`);
    equal(scene.legacy, approved.legacy, `${scene.id}: approved legacy mapping`);
    if (scene.legacy) {
      equal(scene.legacy, legacyFromManuscript(md, scene.id), `${scene.id}: manuscript legacy mapping`);
      equal(scene.legacy.length, scene.id === '05' ? 16 : 13, `${scene.id}: legacy count`);
      fail(scene.legacy.every(id => scene.steps.some(s => s.id === id)), `${scene.id}: missing legacy target`);
    }
    equal(scene.steps.length, pin.stepCount, `${scene.id}: pinned step count`);
    equal(scene.steps.map(s => s.id), pin.stepIds, `${scene.id}: missing/duplicate step ID or order`);
    equal(new Set(scene.steps.map(s => s.id)).size, scene.steps.length, `${scene.id}: duplicate step ID`);
    fail(scene.steps.some(s => s.id === scene.home), `${scene.id}: unknown scene home`);
    equal(scene.instructor, { notes: approved.notes, deep: approved.deep }, `${scene.id}: instructor notes/deep missing or changed`);
    fail(!('terms' in scene) && !('guideChapter' in scene), `${scene.id}: U4 links not authorized`);
    checkSentences(scene, md);
    for (const [j, step] of scene.steps.entries()) {
      const original = approved.steps[j], key = `${scene.id}-${step.id}`;
      equal(step.id, original.id, `${key}: approved ID/order`);
      equal(step.title, original.t, `${key}: title`);
      equal(step.figure, original.fig, `${key}: figure kind`);
      equal(step.say, original.say, `${key}: approved sentence`);
      for (const param of figureParams) equal(step[param], original[param], `${key}: figure state ${param}`);
      const real = original.mode === 'ledger' || !!original.real;
      equal(!!step.real, real, `${key}: real/fictional example`);
      const example = real ? 'ledger' : scene.id === '08' ? 'review' : ['01', '02'].includes(scene.id) ? 'fictional-todo' : ['03', '04'].includes(scene.id) || scene.id === '05' && ['gen', 'keep', 'jsonl'].includes(original.mode) ? 'fictional-records' : 'concept';
      equal(step.example, example, `${key}: example classification missing/changed`);
      equal(step.instructor?.script, original.script, `${key}: instructor script missing/changed`);
      equal(step.questions, original.qs?.map(({ k, q }) => ({ kind: k, q })), `${key}: check questions missing/changed`);
      equal(step.instructor?.expected, original.qs?.map(({ k, ...q }) => q), `${key}: expected answer/misconception missing/changed`);
      equal(step.reveal, original.qs ? { answers: original.qs.map(q => q.a) } : undefined, `${key}: reveal answers missing/changed`);
      if (original.qs) fail(step.questions.length > 0 && step.questions.every(q => q.q.trim()) && step.reveal.answers.every(a => a.trim()), `${key}: empty question/answer`);
      if (step.home) fail(scene.steps.some(s => s.id === step.home), `${key}: unknown step home`);
      const next = original.next ? { question: original.next, target: { scene: sceneIds[i + 1], step: scenes[i + 1].addressing === 'id' ? scenes[i + 1].steps[0].id : '1' } } : undefined;
      equal(step.next, next, `${key}: next-scene destination`);
      if (step.next) fail(validAddress(step.next.target), `${key}: invalid next-scene target`);
      let reviews;
      if (scene.id === '08') {
        if (original.mode === 'areas' && original.sel !== null) reviews = [addressOf(preview.areas[original.sel].review)];
        if (original.mode === 'rel') reviews = preview.relationReviews[original.rel].map(([hash]) => addressOf(hash));
        if (original.mode === 'cmp') reviews = preview.comparisonReviews[original.cmp].map(([hash]) => addressOf(hash));
        if (original.mode === 'wrap') reviews = preview.areas.map(a => addressOf(a.review));
      }
      equal(step.review, reviews, `${key}: review destinations`);
      fail((step.review ?? []).every(validAddress), `${key}: invalid review target`);
      fail(!('terms' in step) && !('termId' in step), `${key}: U4 term links not authorized`);
    }
  }
  checkMap(mapData, JSON.parse(mapText), preview, manuscripts['08'], validAddress);
  equal(termFiles, glossaryCandidates, '18 glossary Markdown files must exist');
  for (const id of glossaryCandidates) fail(graphTermIds.includes(`term:${id}`), `missing glossary graph ID: ${id}`);
  return { scenes: 8, steps: 128, directSentences: 124, approvedSentenceAdaptations: 4, legacy: [16, 13], relations: 5, comparisons: 2, lectureAreas: 7, glossaryCandidates: 18 };
}

function checkMap(data, source, preview, markdown, validAddress) {
  equal([source.areas.length, source.nodes.length, source.relations.length, source.comparisons.length], [7, 45, 24, 10], 'candidate map counts');
  const map = data.lectureMap;
  equal(map.source, 'drafts/b2-1-story-map/scene-08/candidate-map.json', 'map source path');
  equal(Object.keys(map.relations), relationIds, 'only five lecture relations');
  equal(Object.keys(map.comparisons), comparisonIds, 'only two lecture comparisons');
  const select = (list, id, fields) => {
    const item = list.find(x => x.id === id);
    fail(item, `unknown original ID: ${id}`);
    return Object.fromEntries(fields.map(field => [field, item[field]]));
  };
  for (const id of relationIds) equal(map.relations[id], select(source.relations, id, ['from', 'to', 'type', 'label', 'scope']), `${id}: original relation meaning/wording`);
  for (const id of comparisonIds) equal(map.comparisons[id], select(source.comparisons, id, ['left', 'right', 'leftText', 'rightText']), `${id}: original comparison wording`);
  const endpoints = [...new Set([...Object.values(map.relations).flatMap(r => [r.from, r.to]), ...Object.values(map.comparisons).flatMap(c => [c.left, c.right])])];
  equal(Object.keys(map.nodes), endpoints, 'map projects only relation/comparison endpoints');
  for (const id of endpoints) equal(map.nodes[id], select(source.nodes, id, ['label', 'area', 'easy']), `${id}: original node wording`);
  equal(map.areas, Object.fromEntries(source.areas.map(({ id, label }) => [id, label])), 'original area labels');
  equal(map, preview.map, 'projection equals approved MAP8_SRC');
  equal(data.lectureAreas.length, 7, 'seven lecture areas');
  const table = section(markdown, /기존 개념지도와 v3\.6 강의 영역 대응표/).find(n => n.type === 'table');
  const rows = rowsOf(table).slice(1);
  const codeIds = text => [...text.matchAll(/\b(?:area-[a-z]+|[a-z][a-z-]*)\b/g)].map(m => m[0]);
  for (const [i, area] of data.lectureAreas.entries()) {
    const approved = preview.areas[i], row = rows[i];
    equal({ id: area.id, n: area.scene, name: area.name, say: area.say, keys: area.concepts, review: `${Number(area.review.scene)}-${area.review.step}`, src: area.originalAreaIds, nodes: area.originalNodeIds }, approved, `${area.id}: approved lecture area`);
    equal(area.name, row[0], `${area.id}: manuscript area name`);
    equal(area.scene, row[1], `${area.id}: manuscript scene`);
    equal([...area.originalAreaIds].sort(), codeIds(row[2]).filter(id => id.startsWith('area-')).sort(), `${area.id}: original area mapping`);
    // The table names argparse in area-execution's column for area 07.
    const nodeIds = codeIds(row[3]);
    if (area.scene === '07') nodeIds.push('argparse');
    equal([...area.originalNodeIds, ...area.originalDeepNodeIds].sort(), nodeIds.sort(), `${area.id}: manuscript node mapping (including optional depth)`);
    fail(validAddress(area.review), `${area.id}: review address`);
    for (const id of [...area.originalNodeIds, ...area.originalDeepNodeIds]) {
      const node = source.nodes.find(n => n.id === id);
      fail(node && area.originalAreaIds.includes(node.area), `${area.id}: original node/area membership ${id}`);
    }
  }
  equal(data.relationTypes, preview.relationTypes.map(({ t, mean, rel, rel2 }) => ({ type: t, meaning: mean, relations: rel2 ? [rel, rel2] : [rel] })), 'relation type cards');
  equal(data.relationReviews, reviewLinks(preview.relationReviews), 'relation review labels/targets');
  equal(data.comparisonReviews, reviewLinks(preview.comparisonReviews), 'comparison review labels/targets');
  equal(data.lectureTasks, preview.tasks.map(([q, areaId]) => ({ q, areaId })), 'application task examples');
  // Original v2 sceneIds remain in the untouched source and are never projected.
  fail(!JSON.stringify(map).includes('sceneIds'), 'v2 sceneIds must not become v3 destinations');
}

export function assertReadOnlyArguments(args) {
  fail(args.length === 0, 'unsupported arguments; no approval-hash update mode');
}
export async function main() {
  assertReadOnlyArguments(process.argv.slice(2));
  const { createServer } = await import('vite');
  const server = await createServer({ root, configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, logLevel: 'error' });
  try {
    const content = await server.ssrLoadModule('/src/b21StoryV3/content/index.ts');
    const report = validateContent({ ...readValidationInputs(), scenes: content.scenes, mapData: content });
    console.log('PASS B21 v3 content:', JSON.stringify(report));
  } finally { await server.close(); }
}
if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
