import {test,expect} from '@playwright/test';
const story='/#/missions/main-M05/story-map?scene=';
for(const [width,height] of [[1280,720],[1024,768],[390,844]])for(const theme of ['light','dark'])test(`${width}x${height} ${theme}: teaching visuals and controls remain usable`,async({page})=>{
 await page.setViewportSize({width,height});await page.emulateMedia({reducedMotion:'reduce'});
 await page.addInitScript(t=>localStorage.setItem('codyssey-presentation-theme',t),theme);
 for(const [id,visual] of [['slide-network','V1'],['slide-packet','V2']]){
  await page.goto(story+id);await expect(page.locator(`[data-foundation-visual=${visual}]`)).toBeVisible();await expect(page.locator('[data-foundation-card]')).not.toHaveAttribute('open');
  expect(await page.locator(`[data-foundation-visual=${visual}]`).evaluate(el=>el.closest('details'))).toBeNull();
  await page.locator('[data-foundation-card]>summary').focus();await page.keyboard.press('Enter');await expect(page.locator('.b31f-checks')).toBeVisible();await expect(page.locator('.b31f-links a').first()).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
 }
 await page.goto(story+'scene-02');const root=page.locator('.packet-journey');await root.getByLabel('패킷 체험 테마').selectOption(theme);
 for(let i=0;i<26;i++){
  await expect(root).toHaveAttribute('data-step',String(i));
  if([1,2,16,19,21,24].includes(i)){
   await root.locator('.pj-player-bar').evaluate(el=>el.scrollIntoView({block:'start'}));
   if(width>700){
    // Entire diagram and all live panels must share the actual teaching viewport.
    for(const selector of ['.pj-map-scroll','.pj-information']){const r=await root.locator(selector).boundingBox();expect(r!.y).toBeGreaterThanOrEqual(0);expect(r!.y+r!.height).toBeLessThanOrEqual(height);}
   }else{
    await root.locator('.pj-decision').evaluate(el=>el.scrollIntoView({block:'start'}));
    const bar=await root.locator('.pj-player-bar').boundingBox(),decision=await root.locator('.pj-decision').boundingBox();expect(bar!.y).toBeGreaterThanOrEqual(-1);expect(decision!.y).toBeGreaterThanOrEqual(bar!.y+bar!.height-1);
   }
   const button=root.getByRole('button',{name:'한 단계 진행',exact:true});await button.focus();await expect(button).toBeFocused();const box=await button.boundingBox();expect(box!.height).toBeGreaterThanOrEqual(44);expect(box!.y+box!.height).toBeLessThanOrEqual(height);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  }
  if(i<25)await root.getByRole('button',{name:'한 단계 진행',exact:true}).click();
 }
 await expect(root.getByRole('button',{name:'한 단계 진행',exact:true})).toBeDisabled();
 for(const id of ['slide-intro','slide-network','slide-packet','scene-01','scene-02','scene-03a','scene-03b','scene-04']){
  await page.goto(story+id);await expect(page.locator('.b31-current-scene')).toHaveAttribute('data-scene',id);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  for(const control of await page.locator('.b31-scene-traversal :is(a,button)').all())expect((await control.boundingBox())!.height).toBeGreaterThanOrEqual(44);
 }

});
