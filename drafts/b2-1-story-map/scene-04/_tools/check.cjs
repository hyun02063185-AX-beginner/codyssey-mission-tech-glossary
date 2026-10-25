// B2-1 Scene 04 SVG 자동 검사. Scene 03-B 검사기와 같은 기준에, 저장 위치(메모리·파일) 칸 약속과 변환 선 약속을 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 처리 순서 선(data-call)·변환 선(data-conv)의 양 끝이 해당 상자에 닿음, 처리 순서 선 = 실선 + 채운 검은 화살촉,
// 변환 선 = 청록 실선 + 채운 청록 화살촉 + 16px 안 번호 원 없음,
// 그림 A 칸: 메모리 = 파선 테두리, 파일 = 실선 테두리(색만으로 구분하지 않음), 새 거래·새 줄에는 '+' 글자, 값 변경 칩에는 취소선,
// 번호 원은 그림 C-2(와 범례) 밖에 없음, 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치.
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'file-persistence-desktop.svg', mobile: 'file-persistence-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');
const NO_NUMBER = /^(a-|arow-|aout-|step-|band-|legend-a|fmt-|b-note|cv-|c1|cf-|bridge)/;

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
        const lines = [...svg.querySelectorAll('path.flow, path.imp, path.ref, path.ret, path.conv')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          const cs = getComputedStyle(p);
          return { cls: p.getAttribute('class'), call: p.getAttribute('data-call'), conv: p.getAttribute('data-conv'),
            marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, pts };
        });
        const cellsInfo = [...svg.querySelectorAll('g[data-cell]')].map((g) => {
          const r = g.querySelector('rect');
          return { key: g.getAttribute('data-cell'), state: g.getAttribute('data-state'), cls: r.getAttribute('class'),
            dash: getComputedStyle(r).strokeDasharray, newId: g.getAttribute('data-new'),
            plus: [...g.querySelectorAll('text')].some((t) => /^\+/.test(t.textContent.trim())) };
        });
        const updChips = [...svg.querySelectorAll('rect.rowUpd')].filter((r) => /-r[0-9]+$/.test(r.getAttribute('data-box') || '')).map((r) => {
          const b = bb(r);
          const has = [...svg.querySelectorAll('path.strikeU')].some((p) => { const q = p.getBBox(); return q.x >= b.x && q.x + q.width <= b.x + b.w && q.y >= b.y && q.y <= b.y + b.h; });
          return { box: r.getAttribute('data-box'), has };
        });
        const addRows = [...svg.querySelectorAll('rect.rowAdd[data-box]')].filter((r) => !/^lg-/.test(r.getAttribute('data-box'))).map((r) => {
          const b = bb(r);
          const has = [...svg.querySelectorAll('text')].some((t) => { const q = t.getBBox(); return /^\+|\+ "a"|덧붙임/.test(t.textContent) && q.y + q.height / 2 > b.y && q.y + q.height / 2 < b.y + b.h; });
          return { box: r.getAttribute('data-box'), has };
        });
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines, cellsInfo, updChips, addRows,
          cells: cellsInfo.map((c) => `${c.key}=${c.state}`).concat(attrs('g[data-cell]', (g) => `${g.getAttribute('data-cell')}#${g.getAttribute('data-ids')}+${g.getAttribute('data-new') || ''}`)),
          formatLines: attrs('[data-format] [data-line]', (e) => `${e.closest('[data-format]').getAttribute('data-format')}:${e.getAttribute('data-line')}=${e.textContent}`),
          fmtcards: attrs('g[data-fmtcard]', (g) => `${g.getAttribute('data-fmtcard')}=${g.getAttribute('data-amount')}`),
          newline: attrs('[data-newline]', (e) => e.getAttribute('data-newline')),
          reads: attrs('[data-read]', (e) => e.getAttribute('data-read')),
          outs: attrs('[data-out]', (e) => `${e.getAttribute('data-out')}@${e.getAttribute('data-run') || ''}`),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          c2: attrs('g[data-c2]', (g) => g.getAttribute('data-c2')),
          crud: attrs('g[data-crud]', (g) => g.getAttribute('data-crud')),
          stepfns: attrs('[data-step-fn]', (e) => e.getAttribute('data-step-fn')),
          upd: attrs('[data-upd]', (e) => e.getAttribute('data-upd')),
          hls: attrs('[data-hl]', (e) => `${e.getAttribute('data-box').replace(/-code-hl$/, '')}:${e.getAttribute('data-hl-lines')}`) };
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
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.call || l.conv || l.cls} / "${t.s}"`);
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
        if (l.conv) { const [a, b] = l.conv.split('>'); ends(l, d.boxes[`cv-${a}`], d.boxes[`cv-${b}`], 'conv ' + l.conv); }
        if (l.call && (!/arr\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`처리 순서 선 모양이 약속과 다름(실선·채운 검은 화살촉): ${l.call}`);
        if (l.conv && (!/cv\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`변환 선 모양이 약속과 다름(청록 실선·채운 화살촉): ${l.conv}`);
        if (l.conv && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`변환 선 근처에 번호 원이 있음: ${l.conv}`);
      }
      // 그림 A 칸 약속: 메모리 = 파선, 파일 = 실선, 새 거래 = '+' 글자
      for (const c of d.cellsInfo) {
        const lane = c.key.split(':')[2];
        const okCls = lane === 'memory' ? ['mem', 'memGone'] : ['disk', 'diskNone'];
        if (!okCls.includes(c.cls)) issues.push(`칸 종류가 저장 위치와 다름: ${c.key} (${c.cls})`);
        if (lane === 'memory' && c.dash === 'none') issues.push(`메모리 칸이 파선이 아님(색만으로 구분): ${c.key}`);
        if (lane === 'file' && c.cls === 'disk' && c.dash !== 'none') issues.push(`파일 칸이 실선이 아님: ${c.key}`);
        if (c.newId && !c.plus) issues.push(`새 거래에 '+' 글자 없음: ${c.key}`);
      }
      for (const u of d.updChips) if (!u.has) issues.push(`값 변경 칩에 이전 값 취소선 없음: ${u.box}`);
      for (const a of d.addRows) if (!a.has) issues.push(`새 줄·새 거래 표시에 글자 없음(색만으로 구분): ${a.box}`);
      for (const m of d.marks) for (const [id, b] of Object.entries(d.boxes))
        if (NO_NUMBER.test(id) && m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h) issues.push(`번호 원이 번호 없는 영역 안에 있음: ${id}`);
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·처리 순서/변환 선 모양·저장 위치 칸·새 거래·값 변경·번호 없는 영역 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['cells', 'formatLines', 'fmtcards', 'newline', 'reads', 'outs', 'calls', 'c2', 'crud', 'hls', 'stepfns', 'upd']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
