import { chromium, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';

const baseline = process.env.B31_BASELINE_URL ?? 'http://127.0.0.1:4173';
const integrated = process.env.B31_INTEGRATION_URL ?? 'http://127.0.0.1:4174';
// Historical mode remains strict against 410b3a0. A reviewed content revision
// must be explicitly selected; it never replaces the concept-map golden.
const contentRevision = process.env.B31_CONTENT_REVISION;
const reviewedContent = 'c000676b33680dae8f872f69b14d3fe043ee3f11';
if (contentRevision && contentRevision !== reviewedContent) throw new Error('Unrecognized reviewed content revision');
const output = process.env.B31_QA_OUTPUT ?? (contentRevision ? 'reports/b3-1-story-map-integration/content-final-qa' : 'reports/b3-1-story-map-integration');
await mkdir(output, { recursive: true });
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const protectedFiles = ['data/mission-story-maps/main-m05/concept-map.json',
  ...['ConceptMapCanvas.tsx', 'conceptMapAdapter.ts', 'conceptMapTypes.ts', 'missionConceptMap.css'].map(file => `src/missionConceptMap/${file}`)];
const storyFiles = ['scene-01/enterprise-network', 'scene-02/request-response', 'scene-03/network-aws-overview', 'scene-03/network-aws-access']
  .flatMap(stem => ['desktop', 'mobile'].map(layout => `drafts/b3-1-visual-story/${stem}-${layout}.svg`));
if (!contentRevision) protectedFiles.push(...storyFiles);
const normalized = value => value.toString('utf8').replace(/\r\n/g, '\n');
const sourceChecks = [];
for (const path of protectedFiles) {
  const approved = execFileSync('git', ['show', `410b3a0:${path}`]);
  // Git's Windows checkout can change line endings, so compare normalized UTF-8.
  const current = await readFile(path);
  if (normalized(approved) !== normalized(current)) throw new Error(`Golden source changed: ${path}`);
  sourceChecks.push({ path, unchanged: true, gitSha256: hash(approved) });
}
const browser = await chromium.launch();
const results = [];
const contentChecks = [];
try {
  if (contentRevision) {
    const parser = await browser.newPage();
    for (const path of storyFiles) {
      const original = execFileSync('git', ['show', `410b3a0:${path}`]);
      const reviewed = execFileSync('git', ['show', `${reviewedContent}:${path}`]);
      const current = await readFile(path);
      if (normalized(reviewed) !== normalized(current)) throw new Error(`Reviewed content changed: ${path}`);
      // Keep every element, attribute, coordinate and CSS rule in the original
      // design. Only text/description/comment changes are allowed here.
      const structures = await parser.evaluate(sources => sources.map(source => {
        const doc = new DOMParser().parseFromString(source, 'image/svg+xml');
        if (doc.querySelector('parsererror')) throw new Error('Invalid SVG');
        return [...doc.querySelectorAll('*')].map(element => [element.tagName,
          [...element.attributes].map(attr => [attr.name, attr.value]).sort((a,b) => a[0].localeCompare(b[0])),
          element.tagName === 'style' ? element.textContent : null]);
      }), [normalized(original), normalized(reviewed)]);
      if (JSON.stringify(structures[0]) !== JSON.stringify(structures[1])) throw new Error(`Unreviewed design change: ${path}`);
      contentChecks.push({ path, originalCommit: '410b3a0', reviewedCommit: reviewedContent,
        intentionalTextChange: normalized(original) !== normalized(reviewed), reviewedSourceUnchanged: true,
        geometryAndStylesUnchanged: true, originalSha256: hash(original), reviewedSha256: hash(reviewed) });
    }
    await parser.close();
  }
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
        const captureStyle = await page.addStyleTag({ content: '* { scrollbar-width:none!important; }' + (contentRevision ? ' #root>header { display:none!important; }' : '') });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        images.push(await page.locator('.map-canvas-shell').screenshot({ animations: 'disabled' }));
        await captureStyle.evaluate(element => element.remove());
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
await writeFile(`${output}/golden-baseline.json`, JSON.stringify({ approvedCommit: '410b3a0', contentRevision: contentRevision ?? null, baseline, integrated, sourceChecks, contentChecks, results }, null, 2) + '\n');
const mismatches = results.filter(result => !result.equal);
console.log(`Protected sources: ${sourceChecks.length}. Reviewed SVGs: ${contentChecks.length}. Canvas comparisons: ${results.length}. Pixel mismatches: ${mismatches.length}.`);
if (mismatches.length) process.exitCode = 1;
