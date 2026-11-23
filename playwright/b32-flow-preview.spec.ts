import { expect, test, type Page } from '@playwright/test';
import { join } from 'node:path';

const story = '/#/missions/main-M06/story';
const preview = `${story}/flow-preview`;
const stages = [
  ['command', '명령 입력', ['S1-1', 'S2-1']],
  ['git', 'Git 변경 수집', ['S1-2']],
  ['changes', '변경 확인', ['S2-2']],
  ['security', '보안 검사', ['S3-1']],
  ['api', 'AI 요청·응답', ['S3-2']],
  ['draft', '초안 검증·활용', ['S4-1', 'S4-2']],
] as const;
const viewports = [
  { width: 1280, height: 720 },
  { width: 1000, height: 720 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
];

function stageButtons(page: Page) {
  return page.locator('.b32-flow-stages button');
}

async function coordinates(page: Page) {
  return stageButtons(page).evaluateAll(buttons => buttons.map(button => {
    const { x, y, width, height } = button.getBoundingClientRect();
    return [x + scrollX, y + scrollY, width, height];
  }));
}

async function expectNoHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
}

for (const viewport of viewports) {
  for (const theme of ['dark', 'light']) {
    test.describe(`${viewport.width}×${viewport.height} ${theme}`, () => {
      const mobile = viewport.width < 600;
      test.use({ viewport, hasTouch: mobile, isMobile: mobile });

      test('keeps the six stages in place, opens details and expands the exception branches', async ({ page }) => {
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.emulateMedia({ colorScheme: theme === 'dark' ? 'light' : 'dark' });
        await page.goto(preview);
        const presentation = page.locator('.mission-presentation');
        await expect(presentation).toHaveAttribute('data-presentation-theme', 'dark');
        await page.locator('.learning-focus-menu summary').click();
        await page.getByLabel('강의 화면 테마', { exact: true }).selectOption(theme);
        await page.keyboard.press('Escape');
        await page.locator('.learning-focus-menu summary').blur();
        await expect(presentation).toHaveAttribute('data-presentation-theme', theme);
        await expect(stageButtons(page)).toHaveCount(6);
        await expect(page.locator('[aria-current=step]')).toHaveCount(0);
        await expect(page.locator('.b32-flow-exceptions')).not.toHaveAttribute('open', '');
        await page.evaluate(() => document.fonts.ready);
        const originalCoordinates = await coordinates(page);
        for (const [, , width, height] of originalCoordinates) {
          expect(width).toBeGreaterThanOrEqual(44);
          expect(height).toBeGreaterThanOrEqual(44);
        }
        const exceptionToggle = page.locator('.b32-flow-exceptions summary');
        const exceptionBox = (await exceptionToggle.boundingBox())!;
        expect(exceptionBox.y + exceptionBox.height).toBeLessThanOrEqual(viewport.height);
        await expectNoHorizontalOverflow(page);

        const output = process.env.B32_FLOW_QA_OUTPUT;
        if (output) await page.screenshot({ path: join(output, `${viewport.width}-${theme}-overview.png`) });

        const security = stageButtons(page).nth(3);
        if (mobile) await security.tap();
        else await security.click();
        await expect(security).toHaveAttribute('aria-current', 'step');
        await expect(page.locator('[aria-current=step]')).toHaveCount(1);
        const detail = page.getByRole('region', { name: '4. 보안 검사' });
        await expect(detail.getByRole('heading')).toBeFocused();
        await expect(detail).toContainText('16,000자 제한은 적용됩니다');
        await expect(detail.getByRole('link', { name: 'prepare_context()' })).toHaveAttribute('href', /security\.py#L21$/);
        expect(await coordinates(page)).toEqual(originalCoordinates);
        await expectNoHorizontalOverflow(page);
        if (output) {
          await page.screenshot({
            path: join(output, `${viewport.width}-${theme}-selected.png`),
            fullPage: true,
          });
        }

        await page.reload();
        await expect(presentation).toHaveAttribute('data-presentation-theme', theme);
        await expect(security).toHaveAttribute('aria-current', 'step');
        if (mobile) await exceptionToggle.tap();
        else await exceptionToggle.click();
        const branches = page.locator('.b32-flow-exceptions li');
        await expect(branches).toHaveCount(4);
        await expect(branches.nth(0)).toContainText('변경 없음');
        await expect(branches.nth(0)).toContainText('AI 요청 횟수는 0');
        await expect(branches.nth(1)).toContainText('보안 차단');
        await expect(branches.nth(2)).toContainText('API 오류');
        await expect(branches.nth(3)).toContainText('형식 검증 실패');
        await expectNoHorizontalOverflow(page);

        await page.getByRole('button', { name: '전체 흐름으로' }).click();
        await expect(page).toHaveURL(new RegExp(preview + '$'));
        await expect(page.locator('[aria-current=step]')).toHaveCount(0);
        await expect(page.getByRole('heading', { name: '전체 실행 흐름' })).toBeFocused();
        expect(errors).toEqual([]);
      });
    });
  }
}

test('connects the six steps to the unchanged eight slide URLs and restores the review state on Back', async ({ page }) => {
  await page.goto(preview);
  for (const [id, title, slides] of stages) {
    await page.getByRole('button', { name: new RegExp(title) }).click();
    const links = page.getByRole('navigation', { name: '연결된 기존 슬라이드' }).getByRole('link');
    await expect(links).toHaveCount(slides.length);
    for (const slide of slides) {
      const [scene, screen] = slide.slice(1).split('-');
      const link = links.filter({ hasText: slide });
      await expect(link).toHaveAttribute('href', `${story}?scene=${scene}&screen=${screen}`.slice(1));
      await link.click();
      await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', slide);
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`flow-preview\\?step=${id}$`));
      await expect(page.getByRole('button', { name: new RegExp(title) })).toHaveAttribute('aria-current', 'step');
    }
  }
  await page.getByRole('link', { name: '기존 강의 소개' }).click();
  await expect(page.locator('.mission-story-overview')).toBeVisible();
  await expect(page.getByRole('link', { name: /실행 흐름|미리보기/ })).toHaveCount(0);
});

test('supports keyboard-only lecture navigation, free exploration and deep links', async ({ page }) => {
  await page.goto(`${preview}?step=invalid`);
  await expect(page.locator('[aria-current=step]')).toHaveCount(0);
  const start = page.getByRole('button', { name: '순서대로 보기' });
  await start.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: '1. 명령 입력' })).toBeFocused();
  const next = page.getByRole('button', { name: '다음 단계' });
  const previous = page.getByRole('button', { name: '이전 단계' });
  await expect(previous).toBeDisabled();
  for (const [index, [id, title]] of stages.entries()) {
    await expect(page).toHaveURL(new RegExp(`mode=lecture&step=${id}$`));
    await expect(page.getByRole('heading', { name: `${index + 1}. ${title}` })).toBeFocused();
    await expect(stageButtons(page).filter({ has: page.locator('.b32-flow-stage-title', { hasText: title }) })).toHaveAttribute('aria-current', 'step');
    if (index < stages.length - 1) {
      await next.focus();
      await page.keyboard.press('Enter');
    }
  }
  await expect(next).toBeDisabled();
  await previous.focus();
  await page.keyboard.press('Space');
  await expect(page.getByRole('heading', { name: '5. AI 요청·응답' })).toBeFocused();

  await page.goto(`${preview}?mode=lecture&step=api`);
  await expect(stageButtons(page).nth(0)).toBeDisabled();
  await expect(stageButtons(page).nth(4)).toHaveAttribute('aria-current', 'step');
  const review = page.getByRole('button', { name: '자유 탐색' });
  await review.focus();
  await page.keyboard.press('Enter');
  await expect(stageButtons(page).nth(0)).toBeEnabled();
  await expect(page).toHaveURL(/flow-preview\?step=api$/);
  await stageButtons(page).nth(0).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '1. 명령 입력' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: '전체 흐름으로' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: '전체 실행 흐름' })).toBeFocused();
});
