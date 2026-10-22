// B2-1 Scene 01 SVG 자동 검사.
// 두 글꼴 환경에서 렌더링해 잰다: 웹 서비스가 싣는 Pretendard VF(src/assets/fonts), 그리고 그 글꼴이 없을 때의 시스템 대체 글꼴.
// 검사: 뷰박스 이탈, 글자끼리 겹침, 글자가 담긴 상자(data-in → data-box) 밖으로 나감, 상자끼리 어긋난 겹침,
// 선(처리 순서·규칙 참고·해석 괄호)이 글자 위를 지나감, 처리 순서 화살표의 양 끝이 상자에 닿음,
// 표시 폭별 최소 글자, 노트북·휴대전화의 의미 일치(토큰·해석 주체·단계·규칙·비교 카드·선).
// 실행: node check.cjs   (playwright 패키지 경로가 다르면 PLAYWRIGHT=<경로>)
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || path.resolve(__dirname, '../../../../node_modules/playwright'));

const DIR = path.resolve(__dirname, '..');
const FONT = path.resolve(__dirname, '../../../../src/assets/fonts/PretendardVariable.woff2');
const FILES = { desktop: 'cli-command-desktop.svg', mobile: 'cli-command-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 960], mobile: [390, 360, 328] };
const READABLE = 12;
const FONT_B64 = fs.readFileSync(FONT).toString('base64');

function html(svg, pretendard) {
  const face = pretendard
    ? `@font-face{font-family:"Pretendard VF";src:url("data:font/woff2;base64,${FONT_B64}") format("woff2");font-weight:45 920;}`
    : '';
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
      const svg = fs.readFileSync(path.join(DIR, file), 'utf8');
      await page.setContent(html(svg, mode === 'pretendard'));
      await page.evaluate(() => document.fonts.ready);
      if (mode === 'pretendard') {
        const loaded = await page.evaluate(() => document.fonts.check('16px "Pretendard VF"'));
        if (!loaded) { console.log('  FAIL Pretendard VF를 불러오지 못함'); fail++; }
      }
      const d = await page.evaluate(() => {
        const svg = document.querySelector('svg');
        const vb = svg.viewBox.baseVal;
        const bb = (el) => { const b = el.getBBox(); return { x: b.x, y: b.y, w: b.width, h: b.height }; };
        const texts = [...svg.querySelectorAll('text')].map((t, i) => ({ i, s: t.textContent, in: t.getAttribute('data-in'), size: +t.getAttribute('font-size'), ...bb(t) }));
        const boxes = {};
        for (const r of svg.querySelectorAll('[data-box]')) boxes[r.getAttribute('data-box')] = bb(r);
        const lines = [...svg.querySelectorAll('path.flow, path.ref, path[data-bracket]')].map((p) => {
          const L = p.getTotalLength(); const pts = [];
          for (let k = 0; k <= 200; k++) { const q = p.getPointAtLength((L * k) / 200); pts.push({ x: q.x, y: q.y }); }
          return { id: p.getAttribute('data-flow') || p.getAttribute('data-ref') || p.getAttribute('data-bracket') || 'legend', flow: p.getAttribute('data-flow'), pts };
        });
        const attrs = (a) => [...svg.querySelectorAll(`[${a}]`)].map((e) => e.getAttribute(a));
        const tokens = [...svg.querySelectorAll('g[data-token]')].map((g) => `${g.getAttribute('data-token')}@${g.getAttribute('data-owner')}`);
        const steps = [...svg.querySelectorAll('g[data-step]')].map((g) => `${g.getAttribute('data-step')}@${g.getAttribute('data-owner')}`);
        return { vb: { w: vb.width, h: vb.height }, texts, boxes, lines, tokens, steps,
          cards: attrs('data-card'), rules: attrs('data-rule'), refs: attrs('data-ref'), flows: attrs('data-flow') };
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
        if (/^[0-9]$/.test(t.s)) continue; // 단계 번호 원 안의 숫자
        if (l.pts.some((p) => p.x > t.x - 1 && p.x < t.x + t.w + 1 && p.y > t.y - 1 && p.y < t.y + t.h + 1)) issues.push(`선이 글자 위를 지남: ${l.id} / "${t.s}"`);
      }
      const near = (p, b) => {
        const onX = p.x >= b.x - 4 && p.x <= b.x + b.w + 4, onY = p.y >= b.y - 4 && p.y <= b.y + b.h + 4;
        const dx = Math.min(Math.abs(p.x - b.x), Math.abs(p.x - b.x - b.w)), dy = Math.min(Math.abs(p.y - b.y), Math.abs(p.y - b.y - b.h));
        return (onY && dx <= 4) || (onX && dy <= 4) || (onX && onY && Math.min(dx, dy) <= 12);
      };
      for (const l of d.lines.filter((x) => x.flow)) {
        const [a, b] = l.flow.split('>');
        const A = d.boxes[`step-${a}`], B = d.boxes[`step-${b}`];
        if (!A || !B || !near(l.pts[0], A) || !near(l.pts[l.pts.length - 1], B)) issues.push(`화살표 끝이 상자에 닿지 않음: ${l.flow}`);
      }
      const sizes = d.texts.map((t) => t.size);
      const min = Math.min(...sizes);
      const disp = DISPLAY[kind].map((w) => `${w}px→${((min * w) / d.vb.w).toFixed(1)}px`).join(', ');
      const okW = Math.ceil((READABLE * d.vb.w) / min);
      console.log(`[${kind}] viewBox ${d.vb.w}×${d.vb.h}, 글자 ${d.texts.length}개, 최소 ${min}단위; ${disp}; 최소 ${READABLE}px이 되는 표시 폭 ${okW}px`);
      if (issues.length) { fail += issues.length; issues.forEach((m) => console.log('  FAIL ' + m)); }
      else console.log('  PASS 뷰박스·글자 겹침·상자 넘침·상자 겹침·선과 글자·화살표 끝 문제 0건');
      if (mode === 'pretendard') semantic[kind] = d;
    }
  }
  console.log('\n===== 노트북·휴대전화 의미 일치 =====');
  for (const key of ['tokens', 'steps', 'cards', 'rules', 'refs', 'flows']) {
    const a = [...semantic.desktop[key]].sort().join(' | '), b = [...semantic.mobile[key]].sort().join(' | ');
    if (a === b) console.log(`PASS ${key}: ${semantic.desktop[key].length}개 (${a})`);
    else { fail++; console.log(`FAIL ${key}\n  desktop: ${a}\n  mobile:  ${b}`); }
  }
  await browser.close();
  console.log(fail ? `\n결과: FAIL ${fail}건` : '\n결과: PASS');
  process.exit(fail ? 1 : 0);
})();
