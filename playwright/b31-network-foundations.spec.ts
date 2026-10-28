import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {auditProtectedSources} from '../scripts/protected_source_contract.mjs';
const output=process.env.B31_QA_OUTPUT?`${process.env.B31_QA_OUTPUT}/network-foundations`:'reports/b31-network-foundations';mkdirSync(output,{recursive:true});
const story='/#/missions/main-M05/story-map',scenes=['slide-intro','slide-network','slide-packet','scene-01','scene-02','scene-03a','scene-03b','scene-04'];
test.describe.configure({mode:'parallel'});
for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])for(const theme of ['dark','light'])test(`${width} ${theme}: readable cards, figures, comparison and lecture lifecycle`,async({page})=>{
 test.setTimeout(120000);page.setDefaultTimeout(5000);await page.setViewportSize({width,height});const errors:string[]=[],metrics:unknown[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(story);await expect(page.locator('.mission-story-scenes li')).toHaveCount(8);await expect(page.locator('.mission-presentation')).toHaveCount(0);
 await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
 for(const [index,scene] of scenes.entries()){
  await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);await expect(page.getByLabel('Scene 선택',{exact:true})).toHaveValue(scene);
  if(['slide-network','slide-packet','scene-03b'].includes(scene)){
   if(scene==='scene-03b')await page.getByText('기존 AWS 접속 조건 그림과 기초 비교 더 보기',{exact:true}).click();
   const card=page.locator('[data-foundation-card]');await expect(card).not.toHaveAttribute('open');await expect(card.locator('summary').first()).toHaveCSS('min-height','64px');
   if(scene==='slide-network'&&theme==='dark')await page.screenshot({path:`${output}/${width}-collapsed.png`});
   await card.locator('summary').first().focus();await page.keyboard.press('Enter');await expect(card).toHaveAttribute('open','');
   await expect(card.locator('.b31f-checks li')).toHaveCount(2);
   if(scene==='slide-packet'){
    await expect(page.locator('.b31f-primary .b31f-protocol-note')).toContainText('HTTP · TCP 80');await expect(page.locator('.b31f-primary .b31f-protocol-note')).toContainText('HTTPS · TCP 443');
    await expect(page.locator('.b31f-primary [data-layer="http"]')).toContainText('요청 일부');
    await expect(page.locator('.b31f-primary [data-layer="ip"] > .b31f-fields')).not.toContainText('포트');
   }
   const measured=await card.evaluate(el=>{
    const luminance=(c:string)=>{const v=c.match(/[\d.]+/g)!.slice(0,3).map(Number).map(x=>{x/=255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
    const text=[...el.querySelectorAll('p,code,dt,dd,th,td,caption')].filter(n=>n.getBoundingClientRect().height>0);
    const failures=text.flatMap(n=>{const s=getComputedStyle(n);let p:Element|null=n,bg='';while(p){bg=getComputedStyle(p).backgroundColor;if(!['transparent','rgba(0, 0, 0, 0)'].includes(bg))break;p=p.parentElement;}const a=luminance(s.color),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return ratio<4.5?[{text:n.textContent,ratio}]:[];});
    return {minText:Math.min(...text.map(n=>parseFloat(getComputedStyle(n).fontSize))),overflow:document.documentElement.scrollWidth>innerWidth,contrastFailures:failures,tableOverflow:el.querySelector('.b31f-table-wrap')?el.querySelector('.b31f-table-wrap')!.scrollWidth>el.querySelector('.b31f-table-wrap')!.clientWidth:false};
   });expect(measured.minText).toBeGreaterThanOrEqual(14);expect(measured.overflow).toBe(false);expect(measured.tableOverflow).toBe(false);expect(measured.contrastFailures).toEqual([]);metrics.push({scene,...measured});
   await card.screenshot({path:`${output}/${width}-${theme}-${scene}.png`});
   await card.locator('.b31f-answers>summary').click();await expect(card.locator('.b31f-answers li')).toHaveCount(2);await card.locator('.b31f-answers>summary').click();
   await card.locator('summary').first().focus();await page.keyboard.press('Space');await expect(card).not.toHaveAttribute('open');
  }else await expect(page.locator('[data-foundation-card]')).toHaveCount(0);
  if(['scene-01','scene-02','scene-03a','scene-03b'].includes(scene)){
   const extra:Record<string,string>={'scene-01':'기존 기업망 전체 구조도 더 보기','scene-02':'기존 요청·응답 상세 그림 더 보기','scene-03a':'기존 AWS 역할 비교 그림 더 보기','scene-03b':'기존 AWS 접속 조건 그림과 기초 비교 더 보기'};
   if(scene!=='scene-03b')await page.getByText(extra[scene],{exact:true}).click();
   await page.getByRole('button',{name:'그림 확대하기',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');
   if(scene==='scene-02'){await page.getByRole('button',{name:'요청 강조',exact:true}).click();await expect(page.locator('.b31-story-art [data-flow="R1"]')).toHaveCSS('opacity','0.12');}
  }
  if(index<scenes.length-1)await page.locator('[rel=next]').click();
 }
 await page.getByRole('link',{name:'본과정 B3-1 미션 소개로 돌아가기',exact:true}).click();await expect(page.locator('[data-material="story"]')).toBeVisible();expect(errors).toEqual([]);
 writeFileSync(`${output}/${width}-${theme}-metrics.json`,JSON.stringify({errors,metrics},null,2));
});

test('protects original lesson assets and approved UI inventories while glossary evolves',()=>{
 test.setTimeout(120000);
 // The prior packet branch remains the baseline for content, journey data and playback.
 // Owner-authorized UX changes intentionally edit only PacketJourney.tsx and its CSS.
 const original=auditProtectedSources(process.cwd(),'59b6d22',['src/b31StoryMapContent.ts','drafts/b3-1-visual-story','src/missionConceptMap','data/mission-story-maps/main-m05','src/b31PacketJourney/data.ts','src/b31PacketJourney/usePacketPlayer.ts','data/curated/glossary-master-v0.1.yaml']);
 expect({added:original.added,removed:original.removed,changed:original.changed}).toEqual({added:[],removed:[],changed:[]});
 writeFileSync(`${output}/protected-sources.json`,JSON.stringify({contracts:[original],canonical:'unchanged'},null,2));
});

test('card links keep existing map views and Story return; presentation stays off maps',async({page})=>{
 for(const scene of ['slide-network','slide-packet','scene-03b']){
  await page.goto(story+'?scene='+scene);if(scene==='scene-03b')await page.getByText('기존 AWS 접속 조건 그림과 기초 비교 더 보기',{exact:true}).click();await page.locator('.b31f-card>summary').click();await page.locator('.b31f-links a').first().click();
  await expect(page.locator('.map-canvas')).toBeVisible();await expect(page.locator('.mission-presentation')).toHaveCount(0);
  await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);
  if(scene==='scene-03b')await page.getByText('기존 AWS 접속 조건 그림과 기초 비교 더 보기',{exact:true}).click();await page.locator('.b31f-card>summary').click();await page.locator('.b31f-links a[href^="#/terms/"]').first().click();await page.getByRole('link',{name:'← B3-1 개념지도로 돌아가기',exact:true}).click();
  await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',scene);
 }
 await page.locator('.learning-focus-menu summary').click();await page.getByLabel('강의 화면 테마',{exact:true}).selectOption('light');await page.keyboard.press('Escape');await page.reload();await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','light');
});
