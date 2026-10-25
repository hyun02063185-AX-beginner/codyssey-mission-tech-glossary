// No HTTP server, application route, or public URL. Mount verified fixtures in
// an about:blank page; SVG bytes use data URLs. Clipboard is deliberately mocked.
import { createServer, build } from 'vite';
import react from '@vitejs/plugin-react';
import { chromium, expect } from '@playwright/test';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const previousNodeEnv = process.env.NODE_ENV;
process.env.NODE_ENV = 'production';
const cache = resolve(root, 'node_modules/.cache'); await mkdir(cache, { recursive: true });
const work = await mkdtemp(resolve(cache, 'b21-browser-'));
let server, browser, checks = 0;
function check(ok, label) { if (!ok) throw Error(label); checks++; }
try {
  server = await createServer({ root, configFile: false, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, logLevel: 'error' });
  const { loadStoryManifest } = await server.ssrLoadModule('/src/b21Story/content/storyLoader.ts');
  const scenes = await loadStoryManifest();
  await server.close(); server = undefined;
  for (const scene of scenes) if (scene.assets) for (const asset of Object.values(scene.assets)) {
    asset.url = 'data:image/svg+xml;base64,' + (await readFile(resolve(root, asset.sourcePath))).toString('base64');
  }
  const entry = resolve(work, 'entry.tsx');
  await writeFile(entry, `import {createRoot} from 'react-dom/client';
import B21 from ${JSON.stringify(resolve(root, 'src/b21Story/B21StoryFoundation.tsx'))};
export function mount(scenes) { createRoot(document.getElementById('root')).render(<B21 loadScene={async id => scenes.find(s => s.id === id)} />); }`);
  const outDir = resolve(work, 'out');
  await build({ root, configFile: false, plugins: [react()], base: './', define: { 'process.env.NODE_ENV': '"production"' }, logLevel: 'warn', build: { outDir, emptyOutDir: true, modulePreload: false,
    lib: { entry, name: 'B21PrivateHarness', formats: ['iife'], fileName: () => 'harness.js' }, rollupOptions: { output: { inlineDynamicImports: true } } } });
  browser = await chromium.launch({ headless: true, ...(process.env.B21_BROWSER_CHANNEL ? { channel: process.env.B21_BROWSER_CHANNEL } : {}) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [], requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (!/^(data:|about:)/.test(request.url())) requests.push(request.url()); });
  await page.setContent(`<!doctype html><html lang="ko"><head><base href="${pathToFileURL(outDir + '/').href}"><title>B21 private component test</title></head><body style="margin:0"><div id="root"></div></body></html>`);
  for (const name of await readdir(outDir)) if (name.endsWith('.css')) await page.addStyleTag({ content: await readFile(resolve(outDir, name), 'utf8') });
  await page.addScriptTag({ content: await readFile(resolve(outDir, 'harness.js'), 'utf8') });
  check(await page.evaluate(() => typeof window.B21PrivateHarness?.mount === 'function'), `harness load: ${errors.join('; ')}`);
  await page.evaluate(scenes => window.B21PrivateHarness.mount(scenes), scenes);
  const nav = page.locator('nav[aria-label="학습 장면"] button');
  for (const [i, scene] of scenes.entries()) {
    await nav.nth(i).click();
    await expect(page.locator('article[data-scene-id]')).toHaveAttribute('data-scene-id', scene.id); checks++;
    check(await page.locator('h1').textContent() === scene.title, `title ${scene.id}`);
    for (const activity of scene.activities) { await expect(page.locator(`[id="${activity.sectionId}"]`)).toBeAttached(); checks++; }
  }
  await nav.nth(2).click(); await page.getByRole('button', { name: '다음 장면 →', exact: true }).click();
  await expect(page.locator('article')).toHaveAttribute('data-scene-id', 'scene-03b'); checks++;
  await nav.nth(7).click(); await expect(page.locator('article')).toHaveAttribute('data-scene-id', 'scene-07'); await page.getByRole('button', { name: '다음 장면 →', exact: true }).click();
  await expect(page.locator('article')).toHaveAttribute('data-scene-id', 'scene-08'); checks++;
  check(await page.locator('iframe,canvas').count() === 0, 'Scene08 must not embed the HTML preview or B31 canvas');
  await nav.nth(0).click();
  for (const width of [360, 390, 1000, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const figure = page.locator('.b21-story-figure-frame');
    const slot = await figure.evaluate(el => el.getBoundingClientRect().width);
    await expect(figure).toHaveAttribute('data-layout', slot >= 960 ? 'desktop' : 'mobile'); checks++;
    await expect(page.locator('.b21-story-figure-frame img')).toHaveJSProperty('complete', true);
    check(await page.locator('.b21-story-figure-frame img').evaluate(el => el.naturalWidth > 0), `SVG loads at ${width}`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `no page overflow at ${width}`);
  }
  await page.locator('.b21-story-instructor summary').click();
  await expect(page.locator('.b21-story-instructor')).toHaveAttribute('open', ''); checks++;
  const block = Object.values(scenes[0].areas).flatMap(area => area.codeBlocks).find(b => b.kind === 'code');
  const code = page.locator(`[data-block-id="${block.id}"]`);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.b21Copied = text; } } }));
  await code.getByRole('button').click(); check(await page.evaluate(() => window.b21Copied) === block.raw, 'clipboard receives exact raw source');
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw Error('denied'); } } }));
  await code.getByRole('button').click(); await expect(code.getByRole('status')).toContainText('복사하지 못했습니다'); checks++;
  check((await page.evaluate(() => getSelection().toString())).includes(block.raw.trim()), 'failed copy selects source text');
  const trigger = page.getByRole('button', { name: '전체 그림 확대', exact: true });
  await trigger.click(); await expect(page.locator('dialog')).toHaveAttribute('open', ''); checks++;
  const before = Number(await page.locator('dialog img').getAttribute('width'));
  await page.locator('dialog').getByRole('button', { name: '확대', exact: true }).click();
  check(Number(await page.locator('dialog img').getAttribute('width')) > before, 'zoom changes figure dimensions');
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); check(await page.locator('dialog').evaluate(el => el.contains(document.activeElement)), 'modal keeps keyboard focus'); }
  await page.keyboard.press('Escape'); await expect(page.locator('dialog')).toHaveCount(0); checks++;
  await expect(trigger).toBeFocused(); checks++;
  check(await page.evaluate(() => document.body.style.overflow !== 'hidden'), 'dialog releases background scroll lock');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), '200% text size has no page overflow');
  check(errors.length === 0, `browser errors: ${errors.join('; ')}`);
  check(requests.length === 0 && page.url() === 'about:blank', 'no HTTP requests, route, or navigation');
  console.log(`PASS private browser component checks: ${checks}; real browser layout/dialog/focus, mocked clipboard and verified fixture loader; no application route`);
} finally { if (previousNodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previousNodeEnv; if (server) await server.close(); if (browser) await browser.close(); await rm(work, { recursive: true, force: true }); }
