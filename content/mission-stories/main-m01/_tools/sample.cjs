// B1-1 시연 샘플(김코디 자기소개)의 세 상태 만들기·검사·캡처.
// 1) 상태 만들기: sample/index.html(상태 ③)에서 <head>의 연결 줄만 지워 상태 ①·②를 만든다.
//      state-1-html.html  : <link rel="stylesheet">·<script defer> 줄 없음 (작성자 CSS·JS 없음)
//      state-2-css.html   : <script defer> 줄만 없음
//    --check 를 주면 파일을 쓰지 않고, 저장된 상태 파일이 지금 index.html에서 만든 결과와 같은지만 본다.
// 2) 정적 검사: 세 파일의 <body>…</body>가 글자 단위로 같은지(SHA-256), <head> 차이가 연결 줄뿐인지.
// 3) 브라우저 검사(Chrome): 외부 요청·콘솔 오류 없음, 상태별 메뉴·링크 동작, DOM은 바뀌고 파일은 그대로인지.
// 4) 캡처: ../assets/captures/ 에 F2 캡처 6장(PNG, 2배율)을 다시 만든다. --no-capture 로 건너뛴다.
// 실행: node sample.cjs [--check] [--no-capture]   (PLAYWRIGHT=<playwright 경로>, CHROME=<브라우저 경로>)
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { pathToFileURL } = require('url');

const ROOT = path.resolve(__dirname, '../../../..');
const STORY = path.resolve(__dirname, '..');
const SAMPLE = path.join(STORY, 'sample');
const CAPTURES = path.join(STORY, 'assets', 'captures');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const args = new Set(process.argv.slice(2));

const LINK = /^\s*<link rel="stylesheet" href="css\/style\.css">\n/m;
const SCRIPT = /^\s*<script src="js\/menu\.js" defer><\/script>\n/m;
const STATES = [
  { id: 'state-1', file: 'state-1-html.html', label: '① HTML만', drop: [LINK, SCRIPT] },
  { id: 'state-2', file: 'state-2-css.html', label: '② HTML + CSS', drop: [SCRIPT] },
  { id: 'state-3', file: 'index.html', label: '③ HTML + CSS + JavaScript', drop: [] },
];

const problems = [];
const ok = [];
const sha = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);
const part = (html, tag) => {
  const m = html.match(new RegExp(`<${tag}[\\s>][\\s\\S]*</${tag}>`));
  if (!m) throw new Error(`<${tag}> 없음`);
  return m[0];
};

// 1·2) 상태 파일 만들기와 정적 비교
const source = fs.readFileSync(path.join(SAMPLE, 'index.html'), 'utf8');
for (const re of [LINK, SCRIPT]) if (!re.test(source)) problems.push(`index.html에 연결 줄이 없음: ${re}`);
for (const s of STATES) {
  s.expected = s.drop.reduce((html, re) => html.replace(re, ''), source);
  const target = path.join(SAMPLE, s.file);
  if (s.file === 'index.html') continue;
  if (args.has('--check')) {
    const saved = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
    if (saved !== s.expected) problems.push(`${s.file}: index.html에서 다시 만든 결과와 다름 (node sample.cjs 로 다시 만들기)`);
  } else {
    fs.writeFileSync(target, s.expected);
  }
}
const bodies = STATES.map(s => part(s.expected, 'body'));
const bodyHashes = bodies.map(sha);
if (new Set(bodies).size === 1) ok.push(`<body> 동일: 세 상태 모두 SHA-256 ${bodyHashes[0]}… (${bodies[0].length}자)`);
else problems.push(`<body>가 다름: ${bodyHashes.join(' / ')}`);
for (const s of STATES) {
  const headLines = new Set(part(s.expected, 'head').split('\n').map(l => l.trim()));
  const full = part(source, 'head').split('\n').map(l => l.trim());
  const missing = full.filter(l => !headLines.has(l));
  s.headDiff = missing;
  const allowed = missing.every(l => /^<link rel="stylesheet"|^<script src=/.test(l));
  if (!allowed) problems.push(`${s.file}: <head>에서 연결 줄 밖의 차이: ${missing.join(' | ')}`);
}
ok.push(`<head> 차이: ${STATES.map(s => `${s.label} = ${s.headDiff.length ? '−' + s.headDiff.join(' −') : '원본'}`).join(' · ')}`);

(async () => {
  const { chromium } = require(process.env.PLAYWRIGHT || path.join(ROOT, 'node_modules/playwright'));
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });

  async function open(state, viewport) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
    const notes = { external: [], failed: [], console: [] };
    page.on('request', r => { if (!r.url().startsWith('file:')) notes.external.push(r.url()); });
    page.on('requestfailed', r => notes.failed.push(r.url()));
    page.on('console', m => { if (m.type() === 'error') notes.console.push(m.text()); });
    page.on('pageerror', e => notes.console.push(String(e)));
    await page.goto(pathToFileURL(path.join(SAMPLE, state.file)).href);
    await page.waitForLoadState('load');
    await page.evaluate(() => document.fonts.ready);
    page.notes = notes;
    return page;
  }
  const view = page => page.evaluate(() => {
    const vis = el => !!el && getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0;
    const nav = document.querySelector('.site-nav'), btn = document.querySelector('.menu-toggle');
    return {
      sheets: document.styleSheets.length, scripts: document.scripts.length,
      menuVisible: vis(document.querySelector('.menu-list')), toggleVisible: vis(btn),
      expanded: btn.getAttribute('aria-expanded'), navClass: nav.className,
      h1Weight: getComputedStyle(document.querySelector('h1')).fontWeight,
      linkColor: getComputedStyle(document.querySelector('.menu-list a')).color,
    };
  });
  const expect = (cond, msg) => (cond ? ok : problems).push((cond ? '' : '실패: ') + msg);
  const desktop = { width: 960, height: 600 }, mobile = { width: 390, height: 640 };
  const shots = [];
  const shot = (page, name) => shots.push([page, name]);

  // 상태 ① — 작성자 CSS·JS 없음, 브라우저 기본 스타일만. 링크는 HTML만으로 동작한다.
  const s1 = await open(STATES[0], desktop);
  let v = await view(s1);
  expect(v.sheets === 0 && v.scripts === 0, `① 연결된 CSS ${v.sheets}개 · 스크립트 ${v.scripts}개 (작성자 CSS·JS 없음)`);
  expect(Number(v.h1Weight) >= 700 && v.menuVisible, `① 브라우저 기본 스타일 있음: h1 굵기 ${v.h1Weight}, 메뉴 링크 색 ${v.linkColor}, 메뉴 목록이 그대로 보임`);
  shot(s1, 'f2-state1-desktop.png');
  const s1b = await open(STATES[0], desktop);
  const top = () => s1b.evaluate(() => Math.round(document.querySelector('#projects').getBoundingClientRect().top));
  const before = await top();
  await s1b.click('.menu-list a[href="#projects"]');
  const hash = await s1b.evaluate(() => location.hash), after = await top();
  // 페이지가 짧으면 구역이 맨 위까지 오지 못하므로, 주소와 "구역이 위로 올라왔는지"를 본다.
  expect(hash === '#projects' && after < before, `① 메뉴 링크 "프로젝트" 클릭 → 주소 ${hash}, 구역 위치 ${before}px → ${after}px (JS 없이 HTML 링크로 이동)`);
  const s1c = await open(STATES[0], desktop);
  await s1c.click('.menu-toggle');
  v = await view(s1c);
  expect(v.expanded === 'false' && v.navClass === 'site-nav', `① ☰ 클릭 → 변화 없음 (aria-expanded ${v.expanded}, class "${v.navClass}")`);

  // 상태 ② — CSS 연결. 폭에 따라 다른 규칙. ☰는 보이지만 누를 기능은 아직 없다.
  const s2d = await open(STATES[1], desktop);
  v = await view(s2d);
  expect(v.sheets === 1 && v.menuVisible && !v.toggleVisible, `② 960px: CSS 1개, 메뉴 가로 표시 ${v.menuVisible}, ☰ 숨김 ${!v.toggleVisible}`);
  shot(s2d, 'f2-state2-desktop.png');
  const s2l = await open(STATES[1], desktop);
  const top2 = () => s2l.evaluate(() => Math.round(document.querySelector('#contact').getBoundingClientRect().top));
  const before2 = await top2();
  await s2l.click('.menu-list a[href="#contact"]');
  const hash2 = await s2l.evaluate(() => location.hash), after2 = await top2();
  expect(hash2 === '#contact' && after2 < before2, `② 960px 메뉴 링크 "연락" 클릭 → 주소 ${hash2}, 구역 위치 ${before2}px → ${after2}px (JS 없이 이동)`);
  const s2m = await open(STATES[1], mobile);
  v = await view(s2m);
  expect(!v.menuVisible && v.toggleVisible, `② 390px: 메뉴 접힘 ${!v.menuVisible}, ☰ 보임 ${v.toggleVisible}`);
  shot(s2m, 'f2-state2-mobile.png');
  const s2c = await open(STATES[1], mobile);
  await s2c.click('.menu-toggle');
  v = await view(s2c);
  expect(!v.menuVisible && v.expanded === 'false', `② 390px ☰ 클릭 → 메뉴 그대로 접힘 (JS 없음)`);

  // 상태 ③ — JS 연결. 누를 때마다 열고 닫는다. 바뀌는 것은 DOM, 파일은 그대로.
  const fileBefore = sha(fs.readFileSync(path.join(SAMPLE, 'index.html'), 'utf8'));
  const s3 = await open(STATES[2], mobile);
  v = await view(s3);
  expect(!v.menuVisible && v.expanded === 'false', `③ 390px 처음: 메뉴 접힘, aria-expanded ${v.expanded}`);
  shot(s3, 'f2-state3-mobile-closed.png');
  const s3o = await open(STATES[2], mobile);
  await s3o.click('.menu-toggle');
  v = await view(s3o);
  expect(v.menuVisible && v.expanded === 'true' && v.navClass.includes('is-open'), `③ ☰ 클릭 → 메뉴 열림, nav class "${v.navClass}", aria-expanded ${v.expanded}`);
  const domNav = await s3o.evaluate(() => document.querySelector('.site-nav').outerHTML.split('>')[0] + '>');
  shot(s3o, 'f2-state3-mobile-open.png');
  const s3x = await open(STATES[2], mobile);
  await s3x.click('.menu-toggle');
  await s3x.click('.menu-toggle');
  v = await view(s3x);
  expect(!v.menuVisible && v.expanded === 'false' && v.navClass === 'site-nav', `③ 두 번 클릭 → 다시 닫힘`);
  const s3k = await open(STATES[2], mobile);
  await s3k.focus('.menu-toggle');
  await s3k.keyboard.press('Enter');
  v = await view(s3k);
  expect(v.menuVisible && v.expanded === 'true', `③ 키보드(Tab 초점 + Enter)로도 열림 — button 요소의 기본 동작`);
  const fileAfter = sha(fs.readFileSync(path.join(SAMPLE, 'index.html'), 'utf8'));
  expect(fileBefore === fileAfter && !source.includes('is-open"'), `③ 클릭 뒤 DOM: ${domNav} / 파일 index.html은 그대로 (SHA-256 ${fileAfter}…)`);
  const s3d = await open(STATES[2], desktop);
  v = await view(s3d);
  expect(v.menuVisible && !v.toggleVisible, `③ 960px: 메뉴 가로 표시, ☰ 숨김 (CSS 규칙, JS와 무관)`);

  const pages = [s1, s1b, s1c, s2d, s2l, s2m, s2c, s3, s3o, s3x, s3k, s3d];
  const ext = pages.flatMap(p => p.notes.external), failed = pages.flatMap(p => p.notes.failed), cons = pages.flatMap(p => p.notes.console);
  expect(!ext.length && !failed.length && !cons.length, `외부 요청 ${ext.length} · 실패 요청 ${failed.length} · 콘솔 오류 ${cons.length} (외부 라이브러리 없음)`);

  if (!args.has('--no-capture') && !args.has('--check')) {
    fs.mkdirSync(CAPTURES, { recursive: true });
    for (const [page, name] of shots) await page.screenshot({ path: path.join(CAPTURES, name) });
    ok.push(`캡처 ${shots.length}장 → assets/captures/ (${shots.map(s => s[1]).join(', ')})`);
  }
  await browser.close();
  console.log(ok.map(s => '✓ ' + s).join('\n'));
  if (problems.length) { console.log(problems.map(s => '✗ ' + s).join('\n')); process.exit(1); }
  console.log('sample: PASS');
})().catch(e => { console.error(e); process.exit(1); });
