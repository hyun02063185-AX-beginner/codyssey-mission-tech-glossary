import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import glossary from './data/generated/glossary.json';
import { knowledgeSummary, learningForMission, learningMissions, materialLabel, missionMapLinks } from './missionLearning';
import { M03LearningStory } from './M03LearningStory';
import './missionLearning.css';

const MissionEncyclopedia = lazy(() => import('./MissionEncyclopedia'));
type Mission = NonNullable<ReturnType<typeof learningForMission>>;
const groups = [['direct', '미션에 직접 등장'], ['required', '수행에 필요한 개념'], ['related', '더 깊게 볼 개념']] as const;

function MaterialBadges({ mission }: { mission: Mission }) {
  return <div className="mission-material-badges" aria-label="이용할 수 있는 학습 자료">{mission.materials.map(item => <span key={item.kind}>{materialLabel(mission.id,item.kind)}</span>)}</div>;
}

export function MissionLearningStart({ mission }: { mission: Mission }) {
  return <section className="mission-learning-start" aria-labelledby="mission-start-title">
    <div className="mission-start-heading"><h2 id="mission-start-title">학습 시작하기</h2><p>{mission.materials.length > 1 ? `${mission.materials.map(item => materialLabel(mission.id,item.kind)).join(' → ')} 중, 지금 필요한 자료부터 선택하세요. 권장 경로이며 순서대로 읽어야 하는 것은 아닙니다.` : mission.materials.length ? '지금 제공되는 자료로 시작하고, 필요한 개념은 아래에서 더 찾아보세요.' : '관련 기술지도와 핵심 개념부터 살펴보세요. 필요한 정보를 골라 펼칠 수 있습니다.'}</p></div>
    <ol className="mission-start-cards">{(['story','concepts','guide'] as const).map((kind,index)=>{
      const item=mission.materials.find(material=>material.kind===kind),label=materialLabel(mission.id,kind);
      const action={story:'미션 스토리 시작 →',concepts:'개념지도 탐색 →',guide:'학습가이드 읽기 →'}[kind];
      return <li key={kind} data-material={kind} className={item?'':'is-unavailable'}><p className="mission-material-kind"><span>{index+1}</span>{label}</p><h3>{item?.title??label}</h3><p>{item?.description??'이 미션의 자료는 아직 제공되지 않습니다.'}</p>{item?<Link to={item.href}>{action}</Link>:<span className="mission-material-unavailable">준비 중 · 미제공</span>}</li>;
    })}</ol>
    {mission.materials.some(item=>item.kind==='interactive')&&<div data-material="interactive"><M03LearningStory missionId={mission.id}/></div>}
    {mission.supplement && <p className="mission-supplement">더 살펴보기 · <Link to={mission.supplement}>기업망 보강 자료</Link></p>}
  </section>;
}

export function MissionsPage() {
  const recommended = learningMissions.filter(mission => mission.materials.length > 0).sort((a, b) => b.materials.length - a.materials.length);
  return <div className="missions-learning-page"><header className="mission-page-heading"><p className="eyebrow">코디세이 · 미션 중심 학습</p><h1>미션 학습</h1><p>내 미션을 고르고, 제공되는 스토리·개념지도·학습가이드로 시작하세요. 정확한 뜻이 궁금해지면 용어사전으로 이어 갈 수 있습니다.</p></header>
    <section className="mission-recommendations" aria-labelledby="mission-recommend-title"><h2 id="mission-recommend-title">미션을 고르고 학습 시작하기</h2><div>{recommended.map(mission => <Link key={mission.id} to={mission.href}><b>{mission.courseLabel}</b><span>{mission.title}</span><small>{mission.materials.map(item => materialLabel(mission.id,item.kind)).join(' · ')} →</small></Link>)}</div></section>
    {(['preliminary', 'main'] as const).map(course => <section key={course} className="mission-course" aria-labelledby={`mission-course-${course}`}><h2 id={`mission-course-${course}`}>{course === 'preliminary' ? '예비과정' : '본과정'} <small>{learningMissions.filter(item => item.course === course).length}개 미션</small></h2><div className="mission-learning-grid">{learningMissions.filter(item => item.course === course).map(mission => <article className="mission-card" key={mission.id} data-mission={mission.id}><p className="eyebrow">{mission.courseLabel}</p><h3>{mission.title}</h3><MaterialBadges mission={mission}/>{!mission.materials.length && <p className="mission-card-note">관련 개념과 기술지도를 살펴보세요.</p>}<div className="mission-card-actions"><Link to={mission.href}>미션 살펴보기 →</Link></div></article>)}</div></section>)}
  </div>;
}

function MissionMapEntry({ mission }: { mission: Mission }) {
  const { maps, crossField } = missionMapLinks(mission.id);
  if (!maps.length) return null;
  return <section className="mission-map-entry"><h2>관련 기술지도</h2>{crossField && <p>이 미션은 Programming Foundations 공통 계층을 중심으로 여러 기술 분야를 함께 사용합니다.</p>}<p>이 미션에서 만나는 기술을 해당 분야의 연결 속에서 확인하세요.</p>{maps.map(map => <Link className="map-term-link" key={map.href} to={map.href}>🗺 {map.title}에서 보기 {map.secondary && <small> · 보조 맥락</small>} <span aria-hidden="true">→</span></Link>)}</section>;
}

export function MissionDetailPage() {
  const { missionId = '' } = useParams();
  const mission = learningForMission(missionId);
  if (!mission) return <section><h1>안내</h1><p className="notice">존재하지 않는 미션입니다.</p><Link to="/missions">미션 학습으로 이동</Link></section>;
  const [course, number] = mission.id.split('-');
  return <article key={mission.id} className="mission-learning-page"><header className="mission-page-heading"><Link to="/missions">← 미션 학습</Link><p className="eyebrow">{mission.courseLabel}</p><h1>{mission.title}</h1><p>{mission.intro}</p><p className="mission-learning-question"><b>핵심 질문</b>{mission.question??'준비 중입니다. 제공되는 학습 자료와 관련 개념부터 살펴보세요.'}</p></header>
    <MissionLearningStart mission={mission}/>
    <details id="mission-knowledge" className="mission-knowledge"><summary><h2 id="mission-knowledge-title">지식 확장</h2><span>{knowledgeSummary(mission.id)}</span><small>관련 학문·선수학습·핵심 개념·기술지도·다음 학습 펼쳐 보기</small></summary><Suspense fallback={<p className="notice">관련 지식을 불러오는 중입니다.</p>}><MissionEncyclopedia missionId={mission.id}/></Suspense><MissionMapEntry mission={mission}/></details>
    <section className="mission-all-terms" aria-labelledby="mission-terms-title"><h2 id="mission-terms-title">전체 용어 찾아보기</h2><p>정확한 뜻이 필요할 때 분류를 펼쳐 용어사전으로 이동하세요.</p>{groups.map(([status, title]) => {
      const terms = glossary.filter(term => term.missionRefs.some(ref => ref.course === course && ref.mission.toLowerCase() === number && ref.source_status === status));
      return <details key={status} className="mission-term-group" data-term-group={status}><summary><h3>{title}</h3><span>{terms.length}개 용어</span></summary><div className="mission-term-rows">{terms.length ? terms.map(term => <Link className="row" key={term.id} to={`/terms/${term.id}`}><b>{term.termKo}</b><span>{term.termEn}</span><em>{term.category}</em><small>{term.missionRefs.length}개 미션 · {term.hasDetailedContent ? '핵심 설명' : '용어 인덱스'}</small></Link>) : <p>이 분류에 연결된 용어가 없습니다.</p>}</div></details>;
    })}</section>
  </article>;
}
