import { Link } from 'react-router-dom';
import { learnerTermLinks } from './learnerView';

/**
 * 용어 페이지에서 대백과로 넘어가는 줄.
 *
 * 검색으로 들어오면 도착하는 자리가 용어 페이지인데, 거기서 선수학습·학문·미션으로 갈 길이
 * 없었다. 네 개의 View 를 만들어 두고도 헤더 메뉴로만 만날 수 있었다는 뜻이다.
 *
 * 새 데이터를 만들지 않는다. 이미 계산돼 있는 것을 링크로 꺼내 놓을 뿐이고, 표시에 쓰는 값은
 * 전부 learnerView projection 을 거친다. 기술 지도 링크는 이 페이지에 이미 있으므로 넣지 않는다.
 */
export default function TermEncyclopediaLinks({ termId, compact = false }: { termId: string; compact?: boolean }) {
  const links = learnerTermLinks(termId);
  if (!links) return null;
  const { prerequisiteHref, learnFirstCount, academic, missions } = links;
  if (!prerequisiteHref && !academic?.open && missions.length === 0) return null;
  const Heading = compact ? 'h3' : 'h2';
  return <section className={compact ? 'term-encyclopedia is-compact' : 'term-encyclopedia'}>
    <Heading>{compact ? '학습 지도에서 보기' : '이 용어를 지도에서 보기'}</Heading>
    <div className="term-enc-links">
      {prerequisiteHref && <Link className="term-enc-link" to={prerequisiteHref}>
        <b>먼저 볼 개념</b>
        <span>{learnFirstCount > 0 ? `이 용어 앞에 ${learnFirstCount}개가 있습니다` : '이 용어를 알면 무엇으로 이어지는지 봅니다'}</span>
      </Link>}
      {academic?.open && <Link className="term-enc-link" to={academic.href as string}>
        <b>{academic.title}</b>
        <span>같은 영역의 다른 개념과 공부 순서를 봅니다</span>
      </Link>}
      {missions.slice(0, 3).map(mission => <Link className="term-enc-link" key={mission.key} to={mission.href}>
        <b>{mission.courseLabel}</b>
        <span>{mission.title}</span>
      </Link>)}
    </div>
    {missions.length > 3 && <p className="pre-note">이 용어가 등장하는 미션은 모두 {missions.length}개입니다.</p>}
  </section>;
}
