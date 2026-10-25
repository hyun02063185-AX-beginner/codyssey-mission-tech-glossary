import {chromium,expect} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {explorerMenu,explorerPanel,explorerSelect} from './b21_explorer_controls.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,process.env.B21_MAP_FIRST_REPORT_DIR||'reports/b21-map-first');await mkdir(output,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'drafts/b2-1-story-map/scene-08/candidate-map.json'),'utf8'));
const base=process.env.B21_MAP_FIRST_BASE||'http://127.0.0.1:4180/',map='/missions/main-M03/story/concepts',story='/missions/main-M03/story';
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const results=[],errors=[];let checks=0,current;
const check=(value,label)=>{if(!value)throw Error(label);checks++;};
try{
 for(const [width,height] of [[1280,720],[1280,900],[390,844],[360,800]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();current=page;context.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const svg=page.locator('.b21ce-svg');
  const open=async(query='')=>{await page.goto(base+'#'+map+query);await svg.waitFor();await page.evaluate(()=>document.fonts.ready);};
  const capture=async name=>page.screenshot({path:resolve(output,`after-${width}-${height}-${name}.png`)});
  const metrics=()=>svg.evaluate(el=>{const r=el.getBoundingClientRect();return {width:el.clientWidth,height:el.clientHeight,top:r.top,visibleHeight:Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top))};});
  const centre=()=>svg.evaluate(el=>{const [x,y,width,height]=el.getAttribute('viewBox').split(' ').map(Number);return {x:x+width/2,y:y+height/2,scale:el.clientWidth/width};});
  const sameCentre=async before=>{await expect.poll(async()=>{const after=await centre();return Math.max(Math.abs(after.x-before.x),Math.abs(after.y-before.y),Math.abs(after.scale-before.scale));}).toBeLessThan(.00001);checks++;};
  const inside=ids=>svg.evaluate((el,ids)=>{const r=el.getBoundingClientRect();return ids.every(id=>{const a=el.querySelector(`[data-explorer-node="${id}"]`).getBoundingClientRect();return a.left>=r.left&&a.right<=r.right&&a.top>=r.top&&a.bottom<=r.bottom;});},ids);
  const close=async()=>{if(await page.locator('.b21ce-panel').isVisible())await page.getByRole('button',{name:'정보 패널 닫기',exact:true}).click();};
  await open();await expect(page.locator('.b21ce-areas-panel')).toBeHidden();await expect(page.locator('.b21ce-panel')).toBeHidden();await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);
  await expect.poll(async()=>{const m=await metrics();return m.height;}).toBeGreaterThanOrEqual(width===1280?(height===720?480:600):height*.65);
  const initial=await metrics();check(initial.visibleHeight>=initial.height,'complete Canvas visible in first viewport');check(await inside(await page.locator('[data-explorer-node]').evaluateAll(es=>es.map(e=>e.dataset.explorerNode))),'all 45 nodes fit in whole-map mode');await capture('initial');
  await page.locator('.b21ce-area-toggle').click();await expect(page.locator('.b21ce-areas-panel')).toBeVisible();
  if(width===1280)await expect.poll(async()=>(await metrics()).width).toBeLessThan(initial.width);
  await page.locator('[data-area="area-iteration"]').click();await expect(page.locator('[data-node-choice]')).toHaveCount(6);await page.locator('[data-node-choice="generator"]').click();await expect(page.locator('.b21ce-areas-panel')).toBeHidden();
  if(width===1280)await expect(page.locator('.b21ce-panel')).toBeVisible();else await expect(page.locator('.b21ce-panel')).toBeHidden();
  await close();await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();
  await expect.poll(()=>inside(['generator','iterator','yield'])).toBe(true);checks++;
  const closed=await metrics();await capture('generator');
  for(const id of ['iterator','ledger-services-module','generator']){
   await explorerSelect(page,id,false);await close();await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();
   const readable=await svg.evaluate((el,id)=>{const text=el.querySelector(`[data-explorer-node="${id}"] text:last-of-type`);return parseFloat(getComputedStyle(text).fontSize)*el.clientWidth/el.viewBox.baseVal.width;},id);
   check(readable>=13.5,'selected label readable '+id);check(await inside([id]),'selected card complete '+id);
  }
  check(await svg.locator('[data-explorer-node] text:last-of-type').evaluateAll(es=>es.every(e=>e.getBBox().width<=182&&!e.textContent.includes('…'))),'all 45 original names fit without ellipsis');
  await explorerPanel(page);await expect(page.locator('.b21ce-detail h2')).toHaveText('Generator');const panel=await metrics();
  await page.getByRole('tab',{name:'상세',exact:true}).focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab',{name:'관계',exact:true})).toBeFocused();await expect(page.getByRole('tab',{name:'관계',exact:true})).toHaveAttribute('aria-selected','true');await page.keyboard.press('ArrowLeft');checks++;
  check(width===1280?panel.width<closed.width:panel.height<closed.height,'side panel / bottom sheet releases space from Canvas');await capture('detail');
  await page.getByRole('tab',{name:'관계',exact:true}).click();await page.locator('[data-relation-choice="R23"]').click();await expect(page.locator('.b21ce-detail')).toContainText('Iterator의 한 종류');await expect(page.locator('.b21ce-detail .b21ce-links a')).toHaveCount(0);
  await close();await page.getByRole('button',{name:'연결 맞춤',exact:true}).click();check(await inside(['generator','iterator']),'connection-fit shows both endpoints');await capture('relation');
  for(const relation of data.relations){await open('?relation='+relation.id);await close();await page.getByRole('button',{name:'연결 맞춤',exact:true}).click();check(await inside([relation.from,relation.to]),'both endpoints visible: '+relation.id);}
  await explorerPanel(page,'비교');await page.getByLabel('비교할 짝',{exact:true}).selectOption('C30');await expect(page.locator('.b21ce-detail')).toContainText('JSONL');await expect(page.locator('[data-comparison]')).toHaveAttribute('data-comparison','C30');await capture('comparison');
  await explorerSelect(page,'generator');await close();await page.getByRole('button',{name:'지도 확대',exact:true}).click();await svg.focus();await page.keyboard.press('ArrowRight');const moved=await centre();
  await explorerPanel(page);await sameCentre(moved);await close();await sameCentre(moved);
  await expect(page.locator('.b21ce-panel-toggle')).toBeFocused();
  // Full viewport exploration is CSS based: no browser Fullscreen API dependency.
  await explorerPanel(page);const beforeFull=await centre();await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await expect(page.locator('.b21ce')).toHaveClass(/is-map-focus/);await expect(page.locator('.b21ce-panel')).toBeHidden();await sameCentre(beforeFull);
  const expanded=await metrics();check(expanded.width>=closed.width&&expanded.height>=closed.height,'focus mode restores map space');await capture('full');
  const beforeZoom=await svg.getAttribute('viewBox');await page.getByRole('button',{name:'지도 축소',exact:true}).click();check(await svg.getAttribute('viewBox')!==beforeZoom,'zoom in focus mode');
  const pointerPoint=()=>svg.evaluate(el=>{const r=el.getBoundingClientRect();for(let y=r.top+35;y<r.bottom-60;y+=30)for(let x=r.left+20;x<r.right-80;x+=30){const e=document.elementFromPoint(x,y);if(e&&el.contains(e)&&!e.closest('[data-explorer-node],[data-explorer-edge]'))return {x,y};}throw Error('No map background');});
  const point=await pointerPoint(),dragBefore=await svg.getAttribute('viewBox');await page.mouse.move(point.x,point.y);await page.mouse.down();await page.mouse.move(point.x+32,point.y+22,{steps:5});await page.mouse.up();check(await svg.getAttribute('viewBox')!==dragBefore,'mouse pan');
  if(width<700){
   const session=await context.newCDPSession(page);
   try{
    await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});const point=await pointerPoint(),before=await svg.getAttribute('viewBox'),scroll=await page.evaluate(()=>scrollY);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+30,y:point.y+25,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(()=>svg.getAttribute('viewBox')).not.toBe(before);check(await page.evaluate(()=>scrollY)===scroll,'touch pan does not scroll page');
    // Pinch starts on empty map background; buttons remain an alternative.
    await page.getByRole('button',{name:'전체 맞춤',exact:true}).click();const q=await pointerPoint(),start=await svg.getAttribute('viewBox');
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:q.x,y:q.y,id:1},{x:q.x+45,y:q.y,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:q.x-8,y:q.y,id:1},{x:q.x+58,y:q.y,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect.poll(async()=>Number((await svg.getAttribute('viewBox')).split(' ')[2])).toBeLessThan(Number(start.split(' ')[2]));checks++;
   }finally{await session.send('Emulation.setTouchEmulationEnabled',{enabled:false});await session.detach();}
  }
  await page.locator('[data-explorer-node="iterator"]').focus();await page.keyboard.press('Enter');await expect(page.locator('[data-explorer-node="iterator"]')).toHaveAttribute('aria-pressed','true');await expect(page.locator('.b21ce-panel')).toBeHidden();const selectedURL=page.url();
  const beforeExit=await centre();await page.getByRole('button',{name:'지도 기본 크기',exact:true}).click();await expect(page.locator('.b21ce')).not.toHaveClass(/is-map-focus/);await sameCentre(beforeExit);await expect(page.getByRole('button',{name:'지도 크게 보기',exact:true})).toBeFocused();check(page.url()===selectedURL,'focus exit preserves selection URL');await close();
  await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await page.keyboard.press('Escape');await expect(page.locator('.b21ce')).not.toHaveClass(/is-map-focus/);checks++;
  await explorerSelect(page,'generator',false);const genURL=page.url();await explorerSelect(page,'iterator',false);const iteratorURL=page.url();await page.goBack();await expect(page).toHaveURL(genURL);await page.goForward();await expect(page).toHaveURL(iteratorURL);await page.reload();await expect(page.locator('[data-explorer-node="iterator"]')).toHaveAttribute('aria-pressed','true');
  await open('?node=generator&origin='+encodeURIComponent('scene=08&step=6'));await explorerPanel(page);const returnURL=page.url();await page.locator('.b21ce-detail [data-term-id="generator"] a').click();await page.reload();await page.locator('.b21-service-return a').click();await expect(page).toHaveURL(returnURL);await explorerPanel(page);await page.locator('.b21ce-detail .b21ce-links a').first().click();await page.reload();await page.locator('.b21-service-return a').click();await expect(page).toHaveURL(returnURL);await explorerMenu(page);await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');checks+=4;
  await open();check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');check(await page.locator('.b21ce button,.b21ce select,.b21ce summary').evaluateAll(es=>es.filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44;})),'44x44 visible HTML controls');
  results.push({width,height,initial,selectedClosed:closed,panelOpen:panel,expanded});await context.close();
 }
 check(errors.length===0,'no browser errors');await writeFile(resolve(output,'after.json'),JSON.stringify({status:'PASS',checks,browser:browser.version(),results,errors},null,2));console.log(JSON.stringify({status:'PASS',checks,results},null,2));
}catch(error){try{await current.screenshot({path:resolve(output,'failure.png')});}catch{}await writeFile(resolve(output,'after.json'),JSON.stringify({status:'FAIL',checks,results,errors,error:error.stack},null,2));console.error(error);process.exitCode=1;}
finally{await browser.close();}
