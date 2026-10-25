import { expect } from '@playwright/test';
import { resolve } from 'node:path';

export async function checkExplorerEntry({page,width,output,check,base}) {
  const viewport=page.viewportSize();
  if(width===1280)await page.setViewportSize({width,height:720});
  await page.goto(base+'/concept-explorer');
  const start=page.getByRole('button',{name:'관계 지도 시작 · Generator →',exact:true});
  await expect(start).toBeVisible();await page.evaluate(()=>document.fonts.ready);
  const entry=await start.boundingBox();
  if(width===1280){
    check(entry.y>=0&&entry.y+entry.height<=720,'PC 720px first viewport includes the entire map entry button');
    const areas=await page.locator('.b21ce-overview').boundingBox(),intro=await page.locator('.b21ce-start').boundingBox();
    check(intro.x>=areas.x+areas.width,'PC map entry is beside the seven-area navigation');
  }
  await page.screenshot({path:resolve(output,`first-screen-${width}.png`)});
  await start.click();await expect(page.locator('.b21ce-selection-heading')).toHaveText('Generator 관계 지도');
  await expect(page.locator('.b21ce-selection-heading')).toBeFocused();
  await expect(page.locator('.b21ce-svg')).toBeInViewport();check(true,'map entry opens the original Generator concept with focus');
  const mapWidth=await page.locator('.b21ce-svg').evaluate(el=>el.clientWidth);
  if(width===1280)check(mapWidth>=800,'PC gives the relationship Canvas at least 800px reading width');
  await page.goto(base+'/concept-explorer?type='+encodeURIComponent('포함'));
  await page.getByRole('button',{name:'관계 지도 시작 · Generator →',exact:true}).click();
  await expect(page.locator('[data-relation-choice="R23"]')).toBeVisible();check(true,'starting the example clears an unrelated incoming relation filter');
  await page.setViewportSize(viewport);await page.goto(base+'/concept-explorer');
  await page.locator('.b21ce-start').waitFor();
  return {width,entryButton:entry,canvasWidth:mapWidth};
}

export async function checkExplorerUX({page,width,output,check,select}) {
  const svg=page.locator('.b21ce-svg'),nav=page.getByRole('navigation',{name:'모바일 탐색 바로가기'});
  const readable=[];
  for(const id of ['iterator','ledger-services-module','generator']){
    await select(id);await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();
    const metric=await svg.evaluate((el,nodeId)=>{
      const node=el.querySelector(`[data-explorer-node="${nodeId}"]`),label=node.querySelector('text:last-of-type');
      const scale=el.clientWidth/el.viewBox.baseVal.width,b=node.getBoundingClientRect(),frame=el.getBoundingClientRect();
      return {id:nodeId,label:label.textContent,labelPixels:Math.round(parseFloat(getComputedStyle(label).fontSize)*scale*100)/100,
        selectedCardInside:b.left>=frame.left&&b.right<=frame.right&&b.top>=frame.top&&b.bottom<=frame.bottom};
    },id);
    check(metric.labelPixels>=13.5,'reading mode preserves >=13.5px selected concept labels: '+id);
    check(metric.selectedCardInside,'reading mode keeps the complete selected card inside Canvas: '+id);readable.push(metric);
  }
  check(await svg.locator('[data-explorer-node] text:last-of-type').evaluateAll(labels=>labels.every(label=>label.getBBox().width<=182&&!label.textContent.includes('…'))),'all 45 SVG names fit their original cards without ellipsis');
  await page.locator('[data-relation-choice="R23"]').click();
  await expect(page.locator('.b21ce-direction')).toContainText('Generator → Iterator · 종류');
  await expect(page.locator('[data-explorer-relation="R23"]')).toHaveCount(1);
  await page.getByRole('button',{name:'연결 맞춤',exact:true}).click();
  check(await svg.evaluate(el=>['generator','iterator'].every(id=>{const a=el.querySelector(`[data-explorer-node="${id}"]`).getBoundingClientRect(),b=el.getBoundingClientRect();return a.left>=b.left&&a.right<=b.right&&a.top>=b.top&&a.bottom<=b.bottom;})),'connection fit contains both original relation endpoints');
  await page.locator('.b21ce-diagram').screenshot({path:resolve(output,`relation-${width}.png`)});
  await select('generator');
  if(width<700){
    const targets=[['2 개념','.b21ce-concept-heading'],['3 관계','.b21ce-relations-heading'],['4 상세','.b21ce-detail h2'],['5 비교','.b21ce-comparisons h2']];
    for(const [name,target] of targets){
      await nav.getByRole('button',{name,exact:true}).click();await expect(page.locator(target)).toBeFocused();
      await expect.poll(async()=>{const a=await page.locator(target).boundingBox(),b=await nav.boundingBox();return a.y>=b.y+b.height&&a.y<page.viewportSize().height;}).toBe(true);
      check(true,'mobile shortcut focuses an unobscured destination: '+name);
    }
    await page.getByLabel('비교할 짝',{exact:true}).selectOption('C30');await expect(page.locator('.b21ce-detail h2')).toBeFocused();
    await expect(nav.getByRole('button',{name:'5 비교',exact:true})).toHaveAttribute('aria-current','step');
    await nav.getByRole('button',{name:'1 영역',exact:true}).click();await expect(page.locator('.b21ce-overview h2')).toBeFocused();
    await expect(page.locator('.b21ce-area-toggle')).toHaveAttribute('aria-expanded','true');
    await page.locator('[data-area="area-decoration"]').click();await expect(page.locator('.b21ce-concept-heading')).toBeFocused();
    await expect(page.locator('.b21ce-area-toggle')).toHaveAttribute('aria-expanded','false');
    await expect(page.locator('[data-node-choice="decorator"]')).toBeInViewport();
    await page.keyboard.press('Tab');await expect(page.locator('[data-node-choice="decorator"]')).toBeFocused();check(true,'mobile area change collapses the list and places keyboard navigation at the concepts');
    await select('generator');await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();
    await expect(page.getByRole('button',{name:'지도 기본 크기',exact:true})).toHaveAttribute('aria-expanded','true');
    check(await svg.evaluate(el=>el.clientHeight)>=500,'expanded mobile map provides >=500px direct manipulation space');
    check(await page.locator('.b21ce-camera button').evaluateAll(es=>es.every(e=>{const b=e.getBoundingClientRect();return b.width>=44&&b.height>=48;})),'map controls provide 44x48px or larger touch targets');
    await page.locator('.b21ce-selection-heading').focus();await page.locator('.b21ce-selection-heading').evaluate(el=>el.scrollIntoView({block:'start'}));
    await page.screenshot({path:resolve(output,`expanded-viewport-${width}.png`)});
    await svg.evaluate(el=>el.scrollIntoView({block:'center'}));
    const point=await svg.evaluate(el=>{const b=el.getBoundingClientRect();for(let y=Math.max(b.top+20,100);y<Math.min(b.bottom-50,innerHeight-50);y+=20)for(let x=b.left+20;x<b.right-60;x+=20){const hit=document.elementFromPoint(x,y);if(hit&&el.contains(hit)&&!hit.closest('[data-explorer-node],[data-explorer-edge]'))return {x,y};}throw Error('No visible background for touch pan');});
    const session=await page.context().newCDPSession(page),before=await svg.getAttribute('viewBox');
    try{
      await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:point.x,y:point.y}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+35,y:point.y+25}]});
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect.poll(()=>svg.getAttribute('viewBox')).not.toBe(before);check(true,'emulated finger drag moves the map camera');
    }finally{await session.send('Emulation.setTouchEmulationEnabled',{enabled:false});await session.detach();}
    await page.getByRole('button',{name:'지도 기본 크기',exact:true}).click();await expect(svg).toHaveCSS('height','360px');
    await page.getByRole('button',{name:'지도 크게 보기',exact:true}).focus();await page.keyboard.press('Tab');
    check(await page.evaluate(()=>!document.activeElement?.closest('.b21ce-camera')),'keyboard can leave the map controls without a focus trap');
  }
  await select('generator');await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();
  await page.locator('.b21ce-selection-heading').focus();await page.locator('.b21ce-selection-heading').evaluate(el=>el.scrollIntoView({block:'start'}));
  await page.screenshot({path:resolve(output,`map-viewport-${width}.png`)});
  return {width,readable,mobileFocusChecked:width<700,expandedTouchPan:width<700};
}
