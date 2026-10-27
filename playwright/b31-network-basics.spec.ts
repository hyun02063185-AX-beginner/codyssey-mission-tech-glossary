import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const base = '/#/missions/main-M05/story-map/concepts';
const output = 'reports/b3-1-network-basics-map-web/captures';
mkdirSync(output, { recursive: true });
for (const width of [1920, 1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) for (const scheme of ['light', 'dark'] as const) {
  test(`${width} ${theme} ${scheme}: basics readability and controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: width > 700 ? 1080 : 844 });
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: 'reduce' });
    const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto(base + '?view=basics');
    await page.locator('.learning-focus-menu summary').click();
    await page.getByLabel('화면 테마', { exact: true }).selectOption(theme);
    await page.locator('.learning-focus-menu summary').click();
    await expect(page.locator('[data-map-node]')).toHaveCount(11);
    await expect(page.locator('.cm-edge-group')).toHaveCount(10);
    await expect(page.locator('.cm-views button')).toHaveCount(4);
    const metrics = await page.evaluate(() => {
      const buttons = [...document.querySelectorAll<HTMLElement>('.cm-views button')];
      return { overflow: document.documentElement.scrollWidth > innerWidth, clipped: buttons.filter(b => b.scrollWidth > b.clientWidth).map(b => b.textContent), boxes: buttons.map(b => { const r = b.getBoundingClientRect(); return { x:r.x, y:r.y, right:r.right, bottom:r.bottom }; }) };
    });
    expect(metrics.overflow).toBe(false); expect(metrics.clipped).toEqual([]);
    for (let i=0; i<metrics.boxes.length; i++) for (let j=i+1; j<metrics.boxes.length; j++) {
      const a=metrics.boxes[i], b=metrics.boxes[j]; expect(a.right<=b.x || b.right<=a.x || a.bottom<=b.y || b.bottom<=a.y).toBe(true);
    }
    await page.getByRole('button', { name:'전체 보기', exact:true }).click();
    if (theme === 'forest') await page.screenshot({ path:`${output}/${width}-${scheme}-overview.png` });
    await page.locator('[data-map-node="bas:tcp"]').click();
    await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
    for (const id of ['bas:ip','bas:http']) await expect(page.locator(`[data-map-node="${id}"]`)).toHaveClass(/is-contrast/);
    await expect(page.locator('[data-relation="BA10"] .map-edge')).toHaveClass(/is-highlighted/);
    expect(await page.locator('.map-edge:not(.is-highlighted)').first().evaluate(el=>Number(getComputedStyle(el).opacity))).toBeGreaterThanOrEqual(.2);
    await expect(page.locator('.cm-applied')).toContainText('관련 사례에서 보기');
    await expect(page.locator('.cm-applied')).toContainText('B3-1 AWS');
    if (theme === 'forest') await page.screenshot({ path:`${output}/${width}-${scheme}-tcp.png` });
    await page.getByRole('button',{name:'상세 패널 닫기',exact:true}).click();
    await page.getByRole('button',{name:/설명 다시 열기/}).click();
    await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
    expect(errors).toEqual([]);
  });
}

test('terms, search, four views, applied examples, history and lesson round trips', async ({ page }) => {
  await page.goto(base + '?term=subnet');
  await expect(page.locator('.cm-views .is-active')).toHaveText('네트워크 기초');
  await expect(page.locator('[data-map-node="bas:subnet"]')).toHaveClass(/is-selected/);
  await page.reload(); await expect(page.locator('#cm-detail-title')).toHaveText('서브넷 (Subnet)');
  await expect(page.locator('.cm-applied')).toContainText('일반망 예시');
  await page.locator('.cm-applied button').filter({hasText:'일반망 예시'}).click();
  await expect(page.locator('.cm-views .is-active')).toHaveText('일반 네트워크');
  await page.locator('.cm-applied button').filter({hasText:'서브넷 (Subnet)'}).click();
  await expect(page.locator('.cm-views .is-active')).toHaveText('네트워크 기초');
  await page.goto(base + '?view=basics&node=bas:tcp&scene=scene-02');
  const tcpURL=page.url();
  await page.locator('.cm-applied button').filter({hasText:'Security Group'}).click();
  await expect(page.locator('.cm-views .is-active')).toHaveText('AWS 네트워크');
  await page.reload(); await expect(page.locator('#cm-detail-title')).toHaveText('Security Group');
  await page.goBack(); await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
  await page.locator('[data-panel-relation="BA10"]').click();
  await expect(page).toHaveURL(/rel=BA10/); await page.reload(); await expect(page.locator('#cm-detail-title')).toHaveText('포트로 서비스 구분');
  await page.goto(tcpURL);
  await page.locator('.cm-term-links a').filter({hasText:'TCP'}).first().click();
  await page.getByRole('link',{name:'← B3-1 개념지도로 돌아가기',exact:true}).click();
  await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
  await page.locator('.cm-scenes a').first().click();
  await page.locator('.learning-focus-menu summary').click();
  await page.getByRole('link',{name:'개념지도',exact:true}).click();
  await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
  await page.goto(base+'?term=private-ip');
  await expect(page.locator('[data-map-node="com:private-ip"]')).toHaveClass(/is-selected/);
  await page.locator('.cm-clear').click();
  for (const [label,count] of [['일반 네트워크',26],['AWS 네트워크',15],['네트워크 기초',11],['전체 관계',23]] as const) {
    await page.getByRole('button',{name:label,exact:true}).click();
    await expect(page.locator('[data-map-node]')).toHaveCount(count);
  }
  await page.getByRole('button',{name:'탐색 도구 펼치기',exact:true}).click();
  await page.getByRole('searchbox',{name:'지도에서 찾기'}).fill('TCP');
  await page.locator('.cm-search-results button').filter({hasText:/^TCP/}).click();
  await expect(page.locator('.cm-views .is-active')).toHaveText('네트워크 기초');
  await expect(page.locator('#cm-detail-title')).toHaveText('TCP');
});


test('basics node and relation selection, zoom and drag', async ({ page }) => {
  for (const id of ['bas:network','bas:subnet','bas:ip-address','bas:packet','bas:protocol','bas:ip','bas:tcp','bas:http','com:public-ip','com:private-ip','com:port']) {
    await page.goto(base+'?view=basics&node='+encodeURIComponent(id));
    await expect(page.locator(`[data-map-node="${id}"]`)).toHaveClass(/is-selected/);
    await expect(page.locator('#cm-detail-title')).toBeVisible();
  }
  for (let i=1;i<=10;i++) {
    const id='BA'+String(i).padStart(2,'0');
    await page.goto(base+'?view=basics&rel='+id);
    await expect(page.locator(`[data-relation="${id}"] .map-edge`)).toHaveClass(/is-highlighted/);
  }
  await page.goto(base+'?view=basics');
  const svg=page.locator('.map-canvas');
  await expect(page.locator('[data-map-node]')).toHaveCount(11);
  const before=await svg.getAttribute('viewBox');
  await page.getByRole('button',{name:'지도 확대',exact:true}).click();
  await expect(svg).not.toHaveAttribute('viewBox',before!);
  const zoomed=await svg.getAttribute('viewBox');
  const rect=(await svg.boundingBox())!;
  await page.mouse.move(rect.x+50,rect.y+40); await page.mouse.down();
  await page.mouse.move(rect.x+120,rect.y+80,{steps:6}); await page.mouse.up();
  await expect(svg).not.toHaveAttribute('viewBox',zoomed!);
});
