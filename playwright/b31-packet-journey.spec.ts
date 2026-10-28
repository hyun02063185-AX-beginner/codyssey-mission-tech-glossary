import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync} from 'node:fs';
import {steps,packet,phases,decision,natChange,traces} from '../src/b31PacketJourney/data';
const path='/#/missions/main-M05/guide?document=supplement#packet-journey';
const url=(path:string)=>(process.env.PACKET_QA_BASE_URL??'')+path;
const journey=(page:import('@playwright/test').Page)=>page.getByRole('region',{name:'패킷의 여행 체험',exact:true});
const open=async(page:import('@playwright/test').Page)=>{await page.goto(url(path));await expect(journey(page)).toBeVisible();await page.evaluate(()=>document.fonts.ready);};

for(const width of [1280,390,360])for(const theme of ['light','dark'])test(`${width} ${theme}: complete topology, readable rules, NAT and protected guide`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({colorScheme:theme==='dark'?'dark':'light',reducedMotion:'reduce'});await open(page);
  const root=journey(page);await root.getByLabel('패킷 체험 테마').selectOption(theme);await expect(root).toHaveAttribute('data-journey-theme',theme);
  await expect(root.locator('.pj-map [data-node]')).toHaveCount(10);await expect(root.locator('.pj-edges line')).toHaveCount(11);
  for(let i=0;i<16;i++)await root.getByRole('button',{name:'한 단계 진행',exact:true}).click();
  await expect(root).toHaveAttribute('data-step','16');await expect(root.locator('[data-nat=before]')).toHaveText('198.51.100.80:80');await expect(root.locator('[data-nat=after]')).toHaveText('10.20.10.20:80');
  const metrics=await root.evaluate(el=>{
    const svg=el.querySelector('svg')!,v=svg.viewBox.baseVal,screen=svg.getBoundingClientRect(),scale=screen.width/v.width;
    const box=(t:Element)=>{const b=t.getBoundingClientRect();return {x:(b.x-screen.x)/scale,y:(b.y-screen.y)/scale,width:b.width/scale,height:b.height/scale};};
    const outside=[...svg.querySelectorAll('text')].filter(t=>{const b=box(t);return b.x<0||b.y<0||b.x+b.width>v.width+1||b.y+b.height>v.height+1;}).map(t=>t.textContent);
    const boxes=[...svg.querySelectorAll('text')].map(t=>({text:t.textContent,box:box(t)})),overlaps:string[][]=[];
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i].box,b=boxes[j].box;if(Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x)>1&&Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)>2)overlaps.push([boxes[i].text??'',boxes[j].text??'']);}
    const rgb=(s:string)=>(s.match(/[\d.]+/g)??[]).slice(0,3).map(Number),lum=(c:number[])=>c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
    const contrast=(a:string,b:string)=>{const x=lum(rgb(a)),y=lum(rgb(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    const minContrast=Math.min(...['--pj-ink','--pj-muted','--pj-dns','--pj-request','--pj-response'].map(key=>{const probe=document.createElement('span');el.append(probe);probe.style.color=`var(${key})`;const fg=getComputedStyle(probe).color;probe.style.color='var(--pj-bg)';const bg=getComputedStyle(probe).color;probe.style.color='var(--pj-panel)';const panel=getComputedStyle(probe).color;probe.remove();return Math.min(contrast(fg,bg),contrast(fg,panel));}));
    return {outside,overlaps,minContrast,overflow:document.documentElement.scrollWidth>innerWidth+1,minFont:Math.min(...[...svg.querySelectorAll('text')].map(t=>parseFloat(getComputedStyle(t).fontSize)))};
  });
  expect(metrics.outside).toEqual([]);expect(metrics.overlaps).toEqual([]);expect(metrics.overflow).toBe(false);expect(metrics.minFont).toBeGreaterThanOrEqual(13);expect(metrics.minContrast).toBeGreaterThanOrEqual(4.5);
  await root.getByRole('button',{name:'그림 확대',exact:true}).click();const scroll=root.getByRole('region',{name:/전체 네트워크/});await expect(scroll.locator('svg')).toHaveAttribute('width',/\d/);await scroll.focus();await page.keyboard.press('ArrowRight');expect(await scroll.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);await root.getByRole('button',{name:'전체 크기로',exact:true}).click();
  await expect(page.locator('.b31-figure-supplement img')).toHaveCount(6);for(const img of await page.locator('.b31-figure-supplement img').all())expect(await img.evaluate(el=>(el as HTMLImageElement).complete&&(el as HTMLImageElement).naturalWidth>0)).toBe(true);
  if(process.env.PACKET_QA_CAPTURE==='1'&&((width===1280&&theme==='light')||(width===390&&theme==='dark'))){if(width===1280)for(let i=0;i<5;i++)await root.getByRole('button',{name:'한 단계 진행',exact:true}).click();mkdirSync('reports/b3-1-packet-journey',{recursive:true});await root.screenshot({path:`reports/b3-1-packet-journey/${width}-${theme}.png`,animations:'disabled'});}
  if(width<=700){const nav=page.locator('.guide-mobile-nav');await expect(nav).toBeVisible();await nav.locator('summary').click();await expect(nav.locator('nav li')).toHaveCount(7);await nav.locator('a[href="#/missions/main-M05/guide/03-internet-path"]').click();await expect(page.locator('.guide-prose h1')).toContainText('3. Public Subnet');}
});

test('all 26 stages match the original contract in the actual guide',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await open(page);const root=journey(page),evidence=[];
  for(let i=0;i<26;i++){
    const step=steps[i],info=packet(step),rule=decision(step),nat=natChange(step);
    await expect(root).toHaveAttribute('data-step',String(i));await expect(root).toHaveAttribute('data-phase',phases[step.p].name);
    await expect(root.locator('[data-node][data-active=true]')).toHaveAttribute('data-node',step.node);await expect(root.locator('[data-packet=source]')).toHaveText(info.source);await expect(root.locator('[data-packet=destination]')).toHaveText(info.destination);
    await expect(root.locator('.pj-decision [data-selected=true]')).toHaveCount(rule.rows.filter(r=>r[2]).length);
    for(const [criterion,result] of rule.rows.filter(r=>r[2])){await expect(root.locator('.pj-decision [data-selected=true]')).toContainText(criterion);await expect(root.locator('.pj-decision [data-selected=true]')).toContainText(result);}
    await expect(root.locator('.pj-traces line')).toHaveCount(traces(i).length);await expect(root.locator('.pj-traces [data-current=true]')).toHaveCount(traces(i).filter(t=>t.current).length);
    if(nat){await expect(root.locator('[data-nat=before]')).toHaveText(nat.before[nat.field]);await expect(root.locator('[data-nat=after]')).toHaveText(nat.after[nat.field]);}
    else await expect(root.locator('.pj-nat')).toHaveCount(0);
    evidence.push({step:i+1,phase:phases[step.p].name,node:step.node,...info,selected:rule.rows.filter(r=>r[2]),nat});
    if(i<25){const next=root.getByRole('button',{name:'한 단계 진행',exact:true});if(i===0){await next.focus();await page.keyboard.press('Enter');}else await next.click();}
  }
  await expect(root.getByRole('button',{name:'한 단계 진행',exact:true})).toBeDisabled();await root.getByRole('button',{name:'이전 단계',exact:true}).click();await expect(root).toHaveAttribute('data-step','24');await root.getByRole('button',{name:'처음부터 재시작',exact:true}).click();await expect(root).toHaveAttribute('data-step','0');await expect(root.locator('.pj-traces line')).toHaveCount(0);
  if(process.env.PACKET_QA_CAPTURE==='1'){mkdirSync('reports/b3-1-packet-journey',{recursive:true});writeFileSync('reports/b3-1-packet-journey/26-stage-evidence.json',JSON.stringify(evidence,null,2)+'\n');}
  await test.info().attach('26-stage-evidence',{body:JSON.stringify(evidence,null,2),contentType:'application/json'});
});

test('real animation pauses mid-flight, resumes, advances manually and cleans up on navigation',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(()=>{
    const raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window),pending=new Set<number>();
    (window as unknown as {pjPending:Set<number>}).pjPending=pending;
    const timeout=window.setTimeout.bind(window),clear=window.clearTimeout.bind(window),timers=new Set<number>();
    (window as unknown as {pjTimers:Set<number>}).pjTimers=timers;
    window.setTimeout=(handler,ms,...args)=>{if(ms!==900)return timeout(handler,ms,...args);const id=timeout(()=>{timers.delete(id);if(typeof handler==='function')handler(...args);},ms);timers.add(id);return id;};
    window.clearTimeout=id=>{if(id!==undefined)timers.delete(id);clear(id);};
    window.requestAnimationFrame=fn=>{const id=raf(t=>{pending.delete(id);fn(t);});pending.add(id);return id;};window.cancelAnimationFrame=id=>{pending.delete(id);cancel(id);};
  });
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await open(page);const root=journey(page);
  await root.getByRole('button',{name:'자동 재생',exact:true}).click();await expect(root).toHaveAttribute('data-moving','true');await page.waitForTimeout(160);await root.getByRole('button',{name:'일시정지',exact:true}).click();
  await expect(root).toHaveAttribute('data-moving','false');const paused=await root.locator('.pj-marker').getAttribute('transform');await page.waitForTimeout(250);await expect(root.locator('.pj-marker')).toHaveAttribute('transform',paused!);
  await root.getByRole('button',{name:'이어서 재생',exact:true}).click();await expect(root).toHaveAttribute('data-step','1');await root.getByRole('button',{name:'일시정지',exact:true}).click();await root.getByRole('button',{name:'한 단계 진행',exact:true}).click();await expect(root).toHaveAttribute('data-step','2');await expect(root).toHaveAttribute('data-playing','false');
  await root.getByRole('button',{name:'처음부터 재시작',exact:true}).click();await expect(root).toHaveAttribute('data-step','0');await root.getByRole('button',{name:'자동 재생',exact:true}).click();
  await page.evaluate(()=>{location.hash='/terms/packet';});await expect(root).toHaveCount(0);await page.waitForTimeout(1000);expect(await page.evaluate(()=>(window as unknown as {pjPending:Set<number>}).pjPending.size)).toBe(0);await open(page);await journey(page).getByRole('button',{name:'자동 재생',exact:true}).click();await expect(journey(page)).toHaveAttribute('data-step','1');
  await expect.poll(()=>page.evaluate(()=>(window as unknown as {pjTimers:Set<number>}).pjTimers.size)).toBe(1);
  await page.evaluate(()=>{location.hash='/terms/packet';});await expect(journey(page)).toHaveCount(0);
  expect(await page.evaluate(()=>(window as unknown as {pjTimers:Set<number>}).pjTimers.size)).toBe(0);expect(errors).toEqual([]);
});

test('reduced motion still supports autoplay, pause and completion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});await page.clock.install();await open(page);const root=journey(page);
  await root.getByRole('button',{name:'자동 재생',exact:true}).click();await expect(root).toHaveAttribute('data-moving','false');await expect(root).toHaveAttribute('data-step','1');for(let i=2;i<26;i++){await page.clock.runFor(900);await expect(root).toHaveAttribute('data-step',String(i));}await expect(root).toHaveAttribute('data-playing','false');
  await root.getByRole('button',{name:'처음부터 재생',exact:true}).click();await expect(root).toHaveAttribute('data-step','0');await root.getByRole('button',{name:'일시정지',exact:true}).click();await page.clock.runFor(2000);await expect(root).toHaveAttribute('data-step','0');
});

test('chapter anchors, seven chapters, guide links and map/term learning links work',async({page,context})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(url('/#/missions/main-M05/guide'));await expect(page.locator('.guide-index nav li')).toHaveCount(7);
  await page.goto(url('/#/missions/main-M05/guide/02-network-aws-map'));await page.getByRole('link',{name:'패킷의 여행 체험',exact:true}).click();await expect(page.locator('#packet-journey')).toBeFocused();await expect(journey(page)).toBeVisible();await journey(page).getByRole('button',{name:'한 단계 진행',exact:true}).click();await expect(journey(page)).toHaveAttribute('data-step','1');
  await page.getByText('이 문서의 주요 제목',{exact:true}).click();await page.locator('.guide-headings').getByRole('link',{name:/체험 학습 — 패킷의 여행/}).click();await expect(page.locator('#packet-journey')).toBeFocused();
  await expect(journey(page)).toHaveAttribute('data-step','1');
  const root=journey(page),mapPromise=context.waitForEvent('page');await root.getByRole('link',{name:'개념지도: 라우터와 경로 선택 ↗',exact:true}).click();const map=await mapPromise;await expect(map.locator('.map-canvas')).toBeVisible();await expect(map).toHaveURL(/node=gen%3Arouting/);await map.close();
  for(const link of await root.locator('.pj-learning-links div a').all()){
    const next=context.waitForEvent('page');await link.click();const term=await next;await expect(term.locator('article h1')).not.toBeEmpty();await term.close();await expect(root).toHaveAttribute('data-step','1');
  }
  await page.goto(url('/#/missions/main-M05/story-map?scene=scene-02'));await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-02');
});
