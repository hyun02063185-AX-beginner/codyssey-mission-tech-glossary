import { chromium, expect } from '@playwright/test';
import { createServer } from 'vite';
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,'node_modules/.cache/b21-u4');
await mkdir(output,{recursive:true});
let ownServer;
try{if(!(await fetch('http://127.0.0.1:4179/')).ok)throw Error('Unavailable');}
catch{ownServer=spawn(process.execPath,[resolve(root,'scripts/b21_preview.mjs')],{cwd:root,stdio:'ignore'});let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4179/')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Preview unavailable');}
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {termConnections,extensionNotice}=await loader.ssrLoadModule('/src/b21StoryV3/links/catalog.ts');
const {termStoryHref}=await loader.ssrLoadModule('/src/b21StoryV3/links/returnAddress.ts');
const {scenes}=await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');
await loader.close();
const glossary=JSON.parse(await readFile(resolve(root,'src/data/generated/glossary.json'),'utf8'));
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],external=[],passed=[],styleIsolation=[];
context.on('page',p=>p.on('pageerror',e=>errors.push(e.stack)));page.on('pageerror',e=>errors.push(e.stack));
page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith('http://127.0.0.1:4179/'))external.push(r.url());});
const base='http://127.0.0.1:4179/?view=v3-links#',story='/missions/main-M03/story';
let checks=0,status='RUNNING';const check=(ok,label)=>{if(!ok)throw Error(label);checks++;};
const pos=async(scene,step)=>{await expect(page.locator('#pos')).toContainText(`Scene ${scene} · ${step} /`);checks++;};
const open=async(hash)=>{await page.goto(base+hash);await page.reload();};
const sourceOpen=(scene,step,back='')=>open(`${story}?scene=${scene}&step=${step}${back}`);
const termLink=id=>page.locator(`.b21-u4-terms [href^="#/terms/${id}?"]`);
const returnLink=()=>page.getByRole('link',{name:/← B2-1 Story로 돌아가기/});
try{
  for(const term of termConnections){
    const source=term.sources[0],scene=scenes.find(s=>s.id===source.scene),index=scene.addressing==='id'?scene.steps.findIndex(t=>t.id===source.step):Number(source.step)-1;
    await sourceOpen(source.scene,source.step);await pos(source.scene,index+1);
    const row=page.locator(`.b21-u4-terms [data-term-id="${term.termId}"]`);
    if(term.mode==='extension')await expect(row).toContainText(extensionNotice);else await expect(row.locator('.b21-u4-extension')).toHaveCount(0);
    const href=await termLink(term.termId).getAttribute('href');check(!href.includes('%25')&&!href.includes('presenter'),term.termId+' single encoding');
    await termLink(term.termId).click();
    await expect(page.locator('main article h1')).toHaveText(glossary.find(t=>t.id===term.termId).termKo);
    await expect(returnLink()).toBeVisible();
    if(term.termId==='iterator'){await page.reload();await expect(returnLink()).toBeVisible();}
    await returnLink().click();await pos(source.scene,index+1);await expect(page.locator('#q')).toBeFocused();
  }
  passed.push('18 actual app term pages, direct/extension notices, single encoding, exact return and refresh');
  await sourceOpen('08','6');await pos('08',6);
  await termLink('generator').click();await page.reload();await returnLink().click();await pos('08',6);
  await page.locator('[data-focus-key="rev-05-iterable"]').click();await pos('05',2);
  await expect(page).toHaveURL(/scene=05&step=iterable&back=6$/);
  await termLink('iterator').click();await page.reload();await returnLink().click();await pos('05',2);
  await expect(page).toHaveURL(/scene=05&step=iterable&back=6$/);
  for(let i=0;i<2;i++){
    await page.goBack();await expect(returnLink()).toBeVisible();await page.goBack();await pos('05',2);
    await page.goForward();await expect(returnLink()).toBeVisible();await page.goForward();await pos('05',2);
  }
  await page.locator('#backMap').click();await pos('08',6);
  passed.push('Scene 08-6 direct term return; map -> Scene 05 review -> term reload -> semantic/back return -> map; history x2');
  const valid=termStoryHref('iterator',{scene:4,step:1,back:6,presenter:false});
  await open(valid+'&b31-map=node%3Dvpc');await expect(page.getByRole('link',{name:'← B3-1 개념지도로 돌아가기'})).toBeVisible();await expect(returnLink()).toHaveCount(0);
  check((await page.getByRole('link',{name:'← B3-1 개념지도로 돌아가기'}).getAttribute('href')).includes('/missions/main-M05/story-map/concepts?node=vpc'),'unchanged B31 destination');
  for(const bad of ['https://evil.test','scene=99&step=1','scene=05&step=oops','scene=05&step=iterable&back=18','scene%3D05%26step%3Diterable','scene=05&step=iterable&b21-story=x','scene=05&step=iterable&view=presenter']){
    await open('/terms/iterator?'+new URLSearchParams({'b21-story':bad}));await expect(page.locator('main article h1')).toHaveText('Iterator');await expect(returnLink()).toHaveCount(0);
  }
  passed.push('unsafe/external/nested/double encoded contexts rejected; real B31 banner priority and destination');
  const guideHrefs=new Set();
  for(const scene of scenes){
    await sourceOpen(scene.id,scene.addressing==='id'?scene.steps[0].id:'1');
    const links=page.locator('.b21-u4-panel a[href*="/guide/"]');
    for(const href of await links.evaluateAll(es=>es.map(e=>e.getAttribute('href'))))guideHrefs.add(href);
  }
  for(const href of guideHrefs){await open(href.replace(/^#/,''));await expect(page.locator('.mission-guide article h1')).toBeVisible();check(!await page.getByRole('heading',{name:'단원을 찾을 수 없습니다.'}).count(),'actual guide '+href);}
  for(const scene of ['04','05','08']){
    await sourceOpen(scene,scene==='05'?'jsonl':'1');await expect(page.locator('.b21-u4-panel')).toContainText('브라우저 뒤로가기');
    await page.getByRole('link',{name:'데이터·데이터베이스 분야 지도',exact:true}).click();await expect(page.locator('.knowledge-map-page')).toBeVisible();await expect(returnLink()).toHaveCount(0);await page.goBack();await pos(scene,scene==='05'?15:1);
  }
  passed.push('all 8 recommended actual guide chapters; 3 field-map entries, browser-back only');
  for(const width of [1280,390,360]){
    await page.setViewportSize({width,height:900});await sourceOpen('08','6');await pos('08',6);
    await page.getByLabel('배치 후보').selectOption('map');await expect(termLink('generator')).toBeVisible();
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no overflow '+width);
    await termLink('generator').focus();await page.keyboard.press('Enter');await expect(returnLink()).toBeVisible();
    await returnLink().focus();await page.keyboard.press('Enter');await pos('08',6);await expect(page.locator('#q')).toBeFocused();
    await page.getByLabel('배치 후보').selectOption('summary');await expect(page.locator('.b21-u4-panel [role=status]')).toContainText('정리 단계');
    await page.keyboard.press('End');await pos('08',17);await expect(termLink('cli')).toBeVisible();
    await page.screenshot({path:resolve(output,`review-${width}.png`),fullPage:true});
  }
  // Destination styles are lazy-loaded. Verify they cannot alter the lecture on return.
  for(const width of [1280,390,360]){
    const isolated=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
    try{
      const p=await isolated.newPage();p.on('pageerror',e=>errors.push(e.stack));
      await p.goto(base+story+'?scene=08&step=6');await p.locator('#stage > *').first().waitFor();await p.evaluate(()=>document.fonts.ready);await p.mouse.move(0,0);
      const before=await p.locator('#stage').screenshot({animations:'disabled'});
      await p.locator('.b21-u4-panel [data-term-id="generator"] a').click();await p.locator('main article h1').waitFor();
      if(width===390)await p.screenshot({path:resolve(output,'term-390.png')});
      await p.getByRole('link',{name:/← B2-1 Story로 돌아가기/}).click();await p.locator('#stage > *').first().waitFor();await p.evaluate(()=>document.fonts.ready);await p.mouse.move(0,0);
      const after=await p.locator('#stage').screenshot({animations:'disabled'});
      styleIsolation.push({width,stageByteIdentical:before.equals(after)});check(before.equals(after),'destination CSS isolation '+width);
      if(width===390)await p.locator('.b21-u4-panel').screenshot({path:resolve(output,'context-panel-390.png')});
    }finally{await isolated.close();}
  }
  passed.push('fresh-context lecture bitmap unchanged after actual destination CSS loads at all three widths');
  await page.goto('http://127.0.0.1:4179/');await page.getByRole('button',{name:'U4 연결 검토',exact:true}).click();await expect(page.frameLocator('iframe').getByRole('heading',{name:/U4 연결 검토 · 비공개/})).toBeVisible();
  passed.push('private Owner entry, candidate placements, keyboard round trips and focus at 1280/390/360');
  check(!errors.length,'browser errors '+errors.join(';'));check(!external.length,'external requests '+external.join(';'));status='PASS';
}catch(e){status='FAIL';errors.push(e.stack);process.exitCode=1;}
finally{await writeFile(resolve(output,'results.json'),JSON.stringify({status,browser:browser.version(),checks,passed,errors,external,styleIsolation},null,2));console.log(JSON.stringify({status,checks,passed,errors}));await context.close();await browser.close();if(ownServer)ownServer.kill('SIGTERM');}
