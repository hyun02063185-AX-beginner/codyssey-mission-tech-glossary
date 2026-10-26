import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import {b61StoryPath} from '../b61Story/content';
import {screenHref,b61ReturnKey} from '../b61Story/navigation';
import {b61GuideChapters,b61GuidePath} from '../b61GuideContent';
import glossary from '../data/generated/glossary.json';
import {data,nodeById} from './adapter';
import {conceptPath,learningHref,readConceptState} from './navigation';
import ConceptCanvas from './ConceptCanvas';
import './conceptMap.css';

export default function B61ConceptMap(){
 const location=useLocation(),navigate=useNavigate(),state=readConceptState(location.search);
 const [notice,setNotice]=useState(state.notice),[panel,setPanel]=useState(Boolean(state.node||state.relation)),[full,setFull]=useState(false),[openSequence,setOpenSequence]=useState(0);
 const heading=useRef<HTMLHeadingElement>(null),toggle=useRef<HTMLButtonElement>(null),body=useRef<HTMLDivElement>(null),savedPanel=useRef(false);
 const current=state.node?nodeById.get(state.node):null,relation=data.relations.find(r=>r.id===state.relation);
 const links=data.relations.filter(r=>relation?r.id===relation.id:current&&(r.from===current.id||r.to===current.id));
 const story=state.origin?b61StoryPath+'?'+state.origin:b61StoryPath;
 const select=(kind:'node'|'relation',id:string)=>{const p=new URLSearchParams({[kind]:id});if(state.origin)p.set(b61ReturnKey,state.origin);navigate(conceptPath+'?'+p);setPanel(true);setOpenSequence(s=>s+1);};
 const close=()=>{setPanel(false);requestAnimationFrame(()=>toggle.current?.focus());};
 const expand=()=>{if(!full){savedPanel.current=panel;setPanel(false);}else setPanel(savedPanel.current);setFull(!full);};
 useEffect(()=>{if(state.notice)setNotice(state.notice);if(location.pathname+location.search!==state.canonical)navigate(state.canonical,{replace:true});},[state.canonical,state.notice,location.pathname,location.search,navigate]);
 useEffect(()=>{if(state.node||state.relation){setPanel(true);setOpenSequence(s=>s+1);}},[state.node,state.relation]);
 useEffect(()=>{document.title='B6-1 · 데이터베이스 개념지도';return()=>{document.title='코디세이 기술용어 사전';};},[]);
 useLayoutEffect(()=>{if(panel){body.current?.scrollTo(0,0);heading.current?.focus({preventScroll:true});}},[panel,openSequence]);
 useEffect(()=>{const escape=(e:KeyboardEvent)=>{if(e.key!=='Escape'||e.defaultPrevented)return;if(full){expand();}else if(panel)close();};window.addEventListener('keydown',escape);return()=>window.removeEventListener('keydown',escape);},[panel,full]);
 const termLink=(id:string,label?:string)=><Link key={id} to={learningHref('/terms/'+id,state.canonical)}>{label??glossary.find(t=>t.id===id)?.termKo??id} ↗</Link>;
 return <div className={`b61cm${full?' is-full':''}`}>
  <div className="b61cm-nav"><LearningFocusNav compact missionId="main-M11" active="concepts" storyHref={story} conceptHref={state.canonical} guideHref={learningHref(b61GuidePath,state.canonical)}/></div>
  <header className="b61cm-intro"><div><p>B6-1 · CONCEPT MAP</p><h1>데이터베이스, 개념을 잇다</h1></div><span>11개 개념 · 12개 관계</span></header>
  {notice&&<div className="b61cm-notice" role="status">{notice}<button onClick={()=>setNotice('')}>안내 닫기</button></div>}
  <div className="b61cm-tools"><label>개념 찾기 <select aria-label="개념 찾기" value={state.node??''} onChange={e=>e.target.value&&select('node',e.target.value)}><option value="">개념 선택</option>{data.nodes.map(n=><option key={n.id} value={n.id}>{n.label}</option>)}</select></label><button ref={toggle} disabled={!current&&!relation} onClick={()=>{setPanel(!panel);setOpenSequence(s=>s+1);}} aria-expanded={panel}>설명 {panel?'닫기':'열기'}</button><Link className="b61cm-story" to={story}>← 스토리{state.origin?'로 복귀':''}</Link></div>
  <div className="b61cm-workspace">
   <ConceptCanvas node={state.node} relation={state.relation} onNode={id=>select('node',id)} onRelation={id=>select('relation',id)} full={full} onFull={expand}/>
   {panel&&(current||relation)&&<aside className="mission-detail-panel" aria-label="개념 설명"><div className="mission-detail-header"><strong>{current?'개념 살펴보기':'관계 살펴보기'}</strong><button className="mission-detail-close" aria-label="상세 패널 닫기" onClick={close}>닫기</button></div><div ref={body} className="mission-detail-body">
    <p className="b61cm-eyebrow">{current?data.areas.find(a=>a.id===current.area)!.label:relation!.type}</p><h2 ref={heading} tabIndex={-1}>{current?current.label:relation!.label}</h2><p>{current?current.easy:relation!.description}</p>
    {current&&<><h3>연결 관계 <span>{links.length}</span></h3><div className="b61cm-connections">{links.map(r=><button key={r.id} onClick={()=>select('relation',r.id)}><span>{nodeById.get(r.from)!.label} → {nodeById.get(r.to)!.label}</span><b>{r.label}</b><small>{r.type} · {r.description}</small></button>)}</div></>}
    {relation&&<div className="b61cm-endpoints">{[relation.from,relation.to].map(id=><button key={id} onClick={()=>select('node',id)}>{nodeById.get(id)!.label} 보기</button>)}</div>}
    {current&&<>{data.comparisons.filter(c=>c.nodes.includes(current.id)).map(c=><div className="b61cm-comparison" key={c.id}><h3>{c.title}</h3><p>{c.description}</p></div>)}<h3>더 알아보기</h3>
     {current.glossary.mode==='extension'&&<p className="b61cm-extension">{current.label}은 {current.id==='relationship'?'일대다 관계':'테이블'} 항목에서 이어서 설명합니다.</p>}
     <div className="b61cm-links">{current.glossary.termId&&termLink(current.glossary.termId,'용어사전에서 보기')}{current.related.map(id=>termLink(id,current.id==='dbms'?'SQLite · B6-1이 쓴 DBMS':undefined))}<Link to={screenHref(current.screen)}>스토리 S{String(Math.floor(current.screen/3)+1).padStart(2,'0')}-{current.screen%3+1} 보기 →</Link><Link to={learningHref(`${b61GuidePath}/${b61GuideChapters[current.chapter-1].id}`,state.canonical)}>학습가이드 {current.chapter}장 →</Link></div>
    </>}
   </div></aside>}
  </div>
  <footer className="b61cm-footer"><span><i/> 핵심 7 <i className="is-supporting"/> 보충 5</span><p>포함 · 역할의 관계이며, SQL 실행 순서가 아닙니다.</p></footer>
 </div>;
}
