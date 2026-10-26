# B3-1 학습 가이드 인수인계

> **최신 상태(2026-10-22): `READY_FOR_OWNER_FINAL_GATE`.** 콘텐츠 `c000676`의 GPT 독립 검토 PASS를 Owner 지시서에서 확인했고 웹 최종 QA를 완료했다. [실행·전후 화면·기준 관리](../../reports/b3-1-story-map-integration/README.md#콘텐츠-수정본-웹-최종-qa-2026-10-22). 아래 기존 단계·승인 대기 문장은 당시 이력이며 최종 병합·공개 승인은 여전히 Owner 단계다.

> 갱신일: 2026-10-19. 단계: **Owner 원고 확인 후 웹 통합 QA 완료, PR #4 검토 대기**. 이 파일은 진행 상태이며 PR 병합·공개 검증 기록이 아니다.

## 목적과 고정된 방향

- 대상: B3-1을 수행하는 코디세이 교육생. 네트워크·AWS 초심자와 다른 배포 방식을 선택한 교육생도 읽는다.
- 중심 질문: 일반 네트워크 구성의 역할·용어가 AWS의 자원·서비스와 어떻게 대응하는가. 물리 장비와 AWS 자원을 1:1로 단정하지 않는다.
- 실제 사례는 `Codyssey_B3-1` 커밋 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`에 고정한다. 당시 기록과 현재 AWS 상태, 미션 요구사항과 구현 선택을 구분한다.

## 현재 산출물과 절차 상태

| 항목 | 현재 사실 | 절차상 판정 |
| --- | --- | --- |
| Codex가 만든 7장 원고·강사 노트·SVG 재사용 | `2ec3aef`까지 작성. [초안 QA](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/2ec3aef/content/mission-guides/main-m05/qa-draft.md)에 확인 범위 기록 | 최초에는 참고 초안. 이후 Claude Code가 원본과 대조하고 SVG 2종을 수정했다. |
| Claude Code 콘텐츠 담당 | 별도 브랜치 `claude/b3-1-learning-guide-review`의 `0c4c2ae`(자체 검토), `958b47a`(그림·기록 수정), `d1de30c`(기록 정확화). 7장 본문은 유지, 가이드 복사본 SVG 2종과 `content/mission-guides/main-m05/author-review.md`를 수정 | **로컬 커밋 완료.** Owner가 2026-10-19 대화에서 원고 내용을 확인했다고 알렸다. 콘텐츠 브랜치의 원격 Push는 Owner 단계로 남아 있다. |
| GPT 독립 콘텐츠 검토 | 원본 배포 커밋과 7장·강사 노트·그림을 대조하여 SVG의 SSH 지문·CIDR `/0` 표현과 검토 기록의 과장을 발견. Claude Code 수정 후 [독립 검토 기록](b3-1-independent-review.md)대로 재확인 | **PASS**. Owner의 원고 확인 보고를 받아 `d1de30c`을 웹 통합 기준으로 사용했다. |
| Codex 웹 연결 | `541eefd`에서 B3-1 미션 링크·7장 route 연결. 이후 `d1de30c`의 SVG 2종·콘텐츠 담당 기록을 통합하고 [웹 QA](../../content/mission-guides/main-m05/qa-web.md)에 재검증 결과를 추가 | 승인 원고와 실제 웹 소스 대조, 영향 범위 브라우저·빌드 QA 완료. 공개 Pages는 미검증. |
| QA 기록 | 빌드·Playwright·일부 시각·경로 검사가 통과했다는 당시 기록 | 해당 커밋의 실행 근거로만 재사용한다. 독립 콘텐츠 검토나 공개 Pages 확인을 대신하지 않는다. |
| GitHub PR | [#4](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/4)에 통합 변경을 반영해 Owner 검토 대상으로 올린다. 역할 절차 PR [#5](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/5)는 2026-10-19 병합됨. | #4의 최종 Push·Ready 상태와 head는 GitHub에서 다시 조회한다. Owner가 병합을 판단한다. |

## 다음 담당자에게

1. **Owner:** 콘텐츠 브랜치를 원격에 별도로 공유하려면 로컬 저장소에서 `git push origin claude/b3-1-learning-guide-review`를 실행한다. 갱신된 PR #4를 검토·병합한다.
2. **Codex:** 병합 후 Pages 공개 주소에서 B3-1 진입과 핵심 표·그림을 확인한다.

원본 미션의 모든 필수·선택 조건, 현재 AWS 자원 상태, 실물 휴대전화·모든 테마, 공개 Pages 화면은 아직 검증하지 않았다. 새 채팅에서는 이 문서의 기록일과 Git·PR의 실제 상태를 먼저 대조한다.

## 기업망 보강 자료 웹 통합 (2026-10-19)

- 콘텐츠 기준: Owner가 확인한 `content/b3-1-enterprise-network-supplement`의 `f455163bbf122f1efac06f476b78708466e893bd`. 이 브랜치는 당시 `main` `03230667ccd8c4221b5b269f7b7aea7a50a4d15f`에서 4커밋 앞서 있었다.
- 통합 범위: 기존 B3-1 가이드 주소의 `?document=supplement`를 사용하고 목차·2장·본문 탐색을 연결했다. 새 공개 경로 패턴을 만들지 않았고 다른 미션·용어·지식 지도·AWS 설정은 수정하지 않았다.
- 승인 원고에서 달라진 본문은 공개용 첫 상태 문장(“독립 검토 전” 삭제)과 2장으로 돌아가는 끝 링크뿐이다. 2장에는 보강 자료 진입 문장을 추가했다. 설명·그림 SVG 자체는 유지했다.
- 구성도는 최대 1144px 폭의 별도 읽기 영역에서 표시한다. 900px보다 좁은 화면은 원본 비율을 유지하고 좌우 스크롤하며, 그림 1~4와 보충 그림은 최대 360px 폭을 사용한다. 각 그림의 큰 보기 링크·대체 설명을 유지한다.
- 실행 결과: `npm run build` 통과, Vitest 전체 92개 통과(기존 가이드 및 보강 자료 렌더링·링크 검사 포함), 빌드 산출물에 SVG 6개 포함, `git diff --check` 통과.
- **미검증:** 실제 브라우저의 390px/데스크톱 화면, 키보드 스크롤, 한국어 글꼴과 이미지의 눈으로 보는 상태, GitHub Pages 공개 경로. 이 환경의 Playwright 브라우저 다운로드가 손상된 파일(0 MiB)을 반환했고 별도 브라우저는 로컬 미리보기에 접속할 수 없었다. 빌드와 HTML 렌더 검사를 시각 QA라고 부르지 않는다.
- 다음 순서: 검토용 PR에서 변경 범위와 미검증 항목을 확인하고, 브라우저·휴대전화 화면을 실제로 살핀 뒤 Owner가 병합한다. 병합 후 Pages에서 목차 → 보강 자료 → 그림 크게 열기 → 2장 이동을 확인한다.

## 시각 스토리 Scene 01 시안 (2026-10-21)

- 브랜치 `draft/b3-1-visual-story-scene-01`(분기 기준 `origin/main` `10ab089`). 산출물은 `drafts/b3-1-visual-story/scene-01/`의 노트북용·휴대전화용 SVG와 설계·용어·QA 기록이다. 단계: **Owner 시각 검토 대기**. 서비스 반영, 승인 SVG 교체, 보강 README 본문 수정은 하지 않았다.
- 기존 보강 README 장면 0과의 차이: 방문자 경로 **A1~A4 → A1~A5**(인터넷을 별도 요소로 추가), **B·C 경로 생략**, 장비 명칭 변경(관리 화면 서버 → 내부 관리 서버, DB → DB 서버 등). 시안을 채택하면 장면 0 원고를 함께 고쳐야 한다. 고칠 곳은 [Scene 01 인수인계](../../drafts/b3-1-visual-story/scene-01/handover.md)에 있다.
- 개념지도는 별도 기획이 필요한 후속 항목이다. 기획과 Owner 승인 전에는 제작하지 않는다.

## 통합 인터랙티브 개념지도 Phase 1 (2026-10-21)

- Owner의 Phase 1 구현 지시에 따라 `4e688f6d3d9076f5864646f27da7777466e1614a`에서 `feature/b3-1-interactive-concept-map-poc`을 만들었다. 단계: **작동 화면·로컬 QA 완료, Owner 사용성·디자인 검토 대기**.
- 후보 데이터 `data/mission-story-maps/main-m05/concept-map.json`과 전용 `src/missionConceptMap/`을 구현했다. 기존 지도 엔진·지도 데이터·가이드 원고·Scene 초안은 보존했고 SH01의 일반 NAT 1:1 오해 방지 문구만 후보에 반영했다.
- 지정 경로 `/#/missions/main-M05/story-map/concepts`와 미션 상세의 시안 카드가 연결된다. 전체 스토리맵·Scene 이동 링크·배포는 범위 밖이다.
- 빌드, Vitest 120개, 기존 Playwright 전체 85개, 최종 개념지도+기존 지도 회귀 29개 통과. 1280/1000/390/360px 캡처와 검증 한계, 실행 명령, Owner 조작 시나리오는 [Phase 1 결과](../../reports/b3-1-concept-map/README.md)에 기록했다.
- 로컬 커밋까지만 수행한다. Push·병합·배포와 최종 사용성 평가는 Owner 단계다. 실물 휴대전화·공개 Pages는 미검증이다.

## 개념지도 지도 영역 확대 · 1차 UX 피드백 (2026-10-22)

- `feature/b3-1-interactive-concept-map-poc`의 `7d1fb293b673c66a7e81e757060e6a3a41011161`에서 이어서 레이아웃·화면 상태·카메라만 수정했다. 콘텐츠·36노드/57관계·기존 기술지도·가이드·Scene·route는 유지했다.
- 실제 DOM 전후 측정: 1280/1000×900에서 SVG 높이 398→662px, 상단 도구 173→65px. 390/360×844에서 지도 시작 y=717/762→400px. PC 세로 스크롤·접이식 도구·집중 모드와 반응형 모바일 높이를 적용했다.
- 빌드, 전체 Vitest 120개, 전체 Playwright 107개(기존 기술지도 13개·개념지도 16개·새 레이아웃 6개 포함) 통과. 시점·선택 가림·패널·크기 변경도 검증했다.
- 단계: **로컬 구현·QA 완료, Owner 화면 검토 대기**. [측정 수치·전후 캡처·실행 명령](../../reports/b3-1-map-first/README.md). 실물 기기·공개 배포는 미검증이며 Push는 Owner가 진행한다.

## 개념지도 관계선 가독성·상세 패널 레이어 (2026-10-22)

- `8116411420dd35c64e5c4e084cb96962d5561432` 기준 Owner의 2차 UI 수정 지시를 반영했다. 카드 너비를 유지하고 컬럼 간 통로·평행 트랙·분리 연결점을 배정했다. 장거리 관계는 카드 행 사이 여백을 통과하며, 기본 관계를 약하게 하고 직접 연결된 관계를 강조한다.
- 상세 패널은 고정 헤더와 독립 스크롤 본문으로 나눴다. 불투명 배경·경계·stacking context를 정리하고 모바일 시트에도 적용했다. 콘텐츠·36노드/57관계·JSON·기존 기술지도·공개 route·가이드·Scene 원본은 변경하지 않았다.
- 빌드, Vitest 123개, 전체 Playwright 111개 통과. 네 viewport의 전후 캡처·헤더 스크롤·경로 충돌 검사와 남은 Fit/모바일 가독성 제약은 [수정·QA 기록](../../reports/b3-1-edge-lanes/README.md)에 있다.
- 단계: **로컬 구현·QA 완료, Owner 화면 검토 대기**. Push·main 병합·배포는 수행하지 않았으며 Push는 Owner가 진행한다.

## 개념지도 노드 위치 안정화·선택 강조 (2026-10-22)

- 원격·로컬 기준 `0406f0930ff9ba56912ad3a7224537dd65af9922`에서 Owner의 3차 UX 지시를 반영했다. 보기별 전체 데이터를 기준으로 좌표·port·lane을 캐시하고 표시/강조만 투영한다. 핵심 노드를 연속 배치하고 보충 노드는 컬럼 아래에 예약해 자동 표시·숨김 때 기존 노드가 이동하지 않는다.
- 선택 1 / 연결·비교 0.95 / 무관 0.25 opacity와 선명한 선택 배경·테두리·그림자, hover/focus 복원을 적용했다. 스타일·OS 다크 대응은 `.mission-concept-map`에 한정한다. 원본 데이터·기술지도·route·가이드·스토리맵/Scene은 변경하지 않았다.
- Vitest 126개, 전체 Playwright 119개, 빌드 통과. 네 viewport × light/dark의 핵심 좌표 차이와 기존 구간 경로 불일치가 모두 0이다. [연속 선택 화면·좌표/경로 측정·검증 한계](../../reports/b3-1-stable-layout/README.md).
- 단계: **로컬 구현·QA 완료, Owner UX 검토 대기**. 로컬 커밋까지만 수행하며 Push·병합·배포는 Owner 단계다.

## 개념지도 밝은 학습용 팔레트 (2026-10-22)

- 원격·로컬 기준 `28838a192d1897ee0b674e43bded9ad9acb2f8d5`에서 Owner의 확정 색상 정책을 반영했다. OS dark 전용 녹색 surface/accent 덮어쓰기를 제거하고 캔버스·영역·카드에 공통 고명도 팔레트를 적용했다. 선택은 밝은 배경·진한 글자·테마 테두리, 연결은 흰 카드, 비관련은 opacity 0.32다.
- Forest/Indigo/Paper/Signal의 전역 정의·글꼴·버튼·주변 UI는 유지하고 `--map-selection-border`, `--map-interaction`, `--map-highlight-edge`를 활용한다. 강조/중립 마커를 나눠 화살표와 선 색을 일치시켰다. 데이터·기존 기술지도·배치·lane·카메라·패널 로직은 변경하지 않았다.
- Vitest 126개, 전체 Playwright 136개, 빌드 통과. 288개 테마/크기/OS/상태 조합과 실시간 테마·OS 전환을 검사했다. 글자 대비 최소 5.61:1, 선택 테두리 4.78:1, 강조 선 4.85:1이다. PC 전체/선택 화면과 테마·모바일 화면을 직접 확인했다.
- [원인·색상 정책·전후 74장·측정·Owner 검수 항목](../../reports/b3-1-learning-palette/README.md). 단계: **로컬 구현·QA 완료, Owner 디자인 검토 대기**. Push·main 병합·배포 없음.

## 미션 스토리맵 실제 웹 통합 (2026-10-22)

- 이번 Owner 지시서에서 개념지도 디자인 기준을 `410b3a0`으로 확인했다. 정책 PR #17이 병합된 `origin/main` `517c33e`에서 별도 worktree·브랜치 `feature/b3-1-story-map-web-integration`을 만들고 승인 지도 브랜치를 이력 재작성 없이 병합했다(`ce0b82e`). 기존 기능·문서 브랜치를 수정하지 않았다.
- 미션 상세의 스토리·지도 진입, `/missions/main-M05/story-map`의 Scene 01→02→03-A→03-B→04, 실제 그림 칸 폭에 따른 SVG 전환·확대, 장면↔지도↔사전 왕복과 선택 복원을 구현했다. 새 공개 route와 복귀 query는 **최종 공개 전 Owner Gate 검토 대상**이다.
- 원본 SVG 8개와 36노드·57관계 데이터, 지도 좌표·lane·팔레트·캔버스 코드는 유지한다. 기존 학습가이드·기업망 보강·canonical·분야별 기술지도는 수정하지 않는다.
- Scene 01~03 원고·SVG는 별도 승인 대기다. 특히 03-A의 ENI 배치/주소 표기를 승인 개념지도의 ‘포함이 아닌 연결’ 및 주소 변환 설명과 대조해 독립 검토해야 한다. 새 강사용 안내·이해 확인 질문, 장면별 지도 시연 선택도 검토 대상이다.
- [통합 검토 자료·실행 결과·화면 캡처](../../reports/b3-1-story-map-integration/README.md)에 콘텐츠 대조, 정책 체크와 남은 승인 사항을 기록한다. **웹 구현·QA를 콘텐츠 독립 검토·Owner 게시 승인·공개 배포 완료로 해석하지 않는다.** 로컬 커밋까지만 수행하며 Push·PR·병합·공개는 Owner가 진행한다.

## 미션 중심 학습 진입 UX 개편 (2026-10-22)

- Owner의 후속 지시에 따라 `feature/b3-1-story-map-web-integration`의 원격·로컬 `7cfdecc`에서 메뉴·홈·미션 목록·상세의 정보 계층을 개편했다. 16개 공식 제목과 공개 주소, 용어 분류·링크·데이터 계약을 유지했다.
- B3-1은 스토리→개념지도→실습가이드를 상단 한 영역에서 발견하고 자유롭게 선택한다. 가이드·기업망 보강 중복을 없앴다. B2-1·B1-1·B6-1 가이드와 예비 M03의 기존 이야기·체험도 상단에서 연결한다. 지식 확장·세 용어 분류는 기본 접힘이다.
- 빌드, Vitest **132개**, 전체 Playwright **191개** 통과. B3-1 보호 소스 **20개 변경 없음**, 기준 화면 대비 지도 **128개**·스토리 그림 **16개**의 컴포넌트 캡처 픽셀 불일치 **0개**다. 전역 메뉴 변경은 비교 범위에서 제외했다.
- [전후 화면·미션별 자료 차이·링크/접힘·QA 근거와 미검증 항목](../../reports/mission-learning-entry-ux/README.md). 단계: **로컬 구현·QA 완료, Owner UX 검토 대기**. 기존 Scene 원고·그림 독립 검토와 게시 승인 대기는 유지한다. Push·main 병합·배포는 Owner가 수행한다.

## 미션 스토리 독립 QA 지적사항 보완 (2026-10-22)

- 기준: PR #18 병합 커밋 `4d774cbb15d1563905f5f089526668cbc8d747d5`(= 작업 시점 `origin/main`). 별도 worktree에서 `content/b3-1-story-content-qa`를 만들었고 기존 브랜치·작업 트리는 건드리지 않았다. 원본 생성기 3개로 SVG를 다시 만들었으며, 수정 전 실행 결과가 커밋된 SVG와 같음(Git 변경 0)을 먼저 확인했다.
- 근거: B3-1 배포 기록(`Codyssey_B3-1` `c689299`), AWS 문서 원문(IGW, ENI, EC2 IP 주소, Security Group, Route Table, NAT Gateway — 2026-10-22 확인), 승인 개념지도 `AW03`·`AW09`·`AW10`·`AW15`·`CT06`. 출처 표는 [Scene 03 비교 검토](../../drafts/b3-1-visual-story/scene-03/comparison-review.md) §1.

| 지적 | 판정 | 변경 전 → 후 | 근거 |
| --- | --- | --- | --- |
| 03-A ENI 주소 표기 | **수정** | 노트북·휴대전화 `ENI (사설·공개 IPv4)` → `ENI · Private IPv4`(03-B와 같은 이름표) | Public IPv4는 주 ENI에 할당되지만(ENI 문서 속성 "One public IPv4 address") 인스턴스는 사설 주소만 안다(IGW 문서). 이전 표기는 03-B ④ "EC2는 Private IPv4만 앎"과 달리 두 주소가 ENI에 같은 방식으로 설정된 것처럼 읽혔다 |
| 03-A 공인↔사설 매핑·NAT Gateway 구분 | **수정** | 주의 카드 4 `IGW가 Public ↔ Private IPv4를 / 1:1로 바꿈 / B3-1은 NAT Gateway를 / 만들지 않음` → `IGW가 Public IPv4 ↔ ENI의 / Private IPv4를 1:1로 바꿈 / NAT Gateway는 별도 AWS 서비스 / (B3-1은 만들지 않음)`. 대체 설명(`<desc>`)에도 같은 사실을 추가 | IGW 문서 "logically provides the one-to-one NAT on behalf of your instance", NAT Gateway 문서 "a Network Address Translation (NAT) service", 개념지도 CT06 |
| 03-A EC2 상자 안 ENI 배치 | **기존 유지**(설명만 수정) | 배치·선 유지. 설계 노트 `EC2 ⊃ ENI·Nginx` → "EC2에 연결된 ENI, EC2에서 실행한 Nginx, 같은 상자 = 단순화이며 포함 관계 아님". `<desc>`는 "EC2에 연결된 ENI(Private IPv4)" | 주 ENI는 인스턴스의 가상 네트워크 카드이며 분리할 수 없다(ENI 문서). 그림에 '포함'을 뜻하는 표시가 없고 범례·관계선이 ENI를 연결 대상으로만 쓴다. 이름표에 "EC2에 연결된"을 넣으면 252px로 노트북 칸(최대 약 230px)을 넘어 배치 변경이 필요해 하지 않았다 |
| 03-A IGW의 "1:1 IPv4 변환" | **기존 유지** | — | AWS 표현 one-to-one NAT와 같은 뜻. "NAT" 단어를 IGW 옆에 두지 않아 NAT Gateway와의 혼동을 피한다 |
| 03-B HTTP 80 | **기존 유지** | — | 배포 기록: 외부 확인 `http://…`, SG inbound HTTP 80 `0.0.0.0/0`, Nginx 80 |
| 03-B SSH 22 | **기존 유지** | — | 03-B 그림·원고에 SSH가 없다. SSH는 03-A SG 카드의 규칙 목록(`SSH 22 지정 IP`)에만 있고 요청 흐름에 섞이지 않는다. 오해 근거가 없어 보충 문구를 넣지 않았다 |
| 03-B SG 적용 대상 | **기존 유지** | — | "You associate security groups with network interfaces"(EC2 IP 주소 문서) |
| 03-B Route Table 설명 | **수정**(문구) | 각주 `Route Table은 응답이 VPC 밖으로 나갈 다음 대상도 정합니다.` → `Route Table의 0.0.0.0/0 → IGW 경로가 응답이 VPC 밖으로 나갈 다음 대상을 정합니다.` 강조 문장 `②~⑥이 모두 갖춰져야 ①의 요청이 Nginx에 닿습니다.` → `…①의 요청과 응답이 오갈 수 있습니다.` | Route Table은 Subnet·게이트웨이에서 **나가는** 트래픽의 방향을 정한다(Route Table 문서). ③을 '요청 도착 조건'으로 읽히게 하던 표현을 IGW 문서의 "can't communicate with the internet" 기준(통신 가능 여부)으로 맞췄다. 경유 장비가 아니라는 배치는 그대로다 |
| 03-B Public Subnet·IGW 경로·공인 IPv4·SG·Nginx 조건 ①~⑥ | **기존 유지** | — | 배포 기록 3·4·6·8번과 일치. 노트북·휴대전화 설정 카드 6 = 6 |
| Scene 01·02 후속 안내 | **수정** | Scene 01 노트북 `…방화벽 규칙으로 따로 허용하며 이후 그림에서 봅니다.` → `…따로 허용합니다. 기업망 보강 자료에서 이어 볼 수 있습니다.` / 휴대전화 `필요한 다른 연결은 이후 그림에서 봅니다` → `…기업망 보강 자료에서 봅니다`. Scene 02 노트북 `…DB 조회와 직원 게시는 다른 장면에서 다룹니다.` → `…기업망 보강 자료에서 이어 봅니다.` / 휴대전화 `DB 조회·직원 게시는 다른 장면에서 다룹니다.` → `…기업망 보강 자료에서 봅니다.` 두 장면 `<desc>`도 같은 뜻으로 수정 | 스토리맵 5장면(01·02·03-A·03-B·04)에 해당 장면이 없다. 보강 자료가 실제로 다룬다: 직원 게시 = 그림 0 경로 B·그림 3, DB 조회 = 그림 0 경로 C·그림 2의 6~7·그림 3의 12~13. 웹 페이지 안내([B31StoryMap.tsx](../../src/B31StoryMap.tsx) "기존 기업망 보강 자료에서 이어 볼 수 있습니다")와 일치 |

- `src/b31StoryMapContent.ts`는 수정하지 않았다. 03-A·03-B 원고에 바뀐 문구가 없고, 원고의 설명과 수정한 그림이 서로 어긋나지 않는다. 보강 자료 본문·SVG, 1차 통합형 SVG, 개념지도 데이터·디자인, 용어사전, 웹 기능은 바꾸지 않았다.
- 수정 파일: Scene 01·02·03 `_tools/build.py`, SVG 7개(01 노트북·휴대전화, 02 노트북·휴대전화, 03-A 노트북·휴대전화, 03-B 노트북). 03-B 휴대전화는 바뀐 문구가 없어 바이트가 같다. 설명: Scene 03 `design-notes.md`·`comparison-review.md`, 이 문서.

### 검증 결과

| 항목 | 결과 |
| --- | --- |
| 생성기 재현 | 수정 전 Scene 01·02·03 재생성 = 커밋된 SVG(Git 변경 0). 수정 후 SVG = 생성기 출력 |
| SVG 검사기(`check.cjs` 3개, Windows·Chromium) | 03-A 노트북·03-B 노트북·03-B 휴대전화·Scene 01 노트북·Scene 02 전체 **PASS**. 남은 FAIL은 바꾸지 않은 요소에서만 나오며 **수정 전 파일로 같은 검사를 돌려도 똑같이 나온다**: 03-A 휴대전화 `VPC 10.0.0.0/16` 글자와 인터넷→IGW 점선, Scene 01 휴대전화 2건, 1차 통합형 2건. 원래 QA(macOS·Apple SD Gothic Neo)에서는 통과했으며 이번 환경에 Pretendard가 없어 Malgun Gothic 폭으로 측정된 결과다 |
| 노트북·휴대전화 일치 | 03-A 비교선 6 = 6, 설정 연결 3 = 3, 주의 카드 4 = 4, AWS 요소 11 = 11. 03-B 요청 4 = 4, 설정 카드·번호 6 = 6 |
| 바뀐 글자 폭·잘림 | 1280·360px 렌더링에서 바뀐 문구 모두 상자·화면 안에 있다. 주의 카드 4 최장 줄 236px(칸 약 285px), 휴대전화 최장 줄 314px(칸 336px) |
| `npm run build` | PASS |
| `npm test` | **132/132 PASS** (14개 파일) |
| Playwright 관련(`b31-story-map`, `b3-1-content`, `b31-mission-guide`, `mission-learning-entry`, `mission-concept-map`) | **76/76 PASS** (`PLAYWRIGHT_PORT=4187`) |
| Playwright 전체 | **191/191 PASS**. 실행 중 테스트가 다시 쓴 기존 `reports/` QA 캡처·측정 파일 139개는 승인 이력 보존을 위해 되돌렸다(커밋하지 않음) |
| `git diff --check` | PASS |

### 남은 검토 항목

- **GPT 독립 검토·Owner 승인 대기.** 이 기록은 콘텐츠 승인 완료가 아니다. 단계: `CONTENT_REVISION_READY_FOR_INDEPENDENT_REVIEW`.
- 03-A ENI를 EC2 상자 안에 둔 단순화를 유지할지(이번 판정: 유지), 03-B의 SG 카드가 웹 요청에 필요한 HTTP 80 규칙만 보여 주는 점(03-A는 SSH 포함 전체 규칙).
- 개념지도 `aws:route-table` 설명의 "응답이 VPC 밖으로 나갈 다음 대상**도**" 표현은 이번 범위(개념지도 데이터 변경 금지) 밖이라 그대로 두었다. 03-B 각주와 뜻이 어긋나지는 않는다.
- `scripts/qa_b31_story_baseline.mjs`는 승인 지도 `410b3a0`의 Scene SVG를 보호 대상으로 비교하므로, 이번 의도된 SVG 수정 후에는 원본 변경으로 멈춘다. 이번에는 실행하지 않았다. 재사용하려면 기준 커밋 갱신 여부를 Owner·Codex가 정한다(웹 기능 변경 아님).
- 각 Scene의 `preview/` PNG는 갱신하지 않았다(이전 문구가 보인다). 원래 macOS 글꼴로 만든 검토 이미지라 이 환경에서 다시 만들면 글꼴 차이까지 섞인다.
- 실물 휴대전화·Pretendard 글꼴의 실제 웹 화면, 강의실 프로젝터, 공개 Pages, 현재 AWS 자원 상태는 미검증이다.

## 콘텐츠 수정본 웹 최종 QA (2026-10-22)

- `git fetch origin` 후 기준 main `4d774cbb15d1563905f5f089526668cbc8d747d5`, 콘텐츠 브랜치 `content/b3-1-story-content-qa`의 `c000676b33680dae8f872f69b14d3fe043ee3f11`를 확인했다. 별도 worktree의 `feature/b3-1-story-content-qa-web`에서 QA 보완만 수행했다.
- **GPT 독립 콘텐츠 검토 PASS**는 이번 Owner 지시서의 승인 검토 SHA에 연결한다. 기업망 보강 안내, ENI·Private IPv4, IGW/NAT Gateway 구분, 03-B 경로 문구와 대체 설명이 실제 웹에 반영됨을 확인했다. 원고·SVG를 추가 수정하지 않았다.
- 빌드·Vitest **132개**·관련 Playwright **125개** PASS. 1280/1000/390/360px × 네 테마의 콘텐츠 64개 장면과 기존 128개 장면의 비율·확대·장면↔지도↔용어사전 복귀를 검사했다.
- 개념지도 **36노드·57관계 불변**, `410b3a0`의 데이터·배치·색상 보호 파일 5개 일치, 지도 캔버스 128개 상태 픽셀 일치. SVG 8개는 검토본에 고정하고 기존 좌표·요소·스타일을 대조했다. 문구와 배치를 분리한 16개 캡처도 배치 불일치 0개다. 기존 승인 이미지·결과는 보존했다.
- Windows 단독 SVG 검사는 수정 전·후 같은 FAIL(01 2건, 03 3건)을 재현했다. 실제 웹은 CDP로 Pretendard Variable 사용을 확인했고 01 안내문·03-A VPC 라벨의 동일 선 통과 경고는 재현되지 않았다. 이전 Mac 기록과 현재 실제 화면을 구분한 [상세 근거](../../reports/b3-1-story-map-integration/README.md#콘텐츠-수정본-웹-최종-qa-2026-10-22)를 남겼다.
- 단계: **`READY_FOR_OWNER_FINAL_GATE`**. 새 콘텐츠 오류/웹 블로커 없음. 실물 기기·Mac 재실행·fallback 글꼴 실패 경로·음성 출력·프로젝터·공개 Pages·현재 AWS 자원은 미검증. 로컬 커밋까지만 수행하고 Push·main 병합·공개 배포는 Owner가 판단한다.

## 네트워크 기초 카드 보강 (2026-10-26)

- 기준 `71b8784`, Owner의 카드 3장·시각 자료 2개·비교 표 1개 구현 지시와 전달된 Work 독립 검토 R1~R5를 반영한다. 별도 `feature/b3-1-network-foundations-web`에서 작업하며 main 병합·배포는 하지 않는다.
- 기존 B3-1은 밝은 구조도형이지만, 이번 Owner가 Dark 기본을 명시했다. 강의 상태의 외곽·새 카드에 기존 PresentationSurface/테마 선택기를 재사용하고 기존 구조도 SVG는 밝은 원본·좌표·의미 색을 보존한다. 인트로·지도·공통 테마 CSS는 변경하지 않는다. 공통 규격의 구조도 예외는 이번 명시 지시 범위에서만 적용한다.
- 새 카드 원고는 별도 모듈, 시각 자료는 반응형 HTML/CSS로 구현한다. 기존 원고·SVG·지도 데이터·엔진·canonical·가이드 보호와 변경된 렌더러/테마 검사를 구분한다. 신규 지도 보기·신규 용어 등록은 제외한다.
- [수정 설계](../../content/mission-stories/main-m05/network-foundations-patch-v0.1.md) · [QA·캡처·미검증 범위](../../reports/b31-network-foundations/README.md). 단계: 구현 및 로컬 QA 후 Owner 화면 검수 대기.

## B3-1 Dark 글자 대비·상단 장면 이동 (2026-10-26)

- 기준 `cd636e1`, 동일 `feature/b3-1-network-foundations-web`. UI만 보완했다. 전역 제목의 `--heading-color`가 Dark에서 누락되어 1.11:1로 보이던 문제를 B3-1 범위의 완전한 Presentation 토큰 연결로 수정했다. Light 선택 메뉴의 대비도 보정했다. 공통 테마 파일·SVG·카드 원고는 유지한다.
- 기존 구조도 위에 이전/다음·현재 Scene 이름·진행 위치를 추가했다. 첫/끝 경계, 기존 하단 이동·선택기, map query·포커스/스크롤을 보존한다. 새 route·목차는 없다.
- 신규/회귀 브라우저 96개, 관련 단위 테스트 122개, 빌드·TypeScript 통과. HTML 활성 텍스트 최저 대비 Dark 5.529:1 / Light 4.943:1. 실제 대표 캡처를 확인했다. [원인·전후 캡처·측정·기존 기준선 구분](../../reports/b31-dark-navigation/README.md).
- 과거 Golden 및 B2-1 정밀 카메라 기존 실패를 새 PASS에 포함하지 않았다. 실물·공개 화면은 미검증. main 병합·배포 없이 Owner 검수 대기.

## 네트워크 기초 용어사전 보강 (2026-10-26)

- 기준 `origin/main` `8e58d32`, 브랜치 `content/b3-1-network-glossary`. 신규 canonical 4개(`ip-address`·`private-ip`·`packet`·`network-protocol`, 519 → 523), 기존 용어 본문 보강 10개, 관련 용어 링크 정리 6개, B3-1(M05) 미션 연관 보완. 생성 데이터는 `npm run data:build`·`build_extension.py`로만 갱신했다.
- 개념지도 엔진·노드·관계·보기, B3-1 스토리 화면·카드, 분야 기술지도는 바꾸지 않았다. 지도 연결은 설계 후보로만 기록했다.
- 검증·기존 실패와의 구분·미해결 사항: [보고서](../../reports/b3-1-network-glossary/README.md). `b31-network-foundations.spec.ts`의 71b8784 범위 보호 테스트는 용어 확장과 의도적으로 충돌한다. 단계: **GPT 독립 검토·Owner 승인 대기.** main 병합·배포 금지.
