import { chromium, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const approvedCommit = '7cfdecc';
const baseline = process.env.MISSION_BASELINE_URL ?? 'http://127.0.0.1:4175';
const integrated = process.env.MISSION_INTEGRATION_URL ?? 'http://127.0.0.1:4174';
const output = 'reports/mission-learning-entry-ux';
await mkdir(output, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const protectedFiles = [
  'data/mission-story-maps/main-m05/concept-map.json',
  ...['B31StoryMap.tsx', 'b31StoryMapContent.ts', 'b31StoryMap.css', 'b31StoryNavigation.ts', 'B31LearningReturn.tsx'].map(file => `src/${file}`),
  ...['ConceptMapCanvas.tsx', 'ConceptMapDetailPanel.tsx', 'MissionConceptMap.tsx', 'conceptMapAdapter.ts', 'conceptMapTypes.ts', 'missionConceptMap.css'].map(file => `src/missionConceptMap/${file}`),
  ...['scene-01/enterprise-network', 'scene-02/request-response', 'scene-03/network-aws-overview', 'scene-03/network-aws-access'].flatMap(stem => ['desktop', 'mobile'].map(layout => `drafts/b3-1-visual-story/${stem}-${layout}.svg`)),
];
const sourceChecks = [];
for (const path of protectedFiles) {
  const approved = execFileSync('git', ['show', `${approvedCommit}:${path}`]);
  const current = await readFile(path);
  const normalized = value => value.toString('utf8').replace(/\r\n/g, '\n');
  if (normalized(approved) !== normalized(current)) throw new Error(`Protected source changed: ${path}`);
  sourceChecks.push({ path, unchanged: true, gitSha256: hash(approved) });
}
const browser = await chromium.launch();
const results = [];
async function compare(pages, path, selector, metadata) {
  const images = [];
  for (const [page, base] of [[pages[0], baseline], [pages[1], integrated]]) {
    await page.goto(`${base}/#${path}`);
    await page.getByLabel('화면 테마').selectOption(metadata.theme);
    await expect(page.locator(selector)).toBeVisible();
    if (metadata.kind === 'concepts') await expect(page.locator('[data-map-node]').first()).toBeVisible();
    else await expect(page.locator('.b31-story-art svg').first()).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    // Exclude the intentionally changed global header from component goldens.
    // Otherwise its different fractional height changes glyph rasterization.
    // Also remove transient native Windows scrollbar overlays in both pages.
    // Diagram dimensions, styles and content remain untouched in both captures.
    const captureStyle = await page.addStyleTag({ content: '* { scrollbar-width:none!important; } #root>header { display:none!important; }' });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    images.push(await page.locator(selector).screenshot({ animations: 'disabled' }));
    await captureStyle.evaluate(element => element.remove());
  }
  const equal = images[0].equals(images[1]);
  results.push({ ...metadata, equal, baselineSha256: hash(images[0]), integratedSha256: hash(images[1]) });
  if (!equal) {
    const name = `${metadata.kind}-${metadata.width}-${metadata.theme}-${metadata.colorScheme}-${metadata.state}`;
    await writeFile(`${output}/baseline-${name}.png`, images[0]);
    await writeFile(`${output}/integrated-${name}.png`, images[1]);
  }
}
try {
  for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: width > 700 ? 900 : 844 }, colorScheme, reducedMotion: 'reduce' });
    const pages = [await context.newPage(), await context.newPage()];
    for (const [state, query] of [['overview', ''], ['node', '?node=gen%3Afirewall'], ['relation', '?rel=CR01'], ['flow', '?view=aws&flow=AF01']]) {
      await compare(pages, `/missions/main-M05/story-map/concepts${query}`, '.map-canvas-shell', { kind: 'concepts', width, theme, colorScheme, state });
    }
    if (theme === 'forest' && colorScheme === 'light') for (const state of ['scene-01', 'scene-02', 'scene-03a', 'scene-03b']) {
      await compare(pages, `/missions/main-M05/story-map?scene=${state}`, '.b31-art-frame', { kind: 'story', width, theme, colorScheme, state });
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${output}/protected-visuals.json`, JSON.stringify({ approvedCommit, baseline, integrated, sourceChecks, results }, null, 2) + '\n');
const mismatches = results.filter(result => !result.equal);
console.log(`Protected sources: ${sourceChecks.length}. Visual comparisons: ${results.length}. Pixel mismatches: ${mismatches.length}.`);
if (mismatches.length) process.exitCode = 1;
