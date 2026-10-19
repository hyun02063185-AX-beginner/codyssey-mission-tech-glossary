import { expect, test } from '@playwright/test';

test('B3-1 mission opens its guide and renders the network comparison on desktop and mobile', async ({ page }) => {
  await page.goto('/#/missions/main-M05');
  await page.getByRole('link', { name: '학습 가이드 읽기 →' }).click();
  await expect(page.locator('.guide-index nav li')).toHaveCount(7);
  await page.getByRole('link', { name: '가이드 소개와 표기 규칙' }).click();
  await expect(page.locator('.guide-prose h1')).toContainText('B3-1 학습 가이드');
  await expect(page.getByRole('link', { name: '웹 연결 QA' }).first()).toHaveAttribute('href', /document=webQA/);
  await page.getByRole('link', { name: '2장', exact: true }).click();
  await expect(page.locator('.guide-prose h1')).toContainText('일반 네트워크의 역할은 AWS에서 무엇이 맡을까');
  await expect(page.getByRole('table').first()).toContainText('Security Group');
  await expect(page.locator('.guide-prose a[href*="/connections/network-aws-role-comparison"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: '그림 크게 열기' }).first()).toHaveAttribute('href', /\.svg/);

  for (const image of await page.locator('.guide-prose img').all()) {
    await expect(image).toHaveJSProperty('complete', true);
    expect(await image.evaluate((node: HTMLImageElement) => node.naturalWidth)).toBeGreaterThan(0);
  }
  const cidrUrl = await page.locator('.guide-prose img').nth(1).getAttribute('src');
  expect(cidrUrl).toBeTruthy();
  const cidrSvg = await (await page.request.get(cidrUrl!)).text();
  expect(cidrSvg).toContain('전체 IPv4 공간');
  expect(cidrSvg).not.toContain('인터넷 전체');

  for (const chapterId of ['01-deployment-path', '02-network-aws-map', '03-internet-path', '04-security-group', '05-ssh-key', '06-ec2-nginx', '07-verify-operate']) {
    await page.goto(`/#/missions/main-M05/guide/${chapterId}`);
    await expect(page.locator('.guide-prose h1')).toBeVisible();
    await expect(page.locator('.guide-prose h1')).toContainText(`${Number(chapterId.slice(0, 2))}.`);
  }
  await page.goto('/#/missions/main-M05/guide/05-ssh-key');
  const sshUrl = await page.locator('.guide-prose img').first().getAttribute('src');
  expect(sshUrl).toBeTruthy();
  const sshSvg = await (await page.request.get(sshUrl!)).text();
  expect(sshSvg).toContain('지문 계산 후 비교');
  expect(sshSvg).not.toContain('호스트 공개키와 지문');
  await page.goto('/#/missions/main-M05/guide/02-network-aws-map');

  await page.screenshot({ path: '../b31-desktop.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 900 });
  await expect(page.locator('.guide-mobile-nav')).toBeVisible();
  await expect(page.locator('.b31-figure-scroll').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('.b31-figure-scroll').first().evaluate(node => node.scrollWidth > node.clientWidth)).toBe(true);
  const image = page.locator('.b31-figure-scroll img').first();
  expect(await image.evaluate((node: HTMLImageElement) => node.getBoundingClientRect().width)).toBe(520);
  await page.screenshot({ path: '../b31-mobile-top.png' });
  await image.scrollIntoViewIfNeeded();
  await page.screenshot({ path: '../b31-mobile-figure.png' });
  await page.screenshot({ path: '../b31-mobile.png', fullPage: true });
});
