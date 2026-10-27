/* 용어사전 시각 설명 P0(B6-1) 미리보기·자동 QA.
 *
 * 실제 앱 빌드(dist)를 `npx vite preview --port 6431`로 띄운 상태에서 실행한다.
 * 각 용어 상세 화면의 '정확한 설명' 절 뒤에 현재 렌더러와 같은 마크업(.rich-figure > .rich-svg-scroll > .rich-svg)으로
 * 그림을 끼워 넣고 캡처한다. 저장소 코드는 바꾸지 않고 브라우저 안에서만 넣는다.
 *   desktop  : 1280px, desktop SVG, 현재 CSS 그대로 (폭 520 고정)
 *   mobile   : 390·360px, mobile SVG, 제안 CSS(폭 100%, 최대 520)를 그 그림에만 적용
 *   current  : 390px, desktop SVG, 현재 CSS 그대로 (가로 스크롤 확인용)
 * 결과: ../preview/*.png, ../preview/qa-results.json
 * 실행: 저장소 루트에서 node drafts/glossary-visual/b6-1-p0/_tools/preview.cjs
 */
const { chromium } = require(require('path').join(process.cwd(), 'node_modules/playwright'));
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:6431/';
const DIR = path.join(__dirname, '..');
const ASSETS = path.join(DIR, 'assets');
const OUT = path.join(DIR, 'preview');
const FIGS = [
  { key: 'erd', file: 'erd-basics', term: 'erd', caption: 'ERD 읽기 — 상자는 표, 선은 관계, 선 끝 기호는 최소·최대 개수 (B6-1 사례 일부)' },
  { key: 'pk-fk', file: 'pk-fk-relationship', term: 'foreign-key', caption: 'FK 값이 다른 표의 PK 값을 가리킨다 (B6-1 사례 일부, 거부 행은 교육용 예시)' },
  { key: 'join', file: 'join-inner-left', term: 'join', caption: '같은 데이터에서 INNER JOIN과 LEFT JOIN의 결과 비교 (B6-1 사례 일부)' },
];
const THEMES = ['forest', 'indigo', 'paper', 'signal'];

function luminance(rgb) {
  const [r, g, b] = rgb.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); }

async function inject(page, svg, caption, mobileCss) {
  await page.evaluate(({ svg, caption, mobileCss }) => {
    document.querySelectorAll('[data-gv-preview]').forEach(e => e.remove());
    const h2 = [...document.querySelectorAll('main h2')].find(e => e.textContent.trim() === '정확한 설명');
    const anchor = h2.closest('section') || h2.parentElement;
    const fig = document.createElement('figure');
    fig.className = 'rich-figure'; fig.dataset.gvPreview = '1';
    fig.innerHTML = `<div class="rich-svg-scroll"><div class="rich-svg">${svg}</div></div><figcaption>${caption}</figcaption>`;
    if (mobileCss) {
      fig.querySelector('.rich-svg').style.minWidth = '0';
      const s = fig.querySelector('svg'); s.style.width = '100%'; s.style.maxWidth = '520px';
    }
    anchor.after(fig);
    fig.scrollIntoView({ block: 'start' });
  }, { svg, caption, mobileCss });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
}

async function measure(page) {
  return page.evaluate(() => {
    const fig = document.querySelector('[data-gv-preview]');
    const svg = fig.querySelector('svg');
    const vb = svg.viewBox.baseVal;
    const scale = svg.getBoundingClientRect().width / vb.width;
    const texts = [...svg.querySelectorAll('text')].filter(t => t.textContent.trim());
    const boxes = texts.map(t => { const b = t.getBBox(); return { s: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height, fs: parseFloat(t.getAttribute('font-size')) }; });
    const outside = boxes.filter(b => b.x < 2 || b.y < 2 || b.x + b.w > vb.width - 2 || b.y + b.h > vb.height - 2).map(b => b.s);
    const overlaps = [];
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], c = boxes[j];
      const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x), oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
      if (ox > 1 && oy > 2) overlaps.push([a.s, c.s]);
    }
    // 표 칸(rect)에서 글자가 넘치는지: 글자 시작점을 포함하는 가장 작은 상자 rect 기준
    const rects = [...svg.querySelectorAll('rect.box, rect.note')].map(r => r.getBBox());
    const spill = boxes.filter(b => {
      const host = rects.filter(r => b.x >= r.x && b.x <= r.x + r.width && b.y + b.h / 2 >= r.y && b.y + b.h / 2 <= r.y + r.height)
        .sort((p, q) => p.width * p.height - q.width * q.height)[0];
      return host && b.x + b.w > host.x + host.width - 2;
    }).map(b => b.s);
    const parse = c => (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
    const bg = parse(getComputedStyle(svg.querySelector('rect.bg')).fill);
    const soft = parse(getComputedStyle(svg.querySelector('rect.note, rect.head')).fill);
    const fills = {};
    texts.forEach(t => { const f = getComputedStyle(t).fill; if (!t.classList.contains('on')) fills[f] = parse(f); });
    const scroll = fig.querySelector('.rich-svg-scroll');
    return {
      viewBox: [vb.width, vb.height], renderedWidth: Math.round(svg.getBoundingClientRect().width), scale: +scale.toFixed(3),
      minFontPx: +(Math.min(...boxes.map(b => b.fs)) * scale).toFixed(1),
      textCount: boxes.length, outside, overlaps, spill,
      figureScrolls: scroll.scrollWidth > scroll.clientWidth + 1,
      pageOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      fills, bg, soft,
    };
  });
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const results = {};
  const browser = await chromium.launch();
  const runs = [];
  for (const f of FIGS) {
    runs.push({ fig: f, name: `${f.key}-desktop`, variant: 'desktop', vw: 1280, theme: 'forest', mobileCss: false });
    runs.push({ fig: f, name: `${f.key}-mobile`, variant: 'mobile', vw: 390, theme: 'forest', mobileCss: true });
    runs.push({ fig: f, name: `qa/${f.key}-mobile-360`, variant: 'mobile', vw: 360, theme: 'forest', mobileCss: true });
    runs.push({ fig: f, name: `qa/${f.key}-current-renderer-390`, variant: 'desktop', vw: 390, theme: 'forest', mobileCss: false });
    for (const t of THEMES.slice(1)) runs.push({ fig: f, name: `qa/${f.key}-desktop-${t}`, variant: 'desktop', vw: 1280, theme: t, mobileCss: false });
    runs.push({ fig: f, name: `qa/${f.key}-desktop-os-dark`, variant: 'desktop', vw: 1280, theme: 'forest', mobileCss: false, dark: true });
  }
  fs.mkdirSync(path.join(OUT, 'qa'), { recursive: true });
  for (const r of runs) {
    const ctx = await browser.newContext({ viewport: { width: r.vw, height: 900 }, deviceScaleFactor: 2, colorScheme: r.dark ? 'dark' : 'light' });
    const page = await ctx.newPage();
    await page.goto(`${BASE}#/terms/${r.fig.term}`);
    await page.waitForSelector('main h2');
    await page.evaluate(t => document.documentElement.setAttribute('data-accent-theme', t), r.theme);
    const svg = fs.readFileSync(path.join(ASSETS, `${r.fig.file}-${r.variant}.svg`), 'utf8');
    await inject(page, svg, r.fig.caption, r.mobileCss);
    const m = await measure(page);
    const minContrast = Object.entries(m.fills).map(([k, c]) => ({ fill: k, onBg: +contrast(c, m.bg).toFixed(2), onSoft: +contrast(c, m.soft).toFixed(2) }));
    delete m.fills;
    results[r.name] = { term: r.fig.term, svg: `${r.fig.file}-${r.variant}.svg`, viewport: r.vw, theme: r.theme, osDark: !!r.dark, ...m, contrast: minContrast };
    await (await page.$('[data-gv-preview]')).screenshot({ path: path.join(OUT, `${r.name}.png`) });
    await ctx.close();
  }
  // SVG 문법: 브라우저 XML 파서로 확인
  const page = await browser.newPage();
  const syntax = {};
  for (const file of fs.readdirSync(ASSETS).filter(n => n.endsWith('.svg'))) {
    const src = fs.readFileSync(path.join(ASSETS, file), 'utf8');
    syntax[file] = await page.evaluate(s => {
      const d = new DOMParser().parseFromString(s, 'image/svg+xml');
      const err = d.querySelector('parsererror');
      const root = d.documentElement;
      const vb = (root.getAttribute('viewBox') || '').split(/\s+/).map(Number);
      const ids = [...d.querySelectorAll('[id]')].map(e => e.id);
      return { parseError: err ? err.textContent.slice(0, 200) : null, viewBox: vb, viewBoxMatchesSize: vb[2] === +root.getAttribute('width') && vb[3] === +root.getAttribute('height'),
        role: root.getAttribute('role'), labelledby: root.getAttribute('aria-labelledby'), ids, uniqueIds: new Set(ids).size === ids.length };
    }, src);
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, 'qa-results.json'), JSON.stringify({ generated: new Date().toISOString(), syntax, renders: results }, null, 2) + '\n');
  const bad = Object.entries(results).filter(([, v]) => v.outside.length || v.overlaps.length || v.spill.length || v.pageOverflow);
  console.log('renders', Object.keys(results).length, 'with layout issues', bad.length);
  for (const [k, v] of bad) console.log(k, JSON.stringify({ outside: v.outside, overlaps: v.overlaps, spill: v.spill, pageOverflow: v.pageOverflow }));
  for (const [k, v] of Object.entries(syntax)) if (v.parseError || !v.viewBoxMatchesSize || !v.uniqueIds) console.log('SYNTAX', k, JSON.stringify(v));
})();
