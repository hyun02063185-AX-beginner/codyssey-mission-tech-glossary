import {chromium,expect} from '@playwright/test';
import {createServer} from 'vite';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {explorerMenu,explorerPanel,explorerSelect} from './b21_explorer_controls.mjs';
const root=fileURLToPath(new URL('../',import.meta.url)),output=resolve(root,process.env.B21_AREA_REPORT_DIR||'reports/b21-area-focus');await mkdir(output,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'drafts/b2-1-story-map/scene-08/candidate-map.json'),'utf8'));
const loader=await createServer({root,configFile:false,server:{middlewareMode:true,hmr:false,ws:false},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},logLevel:'error'});
const {areaBounds}=await loader.ssrLoadModule('/src/b21ConceptExplorer/scope.ts');await loader.close();
const base=process.env.B21_AREA_BASE||'http://127.0.0.1:4180/',map='/missions/main-M03/story/concepts';
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});const results=[],errors=[];let checks=0,current;
const check=(ok,label)=>{if(!ok)throw Error(label);checks++;};
try{
 for(const [width,height] of [[1280,720],[390,844],[360,800]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();current=page;context.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const svg=page.locator('.b21ce-svg'),scope=page.getByLabel('지도 표시 범위',{exact:true}),panel=page.locator('.b21ce-panel');
  const settle=()=>page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const camera=()=>svg.evaluate(el=>{const [x,y,w,h]=el.getAttribute('viewBox').split(' ').map(Number);return {x:x+w/2,y:y+h/2,scale:el.clientWidth/w,width:el.clientWidth,height:el.clientHeight};});
  const ids=(attribute)=>page.locator(`[${attribute}]`).evaluateAll((es,key)=>es.map(e=>e.getAttribute(key)).sort(),attribute);
  const inside=names=>svg.evaluate((el,names)=>{const r=el.getBoundingClientRect();return names.every(id=>{const a=el.querySelector(`[data-explorer-node="${id}"]`).getBoundingClientRect();return a.left>=r.left&&a.right<=r.right&&a.top>=r.top&&a.bottom<=r.bottom;});},names);
  const capture=name=>page.screenshot({path:resolve(output,`${width}-${height}-${name}.png`)});
  const choose=async id=>{await scope.selectOption(id);await expect(page.locator('.b21ce')).toHaveAttribute('data-map-scope',id);await settle();};
  const close=async()=>{if(await panel.isVisible())await page.getByRole('button',{name:'정보 패널 닫기',exact:true}).click();await settle();};
  const open=async(query='')=>{await page.goto(base+'#'+map+query);await svg.waitFor();await page.evaluate(()=>document.fonts.ready);await settle();};
  await open();await expect(scope).toHaveValue('all');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);await expect(page.locator('[data-explorer-area]')).toHaveCount(7);await capture('whole');checks+=3;
  const areas=[];
  for(const area of data.areas){
   await choose(area.id);const areaURL=page.url(),nodes=data.nodes.filter(n=>n.area===area.id),nodeIds=new Set(nodes.map(n=>n.id)),relations=data.relations.filter(r=>nodeIds.has(r.from)&&nodeIds.has(r.to));await settle();
   check(JSON.stringify(await ids('data-explorer-node'))===JSON.stringify([...nodeIds].sort()),'only original area nodes '+area.id);
   check(JSON.stringify(await ids('data-explorer-relation'))===JSON.stringify(relations.map(r=>r.id).sort()),'only internal relations '+area.id);
   check(JSON.stringify(await ids('data-explorer-area'))===JSON.stringify([area.id]),'no foreign background regions');
   const fitted=await camera(),bounds=areaBounds(area.id),font=await svg.locator('[data-explorer-node] text:last-of-type').first().evaluate(el=>parseFloat(getComputedStyle(el).fontSize));
   check(Math.abs(fitted.x-(bounds.left+bounds.right)/2)<.00001&&Math.abs(fitted.y-(bounds.top+bounds.bottom)/2)<.00001,'camera centres actual area bounds');
   check(Math.round(fitted.scale*font*100)/100>=13.5,'focused automatic reading size');
   check(await svg.locator('[data-explorer-node] text:last-of-type').evaluateAll(es=>es.every(e=>e.getBBox().width<=182&&!e.textContent.includes('…'))),'all focused names fit original cards');
   await capture(area.id);
   await page.getByRole('button',{name:'전체 맞춤',exact:true}).click();await expect.poll(()=>inside([...nodeIds])).toBe(true);const overview=await camera();checks++;
   await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();await settle();const reading=await camera();check(Math.round(reading.scale*font*100)/100>=13.5,'reading versus overview');
   // A central visible card can be selected without changing the display scope.
   const id=nodes[Math.floor(nodes.length/2)].id;await page.locator(`[data-explorer-node="${id}"]`).click();await expect(page.locator('.b21ce')).toHaveAttribute('data-map-scope',area.id);await expect(page.locator('[data-explorer-node]')).toHaveCount(nodes.length);const selectedURL=page.url();checks+=2;
   await explorerPanel(page);await expect(page.locator('.b21ce-detail h2')).toHaveText(nodes.find(n=>n.id===id).label);await settle();const beforeClose=await camera();await capture(area.id+'-detail');await close();const afterClose=await camera();
   check(Math.max(Math.abs(beforeClose.x-afterClose.x),Math.abs(beforeClose.y-afterClose.y),Math.abs(beforeClose.scale-afterClose.scale))<.00001,'panel close retains focused camera');
   await page.reload();await expect(scope).toHaveValue(area.id);await expect(page.locator(`[data-explorer-node="${id}"]`)).toHaveAttribute('aria-pressed','true');await page.goBack();await expect(page).toHaveURL(areaURL);await expect(scope).toHaveValue(area.id);await page.goForward();await expect(page).toHaveURL(selectedURL);checks+=3;
   await close();await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await expect(page.locator('.b21ce')).toHaveClass(/is-map-focus/);await expect(scope).toHaveValue(area.id);await page.getByRole('button',{name:'지도 기본 크기',exact:true}).click();await expect(page.locator('[data-explorer-node]')).toHaveCount(nodes.length);checks++;
   areas.push({id:area.id,label:area.label,nodes:nodes.length,internalRelations:relations.length,externalRelations:data.relations.filter(r=>nodeIds.has(r.from)!==nodeIds.has(r.to)).length,autoReading:fitted,overview,reading});
  }
  await page.getByRole('button',{name:'전체 지도',exact:true}).click();await expect(scope).toHaveValue('all');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);
  await explorerSelect(page,'generator',false);await expect(scope).toHaveValue('all');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);checks+=3;
  await open('?node=generator');await expect(scope).toHaveValue('all');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await open('?area=area-structure');await expect(scope).toHaveValue('all');checks+=2;
  await choose('area-execution');await explorerPanel(page,'관계');await expect(page.locator('[data-external-relation="R04"]')).toBeVisible();await expect(page.locator('[data-explorer-relation="R04"]')).toHaveCount(0);const focusURL=page.url();
  await page.locator('[data-external-relation="R04"]').click();await expect(scope).toHaveValue('all');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation="R04"]')).toHaveCount(1);const external=data.relations.find(r=>r.id==='R04');await expect.poll(()=>inside([external.from,external.to])).toBe(true);await capture('external-connection');checks+=4;
  await page.goBack();await expect(page).toHaveURL(focusURL);await expect(scope).toHaveValue('area-execution');
  await explorerMenu(page);await page.getByRole('button',{name:'강사 안내',exact:true}).click();await expect(scope).toHaveValue('all');
  for(const path of data.teacherPaths){await page.getByLabel('복습 경로',{exact:true}).selectOption(path.id);for(const [i,step] of path.steps.entries()){await expect(page.locator(`[data-explorer-node="${step.nodeId}"]`)).toHaveAttribute('aria-pressed','true');await expect(page.getByTestId('guide-prompt')).toHaveText(step.prompt);if(i<path.steps.length-1)await page.getByRole('button',{name:'안내 다음',exact:true}).click();checks++;}}
  await explorerMenu(page);await page.getByRole('button',{name:'자유 탐색',exact:true}).click();await expect(scope).toHaveValue('area-execution');checks++;
  await choose('area-storage');await explorerPanel(page,'비교');await page.getByLabel('비교할 짝',{exact:true}).selectOption('C30');await expect(scope).toHaveValue('all');const pair=data.comparisons.find(c=>c.id==='C30');await expect.poll(()=>inside([pair.left,pair.right])).toBe(true);await expect(page.locator('.b21ce-detail')).toContainText(data.comparisons.find(c=>c.id==='C30').leftText);await expect(page.locator('.b21ce-detail')).toContainText(data.comparisons.find(c=>c.id==='C30').rightText);checks+=3;
  await choose('area-iteration');await explorerPanel(page,'비교');await page.getByLabel('비교할 짝',{exact:true}).selectOption('C11');await expect(scope).toHaveValue('area-iteration');await expect(page.locator('[data-explorer-node]')).toHaveCount(6);checks++;
  await open('?scope=area-iteration&node=generator&origin='+encodeURIComponent('scene=05&step=gen&back=6'));await explorerPanel(page);const returnURL=page.url();await page.locator('.b21ce-detail [data-term-id="generator"] a').click();await page.reload();await page.locator('.b21-service-return a').click();await expect(page).toHaveURL(returnURL);await expect(scope).toHaveValue('area-iteration');await expect(page.locator('[data-explorer-node]')).toHaveCount(6);
  await explorerPanel(page);await page.locator('.b21ce-detail .b21ce-links a').first().click();await page.reload();await page.locator('.b21-service-return a').click();await expect(page).toHaveURL(returnURL);await expect(scope).toHaveValue('area-iteration');await explorerMenu(page);await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page).toHaveURL(/scene=05&step=gen&back=6$/);checks+=4;
  await open('?scope=unknown');await expect(page.getByRole('alert')).toBeVisible();await expect(scope).toHaveValue('all');
  await choose('area-iteration');await close();check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');check(await page.locator('.b21ce button,.b21ce select,.b21ce summary').evaluateAll(es=>es.filter(e=>e.getClientRects().length).every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44;})),'44px controls');
  if(width<700){
   const session=await context.newCDPSession(page),rect=await svg.boundingBox(),x=rect.x+8,y=rect.y+30;
   try{
    await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});const start=await svg.getAttribute('viewBox');
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1},{x,y:y+70,id:2}]});
    await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-5,id:1},{x,y:y+95,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await expect.poll(async()=>Number((await svg.getAttribute('viewBox')).split(' ')[2])).toBeLessThan(Number(start.split(' ')[2]));checks++;
    const before=await svg.getAttribute('viewBox'),scroll=await page.evaluate(()=>scrollY);
    await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+18,y:y+25,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await expect.poll(()=>svg.getAttribute('viewBox')).not.toBe(before);await expect(scope).toHaveValue('area-iteration');check(await page.evaluate(()=>scrollY)===scroll,'focused touch pan does not scroll the page');
   }finally{await session.send('Emulation.setTouchEmulationEnabled',{enabled:false});await session.detach();}
  }
  results.push({width,height,areas});await context.close();
 }
 check(errors.length===0,'no page errors');const result={status:'PASS',checks,browser:browser.version(),results,errors};await writeFile(resolve(output,'area-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}catch(error){try{await current.screenshot({path:resolve(output,'failure.png')});}catch{}await writeFile(resolve(output,'area-results.json'),JSON.stringify({status:'FAIL',checks,results,errors,error:error.stack},null,2));console.error(error);process.exitCode=1;}
finally{await browser.close();}
