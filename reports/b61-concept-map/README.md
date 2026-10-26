# B6-1 개념지도 웹 구현 · Owner 화면 검수 대기

- 작업일: 2026-10-26 (Asia/Seoul)
- 브랜치: `feature/b6-1-concept-map-web`
- 설계 기준: `d948ecf`의 `content/mission-concept-maps/main-m11/concept-map-plan-v0.1.md` 및 자체 검토. 이번 Owner 작업 지시서의 구현 승인·범위 제한을 적용했다.
- 검수 주소: <http://127.0.0.1:4186/#/missions/main-M11/story/concepts>
- 선택 예시: <http://127.0.0.1:4186/#/missions/main-M11/story/concepts?node=fk>
- 소개 진입: <http://127.0.0.1:4186/#/missions/main-M11>
- 기존 HashRouter의 주소 규칙을 따른다. 내부 route는 `/missions/main-M11/story/concepts`다.
- main 병합·공개 배포는 하지 않았다. GitHub Pages workflow는 main push에서만 실행된다.

## 구현과 콘텐츠 계약

11개 노드, 12개 방향 관계, 포함·역할 2유형, 선 없는 비교 3개를 B6-1 전용 `src/b61ConceptMap/data.json`으로 구현했다. 데이터 관계 | 데이터 구조 | 중심 | 데이터 활용 순서를 유지한다. 기본 화면은 핵심 관계 7개를 진하게, 보충 5개를 옅은 점선으로 표시한다. 선택한 개념의 연결은 모두 강조하고 다른 연결은 약하게 표시한다. 이름표는 카드 사이 통로에 놓았으며 이동 애니메이션이나 실행 순서를 추가하지 않았다.

`LearningFocusNav compact`, `mission-detail-*` 공통 패널, 사이트 테마 토큰, B2-1의 `fitMap`·`fitBounds`·`resizeCamera`, B3-1의 좌표·직교 경로 계산을 재사용했다. B6-1 전용 화면·콘텐츠·수평 좌표 투영·이름표 위치만 추가했다. 신규 범용 엔진은 만들지 않았다. PC는 최대 350px/40% 오른쪽 패널, 모바일은 지도 아래 43dvh 시트다. 닫기·Escape·재선택·제목 포커스·본문 스크롤 초기화·Canvas 공간 회수·큰 화면 진입/복귀를 지원한다.

직접 사전 연결 7개와 확장 연결 3개, 사전 링크 없는 DBMS 1개를 구분했다. DBMS·행·열·관계 ID를 만들지 않았다. JOIN과 PK/FK 사이의 새 관계선도 없다. JOIN은 FK 없이 사용할 수 있다는 비교, PK/FK와 SQL/DBMS 구분을 상세에서 읽을 수 있다. ERD는 기존 Story 화면으로 연결하며 상세 ERD를 중복 구현하지 않았다. JOIN의 추가 Story 링크는 INNER/LEFT를 비교하는 S03-3이다.

소개·Story 학습자료 메뉴에서 지도에 진입한다. 검증된 `b61-story=scene=…&screen=…`만 받아 지도 → 사전/가이드 → 지도/원래 Story로 돌아간다. 가이드 목차·이전/다음·본문 내부 링크도 맥락을 보존한다. 선택 상태는 URL로 복원되며 새로고침·뒤로가기를 지원한다. 임의 return URL, 외부 주소, 중복/알 수 없는 선택값은 복귀 목적지로 사용하지 않는다.

## QA 결과

| 검증 | 결과 | 근거 |
| --- | --- | --- |
| 승인 콘텐츠·관계 방향·유형·개수·선 없는 비교 | PASS | 설계 Markdown과 런타임 데이터 대조 테스트 |
| 실제 canonical ID·확장/none 정책 | PASS | 생성 사전의 존재·상세 콘텐츠 확인 |
| 모든 연결선의 카드 내부 침범 | PASS | 12개 경로 × 11개 카드의 모든 직교 구간 검사 |
| 4 해상도 × 4 사이트 테마 × OS light/dark | PASS | 32 조합, 8개 Playwright 사례에 4테마 반복 |
| 최초 지도에서 11개 노드 전체 표시·가로 넘침·이름표/카드 겹침 | PASS | `*-metrics.json` 참조 |
| 11개 노드 각각 선택·연결 강조·읽기 크기·선택 카드 비가림 | PASS | 32 조합 전체에서 확인. 선택 이름의 실제 크기 최소 20.9px |
| 패널 닫기/열기·Escape·키보드 재선택·공간 회수·큰 화면 | PASS | 선택 URL 유지, 제목/버튼 포커스, 실제 Canvas/패널 경계 측정 |
| 확대·축소·전체 보기·키보드 이동 | PASS | Canvas viewBox 변경 및 선택 복원 |
| 모바일 터치 이동·핀치 | PASS | 360/390px, CDP 터치 이벤트, 문서 스크롤 고정 |
| Story 12개 위치 → 지도 → 사전/가이드 → 지도/원래 Story | PASS | 실제 App 경로·S01-1~S04-3 왕복 |
| 12개 관계 직접 주소·새로고침·이력·잘못된 주소 복구 | PASS | 브라우저 및 URL 단위 테스트 |
| B2-1 핵심 기능 | PASS | 네 해상도에서 45개념/24관계, 영역 집중, 선택/닫기, 카메라, 큰 화면, Story 이동 |
| B3-1 및 기존 미션 소개 | PASS | 기존 Playwright 2개 파일 35개 사례 |
| TypeScript·프로덕션 빌드·기존 B2-1 빌드 무결성 | PASS | `npm run build`, 최종 카메라 수정 후 `npx tsc -b` 및 `npx vite build` |
| 관련 Vitest | PASS | 8개 파일, 115개 테스트 |
| B6-1 및 B2-1 브라우저 검사 | PASS | 신규 `b61-concept-map.spec.ts` 15개 테스트 |
| 기존 B2-1 정밀 카메라 스크립트 | FAIL · 기준 커밋에서도 동일 | 아래 참고 |
| Owner 실제 화면·강의실 프로젝터 | 미검증 | Owner 검수 대기 |

모바일 기본 화면은 승인 설계대로 전체 관계를 보는 축소 개요다. 개념 선택 또는 읽기 크기로 확대해 읽는다. PC 전체 보기의 개념 이름은 1280px에서 약 17.69px, 1000px에서 약 16.57px다. 모바일의 모든 관계를 처음부터 본문 크기로 표시한다고 주장하지 않는다.

기존 `scripts/check_b21_map_first.mjs`는 설명 패널 개폐 시 카메라 중심의 완전 동일성을 요구하는 46행 검사에서 실패했다. 기대 오차 `< 0.00001`, 실제 `40.44444444444434`다. 별도 detached worktree의 **원본 d948ecf**에서도 동일 브라우저/의존성/검사로 같은 줄과 값이 재현됐다. 이번 변경의 회귀로 판정하지 않았으며 B2-1 파일은 수정하지 않았다. 해당 정밀 스크립트 전체를 PASS로 보고하지 않는다.

Vite의 기존 500kB 초과 chunk 경고는 남아 있다. 빌드는 종료 코드 0으로 완료됐다.

## 대표 캡처 및 시각 검수

Chrome에서 아래 8개 캡처를 저장하고 직접 확인했다. 카드/관계 이름표의 가림, 데이터베이스 이름 줄바꿈, 모바일 선택 카드와 시트의 공간 분할을 확인했다. 테마/OS별 측정 결과는 같은 폴더의 JSON 8개에 보존했다.

| 화면 | 전체 지도 | 외래키 선택·설명 |
| --- | --- | --- |
| PC 1280×720 | [전체](1280-overview.png) | [선택](1280-selected-fk.png) |
| PC 1000×720 | [전체](1000-overview.png) | [선택](1000-selected-fk.png) |
| 모바일 360×800 | [전체](360-overview.png) | [선택](360-selected-fk.png) |
| 모바일 390×844 | [전체](390-overview.png) | [선택](390-selected-fk.png) |

## 변경 범위와 운영 정책 점검

- PASS: 스토리=흐름, 지도=미션 의미 관계, 사전=확장, 가이드=실행의 역할을 유지했다. 강사 대면 강의 운영 및 기존 학습 자료 원문은 바꾸지 않았다.
- PASS: Story의 4 Scene·12 화면, 상세 ERD, 가이드 10장, B2-1/B3-1 지도 파일, canonical·분야 지도 데이터, 공통 UI v1.2 문서는 `git diff d948ecf`에서 변경 없음. Story 메뉴와 B6-1 가이드/사전의 복귀 UI만 연결했다.
- PASS: 기존 자료 등록 테스트 2개는 B6-1 개념지도 제공 상태에 맞게 갱신했다. 공통 GNB·패널 CSS를 미션별로 재정의하지 않았다.
- 미검증: 교육 효과와 Owner 실제 화면 승인은 자동 테스트로 대체하지 않는다. 이 결과는 main 병합·공개 배포 승인이 아니다.

재실행:

```powershell
npm run build
npx vitest run src/b61ConceptMap/conceptMap.test.ts src/b61Story src/missionLearning.test.ts src/b21ConceptExplorer src/missionConceptMap/conceptMapAdapter.test.ts
$env:PLAYWRIGHT_PORT='4186'
$env:PLAYWRIGHT_CHANNEL='chrome'
npx playwright test playwright/b61-concept-map.spec.ts playwright/mission-concept-map.spec.ts playwright/mission-learning-entry.spec.ts --workers=2 --reporter=line
```
