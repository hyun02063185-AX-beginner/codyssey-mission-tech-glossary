import { Link, useParams } from 'react-router-dom';
import { graph, highlightTerms, node } from './encyclopedia';
import { learnerAcademic, learnerAcademicList, learnerAcademicPaths, learnerMission, learnerOverrides, learnerTerm } from './learnerView';

/**
 * Academic View — "이 미션/기술을 공부하려면 컴퓨터공학의 어느 영역을 보면 되는가".
 * Not a course catalogue. Fields whose coverage is too thin are not shown to users
 * (U11); they stay in the data so the gap is visible to maintainers, not to learners.
 *
 * 화면에 쓰는 값은 전부 learnerView 의 projection 을 거친다. visibility·note·override reason
 * 같은 내부 값을 이 파일에서 직접 읽지 않는다.
 */
export function AcademicIndex() {
  const all = learnerAcademicList();
  const open = all.filter(x => x.open);
  const closed = all.filter(x => !x.open);
  const groups = ['컴퓨터공학 과목', '실무 적용 영역'] as const;
  return <section className="academic-page"><p className="eyebrow">Knowledge Encyclopedia</p><h1>학문 지도</h1>
    <p className="academic-intro">미션에서 만난 기술이 컴퓨터공학의 어느 영역에 속하는지 보여 줍니다. 기술 분야 지도와는 <b>다른 축</b>입니다. 같은 용어라도 기술 분야에서의 자리와 학문에서의 자리가 다를 수 있습니다.</p>
    {groups.map(title => {
      const rows = open.filter(x => x.kindLabel === title);
      return rows.length ? <section className="academic-group" key={title}><h2>{title}</h2>
        <div className="grid">{rows.map(field => <Link className="card academic-card" key={field.key} to={field.href as string}>
          <b>{field.title}</b><span>{field.subtitle}</span>
          <small>용어 {field.termCount}개 · 자세한 설명 {field.detailCount}개 · 관련 미션 {field.missionCount}개</small></Link>)}</div></section> : null;
    })}
    {closed.length > 0 && <section className="academic-group"><h2>아직 열지 않은 영역</h2>
      <p className="pre-note">정의는 되어 있지만 사전에 담긴 용어가 적어 화면에 열지 않았습니다. 빈 화면을 그럴듯하게 채우지 않습니다.</p>
      <ul className="academic-hidden">{closed.map(field => <li key={field.key}><b>{field.title}</b> <small>{field.scopeNote}</small></li>)}</ul></section>}
  </section>;
}

export default function AcademicView() {
  const { fieldId = '' } = useParams();
  const field = learnerAcademic(`academic:${fieldId}`);
  if (!field) return <section><h1>안내</h1><p className="notice">존재하지 않는 학문 영역입니다.</p><Link to="/academic">학문 지도로 이동</Link></section>;
  if (!field.open) return <section className="academic-page"><p className="eyebrow">학문</p><h1>{field.title}</h1>
    <p className="notice">{field.scopeNote} 억지로 채우기보다 비어 있음을 그대로 보여 드립니다.</p>
    <p className="pre-note">{field.intro}</p><Link to="/academic">학문 지도로 이동</Link></section>;

  const raw = node(`academic:${fieldId}`);
  const primary = graph.indexes.byAcademic[fieldId]?.primary ?? [];
  const secondary = graph.indexes.byAcademic[fieldId]?.secondary ?? [];
  const core = highlightTerms(primary, 12).map(learnerTerm);
  const paths = learnerAcademicPaths(fieldId);
  const missionRows = (raw?.missionIds ?? []).map(learnerMission).filter(Boolean);
  const before = (raw?.prerequisiteFields ?? []).map(id => learnerAcademic(`academic:${id}`)).filter(Boolean);
  const after = learnerAcademicList().filter(x => x.open && (node(x.key)?.prerequisiteFields ?? []).includes(fieldId));
  const overrides = learnerOverrides(primary);
  return <section className="academic-page"><p className="eyebrow">{field.kindLabel}</p>
    <h1>{field.title}</h1><p>{field.subtitle}</p>
    <p className="academic-note">{field.intro}</p>

    <dl className="pre-facts academic-facts">
      <div><dt>수록 용어</dt><dd>{field.termCount}개 <small>핵심 {field.coreCount} · 자세한 설명 {field.detailCount}</small></dd></div>
      <div><dt>관련 미션</dt><dd>{field.missionCount}개</dd></div>
      {secondary.length > 0 && <div><dt>보조로 걸친 용어</dt><dd>{secondary.length}개</dd></div>}
    </dl>

    <section><h2>핵심 개념</h2>
      <div className="pre-chip-list">{core.map(term => <Link className="pre-chip" key={term.key} to={`/prerequisites/${node(term.key)?.termId}`}><b>{term.title}</b>{term.subtitle && <span>{term.subtitle}</span>}<small>선수학습 보기</small></Link>)}</div>
      {primary.length > core.length && <p className="pre-note">{primary.length}개 중 자주 쓰이는 {core.length}개입니다. <Link to={`/terms?q=`}>용어 찾기</Link>에서 더 볼 수 있습니다.</p>}</section>

    {(before.length > 0 || after.length > 0) && <section><h2>공부 순서</h2>
      {before.length > 0 && <><p className="pre-note">이 영역을 보기 전에</p><div className="pre-chip-list">{before.map(x => x && (x.href ? <Link className="pre-chip" key={x.key} to={x.href}><b>{x.title}</b></Link> : <span className="pre-chip is-static" key={x.key}><b>{x.title}</b></span>))}</div></>}
      {after.length > 0 && <><p className="pre-note">이 영역을 알고 나면</p><div className="pre-chip-list">{after.map(x => <Link className="pre-chip" key={x.key} to={x.href as string}><b>{x.title}</b></Link>)}</div></>}</section>}

    {paths.length > 0 && <section><h2>이 영역의 학습 경로</h2>
      {paths.map(path => <article className="pre-path" key={path.key}><h3>{path.title}</h3>
        <ol className="pre-path-steps">{path.steps.map(step => <li key={step.key}>{step.href ? <Link to={step.href}>{step.title}</Link> : step.title}</li>)}</ol>
        <p className="pre-path-why">{path.why}</p></article>)}</section>}

    {missionRows.length > 0 && <section><h2>관련 미션</h2>
      <div className="pre-chip-list">{missionRows.map(mission => mission && <Link className="pre-chip" key={mission.key} to={mission.href}><b>{mission.title}</b><span>{mission.courseLabel}</span></Link>)}</div></section>}

    {overrides.length > 0 && <section><h2>기술 분야와 다르게 배정한 용어</h2>
      <p className="pre-note">기술 지도에서의 자리와 학문에서의 자리가 다른 경우입니다. 어느 쪽이 틀린 것이 아니라 보는 축이 다릅니다.</p>
      <ul className="academic-overrides">{overrides.map(term => <li key={term.key}><Link to={term.href as string}>{term.title}</Link> <small>기술 지도에서는 {term.otherAxis}</small></li>)}</ul></section>}
  </section>;
}
