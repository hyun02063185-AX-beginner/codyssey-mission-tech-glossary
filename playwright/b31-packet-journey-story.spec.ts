import {test,expect} from '@playwright/test';
import {steps,packet,decision,natChange} from '../src/b31PacketJourney/data';
import {mkdirSync} from 'node:fs';
const base=process.env.PACKET_QA_BASE_URL??'';
const story=base+'/#/missions/main-M05/story-map?scene=scene-02';
const root=(page:import('@playwright/test').Page)=>page.locator('.b31-packet-lesson .packet-journey');

for(const width of [1280,390])for(const theme of ['dark','light'])test(`${width} ${theme}: Scene 02 keeps the figure and directly runs all 26 stages`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(value=>localStorage.setItem('codyssey-presentation-theme',value),theme);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(story);
  await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-02');await expect(page.locator('[data-foundation-card]')).toHaveCount(1);
  await expect(page.locator('.b31-story-art svg')).toHaveCount(1);await expect(root(page)).toHaveCount(1);await expect(root(page)).toHaveAttribute('data-playing','false');await expect(root(page)).toHaveAttribute('data-step','0');
  await expect(page.locator('.b31-packet-lesson')).toContainText('연결선은 이동할 수 있는 통로입니다.');
  await expect(page.getByLabel('Scene 선택',{exact:true}).locator('option')).toHaveCount(5);
  const order=await page.locator('.b31-current-scene').evaluate(el=>{const figure=el.querySelector('.b31-story-figure')!,lesson=el.querySelector('.b31-packet-lesson')!;return {afterFigure:Boolean(figure.compareDocumentPosition(lesson)&Node.DOCUMENT_POSITION_FOLLOWING),width:lesson.getBoundingClientRect().width,parent:el.getBoundingClientRect().width};});
  expect(order.afterFigure).toBe(true);expect(order.width).toBeGreaterThan(width===1280?1100:300);
  await root(page).getByLabel('패킷 체험 테마').selectOption(theme);
  // Existing static flow and zoom controls continue to target only the static figure.
  await page.getByRole('button',{name:'요청 강조',exact:true}).click();await expect(page.locator('.b31-story-art')).toHaveAttribute('data-flow','request');
  await page.getByRole('button',{name:'그림 확대하기',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.getByRole('button',{name:'원래 화면으로 돌아가기',exact:true}).click();
  for(let i=0;i<26;i++){
    const s=steps[i],info=packet(s),nat=natChange(s);
    await expect(root(page)).toHaveAttribute('data-step',String(i));await expect(root(page).locator('[data-packet=source]')).toHaveText(info.source);await expect(root(page).locator('[data-packet=destination]')).toHaveText(info.destination);
    await expect(root(page).locator('[data-node][data-active=true]')).toHaveAttribute('data-node',s.node);
    for(const [prefix,next] of decision(s).rows.filter(r=>r[2])){await expect(root(page).locator('.pj-decision [data-selected=true]')).toContainText(prefix);await expect(root(page).locator('.pj-decision [data-selected=true]')).toContainText(next);}
    if(nat){await expect(root(page).locator('[data-nat=before]')).toHaveText(nat.before[nat.field]);await expect(root(page).locator('[data-nat=after]')).toHaveText(nat.after[nat.field]);}
    if(i===21&&process.env.PACKET_QA_CAPTURE==='1'&&((width===1280&&theme==='light')||(width===390&&theme==='dark'))){
      await page.evaluate(()=>document.fonts.ready);mkdirSync('reports/b3-1-packet-journey',{recursive:true});await page.locator('.b31-packet-lesson').screenshot({path:`reports/b3-1-packet-journey/scene02-${width}-${theme}.png`,animations:'disabled'});
    }
    if(i<25)await root(page).getByRole('button',{name:'한 단계 진행',exact:true}).click();
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  await root(page).getByRole('button',{name:'처음부터 재시작',exact:true}).click();await expect(root(page)).toHaveAttribute('data-step','0');await root(page).getByRole('button',{name:'그림 확대',exact:true}).click();expect(await root(page).locator('.pj-map-scroll').evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);await root(page).getByRole('button',{name:'전체 크기로',exact:true}).click();
  await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-03a');await expect(root(page)).toHaveCount(0);await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','scene-03a');
  await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-02');await expect(root(page)).toHaveAttribute('data-step','0');await expect(root(page)).toHaveAttribute('data-playing','false');expect(errors).toEqual([]);
});

for(const width of [1280,390])test(`${width}: lecture autoplay pauses and Scene changes clear flights and timers`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(()=>{
    const raf=requestAnimationFrame.bind(window),cancel=cancelAnimationFrame.bind(window),frames=new Set<number>(),timers=new Set<number>(),timeout=setTimeout.bind(window),clear=clearTimeout.bind(window);
    (window as any).pjLecture={frames,timers};
    window.requestAnimationFrame=fn=>{const id=raf(t=>{frames.delete(id);fn(t);});frames.add(id);return id;};window.cancelAnimationFrame=id=>{frames.delete(id);cancel(id);};
    window.setTimeout=(handler,ms,...args)=>{if(ms!==900)return timeout(handler,ms,...args);const id=timeout(()=>{timers.delete(id);if(typeof handler==='function')handler(...args);},ms);timers.add(id);return id;};window.clearTimeout=id=>{if(id!==undefined)timers.delete(id);clear(id);};
  });
  await page.goto(story);await root(page).getByRole('button',{name:'자동 재생',exact:true}).click();await expect(root(page)).toHaveAttribute('data-moving','true');await page.waitForTimeout(120);await root(page).getByRole('button',{name:'일시정지',exact:true}).click();
  const stopped=await root(page).locator('.pj-marker').getAttribute('transform');await page.waitForTimeout(150);await expect(root(page).locator('.pj-marker')).toHaveAttribute('transform',stopped!);
  await root(page).getByRole('button',{name:'이어서 재생',exact:true}).click();await expect(root(page)).toHaveAttribute('data-step','1');await expect.poll(()=>page.evaluate(()=>(window as any).pjLecture.timers.size)).toBe(1);
  await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-03a');await expect(root(page)).toHaveCount(0);expect(await page.evaluate(()=>(window as any).pjLecture.timers.size)).toBe(0);
  await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-02');await root(page).getByRole('button',{name:'자동 재생',exact:true}).click();await expect(root(page)).toHaveAttribute('data-moving','true');await page.getByLabel('Scene 선택',{exact:true}).selectOption('scene-01');await expect(root(page)).toHaveCount(0);expect(await page.evaluate(()=>(window as any).pjLecture.frames.size)).toBe(0);
  await page.goto(base+'/#/missions/main-M05/guide?document=supplement#packet-journey');const review=page.locator('.packet-journey');await expect(review).toHaveCount(1);await expect(review).toHaveAttribute('data-step','0');await expect(review).toHaveAttribute('data-playing','false');
});
