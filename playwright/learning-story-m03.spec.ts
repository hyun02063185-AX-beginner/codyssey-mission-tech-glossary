import { expect, test } from '@playwright/test';

test('evidence-backed M03 story is available only in preliminary M03 and leads to its asset', async ({ page }) => {
  await page.goto('/#/missions/preliminary-M03');
  const story = page.locator('.learning-story');
  await expect(story).toBeVisible();
  await expect(story).toContainText('점이 선이 되는 순간');
  await expect(story).toContainText('MAC을 어디에 쓰는 걸까?');
  await story.getByRole('link', { name: /움직여서 이해하기/ }).click();
  await expect(page).toHaveURL(/#\/learning-assets\/mac-sliding-window/);
  await expect(page.locator('.learning-asset-frame')).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/missions\/preliminary-M03/);
  await expect(story).toBeVisible();

  await page.goto('/#/missions/main-M03');
  await expect(page.locator('.learning-story')).toHaveCount(0);
});

test('MAC asset is offline, interactive, and resettable', async ({ page }) => {
  await page.goto('/#/learning-assets/mac-sliding-window');
  const asset = page.frameLocator('.learning-asset-frame');
  await expect(asset.getByRole('heading', { name: 'MAC 슬라이딩 윈도우' })).toBeVisible();
  await asset.getByRole('button', { name: '한 칸 이동' }).click();
  await expect(asset.locator('#out-0-0')).toHaveText('1');
  await asset.getByRole('button', { name: '자동 재생' }).click();
  await expect(asset.getByRole('button', { name: '일시 정지' })).toBeVisible();
  await asset.getByRole('button', { name: '일시 정지' }).click();
  await expect(asset.getByRole('button', { name: '자동 재생' })).toBeVisible();
  await asset.getByRole('button', { name: '초기화' }).click();
  await expect(asset.locator('#out-0-0')).toHaveText('-');
  await expect(asset.locator('footer')).toContainText('작은 필터를 큰 입력의 여러 위치에 적용');
});

test('MAC term detail has the small story connection', async ({ page }) => {
  await page.goto('/#/terms/mac-operation');
  const link = page.locator('.term-learning-asset-entry');
  await expect(link).toContainText('점이 선이 되는 순간으로 보기');
  await link.click();
  await expect(page).toHaveURL(/#\/learning-assets\/mac-sliding-window/);
});
