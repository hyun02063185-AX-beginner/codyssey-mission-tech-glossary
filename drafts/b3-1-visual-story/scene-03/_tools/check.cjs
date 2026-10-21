// Scene 03 SVG 자동 검사.
// 글자 겹침·뷰박스 이탈·글자와 상자 테두리, 선(실제 연결·비교선·설정 연결·요청 화살표)이 다른 요소를 지나가는지,
// 선 끝이 요소의 실제 외곽에 닿는지(isPointInFill ±3), 비교선에 화살촉이 없는지, Route Table이 요청 경로에 끼지 않았는지,
// AWS 쪽에 B3-1 기록에 없는 자원이 없는지, 노트북·휴대전화의 비교 관계가 같은지, 표시 폭별 최소 글자를 본다.
// Revision 1: 03-A(overview)·03-B(access)와 1차 통합형(legacy, 비교 근거)을 각각 검사한다.
// 03-A는 비교선 6개가 정확히 그 6개인지, 직접 비교선에서 뺀 관계(경계 라우터↔IGW, DMZ↔Public Subnet)가 없는지도 본다.
// 이름표·알약 상자가 자기를 담은 요소 상자 밖으로 나가지 않는지도 본다(1차에서 눈으로만 찾은 문제).
// 실행: PLAYWRIGHT=<playwright 패키지 경로> CHROME=<크롬 실행 파일> node check.cjs
const path = require('path');
const { chromium } = require(process.env.PLAYWRIGHT || 'playwright');
const DIR = path.resolve(__dirname, '..');
const FIGURES = [
  { name: '03-A overview', files: { desktop: 'network-aws-overview-desktop.svg', mobile: 'network-aws-overview-mobile.svg' },
    expectCmp: ['g:company~a:vpc', 'g:nat~a:igw', 'g:route~a:rt', 'g:acl~a:sg', 'g:web~a:ec2', 'g:subnets~a:subnet'],
    forbidCmp: ['g:router~a:igw', 'g:dmz~a:subnet'] },
  { name: '03-B access', files: { desktop: 'network-aws-access-desktop.svg', mobile: 'network-aws-access-mobile.svg' } },
  { name: '1차 통합형(비교 근거)', files: { desktop: 'network-aws-comparison-desktop.svg', mobile: 'network-aws-comparison-mobile.svg' } },
];
const DISPLAY = { desktop: [1280, 1144, 1000, 900], mobile: [420, 358, 328] };
const READABLE = 12;
const AWS_ALLOWED = ['visitor', 'internet', 'region', 'vpc', 'igw', 'rt', 'sg', 'subnet', 'ec2', 'eni', 'nginx', 'missing'];

const inside = (p, r, pad = 0) => p.x > r.x + pad && p.x < r.x + r.width - pad && p.y > r.y + pad && p.y < r.y + r.height - pad;

(async () => {
  const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});
  const page = await browser.newPage();
  let fail = 0;
  for (const fig of FIGURES) {
  const R = {};
  console.log(`\n===== ${fig.name} =====`);
  for (const [kind, file] of Object.entries(fig.files)) {
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
        return { id: n.dataset.node, x: b.x, y: b.y, width: b.width, height: b.height, container: n.dataset.container === '1' };
      });
      const lines = [...svg.querySelectorAll('[data-link],[data-cmp],[data-assoc],[data-flow]')].map((el) => {
        const L = el.getTotalLength();
        const P = (t) => el.getPointAtLength(Math.max(0, Math.min(L, t)));
        const pts = []; for (let i = 0; i <= 80; i++) { const p = P((L * i) / 80); pts.push({ x: p.x, y: p.y }); }
        const kind = el.dataset.cmp ? 'cmp' : el.dataset.assoc ? 'assoc' : el.dataset.flow ? 'flow' : 'link';
        const key = el.dataset.cmp || el.dataset.assoc || el.dataset.link || `${el.dataset.from}>${el.dataset.to}`;
        const from = el.dataset.from, to = el.dataset.to;
        const legend = (el.dataset.cmp || '').startsWith('legend');
        let contact = null;
        if (!legend) {
          const unit = (p, q) => { const dx = q.x - p.x, dy = q.y - p.y, n = Math.hypot(dx, dy); return { x: dx / n, y: dy / n }; };
          const fillAt = (id, x, y) => { const n = svg.querySelector(`[data-node="${id}"]`); return n ? n.isPointInFill(new DOMPoint(x, y)) : null; };
          const s0 = P(0), s1 = P(3), e0 = P(L), e1 = P(L - 3);
          const ds = unit(s0, s1), de = unit(e1, e0);
          contact = {
            start: fillAt(from, s0.x - ds.x * 3, s0.y - ds.y * 3) && !fillAt(from, s0.x + ds.x * 3, s0.y + ds.y * 3),
            end: fillAt(to, e0.x + de.x * 3, e0.y + de.y * 3) && !fillAt(to, e0.x - de.x * 3, e0.y - de.y * 3),
            missingNode: fillAt(from, 0, 0) === null || fillAt(to, 0, 0) === null,
          };
        }
        return { kind, key, from, to, legend, via: (el.dataset.via || '').split(' ').filter(Boolean), pts, contact,
          markerEnd: el.getAttribute('marker-end') || '', markerStart: el.getAttribute('marker-start') || '' };
      });
      const missing = [...svg.querySelectorAll('[data-missing]')].map((e) => e.dataset.missing);
      const conds = [...svg.querySelectorAll('[data-cond]')].map((e) => e.dataset.cond);
      const marks = [...svg.querySelectorAll('[data-cond-mark]')].map((e) => e.dataset.condMark);
      const cautions = [...svg.querySelectorAll('[data-caution]')].map((e) => e.dataset.caution);
      // 이름표·알약 상자: 중심을 담은 가장 작은 요소 상자 안에 완전히 들어가야 한다(담은 요소가 없으면 검사 안 함)
      const nodeBoxes = [...svg.querySelectorAll('[data-node]')].map((n) => ({ id: n.dataset.node, b: n.getBBox() }));
      const tagOverflow = [];
      for (const r of svg.querySelectorAll('rect.tag, rect.chip')) {
        const b = r.getBBox(), cx = b.x + b.width / 2, cy = b.y + b.height / 2;
        const hosts = nodeBoxes.filter((n) => cx > n.b.x && cx < n.b.x + n.b.width && cy > n.b.y && cy < n.b.y + n.b.height)
          .sort((p, q) => p.b.width * p.b.height - q.b.width * q.b.height);
        if (!hosts.length) continue;
        const h = hosts[0].b;
        if (b.x < h.x - 0.5 || b.y < h.y - 0.5 || b.x + b.width > h.x + h.width + 0.5 || b.y + b.height > h.y + h.height + 0.5) tagOverflow.push(hosts[0].id);
      }
      return { vb: { w: vb.width, h: vb.height }, texts, nodes, lines, missing, conds, marks, cautions, tagOverflow };
    });
    const issues = [];
    for (const t of d.texts) if (t.x < 0 || t.y < 0 || t.x + t.width > d.vb.w || t.y + t.height > d.vb.h) issues.push(`viewBox 이탈: ${t.s}`);
    for (let i = 0; i < d.texts.length; i++) for (let j = i + 1; j < d.texts.length; j++) {
      const a = d.texts[i], b = d.texts[j];
      const ox = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
      const oy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
      if (ox > 1 && oy > 1) issues.push(`글자 겹침: "${a.s}" ↔ "${b.s}"`);
    }
    // 글자가 (컨테이너가 아닌) 요소 상자의 테두리에 걸치는지
    for (const t of d.texts) for (const n of d.nodes.filter((n) => !n.container)) {
      const ox = Math.min(t.x + t.width, n.x + n.width) - Math.max(t.x, n.x);
      const oy = Math.min(t.y + t.height, n.y + n.height) - Math.max(t.y, n.y);
      if (ox <= 1 || oy <= 1) continue;
      const contained = t.x >= n.x + 1 && t.x + t.width <= n.x + n.width - 1 && t.y >= n.y + 1 && t.y + t.height <= n.y + n.height - 1;
      if (!contained && !t.cls.includes('stepT')) issues.push(`글자가 상자 테두리에 걸침: "${t.s}" / ${n.id}`); // 설정 번호 원은 모서리에 두는 것이 의도
    }
    for (const l of d.lines.filter((l) => !l.legend)) {
      // 선이 양 끝·경유(data-via)·컨테이너가 아닌 요소를 지나가는지
      for (const n of d.nodes) {
        if (n.container || n.id === l.from || n.id === l.to || l.via.includes(n.id)) continue;
        if (l.pts.some((p) => inside(p, n, 1))) issues.push(`선이 요소를 지남: ${l.kind} ${l.key} → ${n.id}`);
      }
      // 선이 글자 위를 지나가는지(비교선 위의 비교 이름표는 의도한 배치라 제외)
      for (const t of d.texts) {
        if (l.kind === 'cmp' && t.cls.includes('chipT')) continue;
        if (l.pts.some((p) => inside(p, { x: t.x - 2, y: t.y - 2, width: t.width + 4, height: t.height + 4 }))) issues.push(`글자 위를 선이 지남: "${t.s}" / ${l.kind} ${l.key}`);
      }
      if (l.contact.missingNode) issues.push(`선 끝의 요소가 없음: ${l.kind} ${l.key}`);
      else {
        if (!l.contact.start) issues.push(`선 시작이 ${l.from} 외곽에 닿지 않음: ${l.kind} ${l.key}`);
        if (!l.contact.end) issues.push(`선 끝이 ${l.to} 외곽에 닿지 않음: ${l.kind} ${l.key}`);
      }
      if (l.kind === 'cmp' && (l.markerEnd.includes('arrA') || l.markerStart.includes('arrA'))) issues.push(`비교선에 화살촉: ${l.key}`);
      if (l.kind === 'flow' && [l.from, l.to].some((x) => /rt$|sg$/.test(x))) issues.push(`요청 화살표가 Route Table·Security Group을 지나는 단계로 그려짐: ${l.key}`);
    }
    for (const id of d.tagOverflow) issues.push(`이름표가 상자 밖으로 나감: ${id}`);
    const awsNodes = [...new Set(d.nodes.map((n) => n.id.replace(/^m\d+-/, '')).filter((id) => /^[ac]:/.test(id)))];
    const extra = awsNodes.filter((id) => !AWS_ALLOWED.includes(id.slice(2)));
    if (extra.length) issues.push(`B3-1 기록에 없는 AWS 요소: ${extra.join(', ')}`);
    const minSize = Math.min(...d.texts.map((t) => t.size));
    const hist = {}; for (const t of d.texts) hist[t.size] = (hist[t.size] || 0) + 1;
    const set = (k) => [...new Set(d.lines.filter((l) => l.kind === k && !l.legend).map((l) => l.key))].sort();
    R[kind] = {
      vb: `${d.vb.w}×${d.vb.h}`, texts: d.texts.length, minSize, hist, threshold: Math.ceil((READABLE * d.vb.w) / minSize),
      scale: DISPLAY[kind].map((px) => `${px}px→${(minSize * px / d.vb.w).toFixed(1)}px`),
      cmp: set('cmp'), assoc: set('assoc'), flow: set('flow'), missing: [...new Set(d.missing)].sort(), cond: [...new Set(d.conds)].sort(),
      aws: awsNodes.filter((id) => !id.endsWith(':region')).sort(), lines: d.lines.filter((l) => !l.legend).length, issues,
      mark: [...new Set(d.marks)].sort(), caution: [...new Set(d.cautions)].sort(),
    };
    fail += issues.length;
  }
  if (fig.expectCmp) for (const k of ['desktop', 'mobile']) {
    const ok = JSON.stringify(R[k].cmp) === JSON.stringify([...fig.expectCmp].sort());
    console.log(`${ok ? 'PASS' : 'FAIL'} 비교선이 정한 6개와 같음(${k}): ${R[k].cmp.join(', ')}`);
    const bad = R[k].cmp.filter((c) => fig.forbidCmp.includes(c));
    console.log(`${bad.length ? 'FAIL' : 'PASS'} 직접 비교선에서 뺀 관계 없음(${k})${bad.length ? ': ' + bad.join(', ') : ''}`);
    if (!ok || bad.length) fail++;
  }
  for (const k of ['cmp', 'assoc', 'flow', 'missing', 'cond', 'mark', 'caution', 'aws']) {
    const a = JSON.stringify(R.desktop[k]), b = JSON.stringify(R.mobile[k]);
    console.log(`${a === b ? 'PASS' : 'FAIL'} 노트북·휴대전화 일치(${k}): ${R.desktop[k].length}개`);
    if (a !== b) { fail++; console.log('  desktop', a, '\n  mobile ', b); }
  }
  for (const [k, r] of Object.entries(R)) {
    console.log(`\n[${k}] viewBox ${r.vb}, 글자 ${r.texts}개, 최소 ${r.minSize}단위; ${r.scale.join(', ')}`);
    console.log(`  글자 크기 분포 ${Object.entries(r.hist).sort((a, b) => a[0] - b[0]).map(([s, n]) => `${s}:${n}`).join(' ')}`);
    console.log(`  최소 글자가 ${READABLE}px 이상인 표시 폭: ${r.threshold}px 이상 · 검사한 선 ${r.lines}개`);
    console.log(r.issues.length ? r.issues.map((i) => '  FAIL ' + i).join('\n') : '  PASS 겹침·이탈·선 통과·외곽 접촉·이름표 넘침·비교선 화살촉·Route Table 경유·추가 AWS 자원 문제 0건');
  }
  }
  await browser.close();
  process.exit(fail ? 1 : 0);
})();
