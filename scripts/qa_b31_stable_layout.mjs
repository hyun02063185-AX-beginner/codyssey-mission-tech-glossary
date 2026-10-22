import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa_b31_stable_layout.mjs before|after');
const dir = 'reports/b3-1-stable-layout';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1280, 1000, 390, 360]) for (const colorScheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height: width > 700 ? 900 : 844 }, colorScheme });
    await page.goto('http://127.0.0.1:4173/#/missions/main-M05/story-map/concepts');
    await page.locator('[data-map-node]').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.getByRole('button', { name: '지도 크게 보기', exact: true }).click();
    const samples = [];
    async function record(state) {
      samples.push(await page.evaluate(state => ({ state,
        positions: Object.fromEntries([...document.querySelectorAll('[data-map-node]')].map(node => {
          const matrix = node.transform.baseVal.consolidate().matrix;
          return [node.dataset.mapNode, { x: matrix.e, y: matrix.f, core: node.classList.contains('core') }];
        })),
        routes: Object.fromEntries([...document.querySelectorAll('.cm-edge-group')].map(edge =>
          [`${edge.dataset.relation}:${edge.dataset.step ?? ''}`, edge.querySelector('.map-edge').getAttribute('d')])),
        overflow: document.documentElement.scrollWidth > innerWidth,
      }), state));
    }
    await record('entry');
    for (const [id, label] of [['gen:border-router', '경계 라우터'], ['gen:firewall', '방화벽'], ['gen:dmz', 'DMZ'], ['gen:public-web-server', '공개 웹 서버'], ['gen:switch', '스위치']]) {
      await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
      await page.getByRole('searchbox').fill(label);
      await page.locator('.cm-search-results').getByRole('button', { name: new RegExp(`^${label}`) }).click();
      await page.locator(`[data-map-node="${id}"].is-selected`).waitFor();
      await record(id);
      if ((colorScheme === 'light' && ['gen:border-router', 'gen:firewall', 'gen:dmz'].includes(id)) ||
          (colorScheme === 'dark' && id === 'gen:firewall')) {
        await page.mouse.move(0, 0);
        await page.waitForTimeout(200);
        await page.screenshot({ path: `${dir}/${width}-${colorScheme}-${phase}-${id.split(':')[1]}.png`, animations: 'disabled' });
        if (phase === 'after' && width === 1280 && colorScheme === 'light') {
          await page.getByRole('button', { name: '상세 패널 닫기' }).click();
          await page.getByRole('button', { name: '전체 보기', exact: true }).click();
          await page.waitForTimeout(100);
          await page.screenshot({ path: `${dir}/1280-after-${id.split(':')[1]}-overview.png`, animations: 'disabled' });
          await page.getByRole('button', { name: /설명 다시 열기/ }).click();
        }
      }
    }
    await page.locator('.cm-detail-body').getByRole('button', { name: '선택 해제', exact: true }).click();
    await record('clear');
    const seenNodes = new Map(), seenRoutes = new Map();
    let maxNodeDelta = 0, maxCoreNodeDelta = 0, changedRoutes = 0;
    for (const sample of samples) {
      for (const [id, p] of Object.entries(sample.positions)) {
        if (seenNodes.has(id)) {
          const before = seenNodes.get(id);
          maxNodeDelta = Math.max(maxNodeDelta, Math.abs(before.x - p.x), Math.abs(before.y - p.y));
          if (p.core) maxCoreNodeDelta = Math.max(maxCoreNodeDelta, Math.abs(before.x - p.x), Math.abs(before.y - p.y));
        } else seenNodes.set(id, p);
      }
      for (const [id, path] of Object.entries(sample.routes)) {
        if (seenRoutes.has(id) && seenRoutes.get(id) !== path) changedRoutes++;
        else if (!seenRoutes.has(id)) seenRoutes.set(id, path);
      }
    }
    results.push({ width, colorScheme, maxNodeDelta, maxCoreNodeDelta, changedRoutes, samples });
    await page.close();
  }
  await writeFile(`${dir}/${phase}.json`, JSON.stringify(results, null, 2) + '\n');
  console.log(JSON.stringify(results.map(({ samples, ...summary }) => summary), null, 2));
} finally { await browser.close(); }
