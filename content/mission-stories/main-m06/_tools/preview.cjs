// B3-2 미션 스토리 미리보기·검사. 실제 웹 렌더러가 아니라, PresentationSurface(Dark 기본)를 흉내 낸 정적 화면이다.
// 1) 그림 검사: 선택한 버전의 SVG·상태에서 글자가 상자·뷰박스 밖으로 나가거나 서로 겹치는지, 표시 폭에서 최소 글자 크기(14px)를 넘는지.
// 2) 원고 대조: v0.2 메타데이터·화면 해설을 원고에서 읽고, v0.1 원고와 screens.json의 연결을 검사한다.
//    용어·가이드·그림 참조와 4 Scene × 2 화면을 확인한다.
// 3) 근거 대조: 그림에 쓴 실제 값(문맥 글자 수 · 실습 메모 줄 · returncode 128 · How to Test 고정 문구)이 ../assets/evidence/ 와 같은지,
//    그림·근거 파일에 API 키처럼 보이는 문자열이 없는지.
// 4) 미리보기: 인트로 + 8화면을 PC 1280×720(Dark·일부 Light)·모바일 390×844로 그려 ../preview-v02/에 저장하고,
//    실제 화면에서 넘침(세로·가로)과 그림 글자의 실제 표시 크기를 잰다.
// 실행: node preview.cjs [--check-only] [--legacy|--r1|--v03]   (B32_PREVIEW_OUTPUT으로 저장 폴더 지정 가능)   (PLAYWRIGHT=<playwright 경로>, CHROME=<브라우저 경로>, B32=<Codyssey_B3-2 경로>)
const path = require('path');
const fs = require('fs');
const os = require('os');
const { pathToFileURL } = require('url');
const { containsSecret } = require('./secret-check.cjs');

const ROOT = path.resolve(__dirname, '../../../..');
const STORY = path.resolve(__dirname, '..');
const ASSETS = path.join(STORY, 'assets');
const EVIDENCE = path.join(ASSETS, 'evidence');
const legacy = process.argv.includes('--legacy');
const version = process.argv.includes('--v03') ? 'v03' : process.argv.includes('--r1') ? 'r1' : 'v02';
const OUT = process.env.B32_PREVIEW_OUTPUT || path.join(STORY, legacy ? 'preview' : `preview-${version}`);
const FONT = pathToFileURL(path.join(ROOT, 'src/assets/fonts/PretendardVariable.woff2')).href;
const B32 = process.env.B32 || path.resolve(ROOT, '..', 'Codyssey_B3-2');
const CHROME = process.env.CHROME || [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(p => fs.existsSync(p));
const source = JSON.parse(fs.readFileSync(path.join(__dirname, 'screens.json'), 'utf8'));
const journeyName = legacy ? 'f0-journey' : 'f0-journey-v02';
const MIN_PX = 14;
// 그림이 화면에 보이는 최소 폭(px). 데스크톱 1280 강의 화면, 모바일 360px 화면 기준(build_figures.py와 같은 값).
const SHOWN = { desktop: 900, mobile: 328 };
const LIGHT = ['S1-2', 'S3-2', 'S4-2'];

const svgText = name => fs.readFileSync(path.join(ASSETS, name), 'utf8');
const withState = (name, state) => svgText(name).replace(/data-state="[^"]*"/, `data-state="${state}"`);
const evidence = name => fs.readFileSync(path.join(EVIDENCE, name), 'utf8').replace(/\r\n/g, '\n');

const TOKENS = `
  :root{--presentation-bg:#111827;--presentation-panel:#1d2736;--presentation-ink:#eef2f7;--presentation-muted:#bdc8d7;--presentation-line:#64748b;--presentation-chip:#293549;--presentation-accent:#ffad86;--presentation-accent-soft:#4b2c26;--presentation-python:#9cc8ff;--presentation-python-soft:#203957;--presentation-app:#86dfb0;--presentation-app-soft:#183f32;--presentation-real:#edcf8e;--presentation-real-soft:#403622;--presentation-on-strong:#111827}
  :root[data-theme=light]{--presentation-bg:#fbfaf7;--presentation-panel:#fff;--presentation-ink:#14161a;--presentation-muted:#5e626b;--presentation-line:#d9d7d0;--presentation-chip:#eeece6;--presentation-accent:#b83d0b;--presentation-accent-soft:#fdebe1;--presentation-python:#1f5fbf;--presentation-python-soft:#e3ecfa;--presentation-app:#0b7a55;--presentation-app-soft:#ddf2e9;--presentation-real:#6b4e16;--presentation-real-soft:#f6eedc;--presentation-on-strong:#fff}`;

function page(data, screen, mobile, theme) {
  const intro = !screen.scene;
  const scene = intro ? null : data.scenes[screen.scene];
  const fig = screen[mobile ? 'mobile' : 'desktop'];
  const journey = screen.journey ? `<div class="journey">${withState(`${journeyName}-${mobile ? 'mobile' : 'desktop'}.svg`, screen.journey)}</div>` : '';
  const head = intro
    ? `<p class="scene"><b>${data.intro.code}</b> · 미션 스토리 인트로</p><h1>${data.intro.title}</h1>${data.intro.subtitle ? `<p class="q">${data.intro.subtitle}</p>` : ''}<p class="q">핵심 질문 · ${data.intro.question}</p>`
    : `<p class="scene"><b>Scene ${screen.scene}</b> · ${scene.title}</p><p class="q">${screen.technology}</p><p class="q">${screen.id} · ${screen.title}</p><h1>${screen.message}</h1><p class="cap">${screen.caption.replace(/`([^`]+)`/g, '<code>$1</code>')}</p>`;
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

async function checkFigures(browser, files) {
  const problems = [];
  const p = await browser.newPage();
  for (const file of files) {
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
        const transfers = Object.fromEntries([...svg.querySelectorAll('path[data-transfer]')].map(path => {
          const start = path.getPointAtLength(0), end = path.getPointAtLength(path.getTotalLength());
          return [path.dataset.transfer, {
            dx: end.x - start.x, dy: end.y - start.y, marker: getComputedStyle(path).markerEnd,
          }];
        }));
        return { vb: [vb.width, vb.height], items, spill, transfers };
      });
      const [W, H] = r.vb;
      if (/^f[17]-.*-(v02|r1|v03)-/.test(file)) {
        const { request, response } = r.transfers;
        const axis = file.includes('mobile') ? 'dy' : 'dx';
        // The r1 mobile path is sequential: Python → API → Python, both downward.
        const stacked = /^f7-api-(r1|v03)-mobile\.svg$/.test(file);
        const returnsToPython = stacked ? response?.dy > 0 : response?.[axis] < 0;
        if (!(request?.[axis] > 0 && returnsToPython && request.marker !== 'none' && response.marker !== 'none')) {
          problems.push(`${file}[${state}] 요청·응답 방향 오류`);
        }
      }
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

function checkLegacyText(data) {
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
    for (const t of [s.title, s.question, s.message, s.caption, s.technology].filter(Boolean))
      if (!storyboard.includes(t)) problems.push(`${s.id}: 스토리보드에 없는 문구 "${t}"`);
    for (const id of s.terms) {
      if (!glossary.has(id)) problems.push(`${s.id}: 용어사전에 없는 ID ${id}`);
      if (!storyboard.includes('`' + id + '`')) problems.push(`${s.id}: 스토리보드 연결에 없는 용어 ${id}`);
    }
    if (chapters) for (const g of s.guide) if (!chapters.some(f => f.startsWith(g + '-'))) problems.push(`${s.id}: 가이드 장 ${g} 없음`);
    for (const k of ['desktop', 'mobile']) if (!fs.existsSync(path.join(ASSETS, s[k][0]))) problems.push(`${s.id}: 그림 없음 ${s[k][0]}`);
  }
  if (!storyboard.includes(data.intro.draftDefinition)) problems.push('초안 정의 불일치');
  if (data.screens.length !== 8) problems.push(`화면 수 ${data.screens.length} (8이어야 함)`);
  if (Object.keys(perScene).length !== 4 || Object.values(perScene).some(n => n !== 2)) problems.push(`Scene별 화면 수 ${JSON.stringify(perScene)} (4 Scene × 2)`);
  return problems;
}

function checkEvidence(activeFiles) {
  const problems = [];
  const v03 = version === 'v03';
  const context = evidence(v03 ? 'context-readme-2026-11-25.txt' : 'demo-context.txt').replace(/\n$/, '');
  const memo = v03 ? '실습 메모: AI가 작성한 초안은 사람이 검토한다.' : '실습 메모: AI가 생성한 커밋 메시지는 사용자가 검토한 후 적용한다.';
  const hunk = v03 ? '@@ -76,3 +76,5 @@' : '@@ -26,6 +26,8 @@';
  const git = evidence(v03 ? 'lab-v0.3-r1-repro-2026-11-25.txt' : 'demo-git-output.txt');
  const sub = evidence(v03 ? 'lab-v0.3-repro-2026-11-25.txt' : 'subprocess-results.txt');
  const val = evidence('validator-demo.txt');
  const req = JSON.parse(evidence('demo-request.json'));
  const real = evidence(v03 ? 'lab-v0.3-owner-2026-11-25.txt' : 'real-output-2026-10-20.txt');
  const connection = v03 ? evidence('lab-v0.3-r1-owner-2026-11-25.txt') : '';
  const allSvg = [...activeFiles].map(svgText).join('\n');
  const need = [
    [`${context.length}자`, '문맥 글자 수', [...context].length === context.length &&
      (v03 ? real.includes(`전체 글자 수: ${context.length}`) : req.context_chars === context.length)],
    [memo, '추가된 줄', git.includes('+' + memo)],
    [hunk, 'hunk 머리', git.includes(hunk)],
    ['밖 128', 'returncode', v03 ? /returncode[ :]+128/.test(sub) : sub.includes('returncode = 128')],
    ['fatal: not a git repository', 'stderr', v03 ? sub.includes('깃 저장소가 아닙니다') : sub.includes("stderr     = 'fatal: not a git repository")],
    ['- 실행 권장: python -m unittest discover -s tests', 'How to Test 고정 문구', (v03 ? real : val).includes('- 실행 권장: python -m unittest discover -s tests')],
    ['gpt-5-mini', '모델', v03 ? connection.includes('"model": "gpt-5-mini"') : req.body.model === 'gpt-5-mini'],
  ];
  for (const [text, what, ok] of need) {
    if (!ok) problems.push(`근거 파일과 다름: ${what}`);
    if (!allSvg.includes(text.replace(/&/g, '&amp;'))) problems.push(`그림에 근거 값 없음: ${what} "${text}"`);
  }
  if (!git.includes('$ git diff --cached\n(출력 없음)')) problems.push('근거: staged diff가 비어 있지 않음');
  // F8: 그림 속 출력 글자는 실제 출력 원문의 조각이어야 한다. '…'로 줄인 줄은 조각마다 대조한다. 그림 설명용 이름표는 뺀다.
  const unescape = t => t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
  const label = /^(> python|↑|제목 1줄|Title 80자|모두 실제|… =|주황 =|=== 끝 ===|프로그램 동작|같은 Git 문맥이면 user는 같다|system · )/;
  for (const f of [...activeFiles].filter(file => file.startsWith('f8-drafts-'))) {
    const texts = [...svgText(f).matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => unescape(m[1]).replace(/\s+← stderr$/, ''));
    if (texts.some(t => t.includes('미보존'))) problems.push(`${f}: '원문 미보존' 표시가 남아 있음`);
    for (const t of texts.filter(t => t.trim() && !label.test(t)))
      for (const piece of t.split('…').map(x => x.trim()).filter(Boolean))
        if (!real.includes(piece)) problems.push(`${f}: 실제 출력 원문에 없는 글자 "${piece}"`);
  }
  if (v03) {
    const api = [...activeFiles].filter(file => file.startsWith('f7-api-')).map(svgText).join(' ');
    if (api.includes('안녕하세요') || !api.includes('교육용 예시') || !api.includes('최소 연결 테스트')) {
      problems.push('F7 근거 구분 오류: 교육용 예시와 최소 연결 테스트');
    }
  }
  for (const dir of [ASSETS, EVIDENCE]) for (const f of fs.readdirSync(dir).filter(f => /\.(svg|txt|json)$/.test(f))) {
    if (containsSecret(fs.readFileSync(path.join(dir, f), 'utf8'))) problems.push(`키처럼 보이는 문자열: ${f}`);
  }
  if (v03) for (const f of ['storyboard-v0.3.md', 'lab-guide-v0.3-r1.md']) {
    if (containsSecret(fs.readFileSync(path.join(STORY, f), 'utf8'))) problems.push(`키처럼 보이는 문자열: ${f}`);
  }
  return problems;
}

(async () => {
  const pw = [process.env.PLAYWRIGHT, path.join(ROOT, 'node_modules/playwright')].filter(Boolean).find(p => fs.existsSync(p));
  if (!pw) throw new Error('playwright를 찾지 못했다. PLAYWRIGHT=<node_modules/playwright 경로>를 지정한다.');
  const { chromium } = require(pw);
  const browser = await chromium.launch({ executablePath: CHROME });
  const { lessonFromStoryboard } = await import('./storyboard-v02.mjs');
  const manuscript = { v02: 'storyboard-v0.2.md', r1: 'storyboard-v0.2-r1.md', v03: 'storyboard-v0.3.md' }[version];
  const data = legacy ? source : lessonFromStoryboard(source, fs.readFileSync(path.join(STORY, manuscript), 'utf8'), version);
  const activeFiles = new Set([`${journeyName}-desktop.svg`, `${journeyName}-mobile.svg`]);
  for (const item of [data.intro, ...data.screens]) {
    activeFiles.add(item.desktop[0]);
    activeFiles.add(item.mobile[0]);
  }
  const files = legacy ? fs.readdirSync(ASSETS).filter(f => f.endsWith('.svg') && !/-v02-|-r1-|-v03-/.test(f)) : activeFiles;
  const problems = [...checkLegacyText(source), ...checkEvidence(files), ...await checkFigures(browser, files)];
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
        fs.writeFileSync(html, page(data, s, kind === 'mobile', theme));
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
