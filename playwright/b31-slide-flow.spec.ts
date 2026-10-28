import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const base=process.env.B31_SLIDE_BASE??'';
const story=base+'/#/missions/main-M05/story-map';
const ids=['slide-intro','slide-network','slide-packet','scene-01','scene-02','scene-03a','scene-03b','scene-04'];
const titles=['왜 네트워크를 다시 배울까?','네트워크 기초: 주소와 구역','패킷과 프로토콜','전체 연결망 한눈에 보기','패킷의 여행 직접 시연','AWS에서 다시 보기','B3-1 접속 조건 확인','내 말로 설명하기'];
for(const width of [1280,390])for(const theme of ['light','dark'])test(`${width} ${theme}: lecture slides follow the learning order`,async({page})=>{
 await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.addInitScript(value=>localStorage.setItem('codyssey-presentation-theme',value),theme);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(story);await expect(page.locator('.mission-story-scenes li')).toHaveCount(8);await page.getByRole('link',{name:'강의 시작하기 →'}).click();
 for(const [i,id] of ids.entries()){
  const scene=page.locator('.b31-current-scene');await expect(scene).toHaveAttribute('data-scene',id);await expect(page.locator('#b31-scene-title')).toHaveText(titles[i]);await expect(page.locator('.b31-scene-traversal')).toContainText(`Slide ${i+1} / 8`);await expect(page.getByLabel('Scene 선택',{exact:true})).toHaveValue(id);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  if(id==='scene-01'){await expect(scene.locator('.b31-overview-node')).toHaveCount(10);await expect(scene.locator('.b31-overview-lines line')).toHaveCount(11);await expect(scene.locator('.packet-journey')).toHaveCount(0);
   const outside=await scene.locator('.b31-overview-node').evaluateAll(nodes=>nodes.flatMap(node=>{const box=node.querySelector('rect')!.getBoundingClientRect();return [...node.querySelectorAll('text')].filter(text=>{const r=text.getBoundingClientRect();return r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1;}).map(text=>text.textContent);}));expect(outside).toEqual([]);
  }
  if(id==='scene-02'){await expect(scene.getByRole('link',{name:'다음 슬라이드로 이동'})).toBeVisible();await expect(scene.locator('.packet-journey')).toHaveCount(1);await expect(scene.locator('.packet-journey')).toHaveAttribute('data-step','0');await expect(scene.locator('.packet-journey')).toHaveAttribute('data-playing','false');await expect(scene.locator('.b31-story-art svg')).toBeHidden();await scene.getByLabel('패킷 체험 테마').selectOption(theme);await expect(scene.locator('.packet-journey')).toHaveAttribute('data-journey-theme',theme);}
  if(process.env.B31_SLIDE_CAPTURE==='1'&&((width===1280&&theme==='light'&&['slide-packet','scene-01','scene-02','scene-03a'].includes(id))||(width===390&&theme==='dark'&&id==='scene-02'))){mkdirSync('reports/b3-1-slide-flow-restructure',{recursive:true});await scene.screenshot({path:`reports/b3-1-slide-flow-restructure/${width}-${theme}-${id}.png`,animations:'disabled'});}
  if(i<ids.length-1)await page.locator('.b31-scene-traversal [rel=next]').click();
 }
 await expect(page.getByRole('button',{name:'다음 슬라이드'})).toBeDisabled();await expect(page.getByRole('link',{name:'개념지도에서 관계 살펴보기 →'})).toBeVisible();for(const id of [...ids].reverse().slice(1)){await page.getByRole('link',{name:'이전 슬라이드',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',id);}expect(errors).toEqual([]);
});

test('new slide map link returns to the same slide and legacy URLs remain valid',async({page})=>{
 await page.goto(story+'?scene=slide-network');await page.locator('.b31-slide-links summary').click();await page.getByRole('link',{name:'관련 개념을 지도에서 보기 →'}).click();await expect(page.locator('.map-canvas')).toBeVisible();await expect(page).toHaveURL(/scene=slide-network/);await page.locator('.learning-focus-menu summary').click();await page.locator('.learning-focus-menu').getByRole('link',{name:'미션 스토리',exact:true}).click();await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene','slide-network');await expect(page.getByRole('link',{name:'← 이전 선택으로 개념지도 돌아가기'})).toBeVisible();
 for(const id of ids.slice(3)){await page.goto(story+'?scene='+id);await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',id);}
});
