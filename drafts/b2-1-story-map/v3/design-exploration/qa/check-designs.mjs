// Design exploration QA. Existing repository Playwright + installed Chrome.
// Usage (repo root): node drafts/b2-1-story-map/v3/design-exploration/qa/check-designs.mjs
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';

const here = new URL('./', import.meta.url);
const storyboards = (await Promise.all(['scene-01', 'scene-02'].map(s =>
  readFile(new URL(`../../${s}/storyboard.md`, import.meta.url), 'utf8')))).join('\n');
const browser = await chromium.launch({ channel: process.env.B21_BROWSER_CHANNEL || 'chrome', headless: true });
const results = [], errors = [], external = [];
let assertions = 0;
const check = (ok, label) => { assertions++; if (!ok) throw Error(label); };

const PARTS = [['python', 'python', '실행 도구'], ['target', '-m todo', '실행할 대상'], ['task', 'list', '할 일'], ['cond', '--limit 5', '조건']];
const ROLES = [['model', 'Model'], ['repo', 'Repository'], ['service', 'Service'], ['cli', 'CLI']];
const SITS = [['storage', 'repo', 'Repository'], ['display', 'cli', 'CLI']];
const SEQ1 = ['overview', 'python', 'target', 'task', 'cond', 'who'];
const SEQ2 = ['overview', 'model', 'repo', 'service', 'cli', 'storage', 'display'];

try {
  for (const design of ['a', 'b']) {
    for (const width of [1280, 390, 360]) {
      const height = width === 1280 ? 720 : 800, mobile = width < 600;
      const ctx = await browser.newContext({ viewport: { width, height }, isMobile: mobile, hasTouch: mobile });
      const page = await ctx.newPage();
      page.on('pageerror', e => errors.push(`${design}/${width}: ${e.message}`));
      page.on('console', m => { if (['error', 'warning'].includes(m.type())) errors.push(`${design}/${width}: ${m.text()}`); });
      page.on('requestfailed', r => errors.push(`${design}/${width}: ${r.url()} ${r.failure()?.errorText}`));
      page.on('request', r => { if (/^https?:/.test(r.url())) external.push(r.url()); });
      await page.goto(new URL(`../design-${design}.html`, import.meta.url).href);
      const tag = `${design}/${width}`;
      const partBtn = id => design === 'a' ? page.locator(`.part[data-part="${id}"]`) : page.locator(`.col[data-part="${id}"] .card`);
      const roleBtn = id => page.locator(design === 'a' ? `.role[data-role="${id}"]` : `.zone[data-role="${id}"]`);
      const say = n => page.locator(`#say${n}`).innerText();
      const layout = async label => {
        const m = await page.evaluate(() => {
          const over = [...document.querySelectorAll('.screen.on code, .screen.on .tok, .screen.on .ko, .screen.on .lbl')]
            .filter(e => e.offsetParent && e.scrollWidth > e.clientWidth + 1).map(e => e.textContent);
          return { w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, over };
        });
        check(m.w <= width, `${label}: horizontal overflow ${m.w}`);
        check(m.h <= height, `${label}: needs scrolling ${m.h}>${height}`);
        check(m.over.length === 0, `${label}: clipped text ${m.over}`);
        return m;
      };
      const shot = async name => { await page.waitForTimeout(400); await page.screenshot({ path: new URL(`design-${design}-${name}-${width}.png`, here).pathname }); };

      // ---- 화면 1 ----
      check((await page.locator('#q1').innerText()).includes('명령 한 줄로 프로그램에 어떻게 일을 부탁할까?'), `${tag}: scene 01 question`);
      check((await page.locator('#screen1').innerText()).includes('가상 todo 예시'), `${tag}: virtual example label`);
      check(storyboards.includes(await say(1)), `${tag}: overview sentence from storyboard`);
      check(await page.locator('#prev').isDisabled(), `${tag}: prev disabled at start`);
      await layout(`${tag} s1 overview`);
      for (const [id, token, label] of PARTS) {
        await partBtn(id).click();
        const t = `${tag} s1 ${id}`;
        check(await page.locator('#screen1 [aria-pressed="true"]').count() === 1, `${t}: one selection`);
        check(await partBtn(id).getAttribute('aria-pressed') === 'true', `${t}: pressed`);
        const sentence = await say(1);
        check(storyboards.includes(sentence) && sentence.startsWith(token === 'python' ? 'python은' : token), `${t}: sentence from storyboard`);
        const text = await partBtn(id).innerText();
        check(text.includes(label), `${t}: label`);
        check((await page.locator('#screen1').innerText()).includes(token), `${t}: token`);
        check(await page.locator('#screen1 .term').filter({ hasText: '옵션' }).first().isVisible() === (id === 'cond'), `${t}: 옵션 term only on condition`);
        await layout(t);
        if (id === 'cond') await shot('s1-part');
      }
      await partBtn('cond').click();
      check(await say(1) === '명령 한 줄은 네 부분으로 나누어 읽을 수 있습니다.', `${tag}: second click returns to overview`);
      // 누가 읽나 — 해석 주체
      await page.locator('#who').click();
      const grp = async g => (await page.locator(`.grp[data-grp="${g}"]`).innerText()).replace(/\s+/g, ' ');
      const py = await grp('py'), app = await grp('app');
      check(py.includes('Python이 읽는 부분') && py.includes('python') && py.includes('-m todo') && !py.includes('list') && !py.includes('--limit'), `${tag}: Python group holds python -m todo only`);
      check(app.includes('todo 프로그램이 받는 부분') && app.includes('list') && app.includes('--limit 5') && !app.includes('-m todo'), `${tag}: todo group holds list --limit 5 only`);
      check(await page.locator('.grp[data-grp="py"] .glabel, .grp[data-grp="py"] .grp-label').first().isVisible(), `${tag}: group label visible`);
      check(await page.locator('.handoff .txt').isVisible() && (await page.locator('.handoff .txt').innerText()).includes('나머지 글자를 넘겨줌'), `${tag}: single handoff shown`);
      check(storyboards.includes(await say(1)), `${tag}: who sentence from storyboard`);
      check(await page.locator('#next').isDisabled(), `${tag}: next disabled at end`);
      await layout(`${tag} s1 who`); await shot('s1-who');
      await page.locator('#who').click();
      check(!(await page.locator('.handoff .txt').isVisible()), `${tag}: handoff hidden outside who state`);
      // 키보드
      await page.locator('body').click({ position: { x: 2, y: 2 } });
      await page.keyboard.press('Home');
      for (let i = 1; i < SEQ1.length; i++) {
        await page.keyboard.press('ArrowRight');
        const on = SEQ1[i] === 'who' ? await page.locator('#who').getAttribute('aria-pressed') === 'true' : await partBtn(SEQ1[i]).getAttribute('aria-pressed') === 'true';
        check(on, `${tag}: ArrowRight step ${SEQ1[i]}`);
      }
      await page.keyboard.press('Escape');
      check(await say(1) === '명령 한 줄은 네 부분으로 나누어 읽을 수 있습니다.', `${tag}: Escape resets`);
      await partBtn('task').focus(); await page.keyboard.press('Enter');
      check(await partBtn('task').getAttribute('aria-pressed') === 'true', `${tag}: Enter selects focused part`);
      await page.keyboard.press('Space');
      check(await partBtn('task').getAttribute('aria-pressed') === 'false', `${tag}: Space toggles focused part`);

      // ---- 화면 2 ----
      await page.locator('[data-screen="2"]').click();
      check(await page.evaluate(() => document.activeElement?.id) === 'q2', `${tag}: focus moves to scene 02 question`);
      check((await page.locator('#q2').innerText()).includes('프로그램은 왜 역할을 나누고 여러 파일로 만들까?'), `${tag}: scene 02 question`);
      check(await page.locator('#who').isHidden(), `${tag}: who control hidden on scene 02`);
      check(storyboards.includes(await say(2)), `${tag}: role overview sentence from storyboard`);
      const s2text = await page.locator('#screen2').innerText();
      check(!/[→←↓↑▶①②③④]/.test(s2text), `${tag}: no arrows or step numbers in role screen text`);
      check(await page.locator('#screen2 .handoff, #screen2 .arw, #screen2 marker').count() === 0, `${tag}: no arrow graphics in role screen`);
      for (const k of ['기록의 모양을 정하는 부분', '기록을 읽고 저장하는 부분', '요청한 일을 처리하는 부분', '명령을 받고 결과를 보여 주는 부분']) check(s2text.includes(k), `${tag}: role description ${k}`);
      check(!/class |def |self|__init__|import /.test(s2text), `${tag}: no code, class syntax or internals`);
      await layout(`${tag} s2 overview`);
      for (const [id, en] of ROLES) {
        await roleBtn(id).click();
        const t = `${tag} s2 ${id}`;
        check(await page.locator('#screen2 [aria-pressed="true"]').count() === 1, `${t}: one selection`);
        const sentence = await say(2);
        check(storyboards.includes(sentence) && sentence.includes(en), `${t}: sentence from storyboard`);
        check(await page.locator('#screen2 .flag:visible').count() === 0, `${t}: no first-look flag for plain role selection`);
        await layout(t);
        if (id === 'cli') await shot('s2-role');
      }
      for (const [id, target, en] of SITS) {
        await page.locator(`.sit[data-sit="${id}"]`).click();
        const t = `${tag} s2 ${id}`;
        check(await page.locator('.sit[aria-pressed="true"]').count() === 1, `${t}: one situation`);
        check(await roleBtn(target).getAttribute('aria-pressed') === 'true', `${t}: target role highlighted`);
        check(await page.locator('#screen2 [aria-pressed="true"]').count() === 2, `${t}: only situation + target role pressed`);
        const flags = page.locator('#screen2 .flag:visible');
        check(await flags.count() === 1 && await roleBtn(target).locator('.flag').isVisible(), `${t}: single first-look flag on ${en}`);
        const sentence = await say(2);
        check(sentence.includes(`${en}부터 살펴봅니다`), `${t}: first-look sentence`);
        await layout(t);
        if (id === 'storage') await shot('s2-situation');
      }
      check(await page.locator('#next').isDisabled(), `${tag}: s2 next disabled at end`);
      await page.keyboard.press('Home');
      for (let i = 1; i < SEQ2.length; i++) await page.keyboard.press('ArrowRight');
      check(await page.locator('.sit[data-sit="display"]').getAttribute('aria-pressed') === 'true', `${tag}: s2 keyboard reaches last situation`);
      await page.keyboard.press('ArrowLeft');
      check(await page.locator('.sit[data-sit="storage"]').getAttribute('aria-pressed') === 'true', `${tag}: s2 ArrowLeft`);
      await page.locator('#reset').click();
      check(storyboards.includes(await say(2)), `${tag}: reset to overview`);
      // 강사 조작부가 학습 콘텐츠보다 작다
      const sizes = await page.evaluate(() => ({ ctl: parseFloat(getComputedStyle(document.querySelector('.ctl button')).fontSize), h1: parseFloat(getComputedStyle(document.querySelector('.screen.on h1')).fontSize) }));
      check(sizes.ctl < sizes.h1, `${tag}: controls visually quieter than content`);
      // 모든 버튼 크기 (모바일 44px)
      if (mobile) {
        const small = await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.offsetParent && b.getBoundingClientRect().height < 44).map(b => b.textContent.trim()));
        check(small.length === 0, `${tag}: touch targets >=44px ${small}`);
      }
      results.push({ design, width, height, status: 'PASS' });
      await ctx.close();
    }
  }
  check(errors.length === 0, 'browser errors: ' + errors.join(' | '));
  check(external.length === 0, 'external requests: ' + external.join(' | '));
} catch (e) {
  results.push({ status: 'FAIL', error: e.message });
  process.exitCode = 1;
} finally {
  await browser.close();
  const report = { date: new Date().toISOString(), browser: 'Chrome (Playwright channel)', assertions, results, errors, externalRequests: external };
  await writeFile(new URL('results.json', here), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ assertions, results, errors: errors.length, external: external.length }));
}
