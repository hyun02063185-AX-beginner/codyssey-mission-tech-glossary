import { test, expect } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
const source = JSON.parse(readFileSync('data/encyclopedia/missions.json', 'utf8'));
const glossary = JSON.parse(readFileSync('src/data/generated/glossary.json', 'utf8'));
const output = process.env.B31_QA_OUTPUT ? `${process.env.B31_QA_OUTPUT}/mission-entry` : 'reports/mission-learning-entry-ux';
test.use({ hasTouch: true });

test('all 16 missions keep titles, real counts, collapsed categories and canonical links', async ({ page }) => {
  test.setTimeout(60000);
  for (const mission of source.missions) {
    await page.goto(`/#/missions/${mission.aliases.route}`);
    await expect(page.getByRole('heading', { name: mission.titleKo, level: 1 })).toBeVisible();
    await expect(page.locator('.mission-learning-start')).toBeVisible();
    await expect(page.locator('.mission-knowledge')).not.toHaveAttribute('open');
    await expect(page.locator('.mission-term-group')).toHaveCount(3);
    for (const status of ['direct', 'required', 'related']) {
      const matching = glossary.filter(term => term.missionRefs.some(ref => `${ref.course}-${ref.mission.toLowerCase()}` === mission.id && ref.source_status === status));
      const group = page.locator(`[data-term-group="${status}"]`);
      await expect(group).not.toHaveAttribute('open');
      await expect(group.locator('summary')).toContainText(`${matching.length}개 용어`);
      await group.locator('summary').focus(); await page.keyboard.press('Enter');
      await expect(group).toHaveAttribute('open');
      await expect(group.locator('.row')).toHaveCount(matching.length);
      expect(await group.locator('.row').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(matching.map(term => `#/terms/${term.id}`));
      await page.keyboard.press('Space'); await expect(group).not.toHaveAttribute('open');
    }
  }
});

test('real learning paths differ by mission and B3-1 guide/supplement appear once', async ({ page }) => {
  for (const [id, kinds] of [['main-M05', ['story','concepts','guide']], ['main-M03', ['story','concepts','guide']], ['main-M01', ['guide']], ['main-M11', ['story','guide']], ['preliminary-M03', ['interactive']], ['main-M13', []]] as const) {
    await page.goto(`/#/missions/${id}`);
    expect(await page.locator('[data-material]:has(a)').evaluateAll(cards => cards.map(card => card.getAttribute('data-material')))).toEqual(kinds);
    await expect(page.locator('.mission-start-cards>[data-material]')).toHaveCount(3);
    await expect(page.locator('.is-unavailable a')).toHaveCount(0);
    await expect(page.locator('.mission-learning-start')).not.toContainText('검토 시안');
    if (id === 'main-M05') {
      await expect(page.locator('a[href="#/missions/main-M05/guide"]')).toHaveCount(1);
      await expect(page.locator('a[href="#/missions/main-M05/guide?document=supplement"]')).toHaveCount(1);
    }
  }
  await page.locator('.mission-knowledge>summary').click();
  await expect(page.locator('.mission-knowledge')).toHaveAttribute('open');
  await expect(page).toHaveURL(/\/missions\/main-M13$/);
  await expect(page.locator('.mission-encyclopedia')).toBeVisible();
});

test('mission hub preserves 3+13 cards, real recommendations and existing top-level URLs', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '미션으로 학습 시작하기 →' }).click();
  await expect(page.getByRole('heading', { name: '미션 학습', exact: true })).toBeVisible();
  await expect(page.locator('.mission-course .mission-card')).toHaveCount(16);
  await expect(page.locator('.mission-recommendations a')).toHaveCount(5);
  await expect(page.locator('[data-mission="main-m02"] .mission-material-badges span')).toHaveCount(0);
  await expect(page.locator('[data-mission="main-m05"] .mission-material-badges')).toContainText('개념지도');
  for (const [name, href] of [['미션 학습','#/missions'],['학습 지도','#/encyclopedia'],['용어 찾기','#/terms'],['기술 지도','#/maps'],['개념 연결','#/connections'],['웹툰','#/webtoons']]) await expect(page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link', { name, exact: true })).toHaveAttribute('href', href);
  await expect(page.getByRole('navigation', { name: '주요 메뉴' }).getByRole('link')).toHaveCount(6);
});

for (const width of [1280,1000,390,360]) for (const theme of ['forest','indigo','paper','signal']) {
  test(`${width}px ${theme}: learning before knowledge, readable menu and no horizontal overflow`, async ({ page }) => {
    await mkdir(output,{recursive:true});
    await page.setViewportSize({width,height:width>700?900:844});
    await page.emulateMedia({reducedMotion:'reduce'});
    const results=[];
    const routes=[['list','/missions'],['b31','/missions/main-M05'],['b21','/missions/main-M03'],['b61','/missions/main-M11'],['no-guide','/missions/main-M13'],['home','/']];
    for (const [name,path] of routes) {
      await page.goto('/#'+path);await page.getByLabel('화면 테마').selectOption(theme);
      await expect(page.locator('h1').first()).toBeVisible();await page.evaluate(()=>document.fonts.ready);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      if (path.startsWith('/missions/')) {
        const positions=await page.locator('.mission-learning-page').evaluate(root=>({start:root.querySelector('.mission-learning-start')!.getBoundingClientRect().top,knowledge:root.querySelector('.mission-knowledge')!.getBoundingClientRect().top,terms:root.querySelector('.mission-all-terms')!.getBoundingClientRect().top}));
        expect(positions.start).toBeLessThan(positions.knowledge);expect(positions.knowledge).toBeLessThan(positions.terms);
        await expect(page.locator('.mission-knowledge')).not.toHaveAttribute('open');
        results.push({name,...positions});
      }
      if (theme==='forest' || name==='list' || name==='b31') await page.screenshot({path:`${output}/after-${width}-${theme}-${name}.png`,fullPage:true});
    }
    const menu=page.getByRole('navigation',{name:'주요 메뉴'});
    const missionLink=menu.getByRole('link',{name:'미션 학습',exact:true});
    await missionLink.focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/#\/missions$/);
    await menu.getByRole('link',{name:'학습 지도',exact:true}).tap();await expect(page).toHaveURL(/#\/encyclopedia$/);
    await writeFile(`${output}/${width}-${theme}.json`,JSON.stringify(results,null,2)+'\n');
  });
}
