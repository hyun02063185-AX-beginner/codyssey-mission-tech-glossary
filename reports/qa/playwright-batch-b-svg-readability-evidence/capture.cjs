// Run from the repository root: QA_BASE=http://127.0.0.1:4179 node <this file> before|after.
const {chromium}=require('playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const phase=process.argv[2];assert(['before','after'].includes(phase));
const base=process.env.QA_BASE||'http://127.0.0.1:4179';
const out=path.join(__dirname,phase);fs.mkdirSync(out,{recursive:true});
const labels={'scene-01':'기존 기업망 전체 구조도 더 보기','scene-02':'기존 요청·응답 상세 그림 더 보기','scene-03a':'기존 AWS 역할 비교 그림 더 보기','scene-03b':'기존 AWS 접속 조건 그림과 기초 비교 더 보기'};
const captures=new Set(['1280-scene-01','1000-scene-02','390-scene-03a','360-scene-01','360-scene-02','360-scene-03b']);
async function measure(frame){return frame.evaluate(el=>{
 const svg=el.querySelector('.b31-story-art').shadowRoot.querySelector('svg');
 const r=svg.getBoundingClientRect(),v=svg.viewBox.baseVal;
 const min=Math.min(...[...svg.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)));
 const scroll=el.querySelector('.b31-art-scroll');
 return {layout:el.getAttribute('data-layout'),frameWidth:el.clientWidth,artWidth:r.width,viewBoxWidth:v.width,viewBoxHeight:v.height,
  minimumIntrinsicFont:min,minimumText:min*r.width/v.width,requiredWidthFor14px:Math.ceil(v.width*14/min),
  scrollClientWidth:scroll.clientWidth,scrollWidth:scroll.scrollWidth,scrollLeft:scroll.scrollLeft,
  focusable:scroll.tabIndex===0,aspectError:Math.abs(r.height/r.width-v.height/v.width),pageOverflow:document.documentElement.scrollWidth>innerWidth};
});}
(async()=>{
 const browser=await chromium.launch({headless:true});
 const context=await browser.newContext({hasTouch:true,reducedMotion:'reduce'});
 const page=await context.newPage();page.setDefaultTimeout(10000);
 const result={phase,base,browser:browser.version(),consoleErrors:[],rows:[]};
 page.on('pageerror',e=>result.consoleErrors.push(e.message));
 try{
 for(const width of [1280,1000,390,360])for(const scene of Object.keys(labels)){
  const height=width>700?900:844;
  await page.setViewportSize({width,height});await page.goto('about:blank');
  await page.goto(`${base}/#/missions/main-M05/story-map?scene=${scene}`);
  const section=page.locator(`.b31-current-scene[data-scene="${scene}"]`);await section.waitFor();
  const details=page.locator('.b31-slide-extra:not(.b31-slide-links)');
  const collapsed=!(await details.evaluate(e=>e.open));assert(collapsed);
  await page.getByText(labels[scene],{exact:true}).click();
  const frame=page.locator('.b31-art-frame').first();await frame.locator('svg').waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await frame.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  const row={width,height,scene,initiallyCollapsed:collapsed,normal:await measure(frame)};
  await frame.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-120));
  if(captures.has(`${width}-${scene}`))await page.screenshot({path:path.join(out,`${width}-${scene}.png`),animations:'disabled'});
  if(phase==='after'){
   assert(row.normal.minimumText>11.5);assert(row.normal.minimumText>=14-.001);assert(row.normal.aspectError<.002);assert(!row.normal.pageOverflow);
   const scroll=frame.locator('.b31-art-scroll');
   if(row.normal.scrollWidth>row.normal.scrollClientWidth+1){
    assert(row.normal.focusable);row.scrollHint=await frame.locator('.b31-art-hint').innerText();
    await scroll.focus();await page.keyboard.press('ArrowRight');
    await page.waitForFunction(()=>document.activeElement.scrollLeft>0);
    row.keyboardScroll=await scroll.evaluate(e=>e.scrollLeft);assert(row.keyboardScroll>0);
    await page.keyboard.press('ArrowLeft');await page.waitForFunction(()=>document.activeElement.scrollLeft===0);
    row.keyboardLeft=await scroll.evaluate(e=>e.scrollLeft);
    const r=await scroll.boundingBox(),x=r.x+Math.min(r.width-20,150),y=Math.min(height-30,r.y+100);
    await page.mouse.move(x,y);await page.mouse.wheel(160,0);
    await page.waitForFunction(()=>document.activeElement.scrollLeft>0);
    row.mouseScroll=await scroll.evaluate(e=>e.scrollLeft);assert(row.mouseScroll>0);
    await page.mouse.wheel(-160,0);await page.waitForFunction(()=>document.activeElement.scrollLeft===0);
    row.mouseLeft=await scroll.evaluate(e=>e.scrollLeft);
    if(width<700){
     const cdp=await context.newCDPSession(page),start=r.x+r.width-25,end=r.x+25;
     const swipe=async(x1,y1,x2,y2)=>{
      await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x1,y:y1}]});
      for(let i=1;i<=8;i++){
       await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x1+(x2-x1)*i/8,y:y1+(y2-y1)*i/8}]});
       await page.waitForTimeout(25);
      }
      await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(150);
     };
     await swipe(start,y,end,y);row.touchScroll=await scroll.evaluate(e=>e.scrollLeft);assert(row.touchScroll>0);
     await swipe(end,y,start,y);row.touchLeft=await scroll.evaluate(e=>e.scrollLeft);assert(row.touchLeft<row.touchScroll);
     const pageTop=await page.evaluate(()=>scrollY);
     await swipe(r.x+r.width/2,height-90,r.x+r.width/2,height-330);
     row.verticalPageScroll=await page.evaluate(top=>scrollY-top,pageTop);assert(row.verticalPageScroll>0);
     await cdp.detach();
    }
    await scroll.evaluate(e=>e.scrollLeft=e.scrollWidth);
    row.rightEdge=await scroll.evaluate(e=>({left:e.scrollLeft,max:e.scrollWidth-e.clientWidth}));
    assert(Math.abs(row.rightEdge.left-row.rightEdge.max)<=1);
    await scroll.evaluate(e=>e.scrollLeft=0);
   }
  }
  if(width===360&&scene==='scene-02'){
   const flows=[];
   for(const [label,dim,bright] of [['요청 강조','R1','A1'],['응답 강조','A1','R1']]){
    await page.getByRole('button',{name:label,exact:true}).click();
    const opacity=await frame.locator(`[data-flow="${dim}"]`).evaluate(e=>getComputedStyle(e).opacity);
    const brightOpacity=await frame.locator(`[data-flow="${bright}"]`).evaluate(e=>getComputedStyle(e).opacity);
    assert.equal(opacity,'0.12');assert.equal(brightOpacity,'1');flows.push({label,dim,opacity,brightOpacity});
    await frame.evaluate(e=>window.scrollTo(0,e.getBoundingClientRect().top+scrollY-120));
    if(phase==='after')await page.screenshot({path:path.join(out,`360-scene-02-${dim==='R1'?'request':'response'}.png`)});
   }
   row.flowChecks=flows;
  }
  if(width===360&&scene==='scene-01'){
   const enlarge=page.getByRole('button',{name:'그림 확대하기',exact:true});await enlarge.click();
   const dialog=page.getByRole('dialog');await dialog.waitFor();
   row.zoom100=await measure(dialog.locator('.b31-art-frame'));
   await page.screenshot({path:path.join(out,'360-scene-01-modal-100.png')});
   await dialog.getByRole('button',{name:'그림 확대',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('dialog')?.textContent.includes('125%'));
   row.zoom125=await measure(dialog.locator('.b31-art-frame'));
   await page.screenshot({path:path.join(out,'360-scene-01-modal-125.png')});
   await dialog.getByRole('button',{name:'그림 확대',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('dialog')?.textContent.includes('150%'));
   row.zoom150=await measure(dialog.locator('.b31-art-frame'));
   await dialog.getByRole('button',{name:'그림 축소',exact:true}).click();
   await dialog.getByRole('button',{name:'맞춤',exact:true}).click();
   await page.waitForFunction(()=>document.querySelector('dialog')?.textContent.includes('100%'));
   row.fit=await measure(dialog.locator('.b31-art-frame'));
   assert(Math.abs(row.fit.artWidth-row.zoom100.artWidth)<1);
   await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
   row.focusRestored=await enlarge.evaluate(e=>e===document.activeElement);assert(row.focusRestored);
  }
  await details.locator(':scope > summary').click();assert.equal(await details.evaluate(e=>e.open),false);
  result.rows.push(row);
 }
 assert.equal(result.consoleErrors.length,0);
 }catch(error){result.error={message:error.message,stack:error.stack,url:page.url()};process.exitCode=1;}
 finally{fs.writeFileSync(path.join(out,'metrics.json'),JSON.stringify(result,null,2)+'\n');await browser.close();console.log(JSON.stringify({phase,rows:result.rows.length,error:result.error}));}
})();
