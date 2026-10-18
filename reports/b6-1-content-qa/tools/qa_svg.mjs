// Usage (from the repo root): node reports/b6-1-content-qa/tools/qa_svg.mjs <svgDir> <outDir> [--shots] [--only name1,name2]
// Measures every SVG in real Chromium: min font, text overflow vs containing rect, text/text overlap, line/text crossing.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO = process.env.REPO ?? process.cwd(); // glossary repo root (needs node_modules/playwright)
const require = createRequire(path.resolve(REPO, 'package.json'));
const { chromium } = require('playwright');

const [svgDir, outDir, ...rest] = process.argv.slice(2);
const shots = rest.includes('--shots');
const onlyArg = rest.indexOf('--only');
const only = onlyArg >= 0 ? rest[onlyArg + 1].split(',') : null;
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg') && (!only || only.some(o => f.includes(o)))).sort();
const browser = await chromium.launch();
const results = [];

for (const f of files) {
  const file = path.join(svgDir, f);
  const page = await browser.newPage({ viewport: { width: 1000, height: 900 } });
  await page.goto(pathToFileURL(file).href);
  await page.evaluate(() => document.fonts.ready);
  const m = await page.evaluate(() => {
    const svg = document.documentElement;
    const vb = svg.viewBox.baseVal;
    const out = { vbW: vb.width, vbH: vb.height, texts: [], rects: [], segs: [] };
    for (const r of svg.querySelectorAll('rect')) {
      const w = +r.getAttribute('width'), h = +r.getAttribute('height');
      if (w >= vb.width - 0.5 && h >= vb.height - 0.5) continue;
      out.rects.push({ x: +r.getAttribute('x'), y: +r.getAttribute('y'), w, h, fill: r.getAttribute('fill') });
    }
    for (const t of svg.querySelectorAll('text')) {
      const b = t.getBBox();
      out.texts.push({
        s: t.textContent, size: +t.getAttribute('font-size'), x: +t.getAttribute('x'), y: +t.getAttribute('y'),
        anchor: t.getAttribute('text-anchor') || 'start', bx: b.x, by: b.y, bw: b.width, bh: b.height,
        family: getComputedStyle(t).fontFamily.split(',')[0],
      });
    }
    for (const p of svg.querySelectorAll('path')) {
      const d = p.getAttribute('d') || '';
      if (!/^M[\d\s.\-L]+$/.test(d.replace(/\s+/g, ' ').trim())) continue;
      const nums = d.match(/-?[\d.]+/g).map(Number);
      const pts = []; for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
      const dashed = p.getAttribute('stroke-dasharray');
      const stroke = p.getAttribute('stroke');
      if (stroke === '#ffffff') continue; // icon glyph strokes
      for (let i = 0; i + 1 < pts.length; i++) out.segs.push({ a: pts[i], b: pts[i + 1], marker: !!p.getAttribute('marker-end') });
    }
    return out;
  });

  const SAFE = 1.06; // width safety for other fonts
  const issues = [];
  let minFont = Infinity;
  const boxes = m.texts.map(t => {
    minFont = Math.min(minFont, t.size);
    let w = t.bw * SAFE;
    let x = t.bx;
    if (t.anchor === 'middle') x = t.bx - (w - t.bw) / 2;
    if (t.anchor === 'end') x = t.bx - (w - t.bw);
    return { ...t, L: x, R: x + w, T: t.by + 2, B: t.by + t.bh - 2 };
  });
  // containment
  for (const t of boxes) {
    const px = t.x + (t.anchor === 'start' ? 2 : 0), py = t.y - t.size * 0.3;
    let best = null;
    for (const r of m.rects) {
      if (r.fill === 'none') {
        // outline rect (cell highlight) – only a container when text start is inside it
      }
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        if (!best || r.w * r.h < best.w * best.h) best = r;
      }
    }
    if (best) {
      const pad = 3;
      if (t.L < best.x + pad || t.R > best.x + best.w - pad || t.T < best.y || t.B > best.y + best.h)
        issues.push(`overflow "${t.s}" L${t.L.toFixed(0)} R${t.R.toFixed(0)} in box x${best.x}-${best.x + best.w} y${best.y}-${best.y + best.h}`);
    } else if (t.L < 8 || t.R > m.vbW - 8) {
      issues.push(`outside-margin "${t.s}" L${t.L.toFixed(0)} R${t.R.toFixed(0)}`);
    }
    if (t.R > m.vbW || t.L < 0) issues.push(`outside-canvas "${t.s}"`);
    if (t.B > m.vbH) issues.push(`below-canvas "${t.s}"`);
  }
  // text/text overlap
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j];
    const ox = Math.min(a.R, b.R) - Math.max(a.L, b.L), oy = Math.min(a.B, b.B) - Math.max(a.T, b.T);
    if (ox > 2 && oy > 3) issues.push(`text-overlap "${a.s}" x "${b.s}"`);
  }
  // line crossing text
  const segHit = (s, b) => {
    const [x1, y1] = s.a, [x2, y2] = s.b;
    const L = b.L + 1, R = b.R - 1, T = b.T + 2, B = b.B - 2;
    if (Math.max(x1, x2) < L || Math.min(x1, x2) > R || Math.max(y1, y2) < T || Math.min(y1, y2) > B) return false;
    // axis-aligned only in this kit
    if (x1 === x2) return x1 > L && x1 < R && Math.max(y1, y2) > T && Math.min(y1, y2) < B;
    if (y1 === y2) return y1 > T && y1 < B && Math.max(x1, x2) > L && Math.min(x1, x2) < R;
    return true;
  };
  for (const s of m.segs) for (const b of boxes) if (segHit(s, b)) issues.push(`line-crosses-text "${b.s}" seg ${s.a}->${s.b}`);

  const wide = m.vbW > 500;
  const widths = wide ? [710, 880] : [288, 328, 358];
  const display = Object.fromEntries(widths.map(w => [w, +(minFont * w / m.vbW).toFixed(2)]));
  const need = wide ? 14.5 : 13.0;
  if (display[widths[0]] < need) issues.push(`min display font ${display[widths[0]]} < ${need}`);
  results.push({ file: f, vb: `${m.vbW}x${m.vbH}`, minFont, display, texts: m.texts.length, font: m.texts[0]?.family, issues });
  await page.close();

  if (shots) {
    for (const w of widths) {
      const p2 = await browser.newPage({ viewport: { width: w + 32, height: 400 }, deviceScaleFactor: 2 });
      const html = `<body style="margin:0;padding:16px;background:#fff"><img src="${pathToFileURL(file).href}" width="${w}" style="display:block"></body>`;
      fs.writeFileSync(path.join(outDir, '_t.html'), html);
      await p2.goto(pathToFileURL(path.join(outDir, '_t.html')).href);
      await p2.waitForLoadState('load');
      await p2.screenshot({ path: path.join(outDir, `${f.replace('.svg', '')}-${w}.png`), fullPage: true });
      await p2.close();
    }
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir, 'metrics.json'), JSON.stringify(results, null, 2));
let bad = 0;
for (const r of results) {
  console.log(`${r.issues.length ? 'FAIL' : 'ok  '} ${r.file}  vb=${r.vb} minFont=${r.minFont} display=${JSON.stringify(r.display)} texts=${r.texts} font=${r.font}`);
  for (const i of r.issues) { console.log('     - ' + i); bad++; }
}
console.log(bad ? `\n${bad} issue(s)` : '\nall clean');
process.exit(bad ? 1 : 0);
