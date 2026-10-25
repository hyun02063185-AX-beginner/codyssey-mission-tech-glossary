// Actual App contract, separate from private Preview QA. Run dev and dist sequentially.
import {chromium,expect} from '@playwright/test';
import {createServer,preview} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {explorerMenu,explorerPanel,explorerSelect} from './b21_explorer_controls.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,process.env.B21_U5_REPORT_DIR||'reports/b21-map-first/u5');
await mkdir(output,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'drafts/b2-1-story-map/scene-08/candidate-map.json'),'utf8'));
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {scenes}=await loader.ssrLoadModule('/src/b21StoryV3/content/index.ts');await loader.close();
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const results=[];let activePage;
const story='/missions/main-M03/story',map=story+'/concepts';
try{
 for(const mode of ['dev','dist']){
  let server;
  const port=mode==='dev'?4180:4181,origin=`http://127.0.0.1:${port}/`,base=origin+'#';
  if(mode==='dev'){
   try{if(!(await fetch(origin)).ok)throw Error('Unavailable');}
   catch{server=await createServer({root,server:{host:'127.0.0.1',port,strictPort:true},logLevel:'error'});await server.listen();}
  }else server=await preview({root,preview:{host:'127.0.0.1',port,strictPort:true},logLevel:'error'});
  const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
  context.setDefaultTimeout(15000);
  const page=await context.newPage();activePage=page;
  const errors=[],passed=[];let checks=0;
  context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));page.on('pageerror',e=>errors.push(e.message));
  const check=(ok,label)=>{if(!ok)throw Error(`${mode}: ${label}`);checks++;};
  const open=async path=>{await page.goto(base+path);};
  const pos=async(scene,step)=>{await expect(page.locator('#pos')).toContainText(`Scene ${scene} · ${step} /`);checks++;};
  const select=async id=>{await explorerSelect(page,id);await expect(page.locator('.b21ce-detail h2')).toHaveText(data.nodes.find(n=>n.id===id).label);checks++;};
  const returning=()=>page.locator('.b21-service-return a');
  const capture=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:resolve(output,`${mode}-${name}.png`),fullPage:true});};
  try{
   for(const width of [1280,390,360]){
    await page.setViewportSize({width,height:width===1280?900:800});
    await open('/missions');await page.locator('[data-mission="main-m03"] .mission-card-actions a').first().click();
    await expect(page.locator('[data-material="story"]')).toContainText('명령 한 줄부터 개념지도까지');
    await expect(page.locator('[data-material="concepts"]')).toContainText('45개 개념의 연결 관계 탐색');
    await expect(page.locator('[data-material="guide"]')).toBeVisible();checks+=3;
    await capture(`mission-${width}`);
    await page.locator('[data-material="story"] a').click();await pos('01',1);
    await page.locator('#tocBtn').click();await page.locator('#tocBody button').last().click();await pos('08',17);
    await expect(page.locator('.m8-note')).not.toContainText('미연결');await page.locator('#noteBtn').click();
    await expect(page.locator('#note')).not.toContainText('미연결');await page.keyboard.press('Escape');
    await open(story+'?scene=08&step=6');await pos('08',6);await capture(`story-${width}`);
    await page.getByRole('link',{name:'전체 개념지도에서 관계 탐색 →',exact:true}).click();
    await expect(page.locator('[data-area]')).toHaveCount(7);check(await page.getByLabel('모든 개념 찾기',{exact:true}).locator('option').count()===46,'45 concepts');
    await capture(`map-entry-${width}`);await select('generator');
    await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-relation-choice]')).toHaveCount(2);checks+=2;
    const selection=page.url();await capture(`map-generator-${width}`);
    await page.locator('.b21ce-detail [data-term-id="generator"] a').click();
    await expect(page.locator('main article h1')).toHaveText('generator');await expect(returning()).toContainText('전체 개념지도');
    await page.reload();await expect(returning()).toBeVisible();await capture(`term-${width}`);await returning().click();await expect(page).toHaveURL(selection);await expect(page.locator('.b21ce-selection-heading')).toBeFocused();
    await explorerMenu(page);await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await pos('08',6);checks+=4;
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Story no overflow '+width);
    await page.goBack();await expect(page).toHaveURL(selection);await page.goForward();await pos('08',6);
    await page.goBack();await explorerPanel(page);await page.locator('.b21ce-detail .b21ce-links a').first().click();await expect(returning()).toContainText('전체 개념지도');
    await page.reload();await expect(returning()).toBeVisible();await returning().click();await expect(page).toHaveURL(selection);
    await explorerPanel(page,'관계');await page.locator('[data-relation-choice="R23"]').click();await expect(page.locator('.b21ce-detail h2')).toContainText('R23');
    await expect(page.locator('.b21ce-detail')).toContainText('강의 연결 보류');await expect(page.locator('.b21ce-detail .b21ce-links a')).toHaveCount(0);
    const relation=page.url();await page.reload();await expect(page).toHaveURL(relation);await expect(page.locator('.b21ce-detail h2')).toContainText('R23');
    await explorerPanel(page,'비교');await page.getByLabel('비교할 짝',{exact:true}).selectOption(data.comparisons[0].id);const comparison=page.url();
    await page.reload();await expect(page).toHaveURL(comparison);await expect(page.locator('[data-comparison]')).toHaveAttribute('data-comparison',data.comparisons[0].id);
    await capture(`comparison-${width}`);check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'map no overflow '+width);
    await explorerMenu(page);await page.getByRole('button',{name:'강사 안내',exact:true}).click();
    for(const path of data.teacherPaths){
     await page.getByLabel('복습 경로',{exact:true}).selectOption(path.id);
     for(const [i,step] of path.steps.entries()){
      await expect(page.getByTestId('guide-prompt')).toHaveText(step.prompt);await expect(page).toHaveURL(new RegExp(path.id==='P1'?'mode=guided':`path=${path.id}`));checks++;
      if(i<path.steps.length-1)await page.getByRole('button',{name:'안내 다음',exact:true}).click();
     }
     const url=page.url();await page.reload();await expect(page).toHaveURL(url);await expect(page.getByTestId('guide-prompt')).toHaveText(path.steps.at(-1).prompt);checks++;
    }
    check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'guided no overflow '+width);
    passed.push(`${width}px complete mission→Story→map→Generator→term→map→Story, review, R23 held, comparison, P1–P3, reload/history`);
   }
   await page.setViewportSize({width:1280,height:900});
   for(const query of ['node=unknown','node=generator&node=iterator','origin=scene%3D03a%26step%3D1','returnUrl=https://evil.test']){
    await open(map+'?'+query);await expect(page.getByRole('alert')).toBeVisible();await expect(page).not.toHaveURL(/unknown|03a|evil|node=generator&node=/);checks++;
   }
   await open('/terms');await open(map);await explorerMenu(page);await page.getByRole('button',{name:'이전 화면',exact:true}).click();await pos('08',1);
   await open(map);await select('generator');await select('iterator');await explorerMenu(page);await page.getByRole('button',{name:'이전 화면',exact:true}).click();await expect(page.locator('.b21ce-detail h2')).toHaveText('Generator');
   for(const query of ['scene=05&step=2','scene=06&step=1','scene=03a&step=1','scene=05&step=unknown']){
    await open(story+'?'+query);await expect(page.locator('#stage > *').first()).toBeVisible();check(!page.url().includes('03a')&&!page.url().includes('unknown'),'canonical Story recovery');await page.reload();await expect(page.locator('#stage > *').first()).toBeVisible();
   }
   passed.push('direct Story/map, legacy numeric/rejected v2 03a, malformed canonical recovery, bounded Previous');
   // U4 approved placement in the real App, with fixed explicit returns.
   await open(story+'?scene=08&step=6');await page.locator('[data-testid="learning-area"] [data-term-id="generator"] a').click();await expect(returning()).toContainText('Scene 08');await page.reload();await returning().click();await pos('08',6);
   await page.locator('#noteBtn').click();await page.getByTestId('learning-notes').locator('summary').click();await expect(page.getByTestId('learning-notes').locator('[data-term-id]').first()).toBeVisible();await page.keyboard.press('Escape');
   for(const scene of ['04','05','08']){
    const authored=scenes.find(s=>s.id===scene),last=authored.steps.at(-1);
    await open(story+`?scene=${scene}&step=${authored.addressing==='id'?last.id:authored.steps.length}`);
    await expect(page.getByTestId('learning-further')).toBeVisible();const sourceURL=page.url();
    await page.locator('.b21-learning-guide-list a').first().click();await expect(returning()).toContainText('B2-1 Story');await page.reload();await returning().click();await expect(page).toHaveURL(sourceURL);
    await page.locator('.b21-learning-field a').click();await expect(page.locator('.map-canvas-shell')).toBeVisible();await expect(returning()).toContainText('B2-1 Story');await page.reload();await returning().click();await expect(page).toHaveURL(sourceURL);checks+=6;
   }
   passed.push('U4 notes/selected-area term, last-step guide and Scenes04/05/08 field-map return/reload');
   // Service presenter uses the site base and public hash, with the U3 wire contract.
   await open(story+'?scene=05&step=check');const popup=context.waitForEvent('page');await page.locator('#presenterBtn').click();const presenter=await popup;
   await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');check(new URL(presenter.url()).searchParams.get('view')===null,'no Preview parameter');
   const contrast=await presenter.locator('nav button:not(:disabled)').evaluateAll(buttons=>buttons.map(button=>{
    const style=getComputedStyle(button),luminance=color=>color.match(/[\d.]+/g).slice(0,3).map(Number).map(c=>{const v=c/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
    const ink=luminance(style.color),paper=luminance(style.backgroundColor);return {label:button.textContent,ratio:(Math.max(ink,paper)+.05)/(Math.min(ink,paper)+.05)};
   }));
   check(contrast.length===3&&contrast.every(item=>item.ratio>=4.5),'presenter button text contrast');
   await expect(presenter.locator('.b21-presenter>header')).toHaveCSS('display','block');
   await writeFile(resolve(output,`${mode}-presenter-contrast.json`),JSON.stringify(contrast,null,2));
   check(new URL(presenter.url()).hash.startsWith('#'+story),'actual presenter path');await expect(page.locator('#note.on')).toHaveCount(0);
   await expect(presenter.locator('.b21-presenter-notes')).toContainText('기대');
   await presenter.getByRole('button',{name:'답 공개 요청',exact:true}).click();await expect(page.locator('#stage .qa .a:visible')).not.toHaveCount(0);
   await presenter.getByRole('button',{name:'다음 단계',exact:true}).click();await pos('05',21);await page.locator('#prev').click();await pos('05',20);
   await presenter.reload();await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');await page.reload();await expect(presenter.getByTestId('presenter-status')).toHaveText('투영 창과 연결됨');
   await page.locator('#next').click();await pos('05',21);await expect(presenter.locator('h1')).toContainText('· 21 /');
   await presenter.getByRole('button',{name:'이전 단계',exact:true}).click();await pos('05',20);await expect(presenter.locator('h1')).toContainText('· 20 /');
   await presenter.screenshot({path:resolve(output,`${mode}-presenter.png`),fullPage:true});await presenter.close();await expect(page.locator('.b21-route-notice')).toContainText('강사 노트 서랍',{timeout:8000});
   await page.evaluate(()=>window.open=()=>null);await page.locator('#presenterBtn').click();await expect(page.locator('.b21-route-notice')).toContainText('팝업이 차단');checks+=8;
   const disabled=await context.newPage();await disabled.addInitScript(()=>Object.defineProperty(window,'BroadcastChannel',{value:undefined}));await disabled.goto(base+story);await expect(disabled.locator('.b21-route-notice')).toContainText('동기화');await disabled.close();checks++;
   passed.push('public presenter path, notes isolation, reveal/navigation sync, both reloads, close/blocked/no-channel fallback');
   // Existing App routes and B3 banner retain priority.
   await open('/missions/main-M05');await expect(page.locator('[data-material="concepts"]')).toBeVisible();await page.locator('[data-material="concepts"] a').click();await expect(page.locator('[data-map-node]')).toHaveCount(23);
   await open('/missions/main-M05/story-map/concepts?view=general&node=gen:firewall');await expect(page.locator('[data-detail-panel="open"]')).toContainText('B3-1');
   await open('/missions/main-M01');await expect(page.locator('[data-material="guide"]')).toBeVisible();await page.locator('[data-material="guide"] a').click();await expect(page.locator('main h1').first()).toBeVisible();
   await open('/maps');await expect(page.locator('main h1').first()).toBeVisible();await open('/terms?q=generator');await expect(page.locator('a.row[href="#/terms/generator"]')).toBeVisible();
   for(const value of ['https://evil.test','/concept-explorer?node=generator',map+'?node=unknown']){
    await open('/terms/generator?'+new URLSearchParams({'b21-explorer':value}));await expect(returning()).toHaveCount(0);checks++;
   }
   await open('/terms/generator?'+new URLSearchParams({'b21-explorer':map+'?node=generator','b31-map':'view=general&node=gen:firewall'}));await expect(returning()).toHaveCount(0);
   await expect(page.locator('.b31-context-return a')).toBeVisible();await page.locator('.b31-context-return a').click();await expect(page.locator('[data-detail-panel="open"]')).toContainText('B3-1');checks+=3;
   // Compare the approved lesson's computed typography and geometry across hosts.
   const reference=await context.newPage(),design=[];
   const metrics=async p=>{await p.evaluate(()=>document.fonts.ready);return p.locator('.b21t').evaluate(root=>Object.fromEntries(['.app','#q','#stage','#say'].map(selector=>{
    const e=root.querySelector(selector),r=e.getBoundingClientRect(),s=getComputedStyle(e);
    return [selector,{width:r.width,height:r.height,fontFamily:s.fontFamily,fontSize:s.fontSize,fontWeight:s.fontWeight,lineHeight:s.lineHeight,color:s.color}];
   })));};
   for(const width of [1280,390,360]){
    const viewport={width,height:width===1280?900:800};await page.setViewportSize(viewport);await reference.setViewportSize(viewport);
    await open(story+'?scene=05&step=iterable');await pos('05',2);
    await reference.goto('http://127.0.0.1:4179/?view=v3-router#'+story+'?scene=05&step=iterable');await expect(reference.locator('#pos')).toContainText('Scene 05 · 2 /');
    const actual=await metrics(page),approved=await metrics(reference);check(JSON.stringify(actual)===JSON.stringify(approved),'approved Story design '+width);design.push({width,actual,approved});
   }
   await reference.close();await writeFile(resolve(output,`${mode}-story-design.json`),JSON.stringify(design,null,2));passed.push('approved lesson typography and geometry identical to private Router at all three widths');
   check(errors.length===0,'no page errors '+errors.join(';'));passed.push('B3 core/general map, other mission guide, term search, maps index and hostile/B3-priority return rejection');
   results.push({mode,status:'PASS',checks,passed,errors});
  }finally{await context.close();if(mode==='dev')await server?.close();else await server?.httpServer.close();}
 }
 console.log(JSON.stringify({status:'PASS',browser:browser.version(),results},null,2));
 await writeFile(resolve(output,'app-results.json'),JSON.stringify({status:'PASS',browser:browser.version(),results},null,2));
}catch(error){
 try{await activePage?.screenshot({path:resolve(output,'app-failure.png'),fullPage:true});}catch{}
 await writeFile(resolve(output,'app-results.json'),JSON.stringify({status:'FAIL',results,error:error.stack},null,2));console.error(error);process.exitCode=1;
}finally{await browser.close();}
