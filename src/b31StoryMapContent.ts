import scene01Desktop from '../drafts/b3-1-visual-story/scene-01/enterprise-network-desktop.svg?raw';
import scene01Mobile from '../drafts/b3-1-visual-story/scene-01/enterprise-network-mobile.svg?raw';
import scene02Desktop from '../drafts/b3-1-visual-story/scene-02/request-response-desktop.svg?raw';
import scene02Mobile from '../drafts/b3-1-visual-story/scene-02/request-response-mobile.svg?raw';
import scene03aDesktop from '../drafts/b3-1-visual-story/scene-03/network-aws-overview-desktop.svg?raw';
import scene03aMobile from '../drafts/b3-1-visual-story/scene-03/network-aws-overview-mobile.svg?raw';
import scene03bDesktop from '../drafts/b3-1-visual-story/scene-03/network-aws-access-desktop.svg?raw';
import scene03bMobile from '../drafts/b3-1-visual-story/scene-03/network-aws-access-mobile.svg?raw';
import type { B31SceneId } from './b31StoryNavigation';

export type StoryArt = { desktop: string; mobile: string; breakpoint: number; alt: string };
export type StoryScene = {
  id: B31SceneId; label: string; title: string; question: string; context: string;
  explanation: string[]; instructor: string; checks: string[];
  map: string; concepts: Array<{ label: string; query: string }>; art?: StoryArt;
};

// Explanations are excerpts from the existing SVG descriptions/design notes.
// Selection IDs are a teaching subset of concept-map.json storyScenes; see the integration report.
export const b31StoryScenes: StoryScene[] = [
  {
    id: 'scene-01', label: 'Scene 01', title: '일반 기업 네트워크 전체 구조',
    question: '일반 기업 네트워크는 어떻게 구성될까?',
    context: '설명용 일반 기업망 예시 · 실제 B3-1 AWS 구성이 아닙니다.',
    explanation: [
      '굵은 테두리 안이 회사 네트워크이며, 회사 안 세 구역은 각각 방화벽의 자기 연결 지점에만 연결됩니다.',
      '회색 선은 장비 사이의 실제 연결이며 통신 허용을 뜻하지 않습니다. 허용 여부는 방화벽 규칙이 정합니다.',
      '초록 실선 화살표는 방문자의 요청 하나만 보여 주며 응답은 생략했습니다. A1 방문자에서 인터넷, A2 인터넷에서 경계 라우터, A3 경계 라우터에서 방화벽, A4 방화벽에서 DMZ 스위치, A5 스위치에서 공개 웹 서버로 갑니다.',
    ],
    instructor: '회사 밖과 안의 경계 → 구역 1~5 → A1~A5를 짚어 주세요. NAT·길 안내·허용 판단 이름표를 구별하고, 장비 수와 배치는 기업마다 다름을 확인합니다.',
    checks: ['회색 연결선만 보고 통신이 허용된다고 말할 수 있을까요?', '방화벽이 맡는 길 안내·허용 판단과 NAT의 주소 변환을 구별해 설명해 보세요.'],
    map: 'view=general&node=gen%3Afirewall',
    concepts: [{ label: '방화벽의 역할', query: 'view=general&node=gen%3Afirewall' }, { label: '회사 안의 DMZ', query: 'view=general&rel=GN02' }],
    art: { desktop: scene01Desktop, mobile: scene01Mobile, breakpoint: 904, alt: '일반 기업망의 다섯 구역과 장비, 방문자 요청 A1~A5. NAT·경로 선택·허용 판단을 구분하는 설명용 그림' },
  },
  {
    id: 'scene-02', label: 'Scene 02', title: '웹사이트 요청·응답 흐름',
    question: '웹사이트 요청과 응답은 어떻게 흐를까?',
    context: 'Scene 01과 같은 기업망 예시 · HTTPS 443 · 주소는 이미 안다고 가정하며 DNS는 생략합니다.',
    explanation: [
      '초록 실선은 요청, 갈색 점선은 응답, 회색 선은 장비 사이의 실제 연결이며 통신 허용을 뜻하지 않습니다. 숫자 원은 설명 단계입니다.',
      '경로 선택은 허용 여부를 판단하지 않습니다. NAT는 허용·차단을 하지 않습니다. 허용 판단과 주소 변환의 처리 순서는 장비와 정책마다 다릅니다.',
      '응답은 허용된 연결의 응답이라 통과합니다. 웹 서버가 인터넷으로 새 연결을 먼저 시작할 수 있다는 뜻이 아닙니다.',
    ],
    instructor: '요청 A1~A5와 응답 R1~R5를 나눠 짚고 함께 비교합니다. 숫자는 설명 순서임을 확인하고, 실제 B3-1 배포 기록의 HTTP 80과 일반망 예시의 HTTPS 443을 구별합니다.',
    checks: ['요청과 응답을 선 모양·방향·표식으로 각각 찾아보세요.', '기존 연결의 응답과 웹 서버가 먼저 시작하는 새 연결은 어떻게 다를까요?'],
    map: 'view=general&flow=GF01',
    concepts: [{ label: '요청 A1~A5', query: 'view=general&flow=GF01' }, { label: '응답 R1~R5', query: 'view=general&flow=GF02' }, { label: '응답 통과의 근거', query: 'view=general&rel=GN28' }],
    art: { desktop: scene02Desktop, mobile: scene02Mobile, breakpoint: 904, alt: '일반 기업망의 HTTPS 요청 A1~A5와 응답 R1~R5, 설명 단계 1~8. 실제 처리 순서는 장비·정책에 따라 다름' },
  },
  {
    id: 'scene-03a', label: 'Scene 03-A', title: '일반 기업망과 AWS의 구조·역할 비교',
    question: '일반 기업망에서 하던 일을 AWS에서는 무엇이 맡을까?',
    context: '일반 기업망 예시와 B3-1 AWS의 비교 · AWS는 2026-10-14 배포 기록 기준이며 현재 상태가 아닙니다.',
    explanation: [
      '≈ 는 비슷한 역할일 뿐, 같은 장비·서비스가 아닙니다.',
      '경계 라우터와 IGW, DMZ와 Public Subnet은 비교선으로 잇지 않고 주의 카드로 설명합니다.',
      'B3-1에서 구현하지 않음: 직원 업무망·관리 화면 서버, DB 서버·파일 저장 서비스, 별도 DMZ, NAT Gateway·로드 밸런서. AWS에서 불가능하다는 뜻은 아닙니다.',
    ],
    instructor: '보라 비교선 6개와 주의 카드 4장을 번갈아 짚어 주세요. 같은 장비라고 대응시키지 않고, 공통 역할과 다른 점을 학습자의 말로 설명하도록 합니다.',
    checks: ['Route Table과 Security Group은 각각 어떤 역할과 비교할 수 있을까요?', 'DMZ와 Public Subnet을 같은 것으로 보면 안 되는 이유를 주의 카드에서 찾아보세요.'],
    map: 'rel=CR01',
    concepts: [{ label: '경로 결정 비교', query: 'rel=CR01' }, { label: '접근 통제 비교', query: 'rel=CR02' }, { label: '주소 변환 비교', query: 'rel=CR03' }],
    art: { desktop: scene03aDesktop, mobile: scene03aMobile, breakpoint: 960, alt: '기업망과 B3-1 AWS의 역할 비교선 6개와 주의 카드 4장. 경계 라우터와 IGW, DMZ와 Public Subnet은 같은 것이 아님' },
  },
  {
    id: 'scene-03b', label: 'Scene 03-B', title: 'B3-1 AWS 웹사이트 접속 조건',
    question: 'B3-1에서는 어떤 설정이 함께 있어야 방문자가 웹사이트에 접속할 수 있을까?',
    context: '실제 B3-1 · 2026-10-14 배포 기록의 HTTP 80 접속 · 현재 AWS 상태가 아닙니다.',
    explanation: [
      '요청은 방문자에서 인터넷, VPC 경계의 IGW, EC2의 ENI, EC2 안의 Nginx로 갑니다.',
      'Route Table과 Security Group은 요청이 지나가는 장비가 아니라 설정입니다. Route Table은 Public Subnet에 연결되고, Security Group은 ENI에 적용됩니다.',
      'Public Subnet이라는 이름만으로는 접속되지 않습니다. B3-1은 HTTP 80만 설정했고 HTTPS 443은 설정하지 않았습니다.',
    ],
    instructor: '초록 화살표 W1~W4와 회색 설정 점선을 따로 따라갑니다. 필요한 설정 ①~⑥을 그림에서 찾고, 실제 미션에서는 학습가이드로 구현·검증을 이어 갑니다.',
    checks: ['요청이 지나는 길과 그 길을 가능하게 하는 설정을 나눠 설명해 보세요.', '웹사이트가 열리지 않을 때 필요한 설정 ①~⑥ 중 무엇을 확인할지 말해 보세요.'],
    map: 'view=aws&flow=AF01',
    concepts: [{ label: 'HTTP 요청 W1~W4', query: 'view=aws&flow=AF01' }, { label: '경로 대상 IGW', query: 'view=aws&rel=AW07' }, { label: 'ENI에 적용되는 SG', query: 'view=aws&rel=AW08' }],
    art: { desktop: scene03bDesktop, mobile: scene03bMobile, breakpoint: 960, alt: 'B3-1의 HTTP 80 요청 W1~W4와 필요한 설정 ①~⑥. Route Table과 Security Group은 경유 장비가 아닌 설정' },
  },
  {
    id: 'scene-04', label: 'Scene 04', title: '인터랙티브 개념지도',
    question: '스토리에서 본 기술은 서로 어떤 관계일까?',
    context: '개념과 관계를 직접 선택하고, 관련 장면과 용어사전을 왕복하며 복습합니다.',
    explanation: ['일반망의 역할은 AWS에서 어떻게 구현될까요? 개념을 선택해 연결 이유와 차이를 읽어 보세요.', '선은 관계이며 통신이 허용된다는 뜻이 아닙니다. ≈는 비슷한 역할일 뿐 같은 장비·서비스가 아닙니다.'],
    instructor: '핵심 관계 하나를 선택해 설명한 뒤 학습자가 자유롭게 탐색하도록 합니다. 실습 결과와 핵심 기술의 역할을 자신의 말로 설명하게 합니다.',
    checks: ['일반망과 AWS에서 비슷한 역할 하나를 골라 공통점과 차이점을 설명해 보세요.', '실습 결과를 확인한 근거와 아직 설명하기 어려운 개념을 말해 보세요.'],
    map: '', concepts: [],
  },
];
