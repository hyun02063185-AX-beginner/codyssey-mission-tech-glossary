import {Link} from 'react-router-dom';
import {conceptHref,type B31SceneId,type B31LectureId} from '../b31StoryNavigation';
import './foundations.css';

const cards={
 'scene-01':{id:'A',title:'먼저 알아 두기 · IP 주소와 서브넷',checks:['이 예시에서 웹 서버의 IP 주소는 왜 필요할까요?','인터넷에서 경로를 찾는 주소는 어느 쪽이며, 주소 외에 어떤 접속 조건이 필요할까요?'],answers:['웹 서버의 네트워크 인터페이스를 찾아갈 목적지 번호가 필요합니다.','공인 IP가 인터넷 라우팅에 쓰입니다. 경로·허용 규칙·응답하는 서비스가 함께 필요합니다.'],instructor:'IPv4 숫자 네 개 → 공인·사설 주소 → 구역별 주소 범위를 짚고, 경로와 접속 허용 조건을 따로 확인합니다.'},
 'scene-02':{id:'B',title:'먼저 알아 두기 · 패킷과 프로토콜',checks:['요청 패킷의 출발지·목적지 IP와 TCP의 두 포트를 각각 짚어 보세요.','TCP로 전달됐다는 사실만으로 웹 요청이 성공했다고 말할 수 있을까요?'],answers:['방문자 198.51.100.25 → 서버 자리의 문서용 주소 203.0.113.10, TCP 임시 포트 51514 → 서버 포트 80입니다.','TCP는 재전송·순서 복원으로 신뢰성 있는 전달을 제공하지만, 연결 실패나 HTTP 오류 응답·업무 실패까지 없애지는 않습니다.'],instructor:'IP → TCP → HTTP의 겹을 짚습니다. V2는 HTTP 80 실습 예시이며, 기존 요청·응답 그림은 HTTPS 443임을 구분합니다.'},
 'scene-03b':{id:'C',title:'기초 개념이 B3-1에서 쓰인 곳',checks:['Public Subnet 안의 EC2가 사설 IP도 가지는 이유를 설명해 보세요.','Security Group의 TCP 80에서 TCP와 80은 각각 무엇일까요?'],answers:['Public은 IGW로 가는 경로의 분류입니다. EC2는 ENI의 사설 주소를 쓰고, 이 IPv4 사례에서는 IGW가 공인 주소와 변환합니다.','TCP는 전송 프로토콜이고 80은 웹 서버의 수신 포트입니다.'],instructor:'표의 각 줄을 기존 그림의 ①~⑥과 연결합니다. 공인 주소·경로·보안 규칙·서버 수신이 함께 필요한지 확인합니다.'},
} as const;

function AddressVisual(){return <figure className="b31f-visual" aria-labelledby="b31f-address-title" data-foundation-visual="V1">
 <figcaption id="b31f-address-title"><span>V1 · IPv4 예시</span><strong>찾아갈 번호, 주소의 종류, 구역의 범위</strong></figcaption>
 <div className="b31f-address-grid">
  <section className="b31f-tile"><h4>01 · IP 주소</h4><p>네트워크에서 상대를 찾아갈 번호</p><div className="b31f-octets" aria-label="203.0.113.10">{['203','0','113','10'].map((n,i)=><span key={i}>{n}</span>)}</div><p>IPv4는 0~255의 숫자 네 개로 씁니다. 주소는 정확히는 기기의 네트워크 인터페이스에 붙습니다.</p><small>203.0.113.10은 공인 주소의 자리를 대신하는 문서용 예시이며 실제 접속 주소가 아닙니다.</small></section>
  <section className="b31f-tile"><h4>02 · 공인 주소와 사설 주소</h4><div className="b31f-address-pair"><div><b>공인 IP</b><code>203.0.113.10</code><span>인터넷 라우팅에 쓰는 주소</span></div><div><b>사설 IP</b><code>172.16.10.10</code><span>내부망에서 쓰는 주소</span></div></div><p>사설 주소는 서로 다른 조직에서 재사용할 수 있고, 공용 인터넷에서는 직접 라우팅하지 않습니다.</p><p className="b31f-callout">공인 IP가 있어도 경로·보안 규칙·서버 수신 조건이 맞아야 접속됩니다.</p></section>
  <section className="b31f-tile"><h4>03 · 서브넷</h4><p>네트워크의 구역마다 정한 IP 주소 범위</p><ul className="b31f-zones"><li><b>DMZ</b><code>172.16.10.0/24</code></li><li><b>자료 저장</b><code>10.20.30.0/24</code></li><li><b>업무망</b><code>192.168.10.0/24</code></li></ul><p>주소를 배정하고 구역별 경로·정책을 관리하기 쉽게 나눕니다. 나누는 것만으로 통신이 차단되지는 않습니다.</p></section>
 </div>
 <p className="b31f-note">Scene 01의 회사망 설명용 예시입니다. 세 구역은 서로 다른 사설 범위에서 골랐으며, 하나의 범위를 잘라 나눈 그림은 아닙니다. /24는 IPv4 주소 256개가 있는 범위 표기입니다.</p>
</figure>;}

function PacketVisual(){return <figure className="b31f-visual" aria-labelledby="b31f-packet-title" data-foundation-visual="V2">
 <figcaption id="b31f-packet-title"><span>V2 · IPv4 / HTTP 80</span><strong>요청 패킷의 정보를 겹으로 읽기</strong></figcaption>
 <div className="b31f-protocol-note"><b>이 그림: HTTP · TCP 80 실습</b><span>기존 요청·응답 그림: HTTPS · TCP 443</span><p>HTTPS 443 예시는 TCP 위에 TLS가 있고 HTTP 내용이 암호화됩니다. HTTP/3처럼 TCP를 쓰지 않는 방식도 있습니다.</p></div>
 <div className="b31f-packet-grid">
  <div className="b31f-envelope b31f-ip" data-layer="ip"><h4>IP · 주소로 전달</h4><p>목적지 주소를 따라 네트워크 사이로 전달합니다. 도착 자체를 보장하지는 않습니다.</p><dl className="b31f-fields"><div><dt>출발지 IP · 방문자</dt><dd><code>198.51.100.25</code></dd></div><div><dt>목적지 IP · 웹 서버의 공인 주소</dt><dd><code>203.0.113.10</code></dd></div></dl>
   <div className="b31f-envelope b31f-tcp" data-layer="tcp"><h4>TCP · 포트와 신뢰성</h4><dl className="b31f-fields"><div><dt>출발지 포트 · 클라이언트 임시 포트</dt><dd><code>51514</code></dd></div><div><dt>목적지 포트 · 웹 서버 측</dt><dd><code>80</code></dd></div></dl><p>포트로 통신할 프로그램을 구분합니다. 손실 시 재전송하고 순서를 복원해 바이트 스트림을 전달합니다.</p>
    <div className="b31f-envelope b31f-http" data-layer="http"><h4>HTTP · 요청과 응답의 의미</h4><span className="b31f-note">요청 일부</span><code>GET /</code><p>“홈페이지를 주세요.”<br/>서버는 HTTP 상태 코드와 내용으로 응답합니다.</p></div>
   </div>
  </div>
  <div className="b31f-observers"><h4>누가 무엇을 보나요?</h4><dl><div><dt>라우터</dt><dd>목적지 IP → 다음 경로 선택</dd></div><div><dt>방화벽 규칙</dt><dd>출발지·목적지 IP, 프로토콜·포트 → 허용 판단</dd></div><div><dt>NAT</dt><dd>IP 주소 변환. 이 요청에서는 목적지 <code>203.0.113.10</code>을 <code>172.16.10.10</code>으로 바꿉니다. 응답에서는 출발지 주소를 반대로 바꿉니다.</dd></div><div><dt>웹 서버</dt><dd>HTTP 요청을 읽고 응답</dd></div></dl><p className="b31f-callout">TCP는 암호화나 웹 업무의 성공을 보장하지 않습니다. 연결 실패나 HTTP 오류 응답도 생길 수 있습니다.</p></div>
 </div>
 <p className="b31f-note">정보의 포함 관계를 단순화한 그림입니다. HTTP 요청 하나가 항상 패킷 하나에 담기는 것은 아닙니다. 데이터는 여러 TCP 세그먼트·IP 패킷으로 나뉠 수 있고, 연결·확인용 TCP 패킷에는 HTTP 내용이 없을 수도 있습니다. 주소는 공인 주소의 자리를 대신한 문서용 예시이며 MAC 등 링크 계층 정보는 생략했습니다.</p>
</figure>;}

const rows=[
 ['주소 범위','VPC 10.0.0.0/16 안의 Subnet 10.0.1.0/24','③'],
 ['공인 ↔ 사설 IP','IGW가 Public IPv4 ↔ ENI의 Private IPv4를 1:1 NAT합니다. EC2 운영체제는 사설 주소만 봅니다.','② ④'],
 ['목적지 IP → 다음 경로','Route Table의 0.0.0.0/0 → IGW. 응답이 VPC 밖으로 나갈 다음 대상을 정하며, 허용·차단 규칙은 아닙니다.','③'],
 ['출발지·프로토콜·포트 → 허용','ENI에 적용되는 Security Group inbound: TCP 80 from 0.0.0.0/0. 별도로 서버의 수신·OS 방화벽 등도 확인합니다.','⑤'],
 ['웹 요청과 응답','Nginx가 TCP 80에서 HTTP 요청에 응답합니다.','① ⑥'],
];
function AwsComparison(){return <>
 <div className="b31f-table-wrap" role="region" aria-label="기초 개념과 AWS 구성 비교" tabIndex={0}><table><caption>2026-10-14 배포 기록 · B3-1이 고른 한 가지 구성</caption><thead><tr><th scope="col">기초 정보</th><th scope="col">B3-1의 AWS 구성</th><th scope="col">그림 번호</th></tr></thead><tbody>{rows.map(([label,value,no])=><tr key={label}><th scope="row">{label}</th><td>{value}</td><td>{no}</td></tr>)}</tbody></table></div>
 <p className="b31f-callout"><b>공인 IP ≠ Public Subnet.</b> Public Subnet은 IGW로 가는 직접 경로가 있는 Subnet입니다. 그 안의 EC2도 사설 IP를 가지며, IPv4로 인터넷에서 직접 접속하려면 공인 IP와 경로·보안 규칙·서버 수신 조건을 함께 갖춰야 합니다.</p>
 <p className="b31f-note">NAT는 주소를 변환하는 역할입니다. 일반 NAT는 포트 변환을 함께 할 수도 있고 모두 1:1인 것은 아닙니다. B3-1의 IGW는 1:1 NAT를 제공하며, 별도 서비스인 NAT Gateway는 이 배포에서 만들지 않았습니다. 현재 AWS 자원 상태를 뜻하지 않습니다.</p>
 </>;}

export default function B31Foundations({scene,origin=scene}:{scene:B31SceneId;origin?:B31LectureId}){
 const card=cards[scene as keyof typeof cards];if(!card)return null;
 const links=scene==='scene-01'?[['공인·사설 IP 관계','rel=SH01'],['서브넷과 주소 범위','view=aws&node=aws%3Asubnet']]:scene==='scene-02'?[['요청의 경로','view=general&flow=GF01'],['포트와 허용 규칙','view=aws&node=aws%3Asecurity-group']]:[['IGW의 주소 변환','view=aws&node=aws%3Aigw'],['AWS 접속 경로','view=aws&flow=AF01']];
 const terms=scene==='scene-01'?[['public-ip','공인 IP'],['subnet','서브넷'],['cidr','CIDR']]:scene==='scene-02'?[['tcp','TCP'],['http','HTTP'],['socket-port','포트']]:[['internet-gateway','IGW'],['security-group','Security Group']];
 return <details className="b31f-card" data-foundation-card={card.id}>
  <summary><span className="b31f-kicker">네트워크 기초 · {card.id}</span><strong>{card.title}</strong><span className="b31f-disclosure" aria-hidden="true">＋</span></summary>
  <div className="b31f-body">
   {scene==='scene-01'?<><p className="b31f-lead">연결된 기기들이 데이터를 주고받는 체계가 네트워크입니다. 상대를 찾을 때는 IP 주소를, 구역을 나눌 때는 서브넷을 살펴봅니다.</p><AddressVisual/></>:scene==='scene-02'?<><p className="b31f-lead">프로토콜은 데이터를 어떤 형식과 절차로 주고받을지 정한 약속입니다. IP·TCP·HTTP는 한 통신에서 서로 다른 역할을 맡습니다. ‘도착 주소·출발 주소’는 패킷의 IP 정보입니다.</p><PacketVisual/></>:<AwsComparison/>}
   <section className="b31f-checks" aria-label="기초 이해 확인"><h4>짧게 확인해 보세요</h4><ol>{card.checks.map(q=><li key={q}>{q}</li>)}</ol></section>
   <nav className="b31f-links" aria-label="기초 개념 더 알아보기">{links.map(([label,query])=><Link key={query} to={conceptHref(query,origin)}>{label} · 기존 지도 →</Link>)}{terms.map(([id,label])=><Link key={id} to={`/terms/${id}?${new URLSearchParams({'b31-map':`scene=${origin}`})}`}>{label} · 용어사전 →</Link>)}{scene==='scene-01'&&<Link to="/missions/main-M05/guide/02-network-aws-map">주소 범위 · 학습가이드 2장 →</Link>}{scene==='scene-03b'&&<Link to="/missions/main-M05/guide/03-internet-path">Public Subnet · 학습가이드 3장 →</Link>}</nav>
   <p className="b31f-instructor"><b>강사용 한 줄 안내</b> {card.instructor}</p><details className="b31f-answers"><summary>강사용 기대 답</summary><ol>{card.answers.map(a=><li key={a}>{a}</li>)}</ol></details>
  </div>
 </details>;
}
