// Actual App verification; both graph engines and their original URL contracts are exercised.
import {chromium,expect} from '@playwright/test';
import {preview} from 'vite';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {explorerPanel,explorerSelect} from './b21_explorer_controls.mjs';

const out=resolve(process.env.MISSION_UI_QA_OUT||'reports/mission-ui-standard');await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||'chrome',headless:true});
const results=[],sizes=[[1280,720],[390,844],[360,800]];
let active,checks=0;
const check=(ok,label)=>{if(!ok)throw Error(label);checks++;};
const routes={b2:{intro:'/missions/main-M03',story:'/missions/main-M03/story?scene=08&step=6',map:'/missions/main-M03/story/concepts',canvas:'.b21ce-svg',panel:'.b21ce-panel'},b3:{intro:'/missions/main-M05',story:'/missions/main-M05/story-map?scene=scene-03a',map:'/missions/main-M05/story-map/concepts',canvas:'.map-canvas',panel:'.map-detail-panel'}};
try{
 for(const mode of ['dev','dist']){
  const port=mode==='dev'?4200:4201,server=mode==='dist'?await preview({preview:{host:'127.0.0.1',port,strictPort:true},logLevel:'error'}):null;
  const base=`http://127.0.0.1:${port}/#`;
  try{for(const [width,height] of sizes){
   const context=await browser.newContext({viewport:{width,height},hasTouch:true,reducedMotion:'reduce'}),page=await context.newPage();active=page;page.setDefaultTimeout(15000);
   const errors=[];page.on('pageerror',error=>errors.push(error.message));
   const open=async path=>{await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);};
   const shot=async name=>{if(mode==='dev'&&process.env.MISSION_UI_QA_CAPTURE!=='0')await page.screenshot({path:resolve(out,`${width}-${height}-${name}.png`),animations:'disabled'});};
   const rect=async selector=>page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};});
   const noOverflow=async()=>check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow');
   await open('/terms');await page.getByRole('navigation',{name:'주요 메뉴'}).getByRole('link',{name:'미션 학습',exact:true}).click();
   const destinations=await page.locator('.mission-recommendations a,.mission-card-actions a').evaluateAll(links=>links.map(link=>link.getAttribute('href')));
   check(destinations.length===21&&destinations.every(href=>/^#\/missions\/[^/?]+$/.test(href)),'all 21 card links introduce a mission');
   for(const [id,r] of Object.entries(routes)){
    await page.locator(`.mission-recommendations a[href="#${r.intro}"]`).click();
    await expect(page.locator('.mission-learning-question')).toContainText('핵심 질문');
    await expect(page.locator('.mission-start-cards>li')).toHaveCount(3);await expect(page.locator('.site-header')).toBeVisible();
    await noOverflow();await shot(`${id}-introduction`);
    await page.locator('[data-material="story"] a').click();await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();
    await expect(page.locator('.learning-focus-nav')).toBeVisible();await expect(page.locator('.site-header')).toHaveCount(0);
    if(id==='b2')await expect(page.locator('#pos')).toContainText('Scene 01');
    else await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','slide-intro');
    await open(r.story);await page.reload();
    await expect(page.locator('.learning-focus-nav')).toBeVisible();await shot(`${id}-story`);
    // Use the shared menu from the actual lesson, retaining its approved origin state.
    await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'개념지도',exact:true}).click();
    await expect(page.locator(r.canvas)).toBeVisible();
    if(id==='b3')check(page.url().includes('scene=scene-03a'),'B3 originating scene');
    // The unselected entry is the default map-first surface.
    const contextualMap=page.url();await open(r.map);await expect(page.locator(r.panel)).toBeHidden();
    const plain=await rect(r.canvas),menu=await rect('.learning-focus-nav');
    check(plain.x>=0&&plain.width<=width&&plain.y+plain.height<=height,'Canvas fits viewport');
    check(plain.height>=(width>700?480:480),'Canvas usable height');check(menu.height===44,'compact 44px focus menu');
    await expect(page.locator('.site-header')).toHaveCount(0);await noOverflow();await shot(`${id}-map`);
    const baseline=await context.newPage();await baseline.goto(`http://127.0.0.1:4202/#${r.map}`);await baseline.locator(r.canvas).waitFor();await baseline.evaluate(()=>document.fonts.ready);
    const before=await baseline.locator(r.canvas).evaluate(el=>{const r=el.getBoundingClientRect(),h=document.querySelector('.site-header'),shell=el.parentElement.getBoundingClientRect();return {width:r.width,height:r.height,top:r.y,visibleWidth:Math.max(0,Math.min(r.right,shell.right,innerWidth)-Math.max(r.left,shell.left,0)),visibleHeight:Math.max(0,Math.min(r.bottom,shell.bottom,innerHeight)-Math.max(r.top,shell.top,0)),siteMenuHeight:h?.getBoundingClientRect().height??0};});
    if(mode==='dev'&&process.env.MISSION_UI_QA_CAPTURE!=='0')await baseline.screenshot({path:resolve(out,`${width}-${height}-${id}-before.png`),animations:'disabled'});await baseline.close();
    await page.goto(contextualMap);await page.locator(r.canvas).waitFor();
    if(id==='b2'){
     await explorerSelect(page,'generator');await explorerPanel(page);await expect(page.locator('.b21ce-detail h2')).toHaveText('Generator');
    }else{
     await page.getByRole('button',{name:'탐색 도구 펼치기',exact:true}).click();await page.getByRole('searchbox',{name:'지도에서 찾기'}).fill('VPC');
     await page.locator('.cm-search-results').getByRole('button',{name:/^VPC/}).first().click();await expect(page.locator('[data-map-node="aws:vpc"]')).toHaveClass(/is-selected/);
    }
    const selectedURL=page.url(),detail=await rect(r.canvas);await shot(`${id}-detail`);
    await expect(page.locator('.learning-focus-menu a[aria-current="page"]')).toHaveAttribute('href',new URL(selectedURL).hash);
    const close=()=>id==='b2'?page.getByRole('button',{name:'상세 패널 닫기',exact:true}):page.getByRole('button',{name:'상세 패널 닫기',exact:true});
    await close().click();await expect(page.locator(r.panel)).toBeHidden();
    const closed=await rect(r.canvas);check(width>700?closed.width>detail.width+250:closed.height>detail.height+250,'panel closing returns Canvas space');
    // Full viewport mode retains the URL, focus and selected card.
    const expand=()=>page.locator(id==='b2'?'.b21ce-expand':'.cm-focus-toggle');await expand().click();
    await expect(page.locator(id==='b2'?'.b21ce':'.mission-concept-map')).toHaveClass(id==='b2'?/is-map-focus/:/is-focused/);
    await expect(expand()).toBeFocused();check(page.url()===selectedURL,'full-screen state retained');await shot(`${id}-full`);
    await page.keyboard.press('Escape');await expect(expand()).toBeFocused();
    await expect(page.locator(id==='b2'?'.b21ce':'.mission-concept-map')).not.toHaveClass(id==='b2'?/is-map-focus/:/is-focused/);
    // Actual touch panning on a background area.
    const panBefore=await page.locator(r.canvas).getAttribute('viewBox'),box=await rect(r.canvas),cdp=await context.newCDPSession(page);
    const point={x:Math.round(box.x+3),y:Math.round(box.y+box.height-5)};
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+42,y:point.y-24}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
    await expect(page.locator(r.canvas)).not.toHaveAttribute('viewBox',panBefore);
    if(id==='b2')await explorerPanel(page);else await page.getByRole('button',{name:/설명 다시 열기/}).click();
    // Map -> term -> exact map, then shared Story navigation -> originating scene.
    await page.locator(id==='b2'?'.b21ce-detail [data-term-id="generator"] a':'.cm-term-links a').first().click();
    await expect(page.locator('.site-header')).toBeVisible();await page.reload();
    await page.locator(id==='b2'?'.b21-service-return a':'.b31-context-return a').click();await expect(page).toHaveURL(selectedURL);
    await page.reload();await expect(page).toHaveURL(selectedURL);await page.goBack();await page.goForward();await expect(page).toHaveURL(selectedURL);
    await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'미션 스토리',exact:true}).click();
    if(id==='b2'){await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');await page.locator('.b21-service-return a').click();}
    else{await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-03a');await page.getByRole('link',{name:'← 이전 선택으로 개념지도 돌아가기'}).click();}
    await expect(page).toHaveURL(selectedURL);await noOverflow();
    results.push({mode,mission:id,width,height,status:'PASS',before,after:{canvas:plain,menu,detail,closed}});
    await open('/missions');
   }
   // Availability, guides and existing technical maps remain Standard surfaces.
   for(const path of ['/missions/main-M01','/missions/main-M11','/missions/main-M13','/missions/preliminary-M03','/missions/main-M03/guide','/missions/main-M05/guide','/maps/network-web-protocol?mission=main-m05']){
    await open(path);await expect(page.locator('.site-header')).toBeVisible();await expect(page.locator('.is-unavailable a')).toHaveCount(0);await noOverflow();
   }
   check(errors.length===0,errors.join('\n'));await context.close();
  }}finally{await server?.httpServer.close();}
 }
 await writeFile(resolve(out,'app-results.json'),JSON.stringify({status:'PASS',checks,browser:browser.version(),results},null,2));
 console.log(JSON.stringify({status:'PASS',checks,states:results.length}));
}catch(error){await active?.screenshot({path:resolve(out,'failure.png')}).catch(()=>{});await writeFile(resolve(out,'app-results.json'),JSON.stringify({status:'FAIL',checks,results,error:error.stack},null,2));console.error(error);process.exitCode=1;}
finally{await browser.close();}
