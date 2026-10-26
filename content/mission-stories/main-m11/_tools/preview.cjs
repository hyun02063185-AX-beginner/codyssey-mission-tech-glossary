// B6-1 미션 스토리 미리보기·검사. 실제 웹 렌더러가 아니라, PresentationSurface(Dark 기본)를 흉내 낸 정적 화면이다.
// 1) 검사: 새 SVG의 상태별로 글자가 뷰박스 밖으로 나가거나 서로 겹치는지, 표시 폭에서 최소 글자 크기를 넘는지,
//    screens.json 문구가 storyboard-v0.2.md에 그대로 있는지 확인한다.
// 2) 미리보기: 12개 화면을 PC 1280×720·모바일 390×844로 그려 ../preview/ 에 대표 화면과 전체 모음을 저장한다.
// 실행: node preview.cjs [--check-only]   (CHROME=<브라우저 경로>, PLAYWRIGHT=<playwright 경로>로 바꿀 수 있다)
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '../../../..');
const { chromium } = require(process.env.PLAYWRIGHT || path.join(ROOT, 'node_modules/playwright'));

const STORY = path.resolve(__dirname, '..');
const ASSETS = path.join(STORY, 'assets');
const GUIDE = path.join(ROOT, 'content/mission-guides/main-m11/assets');
const OUT = path.join(STORY, 'preview');
const FONT = path.join(ROOT, 'src/assets/fonts/PretendardVariable.woff2');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'screens.json'), 'utf8'));
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const MIN_PX = 14; // 표시된 실제 글자 크기 하한 (장식용 축소판 제외)

const svgText = name => name.startsWith('guide:') ? null : fs.readFileSync(path.join(ASSETS, name), 'utf8');
const figure = ([name, state]) => {
  if (name.startsWith('guide:')) return `<img class="fig guide" src="file://${path.join(GUIDE, name.slice(6))}" alt="">`;
  return `<div class="fig">${svgText(name).replace(/data-state="[^"]*"/, `data-state="${state}"`)}</div>`;
};

const layers = {
  flow: m => `<ol class="flow ${m ? 'col' : ''}">
    <li><b>질문</b><span>김민준은 어떤 수업을 들을까?</span></li>
    <li><b>SQL</b><span>필요한 열 · 표 · 조건을 적어 요청</span></li>
    <li><b>DBMS</b><span>B6-1에서는 SQLite<br>문법 확인 → 실행 → 규칙 검사</span></li>
    <li class="hi"><b>결과 표</b><span>중등 수학 기초 · 중등 영어 독해</span></li></ol>`,
  'join-result': m => m ? `<div class="card"><p class="tag real">B6-1 실제 결과 · Q05 일부 (전체 26행)</p>
    <table><tr><th>학생</th><th>수업</th><th>요일</th></tr><tr><td>김민준</td><td>중등 수학 기초</td><td>월</td></tr>
    <tr><td>김민준</td><td>중등 영어 독해</td><td>화</td></tr></table></div>` : '',
  roles: m => `<div class="roles ${m ? 'col' : ''}"><div class="card"><b>SQL · 요청하는 언어</b><span>무엇이 필요한지 적는다</span></div>
    <div class="card"><b>DBMS · 실행하는 프로그램</b><span>B6-1에서는 SQLite. 요청을 실행하고 PK · FK · CHECK 규칙으로 잘못된 입력을 막는다</span></div></div>
    <ul class="verbs"><li>조회 <i>Q01–Q04</i></li><li>연결 JOIN <i>Q05–Q09</i></li><li>집계 <i>Q10–Q13</i></li><li>수정 · 삭제 <i>Q16–Q17</i></li></ul>
    <p class="note">B6-1 쿼리 17개 (서브쿼리 Q14 · 인덱스 Q15 포함)</p>`,
  'ai-check': m => `<p class="tag">교육용 예시 · B6-1 데이터로 실행해 확인한 결과</p><ol class="flow ${m ? 'col' : ''}">
    <li><b>요청</b><span>모든 학생의 수강 수업 목록</span></li>
    <li class="bad"><b>AI 초안 · INNER JOIN</b><span>26행 · 학생 14명<br>✕ 문태양이 없다</span></li>
    <li><b>구조로 확인</b><span>ERD의 동그라미<br>= 수강 0건인 학생도 있다</span></li>
    <li class="hi"><b>LEFT JOIN</b><span>27행 · 학생 15명 ✓</span></li></ol>`,
};

function page(screen, mobile, theme = 'dark') {
  const scene = data.scenes[screen.scene];
  const fig = screen[mobile ? 'mobile' : 'desktop'];
  const body = (fig ? figure(fig) : '') + (screen.html ? layers[screen.html](mobile) : '');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{font-family:'Pretendard Variable';src:url('file://${FONT}') format('woff2');font-weight:45 920}
  :root{--presentation-bg:#111827;--presentation-panel:#1d2736;--presentation-ink:#eef2f7;--presentation-muted:#bdc8d7;--presentation-line:#64748b;--presentation-chip:#293549;--presentation-accent:#ffad86;--presentation-accent-soft:#4b2c26;--presentation-python:#9cc8ff;--presentation-python-soft:#203957;--presentation-app:#86dfb0;--presentation-app-soft:#183f32;--presentation-real:#edcf8e;--presentation-real-soft:#403622}
  :root[data-theme=light]{--presentation-bg:#fbfaf7;--presentation-panel:#fff;--presentation-ink:#14161a;--presentation-muted:#5e626b;--presentation-line:#d9d7d0;--presentation-chip:#eeece6;--presentation-accent:#b83d0b;--presentation-accent-soft:#fdebe1;--presentation-python:#1f5fbf;--presentation-python-soft:#e3ecfa;--presentation-app:#0b7a55;--presentation-app-soft:#ddf2e9;--presentation-real:#6b4e16;--presentation-real-soft:#f6eedc}
  *{box-sizing:border-box}body{margin:0;background:var(--presentation-bg);color:var(--presentation-ink);font-family:'Pretendard Variable',sans-serif}
  .gnb{height:52px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;border-bottom:1px solid var(--presentation-line);font-size:14px;color:var(--presentation-muted)}
  .gnb b{color:var(--presentation-ink)}main{padding:16px 32px 20px;display:flex;flex-direction:column;height:calc(100vh - 52px)}
  .m main{height:auto;padding:14px 16px 24px}
  .scene{margin:0;font-size:15px;color:var(--presentation-muted)}.scene b{color:var(--presentation-accent)}
  h1{margin:6px 0 4px;font-size:32px;line-height:1.25}.m h1{font-size:24px}
  .cap{margin:0 0 12px;font-size:18px;color:var(--presentation-muted)}.m .cap{font-size:16px}
  .stage{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px}
  .fig{flex:1;min-height:0;width:100%;display:flex;justify-content:center}.fig svg{max-width:100%;max-height:100%;height:auto;width:auto}
  .m .fig svg{width:100%;height:auto}.fig.guide{flex:0 0 auto;max-width:420px;width:100%;border-radius:12px}
  .flow{display:flex;gap:12px;list-style:none;padding:0;margin:0;width:100%}.flow.col{flex-direction:column}
  .flow li{flex:1;background:var(--presentation-panel);border:2px solid var(--presentation-line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px;font-size:19px}
  .flow li b{font-size:21px}.flow li.hi{border:4px solid var(--presentation-accent)}.flow li.bad b{color:var(--presentation-accent)}
  .flow:not(.col) li+li{position:relative}.flow:not(.col) li+li:before{content:'→';position:absolute;left:-12px;top:42%;font-size:20px;color:var(--presentation-muted)}
  .card{background:var(--presentation-panel);border:2px solid var(--presentation-line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:8px;font-size:19px}
  .roles{display:flex;gap:16px;width:100%}.roles.col{flex-direction:column}.roles .card{flex:1}.roles b{font-size:22px}
  .verbs{display:flex;flex-wrap:wrap;gap:10px;list-style:none;padding:0;margin:0;width:100%}.verbs li{background:var(--presentation-chip);border:2px solid var(--presentation-line);border-radius:999px;padding:10px 18px;font-size:20px;font-weight:700}
  .verbs i{font-style:normal;font-weight:400;color:var(--presentation-muted);font-size:17px;margin-left:6px}
  .note{margin:0;font-size:16px;color:var(--presentation-muted);align-self:flex-start}
  .tag{margin:0;align-self:flex-start;font-size:16px;padding:6px 12px;border-radius:999px;border:2px solid var(--presentation-accent);background:var(--presentation-accent-soft)}
  .tag.real{border-color:var(--presentation-real);background:var(--presentation-real-soft)}
  table{border-collapse:collapse;font-size:17px}td,th{border:1px solid var(--presentation-line);padding:6px 10px;text-align:left}th{background:var(--presentation-chip)}
  </style></head><body class="${mobile ? 'm' : ''}"><div class="gnb"><span>← 소개</span><b>B6-1 · 미션 스토리 (미리보기)</b><span>학습자료 ☰</span></div>
  <main><p class="scene"><b>Scene ${screen.scene}</b> · ${scene.title} — ${scene.question}</p><h1>${screen.message}</h1><p class="cap">${screen.caption}</p>
  <div class="stage">${body}</div><p class="scene">${screen.id}</p></main></body></html>`.replace('<html>', `<html data-theme="${theme}">`);
}

async function check(browser) {
  const problems = [];
  const sbPath = path.join(STORY, 'storyboard-v0.2.md');
  const storyboard = fs.existsSync(sbPath) ? fs.readFileSync(sbPath, 'utf8') : '';
  if (!storyboard) problems.push('storyboard-v0.2.md 없음');
  for (const s of data.screens) for (const t of [s.message, s.caption]) if (!storyboard.includes(t)) problems.push(`${s.id}: 스토리보드에 없는 문구 "${t}"`);
  for (const sc of Object.values(data.scenes)) if (!storyboard.includes(sc.question)) problems.push(`질문 불일치: ${sc.question}`);
  const p = await browser.newPage();
  for (const file of fs.readdirSync(ASSETS).filter(f => f.endsWith('.svg'))) {
    const src = svgText(file);
    const states = src.match(/data-states="([^"]*)"/)[1].split(' ');
    const shown = file.includes('mobile') ? [328, 358] : [936, 1216];
    for (const state of states) {
      await p.setContent(`<style>@font-face{font-family:'Pretendard Variable';src:url('file://${FONT}')}</style>${src.replace(/data-state="[^"]*"/, `data-state="${state}"`)}`);
      await p.evaluate(() => document.fonts.ready);
      const r = await p.evaluate(() => {
        const svg = document.querySelector('svg'); const vb = svg.viewBox.baseVal;
        const items = [...svg.querySelectorAll('text')].filter(t => t.getComputedTextLength() > 0 && getComputedStyle(t).display !== 'none' && t.closest('[style*="display: none"]') === null)
          .filter(t => { for (let e = t; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; })
          .map(t => { const b = t.getBBox(); return { s: t.textContent, x: b.x, y: b.y, w: b.width, h: b.height, size: +t.getAttribute('font-size'), deco: !!t.closest('[class*="-deco"]') }; });
        // 글자가 시작하는 지점을 품은 가장 작은 상자(표 칸·테이블·이름표) 안에 끝까지 들어가는지
        const boxes = [...svg.querySelectorAll('rect[class*="-box"],rect[class*="-cell"],rect[class*="-head"],rect[class*="-tag"],rect[class*="-real"]')]
          .filter(r => { for (let e = r; e && e !== svg; e = e.parentElement) if (getComputedStyle(e).display === 'none') return false; return true; })
          .map(r => r.getBBox());
        const spill = items.filter(a => {
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
        const px = a.size * Math.min(...shown) / W;
        if (px < MIN_PX && !a.deco) problems.push(`${file}[${state}] 작은 글자 ${px.toFixed(1)}px: "${a.s}"`);
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

(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync(CHROME) ? CHROME : undefined });
  const problems = await check(browser);
  console.log(problems.length ? problems.join('\n') : 'check: PASS (글자 범위·겹침·최소 크기·문구 대조)');
  if (!process.argv.includes('--check-only')) {
    fs.mkdirSync(OUT, { recursive: true });
    const tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'b61-preview-'));
    const shots = { pc: [], mobile: [] };
    for (const s of data.screens) for (const [kind, vp] of [['pc', { width: 1280, height: 720 }], ['mobile', { width: 390, height: 844 }]]) {
      const p = await browser.newPage({ viewport: vp, deviceScaleFactor: 1 });
      const html = path.join(tmp, `${kind}-${s.id}.html`);
      fs.writeFileSync(html, page(s, kind === 'mobile'));
      await p.goto('file://' + html);
      await p.evaluate(() => document.fonts.ready);
      const file = path.join(tmp, `${kind}-${s.id}.png`);
      await p.screenshot({ path: file, fullPage: kind === 'mobile' });
      shots[kind].push(file);
      if (['S01-1', 'S01-3', 'S02-3', 'S03-2', 'S03-3', 'S04-3'].includes(s.id)) fs.copyFileSync(file, path.join(OUT, `${kind}-${s.id}.png`));
      if (process.env.PREVIEW_ALL_DIR) fs.copyFileSync(file, path.join(process.env.PREVIEW_ALL_DIR, `${kind}-${s.id}.png`));
      await p.close();
    }
    const light = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    await light.setContent(page(data.screens.find(s => s.id === 'S03-2'), false, 'light'));
    await light.evaluate(() => document.fonts.ready);
    await light.screenshot({ path: path.join(OUT, 'pc-S03-2-light.png') });
    for (const [kind, cols, w] of [['pc', 3, 420], ['mobile', 6, 200]]) {
      const sheet = await browser.newPage({ viewport: { width: cols * (w + 12) + 12, height: 400 } });
      const html = path.join(tmp, `${kind}-sheet.html`);
      fs.writeFileSync(html, `<body style="margin:0;padding:12px;background:#0b1220;display:grid;grid-template-columns:repeat(${cols},${w}px);gap:12px;align-items:start">${shots[kind]
        .map(f => `<img src="file://${f}" style="width:${w}px;border:1px solid #334155">`).join('')}</body>`);
      await sheet.goto('file://' + html);
      await sheet.screenshot({ path: path.join(OUT, `${kind}-all.png`), fullPage: true });
      await sheet.close();
    }
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log('preview:', fs.readdirSync(OUT).join(', '));
  }
  await browser.close();
  process.exitCode = problems.length ? 1 : 0;
})();
