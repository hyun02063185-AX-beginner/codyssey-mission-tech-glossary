import { Link, useParams } from 'react-router-dom';
import { coverage, graph, highlightTerms, label, node, roles, subLabel } from './encyclopedia';

const stateLabel: Record<string, string> = { active: '연결된 범위 넓음', limited: '연결된 범위 제한적', declared: '아직 연결 없음' };

/**
 * Role View — "이 기술은 실제 어느 역할에서 주로 다루는가".
 * Roles are not graph nodes: everything here is computed from roles.json weights plus
 * field/academic membership. Coverage is shown honestly so a thin role does not look full.
 */
export function RoleIndex() {
  const rows = roles().sort((a, b) => (a.coverageState === b.coverageState ? b.termCount - a.termCount : a.coverageState === 'active' ? -1 : 1));
  return <section className="role-page"><p className="eyebrow">Knowledge Encyclopedia</p><h1>직무 지도</h1>
    <p className="role-intro">취업 직무 안내가 아닙니다. 사전에 담긴 기술이 <b>실제로 어느 역할에서 주로 다뤄지는지</b>를 보여 줍니다. 모든 수치는 <b>현재 사전에 연결된 범위 기준</b>입니다.</p>
    <div className="grid">{rows.map(role => <Link className={`card role-card is-${role.coverageState}`} key={role.id} to={`/roles/${role.id}`}>
      <b>{role.labelKo}</b><span>{role.labelEn}</span>
      <small className={`role-state is-${role.coverageState}`}>{stateLabel[role.coverageState]}</small>
      <small>주요 분야 용어 {role.coreFieldTermCount}개</small></Link>)}</div>
  </section>;
}

export default function RoleView() {
  const { roleId = '' } = useParams();
  const role = graph.indexes.byRole[roleId];
  if (!role) return <section><h1>안내</h1><p className="notice">존재하지 않는 직무입니다.</p><Link to="/roles">직무 지도로 이동</Link></section>;
  const report = coverage({ role: roleId });
  const coreFields = role.fields.filter(f => f.weight === 'core');
  const supportFields = role.fields.filter(f => f.weight !== 'core');
  const terms = highlightTerms([...new Set(coreFields.flatMap(f => graph.indexes.byField[f.id]?.primary ?? []))], 14);
  const missionIds = [...new Set(terms.flatMap(id => (node(id)?.missions ?? []).map(m => m.missionId)))].sort();
  return <section className="role-page"><p className="eyebrow">직무</p><h1>{role.labelKo}</h1><p>{role.labelEn}</p>
    <p className={`role-state-banner is-${role.coverageState}`}>{stateLabel[role.coverageState]} · 현재 사전에 연결된 범위 기준</p>
    {role.coverageState !== 'active' && <p className="notice">
      {role.coreFieldTermCount === 0
        ? '이 직무의 중심 어휘가 아직 사전에 거의 없습니다. 아래 내용은 주변 영역에서 끌어온 것이라 직무 전체를 대표하지 않습니다.'
        : `이 직무의 중심 학문(${role.weakCoreAcademic.map(id => node(`academic:${id}`)?.labelKo ?? id).join(', ')})에 연결된 용어가 부족합니다. 아래는 인접 분야 기준입니다.`}
    </p>}
    {role.note && <p className="pre-note">{role.note}</p>}

    <dl className="pre-facts">
      <div><dt>주요 기술 영역</dt><dd>{coreFields.map(f => label(`field:${f.id}`)).join(' · ') || '지정 없음'}</dd></div>
      {supportFields.length > 0 && <div><dt>함께 쓰는 영역</dt><dd>{supportFields.map(f => label(`field:${f.id}`)).join(' · ')}</dd></div>}
      <div><dt>연결된 용어</dt><dd>{report.total}개 <small>핵심 {report.core} · 자세한 설명 {report.withDetail}</small></dd></div>
    </dl>

    <section><h2>관련 학문</h2>
      <div className="pre-chip-list">{role.academic.map(entry => { const field = node(`academic:${entry.id}`); if (!field) return null;
        return field.visibility === 'active'
          ? <Link className="pre-chip" key={entry.id} to={`/academic/${entry.id}`}><b>{field.labelKo}</b><span>{entry.weight === 'core' ? '중심' : '보조'}</span></Link>
          : <span className="pre-chip is-static" key={entry.id}><b>{field.labelKo}</b><small>사전 수록이 아직 적은 영역</small></span>; })}</div></section>

    <section><h2>주로 다루는 개념</h2>
      {terms.length > 0
        ? <div className="pre-chip-list">{terms.map(id => <Link className="pre-chip" key={id} to={`/terms/${node(id)?.termId}`}><b>{label(id)}</b>{subLabel(id) && <span>{subLabel(id)}</span>}</Link>)}</div>
        : <p className="notice">중심 분야에 연결된 용어가 없습니다.</p>}</section>

    {missionIds.length > 0 && <section><h2>이 개념들을 만나는 미션</h2>
      <div className="pre-chip-list">{missionIds.slice(0, 10).map(id => { const mission = node(`mission:${id}`); return mission ? <Link className="pre-chip" key={id} to={`/missions/${mission.aliases?.route}`}><b>{mission.titleKo}</b><span>{mission.course === 'main' ? '본과정' : '예비'} {id.split('-')[1]?.toUpperCase()}</span></Link> : null; })}</div></section>}
  </section>;
}
