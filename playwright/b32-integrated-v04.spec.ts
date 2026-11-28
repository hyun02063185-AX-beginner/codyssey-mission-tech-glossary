import { mkdirSync, readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { parseStoryboardV04 } from '../src/b32Story/parseStoryboardV04';

test.skip(process.env.B32_V04 !== '1', 'Run with B32_V04=1 for the integrated review edition.');

const story = '/#/missions/main-M06/story';
const lab = '/#/missions/main-M06/lab';
const source = readFileSync('content/mission-stories/main-m06/storyboard-v0.4.md', 'utf8');
const { intro, screens } = parseStoryboardV04(source);
const screenshotDir = process.env.B32_V04_QA_OUTPUT;
if (screenshotDir && process.env.B32_V04 === '1') mkdirSync(screenshotDir, { recursive: true });

function storyUrl(id: string, suffix = '') {
  const [scene, screen] = id.slice(1).split('-');
  return `${story}?scene=${scene}&screen=${screen}${suffix}`;
}

const slide = (page: Page) => page.locator('.b32-lesson');
const slideTitle = (page: Page) => slide(page).getByRole('heading', { level: 1 });
const topControls = (page: Page) => page.getByRole('navigation', { name: '슬라이드 상단 탐색' });
const pButton = (page: Page) => topControls(page).getByRole('button', { name: /설명 (보기|닫기)/ });
const explanation = (page: Page) => page.locator('#b32-slide-explanation');

async function direct(page: Page, id: string) {
  await page.goto(storyUrl(id));
  await expect(slide(page)).toHaveAttribute('data-screen', id);
}

async function noPageOverflow(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  const width = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: document.documentElement.clientWidth }));
  expect(width.scroll).toBeLessThanOrEqual(width.viewport);
}

test.beforeEach(async ({ page, baseURL }) => {
  await page.route('**/*', route => route.request().url().startsWith(`${baseURL}/`) ? route.continue() : route.abort());
});

test('인트로와 31화면의 직접 주소에서 원고 제목, 핵심 메시지, 순서를 표시한다', async ({ page }) => {
  await page.goto(story);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`B3-2 — ${intro.title}`);
  await expect(page.getByRole('navigation', { name: 'Scene 목차' }).getByRole('link')).toHaveCount(6);
  await page.getByText('학습 목표와 강의 흐름', { exact: true }).click();
  await expect(page.locator('.mission-story-orientation ol li')).toHaveCount(5);
  await expect(page.locator('.b32-intro-figure svg[data-state="all"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Lab 목차' })).toHaveAttribute('href', /main-M06\/lab$/);
  await expect(page.getByRole('link', { name: '결과로 찾아보기' })).toHaveAttribute('href', /lab#/);
  await page.getByRole('link', { name: '강의 시작하기' }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S1-1');

  for (const [index, screen] of screens.entries()) {
    await direct(page, screen.id);
    await expect(page).toHaveTitle(`${screen.id} · ${screen.title}`);
    await expect(slideTitle(page)).toHaveText(screen.message.replaceAll('`', ''));
    await expect(page.locator('[data-b32-integrated] del')).toHaveCount(0);
    await expect(topControls(page).getByLabel('현재 슬라이드')).toHaveText(`${index + 1} / 31`);
    await expect(slide(page).getByLabel('화면 근거').getByRole('listitem')).toHaveCount(screen.badges.length);
    if (screen.figure.kind === 'svg') {
      await expect(slide(page).locator(`.b32-figure svg[data-state="${screen.figure.state}"]`)).toHaveCount(1);
    }
  }
});

test('이전·다음, 키보드, Scene 선택, 관점 띠를 통해 이동한다', async ({ page }) => {
  await direct(page, 'S1-1');
  await expect(topControls(page).getByRole('button', { name: '이전', exact: true })).toBeDisabled();
  await topControls(page).getByRole('button', { name: '다음', exact: true }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S1-2');
  await topControls(page).getByRole('button', { name: '이전', exact: true }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S1-1');
  for (const [key, id] of [['ArrowRight', 'S1-2'], ['PageDown', 'S1-3'], ['ArrowLeft', 'S1-2'], ['PageUp', 'S1-1']]) {
    await slideTitle(page).focus();
    await page.keyboard.press(key);
    await expect(slide(page)).toHaveAttribute('data-screen', id);
  }
  await page.getByRole('combobox', { name: 'Scene 선택' }).selectOption('5');
  await expect(slide(page)).toHaveAttribute('data-screen', 'S5-1');
  const perspectives = page.getByRole('navigation', { name: 'Scene 관점' });
  await expect(perspectives.getByRole('link', { name: /Scene 5/ })).toHaveAttribute('aria-current', 'step');
  await perspectives.getByRole('link', { name: /Scene 6/ }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S6-1');
});

for (const [width, height] of [[1280, 720], [1000, 800], [390, 844]]) {
  test(`P 패널 배치와 열기·닫기 초점 ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await direct(page, 'S3-3');
    await slideTitle(page).focus();
    await page.keyboard.press('p');
    await expect(explanation(page)).toBeVisible();
    await expect(explanation(page).getByRole('heading')).toBeFocused();
    await expect(pButton(page)).toHaveAttribute('aria-expanded', 'true');
    const panel = (await explanation(page).boundingBox())!;
    const lesson = (await slide(page).boundingBox())!;
    if (width >= 1240) expect(panel.x).toBeGreaterThanOrEqual(lesson.x + lesson.width);
    else expect(panel.y).toBeGreaterThanOrEqual(lesson.y + lesson.height);
    await page.keyboard.press('Escape');
    await expect(explanation(page)).toBeHidden();
    await expect(pButton(page)).toBeFocused();
    await pButton(page).click();
    await explanation(page).getByRole('button', { name: '화면 해설 닫기' }).click();
    await expect(pButton(page)).toBeFocused();
  });
}

test('강의 Dark/Light 선택을 기존 키에 저장하고 다시 읽는다', async ({ page }) => {
  await direct(page, 'S4-5');
  const surface = page.locator('.mission-presentation');
  await expect(surface).toHaveAttribute('data-presentation-theme', 'dark');
  await page.getByText('학습자료', { exact: true }).click();
  await page.getByRole('combobox', { name: '강의 화면 테마' }).selectOption('light');
  await expect(surface).toHaveAttribute('data-presentation-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('codyssey-presentation-theme'))).toBe('light');
  await page.reload();
  await expect(surface).toHaveAttribute('data-presentation-theme', 'light');
});

test('실습 명령 복사 결과를 원고와 대조하고 실행 결과에는 복사 버튼을 제공하지 않는다', async ({ context, page, baseURL }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: baseURL });
  for (const screen of screens.filter(item => item.practice)) {
    await direct(page, screen.id);
    const blocks = page.getByRole('region', { name: '함께 실습' });
    await blocks.getByRole('button', { name: '명령 블록 복사' }).click();
    await expect(blocks.locator('[aria-live="polite"].b32-lab-copy-status')).toHaveText('복사했습니다.');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(screen.practice!.command);
    await expect(blocks.locator('.b32-lab-code:not(.b32-lab-command) button')).toHaveCount(0);
  }
  await direct(page, 'S5-1');
  await expect(page.getByRole('region', { name: '실습 결과' }).locator('pre')).toContainText('## Why');
  await expect(page.getByRole('region', { name: '실습 결과' }).getByRole('button')).toHaveCount(0);
});

const interactions: { id: string; screen: string; controls: [string, string][] }[] = [
  { id: 'I1', screen: 'S2-1', controls: [['git add', 'add'], ['git commit', 'commit'], ['git push', 'push'], ['처음부터', 'edit']] },
  { id: 'I2', screen: 'S2-3', controls: [['add 이후', 'after'], ['양쪽에 나뉜 변경', 'mm'], ['add 이전', 'before']] },
  { id: 'I3', screen: 'S3-2', controls: [['파이프로 읽기', 'pipe'], ['프로세스 시작', 'launch']] },
  { id: 'I4', screen: 'S3-4', controls: [['①만', 'direct'], ['②만', 'capture'], ['나란히', 'compare']] },
  { id: 'I5', screen: 'S3-5', controls: [['B3-2 프로그램', 'program'], ['HTTP·응답 오류', 'http'], ['Git 프로세스', 'git']] },
  { id: 'I6', screen: 'S3-6', controls: [['전처리', 'prepare'], ['수집', 'collect']] },
  { id: 'I7', screen: 'S4-2', controls: [['요청 본문', 'body'], ['선택 파라미터', 'params'], ['응답 본문', 'response'], ['인증 헤더', 'key']] },
  { id: 'I8', screen: 'S4-3', controls: [['pr', 'pr'], ['commit', 'commit']] },
  { id: 'I9', screen: 'S5-3', controls: [['pr', 'pr'], ['commit', 'commit']] },
  { id: 'I10', screen: 'S1-4', controls: [['주체별 역할', 'roles'], ['데이터의 모습', 'pipeline'], ['전체 흐름', 'overview']] },
];

for (const { id, screen, controls } of interactions) {
  test(`${id}의 상태와 접근성 표시가 버튼 선택을 따른다`, async ({ page }) => {
    await direct(page, screen);
    const diagram = page.locator(`[data-diagram="${id}"]`);
    await expect(diagram).toContainText('교육용 시뮬레이션 · 실제 실행 기록이 아닙니다');
    for (const [label, state] of controls) {
      const button = diagram.getByRole('group', { name: '도식 보기 선택' }).getByRole('button', { name: label, exact: true });
      await button.focus();
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(diagram).toHaveAttribute('data-state', state);
    }
  });
}

test('단계, 전처리 중단, JSON 생략, 프롬프트 강조, 기록된 후처리를 확인한다', async ({ page }) => {
  await direct(page, 'S3-3');
  const process = page.locator('[data-diagram="I3"]');
  await expect(process.locator('[data-step]')).toHaveAttribute('data-step', '3');
  await expect(process.getByRole('group', { name: 'stdout 경로' })).toContainText('운영체제가 연결');
  await expect(process.getByRole('group', { name: 'stderr 경로' })).toContainText('운영체제가 연결');
  await process.getByRole('button', { name: '다음 단계' }).click();
  await expect(process.locator('[data-step]')).toHaveAttribute('data-step', '4');
  await expect(process.getByRole('group', { name: 'stdout 경로' })).toContainText("result.stdout = ' M README.md\\n'");
  await expect(process.getByRole('group', { name: 'stderr 경로' })).toContainText("result.stderr = ''");
  for (let i = 0; i < 2; i++) await process.getByRole('button', { name: '다음 단계' }).click();
  await expect(process.getByRole('group', { name: '종료 코드 경로' })).toContainText('result.returncode = 0');

  await direct(page, 'S3-6');
  const context = page.locator('[data-diagram="I6"]');
  for (let i = 0; i < 3; i++) await context.getByRole('button', { name: '다음 단계' }).click();
  await expect(context.getByText('files', { exact: true }).locator('..')).toContainText("['README.md']");
  await expect(context.getByText('untracked_files', { exact: true }).locator('..')).toContainText('[]');
  await context.getByRole('button', { name: '전처리' }).click();
  await context.getByRole('button', { name: '.env 예' }).click();
  await expect(context.locator('[aria-live="polite"]')).toContainText('준비 중단 · 요청 0회');

  await direct(page, 'S4-5');
  const parameters = page.locator('[data-diagram="I7"]');
  const json = parameters.locator('pre').first();
  await expect(json).not.toContainText('"temperature"');
  await expect(json).not.toContainText('"max_tokens"');
  const temperature = parameters.getByRole('slider', { name: 'temperature' });
  const maxTokens = parameters.getByRole('combobox', { name: 'max_tokens' });
  await expect(temperature).toBeDisabled();
  await expect(maxTokens).toBeDisabled();
  await parameters.getByRole('checkbox', { name: 'temperature 사용' }).check();
  await parameters.getByRole('checkbox', { name: 'max_tokens 사용' }).check();
  await expect(temperature).toBeEnabled();
  await maxTokens.selectOption('20');
  await expect(json).toContainText('"temperature": 0.2');
  await expect(json).toContainText('"max_tokens": 20');
  await expect(parameters).toContainText('코디세이 지원 미확인');
  await parameters.getByRole('checkbox', { name: 'temperature 사용' }).uncheck();
  await expect(json).not.toContainText('"temperature"');
  await expect(temperature).toBeDisabled();

  await direct(page, 'S4-3');
  const prompt = page.locator('[data-diagram="I8"]');
  await prompt.getByRole('button', { name: /제목 최대 72자/ }).click();
  await expect(prompt.locator('mark')).toContainText('prefer 50');
  await prompt.getByRole('button', { name: /본문이 있으면/ }).click();
  await expect(prompt).toContainText('프롬프트에 없음 · 검증기에도 없음');

  await direct(page, 'S5-3');
  const validator = page.locator('[data-diagram="I9"]');
  await validator.getByRole('button', { name: /^C6 ·/ }).click();
  await expect(validator).toContainText('검증기에 그 규칙이 없어 통과(G4)');
  await validator.getByRole('button', { name: 'pr', exact: true }).click();
  const comparison = validator.getByRole('group', { name: 'How to Test 교체 전후' });
  await expect(comparison.locator('pre').nth(0)).toContainText('- 테스트를 모두 통과했습니다');
  await expect(comparison.locator('pre').nth(1)).toContainText('- 실행 권장: python -m unittest discover -s tests');
  await validator.getByRole('button', { name: /^P2 ·/ }).click();
  await expect(validator).toContainText('거부: PR 제목 또는 필수 섹션');

  await direct(page, 'S1-4');
  const overview = page.locator('[data-diagram="I10"]');
  await expect(overview).toContainText('명령줄 글자 → args.command');
  await overview.getByRole('button', { name: '다음 단계' }).click();
  await expect(overview).toContainText('Git 출력 → Git 문맥');
  await expect(overview.locator('.b32-integrated-lanes [data-selected]')).toHaveCount(2);

  await direct(page, 'S6-2');
  const pipeline = page.locator('[data-diagram="I10"]');
  for (let i = 0; i < 2; i++) await pipeline.getByRole('button', { name: '다음 단계' }).click();
  await expect(pipeline.locator('.b32-integrated-lanes [data-selected]')).toHaveText('Python');
  for (let i = 0; i < 4; i++) await pipeline.getByRole('button', { name: '다음 단계' }).click();
  await expect(pipeline).toContainText('여기서 처음 내 컴퓨터 밖으로');
  await pipeline.getByRole('button', { name: '다음 단계' }).click();
  await expect(pipeline.locator('.b32-integrated-lanes [data-selected]')).toHaveText(['Python', '외부 AI']);
  await expect(pipeline).toContainText('외부 AI → Python');
});

test('화면·Lab·용어사전 간 복귀가 새로고침과 뒤로 가기 후에도 이어진다', async ({ page }) => {
  await direct(page, 'S3-7');
  await pButton(page).click();
  await explanation(page).getByRole('link', { name: '상세 참고 · Lab 05' }).click();
  await expect(page).toHaveURL(/lab\/05\?from=S3-7$/);
  await expect(page.locator('[data-round-trip]')).toHaveCount(0);
  const storyRoutes = page.locator('a[href*="/missions/main-M06/story"]');
  await expect(storyRoutes).toHaveCount(1);
  await page.reload();
  await page.getByRole('link', { name: /스토리 S3-7으로 돌아가기/ }).click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S3-7');
  await expect(page).toHaveURL(/scene=3&screen=7&from-lab=05$/);
  await expect(slide(page).getByRole('status')).toHaveText('Lab 05에서 돌아왔습니다');
  await page.reload();
  await expect(slide(page).getByRole('status')).toHaveText('Lab 05에서 돌아왔습니다');
  await page.getByRole('button', { name: '복귀 안내 닫기' }).click();
  await expect(page).toHaveURL(/scene=3&screen=7$/);
  await page.goBack();
  await expect(page).toHaveURL(/lab\/05\?from=S3-7$/);

  await direct(page, 'S6-3');
  await page.getByText('관련 용어사전 · 학습가이드', { exact: true }).click();
  await page.getByRole('link', { name: 'ai-api · 용어사전', exact: true }).click();
  await page.getByRole('navigation', { name: 'B3-2 학습으로 복귀' }).getByRole('link').click();
  await expect(slide(page)).toHaveAttribute('data-screen', 'S6-3');

  await direct(page, 'S1-3');
  await pButton(page).click();
  const reading = explanation(page).getByRole('link', { name: 'Lab 07', exact: true });
  await expect(reading).toHaveAttribute('href', /lab\/07\?from=S1-3$/);
});

test('잘못된 주소를 복구하고 유효하지 않은 Lab 출발점은 일반 진입으로 처리한다', async ({ page }) => {
  for (const [query, id] of [
    ['scene=6&screen=99', 'S6-1'], ['scene=99&screen=2', 'S1-1'],
    ['scene=6&scene=5&screen=3', 'S6-3'], ['scene=6&screen=3&from-lab=05&from-lab=09', 'S6-3'],
    [`scene=6&screen=3&padding=${'a'.repeat(1024)}`, 'S6-3'],
  ]) {
    await page.goto(`${story}?${query}`);
    await expect(slide(page)).toHaveAttribute('data-screen', id);
    await expect(slide(page).getByRole('status')).toContainText('잘못된 강의 주소를 복구했습니다');
    await expect(page).toHaveURL(new RegExp(`scene=${id[1]}&screen=${id[3]}$`));
  }
  for (const query of ['from=S6-7', 'from=S6-3&from=S1-1']) {
    await page.goto(`${lab}/03?${query}`);
    await expect(page.locator('.b32-lab-kicker')).toHaveText('B3-2 · Lab 03');
    await expect(page.locator('a[href*="/missions/main-M06/story"]')).toHaveCount(0);
  }
});

test('Lab 01–09와 결과 목차에서 직접 실습 구획을 연다', async ({ page }) => {
  for (let n = 1; n <= 9; n++) {
    const id = String(n).padStart(2, '0');
    await page.goto(`${lab}/${id}`);
    await expect(page.locator('.b32-lab-kicker')).toHaveText(`B3-2 · Lab ${id}`);
    await expect(page.getByRole('heading', { name: 'A. 핵심 실습' })).toBeVisible();
    await expect(page.locator('a[href*="/missions/main-M06/story"]')).toHaveCount(0);
    await expect(page.locator('.b32-lab del')).toHaveCount(0);
  }
  await page.goto(`${lab}#결과로-찾아보기`);
  await expect(page.locator('.b32-lab-index li')).toHaveCount(9);
  const index = page.locator('.b32-result-index');
  await expect(index.getByRole('link', { name: /스토리 S/ })).toHaveCount(0);
  await index.getByRole('link', { name: 'Lab 02 · 실행 기록' }).first().click();
  await expect(page).toHaveURL(/lab\/02#results$/);
  await expect(page.locator('details#results')).toHaveAttribute('open', '');
});

for (const [width, height] of [[1280, 720], [1000, 800], [390, 844], [360, 800]]) {
  for (const theme of ['dark', 'light']) {
    test(`${width}×${height} ${theme} 레이아웃과 가로 넘침`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.addInitScript(theme => localStorage.setItem('codyssey-presentation-theme', theme), theme);
      const ids = width <= 390 ? screens.map(screen => screen.id) : ['S1-1', 'S2-2', 'S2-3', 'S4-5', 'S6-3'];
      await page.goto(story);
      await expect(page.getByRole('navigation', { name: 'Scene 목차' })).toBeVisible();
      await noPageOverflow(page);
      for (const id of ids) {
        await direct(page, id);
        await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme', theme);
        await noPageOverflow(page);
        if (id === 'S4-5') {
          await page.getByRole('button', { name: '범위 밖 입력 예시' }).click();
          await noPageOverflow(page);
        }
        if (width <= 390 && id === 'S2-2') {
          const command = slide(page).locator('.b32-lab-command pre');
          expect(await command.evaluate(el => el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX === 'auto')).toBe(true);
        }
        if (width <= 390 && id === 'S6-3') {
          const table = slide(page).locator('.b32-lab-table-scroll');
          expect(await table.evaluate(el => el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX === 'auto')).toBe(true);
        }
      }
      await direct(page, 'S2-3');
      await pButton(page).click();
      await noPageOverflow(page);
      if (screenshotDir) await page.screenshot({ path: `${screenshotDir}/${width}-${theme}-S2-3.png` });
    });
  }
}
