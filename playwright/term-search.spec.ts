import { expect, test } from '@playwright/test';

// Product Completion Audit §F 에서 막다른 길로 판정된 질의들이다.
// 여기서 확인하는 것은 "결과가 있다"가 아니라 "학습자가 다음으로 갈 수 있다"이다.

test('한국어 분야어로 검색하면 그 분야의 용어가 나온다', async ({ page }) => {
  await page.goto('/#/terms?q=보안');
  await expect(page.locator('.term-result-summary')).toContainText('52개');
  await expect(page.locator('.field-note')).toContainText('보안');
  await expect(page.locator('a.row').first()).toBeVisible();
});

test('분야 검색 결과에서 지도와 학문으로 이어진다', async ({ page }) => {
  await page.goto('/#/terms?q=운영체제');
  const exits = page.locator('.field-note .field-exits a');
  await expect(exits).toHaveCount(3);
  await exits.filter({ hasText: '학문 지도' }).click();
  await expect(page).toHaveURL(/#\/academic\/operating-systems/);
  await expect(page.getByRole('heading', { name: '운영체제', level: 1 })).toBeVisible();
});

test('분야로 모아 보기가 기존 필터로 이어진다', async ({ page }) => {
  await page.goto('/#/terms?q=알고리즘');
  await page.locator('.field-note .field-exits a').first().click();
  await expect(page).toHaveURL(/category=Algorithms/);
  await expect(page.locator('.term-result-summary')).toContainText('33개');
});

test('이름으로 찾는 기존 검색이 분야 검색보다 앞에 온다', async ({ page }) => {
  await page.goto('/#/terms?q=API');
  await expect(page.locator('.term-result-summary')).toContainText('11개');
  await expect(page.locator('.field-note')).toHaveCount(0); // API 는 분야어가 아니다
  await expect(page.locator('a.row').first()).toContainText('API 키');
});

test('데이터베이스 검색에서 이름이 맞는 용어가 먼저 나온다', async ({ page }) => {
  await page.goto('/#/terms?q=데이터베이스');
  await expect(page.locator('a.row').first()).toContainText('데이터베이스 마이그레이션');
});

test('사전에 없는 말은 0건이지만 막다른 길이 아니다', async ({ page }) => {
  await page.goto('/#/terms?q=존재하지않는임의용어');
  await expect(page.locator('.term-result-summary')).toContainText('0개');
  await expect(page.locator('.search-recovery')).toContainText('찾지 못했어요');
  // 근거 없는 추천을 만들지 않는다 — 용어를 들이밀지 않고 둘러볼 길만 준다.
  await expect(page.locator('a.row')).toHaveCount(0);
  const exits = page.locator('.search-recovery .field-exits a');
  await expect(exits).toHaveCount(4);
  await exits.filter({ hasText: '기술 지도' }).click();
  await expect(page).toHaveURL(/#\/maps$/);
});

test('필터가 결과를 0으로 만들면 필터를 풀 수 있다', async ({ page }) => {
  await page.goto('/#/terms?q=보안&category=Web&toon=yes');
  await expect(page.locator('.term-result-summary')).toContainText('0개');
  await expect(page.locator('.search-recovery')).toContainText('필터가 결과를 좁히고 있어요');
  await page.locator('.search-recovery button').click();
  await expect(page.locator('.term-result-summary')).toContainText('52개');
});

test('검색 결과에서 용어로 갔다가 뒤로 오면 검색이 남아 있다', async ({ page }) => {
  await page.goto('/#/terms?q=보안');
  await page.locator('a.row').first().click();
  await expect(page).toHaveURL(/#\/terms\/environment-variable/);
  await page.goBack();
  await expect(page).toHaveURL(/q=%EB%B3%B4%EC%95%88|q=보안/);
  await expect(page.locator('#q')).toHaveValue('보안');
  await expect(page.locator('.term-result-summary')).toContainText('52개');
});

test('빈 검색은 예전처럼 자주 찾는 용어를 보여 준다', async ({ page }) => {
  await page.goto('/#/terms');
  await expect(page.locator('.term-result-summary')).toContainText('523개의 기술 용어 중');
  await expect(page.locator('.field-note')).toHaveCount(0);
  await expect(page.locator('.search-recovery')).toHaveCount(0);
});

test('한글 조합 중에는 URL을 갱신하지 않고 완성 뒤에만 검색한다', async ({ page }) => {
  await page.goto('/#/terms?category=Security');
  const search = page.locator('#q');
  await search.dispatchEvent('compositionstart');
  await search.fill('ㅂ');
  await search.press('Enter'); // IME 조합 확정용 Enter는 검색 제출이 아니다.
  await page.waitForTimeout(350);
  expect(decodeURIComponent(new URL(page.url()).hash)).toBe('#/terms?category=Security');
  await search.fill('비대칭키');
  await search.dispatchEvent('compositionend');
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#/terms?q=비대칭키&category=Security');
  await expect(search).toHaveValue('비대칭키');
});

test('검색 버튼은 완성된 draft를 즉시 검색하고 자동 검색은 방문 기록을 늘리지 않는다', async ({ page }) => {
  await page.goto('/#/');
  await page.getByRole('link', { name: '용어 찾기' }).click();
  await expect(page.getByRole('heading', { name: '용어 찾기', level: 1 })).toBeVisible();
  const search = page.locator('#q');
  await search.fill('API');
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#/terms?q=API');
  await page.goBack();
  await expect(page).toHaveURL(/#\/$/);
  await page.locator('#q').fill('API');
  await page.locator('#q').press('Enter');
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#/terms?q=API');
  await page.goBack();
  await expect(page).toHaveURL(/#\/$/);
  await page.locator('#q').fill('DOM');
  await page.getByRole('button', { name: '검색' }).click();
  await expect.poll(() => decodeURIComponent(new URL(page.url()).hash)).toBe('#/terms?q=DOM');
  await expect(page.locator('.term-result-summary')).toContainText('4개');
});
