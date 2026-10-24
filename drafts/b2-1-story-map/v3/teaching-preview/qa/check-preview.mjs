// Teaching preview QA. Existing repository Playwright + installed Chrome.
// Usage (repo root): node drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const here = new URL('./', import.meta.url);
const page0 = new URL('../index.html', import.meta.url).href;
const md = (await Promise.all(['scene-01', 'scene-02'].map(s => readFile(new URL(`../../${s}/storyboard.md`, import.meta.url), 'utf8'))))
  .join('\n').replace(/\*\*|`/g, '');
// 원고 표를 한 문장으로 합친 상황 문장(F3 대응표)과 UI 안내 문장은 원고 원문 대조에서 제외하고 별도 규칙으로 확인한다.
const COMBINED = { '2-8': 'Repository부터 살펴봅니다', '2-9': 'CLI부터 살펴봅니다' };
const UI_ONLY = ['1-11', '2-16'];
const N = [13, 17];

const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const results = [], errors = [], external = [], scrollSteps = [];
let assertions = 0;
const check = (ok, label) => { assertions++; if (!ok) throw Error(label); };

try {
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
    const SHOTS = { '1-1': 's01-f1-gui', '1-4': 's01-f2-python', '1-8': 's01-f3-who', '1-10': 's01-f4-boundary', '1-13': 's01-summary', '2-1': 's02-f1-needs', '2-5': 's02-f2-service', '2-8': 's02-f3-storage', '2-11': 's02-f4-module', '2-13': 's02-f5-import', '2-14': 's02-f6-main', '2-15': 's02-f7-ledger', '2-16': 's02-check' };

    // ---- 처음부터 끝까지 '다음'으로 진행하며 모든 단계 검사 ----
    await open('1-1');
    check(await page.locator('#prev').isDisabled(), `${width}: prev disabled at first step`);
    const boxes = {};
    for (let sc = 1; sc <= 2; sc++) {
      for (let i = 1; i <= N[sc - 1]; i++) {
        const key = `${sc}-${i}`, t = `${width} ${key}`;
        check((await pos()).startsWith(`Scene 0${sc} · ${i} / ${N[sc - 1]}`), `${t}: position label`);
        check(new URL(page.url()).hash === `#${key}`, `${t}: hash`);
        const sentence = (await say()).trim();
        if (COMBINED[key]) check(sentence.includes(COMBINED[key]), `${t}: combined first-look sentence`);
        else if (!UI_ONLY.includes(key)) check(md.includes(sentence), `${t}: sentence from storyboard: ${sentence}`);
        const text = await stageText();
        check(!/self|__init__\(|class |def /.test(text), `${t}: no class syntax or code internals`);
        const m = await page.evaluate(() => ({
          w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight,
          clip: [...document.querySelectorAll('#stage code, #stage .fn, #stage .ko, #stage .lbl')].filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1).map(e => e.textContent)
        }));
        check(m.w <= width, `${t}: horizontal overflow ${m.w}`);
        check(m.clip.length === 0, `${t}: clipped text ${m.clip}`);
        if (mobile) { if (m.h > height) scrollSteps.push(`${width} ${key} (${m.h}px)`); }
        else check(m.h <= height, `${t}: PC needs scrolling ${m.h}`);
        // 화살표: Scene 02에서는 실제 실행 흐름(F6)에만
        const arrows = await page.locator('#stage .arrow-h:visible, #stage .arrow-v:visible').count();
        if (sc === 2) {
          const inFlow = await page.locator('#stage .runflow .arrow-v:visible').count();
          check(arrows === inFlow, `${t}: arrows only in run flow`);
          check(key === '2-14' ? inFlow === 3 : arrows === 0, `${t}: arrow count`);
          if (key !== '2-16') {
            check(!/[→←↓↑]/.test(await page.locator('#stage .frame').innerText()), `${t}: no arrow glyphs in role structure`);
            check((await page.locator('#stage .tile').count()) === 4, `${t}: four role positions`);
          }
          const tag = await page.locator('#tag').innerText();
          check(key === '2-15' ? tag.includes('실제 사례') : tag.includes('가상 todo'), `${t}: virtual/real label`);
        } else {
          // F3 넘겨줌(1-8)과 이를 다시 쓰는 정리(1-13)는 1개, F4 처리 흐름은 2개, 나머지는 0개
          check(arrows === (['1-8', '1-13'].includes(key) ? 1 : ['1-9', '1-10'].includes(key) ? 2 : 0), `${t}: scene 01 arrow count ${arrows}`);
          check((await page.locator('#tag').innerText()).includes('가상 todo'), `${t}: virtual label`);
        }
        if (['2-2', '2-10', '2-15'].includes(key)) boxes[key] = await tileBoxes();
        if (SHOTS[key]) await shot(SHOTS[key]);
        if (!(sc === 2 && i === N[1])) await page.locator('#next').click();
      }
    }
    check(await page.locator('#next').isDisabled(), `${width}: next disabled at last step`);
    // F2·F4·F7 같은 자리
    check(boxes['2-2'].join('|') === boxes['2-10'].join('|') && boxes['2-2'].join('|') === boxes['2-15'].join('|'), `${width}: role tiles keep identical positions in F2/F4/F7`);

    // ---- 그림별 의미 검사 ----
    const pressed = sel => page.locator(`${sel}[aria-pressed="true"]`).count();
    for (const [i, id] of [[4, 'python'], [5, 'target'], [6, 'task'], [7, 'cond']]) {
      await open(`1-${i}`);
      check(await page.locator(`[data-key="part-${id}"]`).getAttribute('aria-pressed') === 'true' && await pressed('#stage .part') === 1, `${width}: 1-${i} highlights ${id} only`);
      check(await page.locator('#stage .term-chip:visible').count() === (id === 'cond' ? 1 : 0), `${width}: 옵션 chip only on condition`);
    }
    await open('1-8');
    const g = async n => (await page.locator(`#stage .grp[data-grp="${n}"]`).innerText()).replace(/\s+/g, ' ');
    const py = await g('py'), app = await g('app');
    check(py.includes('Python이 읽는 부분') && py.includes('python') && py.includes('-m todo') && !py.includes('list'), `${width}: Python reads python -m todo`);
    check(app.includes('todo 프로그램이 받는 부분') && app.includes('list') && app.includes('--limit 5') && !app.includes('-m todo'), `${width}: todo receives list --limit 5`);
    check((await page.locator('#stage .handoff .txt').innerText()).includes('나머지 글자를 넘겨줌'), `${width}: handoff label`);
    await open('1-3');
    check(!(await page.locator('#stage .handoff').isVisible()), `${width}: handoff hidden outside F3`);
    await open('1-9');
    check((await page.locator('#stage .f4').getAttribute('class')).includes('flow'), `${width}: F4 flow highlight`);
    await open('1-10');
    check((await page.locator('#stage .f4').getAttribute('class')).includes('edge') && (await stageText()).includes('여기까지 argparse'), `${width}: F4 boundary`);
    await open('1-12');
    check(!(await stageText()).includes('--limit 3'), `${width}: apply answer hidden before reveal`);
    await page.locator('[data-reveal]').click();
    check((await stageText()).includes('--limit 3') && (await stageText()).includes('최대 3개까지만') && !(await stageText()).includes('--limit 5'), `${width}: apply reveal shows --limit 3 with matching meaning`);
    check(await pressed('#stage .part') === 1, `${width}: apply highlights only the changed part`);
    await page.locator('#next').click();
    check((await pos()).includes('13 / 13'), `${width}: reveal resets on step change`);
    await open('1-11');
    check(await page.locator('#stage .qa .a:visible').count() === 0, `${width}: answers hidden`);
    await page.locator('[data-reveal]').click();
    check(await page.locator('#stage .qa .a:visible').count() === 3, `${width}: answers shown after reveal`);

    for (const [i, id] of [[3, 'model'], [4, 'repo'], [5, 'service'], [6, 'cli']]) {
      await open(`2-${i}`);
      check(await page.locator(`[data-key="tile-${id}"]`).getAttribute('aria-pressed') === 'true' && await pressed('#stage .tile') === 1, `${width}: 2-${i} highlights ${id} only`);
    }
    for (const [i, id] of [[8, 'repo'], [9, 'cli']]) {
      await open(`2-${i}`);
      check(await page.locator(`[data-key="tile-${id}"] .badge`).innerText() === '먼저 볼 곳' && await page.locator('#stage .tile .badge').count() === 1, `${width}: 2-${i} first-look on ${id}`);
    }
    await open('2-7');
    check(await page.locator('#stage .tile .badge').count() === 0 && await pressed('#stage .tile') === 0, `${width}: 2-7 asks before answering`);
    await open('2-11');
    check(await page.locator('[data-key="tile-model"] .badge').innerText() === '모듈', `${width}: module default models.py`);
    await page.locator('[data-key="tile-cli"]').click();
    check(await page.locator('[data-key="tile-cli"] .badge').innerText() === '모듈' && (await pos()).includes('11 / 17'), `${width}: any file can be shown as a module`);
    await open('2-12');
    check((await page.locator('#stage .frame').getAttribute('class')).includes('hl'), `${width}: package highlights folder boundary`);
    await open('2-13');
    check(await page.locator('#stage .link').isVisible() && (await stageText()).includes('실행 순서가 아닙니다'), `${width}: import relation labelled as not order`);
    for (const k of ['2-12', '2-14']) { await open(k); check(await page.locator('#stage .link').count() === 0, `${width}: import line only on import step (${k})`); }
    await open('2-14');
    check(await page.locator('#stage .mainrow.sel').isVisible() && (await stageText()).includes('todo/__main__.py'), `${width}: __main__.py start file`);
    await open('2-13');
    check(!(await page.locator('#stage .mainrow').isVisible()), `${width}: __main__.py not shown before F6`);
    await open('2-15');
    const ledger = await stageText();
    check(ledger.includes('ledger/') && ledger.includes('python -m ledger list --limit 5') && ledger.includes('errors.py') && !ledger.includes('todo/'), `${width}: ledger case separated from todo`);
    await open('2-1');
    check((await stageText()).includes('순서표가 아닙니다'), `${width}: needs caption`);

    // ---- 조작 ----
    await open('1-4');
    await page.locator('[data-key="part-python"]').click();
    check((await pos()).includes('3 / 13'), `${width}: clicking the selected part returns to whole command`);
    await page.locator('[data-key="part-cond"]').click();
    check((await pos()).includes('7 / 13'), `${width}: direct selection jumps to condition`);
    await page.locator('#homeBtn').click();
    check((await pos()).includes('3 / 13'), `${width}: 전체 구조 returns to command overview`);
    await open('2-5');
    await page.locator('#homeBtn').click();
    check((await pos()).includes('2 / 17'), `${width}: 전체 구조 returns to role overview`);
    await page.locator('[data-key="tile-repo"]').click();
    check((await pos()).includes('4 / 17'), `${width}: direct role selection`);
    await open('2-7');
    await page.locator('[data-key="sit-display"]').click();
    check((await pos()).includes('9 / 17'), `${width}: situation selection`);
    await open('2-1');
    await page.locator('[data-key="tile-service"]').click();
    check((await pos()).includes('5 / 17'), `${width}: need bubble leads to its role`);
    await open('1-13');
    await page.locator('[data-goscene]').click();
    check((await pos()).startsWith('Scene 02 · 1 / 17') && await page.evaluate(() => document.activeElement?.id) === 'q', `${width}: summary link to Scene 02 moves focus to question`);
    await page.locator('#prev').click();
    check((await pos()).startsWith('Scene 01 · 13 / 13'), `${width}: prev crosses back to Scene 01`);
    // 키보드
    await open('1-1');
    await page.locator('body').click({ position: { x: 2, y: 2 } });
    for (let k = 0; k < 13; k++) await page.keyboard.press('ArrowRight');
    check((await pos()).startsWith('Scene 02 · 1 / 17'), `${width}: ArrowRight walks into Scene 02`);
    await page.keyboard.press('End');
    check((await pos()).includes('17 / 17'), `${width}: End`);
    await page.keyboard.press('Home');
    check((await pos()).includes('1 / 17'), `${width}: Home`);
    await page.keyboard.press('ArrowLeft');
    check((await pos()).startsWith('Scene 01 · 13 / 13'), `${width}: ArrowLeft back across scenes`);
    await page.locator('[data-key="part-task"]').focus(); await page.keyboard.press('Enter');
    check((await pos()).includes('6 / 13'), `${width}: Enter on a figure part`);
    // 목차
    await page.locator('#tocBtn').click();
    check(await page.locator('#toc').isVisible() && await page.locator('#tocBody [data-jump]').count() === 30, `${width}: outline lists all 30 steps`);
    check(await page.locator('#tocBody [aria-current="step"]').count() === 1, `${width}: outline marks current step`);
    await page.keyboard.press('ArrowRight');
    check((await pos()).includes('6 / 13'), `${width}: arrows do not move steps behind the outline`);
    await page.locator('#tocBody [data-jump="1-14"]').click();
    check(!(await page.locator('#toc').isVisible()) && (await pos()).startsWith('Scene 02 · 15 / 17'), `${width}: outline jump`);
    // 강사 노트
    await page.locator('#noteBtn').click();
    const note = await page.locator('#noteBody').innerText();
    check(await page.locator('#note').isVisible() && note.includes('용돈 기입장 프로그램 ledger') && note.includes('강사 노트') && note.includes('선택형 심화'), `${width}: note shows step script, notes and deep dive`);
    await page.keyboard.press('Escape');
    check(!(await page.locator('#note').isVisible()) && await page.evaluate(() => document.activeElement?.id) === 'noteBtn', `${width}: Esc closes note and returns focus`);
    // 조작부 위계·터치 영역
    const sizes = await page.evaluate(() => ({ ctl: parseFloat(getComputedStyle(document.querySelector('.ctl button')).fontSize), h1: parseFloat(getComputedStyle(document.querySelector('h1')).fontSize), say: parseFloat(getComputedStyle(document.querySelector('#say')).fontSize) }));
    check(sizes.ctl < sizes.say && sizes.ctl < sizes.h1, `${width}: controls quieter than content`);
    check(await page.locator('.ctl button').count() === 5, `${width}: five instructor buttons`);
    if (mobile) {
      for (const h of ['1-8', '2-8', '2-11']) {
        await open(h);
        const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => b.textContent.trim().slice(0, 20)));
        check(small.length === 0, `${width} ${h}: touch targets >=44px ${small}`);
      }
    }
    // 노트 패널 대표 화면
    if (width === 1280) { await open('2-4'); await page.locator('#noteBtn').click(); await shot('panel-note'); }
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
  const report = { date: new Date().toISOString(), browser: 'Chrome (Playwright channel)', assertions, results, mobileScrollSteps: scrollSteps, errors, externalRequests: external };
  await writeFile(new URL('results.json', here), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ assertions, results, mobileScrollSteps: scrollSteps, errors: errors.length, external: external.length }));
}
