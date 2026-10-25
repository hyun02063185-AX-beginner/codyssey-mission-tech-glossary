import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,'reports/b21-c1');await mkdir(output,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'drafts/b2-1-story-map/scene-08/candidate-map.json'),'utf8'));
const origin='http://127.0.0.1:4179/',base=origin+'?view=concept-explorer#',map='/concept-explorer',story='/missions/main-M03/story';
let ownServer;
try{if(!(await fetch(origin)).ok)throw Error('Unavailable');}
catch{ownServer=spawn(process.execPath,[resolve(root,'scripts/b21_preview.mjs')],{cwd:root,stdio:'ignore'});let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Preview unavailable');}
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
const page=await context.newPage(),errors=[],passed=[],widths=[];let checks=0,status='RUNNING';
page.on('pageerror',e=>errors.push(e.stack));
page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
const check=(value,label)=>{if(!value)throw Error(label);checks++;};
const detail=()=>page.getByRole('complementary',{name:'개념 상세 패널'});
const select=async id=>{await page.getByLabel('모든 개념 찾기',{exact:true}).selectOption(id);await expect(detail().locator('h2')).toHaveText(data.nodes.find(n=>n.id===id).label);checks++;};
const fit=async()=>{check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');};
const capture=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:resolve(output,name),fullPage:true});};
try{
  await page.goto(origin);await page.getByRole('button',{name:'전체 개념지도',exact:true}).click();
  await expect(page.frameLocator('iframe').getByRole('heading',{name:'B2-1 전체 개념지도',exact:true})).toBeVisible();checks++;
  passed.push('Owner selector exposes new private mode; original modes retained');
  for(const width of [1280,390,360]){
    await page.setViewportSize({width,height:width===1280?900:800});await page.goto(base+map);
    await expect(page.locator('[data-area]')).toHaveCount(7);await expect(page.locator('.b21ce-svg')).toHaveCount(0);
    check(await page.getByLabel('모든 개념 찾기',{exact:true}).locator('option').count()===46,'45 selectable concepts');await fit();
    await capture(`overview-${width}.png`);
    for(const area of data.areas){await page.locator(`[data-area="${area.id}"]`).click();await expect(page.locator('[data-node-choice]')).toHaveCount(data.nodes.filter(n=>n.area===area.id).length);checks++;await page.locator(`[data-area="${area.id}"]`).click();await expect(page.locator('.b21ce-svg')).toHaveCount(0);checks++;}
    await page.locator('[data-area="area-iteration"]').click();await page.locator('[data-node-choice="generator"]').click();
    await expect(detail().locator('h2')).toHaveText('Generator');await expect(page.locator('[data-explorer-node]')).toHaveCount(45);
    check(JSON.stringify(await page.locator('[data-relation-choice]').evaluateAll(es=>es.map(e=>e.dataset.relationChoice)))===JSON.stringify(['R23','R24']),'Generator exact two incident relations');
    const positions=await page.locator('[data-explorer-node]').evaluateAll(es=>es.map(e=>e.getAttribute('transform')));
    await page.getByLabel('관계 유형',{exact:true}).selectOption('종류');await expect(page.locator('[data-relation-choice]')).toHaveCount(1);
    await page.locator('[data-relation-choice="R23"]').click();await expect(detail()).toContainText('Iterator의 한 종류');await expect(detail()).toContainText('강의 연결 보류');
    check(JSON.stringify(positions)===JSON.stringify(await page.locator('[data-explorer-node]').evaluateAll(es=>es.map(e=>e.getAttribute('transform')))),'node coordinates stable across filters and relations');
    const relationURL=page.url();await detail().getByRole('button',{name:'Iterator →',exact:true}).click();await page.goBack();await expect(page).toHaveURL(relationURL);checks++;
    await select('generator');await capture(`exploration-${width}.png`);
    await detail().screenshot({path:resolve(output,`detail-${width}.png`)});
    if(width<700){await page.getByRole('navigation',{name:'모바일 탐색 바로가기'}).getByRole('button',{name:'관계',exact:true}).click();await expect(page.getByRole('region',{name:'연결 관계 목록'})).toBeInViewport();checks++;}
    const svg=page.locator('.b21ce-svg');const beforeZoom=await svg.getAttribute('viewBox');await page.getByRole('button',{name:'지도 확대',exact:true}).click();check(await svg.getAttribute('viewBox')!==beforeZoom,'zoom changes camera');
    await page.getByRole('button',{name:'전체 맞춤',exact:true}).click();await page.getByRole('button',{name:'선택 영역 읽기',exact:true}).click();
    await svg.evaluate(el=>el.scrollIntoView({block:'center'}));
    const beforeDrag=await svg.getAttribute('viewBox'),point=await svg.evaluate(el=>{const b=el.getBoundingClientRect();for(let y=b.top+20;y<b.bottom-20;y+=20)for(let x=b.left+20;x<b.right-70;x+=20){const hit=document.elementFromPoint(x,y);if(hit&&el.contains(hit)&&!hit.closest('[data-explorer-node],[data-explorer-edge]'))return {x,y};}throw Error('No visible canvas background');});
    await page.mouse.move(point.x,point.y);await page.mouse.down();await page.mouse.move(point.x+40,point.y+25,{steps:5});await page.mouse.up();check(await svg.getAttribute('viewBox')!==beforeDrag,'pointer pan works');
    // SVG keyboard path, in addition to HTML list controls.
    await page.locator('[data-explorer-node="iterator"]').focus();await page.keyboard.press('Enter');await expect(detail().locator('h2')).toHaveText('Iterator');checks++;
    await select('cli');await expect(page.locator('.b21ce-empty')).toContainText('원본 관계가 없습니다');
    await select('index');await expect(detail()).toContainText('강의 연결 보류');await expect(detail()).toContainText('용어사전 연결 보류');await expect(detail().locator('a[href*="/terms/"]')).toHaveCount(0);
    for(const c of data.comparisons){await page.getByLabel('비교할 짝',{exact:true}).selectOption(c.id);await expect(detail()).toContainText(c.leftText);await expect(detail()).toContainText(c.rightText);checks+=2;}
    await page.getByLabel('비교할 짝',{exact:true}).selectOption('C30');await capture(`comparison-${width}.png`);await fit();
    await select('module');const freeURL=page.url();
    await page.getByRole('button',{name:'강사 안내',exact:true}).click();
    for(const path of data.teacherPaths){
      await page.getByLabel('복습 경로',{exact:true}).selectOption(path.id);
      await expect(page.getByRole('button',{name:'안내 이전',exact:true})).toBeDisabled();
      for(const [at,step] of path.steps.entries()){
        await expect(detail().locator('h2')).toHaveText(data.nodes.find(n=>n.id===step.nodeId).label);
        await expect(page.getByTestId('guide-prompt')).toHaveText(step.prompt);checks+=2;
        if(at<path.steps.length-1)await page.getByRole('button',{name:'안내 다음',exact:true}).click();
      }
      await expect(page.getByRole('button',{name:'안내 다음',exact:true})).toBeDisabled();
      await page.getByRole('button',{name:'안내 이전',exact:true}).click();await page.getByRole('button',{name:'안내 다음',exact:true}).click();checks++;
    }
    await capture(`guided-${width}.png`);await page.getByRole('button',{name:'자유 탐색',exact:true}).click();await expect(page).toHaveURL(freeURL);checks++;
    // Real glossary destination + refresh + exact selected map restore, including qualifications and CSS.
    await expect(detail()).toContainText('JavaScript 중심');const termMapURL=page.url();
    const snapshot=()=>page.locator('.b21ce').evaluate(el=>{
      const origin=el.getBoundingClientRect(),round=n=>Math.round(n*64)/64;
      return ['.b21ce-header','.b21ce-overview','.b21ce-areas','.b21ce-workspace','.b21ce-maincol','.b21ce-detail','.b21ce-comparisons','h1','.b21ce-detail h2','button'].map(selector=>{
        const node=el.querySelector(selector),b=node.getBoundingClientRect(),s=getComputedStyle(node);
        return {selector,rect:[b.x-origin.x,b.y-origin.y,b.width,b.height].map(round),font:s.font,color:s.color,display:s.display,padding:s.padding,margin:s.margin,tracking:s.letterSpacing};
      });
    });
    await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo(0,0));
    const styleBefore=await snapshot();await detail().locator('[data-term-id="module"] a').click();await expect(page.locator('main article h1')).toHaveText('module');
    await page.reload();await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await expect(page).toHaveURL(termMapURL);await expect(detail().locator('h2')).toHaveText('모듈');
    await page.evaluate(()=>document.fonts.ready);await page.evaluate(()=>window.scrollTo(0,0));
    const styleAfter=await snapshot();await writeFile(resolve(output,`app-css-isolation-${width}.json`),JSON.stringify({before:styleBefore,after:styleAfter},null,2));
    check(JSON.stringify(styleAfter)===JSON.stringify(styleBefore),'real app CSS does not alter explorer structure or typography');await fit();
    await page.goto(base+story+'?scene=08&step=6');await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');
    await page.getByRole('link',{name:'전체 개념지도에서 관계 탐색 →',exact:true}).click();await select('iterator');const reviewMapURL=page.url();
    await detail().getByRole('link',{name:/Scene 05 · Iterator 복습/}).click();await expect(page.locator('#pos')).toContainText('Scene 05 · 3 /');await page.reload();
    await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await expect(page).toHaveURL(reviewMapURL);await expect(detail().locator('h2')).toHaveText('Iterator');
    await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');checks+=3;
    await page.goto(base+map+'?node=generator&origin='+encodeURIComponent('scene=05&step=gen&back=6'));await detail().locator('[data-term-id="generator"] a').click();
    await page.reload();await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page).toHaveURL(/scene=05&step=gen&back=6$/);checks++;
    await page.goto(base+map+'?node=object-init');await expect(detail()).toContainText('강의 연결 보류');
    check(await page.locator('.b21ce button,.b21ce select,.b21ce a').evaluateAll(es=>es.filter(el=>el.getClientRects().length>0).every(el=>el.getBoundingClientRect().height>=44)),'44px visible HTML controls');
    await page.getByRole('button',{name:'선택 해제 · 전체 영역',exact:true}).click();await expect(page.locator('.b21ce-svg')).toHaveCount(0);
    await page.goto(base+map+'?node=unknown');await expect(page.getByRole('alert')).toContainText('유효하지 않은');
    await fit();widths.push({width,paths:3,guideStops:17,comparisons:10,realTermReturn:true,storyReturn:true,overflow:false});
  }
  // U4 entry is a real private link; the original teaching surface remains in place.
  await page.goto(origin+'?view=v3-links#'+story+'?scene=08&step=6');await page.getByRole('link',{name:'전체 개념지도에서 관계 탐색 →',exact:true}).click();await expect(page.locator('.b21ce')).toBeVisible();
  await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');checks++;
  passed.push('7 areas and 45 node choices; stable SVG geometry; type filters, selection, clear, browser back, zoom/pan and keyboard',
    'all 10 exact comparison cards and all 17 stops of P1/P2/P3 at all three widths',
    'real glossary refresh-return, qualifications/CSS isolation, verified Story review and original scene/step/back return',
    'held nodes/relations have no guessed links; invalid address recovery; U4 Scene 08 private entry');
  check(errors.length===0,'no browser errors: '+errors.join(';'));status='PASS';
}catch(error){status='FAIL';errors.push(error.stack);process.exitCode=1;await capture('failure.png').catch(()=>{});}
finally{
  const result={status,browser:browser.version(),checks,passed,widths,errors};await writeFile(resolve(output,'browser-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
  await context.close();await browser.close();if(ownServer)ownServer.kill('SIGTERM');
}
