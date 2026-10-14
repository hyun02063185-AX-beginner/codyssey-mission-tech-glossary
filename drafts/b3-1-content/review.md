# B3-1 콘텐츠 Pilot — 검토 기록

- 브랜치: `claude/b3-1-content-pilot` (기준 `31b804f` = `origin/main`)
- 상태: **READY_FOR_OWNER_CONTENT_REVIEW** · 기존 `content/terms/*`, `data/**`, `src/**`는 **수정하지 않음**
- 이 문서는 원본 위치와 판단 근거만 적는다. 원고는 같은 폴더의 `ssh-key.md`, `cidr.md`, `network-aws-role-comparison.md`

## 1. 출처 구분

Notion "B3-1" 페이지는 미션 요구사항·결정 사항만 담고 있고 **학습자 질문 기록은 없다.** 그래서 "실제 질문"은 작업지시서가 학습 목표로 적은 항목으로 간주하고 `[작업지시]`로, 그 밖의 교육적 보완은 `[AI 보충]`으로 원고에 표시했다. 실제 질문 로그가 따로 있으면 태그를 바꿔야 한다.

## 2. 기술 검증

| 주장 | 근거 | 상태 |
|---|---|---|
| 개인키는 전송되지 않고, 클라이언트는 공개키와 서명만 보낸다 | RFC 4252 §7 | 검증 |
| 서명 대상에 세션 식별자·사용자 이름·서비스 이름·공개키 등이 들어간다(재사용 불가의 근거) | RFC 4252 §7 | 검증 |
| 호스트 키는 서버 신원용, `known_hosts`에 지문 기록, 바뀌면 경고 | OpenBSD `ssh(1)`, `sshd(8)` | 검증 |
| 다른 사용자가 접근 가능한 개인키 파일은 `ssh`가 무시한다 | OpenBSD `ssh(1)` | 검증 |
| `ssh -i`는 공개키 인증에 쓸 개인키 파일을 지정한다 | OpenBSD `ssh(1)` | 검증 |
| `authorized_keys`는 로그인을 허용할 공개키 목록 | OpenBSD `sshd(8)` | 검증 |
| EC2에서 공개키는 AWS에 저장, 개인키는 사용자가 보관, 개인키 저장 기회는 한 번 | AWS EC2 Key Pairs 문서 | 검증 |
| `chmod 400`을 설정하지 않으면 접속할 수 없다 | AWS EC2 Key Pairs 문서 | 검증 |
| 서브넷은 앞 4개·마지막 1개 주소 예약, 서브넷 `/16`~`/28` | AWS Subnet CIDR blocks | 검증 |
| VPC CIDR 크기 `/16`~`/28` | AWS VPC CIDR blocks | 검증 |
| 서브넷이 IGW 경로가 있는 Route Table에 연결되면 Public, IGW는 IPv4에서 NAT를 수행, 인스턴스에 Public IPv4 필요 | AWS Internet gateway 문서 | 검증 |
| Security Group은 stateful이며 허용된 인바운드의 응답은 아웃바운드 규칙과 무관하게 나감 | AWS Security groups 문서 | 검증 |
| Security Group이 **네트워크 인터페이스**에 적용된다 | 문서는 "연결된 자원"과 ENI 속성 목록의 `Security groups`로만 확인 | **부분 검증** — 문구가 "ENI에 적용"으로 명시된 곳은 못 찾음. 표현 수위는 Owner 확인 |
| EC2 인스턴스 시작 시 Key Pair 공개키가 인스턴스의 `authorized_keys`에 들어간다 | 확인한 AWS 페이지에 메커니즘 설명 없음 | **검증 필요** — 원고에는 "인스턴스에 등록된다"까지만 서술 |
| AMI별 기본 사용자 이름(`ec2-user` 등) | 확인한 페이지에 목록 없음 | **검증 필요** — 원고에 ⚠️ 표시 |
| 하나의 EC2에 Security Group·ENI를 여러 개 붙일 수 있다 | Security groups 문서(자원에 여러 SG) | SG는 검증, "ENI 여러 개"는 일반 지식 |
| 서버 안에서는 사설 IP만 보이고 Public IPv4는 IGW가 1:1 변환 | AWS IGW 문서의 NAT 설명 | 검증 |
| 공개 저장소에 올린 키는 삭제해도 기록·복제본에 남는다 | 일반 보안 상식 | 근거 문서 미첨부 |

## 3. 기존 콘텐츠와의 차이

**`ssh-key.md` (현재 `content/terms/ssh-key.md`)**

- 코드 예가 ` ```bash ` 블록인데 실제 명령이 아닌 설명문이 섞여 있어 `08` 기준("코드 블록 안에 코드가 아닌 것")에 걸린다. 개선안은 명령만 코드 블록에 두고 해설은 표로 분리했다.
- "서버가 보낸 값에 서명"은 부정확하다. RFC 4252상 서명 대상은 **세션 식별자 등 연결 고유 값 + 요청 내용**이다. 개선안은 이 표현으로 수정했다.
- 사용자 인증과 호스트 인증의 구분, 서명과 암호화의 구분, EC2 Key Pair와 직접 생성 키의 차이, GitHub 유출 대응이 기존에는 없거나 한 문장이었다.
- ⚠️ **미션 매핑 불일치:** `ssh-key`의 `missionRefs`는 `preliminary/M01 direct`뿐이고 `main/M05`(B3-1)가 없다. 본문은 B3-1을 말한다. `content_generation_guard`의 "매핑된 회차만 인용" 규칙과 충돌할 수 있고, 이 매핑 변경은 **관계 변경이라 이번 범위 밖**이다. Owner 판단 필요.

**`cidr.md`**

- 공백 정렬 텍스트 표를 HTML 표로 바꿀 수 있는 Markdown 표로 대체했다. 열: 표기·고정/변하는 비트·주소 개수·쓰임.
- 전체 주소 개수와 AWS 사용 가능 개수(251)를 구분했고, `/0`·`/8`·`/32` 사이의 포함 관계에서 `/32`를 VPC 안의 주소로 오해하지 않게 별도 설명했다.
- "숫자가 크면 좁다"가 현재 본문에 이미 있으므로 그 부분은 유지하고 근거(2^(32−N))만 추가했다.

**`network-aws-role-comparison` (현재 `concept-connections-v1.json`)**

- 현재 구현의 표 3개와 요청 흐름은 **그대로 유지**하는 전제다. 추가한 것: 구조도, "조건 4개" 표, SSH/HTTP 비교, Public IPv4 NAT 설명, 단순화한 점 명시.
- 현재 본문에 이미 있는 Security Group 주의 문구(서버마다 붙는 상태 기반 가상 방화벽)와 중복되는 문장은 새 원고에서 한 번만 쓴다.

## 4. 시각 자료

| 파일 | 핵심 개념 | 비고 |
|---|---|---|
| `assets/ssh-key-auth.svg` | 호스트 인증 ↔ 사용자 인증, 개인키는 전송되지 않음 | 시퀀스 형태 |
| `assets/cidr-range.svg` | 고정 비트와 범위, `/16 ⊃ /24`, `/32`는 VPC 밖의 한 주소 | 32비트 칸 5줄 + 포함 관계 |
| `assets/aws-network-roles.svg` | VPC·Subnet·IGW·Route Table·SG(ENI)·EC2·Nginx 위치 관계와 요청 조건 4개 | HTTP 실선 / SSH 점선 / 연결·참조 점선 |

확인한 것: XML 유효, 데스크톱 폭(520px)과 모바일 폭(358px)에서 텍스트 잘림·겹침 없음, 4개 테마(Forest·Indigo·Paper·Signal) 색 토큰으로 렌더해 육안 확인(AWS 구조도: Forest·Paper·Indigo, CIDR: Forest·Signal, SSH: Forest. 나머지 조합은 같은 토큰을 쓰지만 개별 확인하지 않음). 색 외에 선 종류·번호·텍스트로 구분했다. 세로형 단일 레이아웃(폭 520)이라 데스크톱에서는 가운데 정렬된 좁은 그림이 된다.

**미해결 시각 문제**

- 현재 `.svg`는 CSS 변수에 **Forest 값 폴백**을 갖는다. `<img>`로 불러오면 테마가 바뀌어도 색이 고정이다. 테마를 따르게 하려면 **인라인**으로 넣어야 한다.
- 위험 표시(빨강)는 테마와 무관한 고정색(#b3261e)이다. 의도한 선택이며 테마 색으로 바꾸면 "위험" 의미가 흐려진다.
- 폭 520에서 글자 크기 13px이 모바일에서 약 9~10px로 줄어든다. 읽을 수는 있으나 작다. 더 크게 하려면 레이아웃을 따로 만들어야 한다.

## 5. 구현 연결 QA — 현재 구조가 처리하는 방식 (구현하지 않음)

- `scripts/build_web_data.py`의 `sections()`는 `## ` 제목으로 잘라 **고정된 절 이름**(`한 줄 설명`, `쉽게 설명하면`, `정확한 설명`, `이 미션에서는 왜 필요한가`, `코드 예`, `주의할 점 / 경계 조건`, `관련 용어`, `흔한 오해`, `동료평가 질문`)만 읽는다. 원고도 이 이름을 유지했다. 그 밖의 `##` 절(예: "EC2 Key Pair와의 관계")은 **현재 화면에 나오지 않는다.**
- `prose()`는 백틱을 제거하고 **평문**으로 내보낸다. Markdown 표·이미지·`###`는 **렌더되지 않는다.** 코드 예만 `<pre>`로 나간다.
- `concept-connections-v1.json`의 `sections[].body`도 평문이며, 표와 구조도는 `src/ConceptConnections.tsx`의 `network-aws-role-comparison` 분기에 **손으로 쓴 JSX**다.

**Codex 구현 요청 (이 브랜치에서 하지 않음)**

1. 용어 상세 화면에 표 렌더링을 지원하거나, 표가 필요한 두 용어(`ssh-key`, `cidr`)를 `ConceptConnections`처럼 전용 컴포넌트로 만든다. (Markdown 표 → 의미 있는 `<table>`, 모바일은 `.connection-table-wrap` 방식의 가로 스크롤)
2. SVG를 인라인으로 불러오는 방식(`?raw` import 등)과 접근성 속성(`role="img"`, `<title>`, `<desc>` — 파일에 이미 있음).
3. `network-aws-role-comparison`에 구조도 섹션 추가. 기존 표는 유지.
4. `terms/ssh-key.md`, `cidr.md`에 승인된 원고 반영, 필요하면 `content_generation_guard`·`npm run content:integrity` 재실행.
5. `ssh-key` 미션 매핑(`main/M05`)은 **Owner 승인 후** 데이터 쪽에서 처리.

## 6. Owner 검토 대상 (결정 필요한 것만)

1. `ssh-key`의 B3-1 매핑 누락 처리 방식(관계 변경).
2. "Security Group은 ENI에 적용" 표현 수위(공식 문구 부분 검증).
3. AMI 기본 사용자·인스턴스에 공개키가 들어가는 방식은 **검증 후 확정** 또는 서술 삭제.
4. 표·SVG를 기존 term 화면에서 처리할지, 전용 컴포넌트로 만들지(Codex 작업 범위).
5. 신규 용어·관계 변경은 **없음.** `ssh`와 `ssh-key`의 설명 중복은 관련 용어 연결로 줄일 수 있다는 제안만 있다.

## 7. Notion 동기화 후보 (지금 갱신하지 않음)

B3-1 Pilot 결과가 승인되어 구현으로 넘어가는 시점에 한 번에: ① 이 Pilot의 결과와 승인 상태 ② 용어 콘텐츠에 표·SVG를 쓰는 방식이 확정되면 그 결정.
