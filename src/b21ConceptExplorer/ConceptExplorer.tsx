import { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { explorerData as data, nodeById, typeMeanings, relatedRelations, termForNode, nodeReviews, itemReviews } from './adapter';
import { explorerHref, readExplorer, initialExplorer, type ExplorerState } from './state';
import { extensionNotice } from '../b21StoryV3/links/catalog';
import { parseStorySource } from '../b21StoryV3/links/returnAddress';
import { resolveStoryRoute, routeURL, storyPath } from '../b21StoryV3/routing/storyRoute';
import type { ReviewLink } from '../b21StoryV3/content';
import ExplorerCanvas from './ExplorerCanvas';
import './explorer.css';

export default function ConceptExplorer() {
  const location=useLocation(),navigate=useNavigate();
  const {state:s,notice}=readExplorer(location.search);
  const currentHref=explorerHref(s),free=useRef<ExplorerState|null>(null);
  const heading=useRef<HTMLHeadingElement>(null),previous=useRef('');
  const selectionKey=s.comparison??s.relation??s.node??s.area??'';
  useEffect(()=>{
    if(previous.current!==selectionKey&&selectionKey){
      const mobile=window.matchMedia('(max-width:700px)').matches;
      heading.current?.focus({preventScroll:true});
      if(mobile)document.querySelector(s.node||s.relation||s.comparison?'.b21ce-detail':'.b21ce-node-list')?.scrollIntoView({block:'start'});
    }
    previous.current=selectionKey;
  },[selectionKey]);
  const change=(patch:Partial<ExplorerState>,replace=false)=>navigate(explorerHref({...s,...patch}),{replace});
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
  return <main className="b21ce">
    <header className="b21ce-header"><p className="b21ce-eyebrow">CONCEPT EXPLORER · C1</p><h1>B2-1 전체 개념지도</h1>
      <p>영역에서 시작해 개념의 뜻과 관계를 직접 탐색하세요.</p>
      <div className="b21ce-meta"><span>45개 개념</span><span>24개 관계</span><span>10개 비교</span><span>7개 영역</span></div>
      <p className="b21ce-notice">개념지도는 실행 순서도가 아닙니다. 선은 개념 사이의 관계이며, 강사 안내는 복습 순서입니다.</p>
      <div className="b21ce-row">{s.origin&&<Link className="b21ce-primary" to={routeURL(parseStorySource(s.origin)!)}>← 원래 강의 위치로 돌아가기</Link>}
        <Link to={routeURL(parseStorySource(s.origin??'scene=08&step=1')!)} state={{b21Explorer:currentHref}}>Scene 08 강의 보기</Link>
        <button onClick={()=>navigate(-1)}>이전 화면</button>
        <button onClick={()=>change({...initialExplorer,origin:s.origin})}>선택 해제 · 전체 영역</button>
      </div>
    </header>
    {notice&&<p role="alert" className="b21ce-notice">{notice}</p>}
    <section className="b21ce-toolbar" aria-label="탐색 모드"><div className="b21ce-row">
      <button aria-pressed={s.mode==='free'} onClick={()=>{if(s.mode==='guided')navigate(explorerHref(free.current??{...s,mode:'free'}));}}>자유 탐색</button>
      <button aria-pressed={s.mode==='guided'} onClick={()=>{if(s.mode==='free')free.current=s;change({mode:'guided',relation:null,comparison:null});}}>강사 안내</button>
      <label>모든 개념 찾기 <select aria-label="모든 개념 찾기" value={s.node??''} onChange={e=>{if(e.target.value)selectNode(e.target.value);}}><option value="">45개 개념에서 선택</option>{data.areas.map(a=><optgroup key={a.id} label={a.label}>{data.nodes.filter(n=>n.area===a.id).map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</optgroup>)}</select></label>
    </div>
    {s.mode==='guided'&&<div className="b21ce-guided" aria-label="강사 안내 경로"><label>복습 경로 <select aria-label="복습 경로" value={s.path} onChange={e=>change({path:e.target.value,at:0})}>{data.teacherPaths.map(p=><option value={p.id} key={p.id}>{p.id} · {p.title}</option>)}</select></label>
      <div className="b21ce-row"><button disabled={s.at===0} onClick={()=>change({at:s.at-1})}>안내 이전</button><strong role="status">{s.at+1} / {path.steps.length}</strong><button disabled={s.at===path.steps.length-1} onClick={()=>change({at:s.at+1})}>안내 다음</button></div>
      <p data-testid="guide-prompt">{path.steps[s.at].prompt}</p><small>{path.warning}</small>
    </div>}
    </section>
    <section className="b21ce-overview" aria-label="7개 개념 영역"><h2>7개 영역에서 시작하세요</h2><p>원본 개념지도의 분류입니다. 영역의 위치는 실행 순서를 뜻하지 않습니다.</p>
      <div className="b21ce-areas">{data.areas.map((a,i)=><button key={a.id} data-area={a.id} aria-pressed={s.area===a.id} onClick={()=>change({area:s.area===a.id?null:a.id,node:null,relation:null,comparison:null,mode:'free'})}>
        <small>영역 {String(i+1).padStart(2,'0')} · {data.nodes.filter(n=>n.area===a.id).length}개 개념</small><strong>{a.label}</strong><span>{nodeById.get(a.representativeNodeId)!.label}에서 살펴보기 ↗</span>
      </button>)}</div>
    </section>
    {(area||node||comparison)&&<div className="b21ce-workspace">
      <nav className="b21ce-jumps" aria-label="모바일 탐색 바로가기">{[...(s.mode==='guided'?[['안내','.b21ce-toolbar']]:[]),['영역','.b21ce-overview'],['개념','.b21ce-node-list'],['관계','.b21ce-maincol section[aria-label="연결 관계 목록"]'],['상세','.b21ce-detail'],['비교','.b21ce-comparisons']].map(([label,target])=><button key={label} onClick={()=>document.querySelector(target)?.scrollIntoView({block:'start'})}>{label}</button>)}</nav>
      <div className="b21ce-maincol">{area&&<ExplorerCanvas state={s} onNode={selectNode} onRelation={selectRelation}/>}
        {area&&<section className="b21ce-card" aria-label="영역 개념 목록"><h2>{area.label} · 개념</h2><div className="b21ce-node-list">{data.nodes.filter(n=>n.area===area.id).map(n=><button key={n.id} data-node-choice={n.id} aria-pressed={s.node===n.id} onClick={()=>s.node===n.id?change({node:null,relation:null,comparison:null,mode:'free'}):selectNode(n.id)}>{n.label}</button>)}</div></section>}
        {area&&<section className="b21ce-card" aria-label="연결 관계 목록"><h2>{node?node.label+'의 연결 관계':'영역과 연결된 관계'}</h2>
          <label>관계 유형 <select aria-label="관계 유형" value={s.type} onChange={e=>change({type:e.target.value,relation:null,mode:'free'})}><option value="all">모든 유형</option>{Object.keys(typeMeanings).map(type=><option key={type}>{type}</option>)}</select></label>
          <p className="b21ce-caption">{s.type==='all'?'유형과 방향을 함께 읽으세요.':typeMeanings[s.type]} · {relations.length}개 관계</p>
          {relations.length?relations.map(r=><button className="b21ce-relation" data-relation-choice={r.id} key={r.id} aria-pressed={s.relation===r.id} onClick={()=>selectRelation(r.id)}><span>{r.id} · {r.type}</span><strong>{nodeById.get(r.from)!.label} → {nodeById.get(r.to)!.label}</strong><span>{r.label}</span></button>):<p className="b21ce-empty">이 선택과 유형에 해당하는 원본 관계가 없습니다.</p>}
        </section>}
      </div>
      <aside className="b21ce-detail b21ce-card" aria-label="개념 상세 패널"><p className="b21ce-eyebrow">{comparison?'비교 카드':relation?'관계 상세':node?'개념 상세':'영역 선택'}</p>
        <h2 ref={heading} tabIndex={-1}>{comparison?`${nodeById.get(comparison.left)!.label} / ${nodeById.get(comparison.right)!.label}`:relation?`${relation.id} · ${relation.type}`:node?.label??area?.label}</h2>
        {comparison?<><p>비교는 관계선을 새로 만들지 않습니다.</p><div className="b21ce-comparison">{[[comparison.left,comparison.leftText],[comparison.right,comparison.rightText]].map(([id,text])=><section key={id}><h3>{nodeById.get(id)!.label}</h3><p>{text}</p>{nodeButton(id)}</section>)}</div><p className="b21ce-caption">원본 근거 · {comparison.source}</p></>:relation?<>
          <div className="b21ce-row">{nodeButton(relation.from)}<span>→</span>{nodeButton(relation.to)}</div><p className="b21ce-lead">{relation.label}</p><p>{typeMeanings[relation.type]}</p><h3>적용 범위</h3><p>{relation.scope}</p><p className="b21ce-caption">원본 근거 · {relation.outlineRef}</p>
        </>:node?<><p className="b21ce-lead">{node.easy}</p><h3>미션에서 확인할 것</h3><p>{node.missionReason}</p><h3>내 코드의 단서</h3><p>{node.codeClue}</p>
          {!!node.glossary.warning&&<p className="b21ce-notice">{node.glossary.warning}</p>}
          <h3>용어사전으로 확장</h3>{term?<div data-term-id={term.termId}><Link className="b21ce-primary" to={`/terms/${term.termId}?${new URLSearchParams({'b21-explorer':currentHref})}`}>{term.label} 용어 보기 →</Link><p className="b21ce-caption">{term.mode==='direct'?'직접 연결':'범위 확장'} · {extensionNotice}</p>{term.notice&&<p className="b21ce-notice">{term.notice}</p>}</div>:<p className="b21ce-held">용어사전 연결 보류 · U4에서 검증한 직접 대응 용어가 없습니다.</p>}
          <h3>헷갈리는 개념 비교</h3>{data.comparisons.filter(c=>c.left===node.id||c.right===node.id).map(c=><button className="b21ce-compare-link" key={c.id} onClick={()=>selectComparison(c.id)}>{c.id} · {nodeById.get(c.left)!.label} / {nodeById.get(c.right)!.label}</button>)}
        </>:<p>아래 개념 목록에서 하나를 선택하면 뜻·관계·비교·검증된 복습 링크가 나타납니다.</p>}
        {(node||relation||comparison)&&<><h3>검증된 강의 복습</h3>{reviewLinks(reviews)}</>}
        <details className="b21ce-source"><summary>원본 장면과 연결 보류 안내</summary><p>원본 sceneIds는 v2 번호입니다. 03a·03b를 v3 Scene 03으로 자동 변환하지 않습니다. 검증된 복습 링크만 위에 표시합니다.</p>{node&&<p>원본 장면: {node.sceneIds.join(' · ')}</p>}<p>관계 자체는 원본 그대로 표시하며, v3 복습 목적지가 확인되지 않은 관계·비교는 연결 보류입니다.</p></details>
      </aside>
    </div>}
    <section className="b21ce-card b21ce-comparisons" aria-label="전체 비교 카드"><h2>헷갈리는 개념, 두 칸으로 비교하기</h2><p>비교 10개를 그대로 보존했습니다. 그래프에 비교 관계선을 추가하지 않습니다.</p><label>비교할 짝 <select aria-label="비교할 짝" value={s.comparison??''} onChange={e=>{if(e.target.value)selectComparison(e.target.value);}}><option value="">비교 카드 선택</option>{data.comparisons.map(c=><option key={c.id} value={c.id}>{c.id} · {nodeById.get(c.left)!.label} / {nodeById.get(c.right)!.label}</option>)}</select></label></section>
    <footer className="b21ce-footer">개념 3개·관계 2개·비교 1개를 골라 내 코드의 근거와 함께 설명해 보세요. 근거가 부족하면 미확인으로 남깁니다.</footer>
  </main>;
}
