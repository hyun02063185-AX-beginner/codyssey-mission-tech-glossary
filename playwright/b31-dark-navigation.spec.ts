import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {measureB31Text} from '../scripts/b31_story_contrast.mjs';
const out=process.env.B31_QA_OUTPUT?`${process.env.B31_QA_OUTPUT}/dark-navigation`:'reports/b31-dark-navigation';mkdirSync(out,{recursive:true});
const story='/#/missions/main-M05/story-map',scenes=['slide-intro','slide-network','slide-packet','scene-01','scene-02','scene-03a','scene-03b','scene-04'];
test.describe.configure({mode:'parallel'});
for(const [width,height] of [[1280,720],[1000,720],[390,844],[360,800]])for(const theme of ['dark','light'])test(`${width} ${theme}: all lecture text, site palettes and top traversal`,async({page})=>{
 test.setTimeout(150000);await page.setViewportSize({width,height});const errors:string[]=[],rows:unknown[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(t=>localStorage.setItem('codyssey-presentation-theme',t),theme);
 for(const site of ['forest','indigo','paper','signal'])for(const [index,scene] of scenes.entries()){
  await page.goto(story+'?scene='+scene);await page.locator('.b31-story-page').waitFor();await page.evaluate(()=>document.fonts.ready);
  await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption(site);
  const menuAudit=await page.locator('.learning-focus-nav').evaluate(measureB31Text);expect(menuAudit.failures).toEqual([]);await page.keyboard.press('Escape');
  await page.locator('.b31-story-page details').evaluateAll(es=>es.forEach(e=>e.open=true));
  const audit=await page.locator('[data-learning-page=b31-story]').evaluate(measureB31Text);expect(audit.failures).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
  const nav=page.getByRole('navigation',{name:'강의 슬라이드 이동'});await expect(nav).toContainText(`Slide ${index+1} / 8`);await expect(nav).toContainText(await page.locator('#b31-scene-title').innerText());
  if(index===0)await expect(nav.getByRole('button',{name:'이전 슬라이드'})).toBeDisabled();else await expect(nav.getByRole('link',{name:'이전 슬라이드'})).toHaveAttribute('href',new RegExp(`scene=${scenes[index-1]}`));
  if(index===scenes.length-1)await expect(nav.getByRole('button',{name:'다음 슬라이드'})).toBeDisabled();else await expect(nav.getByRole('link',{name:'다음 슬라이드'})).toHaveAttribute('href',new RegExp(`scene=${scenes[index+1]}`));
  if(site==='forest'){
   rows.push({width,theme,site,scene,minimum:audit.minimum,samples:audit.samples.length,failures:audit.failures,menuMinimum:menuAudit.minimum});
   if(scene==='scene-02'){
    await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${out}/after-${width}-${theme}-top.png`});
    await page.locator('.b31-slide-main').screenshot({path:`${out}/after-${width}-${theme}-reading.png`});
    await nav.scrollIntoViewIfNeeded();await page.screenshot({path:`${out}/after-${width}-${theme}-navigation.png`});
    await page.getByRole('button',{name:'그림 확대하기',exact:true}).click();
    const dialogAudit=await page.getByRole('dialog').evaluate(measureB31Text);expect(dialogAudit.failures).toEqual([]);
    rows.push({width,theme,site,scene,dialogMinimum:dialogAudit.minimum});await page.keyboard.press('Escape');
   }
  }else rows.push({width,theme,site,scene,minimum:audit.minimum,samples:audit.samples.length,menuMinimum:menuAudit.minimum});
 }
 // Actual forward/back traversal preserves the existing map context and the heading focus.
 const map='view=aws&more=1&node=aws%3Avpc';await page.goto(story+'?scene=slide-intro&map='+encodeURIComponent(map));
 const nav=page.getByRole('navigation',{name:'강의 슬라이드 이동'});
 for(const scene of scenes.slice(1)){
  await nav.getByRole('link',{name:'다음 슬라이드'}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);await expect(page.locator('#b31-scene-title')).toBeFocused();await expect(page.locator('#b31-scene-title')).toBeInViewport({ratio:1});
  expect(new URLSearchParams(new URL(page.url()).hash.split('?')[1]).get('map')).toBe(map);
 }
 for(const scene of [...scenes].reverse().slice(1)){await nav.getByRole('link',{name:'이전 슬라이드'}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);}
 await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-03b');await page.reload();await expect(nav).toContainText('Slide 7 / 8');
 await nav.getByRole('link',{name:'다음 슬라이드'}).click();await page.goBack();await expect(nav).toContainText('Slide 7 / 8');await page.goForward();await expect(nav).toContainText('Slide 8 / 8');
 // Both presentation directions update in-place; map context and site palette stay intact.
 const address=page.url();await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme==='dark'?'light':'dark');await page.keyboard.press('Escape');expect(page.url()).toBe(address);
 const switched=await page.locator('[data-learning-page=b31-story]').evaluate(measureB31Text);expect(switched.failures).toEqual([]);
 await page.getByRole('link',{name:'← 이전 선택으로 개념지도 돌아가기'}).click();await expect(page.locator('.map-node.is-selected')).toHaveAttribute('data-map-node','aws:vpc');await expect(page.locator('.mission-presentation')).toHaveCount(0);
 expect(errors).toEqual([]);writeFileSync(`${out}/${width}-${theme}-audit.json`,JSON.stringify({errors,rows},null,2));
});
