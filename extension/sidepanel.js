let terms=[],book,checks=[],tab='requirements';
const app=document.querySelector('#app');
const norm=value=>value.toLowerCase().trim().replace(/[\s_-]+/g,'').replace(/[./]/g,'');
const esc=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const term=id=>terms.find(item=>item.id===id);
const name=id=>term(id)?.termKo||id;
const context=id=>book.quick_term_context?.[id];

Promise.all([fetch('glossary.json').then(response=>response.json()),fetch('openbook-main-m01.json').then(response=>response.json())]).then(([loadedTerms,loadedBook])=>{
  terms=loadedTerms;book=loadedBook;
  chrome.storage.local.get(['m01Checks','openbookSearch'],saved=>{
    checks=saved.m01Checks||[];
    if(saved.openbookSearch){tab='search';search(saved.openbookSearch);chrome.storage.local.remove('openbookSearch');}
    else render();
  });
});

document.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{tab=button.dataset.tab;render();});
function selectTab(){document.querySelectorAll('[data-tab]').forEach(button=>button.classList.toggle('active',button.dataset.tab===tab));}
function saveChecks(){chrome.storage.local.set({m01Checks:checks});}
function render(){selectTab();if(tab==='requirements')requirements();else if(tab==='search')search('');else checklist();}
function bind(){
  app.querySelectorAll('[data-check]').forEach(input=>input.onchange=()=>{checks=input.checked?[...new Set([...checks,input.dataset.check])]:checks.filter(id=>id!==input.dataset.check);saveChecks();render();});
  app.querySelectorAll('[data-term]').forEach(link=>link.onclick=event=>{event.preventDefault();tab='search';search(link.dataset.term);});
}
function requirements(){
  const done=checks.length;
  app.innerHTML=`<div class="progress"><b>${done} / ${book.requirements.length} 확인</b><i><span style="width:${done/book.requirements.length*100}%"></span></i></div><div class="quick">${book.quick_terms.map(id=>`<a href="#" data-term="${id}">${name(id)}</a>`).join('')}</div>`+book.requirements.map((requirement,index)=>`<article class="req ${checks.includes(requirement.id)?'done':''}"><label class="req-heading"><input type="checkbox" data-check="${requirement.id}" ${checks.includes(requirement.id)?'checked':''}><b>${String(index+1).padStart(2,'0')}. ${requirement.title}</b></label><p>${requirement.requirement_summary}</p><p class="ten-second"><b>10초 확인</b> ${requirement.quick_check}</p><details><summary>화면·코드·질문 확인</summary><b>화면에서 확인</b><p>${requirement.demo_checks.join('<br>• ')}</p><b>코드에서 확인</b><p>${requirement.code_checks.join('<br>• ')}</p><b>흔한 함정</b><p>${requirement.common_traps[0]}</p><b>동료평가 질문</b><p>${requirement.peer_questions[0]}</p><div class="quick">${requirement.term_refs.map(id=>`<a href="#" data-term="${id}">${name(id)}</a>`).join('')}</div></details></article>`).join('');
  bind();
}
function find(query){
  const normalized=norm(query);
  return terms.map(item=>{
    const m01=context(item.id);
    const values=[item.termKo,item.termEn,...item.aliases,...(m01?.aliases||[])];
    const rank=values.some(value=>value.toLowerCase()===query.toLowerCase())?0:values.some(value=>norm(value)===normalized)?1:values.some(value=>norm(value).startsWith(normalized))?2:values.some(value=>norm(value).includes(normalized))?3:9;
    return {item,rank,m01};
  }).filter(result=>result.rank<9).sort((left,right)=>left.rank-right.rank||Number(Boolean(right.m01))-Number(Boolean(left.m01))).slice(0,12);
}
function search(initial){
  selectTab();
  app.innerHTML=`<label class="sr" for="q">용어 검색</label><input id="q" value="${esc(initial)}" placeholder="550개 기술용어를 검색하세요"><p id="hint">예: HTML, localStorage, DOM, fetch, GitHub API</p><div id="results"></div>`;
  const input=document.querySelector('#q');input.oninput=()=>show(input.value);if(initial)show(initial);
  function show(value){
    const output=document.querySelector('#results');
    if(!value.trim()){output.innerHTML='';return;}
    const results=find(value);
    output.innerHTML=results.length?results.map(({item,m01})=>m01?`<article class="result m01-context"><p class="context-label">본과정 M01 맥락</p><b>${item.termKo}</b><small>${item.termEn}</small><p><b>10초 요약</b> ${m01.quick_explanation}</p><p><em>M01에서는</em> ${m01.mission_relevance}</p><p><b>동료 질문</b> ${m01.peer_question}</p><details><summary>화면·코드·함정 보기</summary><p><b>화면</b> ${m01.screen_check}</p><p><b>코드</b> ${m01.code_check}</p><p><b>함정</b> ${m01.common_trap}</p></details></article>`:`<article class="result"><b>${item.termKo}</b><small>${item.termEn}</small><p>${item.summary||'이 용어의 M01 맥락은 아직 작성되지 않았습니다.'}</p><em>전체 사전 용어</em></article>`).join(''):`<article class="unknown"><b>${esc(value)}</b><p>아직 코디세이 오픈북 사전에 없는 용어입니다.</p><button id="websearch">웹에서 검색하기</button></article>`;
    if(!results.length)document.querySelector('#websearch').onclick=()=>chrome.search.query({text:value,disposition:'NEW_TAB'});
  }
}
function checklist(){
  app.innerHTML='<h2>평가 체크</h2>'+book.requirements.map(requirement=>`<label class="check"><input type="checkbox" data-check="${requirement.id}" ${checks.includes(requirement.id)?'checked':''}><span>${requirement.title}</span></label>`).join('')+'<button class="reset" id="reset">평가 체크 초기화</button>';
  document.querySelector('#reset').onclick=()=>{checks=[];saveChecks();checklist();};bind();
}
