import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const story = '/#/missions/main-M05/story-map';
const map = `${story}/concepts`;
const scenes = ['scene-01', 'scene-02', 'scene-03a', 'scene-03b', 'scene-04'];
const output = 'reports/b3-1-story-map-integration';

test('mission entry, five focused scenes, outline, keyboard figure zoom and practice', async ({ page }) => {
  await page.goto('/#/missions/main-M05');
  await expect(page.locator('.mission-encyclopedia')).toBeVisible();
  await expect(page.getByRole('link', { name: '미션 스토리맵으로 학습 시작하기 →' })).toBeInViewport();
  await expect(page.getByRole('link', { name: '기업망 보강 자료', exact: true })).toHaveAttribute('href', /document=supplement/);
  await page.getByRole('link', { name: '미션 스토리맵으로 학습 시작하기 →' }).click();
  await expect(page.locator('.b31-story-heading h1')).toHaveText('B3-1 — AWS로 다시 이해하는 네트워크');
  for (const [index, scene] of scenes.entries()) {
    await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene', scene);
    await expect(page.locator('[aria-current="step"]')).toHaveCount(1);
    await expect(page.locator('.b31-current-scene')).toHaveCount(1);
    await expect(page.getByRole('heading', { name: '내 말로 설명해 보기' })).toBeVisible();
    if (index < 4) {
      await expect(page.locator('.b31-story-art svg')).toHaveCount(1);
      await page.getByRole('button', { name: '그림 확대하기', exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      await page.getByRole('button', { name: '그림 확대', exact: true }).click();
      await expect(page.getByRole('dialog')).toContainText('125%');
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(page.getByRole('button', { name: '그림 확대하기', exact: true })).toBeFocused();
      await page.locator('[rel="next"]').click();
    }
  }
  await expect(page.getByRole('link', { name: '실습 결과 검증·운영 가이드 →' })).toBeVisible();
  await expect(page.locator('.b31-story-art')).toHaveCount(0);
  await page.getByRole('link', { name: /Scene 03-A.*일반 기업망과 AWS/ }).click();
  await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene', 'scene-03a');
  await page.reload();
  await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene', 'scene-03a');
  await page.goto(`${story}?scene=missing`);
  await expect(page.getByRole('status')).toContainText('첫 장면');
});

test('each scene opens the relevant map selection and returns to the original scene', async ({ page }) => {
  for (const [scene, selection] of [['scene-01', 'gen:firewall'], ['scene-02', 'GF01'], ['scene-03a', 'CR01'], ['scene-03b', 'AF01']]) {
    await page.goto(`${story}?scene=${scene}`);
    await page.getByRole('link', { name: '관련 개념을 지도에서 보기 →', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`scene=${scene}`));
    if (selection.startsWith('gen:')) await expect(page.locator(`[data-map-node="${selection}"]`)).toHaveClass(/is-selected/);
    else await expect(page.locator(`[data-relation="${selection}"].is-highlighted`).first()).toBeVisible();
    await page.reload();
    await page.locator('.map-intro a').filter({ hasText: /Scene.*돌아가기/ }).click();
    await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene', scene);
    await page.getByRole('link', { name: '← 이전 선택으로 개념지도 돌아가기' }).click();
    await expect(page).toHaveURL(new RegExp(encodeURIComponent(selection)));
  }
});

test('node, relation and flow survive panel scene and glossary round trips including reload', async ({ page }) => {
  for (const query of ['view=aws&more=1&node=aws%3Avpc', 'view=aws&rel=AW13', 'view=aws&flow=AF01']) {
    await page.goto(`${map}?${query}&scene=scene-03b`);
    await expect(page.locator('.cm-detail-body')).toBeVisible();
    const original = new URL(page.url()).hash;
    await page.locator('.cm-scenes a').first().click();
    await expect(page.locator('.b31-current-scene')).toBeVisible();
    await page.reload();
    await page.getByRole('link', { name: '← 이전 선택으로 개념지도 돌아가기' }).click();
    await expect.poll(() => new URL(page.url()).hash).toBe(original);
    await page.locator('.cm-term-links a').first().click();
    await expect(page.getByRole('navigation', { name: '미션 학습으로 복귀' })).toBeVisible();
    await page.reload();
    await page.getByRole('link', { name: '← B3-1 개념지도로 돌아가기' }).click();
    await expect.poll(() => new URL(page.url()).hash).toBe(original);
    await expect(page.locator('.cm-detail-body')).toBeVisible();
  }
  await page.goto(`${map}?node=gen%3Afirewall`);
  await expect(page.locator('.cm-term-links a')).toHaveCount(0);
  await expect(page.locator('.cm-term-links')).toContainText('연결된 용어사전 항목이 없습니다');
});

test('uses actual figure width, isolates SVG styles and highlights the existing request/response identifiers', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${story}?scene=scene-02`);
  await expect(page.locator('.b31-art-frame')).toHaveAttribute('data-layout', 'desktop');
  // Keep the same viewport while narrowing only the actual diagram container.
  await page.locator('.b31-art-frame').evaluate(element => { (element as HTMLElement).style.width = '600px'; });
  await expect(page.locator('.b31-art-frame')).toHaveAttribute('data-layout', 'mobile');
  await page.getByRole('button', { name: '요청 강조', exact: true }).click();
  await expect(page.locator('.b31-story-art [data-flow="R1"]')).toHaveCSS('opacity', '0.12');
  await expect(page.locator('.b31-story-art [data-flow="A1"]')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: '응답 강조', exact: true }).click();
  await expect(page.locator('.b31-story-art [data-flow="A1"]')).toHaveCSS('opacity', '0.12');
  await expect(page.locator('.b31-story-art [data-flow="R1"]')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: '← B3-1 미션', exact: true }).click();
  await page.getByRole('link', { name: '학습 가이드 읽기 →', exact: true }).click();
  await expect(page.locator('.guide-index')).toBeVisible();
});

for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) for (const colorScheme of ['light', 'dark'] as const) {
  test(`${width}px ${theme} ${colorScheme}: readable responsive scenes and lecture enlargement`, async ({ page }) => {
    await mkdir(output, { recursive: true });
    await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
    const measurements = [];
    for (const scene of scenes.slice(0, 4)) {
      await page.goto(`${story}?scene=${scene}`);
      await page.getByLabel('화면 테마').selectOption(theme);
      await expect(page.locator('.b31-story-art svg')).toHaveCount(1);
      await page.evaluate(() => document.fonts.ready);
      const sample = await page.locator('.b31-art-frame').evaluate(frame => {
        const svg = frame.querySelector('.b31-story-art')!.shadowRoot!.querySelector('svg')!;
        const bounds = svg.getBoundingClientRect(), box = svg.viewBox.baseVal;
        const sizes = [...svg.querySelectorAll('text')].map(text => parseFloat(getComputedStyle(text).fontSize) * bounds.width / box.width);
        return { layout: frame.getAttribute('data-layout'), width: frame.clientWidth, artWidth: bounds.width,
          proportionError: Math.abs(bounds.height / bounds.width - box.height / box.width),
          minimumText: Math.min(...sizes), noOverflow: document.documentElement.scrollWidth <= innerWidth };
      });
      expect(sample.noOverflow).toBe(true);
      expect(sample.proportionError).toBeLessThan(.002);
      expect(sample.minimumText).toBeGreaterThan(11.5);
      expect(sample.layout).toBe(sample.width >= (scene.startsWith('scene-03') ? 960 : 904) ? 'desktop' : 'mobile');
      measurements.push({ scene, ...sample });
      if (theme === 'forest' && colorScheme === 'light') await page.screenshot({ path: `${output}/${width}-${scene}-full.png`, fullPage: true, animations: 'disabled' });
    }
    await page.screenshot({ path: `${output}/${width}-${theme}-${colorScheme}.png`, fullPage: true, animations: 'disabled' });
    await page.getByRole('button', { name: '그림 확대하기', exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: '그림 확대', exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: '원래 화면으로 돌아가기', exact: true }).click();
    await writeFile(`${output}/${width}-${theme}-${colorScheme}.json`, JSON.stringify(measurements, null, 2) + '\n');
  });
}
