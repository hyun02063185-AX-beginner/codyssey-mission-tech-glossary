import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const data=JSON.parse(readFileSync('src/b61ConceptMap/data.json','utf8')) as {nodes:Array<{id:string;label:string}>;relations:Array<{id:string;from:string;to:string;label:string}>};

const output='reports/b61-concept-map';mkdirSync(output,{recursive:true});
const map='/missions/main-M11/story/concepts',base='/#'+map;
test.describe.configure({mode:'parallel'});
for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])for(const colorScheme of ['light','dark'] as const)test(`${width} ${colorScheme}: themes, geometry, selection and panel lifecycle`,async({page})=>{
 test.setTimeout(120000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme,reducedMotion:'reduce'});
 const errors:string[]=[],metrics:unknown[]=[];page.on('pageerror',e=>errors.push(e.message));
 for(const theme of ['forest','indigo','paper','signal']){
  await page.goto(base);await page.locator('.b61cm-svg').waitFor();await page.locator('.learning-focus-menu summary').click();await page.getByLabel('화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
  await expect(page.locator('html')).toHaveAttribute('data-accent-theme',theme);await expect(page.locator('.mission-presentation')).toHaveCount(0);
  await expect(page.locator('[data-node]')).toHaveCount(11);await expect(page.locator('[data-relation]')).toHaveCount(12);await expect(page.locator('.b61cm-relation.is-active')).toHaveCount(7);await expect(page.locator('.b61cm-relation.is-muted')).toHaveCount(5);await expect(page.locator('.mission-detail-panel')).toHaveCount(0);
  const initial=await page.locator('.b61cm-svg').boundingBox();expect(initial!.height).toBeGreaterThan(height*.5);
  const overview=await page.locator('.b61cm-svg').evaluate(el=>{
   const s=el as SVGSVGElement,r=s.getBoundingClientRect(),scale=r.width/s.viewBox.baseVal.width;
   return {overflow:document.documentElement.scrollWidth>innerWidth,inside:[...el.querySelectorAll('[data-node]')].every(n=>{const b=n.getBoundingClientRect();return b.left>=r.left&&b.right<=r.right&&b.top>=r.top&&b.bottom<=r.bottom;}),minName:Math.min(...[...el.querySelectorAll('.b61cm-node-name')].map(n=>parseFloat(getComputedStyle(n).fontSize)*scale)),labelOverlap:[...el.querySelectorAll('[data-label] rect')].some(label=>{const a=label.getBoundingClientRect();return [...el.querySelectorAll('[data-node] rect')].some(node=>{const b=node.getBoundingClientRect();return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;});})};
  });expect(overview.overflow).toBe(false);expect(overview.inside).toBe(width>700);expect(overview.labelOverlap).toBe(false);expect(overview.minName).toBeGreaterThanOrEqual(width>700?14:20);
  expect(new URL(page.url()).hash).toBe('#'+map);
  await expect(page.locator('[data-node][aria-pressed="true"]')).toHaveCount(0);
  for(const id of ['database','dbms'])await expect(page.locator(`[data-node="${id}"]`)).toBeInViewport({ratio:1});
  if(theme==='forest'&&colorScheme==='light')await page.screenshot({path:`${output}/${width}-overview.png`});
  await page.getByRole('button',{name:'전체 보기',exact:true}).click();
  expect(await page.locator('.b61cm-svg').evaluate(el=>{const r=el.getBoundingClientRect();return [...el.querySelectorAll('[data-node]')].every(n=>{const b=n.getBoundingClientRect();return b.left>=r.left&&b.right<=r.right&&b.top>=r.top&&b.bottom<=r.bottom;});})).toBe(true);
  if(width<700&&theme==='forest'&&colorScheme==='light')await page.screenshot({path:`${output}/${width}-whole-map.png`});
  for(const n of data.nodes){
   await page.getByLabel('개념 찾기',{exact:true}).selectOption(n.id);await expect(page.locator('.mission-detail-body h2')).toHaveText(n.label);await expect(page.locator('.mission-detail-body h2')).toBeFocused();
   const count=data.relations.filter(r=>r.from===n.id||r.to===n.id).length;await expect(page.locator('.b61cm-relation.is-active')).toHaveCount(count);
   await expect.poll(()=>page.locator('.b61cm-svg').evaluate((el,id)=>{const r=el.getBoundingClientRect(),b=el.querySelector(`[data-node="${id}"]`)!.getBoundingClientRect();return b.left>=r.left-1&&b.right<=r.right+1&&b.top>=r.top-1&&b.bottom<=r.bottom+1;},n.id)).toBe(true);
   const readable=await page.locator('.b61cm-svg').evaluate(el=>parseFloat(getComputedStyle(el.querySelector('.b61cm-node-name')!).fontSize)*el.clientWidth/(el as SVGSVGElement).viewBox.baseVal.width);expect(readable).toBeGreaterThanOrEqual(20);
   await expect(page.locator('.mission-detail-panel a').first()).not.toHaveAttribute('href',/#\/terms\/(dbms|row|column|relationship)(?:\?|$)/);
  }
  await page.getByLabel('개념 찾기',{exact:true}).selectOption('fk');
  const split=await page.locator('.b61cm-svg').boundingBox(),panel=await page.locator('.mission-detail-panel').boundingBox();
  expect(width>700?split!.x+split!.width<=panel!.x:split!.y+split!.height<=panel!.y).toBe(true);expect(width>700?panel!.width<=350:Math.abs(panel!.height-height*.43)<2).toBe(true);
  if(theme==='forest'&&colorScheme==='light')await page.screenshot({path:`${output}/${width}-selected-fk.png`});
  const selection=page.url();await page.getByRole('button',{name:'상세 패널 닫기'}).click();await expect(page.getByRole('button',{name:'설명 열기',exact:true})).toBeFocused();expect(page.url()).toBe(selection);
  await expect.poll(async()=>{const r=(await page.locator('.b61cm-svg').boundingBox())!;return width>700?r.width:r.height;}).toBeCloseTo(width>700?initial!.width:initial!.height,0);
  await page.getByRole('button',{name:'설명 열기',exact:true}).click();await expect(page.locator('.mission-detail-body h2')).toBeFocused();await page.keyboard.press('Escape');await expect(page.locator('.mission-detail-panel')).toHaveCount(0);
  // Same item opens again without requiring a new URL.
  await page.locator('[data-node="fk"]').press('Enter');await expect(page.locator('.mission-detail-panel')).toBeVisible();
  await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await expect(page.locator('.mission-detail-panel')).toHaveCount(0);await expect(page.locator('.b61cm')).toHaveClass(/is-full/);await page.keyboard.press('Escape');await expect(page.locator('.mission-detail-panel')).toBeVisible();
  await page.getByRole('button',{name:'상세 패널 닫기'}).click();const before=await page.locator('.b61cm-svg').getAttribute('viewBox');await page.getByRole('button',{name:'지도 확대',exact:true}).click();await expect(page.locator('.b61cm-svg')).not.toHaveAttribute('viewBox',before!);
  await page.locator('.b61cm-svg').focus();const zoom=await page.locator('.b61cm-svg').getAttribute('viewBox');await page.keyboard.press('ArrowRight');await expect(page.locator('.b61cm-svg')).not.toHaveAttribute('viewBox',zoom!);
  await page.getByRole('button',{name:'지도 축소',exact:true}).click();await page.getByRole('button',{name:'전체 보기',exact:true}).click();
  metrics.push({theme,...overview,canvas:initial,panel,selected:split});
 }
 expect(errors).toEqual([]);writeFileSync(`${output}/${width}-${colorScheme}-metrics.json`,JSON.stringify({errors,metrics},null,2));
});

test('Story → map → dictionary / guide → map and original Story; safe addresses',async({page})=>{
 test.setTimeout(120000);
 await page.goto('/#/missions/main-M11');await expect(page.locator('[data-material="concepts"] a')).toHaveAttribute('href','#'+map);
 for(const scene of ['01','02','03','04'])for(const screen of ['1','2','3']){
  const story=`/missions/main-M11/story?scene=${scene}&screen=${screen}`;
  await page.goto('/#'+story);await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'개념지도',exact:true}).click();await expect(page.locator('.b61cm-story')).toHaveAttribute('href','#'+story);
  await page.getByLabel('개념 찾기',{exact:true}).selectOption('join');await page.getByRole('link',{name:'용어사전에서 보기 ↗',exact:true}).click();await expect(page.getByRole('navigation',{name:'B6-1 학습으로 복귀'})).toBeVisible();
  await page.getByRole('link',{name:'← B6-1 개념지도로 돌아가기',exact:true}).click();await expect(page.locator('.mission-detail-body h2')).toHaveText('JOIN');await expect(page.locator('.b61cm-story')).toHaveAttribute('href','#'+story);
  await page.getByRole('link',{name:'학습가이드 6장 →',exact:true}).click();await expect(page.getByRole('navigation',{name:'B6-1 학습으로 복귀'})).toBeVisible();
  await page.getByRole('navigation',{name:'학습 단원'}).getByRole('link').first().click();await expect(page.getByRole('navigation',{name:'B6-1 학습으로 복귀'})).toBeVisible();
  await page.getByRole('link',{name:'← B6-1 개념지도로 돌아가기',exact:true}).click();await page.locator('.b61cm-story').click();await expect(page).toHaveURL('/#'+story);await expect(page.locator('.b61-lesson')).toHaveAttribute('data-screen',`S${scene}-${screen}`);
 }
 await page.goto(base+'?node=not-real&returnUrl=https://evil.test');await expect(page).toHaveURL(base);await expect(page.getByRole('status')).toContainText('잘못된 지도 주소');
 await page.goto(base+'?node=dbms');await expect(page.locator('.mission-detail-panel a[href*="/terms/dbms"]')).toHaveCount(0);await expect(page.locator('.mission-detail-panel')).toContainText('SQLite · B6-1이 쓴 DBMS');
 for(const r of data.relations){await page.goto(base+'?relation='+r.id);await expect(page.locator('.mission-detail-body h2')).toHaveText(r.label);await expect(page.locator('.b61cm-relation.is-active')).toHaveCount(1);}
 await page.goto(base+'?node=pk');await page.reload();await expect(page.locator('.mission-detail-body h2')).toHaveText('기본키');await page.getByLabel('개념 찾기',{exact:true}).selectOption('fk');await page.goBack();await expect(page.locator('.mission-detail-body h2')).toHaveText('기본키');
});

for(const width of [360,390])test(`${width}: touch pan and pinch keep the document stationary`,async({page,context})=>{
 await page.setViewportSize({width,height:844});await page.goto(base);await page.locator('.b61cm-svg').waitFor();
 const svg=page.locator('.b61cm-svg'),session=await context.newCDPSession(page);
 await session.send('Emulation.setTouchEmulationEnabled',{enabled:true});
 const rect=(await svg.boundingBox())!,x=rect.x+30,y=rect.y+35,before=await svg.getAttribute('viewBox'),scroll=await page.evaluate(()=>scrollY);
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+30,y:y+25,id:1}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect(svg).not.toHaveAttribute('viewBox',before!);expect(await page.evaluate(()=>scrollY)).toBe(scroll);
 const pan=await svg.getAttribute('viewBox');
 await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1},{x:x+60,y,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-10,y,id:1},{x:x+90,y,id:2}]});await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await expect(svg).not.toHaveAttribute('viewBox',pan!);expect(await page.evaluate(()=>scrollY)).toBe(scroll);await session.detach();
});

for(const [width,height] of [[360,800],[390,844]])test(`${width}: mobile entry, history and camera modes survive rotation and resize`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto(base);const svg=page.locator('.b61cm-svg');await svg.waitFor();
 const camera=()=>svg.evaluate(el=>{const s=el as SVGSVGElement,v=s.viewBox.baseVal;return {scale:el.clientWidth/v.width,x:v.x+v.width/2,y:v.y+v.height/2};});
 const initial=await camera();expect(initial.scale*22).toBeGreaterThanOrEqual(20);
 await page.locator('[data-node="database"]').click();await expect(page.locator('.mission-detail-body h2')).toHaveText('데이터베이스');await page.goBack();
 await expect(page.locator('.mission-detail-panel')).toHaveCount(0);await expect(page).toHaveURL(base);
 await expect.poll(async()=>Math.abs((await camera()).scale-initial.scale)).toBeLessThan(.001);
 await page.setViewportSize({width:height,height:width});await expect.poll(()=>svg.evaluate(el=>el.clientWidth)).toBeGreaterThan(700);
 await page.setViewportSize({width,height});await expect.poll(async()=>Math.abs((await camera()).scale-initial.scale)).toBeLessThan(.001);
 await expect(page.locator('[data-node="database"]')).toBeInViewport({ratio:1});await expect(page.locator('[data-node="dbms"]')).toBeInViewport({ratio:1});
 await page.getByRole('button',{name:'전체 보기',exact:true}).click();await page.setViewportSize({width:height,height:width});await page.setViewportSize({width,height});
 await expect.poll(async()=>(await camera()).scale).toBeLessThan(.4);
 await page.getByRole('button',{name:'지도 확대',exact:true}).click();const manual=await camera();await page.setViewportSize({width:width+20,height:height-20});
 await expect.poll(async()=>Math.abs((await camera()).scale-manual.scale)).toBeLessThan(.001);
 await page.getByLabel('개념 찾기',{exact:true}).selectOption('dbms');await page.setViewportSize({width:height,height:width});
 await expect(page.locator('.mission-detail-body h2')).toHaveText('DBMS');await expect(page.locator('[data-node="dbms"]')).toBeInViewport({ratio:1});
 await page.setViewportSize({width,height});await expect(page.locator('[data-node="dbms"]')).toBeInViewport({ratio:1});
 await page.getByRole('button',{name:'상세 패널 닫기'}).click();await expect(page).toHaveURL(base+'?node=dbms');await expect(page.locator('[data-node="dbms"]')).toBeInViewport({ratio:1});
});

for(const [width,height] of [[1280,720],[1000,720],[360,800],[390,844]])test(`${width}: B2-1 retained graph, area focus, selection, camera and learning navigation`,async({page})=>{
 await page.setViewportSize({width,height});await page.goto('/#/missions/main-M03/story/concepts');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);
 await page.getByLabel('지도 표시 범위',{exact:true}).selectOption('area-iteration');await expect(page.locator('[data-explorer-node]')).toHaveCount(6);await page.locator('[data-explorer-node="generator"]').click();await expect(page.locator('.mission-detail-panel')).toBeVisible();
 await page.getByRole('button',{name:'상세 패널 닫기',exact:true}).click();await expect(page.locator('.mission-detail-panel')).toBeHidden();await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();await page.getByRole('button',{name:'지도 확대',exact:true}).click();await page.getByRole('button',{name:'전체 맞춤',exact:true}).click();
 await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await expect(page.locator('.b21ce')).toHaveClass(/is-map-focus/);await page.keyboard.press('Escape');await expect(page.locator('.b21ce')).not.toHaveClass(/is-map-focus/);
 await page.locator('.learning-focus-menu summary').click();await page.getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.learning-focus-nav')).toBeVisible();await expect(page).toHaveURL(/main-M03\/story/);
});
