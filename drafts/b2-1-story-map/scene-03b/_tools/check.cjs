// B2-1 Scene 03-B SVG 자동 검사. Scene 03-A 검사기와 같은 기준에, 그림 A의 행 표시 약속과 '번호 없는 곳' 검사를 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 호출·return 선의 양 끝이 해당 상자에 닿음, 호출 선 = 실선 + 채운 화살촉, return 선 = 회색 실선 + 빈 화살촉 + 16px 안 번호 원 없음,
// 그림 A 행 표시: 바뀐 행마다 글자 표시(색만으로 구분하지 않음), 삭제 = 파선 테두리 + 취소선, 값 변경 = 이전 값(data-old) + 취소선,
// 번호 원은 그림 B-1 호출 흐름(와 범례) 밖에 없음(데이터 카드·책임 표·초점 카드에 번호 없음),
// 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치.
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'crud-flow-desktop.svg', mobile: 'crud-flow-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');
const NO_NUMBER = /^(op-|mx-|focus-|branch-|kind-|data-shape|bridge|legend-a)/;

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
          return { cls: p.getAttribute('class'), call: p.getAttribute('data-call'), ret: p.getAttribute('data-return'),
            marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, pts };
        });
        const rowsInfo = [...svg.querySelectorAll('g[data-row]')].map((g) => ({
          key: `${g.getAttribute('data-op')}@${g.getAttribute('data-row')}@${g.getAttribute('data-change')}`,
          change: g.getAttribute('data-change'), old: g.getAttribute('data-old'),
          rectCls: g.querySelector('rect').getAttribute('class'), dash: getComputedStyle(g.querySelector('rect')).strokeDasharray,
          strike: !!g.querySelector('path.strike'), strikeU: !!g.querySelector('path.strikeU'),
          tag: [...g.querySelectorAll('text')].some((t) => /^(\+ 추가|읽음|읽음 · 변화 없음|값 변경|변경|− 삭제)$/.test(t.textContent)) }));
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines, rowsInfo,
          rows: rowsInfo.map((r) => r.key).filter((k) => !k.startsWith('source@')),
          cards: attrs('g[data-card]', (g) => g.getAttribute('data-card')),
          kinds: attrs('g[data-kind]', (g) => g.getAttribute('data-kind')),
          summary: attrs('[data-summary]', (e) => e.getAttribute('data-summary')),
          original: attrs('[data-original]', (e) => e.getAttribute('data-original')),
          outs: attrs('[data-out]', (e) => e.getAttribute('data-out')),
          callnodes: attrs('g[data-callnode]', (g) => `${g.getAttribute('data-callnode')}@${g.getAttribute('data-layer')}`),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          returns: attrs('[data-return]', (e) => e.getAttribute('data-return')),
          focus: attrs('g[data-focus]', (g) => g.getAttribute('data-focus')),
          branches: attrs('g[data-branch]', (g) => g.getAttribute('data-branch')),
          features: attrs('g[data-feature]', (g) => g.getAttribute('data-feature')),
          duties: attrs('[data-duty]', (e) => `${e.getAttribute('data-duty')}=${e.getAttribute('data-code')}`) };
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
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.call || l.ret || l.cls} / "${t.s}"`);
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
        if (l.call) { const [ab] = l.call.split('@'); const [a, b] = ab.split('>'); ends(l, d.boxes[`call-${a}`], d.boxes[`call-${b}`], l.call); }
        if (l.ret) { const [a, b] = l.ret.split('>'); ends(l, d.boxes[`call-${a}`], d.boxes[`call-${b}`], 'return ' + l.ret); }
        if (l.ret && (!/ret\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`return 선 모양이 약속과 다름(회색 실선·빈 화살촉): ${l.ret}`);
        if (l.ret && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`return 선 근처에 번호 원이 있음: ${l.ret}`);
        if (l.call && (!/arr\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`호출 선 모양이 약속과 다름(실선·채운 화살촉): ${l.call}`);
      }
      // 그림 A 행 표시 약속
      for (const r of d.rowsInfo) {
        if (r.change !== 'none' && !r.tag) issues.push(`바뀐 행에 글자 표시 없음(색만으로 구분): ${r.key}`);
        if (r.change === 'del' && (!r.strike || r.dash === 'none' || r.rectCls !== 'rowDel')) issues.push(`삭제 행 약속(파선 테두리·취소선)과 다름: ${r.key}`);
        if (r.change === 'upd' && (!r.strikeU || !r.old)) issues.push(`값 변경 행 약속(이전 값·취소선)과 다름: ${r.key}`);
        if (r.change === 'none' && r.rectCls !== 'rowN') issues.push(`바뀌지 않은 행에 강조 테두리: ${r.key}`);
      }
      // 번호 원은 개념·데이터 영역에 없어야 한다
      for (const m of d.marks) for (const [id, b] of Object.entries(d.boxes))
        if (NO_NUMBER.test(id) && m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h) issues.push(`번호 원이 번호 없는 영역 안에 있음: ${id}`);
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·호출/return 선 모양·행 표시·번호 없는 영역 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 (원본 표 source는 휴대전화에서 \'처음 상태\'로 대신함) =====');
  for (const key of ['cards', 'rows', 'kinds', 'summary', 'original', 'outs', 'callnodes', 'calls', 'returns', 'focus', 'branches', 'features', 'duties']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
