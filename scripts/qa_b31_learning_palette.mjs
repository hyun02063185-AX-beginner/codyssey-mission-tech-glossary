import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw new Error('Usage: node scripts/qa_b31_learning_palette.mjs before|after');
const dir = 'reports/b3-1-learning-palette';
await mkdir(dir, { recursive: true });
const browser = await chromium.launch();
const samples = [];
try {
  for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    const page = await browser.newPage({ viewport: { width, height: width > 700 ? 900 : 844 } });
    for (const colorScheme of ['light', 'dark']) {
      await page.goto('about:blank');
      await page.emulateMedia({ colorScheme });
      await page.goto('http://127.0.0.1:4173/#/missions/main-M05/story-map/concepts');
      await page.getByLabel('화면 테마').selectOption(theme);
      await page.evaluate(() => document.fonts.ready);
      await page.getByRole('button', { name: '지도 크게 보기', exact: true }).click();
      await page.getByRole('button', { name: '전체 보기', exact: true }).click();
      for (const state of ['overview', 'firewall']) {
        if (state === 'firewall') {
          await page.getByRole('button', { name: '탐색 도구 펼치기', exact: true }).click();
          await page.getByRole('searchbox').fill('방화벽');
          await page.locator('.cm-search-results').getByRole('button', { name: /^방화벽/ }).click();
        }
        await page.mouse.move(0, 0);
        await page.waitForTimeout(200);
        samples.push(await page.evaluate(({ width, theme, colorScheme, state }) => {
          const css = (selector, property) => {
            const element = document.querySelector(selector);
            return element ? getComputedStyle(element)[property] : null;
          };
          return { width, theme, colorScheme, state,
            canvas: css('.map-canvas-shell', 'backgroundColor'), grid: css('.map-canvas-shell', 'backgroundImage'),
            regions: [...document.querySelectorAll('.map-region rect')].map(element => getComputedStyle(element).fill),
            selectedFill: css('.map-node.is-selected rect', 'fill'), selectedText: css('.map-node.is-selected .map-node-label', 'fill'),
            selectedBorder: css('.map-node.is-selected rect', 'stroke'), panel: css('.cm-detail-body', 'backgroundColor'),
            noOverflow: document.documentElement.scrollWidth <= innerWidth,
          };
        }, { width, theme, colorScheme, state }));
        const capture = phase === 'before' ? width === 1280 : state === 'firewall' ||
          (colorScheme === 'light' && (width === 1280 || theme === 'forest')) || (width === 1280 && theme === 'forest');
        if (capture) await page.screenshot({ path: `${dir}/${width}-${theme}-${colorScheme}-${phase}-${state}.png`, animations: 'disabled' });
      }
    }
    await page.close();
  }
  await writeFile(`${dir}/${phase}.json`, JSON.stringify(samples, null, 2) + '\n');
  console.log(`Recorded ${samples.length} palette states for ${phase}`);
} finally { await browser.close(); }
