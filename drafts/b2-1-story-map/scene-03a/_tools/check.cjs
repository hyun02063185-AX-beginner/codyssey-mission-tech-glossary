// B2-1 Scene 03-A SVG 자동 검사. Scene 02 검사기와 같은 기준에, return 선(회색 가는 실선·빈 화살촉·번호 없음) 검사를 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 실행 순서·호출·import 화살표의 양 끝이 해당 상자에 닿음,
// import 선은 파선 + 빈 화살촉, return 선은 회색 실선 + 빈 화살촉이고 둘 다 근처에 번호 원이 없음 / 호출 선은 실선 + 채운 화살촉,
// 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치(코드 부분·객체·비교 카드·계층·호출·return·import·실행 결과).
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'class-layer-desktop.svg', mobile: 'class-layer-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');

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
        const marks = [...svg.querySelectorAll('[data-step-mark]')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy') }));
        const lines = [...svg.querySelectorAll('path.flow, path.imp, path.ref, path.ret')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          const cs = getComputedStyle(p);
          return { cls: p.getAttribute('class'), flow: p.getAttribute('data-flow'), call: p.getAttribute('data-call'), imp: p.getAttribute('data-import'), ret: p.getAttribute('data-return'),
            marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, pts };
        });
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines,
          parts: attrs('g[data-part]', (g) => g.getAttribute('data-part')),
          objects: attrs('g[data-object]', (g) => g.getAttribute('data-object')),
          layers: attrs('g[data-layer]:not([data-callnode])', (g) => g.getAttribute('data-layer')),
          outs: attrs('[data-out]', (e) => e.getAttribute('data-out')),
          returns: attrs('[data-return]', (e) => e.getAttribute('data-return')),
          imports: attrs('[data-import]', (e) => e.getAttribute('data-import')),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          callnodes: attrs('g[data-callnode]', (g) => `${g.getAttribute('data-callnode')}@${g.getAttribute('data-layer')}`),
          modules: attrs('g[data-module]', (g) => g.getAttribute('data-module')),
          cards: attrs('g[data-card]', (g) => g.getAttribute('data-card')),
          contrasts: attrs('g[data-contrast]', (g) => g.getAttribute('data-contrast')) };
      });
      const issues = [];
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
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.flow || l.call || l.imp || l.ret || l.cls} / "${t.s}"`);
      }
      const near = (p, b) => {
        const onX = p.x >= b.x - 4 && p.x <= b.x + b.w + 4, onY = p.y >= b.y - 4 && p.y <= b.y + b.h + 4;
        const dx = Math.min(Math.abs(p.x - b.x), Math.abs(p.x - b.x - b.w)), dy = Math.min(Math.abs(p.y - b.y), Math.abs(p.y - b.y - b.h));
        return (onY && dx <= 4) || (onX && dy <= 4);
      };
      const ends = (l, A, B, label) => {
        if (!A || !B || !near(l.pts[0], A) || !near(l.pts[l.pts.length - 1], B)) issues.push(`선 끝이 상자에 닿지 않음: ${label}`);
      };
      for (const l of d.lines) {
        if (l.flow) { const [a, b] = l.flow.split('>'); ends(l, d.boxes[`step-${a}`], d.boxes[`step-${b}`], l.flow); }
        if (l.call) { const [ab] = l.call.split('@'); const [a, b] = ab.split('>'); ends(l, d.boxes[`call-${a}`], d.boxes[`call-${b}`], l.call); }
        if (l.imp) { const [a, b] = l.imp.split('>'); ends(l, d.boxes[`mod-${a}`], d.boxes[`mod-${b}`], l.imp); }
        if (l.ret) { const [a, b] = l.ret.split('>'); ends(l, d.boxes[`call-${a}`], d.boxes[`call-${b}`], 'return ' + l.ret); }
        if (l.ret && (!/ret\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`return 선 모양이 약속과 다름(회색 실선·빈 화살촉): ${l.ret}`);
        if (l.ret && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`return 선 근처에 번호 원이 있음: ${l.ret}`);
        // 두 지도의 시각 구분
        if (l.imp && (!/open\)$/.test(l.marker) || l.dash === 'none')) issues.push(`import 선 모양이 약속과 다름(파선·빈 화살촉): ${l.imp}`);
        if ((l.flow || l.call) && (!/arr\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`실행·호출 선 모양이 약속과 다름(실선·채운 화살촉): ${l.flow || l.call}`);
        if (l.imp && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 30))) issues.push(`import 선 근처에 번호 원이 있음: ${l.imp}`);
      }
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·호출/return/import 선 모양 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['parts', 'objects', 'cards', 'outs', 'layers', 'callnodes', 'calls', 'returns', 'modules', 'imports', 'contrasts']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
