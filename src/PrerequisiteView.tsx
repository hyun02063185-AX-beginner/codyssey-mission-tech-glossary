import { Link, useNavigate, useParams } from 'react-router-dom';
import { graph, highlightTerms, label, learnFirst, membership, node, pathsThrough, subLabel, termHref, unlocks } from './encyclopedia';
import type { GraphEdge } from './encyclopedia';

const relationLabel: Record<string, string> = { prerequisite: '먼저 알아야 함', based_on: '이 개념 위에서 성립', is_a: '의 한 종류', cs_foundation: 'CS 기본 원리' };
const kindLabel: Record<string, string> = { term: '용어', foundation: '연결 개념', academic: '학문', mission: '미션', field: '기술 분야' };
const starting = ['term:redis', 'term:fastapi', 'term:deadlock', 'term:json-web-token', 'term:database-index', 'term:recursion'];

function NodeChip({ id, reason, via }: { id: string; reason?: GraphEdge; via?: string }) {
  const href = termHref(id);
  const why = reason ? `${via ? `${label(via)}: ` : ''}${reason.reason}` : '';
  const body = <><b>{label(id)}</b>{subLabel(id) && <span>{subLabel(id)}</span>}{reason && <small>{why}</small>}</>;
  return href ? <Link className="pre-chip" to={href}>{body}</Link> : <div className="pre-chip is-static">{body}<small className="pre-chip-kind">{kindLabel[node(id)?.kind ?? ''] ?? ''}</small></div>;
}

export function PrerequisiteIndex() {
  const withPrereq = Object.values(graph.nodes).filter(x => x.kind === 'term' && (graph.indexes.learnFirst[x.id]?.length ?? 0) > 0);
  return <section className="pre-page"><p className="eyebrow">Knowledge Encyclopedia</p><h1>선수학습 지도</h1>
    <p className="pre-intro">용어 하나를 고르면 <b>그걸 배우기 전에 무엇을 알면 좋은지</b>를 순서대로 보여 줍니다. 단순히 관련 있는 용어를 늘어놓지 않고, 학습 순서를 말해 주는 관계만 따라갑니다.</p>
    <h2>이런 용어부터 열어 보세요</h2>
    <div className="grid">{starting.filter(id => node(id)).map(id => <Link className="card" key={id} to={`/prerequisites/${node(id)?.termId}`}><b>{label(id)}</b><span>{subLabel(id)}</span><small>먼저 볼 개념 {learnFirst(id).total}개</small></Link>)}</div>
    <h2>선수학습 정보가 있는 용어 <small>{withPrereq.length}개</small></h2>
    <div className="pre-chip-list">{withPrereq.sort((a, b) => label(a.id).localeCompare(label(b.id), 'ko')).map(x => <Link className="pre-chip" key={x.id} to={`/prerequisites/${x.termId}`}><b>{label(x.id)}</b><span>{subLabel(x.id)}</span></Link>)}</div>
    <p className="notice">아직 선수학습 관계가 없는 용어가 더 많습니다. 관계는 학습 cluster 단위로 하나씩 추가되며, 근거 없는 연결은 넣지 않습니다.</p>
  </section>;
}

export default function PrerequisiteView() {
  const { termId = '' } = useParams();
  const nav = useNavigate();
  const id = `term:${termId}`;
  const current = node(id);
  if (!current) return <section><h1>안내</h1><p className="notice">선수학습을 볼 수 없는 용어입니다.</p><Link to="/prerequisites">선수학습 지도로 이동</Link></section>;
  const { layers, total, edgeFor } = learnFirst(id);
  const next = unlocks(id);
  const paths = pathsThrough(id);
  const place = membership(id);
  const ordered = [...layers].reverse();
  return <section className="pre-page"><p className="eyebrow">선수학습 · {kindLabel[current.kind]}</p>
    <h1>{label(id)}</h1><p>{subLabel(id)}</p>
    <div className="pre-actions"><Link className="term-map-entry" to={`/terms/${termId}`}>용어 설명 보기 <span>정의와 미션 맥락</span></Link>
      <label className="pre-switch">다른 용어 보기
        <select value={termId} onChange={e => nav(`/prerequisites/${e.target.value}`)}>
          {Object.values(graph.nodes).filter(x => x.kind === 'term' && (graph.indexes.learnFirst[x.id]?.length ?? 0) > 0).sort((a, b) => label(a.id).localeCompare(label(b.id), 'ko')).map(x => <option key={x.id} value={x.termId}>{label(x.id)}</option>)}
        </select></label></div>

    {total === 0
      ? <p className="notice">이 용어에는 아직 선수학습 관계가 등록되지 않았습니다. 관련 용어만으로 학습 순서를 지어내지 않습니다.</p>
      : <div className="pre-ladder">
        <section className="pre-step"><h2>먼저 알아보기 <small>{total}개</small></h2>
          <p className="pre-note">&ldquo;이걸 알아야 저게 설명된다&rdquo;는 관계만 따라갑니다. 단순히 관련 있는 용어는 넣지 않습니다. 아래 학습 경로에는 실제 사용 순서까지 포함되어 단계가 더 많을 수 있습니다.</p>
          {ordered.map(layer => <div className="pre-layer" key={layer.depth}>
            <span className="pre-depth">{layer.depth}단계 앞</span>
            <div className="pre-chip-list">{layer.entries.map(entry => <NodeChip key={entry.id} id={entry.id} reason={entry.edge} via={entry.from} />)}</div>
          </div>)}
        </section>
        <section className="pre-step is-current"><h2>지금 보는 개념</h2><div className="pre-current"><b>{label(id)}</b>{current.hasDetail && <small>자세한 설명이 있는 용어</small>}</div></section>
      </div>}

    {next.length > 0 && <section className="pre-step"><h2>다음으로 연결되는 개념 <small>{next.length}개</small></h2>
      <div className="pre-chip-list">{next.map(target => <NodeChip key={target} id={target} reason={edgeFor(target, id)} />)}</div></section>}

    {paths.length > 0 && <section className="pre-paths"><h2>이 개념이 들어 있는 학습 경로</h2>
      {paths.map(path => <article className="pre-path" key={path.id}><h3>{path.label}</h3>
        <ol className="pre-path-steps">{path.steps.map(step => <li key={step} className={step === id ? 'is-current' : undefined}>{termHref(step) ? <Link to={termHref(step) as string}>{label(step)}</Link> : label(step)}</li>)}</ol>
        <p className="pre-path-why">{path.why}</p></article>)}</section>}

    <section className="pre-context"><h2>이 개념의 자리</h2>
      <dl className="pre-facts">
        {place.academic && <div><dt>학문</dt><dd><Link to={`/academic/${place.academic}`}>{label(`academic:${place.academic}`)}</Link>{place.academicOrigin === 'override' && <small> · 기본 분류를 사람이 조정함</small>}</dd></div>}
        {place.field && <div><dt>기술 분야</dt><dd>{label(`field:${place.field}`)}</dd></div>}
        {place.missions.length > 0 && <div><dt>등장 미션</dt><dd className="pre-chip-list">{place.missions.map(m => { const mission = node(`mission:${m}`); return mission ? <Link className="pre-chip" key={m} to={`/missions/${mission.aliases?.route}`}><b>{mission.titleKo}</b><span>{mission.course === 'main' ? '본과정' : '예비'} {m.split('-')[1]?.toUpperCase()}</span></Link> : null; })}</dd></div>}
      </dl>
      {place.academicReason && <p className="pre-note">{place.academicReason}</p>}
    </section>

    <section className="pre-step"><h2>같은 학문의 다른 개념</h2>
      <div className="pre-chip-list">{highlightTerms(graph.indexes.byAcademic[place.academic ?? '']?.primary ?? [], 10).filter(x => x !== id).map(x => <NodeChip key={x} id={x} />)}</div></section>
  </section>;
}
