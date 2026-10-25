"""Build a local design model, never operational map data or public routes."""
import json
from pathlib import Path

DIR = Path(__file__).resolve().parents[1]
DATA = json.loads((DIR / 'candidate-map.json').read_text())
TEMPLATE = r'''<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>B2-1 · Scene 08 개념지도 설계 시안</title>
<style>
body{word-break:keep-all;overflow-wrap:anywhere}
@font-face{font-family:Story;src:url('../../../src/assets/fonts/PretendardVariable.woff2') format('woff2');font-weight:100 900;font-display:swap}
:root{color-scheme:light;--ink:#21313d;--muted:#536776;--line:#cbd6db;--paper:#fff;--bg:#f3f5f3;--teal:#125c55;--soft:#e8f2ed;--amber:#83501d}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 Story,'Apple SD Gothic Neo','Malgun Gothic',sans-serif}button,select{font:inherit;color:inherit}button,select{min-height:44px}button{cursor:pointer;border:1px solid var(--line);background:white;border-radius:9px;padding:9px 13px;text-align:left;overflow-wrap:anywhere}button:hover{background:#f0f5f2}button:focus-visible,select:focus-visible,[tabindex="-1"]:focus-visible{outline:3px solid #206aa5;outline-offset:3px}button:disabled{cursor:default;color:#53616a;background:#eef1f2}button.active,[aria-pressed=true]{border:2px solid var(--teal);background:var(--soft);color:#124a44}select{max-width:100%;border:1px solid var(--line);border-radius:8px;padding:8px;background:white}h1,h2,h3,p{margin:0}h1{font-size:32px;line-height:1.3;letter-spacing:-.04em}h2{font-size:21px;line-height:1.4}h3{font-size:17px;line-height:1.5}small,.small{font-size:14px;line-height:1.5}.muted{color:var(--muted)}.eyebrow{font-size:13px;font-weight:750;letter-spacing:.08em;color:var(--teal)}.shell{max-width:1440px;margin:auto;padding:26px 32px 48px}.banner{border-left:3px solid var(--amber);padding:9px 14px;background:#fff4df;color:#6b4319;margin-bottom:24px;font-size:14px}.intro{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.intro p{margin-top:10px}.tag{display:inline-block;font-size:13px;border:1px solid var(--line);border-radius:5px;padding:2px 7px;background:#fff;white-space:normal}.tag.strong{background:var(--teal);color:#fff;border-color:var(--teal)}.toolbar{margin-top:24px;border-block:1px solid var(--line);padding:15px 0;display:flex;align-items:center;gap:10px;flex-wrap:wrap}.mode{display:flex;gap:6px}.lesson{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.lesson button{padding-inline:11px}.prompt{margin-top:12px;background:#e8eef5;border-radius:8px;padding:10px 14px}.tabs{display:none}.layout{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(300px,1fr);gap:22px;margin-top:22px;align-items:start}.card{border:1px solid var(--line);border-radius:14px;background:var(--paper);padding:22px}.sectionhead{display:flex;justify-content:space-between;gap:12px;align-items:start;margin-bottom:16px}.sectionhead p{margin-top:4px}.areas{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.area{min-height:98px;padding:13px 16px;display:flex;flex-direction:column;justify-content:center;position:relative}.area small{color:var(--muted)}.area b{font-size:19px}.selected-label{font-size:12px;font-weight:700;color:var(--teal);position:absolute;right:12px;top:7px}.section{margin-top:18px}.row{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.relation{display:grid;grid-template-columns:minmax(0,1fr) 106px minmax(0,1fr);gap:8px;align-items:center;padding:13px 0;border-bottom:1px solid #dfe5e7}.relation button{width:100%;min-height:62px;font-weight:650}.relation .edge{text-align:center;font-size:14px;font-weight:700;color:#35546b}.edge .arrow{display:block;font-size:24px;line-height:1;border-top:1px solid #768c9a;padding-top:1px;margin-top:4px}.relation.import .edge .arrow{border-top-style:dashed}.relation .scope{grid-column:1/-1;font-size:13px;color:var(--muted);margin-top:2px}.empty{padding:20px;background:#f4f6f7;border-radius:8px;color:var(--muted)}.filter{margin-bottom:6px}.detail{position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto}.detail h2{font-size:28px;margin-top:8px;overflow-wrap:anywhere}.detail .lead{margin-top:12px;font-size:18px;font-weight:550}.detail section{margin-top:20px;padding-top:16px;border-top:1px solid #e0e6e7}.detail section p{margin-top:5px}.notice{background:#fff4df;color:#6b4319;border-radius:7px;padding:10px 12px;margin-top:10px;font-size:14px}.detail .links{display:grid;gap:8px;margin-top:10px}.detail .links button{width:100%}.compare-wrap{margin-top:22px}.comparison{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}.comparison section{padding:18px;background:#f2f5f7;border:1px solid var(--line);border-radius:9px}.comparison p{margin-top:8px}.foot{margin-top:22px;border-top:1px solid var(--line);padding-top:18px}.foot h3{margin-bottom:6px}.mock{margin-top:22px;max-width:820px}.mock>*+*{margin-top:18px}.sample-text{line-height:1.9}.sample-content{height:300px;overflow:auto;border:1px solid var(--line);padding:18px;border-radius:8px}.sample-content>*+*{margin-top:18px}.sr{position:absolute;clip-path:inset(50%);width:1px;height:1px;overflow:hidden}.find{margin-top:14px;width:100%}#historyInfo{padding:8px 0}.backrow{margin-top:14px}.desktop-only{display:block}[hidden]{display:none!important}code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;overflow-wrap:anywhere;background:#edf0f3;border-radius:4px;padding:1px 4px}footer{margin-top:24px;font-size:13px;color:var(--muted)}
@media(min-width:1150px){.areas{grid-template-columns:repeat(3,minmax(0,1fr))}.area b{font-size:18px}}
@media(max-width:760px){body{font-size:16px}.shell{padding:16px 16px 30px}.banner{margin-bottom:18px}.intro{display:block}h1{font-size:27px}.intro .tag{margin-top:12px}.toolbar{margin-top:18px;align-items:stretch}.toolbar>button{width:100%}.mode{width:100%}.mode button{flex:1;text-align:center}.lesson{width:100%}.lesson label{width:100%}.lesson select{width:100%}.lesson .row{width:100%;justify-content:space-between}.tabs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:5px;margin-top:18px}.tabs button{text-align:center;padding:9px 3px;font-size:15px}.layout{display:block;margin-top:14px}.card{padding:18px 15px;border-radius:11px}.areas{grid-template-columns:1fr;gap:8px}.area{min-height:82px}.area b{font-size:20px}.sectionhead{display:block}.sectionhead .tag{margin-top:8px}.detail{position:static;max-height:none;overflow:visible}.relation{grid-template-columns:minmax(0,1fr) 70px minmax(0,1fr);gap:5px}.relation button{padding:10px 7px;font-size:15px;min-height:62px}.relation .edge{font-size:13px}.relation .scope{font-size:13px}.comparison{grid-template-columns:1fr}.compare-wrap{margin-top:14px}.filter{width:100%}.filter select{flex:1;min-width:0}.desktop-only{display:none}#relationPane.section{margin-top:0}.detail h2{font-size:26px}.sample-content{height:310px}.backrow button{width:100%}.find{margin-top:10px}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style></head><body><main class="shell">
<div class="banner"><b>설계 시안 · 검토용</b> — 실제 장면·개념지도·용어사전 연결은 <b>미구현</b>입니다. 아래 왕복 체험은 샘플 화면입니다.</div>
<header class="intro"><div><div class="eyebrow">B2-1 PYTHON STORY MAP / SCENE 08</div><h1>개념 사이를 걷고,<br>내 코드에서 확인하기</h1><p class="muted">개념 선택 → 관계 확인 → 장면 복습 → 코드 근거 → 나의 설명</p></div><span class="tag">새 문법 없이 · 근거로 설명</span></header>
<div class="toolbar"><div class="mode" aria-label="탐색 모드"><button id="free" aria-pressed="true">자유 탐색</button><button id="guided" aria-pressed="false">강사 안내</button></div><div id="lesson" class="lesson" hidden><label for="path">복습 경로 <select id="path"></select></label><div class="row"><button id="prev">이전</button><span id="stepCount" class="small"></span><button id="next">다음</button></div></div><button id="sampleStart">샘플 왕복 체험</button></div>
<p id="lessonPrompt" class="prompt" hidden></p>
<p id="status" class="sr" role="status" aria-live="polite"></p>
<div id="mapView">
<nav class="tabs" aria-label="모바일 지도 보기"><button data-tab="areas" aria-pressed="true">영역</button><button data-tab="relations" aria-pressed="false">관계</button><button data-tab="detail" aria-pressed="false">상세</button><button data-tab="compare" aria-pressed="false">비교</button></nav>
<div class="layout"><div id="leftColumn"><section id="areasPane" class="card"><div class="sectionhead"><div><h2 tabindex="-1">7개 영역에서 시작하세요</h2><p class="small muted">대표 노드만 표시 · 관계선은 선택 후 확인</p></div><span class="tag">첫 화면 7개</span></div><div class="areas" id="areas"></div><details class="section"><summary>다른 개념 찾기</summary><label for="allNodes" class="small">학습한 개념 목록</label><select id="allNodes" class="find"><option value="">개념을 선택하세요</option></select></details></section>
<section id="relationPane" class="card section"><div class="sectionhead"><div><h2 tabindex="-1">선택한 개념의 관계</h2><p class="small muted">유형·방향을 읽으세요. 전체 실행 순서가 아닙니다.</p></div><span class="tag" id="counts"></span></div><div class="row filter"><label for="filter">관계 유형</label><select id="filter"><option value="all">모든 유형</option><option>포함</option><option>종류</option><option>호출</option><option>사용</option><option>역할</option></select></div><div id="historyInfo" class="small muted"></div><div id="relations"></div><div class="row backrow"><button id="nodeBack" disabled>이전 선택</button><button id="toDetail">선택 개념 상세</button></div></section></div>
<aside id="detailPane" class="card detail" aria-label="선택 개념 상세"><h2 tabindex="-1">개념 하나를 골라 보세요</h2><p class="muted section">선택하면 뜻·관계·복습 장면·사전 상태·내 코드 단서를 함께 보여 줍니다.</p></aside></div>
<section id="comparePane" class="card compare-wrap"><div class="sectionhead"><div><h2 tabindex="-1">헷갈리는 개념은 두 칸으로</h2><p class="small muted">비교 카드는 그래프 선으로 연결하지 않습니다.</p></div><span class="tag">비교 카드</span></div><label for="comparisonSelect">비교할 짝</label> <select id="comparisonSelect"></select><div id="comparison" class="comparison"></div></section>
<section class="foot"><h3>이제 내 코드에 작은 지도를 만드세요.</h3><p class="muted">개념 3개 · 관계 2개 · 비교 1개. 파일·함수·줄 번호와 확인 근거를 적고 자기 말로 설명합니다.</p><p class="small muted">단일 파일·다른 저장 형식도 가능합니다. 없는 개념은 없음, 근거가 부족하면 미확인으로 남깁니다. 활동 양식: 같은 폴더 script.md F·G.</p></section>
</div>
<section id="sceneView" class="card mock" hidden><span class="tag">샘플 Scene · 실제 서비스 연결 미구현</span><h2 tabindex="-1" id="sceneTitle">Scene 05 · 4. Generator</h2><p>실제 장면 원고의 일부를 재구성한 복귀 시연용 화면입니다.</p><div class="sample-content" id="sceneScroll"><p class="muted">원래 읽던 위치를 기억하는 샘플</p><p class="sample-text">Generator 함수를 호출하면 Generator 객체가 만들어집니다. 본문은 다음 값을 요청할 때 시작됩니다.</p><p class="sample-text">yield에서 값을 내보내고 멈춘 뒤, 다시 요청하면 이어서 실행합니다.</p><button id="sceneMapTrigger">Generator 관계 보기 · 모형</button><p>여기에서 지도와 사전으로 갔다 돌아옵니다.</p><p>Iterator와 어떤 관계인지 확인한 뒤 원래 문단으로 복귀합니다.</p></div><button id="leaveScene">지도 탐색으로 · 모형</button></section>
<section id="glossaryView" class="card mock" hidden><span class="tag">샘플 용어 패널 · 실제 사전 연결 미구현</span><h2 tabindex="-1" id="glossaryTitle"></h2><div id="glossaryBody"></div><div class="row"><button id="backMap">직전 지도 맥락으로 · 모형</button><button id="backStartNode">시작 개념 Generator로 · 모형</button></div></section>
<footer>콘텐츠·UX 후보 / bdc0cc5 기준 / 독립 검토·Owner 승인 전. 안내 경로의 단계는 복습 순서입니다.</footer>
</main><script id="candidate" type="application/json">__DATA__</script><script>
'use strict';
const D=JSON.parse(document.getElementById('candidate').textContent);
const $=id=>document.getElementById(id), node=id=>D.nodes.find(n=>n.id===id);
const S={selected:null,history:[],filter:'all',tab:'areas',mode:'free',path:'P1',step:0,freeState:null,origin:null,view:'map',comparison:'C16'};
let snapshot=null;
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
const mobile=()=>matchMedia('(max-width:760px)').matches;
function say(t){$('status').textContent=t;}
function focusHeading(id){const h=$(id).querySelector('h2');if(h){h.focus({preventScroll:true});const r=h.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)h.scrollIntoView({block:'start'});}}
function saveFree(){S.freeState={selected:S.selected,history:[...S.history],filter:S.filter,tab:S.tab};}
function setMode(mode){
 if(mode===S.mode)return;
 if(mode==='guided'){saveFree();S.mode=mode;applyStep();}
 else{S.mode=mode;if(S.freeState)Object.assign(S,structuredClone(S.freeState));render();}
 say(mode==='guided'?'강사 안내: 복습 순서입니다.':'자유 탐색으로 돌아왔습니다.');
}
function applyStep(){const p=D.teacherPaths.find(p=>p.id===S.path);S.step=Math.max(0,Math.min(p.steps.length-1,S.step));S.selected=p.steps[S.step].nodeId;S.history=[S.selected];S.filter='all';S.tab='relations';render();}
function selectNode(id,fromButton=true){
 if(!node(id))return;
 if(S.mode==='guided'){S.mode='free';S.freeState=null;}
 S.selected=id;S.filter='all';if(S.history.at(-1)!==id)S.history.push(id);S.tab='relations';render();
 if(fromButton)focusHeading('relationPane');say(node(id).label+' 선택. 관련 관계와 상세를 확인하세요.');
}
function setTab(tab,moveFocus=false){S.tab=tab;applyViews();if(moveFocus)focusHeading({areas:'areasPane',relations:'relationPane',detail:'detailPane',compare:'comparePane'}[tab]);say('지도 '+{areas:'영역',relations:'관계',detail:'상세',compare:'비교'}[tab]+' 보기');}
function applyViews(){
 $('mapView').hidden=S.view!=='map';$('sceneView').hidden=S.view!=='scene';$('glossaryView').hidden=S.view!=='glossary';
 for(const [id,tab] of [['areasPane','areas'],['relationPane','relations'],['detailPane','detail'],['comparePane','compare']])$(id).hidden=mobile()&&S.tab!==tab;
 $('leftColumn').hidden=mobile()&&!['areas','relations'].includes(S.tab);
 document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tab===S.tab)));
 $('sampleStart').hidden=S.view!=='map';
}
function button(text,action,id){const b=el('button',text);if(id)b.id=id;b.addEventListener('click',action);return b;}
function renderAreas(){
 $('areas').replaceChildren();for(const a of D.areas){const n=node(a.representativeNodeId);const b=button('',()=>selectNode(n.id),'area-'+n.id);b.className='area';b.dataset.node=n.id;b.setAttribute('aria-pressed',String(S.selected===n.id));b.append(el('small',a.label),el('b',n.label));if(S.selected===n.id)b.append(el('span','선택','selected-label'));$('areas').append(b);}
}
function related(){return D.relations.filter(r=>r.from===S.selected||r.to===S.selected);}
function sameAreaSuggestions(id){
 const selected=node(id);if(!selected)return [];
 const hasRelations=n=>D.relations.some(r=>r.from===n.id||r.to===n.id);
 return D.nodes.filter(n=>n.area===selected.area&&n.id!==id).sort((a,b)=>Number(hasRelations(b))-Number(hasRelations(a))).slice(0,3);
}
function renderRelations(){
 const all=related(), rows=all.filter(r=>S.filter==='all'||r.type===S.filter);$('filter').value=S.filter;$('counts').textContent='전체 후보 '+D.relations.length+' / 선택 연결 '+all.length;
 $('historyInfo').textContent=S.history.length?'탐색 맥락: '+S.history.map(id=>node(id).label).join(' / '):'아직 선택한 개념이 없습니다.';
 $('relations').replaceChildren();
 if(!rows.length){
  if(!S.selected||all.length)$('relations').append(el('p',!S.selected?'영역에서 개념 하나를 선택하세요.':'이 유형의 직접 관계가 없습니다. 다른 유형을 선택하세요.','empty'));
  else{
   const empty=el('div',undefined,'empty');empty.id='noDirectRelations';
   empty.append(el('p','이 후보에서 '+node(S.selected).label+'의 직접 관계는 0개입니다. 같은 영역의 다른 개념을 선택해 탐색을 이어가세요.'));
   const peers=sameAreaSuggestions(S.selected);
   if(peers.length){
    const group=el('section',undefined,'section');group.id='sameAreaSuggestions';group.setAttribute('aria-labelledby','sameAreaHeading');
    const heading=el('h3','같은 영역의 다른 개념');heading.id='sameAreaHeading';
    group.append(heading,el('p','영역이 같다는 탐색 안내이며, 개념 관계나 실제 실행 경로를 뜻하지 않습니다.','small'));
    const buttons=el('div',undefined,'row section');
    for(const peer of peers){const b=button('같은 영역의 다른 개념 · ',()=>selectNode(peer.id));const label=el('span',peer.label);label.style.whiteSpace='nowrap';b.append(label);b.dataset.suggestion=peer.id;buttons.append(b);}
    group.append(buttons);empty.append(group);
   }
   $('relations').append(empty);
  }
 }
 for(const r of rows){const row=el('div',undefined,'relation'+(r.id==='R15'?' import':''));row.dataset.relation=r.id;const a=button(node(r.from).label,()=>selectNode(r.from));a.dataset.endpoint=r.from;a.setAttribute('aria-pressed',String(r.from===S.selected));const edge=el('div',r.type+' · '+r.id,'edge');edge.append(el('span','→','arrow'));const b=button(node(r.to).label,()=>selectNode(r.to));b.dataset.endpoint=r.to;b.setAttribute('aria-pressed',String(r.to===S.selected));row.append(a,edge,b,el('p',r.label+' — '+r.scope,'scope'));$('relations').append(row);}
 $('nodeBack').disabled=S.history.length<2;$('toDetail').disabled=!S.selected;
}
function detailSection(title,text){const s=el('section');s.append(el('h3',title),el('p',text));return s;}
function renderDetail(){
 const box=$('detailPane');box.replaceChildren();const n=node(S.selected);if(!n){const h=el('h2','개념 하나를 골라 보세요');h.tabIndex=-1;box.append(h,el('p','뜻·관계·장면·사전 상태·코드 단서를 함께 확인합니다.','muted section'));return;}
 box.append(el('span','선택한 개념','tag strong'));const h=el('h2',n.label);h.tabIndex=-1;box.append(h,el('p',n.easy,'lead'),el('p','아래로 읽으며 장면·사전·코드 단서를 확인하세요.','small muted section'),detailSection('이 미션에서 왜 등장할까?',n.missionReason));
 box.append(detailSection('연결 개념과 유형',related().map(r=>node(r.from).label+' → '+node(r.to).label+' / '+r.type+' ('+r.id+')').join(' · ')||'이 후보에 직접 관계 없음. 비교 또는 다른 개념으로 탐색하세요.'));
 if(n.id==='generator'){const s=detailSection('결과는 어디에 보관할까?','list(Generator)는 끝까지 소비해 모든 값을 모을 수 있습니다. 이 설명은 보관 방법입니다. R44는 list() → Iterator의 사용 관계에서 확인하세요.');s.append(button('Iterator 관계에서 R44 보기',()=>selectNode('iterator'),'openR44'));box.append(s);}
 const scene=detailSection('Story Scene에서 복습',n.sceneIds.map(id=>D.scenes[id].label).join(' · '));const sl=el('div',undefined,'links');sl.append(button('장면으로 이동 · 미구현',()=>{}));sl.firstChild.disabled=true;if(S.origin)sl.append(button('Scene 05 읽던 위치로 · 모형',returnScene,'returnScene'));scene.append(sl);box.append(scene);
 const g=n.glossary;const state=g.mode==='none'?'연결 없음':(g.mode==='extension'?'확장':'정의')+' · '+g.termId+' (콘텐츠 존재 확인)';const gs=detailSection('용어사전 연결 상태',state);gs.append(el('p','실제 서비스 연결: 미구현','small muted'));if(g.warning)gs.append(el('p',g.warning,'notice'));const links=el('div',undefined,'links');const disabled=button('용어사전으로 이동 · 미구현',()=>{});disabled.disabled=true;links.append(disabled);if(g.termId)links.append(button('샘플 용어 패널 보기 · 모형',()=>openGlossary(n.id),'sampleGlossary'));gs.append(links);box.append(gs);
 box.append(detailSection('내 코드에서 찾아볼 단서',n.codeClue));
 const cs=D.comparisons.filter(c=>c.left===n.id||c.right===n.id);if(cs.length){const s=detailSection('헷갈리면 비교 카드',cs.map(c=>c.id).join(' · '));for(const c of cs)s.append(button(c.id+' '+node(c.left).label+' / '+node(c.right).label,()=>{S.comparison=c.id;renderComparison();setTab('compare',true);}));box.append(s);}
}
function renderComparison(){
 $('comparisonSelect').value=S.comparison;const c=D.comparisons.find(c=>c.id===S.comparison);const box=$('comparison');box.replaceChildren();box.dataset.comparison=c.id;
 for(const [id,text] of [[c.left,c.leftText],[c.right,c.rightText]]){const s=el('section');s.append(el('h3',node(id).label),el('p',text));box.append(s);}box.append(el('p',c.id+' · '+c.source,'small muted'));
}
function render(){renderAreas();renderRelations();renderDetail();renderComparison();$('free').setAttribute('aria-pressed',String(S.mode==='free'));$('guided').setAttribute('aria-pressed',String(S.mode==='guided'));$('lesson').hidden=S.mode!=='guided';$('lessonPrompt').hidden=S.mode!=='guided';const p=D.teacherPaths.find(p=>p.id===S.path);$('path').value=S.path;$('stepCount').textContent=(S.step+1)+' / '+p.steps.length;$('prev').disabled=S.step===0;$('next').disabled=S.step===p.steps.length-1;$('lessonPrompt').textContent='복습 순서 · 실행 순서 아님 — '+p.steps[S.step].prompt;applyViews();}
function beginSample(){S.view='scene';S.origin={scroll:0,focusId:'sceneMapTrigger',sceneId:'05',section:'4. Generator'};applyViews();focusHeading('sceneView');say('샘플 Scene입니다. 실제 페이지 연결은 미구현입니다.');}
function fromScene(){S.origin={scroll:$('sceneScroll').scrollTop,focusId:'sceneMapTrigger',sceneId:'05',section:'4. Generator'};S.view='map';S.mode='free';S.selected='generator';S.history=['generator'];S.filter='all';S.tab='relations';S.freeState=null;render();focusHeading('relationPane');}
function returnScene(){S.view='scene';applyViews();$('sceneScroll').scrollTop=S.origin?.scroll||0;$(S.origin?.focusId||'sceneMapTrigger').focus({preventScroll:true});say('샘플 Scene 05 읽던 위치로 돌아왔습니다.');}
function openGlossary(id){
 const n=node(id);snapshot={state:structuredClone(S),windowScroll:window.scrollY,panelScroll:$('detailPane').scrollTop,focusId:'sampleGlossary'};
 S.view='glossary';$('glossaryTitle').textContent=n.label+' · '+(n.glossary.mode==='extension'?'확장':'정의')+' 모형';$('glossaryBody').replaceChildren(el('p','termId: '+n.glossary.termId,'small muted'),el('p','사전 콘텐츠가 존재하는지 확인했습니다. 이 패널은 실제 사전을 열지 않고 복귀 상태만 시연합니다.'),el('p',n.glossary.warning||n.easy,'notice'));$('backStartNode').hidden=!S.origin;applyViews();focusHeading('glossaryView');say('샘플 용어 패널입니다.');
}
function restoreMap(start=false){if(!snapshot)return;Object.assign(S,structuredClone(snapshot.state));if(start){S.selected='generator';S.history=['generator'];S.filter='all';S.tab='relations';}render();$('detailPane').scrollTop=snapshot.panelScroll;window.scrollTo(0,snapshot.windowScroll);if(start)focusHeading('relationPane');else{const f=$(snapshot.focusId);if(f&&!f.closest('[hidden]'))f.focus({preventScroll:true});else focusHeading('detailPane');}say('지도 선택·탐색 이력·모드·필터를 복원했습니다.');}
for(const a of D.nodes){const o=el('option',a.label);o.value=a.id;$('allNodes').append(o);}for(const p of D.teacherPaths){const o=el('option',p.id+' · '+p.title);o.value=p.id;$('path').append(o);}for(const c of D.comparisons){const o=el('option',c.id+' · '+node(c.left).label+' / '+node(c.right).label);o.value=c.id;$('comparisonSelect').append(o);}
$('free').onclick=()=>setMode('free');$('guided').onclick=()=>setMode('guided');$('path').onchange=e=>{S.path=e.target.value;S.step=0;applyStep();};$('prev').onclick=()=>{S.step--;applyStep();};$('next').onclick=()=>{S.step++;applyStep();};$('allNodes').onchange=e=>{if(e.target.value)selectNode(e.target.value);e.target.value='';};$('filter').onchange=e=>{S.filter=e.target.value;renderRelations();};$('comparisonSelect').onchange=e=>{S.comparison=e.target.value;renderComparison();say('비교 카드 '+S.comparison);};$('nodeBack').onclick=()=>{if(S.history.length>1){S.history.pop();S.selected=S.history.at(-1);S.filter='all';render();focusHeading('relationPane');}};$('toDetail').onclick=()=>setTab('detail',true);
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab,true));$('sampleStart').onclick=beginSample;$('sceneMapTrigger').onclick=fromScene;$('leaveScene').onclick=()=>{S.view='map';render();};$('backMap').onclick=()=>restoreMap(false);$('backStartNode').onclick=()=>restoreMap(true);matchMedia('(max-width:760px)').addEventListener('change',applyViews);
// Read-only test inspection; no route writes, code uploads, or network analysis.
window.scene08Model={state:()=>structuredClone(S),returnSnapshot:()=>structuredClone(snapshot),data:D};render();
</script></body></html>'''

html = TEMPLATE.replace('__DATA__', json.dumps(DATA, ensure_ascii=False).replace('<', '\\u003c'))
(DIR / 'concept-map-preview.html').write_text(html)
print('built concept-map-preview.html (local design model)')
