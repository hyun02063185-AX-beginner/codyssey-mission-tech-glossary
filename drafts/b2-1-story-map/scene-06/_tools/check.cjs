// B2-1 Scene 06 SVG 자동 검사. Scene 05 검사기와 같은 기준에, 이번 장면의 선 모양·상자 약속을 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 선 끝이 해당 상자에 닿음(실행 순서 data-call · return data-return · 예외 data-exc · 감쌈/가리킴 data-rel),
// 선 모양 약속: 실행 순서 = 실선 + 검은 화살촉 / return = 회색 실선 + 빈 화살촉 / 예외 = 빨간 파선(처리)·점선(전파) + 빨간 화살촉 /
// 관계 = 점선·화살촉 없음, return·관계 선 16px 안에 번호 원 없음,
// 상자 약속: wrapper 상자에 'wrapper' 글자, 원래 함수 상자에 '원래 함수' 글자, 반복 줄 띠에 '반복' 글자(색만으로 구분하지 않음),
// 번호 원은 그림 A·D 안에 없음, 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치.
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'decorator-flow-desktop.svg', mobile: 'decorator-flow-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');
const NO_NUMBER = /^(a-left|a-right|rel-fn|rel-wrapper|d-)/;

function html(svg, pretendard) {
  const face = pretendard ? `@font-face{font-family:"Pretendard VF";src:url("data:font/woff2;base64,${FONT_B64}") format("woff2");font-weight:45 920;}` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${face}body{margin:0}</style></head><body>${svg}</body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  let fail = 0;
  const semantic = {};
  for (const mode of ['pretendard', 'fallback']) {
    console.log(`\n===== 글꼴: ${mode === 'pretendard' ? 'Pretendard VF (웹 서비스 글꼴)' : '시스템 대체 글꼴'} =====`);
    for (const [kind, file] of Object.entries(FILES)) {
      await page.setContent(html(fs.readFileSync(path.join(DIR, file), 'utf8'), mode === 'pretendard'));
      await page.evaluate(() => document.fonts.ready);
      if (mode === 'pretendard' && !(await page.evaluate(() => document.fonts.check('16px "Pretendard VF"')))) { console.log('  FAIL Pretendard VF를 불러오지 못함'); fail++; }
      const d = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        const vb = svg.viewBox.baseVal;
        const bb = (el) => { const b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const texts = [...svg.querySelectorAll('text')].map((t) => ({ s: t.textContent, in: t.getAttribute('data-in'), size: +t.getAttribute('font-size'), ...bb(t) }));
        const boxes = {};
        for (const r of svg.querySelectorAll('[data-box]')) boxes[r.getAttribute('data-box')] = bb(r);
        const marks = [...svg.querySelectorAll('[data-step-mark]')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), n: c.getAttribute('data-step-mark') }));
        const lines = [...svg.querySelectorAll('path.flow, path.ret, path.exc, path.exc2, path.ref, path.conv, path.imp')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          const cs = getComputedStyle(p);
          return { cls: p.getAttribute('class'), call: p.getAttribute('data-call'), ret: p.getAttribute('data-return'), exc: p.getAttribute('data-exc'),
            rel: p.getAttribute('data-rel'), marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, stroke: cs.stroke, pts };
        });
        const textsIn = (box) => [...svg.querySelectorAll(`text[data-in="${box}"]`)].map((t) => t.textContent).join(' ');
        const rules = [];
        for (const r of svg.querySelectorAll('rect.wrapB[data-box]')) if (!/wrapper/.test(textsIn(r.getAttribute('data-box')))) rules.push(`wrapper 상자에 'wrapper' 글자 없음: ${r.getAttribute('data-box')}`);
        for (const r of svg.querySelectorAll('rect.origB[data-box]')) if (!/원래 함수/.test(textsIn(r.getAttribute('data-box')))) rules.push(`원래 함수 상자에 '원래 함수' 글자 없음: ${r.getAttribute('data-box')}`);
        for (const r of svg.querySelectorAll('rect.rep[data-box]')) if (!/반복/.test(textsIn(r.getAttribute('data-box')))) rules.push(`반복 띠에 '반복' 글자 없음: ${r.getAttribute('data-box')}`);
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines, rules,
          srcs: attrs('[data-src] [data-line], [data-src] [data-span]', (e) => `${e.closest('[data-src]').getAttribute('data-src')}:${e.getAttribute('data-line') || e.getAttribute('data-span')}=${e.textContent}`),
          reps: attrs('[data-rep]', (e) => e.closest('[data-src]').getAttribute('data-src')),
          bsteps: attrs('[data-bstep]', (e) => e.getAttribute('data-bstep')),
          outs: attrs('[data-out]', (e) => e.getAttribute('data-out')),
          paths: attrs('g[data-path]', (g) => g.getAttribute('data-path')),
          gots: attrs('[data-got]', (e) => `${e.closest('g[data-path]').getAttribute('data-path')}=${e.getAttribute('data-got')}`),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          returns: attrs('[data-return]', (e) => e.getAttribute('data-return')),
          excs: attrs('[data-exc]', (e) => `${e.getAttribute('data-exc')}:${e.getAttribute('class')}`),
          rels: attrs('[data-rel]', (e) => e.getAttribute('data-rel')),
          concerns: attrs('g[data-concern]', (g) => g.getAttribute('data-concern')),
          rows: attrs('[data-row]', (e) => `${e.closest('g[data-concern]').getAttribute('data-concern')}:${e.getAttribute('data-row')}`),
          duties: attrs('[data-duty]', (e) => e.getAttribute('data-duty')),
          wraps: attrs('[data-wrap]', (e) => e.getAttribute('data-wrap')),
          notes: attrs('[data-note]', (e) => e.getAttribute('data-note')),
          marksN: marks.map((m) => m.n) };
      });
      const issues = [...d.rules];
      const ov = (a, b, pad = 0) => a.x < b.x + b.w - pad && b.x < a.x + a.w - pad && a.y < b.y + b.h - pad && b.y < a.y + a.h - pad;
      for (const t of d.texts) {
        if (t.x < 0 || t.y < 0 || t.x + t.w > d.vb.w || t.y + t.h > d.vb.h) issues.push(`뷰박스 이탈: "${t.s}"`);
        if (t.in) {
          const b = d.boxes[t.in];
          if (!b) issues.push(`담는 상자 없음: "${t.s}" → ${t.in}`);
          else if (t.x < b.x + 3 || t.x + t.w > b.x + b.w - 3 || t.y < b.y + 1 || t.y + t.h > b.y + b.h - 1) issues.push(`상자 밖으로 나감: "${t.s}" (${t.in})`);
        }
      }
      for (let i = 0; i < d.texts.length; i++) for (let j = i + 1; j < d.texts.length; j++)
        if (ov(d.texts[i], d.texts[j], 1)) issues.push(`글자 겹침: "${d.texts[i].s}" / "${d.texts[j].s}"`);
      const ids = Object.keys(d.boxes);
      const contains = (a, b) => b.x >= a.x - 0.5 && b.y >= a.y - 0.5 && b.x + b.w <= a.x + a.w + 0.5 && b.y + b.h <= a.y + a.h + 0.5;
      for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
        const a = d.boxes[ids[i]], b = d.boxes[ids[j]];
        if (ov(a, b, 0.5) && !contains(a, b) && !contains(b, a)) issues.push(`상자 어긋난 겹침: ${ids[i]} / ${ids[j]}`);
      }
      for (const l of d.lines) for (const t of d.texts) {
        if (/^[0-9]$/.test(t.s)) continue; // 번호 원 안의 숫자
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.call || l.ret || l.exc || l.rel || l.cls} / "${t.s}"`);
      }
      const near = (p, b) => {
        const onX = p.x >= b.x - 4 && p.x <= b.x + b.w + 4, onY = p.y >= b.y - 4 && p.y <= b.y + b.h + 4;
        const dx = Math.min(Math.abs(p.x - b.x), Math.abs(p.x - b.x - b.w)), dy = Math.min(Math.abs(p.y - b.y), Math.abs(p.y - b.y - b.h));
        return (onY && dx <= 4) || (onX && dy <= 4);
      };
      const box = (id) => d.boxes[`call-${id}`] || d.boxes[`rel-${id}`];
      const ends = (l, spec, label) => {
        const [a, b] = spec.split('@')[0].split('>');
        const A = box(a), B = box(b);
        if (!A || !B || !near(l.pts[0], A) || !near(l.pts[l.pts.length - 1], B)) issues.push(`선 끝이 상자에 닿지 않음: ${label}`);
      };
      for (const l of d.lines) {
        if (l.call) { ends(l, l.call, l.call); if (!/arr\)$/.test(l.marker) || l.dash !== 'none') issues.push(`실행 순서 선 모양이 약속과 다름: ${l.call}`); }
        if (l.ret) { ends(l, l.ret, 'return ' + l.ret); if (!/ret\)$/.test(l.marker) || l.dash !== 'none') issues.push(`return 선 모양이 약속과 다름: ${l.ret}`); }
        if (l.exc) {
          ends(l, l.exc, 'exc ' + l.exc);
          if (!/ex\)$/.test(l.marker) || l.dash === 'none') issues.push(`예외 선 모양이 약속과 다름(빨간 파선/점선·빨간 화살촉): ${l.exc}`);
        }
        if (l.rel) { ends(l, l.rel, 'rel ' + l.rel); if (l.marker || l.dash === 'none') issues.push(`관계 선 모양이 약속과 다름(점선·화살촉 없음): ${l.rel}`); }
        if ((l.ret || l.rel) && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`번호 없는 선 근처에 번호 원이 있음: ${l.ret || l.rel}`);
      }
      const excKinds = new Set(d.lines.filter((l) => l.exc).map((l) => `${l.cls}:${l.dash}`));
      if (d.lines.some((l) => l.exc) && excKinds.size < 2) issues.push('처리되는 예외와 전파되는 예외의 선 모양이 같음');
      for (const m of d.marks) for (const [id, b] of Object.entries(d.boxes))
        if (NO_NUMBER.test(id) && m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h) issues.push(`번호 원이 번호 없는 영역 안에 있음: ${id}`);
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·선 모양 4종·예외 두 모양·wrapper/원래 함수/반복 글자·번호 없는 영역 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['srcs', 'reps', 'bsteps', 'outs', 'paths', 'gots', 'calls', 'returns', 'excs', 'rels', 'concerns', 'rows', 'duties', 'wraps', 'notes', 'marksN']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
