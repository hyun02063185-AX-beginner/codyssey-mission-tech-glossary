import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { explorerData as data, nodeById, typeMeanings, relatedRelations, termForNode, nodeReviews, itemReviews } from './adapter';
import { explorerHref, explorerPath, explorerTrail, readExplorer, initialExplorer, type ExplorerState } from './state';
import type { ExplorerPath } from '../b21Learning/paths';
import { extensionNotice } from '../b21StoryV3/links/catalog';
import { parseStorySource } from '../b21StoryV3/links/returnAddress';
import { resolveStoryRoute, routeURL, storyPath } from '../b21StoryV3/routing/storyRoute';
import type { ReviewLink } from '../b21StoryV3/content';
import ExplorerCanvas from './ExplorerCanvas';
import './explorer.css';

type PanelTab='detail'|'relations'|'comparisons'|'guide';
export default function ConceptExplorer({path:basePath=explorerPath,navigation}: {path?:ExplorerPath;navigation?:ReactNode} = {}) {
  const location=useLocation(),navigate=useNavigate();
  const {state:s,notice}=readExplorer(location.search);
  const currentHref=explorerHref(s,basePath),free=useRef<ExplorerState|null>(null);
  const trail=explorerTrail(location.state?.b21ExplorerTrail,basePath);
  const root=useRef<HTMLElement>(null),heading=useRef<HTMLHeadingElement>(null),previous=useRef<string|null>(null);
  const [areasOpen,setAreasOpen]=useState(false),[panelOpen,setPanelOpen]=useState(false),[tab,setTab]=useState<PanelTab>('detail'),[full,setFull]=useState(false);
  const savedPanels=useRef({areas:false,panel:false});
  const [focusRequest,setFocusRequest]=useState<{selector:string;sequence:number}|null>(null);
  const moveTo=(selector:string,_section?:string)=>setFocusRequest(prior=>({selector,sequence:(prior?.sequence??0)+1}));
  const openPanel=(next:PanelTab)=>{setTab(next);setPanelOpen(true);if(window.matchMedia('(max-width:900px)').matches)setAreasOpen(false);moveTo(next==='guide'?'.b21ce-guided':next==='relations'?'.b21ce-relations-heading':next==='comparisons'?'.b21ce-comparisons h2':'.b21ce-detail h2');};
  const closePanel=()=>{setPanelOpen(false);moveTo('.b21ce-panel-toggle');};
  const toggleFull=()=>{
    if(!full){savedPanels.current={areas:areasOpen,panel:panelOpen};setAreasOpen(false);setPanelOpen(false);}
    else {setAreasOpen(savedPanels.current.areas);setPanelOpen(savedPanels.current.panel);}
    setFull(value=>!value);moveTo('.b21ce-expand');
  };
  useLayoutEffect(()=>{
    if(!focusRequest)return;root.current?.querySelector<HTMLElement>(focusRequest.selector)?.focus({preventScroll:true});
  },[focusRequest]);
  useLayoutEffect(()=>{
    const measure=()=>{const el=root.current;if(el)el.style.setProperty('--ce-top',`${Math.max(0,el.getBoundingClientRect().top)}px`);};
    measure();window.addEventListener('resize',measure);return ()=>window.removeEventListener('resize',measure);
  },[full]);
  useEffect(()=>{if(!full)return;const prior=document.body.style.overflow;document.body.style.overflow='hidden';return ()=>{document.body.style.overflow=prior;};},[full]);
  const selection=s.comparison??s.relation??s.node??s.area;
  const selectionKey=`${s.mode}|${selection??''}|${s.mode==='guided'?`${s.path}-${s.at}`:''}`;
  useLayoutEffect(()=>{
    if(previous.current===selectionKey)return;
    const mobile=window.matchMedia('(max-width:900px)').matches;
    if(s.comparison||s.relation){setPanelOpen(true);setTab('detail');setAreasOpen(false);moveTo('.b21ce-detail h2');}
    else if(s.mode==='guided'){setPanelOpen(true);setTab('guide');setAreasOpen(false);moveTo('.b21ce-guided');}
    else if(s.node){setAreasOpen(false);setTab('detail');if(!mobile&&!full)setPanelOpen(true);moveTo('.b21ce-selection-heading');}
    else if(s.area){setPanelOpen(false);moveTo('.b21ce-concept-heading');}
    else {setPanelOpen(false);if(previous.current!==null)moveTo('.b21ce-selection-heading');}
    previous.current=selectionKey;
  },[selectionKey]);
  const go=(state:ExplorerState,replace=false)=>navigate(explorerHref(state,basePath),{replace,state:{b21ExplorerTrail:[...trail,currentHref].slice(-20)}});
  const change=(patch:Partial<ExplorerState>,replace=false)=>go({...s,...patch},replace);
  const goPrevious=()=>navigate(trail.at(-1)??routeURL(parseStorySource(s.origin??'scene=08&step=1')!),{replace:true,state:{b21ExplorerTrail:trail.slice(0,-1)}});
  const selectNode=(id:string)=>change({area:nodeById.get(id)!.area,node:id,relation:null,comparison:null,mode:'free'});
  const selectRelation=(id:string)=>{const r=data.relations.find(r=>r.id===id)!;change({relation:id,node:[r.from,r.to].includes(s.node??'')?s.node:r.from,comparison:null,mode:'free',type:'all'});};
  const selectComparison=(id:string)=>change({comparison:id,relation:null,mode:'free'});
  const path=data.teacherPaths.find(p=>p.id===s.path)!;
  const node=s.node?nodeById.get(s.node)!:null;
  const relation=data.relations.find(r=>r.id===s.relation);
  const comparison=data.comparisons.find(c=>c.id===s.comparison);
  const area=data.areas.find(a=>a.id===s.area);
  const relations=relatedRelations(s.node,s.type).filter(r=>s.node||!s.area||[r.from,r.to].some(id=>nodeById.get(id)!.area===s.area));
  const term=node?termForNode(node):undefined;
  const reviews=comparison?itemReviews('comparison',comparison.id):relation?itemReviews('relation',relation.id):node?nodeReviews(node.id):[];
  const reviewLinks=(items:readonly ReviewLink[])=><div className="b21ce-links">{items.length?items.map(review=><Link key={review.label} state={{b21Explorer:currentHref}} to={routeURL(resolveStoryRoute(storyPath,'?'+new URLSearchParams({scene:review.target.scene,step:review.target.step})).route)}>{review.label} 복습 →</Link>):<p className="b21ce-held">강의 연결 보류 · 검증된 v3 장면 매핑이 없습니다.</p>}</div>;
  const nodeButton=(id:string)=><button key={id} onClick={()=>selectNode(id)}>{nodeById.get(id)!.label} →</button>;
  const tabs:[PanelTab,string][]=[['detail','상세'],['relations','관계'],['comparisons','비교'],...(s.mode==='guided'?[['guide','안내'] as [PanelTab,string]]:[])];
  const keyboard=(event:React.KeyboardEvent<HTMLElement>)=>{
    if(event.key==='Escape'){
      const menu=root.current?.querySelector<HTMLDetailsElement>('.b21ce-menu[open]');
      if(menu){menu.open=false;menu.querySelector('summary')?.focus();}
      else if(panelOpen)closePanel();else if(areasOpen){setAreasOpen(false);moveTo('.b21ce-area-toggle');}else if(full)toggleFull();
      event.preventDefault();
    }
    if(full&&event.key==='Tab'){
      const items=[...root.current!.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],select,summary,[tabindex="0"]')].filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));
      if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1)?.focus();}
      else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0]?.focus();}
    }
  };
  return <main className={`b21ce${full?' is-map-focus':''}`} ref={root} onKeyDown={keyboard} aria-label="B2-1 전체 개념지도 탐색">
    <header className="b21ce-header"><h1>B2-1 전체 개념지도</h1><span className="b21ce-current">{node?.label??area?.label??'45개 개념 · 전체 보기'}</span>
      <details className="b21ce-menu"><summary>메뉴</summary><div className="b21ce-menu-content" onClick={event=>{if((event.target as Element).closest('button,a'))event.currentTarget.closest('details')?.removeAttribute('open');}}>
        <nav aria-label="학습 이동">{navigation}{s.origin&&<Link className="b21ce-primary" to={routeURL(parseStorySource(s.origin)!)}>← 원래 강의 위치로 돌아가기</Link>}
          <Link to={routeURL(parseStorySource(s.origin??'scene=08&step=1')!)} state={{b21Explorer:currentHref}}>Scene 08 강의 보기</Link>
          <button onClick={goPrevious}>이전 화면</button><button onClick={()=>change({...initialExplorer,origin:s.origin})}>선택 해제 · 전체 영역</button>
        </nav>
        <div className="b21ce-row"><button aria-pressed={s.mode==='free'} onClick={()=>{if(s.mode==='guided')go(free.current??{...s,mode:'free'});}}>자유 탐색</button>
          <button aria-pressed={s.mode==='guided'} onClick={()=>{if(s.mode==='free')free.current=s;root.current?.querySelector('details')?.removeAttribute('open');change({mode:'guided',relation:null,comparison:null});}}>강사 안내</button></div>
        <p className="b21ce-notice">개념지도는 실행 순서도가 아닙니다. 선은 개념 사이의 관계이며, 강사 안내는 복습 순서입니다.</p>
        <p>45개 개념 · 24개 관계 · 10개 비교 · 7개 영역</p>
        <p>배경을 드래그해 이동 · 확대는 지도 안의 글자 크기 · 큰 화면은 주변 패널을 접어 표시 공간을 넓힙니다. 페이지 이동은 지도 바깥에서 합니다.</p>
        <div className="b21ce-legend">{Object.entries(typeMeanings).map(([type,meaning])=><p key={type}><b>{type}</b> · {meaning}</p>)}<p>→ 원본 관계 방향 · 사용: 점선</p></div>
        <p>개념 3개·관계 2개·비교 1개를 골라 내 코드의 근거와 함께 설명해 보세요. 근거가 부족하면 미확인으로 남깁니다.</p>
      </div></details>
    </header>
    {notice&&<p role="alert" className="b21ce-notice b21ce-address-notice">{notice}</p>}
    <section className="b21ce-toolbar" aria-label="탐색 도구">
      <button className="b21ce-area-toggle" aria-expanded={areasOpen} aria-controls="b21ce-area-panel" onClick={()=>{setAreasOpen(!areasOpen);if(!areasOpen){if(window.matchMedia('(max-width:900px)').matches)setPanelOpen(false);moveTo('.b21ce-overview h2');}}}>영역·개념</button>
      <select aria-label="모든 개념 찾기" value={s.node??''} onChange={e=>{if(e.target.value)selectNode(e.target.value);}}><option value="">45개 개념에서 선택</option>{data.areas.map(a=><optgroup key={a.id} label={a.label}>{data.nodes.filter(n=>n.area===a.id).map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>)}</select>
      <button className="b21ce-panel-toggle" aria-expanded={panelOpen} aria-controls="b21ce-info-panel" onClick={()=>openPanel(s.mode==='guided'?'guide':'detail')}>상세·관계</button>
    </section>
    <div className="b21ce-layout">
      <aside className="b21ce-areas-panel" id="b21ce-area-panel" hidden={!areasOpen} aria-label="영역과 개념 선택">
        <div className="b21ce-panel-header"><strong>영역·개념</strong><button aria-label="영역 패널 닫기" onClick={()=>{setAreasOpen(false);moveTo('.b21ce-area-toggle');}}>닫기</button></div>
        <section className="b21ce-overview" aria-label="7개 개념 영역"><h2 tabIndex={-1}>7개 영역에서 시작하세요</h2>
      <div className="b21ce-areas" id="b21ce-areas">{data.areas.map((a,i)=><button key={a.id} data-area={a.id} aria-pressed={s.area===a.id} onClick={()=>change({area:s.area===a.id?null:a.id,node:null,relation:null,comparison:null,mode:'free'})}>
        <small>{String(i+1).padStart(2,'0')} · {data.nodes.filter(n=>n.area===a.id).length}개 개념</small><strong>{a.label}</strong>
      </button>)}</div>

        {area&&<section className="b21ce-card b21ce-concepts" aria-label="영역 개념 목록"><h2 className="b21ce-concept-heading" tabIndex={-1}>개념 선택 <span>{area.label}</span></h2><div className="b21ce-node-list">{data.nodes.filter(n=>n.area===area.id).map(n=><button key={n.id} data-node-choice={n.id} aria-pressed={s.node===n.id} onClick={()=>s.node===n.id?change({node:null,relation:null,comparison:null,mode:'free'}):selectNode(n.id)}>{n.label}</button>)}</div></section>}
        </section>
      </aside>
      <div className="b21ce-maincol"><ExplorerCanvas state={s} onNode={selectNode} onRelation={selectRelation} expanded={full} onExpand={toggleFull} onGuide={s.mode==='guided'?()=>openPanel('guide'):undefined}/></div>
      <aside className="b21ce-panel" id="b21ce-info-panel" hidden={!panelOpen} aria-label="선택 정보">
        <div className="b21ce-panel-header"><strong>{s.mode==='guided'?'강사 안내':node?.label??'탐색 정보'}</strong><button aria-label="정보 패널 닫기" onClick={closePanel}>닫기</button></div>
        <div role="tablist" aria-label="탐색 정보 종류" onKeyDown={event=>{
          const index=tabs.findIndex(([id])=>id===tab),next=event.key==='ArrowRight'?(index+1)%tabs.length:event.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:event.key==='Home'?0:event.key==='End'?tabs.length-1:null;
          if(next!==null){event.preventDefault();setTab(tabs[next][0]);moveTo(`#ce-tab-${tabs[next][0]}`);}
        }}>{tabs.map(([id,label])=><button key={id} role="tab" tabIndex={tab===id?0:-1} id={`ce-tab-${id}`} aria-controls={`ce-panel-${id}`} aria-selected={tab===id} onClick={()=>openPanel(id)}>{label}</button>)}</div>
        <div className="b21ce-panel-body">
          <div role="tabpanel" id="ce-panel-detail" aria-labelledby="ce-tab-detail" hidden={tab!=='detail'}>
      <aside className="b21ce-detail b21ce-card" data-comparison={comparison?.id} aria-label="개념 상세 패널"><p className="b21ce-eyebrow">{comparison?'비교 카드':relation?'관계 상세':node?'개념 상세':'영역 선택'}</p>
        <h2 ref={heading} tabIndex={-1}>{comparison?`${nodeById.get(comparison.left)!.label} / ${nodeById.get(comparison.right)!.label}`:relation?`${relation.id} · ${relation.type}`:node?.label??area?.label}</h2>
        {node&&!relation&&!comparison&&<p className="b21ce-context">선택한 개념 · 연결 관계 {relatedRelations(node.id).length}개</p>}
        {comparison?<><p>비교는 관계선을 새로 만들지 않습니다.</p><div className="b21ce-comparison">{[[comparison.left,comparison.leftText],[comparison.right,comparison.rightText]].map(([id,text])=><section key={id}><h3>{nodeById.get(id)!.label}</h3><p>{text}</p>{nodeButton(id)}</section>)}</div><p className="b21ce-caption">원본 근거 · {comparison.source}</p></>:relation?<>
          <div className="b21ce-row">{nodeButton(relation.from)}<span>→</span>{nodeButton(relation.to)}</div><p className="b21ce-lead">{relation.label}</p><p>{typeMeanings[relation.type]}</p><h3>적용 범위</h3><p>{relation.scope}</p><p className="b21ce-caption">원본 근거 · {relation.outlineRef}</p>
        </>:node?<><p className="b21ce-lead">{node.easy}</p><h3>미션에서 확인할 것</h3><p>{node.missionReason}</p><h3>내 코드의 단서</h3><p>{node.codeClue}</p>
          {!!node.glossary.warning&&<p className="b21ce-notice">{node.glossary.warning}</p>}
          <h3>용어사전으로 확장</h3>{term?<div data-term-id={term.termId}><Link className="b21ce-primary" to={`/terms/${term.termId}?${new URLSearchParams({'b21-explorer':currentHref})}`}>{term.label} 용어 보기 →</Link><p className="b21ce-caption">{term.mode==='direct'?'직접 연결':'범위 확장'} · {extensionNotice}</p>{term.notice&&<p className="b21ce-notice">{term.notice}</p>}</div>:<p className="b21ce-held">용어사전 연결 보류 · U4에서 검증한 직접 대응 용어가 없습니다.</p>}
          <h3>헷갈리는 개념 비교</h3>{data.comparisons.filter(c=>c.left===node.id||c.right===node.id).map(c=><button className="b21ce-compare-link" key={c.id} onClick={()=>selectComparison(c.id)}>{c.id} · {nodeById.get(c.left)!.label} / {nodeById.get(c.right)!.label}</button>)}
        </>:<p>개념 목록에서 하나를 선택하면 뜻·관계·비교·검증된 복습 링크가 나타납니다.</p>}
        {(node||relation||comparison)&&<><h3>검증된 강의 복습</h3>{reviewLinks(reviews)}</>}
        <details className="b21ce-source"><summary>원본 장면과 연결 보류 안내</summary><p>원본 sceneIds는 v2 번호입니다. 03a·03b를 v3 Scene 03으로 자동 변환하지 않습니다. 검증된 복습 링크만 위에 표시합니다.</p>{node&&<p>원본 장면: {node.sceneIds.join(' · ')}</p>}<p>관계 자체는 원본 그대로 표시하며, v3 복습 목적지가 확인되지 않은 관계·비교는 연결 보류입니다.</p></details>
      </aside>
          </div>
          <div role="tabpanel" id="ce-panel-relations" aria-labelledby="ce-tab-relations" hidden={tab!=='relations'}>
        <section className="b21ce-card b21ce-relations" aria-label="연결 관계 목록"><h2 className="b21ce-relations-heading" tabIndex={-1}>{node?node.label+'의 연결 관계':'영역과 연결된 관계'}</h2>
          {node&&<button className="b21ce-detail-action" onClick={()=>openPanel('detail')}>{node.label} 상세 설명 읽기 →</button>}
          <label>관계 유형 <select aria-label="관계 유형" value={s.type} onChange={e=>change({type:e.target.value,relation:null,mode:'free'})}><option value="all">모든 유형</option>{Object.keys(typeMeanings).map(type=><option key={type}>{type}</option>)}</select></label>
          <p className="b21ce-caption">{s.type==='all'?'유형과 방향을 함께 읽으세요.':typeMeanings[s.type]} · {relations.length}개 관계</p>
          {relations.length?relations.map(r=><button className="b21ce-relation" data-relation-choice={r.id} key={r.id} aria-pressed={s.relation===r.id} onClick={()=>selectRelation(r.id)}><span>{r.id} · {r.type}</span><strong>{nodeById.get(r.from)!.label} → {nodeById.get(r.to)!.label}</strong><span>{r.label}</span></button>):<p className="b21ce-empty">이 선택과 유형에 해당하는 원본 관계가 없습니다.</p>}
        </section>

          </div>
          <div role="tabpanel" id="ce-panel-comparisons" aria-labelledby="ce-tab-comparisons" hidden={tab!=='comparisons'}>
    <section className="b21ce-card b21ce-comparisons" aria-label="전체 비교 카드"><h2 tabIndex={-1}>헷갈리는 개념, 두 칸으로 비교하기</h2><p>비교 카드는 관계선을 추가하지 않습니다.</p><label>비교할 짝 <select aria-label="비교할 짝" value={s.comparison??''} onChange={e=>{if(e.target.value)selectComparison(e.target.value);}}><option value="">비교 카드 선택</option>{data.comparisons.map(c=><option key={c.id} value={c.id}>{c.id} · {nodeById.get(c.left)!.label} / {nodeById.get(c.right)!.label}</option>)}</select></label></section>

          </div>
          <div role="tabpanel" id="ce-panel-guide" aria-labelledby="ce-tab-guide" hidden={tab!=='guide'}>
    {s.mode==='guided'&&<div className="b21ce-guided" tabIndex={-1} aria-label="강사 안내 경로"><label>복습 경로 <select aria-label="복습 경로" value={s.path} onChange={e=>change({path:e.target.value,at:0})}>{data.teacherPaths.map(p=><option value={p.id} key={p.id}>{p.id} · {p.title}</option>)}</select></label>
      <div className="b21ce-row"><button disabled={s.at===0} onClick={()=>change({at:s.at-1})}>안내 이전</button><strong role="status">{s.at+1} / {path.steps.length}</strong><button disabled={s.at===path.steps.length-1} onClick={()=>change({at:s.at+1})}>안내 다음</button></div>
      <p data-testid="guide-prompt">{path.steps[s.at].prompt}</p><small>{path.warning}</small><button onClick={()=>{setPanelOpen(false);moveTo('.b21ce-selection-heading');}}>현재 개념 지도 보기</button>
    </div>}

          </div>
        </div>
      </aside>
    </div>
    <p className="b21ce-bottom-hint">관계 지도 ≠ 실행 순서도 · {s.mode==='guided'?`${s.path} 안내 ${s.at+1}/${path.steps.length}`:'노드를 선택하고 상세·관계에서 더 살펴보세요.'}</p>
  </main>;
}
