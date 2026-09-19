import { Link, useParams } from 'react-router-dom';
import { academicFields, coverage, graph, highlightTerms, label, node, subLabel, visibleAcademicFields } from './encyclopedia';

const kindLabel = { academic: '학문', applied: '적용 영역' } as const;

/**
 * Academic View — "이 미션/기술을 공부하려면 컴퓨터공학의 어느 영역을 보면 되는가".
 * Not a course catalogue. Fields whose coverage is too thin are not shown to users
 * (U11); they stay in the data so the gap is visible to maintainers, not to learners.
 */
export function AcademicIndex() {
  const active = visibleAcademicFields();
  const hidden = academicFields().filter(x => x.visibility !== 'active');
  const groups = [['academic', '컴퓨터공학 과목'], ['applied', '실무 적용 영역']] as const;
  return <section className="academic-page"><p className="eyebrow">Knowledge Encyclopedia</p><h1>학문 지도</h1>
    <p className="academic-intro">미션에서 만난 기술이 컴퓨터공학의 어느 영역에 속하는지 보여 줍니다. 기술 분야 지도와는 <b>다른 축</b>입니다. 같은 용어라도 기술 분야에서의 자리와 학문에서의 자리가 다를 수 있습니다.</p>
    {groups.map(([kind, title]) => {
      const rows = active.filter(x => x.academicKind === kind);
      return rows.length ? <section className="academic-group" key={kind}><h2>{title}</h2>
        <div className="grid">{rows.map(field => {
          const report = coverage({ academic: field.academicId });
          return <Link className="card academic-card" key={field.id} to={`/academic/${field.academicId}`}>
            <b>{field.labelKo}</b><span>{field.labelEn}</span>
            <small>용어 {report.total}개 · 자세한 설명 {report.withDetail}개 · 관련 미션 {report.missions}개</small></Link>;
        })}</div></section> : null;
    })}
    {hidden.length > 0 && <section className="academic-group"><h2>아직 열지 않은 영역</h2>
      <p className="pre-note">정의는 되어 있지만 사전에 담긴 용어가 적어 화면에 열지 않았습니다. 빈 화면을 그럴듯하게 채우지 않습니다.</p>
      <ul className="academic-hidden">{hidden.map(field => <li key={field.id}><b>{field.labelKo}</b> <small>{field.visibility === 'declared' ? '수록 용어 없음' : `용어 ${field.termCount}개 · 학습 경로 부족`}</small></li>)}</ul></section>}
  </section>;
}

export default function AcademicView() {
  const { fieldId = '' } = useParams();
  const field = node(`academic:${fieldId}`);
  if (!field || field.kind !== 'academic') return <section><h1>안내</h1><p className="notice">존재하지 않는 학문 영역입니다.</p><Link to="/academic">학문 지도로 이동</Link></section>;
  if (field.visibility !== 'active') return <section className="academic-page"><p className="eyebrow">학문</p><h1>{field.labelKo}</h1>
    <p className="notice">{field.visibility === 'declared' ? '이 영역에 연결된 용어가 아직 없습니다.' : `이 영역에는 용어 ${field.termCount}개만 연결되어 있어 학습 지도를 만들기에 이릅니다.`} 억지로 채우기보다 비어 있음을 그대로 보여 드립니다.</p>
    <p className="pre-note">{field.note}</p><Link to="/academic">학문 지도로 이동</Link></section>;

  const report = coverage({ academic: fieldId });
  const primary = graph.indexes.byAcademic[fieldId]?.primary ?? [];
  const secondary = graph.indexes.byAcademic[fieldId]?.secondary ?? [];
  const core = highlightTerms(primary, 12);
  const paths = graph.paths.filter(path => path.origin.startsWith('cluster:') && path.steps.some(step => step === `academic:${fieldId}` || primary.includes(node(step)?.termId ?? '')));
  const missionIds = field.missionIds ?? [];
  const before = (field.prerequisiteFields ?? []).map(id => node(`academic:${id}`)).filter(Boolean);
  const after = academicFields().filter(x => (x.prerequisiteFields ?? []).includes(fieldId) && x.visibility === 'active');
  const overrides = primary.filter(id => node(`term:${id}`)?.academic?.origin === 'override');
  return <section className="academic-page"><p className="eyebrow">{kindLabel[field.academicKind ?? 'academic']}</p>
    <h1>{field.labelKo}</h1><p>{field.labelEn}</p>
    <p className="academic-note">{field.note}</p>

    <dl className="pre-facts academic-facts">
      <div><dt>수록 용어</dt><dd>{report.total}개 <small>핵심 {report.core} · 자세한 설명 {report.withDetail}</small></dd></div>
      <div><dt>관련 미션</dt><dd>{report.missions}개</dd></div>
      {secondary.length > 0 && <div><dt>보조로 걸친 용어</dt><dd>{secondary.length}개</dd></div>}
    </dl>

    <section><h2>핵심 개념</h2>
      <div className="pre-chip-list">{core.map(id => { const term = node(id); return <Link className="pre-chip" key={id} to={`/prerequisites/${term?.termId}`}><b>{label(id)}</b>{subLabel(id) && <span>{subLabel(id)}</span>}<small>선수학습 보기</small></Link>; })}</div>
      {primary.length > core.length && <p className="pre-note">{primary.length}개 중 자주 쓰이는 {core.length}개입니다. <Link to={`/terms?q=`}>용어 찾기</Link>에서 더 볼 수 있습니다.</p>}</section>

    {(before.length > 0 || after.length > 0) && <section><h2>공부 순서</h2>
      {before.length > 0 && <><p className="pre-note">이 영역을 보기 전에</p><div className="pre-chip-list">{before.map(x => x && <Link className="pre-chip" key={x.id} to={`/academic/${x.academicId}`}><b>{x.labelKo}</b></Link>)}</div></>}
      {after.length > 0 && <><p className="pre-note">이 영역을 알고 나면</p><div className="pre-chip-list">{after.map(x => <Link className="pre-chip" key={x.id} to={`/academic/${x.academicId}`}><b>{x.labelKo}</b></Link>)}</div></>}</section>}

    {paths.length > 0 && <section><h2>이 영역의 학습 경로</h2>
      {paths.map(path => <article className="pre-path" key={path.id}><h3>{path.label}</h3>
        <ol className="pre-path-steps">{path.steps.map(step => { const target = node(step); return <li key={step}>{target?.termId ? <Link to={`/terms/${target.termId}`}>{label(step)}</Link> : label(step)}</li>; })}</ol>
        <p className="pre-path-why">{path.why}</p></article>)}</section>}

    {missionIds.length > 0 && <section><h2>관련 미션</h2>
      <div className="pre-chip-list">{missionIds.map(id => { const mission = node(`mission:${id}`); return mission ? <Link className="pre-chip" key={id} to={`/missions/${mission.aliases?.route}`}><b>{mission.titleKo}</b><span>{mission.course === 'main' ? '본과정' : '예비'} {id.split('-')[1]?.toUpperCase()}</span></Link> : null; })}</div></section>}

    {overrides.length > 0 && <section><h2>기술 분야와 다르게 배정한 용어</h2>
      <p className="pre-note">기술 분야에서의 자리와 학문에서의 자리가 다른 경우입니다. Atlas 분류가 틀린 것이 아니라 축이 다릅니다.</p>
      <ul className="academic-overrides">{overrides.map(id => { const term = node(`term:${id}`); return <li key={id}><Link to={`/terms/${id}`}>{term?.labelKo}</Link> <small>기술 분야: {label(`field:${term?.field?.primary}`)}</small><p>{term?.academic?.reason}</p></li>; })}</ul></section>}
  </section>;
}
