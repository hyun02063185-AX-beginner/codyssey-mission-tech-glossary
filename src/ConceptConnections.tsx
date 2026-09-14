import { Link, useParams } from 'react-router-dom';
import connectionSource from './data/generated/concept-connections.json';
import glossarySource from './data/generated/glossary.json';

type Ref = { course: string; mission: string; source_status: 'direct' | 'required' | 'related'; context: string };
type Term = { id: string; termKo: string; termEn: string; missionRefs: Ref[] };
type DiagramNode = { id: string; termId?: string; label?: string };
type Connection = {
  id: string; status: 'PUBLISHED'; title: string; type: string; question: string; summary: string; terms: string[];
  diagram: { nodes: DiagramNode[]; edges: Array<{ from: string; to: string; label: string }> };
  sections: Array<{ heading: string; body: string }>; misconceptions: string[]; missionLinks: Array<{ missionId: string; note: string }>;
};

const connections = (connectionSource as { connections: Connection[] }).connections;
const terms = glossarySource as Term[];
const termById = new Map(terms.map(term => [term.id, term]));
const missionLabel = (missionId: string) => missionId.replace('main-', '본과정 ').replace('preliminary-', '예비 ').replace(/m(\d+)/, (_, value) => `M${value}`);
const statusLabel: Record<Ref['source_status'], string> = { direct: '직접 등장', required: '수행에 필요', related: '더 깊게 보기' };

function ConnectionTerms({ ids }: { ids: string[] }) {
  return <div className="connection-term-list">{ids.map(id => {
    const term = termById.get(id);
    return term ? <Link key={id} to={`/terms/${id}`}>{term.termKo}<small>{term.termEn}</small></Link> : null;
  })}</div>;
}

function ConnectionDiagram({ connection }: { connection: Connection }) {
  const nodeById = new Map(connection.diagram.nodes.map(node => [node.id, node]));
  const name = (node: DiagramNode) => node.termId ? termById.get(node.termId)?.termKo ?? node.termId : node.label ?? node.id;
  return <section className="connection-diagram" aria-label={`${connection.title} 관계 그림`}>
    <h2>한눈에 보기</h2>
    <div className="connection-diagram-nodes">{connection.diagram.nodes.map(node => node.termId ? <Link className="connection-diagram-node" to={`/terms/${node.termId}`} key={node.id}>{name(node)}</Link> : <span className="connection-diagram-node" key={node.id}>{name(node)}</span>)}</div>
    <ol className="connection-diagram-edges">{connection.diagram.edges.map((edge, index) => <li key={`${edge.from}-${edge.to}-${index}`}><b>{name(nodeById.get(edge.from)!)}</b><span>{edge.label}</span><b>{name(nodeById.get(edge.to)!)}</b></li>)}</ol>
  </section>;
}

function MissionContext({ connection }: { connection: Connection }) {
  return <section className="connection-missions"><h2>Mission Context</h2>{connection.missionLinks.map(link => {
    const refs = connection.terms.flatMap(termId => (termById.get(termId)?.missionRefs ?? []).filter(ref => `${ref.course}-${ref.mission.toLowerCase()}` === link.missionId).map(ref => ({ termId, ref })));
    return <article key={link.missionId}><h3>{missionLabel(link.missionId)}</h3><p>{link.note}</p>{refs.length > 0 && <ul>{refs.map(({ termId, ref }, index) => <li key={`${termId}-${index}`}><Link to={`/terms/${termId}`}>{termById.get(termId)?.termKo}</Link> · {statusLabel[ref.source_status]} — {ref.context}</li>)}</ul>}</article>;
  })}</section>;
}

export function ConnectionsList() {
  return <section className="connections-page" aria-labelledby="connections-title"><p className="eyebrow">Concept Connection</p><h1 id="connections-title">개념 연결</h1><p className="connections-intro">지도는 기술의 위치를 보여주고, 개념 연결은 왜 함께 등장하는지와 무엇이 다른지를 설명합니다.</p><div className="connections-grid">{connections.map(connection => <Link className="connection-card" key={connection.id} to={`/connections/${connection.id}`}><span>{connection.type}</span><h2>{connection.title}</h2><p>{connection.question}</p><small>{connection.terms.map(id => termById.get(id)?.termKo).filter(Boolean).join(' · ')}</small><b>연결 이해하기 →</b></Link>)}</div></section>;
}

export function ConnectionDetail() {
  const { connectionId = '' } = useParams();
  const connection = connections.find(item => item.id === connectionId);
  if (!connection) return <section><h1>안내</h1><p className="notice">찾으려는 개념 연결이 없습니다.</p><Link to="/connections">개념 연결 목록으로 이동</Link></section>;
  return <article className="connection-detail"><p className="eyebrow">Concept Connection · {connection.type}</p><Link className="connection-back" to="/connections">← 개념 연결 목록</Link><h1>{connection.title}</h1><p className="connection-question">{connection.question}</p><p className="summary">{connection.summary}</p><ConnectionDiagram connection={connection} />{connection.sections.map(section => <section key={section.heading}><h2>{section.heading}</h2><p className="multi">{section.body}</p></section>)}<section><h2>무엇을 혼동하기 쉬운가</h2><ul className="connection-misconceptions">{connection.misconceptions.map(item => <li key={item}>{item}</li>)}</ul></section><section><h2>관련 용어</h2><ConnectionTerms ids={connection.terms} /></section><MissionContext connection={connection} /></article>;
}

export function connectionsForTerm(termId: string): Connection[] { return connections.filter(connection => connection.terms.includes(termId)); }
