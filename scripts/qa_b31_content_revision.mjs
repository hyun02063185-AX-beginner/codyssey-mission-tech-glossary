import { chromium, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const baseline = process.env.B31_BASELINE_URL ?? 'http://127.0.0.1:4191';
const revised = process.env.B31_INTEGRATION_URL ?? 'http://127.0.0.1:4188';
const output = `${process.env.B31_QA_OUTPUT ?? 'reports/b3-1-story-map-integration/content-final-qa'}/scene-comparison`;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const comparisons = [], fontDiagnostics = [];
try {
  for (const width of [1280, 1000, 390, 360]) {
    const context = await browser.newContext({ viewport: { width, height: width > 700 ? 900 : 844 }, reducedMotion: 'reduce' });
    const pages = [await context.newPage(), await context.newPage()];
    for (const scene of ['scene-01', 'scene-02', 'scene-03a', 'scene-03b']) {
      const originals = [], geometry = [];
      for (const [index, base] of [baseline, revised].entries()) {
        const page = pages[index];
        await page.goto(`${base}/#/missions/main-M05/story-map?scene=${scene}`);
        await page.getByLabel('화면 테마').selectOption('forest');
        const art = page.locator('.b31-story-art svg');
        await expect(art).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        const captureStyle = await page.addStyleTag({ content: '* { scrollbar-width:none!important; }' });
        const image = await page.locator('.b31-art-frame').screenshot({ animations: 'disabled' });
        originals.push(image);
        await writeFile(`${output}/${index ? 'after' : 'before'}-${width}-${scene}.png`, image);
        // Isolate design from the deliberately revised wording. Unmasked captures
        // above remain available for human review; source/wording is checked by
        // the pinned revision guard and the actual-page Playwright assertions.
        await art.evaluate(svg => {
          const mask = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          mask.setAttribute('data-qa-text-mask', '');
          mask.textContent = 'text { visibility:hidden!important; }';
          svg.append(mask);
        });
        geometry.push(await page.locator('.b31-art-frame').screenshot({ animations: 'disabled' }));
        await art.locator('[data-qa-text-mask]').evaluate(element => element.remove());
        await captureStyle.evaluate(element => element.remove());
      }
      const equal = geometry[0].equals(geometry[1]);
      comparisons.push({ width, scene, textPixelsEqual: originals[0].equals(originals[1]), geometryPixelsEqual: equal,
        beforeSha256: hash(originals[0]), afterSha256: hash(originals[1]), beforeGeometrySha256: hash(geometry[0]), afterGeometrySha256: hash(geometry[1]) });
      if (!equal) for (const [index, bytes] of geometry.entries()) await writeFile(`${output}/geometry-${index}-${width}-${scene}.png`, bytes);
    }
    await context.close();
  }
  for (const scene of ['scene-01', 'scene-03a']) for (const mode of ['web-before', 'web-after', 'standalone']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    const file = scene === 'scene-01' ? 'scene-01/enterprise-network-mobile.svg' : 'scene-03/network-aws-overview-mobile.svg';
    await page.goto(mode === 'standalone' ? pathToFileURL(path.resolve(`drafts/b3-1-visual-story/${file}`)).href : `${mode === 'web-before' ? baseline : revised}/#/missions/main-M05/story-map?scene=${scene}`);
    const svg = mode === 'standalone' ? page.locator('svg') : page.locator('.b31-story-art svg');
    await expect(svg).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const metrics = await svg.evaluate(svg => ({
      fontFaces: [...document.fonts].map(face => ({ family: face.family, status: face.status })),
      labels: [...svg.querySelectorAll('text')].filter(text => /통신 허용을 뜻하지 않음|← 왼쪽 두 선|VPC 10.0.0.0/.test(text.textContent)).map(text => {
        const { x, y, width, height } = text.getBBox();
        const paddedLineHits = [...svg.querySelectorAll('path[data-link],path[data-assoc]')].flatMap(line => {
          for (let i = 0; i <= 80; i++) {
            const p = line.getPointAtLength(line.getTotalLength() * i / 80);
            if (p.x > x - 2 && p.x < x + width + 2 && p.y > y - 2 && p.y < y + height + 2) return [line.dataset.link || line.dataset.assoc];
          }
          return [];
        });
        return { text: text.textContent, bounds: { x, y, width, height }, computedFont: getComputedStyle(text).fontFamily, paddedLineHits };
      }),
    }));
    const session = await context.newCDPSession(page);
    await session.send('DOM.enable'); await session.send('CSS.enable'); await session.send('DOM.getDocument', { depth: -1, pierce: true });
    const { result } = await session.send('Runtime.evaluate', { expression: mode === 'standalone' ? "document.querySelector('svg text')" : "document.querySelector('.b31-story-art').shadowRoot.querySelector('svg text')" });
    const { nodeId } = await session.send('DOM.requestNode', { objectId: result.objectId });
    const { fonts } = await session.send('CSS.getPlatformFontsForNode', { nodeId });
    fontDiagnostics.push({ scene, mode, ...metrics, actualFonts: fonts });
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${output}/comparison.json`, JSON.stringify({ baselineCommit: '4d774cbb15d1563905f5f089526668cbc8d747d5', reviewedCommit: 'c000676b33680dae8f872f69b14d3fe043ee3f11', baseline, revised, comparisons, fontDiagnostics }, null, 2) + '\n');
const mismatches = comparisons.filter(row => !row.geometryPixelsEqual);
console.log(`Scene comparisons: ${comparisons.length}. Geometry mismatches: ${mismatches.length}. Intentional text image changes: ${comparisons.filter(row => !row.textPixelsEqual).length}. Font samples: ${fontDiagnostics.length}.`);
if (mismatches.length) process.exitCode = 1;
