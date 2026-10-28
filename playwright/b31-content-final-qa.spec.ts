import { expect, test } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const output = `${process.env.B31_QA_OUTPUT ?? 'reports/b3-1-story-map-integration/content-final-qa'}/web-content`;
const scenes = ['scene-01', 'scene-02', 'scene-03a', 'scene-03b'];
const extra:Record<string,string>={'scene-01':'기존 기업망 전체 구조도 더 보기','scene-02':'기존 요청·응답 상세 그림 더 보기','scene-03a':'기존 AWS 역할 비교 그림 더 보기','scene-03b':'기존 AWS 접속 조건 그림과 기초 비교 더 보기'};

for (const width of [1280, 1000, 390, 360]) for (const theme of ['forest', 'indigo', 'paper', 'signal']) {
  test(`${width}px ${theme}: reviewed B3-1 text, descriptions and original SVG proportions`, async ({ page }) => {
    await mkdir(output, { recursive: true });
    await page.setViewportSize({ width, height: width > 700 ? 900 : 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const results = [];
    for (const scene of scenes) {
      await page.goto(`/#/missions/main-M05/story-map?scene=${scene}`);
      await page.getByText(extra[scene],{exact:true}).click();
      await page.locator('.learning-focus-menu summary').click();
      await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
      const art = page.locator('.b31-story-art svg');
      await expect(art).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect.poll(() => page.evaluate(() => document.fonts.check('14px "Pretendard VF"'))).toBe(true);
      const description = art.locator('desc');
      if (scene === 'scene-01' || scene === 'scene-02') {
        await expect(description).toContainText('기업망 보강 자료');
        await expect(art.locator('text').filter({ hasText: '기업망 보강 자료' })).toHaveCount(1);
        await page.locator('.b31-slide-links summary').click();
        await expect(page.getByRole('link', { name: '기존 기업망 보강 자료 →', exact: true })).toHaveAttribute('href', /guide\?document=supplement/);
        await expect(art.locator('text').filter({ hasText: /이후 그림|다른 장면/ })).toHaveCount(0);
      }
      if (scene === 'scene-03a') {
        await expect(art.locator('text').filter({ hasText: 'ENI · Private IPv4' })).toHaveCount(1);
        await expect(description).toContainText('EC2에 연결된 ENI(Private IPv4)');
        await expect(description).toContainText('EC2 운영체제는 Private IPv4만');
        await expect(description).toContainText('NAT Gateway는 별도 AWS 서비스');
        await expect(art.locator('[data-caution="4"]')).toContainText('Public IPv4');
        await expect(art.locator('[data-caution="4"]')).toContainText('Private IPv4를 1:1로');
        await expect(art.locator('[data-caution="4"]')).toContainText('NAT Gateway는 별도 AWS 서비스');
      }
      if (scene === 'scene-03b') {
        await expect(art.locator('[data-cond="3"]')).toContainText('0.0.0.0/0 → IGW');
        await expect(art.locator('[data-cond="4"]')).toContainText(/EC2는 (?:Subnet 안의 )?Private IPv4만/);
        await expect(description).toContainText('요청이 지나가는 장비가 아니라 설정');
        await expect(description).toContainText('HTTP 80');
        if (await page.locator('.b31-art-frame').getAttribute('data-layout') === 'desktop') {
          await expect(art.locator('text').filter({ hasText: 'Route Table의 0.0.0.0/0 → IGW 경로가 응답이 VPC 밖으로' })).toHaveCount(1);
          await expect(art.locator('text').filter({ hasText: '요청과 응답이 오갈 수 있습니다' })).toHaveCount(1);
        } else {
          await expect(art.locator('[data-cond="3"]')).toContainText('이 표를 Subnet에 연결');
          await expect(art.locator('text').filter({ hasText: '응답은 같은 연결의 반대 방향' })).toHaveCount(1);
        }
      }
      const metrics = await art.evaluate(element => {
        const svg = element as SVGSVGElement;
        const box = svg.viewBox.baseVal, rect = svg.getBoundingClientRect();
        const texts = [...svg.querySelectorAll('text')].map(text => {
          const b = text.getBBox();
          return { text: text.textContent, x: b.x, y: b.y, width: b.width, height: b.height, font: getComputedStyle(text).fontFamily };
        });
        const ids = (svg.getAttribute('aria-labelledby') ?? '').split(/\s+/);
        const descriptionReferencesResolve = ids.length === 2 && ids.every(id => svg.querySelector(`[id="${id}"]`)?.textContent);
        return { viewBox: { width: box.width, height: box.height }, rendered: { width: rect.width, height: rect.height },
          ratioError: Math.abs(rect.height / rect.width - box.height / box.width),
          descriptionReferencesResolve, outsideViewBox: texts.filter(t => t.x < 0 || t.y < 0 || t.x + t.width > box.width + .5 || t.y + t.height > box.height + .5),
          textCount: texts.length,
          reviewedTextBounds: texts.filter(text => /기업망 보강 자료|ENI · Private IPv4|IGW가 Public|Private IPv4를 1:1|NAT Gateway는 별도|Route Table의 0\.0\.0\.0|요청과 응답이 오갈|VPC 10\.0\.0\.0|통신 허용을 뜻하지|← 왼쪽 두 선/.test(text.text ?? '')),
          fontLoaded: document.fonts.check('14px "Pretendard VF"') };
      });
      expect(metrics.ratioError).toBeLessThan(.002);
      expect(metrics.descriptionReferencesResolve).toBeTruthy();
      expect(metrics.outsideViewBox).toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      results.push({ scene, ...metrics });
      if (theme === 'forest') {
        await page.locator('.b31-art-frame').screenshot({ path: `${output}/${width}-${scene}-figure.png` });
        await page.screenshot({ path: `${output}/${width}-${scene}-page.png`, fullPage: true });
      }
      if (width <= 390 && (scene === 'scene-03a' || scene === 'scene-01')) {
        const target = art.locator('text').filter({ hasText: scene === 'scene-03a' ? 'VPC 10.0.0.0/16' : '← 왼쪽 두 선' }).first();
        await target.scrollIntoViewIfNeeded();
        const clip = await target.evaluate(element => {
          const rect = element.getBoundingClientRect();
          const y = Math.max(0, rect.top - 24);
          return { x: Math.max(0, rect.left - 16), y,
            width: Math.min(innerWidth - Math.max(0, rect.left - 16), rect.width + 32), height: Math.min(innerHeight - y, rect.height + 48) };
        });
        await page.screenshot({ path: `${output}/${width}-${theme}-${scene}-warning-context.png`, clip });
      }
    }
    await writeFile(`${output}/${width}-${theme}.json`, JSON.stringify(results, null, 2) + '\n');
  });
}
