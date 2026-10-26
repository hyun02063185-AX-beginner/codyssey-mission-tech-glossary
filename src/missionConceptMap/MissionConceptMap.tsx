import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import source from '../../data/mission-story-maps/main-m05/concept-map.json';
import glossary from '../data/generated/glossary.json';
import ConceptMapCanvas from './ConceptMapCanvas';
import type { CanvasControls } from './ConceptMapCanvas';
import ConceptMapDetailPanel from './ConceptMapDetailPanel';
import { adaptConceptMap, changeView, readMapState, stateParams } from './conceptMapAdapter';
import { domainLabel } from './conceptMapTypes';
import type { ConceptMapData, MapState, ViewId } from './conceptMapTypes';
import './missionConceptMap.css';
import { conceptHref, storyHref, storyScene } from '../b31StoryNavigation';

import LearningFocusNav from '../missionUI/LearningFocusNav';

const data = source as ConceptMapData;
const nodeById = new Map(data.nodes.map(node => [node.id, node]));
const termNames = new Map(glossary.map(term => [term.id, `${term.termKo} ${term.termEn} ${term.aliases.join(' ')}`]));

export default function MissionConceptMap() {
  const [params, setParams] = useSearchParams();
  const originScene = storyScene(params.get('scene'));
  const parsed = useMemo(() => readMapState(data, params), [params]);
  // Controls update immediately; URL navigation may commit in a React transition.
  const [state, setState] = useState<MapState>(parsed.state);
  const graph = useMemo(() => adaptConceptMap(data, state), [state]);
  const controls = useRef<CanvasControls>(null);
  const focusButton = useRef<HTMLButtonElement>(null), savedDetail = useRef(false);
  function toggleFocus() {
    if (!focused) { savedDetail.current = detailOpen; setDetailOpen(false); }
    else setDetailOpen(savedDetail.current);
    setFocused(value => !value); setToolsOpen(false);
    requestAnimationFrame(() => focusButton.current?.focus({preventScroll:true}));
  }
  function closeDetail() { setDetailOpen(false); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.cm-detail-trigger')?.focus({preventScroll:true})); }
  const [toolsOpen, setToolsOpen] = useState(false), [focused, setFocused] = useState(false);
  const [search, setSearch] = useState(''), [detailOpen, setDetailOpen] = useState(Boolean(state.selection));
  const [focusRequest, setFocusRequest] = useState(0), [previousNode, setPreviousNode] = useState<string>();
  const [transition, setTransition] = useState<{ notice: string; counterpart?: string }>({ notice: '' });
  const [inputNotices, setInputNotices] = useState<string[]>(parsed.notices);
  const selectionKey = `${state.selection?.kind}:${state.selection?.id}`;
  useEffect(() => {
    // A quick Back can cancel React Router's pending transition before params
    // change in React. Always reconcile the optimistic selection on browser POP.
    const restore = () => {
      const next = readMapState(data, new URLSearchParams(window.location.hash.split('?')[1] ?? ''));
      setState(next.state); setDetailOpen(Boolean(next.state.selection));
      if (next.notices.length) setInputNotices(next.notices);
    };
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    return () => { window.removeEventListener('popstate', restore); window.removeEventListener('hashchange', restore); };
  }, []);
  useEffect(() => {
    setState(parsed.state);
    setDetailOpen(Boolean(parsed.state.selection));
    if (parsed.notices.length) setInputNotices(parsed.notices);
    const canonical = navigationParams(parsed.state);
    if (canonical.toString() !== params.toString()) setParams(canonical, { replace: true });
  }, [params]);
  function navigationParams(next: MapState) {
    const result = stateParams(next);
    if (originScene) result.set('scene', originScene);
    return result;
  }
  function update(next: MapState) { setState(next); setInputNotices([]); setParams(navigationParams(next)); }
  function selectNode(id: string, focus = false) {
    const node = nodeById.get(id)!;
    const definition = data.views.find(view => view.id === state.view)!;
    update({ ...state, view: definition.nodeDomains.includes(node.domain) ? state.view : 'all', selection: { kind: 'node', id } });
    setDetailOpen(true); setToolsOpen(false); setTransition({ notice: '' });
    if (focus) setFocusRequest(value => value + 1);
    if (focus && window.matchMedia('(max-width:700px)').matches) requestAnimationFrame(() => document.querySelector('.mission-concept-map .map-workspace')?.scrollIntoView({ block: 'start' }));
  }
  function selectRelation(id: string, flow = false) {
    const rel = data.relations.find(item => item.id === id)!;
    if (state.selection?.kind === 'node') setPreviousNode(state.selection.id);
    const definition = data.views.find(view => view.id === state.view)!;
    const selection = flow && state.selection?.kind === 'flow' && state.selection.id === id ? null : { kind: flow ? 'flow' as const : 'rel' as const, id };
    update({ ...state, view: definition.relationScopes.includes(rel.scope) ? state.view : 'all', selection });
    setDetailOpen(Boolean(selection)); setToolsOpen(false); setTransition({ notice: '' });
  }
  function switchView(view: ViewId) {
    const result = changeView(data, state, view);
    update(result.state); setTransition(result); setToolsOpen(false);
  }
  function clear() { update({ ...state, selection: null }); setDetailOpen(false); }
  const query = search.trim().toLocaleLowerCase();
  const results = query ? data.nodes.filter(node => `${node.label} ${node.summary} ${node.termIds.map(id => termNames.get(id)).join(' ')}`.toLocaleLowerCase().includes(query)).slice(0, 8) : [];
  const activeName = state.selection?.kind === 'node' ? nodeById.get(state.selection.id)?.label : data.relations.find(rel => rel.id === state.selection?.id)?.label;
  const selectedFlow = state.selection && state.selection.kind !== 'node' ? data.relations.find(rel => rel.id === state.selection!.id && rel.path) : undefined;
  const activeTools = [
    ...(selectedFlow ? [`${selectedFlow.scope === 'aws' ? 'AWS' : '일반망'} ${selectedFlow.label} ${selectedFlow.pathStepIds?.[0]}~${selectedFlow.pathStepIds?.at(-1)}`] : []),
    ...(state.more && state.view === 'all' ? ['보충 개념 켜짐'] : []),
    ...(query ? [`검색: ${search}`] : []),
  ];
  useEffect(() => {
    if (!focused) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || (event.target as Element).closest('.map-detail-panel')) return;
      if (toolsOpen) setToolsOpen(false); else toggleFocus();
    };
    window.addEventListener('keydown', escape);
    return () => window.removeEventListener('keydown', escape);
  }, [focused, toolsOpen, detailOpen]);
  return <section className={`knowledge-map-page mission-concept-map ${focused ? 'is-focused' : ''}`} aria-labelledby="cm-title">
    <div className="map-intro"><LearningFocusNav missionId="main-m05" active="concepts" conceptHref={conceptHref(navigationParams(state).toString())} storyHref={storyHref(originScene??'scene-01',navigationParams(state).toString())}/><h1 id="cm-title" className="cm-sr-only">B3-1 개념지도</h1><button ref={focusButton} type="button" className="cm-focus-toggle" aria-pressed={focused} onClick={toggleFocus}>{focused ? '일반 보기로 돌아가기' : '지도 크게 보기'}</button></div>
    {(inputNotices.length > 0 || transition.notice) && <div className="cm-notice" role="status">{inputNotices.map((notice, index) => <p key={index}>{notice}</p>)}{transition.notice && <p>{transition.notice}</p>}{transition.counterpart && <button type="button" className="cm-link-button" onClick={() => selectNode(transition.counterpart!, true)}>비슷한 역할: {nodeById.get(transition.counterpart)?.label} →</button>}</div>}
    <div className="map-stage">
      <div className="map-stage-toolbar cm-toolbar">
        <div className="cm-primary">
          <div className="cm-views" role="group" aria-label="개념지도 보기">{data.views.map(view => <button type="button" aria-pressed={state.view === view.id} className={state.view === view.id ? 'is-active' : ''} key={view.id} onClick={() => switchView(view.id)}>{view.label}</button>)}</div>
          <div className="map-zoom" aria-label="지도 확대와 축소"><button type="button" aria-label="지도 축소" onClick={() => controls.current?.zoom(1 / 1.2)}>−</button><button type="button" aria-label="지도 확대" onClick={() => controls.current?.zoom(1.2)}>+</button><button type="button" className="map-view-mode" onClick={() => controls.current?.read()}>읽기 크기</button><button type="button" className="map-view-mode" onClick={() => controls.current?.fit()}>전체 보기</button></div>
          <button type="button" className="cm-detail-trigger" disabled={!state.selection} title={activeName ?? '개념을 먼저 선택해 주세요'} aria-label={state.selection && !detailOpen ? `설명 다시 열기 · ${activeName}` : `선택한 개념 설명${activeName ? ` · ${activeName}` : ''}`} onClick={() => setDetailOpen(true)}><span className="cm-desktop-label">개념 </span>설명</button>
          <button type="button" className="cm-explore-toggle" aria-expanded={toolsOpen} aria-controls="cm-explore-tools" aria-label={toolsOpen ? '탐색 도구 접기' : '탐색 도구 펼치기'} onClick={() => setToolsOpen(value => !value)}>탐색 도구 {toolsOpen ? '▴' : '▾'}{activeTools.length > 0 && <b className="cm-tool-count">{activeTools.length}</b>}</button>
        </div>
        {activeTools.length > 0 && <p className="cm-active-tools" aria-live="polite">{activeTools.join(' · ')}</p>}
        <div id="cm-explore-tools" className="cm-auxiliary" hidden={!toolsOpen}>
          <div className="cm-aux-heading"><b>탐색 도구</b><span className="cm-count" aria-live="polite">개념 {graph.nodes.length} · 관계 {graph.relations.length}</span><button type="button" aria-label="탐색 도구 닫기" onClick={() => setToolsOpen(false)}>닫기</button></div>
          <div className="map-route-chips" aria-label="통신 흐름">{graph.flows.map(flow => <button type="button" key={flow.id} aria-pressed={state.selection?.kind === 'flow' && state.selection.id === flow.id} className={state.selection?.id === flow.id ? 'is-active' : ''} onClick={() => selectRelation(flow.id, true)}>{flow.scope === 'aws' ? 'AWS B3-1' : '일반망'} {flow.label} <small>{flow.pathStepIds?.[0]}~{flow.pathStepIds?.at(-1)}</small></button>)}</div>
          <div className="cm-tools"><div className="cm-search"><label htmlFor="cm-search">지도에서 찾기</label><input id="cm-search" type="search" value={search} placeholder="방화벽, NAT, Security Group…" onChange={event => setSearch(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') setSearch(''); }} />
            {query && <div className="cm-search-results" aria-label="개념 검색 결과">{results.length ? results.map(node => <button type="button" key={node.id} onClick={() => { selectNode(node.id, true); setSearch(''); }}>{node.label}<small>{domainLabel[node.domain]}</small></button>) : <p>일치하는 개념이 없습니다.</p>}</div>}
          </div>{state.view === 'all' && <label className="cm-more"><input type="checkbox" checked={state.more} onChange={event => update({ ...state, more: event.target.checked })} />보충 개념 함께 보기</label>}
            <button type="button" className="cm-list-toggle" aria-controls="cm-node-list" onClick={() => { const list = document.getElementById('cm-node-list') as HTMLDetailsElement; list.open = !list.open; if (list.open) list.querySelector('button')?.focus(); }}>목록으로 보기</button>
          </div>
          <details id="cm-node-list" className="cm-node-list"><summary>목록에서 개념 선택 · {graph.nodes.length}개</summary><div>{graph.regions.map(region => <div key={region.id}><h3>{region.label}</h3>{graph.nodes.filter(node => node.region === region.id).map(node => <button type="button" key={node.id} onClick={() => { (document.getElementById('cm-node-list') as HTMLDetailsElement).open = false; selectNode(node.id, true); }} aria-pressed={state.selection?.kind === 'node' && state.selection.id === node.id}><b>{node.label}</b><small>{node.summary}</small></button>)}</div>)}</div></details>
          <div className="cm-region-nav" aria-label="영역으로 이동">{graph.regions.map(region => <button type="button" key={region.id} onClick={() => { controls.current?.region(region.id); setToolsOpen(false); }}>{region.label}</button>)}</div>
          <button type="button" className="cm-reset" onClick={() => { update({ view: 'all', more: false, selection: null }); setSearch(''); setTransition({ notice: '' }); setToolsOpen(false); controls.current?.fit(); }}>전체 지도 보기</button>
        </div>
      </div>
      <div className="cm-explore-body"><div className="map-workspace">
        <ConceptMapCanvas ref={controls} graph={graph} selection={state.selection} frameKey={`${state.view}:${state.more}:${state.selection?.kind !== 'node' ? state.selection?.id ?? '' : ''}`} focusRequest={focusRequest} detailOpen={detailOpen} onNode={selectNode} onRelation={selectRelation} />
        {state.selection && detailOpen && <ConceptMapDetailPanel key={selectionKey} data={data} selection={state.selection} view={state.view} previousNode={previousNode} onNode={id => selectNode(id, true)} onRelation={selectRelation} onClose={closeDetail} onClear={clear} />}
      </div></div>
      <div className="cm-under-map"><span className="cm-brief-help">끌어서 이동 · 개념을 선택해 관계 탐색</span><details className="cm-guide"><summary>사용법·관계 범례</summary><p>일반망의 역할은 AWS에서 어떻게 구현될까요? 개념을 선택해 연결 이유와 차이를 읽어 보세요.</p><p>글자가 작으면 <b>읽기 크기</b> · Tab과 Enter로 선택{graph.temporary.length > 0 ? ` · 선택에 필요한 보충 개념 ${graph.temporary.length}개를 임시 표시 중` : ''}</p><div className="cm-legend" aria-label="관계 범례"><span>─ 포함</span><span>→ 역할</span><span className="cm-request">→ 요청</span><span className="cm-response">⇢ 응답</span><span className="cm-cross">◇ ≈ 대응</span><span>┄ 연관</span><p>선은 관계이며 통신이 허용된다는 뜻이 아닙니다. ≈는 비슷한 역할일 뿐 같은 장비·서비스가 아닙니다.</p></div></details></div>
    </div>
    <span className="cm-sr-only" role="status">{activeName ? `${activeName} 선택됨. 설명 패널에서 자세히 확인할 수 있습니다.` : '선택한 개념 없음'}</span>
  </section>;
}
