# B3-1 보강 자료 — 자체 QA 기록

> 작성 담당: Claude Code(콘텐츠 제작). 확인일: 2026-10-19. 기준 저장소 상태: `main` `0323066`에서 분기한 `content/b3-1-enterprise-network-supplement`.
> 이 기록은 **자체 QA**입니다. GPT의 독립 콘텐츠 검토, Owner 승인, 웹 통합, 공개 화면 확인을 대신하지 않습니다.

## 작업 전 확인한 것

| 항목 | 확인한 내용 |
| --- | --- |
| 절차 | `AGENTS.md`, [작업 절차](../../../../docs/mission-guides/workflow.md), [B3-1 인수인계](../../../../docs/mission-guides/b3-1-status.md), [독립 검토 기록](../../../../docs/mission-guides/b3-1-independent-review.md)을 읽었다. 이번 작업은 절차의 2단계(콘텐츠 제작)이며 로컬 커밋까지만 한다. |
| 현재 B3-1 가이드 | [2장](../chapters/02-network-aws-map.md), [3장](../chapters/03-internet-path.md), [README](../README.md), [강사 노트](../instructor-notes.md), 기존 SVG [aws-network-roles](../assets/aws-network-roles.svg)·[cidr-range](../assets/cidr-range.svg)를 읽었다. |
| 기존 QA 기록 | [qa-draft](../qa-draft.md), [qa-web](../qa-web.md), [author-review](../author-review.md)를 읽었다. |
| 저장소 상태 | `main`은 `origin/main`과 같았고(`0323066`, PR #4·#5·#6 병합 이후) 작업 트리는 깨끗했다. `gh` CLI가 없어 PR 목록은 조회하지 못했고, 병합 사실은 `git log`의 병합 커밋으로 확인했다. 원격의 열린 PR 상태는 **미확인**이다. |

## 변경 파일

모든 파일이 새 파일이며 `content/mission-guides/main-m05/supplement/` 아래에 있다.

| 파일 | 내용 |
| --- | --- |
| `README.md` | 원고. 장면 1~4, 확인 질문, 출처 |
| `assets/01-network-zones.svg` | 그림 1 전체 네트워크 구역도 |
| `assets/02-visitor-request-response.svg` | 그림 2 외부 방문자의 요청·응답 경로도 |
| `assets/03-staff-publish-flow.svg` | 그림 3 내부 직원의 작성·저장·공개 흐름도 |
| `assets/04-general-vs-b31-aws.svg` | 그림 4 일반 네트워크 역할과 B3-1 AWS 구성 비교도 |
| `assets/04b-b31-request-roundtrip.svg` | 그림 4 보충. IGW 양방향·SG 적용 위치·Route Table 위치를 분리해 그린 왕복도 |
| `instructor-notes.md` | 강사 노트 |
| `existing-material-review.md` | 기존 개념 연결 자료의 인바운드 경로 표현과 미션 ID 표기에 대한 수정 제안 |
| `qa.md` | 이 문서 |

**변경하지 않은 것:** 웹 라우트·컴포넌트, canonical 용어 목록, 관계·분류 데이터, 지식 지도, 배포 설정, 기존 B3-1 7장·SVG·QA 기록. `chapters/*.md`와 `assets/*.svg`만 읽는 기존 웹 로더(`src/b31GuideContent.ts`)는 이 새 폴더를 읽지 않는다.

그림 5종 중 “4 보충”은 요청이 아니라 **작업 판단으로 추가**했다. 네 번째 그림에 IGW 양방향·Route Table 분리까지 담으면 길이가 1,900 단위를 넘어 읽기 어려워 장면을 나눴다.

## 그림별 교육 목적

| 그림 | 교육 목적 | 구분해서 보여 준 것 |
| --- | --- | --- |
| 1 구역도 | 구역과 허용 규칙을 **이동 없이** 먼저 읽게 한다 | 위치=색 구역, 역할=상자 글, 허용=알약, 이동 방향=이 그림에는 없음 |
| 2 방문자 | 방화벽·NAT·경로표가 서로 다른 질문에 답함을 순서로 보인다 | 1~9 번호, 요청 실선/응답 점선, 허용 알약은 요청 방향에만 |
| 3 직원 | 같은 서브넷(스위치)과 다른 서브넷(게이트웨이→경로표→방화벽)을 대비하고, 저장≠공개를 보인다 | 1~13 번호, 12번은 웹 서버가 시작하는 반대 방향 |
| 4 비교 | 역할 대응과 **B3-1에 없는 구성**을 함께 보게 한다 | 점선 회색=없는 구성(게시 화면·DB·별도 파일 저장소). 서버 디스크의 `dist` 저장은 같은 칸에서 글로 분리, Public Subnet≠DMZ 상자 |
| 4 보충 | IGW 양방향, SG 적용 위치(ENI), Route Table이 요청 경로의 장비가 아님을 보인다 | Route Table 상자는 화살표에 이어지지 않음 |

## 검증한 사실

출처는 이번 작업에서 직접 열어 확인했다. “확인”은 해당 페이지 본문을 읽은 것이고, 원문 전체를 대조했다는 뜻이 아니다.

| 주장 | 근거 | 상태 |
| --- | --- | --- |
| DMZ는 내부·외부 네트워크 사이의 경계 구간 / “중립 지대” / 라우팅 방화벽의 인터페이스 / 방화벽 두 대를 연결한 네트워크 등 여러 정의가 있다 | [NIST CSRC 용어집 DMZ](https://csrc.nist.gov/glossary/term/demilitarized_zone) | 확인 |
| 라우터·방화벽 배치는 하나가 아니며 NIST 문서도 여러 형태를 든다 | 같은 용어집의 정의 목록. SP 800-41 Rev.1 본문의 배치 절은 검색 결과 요약으로만 확인 | 부분 확인 |
| IGW는 VPC와 인터넷 사이의 **양방향** 통신을 가능하게 하며, IPv4에서 NAT를 수행한다. 인터넷의 자원도 Public IPv4로 연결을 시작할 수 있다 | [AWS 인터넷 게이트웨이](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) | 확인 |
| IGW로 가는 경로가 있는 Route Table에 연결된 Subnet이 Public Subnet이다. 경로가 없으면 Public IP가 있어도 인터넷과 통신할 수 없다 | 같은 문서 | 확인 |
| IPv4 통신에는 인스턴스의 Public IPv4가 필요하고, 들어오는 트래픽의 목적지는 사설 IPv4로 변환되며 나가는 트래픽의 출발 주소는 Public IPv4가 된다 | 같은 문서 | 확인 |
| Route Table은 서브넷 또는 게이트웨이에서 **나오는** 트래픽의 방향을 정하는 규칙(목적지+대상)의 집합이다 | [AWS Route table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html), [VPC 동작 방식](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html) | 확인 |
| Security Group은 연결된 자원(EC2)에 드나드는 트래픽을 통제하고, stateful이며 허용된 인바운드의 응답은 아웃바운드 규칙과 무관하게 나간다 | [AWS Security group](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html) | 확인 |
| SG가 **네트워크 인터페이스**에 적용된다 | 위 문서는 “자원에 연결”이라고만 쓴다. ENI 적용은 [기존 검토 기록](../../../../drafts/b3-1-content/review.md)이 AWS EC2 문서로 검증했다고 적었으나 이번에 해당 페이지를 다시 열지는 않았다 | 기존 기록 인용 |
| Subnet의 `.1`은 VPC 라우터용으로 AWS가 예약한다. 앞 4개와 마지막 1개 주소는 사용할 수 없다 | [AWS Subnet CIDR](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html) | 확인 |
| B3-1: VPC `10.0.0.0/16`, Subnet `10.0.1.0/24`, IGW 연결, `0.0.0.0/0 → IGW`를 Subnet에 명시적 연결, SG inbound 80 `0.0.0.0/0`·22 작업자 `/32`, outbound all, 사설 `10.0.1.149`, 자동 할당 Public IPv4, Nginx가 `/var/www/b3-1`에 `dist` 배치 | `Codyssey_B3-1` 고정 커밋 `c689299…`의 [배포 작업 기록](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/docs/deployment-log-2026-10-14.md)을 `raw.githubusercontent.com`에서 받아 대조 | 확인 |
| Nginx가 TCP 80에서 `root /var/www/b3-1`을 제공하고 `/` 요청은 `try_files`로 처리한다 | 같은 커밋의 [nginx.conf](https://github.com/hyun02063185-AX-beginner/Codyssey_B3-1/blob/c68929943f1904a5c7c8033d2d49a30ace56e3d1/deploy/b3-1/nginx.conf) | 확인 |
| B3-1 기록에 직원 업무망·관리 화면·DB·별도 DMZ·내부 방화벽이 없다 | 위 배포 작업 기록의 작업 순서에 해당 항목이 없음(없는 것의 증명은 기록 범위 안에서만 성립) | 기록 범위 내 확인 |
| CISA가 망 분리·DMZ·방화벽을 다루며 인포그래픽이 엔지니어링 도면이 아니라고 밝힌다 | 검색 결과 요약으로만 확인. CISA 원문 페이지·PDF는 직접 열지 못함 | **부분 확인** |

## 일반 지식이며 출처와 직접 대조하지 못한 항목

스위치·기본 게이트웨이·NIC의 일반 정의, “목적지가 자기 서브넷 밖이면 기본 게이트웨이로 보낸다”, 사설 IP 범위(RFC 1918)와 문서용 주소(RFC 5737), 연결 상태를 기억하는 방화벽·NAT의 응답 처리, 방화벽 허용 규칙을 “연결 시작 방향”으로 읽는 설명, NAT가 허용 판단이 아니라 주소 대응이라는 구분. 모두 널리 쓰이는 설명이지만 이번에 원문(RFC·NIST 본문)과 한 줄씩 대조하지는 않았다.

## 화면·가독성 검증

| 검사 | 방법 | 결과 |
| --- | --- | --- |
| SVG 구문 | Python `xml.etree`로 5개 파일 파싱 | 통과 |
| 글자 크기 | 모든 `font-size`의 최솟값 확인 | 최소 13 단위(5개 모두) |
| 가로 크기 | `viewBox` 가로 360 단위. 390px 화면의 좌우 16px 여백 안에 들어가도록 설계 | 설계 확인 |
| 390px 렌더링 | Playwright가 설치한 Chromium headless shell로 각 SVG를 창 폭 390px·2배 해상도로 열어 PNG를 만들고 눈으로 확인 | 5개 모두 글자 잘림·겹침 없음. 처음 렌더링에서 “허용/차단” 알약 글자가 테두리에 닿아 알약 폭을 넓히고 글자를 13 단위로 올린 뒤 다시 확인 |
| 색 의존 | 허용/차단은 체크·엑스 모양과 점선 테두리와 글자, 요청/응답은 실선·점선으로 구분 | 흑백으로 봐도 구분되도록 설계(흑백 렌더링 확인은 하지 않음) |
| 대체 설명 | 각 SVG에 `<title>`·`<desc>`, 본문에 대체 설명 | 있음 |
| 큰 보기 | 본문의 `[그림 크게 열기]` 링크 | 5개 있음 |
| 금지 요소 | `<metadata>`(C2PA 등) | 0개. 기존 SVG와 달리 새 SVG에는 서명 메타데이터가 없음 |
| 링크 | 보강 문서의 상대 링크 대상 존재 확인 | 아래 “최종 확인” 참조 |
| 용어·표기 | 원고·강사 노트에 사용자에게 보이는 `M05` 표기 없음. 미션은 `B3-1`로 표기 | 통과(`existing-material-review.md`는 검토 대상을 설명하기 위해 `main-m05`·`M05`를 인용) |

## 표현 수정 이력 (2026-10-19, 초안 커밋 이후)

초안 커밋 뒤에 표현 두 가지를 바로잡았다. 그림 구성·장면 순서·학습 흐름은 바꾸지 않았다.

| 수정 | 이유 | 바꾼 곳 |
| --- | --- | --- |
| B3-1 “게시·저장”을 **없음**으로만 읽히지 않게 분리 | 직원용 게시 화면·DB·별도 파일 저장소는 없지만, 빌드된 `dist` 정적 파일은 EC2 서버 디스크(`/var/www/b3-1`)에 저장되어 Nginx가 제공한다. “없음”만 쓰면 저장 자체가 없다는 뜻으로 읽힌다 | `README.md` 비교표·그림 4 대체 설명, `04-general-vs-b31-aws.svg`(칸 글·`<desc>`·읽는 법), `instructor-notes.md`(5단계·오해 표) |
| “같은 연결(길)로 되돌아간다”를 “요청의 반대 방향” 중심으로 고침 | 허용된 연결의 응답이 반대 방향으로 간다는 뜻은 유지하되, 모든 기업망에서 응답이 요청과 같은 물리 경로·장비 순서를 지난다는 일반화는 하지 않는다 | `README.md`(장면 1·2·3), `01`~`04b` SVG의 글·`<desc>`, `instructor-notes.md`, `existing-material-review.md`의 제안 문구 |

수정 후 확인:

| 검사 | 방법 | 결과 |
| --- | --- | --- |
| 문맥 | 바꾼 문구의 앞뒤 문장, 이 문서의 그림 4 목적·렌더링 행, 강사 노트의 같은 표현을 읽고 어긋나는 곳을 함께 수정 | 남은 “되돌아”·“같은 길” 표현은 응답 방향이 아니라 주소 복원(NAT)·요청 경로를 가리키는 곳뿐 |
| 390px 렌더링 | Chrome 155(headless, 맑은 고딕 폴백)에서 창 폭 390px(좌우 16px 여백, 2배 해상도)로 SVG 5개를 다시 렌더링해 바뀐 영역을 눈으로 확인 | 5개 모두 글자 잘림·겹침 없음, 가로 넘침 없음 |
| 글자 상자 측정 | 같은 렌더링에서 모든 `<text>`의 `getBBox`로 뷰박스 이탈과 글자끼리 겹침을 수정 전·후 비교 | 5개 모두 이탈 0건·겹침 0건. 가장 긴 줄의 오른쪽 끝은 그림 4가 291.3→296.4(360 중)로 상자(348) 안 |
| SVG 구문·`git diff --check` | `xml.etree` 파싱, `git diff --check` | 통과 |

## 웹 통합 때 알아 둘 점 (이번 작업에서 변경하지 않음)

- 현재 B3-1 가이드의 그림 CSS는 `.b31-figure-scroll img { width: 520px }`로 **가로 520px 고정 + 가로 스크롤**이다. 이 보강 그림을 같은 CSS에 넣으면 360 단위 그림이 520px로 확대되어 390px 화면에서 가로 스크롤이 생긴다. 이 그림은 **컨테이너 폭에 맞추는 방식**(예: `max-width: 100%`, 데스크톱 최대 폭 지정)이 맞다. 웹 담당(Codex)의 판단 사항이다.
- 이 그림은 웹 페이지 안이 아니라 **독립된 SVG 파일로만 렌더링**해 확인했다. 사이트의 `<img>` 배경·다크 테마 안에서의 모습은 미검증이다. 각 SVG는 흰 배경을 스스로 그려 테마에 의존하지 않는다.

## 미검증 항목

- GPT 독립 콘텐츠 검토, Owner 승인. 웹 연결·공개 Pages 화면.
- NIST SP 800-41 Rev.1과 CISA 자료의 **원문 대조**(PDF를 텍스트로 추출하지 못해 용어집·검색 요약에 의존).
- B3-1 원본 미션의 필수·선택 조건, 현재 AWS 계정·서버 상태.
- 실물 휴대전화, 다크 테마, 흑백 출력, 화면 낭독기에서의 그림 대체 설명 읽기.
- `M05`가 사용자 화면에 노출되는 모든 위치(상세는 [수정 제안](existing-material-review.md)).
- 원격 PR의 현재 상태(`gh` 없음).

## 최종 확인

아래 항목은 커밋 직전에 실행한 결과다.

| 검사 | 결과 |
| --- | --- |
| 보강 문서 상대 링크 | 대상 파일 모두 존재 |
| `git diff --check` | 통과 |
| 변경 범위 | `content/mission-guides/main-m05/supplement/` 아래 신규 파일 9개뿐 |
