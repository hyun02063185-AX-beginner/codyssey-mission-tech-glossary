import { Link } from 'react-router-dom';
import { highlightTerms, label, missionAnswers, node, subLabel } from './encyclopedia';

/**
 * The Encyclopedia section of a mission page. It answers the six mission questions
 * entirely from the graph — the mission source file holds no term list.
 * It is mounted inside the existing /missions/:missionId route so the public alias
 * (main-M01) and the existing term listing keep working unchanged.
 */
export default function MissionEncyclopedia({ missionId }: { missionId: string }) {
  const answers = missionAnswers(missionId);
  if (!answers) return null;
  const { mission, academicPrimary, academicSupporting, prerequisiteAcademic, coreTerms, practiceTerms, prerequisiteTerms, studyNextMissions, studyNextAcademic } = answers;
  const chip = (id: string) => { const term = node(id); return term?.termId ? <Link className="pre-chip" key={id} to={`/terms/${term.termId}`}><b>{label(id)}</b>{subLabel(id) && <span>{subLabel(id)}</span>}</Link> : <span className="pre-chip is-static" key={id}><b>{label(id)}</b></span>; };
  const academicChip = (field: { academicId?: string; labelKo?: string; visibility?: string }) => field.visibility === 'active'
    ? <Link className="pre-chip" key={field.academicId} to={`/academic/${field.academicId}`}><b>{field.labelKo}</b></Link>
    : <span className="pre-chip is-static" key={field.academicId}><b>{field.labelKo}</b><small>사전 수록이 아직 적은 영역</small></span>;
  const coreHighlight = highlightTerms(coreTerms, 10);
  return <section className="mission-encyclopedia" aria-labelledby="mission-enc-title">
    <p className="eyebrow">Knowledge Encyclopedia</p>
    <h2 id="mission-enc-title">{mission.titleKo}</h2>

    <div className="mission-enc-grid">
      <section><h3>어떤 학문과 연결되는가</h3>
        <div className="pre-chip-list">{academicPrimary && academicChip(academicPrimary)}{academicSupporting.map(academicChip)}</div>
        <p className="pre-note">중심 학문은 {academicPrimary?.labelKo}입니다. 나머지는 함께 쓰이는 영역입니다.</p></section>

      <section><h3>무엇을 먼저 알아야 하는가</h3>
        {prerequisiteAcademic.length > 0
          ? <><p className="pre-note">과목 순서</p><div className="pre-chip-list">{prerequisiteAcademic.map(academicChip)}</div></>
          : <p className="pre-note">앞서 들어야 할 과목이 없는 출발 지점입니다.</p>}
        {prerequisiteTerms.length > 0 && <><p className="pre-note">이 미션 밖에서 먼저 보면 좋은 개념 {prerequisiteTerms.length}개</p>
          <div className="pre-chip-list">{prerequisiteTerms.slice(0, 10).map(chip)}</div></>}</section>
    </div>

    <section><h3>이 미션의 핵심 개념 <small>{coreTerms.length}개</small></h3>
      <div className="pre-chip-list">{coreHighlight.map(id => chip(id.startsWith('term:') ? id : `term:${id}`))}</div>
      {coreTerms.length > coreHighlight.length && <p className="pre-note">아래 목록에서 전체를 볼 수 있습니다.</p>}</section>

    <section><h3>실제로 사용하는 개념 <small>{practiceTerms.length}개</small></h3>
      <p className="pre-note">미션 문서에 직접 등장하는 용어입니다. 아래 &ldquo;미션에 직접 등장&rdquo; 목록과 같은 출처에서 계산합니다.</p></section>

    <section><h3>다음에 무엇을 공부하면 좋은가</h3>
      <div className="pre-chip-list">
        {studyNextMissions.map(next => <Link className="pre-chip" key={next.id} to={`/missions/${next.aliases?.route}`}><b>{next.titleKo}</b><span>{next.course === 'main' ? '본과정' : '예비'} {next.missionId?.split('-')[1]?.toUpperCase()}</span></Link>)}
        {studyNextAcademic.map(academicChip)}
      </div>
      {studyNextMissions.length === 0 && studyNextAcademic.length === 0 && <p className="pre-note">다음 미션이 지정되어 있지 않습니다.</p>}</section>

    <p className="pre-note">이 화면의 용어 목록은 저장하지 않고 미션 원본에서 계산합니다.</p>
  </section>;
}
