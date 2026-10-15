import { expect, test } from '@playwright/test';

test('SSH 키 원고는 표와 인증 구조도를 의미 있는 요소로 렌더링한다', async ({ page }) => {
  await page.goto('/#/terms/ssh-key');
  await expect(page.getByRole('heading', { name: 'SSH 키', level: 1 })).toBeVisible();
  await expect(page.locator('.rich-figure svg')).toHaveCount(1);
  await expect(page.locator('.rich-table table')).toHaveCount(5);
  await expect(page.getByText('known_hosts에는 서버의 호스트 공개키가 저장됩니다.')).toBeVisible();
  await expect(page.locator('pre.code')).toContainText('chmod 400 ./b3-1-demo-key.pem');
});

test('CIDR 원고는 접두사 구조도와 주소 수 구분을 렌더링한다', async ({ page }) => {
  await page.goto('/#/terms/cidr');
  await expect(page.getByRole('heading', { name: 'CIDR', level: 1 })).toBeVisible();
  await expect(page.locator('.rich-figure svg')).toHaveCount(1);
  await expect(page.getByText('EC2 인스턴스 최대 수', { exact: false }).first()).toBeVisible();
  await expect(page.getByText('203.0.113.7/32', { exact: false }).first()).toBeVisible();
});

test('AWS 역할 비교는 구조도와 기존 비교표를 한 번씩만 렌더링한다', async ({ page }) => {
  await page.goto('/#/connections/network-aws-role-comparison');
  await expect(page.locator('.network-roles-figure svg')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: '일반 네트워크와 AWS의 역할 대응', level: 2 })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: '헷갈리기 쉬운 세 가지', level: 2 })).toHaveCount(1);
  await expect(page.getByRole('heading', { name: '브라우저에서 React 정적 파일까지', level: 2 })).toHaveCount(1);
  await expect(page.getByRole('table')).toHaveCount(4);
});

test('B3-1 SVG는 모든 테마에서 접근 가능한 이름을 유지하고 모바일에서 가로로 스크롤된다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
    await page.goto('/#/terms/ssh-key');
    await page.getByLabel('화면 테마').selectOption(theme);
    const sshFigure = page.locator('.rich-figure').first();
    await expect(sshFigure.locator('svg title')).toContainText('SSH 키 인증 흐름');
    await expect(sshFigure.locator('.rich-svg-scroll')).toHaveAttribute('aria-label', /가로로 스크롤/);
    expect(await sshFigure.locator('.rich-svg-scroll').evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);

    await page.goto('/#/terms/cidr');
    await page.getByLabel('화면 테마').selectOption(theme);
    await expect(page.locator('.rich-figure svg title')).toContainText('CIDR 접두사 길이');
    expect(await page.locator('.rich-svg-scroll').evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);

    await page.goto('/#/connections/network-aws-role-comparison');
    await page.getByLabel('화면 테마').selectOption(theme);
    await expect(page.locator('.network-roles-figure svg title')).toContainText('AWS 네트워크 구조도');
    expect(await page.locator('.network-roles-figure .rich-svg-scroll').evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
  }
});
