import { chromium, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const baseline = process.env.B31_BASELINE_URL ?? 'http://127.0.0.1:4173';
const integrated = process.env.B31_INTEGRATION_URL ?? 'http://127.0.0.1:4174';
const output = 'reports/b3-1-story-map-integration';
await mkdir(output, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const protectedFiles = ['data/mission-story-maps/main-m05/concept-map.json',
  ...['ConceptMapCanvas.tsx', 'conceptMapAdapter.ts', 'conceptMapTypes.ts', 'missionConceptMap.css'].map(file => `src/missionConceptMap/${file}`),
  ...['scene-01/enterprise-network', 'scene-02/request-response', 'scene-03/network-aws-overview', 'scene-03/network-aws-access']
    .flatMap(stem => ['desktop', 'mobile'].map(layout => `drafts/b3-1-visual-story/${stem}-${layout}.svg`))];
const sourceChecks = [];
for (const path of protectedFiles) {
  const approved = execFileSync('git', ['show', `410b3a0:${path}`]);
  // Git's Windows checkout can change line endings, so compare normalized UTF-8.
  const current = await readFile(path);
  const normalized = value => value.toString('utf8').replace(/\r\n/g, '\n');
  if (normalized(approved) !== normalized(current)) throw new Error(`Golden source changed: ${path}`);
  sourceChecks.push({ path, unchanged: true, gitSha256: hash(approved) });
}
const browser = await chromium.launch();
const results = [];
try {
  for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) for (const colorScheme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width, height: width > 700 ? 900 : 844 }, colorScheme, reducedMotion: 'reduce' });
    const before = await context.newPage(), after = await context.newPage();
    for (const [state, query] of [['overview', ''], ['node', '?node=gen%3Afirewall'], ['relation', '?rel=CR01'], ['flow', '?view=aws&flow=AF01']]) {
      const images = [];
      for (const [page, base] of [[before, baseline], [after, integrated]]) {
        await page.goto(`${base}/#/missions/main-M05/story-map/concepts${query}`);
        await page.getByLabel('화면 테마').selectOption(theme);
        await expect(page.locator('[data-map-node]').first()).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        // Native Windows scrollbar overlays can appear for one capture only.
        // Remove that browser chrome in both test pages; app source is untouched.
        await page.addStyleTag({ content: '* { scrollbar-width:none!important; }' });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        images.push(await page.locator('.map-canvas-shell').screenshot({ animations: 'disabled' }));
      }
      const equal = images[0].equals(images[1]);
      results.push({ width, theme, colorScheme, state, equal, baselineSha256: hash(images[0]), integratedSha256: hash(images[1]) });
      if (!equal) {
        const name = `${width}-${theme}-${colorScheme}-${state}`;
        await writeFile(`${output}/baseline-${name}.png`, images[0]);
        await writeFile(`${output}/integrated-${name}.png`, images[1]);
      }
    }
    await context.close();
  }
} finally { await browser.close(); }
await writeFile(`${output}/golden-baseline.json`, JSON.stringify({ approvedCommit: '410b3a0', baseline, integrated, sourceChecks, results }, null, 2) + '\n');
const mismatches = results.filter(result => !result.equal);
console.log(`Protected sources: ${sourceChecks.length}. Canvas comparisons: ${results.length}. Pixel mismatches: ${mismatches.length}.`);
if (mismatches.length) process.exitCode = 1;
