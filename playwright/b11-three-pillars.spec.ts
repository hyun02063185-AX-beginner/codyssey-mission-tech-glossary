import {test,expect,type Page} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
const source=JSON.parse(readFileSync('content/mission-stories/main-m01/_tools/screens.json','utf8')) as {screens:Array<{id:string;scene:string;message:string;caption:string;desktop?:string[];mobile?:string[]}>};
const out='reports/b11-web';mkdirSync(out,{recursive:true});
const base='/missions/main-M01/story';
const openMenu=async(page:Page)=>{if(!await page.locator('.learning-focus-menu').evaluate(el=>(el as HTMLDetailsElement).open))await page.locator('.learning-focus-menu summary').click();};
const noOverflow=async(page:Page)=>expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
test.describe.configure({mode:'parallel'});
for(const [width,height]of [[1280,720],[1000,720],[390,844],[360,800]])for(const site of ['forest','indigo','paper','signal'])for(const os of ['light','dark'] as const){
  test(`${width} ${site} OS-${os}: 12 slides, both lecture themes and map workspace`,async({page})=>{
    test.setTimeout(120000);await page.setViewportSize({width,height});await page.emulateMedia({colorScheme:os,reducedMotion:'reduce'});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/#/missions/main-M01');
    await expect(page.locator('[data-material="story"] a')).toHaveAttribute('href','#'+base);
    await expect(page.locator('[data-material="concepts"] a')).toHaveAttribute('href','#'+base+'/concepts');
    await expect(page.locator('main')).toContainText('내가 만든 웹사이트는 어떤 구조로, 어떻게 동작할까?');
    await page.locator('[data-material="story"] a').click();await expect(page.locator('.mission-story-scenes li')).toHaveCount(4);
    await openMenu(page);await page.getByLabel('화면 테마',{exact:true}).selectOption(site);await page.keyboard.press('Escape');
    await page.getByRole('link',{name:'강의 시작하기 →',exact:true}).click();
    await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme','dark');
    const measurements=[];
    for(const theme of ['dark','light']){
      await openMenu(page);await page.getByLabel('강의 화면 테마',{exact:true}).selectOption(theme);await page.keyboard.press('Escape');
      for(const [index,screen]of source.screens.entries()){
        await page.goto('/#'+base+`?scene=${screen.scene}&screen=${screen.id.split('-')[1]}`);
        await expect(page.locator('#b11-message')).toHaveText(screen.message);await expect(page.locator('.b11-caption')).toHaveText(screen.caption);await expect(page.locator('.mission-story-overview')).toHaveCount(0);
        await expect(page.locator('.mission-presentation')).toHaveAttribute('data-presentation-theme',theme);
        await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.b11-stage').first()).toBeVisible();await noOverflow(page);
        await expect.poll(()=>page.locator('.b11-shot img').evaluateAll(imgs=>imgs.every(img=>(img as HTMLImageElement).complete&&(img as HTMLImageElement).naturalWidth>0))).toBe(true);
        if(screen.desktop)await expect(page.locator('.b11-figure').first().locator('svg')).toHaveAttribute('data-state',(width<900?screen.mobile!:screen.desktop)[1]);
        if(width>=900){const bounds=(await page.locator('.b11-controls').boundingBox())!;expect(bounds.y+bounds.height).toBeLessThanOrEqual(height+1);}
        if(index===9){
          if(os==='light')await page.screenshot({path:`${out}/${width}-${site}-${theme}-story.png`,fullPage:width<900});
          await page.getByRole('button',{name:'그림 집중 보기',exact:true}).click();await expect(page.getByRole('dialog')).toBeVisible();
          const size=await page.locator('.b11-focus svg').evaluate(svg=>{const root=svg as SVGSVGElement,k=root.getBoundingClientRect().width/root.viewBox.baseVal.width;return Math.min(...[...svg.querySelectorAll('text')].filter(n=>n.getBoundingClientRect().width>0).map(n=>Number(n.getAttribute('font-size'))*k));});
          expect(size).toBeGreaterThanOrEqual(14);measurements.push({theme,screen:screen.id,focusMinText:size});await page.keyboard.press('Escape');
        }
      }
    }
    await page.goto('/#'+base+'/concepts');await expect(page.locator('[data-map-node]')).toHaveCount(14);await expect(page.locator('.mission-detail-panel')).toHaveCount(0);
    await page.getByRole('button',{name:'탐색 도구 펼치기',exact:true}).click();await page.getByRole('searchbox').fill('HTML');await page.locator('.cm-search-results button').filter({hasText:/^HTML/}).click();
    await expect(page.locator('#cm-detail-title')).toHaveText('HTML');await expect(page.locator('[data-map-node="N02"]')).toHaveAttribute('aria-pressed','true');
    const panel=(await page.locator('.mission-detail-panel').boundingBox())!,canvas=(await page.locator('.map-canvas-shell').boundingBox())!;
    if(width>700)expect(canvas.x+canvas.width).toBeLessThanOrEqual(panel.x+1);else expect(canvas.y+canvas.height).toBeLessThanOrEqual(panel.y+1);
    await page.getByRole('button',{name:'상세 패널 닫기'}).click();await page.getByRole('button',{name:'설명 다시 열기 · HTML',exact:true}).click();await expect(page.locator('#cm-detail-title')).toBeFocused();
    await noOverflow(page);if(os==='light')await page.screenshot({path:`${out}/${width}-${site}-map-selected.png`});
    await page.getByRole('button',{name:'상세 패널 닫기'}).click();await page.getByRole('button',{name:'지도 확대',exact:true}).click();await page.getByRole('button',{name:'전체 보기',exact:true}).click();
    await page.getByRole('button',{name:'지도 크게 보기',exact:true}).click();await expect(page.locator('.mission-concept-map')).toHaveClass(/is-focused/);await page.keyboard.press('Escape');await expect(page.locator('.mission-concept-map')).not.toHaveClass(/is-focused/);
    expect(errors).toEqual([]);writeFileSync(`${out}/${width}-${site}-${os}-metrics.json`,JSON.stringify(measurements,null,2));
  });
}
test('history, precise map/term returns, cards, extensions, safe recovery and guide chapters',async({page})=>{
  await page.goto('/#'+base+'?scene=3&screen=3');await page.getByRole('button',{name:'이전',exact:true}).click();await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S3-2');await page.goBack();await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S3-3');
  await page.locator('.b11-review details').last().locator('summary').click();await page.getByRole('link',{name:'DOM',exact:true}).click();await expect(page.locator('#cm-detail-title')).toHaveText('DOM');
  const map=page.url();await page.locator('.cm-term-links a').filter({hasText:'상세 사전'}).first().click();await page.reload();await page.getByRole('link',{name:'← B1-1 개념지도로 돌아가기',exact:true}).click();await expect(page).toHaveURL(map);await expect(page.locator('#cm-detail-title')).toHaveText('DOM');
  await page.locator('.cm-scenes a').filter({hasText:'S3-3'}).click();await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S3-3');
  for(const [id,owner]of [['C01','N16'],['C02','N03'],['C03','N04'],['C04','N15'],['E01','N03'],['E02','N04'],['E03','N07'],['E04','N05'],['E05','N10']]){
    await page.goto('/#'+base+`/concepts?${id==='C04'?'more=1&':''}node=${owner}&detail=${id}`);await expect(page.locator(`[data-${id[0]==='C'?'contrast':'extension'}="${id}"]`)).toHaveAttribute('open','');await page.reload();await expect(page.locator('#cm-detail-title')).toBeVisible();
  }
  await page.goto('/#'+base+'?scene=2&screen=2');await openMenu(page);await page.getByRole('link',{name:'학습가이드',exact:true}).click();await expect(page.getByRole('link',{name:'← B1-1 스토리의 이전 화면으로 돌아가기'})).toBeVisible();
  await page.locator('nav[aria-label="학습 단원"] a').first().click();await expect(page.getByRole('link',{name:'← B1-1 스토리의 이전 화면으로 돌아가기'})).toBeVisible();await page.getByRole('link',{name:'← B1-1 스토리의 이전 화면으로 돌아가기'}).click();await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S2-2');
  await page.goto('/#'+base+'?scene=bad&screen=999&return=https://example.com');await expect(page.locator('[role="status"]')).toContainText('복구');await expect(page).toHaveURL(new RegExp('scene=1&screen=1$'));
  await page.goto('/#'+base+'/concepts?node=missing&return=https://example.com');await expect(page.locator('.cm-notice')).toBeVisible();await expect(page).not.toHaveURL(/example/);
  await page.goto('/#/terms/html?b11-map=https%3A%2F%2Fexample.com');await expect(page.locator('[aria-label="B1-1 학습으로 복귀"]')).toHaveCount(0);
  await page.goto('/#'+base+'/concepts?node=N01');await page.locator('.cm-scenes a').filter({hasText:'강의 소개'}).click();await expect(page.locator('.mission-story-overview')).toBeVisible();
  await page.goto('/#'+base+'/concepts?node=N13');await page.locator('.cm-scenes a').filter({hasText:'S4-2'}).click();await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S4-2');
});
test('original samples: HTML links, inactive CSS-only menu, JS click/keyboard, responsive width',async({page})=>{
  await page.goto('/#'+base+'?scene=3&screen=2');await page.getByText('강사 스크립트 · 실제 시연',{exact:true}).click();await page.getByRole('button',{name:'세 상태 실제 시연'}).click();
  const frame=page.frameLocator('iframe[title="김코디 자기소개 시연"]');
  await expect(frame.locator('h1')).toContainText('김코디');await frame.getByRole('link',{name:'프로젝트',exact:true}).click();
  await page.getByLabel('시연 상태').selectOption('1');await frame.locator('button').click();await expect(frame.locator('button')).toHaveAttribute('aria-expanded','false');
  await page.getByLabel('시연 상태').selectOption('2');await frame.locator('button').click();await expect(frame.locator('button')).toHaveAttribute('aria-expanded','true');await frame.locator('button').press('Enter');await expect(frame.locator('button')).toHaveAttribute('aria-expanded','false');
  await page.getByLabel('시연 화면 폭').selectOption('960');await expect(frame.locator('button')).toBeHidden();await expect(frame.locator('nav')).toBeVisible();await page.getByRole('button',{name:'시연 닫기'}).focus();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('touch pan and keyboard selection keep the map and Story usable',async({browser})=>{
  const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  const page=await context.newPage();await page.goto('/#'+base+'/concepts');
  const svg=page.locator('.map-canvas');await expect(page.locator('[data-map-node]')).toHaveCount(14);const before=await svg.getAttribute('viewBox'),rect=(await svg.boundingBox())!;
  const cdp=await context.newCDPSession(page),point={x:rect.x+30,y:rect.y+35,id:1};
  await cdp.send('Emulation.setTouchEmulationEnabled',{enabled:true});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:point.x+60,y:point.y+50,id:1}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(svg).not.toHaveAttribute('viewBox',before!);
  await page.locator('[data-map-node="N02"]').focus();await page.keyboard.press('Enter');await expect(page.locator('#cm-detail-title')).toHaveText('HTML');await page.keyboard.press('Escape');await expect(page.locator('.mission-detail-panel')).toHaveCount(0);
  await page.goto('/#'+base+'?scene=1&screen=1');await page.locator('#b11-message').focus();await page.keyboard.press('ArrowRight');await expect(page.locator('.b11-lesson')).toHaveAttribute('data-screen','S1-2');
  await context.close();
});
