import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'content/mission-stories/main-m06';
const manuscript = readFileSync(`${root}/storyboard-v0.2.md`, 'utf8').replace(/\r\n/g, '\n');
const slides = [...manuscript.matchAll(/^### (S(\d)-(\d)) · (.+)\n[\s\S]*?^\*\*화면 해설\*\*\n\n(.+)$/gm)]
  .map(([, id, scene, screen, title, explanation]) => ({ id, scene, screen, title, explanation: explanation.replace(/`/g, '') }));
const base = '/#/missions/main-M06/story';
const viewports = [
  { width: 1280, height: 720 }, { width: 1000, height: 720 },
  { width: 360, height: 800 }, { width: 390, height: 844 },
];

test('shows the v0.2 title, subtitle, goals and four scene links', async ({ page }) => {
  await page.goto(base);
  await expect(page.getByRole('heading', { name: 'B3-2 — Python으로 외부 AI를 활용하는 방법' })).toBeVisible();
  await expect(page.getByText('Git 변경 내용을 설명하는 AI 도우미 만들기', { exact: true })).toBeVisible();
  await page.getByText('학습 목표와 강의 흐름').click();
  await expect(page.locator('.mission-story-orientation > ol > li')).toHaveCount(4);
  await expect(page.locator('.mission-story-orientation > ol > li').first()).toContainText('외부 AI API로 보내는 요청');
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);
  await expect(page.getByRole('link', { name: /Python과 외부 AI API의 요청·응답/ })).toHaveAttribute('href', '#/missions/main-M06/story?scene=3&screen=1');
});

for (const viewport of viewports) {
  for (const theme of ['dark', 'light']) {
    test.describe(`${viewport.width}×${viewport.height} ${theme}`, () => {
      const mobile = viewport.width < 900;
      test.use({ viewport, isMobile: mobile, hasTouch: mobile });

      test('opens all eight authored explanations and preserves slide navigation', async ({ page }) => {
        test.setTimeout(60000);
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(theme => localStorage.setItem('codyssey-presentation-theme', theme), theme);
        await page.goto(`${base}?scene=1&screen=1`);
        await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme', theme);
        await expect(page.locator('#b32-message')).toBeFocused();
        const panel = page.locator('#b32-slide-explanation');
        const body = panel.getByRole('region', { name: '해설 본문' });
        const close = panel.getByRole('button', { name: '화면 해설 닫기' });
        const toggle = page.locator('[aria-controls=b32-slide-explanation]');
        const bottom = page.getByRole('navigation', { name: 'B3-2 강의 조작' });
        const top = page.getByRole('navigation', { name: '슬라이드 상단 탐색' });
        const figure = page.locator('.b32-lesson .b32-figure');
        const journey = page.locator('.b32-journey');

        await expect(panel).toBeHidden();
        await page.keyboard.press('p');
        await expect(panel).toBeVisible();
        await expect(panel.getByRole('heading')).toBeFocused();
        await page.keyboard.press('Shift+P');
        await expect(panel).toBeHidden();
        await expect(toggle).toBeFocused();
        if (mobile) await toggle.tap();
        else await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');

        expect(slides).toHaveLength(8);
        for (const [index, slide] of slides.entries()) {
          await expect(page).toHaveURL(new RegExp(`scene=${slide.scene}&screen=${slide.screen}$`));
          await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', slide.id);
          await expect(panel.getByRole('heading', { name: slide.title, exact: true })).toBeFocused();
          await expect(body.locator('p')).toHaveText(slide.explanation);
          await expect(body.getByRole('link').first()).toHaveAttribute('href', /Codyssey_B3-2\/blob\/be21c499.+\/docs\/learning\//);
          await expect(figure.locator('svg')).toBeInViewport({ ratio: 0.2 });
          await expect(bottom).toBeInViewport({ ratio: 0.9 });
          await expect(journey.locator('svg')).toHaveAttribute('data-state', 's' + slide.scene);
          const [art, bottomNav, explanation] = await Promise.all([figure.boundingBox(), bottom.boundingBox(), panel.boundingBox()]);
          expect(art!.y + art!.height).toBeLessThanOrEqual(bottomNav!.y);
          expect(bottomNav!.y + bottomNav!.height).toBeLessThanOrEqual(explanation!.y);
          expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
          expect(explanation!.height).toBeLessThanOrEqual(viewport.height * 0.43 + 1);

          if (slide.id === 'S3-2') {
            const vector = figure.locator('svg');
            const motion = await vector.locator('path[data-transfer]').evaluateAll(paths => paths.map(node => {
              const path = node as SVGPathElement;
              const start = path.getPointAtLength(0), end = path.getPointAtLength(path.getTotalLength());
              return { direction: path.dataset.transfer, dx: end.x - start.x, dy: end.y - start.y, marker: getComputedStyle(path).markerEnd };
            }));
            expect(motion.map(item => item.direction)).toEqual(['request', 'response']);
            expect(motion[0][mobile ? 'dy' : 'dx']).toBeGreaterThan(0);
            expect(motion[1][mobile ? 'dy' : 'dx']).toBeLessThan(0);
            for (const arrow of motion) expect(arrow.marker).not.toBe('none');
            if (mobile) {
              const offset = await body.evaluate(element => {
                element.scrollTop = element.scrollHeight;
                return element.scrollTop;
              });
              expect(offset).toBeGreaterThan(0);
              await body.evaluate(element => { element.scrollTop = 0; });
            }
            const out = process.env.B32_V02_QA_OUTPUT;
            if (out) {
              await page.evaluate(() => document.fonts.ready);
              if ((viewport.width === 1280 && theme === 'dark') || (viewport.width === 390 && theme === 'light')) {
                await page.screenshot({ path: join(out, `${viewport.width}-${theme}-api-open-viewport.png`) });
              }
              await page.screenshot({ path: join(out, `${viewport.width}-${theme}-api-open.png`), fullPage: true });
            }
            await page.keyboard.press('Escape');
            await expect(panel).toBeHidden();
            await expect(toggle).toBeFocused();
            if (out) await page.screenshot({ path: join(out, `${viewport.width}-${theme}-api-closed.png`), fullPage: mobile });
            if (mobile) await toggle.tap();
            else await toggle.click();
            await expect(panel).toBeVisible();
          }
          if (index < slides.length - 1) {
            const next = index === 0 ? top.getByRole('button', { name: '다음' }) : bottom.getByRole('button', { name: '다음' });
            if (mobile) await next.tap();
            else await next.click();
          }
        }
        const previous = bottom.getByRole('button', { name: '이전' });
        if (mobile) await previous.tap();
        else await previous.click();
        await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', 'S4-1');
        await expect(panel.getByRole('heading')).toHaveText(slides[6].title);
        await expect(body.locator('p')).toHaveText(slides[6].explanation);
        if (mobile) await close.tap();
        else await close.click();
        await expect(panel).toBeHidden();
        await expect(toggle).toBeFocused();
        await bottom.getByLabel('Scene 선택').selectOption('3');
        await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', 'S3-1');
        await page.reload();
        await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen', 'S3-1');
        await expect(panel).toBeHidden();
        expect(errors).toEqual([]);
      });
    });
  }
}
