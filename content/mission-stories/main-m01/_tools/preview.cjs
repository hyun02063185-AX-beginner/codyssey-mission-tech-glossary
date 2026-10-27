// B1-1 미션 스토리 미리보기·검사. 실제 웹 렌더러가 아니라, PresentationSurface(Dark 기본)를 흉내 낸 정적 화면이다.
// 1) 그림 검사: 모든 SVG·상태에서 글자가 상자·뷰박스 밖으로 나가거나 서로 겹치는지, 표시 폭에서 최소 글자 크기(14px)를 넘는지.
// 2) 원고 대조: screens.json의 질문·메시지·캡션·칩 문구가 storyboard-v0.2.md에 그대로 있는지,
//    개념지도 ID가 설계 문서에 있는지, 용어 ID가 용어사전에 있는지, 캡처·그림 파일이 있는지.
// 3) 미리보기: 인트로 + 12화면을 PC 1280×720(Dark·Light)·모바일 390×844로 그려 ../preview/ 에 저장하고,
//    실제 화면에서 넘침(세로·가로)과 그림 글자의 실제 표시 크기를 잰다.
// 실행: node preview.cjs [--check-only]   (PLAYWRIGHT=<playwright 경로>, CHROME=<브라우저 경로>)
const path = require('path');
const fs = require('fs');
const os = require('os');

const ROOT = path.resolve(__dirname, '../../../..');
const STORY = path.resolve(__dirname, '..');
const ASSETS = path.join(STORY, 'assets');
const CAPTURES = path.join(ASSETS, 'captures');
const OUT = path.join(STORY, 'preview');
const FONT = path.join(ROOT, 'src/assets/fonts/PretendardVariable.woff2');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'screens.json'), 'utf8'));
const MIN_PX = 14;
// 그림이 화면에 보이는 최소 폭(px). 데스크톱 1280 강의 화면, 모바일 360px 화면 기준.
const SHOWN = { desktop: 900, mobile: 328, 'f5-dom-desktop.svg': 480 };
const LIGHT = ['S1-2', 'S3-2', 'S4-1'];

const svgText = name => fs.readFileSync(path.join(ASSETS, name), 'utf8');
const withState = (name, state) => svgText(name).replace(/data-state="[^"]*"/, `data-state="${state}"`);

const TOKENS = `
  :root{--presentation-bg:#111827;--presentation-panel:#1d2736;--presentation-ink:#eef2f7;--presentation-muted:#bdc8d7;--presentation-line:#64748b;--presentation-chip:#293549;--presentation-accent:#ffad86;--presentation-accent-soft:#4b2c26;--presentation-python:#9cc8ff;--presentation-python-soft:#203957;--presentation-app:#86dfb0;--presentation-app-soft:#183f32;--presentation-real:#edcf8e;--presentation-real-soft:#403622;--presentation-on-strong:#111827}
  :root[data-theme=light]{--presentation-bg:#fbfaf7;--presentation-panel:#fff;--presentation-ink:#14161a;--presentation-muted:#5e626b;--presentation-line:#d9d7d0;--presentation-chip:#eeece6;--presentation-accent:#b83d0b;--presentation-accent-soft:#fdebe1;--presentation-python:#1f5fbf;--presentation-python-soft:#e3ecfa;--presentation-app:#0b7a55;--presentation-app-soft:#ddf2e9;--presentation-real:#6b4e16;--presentation-real-soft:#f6eedc;--presentation-on-strong:#fff}`;

function page(screen, mobile, theme) {
  const intro = !screen.scene;
  const scene = intro ? null : data.scenes[screen.scene];
  const fig = screen[mobile ? 'mobile' : 'desktop'];
  const caps = (screen.captures || []).map(([src, label]) => `<figure class="shot ${src.includes('mobile') ? 'tall' : ''}">
      <div class="bar"><i></i><i></i><i></i><span>교육용 예시 페이지</span></div>
      <img src="file://${path.join(CAPTURES, src)}" alt=""><figcaption>${label}</figcaption></figure>`).join('');
  const stack = (screen.captures || []).length > 1 && (screen.captures || []).some(([src]) => !src.includes('mobile'));
  const body = `${caps ? `<div class="caps ${stack ? 'stack' : ''}">${caps}</div>` : ''}${fig ? `<div class="fig">${withState(fig[0], fig[1])}</div>` : ''}`;
  const head = intro
    ? `<p class="scene"><b>${data.intro.code}</b> · 미션 스토리 인트로</p><h1>${data.intro.title}</h1><p class="q">핵심 질문 · ${data.intro.question}</p>`
    : `<p class="scene"><b>Scene ${screen.scene}</b> · ${scene.title} — ${scene.role}</p><p class="q">${screen.id} · ${screen.question}</p><h1>${screen.message}</h1><p class="cap">${screen.caption}</p>`;
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Pretendard Variable';src:url('file://${FONT}') format('woff2');font-weight:45 920}${TOKENS}
  *{box-sizing:border-box}body{margin:0;background:var(--presentation-bg);color:var(--presentation-ink);font-family:'Pretendard Variable',sans-serif}
  .gnb{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid var(--presentation-line);font-size:14px;color:var(--presentation-muted)}
  .gnb b{color:var(--presentation-ink)}main{padding:12px 32px 16px;display:flex;flex-direction:column;height:calc(100vh - 52px)}
  .m main{height:auto;padding:14px 16px 24px}
  .scene{margin:0;font-size:15px;color:var(--presentation-muted)}.scene b{color:var(--presentation-accent)}
  .q{margin:4px 0 0;font-size:16px;color:var(--presentation-muted)}
  h1{margin:4px 0 2px;font-size:30px;line-height:1.25}.m h1{font-size:23px}
  .cap{margin:0 0 10px;font-size:18px;color:var(--presentation-muted)}.m .cap{font-size:16px}
  .stage{flex:1;min-height:0;display:flex;gap:24px;align-items:stretch;justify-content:center;position:relative}
  .m .stage{flex-direction:column;gap:16px}.m .stage .fig,.m .stage .caps{flex:0 0 auto}
  .fig{flex:1 1 0;min-width:0;min-height:0;display:flex;justify-content:center;align-items:center}
  .fig svg{max-width:100%;max-height:100%;height:auto;width:auto}.m .fig svg{width:100%;height:auto}
  .caps{display:flex;gap:16px;min-height:0;justify-content:center;flex:0 1 auto}
  .caps:only-child{flex:1}.stage.both .caps{flex:0 0 46%}.stage.both .shot{flex:1 1 0}.m .stage.both .caps{flex:0 0 auto}.m .caps{gap:10px}
  .shot{margin:0;display:flex;flex-direction:column;min-height:0;min-width:0;border:2px solid var(--presentation-line);border-radius:10px;overflow:hidden;background:var(--presentation-panel)}
  .shot img{display:block;align-self:center;min-height:0;max-width:100%;width:auto;object-fit:contain;flex:1 1 auto}
  .shot .bar{display:flex;align-items:center;gap:6px;height:26px;padding:0 10px;background:var(--presentation-chip);font-size:13px;color:var(--presentation-muted)}
  .shot .bar i{width:9px;height:9px;border-radius:50%;background:var(--presentation-line)}.shot .bar span{margin-left:8px}
  .shot figcaption{padding:8px 12px;font-size:17px;font-weight:700;border-top:1px solid var(--presentation-line)}
  .m .shot figcaption{font-size:15px;padding:6px 8px}
  .m .caps .shot{flex:1 1 0}.m .caps .shot img{max-height:none;width:100%}.m .caps.stack{flex-direction:column}.m .caps.stack .shot{flex:0 0 auto}.m .caps.stack .shot.tall img{width:auto;max-width:100%;max-height:440px}
  .chip{position:absolute;left:50%;bottom:4px;transform:translateX(-50%);padding:8px 18px;border-radius:999px;border:2px solid var(--presentation-accent);background:var(--presentation-accent-soft);font-size:18px;font-weight:700;white-space:nowrap}
  .m .chip{position:static;transform:none;align-self:flex-start;white-space:normal;font-size:15px}
  .has-chip .caps{padding-bottom:52px}.m.has-chip .caps{padding-bottom:0}
  .foot{margin:6px 0 0;font-size:13px;color:var(--presentation-muted)}
  </style></head><body class="${mobile ? 'm' : ''} ${screen.chip ? 'has-chip' : ''}"><div class="gnb"><span>← 소개</span><b>B1-1 · 미션 스토리 (미리보기)</b><span>학습자료 ☰</span></div>
  <main>${head}<div class="stage ${caps && fig ? 'both' : ''}">${body}${screen.chip ? `<p class="chip">${screen.chip}</p>` : ''}</div>
  <p class="foot">${intro ? '인트로' : screen.id} · 교육용 예시 페이지 (실제 교육생 프로젝트 아님)</p></main></body></html>`;
}

async function checkFigures(browser) {
  const problems = [];
  const p = await browser.newPage();
  for (const file of fs.readdirSync(ASSETS).filter(f => f.endsWith('.svg'))) {
    const src = svgText(file);
    const states = src.match(/data-states="([^"]*)"/)[1].split(' ');
    const shown = SHOWN[file] || SHOWN[file.includes('mobile') ? 'mobile' : 'desktop'];
    for (const state of states) {
      await p.setContent(`<style>@font-face{font-family:'Pretendard Variable';src:url('file://${FONT}')}</style>${withState(file, state)}`);
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => {
        const svg = document.querySelector('svg'); const vb = svg.viewBox.baseVal;
        const visible = el => { for (let e = el; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; };
        const items = [...svg.querySelectorAll('text')].filter(t => t.getComputedTextLength() > 0 && visible(t))
          .map(t => { const b = t.getBBox(); return { s: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height, size: +t.getAttribute('font-size'), deco: !!t.closest('[class*="-deco"]') || t.classList.contains('b11s-deco') }; });
        const boxes = [...svg.querySelectorAll('rect[class*="-box"],rect[class*="-tag"]')].filter(visible).map(r => r.getBBox());
        const spill = items.filter(a => !a.deco).filter(a => {
          const inside = boxes.filter(b => a.x >= b.x - 1 && a.x <= b.x + b.width && a.y + a.h / 2 >= b.y && a.y + a.h / 2 <= b.y + b.height)
            .sort((p, q) => p.width * p.height - q.width * q.height)[0];
          return inside && a.x + a.w > inside.x + inside.width - 6;
        }).map(a => a.s);
        return { vb: [vb.width, vb.height], items, spill };
      });
      const [W, H] = r.vb;
      for (const t of r.spill) problems.push(`${file}[${state}] 상자 밖으로 넘침: "${t}"`);
      for (const a of r.items) {
        if (a.x < 0 || a.y < 0 || a.x + a.w > W || a.y + a.h > H) problems.push(`${file}[${state}] 뷰박스 밖: "${a.s}"`);
        const px = a.size * shown / W;
        if (px < MIN_PX && !a.deco) problems.push(`${file}[${state}] 작은 글자 ${px.toFixed(1)}px: "${a.s}"`);
      }
      for (let i = 0; i < r.items.length; i++) for (let j = i + 1; j < r.items.length; j++) {
        const a = r.items[i], b = r.items[j];
        if (a.deco && b.deco) continue;
        const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x), oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
        if (ox > 1 && oy > 3) problems.push(`${file}[${state}] 글자 겹침: "${a.s}" / "${b.s}"`);
      }
    }
  }
  await p.close();
  return problems;
}

function checkText() {
  const problems = [];
  const sb = path.join(STORY, 'storyboard-v0.2.md');
  const storyboard = fs.existsSync(sb) ? fs.readFileSync(sb, 'utf8') : '';
  if (!storyboard) problems.push('storyboard-v0.2.md 없음');
  const mapDoc = fs.readFileSync(path.join(STORY, 'three-pillars-concept-map-design-v0.1.md'), 'utf8');
  const mapIds = new Set([...mapDoc.matchAll(/^\| ([NRCE]\d\d) \|/gm)].map(m => m[1]));
  const glossary = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/curated/glossary-master-v0.1.yaml'), 'utf8')).terms.map(t => t.id));
  const chapters = { Ch1: '01', Ch2: '02', Ch3: '03', Ch4: '04', Ch8: '08', '전체 통합': '09' };
  const chapterFiles = fs.readdirSync(path.join(ROOT, 'content/mission-guides/main-m01/chapters'));
  for (const t of [data.intro.title, data.intro.question]) if (!storyboard.includes(t)) problems.push(`인트로 문구 불일치: ${t}`);
  for (const sc of Object.values(data.scenes)) if (!storyboard.includes(sc.title)) problems.push(`Scene 제목 불일치: ${sc.title}`);
  for (const s of data.screens) {
    for (const t of [s.title, s.question, s.message, s.caption, s.chip, ...(s.captures || []).map(c => c[1])].filter(Boolean))
      if (!storyboard.includes(t)) problems.push(`${s.id}: 스토리보드에 없는 문구 "${t}"`);
    for (const id of s.map) if (!mapIds.has(id)) problems.push(`${s.id}: 개념지도 설계에 없는 ID ${id}`);
    for (const id of s.terms) if (!glossary.has(id)) problems.push(`${s.id}: 용어사전에 없는 ID ${id}`);
    for (const g of s.guide) if (!chapterFiles.some(f => f.startsWith(chapters[g] + '-'))) problems.push(`${s.id}: 가이드 장 ${g} 없음`);
    for (const [src] of s.captures || []) if (!fs.existsSync(path.join(CAPTURES, src))) problems.push(`${s.id}: 캡처 없음 ${src}`);
    for (const k of ['desktop', 'mobile']) if (s[k] && !fs.existsSync(path.join(ASSETS, s[k][0]))) problems.push(`${s.id}: 그림 없음 ${s[k][0]}`);
    if (!s.desktop && !s.captures) problems.push(`${s.id}: 핵심 시각 자료 없음`);
  }
  if (data.screens.length !== 12) problems.push(`화면 수 ${data.screens.length} (12여야 함)`);
  return problems;
}

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT || path.join(ROOT, 'node_modules/playwright'));
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });
  const problems = [...checkText(), ...await checkFigures(browser)];
  console.log(problems.length ? problems.map(s => '✗ ' + s).join('\n') : 'check: PASS (그림 글자 범위·겹침·최소 크기 · 원고 대조 · 지도/용어/가이드/캡처 참조)');
  if (!process.argv.includes('--check-only')) {
    fs.mkdirSync(OUT, { recursive: true });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'b11-preview-'));
    const report = [];
    const all = [{ id: 'intro', ...data.intro }, ...data.screens];
    for (const s of all) {
      const runs = [['pc', { width: 1280, height: 720 }, 'dark'], ['mobile', { width: 390, height: 844 }, 'dark']];
      if (LIGHT.includes(s.id)) runs.push(['pc-light', { width: 1280, height: 720 }, 'light']);
      for (const [kind, vp, theme] of runs) {
        const pg = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
        const html = path.join(tmp, `${kind}-${s.id}.html`);
        fs.writeFileSync(html, page(s, kind === 'mobile', theme));
        await pg.goto('file://' + html);
        await pg.evaluate(() => document.fonts.ready);
        await pg.waitForFunction(() => [...document.images].every(i => i.complete));
        const m = await pg.evaluate(() => {
          const svg = document.querySelector('.fig svg');
          let minPx = null;
          if (svg) {
            const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
            const visible = el => { for (let e = el; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; };
            const sizes = [...svg.querySelectorAll('text')].filter(t => visible(t) && !t.closest('[class*="-deco"]') && t.getComputedTextLength() > 0).map(t => +t.getAttribute('font-size') * k);
            minPx = Math.min(...sizes);
          }
          const imgs = [...document.querySelectorAll('.shot img')].map(i => Math.round(i.getBoundingClientRect().width));
          return { h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth, minPx, imgs };
        });
        if (kind !== 'mobile' && m.h > vp.height) problems.push(`${s.id} ${kind}: 1280×720 세로 넘침 ${m.h}px`);
        if (m.w > vp.width) problems.push(`${s.id} ${kind}: 가로 넘침 ${m.w}px`);
        if (m.minPx !== null && m.minPx < MIN_PX) problems.push(`${s.id} ${kind}: 그림 글자 실제 ${m.minPx.toFixed(1)}px`);
        report.push(`${s.id.padEnd(5)} ${kind.padEnd(8)} 높이 ${String(m.h).padStart(4)}px · 그림 최소 글자 ${m.minPx === null ? '  —' : m.minPx.toFixed(1) + 'px'} · 캡처 폭 ${m.imgs.join('/') || '—'}`);
        await pg.screenshot({ path: path.join(OUT, `${kind}-${s.id}.png`), fullPage: kind === 'mobile' });
        await pg.close();
      }
    }
    console.log(report.join('\n'));
    console.log(problems.length ? '\n' + problems.map(s => '✗ ' + s).join('\n') : '\npreview: PASS (1280×720 넘침 없음 · 모바일 가로 넘침 없음 · 그림 글자 14px 이상)');
    console.log(`preview → ${path.relative(ROOT, OUT)}/`);
  }
  await browser.close();
  if (problems.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
