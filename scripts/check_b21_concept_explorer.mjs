import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {explorerMenu,explorerPanel,explorerSelect} from './b21_explorer_controls.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=resolve(root,process.env.B21_CONCEPT_REPORT_DIR||'reports/b21-area-focus/concept-preview');await mkdir(output,{recursive:true});
const data=JSON.parse(await readFile(resolve(root,'drafts/b2-1-story-map/scene-08/candidate-map.json'),'utf8'));
const origin='http://127.0.0.1:4179/',base=origin+'?view=concept-explorer#',map='/concept-explorer',story='/missions/main-M03/story';
let ownServer;
try{if(!(await fetch(origin)).ok)throw Error('Unavailable');}
catch{ownServer=spawn(process.execPath,[resolve(root,'scripts/b21_preview.mjs')],{cwd:root,stdio:'ignore'});let ready=false;for(let i=0;i<100;i++){try{if((await fetch(origin)).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,100));}if(!ready)throw Error('Preview unavailable');}
const browser=await chromium.launch({channel:process.env.B21_BROWSER_CHANNEL||'chrome',headless:true});
const errors=[],passed=[],widths=[];let checks=0,status='RUNNING';
const check=(ok,label)=>{if(!ok)throw Error(label);checks++;};
try{
 for(const [width,height] of [[1280,900],[390,844],[360,800]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}),page=await context.newPage();context.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));
  const detail=()=>page.locator('.b21ce-detail');
  const open=async query=>{await page.goto(base+map+(query?'?'+query:''));await page.locator('.b21ce-svg').waitFor();};
  const select=async id=>{await explorerSelect(page,id);await expect(detail().locator('h2')).toHaveText(data.nodes.find(n=>n.id===id).label);checks++;};
  const capture=async name=>{await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:resolve(output,`${name}-${width}.png`)});};
  await open();await expect(page.locator('.b21ce-areas-panel')).toBeHidden();await expect(page.locator('.b21ce-panel')).toBeHidden();
  await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);check(await page.getByLabel('모든 개념 찾기',{exact:true}).locator('option').count()===46,'all 45 choices');
  for(const area of data.areas){
   await page.getByLabel('지도 표시 범위',{exact:true}).selectOption(area.id);
   const ids=new Set(data.nodes.filter(n=>n.area===area.id).map(n=>n.id));
   await expect(page.locator('[data-explorer-node]')).toHaveCount(ids.size);await expect(page.locator('[data-explorer-relation]')).toHaveCount(data.relations.filter(r=>ids.has(r.from)&&ids.has(r.to)).length);checks+=2;
   await page.getByRole('button',{name:'전체 지도',exact:true}).click();await expect(page.locator('[data-explorer-node]')).toHaveCount(45);
  }
  for(const node of data.nodes){await select(node.id);await expect(detail()).toContainText(node.easy);await expect(detail()).toContainText(node.missionReason);await expect(detail()).toContainText(node.codeClue);checks+=3;}
  for(const relation of data.relations){await open('relation='+relation.id);await expect(detail().locator('h2')).toContainText(relation.id);await expect(detail()).toContainText(relation.label);await expect(detail()).toContainText(relation.scope);await expect(page.locator('[data-explorer-relation]')).toHaveCount(1);checks+=4;}
  await select('generator');await explorerPanel(page,'관계');await expect(page.locator('[data-relation-choice]')).toHaveCount(2);
  await page.getByLabel('관계 유형',{exact:true}).selectOption('종류');await expect(page.locator('[data-relation-choice]')).toHaveCount(1);checks+=2;
  await select('cli');await explorerPanel(page,'관계');await expect(page.locator('.b21ce-empty')).toContainText('원본 관계가 없습니다');
  for(const comparison of data.comparisons){await explorerPanel(page,'비교');await page.getByLabel('비교할 짝',{exact:true}).selectOption(comparison.id);await expect(detail()).toContainText(comparison.leftText);await expect(detail()).toContainText(comparison.rightText);checks+=2;}
  await capture('comparison');
  await select('module');const freeURL=page.url();await explorerMenu(page);await page.getByRole('button',{name:'강사 안내',exact:true}).click();
  for(const path of data.teacherPaths){
   await page.getByLabel('복습 경로',{exact:true}).selectOption(path.id);await expect(page.getByRole('button',{name:'안내 이전',exact:true})).toBeDisabled();
   for(const [at,step] of path.steps.entries()){
    await expect(page.getByTestId('guide-prompt')).toHaveText(step.prompt);await expect(page.locator(`[data-explorer-node="${step.nodeId}"]`)).toHaveAttribute('aria-pressed','true');checks+=2;
    if(at<path.steps.length-1)await page.getByRole('button',{name:'안내 다음',exact:true}).click();
   }
   await expect(page.getByRole('button',{name:'안내 다음',exact:true})).toBeDisabled();
   await page.getByRole('button',{name:'현재 개념 지도 보기',exact:true}).click();await expect(page.locator('.b21ce-selection-heading')).toBeFocused();await page.getByRole('button',{name:'강사 안내로 돌아가기',exact:true}).click();await expect(page.locator('.b21ce-guided')).toBeFocused();checks+=2;
  }
  await capture('guided');await explorerMenu(page);await page.getByRole('button',{name:'자유 탐색',exact:true}).click();await expect(page).toHaveURL(freeURL);await explorerPanel(page);
  await expect(detail()).toContainText('JavaScript 중심');
  const snapshot=()=>page.locator('.b21ce').evaluate(el=>['.b21ce-header','.b21ce-maincol','.b21ce-panel','.b21ce-svg','h1','.b21ce-detail h2'].map(selector=>{const e=el.querySelector(selector),r=e.getBoundingClientRect(),style=getComputedStyle(e);return {selector,width:r.width,height:r.height,font:style.font,color:style.color};}));
  await page.evaluate(()=>document.fonts.ready);const before=await snapshot(),termURL=page.url();await detail().locator('[data-term-id="module"] a').click();await expect(page.locator('main article h1')).toHaveText('module');await page.reload();await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await expect(page).toHaveURL(termURL);await explorerPanel(page);await page.evaluate(()=>document.fonts.ready);
  const after=await snapshot();await writeFile(resolve(output,`css-isolation-${width}.json`),JSON.stringify({before,after},null,2));check(JSON.stringify(before)===JSON.stringify(after),'actual App CSS isolation');
  for(const id of ['index','object-init']){await select(id);await expect(detail()).toContainText('강의 연결 보류');await expect(detail().locator('a[href*="/terms/"]')).toHaveCount(0);checks+=2;}
  await open('relation=R17');await expect(detail()).toContainText('모든 설계의 강제 경로 아님');await expect(detail()).toContainText('강의 연결 보류');checks+=2;
  await page.goto(base+story+'?scene=08&step=6');await page.getByRole('link',{name:'전체 개념지도에서 관계 탐색 →',exact:true}).click();await select('iterator');const reviewURL=page.url();await detail().getByRole('link',{name:/Scene 05 · Iterator 복습/}).click();await expect(page.locator('#pos')).toContainText('Scene 05 · 3 /');await page.reload();await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await expect(page).toHaveURL(reviewURL);await explorerMenu(page);await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page.locator('#pos')).toContainText('Scene 08 · 6 /');checks+=3;
  await open('node=generator&origin='+encodeURIComponent('scene=05&step=gen&back=6'));await explorerPanel(page);await detail().locator('[data-term-id="generator"] a').click();await page.reload();await page.getByRole('link',{name:/전체 개념지도로 돌아가기/}).click();await explorerMenu(page);await page.getByRole('link',{name:'← 원래 강의 위치로 돌아가기',exact:true}).click();await expect(page).toHaveURL(/scene=05&step=gen&back=6$/);checks++;
  await open('node=unknown');await expect(page.getByRole('alert')).toContainText('유효하지 않은');
  await explorerMenu(page);await page.getByRole('button',{name:'선택 해제 · 전체 영역',exact:true}).click();await expect(page.locator('[data-explorer-node]')).toHaveCount(45);await expect(page.locator('[data-explorer-relation]')).toHaveCount(24);
  check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal overflow');await capture('overview');widths.push({width,height,nodes:45,relations:24,comparisons:10,guideStops:17});await context.close();
 }
 check(errors.length===0,'no page errors');status='PASS';passed.push('all 45 original node descriptions, 24 exact relation scopes, 10 original comparisons at all three widths','all P1/P2/P3 prompts, stops, bounds and free-state restore','7 areas, filters, held links, glossary/review/origin-back returns, hostile address recovery','App destination CSS isolation, Map-first collapsed panels and immediate complete Canvas');
}catch(error){errors.push(error.stack);status='FAIL';process.exitCode=1;}
finally{const result={status,browser:browser.version(),checks,passed,widths,errors};await writeFile(resolve(output,'browser-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();if(ownServer)ownServer.kill('SIGTERM');}
