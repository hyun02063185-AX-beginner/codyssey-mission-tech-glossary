import { Link } from 'react-router-dom';
import { learnerAcademicList, learnerEntries, learnerFeaturedPaths } from './learnerView';

/**
 * Encyclopedia Home — 대백과의 출발점.
 *
 * 왜 필요한가: 학습 경로 166개와 선수 관계를 가진 용어 312개를 쌓았는데, 진입점이 목록
 * 화면뿐이라 경로는 용어를 먼저 고른 뒤에야 보였다. 만들어 둔 것을 만날 길이 없었다.
 *
 * 이 화면은 dashboard 가 아니다. 새 데이터를 보여 주지 않고, 새 metadata 도 만들지 않는다.
 * 숫자는 전부 그래프에서 세고, 하는 일은 학습자의 목적을 네 갈래로 갈라 기존 화면으로
 * 보내 주는 것뿐이다. 첫 행동을 고를 수 있게 하는 것이 목표다.
 */
export default function EncyclopediaHome() {
  const entries = learnerEntries();
  const paths = learnerFeaturedPaths(6);
  const closed = learnerAcademicList().filter(field => !field.open);
  return <section className="enc-home">
    <p className="eyebrow">Knowledge Encyclopedia</p>
    <h1>무엇부터 볼지 고르기</h1>
    <p className="enc-home-intro">같은 기술을 <b>미션·학문·직무·선수학습</b>이라는 네 가지 축에서 봅니다.
      분류 목록이 아니라 <b>무엇을 먼저 보면 되는지</b>를 말해 주는 지도입니다. 지금 하려는 일에 가까운 쪽으로 들어가세요.</p>

    <section className="enc-entries"><h2>지금 하려는 일</h2>
      <div className="grid">{entries.map(entry => <Link className="card enc-entry" key={entry.key} to={entry.href}>
        <b>{entry.title}</b>
        <span className="enc-entry-question">{entry.question}</span>
        <small>{entry.detail}</small>
        <small className="enc-entry-count">{entry.countLabel}</small>
      </Link>)}</div></section>

    <section className="enc-paths"><h2>대표 학습 흐름</h2>
      <p className="pre-note">개념 하나를 외우는 대신 순서로 보면 이해가 남습니다. 학문마다 하나씩 골랐습니다.</p>
      {paths.map(path => <article className="pre-path enc-path" key={path.key}>
        <h3>{path.title}</h3>
        <p className="enc-path-scope">{path.scopeLabel}</p>
        <ol className="pre-path-steps">{path.steps.map(step => <li key={step.key}>{step.href ? <Link to={step.href}>{step.title}</Link> : step.title}</li>)}</ol>
        <p className="pre-path-why">{path.why}</p>
      </article>)}</section>

    <section className="enc-more"><h2>다른 방식으로 둘러보기</h2>
      <div className="grid">
        <Link className="card" to="/maps"><b>기술 지도</b><span>분야별로 기술이 어떻게 이어지는지 그림으로 봅니다</span><small>학문과는 다른 축입니다</small></Link>
        <Link className="card" to="/terms"><b>용어 찾기</b><span>이름을 알고 있다면 바로 검색하세요</span><small>한국어·영어·약어로 찾을 수 있습니다</small></Link>
        <Link className="card" to="/connections"><b>개념 연결</b><span>따로 배운 개념이 왜 같이 나오는지 봅니다</span><small>짧은 이야기로 읽습니다</small></Link>
      </div></section>

    {closed.length > 0 && <p className="notice">아직 열지 않은 영역이 {closed.length}개 있습니다. 사전에 담긴 용어가 적어 화면에 열지 않았습니다.
      빈 화면을 그럴듯하게 채우지 않습니다. <Link to="/academic">학문 지도</Link>에서 어떤 영역인지 볼 수 있습니다.</p>}
  </section>;
}
