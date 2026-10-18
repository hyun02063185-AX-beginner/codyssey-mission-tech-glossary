// Usage (from the repo root): node reports/b6-1-content-qa/tools/render_chapters.mjs <guideDir> <outDir> <svgMetrics.json> [--no-shots]
// Renders every chapter with react-markdown (same pipeline as the B2-1 guide viewer) inside an approximation of the
// guide layout (16px side gutters, vertical figures <= 420px, tables/code scroll inside wrappers) and measures it at
// 320 / 360 / 390 / 1024 px: page overflow, figure display size, displayed SVG font size, scroll-needing tables/code.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const REPO = process.env.REPO ?? process.cwd(); // glossary repo root
const require = createRequire(REPO + '/package.json');
const { chromium } = require('playwright');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { default: Markdown } = await import(pathToFileURL(REPO + '/node_modules/react-markdown/index.js').href);
const { default: remarkGfm } = await import(pathToFileURL(REPO + '/node_modules/remark-gfm/index.js').href);
const { default: rehypeSlug } = await import(pathToFileURL(REPO + '/node_modules/rehype-slug/index.js').href);

const [guideDir, outDir, metricsFile, ...flags] = process.argv.slice(2);
const shots = !flags.includes('--no-shots');
fs.mkdirSync(outDir, { recursive: true });
const metrics = Object.fromEntries(JSON.parse(fs.readFileSync(metricsFile, 'utf8')).map(m => [m.file, m]));
const chapters = fs.readdirSync(path.join(guideDir, 'chapters')).filter(f => f.endsWith('.md')).sort();
const h = React.createElement;

const CSS = `
*{box-sizing:border-box}
body{margin:0;font:16px/1.75 'Noto Sans KR','Nanum Gothic','Malgun Gothic',sans-serif;color:#1d2d29;background:#fff;word-break:keep-all;overflow-wrap:anywhere}
.page{padding:16px}
article{max-width:710px;margin:0 auto}
h1{font-size:24px;line-height:1.4} h2{font-size:20px;margin-top:32px;border-top:1px solid #d5e0d9;padding-top:16px} h3{font-size:17px}
img{max-width:100%;height:auto;display:block;margin:12px auto}
img.vertical{max-width:420px;width:100%} img.wide{width:100%}
@media(max-width:1023px){img.wide{display:none}}
@media(min-width:1024px){picture img.vertical{max-width:100%}}
.guide-table{overflow-x:auto;margin:12px 0}
table{border-collapse:collapse;font-size:15px} th,td{border:1px solid #d5e0d9;padding:6px 10px;vertical-align:top;text-align:left}
pre{overflow-x:auto;background:#f2f5f3;padding:12px;font:13px/1.5 'D2Coding',Consolas,monospace;border-radius:8px}
code{font:0.92em 'D2Coding',Consolas,monospace;background:#eef2ef;padding:1px 4px;border-radius:4px}
pre code{background:none;padding:0}
blockquote{margin:12px 0;padding:4px 14px;border-left:4px solid #7cc29a;background:#f3f8f5}
`;

function pageHtml(md, chapterFile) {
  const el = h(Markdown, {
    remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug],
    components: {
      img: ({ src = '', alt = '' }) => {
        const name = src.split('/').pop();
        const isWide = name.endsWith('-wide.svg');
        const isOverview = name === 'v10-database-overview.svg';
        const url = pathToFileURL(path.join(guideDir, 'assets', name)).href;
        if (isOverview) {
          const wide = pathToFileURL(path.join(guideDir, 'assets', 'v10-database-overview-wide.svg')).href;
          return h('picture', null, h('source', { media: '(min-width: 1024px)', srcSet: wide }), h('img', { src: url, alt, className: 'vertical', 'data-name': name }));
        }
        return h('img', { src: url, alt, className: isWide ? 'wide' : 'vertical', 'data-name': name });
      },
      table: ({ children }) => h('div', { className: 'guide-table', role: 'region', tabIndex: 0 }, h('table', null, children)),
      pre: ({ children }) => h('pre', { tabIndex: 0 }, children),
    },
  }, md);
  return `<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${CSS}</style><body><div class="page"><article>${renderToStaticMarkup(el)}</article></div></body></html>`;
}

const browser = await chromium.launch();
const report = [];
for (const f of chapters) {
  const md = fs.readFileSync(path.join(guideDir, 'chapters', f), 'utf8');
  const htmlPath = path.join(outDir, f.replace('.md', '.html'));
  fs.writeFileSync(htmlPath, pageHtml(md, f));
  for (const W of [320, 360, 390, 1024]) {
    const page = await browser.newPage({ viewport: { width: W, height: 800 }, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(htmlPath).href);
    await page.evaluate(() => Promise.all([document.fonts.ready, ...Array.from(document.images).map(i => i.decode().catch(() => {}))]));
    const m = await page.evaluate(() => {
      const imgs = Array.from(document.images).map(i => ({ name: i.dataset.name, src: i.currentSrc.split('/').pop(), w: i.getBoundingClientRect().width, h: i.getBoundingClientRect().height, ok: i.naturalWidth > 0 }));
      const tables = Array.from(document.querySelectorAll('.guide-table')).map(t => ({ scroll: t.scrollWidth > t.clientWidth + 1, sw: t.scrollWidth, cw: t.clientWidth }));
      const pres = Array.from(document.querySelectorAll('pre')).map(t => ({ scroll: t.scrollWidth > t.clientWidth + 1, sw: t.scrollWidth, cw: t.clientWidth, first: t.textContent.split('\n')[0].slice(0, 30) }));
      return { scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth, imgs, tables, pres, height: document.documentElement.scrollHeight };
    });
    const figs = m.imgs.filter(i => i.w > 0).map(i => {
      const base = metrics[i.src] || metrics[i.name];
      const vbW = base ? +base.vb.split('x')[0] : null;
      return { src: i.src, renderedWidth: +i.w.toFixed(1), ok: i.ok, minDisplayFontPx: base ? +(base.minFont * i.w / vbW).toFixed(2) : null };
    });
    report.push({
      chapter: f, width: W, pageOverflow: m.scrollWidth > m.innerWidth + 1, scrollWidth: m.scrollWidth, pageHeight: m.height,
      figures: figs, tablesNeedingScroll: m.tables.filter(t => t.scroll).length, tables: m.tables.length,
      codeNeedingScroll: m.pres.filter(t => t.scroll).map(t => t.first), codeBlocks: m.pres.length,
    });
    if (shots) await page.screenshot({ path: path.join(outDir, `${f.replace('.md', '')}-${W}.png`), fullPage: true });
    await page.close();
  }
}
await browser.close();
fs.writeFileSync(path.join(outDir, 'chapter-metrics.json'), JSON.stringify(report, null, 2));

let bad = 0;
for (const r of report) {
  const minF = Math.min(...r.figures.map(x => x.minDisplayFontPx ?? 99));
  const broken = r.figures.filter(x => !x.ok).length;
  const need = r.width >= 1024 ? 14.5 : 13;
  const issues = [];
  if (r.pageOverflow) issues.push(`page overflow ${r.scrollWidth}>${r.width}`);
  if (broken) issues.push(`${broken} broken images`);
  if (minF < need) issues.push(`min figure font ${minF} < ${need}`);
  if (issues.length) bad++;
  console.log(`${issues.length ? 'FAIL' : 'ok  '} ${r.chapter} @${r.width}: figs=${r.figures.length} minFigFont=${minF} tables(scroll ${r.tablesNeedingScroll}/${r.tables}) code(scroll ${r.codeNeedingScroll.length}/${r.codeBlocks}) h=${r.pageHeight} ${issues.join('; ')}`);
}
console.log(bad ? `\n${bad} failing (chapter,width) pair(s)` : '\nall clean');
process.exit(bad ? 1 : 0);
