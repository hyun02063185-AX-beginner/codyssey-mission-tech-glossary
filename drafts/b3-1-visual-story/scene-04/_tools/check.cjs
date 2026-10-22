// Scene 04 개념지도 SVG 검사 — concept-map.json과 그림이 같은 사실을 담는지, 화면에서 정확히 읽히는지 본다.
// 데이터 일치: 관계 15개가 모두 그려졌는지, 노드 14개가 각 그림에 한 번씩(참조 제외) 있는지, 선의 양 끝이 데이터의 끝점과 같은지,
//   포함(영역 겹침)의 안쪽 요소가 바깥 영역 안에 있는지, 흐름 C12가 데이터의 경로 순서대로 이어지는지, 학습 순서가 있는지.
// 화면: 글자 겹침·이탈, 글자가 상자 테두리에 걸침, 선이 다른 노드를 지남, 선이 글자를 지남, **선끼리 교차**,
//   선 끝이 노드 외곽에 실제로 닿음(isPointInFill ±3), 대응선에 화살촉 없음, 표시 폭별 최소 글자.
// 실행: PLAYWRIGHT=<playwright 패키지 경로> CHROME=<크롬 실행 파일> node check.cjs
const path = require('path');
const fs = require('fs');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const DIR = path.resolve(__dirname, '..');
const DATA = JSON.parse(fs.readFileSync(path.join(DIR, 'concept-map.json'), 'utf8'));
const FILES = { desktop: 'concept-map-desktop.svg', mobile: 'concept-map-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 900], mobile: [420, 358, 328] };
const READABLE = 12;
const LABEL_CLASSES = ['lblT', 'lblFT', 'lblCT', 'inclT'];
const inside = (p, r, pad = 0) => p.x > r.x + pad && p.x < r.x + r.width - pad && p.y > r.y + pad && p.y < r.y + r.height - pad;

function segIntersect(a, b, c, d) {
  const cross = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage();
  const R = {};
  let fail = 0;
  for (const [kind, file] of Object.entries(FILES)) {
    await page.goto('file://' + path.join(DIR, file));
    const d = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')].map((t) => {
        const b = t.getBBox();
        const parts = t.querySelectorAll('tspan').length ? [...t.querySelectorAll('tspan')] : [t];
        return { s: t.textContent, x: b.x, y: b.y, width: b.width, height: b.height, cls: t.getAttribute('class') || '',
          size: Math.min(...parts.map((e) => parseFloat(getComputedStyle(e).fontSize))) };
      });
      const nodes = [...svg.querySelectorAll('[data-node]')].map((n) => {
        const b = n.getBBox();
        return { id: n.dataset.node, refOf: n.dataset.refOf || null, x: b.x, y: b.y, width: b.width, height: b.height, container: n.dataset.container === '1' };
      });
      const fillAt = (id, x, y) => { const n = svg.querySelector(`[data-node="${id}"]`); return n ? n.isPointInFill(new DOMPoint(x, y)) : null; };
      const unit = (p, q) => { const dx = q.x - p.x, dy = q.y - p.y, n = Math.hypot(dx, dy); return { x: dx / n, y: dy / n }; };
      const lines = [...svg.querySelectorAll('path[data-rel]')].map((el) => {
        const pts = el.getAttribute('d').match(/-?[\d.]+/g).map(Number);
        const P = []; for (let i = 0; i < pts.length; i += 2) P.push({ x: pts[i], y: pts[i + 1] });
        const s0 = P[0], s1 = P[1], e0 = P[P.length - 1], e1 = P[P.length - 2];
        const ds = unit(s0, s1), de = unit(e1, e0), from = el.dataset.from, to = el.dataset.to;
        const L = el.getTotalLength(); const samples = [];
        for (let i = 0; i <= 80; i++) { const q = el.getPointAtLength((L * i) / 80); samples.push({ x: q.x, y: q.y }); }
        return { rel: el.dataset.rel, seg: el.dataset.seg ? +el.dataset.seg : null, cls: el.getAttribute('class'), from, to, P, samples,
          markerEnd: el.getAttribute('marker-end') || '', markerStart: el.getAttribute('marker-start') || '',
          startOk: fillAt(from, s0.x - ds.x * 3, s0.y - ds.y * 3) && !fillAt(from, s0.x + ds.x * 3, s0.y + ds.y * 3),
          endOk: fillAt(to, e0.x + de.x * 3, e0.y + de.y * 3) && !fillAt(to, e0.x - de.x * 3, e0.y - de.y * 3) };
      });
      const marks = [...svg.querySelectorAll('rect[data-rel]')].map((el) => {
        const b = el.getBBox();
        return { rel: el.dataset.rel, from: el.dataset.from, to: el.dataset.to, display: el.dataset.display, x: b.x, y: b.y, width: b.width, height: b.height };
      });
      const learning = [...svg.querySelectorAll('[data-learning]')].map((e) => e.dataset.learning);
      // 이름표(알약)·범례 견본 상자: 서로 겹치거나 다른 글자와 겹치면 안 된다
      const pills = [...svg.querySelectorAll('rect.lbl, rect.lblF, rect.lblC, rect.incl, rect[data-swatch]')].map((e) => { const b = e.getBBox(); return { x: b.x, y: b.y, width: b.width, height: b.height, own: e.nextElementSibling && e.nextElementSibling.tagName === 'text' ? e.nextElementSibling.textContent : null, swatch: !!e.dataset.swatch }; });
      const hasTitle = !!svg.querySelector('title') && !!svg.querySelector('desc') && (svg.querySelector('desc').textContent || '').length > 200;
      return { vb: { w: vb.width, h: vb.height }, texts, nodes, lines, marks, learning, hasTitle, pills };
    });
    const issues = [];
    const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
    const base = (id) => (byId[id] && byId[id].refOf) || id;
    // ── 데이터 일치
    const primary = d.nodes.filter((n) => !n.refOf).map((n) => n.id);
    for (const n of DATA.nodes) {
      const c = primary.filter((id) => id === n.id).length;
      if (c !== 1) issues.push(`노드 ${n.id}가 ${c}번 그려짐(참조 제외 1번이어야 함)`);
    }
    for (const id of primary) if (!DATA.nodes.find((n) => n.id === id)) issues.push(`데이터에 없는 노드: ${id}`);
    const drawn = new Set([...d.lines.map((l) => l.rel), ...d.marks.map((m) => m.rel)]);
    for (const r of DATA.relations) if (!drawn.has(r.id)) issues.push(`관계 ${r.id}가 그려지지 않음`);
    for (const id of drawn) if (!DATA.relations.find((r) => r.id === id)) issues.push(`데이터에 없는 관계: ${id}`);
    for (const r of DATA.relations) {
      const want = [r.from, r.to].sort().join('|');
      if (r.display === 'line') {
        const ls = d.lines.filter((l) => l.rel === r.id);
        if (ls.length !== 1) issues.push(`${r.id}: 선 ${ls.length}개(1개여야 함)`);
        for (const l of ls) if ([base(l.from), base(l.to)].sort().join('|') !== want) issues.push(`${r.id}: 선의 양 끝(${base(l.from)}, ${base(l.to)})이 데이터와 다름`);
        for (const l of ls) {
          if (r.type === '대응' && l.cls !== 'cmp') issues.push(`${r.id}: 대응선 모양이 아님`);
          if (r.type === '연관' && l.cls !== 'relA') issues.push(`${r.id}: 연관선 모양이 아님`);
        }
      } else if (r.display === 'nesting') {
        const m = d.marks.find((x) => x.rel === r.id);
        const outer = d.nodes.find((n) => n.id === r.from), inner = d.nodes.find((n) => n.id === r.to);
        if (!m || !outer || !inner) issues.push(`${r.id}: 포함 표식·영역이 없음`);
        else if (!(inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.width <= outer.x + outer.width && inner.y + inner.height <= outer.y + outer.height))
          issues.push(`${r.id}: ${r.to}가 ${r.from} 영역 안에 있지 않음`);
      } else if (r.display === 'dock') {
        const m = d.marks.find((x) => x.rel === r.id);
        const igw = d.nodes.find((n) => n.id === r.from), vpc = d.nodes.find((n) => n.id === r.to);
        const straddle = igw && vpc && igw.y < vpc.y && igw.y + igw.height > vpc.y && igw.x > vpc.x && igw.x + igw.width < vpc.x + vpc.width;
        const onNode = igw && m && m.x >= igw.x && m.x + m.width <= igw.x + igw.width && m.y >= igw.y && m.y + m.height <= igw.y + igw.height;
        if (!m) issues.push(`${r.id}: 연결 표식 없음`);
        else if (!straddle && !onNode) issues.push(`${r.id}: IGW가 VPC 경계에 걸치지도, 표식이 IGW 안에 있지도 않음`);
      } else if (r.display === 'path') {
        const segs = d.lines.filter((l) => l.rel === r.id).sort((a, b) => a.seg - b.seg);
        const nodesOnPath = r.path.filter((p) => !p.startsWith('@'));
        const got = [base(segs[0] && segs[0].from), ...segs.map((s) => base(s.to))];
        if (JSON.stringify(got) !== JSON.stringify(nodesOnPath)) issues.push(`${r.id}: 흐름 경로 ${got.join('→')} ≠ 데이터 ${nodesOnPath.join('→')}`);
        for (let i = 0; i + 1 < segs.length; i++) if (base(segs[i].to) !== base(segs[i + 1].from)) issues.push(`${r.id}: 구간 ${i + 1}·${i + 2}가 이어지지 않음`);
        for (const s of segs) if (s.cls !== 'flowA' || !s.markerEnd.includes('arrA')) issues.push(`${r.id}: 흐름 구간 ${s.seg} 모양이 흐름 화살표가 아님`);
      }
    }
    for (const l of DATA.learningOrder) if (!d.learning.includes(l.id)) issues.push(`학습 순서 ${l.id} 없음`);
    if (!d.hasTitle) issues.push('title·desc(접근성 설명) 없음 또는 너무 짧음');
    // ── 화면
    for (const t of d.texts) if (t.x < 0 || t.y < 0 || t.x + t.width > d.vb.w || t.y + t.height > d.vb.h) issues.push(`viewBox 이탈: ${t.s}`);
    for (let i = 0; i < d.texts.length; i++) for (let j = i + 1; j < d.texts.length; j++) {
      const a = d.texts[i], b = d.texts[j];
      const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x), oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
      if (ox > 1 && oy > 1) issues.push(`글자 겹침: "${a.s}" ↔ "${b.s}"`);
    }
    for (const t of d.texts) for (const n of d.nodes.filter((n) => !n.container)) {
      const ox = Math.min(t.x + t.width, n.x + n.width) - Math.max(t.x, n.x), oy = Math.min(t.y + t.height, n.y + n.height) - Math.max(t.y, n.y);
      if (ox <= 1 || oy <= 1) continue;
      const contained = t.x >= n.x + 1 && t.x + t.width <= n.x + n.width - 1 && t.y >= n.y + 1 && t.y + t.height <= n.y + n.height - 1;
      if (!contained) issues.push(`글자가 상자 테두리에 걸침: "${t.s}" / ${n.id}`);
    }
    for (const l of d.lines) {
      const tag = `${l.rel}${l.seg ? '-' + l.seg : ''}`;
      for (const n of d.nodes) {
        if (n.container || n.id === l.from || n.id === l.to) continue;
        if (l.samples.some((p) => inside(p, n, 1))) issues.push(`선이 노드를 지남: ${tag} → ${n.id}`);
      }
      for (const t of d.texts) {
        if (LABEL_CLASSES.some((c) => t.cls.includes(c))) continue;
        if (l.samples.some((p) => inside(p, { x: t.x - 2, y: t.y - 2, width: t.width + 4, height: t.height + 4 }))) issues.push(`글자 위를 선이 지남: "${t.s}" / ${tag}`);
      }
      if (!l.startOk) issues.push(`선 시작이 ${l.from} 외곽에 닿지 않음: ${tag}`);
      if (!l.endOk) issues.push(`선 끝이 ${l.to} 외곽에 닿지 않음: ${tag}`);
      if (l.cls === 'cmp' && (l.markerEnd.includes('arrA') || l.markerStart.includes('arrA'))) issues.push(`대응선에 화살촉: ${tag}`);
    }
    const ov = (a, b) => Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x) > 1 && Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y) > 1;
    for (let i = 0; i < d.pills.length; i++) for (let j = i + 1; j < d.pills.length; j++)
      if (ov(d.pills[i], d.pills[j])) issues.push(`이름표·견본끼리 겹침: "${d.pills[i].own || '견본'}" ↔ "${d.pills[j].own || '견본'}"`);
    for (const pl of d.pills) for (const t of d.texts) {
      if (t.s === pl.own) continue;
      if (pl.swatch && LABEL_CLASSES.some((c) => t.cls.includes(c))) continue;
      if (ov(pl, t)) issues.push(`이름표·견본이 글자와 겹침: "${pl.own || '견본'}" ↔ "${t.s}"`);
    }
    // 선끼리 교차(같은 흐름의 이어지는 구간은 제외)
    for (let i = 0; i < d.lines.length; i++) for (let j = i + 1; j < d.lines.length; j++) {
      const A = d.lines[i], B = d.lines[j];
      for (let a = 0; a + 1 < A.P.length; a++) for (let b = 0; b + 1 < B.P.length; b++)
        if (segIntersect(A.P[a], A.P[a + 1], B.P[b], B.P[b + 1])) issues.push(`선 교차: ${A.rel}${A.seg ? '-' + A.seg : ''} × ${B.rel}${B.seg ? '-' + B.seg : ''}`);
    }
    const minSize = Math.min(...d.texts.map((t) => t.size));
    R[kind] = { vb: `${d.vb.w}×${d.vb.h}`, texts: d.texts.length, minSize, threshold: Math.ceil((READABLE * d.vb.w) / minSize),
      scale: DISPLAY[kind].map((px) => `${px}px→${(minSize * px / d.vb.w).toFixed(1)}px`), rels: [...drawn].sort(),
      nodes: primary.sort(), learning: [...new Set(d.learning)].sort(), lines: d.lines.length, issues };
    fail += issues.length;
  }
  for (const k of ['rels', 'nodes', 'learning']) {
    const a = JSON.stringify(R.desktop[k]), b = JSON.stringify(R.mobile[k]);
    console.log(`${a === b ? 'PASS' : 'FAIL'} 노트북·휴대전화 일치(${k}): ${R.desktop[k].length}개`);
    if (a !== b) { fail++; console.log('  desktop', a, '\n  mobile ', b); }
  }
  for (const [k, r] of Object.entries(R)) {
    console.log(`\n[${k}] viewBox ${r.vb}, 글자 ${r.texts}개, 최소 ${r.minSize}단위; ${r.scale.join(', ')}`);
    console.log(`  최소 글자가 ${READABLE}px 이상인 표시 폭: ${r.threshold}px 이상 · 검사한 선 ${r.lines}개`);
    console.log(r.issues.length ? r.issues.map((i) => '  FAIL ' + i).join('\n') : '  PASS 데이터 일치·겹침·이탈·선 통과·선 교차·외곽 접촉·대응선 화살촉·접근성 설명 문제 0건');
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
