import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/mission-stories/main-m06/_tools/screens.json','utf8')) as {screens:{id:string;scene:string;desktop:string[];journey:string;technology:string}[]};
test.describe.configure({mode:'parallel'});
const out=process.env.B32_QA_OUTPUT??'reports/b32-story-web';mkdirSync(out,{recursive:true});
const story='/missions/main-M06/story';
for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])for(const site of ['forest','indigo','paper','signal'])for(const os of ['light','dark'] as const)test(`${width} ${site} ${os}`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme:os,reducedMotion:'reduce'});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/#/missions/main-M06');await expect(page.locator('[data-material=concepts]')).toContainText('준비 중');
 const guide=page.locator('[data-material=guide] a');await expect(guide).toHaveAttribute('href',/Codyssey_B3-2\/tree\/be21c49.*\/docs\/learning\//);await expect(guide).toHaveAttribute('target','_blank');
 await page.locator('[data-material=story] a').click();await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption(site);await page.keyboard.press('Escape');
 if(site==='forest'&&os==='light')await page.screenshot({path:`${out}/${width}-intro.png`,fullPage:true});
 await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 const metrics=[];
 for(const theme of ['dark','light']){
  await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
  for(const [index,screen] of source.screens.entries()){
   await page.goto(`/#${story}?scene=${screen.scene}&screen=${screen.id.split('-')[1]}`);
   await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen',screen.id);await expect(page.locator('.mission-story-overview')).toHaveCount(0);
   await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme',theme);
   const figure=page.locator('.b32-figure svg');await expect(figure).toBeVisible();await expect(figure).toHaveAttribute('data-state',screen.desktop[1]);
   expect(await figure.evaluate(el=>el.getBoundingClientRect().height)).toBeGreaterThan(100);
   await expect(page.locator('.b32-journey svg')).toHaveAttribute('data-state',screen.journey);
   expect(await page.locator('.b32-journey').evaluate(el=>el.getBoundingClientRect().height)).toBeLessThanOrEqual(50);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await page.evaluate(()=>document.fonts.ready);
   await expect(page.locator('.b32-technology')).toHaveText(screen.technology);
   const top=page.getByRole('navigation',{name:'슬라이드 상단 탐색'}),bottom=page.getByRole('navigation',{name:'B3-2 강의 조작'});
   await expect(top.getByLabel('현재 슬라이드')).toHaveText(`${index+1} / 8`);
   for(const nav of [top,bottom]){
    await expect(nav.getByRole('button',{name:'이전',exact:true})).toBeEnabled({enabled:index>0});
    await expect(nav.getByRole('button',{name:'다음',exact:true})).toBeEnabled({enabled:index<7});
    for(const button of await nav.getByRole('button').all())expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
   }
   const minPx=await figure.evaluate(svg=>{
    const scale=svg.getBoundingClientRect().width/(svg as SVGSVGElement).viewBox.baseVal.width;
    const visible=(element:Element)=>{for(let node:Element|null=element;node&&node!==svg;node=node.parentElement)if(getComputedStyle(node).display==='none')return false;return true;};
    return Math.min(...[...svg.querySelectorAll('text')].filter(text=>text.getComputedTextLength()>0&&visible(text)).map(text=>Number(text.getAttribute('font-size'))*scale));
   });
   expect(minPx).toBeGreaterThanOrEqual(14);
   const box=await figure.boundingBox();metrics.push({theme,id:screen.id,minPx,...box});
   if(width>=900)expect(await bottom.evaluate(el=>el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(height);
   if(site==='forest'&&os==='light')await page.screenshot({path:`${out}/${width}-${theme}-${screen.id}.png`,fullPage:width<900});
   if(index===6){await page.getByText('실제 COMMIT·PR 출력 전문',{exact:true}).click();const blocks=page.locator('.b32-review details[open] pre');await expect(blocks).toHaveCount(2);await expect(blocks.first()).toContainText('docs/learning/02-python-ai-api.md 파일 끝에 실습 메모를 추가하여');await expect(blocks.last()).toContainText('## How to Test');await page.getByText('실제 COMMIT·PR 출력 전문',{exact:true}).click();}
  }
  await page.reload();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme',theme);
 }
 await page.getByLabel('Scene 선택',{exact:true}).selectOption('2');await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen','S2-1');
 const top=page.getByRole('navigation',{name:'슬라이드 상단 탐색'}),bottom=page.getByRole('navigation',{name:'B3-2 강의 조작'});
 await top.getByRole('button',{name:'다음',exact:true}).focus();await page.keyboard.press('Enter');await expect(page).toHaveURL(/scene=2&screen=2$/);
 await bottom.getByRole('button',{name:'이전',exact:true}).click();await expect(page).toHaveURL(/scene=2&screen=1$/);
 await bottom.getByRole('button',{name:'다음',exact:true}).click();await expect(page).toHaveURL(/scene=2&screen=2$/);
 await top.getByRole('button',{name:'이전',exact:true}).click();await expect(page).toHaveURL(/scene=2&screen=1$/);
 await bottom.getByRole('button',{name:'다음',exact:true}).click();await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen','S2-2');await expect(page.locator('#b32-message')).toBeFocused();await page.keyboard.press('ArrowLeft');await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen','S2-1');
 await page.getByText('발표자 노트 · 강사 스크립트',{exact:true}).click();await expect(page.locator('.b32-review details[open]')).toContainText('실행할 프로그램과 명령을 Python 리스트로 전달한다');await expect(page.locator('.b32-review details[open]')).toContainText('shell=False');
 await page.getByText('관련 용어사전 · 학습가이드',{exact:true}).click();await page.locator('.b32-links a').first().click();await expect(page.locator('h1')).toBeVisible();await page.getByRole('link',{name:'← B3-2 스토리의 이전 화면으로 돌아가기'}).click();await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen','S2-1');
 await page.goto(`/#${story}?scene=4&screen=bad`);await expect(page.locator('.b32-lesson')).toHaveAttribute('data-screen','S4-1');await expect(page.getByRole('status')).toContainText('복구');
 expect(errors).toEqual([]);if(site==='forest'&&os==='light')writeFileSync(`${out}/${width}-metrics.json`,JSON.stringify(metrics,null,2));
});
