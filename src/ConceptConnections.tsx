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
const lessonSummary: Record<string, string> = {
  'ajax-xhr-fetch': 'AJAX는 필요한 데이터만 받아 화면 일부를 바꾸는 방식입니다. XHR과 fetch()는 그 요청을 만드는 브라우저 도구입니다.',
  'callback-promise-async-await': 'Callback, Promise, async/await는 모두 나중에 오는 결과를 다루는 방법입니다. 코드를 읽는 방식과 연결 규칙이 다릅니다.',
  'event-family': '이벤트는 브라우저에서 일어난 일이고, 리스너와 핸들러는 그 일에 반응하는 코드를 연결합니다.',
  'html-dom': 'HTML은 문서에 적어 둔 구조이고, DOM은 브라우저가 그 문서를 읽어 만든 실행 중인 객체 구조입니다.',
  'spa-mpa': 'SPA와 MPA의 가장 큰 차이는 페이지를 바꿀 때 무엇을 새로 받아오느냐에 있습니다.',
  'var-let-const': 'var, let, const는 값을 이름에 연결하는 방법이지만 스코프와 값을 다시 바꿀 수 있는 규칙이 다릅니다.',
};

function ConnectionTerms({ ids }: { ids: string[] }) {
  return <div className="connection-term-list">{ids.map(id => {
    const term = termById.get(id);
    return term ? <Link key={id} to={`/terms/${id}`}>{term.termKo}<small>{term.termEn}</small></Link> : null;
  })}</div>;
}

function ConnectionDiagram({ connection }: { connection: Connection }) {
  const nodeById = new Map(connection.diagram.nodes.map(node => [node.id, node]));
  const name = (node: DiagramNode) => node.termId ? termById.get(node.termId)?.termKo ?? node.termId : node.label ?? node.id;
  return <section className="connection-diagram" aria-label={`${connection.title} 기술 관계`}>
    <h2>기술 관계</h2>
    <div className="connection-diagram-nodes">{connection.diagram.nodes.map(node => node.termId ? <Link className="connection-diagram-node" to={`/terms/${node.termId}`} key={node.id}>{name(node)}</Link> : <span className="connection-diagram-node" key={node.id}>{name(node)}</span>)}</div>
    <ol className="connection-diagram-edges">{connection.diagram.edges.map((edge, index) => <li key={`${edge.from}-${edge.to}-${index}`}><b>{name(nodeById.get(edge.from)!)}</b><span>{edge.label}</span><b>{name(nodeById.get(edge.to)!)}</b></li>)}</ol>
  </section>;
}

function ConnectionLesson({ connection }: { connection: Connection }) {
  switch (connection.id) {
    case 'ajax-xhr-fetch': return <>
      <section className="connection-lesson connection-hierarchy"><p className="lesson-kicker">먼저 구분하기</p><h2>AJAX는 ‘방식’, XHR과 fetch()는 ‘도구’</h2><div className="ajax-tree"><b>AJAX<small>필요한 데이터만 받아 화면 일부를 바꾸는 통신 방식</small></b><div><Link to="/terms/fetch-api">fetch()<small>Promise를 반환하는 최신 브라우저 API</small></Link><span>XMLHttpRequest<small>오래전부터 있던 브라우저 요청 API</small></span></div></div><p>셋을 같은 종류의 이름으로 외우기보다, AJAX 방식으로 통신할 때 XHR이나 fetch()를 쓴다고 이해하면 정확합니다.</p></section>
      <section><h2>실제 화면에서는 이렇게 일어납니다</h2><ol className="connection-flow"><li>사용자가 검색어를 입력합니다.</li><li>브라우저가 서버에 데이터를 요청합니다.</li><li>응답을 받아 검색 결과 영역만 갱신합니다.</li></ol><p>이 과정에서 전체 페이지를 다시 읽지 않는 것이 AJAX 경험의 핵심입니다.</p></section>
    </>;
    case 'callback-promise-async-await': return <>
      <section className="connection-lesson"><p className="lesson-kicker">같은 비동기 작업을 읽는 세 가지 모습</p><h2>무엇이 달라지는가</h2><div className="async-examples"><article><h3>Callback</h3><pre className="code">loadUser((user) =&gt; show(user));</pre></article><article><h3>Promise</h3><pre className="code">loadUser().then(show);</pre></article><article><h3>async / await</h3><pre className="code">const user = await loadUser();\nshow(user);</pre></article></div><p>세 방식 모두 ‘나중에 오는 결과’를 다룹니다. async/await는 Promise 위에서 동작하며, Callback도 이벤트 처리처럼 지금도 널리 쓰입니다.</p></section>
    </>;
    case 'event-family': return <>
      <section className="connection-lesson"><p className="lesson-kicker">클릭 한 번이 코드에 닿는 흐름</p><h2>이벤트는 일이고, 핸들러는 반응하는 함수입니다</h2><ol className="connection-flow"><li><b>클릭 발생</b><span>브라우저가 Event를 만듭니다.</span></li><li><b>리스너 확인</b><span>addEventListener로 등록한 함수를 찾습니다.</span></li><li><b>Handler 실행</b><span>함수가 이벤트를 받아 화면이나 상태를 바꿉니다.</span></li><li><b>기본 동작과 전파</b><span>필요하면 기본 동작을 막거나, 부모까지 전달되는 흐름을 조절합니다.</span></li></ol></section><section className="connection-callout"><h2>헷갈리기 쉬운 두 메서드</h2><p><code>preventDefault()</code>는 링크 이동이나 폼 제출 같은 <b>기본 동작</b>을 막습니다. <code>stopPropagation()</code>은 이벤트가 부모 요소로 퍼지는 <b>전파</b>를 멈춥니다. 같은 일이 아닙니다.</p></section>
    </>;
    case 'html-dom': return <>
      <section className="connection-lesson"><p className="lesson-kicker">파일에서 화면으로</p><h2>HTML을 읽으면 DOM이 만들어집니다</h2><div className="html-dom-flow"><div><b>HTML 소스</b><pre className="code">&lt;main&gt;\n  &lt;h1&gt;안녕하세요&lt;/h1&gt;\n&lt;/main&gt;</pre></div><span>브라우저가 읽어 해석</span><div><b>DOM 구조</b><pre className="code">document\n└─ main\n   └─ h1</pre></div><span>JavaScript로 읽고 수정</span></div><p>HTML은 문서에 적어 둔 구조이고, DOM은 브라우저가 실행 중인 문서를 객체로 표현한 결과입니다.</p></section>
    </>;
    case 'spa-mpa': return <>
      <section className="connection-lesson"><p className="lesson-kicker">같은 링크 클릭, 다른 전환 방식</p><h2>페이지를 바꿀 때 무엇을 새로 받는가</h2><div className="spa-mpa-compare"><article><h3>MPA</h3><ol><li>링크를 클릭합니다.</li><li>서버에 새 문서를 요청합니다.</li><li>새 HTML 문서를 받아 표시합니다.</li></ol></article><article><h3>SPA</h3><ol><li>링크를 클릭합니다.</li><li>JavaScript가 화면 전환을 처리합니다.</li><li>필요한 데이터와 컴포넌트만 바꿉니다.</li></ol></article></div><p>SPA가 최신이고 MPA가 구식이라는 뜻은 아닙니다. 또한 SPA와 CSR, MPA와 SSR을 각각 같은 말로 묶을 수도 없습니다.</p></section>
    </>;
    case 'var-let-const': return <>
      <section className="connection-lesson"><p className="lesson-kicker">코드에서 먼저 보기</p><h2>새 코드에서는 const와 let부터 생각합니다</h2><pre className="code">const title = '소개'; // 다른 값으로 바꾸지 않을 때\nlet page = 1;          // 나중에 값을 바꿀 때\nvar legacy = true;     // 기존 코드에서 규칙을 이해하며 다룰 때</pre><div className="declaration-table" role="region" aria-label="var let const 비교표"><table><thead><tr><th>선언</th><th>스코프</th><th>재선언</th><th>재할당</th><th>권장</th></tr></thead><tbody><tr><th>var</th><td>함수</td><td>가능</td><td>가능</td><td>기존 코드 이해</td></tr><tr><th>let</th><td>블록</td><td>불가</td><td>가능</td><td>값이 바뀔 때</td></tr><tr><th>const</th><td>블록</td><td>불가</td><td>불가</td><td>기본 선택</td></tr></tbody></table></div><p><code>let</code>과 <code>const</code>도 선언 전에 접근할 수 없다는 TDZ 규칙이 있습니다. <code>const</code>는 객체 자체의 재할당을 막을 뿐, 객체 속성까지 자동으로 얼리지는 않습니다.</p></section>
    </>;
    default: return null;
  }
}

function MissionContext({ connection }: { connection: Connection }) {
  return <section className="connection-missions"><h2>미션 맥락</h2>{connection.missionLinks.map(link => {
    const refs = connection.terms.flatMap(termId => (termById.get(termId)?.missionRefs ?? []).filter(ref => `${ref.course}-${ref.mission.toLowerCase()}` === link.missionId).map(ref => ({ termId, ref })));
    return <article key={link.missionId}><h3>{missionLabel(link.missionId)}</h3><p>{link.note}</p>{refs.length > 0 && <ul>{refs.map(({ termId, ref }, index) => <li key={`${termId}-${index}`}><Link to={`/terms/${termId}`}>{termById.get(termId)?.termKo}</Link> · {statusLabel[ref.source_status]} — {ref.context}</li>)}</ul>}</article>;
  })}</section>;
}

export function ConnectionsList() {
  return <section className="connections-page" aria-labelledby="connections-title"><p className="eyebrow">기술 용어 연결</p><h1 id="connections-title">개념 연결</h1><p className="connections-intro">지도는 기술의 위치를 보여주고, 개념 연결은 왜 함께 등장하는지와 무엇이 다른지를 설명합니다.</p><div className="connections-grid">{connections.map(connection => <Link className="connection-card" key={connection.id} to={`/connections/${connection.id}`}><span>{connection.type}</span><h2>{connection.title}</h2><p>{connection.question}</p><small>{connection.terms.map(id => termById.get(id)?.termKo).filter(Boolean).join(' · ')}</small><b>연결 이해하기 →</b></Link>)}</div></section>;
}

export function ConnectionDetail() {
  const { connectionId = '' } = useParams();
  const connection = connections.find(item => item.id === connectionId);
  if (!connection) return <section><h1>안내</h1><p className="notice">찾으려는 개념 연결이 없습니다.</p><Link to="/connections">개념 연결 목록으로 이동</Link></section>;
  return <article className="connection-detail"><p className="eyebrow">개념 연결 · {connection.type}</p><Link className="connection-back" to="/connections">← 개념 연결 목록</Link><h1>{connection.title}</h1><p className="connection-question">{connection.question}</p><p className="summary">{lessonSummary[connection.id] ?? connection.summary}</p><ConnectionLesson connection={connection} /><section><h2>핵심 설명</h2><p className="multi">{connection.sections[0]?.body}</p></section>{connection.sections.slice(1).map(section => <section key={section.heading}><h2>{section.heading}</h2><p className="multi">{section.body}</p></section>)}<section><h2>무엇을 혼동하기 쉬운가</h2><ul className="connection-misconceptions">{connection.misconceptions.map(item => <li key={item}>{item}</li>)}</ul></section><section><h2>관련 용어</h2><ConnectionTerms ids={connection.terms} /></section><MissionContext connection={connection} /><details className="connection-technical-relations"><summary>기술 관계 보기</summary><ConnectionDiagram connection={connection} /></details></article>;
}

export function connectionsForTerm(termId: string): Connection[] { return connections.filter(connection => connection.terms.includes(termId)); }
