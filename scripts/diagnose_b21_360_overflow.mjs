// Read-only browser investigation. Experimental CSS only touches disposable pages.
import { chromium } from '@playwright/test';
import { createServer } from 'vite';
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = resolve(root, 'node_modules/.cache/b21-u3-c');
await mkdir(output, { recursive: true });
const htmlURL = new URL('../drafts/b2-1-story-map/v3/teaching-preview/index.html', import.meta.url).href;
const source = await readFile(fileURLToPath(htmlURL), 'utf8');
const sourceSha256 = createHash('sha256').update(source.replace(/\r\n/g, '\n')).digest('hex');
const approval = JSON.parse(await readFile(resolve(root, 'src/b21StoryV3/content/integrity.json'), 'utf8'));
if (sourceSha256 !== approval.preview.sha256) throw Error('Approved HTML hash differs; do not refresh approval');
let ownServer;
try { if (!(await fetch('http://127.0.0.1:4179/')).ok) throw Error('Preview unavailable'); }
catch {
  ownServer = spawn(process.execPath, [resolve(root, 'scripts/b21_preview.mjs')], { cwd: root, stdio: 'ignore' });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch('http://127.0.0.1:4179/')).ok) { ready = true; break; } } catch {}
    await new Promise(r => setTimeout(r, 100));
  }
  if (!ready) throw Error('Could not start private Preview');
}
const loader = await createServer({ root, configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', optimizeDeps: { noDiscovery: true, include: [] }, logLevel: 'error' });
const { scenes } = await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');
await loader.close();
const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 360, height: 800 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
const html = await context.newPage(), react = await context.newPage();
const errors = [];
for (const page of [html, react]) page.on('pageerror', e => errors.push(e.stack));
const report = { baseline: 'bf01ac1184a4dbc22743bc6d16f790e95d7c177e', testedHead: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), sourceSha256, browser: browser.version(), platform: process.platform, errors, details: {}, scans: [] };

async function open(page, kind, scene, index) {
  const token = scene.addressing === 'id' ? scene.steps[index].id : String(index + 1);
  const url = kind === 'html' ? `${htmlURL}#${Number(scene.id)}-${token}` : `http://127.0.0.1:4179/?view=v3&scene=${scene.id}&step=${token}`;
  await page.goto(url);
  if (kind === 'html') await page.reload();
  await page.locator('#stage > *').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function geometry(page, detailed = false) {
  return page.evaluate(detailed => {
    const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right, bottom: r.bottom }; };
    const label = el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().replace(/\s+/g, '.') : ''}`;
    const describe = el => {
      const s = getComputedStyle(el);
      const properties = ['display', 'position', 'width', 'minWidth', 'maxWidth', 'boxSizing', 'gridTemplateColumns', 'gridTemplateRows', 'gap', 'flex', 'flexShrink', 'paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordBreak', 'overflowWrap', 'whiteSpace', 'overflowX', 'visibility'];
      return { element: label(el), text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 180), box: rect(el), clientWidth: el.clientWidth, scrollWidth: el.scrollWidth, style: Object.fromEntries(properties.map(k => [k, s[k]])) };
    };
    const stage = document.getElementById('stage');
    const nodes = [stage, ...stage.querySelectorAll('*')];
    const overflow = nodes.filter(el => { const r = el.getBoundingClientRect(), s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden' && (r.right > innerWidth || r.left < 0); }).map(describe);
    return { viewport: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, stage: describe(stage), overflow, ...(detailed ? { nodes: nodes.map(describe) } : {}) };
  }, detailed);
}
async function platformFonts(page, selectors) {
  const cdp = await context.newCDPSession(page);
  try {
    await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root: doc } = await cdp.send('DOM.getDocument');
    const result = {};
    for (const selector of selectors) {
      const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: doc.nodeId, selector });
      if (nodeId) result[selector] = (await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts;
    }
    return result;
  } finally { await cdp.detach(); }
}

try {
  await open(html, 'html', scenes[3], 0); await open(react, 'react', scenes[3], 0);
  report.details.original = await geometry(html, true); report.details.react = await geometry(react, true);
  report.details.fonts = await platformFonts(html, ['.pane-h b', '.pane-h span', '.pane .rec .am', '.pane .rec .no', '.pane .rec .mm', '.pane .empty']);
  await html.screenshot({ path: resolve(output, '360-04-1-original.png'), fullPage: true });
  await react.screenshot({ path: resolve(output, '360-04-1-react.png'), fullPage: true });
  console.log(JSON.stringify({ initial: report.details.original, reactWidth: report.details.react.documentWidth, fonts: report.details.fonts }));
  for (const width of [360, 390, 1280]) {
    await Promise.all([html.setViewportSize({ width, height: width === 1280 ? 720 : 800 }), react.setViewportSize({ width, height: width === 1280 ? 720 : 800 })]);
    const rows = [];
    for (const scene of scenes) for (const [i, step] of scene.steps.entries()) {
      await Promise.all([open(html, 'html', scene, i), open(react, 'react', scene, i)]);
      const original = await geometry(html), current = await geometry(react);
      const row = { scene: scene.id, step: i + 1, id: step.id, state: 'hidden', html: original, react: current };
      rows.push(row);
      if (step.reveal) {
        await html.locator('#stage [data-reveal]').click(); await react.locator('#stage [data-focus-key="reveal"]').click();
        rows.push({ scene: scene.id, step: i + 1, id: step.id, state: 'revealed', html: await geometry(html), react: await geometry(react) });
      }
    }
    report.scans.push({ width, rows });
    console.log(JSON.stringify({ width, tested: rows.length, htmlFailures: rows.filter(r => r.html.documentWidth > width).map(r => `${r.scene}:${r.step}:${r.state}=${r.html.documentWidth}`), reactFailures: rows.filter(r => r.react.documentWidth > width).map(r => `${r.scene}:${r.step}:${r.state}=${r.react.documentWidth}`) }));
  }
  report.status = errors.length ? 'ERROR' : 'COMPLETE';
} catch (e) { report.status = 'ERROR'; errors.push(e.stack); process.exitCode = 1; }
finally {
  await writeFile(resolve(output, 'analysis.json'), JSON.stringify(report, null, 2) + '\n');
  await context.close(); await browser.close(); if (ownServer) ownServer.kill('SIGTERM');
  console.log(JSON.stringify({ status: report.status, output, errors }));
}
