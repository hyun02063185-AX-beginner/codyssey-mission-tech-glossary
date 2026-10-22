import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa_b31_edge_lanes.mjs before|after');
const dir = 'reports/b3-1-edge-lanes';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const metrics = [];
try {
  for (const [width, height] of [[1280, 900], [1000, 900], [390, 844], [360, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    for (const [state, query] of [['overview', ''], ['firewall', '?node=gen:firewall'], ['aws-flow', '?view=aws&flow=AF01']]) {
      await page.goto('about:blank');
      await page.goto(`http://127.0.0.1:4173/#/missions/main-M05/story-map/concepts${query}`);
      await page.locator('[data-map-node]').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('button', { name: '지도 크게 보기', exact: true }).click();
      if (state === 'overview') await page.getByRole('button', { name: '전체 보기', exact: true }).click();
      if (state === 'firewall') await page.locator('.map-detail-panel').evaluate(panel => {
        (panel.querySelector('.cm-detail-body') ?? panel).scrollTop = 180;
      });
      await page.waitForTimeout(250);
      metrics.push(await page.evaluate(({ width, state }) => {
        const panel = document.querySelector('.map-detail-panel');
        const body = document.querySelector('.cm-detail-body') ?? panel;
        const header = document.querySelector('.map-detail-panel-header');
        return { width, state, noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
          panelScroll: panel?.scrollTop, bodyScroll: body?.scrollTop,
          headerTop: header?.getBoundingClientRect().top, bodyTop: body?.getBoundingClientRect().top,
          headerBottom: header?.getBoundingClientRect().bottom,
          headerBackground: header && getComputedStyle(header).backgroundColor,
          viewBox: document.querySelector('.map-canvas').getAttribute('viewBox') };
      }, { width, state }));
      await page.screenshot({ path: `${dir}/${width}-${phase}-${state}.png`, animations: 'disabled' });
    }
    await page.close();
  }
  await writeFile(`${dir}/${phase}.json`, JSON.stringify(metrics, null, 2) + '\n');
  console.log(`Saved ${metrics.length} ${phase} captures`);
} finally { await browser.close(); }
