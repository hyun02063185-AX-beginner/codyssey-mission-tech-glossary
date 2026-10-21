import { lazy, Suspense, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import glossary from '../data/generated/glossary.json';
import { connectionsForTerm } from '../ConceptConnections';
import { relationTouches } from './conceptMapAdapter';
import { conceptTypeLabel, domainLabel } from './conceptMapTypes';
import type { ConceptMapData, ConceptRelation, MapSelection, ViewId } from './conceptMapTypes';

const TermEncyclopediaLinks = lazy(() => import('../TermEncyclopediaLinks'));
const termById = new Map(glossary.map(term => [term.id, term]));
type Props = { data: ConceptMapData; selection: NonNullable<MapSelection>; view: ViewId;
  onNode: (id: string) => void; onRelation: (id: string) => void; onClose: () => void; onClear: () => void;
  previousNode?: string };

function Scenes({ data, ids }: { data: ConceptMapData; ids: string[] }) {
  return <div className="cm-scenes"><h3>관련 Scene</h3>{ids.map(id => {
    const scene = data.scenes.find(item => item.id === id);
    return <span key={id}>{id.replace('scene-', 'Scene ').toUpperCase()} · {scene?.title}</span>;
  })}<small>장면 이름을 참고해 주세요. 장면 이동은 후속 단계에서 제공됩니다.</small></div>;
}
function Terms({ ids }: { ids: string[] }) {
  const valid = [...new Set(ids)].filter(id => termById.has(id));
  return <div className="cm-term-links"><h3>용어사전</h3>{valid.length ? valid.map(id => <Link className="cm-term-link" key={id} to={`/terms/${id}`}>{termById.get(id)!.termKo} · 상세 사전에서 보기 →</Link>) : <p>연결된 용어사전 항목이 없습니다. 이 지도의 설명을 읽어 주세요.</p>}</div>;
}
function Comparison({ relation }: { relation: ConceptRelation }) {
  const note = relation.comparisonNote;
  return note ? <dl className="cm-comparison"><dt>공통점</dt><dd>{note.same}</dd><dt>차이점</dt><dd>{note.different}</dd><dt>주의할 오해</dt><dd>{note.caution}</dd></dl> : null;
}

export default function ConceptMapDetailPanel({ data, selection, view, onNode, onRelation, onClose, onClear, previousNode }: Props) {
  const panel = useRef<HTMLElement>(null);
  const node = selection.kind === 'node' ? data.nodes.find(item => item.id === selection.id)! : null;
  const relation = selection.kind !== 'node' ? data.relations.find(item => item.id === selection.id)! : null;
  const nodeById = new Map(data.nodes.map(item => [item.id, item]));
  const definition = data.views.find(item => item.id === view)!;
  const connected = node ? data.relations.filter(rel => relationTouches(rel, node.id) && definition.relationScopes.includes(rel.scope)) : [];
  const comparisons = node ? data.relations.filter(rel => rel.scope === 'cross' && relationTouches(rel, node.id)) : [];
  const contrasts = node ? data.contrasts.filter(card => card.nodeIds.includes(node.id)) : [];
  const name = node?.label ?? relation!.label;
  useEffect(() => { panel.current?.scrollTo({ top: 0 }); }, [selection.kind, selection.id]);
  const selectButton = (id: string) => <button type="button" className="cm-link-button" key={id} onClick={() => onNode(id)}>{nodeById.get(id)?.label}</button>;
  const relationButton = (rel: ConceptRelation) => <button type="button" className="cm-relation-button" data-panel-relation={rel.id} key={rel.id} onClick={() => onRelation(rel.id)}>
    <span>{rel.type} · {rel.label}</span><b>{rel.path ? rel.path.map(id => nodeById.get(id)?.label).join(' → ') : `${nodeById.get(rel.from)?.label} → ${nodeById.get(rel.to)?.label}`}</b><small>{rel.description}</small>
  </button>;
  const refs = new Set([...connected.map(rel => rel.id), ...comparisons.map(rel => rel.id), ...contrasts.map(card => card.id)]);
  const learning = data.learningOrder.filter(item => [...item.firstRefs, ...item.thenRefs].some(id => refs.has(id)));
  const relatedConnections = node ? [...new Map(node.termIds.flatMap(id => connectionsForTerm(id)).filter(item => item.id === data.linkPolicy.conceptConnection.id).map(item => [item.id, item])).values()] : [];
  return <aside ref={panel} className="map-detail-panel" aria-labelledby="cm-detail-title" data-detail-panel="open" onKeyDown={event => { if (event.key === 'Escape') onClose(); }}>
    <div className="map-detail-panel-header"><p className="map-panel-status">{node ? '선택한 개념' : relation!.path ? '통신 흐름' : '선택한 관계'}</p><button type="button" className="map-detail-close" aria-label="상세 패널 닫기" onClick={onClose}>닫기</button></div>
    {relation && previousNode && <button type="button" className="cm-link-button" onClick={() => onNode(previousNode)}>← {nodeById.get(previousNode)?.label}로 돌아가기</button>}
    <h2 id="cm-detail-title">{name}</h2>
    {node ? <>
      <p className="cm-badge">{domainLabel[node.domain]} · {conceptTypeLabel[node.conceptType] ?? node.conceptType}{node.implementationStatus === 'general-example' ? ' · 설명용 예시' : node.implementationStatus === 'b31-deployed' ? ' · 2026-10-14 기록' : ''}</p>
      <p className="map-detail-summary">{node.summary}</p>
      <details className="cm-section"><summary>자세한 설명</summary><p>{node.description}</p></details>
      {node.b31Note && <details className="cm-callout"><summary>B3-1에서는</summary><p>{node.b31Note}</p></details>}
      {(comparisons.length > 0 || contrasts.length > 0) && <div className="cm-section"><h3>관련 기술 비교</h3>
        {comparisons.map(rel => <details key={rel.id}><summary>{rel.label} · {nodeById.get(rel.from === node.id ? rel.to : rel.from)?.label}</summary><Comparison relation={rel} />{relationButton(rel)}{selectButton(rel.from === node.id ? rel.to : rel.from)}</details>)}
        {contrasts.map(card => <details className="cm-contrast-card" key={card.id} data-contrast={card.id}><summary>{card.title}</summary><p>{card.explanation}</p><p className="cm-callout">{card.noLineReason}</p>{card.nodeIds.filter(id => id !== node.id).map(selectButton)}</details>)}
      </div>}
      <div className="cm-section"><h3>연결 관계 · 왜 연결될까요?</h3>{(['포함', '역할', '흐름', '연관', '대응'] as const).map(type => {
        const items = connected.filter(rel => rel.type === type);
        return items.length > 0 ? <details key={type} open={type === '역할' || connected.length <= 4}><summary>{type} · {items.length}</summary>{items.map(relationButton)}</details> : null;
      })}</div>
      {learning.length > 0 && <details className="cm-section"><summary>함께 보면 좋은 순서</summary>{learning.map(item => <p key={item.id}>{item.first} → {item.then}</p>)}</details>}
      <Scenes data={data} ids={node.storyScenes} /><Terms ids={[...node.termIds, ...(node.relatedTermIds ?? [])].filter(id => !data.linkPolicy.doNotAutoLink.includes(id))} />
      {relatedConnections.map(connection => <Link className="cm-term-link" key={connection.id} to={`/connections/${connection.id}`}>관련 개념 연결 · {connection.title} →</Link>)}
      {node.termIds[0] && <details className="cm-section"><summary>학습 지도에서 이어 보기</summary><Suspense fallback={<p>학습 정보를 불러오는 중입니다.</p>}><TermEncyclopediaLinks termId={node.termIds[0]} compact /></Suspense></details>}
    </> : <>
      <p className="cm-badge">{relation!.type} · {data.views.find(item => item.id === relation!.scope)?.label ?? (relation!.scope === 'cross' ? '일반망 ↔ AWS 비교' : '공통 관계')}</p>
      <div className="cm-endpoints">{selectButton(relation!.from)}<span>→</span>{selectButton(relation!.to)}</div>
      <h3>연결 이유</h3><p className="map-detail-summary">{relation!.description}</p>
      <Comparison relation={relation!} />
      {relation!.perSystem && <dl className="cm-comparison">{Object.entries(relation!.perSystem).map(([system, text]) => <div key={system}><dt>{system === 'general' ? '일반망 예시' : 'B3-1 AWS'}</dt><dd>{text}</dd></div>)}</dl>}
      {relation!.path && <div className="cm-section"><h3>실제 경유 순서</h3><ol className="cm-flow-steps">{relation!.path.map((id, index) => <li key={id}><b>{index === 0 ? '출발' : relation!.pathStepIds?.[index - 1]}</b>{selectButton(id)}</li>)}</ol>
        {relation!.scope === 'aws' && <div className="cm-callout"><h3>이 길을 가능하게 한 설정</h3><p>설정은 패킷이 통과하는 장비가 아닙니다.</p>{data.relations.filter(rel => {
          const source = nodeById.get(rel.from);
          return source?.conceptType === 'aws-setting' && relation!.path!.includes(rel.to);
        }).map(relationButton)}</div>}
      </div>}
      <details className="cm-section" open><summary>기술적 근거</summary><ul>{relation!.source.map(id => {
        const source = data.sources.find(item => item.id === id);
        return <li key={id}>{source?.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a> : source?.label ?? id}</li>;
      })}</ul></details>
      <Scenes data={data} ids={relation!.storyScenes} /><Terms ids={relation!.relatedTermIds ?? []} />
    </>}
    <button type="button" className="cm-clear" onClick={onClear}>선택 해제</button>
  </aside>;
}
