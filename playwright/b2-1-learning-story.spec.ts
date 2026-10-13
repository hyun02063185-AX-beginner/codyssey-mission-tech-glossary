import { expect, test } from '@playwright/test';

test('B2-1 mission card opens the private story and returns to the mission', async ({ page }) => {
  await page.goto('/#/missions/main-M03');
  const entry = page.locator('.b21-story-entry');
  await expect(entry).toBeVisible();
  await expect(entry).toContainText('점이 선이 되는 순간');
  await expect(entry).toContainText('검토 시안');
  await entry.getByRole('link', { name: /이해의 흐름 보기/ }).click();
  await expect(page).toHaveURL(/#\/missions\/main-M03\/story/);
  await expect(page.getByRole('heading', { name: '용돈 기입장 코드에서 이어진 세 가지 이해', level: 1 })).toBeVisible();
  await page.getByRole('link', { name: /B2-1 미션으로/ }).click();
  await expect(page).toHaveURL(/#\/missions\/main-M03/);

  await page.goto('/#/missions/main-M02');
  await expect(page.locator('.b21-story-entry')).toHaveCount(0);
  await page.goto('/#/missions/preliminary-M03');
  await expect(page.locator('.learning-story')).toBeVisible();
  await expect(page.locator('.b21-story-entry')).toHaveCount(0);
});

test('B2-1 story supports direct access and links every episode to existing terms', async ({ page }) => {
  await page.goto('/#/missions/main-M03/story');
  await expect(page.locator('.b21-episode')).toHaveCount(3);
  for (const href of ['#/terms/iterator', '#/terms/generator', '#/terms/yield', '#/terms/decorator', '#/terms/function', '#/terms/type-hint']) {
    await expect(page.locator(`a[href="${href}"]`).first()).toBeVisible();
  }
  await expect(page.getByText('필수 학습 순서가 아닌 독립된 이해 경험')).toBeVisible();
});

test('two iterators advance independently through yield and StopIteration states', async ({ page }) => {
  await page.goto('/#/missions/main-M03/story');
  const iteratorA = page.locator('[data-iterator="a"]');
  const iteratorB = page.locator('[data-iterator="b"]');
  const buttonA = iteratorA.getByRole('button', { name: "Iterator A의 next()" });
  const buttonB = iteratorB.getByRole('button', { name: "Iterator B의 next()" });

  await expect(iteratorA).toContainText('생성됨');
  await expect(iteratorB).toContainText('생성됨');
  await buttonA.click();
  await buttonA.click();
  await buttonB.click();
  await expect(iteratorA).toContainText('TX-002');
  await expect(iteratorB).toContainText('TX-001');
  await expect(iteratorA).toContainText('yield 일시정지');
  await expect(iteratorB).toContainText('yield 일시정지');

  await buttonA.focus();
  await buttonA.press('Enter');
  await expect(iteratorA).toContainText('TX-003');
  await buttonA.press('Enter');
  await expect(iteratorA).toContainText('StopIteration');
  await expect(buttonA).toBeDisabled();
  await expect(iteratorB).toContainText('TX-001');

  await page.getByRole('button', { name: '처음부터' }).click();
  await expect(iteratorA).toContainText('생성됨');
  await expect(iteratorB).toContainText('생성됨');
});

test('decorator trace distinguishes normal and LedgerError return paths', async ({ page }) => {
  await page.goto('/#/missions/main-M03/story');
  const episode = page.locator('#decorator');
  const normal = episode.getByRole('button', { name: '정상 실행' });
  const ledgerError = episode.getByRole('button', { name: 'LedgerError 처리' });
  await expect(episode).toContainText('def handle_errors');
  await expect(episode).toContainText('@handle_errors');
  await expect(episode).toContainText('return 0');
  await expect(episode).toContainText('return 1');
  await expect(normal).toHaveAttribute('aria-pressed', 'true');
  await expect(episode.locator('.b21-trace')).toContainText('종료 코드 0');
  await ledgerError.focus();
  await ledgerError.press('Enter');
  await expect(ledgerError).toHaveAttribute('aria-pressed', 'true');
  await expect(episode.locator('.b21-trace')).toContainText('종료 코드 1');
  await expect(episode).toContainText('다른 프로그래밍 오류를 임의로 잡아');
});

test('type hint episode separates static information from runtime value validation', async ({ page }) => {
  await page.goto('/#/missions/main-M03/story');
  const episode = page.locator('#type-hint');
  await expect(episode).toContainText('limit: int');
  await expect(episode).toContainText('list[Transaction]');
  await expect(episode).toContainText('Type Hint 자체가 값을 자동으로 막지는 않습니다');
  await expect(episode).toContainText('if limit <= 0: raise ValidationError(...)');
});

test('B2-1 story remains readable without viewport overflow in every theme', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/#/missions/main-M03/story');
  const selector = page.getByLabel('화면 테마');
  for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    await selector.selectOption(theme);
    await expect(page.locator('html')).toHaveAttribute('data-accent-theme', theme);
    await expect(page.locator('.b21-story-page')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, theme).toBeLessThanOrEqual(1);
  }
});
