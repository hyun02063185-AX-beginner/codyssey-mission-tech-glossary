import { Link, useParams } from 'react-router-dom';
import { coverage, graph, highlightTerms, label, node, roles } from './encyclopedia';
import { learnerAcademic, learnerMission, learnerRole, learnerTerm } from './learnerView';

/**
 * Role View — "이 기술은 실제 어느 역할에서 주로 다루는가".
 * Roles are not graph nodes: everything here is computed from roles.json weights plus
 * field/academic membership. Coverage is shown honestly so a thin role does not look full.
 *
 * coverageState 같은 내부 값은 learnerView 에서 문장으로 바뀐 뒤에만 이 파일에 들어온다.
 */
export function RoleIndex() {
  const rows = roles().map(row => learnerRole(row.id, row))
    .sort((a, b) => (a.open === b.open ? b.termCount - a.termCount : a.open ? -1 : 1));
  return <section className="role-page"><p className="eyebrow">Knowledge Encyclopedia</p><h1>직무 지도</h1>
    <p className="role-intro">취업 직무 안내가 아닙니다. 사전에 담긴 기술이 <b>실제로 어느 역할에서 주로 다뤄지는지</b>를 보여 줍니다. 모든 수치는 <b>현재 사전에 연결된 범위 기준</b>입니다.</p>
    <div className="grid">{rows.map(view => <Link className={`card role-card is-${view.stateKey}`} key={view.key} to={view.href}>
      <b>{view.title}</b><span>{view.subtitle}</span>
      <small className={`role-state is-${view.stateKey}`}>{view.scopeLabel}</small>
      <small>주요 분야 용어 {view.coreFieldTermCount}개</small></Link>)}</div>
  </section>;
}

export default function RoleView() {
  const { roleId = '' } = useParams();
  const row = graph.indexes.byRole[roleId];
  if (!row) return <section><h1>안내</h1><p className="notice">존재하지 않는 직무입니다.</p><Link to="/roles">직무 지도로 이동</Link></section>;
  const view = learnerRole(roleId, row);
  const report = coverage({ role: roleId });
  const coreFields = row.fields.filter(f => f.weight === 'core');
  const supportFields = row.fields.filter(f => f.weight !== 'core');
  const terms = highlightTerms([...new Set(coreFields.flatMap(f => graph.indexes.byField[f.id]?.primary ?? []))], 14).map(learnerTerm);
  const missionRows = [...new Set(terms.flatMap(term => (node(term.key)?.missions ?? []).map(m => m.missionId)))].sort().slice(0, 10).map(learnerMission);
  return <section className="role-page"><p className="eyebrow">직무</p><h1>{view.title}</h1><p>{view.subtitle}</p>
    <p className={`role-state-banner is-${view.stateKey}`}>{view.scopeLabel} · 현재 사전에 연결된 범위 기준</p>
    {view.scopeNote && <p className="notice">{view.scopeNote}</p>}
    {view.intro && <p className="pre-note">{view.intro}</p>}

    <dl className="pre-facts">
      <div><dt>주요 기술 영역</dt><dd>{coreFields.map(f => label(`field:${f.id}`)).join(' · ') || '지정 없음'}</dd></div>
      {supportFields.length > 0 && <div><dt>함께 쓰는 영역</dt><dd>{supportFields.map(f => label(`field:${f.id}`)).join(' · ')}</dd></div>}
      <div><dt>연결된 용어</dt><dd>{report.total}개 <small>핵심 {report.core} · 자세한 설명 {report.withDetail}</small></dd></div>
    </dl>

    <section><h2>관련 학문</h2>
      <div className="pre-chip-list">{row.academic.map(entry => { const field = learnerAcademic(`academic:${entry.id}`); if (!field) return null;
        return field.open
          ? <Link className="pre-chip" key={field.key} to={field.href as string}><b>{field.title}</b><span>{entry.weight === 'core' ? '중심' : '보조'}</span></Link>
          : <span className="pre-chip is-static" key={field.key}><b>{field.title}</b><small>사전 수록이 아직 적은 영역</small></span>; })}</div></section>

    <section><h2>주로 다루는 개념</h2>
      {terms.length > 0
        ? <div className="pre-chip-list">{terms.map(term => <Link className="pre-chip" key={term.key} to={term.href as string}><b>{term.title}</b>{term.subtitle && <span>{term.subtitle}</span>}</Link>)}</div>
        : <p className="notice">중심 분야에 연결된 용어가 없습니다.</p>}</section>

    {missionRows.length > 0 && <section><h2>이 개념들을 만나는 미션</h2>
      <div className="pre-chip-list">{missionRows.map(mission => mission && <Link className="pre-chip" key={mission.key} to={mission.href}><b>{mission.title}</b><span>{mission.courseLabel}</span></Link>)}</div></section>}
  </section>;
}
