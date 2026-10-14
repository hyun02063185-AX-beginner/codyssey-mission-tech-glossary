import { Link, useParams } from 'react-router-dom';
import awsNetworkRolesSvg from '../drafts/b3-1-content/assets/aws-network-roles.svg?raw';
import connectionSource from './data/generated/concept-connections.json';
import glossarySource from './data/generated/glossary.json';
import { missionLabel } from './encyclopedia';

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

function AwsNetworkRolesFigure() {
  return <figure className="rich-figure network-roles-figure"><div className="rich-svg-scroll" aria-label="AWS 네트워크 구조도는 가로로 스크롤해 자세히 볼 수 있습니다."><div className="rich-svg" dangerouslySetInnerHTML={{ __html: awsNetworkRolesSvg }} /></div><figcaption>VPC 안의 Public Subnet·EC2, Subnet에 연결된 Route Table, EC2 네트워크 인터페이스에 적용된 Security Group의 관계</figcaption></figure>;
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
    case 'network-aws-role-comparison': return <>
      <section className="connection-lesson network-roles-overview"><p className="lesson-kicker">한눈에 보기 — 구조도</p><h2>VPC 안에서 어떤 것들이 어디에 붙는가</h2><AwsNetworkRolesFigure/><ol className="connection-flow"><li><b>포함 관계</b><span>Internet Gateway는 VPC와 인터넷 경계에 걸쳐 있고, Public Subnet은 VPC 안, EC2는 Subnet 안에 있습니다.</span></li><li><b>붙는 대상</b><span>Route Table은 Subnet에 연결되고, Security Group은 Subnet이 아니라 EC2의 네트워크 인터페이스에 적용됩니다.</span></li><li><b>두 갈래 접속</b><span>HTTP는 웹 요청, SSH는 관리자용 요청입니다. 같은 IGW를 지나도 Security Group이 포트와 출처로 따로 판단합니다.</span></li></ol></section>
      <section className="connection-lesson network-role-comparison"><p className="lesson-kicker">역할을 두 열로 읽기</p><h2>일반 네트워크와 AWS의 역할 대응</h2><div className="connection-table-wrap" role="region" aria-label="일반 네트워크와 AWS 역할 비교표" tabIndex={0}><table><thead><tr><th>일반 네트워크</th><th>AWS 네트워크 역할</th></tr></thead><tbody><tr><th>내부 논리 네트워크</th><td><Link to="/terms/virtual-private-cloud">VPC</Link></td></tr><tr><th>주소 대역으로 나눈 구역</th><td><Link to="/terms/subnet">Subnet</Link> / <Link to="/terms/public-subnet">Public Subnet</Link></td></tr><tr><th>목적지별 길 안내표</th><td><Link to="/terms/route-table">Route Table</Link></td></tr><tr><th>인터넷 경계의 출입구</th><td><Link to="/terms/internet-gateway">Internet Gateway</Link></td></tr><tr><th>서버 접근 통제</th><td><Link to="/terms/security-group">Security Group</Link></td></tr><tr><th>웹 서버</th><td><Link to="/terms/amazon-ec2">EC2</Link> + <Link to="/terms/nginx">Nginx</Link></td></tr></tbody></table></div></section>
      <section className="connection-lesson"><h2>헷갈리기 쉬운 세 가지</h2><div className="connection-table-wrap" role="region" aria-label="AWS 네트워크 역할과 흔한 오해" tabIndex={0}><table><thead><tr><th>요소</th><th>역할</th><th>흔한 오해</th></tr></thead><tbody><tr><th>Internet Gateway</th><td>인터넷으로 통하는 문</td><td>방화벽이 아닙니다. 문이 있다고 아무나 들어오는 것은 아닙니다.</td></tr><tr><th>Route Table</th><td>그 문으로 갈지 정하는 길 안내표</td><td>문 자체가 아닙니다. <code>0.0.0.0/0 → IGW</code> 규칙이 없으면 문이 있어도 안 쓰입니다.</td></tr><tr><th>Security Group</th><td>서버에 들어와도 되는지 검사하는 출입 통제</td><td>Subnet이 아니라 서버의 네트워크 인터페이스 단위입니다. 구성도에서도 서버를 감싸는 형태로 표현합니다.</td></tr></tbody></table></div></section>
      <section className="connection-callout"><h2>일반 네트워크와 다른 점</h2><p>일반 사내망에서는 방화벽이 보통 망 경계의 전용 장비에 있습니다. 반면 AWS의 Security Group은 서버마다 따로 붙는 상태 기반 가상 방화벽입니다. 따라서 일반 방화벽과 Security Group을 같은 위치에 대응시킨 그림은 역할을 비교하기 위한 단순화이며, 실제 적용 단위는 다릅니다.</p></section>
      <section className="connection-lesson network-request-flow"><p className="lesson-kicker">B3-1 실제 요청 흐름</p><h2>브라우저에서 React 정적 파일까지</h2><ol className="connection-flow"><li><b>브라우저</b><span>Public IPv4로 HTTP 요청을 보냅니다.</span></li><li><b>Internet Gateway</b><span>VPC와 인터넷 사이의 통로입니다.</span></li><li><b>Route Table</b><span><code>0.0.0.0/0 → IGW</code> 규칙이 인터넷 방향을 선택합니다.</span></li><li><b>Public Subnet</b><span>해당 경로에 연결된 네트워크 구획입니다.</span></li><li><b>Security Group</b><span>HTTP 80 허용 여부를 EC2의 네트워크 인터페이스에서 검사합니다.</span></li><li><b>EC2의 Nginx</b><span>React <code>dist/</code> 정적 파일을 응답합니다.</span></li></ol><p>SSH는 HTTP와 분리한 관리 접속입니다. 22번 포트는 현재 공인 IP 하나(<code>/32</code>)만 허용합니다. 또한 Public Subnet은 이름만으로 결정되지 않고 IGW 경로, Public IPv4, Security Group 조건이 함께 필요합니다.</p></section>
      <section className="connection-lesson"><h2>브라우저 요청이 Nginx에 닿으려면</h2><p>네 가지가 모두 필요합니다. 하나라도 빠지면 보통은 똑같이 “응답 없음”으로 보입니다.</p><div className="connection-table-wrap" role="region" aria-label="웹 요청 도달 조건" tabIndex={0}><table><thead><tr><th>조건</th><th>어디서 확인하나</th><th>빠지면</th></tr></thead><tbody><tr><th>EC2에 Public IPv4가 있음</th><td>EC2 인스턴스 정보</td><td>인터넷에서 서버를 부를 주소가 없습니다.</td></tr><tr><th><code>0.0.0.0/0 → IGW</code> 경로</th><td>Route Table과 Subnet 연결</td><td>인터넷으로 가는 길을 선택하지 못합니다.</td></tr><tr><th>Security Group이 HTTP 80 허용</th><td>인바운드 규칙</td><td>요청이 EC2에 닿기 전에 막힙니다.</td></tr><tr><th>Nginx가 80번에서 실행</th><td>EC2 내부</td><td>규칙은 열렸지만 응답할 프로그램이 없습니다.</td></tr></tbody></table></div><p>Public Subnet은 이름만으로 결정되지 않습니다. 위 경로와 Public IPv4, Security Group 조건을 함께 확인하고, EC2 내부 방화벽도 별도로 확인합니다.</p></section>
      <section className="connection-lesson"><h2>SSH 관리 접속은 별개입니다</h2><div className="connection-table-wrap" role="region" aria-label="HTTP와 SSH 접속 비교" tabIndex={0}><table><thead><tr><th></th><th>웹 접속 (HTTP)</th><th>관리 접속 (SSH)</th></tr></thead><tbody><tr><th>누가</th><td>웹 사이트를 보는 누구나</td><td>관리자만</td></tr><tr><th>포트</th><td>80</td><td>22</td></tr><tr><th>Security Group 출처</th><td><code>0.0.0.0/0</code></td><td>현재 공인 IP <code>/32</code></td></tr><tr><th>서버 안의 받는 쪽</th><td>Nginx</td><td>sshd</td></tr><tr><th>인증</th><td>없음(공개 웹페이지)</td><td>Key Pair</td></tr></tbody></table></div><p>두 접속은 같은 Internet Gateway와 Route Table을 쓰지만, 같은 Security Group 안에서도 포트와 출처를 다르게 적습니다.</p></section>
      <section className="connection-callout"><h2>그림을 실제 구조와 같다고 오해하지 않기</h2><p>IPv4에서 Internet Gateway는 Public IPv4와 사설 IP를 1:1로 변환합니다. 따라서 서버 안에서는 사설 IP가 보입니다. 그림의 Route Table은 Subnet에 연결된 규칙표이며 패킷이 표 자체를 통과하지는 않습니다. Security Group은 EC2를 감싸 보이도록 그렸지만 실제 적용 단위는 네트워크 인터페이스입니다. Network ACL, NAT Gateway, Private Subnet, 로드 밸런서는 이 그림에서 생략했습니다.</p></section>
      <section className="connection-lesson"><h2>이해 확인 질문</h2><ol><li>Internet Gateway를 VPC에 붙였는데 접속이 안 됩니다. 무엇을 두 가지 이상 확인해야 하나요?</li><li>Security Group을 “Subnet 전체에 걸린 방화벽”으로 그리면 무엇이 틀리나요?</li><li>HTTP와 SSH는 같은 Security Group을 쓰는데 왜 출처를 다르게 적나요?</li><li>사내 방화벽 장비와 Security Group을 같은 것이라고 하면 어디가 부정확한가요?</li></ol></section>
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
  const hasCompleteLesson = connection.id === 'network-aws-role-comparison';
  return <article className="connection-detail"><p className="eyebrow">개념 연결 · {connection.type}</p><Link className="connection-back" to="/connections">← 개념 연결 목록</Link><h1>{connection.title}</h1><p className="connection-question">{connection.question}</p><p className="summary">{lessonSummary[connection.id] ?? connection.summary}</p><ConnectionLesson connection={connection} />{!hasCompleteLesson && <><section><h2>핵심 설명</h2><p className="multi">{connection.sections[0]?.body}</p></section>{connection.sections.slice(1).map(section => <section key={section.heading}><h2>{section.heading}</h2><p className="multi">{section.body}</p></section>)}<section><h2>무엇을 혼동하기 쉬운가</h2><ul className="connection-misconceptions">{connection.misconceptions.map(item => <li key={item}>{item}</li>)}</ul></section></>}<section><h2>관련 용어</h2><ConnectionTerms ids={connection.terms} /></section>{!hasCompleteLesson && <MissionContext connection={connection} />}<details className="connection-technical-relations"><summary>기술 관계 보기</summary><ConnectionDiagram connection={connection} /></details></article>;
}

export function connectionsForTerm(termId: string): Connection[] { return connections.filter(connection => connection.terms.includes(termId)); }
