// B2-1 Scene 07 SVG 자동 검사. Scene 06 검사기와 같은 기준에, 이번 장면의 선 모양·상자 약속을 더했다.
// 두 글꼴 환경(웹 서비스의 Pretendard VF, 시스템 대체 글꼴)에서 렌더링해 잰다.
// 검사: 뷰박스 이탈, 글자 겹침, 글자가 담긴 상자 밖으로 나감, 상자끼리 어긋난 겹침, 선이 글자 위를 지남,
// 선 끝이 해당 상자에 닿음(실행 순서 data-call · return data-return · 예외 data-exc · 변환 data-conv · 연결 data-rel),
// 선 모양 약속: 실행 순서 = 실선 + 검은 화살촉 / return = 회색 실선 + 빈 화살촉 / 예외 = 빨간 파선(처리)·점선(전파) + 빨간 화살촉 /
// 변환 = 청록 실선 + 청록 화살촉 / 연결 = 점선·화살촉 없음, return·변환·연결 선 16px 안에 번호 원 없음,
// 상자 약속: Parameter 칸에 Parameter 이름, '표시만' 칸에 '표시만', 실행되지 않은 단계에 '실행되지 않음' 글자(색만으로 구분하지 않음),
// 번호 원은 그림 A·B·D 안에 없음, 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치.
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>, 설치된 Chrome을 쓰려면 PW_CHANNEL=chrome,
//        다른 폴더의 SVG를 검사하려면 SCENE_DIR=<폴더>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = process.env.SCENE_DIR || path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'type-hint-flow-desktop.svg', mobile: 'type-hint-flow-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');
const NO_NUMBER = /^(a-|b-|d-)/;

function html(svg, pretendard) {
  const face = pretendard ? `@font-face{font-family:"Pretendard VF";src:url("data:font/woff2;base64,${FONT_B64}") format("woff2");font-weight:45 920;}` : '';
  return `<!doctype html><html><head><meta charset="utf-8"><style>${face}body{margin:0}</style></head><body>${svg}</body></html>`;
}

(async () => {
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  console.log(`브라우저: ${browser.version()}${process.env.PW_CHANNEL ? ` (channel ${process.env.PW_CHANNEL})` : ''}`);
  const page = await browser.newPage();
  let fail = 0;
  const semantic = {};
  for (const mode of ['pretendard', 'fallback']) {
    console.log(`\n===== 글꼴: ${mode === 'pretendard' ? 'Pretendard VF (웹 서비스 글꼴)' : '시스템 대체 글꼴'} =====`);
    for (const [kind, file] of Object.entries(FILES)) {
      await page.setContent(html(fs.readFileSync(path.join(DIR, file), 'utf8'), mode === 'pretendard'));
      await page.evaluate(() => document.fonts.ready);
      if (mode === 'pretendard' && !(await page.evaluate(() => document.fonts.check('16px "Pretendard VF"')))) { console.log('  FAIL Pretendard VF를 불러오지 못함'); fail++; }
      if (mode === 'fallback') {
        const used = await page.evaluate(() => [...new Set([...document.querySelectorAll('text')].slice(0, 3).map((t) => getComputedStyle(t).fontFamily))]);
        console.log(`  (대체 글꼴 지정: ${used[0].slice(0, 80)}…)`);
      }
      const d = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        const vb = svg.viewBox.baseVal;
        const bb = (el) => { const b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const texts = [...svg.querySelectorAll('text')].map((t) => ({ s: t.textContent, in: t.getAttribute('data-in'), size: +t.getAttribute('font-size'), ...bb(t) }));
        const boxes = {};
        for (const r of svg.querySelectorAll('[data-box]')) boxes[r.getAttribute('data-box')] = bb(r);
        const marks = [...svg.querySelectorAll('[data-step-mark]')].map((c) => ({ x: +c.getAttribute('cx'), y: +c.getAttribute('cy'), n: c.getAttribute('data-step-mark') }));
        const lines = [...svg.querySelectorAll('path.flow, path.ret, path.exc, path.exc2, path.ref, path.conv')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          const cs = getComputedStyle(p);
          return { cls: p.getAttribute('class'), call: p.getAttribute('data-call'), ret: p.getAttribute('data-return'), exc: p.getAttribute('data-exc'),
            conv: p.getAttribute('data-conv'), rel: p.getAttribute('data-rel'), marker: p.getAttribute('marker-end') || '', dash: cs.strokeDasharray, pts };
        });
        const textsIn = (box) => [...svg.querySelectorAll(`text[data-in="${box}"]`)].map((t) => t.textContent).join(' ');
        const rules = [];
        for (const r of svg.querySelectorAll('rect.parB[data-box]')) if (!/price|quantity/.test(textsIn(r.getAttribute('data-box')))) rules.push(`Parameter 칸에 Parameter 이름 없음: ${r.getAttribute('data-box')}`);
        for (const r of svg.querySelectorAll('rect.hintTag[data-box]')) if (!/표시만/.test(textsIn(r.getAttribute('data-box')))) rules.push(`'표시만' 칸에 '표시만' 글자 없음: ${r.getAttribute('data-box')}`);
        for (const r of svg.querySelectorAll('rect.skip[data-box]')) if (!/실행되지 않음/.test(textsIn(r.getAttribute('data-box')))) rules.push(`실행되지 않은 단계에 '실행되지 않음' 글자 없음: ${r.getAttribute('data-box')}`);
        const attrs = (sel, f) => [...svg.querySelectorAll(sel)].map(f);
        // 소스 줄: 휴대전화에서 나눠 그린 줄(data-part)은 이어 붙여 노트북 줄과 비교한다
        const src = {};
        for (const e of svg.querySelectorAll('[data-src] [data-line]')) {
          const key = `${e.closest('[data-src]').getAttribute('data-src')}:${e.getAttribute('data-line')}`;
          const t = e.tagName === 'text' ? e.textContent : [...e.querySelectorAll('text')].map((x) => x.textContent).join('');
          src[key] = src[key] === undefined ? t : src[key] + (src[key].endsWith(',') ? ' ' : '') + t.trim();
        }
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, marks, lines, rules,
          srcs: Object.entries(src).map(([k, v]) => `${k}=${v}`),
          cases: attrs('g[data-case][data-call-expr]', (g) => `${g.getAttribute('data-case')}|${g.getAttribute('data-call-expr')}|${g.getAttribute('data-bind')}`),
          ccases: attrs('g[data-case][data-arg]', (g) => `${g.getAttribute('data-case')}|${g.getAttribute('data-arg')}|exit ${g.getAttribute('data-exit')}`),
          stages: attrs('[data-stage]', (e) => `${e.closest('g[data-case]').getAttribute('data-case')}:${e.getAttribute('data-stage')}`),
          outs: attrs('[data-out]', (e) => e.getAttribute('data-out')),
          partsOf: attrs('[data-part-of]', (e) => e.getAttribute('data-part-of')),
          gains: attrs('[data-gain]', (e) => e.getAttribute('data-gain')),
          inputs: attrs('g[data-input]', (g) => `${g.getAttribute('data-input')}=${g.getAttribute('data-decl')}`),
          cards: attrs('g[data-card]', (g) => g.getAttribute('data-card')),
          gists: attrs('[data-gist]', (e) => e.getAttribute('data-gist')),
          calls: attrs('[data-call]', (e) => e.getAttribute('data-call')),
          returns: attrs('[data-return]', (e) => e.getAttribute('data-return')),
          excs: attrs('[data-exc]', (e) => `${e.getAttribute('data-exc')}:${e.getAttribute('class')}`),
          convs: attrs('[data-conv]', (e) => e.getAttribute('data-conv')),
          rels: attrs('[data-rel]', (e) => e.getAttribute('data-rel')),
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
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.call || l.ret || l.exc || l.conv || l.rel || l.cls} / "${t.s}"`);
      }
      const near = (p, b) => {
        const onX = p.x >= b.x - 4 && p.x <= b.x + b.w + 4, onY = p.y >= b.y - 4 && p.y <= b.y + b.h + 4;
        const dx = Math.min(Math.abs(p.x - b.x), Math.abs(p.x - b.x - b.w)), dy = Math.min(Math.abs(p.y - b.y), Math.abs(p.y - b.y - b.h));
        return (onY && dx <= 4) || (onX && dy <= 4);
      };
      const ends = (l, spec, label) => {
        const [a, b] = spec.split('@')[0].split('>');
        const A = d.boxes[a], B = d.boxes[b];
        if (!A || !B || !near(l.pts[0], A) || !near(l.pts[l.pts.length - 1], B)) issues.push(`선 끝이 상자에 닿지 않음: ${label}`);
      };
      for (const l of d.lines) {
        if (l.call) { ends(l, l.call, l.call); if (!/arr\)$/.test(l.marker) || l.dash !== 'none') issues.push(`실행 순서 선 모양이 약속과 다름: ${l.call}`); }
        if (l.ret) { ends(l, l.ret, 'return ' + l.ret); if (!/ret\)$/.test(l.marker) || l.dash !== 'none') issues.push(`return 선 모양이 약속과 다름: ${l.ret}`); }
        if (l.exc) {
          ends(l, l.exc, 'exc ' + l.exc);
          if (!/ex\)$/.test(l.marker) || l.dash === 'none') issues.push(`예외 선 모양이 약속과 다름(빨간 파선/점선·빨간 화살촉): ${l.exc}`);
        }
        if (l.conv) { ends(l, l.conv, 'conv ' + l.conv); if (!/cv\)$/.test(l.marker) || l.dash !== 'none') issues.push(`변환 선 모양이 약속과 다름(청록 실선·청록 화살촉): ${l.conv}`); }
        if (l.rel) { ends(l, l.rel, 'rel ' + l.rel); if (l.marker || l.dash === 'none') issues.push(`연결 선 모양이 약속과 다름(점선·화살촉 없음): ${l.rel}`); }
        if ((l.ret || l.rel || l.conv) && d.marks.some((m) => l.pts.some((p) => Math.hypot(p.x - m.x, p.y - m.y) < 16))) issues.push(`번호 없는 선 근처에 번호 원이 있음: ${l.ret || l.rel || l.conv}`);
      }
      const excKinds = new Set(d.lines.filter((l) => l.exc).map((l) => `${l.cls}:${l.dash}`));
      if (d.lines.some((l) => l.exc) && excKinds.size < 2) issues.push('처리되는 예외와 전파되는 예외의 선 모양이 같음');
      for (const m of d.marks) for (const [id, b] of Object.entries(d.boxes))
        if (NO_NUMBER.test(id) && m.x > b.x && m.x < b.x + b.w && m.y > b.y && m.y < b.y + b.h) issues.push(`번호 원이 번호 없는 영역 안에 있음: ${id}`);
      const min = Math.min(...d.texts.map((t) => t.size));
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${Math.ceil((READABLE * d.vb.w) / min)}px`);
      console.log(`  선: 실행 순서 ${d.lines.filter((l) => l.call).length} · return ${d.lines.filter((l) => l.ret).length} · 예외 ${d.lines.filter((l) => l.exc).length} · 변환 ${d.lines.filter((l) => l.conv).length} · 연결 ${d.lines.filter((l) => l.rel).length}`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·선 끝·선 모양 5종·예외 두 모양·Parameter/표시만/실행되지 않음 글자·번호 없는 영역 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['srcs', 'cases', 'ccases', 'stages', 'outs', 'partsOf', 'gains', 'inputs', 'cards', 'gists', 'calls', 'returns', 'excs', 'convs', 'rels', 'marksN']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
