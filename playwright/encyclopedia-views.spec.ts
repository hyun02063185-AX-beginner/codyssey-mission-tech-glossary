import { expect, test } from '@playwright/test';

test('prerequisite view shows an ordered learning ladder with reasons', async ({ page }) => {
  await page.goto('/#/prerequisites/redis');
  await expect(page.getByRole('heading', { name: 'Redis', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: /먼저 알아보기/ })).toBeVisible();
  await expect(page.getByText('키-값 저장소').first()).toBeVisible();
  await expect(page.getByRole('heading', { name: '자료구조에서 Redis까지' })).toBeVisible();
  await expect(page.locator('.pre-current')).toContainText('Redis');
});

test('prerequisite index links into a term view', async ({ page }) => {
  await page.goto('/#/prerequisites');
  await expect(page.getByRole('heading', { name: '선수학습 지도', level: 1 })).toBeVisible();
  await page.locator('.card', { hasText: 'Deadlock' }).first().click();
  await expect(page).toHaveURL(/#\/prerequisites\/deadlock/);
  await expect(page.getByRole('heading', { name: 'Deadlock', level: 1 })).toBeVisible();
});

test('mission view answers the six questions on the existing route', async ({ page }) => {
  await page.goto('/#/missions/main-M13');
  const encyclopedia = page.locator('.mission-encyclopedia');
  await expect(encyclopedia).toBeVisible();
  await expect(encyclopedia).toContainText('로그인이 되고 회원끼리 연결되는 웹 서비스 만들기');
  for (const heading of ['어떤 학문과 연결되는가', '무엇을 먼저 알아야 하는가', '이 미션의 핵심 개념', '실제로 사용하는 개념', '다음에 무엇을 공부하면 좋은가']) {
    await expect(encyclopedia.getByRole('heading', { name: new RegExp(heading) })).toBeVisible();
  }
  await expect(encyclopedia).toContainText('정보보안');
  await expect(page.getByRole('heading', { name: '미션에 직접 등장' })).toBeVisible();
});

test('mission view does not pull security attacks into M03', async ({ page }) => {
  await page.goto('/#/missions/main-M03');
  const before = page.locator('.mission-encyclopedia');
  await expect(before).toBeVisible();
  await expect(before).not.toContainText('XSS');
  await expect(before).not.toContainText('SQL 인젝션');
});

test('academic view hides fields without coverage and keeps them listed as gaps', async ({ page }) => {
  await page.goto('/#/academic');
  await expect(page.getByRole('heading', { name: '학문 지도', level: 1 })).toBeVisible();
  await expect(page.locator('.grid').getByText('운영체제')).toBeVisible();
  await expect(page.locator('.grid').getByText('클라우드 컴퓨팅')).toBeVisible();
  const hidden = page.locator('.academic-hidden');
  await expect(hidden).toContainText('SRE');
  await page.goto('/#/academic/sre');
  await expect(page.locator('.notice')).toContainText('연결된 용어가 아직 없습니다');
});

test('academic detail separates the academic axis from the technology axis', async ({ page }) => {
  await page.goto('/#/academic/operating-systems');
  await expect(page.getByRole('heading', { name: '운영체제', level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: '기술 분야와 다르게 배정한 용어' })).toBeVisible();
  await expect(page.locator('.academic-overrides')).toContainText('Mutex');
});

test('role view marks thin coverage instead of overstating it', async ({ page }) => {
  await page.goto('/#/roles');
  await expect(page.getByRole('heading', { name: '직무 지도', level: 1 })).toBeVisible();
  await expect(page.locator('.role-card', { hasText: 'QA 엔지니어' })).toContainText('연결된 범위 제한적');
  await page.goto('/#/roles/site-reliability-engineer');
  await expect(page.locator('.role-state-banner')).toContainText('현재 사전에 연결된 범위 기준');
  await expect(page.locator('.notice')).toContainText('부족');
});

test('new views keep deep links and browser history working', async ({ page }) => {
  await page.goto('/#/prerequisites/redis');
  await page.goto('/#/academic/database-systems');
  await expect(page.getByRole('heading', { name: '데이터베이스', level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/#\/prerequisites\/redis/);
  await expect(page.getByRole('heading', { name: 'Redis', level: 1 })).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(/#\/academic\/database-systems/);
});

test('existing routes still work alongside the new views', async ({ page }) => {
  await page.goto('/#/maps/frontend');
  await expect(page.locator('.map-canvas')).toBeVisible();
  await page.goto('/#/connections');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/#/terms/redis');
  await expect(page.getByRole('heading', { name: 'Redis', level: 1 })).toBeVisible();
  await page.goto('/#/missions/main-m13');
  await expect(page.locator('.notice')).toContainText('존재하지 않는 미션입니다.');
});

test('navigation exposes every top-level view', async ({ page }) => {
  await page.goto('/');
  for (const name of ['미션', '용어', '선수학습', '기술 지도', '학문', '직무', '개념 연결', '웹툰']) {
    await expect(page.locator('nav').getByRole('link', { name, exact: true })).toBeVisible();
  }
  await expect(page.locator('nav').getByRole('link', { name: '흐름' })).toHaveCount(0);
});

test('encyclopedia views render on a narrow viewport without overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const route of ['/#/prerequisites/redis', '/#/academic', '/#/roles', '/#/missions/main-M13']) {
    await page.goto(route);
    await expect(page.locator('main')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, route).toBeLessThanOrEqual(1);
  }
});
