# B3-1 미션 스토리맵 웹 통합 검토 자료

> **최신:** 콘텐츠 `c000676`의 [웹 최종 QA](#콘텐츠-수정본-웹-최종-qa-2026-10-22)는 `READY_FOR_OWNER_FINAL_GATE`. 아래 최초 통합 기록과 당시 승인 대기는 이력으로 유지한다.

기준일: 2026-10-22. 작업 브랜치: `feature/b3-1-story-map-web-integration`.

## 기준·허용 범위

- GitHub 조회와 fetch 결과 정책 PR [#17](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/17)은 병합됨. `origin/main`: `517c33edd0eb28b596e44d8673fb0b4d5757b0ed`.
- Owner 지시서의 개념지도 Golden Baseline: `410b3a00c0ce622fe5212710ec15fec2b689e113`. 이 커밋을 최신 main 위에 이력 재작성 없이 merge했다: `ce0b82e`.
- [학습 정책](../../docs/mission-guides/learning-operation-policy.md), [workflow](../../docs/mission-guides/workflow.md), [AGENTS](../../AGENTS.md), [거버넌스](../../docs/knowledge-encyclopedia/06-agent-governance-model.md)를 확인했다.
- 사용자의 이번 지시는 로컬 실제 웹 구현·QA를 허용한다. 새 공개 경로 `/missions/main-M05/story-map` 및 `scene`·지도 복귀 query는 **공개 전 Owner Gate 확인 대상**이다. Push·PR·병합·배포는 수행하지 않는다.
- Scene 01~03의 handover에 적힌 이전 단계 승인 대기를 이번 웹 구현 허용과 구분한다. **독립 콘텐츠 검토·Owner 원고/SVG 승인을 PASS로 선언하지 않는다.**

## 웹 통합 전 콘텐츠 대조

원본 SVG의 `<title>`·`<desc>`·표시 텍스트를 각 설계 노트와 대조했다. [Scene 01](../../drafts/b3-1-visual-story/scene-01/design-notes.md), [Scene 02](../../drafts/b3-1-visual-story/scene-02/design-notes.md), [Scene 03](../../drafts/b3-1-visual-story/scene-03/design-notes.md), [비교 검토](../../drafts/b3-1-visual-story/scene-03/comparison-review.md)와 기존 [보강 원고](../../content/mission-guides/main-m05/supplement/README.md)·[가이드 2장](../../content/mission-guides/main-m05/chapters/02-network-aws-map.md)을 사용했다. SVG의 기술적 문구·배치·원본 바이트를 수정하지 않았다.

| 대상 | 대조 결과 및 웹 처리 | 독립 검토·Owner 판단 대상 |
| --- | --- | --- |
| Scene 01 | 회사 안·밖, 구역 1~5, A1~A5와 실제 연결≠허용을 원본에서 재사용 | 시안 2차 전체 SVG·문구·모바일 길이. 기존 보강 그림의 A1~A4·B/C와 다르므로 **교체하지 않음** |
| Scene 02 | 동일한 기업망의 요청 A1~A5·응답 R1~R5·설명 단계 1~8. HTTPS 443 예시, DNS 생략과 처리 순서 단서를 유지 | 요청·응답 강조, 새 설명 단계와 응답 표식, 강사용 안내·확인 질문 |
| Scene 03-A | 역할 비교 6개·주의 카드 4개, 미구현 항목을 유지. AWS는 2026-10-14 기록이며 현재 상태가 아님을 표시 | 원본 설계 노트의 `EC2 ⊃ ENI·Nginx`와 그림 내부 ENI 배치가, 승인 개념지도의 **EC2–ENI는 포함이 아닌 연결** 설명과 혼동될 위험. 원본의 `ENI (사설·공개 IPv4)`도 IGW의 주소 대응과 함께 독립 검토 필요. Codex가 임의 수정하지 않음 |
| Scene 03-B | W1~W4와 설정 ①~⑥, Route Table·SG가 경유 장비가 아님을 유지. 실제 B3-1 HTTP 80을 기업망 HTTPS 443과 구별 | 숫자 원이 Scene 02의 설명 순서와 달리 필요한 설정을 뜻하는 점, 조건·단순화와 강사용 확인 질문 |
| Scene 04 | 정적 SVG를 게시하지 않고 승인 인터랙티브 지도 연결 | 장면→지도 선택 목록 및 지도·사전·실습 왕복의 학습 적합성 |

원본 SVG의 직원 게시·DB 조회를 ‘후속 그림’에서 본다는 문구는 기존 보강 자료의 범위다. 새 다섯 장면에는 별도 게시/DB 장면을 만들지 않는다. 기존 자료로 이어 보는 링크를 제공한다. Scene 03-A의 예전 통합형 `network-aws-comparison-*`은 게시용으로 import하지 않았다.

페이지 핵심 설명은 기존 SVG 설명·설계 노트의 발췌/짧은 연결문이다. 새 강사용 안내·학습자 확인 질문은 기존 내용의 관찰·말로 설명하기를 요청한다. 새로운 기술적 인과관계를 추가하지 않았다. 이 자료는 **독립 검토 결과가 아닌 Codex의 대조 및 검토 요청 목록**이다.

## Scene별 지도 연결 근거

SSOT는 기존 [concept-map.json](../../data/mission-story-maps/main-m05/concept-map.json)의 `storyScenes`다. 원본 36노드·57관계를 유지하고 아래만 강의 시연용 진입점으로 선별했다. 각 선택이 해당 Scene을 참조하는지 자동 검증한다.

| Scene | 기본 선택 | 추가 시연 | 선별 이유 |
| --- | --- | --- | --- |
| 01 | 일반망 `gen:firewall` | `GN02` | 구역 사이 길 안내·허용 판단·NAT 이름표와 회사 안 DMZ 관계 |
| 02 | 일반망 요청 `GF01` | 응답 `GF02`, 응답 통과 `GN28` | 요청·응답의 경로와 허용된 연결의 응답을 구분 |
| 03-A | 대응 `CR01` | `CR02`, `CR03` | 경로·접근 통제·주소 변환 비교를 순차 시연. 나머지 대응은 지도 자유 탐색으로 확인 |
| 03-B | AWS 요청 `AF01` | 경로 대상 `AW07`, ENI 적용 `AW08` | 실제 요청 경로와 그 길을 가능하게 하는 설정을 구분 |
| 04 | 전체 지도, 선택 없음 | 지도 기존 탐색 도구 | 강의 후 자유 탐색·용어 확장·학습가이드 실습으로 연결 |

## 구현·복귀 계약

- 미션 상세 → 스토리/지도 주요 진입, 기존 가이드·보강 링크 유지.
- `/missions/main-M05/story-map?scene=scene-01`에서 01→02→03a→03b→04. 목차·이전/다음·새로고침 지원. 잘못된 Scene은 첫 장면으로 안내.
- 그림의 실제 칸 폭을 `ResizeObserver`로 측정. 01/02는 **904px**, 03-A/B는 **960px** 기준. 좁은 칸에서는 세로형 최대 420px. 원본 비율과 대체 설명 유지.
- 원본 SVG 스타일과 marker ID는 Shadow DOM 안에서 격리한다. 02의 `data-flow=A* / R*`만 강조하며 원본 파일은 변경하지 않는다.
- 기본 그림은 가로 스크롤 없이 표시. 확대 dialog에서만 명시적인 100~300% 확대·이동 허용. Escape/닫기와 원래 버튼으로 포커스 복귀.
- 지도 query의 `node / rel / flow / view / more / scene`을 장면 `map`과 사전 `b31-map` query로 운반한다. 목적지는 고정된 로컬 경로이며 임의 redirect를 사용하지 않는다.
- 지도 업데이트·URL 정규화 때 Scene 맥락을 유지. 관련 Scene을 열거나 사전을 새로고침한 뒤에도 복귀 링크로 이전 선택 복원.
- 연결된 사전 항목이 없는 노드는 기존 안내를 유지한다. canonical·기존 기술지도·공개 학습가이드·SVG 내용은 수정하지 않는다.
- 강의 참여 확인·접근 제한·완료를 자동 판정하는 기능은 추가하지 않는다.

## 정책 체크 결과

- **기획 PASS(통합 범위):** 기존 장면 순서·강의 시연 질문·실습 연결 확인. 공식 미션 전체 조건과 현재 AWS 자원은 미검증.
- **콘텐츠 독립 검토 미검증:** 위 표의 문구·질문·시각자료를 콘텐츠 담당/독립 검토자와 Owner가 판단해야 한다.
- **웹 QA:** 아래 실행 결과에 기록. 자동 테스트·시각 QA를 콘텐츠 승인이나 공개 배포 확인으로 해석하지 않는다.

## 실행 결과

검증 소스는 이 보고서와 함께 로컬 커밋한다. 최종 SHA는 완료 보고와 `git log -1`에서 확인한다. 실행 순서는 **build → unit → 전체 Playwright → 승인 화면 비교**다. 데이터 생성 빌드와 Vite 브라우저 검증을 동시에 실행하지 않는다.

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| `npm run build` | **PASS** | [빌드 로그](build.log) |
| `npm test` | **129/129 PASS**, 13개 파일 | [단위 테스트 로그](vitest.log) |
| `$env:PLAYWRIGHT_PORT='4174'; npx playwright test --workers=2 --reporter=line` | **172/172 PASS** | [전체 브라우저 로그](playwright-full.log). 기존 지도·B3-1/다른 미션 가이드·사전·검색·테마 회귀 포함 |
| 새 스토리 테스트 | 위 전체의 **36개 PASS** | 목차/순차 이동·실제 칸 폭·원본 비율·확대/Escape/포커스·장면/사전 왕복·새로고침·없는 사전 안내 |
| 화면 행렬 | **32조합, 128개 장면 측정 PASS** | 1280×900·1000×900·390×844·360×844 × Forest/Indigo/Paper/Signal × OS light/dark. 가로 넘침 없음·비율 오차/실제 글자 크기 확인 |
| 브라우저 Back·오류 URL 복원 | **반복 검증 PASS** | [10회 반복](playwright-history.log), [12회 후속 검증](playwright-last-fixes.log). React Router 전환이 끝나기 전 Back을 눌러도 선택을 현재 URL에 맞춤. 정규화 후 오류 안내 유지 |
| 미션 첫 화면·Scene 04 왕복 | **1280/360px PASS** | [추가 조작 결과](manual-roundtrip.json). 주요 스토리 진입이 미션 제목 바로 아래 첫 화면에 있고 04→지도→04가 동작 |
| 승인 버전 소스·픽셀 비교 | **13개 보호 파일 일치, 캔버스 128/128조합 픽셀 일치** | [비교 스크립트](../../scripts/qa_b31_story_baseline.mjs), [JSON](golden-baseline.json), [로그](golden-baseline.log) |
| 상대 문서 링크·변경 범위·`git diff --check` | **PASS** | 기존 원고·canonical·지식지도·학습 정책 규칙을 main과 대조. 새 문서의 상대 링크와 staged diff를 확인 |

시각 검토는 실제 렌더링 캡처의 제목·그림 비율·여백·버튼·모바일 세로형과 확대 화면을 확인했다. 32조합의 화면 모음과 01~03-B의 PC/모바일 원본 캡처를 함께 살폈다. 자동 수치와 사람의 시각 검토를 구분하며, 실물 기기/강의 효과는 아래 미검증 목록에 남긴다.

승인 화면 비교는 기준 서버 4173(`410b3a0`)과 통합 서버 4174의 동일 크기·테마·OS·선택 상태에서 수행한다. Windows의 일시적인 네이티브 스크롤바 표시는 양쪽 테스트 페이지에서만 숨겨 비교한다. 앱 소스·노드/선/팔레트는 바꾸지 않는다. 과거 QA 스크린샷/측정 파일은 이번 실행으로 덮어쓴 결과를 커밋하지 않고 승인 이력 그대로 보존한다.

## 변경 파일

승인 브랜치를 merge한 원본 자산·지도 구현과 이번 통합 변경을 구분한다. 이번에 직접 수정/추가한 실행 소스는 다음과 같다.

- [App.tsx](../../src/App.tsx): 신규 route, 미션 제목 아래 스토리 주요 진입, 용어사전 복귀 안내.
- [B31StoryMapEntry.tsx](../../src/B31StoryMapEntry.tsx), [B31StoryMap.tsx](../../src/B31StoryMap.tsx), [b31StoryMapContent.ts](../../src/b31StoryMapContent.ts), [b31StoryMap.css](../../src/b31StoryMap.css): 장면별 실제 페이지·원본 SVG 재사용·강의/복습 화면.
- [b31StoryNavigation.ts](../../src/b31StoryNavigation.ts), [B31LearningReturn.tsx](../../src/B31LearningReturn.tsx): 장면·지도·용어사전의 URL 복귀 계약.
- [MissionConceptMap.tsx](../../src/missionConceptMap/MissionConceptMap.tsx), [ConceptMapDetailPanel.tsx](../../src/missionConceptMap/ConceptMapDetailPanel.tsx): Scene 링크·맥락 유지·브라우저 Back 시 선택 동기화. 캔버스·좌표·lane·팔레트 파일은 바꾸지 않음.
- [콘텐츠/왕복 단위 테스트](../../src/b31StoryMapContent.test.ts), [스토리 Playwright](../../playwright/b31-story-map.spec.ts), [기존 지도 Playwright](../../playwright/mission-concept-map.spec.ts), [승인 화면 비교 도구](../../scripts/qa_b31_story_baseline.mjs).
- [playwright.config.ts](../../playwright.config.ts): `PLAYWRIGHT_PORT`로 기준 화면(4173)과 통합 화면(4174)을 분리하고 포트 충돌 시 실패하도록 설정. 기본 포트는 유지.
- [data.test.ts](../../src/data.test.ts): 최신 main의 승인 웹툰 19개·cloud v4와 낡은 8개·v2 기대값을 조정. 승인 manifest 전체와 게시 데이터, 승인 필드, 사전 연결 집합을 검증하며 **게시 원고·승인 manifest·생성 데이터는 변경하지 않음**.
- [현재 상태](../../docs/mission-guides/b3-1-status.md)와 이 폴더의 QA·캡처.

## Owner 검토 순서

1. 미션 상세의 ‘미션 스토리맵으로 학습 시작하기’로 들어가 다섯 장면의 순서·질문·읽기 분량을 확인한다.
2. 01/02의 구역과 요청·응답, 03-A/B의 비교와 설정을 콘텐츠 담당·독립 검토자에게 대조 요청한다. 위 ENI·주소 표현과 기존 자료의 A/R/W 번호 차이를 함께 검토한다.
3. 강사용 안내·학습자 확인 질문, 장면별 지도 시연 선택을 승인한다. 코드 구현으로 원고/SVG 승인을 대신하지 않는다.
4. 지도에서 노드·관계·흐름을 선택하고 관련 Scene/사전을 연 뒤 복귀해 선택이 유지되는지 조작한다. 연결 사전이 없는 노드의 안내도 확인한다.
5. 새 공개 route·복귀 query 계약, 최종 게시할 원고/코드 커밋을 승인한 뒤 Owner가 Push·PR·main 병합·공개한다. 공개 후 Pages 진입·그림·왕복 경로는 별도로 검증한다.

실물 휴대전화, 실제 강의실 프로젝터, 현재 AWS 자원, 공식 미션 전체 요구·시간·평가 조건, 학습 효과, 공개 Pages는 **미검증**이다. 360px에서 원본 Scene 01/02의 최소 글자는 약 **11.8px**이며 확대 화면을 제공한다. 모바일 세로형 원본의 긴 길이를 본문 내용 삭제나 과도한 축소로 줄이지 않았다.

## 콘텐츠 수정본 웹 최종 QA (2026-10-22)

**상태: `READY_FOR_OWNER_FINAL_GATE`**. GPT 독립 콘텐츠 검토 **PASS**는 이번 Owner 작업 지시서에서 확인했다. 이번 판정은 검토본의 웹 반영·기능·시각 회귀에 대한 것이며 Owner의 main 병합·공개 승인을 대신하지 않는다.

### 대상과 보호 범위

- 검토한 콘텐츠: **`c000676b33680dae8f872f69b14d3fe043ee3f11`** (`content/b3-1-story-content-qa`). `git fetch origin` 후 해당 원격 HEAD와 일치함을 확인했다.
- 기준 main: **`4d774cbb15d1563905f5f089526668cbc8d747d5`**. 별도 QA worktree·브랜치 **`feature/b3-1-story-content-qa-web`**를 검토본에서 만들었다. 콘텐츠 담당 worktree는 수정하지 않았다.
- 미리보기: [수정본 스토리](http://127.0.0.1:4188/#/missions/main-M05/story-map), [03-A](http://127.0.0.1:4188/#/missions/main-M05/story-map?scene=scene-03a), [03-B](http://127.0.0.1:4188/#/missions/main-M05/story-map?scene=scene-03b). 비교 서버 `4191`은 기준 main을 별도 checkout하고 의존성도 따로 설치했다.
- [변경 범위 확인](content-final-qa/scope-check.json): `src/`·`data/`·`content/`는 기준 main 및 검토본과 차이가 없다. **36노드·57관계**, 좌표·색상·관계, 미션 학습 진입 UX, 사전·분야별 지도·다른 미션 자료를 보존했다. AWS 리소스 접근/변경은 수행하지 않았다.

### 반영 내용과 화면 결과

| 대상 | 실제 웹 검증 결과 |
| --- | --- |
| Scene 01·02 | 노트북/모바일 SVG의 후속 안내와 `<desc>`가 기업망 보강 자료를 가리킨다. 페이지의 기존 보강 자료 링크는 `guide?document=supplement`를 유지한다. 없는 후속 장면을 안내하는 이전 문구는 없다. |
| Scene 03-A | `ENI · Private IPv4`, EC2에 연결된 ENI라는 대체 설명, IGW의 Public IPv4↔ENI Private IPv4 1:1 변환, 별도 NAT Gateway 서비스와 B3-1 미구현 안내가 검토본 그대로 표시된다. |
| Scene 03-B | 노트북 각주의 `0.0.0.0/0 → IGW`와 응답 경로, 요청·응답 통신 가능 조건 문구가 반영됐다. 모바일은 의도적으로 원본 그대로이며 경로·Subnet 연결, EC2 Private IPv4·IGW 1:1 변환, ENI에 적용되는 SG·HTTP 80, Nginx 조건을 유지한다. 설정을 요청 경유 장비로 바꾸지 않았다. |
| 대체 설명 | SVG의 `aria-labelledby`가 실제 `<title>`·`<desc>` 두 요소를 참조한다. 수정된 이름표·카드와 설명의 핵심 문구를 실제 DOM에서 대조했다. 본문/figcaption의 기존 요약과 모순이 없다. |
| 네 크기·네 테마 | **1280·1000·390·360px × Forest·Indigo·Paper·Signal**, 64개 장면에서 수정 문구·대체 설명·viewBox 이탈·문서 가로 넘침을 검사했다. 모두 PASS. |
| 비율·확대·복귀 | 기존 스토리 회귀의 128개 장면 측정에서 비율 최대 오차 **0.0000469**, 최소 글자 **11.772px**. 장면 목차·이전/다음·SVG 확대·Escape/포커스 복원·요청/응답 강조·장면→지도→사전→선택 복귀/새로고침이 PASS다. |

1000px에서는 승인된 실제 그림 칸 폭 기준에 따라 01·02는 노트북형, 03-A/B는 모바일형을 사용한다. 1280px에서는 네 장면 모두 노트북형이다. breakpoint·비율·시점·디자인은 변경하지 않았다.

### Windows 경고와 실제 웹의 구분

기존 [Scene 01](../../drafts/b3-1-visual-story/scene-01/visual-qa.md)·[Scene 03](../../drafts/b3-1-visual-story/scene-03/visual-qa.md)의 macOS/Apple SD Gothic Neo 기록은 보존했다. Mac을 이번 환경에서 다시 실행했다고 보고하지 않는다.

Windows에서 동일한 `check.cjs`를 수정 전 main과 검토본 양쪽에 실행했다. **Scene 01은 양쪽 FAIL 2건, Scene 02는 양쪽 PASS, Scene 03은 양쪽 FAIL 3건**으로 경고 문장이 같다. [종료 코드](content-final-qa/standalone-checks.json), [01 전](content-final-qa/svg-scene-01-baseline.log)/[후](content-final-qa/svg-scene-01-candidate.log), [02 전](content-final-qa/svg-scene-02-baseline.log)/[후](content-final-qa/svg-scene-02-candidate.log), [03 전](content-final-qa/svg-scene-03-baseline.log)/[후](content-final-qa/svg-scene-03-candidate.log).

- 단독 SVG는 CDP의 실제 사용 글꼴이 **Malgun Gothic**이다. 01 모바일의 범례 viewBox 이탈·안내문과 선, 03-A 모바일 VPC 라벨과 인터넷→IGW 점선 경고를 재현했다. 03의 나머지 2건은 현재 스토리 route에서 사용하지 않는 1차 통합형이다.
- 실제 웹은 수정 전·후 모두 **Pretendard Variable(custom font)**임을 CDP로 확인했다. 01 경고 문구 두 개와 03-A VPC 라벨에서 같은 2px 여유·선 표본 검사에 걸리는 선이 **0개**다. 범례도 viewBox 안에 있다. [글꼴·경계·선 진단 및 비교 JSON](content-final-qa/scene-comparison/comparison.json).
- [03-A 390px 실제 VPC 라벨](content-final-qa/web-content/390-forest-scene-03a-warning-context.png), [01 360px 실제 안내문](content-final-qa/web-content/360-forest-scene-01-warning-context.png)을 눈으로 확인했다. 라벨과 선이 떨어져 있고 문구를 읽을 수 있다. 검사기를 완화하거나 원고/그림을 수정해서 경고를 없애지 않았다.

### 비교 기준 관리

1. 기존 `qa_b31_story_baseline.mjs`의 기본 모드는 여전히 `410b3a0`에 엄격하게 고정한다. 실행 시 의도적으로 수정한 Scene 01 SVG에서 실패함을 [재현](content-final-qa/legacy-baseline-reproduced.log)했다. 기존 승인 결과·이미지는 덮어쓰지 않았다.
2. 명시적 `B31_CONTENT_REVISION=c000676b33680dae8f872f69b14d3fe043ee3f11` 모드를 추가했다. 지도 데이터·캔버스·배치·타입·색상 **5개 보호 파일은 계속 `410b3a0`과 대조**한다. SVG 8개는 검토본과 정확히 같아야 하고, 원래 디자인과 모든 요소·속성·좌표·스타일이 같아야 한다. 텍스트/대체 설명/주석만 구분한다. 미등록 revision은 [거부](content-final-qa/unrecognized-revision-rejected.log)한다.
3. 기준 main과 수정본의 **지도 캔버스 128개 상태가 픽셀 일치**한다. [기준·소스 해시·결과](content-final-qa/golden-baseline.json), [로그](content-final-qa/golden-baseline.log). 변경 허용된 SVG를 지도 승인 실패로 오판하지 않는다.
4. [스토리 비교 도구](../../scripts/qa_b31_content_revision.mjs)는 문구가 보이는 전후 그림을 먼저 저장한다. 이어 테스트 페이지에서만 글자를 숨겨 선·상자·색상·배치의 픽셀을 대조했다. **16개 배치 비교 불일치 0개**, 문구가 있는 그림은 **13개가 의도대로 변경**, 변경하지 않은 03-B 모바일형 **3개는 픽셀 일치**다. 글자를 숨긴 결과로 문구 가독성을 판정하지 않으며, 실제 문구는 별도 64개 장면 검사와 아래 화면으로 확인했다.

### 실제 실행 결과

| 실행 | 결과 | 근거 |
| --- | --- | --- |
| `npm run build` | **PASS**, TypeScript·Vite·데이터 검증 성공, 기존 chunk 크기 경고 유지 | [로그](content-final-qa/build.log) |
| `npm test` | **132/132 PASS**, 14개 파일 | [로그](content-final-qa/unit-tests.log) |
| 관련 Playwright 8개 파일 | **125/125 PASS**. 새 콘텐츠 16개, 기존 스토리·지도·미션 상세 16개·B3-1/B1-1 가이드·Encyclopedia 포함 | [로그](content-final-qa/playwright-regression.log) |
| 콘텐츠 단독 재실행 | **16/16 PASS** | [로그](content-final-qa/web-content-final.log) |
| 시각 기준 보호 | **지도 128/128 일치, SVG 8개 검토본·원본 배치 일치** | [JSON](content-final-qa/golden-baseline.json) |
| 문구/배치 분리 대조 | **16/16 배치 일치**, 의도된 문구 변경 13개 | [JSON](content-final-qa/scene-comparison/comparison.json), [로그](content-final-qa/scene-comparison.log) |
| 단독 SVG 검사 | **기존 FAIL 재현**. 신규 경고 없음, 실제 웹 글꼴에서 해당 충돌 미재현 | 위 Windows 경고 절 |
| 문서 링크·앵커, `git diff --check` | **PASS**, 로컬 링크 누락 0개. staged 및 main 대비 diff도 확인 | [링크 검사](content-final-qa/document-links.json) |

실행 명령(기준 main 서버 `4191`, 수정본 서버 `4188`이 준비된 상태):

```powershell
$env:PLAYWRIGHT_PORT='4188'
$env:B31_QA_OUTPUT='reports/b3-1-story-map-integration/content-final-qa'
npx playwright test playwright/b31-content-final-qa.spec.ts playwright/b31-story-map.spec.ts playwright/b3-1-content.spec.ts playwright/b31-mission-guide.spec.ts playwright/mission-concept-map.spec.ts playwright/mission-learning-entry.spec.ts playwright/encyclopedia-views.spec.ts playwright/mission-guide.spec.ts --workers=2 --reporter=line
$env:B31_BASELINE_URL='http://127.0.0.1:4191'
$env:B31_INTEGRATION_URL='http://127.0.0.1:4188'
$env:B31_CONTENT_REVISION='c000676b33680dae8f872f69b14d3fe043ee3f11'
node scripts/qa_b31_story_baseline.mjs
node scripts/qa_b31_content_revision.mjs
```

### 전후 화면과 수정 파일

| 장면 | PC 전 / 후 | 모바일 전 / 후 |
| --- | --- | --- |
| 01 | [전](content-final-qa/scene-comparison/before-1280-scene-01.png) / [후](content-final-qa/scene-comparison/after-1280-scene-01.png) | [전](content-final-qa/scene-comparison/before-360-scene-01.png) / [후](content-final-qa/scene-comparison/after-360-scene-01.png) |
| 02 | [전](content-final-qa/scene-comparison/before-1280-scene-02.png) / [후](content-final-qa/scene-comparison/after-1280-scene-02.png) | [전](content-final-qa/scene-comparison/before-360-scene-02.png) / [후](content-final-qa/scene-comparison/after-360-scene-02.png) |
| 03-A | [전](content-final-qa/scene-comparison/before-1280-scene-03a.png) / [후](content-final-qa/scene-comparison/after-1280-scene-03a.png) | [전](content-final-qa/scene-comparison/before-360-scene-03a.png) / [후](content-final-qa/scene-comparison/after-360-scene-03a.png) |
| 03-B | [전](content-final-qa/scene-comparison/before-1280-scene-03b.png) / [후](content-final-qa/scene-comparison/after-1280-scene-03b.png) | [전](content-final-qa/scene-comparison/before-360-scene-03b.png) / [후](content-final-qa/scene-comparison/after-360-scene-03b.png) |

1000·390px 전후 그림도 `content-final-qa/scene-comparison/`에 있다. 테마별 실제 전체 페이지는 `content-final-qa/story-regression/{width}-{theme}-light.png`, 새 콘텐츠의 64개 장면 측정은 `content-final-qa/web-content/{width}-{theme}.json`에 보관했다. 원래 `drafts/**/preview/` PNG는 과거 글꼴·문구의 이력으로 남기며 이번 화면의 근거로 쓰지 않는다.

QA 브랜치의 실제 수정은 비교 도구 2개, 콘텐츠 Playwright 1개, 기존 테스트 4개의 **출력 경로 opt-in**, 이 QA/상태 기록·새 증거 파일뿐이다. 앱·원고·SVG·생성기를 추가 수정하지 않았다. 기존 테스트의 캡처는 `B31_QA_OUTPUT` 하위로 격리하며 과거 스크린샷을 덮어쓰지 않는다. 중복/기존 기능 캡처는 새 폴더의 `.gitignore`에 한정해 로컬 보관한다.

- 비교 도구: [qa_b31_story_baseline.mjs](../../scripts/qa_b31_story_baseline.mjs), [qa_b31_content_revision.mjs](../../scripts/qa_b31_content_revision.mjs).
- 새 검증: [b31-content-final-qa.spec.ts](../../playwright/b31-content-final-qa.spec.ts).
- 출력만 격리한 기존 검증: [스토리](../../playwright/b31-story-map.spec.ts), [지도](../../playwright/mission-concept-map.spec.ts), [미션 진입](../../playwright/mission-learning-entry.spec.ts), [B3-1 가이드](../../playwright/b31-mission-guide.spec.ts).
- 기록: 이 문서, [상태](../../docs/mission-guides/b3-1-status.md), `content-final-qa/`의 새 실행 결과·캡처와 [.gitignore](content-final-qa/.gitignore).

**남은 미검증:** 실물 휴대전화·macOS 재실행·웹폰트 로딩 실패 시 fallback 화면·실제 스크린리더 음성·강의실 프로젝터·공개 Pages·현재 AWS 자원. 새로운 콘텐츠 오류는 발견하지 않았으며 원고를 임의로 고치지 않았다. 정책의 학습 역할·강의 안내·학습 왕복을 유지했다. **Owner 최종 Gate 전 main 병합·공개 배포는 수행하지 않았다. Push도 수행하지 않는다.**

QA 보완의 최종 로컬 커밋 SHA는 완료 보고 및 `git log -1`에서 확인한다. Owner Push 명령:

```powershell
git push origin feature/b3-1-story-content-qa-web
```

## 화면 검토 자료

| 대상 | PC | 모바일 |
| --- | --- | --- |
| 미션 주요 진입 | [1280px](1280-mission-entry.png) | [360px](360-mission-entry.png) |
| 전체 구조 | [Scene 01](1280-scene-01-full.png) | [Scene 01](360-scene-01-full.png) |
| 요청·응답 | [Scene 02](1280-scene-02-full.png) | [Scene 02](360-scene-02-full.png) |
| 역할 비교 | [Scene 03-A](1280-scene-03a-full.png) | [Scene 03-A](360-scene-03a-full.png) |
| AWS 접속 조건 | [강의 화면](1280-lecture-scene03b.png) | [전체 장면](360-scene-03b-full.png) |
| 확대와 복귀 | [확대 화면](1280-expanded-scene03b.png) | [확대 화면](360-expanded-scene03b.png) |

[4개 크기 × 4개 테마 × OS light/dark의 화면 모음](visual-matrix-contact-sheet.jpg). 1000/390px 원본 캡처와 전체 32조합의 JSON 측정치는 이 폴더에 함께 있다.
