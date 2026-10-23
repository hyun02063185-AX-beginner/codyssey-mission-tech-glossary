// B2-1 Scene 05 SVG 자동 검사. Scene 04 검사기와 같은 기준에, 이번 장면의 시각 약속 검사를 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 실행 순서 선(data-call)·변환 선(data-conv)·만들어 냄 선(data-rel)의 양 끝이 해당 상자에 닿음,
// 실행 순서 선 = 실선 + 채운 검은 화살촉, 변환 선 = 청록 실선 + 채운 청록 화살촉 + 16px 안 번호 원 없음, 만들어 냄 선 = 점선·화살촉 없음,
// Iterator 칸: 꺼낸 칸 = 회색 + '꺼냄' 글자 + 호출 번호 원, 다음 칸 = 굵은 테두리 + '다음' 글자(색만으로 구분하지 않음),
// Generator 상태 칸 = 상태별 테두리 + 상태 글자(생성됨·멈춤·종료), 그림 D: 꺼낸 줄 = 점선 칸 + 'n행', 남긴 거래 = 굵은 칸 + 'id n',
// 번호 원은 실행 순서 영역 밖(포함 관계·그림 D·변환 상자·범례 밖 설명)에 없음, 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치.
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'generator-stream-desktop.svg', mobile: 'generator-stream-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');
const NO_NUMBER = /^(kind-|way|legend-d|d-notes|cv-|bval-|bstate-)/;
const STATE_TAG = { created: '생성됨', paused: '멈춤', done: '종료' };

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
      const d = await page.evaluate((STATE_TAG) => {
        const svg = document.querySelector('svg');
        const vb = svg.viewBox.baseVal;
        const bb = (el) => { const b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const texts = [...svg.querySelectorAll('text')].map((t) => ({ s: t.textContent, in: t.getAttribute('data-in'), size: +t.getAttribute('font-size'), ...bb(t) }));
        const boxes = {};
        for (const r of svg.querySelectorAll('[data-box]')) boxes[r.getAttribute('data-box')] = bb(r);
        const marks = [...svg.querySelectorAll('[data-step-mark]')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), n: c.getAttribute('data-step-mark') }));
        const lines = [...svg.querySelectorAll('path.flow, path.imp, path.ref, path.ret, path.conv')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          const cs = getComputedStyle(p);
          return { cls: p.getAttribute('class'), call: p.getAttribute('data-call'), conv: p.getAttribute('data-conv'), rel: p.getAttribute('data-rel'),
            marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, pts };
        });
        const textsIn = (box) => [...svg.querySelectorAll(`text[data-in="${box}"]`)].map((t) => t.textContent);
        const cellRules = [];
        for (const r of svg.querySelectorAll('rect.took[data-box], rect.nextC[data-box]')) {
          const id = r.getAttribute('data-box'); const b = bb(r); const tx = textsIn(id);
          const hasMark = [...svg.querySelectorAll('[data-step-mark]')].some((c) => +c.getAttribute('cx') > b.x && +c.getAttribute('cx') < b.x + b.w && +c.getAttribute('cy') > b.y && +c.getAttribute('cy') < b.y + b.h);
          if (r.classList.contains('took') && (!tx.includes('꺼냄') || !hasMark)) cellRules.push(`꺼낸 칸에 '꺼냄' 글자·호출 번호 원 없음: ${id}`);
          if (r.classList.contains('nextC') && !tx.includes('다음')) cellRules.push(`다음 칸에 '다음' 글자 없음: ${id}`);
        }
        for (const g of svg.querySelectorAll('g[data-gstep]')) {
          const st = g.getAttribute('data-state'); const r = g.querySelector('rect[data-box^="bstate-"]');
          const tx = textsIn(r.getAttribute('data-box')).join(' ');
          if (r.getAttribute('class') !== st || !tx.includes(STATE_TAG[st])) cellRules.push(`Generator 상태 칸 약속과 다름: ${g.getAttribute('data-gstep')} (${st})`);
          if (st === 'paused' && getComputedStyle(r).strokeDasharray === 'none') cellRules.push(`멈춤 칸이 파선이 아님: ${g.getAttribute('data-gstep')}`);
        }
        for (const r of svg.querySelectorAll('rect.readC[data-box]')) {
          const id = r.getAttribute('data-box'); if (id === 'lg-read') continue;
          if (!textsIn(id).some((t) => /^\d행$/.test(t))) cellRules.push(`꺼낸 줄 칸에 'n행' 글자 없음: ${id}`);
        }
        for (const r of svg.querySelectorAll('rect.keptC[data-box]')) {
          const id = r.getAttribute('data-box'); if (id === 'lg-kept' || /^bval-/.test(id)) continue;
          if (!textsIn(id).some((t) => /^id \d$/.test(t))) cellRules.push(`남긴 거래 칸에 'id n' 글자 없음: ${id}`);
        }
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines, cellRules,
          iterators: attrs('g[data-iterator]', (g) => `${g.getAttribute('data-iterator')}:${g.getAttribute('data-took')}>${g.getAttribute('data-next')}`),
          callnos: attrs('[data-callno]', (e) => e.getAttribute('data-callno')),
          outs: attrs('[data-out]', (e) => e.getAttribute('data-out')),
          members: attrs('[data-member]', (e) => e.getAttribute('data-member')),
          kinds: attrs('g[data-kind]', (g) => g.getAttribute('data-kind')),
          codelines: attrs('[data-codeline]', (e) => `${e.getAttribute('data-codeline')}=${e.textContent}`),
          gsteps: attrs('g[data-gstep]', (g) => `${g.getAttribute('data-gstep')}:${g.getAttribute('data-lines')}:${g.getAttribute('data-value')}:${g.getAttribute('data-state')}`),
          filelines: attrs('[data-format] [data-line]', (e) => `${e.closest('[data-format]').getAttribute('data-format')}:${e.getAttribute('data-line')}=${e.textContent}`),
          strs: attrs('[data-str]', (e) => e.getAttribute('data-str')),
          gots: attrs('[data-got]', (e) => e.getAttribute('data-got')),
          csteps: attrs('[data-cstep]', (e) => e.getAttribute('data-cstep')),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          convs: attrs('[data-conv]', (e) => e.getAttribute('data-conv')),
          rels: attrs('[data-rel]', (e) => e.getAttribute('data-rel')),
          ways: attrs('g[data-way]', (g) => `${g.getAttribute('data-way')}:${g.getAttribute('data-read')}:${g.getAttribute('data-kept')}`),
          orders: attrs('[data-order]', (e) => `${e.closest('g[data-way]').getAttribute('data-way')}=${e.getAttribute('data-order')}`),
          fulls: attrs('[data-full]', (e) => `${e.closest('g[data-way]').getAttribute('data-way')}=${e.getAttribute('data-full')}`),
          marksN: marks.map((m) => m.n),
          hls: attrs('[data-hl]', (e) => e.getAttribute('data-hl-lines')) };
      }, STATE_TAG);
      const issues = [...d.cellRules];
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
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.call || l.conv || l.rel || l.cls} / "${t.s}"`);
      }
      const near = (p, b) => {
        const onX = p.x >= b.x - 4 && p.x <= b.x + b.w + 4, onY = p.y >= b.y - 4 && p.y <= b.y + b.h + 4;
        const dx = Math.min(Math.abs(p.x - b.x), Math.abs(p.x - b.x - b.w)), dy = Math.min(Math.abs(p.y - b.y), Math.abs(p.y - b.y - b.h));
        return (onY && dx <= 4) || (onX && dy <= 4);
      };
      const box = (pre, id) => d.boxes[`${pre}-${id}`] || d.boxes[`cv-${id}`];
      const ends = (l, A, B, label) => {
        if (!A || !B || !near(l.pts[0], A) || !near(l.pts[l.pts.length - 1], B)) issues.push(`선 끝이 상자에 닿지 않음: ${label}`);
      };
      for (const l of d.lines) {
        if (l.call) { const [ab] = l.call.split('@'); const [a, b] = ab.split('>'); ends(l, box('call', a), box('call', b), l.call); }
        if (l.conv) { const [a, b] = l.conv.split('>'); ends(l, d.boxes[`cv-${a}`], d.boxes[`cv-${b}`], 'conv ' + l.conv); }
        if (l.rel) { const [a, b] = l.rel.split('>'); ends(l, d.boxes[`rel-${a}`], d.boxes[`rel-${b}`], 'rel ' + l.rel); }
        if (l.call && (!/arr\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`실행 순서 선 모양이 약속과 다름(실선·채운 검은 화살촉): ${l.call}`);
        if (l.conv && (!/cv\)$/.test(l.marker) || l.dash !== 'none')) issues.push(`변환 선 모양이 약속과 다름(청록 실선·채운 화살촉): ${l.conv}`);
        if (l.rel && (l.marker || l.dash === 'none')) issues.push(`만들어 냄 선 모양이 약속과 다름(점선·화살촉 없음): ${l.rel}`);
        if ((l.conv || l.rel) && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`번호 없는 선 근처에 번호 원이 있음: ${l.conv || l.rel}`);
      }
      for (const m of d.marks) for (const [id, b] of Object.entries(d.boxes))
        if (NO_NUMBER.test(id) && m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h) issues.push(`번호 원이 번호 없는 영역 안에 있음: ${id}`);
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·선 모양 3종·Iterator 칸·Generator 상태·꺼낸 줄/남긴 거래·번호 없는 영역 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['iterators', 'callnos', 'outs', 'kinds', 'members', 'codelines', 'gsteps', 'filelines', 'strs', 'gots', 'csteps', 'calls', 'convs', 'rels', 'ways', 'orders', 'fulls', 'marksN', 'hls']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
