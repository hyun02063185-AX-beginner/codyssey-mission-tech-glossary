import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
test.describe.configure({mode:'parallel'});
const out='reports/mission-ui-standard/v1.1';mkdirSync(out,{recursive:true});
const missions=[
 {id:'b2',story:'/missions/main-M03/story?scene=08&step=6',map:'/missions/main-M03/story/concepts',canvas:'.b21ce-svg',node:'[data-explorer-node="generator"]',trigger:'.b21ce-panel-toggle',full:'.b21ce-expand'},
 {id:'b3',story:'/missions/main-M05/story-map?scene=scene-03a',map:'/missions/main-M05/story-map/concepts',canvas:'.map-canvas',node:'[data-map-node="aws:vpc"]',trigger:'.cm-detail-trigger',full:'.cm-focus-toggle'}
];
for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])for(const scheme of ['light','dark'] as const){
 test(`${width} ${scheme}: shared chrome, protected content and split-panel lifecycle`,async({page})=>{
  test.setTimeout(180000);page.setDefaultTimeout(10000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme:scheme,reducedMotion:'reduce'});
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));const rows:unknown[]=[];
  const protectedDesign=new Map<string,string>(),protectedMap=new Map<string,string>();
  let storyNav:string|undefined;
  for(const theme of ['forest','indigo','paper','signal'])for(const m of missions){
   await page.goto('/#'+m.story);await page.locator('.learning-focus-nav').waitFor();await page.evaluate(()=>document.fonts.ready);
   await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);
   await expect(page.locator('html')).toHaveAttribute('data-accent-theme',theme);
   const nav=await page.locator('.learning-focus-nav').evaluate(el=>{
    const s=getComputedStyle(el),a=getComputedStyle(el.querySelector('a')!);return JSON.stringify({height:el.getBoundingClientRect().height,font:s.font,padding:s.padding,gap:s.gap,buttonFont:a.font,buttonPadding:a.padding,border:a.borderRadius});});
   if(storyNav)expect(nav).toBe(storyNav);else storyNav=nav;
   const colors=await page.locator('.learning-focus-nav').evaluate(el=>{const s=getComputedStyle(el);return {bg:s.backgroundColor,color:s.color,expected:s.getPropertyValue('--surface-page').trim()};});
   await expect(page.locator('.learning-focus-menu')).toBeInViewport();
   const contrast=await page.locator('.learning-focus-menu a').first().evaluate(el=>{
    const luminance=(color:string)=>{const rgb=color.match(/[\d.]+/g)!.slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
    const style=getComputedStyle(el),a=luminance(style.color),b=luminance(style.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
   });expect(contrast).toBeGreaterThanOrEqual(4.5);
   if((width===1280||width===360)&&m.id==='b2')await page.locator('.learning-focus-menu>div').screenshot({path:`${out}/${width}-${theme}-${scheme}-menu.png`});
   await page.keyboard.press('Escape');await expect(page.locator('.learning-focus-menu summary')).toBeFocused();
   // Compare content geometry and typography independent of fractional page scroll rasterization.
   const content=page.locator(m.id==='b2'?'.b21t':'.b31-story-art').first();
   await expect(content).toBeVisible();await page.evaluate(()=>document.fonts.ready);
   const design=await content.evaluate(el=>{
    const root=el.shadowRoot??el;
    return JSON.stringify([...root.querySelectorAll('*')].filter(n=>!['STYLE','SCRIPT'].includes(n.tagName.toUpperCase())).map(n=>{
     const s=getComputedStyle(n),r=n.getBoundingClientRect(),round=(v:number)=>Math.round(v*100)/100;
     return [n.tagName,n.textContent?.trim(),round(r.width),round(r.height),s.fontFamily,s.fontSize,s.fontWeight,s.lineHeight,s.letterSpacing,s.fill,s.stroke];
    }));
   });
   if(protectedDesign.has(m.id))expect(design,`${m.id} ${theme} protected geometry/styles`).toBe(protectedDesign.get(m.id));else protectedDesign.set(m.id,design);
   await page.evaluate(()=>scrollTo(0,0));
   if(scheme==='light'&&(theme==='forest'||width===360||width===1280))await page.screenshot({path:`${out}/${width}-${m.id}-${theme}-story.png`});
   await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'개념지도',exact:true}).click();
   const contextual=page.url();await page.goto('/#'+m.map);await page.locator(m.canvas).waitFor();
   await expect(page.locator('.mission-detail-panel')).toBeHidden();
   const plain=(await page.locator(m.canvas).boundingBox())!;
   if(m.id==='b2')await page.getByLabel('모든 개념 찾기',{exact:true}).selectOption('generator');
   else {await page.getByRole('button',{name:'탐색 도구 펼치기',exact:true}).click();await page.getByRole('searchbox').fill('VPC');await page.locator('.cm-search-results').getByRole('button',{name:/^VPC/}).first().click();}
   await expect(page.locator('.mission-detail-panel')).toBeVisible();
   const selected=page.url(),panel=page.locator('.mission-detail-panel'),body=page.locator('.mission-detail-body');
   await expect(page.locator(m.id==='b2'?'.b21ce-detail h2':'#cm-detail-title')).toBeFocused();
   await expect.poll(async()=>{const a=(await page.locator(m.canvas).boundingBox())!,b=(await panel.boundingBox())!;return width>700?a.x+a.width<=b.x+1:a.y+a.height<=b.y+1;}).toBe(true);
   await expect.poll(async()=>{const n=(await page.locator(m.node).boundingBox())!,c=(await page.locator(m.canvas).boundingBox())!;return n.x>=c.x-1&&n.y>=c.y-1&&n.x+n.width<=c.x+c.width+1&&n.y+n.height<=c.y+c.height+1;}).toBe(true);
   const detail=(await page.locator(m.canvas).boundingBox())!,header=(await page.locator('.mission-detail-header').boundingBox())!;
   await body.evaluate(el=>el.scrollTop=el.scrollHeight);expect((await page.locator('.mission-detail-header').boundingBox())!.y).toBe(header.y);
   const fingerprint=await page.locator(m.canvas).evaluate(el=>JSON.stringify([...el.querySelectorAll('rect,text,path')].map(n=>{const s=getComputedStyle(n);return [n.getAttribute('x'),n.getAttribute('y'),n.getAttribute('d'),s.fill,s.stroke,s.fontSize,s.letterSpacing];})));
   // B3 retains its pre-existing theme-specific selection/edge accent. Educational domain colours are fixed.
   const semantic=await page.locator(m.id==='b2'?'.b21ce-region':'.map-region').evaluateAll(els=>JSON.stringify(els.map(el=>[...el.querySelectorAll('rect,text')].map(n=>[getComputedStyle(n).fill,getComputedStyle(n).stroke]))));
   if(protectedMap.has(m.id))expect(semantic).toBe(protectedMap.get(m.id));else protectedMap.set(m.id,semantic);
   await body.evaluate(el=>el.scrollTop=0);
   if(scheme==='light'&&(theme==='forest'||width===360||width===1280))await page.screenshot({path:`${out}/${width}-${m.id}-${theme}-detail.png`});
   // Fullscreen folds the panel, then restores the previous open state and selection.
   await page.locator(m.full).click();await expect(panel).toBeHidden();await page.keyboard.press('Escape');await expect(panel).toBeVisible();await expect(page.locator(m.full)).toBeFocused();expect(page.url()).toBe(selected);
   await page.getByRole('button',{name:'상세 패널 닫기',exact:true}).click();await expect(panel).toBeHidden();await expect(page.locator(m.trigger)).toBeFocused();
   await expect.poll(async()=>{const r=(await page.locator(m.canvas).boundingBox())!;return width>700?r.width:r.height;}).toBeCloseTo(width>700?plain.width:plain.height,0);
   expect(page.url()).toBe(selected);
   // Re-select the very same SVG node with the keyboard after closing.
   await page.locator(m.node).focus();await page.keyboard.press('Enter');await expect(panel).toBeVisible();
   await expect.poll(()=>body.evaluate(el=>el.scrollTop)).toBe(0);
   await page.keyboard.press('Escape');await expect(panel).toBeHidden();await expect(page.locator(m.trigger)).toBeFocused();
   await page.locator(m.trigger).click();await page.reload();await expect(panel).toBeVisible();expect(page.url()).toBe(selected);
   await page.locator(m.id==='b2'?'.b21ce-detail [data-term-id="generator"] a':'.cm-term-links a').first().click();await expect(page.locator('.site-header')).toBeVisible();await page.reload();
   await page.locator(m.id==='b2'?'.b21-service-return a':'.b31-context-return a').click();await expect(page).toHaveURL(selected);
   // Relations share the same open/close/reselection contract; dispatch hits the existing SVG edge handler.
   const attr=m.id==='b2'?'data-explorer-edge':'data-relation-hit',edgeId=await page.locator(`[${attr}]`).first().getAttribute(attr);
   const edge=page.locator(`[${attr}="${edgeId}"]`);
   await edge.dispatchEvent('click');await expect(panel).toBeVisible();const relationURL=page.url();
   await page.getByRole('button',{name:'상세 패널 닫기',exact:true}).click();await expect(panel).toBeHidden();
   await edge.dispatchEvent('click');await expect(panel).toBeVisible();expect(page.url()).toBe(relationURL);
   // Restore originating Story through its actual menu link.
   await page.goto(contextual);await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'미션 스토리',exact:true}).click();
   if(m.id==='b2')await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');else await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-03a');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   rows.push({mission:m.id,theme,plain,detail,header,colors,semantic,contrast,fingerprintLength:fingerprint.length});
  }
  expect(errors).toEqual([]);writeFileSync(`${out}/${width}-${scheme}.json`,JSON.stringify({status:'PASS',width,height,scheme,rows},null,2));
 });
}
