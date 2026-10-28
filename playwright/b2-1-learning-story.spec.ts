import { expect, test, type Page } from '@playwright/test';
import {readFileSync} from 'node:fs';

const story='/#/missions/main-M03/story';
const canonicalIds=new Set(JSON.parse(readFileSync('data/curated/glossary-master-v0.1.yaml','utf8')).terms.map((term:{id:string})=>term.id));
async function step(page:Page,scene:string,address:string,text:string){
  await page.goto(`${story}?scene=${scene}&step=${address}`);
  await expect(page.locator('#pos')).toContainText(`Scene ${scene} ·`);
  await expect(page.locator('#say')).toContainText(text);
}
async function relatedTerms(page:Page,ids:string[]){
  await page.locator('#noteBtn').click();
  const notes=page.getByTestId('learning-notes');
  await notes.locator('summary').click();
  for(const id of ids){
    expect(canonicalIds.has(id),id+' canonical destination').toBe(true);
    await expect(notes.locator(`[data-term-id="${id}"] a`)).toBeVisible();
    await expect(notes.locator(`[data-term-id="${id}"] a`)).toHaveAttribute('href',new RegExp(`^#/terms/${id}\\?`));
  }
  await page.locator('#note-close').click();
}

test('B2-1 mission card opens the private story and returns to the mission', async ({ page }) => {
  await page.goto('/#/missions/main-M03');
  const entry=page.locator('.mission-learning-start');
  await expect(entry).toBeVisible();
  await expect(entry).toContainText('미션 스토리');
  await expect(entry).not.toContainText('검토 시안');
  await entry.getByRole('link',{name:'미션 스토리 시작 →',exact:true}).click();
  await expect(page).toHaveURL(/#\/missions\/main-M03\/story$/);
  await expect(page.getByRole('heading',{name:'B2-1 — 명령 한 줄부터 개념지도까지',level:1})).toBeVisible();
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(8);
  await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();
  await expect(page).toHaveURL(/scene=01&step=1$/);
  await expect(page.locator('#pos')).toContainText('Scene 01 · 1 /');
  const initial=await page.locator('#say').innerText();
  await page.locator('#next').click();
  await expect(page).toHaveURL(/scene=01&step=2$/);
  await expect(page.locator('#pos')).toContainText('Scene 01 · 2 /');
  await expect(page.locator('#say')).not.toHaveText(initial);
  await page.locator('.learning-focus-menu summary').click();
  await page.getByRole('link',{name:'강의 소개 보기',exact:true}).click();
  await expect(page.locator('.mission-story-overview')).toBeVisible();
  await page.locator('.learning-focus-back').click();
  await expect(page).toHaveURL(/#\/missions\/main-M03$/);
  await expect(entry).toBeVisible();
  await page.goto('/#/missions/main-M02');
  await expect(page.locator('.b21-story-entry')).toHaveCount(0);
  await page.goto('/#/missions/preliminary-M03');
  await expect(page.locator('.learning-story')).toBeVisible();
  await expect(page.locator('.b21-story-entry')).toHaveCount(0);
});

test('B2-1 story supports direct access and links all eight scenes to existing terms', async ({ page }) => {
  await page.goto(story);
  await expect(page.locator('.mission-story-scenes li')).toHaveCount(8);
  const links=await page.locator('.mission-story-scenes a').evaluateAll(els=>els.map(el=>el.getAttribute('href')));
  expect(links.map(href=>new URLSearchParams(href!.split('?')[1]).get('scene'))).toEqual(['01','02','03','04','05','06','07','08']);
  await step(page,'05','iter','값을 꺼내는 일은 Iterator가 맡습니다');
  const address=page.url();await page.reload();
  await expect(page).toHaveURL(address);
  await expect(page.locator('#pos')).toContainText('Scene 05 · 3 /');
  await relatedTerms(page,['iterator','generator','yield']);
  await step(page,'06','pass','함수도 숫자나 글자처럼');
  await relatedTerms(page,['decorator','function']);
  await step(page,'07','1','기대하는지 적어 두는 표시');
  await relatedTerms(page,['type-hint']);
});

test('iterator and generator steps explain next, yield, resume and termination', async ({ page }) => {
  // The approved story teaches these states through steps, not two live iterators.
  await step(page,'05','next1','어디까지 꺼냈는지 기억합니다');
  await expect(page.locator('#stage')).toContainText('사과');
  await page.locator('#next').click();
  await expect(page).toHaveURL(/step=next2$/);
  await expect(page.locator('#say')).toContainText('기억해 둔 위치 다음의 값');
  await step(page,'05','iterend','원래 리스트는 그대로 남아 있습니다');
  await step(page,'05','gen','요청이 올 때마다 하나씩 만들어');
  await step(page,'05','give','yield는 Generator가 값을 하나 건네는 자리');
  await page.locator('#next').focus();await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/step=pause$/);
  await expect(page.locator('#say')).toContainText('잠시 멈추고 다음 요청을 기다립니다');
  await step(page,'05','resume','처음부터 다시 시작하지 않고');
  await step(page,'05','end','건넬 기록이 더 없으면 Generator는 끝납니다');
  await step(page,'05','list','모든 기록이 메모리에 쌓입니다');
  await step(page,'05','keep','받은 값을 어떻게 보관하는지');
});

test('decorator steps distinguish normal and LedgerError return paths', async ({ page }) => {
  await step(page,'06','deco','원래 기능을 그대로 두고');
  await step(page,'06','ok','정해 둔 정상 결과');
  await step(page,'06','err','정해 둔 종류의 오류');
  await step(page,'06','real','LedgerError 계열 오류만');
  await expect(page.locator('#stage')).toContainText('handle_errors');
  await expect(page.locator('#stage')).toContainText('종료 코드 0');
  await expect(page.locator('#stage')).toContainText('종료 코드 1');
  await expect(page.locator('#stage')).toContainText('그 밖의 오류');
  await expect(page.locator('#say')).toContainText('그 밖의 오류는 그대로 드러냅니다');
});

test('type hint steps separate static information from runtime validation', async ({ page }) => {
  await step(page,'07','1','기대하는지 적어 두는 표시');
  await expect(page.locator('#stage')).toContainText('int');
  await step(page,'07','3','Type Hint만 보고 잘못된 값을 막지 않습니다');
  await step(page,'07','6','Type Hint가 이 값을 막지는 않습니다');
  await step(page,'07','7','int라는 기대에는 맞지만');
  await expect(page.locator('#say')).toContainText('금액은 0보다 커야');
  await step(page,'07','10','변환 단계에서 멈춥니다');
  await step(page,'07','11','금액 규칙 검사에서 거부됩니다');
  await step(page,'07','12','0보다 큰 정수인지 실제로 검사합니다');
  await expect(page.locator('#stage')).toContainText('validate_amount()');
});

test('B2-1 story remains readable without viewport overflow in every theme', async ({ page }) => {
  await page.setViewportSize({width:375,height:812});
  for(const route of [story,`${story}?scene=05&step=gen`]){
    await page.goto(route);
    for(const theme of ['forest','indigo','paper','signal']){
      await page.locator('.learning-focus-menu summary').click();
      await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);
      await page.keyboard.press('Escape');
      await expect(page.locator('html')).toHaveAttribute('data-accent-theme',theme);
      await expect(page.locator(route===story?'.mission-story-overview':'.b21t')).toBeVisible();
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),theme).toBeLessThanOrEqual(1);
    }
  }
});
