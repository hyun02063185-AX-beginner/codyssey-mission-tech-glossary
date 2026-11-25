import type { RootContent } from 'mdast';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import guideSource from '../../content/mission-stories/main-m06/lab-guide-v0.3-r1.md?raw';
import mapping from '../../content/mission-stories/main-m06/lab-story-mapping-v0.3-r1.md?raw';
import { screens, screenHref, storyPath } from './content';
import { labPath } from './reviewMode';

const guide = guideSource.replace(/\r\n/g, '\n');
const parser = unified().use(remarkParse).use(remarkGfm);
const labIds = ['01', '02', '03', '04', '05', '06', '07', '08', '09'];
const screenIds = screens.map(screen => screen.id);
const reviewTitles: Record<string, string> = {
  '07': 'API 호출과 오류 해결',
  '08': '실제 AI 응답과 초안 생성',
};
const guideNodes = parser.parse(guide).children;
const references = guideNodes.filter(node => node.type === 'definition').map(node => raw(guide, node)).join('\n');
const grammar = {
  lab: /^## Lab (\d{2})\. (.+)$/,
  roundTrip: /^### (K\d+) · (S\d-\d) ↔ .+$/,
};

function raw(markdown: string, node: { position?: RootContent['position'] }) {
  return markdown.slice(node.position?.start.offset, node.position?.end.offset);
}

function requiredIndex(nodes: RootContent[], predicate: (node: RootContent) => boolean, label: string) {
  const index = nodes.findIndex(predicate);
  if (index < 0) throw new Error(`B3-2 원고에서 ${label}을 찾을 수 없습니다.`);
  return index;
}

const heading = (node: RootContent, prefix: string) =>
  node.type === 'heading' && raw(guide, node).startsWith(prefix);

function md(nodes: RootContent[], subheadings = false) {
  return nodes.flatMap(node => {
    const value = raw(guide, node);
    if (node.type === 'html') {
      const summary = subheadings && value.match(/<summary>(.+)<\/summary>/)?.[1];
      return summary ? [`#### ${summary.replace(/<\/?b>/g, '**')}`] : [];
    }
    return node.type === 'definition' || node.type === 'thematicBreak' ? [] : [value];
  }).join('\n\n');
}

function guideSection(prefix: string, next: string, depth = 2) {
  const start = requiredIndex(guideNodes, node => heading(node, prefix), prefix);
  const body = guideNodes.slice(start + 1);
  const end = body.findIndex(node => node.type === 'heading' && node.depth <= depth && raw(guide, node).startsWith(next));
  return body.slice(0, end < 0 ? undefined : end);
}

function routeLinks(value: string, pattern: RegExp) {
  return [...value.matchAll(pattern)].map(match => match[0]);
}

function tableRows(markdown: string, table: Extract<RootContent, { type: 'table' }>) {
  return table.children.slice(1).map(row => row.children.map(cell => raw(markdown, cell).replace(/^\||\|$/g, '').trim()));
}

const timing = guideSection('### 학습 경로와 시간', '### 근거 표시', 3).find(node => node.type === 'table');
const state = guideSection('## 실습 상태 카드', '## Lab 01').filter(node => node.type === 'table').at(-1);
if (!timing || !state) throw new Error('B3-2 Lab 시간·시작 상태 표가 필요합니다.');

const timingByLab = tableRows(guide, timing);
const stateByLab = tableRows(guide, state);

export const labs = labIds.map((id, index) => {
  const prefix = `## Lab ${id}.`;
  const start = requiredIndex(guideNodes, node => heading(node, prefix), prefix);
  const title = raw(guide, guideNodes[start]).match(grammar.lab)?.[2];
  const nodes = guideSection(prefix, '## ');
  const a = requiredIndex(nodes, node => heading(node, '### A.'), `Lab ${id} A`);
  const b = requiredIndex(nodes, node => heading(node, '### B.'), `Lab ${id} B`);
  const c = requiredIndex(nodes, node => heading(node, '### C.'), `Lab ${id} C`);
  const cleanup = nodes.findIndex(node => heading(node, '### 실습 정리'));
  const core = nodes.slice(a + 1, b);
  const question = requiredIndex(core, node => raw(guide, node).startsWith('**실행 전 질문**'), `Lab ${id} 실행 전 질문`);
  const command = requiredIndex(core, node => raw(guide, node).startsWith('**명령'), `Lab ${id} 명령`);
  const observe = requiredIndex(core, node => raw(guide, node).startsWith('**관찰 목록**'), `Lab ${id} 관찰 목록`);
  const result = requiredIndex(core, node => node.type === 'html' && raw(guide, node).startsWith('<details>'), `Lab ${id} 결과`);
  const end = requiredIndex(core, node => node.type === 'html' && raw(guide, node).startsWith('</details>'), `Lab ${id} 결과 끝`);
  const resultNodes = core.slice(result + 1, end);
  // The ASCII figure and its label are represented by the accessible figure in the web view.
  const resultMarkdown = md(resultNodes.filter((node, i) =>
    !/^\*\*도식 \d{2}/.test(raw(guide, node)) &&
    !(node.type === 'code' && i > 0 && /^\*\*도식 \d{2}/.test(raw(guide, resultNodes[i - 1]))),
  ));
  const checks = md(core.slice(end + 1)).match(/확인 질문: (.+?) → <details><summary>예시 답<\/summary>(.+?)<\/details>/);
  const [intro, cost = ''] = md(nodes.slice(0, a)).split('\n\n');
  const [meta, storyMeta = ''] = intro.split('\n>\n');
  const [timeLabel, minutes, optionalMinutes, calls] = timingByLab[index];
  const [stateId, startState, , key] = stateByLab[index];
  const conditions = core.slice(1, question);
  const terms = routeLinks(storyMeta.split('**관련 용어**')[1]?.split(' · 다루지 않음')[0] ?? '', /`[a-z0-9-]+`/g).map(term => term.slice(1, -1));
  if (!title || stateId !== id || !timeLabel.includes(`#lab-${id}`) || !(a < b && b < c && question < command && command < observe && observe < result && result < end)) {
    throw new Error(`B3-2 Lab ${id} 원고 구성 오류`);
  }
  return {
    id, title: reviewTitles[id] ?? title, meta: meta.replace(/^> ?/gm, ''), cost: cost.replace(/^> ?/gm, ''),
    minutes, optionalMinutes, calls, startState, key, terms,
    purpose: md(core.slice(0, 1)).replace(/^\*\*목적\*\* /, ''), conditions: md(conditions),
    questions: md(core.slice(question, command)), commands: md(core.slice(command, observe)),
    observations: md(core.slice(observe, result)), results: resultMarkdown,
    example: checks ? { question: checks[1], answer: checks[2].replace(/<\/?code>/g, '`') } : undefined,
    optional: md(nodes.slice(b + 1, c), true), troubleshooting: md(nodes.slice(c + 1, cleanup < 0 ? undefined : cleanup), true),
  };
});

export const indexSections = [
  ['실습-안전-수칙', '실습 안전 수칙', md(guideSection('## 실습 안전 수칙', '## 데이터의 여행'))],
  ['데이터의-여행', '데이터의 여행', md(guideSection('## 데이터의 여행', '## 실습 상태 카드'))],
  ['실습-상태-카드', '실습 상태 카드', md(guideSection('## 실습 상태 카드', '## Lab 01'))],
  ['근거-표시', '근거 표시', md(guideSection('### 근거 표시', '## 실습 안전 수칙', 3))],
] as const;

export const labOverview = md(guideSection('## 이 실습을 쓰는 법', '### 학습 경로와 시간', 3));
export const timeSummary = timingByLab.at(-1)?.slice(1, 4) ?? [];
const cleanupNodes = guideSection('### 실습 정리', '## 결과로 찾아보기', 3);
const cleanupOptional = requiredIndex(cleanupNodes, node => raw(guide, node).startsWith('<details>'), '실습 정리 선택');
export const cleanup = md(cleanupNodes.slice(0, cleanupOptional));
export const optionalCleanup = md(cleanupNodes.slice(cleanupOptional + 1));

const indexTable = guideSection('## 결과로 찾아보기', '## ').find(node => node.type === 'table');
if (!indexTable) throw new Error('B3-2 결과 색인이 필요합니다.');
export const resultIndex = tableRows(guide, indexTable).map(([output, meaning, targets, story, glossary]) => ({
  output: targets === '02 A' ? output + ' · `AI API 요청 횟수: 0`' : output,
  meaning,
  targets: [...targets.matchAll(/(?:(\d\d) )?([ABC])/g)].map((match, i, matches) => ({
    lab: match[1] ?? matches[i - 1]?.[1],
    tier: match[2],
  })),
  screens: routeLinks(story, /S\d-\d/g),
  terms: routeLinks(glossary, /`[a-z0-9-]+`/g).map(term => term.slice(1, -1)),
}));

const mappingNodes = parser.parse(mapping).children;
const mappingCards = mappingNodes.flatMap((node, index) => {
  if (node.type !== 'heading') return [];
  const match = raw(mapping, node).match(grammar.roundTrip);
  if (!match) return [];
  const table = mappingNodes[index + 1];
  if (table?.type !== 'table') throw new Error(`B3-2 왕복 카드 ${match[1]}의 표가 필요합니다.`);
  const fields = Object.fromEntries(tableRows(mapping, table));
  const [id, screen] = match.slice(1);
  const related = routeLinks(match[0].split(' — ')[0], /Lab \d{2}/g).map(item => item.slice(-2));
  return [{
    id, screen, labs: related, question: fields['출발 질문'], observe: fields['관찰'],
    focus: fields['다시 볼 그림 부분'], check: fields['확인 질문'], next: fields['다음 순환 (선택)'],
  }];
});

if (mappingCards.map(card => card.id).join() !== Array.from({ length: 11 }, (_, i) => `K${i + 1}`).join()) {
  throw new Error('B3-2 왕복 카드 K1–K11이 필요합니다.');
}

export type RoundTrip = typeof mappingCards[number];

const mainScreens = ['S2-1', 'S2-2', 'S1-2', 'S2-1', 'S3-1', 'S3-2', 'S3-2', 'S4-1', 'S4-2'];
const supplement: Record<string, string> = { 'S3-1:03': 'K2', 'S4-1:09': 'K11', 'S2-2:09': 'K11', 'intro:01': 'K3' };
export const getLab = (id: string | undefined) => labs.find(lab => lab.id === id);
export const mainScreen = (id: string) => mainScreens[labIds.indexOf(id)];
export const tripsFrom = (screen: string) => mappingCards.filter(card => card.screen === screen);
export const tripFor = (screen: string, lab: string) => mappingCards.find(card =>
  (card.screen === screen && card.labs.includes(lab)) || card.id === supplement[`${screen}:${lab}`],
);

export function readLabOrigin(search: string, id: string) {
  const [from, extra] = new URLSearchParams(search.slice(0, 1025)).getAll('from');
  return search.length <= 1024 && from && extra === undefined &&
    (screenIds.includes(from) || (from === 'intro' && id === '01')) && tripFor(from, id) ? from : mainScreen(id);
}

export function readStoryReturn(search: string, screen: string) {
  const [lab, extra] = new URLSearchParams(search.slice(0, 1025)).getAll('from-lab');
  return search.length <= 1024 && lab && extra === undefined && getLab(lab) && tripFor(screen, lab) ? lab : undefined;
}

export function storyFor(screen: string, lab?: string) {
  const path = screen === 'intro' ? storyPath : screenHref(screenIds.indexOf(screen));
  return lab ? `${path}${screen === 'intro' ? '?' : '&'}from-lab=${lab}` : path;
}

export function labHref(id: string, from?: string, hash = '') {
  return `${labPath}/${id}${from ? `?from=${from}` : ''}${hash}`;
}

export function withLabReferences(markdown: string) {
  return `${markdown}\n\n${references}`;
}
