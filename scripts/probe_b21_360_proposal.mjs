// Approval preview only: applies candidate CSS to browser memory, never to source.
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'node_modules/.cache/b21-u3-c');
await mkdir(output, { recursive: true });
const analysis = JSON.parse(await readFile(resolve(output, 'analysis.json'), 'utf8'));
const htmlURL = new URL('../drafts/b2-1-story-map/v3/teaching-preview/index.html', import.meta.url).href;
const sourceSha256 = createHash('sha256').update((await readFile(fileURLToPath(htmlURL), 'utf8')).replace(/\r\n/g, '\n')).digest('hex');
if (analysis.sourceSha256 && sourceSha256 !== analysis.sourceSha256) throw Error('Source changed since analysis; rerun diagnostics');
const proposal = '@media (max-width:360px){.mf>.pane{min-width:0}}';
const css = await readFile(resolve(root, 'src/b21StoryV3/b21StoryV3.css'), 'utf8');
const parityAdjustment = '/* U2 intentional mobile changes:' + css.split('/* U2 intentional mobile changes:')[1];
const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const page = await context.newPage();
const report = { browser: browser.version(), sourceSha256, proposal, experiments: [], comparisons: [], scan: [] };

async function open(hash) {
  await page.goto(htmlURL + '#' + hash); await page.reload();
  await page.evaluate(() => document.fonts.ready);
}
async function metrics() {
  return page.evaluate(() => {
    const elements = [...document.querySelectorAll('.mf,.pane,.pane .rec,.pane .rec .mm,.pane .rec .am')];
    const describe = el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      const range = document.createRange(); range.selectNodeContents(el);
      return { className: el.className, text: el.textContent, x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, grid: s.gridTemplateColumns, minWidth: s.minWidth, font: s.font, whiteSpace: s.whiteSpace, textRects: [...range.getClientRects()].map(r => ({ x: r.x, y: r.y, width: r.width, height: r.height, right: r.right })) };
    };
    const overlap = [...document.querySelectorAll('.pane .rec')].filter(row => {
      const a = row.querySelector('.mm')?.getBoundingClientRect(), b = row.querySelector('.am')?.getBoundingClientRect();
      return a && b && a.right > b.left;
    }).map(row => row.textContent);
    // Visible overflow into a card's own padding is distinct from clipped glyphs.
    // Record both: do not hide or omit the existing small row-internal overflow.
    const internalOverflow = elements.filter(el => el.scrollWidth > el.clientWidth).map(el => ({ className: el.className, text: el.textContent, width: el.clientWidth, scroll: el.scrollWidth, overflowX: getComputedStyle(el).overflowX }));
    const textOutsidePane = [...document.querySelectorAll('.pane .rec .no,.pane .rec .mm,.pane .rec .am')].filter(el => {
      const card = el.closest('.pane'), bounds = card.getBoundingClientRect(), s = getComputedStyle(card);
      const range = document.createRange(); range.selectNodeContents(el);
      return [...range.getClientRects()].some(r => r.left < bounds.left + parseFloat(s.borderLeftWidth) || r.right > bounds.right - parseFloat(s.borderRightWidth));
    }).map(el => el.textContent);
    return { documentWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight, overlap, internalOverflow, textOutsidePane, elements: elements.map(describe) };
  });
}
try {
  const variants = [
    { name: 'original', css: '' },
    { name: 'min-width-proposal', css: proposal },
    { name: 'wrap-memo-alternative', css: '@media(max-width:360px){.mf .rec .mm{white-space:normal}}' },
    { name: 'sans-Arial', css: ':root{--sans:Arial,sans-serif}' },
    { name: 'mono-D2Coding', css: ':root{--mono:D2Coding,monospace}' },
    { name: 'mono-Courier-New', css: ':root{--mono:"Courier New",monospace}' },
    { name: 'break-word-cannot-override-nowrap', css: '.mf .rec .mm{overflow-wrap:anywhere;word-break:break-all}' },
  ];
  for (const variant of variants) {
    await open('4-1'); if (variant.css) await page.addStyleTag({ content: variant.css });
    report.experiments.push({ ...variant, metrics: await metrics() });
  }
  for (const width of [360, 390, 1280]) {
    await page.setViewportSize({ width, height: width === 1280 ? 720 : 800 });
    for (const step of [1, 2, 4]) {
      await open('4-' + step); await page.mouse.move(0, 0);
      const before = await page.screenshot({ fullPage: true, animations: 'disabled' }), beforeMetrics = await metrics();
      const textBefore = await page.locator('#stage').innerText();
      await page.addStyleTag({ content: proposal });
      const after = await page.screenshot({ fullPage: true, animations: 'disabled' }), afterMetrics = await metrics();
      // innerText changes with visual wrapping in some engines; DOM text is compared independently below.
      const textAfter = await page.locator('#stage').innerText();
      await writeFile(resolve(output, `${width}-04-${step}-before.png`), before);
      await writeFile(resolve(output, `${width}-04-${step}-proposal.png`), after);
      await open('4-' + step);
      if (width < 641) { await page.evaluate(() => document.body.classList.add('b21t')); await page.addStyleTag({ content: parityAdjustment }); }
      const parityBefore = await page.screenshot({ animations: 'disabled' });
      await page.addStyleTag({ content: proposal });
      const parityAfter = await page.screenshot({ animations: 'disabled' });
      report.comparisons.push({ width, step, byteIdenticalScreenshot: before.equals(after), parityReferenceUnchanged: parityBefore.equals(parityAfter), sameText: textBefore.replace(/\s+/g, '') === textAfter.replace(/\s+/g, ''), before: beforeMetrics, after: afterMetrics });
    }
    const scan = analysis.scans.find(s => s.width === width);
    const rows = [];
    // No fail-fast: retain every base/revealed state and every failure.
    for (const row of scan.rows) {
      const token = ['05', '06'].includes(row.scene) ? row.id : row.step;
      await open(`${Number(row.scene)}-${token}`); await page.addStyleTag({ content: proposal });
      if (row.state === 'revealed') await page.locator('#stage [data-reveal]').click();
      const measurement = await metrics();
      rows.push({ scene: row.scene, step: row.step, state: row.state, documentWidth: measurement.documentWidth, overlap: measurement.overlap, internalOverflow: measurement.internalOverflow, textOutsidePane: measurement.textOutsidePane });
    }
    report.scan.push({ width, rows });
    console.log(JSON.stringify({ proposalWidth: width, states: rows.length, failures: rows.filter(r => r.documentWidth > width || r.overlap.length || r.textOutsidePane.length) }));
  }
  // Match the existing HTML QA's mobile/touch context independently of desktop parity.
  const mobile = await browser.newContext({ viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const mobilePage = await mobile.newPage();
  report.mobileRaw = [];
  try {
    for (const row of analysis.scans.find(s => s.width === 360).rows) {
      const token = ['05', '06'].includes(row.scene) ? row.id : row.step;
      await mobilePage.goto(`${htmlURL}#${Number(row.scene)}-${token}`); await mobilePage.reload();
      await mobilePage.evaluate(() => document.fonts.ready);
      if (row.state === 'revealed') await mobilePage.locator('#stage [data-reveal]').click();
      const before = await mobilePage.evaluate(() => ({ innerWidth, clientWidth: document.documentElement.clientWidth, documentWidth: document.documentElement.scrollWidth, visualWidth: visualViewport.width, visualScale: visualViewport.scale, media360: matchMedia('(max-width:360px)').matches }));
      if (row.scene === '04' && row.step === 1) await mobilePage.screenshot({ path: resolve(output, '360-mobile-04-1-before.png'), fullPage: true });
      await mobilePage.addStyleTag({ content: proposal });
      const proposed = await mobilePage.evaluate(() => ({ innerWidth, clientWidth: document.documentElement.clientWidth, documentWidth: document.documentElement.scrollWidth, visualWidth: visualViewport.width, visualScale: visualViewport.scale, media360: matchMedia('(max-width:360px)').matches }));
      if (row.scene === '04' && row.step === 1) await mobilePage.screenshot({ path: resolve(output, '360-mobile-04-1-proposal.png'), fullPage: true });
      report.mobileRaw.push({ scene: row.scene, step: row.step, state: row.state, requestedWidth: 360, before, proposed });
    }
  } finally { await mobile.close(); }
  console.log(JSON.stringify({ mobileRawStates: report.mobileRaw.length, rawFailures: report.mobileRaw.filter(r => r.before.documentWidth > 360), proposalFailures: report.mobileRaw.filter(r => r.proposed.documentWidth > 360) }));
} finally {
  await writeFile(resolve(output, 'proposal.json'), JSON.stringify(report, null, 2) + '\n');
  await context.close(); await browser.close();
}
