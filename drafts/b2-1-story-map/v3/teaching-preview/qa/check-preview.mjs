// Teaching preview QA (v3.7: Scene 01~08, Scene 05·06 재구성). Existing repository Playwright + installed Chrome.
// Usage (repo root): [LEDGER_REPO=<path to m03-pocket-money-ledger>] node drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile, mkdtemp } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = new URL('./', import.meta.url);
const page0 = new URL('../index.html', import.meta.url).href;
const repo = fileURLToPath(new URL('../../../../../', import.meta.url));
const md = (await Promise.all(['scene-01', 'scene-02', 'scene-03', 'scene-04', 'scene-05', 'scene-06', 'scene-07', 'scene-08'].map(s => readFile(new URL(`../../${s}/storyboard.md`, import.meta.url), 'utf8'))))
  .join('\n').replace(/\*\*|`/g, '');
// 원고 표를 한 문장으로 합친 상황 문장(Scene 02 F3)과 확인 단계 안내 문장은 별도 규칙으로 확인한다.
const COMBINED = { '2-8': 'Repository부터 살펴봅니다', '2-9': 'CLI부터 살펴봅니다' };
const UI_ONLY = ['1-11', '2-16'];
const N = [13, 17, 12, 14, 22, 18, 15, 17];
const TOTAL = N.reduce((a, b) => a + b, 0);
// v3.6 승인본: 회귀 비교 기준. v3.7에서 Scene 05·06은 교수 순서를 다시 짰으므로 비교에서 빼고(별도 의미 검사·주소 호환 검사), Scene 01~04·07·08을 비교한다
const BASE_COMMIT = '9e884d97db7f12c5bf3a9d4270afe6e3a1b18361';
const baseDir = await mkdtemp(join(tmpdir(), 'b21-v33-'));
const basePath = join(baseDir, 'index.html');
await writeFile(basePath, execFileSync('git', ['show', `${BASE_COMMIT}:drafts/b2-1-story-map/v3/teaching-preview/index.html`], { cwd: repo }));
// v3.7에서 Scene 08만 의도적으로 바뀐다: 영역 05 이름(8-6 위치 표시의 단계 제목 포함)·뜻·복습 주소(영역 그림 8-1~8-8, 정리 8-17), ‘종류’ 예 R23·R41(8-9), C30 복습 버튼(8-13), 확인 질문 1개(8-15), 적용 답의 영역 이름(8-16), 영역 05 문장(8-6), 강사 노트(모든 Scene 08 단계)
const S8_STAGE = ['8-1', '8-2', '8-3', '8-4', '8-5', '8-6', '8-7', '8-8', '8-9', '8-13', '8-15', '8-16', '8-17'];
const EXPECTED_REGRESSION = new Set([...S8_STAGE.flatMap(k => [`${k}:stage`, `${k}:png`]), '8-6:say', '8-6:pos', ...Array.from({ length: 17 }, (_, i) => `8-${i + 1}:note`)]);
const MUST_CHANGE = ['8-6:stage', '8-6:say', '8-9:stage', '8-15:stage'];
// 원본 개념지도: 강의 화면의 정적 사본을 대조하고, 원본 파일이 기준 커밋과 같은지 확인한다
const CMAP_PATH = 'drafts/b2-1-story-map/scene-08/candidate-map.json';
const cmapText = await readFile(join(repo, CMAP_PATH), 'utf8');
const cmap = JSON.parse(cmapText);
// 실제 ledger 대조(선택): LEDGER_REPO 환경 변수에 m03-pocket-money-ledger 경로를 주면 기준 커밋의 소스를 직접 확인한다
const LEDGER_COMMIT = 'd14e812ca1e1caaa88fd23fae7029d95d560c2d9';
const ledgerChecks = [];

const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const results = [], errors = [], external = [], scrollSteps = [], regression = [];
let assertions = 0;
const check = (ok, label) => { assertions++; if (!ok) throw Error(label); };

try {
  // ---- 실제 ledger 소스 대조 ----
  if (process.env.LEDGER_REPO) {
    const src = f => execFileSync('git', ['-C', process.env.LEDGER_REPO, 'show', `${LEDGER_COMMIT}:ledger/${f}`]).toString();
    const deco = src('decorators.py'), cli = src('cli.py'), repoPy = src('repository.py');
    const L = (ok, label) => { check(ok, `ledger: ${label}`); ledgerChecks.push(label); };
    L(/def handle_errors/.test(deco) && /except LedgerError as exc:/.test(deco) && !/except Exception/.test(deco) && !/except:/.test(deco), 'handle_errors catches LedgerError only');
    L(/return 1\n\s+return 0/.test(deco) && /\[오류\]/.test(deco) && /\[힌트\]/.test(deco), 'handle_errors prints [오류]/[힌트], returns 1 on handled error and 0 on success');
    L(/@handle_errors\ndef _dispatch/.test(cli) && (cli.match(/@handle_errors/g) || []).length === 1, 'handle_errors applied only to cli._dispatch');
    L(!/log|time\.perf_counter|time\.time|logging/.test(deco), 'no logging/timing decorator in decorators.py');
    L(/def _iter_jsonl[\s\S]*?yield json\.loads\(line\)/.test(repoPy) && /def iter_all[\s\S]*?for record in _iter_jsonl\(self\.path\):\s+yield Transaction\.from_dict\(record\)/.test(repoPy), '_iter_jsonl and iter_all yield one record at a time');
    const val = src('validators.py'), models = src('models.py');
    L(/def validate_amount\(value: int \| str\) -> int:/.test(val) && /value = int\(value\.strip\(\)\)/.test(val) && /isinstance\(value, bool\)/.test(val) && /if value <= 0:\s+raise InvalidAmountError/.test(val), 'validate_amount converts text, rejects bool and non-positive');
    L(/^\s+amount: int\b/m.test(models), 'models.py declares amount: int');
    L(/add_argument\("--amount", type=int/.test(cli), 'cli.py converts --amount with argparse type=int');
  } else ledgerChecks.push('skipped (set LEDGER_REPO)');

  // ---- 원본 개념지도 보존 ----
  check(cmapText === execFileSync('git', ['show', `${BASE_COMMIT}:${CMAP_PATH}`], { cwd: repo }).toString(), 'candidate-map.json unchanged since v3.5');
  check(cmap.areas.length === 7 && cmap.nodes.length === 45 && cmap.relations.length === 24 && cmap.comparisons.length === 10, 'candidate map keeps 7 areas / 45 nodes / 24 relations / 10 comparisons');

  // ---- Scene 01~04·07·08 회귀: v3.6 승인본과 단계별 DOM·화면 비교 ----
  for (const width of [1280, 390]) {
    const height = width === 1280 ? 720 : 800;
    const ctx = await browser.newContext({ viewport: { width, height } });
    const a = await ctx.newPage(), b = await ctx.newPage();
    const grab = async (p, url) => {
      await p.goto(url); await p.reload(); await p.waitForTimeout(80);
      return { dom: await p.evaluate(() => ({ stage: document.querySelector('#stage').innerHTML, say: document.querySelector('#say').innerHTML, note: document.querySelector('#noteBody').innerHTML, pos: document.querySelector('#pos').textContent, q: document.querySelector('#q').textContent, tag: document.querySelector('#tag').textContent, prev: document.querySelector('#prev').disabled, next: document.querySelector('#next').disabled })), png: await p.screenshot() };
    };
    for (const [sc, n] of [[1, 13], [2, 17], [3, 12], [4, 14], [7, 15], [8, 17]]) for (let i = 1; i <= n; i++) {
      const key = `${sc}-${i}`;
      const x = await grab(a, `file://${basePath}#${key}`), y = await grab(b, `${page0}#${key}`);
      for (const f of Object.keys(x.dom)) { assertions++; if (x.dom[f] !== y.dom[f]) regression.push(`${width} ${key}:${f}`); }
      assertions++; if (!x.png.equals(y.png)) regression.push(`${width} ${key}:png`);
    }
    await ctx.close();
  }
  const unexpected = regression.filter(r => !EXPECTED_REGRESSION.has(r.split(' ')[1]));
  check(unexpected.length === 0, `Scene 01~04·07·08 regression vs v3.6: ${unexpected}`);
  for (const w of [1280, 390]) for (const k of MUST_CHANGE) check(regression.includes(`${w} ${k}`), `intended Scene 08 change present: ${w} ${k}`);

  for (const width of [1280, 390, 360]) {
    const height = width === 1280 ? 720 : 800, mobile = width < 640;
    const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    page.on('pageerror', e => errors.push(`${width}: ${e.message}`));
    page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`${width}: ${m.text()}`); });
    page.on('requestfailed', r => errors.push(`${width}: ${r.url()} ${r.failure()?.errorText}`));
    page.on('request', r => { if (/^https?:/.test(r.url())) external.push(r.url()); });
    const open = async h => { await page.goto(`${page0}#${h}`); await page.reload(); };
    const pos = () => page.locator('#pos').innerText();
    const say = () => page.locator('#say').innerText();
    const stageText = () => page.locator('#stage').innerText();
    const tileBoxes = () => page.$$eval('#stage .tile', ts => ts.map(t => { const r = t.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(','); }));
    const shot = async name => { await page.waitForTimeout(120); await page.screenshot({ path: new URL(`${name}-${width}.png`, here).pathname }); };
    const SHOTS = { '1-1': 's01-f1-gui', '1-4': 's01-f2-python', '1-8': 's01-f3-who', '1-10': 's01-f4-boundary', '1-13': 's01-summary', '2-1': 's02-f1-needs', '2-5': 's02-f2-service', '2-8': 's02-f3-storage', '2-11': 's02-f4-module', '2-13': 's02-f5-import', '2-14': 's02-f6-main', '2-15': 's02-f7-ledger', '2-16': 's02-check',
      '3-2': 's03-f1-create', '3-4': 's03-f1-update', '3-5': 's03-f1-delete', '3-6': 's03-f2-change', '3-7': 's03-f3-search', '3-8': 's03-f3-summary', '3-11': 's03-f4-apply', '3-12': 's03-wrap',
      '4-1': 's04-f1-memory', '4-3': 's04-f1-exit', '4-5': 's04-f2-saved', '4-7': 's04-f3-jsonl-pair', '4-9': 's04-f4-csv-header', '4-11': 's04-f5-use', '4-14': 's04-wrap',
      '5-1': 's05-f1-repeat', '5-3': 's05-f2-iter', '5-5': 's05-f2-next2', '5-6': 's05-f2-end', '5-8': 's05-f3-genkind', '5-11': 's05-f4-pause', '5-13': 's05-f4-resume', '5-15': 's05-f5-jsonl', '5-17': 's05-f6-list', '5-19': 's05-f6-real', '5-22': 's05-wrap',
      '6-1': 's06-f1-reassign', '6-2': 's06-f2-pass', '6-4': 's06-f2-rebind', '6-6': 's06-f3-prepost', '6-7': 's06-f4-wrap', '6-10': 's06-f4-ok', '6-11': 's06-f4-error', '6-14': 's06-f5-uses', '6-15': 's06-f6-real', '6-18': 's06-wrap',
      '7-1': 's07-f1-hint', '7-3': 's07-f1-not-gate', '7-7': 's07-f2-compare', '7-11': 's07-f3-flow', '7-12': 's07-f4-real', '7-14': 's07-f5-apply', '7-15': 's07-wrap',
      '8-1': 's08-f1-areas', '8-6': 's08-f1-area-selected', '8-9': 's08-f2-types', '8-10': 's08-f2-r09', '8-12': 's08-f2-r28', '8-13': 's08-f4-c30', '8-16': 's08-f5-apply', '8-17': 's08-f6-wrap' };

    // ---- 처음부터 끝까지 '다음'으로 56단계 ----
    await open('1-1');
    check(await page.locator('#prev').isDisabled(), `${width}: prev disabled at first step`);
    const boxes = {};
    for (let sc = 1; sc <= 8; sc++) {
      for (let i = 1; i <= N[sc - 1]; i++) {
        const key = `${sc}-${i}`, t = `${width} ${key}`;
        check((await pos()).startsWith(`Scene 0${sc} · ${i} / ${N[sc - 1]}`), `${t}: position label`);
        const sid = await page.evaluate(([a, b]) => SCENES[a].ids ? SCENES[a].steps[b].id : null, [sc - 1, i - 1]);
        check(new URL(page.url()).hash === (sid ? `#${sc}-${sid}` : `#${key}`), `${t}: hash`);
        const sentence = (await say()).trim();
        if (COMBINED[key]) check(sentence.includes(COMBINED[key]), `${t}: combined first-look sentence`);
        else if (!UI_ONLY.includes(key)) check(md.includes(sentence), `${t}: sentence from storyboard: ${sentence}`);
        const text = await stageText();
        check(!/self|__init__\(|class |def |open\(|json\.dumps|with open/.test(text), `${t}: no code syntax on learning screen`);
        const m = await page.evaluate(() => {
          const st = document.querySelector('#stage').getBoundingClientRect(), fig = document.querySelector('#stage > *').getBoundingClientRect();
          return { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, inside: fig.top >= st.top - 1 && fig.bottom <= st.bottom + 1,
            clip: [...document.querySelectorAll('#stage code, #stage .fn, #stage .ko, #stage .lbl, #stage .am, #stage .mm, #stage th, #stage td')].filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1).map(e => e.textContent) };
        });
        check(m.w <= width, `${t}: horizontal overflow ${m.w}`);
        check(m.clip.length === 0, `${t}: clipped text ${m.clip}`);
        check(m.inside, `${t}: figure stays inside stage (no overlap with question or sentence)`);
        if (mobile) { if (m.h > height) scrollSteps.push(`${width} ${key} (${m.h}px)`); }
        else check(m.h <= height, `${t}: PC needs scrolling ${m.h}`);
        const arrows = await page.locator('#stage .arrow-h:visible, #stage .arrow-v:visible').count();
        const tag = await page.locator('#tag').innerText();
        if (sc === 1) {
          check(arrows === (['1-8', '1-13'].includes(key) ? 1 : ['1-9', '1-10'].includes(key) ? 2 : 0), `${t}: scene 01 arrow count ${arrows}`);
          check(tag.includes('가상 todo'), `${t}: virtual label`);
        } else if (sc === 2) {
          const inFlow = await page.locator('#stage .runflow .arrow-v:visible').count();
          check(arrows === inFlow && (key === '2-14' ? inFlow === 3 : arrows === 0), `${t}: arrows only in run flow`);
          if (key !== '2-16') {
            check(!/[→←↓↑]/.test(await page.locator('#stage .frame').innerText()), `${t}: no arrow glyphs in role structure`);
            check((await page.locator('#stage .tile').count()) === 4, `${t}: four role positions`);
          }
          check(key === '2-15' ? tag.includes('실제 사례') : tag.includes('가상 todo'), `${t}: virtual/real label`);
        } else if (sc === 3) {
          // 확인 질문(3-10)은 ‘이 순서로 실행해야 하나요?’를 묻는 문장이라 화살표 글자 검사에서 제외한다
          check(arrows === 0 && (['3-10', '3-11'].includes(key) || !/[→←↓↑]/.test(text)), `${t}: scene 03 has no arrows`);
          check(tag.includes('학습용 가상 기록'), `${t}: learning data label`);
        } else if (sc === 4) {
          check(arrows === (['4-4', '4-5'].includes(key) ? 2 : 0), `${t}: scene 04 arrows only in save flow (${arrows})`);
          check(key === '4-11' ? tag.includes('실제 사례') : tag.includes('학습용 가상 기록'), `${t}: learning/real label`);
        } else if (sc === 5) {
          // 실제 흐름(iter() 얻기, 요청·전달, 공급→소비, 실제 구조)에만 방향 화살표. 관계 그림(rel·genkind)은 화살표 없음
          const A5 = { iter: 1, gen: 2, give: 1, ask: 1, resume: 1, end: 1, drop: 2, list: 2, keep: 2, real: 3 };
          check(arrows === (A5[sid] ?? 0), `${t}: scene 05 arrow count ${arrows}`);
          if (['rel', 'genkind', 'jsonl'].includes(sid)) check(!/[→←↓↑]/.test(text), `${t}: no arrow glyphs in relation/comparison figure`);
          check(sid === 'real' ? tag.includes('실제 사례') : tag.includes('개념 예시'), `${t}: concept/real label`);
        } else if (sc === 7) {
          // 변환·검증 흐름(F3, 7-8~7-11)에만 머리줄 화살표 3개. 실제 사례(F4)는 역할 그림이라 화살표 글자도 없음
          check(arrows === (i >= 8 && i <= 11 ? 3 : 0), `${t}: scene 07 arrow count ${arrows}`);
          if (key === '7-12') check(!/[→←↓↑]/.test(text), `${t}: no arrows in role figure`);
          check(key === '7-12' ? tag.includes('실제 사례') : tag.includes('개념 예시'), `${t}: concept/real label`);
        } else if (sc === 8) {
          // 개념지도: 실행 흐름 화살표 없음, 관계선은 화살표 머리 없는 선
          check(arrows === 0 && !/[→←↓↑]/.test(text), `${t}: concept map has no flow arrows`);
          check(tag.includes('개념지도'), `${t}: map label`);
        } else {
          // 함수 전달·반환(F2)과 전·후 처리(F3)·실제 사례 흐름에만 실제 흐름 화살표. Decorator 구조도(deco~err)·활용 그림에는 없음
          const A6 = { pass: 2, ret: 2, rebind: 2, prepost: 2, real: 2 };
          check(arrows === (A6[sid] ?? 0) && !/[→←↓↑]/.test(text), `${t}: scene 06 arrow count ${arrows}`);
          check(!/wrapper|\*args|\*\*kwargs|functools|@/.test(text), `${t}: no wrapper/@ details on learning screen`);
          check(sid === 'real' ? tag.includes('실제 사례') : tag.includes('개념 그림'), `${t}: concept/real label`);
        }
        if (['2-2', '2-10', '2-15'].includes(key)) boxes[key] = await tileBoxes();
        if (SHOTS[key]) await shot(SHOTS[key]);
        if (!(sc === 8 && i === N[7])) await page.locator('#next').click();
      }
    }
    check(await page.locator('#next').isDisabled(), `${width}: next disabled at last step`);
    check(boxes['2-2'].join('|') === boxes['2-10'].join('|') && boxes['2-2'].join('|') === boxes['2-15'].join('|'), `${width}: role tiles keep identical positions in F2/F4/F7`);

    // ---- Scene 01·02 그림별 의미 (v3.3 핵심 검사 유지) ----
    const pressed = sel => page.locator(`${sel}[aria-pressed="true"]`).count();
    for (const [i, id] of [[4, 'python'], [5, 'target'], [6, 'task'], [7, 'cond']]) {
      await open(`1-${i}`);
      check(await page.locator(`[data-key="part-${id}"]`).getAttribute('aria-pressed') === 'true' && await pressed('#stage .part') === 1, `${width}: 1-${i} highlights ${id} only`);
    }
    await open('1-8');
    const g = async n => (await page.locator(`#stage .grp[data-grp="${n}"]`).innerText()).replace(/\s+/g, ' ');
    const py = await g('py'), app = await g('app');
    check(py.includes('Python이 읽는 부분') && py.includes('-m todo') && !py.includes('list'), `${width}: Python reads python -m todo`);
    check(app.includes('todo 프로그램이 받는 부분') && app.includes('--limit 5') && !app.includes('-m todo'), `${width}: todo receives list --limit 5`);
    await open('1-12');
    check(!(await stageText()).includes('--limit 3'), `${width}: apply answer hidden before reveal`);
    await page.locator('[data-reveal]').click();
    check((await stageText()).includes('--limit 3') && (await stageText()).includes('최대 3개까지만'), `${width}: apply reveal`);
    for (const [i, id] of [[8, 'repo'], [9, 'cli']]) {
      await open(`2-${i}`);
      check(await page.locator(`[data-key="tile-${id}"] .badge`).innerText() === '먼저 볼 곳' && await page.locator('#stage .tile .badge').count() === 1, `${width}: 2-${i} first-look on ${id}`);
    }
    await open('2-15');
    check((await stageText()).includes('ledger/') && !(await stageText()).includes('todo/'), `${width}: ledger case separated from todo`);

    // ---- Scene 03 의미 ----
    const book = () => page.locator('#stage .book');
    const bookRows = () => page.locator('#stage .book .rec').count();
    await open('3-1');
    check(await bookRows() === 4 && await pressed('#stage .op') === 0, `${width}: 3-1 four records, no op selected`);
    check((await stageText()).includes('순서가 아닙니다'), `${width}: CRUD not an order`);
    const opStep = async (i, id, rows, head, extra) => {
      await open(`3-${i}`);
      check(await page.locator(`[data-key="op-${id}"]`).getAttribute('aria-pressed') === 'true' && await pressed('#stage .op') === 1, `${width}: 3-${i} selects ${id} only`);
      check(await bookRows() === rows && (await book().locator('.book-h').innerText()).includes(head), `${width}: 3-${i} record change ${head}`);
      check(await extra(), `${width}: 3-${i} change marker`);
    };
    await opStep(2, 'create', 5, '5개로', async () => (await book().locator('.rec.new').innerText()).includes('지하철') && (await book().locator('.rec.new .rb').innerText()) === '새로 추가');
    await opStep(3, 'read', 4, '그대로', async () => await book().locator('.rb').count() === 0);
    await opStep(4, 'update', 4, '1곳 바뀜', async () => { const r = await book().locator('.rec.upd').innerText(); return r.includes('아이스크림') && await book().locator('.rec.upd s').innerText() === '2,000원' && r.includes('2,500원') && r.includes('수정됨'); });
    await opStep(5, 'delete', 4, '3개로', async () => { const r = await book().locator('.rec.del').innerText(); return r.includes('버스') && r.includes('삭제됨'); });
    await open('3-6');
    const gb = await page.$$eval('#stage .op', ops => ops.map(o => [o.dataset.go, o.querySelector('.gb')?.textContent]));
    check(gb.every(([id, b]) => b === (id === 'read' ? '원본 그대로' : '원본이 바뀜')), `${width}: 3-6 change groups ${gb}`);
    check(await bookRows() === 4 && await book().locator('.rb').count() === 0, `${width}: 3-6 original four records`);
    await open('3-7');
    check(await page.locator('#stage .rsp-s.on').count() === 1 && await page.locator('#stage .rsp-s .rec').count() === 2, `${width}: search shows two records`);
    const hits = await book().locator('.rec.hit .mm').allInnerTexts();
    check(hits.join(',') === '떡볶이,아이스크림', `${width}: search marks #1 #3 (${hits})`);
    await open('3-8');
    const amounts = (await book().locator('.rec .am').allInnerTexts()).map(x => +x.replace(/[^0-9]/g, ''));
    const total = +(await page.locator('#stage .rsp-m .total').innerText()).replace(/[^0-9]/g, '');
    const cats = (await page.locator('#stage .rsp-m .cat b').allInnerTexts()).map(x => +x.replace(/[^0-9]/g, ''));
    check(total === 14500 && amounts.reduce((a, b) => a + b, 0) === total && cats.reduce((a, b) => a + b, 0) === total, `${width}: summary totals consistent (${total})`);
    check(await page.locator('#stage .rsp-m.on').count() === 1 && await book().locator('.rec.hit').count() === 0, `${width}: summary highlight`);
    await open('3-9');
    check((await book().locator('.book-h').innerText()).includes('원본 4개 그대로') && await bookRows() === 4, `${width}: search/summary keep original`);
    for (const [k, n] of [['3-10', 3], ['3-11', 6]]) {
      await open(k);
      check(await page.locator('#stage .qa .a:visible').count() === 0, `${width}: ${k} answers hidden`);
      await page.locator('[data-reveal]').click();
      check(await page.locator('#stage .qa .a:visible').count() === n, `${width}: ${k} answers shown (${n})`);
    }
    await open('3-12');
    check((await stageText()).includes('원본이 바뀜') && await page.locator('[data-goscene="3"]').count() === 1, `${width}: Scene 03 wrap links Scene 04`);
    await page.locator('[data-goscene="3"]').click();
    check((await pos()).startsWith('Scene 04 · 1 / 14') && await page.evaluate(() => document.activeElement?.id) === 'q', `${width}: Scene 03 wrap → Scene 04`);
    await open('3-1'); await page.locator('[data-key="op-delete"]').click();
    check((await pos()).includes('5 / 12'), `${width}: direct op selection`);
    await page.locator('[data-key="op-delete"]').click();
    check((await pos()).includes('1 / 12'), `${width}: reselect returns to whole structure`);
    await open('3-7'); await page.locator('[data-key="res-summary"]').click();
    check((await pos()).includes('8 / 12'), `${width}: click summary panel`);
    await page.locator('#homeBtn').click();
    check((await pos()).includes('9 / 12'), `${width}: 전체 구조 in F3`);

    // ---- Scene 04 의미 ----
    const pane = id => page.locator(`#stage [data-key="pane-${id}"]`);
    const recIds = async loc => (await loc.locator('.rec:not(.gone) .no').allInnerTexts()).join(',');
    await open('4-1');
    check(await recIds(pane('mem')) === '#1,#2,#3,#4,#5' && await recIds(pane('file')) === '#1,#2,#3,#4', `${width}: 4-1 memory 5, file 4`);
    check((await pane('mem').innerText()).includes('아직 파일에 없음') && (await pane('mem').getAttribute('class')).includes(' on'), `${width}: 4-1 memory highlighted, #5 unsaved`);
    await open('4-2');
    check((await pane('file').getAttribute('class')).includes(' on') && !(await pane('mem').getAttribute('class')).includes(' on'), `${width}: 4-2 file highlighted`);
    await open('4-3');
    check((await pane('mem').innerText()).includes('메모리 비워짐') && (await pane('mem').innerText()).includes('남지 않음') && await recIds(pane('file')) === '#1,#2,#3,#4', `${width}: 4-3 exit without save loses #5`);
    check(!(await page.locator('#stage .flowbar').isVisible()), `${width}: no flow before F2`);
    await open('4-4');
    check(await page.locator('#stage .flowbar').isVisible() && await recIds(pane('file')) === '#1,#2,#3,#4,#5' && (await pane('file').innerText()).includes('저장됨'), `${width}: 4-4 save flow adds #5 to file`);
    check(await recIds(pane('mem')) === '#1,#2,#3,#4,#5' && await page.locator('#stage .fb .role').count() === 0, `${width}: 4-4 memory kept, no role tags yet`);
    await open('4-5');
    const flowText = await page.locator('#stage .flowbar').innerText();
    check(flowText.includes('Repository') && flowText.includes('Service'), `${width}: 4-5 role tags`);
    check((await pane('mem').innerText()).includes('메모리 비워짐') && await recIds(pane('file')) === '#1,#2,#3,#4,#5' && (await pane('file').innerText()).includes('끝내도 남음'), `${width}: 4-5 saved records survive exit`);
    await open('4-6');
    const jl = await page.locator('#stage .ln code').allInnerTexts();
    const objs = jl.map(l => JSON.parse(l));
    check(jl.length === 5 && objs.map(o => o.id).join(',') === '1,2,3,4,5', `${width}: JSONL five valid lines`);
    await open('4-7');
    check(await page.locator('#stage .ln.on').count() === 1 && await page.locator('#stage .ln.on .kname').count() === 5 && (await stageText()).includes('항목 이름'), `${width}: 4-7 name/value pairs on line 1`);
    await open('4-8');
    const raw = await page.locator('#stage .fwin .ln code').allInnerTexts();
    check(raw[0] === 'id,date,category,amount,memo' && raw.length === 6, `${width}: CSV header + 5 rows`);
    const rows = raw.slice(1).map(l => l.split(','));
    check(rows.every((r, k) => r.length === 5 && +r[0] === objs[k].id && r[1] === objs[k].date && r[2] === objs[k].category && +r[3] === objs[k].amount && r[4] === objs[k].memo), `${width}: CSV rows equal JSONL records`);
    const cells = await page.$$eval('#stage table.tb tbody tr', trs => trs.map(tr => [...tr.cells].map(c => c.textContent).join(',')));
    check(cells.join('|') === raw.slice(1).join('|'), `${width}: table equals raw CSV`);
    const s4four = objs.slice(0, 4).map(o => `${o.id}:${o.category}:${o.amount}:${o.memo}`).join('|');
    await open('3-1');
    const s3rows = await page.$$eval('#stage .book .rec', rs => rs.map(r => `${r.querySelector('.no').textContent.slice(1)}:${r.querySelector('.ct').textContent}:${r.querySelector('.am').textContent.replace(/[^0-9]/g, '')}:${r.querySelector('.mm').textContent}`).join('|'));
    check(s3rows === s4four, `${width}: Scene 03 records equal Scene 04 file records`);
    await open('4-9');
    check((await page.locator('#stage .fwin .ln.on code').innerText()) === 'id,date,category,amount,memo' && (await page.locator('#stage table.tb').getAttribute('class')).includes('hd'), `${width}: 4-9 header row highlighted in raw and table`);
    await open('4-10');
    check((await stageText()).includes('다음 단계') && !(await stageText()).includes('transactions.jsonl'), `${width}: 4-10 real usage not yet shown`);
    await open('4-11');
    const use = await stageText();
    check(use.includes('transactions.jsonl') && use.includes('import') && use.includes('export') && use.includes('가져오기·내보내기'), `${width}: 4-11 JSONL storage vs CSV import/export`);
    for (const k of ['4-12', '4-13']) {
      await open(k);
      await page.locator('[data-reveal]').click();
      check(await page.locator('#stage .qa .a:visible').count() === 3, `${width}: ${k} answers`);
    }
    await open('4-14');
    check((await stageText()).includes('한꺼번에 모두 읽어야 할까요') && await page.locator('[data-goscene="4"]').count() === 1, `${width}: Scene 04 wrap links Scene 05`);
    await page.locator('[data-goscene="4"]').click();
    check((await pos()).startsWith('Scene 05 · 1 / 22'), `${width}: Scene 04 wrap → Scene 05`);
    await open('4-1'); await page.locator('[data-key="pane-file"]').click();
    check((await pos()).includes('2 / 14'), `${width}: click file pane`);
    await open('4-6'); await page.locator('[data-key="ln-3"]').click();
    check((await pos()).includes('7 / 14'), `${width}: click a JSONL line`);

    // ---- Scene 05 의미 (v3.7: Iterable·Iterator·Generator) ----
    const listItems = () => page.$$eval('#stage .i5-list .i5-it', its => its.map(i => (i.classList.contains('cur') ? 'cur' : i.classList.contains('done') ? 'done' : 'new') + ':' + i.querySelector('b').textContent));
    await open('5-repeat');
    check((await listItems()).join() === 'new:사과,new:바나나,new:포도' && (await stageText()).includes('차례로 꺼내 씀'), `${width}: 5-repeat three values`);
    await open('5-iterable');
    check((await page.locator('#stage .i5-list').getAttribute('class')).includes(' on') && (await page.locator('#stage .i5-box').getAttribute('class')).includes('ghost') && !(await page.locator('#stage .i5-ch').isVisible()), `${width}: 5-iterable list is the iterable, no iterator yet`);
    await open('5-iter');
    check(await page.locator('#stage .i5-ch.on').isVisible() && (await page.locator('#stage .i5-ch').innerText()).includes('iter()') && (await page.locator('#stage .i5-out').innerText()).includes('아직 꺼낸 값 없음'), `${width}: 5-iter iterator obtained`);
    await open('5-next1');
    check((await page.locator('#stage .i5-out b').innerText()) === '사과' && (await listItems()).join() === 'cur:사과,new:바나나,new:포도', `${width}: 5-next1 gives first value, remembers position`);
    await open('5-next2');
    check((await page.locator('#stage .i5-out b').innerText()) === '바나나' && (await listItems()).join() === 'done:사과,cur:바나나,new:포도', `${width}: 5-next2 continues from remembered position`);
    await open('5-iterend');
    check((await page.locator('#stage .i5-out').innerText()).includes('꺼낼 값 없음') && (await listItems()).join() === 'done:사과,done:바나나,done:포도' && (await stageText()).includes('리스트는 그대로'), `${width}: 5-iterend iterator ends, list unchanged`);
    await open('5-rel');
    check((await page.locator('#stage .i5-iter').getAttribute('class')).includes(' on') && !(await page.locator('#stage .i5-gen').isVisible()) && (await page.locator('#stage .i5-outside').innerText()).includes('Iterator는 아님') && (await page.locator('#stage .i5-iter').innerText()).includes('Iterable이기도 함'), `${width}: 5-rel every iterator is iterable, list is not an iterator`);
    await open('5-genkind');
    check(await page.locator('#stage .i5-gen.on').isVisible() && (await page.locator('#stage .i5-gen').innerText()).includes('Iterator의 한 종류') && !(await stageText()).includes('하위 기능'), `${width}: 5-genkind generator object is a kind of iterator`);
    check((await page.locator('#stage .i5-src').innerText()).includes('R41') && (await page.locator('#stage .i5-src').innerText()).includes('R23'), `${width}: 5-genkind cites original relations`);
    const g5 = async () => page.$$eval('#stage .g5-ln', ls => ls.map(l => l.className.replace('g5-ln ', '') + ':' + l.querySelector('.l').textContent).join('|'));
    const msgs = async () => (await page.locator('#stage .g5-msg.on span:not(.arrow-h):not(.arrow-v)').allInnerTexts()).join('|');
    const stateTx = async () => page.locator('#stage .g5-state').innerText();
    const consumer = async () => page.locator('#stage .g5-box').nth(1).innerText();
    await open('5-gen');
    check(await g5() === Array(5).fill('unread:아직 읽지 않음').join('|') && (await consumer()).includes('아직 받은 기록 없음') && await msgs() === '기록 건넴|다음 기록 줘', `${width}: 5-gen nothing produced in advance`);
    await open('5-give');
    check((await stateTx()).includes('값을 건넴 (yield)') && (await g5()).startsWith('done:건넴 ✓|unread') && await msgs() === '기록 #1 건넴', `${width}: 5-give yield delivers #1`);
    await open('5-pause');
    check(await page.locator('#stage .g5-state.pause .g5-pz').count() === 1 && (await g5()).startsWith('mark:여기서 멈춤|unread') && await msgs() === '', `${width}: 5-pause bookmark, no traffic`);
    await open('5-ask');
    check(await msgs() === '다음 기록 줘' && (await g5()).startsWith('mark:여기서 멈춤|unread'), `${width}: 5-ask next request`);
    await open('5-resume');
    check(await g5() === 'done:건넴 ✓|mark:여기서 이어감|unread:아직 읽지 않음|unread:아직 읽지 않음|unread:아직 읽지 않음' && await msgs() === '기록 #2 건넴', `${width}: 5-resume continues from line 2`);
    await open('5-end');
    check(await g5() === Array(5).fill('done:건넴 ✓').join('|') && (await stateTx()).includes('끝남'), `${width}: 5-end exhausted`);
    await open('5-jsonl');
    const jl5 = await stageText();
    check(jl5.includes('저장 형식') && jl5.includes('처리 방식') && jl5.includes('형식이 메모리를 아껴 주는 것은 아닙니다'), `${width}: 5-jsonl format vs method`);
    await open('5-drop');
    check((await page.locator('#stage .g5-lane.on').innerText()).includes('합계 하나'), `${width}: 5-drop`);
    await open('5-list');
    check(await page.locator('#stage .g5-lane.on .g5-dots i').count() === 60, `${width}: 5-list`);
    await open('5-keep');
    check(await page.locator('#stage .g5-disk').count() === 2 && (await page.locator('#stage .g5-cap.on').innerText()).includes('어떻게 보관하느냐'), `${width}: 5-keep storage decides`);
    await open('5-real');
    const r5 = await page.locator('#stage .g5-real').textContent();
    check(['data/transactions.jsonl', '_iter_jsonl()', 'iter_all()', '목록', '검색', '요약'].every(x => r5.includes(x)), `${width}: 5-real structure`);
    for (const [k, n] of [['5-check', 3], ['5-apply', 3]]) { await open(k); check(await page.locator('#stage .qa .a:visible').count() === 0, `${width}: ${k} hidden`); await page.locator('[data-reveal]').click(); check(await page.locator('#stage .qa .a:visible').count() === n, `${width}: ${k} answers`); }
    await open('5-wrap');
    await page.locator('[data-goscene="5"]').click();
    check((await pos()).startsWith('Scene 06 · 1 / 18') && new URL(page.url()).hash === '#6-reassign', `${width}: Scene 05 wrap → Scene 06`);
    await open('5-next1'); await page.locator('#homeBtn').click();
    check(new URL(page.url()).hash === '#5-iterable', `${width}: 전체 구조 in F2`);
    // v3.6 숫자 주소 호환
    const L5 = ['list', 'drop', 'jsonl', 'gen', 'give', 'pause', 'ask', 'resume', 'end', 'drop', 'list', 'keep', 'real', 'check', 'apply', 'wrap'];
    for (let n = 1; n <= 16; n++) { await open(`5-${n}`); check(new URL(page.url()).hash === `#5-${L5[n - 1]}`, `${width}: legacy #5-${n} → #5-${L5[n - 1]}`); }

    // ---- Scene 06 의미 (v3.7: 재대입 → 함수 전달·반환 → 감싸기 → Decorator) ----
    await open('6-reassign');
    const ra = await stageText();
    check(ra.includes('a = 1') && ra.includes('a = a + 1') && ra.includes('a라는 이름이 새 값 2를 가리킵니다'), `${width}: 6-reassign rebinding, not mutation`);
    const fnState = async () => ({ ars: await page.$$eval('#stage .f6-ar', as => as.map(a => a.classList.contains('on'))), tagAt: await page.$$eval('#stage .f6-card', cs => cs.findIndex(c => c.querySelector('.f6-name'))), code: await page.locator('#stage .f6-codeline.on').count() });
    await open('6-pass');
    let f = await fnState();
    check(f.ars.join() === 'true,false' && f.tagAt === 0 && f.code === 0, `${width}: 6-pass function passed ${JSON.stringify(f)}`);
    await open('6-ret');
    f = await fnState();
    check(f.ars.join() === 'false,true' && f.tagAt === 0, `${width}: 6-ret function returned`);
    await open('6-rebind');
    f = await fnState();
    check(f.tagAt === 2 && f.code === 1 && (await page.locator('#stage .f6-codeline').innerText()) === 'work = decorate(work)' && (await stageText()).includes('원래 함수는 그대로') && await page.locator('#stage .f6-same.on').isVisible(), `${width}: 6-rebind name moves, original kept`);
    await open('6-wrapfn');
    check(await page.locator('#stage .f6-step').count() === 1 && (await page.locator('#stage .f6-step.core').innerText()).includes('원래 함수 실행'), `${width}: 6-wrapfn original runs inside new function`);
    await open('6-prepost');
    const pp = await page.locator('#stage .f6-step').allInnerTexts();
    check(pp.length === 3 && pp[0].includes('실행 전') && pp[1].includes('원래 함수 실행') && pp[2].includes('실행 후') && (await stageText()).includes('정상적으로 끝난 경우'), `${width}: 6-prepost before/after`);
    const wrapState = async () => ({ inner: await page.locator('#stage .d6-in').innerText(), inOn: (await page.locator('#stage .d6-in').getAttribute('class')).includes(' on'), outOn: (await page.locator('#stage .d6-wrap').getAttribute('class')).includes(' on'), slot: await page.locator('#stage .d6-slot.on').count() ? await page.locator('#stage .d6-slot').innerText() : '' });
    for (const [id, exp] of [['deco', { inOn: false, outOn: false, slot: '' }], ['inner', { inOn: true, outOn: false, slot: '' }], ['outer', { inOn: false, outOn: true, slot: '정해 둔 공통 처리만' }], ['ok', { inOn: true, outOn: true, slot: '✓ 정상 결과를 돌려줌', inner: '✓ 끝까지 정상 완료' }], ['err', { inOn: true, outOn: true, slot: '오류를 받아', inner: '✕ 정해 둔 종류의 오류' }]]) {
      await open(`6-${id}`);
      const w = await wrapState();
      check(w.inner.includes('원래 기능') && w.inner.includes('원래 일') && w.inOn === exp.inOn && w.outOn === exp.outOn && w.slot.includes(exp.slot) && (!exp.inner || w.inner.includes(exp.inner)), `${width}: 6-${id} wrap state ${JSON.stringify(w)}`);
    }
    await open('6-rep');
    check(await page.locator('#stage .d6-band').count() === 4 && (await stageText()).includes('개념 그림'), `${width}: 6-rep repeated handling`);
    await open('6-gather');
    check(await page.locator('#stage .d6-half.on .d6-shared').count() === 1, `${width}: 6-gather gathered once`);
    await open('6-uses');
    const minis = await page.$$eval('#stage .d6-mini', ms => ms.map(m => m.querySelector('.d6-mw > span').textContent + ':' + m.querySelector('.badge').textContent));
    check(minis.join('|') === '오류 처리:용돈 기입장에 있음 · handle_errors|로그 기록:일반 개념 예시 · 용돈 기입장에는 없음|실행 시간 측정:일반 개념 예시 · 용돈 기입장에는 없음', `${width}: 6-uses real vs general`);
    await open('6-real');
    const outs = await page.$$eval('#stage .d6-out', os => os.map(o => (o.classList.contains('hide') ? 'hide' : o.classList.contains('on') ? 'on' : 'off') + ':' + o.textContent).join('|'));
    check(/^on:.*종료 코드 0\|on:LedgerError.*종료 코드 1\|on:.*잡지 않음/.test(outs) && (await stageText()).includes('handle_errors') && (await stageText()).includes('_dispatch'), `${width}: 6-real one-step summary ${outs}`);
    for (const [k, n] of [['6-check', 4], ['6-apply', 3]]) { await open(k); check(await page.locator('#stage .qa .a:visible').count() === 0, `${width}: ${k} hidden`); await page.locator('[data-reveal]').click(); check(await page.locator('#stage .qa .a:visible').count() === n, `${width}: ${k} answers`); }
    await open('6-wrap');
    check((await stageText()).includes('음수 같은 잘못된 값도 막아 줄까요') && await page.locator('[data-goscene="6"]').count() === 1, `${width}: Scene 06 wrap links Scene 07`);
    await page.locator('[data-goscene="6"]').click();
    check((await pos()).startsWith('Scene 07 · 1 / 15'), `${width}: Scene 06 wrap → Scene 07`);
    await open('6-deco'); await page.locator('[data-key="d6-inner"]').click();
    check(new URL(page.url()).hash === '#6-inner', `${width}: click inner function`);
    await page.locator('[data-key="d6-outer"]').click();
    check(new URL(page.url()).hash === '#6-outer', `${width}: click outer band`);
    const L6 = ['rep', 'gather', 'deco', 'inner', 'outer', 'ok', 'err', 'real', 'real', 'uses', 'check', 'apply', 'wrap'];
    for (let n = 1; n <= 13; n++) { await open(`6-${n}`); check(new URL(page.url()).hash === `#6-${L6[n - 1]}`, `${width}: legacy #6-${n} → #6-${L6[n - 1]}`); }

    // ---- Scene 07 의미 ----
    await open('7-1');
    check((await page.locator('#stage .t7-board').innerText()).replace(/\s+/g, ' ') === 'amount: int' && !(await page.locator('#stage .t7-row').isVisible()), `${width}: 7-1 hint signboard only`);
    await open('7-2');
    check((await page.locator('#stage .t7-row.on').innerText()).includes('사람') && (await page.locator('#stage .t7-row.on').innerText()).includes('검사 도구'), `${width}: 7-2 readers`);
    await open('7-3');
    check(await page.locator('#stage .t7-val').count() === 3 && (await page.locator('#stage .t7-gate').innerText()).includes('막지 않음'), `${width}: 7-3 hint does not block values`);
    for (const [i, rows] of [[4, 0], [5, 1], [6, 2], [7, 3]]) {
      await open(`7-${i}`);
      const vis = await page.$$eval('#stage .t7-tbl > div:not(.h)', ds => { const out = []; for (let k = 0; k < ds.length; k += 3) out.push(!ds[k + 1].classList.contains('hid')); return out; });
      check(vis.filter(Boolean).length === rows && vis.slice(0, rows).every(Boolean), `${width}: 7-${i} comparison rows ${vis}`);
    }
    const t7 = await page.locator('#stage .t7-tbl').innerText();
    check(/-5[\s\S]*int와 맞음[\s\S]*0보다 크지 않음/.test(t7), `${width}: -5 fits int but fails amount rule`);
    for (const [i, rows] of [[8, 0], [9, 1], [10, 2], [11, 3]]) {
      await open(`7-${i}`);
      check(await page.locator('#stage .t7-flow .c.hid').count() === (3 - rows) * 3, `${width}: 7-${i} flow rows ${rows}`);
    }
    const fl = await page.locator('#stage .t7-flow').innerText();
    check(/"abc"[\s\S]*정수로 바꿀 수 없음[\s\S]*변환 단계에서 멈춤/.test(fl) && /"-5"[\s\S]*-5[\s\S]*0보다 크지 않음[\s\S]*규칙 단계에서 거부/.test(fl) && fl.includes('같은 순서로 하는 것은 아닙니다'), `${width}: conversion vs validation outcomes`);
    await open('7-12');
    const r7 = await page.locator('#stage .t7-real').innerText();
    check(['타입 표시', '자료형 변환', '실제 검증', 'models.py', 'cli.py', 'validators.py', 'type=int', 'validate_amount()'].every(x => r7.includes(x)), `${width}: 7-12 three roles with real labels`);
    await open('7-13'); await page.locator('[data-reveal]').click();
    check(await page.locator('#stage .qa .a:visible').count() === 4, `${width}: 7-13 answers`);
    await open('7-14');
    check(await page.locator('#stage .t7-app .q').count() === 12 && await page.locator('#stage .t7-app .a').count() === 0, `${width}: 7-14 answers hidden`);
    await page.locator('[data-reveal]').click();
    const ap = await page.$$eval('#stage .t7-app .a', as => as.map(a => a.textContent));
    check(ap.length === 12 && ap[2] === '예' && ap[7] === '아니요 (쉼표)' && ap[11] === '아니요', `${width}: 7-14 answers revealed ${ap}`);
    await open('7-15'); await page.locator('[data-goscene="7"]').click();
    check((await pos()).startsWith('Scene 08 · 1 / 17'), `${width}: Scene 07 wrap → Scene 08`);

    // ---- Scene 08 의미 ----
    const src = await page.evaluate(() => MAP8_SRC);
    const areas8 = await page.evaluate(() => AREAS8);
    for (const [id, r] of Object.entries(src.relations)) { const o = cmap.relations.find(x => x.id === id); check(o && ['from', 'to', 'type', 'label', 'scope'].every(k => o[k] === r[k]), `${width}: relation ${id} equals original`); }
    for (const [id, c] of Object.entries(src.comparisons)) { const o = cmap.comparisons.find(x => x.id === id); check(o && ['left', 'right', 'leftText', 'rightText'].every(k => o[k] === c[k]), `${width}: comparison ${id} equals original`); }
    for (const [id, n] of Object.entries(src.nodes)) { const o = cmap.nodes.find(x => x.id === id); check(o && ['label', 'area', 'easy'].every(k => o[k] === n[k]), `${width}: node ${id} equals original`); }
    check(Object.keys(src.relations).sort().join() === 'R09,R23,R28,R37,R41' && Object.keys(src.comparisons).sort().join() === 'C13,C30', `${width}: lecture uses only R09/R23/R28/R37/R41 and C13/C30`);
    for (const [id, from, to, type] of [['R22', 'iterable', 'iterator', '역할'], ['R23', 'generator', 'iterator', '종류'], ['R41', 'iterator', 'iterable', '종류']]) { const o = cmap.relations.find(x => x.id === id); check(o && o.from === from && o.to === to && o.type === type, `${width}: original ${id} ${from}→${to} ${type}`); }
    check(await page.evaluate(() => AREAS8.every(a => resolveHash(a.review))), `${width}: every area review address resolves`);
    check(areas8.length === 7 && areas8.every(a => a.src.every(x => cmap.areas.some(y => y.id === x)) && a.nodes.every(x => cmap.nodes.some(y => y.id === x))), `${width}: lecture area mapping points to existing original areas/nodes`);
    await open('8-1');
    check(await page.locator('#stage .m8-tile').count() === 7 && await page.locator('#stage .m8-tile.sel').count() === 0 && await page.locator('#stage .m8-link').count() === 0, `${width}: 8-1 seven areas, no lines`);
    for (let k = 0; k < 7; k++) {
      await open(`8-${k + 2}`);
      check(await page.locator('#stage .m8-tile.sel').count() === 1 && (await page.locator('#stage .m8-tile.sel .badge').innerText()) === '선택' && await page.locator(`#stage [data-review="${areas8[k].review}"]`).count() === 1, `${width}: 8-${k + 2} area ${areas8[k].name}`);
    }
    await open('8-9');
    const tps = await page.$$eval('#stage .m8-type', ts => ts.map(t => t.querySelector('b').textContent + ':' + t.querySelector('small').textContent));
    check(tps.length === 4 && tps.every((t, k) => t.includes(['포함', '종류', '사용', '역할'][k]) && t.includes(['R09', 'R23', 'R37', 'R28'][k])) && (await page.locator('#stage .m8-type').nth(1).innerText()).includes('R41') && (await page.locator('#stage .m8-type').nth(1).innerText()).includes('Iterator — Iterable'), `${width}: 8-9 four relation types, kind = R23 + R41 ${tps}`);
    for (const [i, id] of [[10, 'R09'], [11, 'R37'], [12, 'R28']]) {
      await open(`8-${i}`);
      const r = src.relations[id], txt = await stageText();
      check(txt.includes(src.nodes[r.from].label) && txt.includes(src.nodes[r.to].label) && (await page.locator('#stage .m8-link .tp').innerText()) === r.type && (await page.locator('#stage .m8-link .lb').innerText()) === r.label && txt.includes(`원본 관계 ${id}`) && txt.includes('실행 순서가 아님'), `${width}: 8-${i} relation ${id}`);
    }
    for (const [i, id] of [[13, 'C30'], [14, 'C13']]) {
      await open(`8-${i}`);
      const c = src.comparisons[id], txt = await stageText();
      check(txt.includes(c.leftText) && txt.includes(c.rightText) && txt.includes(`원본 비교 카드 ${id}`), `${width}: 8-${i} comparison ${id}`);
    }
    await open('8-15'); await page.locator('[data-reveal]').click();
    check(await page.locator('#stage .qa .a:visible').count() === 5 && (await stageText()).includes('Generator 객체, Iterator, Iterable'), `${width}: 8-15 answers incl. iterator relation`);
    await open('8-13');
    check(await page.locator('#stage [data-review="5-jsonl"]').count() === 1, `${width}: 8-13 reviews new Scene 05 JSONL step`);
    await open('8-16');
    check(await page.locator('#stage .m8-task').count() === 7 && await page.locator('#stage .m8-task .ar:visible').count() === 0 && (await stageText()).includes('순서가 아닙니다'), `${width}: 8-16 tasks, answers hidden`);
    await page.locator('[data-reveal]').click();
    const ars = await page.locator('#stage .m8-task .ar').allInnerTexts();
    check(ars.length === 7 && new Set(ars).size === 7 && areas8.every(a => ars.includes(a.name)), `${width}: 8-16 every area used once`);
    await open('8-17');
    check(await page.locator('#stage [data-review]').count() === 7 && (await stageText()).includes('미연결') && (await stageText()).includes('별도 탐색 시안'), `${width}: 8-17 review tiles, honest status`);
    // 복습 왕복
    await open('1-1');
    check(await page.locator('#backMap').isHidden(), `${width}: no return chip outside a map review`);
    await open('8-6');
    await page.locator('[data-review="5-iterable"]').click();
    check((await pos()).startsWith('Scene 05 · 2 / 22') && new URL(page.url()).hash === '#5-iterable' && (await page.locator('#backMap').innerText()).includes('6단계'), `${width}: review jump to Scene 05 Iterable shows return chip`);
    await page.locator('#next').click();
    check(await page.locator('#backMap').isVisible(), `${width}: return chip stays while reviewing`);
    await page.locator('#backMap').click();
    check((await pos()).startsWith('Scene 08 · 6 / 17') && await page.locator('#backMap').isHidden() && await page.evaluate(() => document.activeElement?.dataset.key) === 'rev-5-iterable', `${width}: return chip restores map step and focus`);
    await open('8-10');
    await page.locator('[data-review="2-12"]').click();
    check((await pos()).startsWith('Scene 02 · 12 / 17'), `${width}: relation review jump`);
    await page.goBack();
    check((await pos()).startsWith('Scene 08 · 10 / 17') && await page.locator('#backMap').isHidden(), `${width}: browser back returns to map step`);
    await open('8-17'); await page.locator('[data-review="7-1"]').click();
    check((await pos()).startsWith('Scene 07 · 1 / 15') && (await page.locator('#backMap').innerText()).includes('17단계'), `${width}: summary tile review`);

    // ---- 이동·목차·노트·조작부 ----
    await open('2-17');
    await page.locator('[data-goscene="2"]').click();
    check((await pos()).startsWith('Scene 03 · 1 / 12'), `${width}: Scene 02 wrap → Scene 03`);
    await page.keyboard.press('ArrowLeft');
    check((await pos()).startsWith('Scene 02 · 17 / 17'), `${width}: ArrowLeft back to Scene 02`);
    await open('1-1');
    await page.locator('body').click({ position: { x: 2, y: 2 } });
    for (let k = 0; k < 13 + 17 + 12 + 14 + 22 + 18 + 15; k++) await page.keyboard.press('ArrowRight');
    check((await pos()).startsWith('Scene 08 · 1 / 17'), `${width}: ArrowRight walks into Scene 08`);
    await page.keyboard.press('End');
    check((await pos()).includes('17 / 17') && await page.locator('#next').isDisabled(), `${width}: End of last scene`);
    await page.keyboard.press('Home');
    check((await pos()).includes('1 / 17'), `${width}: Home`);
    await page.locator('#tocBtn').click();
    check(await page.locator('#tocBody [data-jump]').count() === TOTAL && await page.locator('#tocBody .scene-h').count() === 8, `${width}: outline lists ${TOTAL} steps in 8 scenes`);
    await page.locator('#tocBody [data-jump="2-7"]').click();
    check((await pos()).startsWith('Scene 03 · 8 / 12'), `${width}: outline jump into Scene 03`);
    await page.locator('#noteBtn').click();
    const note = await page.locator('#noteBody').innerText();
    check(note.includes('14,500원') && note.includes('강사 노트') && note.includes('선택형 심화'), `${width}: Scene 03 note`);
    await page.keyboard.press('Escape');
    check(!(await page.locator('#note').isVisible()), `${width}: Esc closes note`);
    await open('4-4'); await page.locator('#noteBtn').click();
    check((await page.locator('#noteBody').textContent()).includes('저장은 자동이 아니다'), `${width}: Scene 04 accuracy note (collapsed section)`);
    await page.keyboard.press('Escape');
    check(await page.locator('.ctl button').count() === 5, `${width}: five instructor buttons`);
    if (mobile) {
      for (const h of ['3-1', '3-7', '4-1', '4-6', '4-11']) {
        await open(h);
        const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => b.textContent.trim().slice(0, 20)));
        check(small.length === 0, `${width} ${h}: touch targets >=44px ${small}`);
      }
    }
    if (width === 1280) { await open('3-4'); await page.locator('#noteBtn').click(); await shot('panel-note-s03'); }
    results.push({ width, height, status: 'PASS' });
    await ctx.close();
  }
  check(errors.length === 0, 'browser errors: ' + errors.join(' | '));
  check(external.length === 0, 'external requests: ' + external.join(' | '));
} catch (e) {
  results.push({ status: 'FAIL', error: e.message });
  process.exitCode = 1;
} finally {
  await browser.close();
  const report = { date: new Date().toISOString(), browser: 'Chrome (Playwright channel)', baseline: BASE_COMMIT, ledgerChecks, assertions, results, regressionDiffs: regression, mobileScrollSteps: scrollSteps, errors, externalRequests: external };
  await writeFile(new URL('results.json', here), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ assertions, ledgerChecks, results, regressionDiffs: regression, mobileScrollSteps: scrollSteps, errors: errors.length, external: external.length }));
}
