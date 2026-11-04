// B3-2 미션 스토리 미리보기·검사. 실제 웹 렌더러가 아니라, PresentationSurface(Dark 기본)를 흉내 낸 정적 화면이다.
// 1) 그림 검사: 모든 SVG·상태에서 글자가 상자·뷰박스 밖으로 나가거나 서로 겹치는지, 표시 폭에서 최소 글자 크기(14px)를 넘는지.
// 2) 원고 대조: screens.json의 제목·질문·메시지·캡션이 storyboard-v0.1.md에 그대로 있는지, 용어 ID가 용어사전에 있는지,
//    B3-2 학습가이드 장이 있는지, 그림 파일이 있는지, 화면 수가 4 Scene × 2인지.
// 3) 근거 대조: 그림에 쓴 실제 값(문맥 글자 수 · 실습 메모 줄 · returncode 128 · How to Test 고정 문구)이 ../assets/evidence/ 와 같은지,
//    그림·근거 파일에 API 키처럼 보이는 문자열이 없는지.
// 4) 미리보기: 인트로 + 8화면을 PC 1280×720(Dark·일부 Light)·모바일 390×844로 그려 ../preview/ 에 저장하고,
//    실제 화면에서 넘침(세로·가로)과 그림 글자의 실제 표시 크기를 잰다.
// 실행: node preview.cjs [--check-only]   (PLAYWRIGHT=<playwright 경로>, CHROME=<브라우저 경로>, B32=<Codyssey_B3-2 경로>)
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '../../../..');
const STORY = path.resolve(__dirname, '..');
const ASSETS = path.join(STORY, 'assets');
const EVIDENCE = path.join(ASSETS, 'evidence');
const OUT = path.join(STORY, 'preview');
const FONT = pathToFileURL(path.join(ROOT, 'src/assets/fonts/PretendardVariable.woff2')).href;
const B32 = process.env.B32 || path.resolve(ROOT, '..', 'Codyssey_B3-2');
const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => fs.existsSync(p));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'screens.json'), 'utf8'));
const MIN_PX = 14;
// 그림이 화면에 보이는 최소 폭(px). 데스크톱 1280 강의 화면, 모바일 360px 화면 기준(build_figures.py와 같은 값).
const SHOWN = { desktop: 900, mobile: 328 };
const LIGHT = ['S1-2', 'S3-2', 'S4-2'];

const svgText = name => fs.readFileSync(path.join(ASSETS, name), 'utf8');
const withState = (name, state) => svgText(name).replace(/data-state="[^"]*"/, `data-state="${state}"`);
const evidence = name => fs.readFileSync(path.join(EVIDENCE, name), 'utf8');

const TOKENS = `
  :root{--presentation-bg:#111827;--presentation-panel:#1d2736;--presentation-ink:#eef2f7;--presentation-muted:#bdc8d7;--presentation-line:#64748b;--presentation-chip:#293549;--presentation-accent:#ffad86;--presentation-accent-soft:#4b2c26;--presentation-python:#9cc8ff;--presentation-python-soft:#203957;--presentation-app:#86dfb0;--presentation-app-soft:#183f32;--presentation-real:#edcf8e;--presentation-real-soft:#403622;--presentation-on-strong:#111827}
  :root[data-theme=light]{--presentation-bg:#fbfaf7;--presentation-panel:#fff;--presentation-ink:#14161a;--presentation-muted:#5e626b;--presentation-line:#d9d7d0;--presentation-chip:#eeece6;--presentation-accent:#b83d0b;--presentation-accent-soft:#fdebe1;--presentation-python:#1f5fbf;--presentation-python-soft:#e3ecfa;--presentation-app:#0b7a55;--presentation-app-soft:#ddf2e9;--presentation-real:#6b4e16;--presentation-real-soft:#f6eedc;--presentation-on-strong:#fff}`;

function page(screen, mobile, theme) {
  const intro = !screen.scene;
  const scene = intro ? null : data.scenes[screen.scene];
  const fig = screen[mobile ? 'mobile' : 'desktop'];
  const journey = screen.journey ? `<div class="journey">${withState(`f0-journey-${mobile ? 'mobile' : 'desktop'}.svg`, screen.journey)}</div>` : '';
  const head = intro
    ? `<p class="scene"><b>${data.intro.code}</b> · 미션 스토리 인트로</p><h1>${data.intro.title}</h1><p class="q">핵심 질문 · ${data.intro.question}</p>`
    : `<p class="scene"><b>Scene ${screen.scene}</b> · ${scene.title}</p><p class="q">${screen.id} · ${screen.title}</p><h1>${screen.message}</h1><p class="cap">${screen.caption}</p>`;
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><style>
  @font-face{font-family:'Pretendard Variable';src:url('${FONT}') format('woff2');font-weight:45 920}${TOKENS}
  *{box-sizing:border-box}body{margin:0;background:var(--presentation-bg);color:var(--presentation-ink);font-family:'Pretendard Variable',sans-serif}
  .gnb{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid var(--presentation-line);font-size:14px;color:var(--presentation-muted)}
  .gnb b{color:var(--presentation-ink)}main{padding:12px 32px 16px;display:flex;flex-direction:column;height:calc(100vh - 52px)}
  .m main{height:auto;padding:14px 16px 24px}
  .scene{margin:0;font-size:15px;color:var(--presentation-muted)}.scene b{color:var(--presentation-accent)}
  .q{margin:4px 0 0;font-size:16px;color:var(--presentation-muted)}
  h1{margin:4px 0 2px;font-size:30px;line-height:1.25}.m h1{font-size:23px}
  .cap{margin:0 0 10px;font-size:18px;color:var(--presentation-muted)}.m .cap{font-size:16px}
  .stage{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px;align-items:center}
  .journey{flex:0 0 auto;width:100%;display:flex;justify-content:center}.journey svg{width:100%;max-width:1060px;height:auto}
  .fig{flex:1 1 0;min-height:0;width:100%;display:flex;justify-content:center;align-items:center}
  .fig svg{max-width:100%;max-height:100%;height:auto;width:auto}.m .fig svg{width:100%;height:auto}.m .stage{gap:12px;flex:0 0 auto}.m .fig{flex:0 0 auto}
  .foot{margin:6px 0 0;font-size:13px;color:var(--presentation-muted)}
  </style></head><body class="${mobile ? 'm' : ''}"><div class="gnb"><span>← 소개</span><b>B3-2 · 미션 스토리 (미리보기)</b><span>학습자료 ☰</span></div>
  <main>${head}<div class="stage">${journey}<div class="fig">${withState(fig[0], fig[1])}</div></div>
  <p class="foot">${intro ? '인트로' : screen.id} · 강의용 초안 미리보기 (실제 앱 화면 아님)</p></main></body></html>`;
}

async function checkFigures(browser) {
  const problems = [];
  const p = await browser.newPage();
  for (const file of fs.readdirSync(ASSETS).filter(f => f.endsWith('.svg'))) {
    const src = svgText(file);
    const states = src.match(/data-states="([^"]*)"/)[1].split(' ');
    const shown = SHOWN[file.includes('mobile') ? 'mobile' : 'desktop'];
    for (const state of states) {
      await p.setContent(`<style>@font-face{font-family:'Pretendard Variable';src:url('${FONT}')}</style>${withState(file, state)}`);
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => {
        const svg = document.querySelector('svg'); const vb = svg.viewBox.baseVal;
        const visible = el => { for (let e = el; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; };
        const items = [...svg.querySelectorAll('text')].filter(t => t.getComputedTextLength() > 0 && visible(t))
          .map(t => { const b = t.getBBox(); return { s: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height, size: +t.getAttribute('font-size') }; });
        const boxes = [...svg.querySelectorAll('rect[class*="-box"],rect[class*="-zone"]')].filter(visible).map(r => r.getBBox());
        const spill = items.filter(a => {
          const inside = boxes.filter(b => a.x >= b.x - 1 && a.x <= b.x + b.width && a.y + a.h / 2 >= b.y && a.y + a.h / 2 <= b.y + b.height)
            .sort((p, q) => p.width * p.height - q.width * q.height)[0];
          return inside && (a.x + a.w > inside.x + inside.width - 6 || a.y + a.h > inside.y + inside.height - 1);
        }).map(a => a.s);
        return { vb: [vb.width, vb.height], items, spill };
      });
      const [W, H] = r.vb;
      for (const t of r.spill) problems.push(`${file}[${state}] 상자 밖으로 넘침: "${t}"`);
      for (const a of r.items) {
        if (a.x < 0 || a.y < 0 || a.x + a.w > W || a.y + a.h > H) problems.push(`${file}[${state}] 뷰박스 밖: "${a.s}"`);
        const px = a.size * shown / W;
        if (px < MIN_PX) problems.push(`${file}[${state}] 작은 글자 ${px.toFixed(1)}px: "${a.s}"`);
      }
      for (let i = 0; i < r.items.length; i++) for (let j = i + 1; j < r.items.length; j++) {
        const a = r.items[i], b = r.items[j];
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
  const sb = path.join(STORY, 'storyboard-v0.1.md');
  const storyboard = fs.existsSync(sb) ? fs.readFileSync(sb, 'utf8') : '';
  if (!storyboard) problems.push('storyboard-v0.1.md 없음');
  const glossary = new Set(JSON.parse(fs.readFileSync(path.join(ROOT, 'data/curated/glossary-master-v0.1.yaml'), 'utf8')).terms.map(t => t.id));
  const guideDir = path.join(B32, 'docs/learning');
  const chapters = fs.existsSync(guideDir) ? fs.readdirSync(guideDir) : null;
  if (!chapters) problems.push(`B3-2 학습가이드 폴더 없음: ${guideDir} (B32 환경변수로 지정)`);
  for (const t of [data.intro.title, data.intro.question]) if (!storyboard.includes(t)) problems.push(`인트로 문구 불일치: ${t}`);
  for (const sc of Object.values(data.scenes)) if (!storyboard.includes(sc.title)) problems.push(`Scene 제목 불일치: ${sc.title}`);
  const perScene = {};
  for (const s of data.screens) {
    perScene[s.scene] = (perScene[s.scene] || 0) + 1;
    for (const t of [s.title, s.question, s.message, s.caption].filter(Boolean))
      if (!storyboard.includes(t)) problems.push(`${s.id}: 스토리보드에 없는 문구 "${t}"`);
    for (const id of s.terms) {
      if (!glossary.has(id)) problems.push(`${s.id}: 용어사전에 없는 ID ${id}`);
      if (!storyboard.includes('`' + id + '`')) problems.push(`${s.id}: 스토리보드 연결에 없는 용어 ${id}`);
    }
    if (chapters) for (const g of s.guide) if (!chapters.some(f => f.startsWith(g + '-'))) problems.push(`${s.id}: 가이드 장 ${g} 없음`);
    for (const k of ['desktop', 'mobile']) if (!fs.existsSync(path.join(ASSETS, s[k][0]))) problems.push(`${s.id}: 그림 없음 ${s[k][0]}`);
  }
  if (data.screens.length !== 8) problems.push(`화면 수 ${data.screens.length} (8이어야 함)`);
  if (Object.keys(perScene).length !== 4 || Object.values(perScene).some(n => n !== 2)) problems.push(`Scene별 화면 수 ${JSON.stringify(perScene)} (4 Scene × 2)`);
  return problems;
}

function checkEvidence() {
  const problems = [];
  const context = evidence('demo-context.txt').replace(/\n$/, '');
  const git = evidence('demo-git-output.txt');
  const sub = evidence('subprocess-results.txt');
  const val = evidence('validator-demo.txt');
  const req = JSON.parse(evidence('demo-request.json'));
  const allSvg = fs.readdirSync(ASSETS).filter(f => f.endsWith('.svg')).map(svgText).join('\n');
  const need = [
    [`${context.length}자`, '문맥 글자 수', [...context].length === context.length && req.context_chars === context.length],
    ['실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.', '추가된 줄', git.includes('+실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.')],
    ['@@ -26,6 +26,8 @@', 'hunk 머리', git.includes('@@ -26,6 +26,8 @@')],
    ['밖 128', 'returncode', sub.includes('returncode = 128')],
    ['fatal: not a git repository', 'stderr', sub.includes("stderr     = 'fatal: not a git repository")],
    ['- 실행 권장: python -m unittest discover -s tests', 'How to Test 고정 문구', val.includes('- 실행 권장: python -m unittest discover -s tests')],
    ['gpt-5-mini', '모델', req.body.model === 'gpt-5-mini'],
  ];
  for (const [text, what, ok] of need) {
    if (!ok) problems.push(`근거 파일과 다름: ${what}`);
    if (!allSvg.includes(text.replace(/&/g, '&amp;'))) problems.push(`그림에 근거 값 없음: ${what} "${text}"`);
  }
  if (!git.includes('$ git diff --cached\n(출력 없음)')) problems.push('근거: staged diff가 비어 있지 않음');
  // F8: 그림 속 출력 글자는 실제 출력 원문의 조각이어야 한다. '…'로 줄인 줄은 조각마다 대조한다. 그림 설명용 이름표는 뺀다.
  const real = evidence('real-output-2026-10-20.txt');
  const unescape = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const label = /^(> python|↑|제목 1줄|Title 80자|모두 실제|… =|주황 =|=== 끝 ===)/;
  for (const f of ['f8-drafts-desktop.svg', 'f8-drafts-mobile.svg']) {
    const texts = [...svgText(f).matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => unescape(m[1]).replace(/\s+← stderr$/, ''));
    if (texts.some(t => t.includes('미보존'))) problems.push(`${f}: '원문 미보존' 표시가 남아 있음`);
    for (const t of texts.filter(t => t.trim() && !label.test(t)))
      for (const piece of t.split('…').map(x => x.trim()).filter(Boolean))
        if (!real.includes(piece)) problems.push(`${f}: 실제 출력 원문에 없는 글자 "${piece}"`);
  }
  const secrets = /\b(sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{16,}|AKIA[A-Z0-9]{16})\b|Bearer\s+(?![•\[])[^\s"'<]{8,}/;
  for (const dir of [ASSETS, EVIDENCE]) for (const f of fs.readdirSync(dir).filter(f => /\.(svg|txt|json)$/.test(f)))
    if (secrets.test(fs.readFileSync(path.join(dir, f), 'utf8'))) problems.push(`키처럼 보이는 문자열: ${f}`);
  return problems;
}

(async () => {
  const pw = [process.env.PLAYWRIGHT, path.join(ROOT, 'node_modules/playwright')].filter(Boolean).find(p => fs.existsSync(p));
  if (!pw) throw new Error('playwright를 찾지 못했다. PLAYWRIGHT=<node_modules/playwright 경로>를 지정한다.');
  const { chromium } = require(pw);
  const browser = await chromium.launch({ executablePath: CHROME });
  const problems = [...checkText(), ...checkEvidence(), ...await checkFigures(browser)];
  console.log(problems.length ? problems.map(s => '✗ ' + s).join('\n') : 'check: PASS (그림 글자 범위·겹침·최소 크기 · 원고 대조 · 용어/가이드/그림 참조 · 근거 값 · 키 노출)');
  if (!process.argv.includes('--check-only')) {
    fs.mkdirSync(OUT, { recursive: true });
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'b32-preview-'));
    const report = [];
    const all = [{ id: 'intro', ...data.intro }, ...data.screens];
    for (const s of all) {
      const runs = [['pc', { width: 1280, height: 720 }, 'dark'], ['mobile', { width: 390, height: 844 }, 'dark']];
      if (LIGHT.includes(s.id)) runs.push(['pc-light', { width: 1280, height: 720 }, 'light']);
      for (const [kind, vp, theme] of runs) {
        const pg = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
        const html = path.join(tmp, `${kind}-${s.id}.html`);
        fs.writeFileSync(html, page(s, kind === 'mobile', theme));
        await pg.goto(pathToFileURL(html).href);
        await pg.evaluate(() => document.fonts.ready);
        const m = await pg.evaluate(() => {
          const measure = svg => {
            if (!svg) return null;
            const k = svg.getBoundingClientRect().width / svg.viewBox.baseVal.width;
            const visible = el => { for (let e = el; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; };
            return Math.min(...[...svg.querySelectorAll('text')].filter(t => visible(t) && t.getComputedTextLength() > 0).map(t => +t.getAttribute('font-size') * k));
          };
          return { h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth,
            minPx: measure(document.querySelector('.fig svg')), jPx: measure(document.querySelector('.journey svg')) };
        });
        if (kind !== 'mobile' && m.h > vp.height) problems.push(`${s.id} ${kind}: 1280×720 세로 넘침 ${m.h}px`);
        if (m.w > vp.width) problems.push(`${s.id} ${kind}: 가로 넘침 ${m.w}px`);
        if (m.minPx !== null && m.minPx < MIN_PX) problems.push(`${s.id} ${kind}: 그림 글자 실제 ${m.minPx.toFixed(1)}px`);
        if (m.jPx !== null && m.jPx < MIN_PX) problems.push(`${s.id} ${kind}: 위치 띠 글자 실제 ${m.jPx.toFixed(1)}px`);
        report.push(`${s.id.padEnd(5)} ${kind.padEnd(8)} 높이 ${String(m.h).padStart(4)}px · 그림 최소 글자 ${m.minPx === null ? '  —' : m.minPx.toFixed(1) + 'px'} · 위치 띠 ${m.jPx === null ? '—' : m.jPx.toFixed(1) + 'px'}`);
        await pg.screenshot({ path: path.join(OUT, `${kind}-${s.id}.png`), fullPage: kind === 'mobile' });
        await pg.close();
      }
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(report.join('\n'));
    console.log(problems.length ? '\n' + problems.map(s => '✗ ' + s).join('\n') : '\npreview: PASS (1280×720 넘침 없음 · 모바일 가로 넘침 없음 · 그림·위치 띠 글자 14px 이상)');
    console.log(`preview → ${path.relative(ROOT, OUT)}/`);
  }
  await browser.close();
  if (problems.length) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
