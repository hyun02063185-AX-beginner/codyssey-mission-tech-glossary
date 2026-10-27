// 임시 프로토타입 화면 캡처(설계 검증용). 프로토타입은 저장소 밖 git worktree에서만 실행했다.
// 실행: node capture_prototype.mjs <worktree> <base-url> <output-dir>
//   <worktree>/data/mission-story-maps/main-m05/concept-map.json 을 후보 A~D로 바꿔 가며 같은 화면을 찍는다.
import { chromium } from '@playwright/test';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';

const [worktree, base, output] = process.argv.slice(2);
const work = `${worktree}/..`;
const target = `${worktree}/data/mission-story-maps/main-m05/concept-map.json`;
const page = query => `${base}/#/missions/main-M05/story-map/concepts${query ? `?${query}` : ''}`;
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });
const log = [];

async function open(context, query) {
  const tab = await context.newPage();
  const errors = [];
  tab.on('pageerror', error => errors.push(error.message));
  tab.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await tab.goto(page(query));
  await tab.locator('.map-canvas').waitFor();
  await tab.waitForTimeout(400);
  return { tab, errors };
}
async function shot(name, { width = 1280, height = 720, scheme = 'light', query = '', act } = {}) {
  const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme, reducedMotion: 'reduce' });
  const { tab, errors } = await open(context, query);
  if (act) await act(tab);
  await tab.waitForTimeout(300);
  await tab.screenshot({ path: `${output}/${name}.png` });
  const info = await tab.evaluate(() => ({
    view: document.querySelector('.cm-views .is-active')?.textContent,
    nodes: document.querySelectorAll('[data-map-node]').length,
    selected: document.querySelector('.map-node.is-selected')?.getAttribute('data-map-node') ?? null,
    contrast: [...document.querySelectorAll('.map-node.is-contrast')].map(n => n.getAttribute('data-map-node')),
    panel: document.querySelector('#cm-detail-title')?.textContent ?? null,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    hash: location.hash,
  }));
  log.push({ name, width, height, scheme, query, ...info, errors });
  await context.close();
}
const fit = async tab => { await tab.getByRole('button', { name: '전체 보기', exact: true }).click(); };

// 1. 열 배치 후보 비교: 같은 화면 크기, 기초 보기 전체 맞춤
for (const id of ['A', 'B', 'C', 'D']) {
  copyFileSync(`${work}/candidate-${id}.json`, target);
  await new Promise(resolve => setTimeout(resolve, 1500));
  await shot(`variant-${id}-1280-light`, { query: 'view=basics', act: fit });
}
// 2. 권장 후보 D의 강의·모바일·선택·이동 상태
copyFileSync(`${work}/candidate-D.json`, target);
await new Promise(resolve => setTimeout(resolve, 1500));
await shot('D-1920-light-overview', { width: 1920, height: 1080, query: 'view=basics', act: fit });
await shot('D-1920-dark-tcp-selected', { width: 1920, height: 1080, scheme: 'dark', query: 'view=basics&node=bas%3Atcp' });
await shot('D-1280-dark-ip-address-selected', { scheme: 'dark', query: 'view=basics&node=bas%3Aip-address' });
await shot('D-390-light-overview', { width: 390, height: 844, query: 'view=basics' });
await shot('D-390-dark-subnet-panel', { width: 390, height: 844, scheme: 'dark', query: 'view=basics&node=bas%3Asubnet' });
await shot('D-1280-url-fallback-node-bas-tcp', { query: 'node=bas%3Atcp' });
await shot('D-1280-applied-in-to-aws', { query: 'view=basics&node=bas%3Atcp', act: async tab => {
  await tab.locator('.cm-applied button').first().click(); await tab.locator('.map-canvas').waitFor(); } });
await shot('D-1280-search-subnet', { query: '', act: async tab => {
  await tab.locator('.cm-explore-toggle').click(); await tab.locator('#cm-search').fill('서브넷'); } });
await shot('D-1280-all-public-ip-contrast', { query: 'node=com%3Apublic-ip' });
await shot('D-1280-all-unchanged-overview', { query: '', act: fit });

// 원래 데이터로 되돌린다(worktree는 실험 후 제거).
copyFileSync(`${work}/candidate-D.json`, target);
await browser.close();
writeFileSync(`${output}/capture-log.json`, JSON.stringify(log, null, 2) + '\n');
for (const row of log) console.log(row.name, '|', row.view, '| nodes', row.nodes, '| sel', row.selected, '| panel', row.panel, '| contrast', row.contrast.join(','), '| overflowX', row.overflowX, '| errors', row.errors.length, row.hash);
