import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa_b31_map_layout.mjs before|after [baseURL]');
const baseURL = process.argv[3] ?? 'http://127.0.0.1:4174';
const dir = 'reports/b3-1-map-first';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const metrics = [];
try {
  for (const [width, height] of [[1280, 900], [1000, 900], [390, 844], [360, 844]]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(`${baseURL}/#/missions/main-M05/story-map/concepts`);
    await page.locator('[data-map-node]').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    // Wait for actual ResizeObserver/camera settlement, not just the route shell.
    let last;
    for (let attempt = 0; attempt < 20; attempt++) {
      const value = await page.locator('.map-canvas').getAttribute('viewBox');
      if (last === value) break;
      last = value;
      await page.waitForTimeout(80);
    }
    metrics.push(await page.evaluate(() => {
      const rect = selector => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const r = element.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      };
      const svg = document.querySelector('.map-canvas');
      const canvas = rect('.map-canvas');
      return {
        viewport: { width: innerWidth, height: innerHeight }, pageHeight: document.documentElement.scrollHeight,
        header: rect('#root>header'), intro: rect('.map-intro'), toolbar: rect('.cm-toolbar'),
        canvas, shell: rect('.map-canvas-shell'), belowMap: rect('.cm-under-map'), legend: rect('.cm-legend'),
        canvasRatio: canvas.height / innerHeight, mapStart: canvas.y,
        labelPixels: 16 * canvas.width / svg.viewBox.baseVal.width,
        rootOverflow: getComputedStyle(document.getElementById('root')).overflow,
        rootHeight: getComputedStyle(document.getElementById('root')).height,
        noHorizontalOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      };
    }));
    await page.screenshot({ path: `${dir}/${width}-${phase}.png`, animations: 'disabled' });
    await page.screenshot({ path: `${dir}/${width}-${phase}-full.png`, fullPage: true, animations: 'disabled' });
    await page.close();
  }
  await writeFile(`${dir}/${phase}.json`, JSON.stringify(metrics, null, 2) + '\n');
  console.log(JSON.stringify(metrics.map(m => ({ width: m.viewport.width, viewportHeight: m.viewport.height, pageHeight: m.pageHeight, toolbar: m.toolbar.height, canvas: m.canvas.height, ratio: m.canvasRatio, mapStart: m.mapStart, labelPixels: m.labelPixels })), null, 2));
} finally { await browser.close(); }
