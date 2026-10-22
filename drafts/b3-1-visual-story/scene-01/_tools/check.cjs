// Scene 01 SVG 자동 검사: 글자 겹침·뷰박스 이탈, 선이 장비를 가로지르는지, 선 끝이 장비의 실제 외곽에 닿는지,
// 데스크톱·모바일 관계 일치, 표시 폭별 최소 글자.
// 실행: PLAYWRIGHT=<playwright 패키지 경로> CHROME=<크롬 실행 파일> node check.cjs
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const DIR = path.resolve(__dirname, '..');
const FILES = { desktop: 'enterprise-network-desktop.svg', mobile: 'enterprise-network-mobile.svg' };
const DISPLAY = { desktop: [1280, 1144, 1000, 900, 820], mobile: [420, 358, 328] }; // 표시 폭(px)
const READABLE = 12; // 이 크기(px) 이상이면 읽기 가능으로 본다

function inside(p, r, pad = 0) {
  return p.x > r.x + pad && p.x < r.x + r.width - pad && p.y > r.y + pad && p.y < r.y + r.height - pad;
}

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage();
  const result = {};
  let fail = 0;
  for (const [kind, file] of Object.entries(FILES)) {
    await page.goto('file://' + path.join(DIR, file));
    const data = await page.evaluate(() => {
      const svg = document.querySelector('svg');
      const vb = svg.viewBox.baseVal;
      const texts = [...svg.querySelectorAll('text')].map((t) => {
        const b = t.getBBox();
        // <tspan>으로 크기를 섞은 줄은 가장 작은 조각의 크기를 쓴다
        const parts = t.querySelectorAll('tspan').length ? [...t.querySelectorAll('tspan')] : [t];
        const size = Math.min(...parts.map((e) => parseFloat(getComputedStyle(e).fontSize)));
        return { s: t.textContent, x: b.x, y: b.y, width: b.width, height: b.height, size };
      });
      const nodes = [...svg.querySelectorAll('[data-node]')].map((n) => {
        const b = n.getBBox();
        return { id: n.dataset.node, x: b.x, y: b.y, width: b.width, height: b.height };
      });
      const sample = (el) => {
        const L = el.getTotalLength(), pts = [];
        for (let i = 0; i <= 60; i++) { const p = el.getPointAtLength((L * i) / 60); pts.push({ x: p.x, y: p.y }); }
        return pts;
      };
      const links = [...svg.querySelectorAll('[data-link]')].map((l) => ({ id: l.dataset.link, pts: sample(l) }));
      const flows = [...svg.querySelectorAll('[data-flow]')].map((f) => ({ id: f.dataset.flow, from: f.dataset.from, to: f.dataset.to, pts: sample(f) }));
      const zones = [...svg.querySelectorAll('[data-zone]')].map((z) => z.dataset.zone);
      // 실제 외곽 접촉: 선 끝에서 진행 방향으로 3단위 안쪽은 도형 안, 3단위 바깥쪽은 도형 밖이어야 한다.
      // (사각 경계 상자가 아니라 도형 자체의 채움 영역을 isPointInFill로 판정한다. 구름처럼 곡선인 도형도 같다.)
      const contact = [];
      for (const el of svg.querySelectorAll('[data-link],[data-flow]')) {
        const id = el.dataset.link || el.dataset.flow;
        const [a, b] = el.dataset.link ? el.dataset.link.split('-') : [el.dataset.from, el.dataset.to];
        const L = el.getTotalLength();
        const P = (t) => el.getPointAtLength(Math.max(0, Math.min(L, t)));
        const unit = (p, q) => { const dx = q.x - p.x, dy = q.y - p.y, n = Math.hypot(dx, dy); return { x: dx / n, y: dy / n }; };
        const inFill = (nodeId, x, y) => svg.querySelector(`[data-node="${nodeId}"]`).isPointInFill(new DOMPoint(x, y));
        const s0 = P(0), s1 = P(3), e0 = P(L), e1 = P(L - 3);
        const ds = unit(s0, s1), de = unit(e1, e0);
        const gap = (nodeId, p, d) => { for (let k = 0; k <= 30; k++) if (inFill(nodeId, p.x + d.x * k, p.y + d.y * k)) return k; return '>30'; };
        const startOk = inFill(a, s0.x - ds.x * 3, s0.y - ds.y * 3) && !inFill(a, s0.x + ds.x * 3, s0.y + ds.y * 3);
        const endOk = inFill(b, e0.x + de.x * 3, e0.y + de.y * 3) && !inFill(b, e0.x - de.x * 3, e0.y - de.y * 3);
        contact.push({ id, a, b, startOk, endOk,
          startGap: startOk ? 0 : gap(a, s0, { x: -ds.x, y: -ds.y }), endGap: endOk ? 0 : gap(b, e0, de) });
      }
      return { vb: { w: vb.width, h: vb.height }, texts, nodes, links, flows, zones, contact };
    });
    const issues = [];
    // 1) 뷰박스 이탈
    for (const t of data.texts) if (t.x < 0 || t.y < 0 || t.x + t.width > data.vb.w || t.y + t.height > data.vb.h) issues.push(`viewBox 이탈: ${t.s}`);
    // 2) 글자끼리 겹침(1px 여유)
    for (let i = 0; i < data.texts.length; i++) for (let j = i + 1; j < data.texts.length; j++) {
      const a = data.texts[i], b = data.texts[j];
      const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
      if (ox > 1 && oy > 1) issues.push(`글자 겹침: "${a.s}" ↔ "${b.s}"`);
    }
    // 3) 선이 자기 양 끝이 아닌 장비 상자를 지나가는지
    const nodeBox = (id) => data.nodes.filter((n) => n.id === id);
    for (const l of [...data.links, ...data.flows]) {
      const [a, b] = l.from ? [l.from, l.to] : l.id.split('-');
      for (const n of data.nodes) {
        if (n.id === a || n.id === b) continue;
        if (l.pts.some((p) => inside(p, n, 1))) issues.push(`선이 장비를 지남: ${l.id} → ${n.id}`);
      }
      // 끝점이 양 끝 장비의 경계 상자 근처(6px 이내)인지 — 거친 검사. 실제 접촉은 아래 6)에서 본다
      const near = (p, id) => nodeBox(id).some((n) => p.x >= n.x - 6 && p.x <= n.x + n.width + 6 && p.y >= n.y - 6 && p.y <= n.y + n.height + 6);
      const p0 = l.pts[0], p1 = l.pts[l.pts.length - 1];
      if (!(near(p0, a) && near(p1, b))) issues.push(`선 끝이 장비에 닿지 않음: ${l.id}`);
    }
    // 4) 글자가 선 위에 놓이는지(선 굵기 포함)
    for (const t of data.texts) for (const l of [...data.links, ...data.flows]) {
      if (t.s === l.id) continue; // 번호 표식은 자기 화살표 위에 놓는 것이 의도
      if (l.pts.some((p) => inside(p, { x: t.x - 2, y: t.y - 2, width: t.width + 4, height: t.height + 4 }))) issues.push(`글자 위를 선이 지남: "${t.s}" / ${l.id}`);
    }
    // 5) 장비 상자 밖의 글자가 상자를 침범하거나, 상자 안의 글자가 테두리에 걸치는지
    for (const t of data.texts) for (const n of data.nodes) {
      const ox = Math.min(t.x + t.width, n.x + n.width) - Math.max(t.x, n.x);
      const oy = Math.min(t.y + t.height, n.y + n.height) - Math.max(t.y, n.y);
      if (ox <= 1 || oy <= 1) continue;
      const contained = t.x >= n.x + 1 && t.x + t.width <= n.x + n.width - 1 && t.y >= n.y + 1 && t.y + t.height <= n.y + n.height - 1;
      if (!contained) issues.push(`글자가 장비 상자 테두리에 걸침: "${t.s}" / ${n.id}`);
    }
    // 6) 선 끝이 장비의 실제 외곽에 닿는지(±3단위)
    for (const c of data.contact) {
      if (!c.startOk) issues.push(`선 시작이 ${c.a} 외곽에 닿지 않음: ${c.id} (가장 가까운 안쪽까지 ${c.startGap}단위)`);
      if (!c.endOk) issues.push(`선 끝이 ${c.b} 외곽에 닿지 않음: ${c.id} (가장 가까운 안쪽까지 ${c.endGap}단위)`);
    }
    const minSize = Math.min(...data.texts.map((t) => t.size));
    const hist = {};
    for (const t of data.texts) hist[t.size] = (hist[t.size] || 0) + 1;
    const scale = DISPLAY[kind].map((px) => `${px}px→최소 ${(minSize * px / data.vb.w).toFixed(1)}px`);
    const threshold = Math.ceil((READABLE * data.vb.w) / minSize);
    result[kind] = {
      viewBox: `${data.vb.w}×${data.vb.h}`, texts: data.texts.length, minFont: minSize, scale, hist, threshold, contacts: data.contact.length,
      links: data.links.map((l) => l.id).sort(), flows: data.flows.map((f) => `${f.id}:${f.from}>${f.to}`).sort(),
      nodes: [...new Set(data.nodes.map((n) => n.id))].sort(), zones: [...new Set(data.zones)].sort(), issues,
    };
    fail += issues.length;
  }
  // 5) 두 그림의 관계 일치
  for (const key of ['links', 'flows', 'nodes', 'zones']) {
    const a = JSON.stringify(result.desktop[key]), b = JSON.stringify(result.mobile[key]);
    const ok = a === b;
    console.log(`${ok ? 'PASS' : 'FAIL'} 관계 일치(${key}): ${result.desktop[key].length}개`);
    if (!ok) { fail++; console.log('  desktop', a, '\n  mobile ', b); }
  }
  for (const [k, r] of Object.entries(result)) {
    console.log(`\n[${k}] viewBox ${r.viewBox}, 글자 ${r.texts}개, 최소 글자 ${r.minFont}단위; ${r.scale.join(', ')}`);
    console.log(`  글자 크기 분포(단위:개수) ${Object.entries(r.hist).sort((a, b) => a[0] - b[0]).map(([s, n]) => `${s}:${n}`).join(' ')}`);
    console.log(`  최소 글자가 ${READABLE}px 이상이 되는 표시 폭: ${r.threshold}px 이상`);
    console.log(`  실제 외곽 접촉 검사 대상 선 ${r.contacts}개(양 끝 각각)`);
    console.log(r.issues.length ? r.issues.map((i) => '  FAIL ' + i).join('\n') : '  PASS 겹침·이탈·선 통과·외곽 접촉 문제 0건');
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
