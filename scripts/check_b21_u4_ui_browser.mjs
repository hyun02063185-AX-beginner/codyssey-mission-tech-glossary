import { chromium, expect } from '@playwright/test';
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,'node_modules/.cache/b21-u4-b');
await mkdir(output,{recursive:true});
let ownServer;
try{if(!(await fetch('http://127.0.0.1:4179/')).ok)throw Error('Unavailable');}
catch{ownServer=spawn(process.execPath,[resolve(root,'scripts/b21_preview.mjs')],{cwd:root,stdio:'ignore'});let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4179/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Preview unavailable');}
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {scenes,lectureAreas}=await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');
const {termConnections,guideConnections}=await loader.ssrLoadModule('/src/b21StoryV3/links/catalog.ts');
await loader.close();
const areaTerms=[['cli'],['module','repository-pattern','layered-architecture'],['crud','summary-aggregation'],['persistence','file-io','json-lines','csv'],['iterator','generator','yield'],['decorator','function','exception-handling'],['type-hint','input-validation']];
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],passed=[],visuals=[];
page.on('pageerror',e=>errors.push(e.stack));
const origin='http://127.0.0.1:4179/',path='/missions/main-M03/story',base=origin+'?view=v3-links#';
let checks=0,status='RUNNING';const check=(value,label)=>{if(!value)throw Error(label);checks++;};
const pos=async(scene,step)=>{await expect(page.locator('#pos')).toContainText(`Scene ${scene} · ${step} /`);checks++;};
const open=async(scene,step,back='')=>{await page.goto(`${base}${path}?scene=${scene}&step=${step}${back}`);await page.reload();await page.locator('#stage > *').first().waitFor();};
const ids=locator=>locator.locator('[data-term-id]').evaluateAll(es=>es.map(e=>e.dataset.termId));
const notes=()=>page.getByTestId('learning-notes');
const area=()=>page.getByTestId('learning-area');
const further=()=>page.getByTestId('learning-further');
const back=()=>page.getByRole('link',{name:/← B2-1 Story로 돌아가기/});
const openNotes=async()=>{await page.locator('#noteBtn').click();await expect(page.locator('#note')).toHaveClass(/on/);await notes().locator('summary').focus();};
async function appSnapshot(p){return p.locator('.b21t .app').evaluate(el=>{
  const root=el.getBoundingClientRect();const r=n=>{const b=n.getBoundingClientRect();return [b.x-root.x,b.y-root.y,b.width,b.height].map(v=>Math.round(v*64)/64);};
  return {text:el.textContent,box:[root.width,root.height],nodes:['#q','#stage','#say','.ctl'].map(selector=>{const n=el.querySelector(selector),s=getComputedStyle(n);return {selector,rect:r(n),font:s.font,color:s.color,background:s.backgroundColor};})};
});}
try{
  await open('01','1');
  for(const [scene,s] of scenes.entries())for(const [step] of s.steps.entries()){
    await pos(s.id,step+1);
    const selected=scene===7&&step>=1&&step<=7;
    const expected=scene===7?(selected?areaTerms[step-1]:[]):termConnections.filter(t=>t.sources.some(a=>a.scene===s.id)).map(t=>t.termId);
    check(JSON.stringify(await ids(notes()))===JSON.stringify(expected),s.id+':'+(step+1)+' notes subset');
    await expect(area()).toHaveCount(selected?1:0);checks++;
    await expect(further()).toHaveCount(step===s.steps.length-1?1:0);checks++;
    if(selected)check(JSON.stringify(await ids(area()))===JSON.stringify(expected),'selected area exact subset');
    if(step===s.steps.length-1){const hrefs=await further().locator('a[href*="/guide/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href').split('/').pop()));check(JSON.stringify(hrefs)===JSON.stringify(guideConnections[s.id]),'approved summary chapters '+s.id);}
    if(scene!==7||step!==s.steps.length-1)await page.locator('#next').click();
  }
  passed.push('all 128 steps: scene notes, exact selected-area subsets, guide eligibility and 8 summaries');
  for(const width of [1280,390,360]){
    await page.setViewportSize({width,height:width===1280?720:800});
    const before=await context.newPage();await before.setViewportSize({width,height:width===1280?720:800});
    // Keep the private banner identical: mobile sticky controls depend on its fractional
    // offset. The unchanged v3 default is separately covered by the 384-screen parity QA.
    await before.goto(origin+'?view=v3-links&layout=external#'+path+'?scene=02&step=11');await before.locator('#stage > *').first().waitFor();await before.evaluate(()=>document.fonts.ready);
    await before.locator('.b21t .app').evaluate(el=>el.scrollIntoView({block:'start'}));
    await before.locator('.b21t .app').screenshot({path:resolve(output,`basic-before-${width}.png`),animations:'disabled'});
    const basic=await appSnapshot(before);await before.locator('#noteBtn').click();await before.locator('#note').screenshot({path:resolve(output,`notes-before-${width}.png`)});
    check(await before.locator('[data-testid^="learning-"]').count()===0,'default preview extension-free '+width);
    await open('02','11');await page.evaluate(()=>document.fonts.ready);
    await page.locator('.b21t .app').evaluate(el=>el.scrollIntoView({block:'start'}));
    await page.locator('.b21t .app').screenshot({path:resolve(output,`basic-after-${width}.png`),animations:'disabled'});
    const integrated=await appSnapshot(page);
    await writeFile(resolve(output,`main-comparison-${width}.json`),JSON.stringify({before:basic,after:integrated},null,2));
    check(JSON.stringify(integrated)===JSON.stringify(basic),'approved main app geometry/typography/content '+width);
    await before.close();
    await openNotes();await expect(notes()).not.toHaveAttribute('open','');await page.keyboard.press('Enter');await expect(notes()).toHaveAttribute('open','');
    await expect(notes()).toContainText('JavaScript 중심');await expect(notes()).toContainText('Python');
    await notes().scrollIntoViewIfNeeded();await page.locator('#note').screenshot({path:resolve(output,`notes-after-${width}.png`)});
    check(await notes().evaluate(el=>el.scrollWidth<=el.clientWidth),'notes content fits '+width);
    const module=notes().locator('[data-term-id="module"] a');await module.focus();await page.keyboard.press('ArrowRight');await pos('02',11);
    await page.keyboard.press('Enter');await expect(page.locator('main article h1')).toHaveText('module');
    await page.screenshot({path:resolve(output,`term-${width}.png`)});
    await back().focus();await page.keyboard.press('Enter');await pos('02',11);await expect(page.locator('#q')).toBeFocused();
    await page.locator('.b21t .app').screenshot({path:resolve(output,`return-${width}.png`)});
    await openNotes();await expect(notes()).not.toHaveAttribute('open','');await page.keyboard.press('Enter');await page.keyboard.press('Enter');await expect(notes()).not.toHaveAttribute('open','');
    await page.keyboard.press('Escape');await expect(page.locator('#noteBtn')).toBeFocused();
    await open('08','1');await expect(area()).toHaveCount(0);check((await ids(notes())).length===0,'unselected map exposes no terms '+width);
    for(const [i,a] of lectureAreas.entries()){
      await page.locator(`[data-focus-key="area-${a.id}"]`).click();await pos('08',i+2);
      check(JSON.stringify(await ids(area()))===JSON.stringify(areaTerms[i]),width+' area '+a.id);
      await expect(area().locator('h2')).toContainText(a.name);
      await page.locator(`[data-focus-key="area-${a.id}"]`).click();await pos('08',1);await expect(area()).toHaveCount(0);
    }
    await page.locator('[data-focus-key="area-t-gen"]').click();await pos('08',6);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'selected area does not overflow '+width);
    await page.screenshot({path:resolve(output,`map-${width}.png`),fullPage:true});
    await area().locator('[data-term-id="generator"] a').click();await page.reload();await back().click();await pos('08',6);await expect(area()).toContainText('Iterator·Generator');
    await page.locator('[data-focus-key="rev-05-iterable"]').click();await pos('05',2);await openNotes();await page.keyboard.press('Enter');
    await notes().locator('[data-term-id="iterator"] a').click();await page.reload();await back().click();await pos('05',2);await expect(page).toHaveURL(/scene=05&step=iterable&back=6$/);await page.locator('#backMap').click();await pos('08',6);
    await open('03','12');await expect(further().locator('a[href*="/guide/"]')).toHaveCount(2);await openNotes();await page.keyboard.press('Enter');await expect(notes()).toContainText('같은 계산 기능의 정의가 아닙니다');await page.keyboard.press('Escape');
    await further().locator('a[href*="02-transaction-crud"]').click();await expect(page.locator('.mission-guide article h1')).toBeVisible();await page.goBack();await pos('03',12);
    await open('04','14');await further().scrollIntoViewIfNeeded();await page.screenshot({path:resolve(output,`summary-${width}.png`),fullPage:true});
    await expect(further()).toContainText('내 프로젝트');await expect(further()).toContainText('브라우저 뒤로가기');
    await further().getByRole('link',{name:/데이터·데이터베이스 분야 지도/}).click();await expect(page.locator('.knowledge-map-page')).toBeVisible();await expect(back()).toHaveCount(0);await page.goBack();await pos('04',14);
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow '+width);
    check(await further().locator('a').evaluateAll(es=>es.every(e=>e.getBoundingClientRect().height>=44)),'44px link controls '+width);
    visuals.push({width,mainAppEquivalent:true,notes:true,map:true,summary:true});
  }
  passed.push('PC/390/360 notes collapse, keyboard/focus, 7 area choices, map/review term returns, guide and map navigation, 44px controls');
  await open('05','check');const popupEvent=context.waitForEvent('page');await page.locator('#presenterBtn').click();const presenter=await popupEvent;
  await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');
  await presenter.getByRole('button',{name:'답 공개 요청',exact:true}).click();await expect(page.locator('#stage .qa .a:visible')).not.toHaveCount(0);
  await presenter.getByRole('button',{name:'다음 단계',exact:true}).click();await pos('05',21);await page.locator('#prev').click();await expect(presenter.locator('h1')).toContainText('· 20 /');await presenter.close();
  await page.getByLabel('검토 UI').selectOption('external');await expect(page.getByLabel('배치 후보')).toBeVisible();await expect(page.locator('.b21-u4-panel')).toBeVisible();
  await page.getByLabel('검토 UI').selectOption('integrated');await expect(page.locator('.b21-u4-panel')).toHaveCount(0);await pos('05',20);
  passed.push('unchanged presenter navigation/reveal in new UI and U4-A comparison toggle without changing lecture position');
  check(errors.length===0,'browser errors '+errors.join(';'));status='PASS';
}catch(e){status='FAIL';errors.push(e.stack);process.exitCode=1;}
finally{await writeFile(resolve(output,'results.json'),JSON.stringify({status,browser:browser.version(),checks,passed,visuals,errors},null,2));console.log(JSON.stringify({status,checks,passed,errors}));await context.close();await browser.close();if(ownServer)ownServer.kill('SIGTERM');}
