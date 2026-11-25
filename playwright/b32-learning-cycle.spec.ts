import { mkdirSync, readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';

test.skip(process.env.B32_REVIEW !== '1', 'Run with B32_REVIEW=1 for the local review edition.');
const story = '/missions/main-M06/story';
const lab = '/missions/main-M06/lab';
const guide = readFileSync('content/mission-stories/main-m06/lab-guide-v0.3-r1.md', 'utf8');
const output = process.env.B32_V03_QA_OUTPUT;
if (output) mkdirSync(output, { recursive: true });

function storyUrl(id: string, suffix = '') {
  return `/#${story}?scene=${id[1]}&screen=${id[3]}${suffix}`;
}

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', route => route.request().url().startsWith(`${baseURL}/`) ? route.continue() : route.abort());
});

async function checkViewport(page: Page) {
  const size = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(size.scroll).toBeLessThanOrEqual(size.viewport);
}

test('nine directly accessible core lessons, collapsed A/B/C and source-backed result index', async ({ page }) => {
  await page.goto(`/#${lab}`);
  await expect(page.getByRole('heading', { name: '실습 목차' })).toBeVisible();
  await expect(page.locator('.b32-lab-index li')).toHaveCount(9);
  await expect(page.locator('.b32-lab-index-summary')).toContainText('약 75분');
  await expect(page.locator('.b32-lab-index-summary')).toContainText('약 60분');
  await expect(page.locator('.b32-lab-index-summary')).toContainText('2회');
  for (let n = 1; n <= 9; n++) {
    const id = String(n).padStart(2, '0');
    await page.goto(`/#${lab}/${id}`);
    await expect(page.locator('.b32-lab-kicker')).toHaveText(`B3-2 · Lab ${id}`);
    await expect(page.getByRole('heading', { name: 'A. 핵심 실습' })).toBeVisible();
    for (const anchor of ['results', 'b', 'c']) await expect(page.locator(`details#${anchor}`)).not.toHaveAttribute('open');
    await expect(page.locator('.b32-lab-heading .b32-lab-back')).toHaveAttribute('href', /scene=\d&screen=\d&from-lab=0[1-9]/);
  }
  await page.goto(`/#${lab}/99`);
  await expect(page.getByRole('heading', { name: 'Lab을 찾을 수 없습니다' })).toBeVisible();
  await page.getByRole('link', { name: '9개 Lab 목차 보기' }).click();
  const index = page.locator('.b32-result-index');
  await expect(index.locator(':scope > li')).toHaveCount(19);
  await expect(index.getByText('AI API 요청 횟수: 0', { exact: true })).toBeVisible();
  await expect(index.getByText(' M README.md', { exact: false }).first()).toBeVisible();
  const badRequest = index.locator('li').filter({ hasText: 'AI API 응답 오류 (HTTP 400).' });
  await badRequest.getByRole('link', { name: 'Lab 07 · 문제 해결' }).click();
  await expect(page.locator('#c')).toHaveAttribute('open');
  await expect(page.locator('#results')).not.toHaveAttribute('open');
  await expect(page.locator('#c')).toContainText('정확히 어떤 문자가 들어 있었는지는 확인하지 못했습니다');
  await page.goBack();
  const success = index.locator('li').filter({ hasText: 'HTTP/2 200' });
  await success.getByRole('link', { name: 'Lab 07 · 추가 탐구' }).click();
  await expect(page.locator('#b')).toHaveAttribute('open');
  await expect(page.locator('#b')).toContainText('COMMIT·PR 응답 아님');
  await page.goBack();
  await index.locator('li').filter({ hasText: 'choices[0].message.content' }).getByRole('link', { name: 'Lab 08 · 실행 기록' }).click();
  await expect(page.locator('#results')).toHaveAttribute('open');
  await expect(page.locator('#results')).toContainText('초안 요청의 원본 응답은 확보하지 않았습니다');
  await expect(page.locator('#results [data-diagram="lab-d04-api-request-response"]')).toContainText('최소 연결 테스트');
});

const roundTrips = [
  ['K1', 'S1-1', '08'], ['K2', 'S1-2', '03'], ['K3', 'S2-1', '04'], ['K4', 'S2-2', '02'],
  ['K5', 'S2-2', '04'], ['K6', 'S3-1', '05'], ['K7', 'S3-2', '06'], ['K8', 'S3-2', '07'],
  ['K9', 'S3-2', '08'], ['K10', 'S4-1', '08'], ['K11', 'S4-2', '09'],
] as const;

test('K1–K11 each link to the correct observation, figure focus and follow-up question', async ({ page }) => {
  for (const [card, screen, id] of roundTrips) {
    await page.goto(storyUrl(screen));
    const slide = page.locator(`.b32-lesson[data-screen="${screen}"]`);
    const note = slide.getByRole('complementary', { name: '실습 복귀 안내' });
    await expect(note).toHaveCount(0);
    await slide.getByRole('link', { name: new RegExp(`^Lab ${id}`) }).click();
    await expect(page).toHaveURL(new RegExp(`/lab/${id}\\?from=${screen}$`));
    await expect(page.locator(`.b32-lab-question[data-round-trip="${card}"]`)).toBeVisible();
    await page.locator('.b32-lab-back').click();
    await expect(page).toHaveURL(new RegExp(`scene=${screen[1]}&screen=${screen[3]}&from-lab=${id}$`));
    await expect(note).toHaveAttribute('data-round-trip', card);
    await expect(note.locator('.b32-return-question')).toBeVisible();
    await note.locator('summary').click();
    await expect(note.getByText('확인 질문', { exact: true })).toBeVisible();
    await expect(note.locator('details a').first()).toBeVisible();
    await note.getByRole('button', { name: '안내 닫기' }).click();
    await expect(note).toHaveCount(0);
  }
  await page.goto(`/#${story}`);
  await page.getByRole('link', { name: /Lab 01 · 연습 저장소/ }).click();
  await expect(page.locator('.b32-lab-back')).toHaveText(/강의 소개로 돌아가기/);
  await page.locator('.b32-lab-back').click();
  await expect(page.getByRole('complementary', { name: '실습 복귀 안내' })).toBeVisible();
});

test('origin and return context survive reload and history, and invalid parameters recover', async ({ page }) => {
  await page.goto(storyUrl('S1-2'));
  await page.getByRole('link', { name: /두 가지 diff의 차이/ }).click();
  await page.locator('#results summary').click();
  const observation = page.getByRole('checkbox').first();
  await observation.check();
  await page.reload();
  await expect(observation).not.toBeChecked();
  await expect(page.locator('#results')).not.toHaveAttribute('open');
  await page.locator('.b32-lab-back').click();
  await page.reload();
  await expect(page.locator('[data-round-trip="K2"]')).toContainText('두 종류의 diff');
  await page.goBack();
  await expect(page.locator('.b32-lab-back')).toHaveText(/S1-2/);
  await page.goBack();
  await expect(page.locator('.b32-return-note')).toHaveCount(0);
  for (const params of ['?from=S5-8', '?from=S3-2', '?from=S3-1&from=S1-2', '?from=https://example.test']) {
    await page.goto(`/#${lab}/03${params}`);
    await expect(page.locator('.b32-lab-back')).toHaveText(/S1-2/);
  }
  await page.goto(storyUrl('S1-2', '&from-lab=99'));
  await expect(page).toHaveURL(/scene=1&screen=2$/);
  await expect(page.locator('.b32-return-note')).toHaveCount(0);
  await page.goto(`/#${lab}/08?from=S3-2`);
  await page.locator('.b32-lab-page a').filter({ hasText: /^json-request-response$/ }).click();
  await page.getByRole('link', { name: /Lab의 이전 화면/ }).click();
  await expect(page).toHaveURL(/lab\/08\?from=S3-2$/);
});

test('copies exact guarded and heredoc commands with clipboard feedback', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const [id, kind, marker] of [['03', 'zsh', 'grep -qxF'], ['04', 'bash', "python3 - <<'EOF'"]] as const) {
    const section = guide.split(`## Lab ${id}.`)[1].split('### B.')[0];
    const expected = [...section.matchAll(new RegExp('^\x60\x60\x60' + kind + '\\n([\\s\\S]*?)\\n\x60\x60\x60$', 'gm'))]
      .find(match => match[1].includes(marker))![1];
    await page.goto(`/#${lab}/${id}`);
    const block = page.locator('.b32-lab-command').filter({ hasText: marker });
    await expect(block.getByRole('button', { name: '명령 블록 복사' })).toBeVisible();
    await block.getByRole('button').click();
    await expect(block.getByRole('status')).toHaveText('복사했습니다.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  }
  await context.close();
});

test('all six diagrams and their teaching states distinguish output, evidence and API costs', async ({ page }) => {
  const runs = [
    ['03', '01', 'add 이후', 'after', '같음 → 출력 없음'],
    ['04', '02', '저장소 밖', 'out', 'result.returncode = 128'],
    ['06', '03', '전체', 'all', 'user 메시지 == Git 문맥: True'],
    ['07', '04', '전체', 'all', 'COMMIT·PR 응답 아님'],
    ['08', '05', '', 'all', 'README에 실습 메모 문장 추가'],
    ['09', '06', '터미널에서 보기', 'terminal', 'AI API 요청 횟수: 0'],
  ];
  for (const [lesson, diagram, button, state, value] of runs) {
    await page.goto(`/#${lab}/${lesson}`);
    await page.locator('#results summary').click();
    const figure = page.locator(`figure[data-diagram^="lab-d${diagram}-"]`);
    if (button) {
      await figure.getByRole('button', { name: button, exact: true }).focus();
      await page.keyboard.press('Enter');
      await expect(figure.getByRole('button', { name: button, exact: true })).toHaveAttribute('aria-pressed', 'true');
    }
    await expect(figure).toHaveAttribute('data-state', state);
    await expect(figure).toContainText(value);
  }
  await page.goto(`/#${lab}/02`);
  await expect(page.locator('.b32-lab-command').filter({ hasText: '실제 API를 1회 호출합니다' })).toHaveCount(0);
  await page.goto(`/#${lab}/07`);
  await expect(page.locator('.b32-lab-core .b32-lab-command').filter({ hasText: '실제 API를 1회 호출합니다' })).toHaveCount(1);
  await expect(page.locator('input:not([type=checkbox]),textarea,[contenteditable=true]')).toHaveCount(0);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
});

test('review P panel, old presenter notes and glossary return remain reachable', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto(storyUrl('S3-2', '&from-lab=06'));
  const pane = page.locator('#b32-slide-explanation');
  await expect(page.locator('.b32-lesson')).toBeVisible();
  await expect(pane).toBeHidden();
  await page.keyboard.press('p');
  await expect(pane).toBeVisible();
  await expect(pane).toContainText('그 밖의 HTTP 오류(예: 400)');
  const figure = page.locator('.b32-lesson > .b32-figure svg');
  await expect(figure).toContainText('535자');
  await expect(figure).not.toContainText('안녕하세요');
  const [art, panel] = await Promise.all([figure.boundingBox(), pane.boundingBox()]);
  expect(art!.x + art!.width).toBeLessThanOrEqual(panel!.x);
  await page.keyboard.press('Escape');
  await expect(pane).toBeHidden();
  await expect(page.getByRole('button', { name: '설명 보기' })).toBeFocused();
  await page.goto(storyUrl('S4-1'));
  await page.getByText('실제 COMMIT·PR 출력 전문', { exact: true }).click();
  await expect(page.locator('.b32-review').getByText('실제 실행 · 2026-11-25 Owner')).toBeVisible();
  await page.getByText('이전 실행 사례 · Windows · 2026-10-20', { exact: true }).click();
  await expect(page.locator('.b32-review').getByText(/학습 문서에 실습 메모 추가:/).first()).toBeVisible();
  await page.getByText('관련 용어사전 · 학습가이드', { exact: true }).click();
  await page.locator('.b32-links a[href*="b32-story"]').first().click();
  await page.getByRole('link', { name: /스토리의 이전 화면/ }).click();
  await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', 'S4-1');
});

for (const [width, height] of [[1280, 720], [1000, 800], [640, 844], [390, 844], [360, 800]]) {
  for (const theme of ['dark', 'light']) {
    test(`visual QA at ${width}px in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript(theme => localStorage.setItem('codyssey-presentation-theme', theme), theme);
      const errors: string[] = [];
      page.on('pageerror', err => errors.push(err.message));
      const visit = async (path: string) => {
        await page.goto(path);
        await expect(page.locator('.mission-presentation').first()).toHaveAttribute('data-presentation-theme', theme);
        await page.evaluate(() => document.fonts.ready);
        await checkViewport(page);
      };
      await visit(`/#${lab}`);
      if (output && width === 1280) await page.screenshot({ path: `${output}/${width}-${theme}-index.png` });
      await visit(`/#${lab}/03?from=S1-2`);
      await page.locator('#results summary').click();
      const areas = page.locator('[data-diagram="lab-d01-git-areas"]');
      await areas.getByRole('button', { name: 'add 이후', exact: true }).click();
      await checkViewport(page);
      if (output) await areas.screenshot({ path: `${output}/${width}-${theme}-lab03.png` });
      if (width < 600) {
        await page.getByText('PC에서 실습 · 실행 명령', { exact: true }).click();
        const pre = page.locator('.b32-lab-command pre').first();
        expect(await pre.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
        await checkViewport(page);
      }
      for (const id of new Set(roundTrips.map(([, screen]) => screen))) {
        await visit(storyUrl(id));
        await expect(page.locator('.b32-lesson > .b32-figure svg')).toHaveCount(1);
      }
      if (output && width === 1280 && theme === 'dark') {
        await visit(`/#${lab}/07?from=S3-2`);
        await page.screenshot({ path: `${output}/1280-dark-lab07.png` });
      }
      if (output && width === 390 && theme === 'light') {
        await visit(`/#${lab}/08?from=S3-2#results`);
        await page.locator('[data-diagram="lab-d04-api-request-response"]').screenshot({
          path: `${output}/390-light-lab08-response.png`,
        });
      }
      await visit(storyUrl('S1-2', '&from-lab=03'));
      await page.getByRole('button', { name: '설명 보기' }).click();
      await expect(page.locator('#b32-slide-explanation')).toBeVisible();
      await checkViewport(page);
      if (width < 1240) {
        const figure = await page.locator('.b32-lesson > .b32-figure svg').boundingBox();
        const panel = await page.locator('#b32-slide-explanation').boundingBox();
        expect(figure!.y + figure!.height).toBeLessThan(panel!.y);
      }
      if (output && (width === 1280 || width === 1000)) {
        await page.screenshot({ path: `${output}/${width}-${theme}-story-return-p.png`, fullPage: width === 1000 });
      }
      expect(errors).toEqual([]);
    });
  }
}
