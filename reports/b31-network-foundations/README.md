# B3-1 네트워크 기초 보강 · Owner 검수 대기

- 작업일: 2026-10-26 (Asia/Seoul)
- 설계 기준: `content/b3-1-network-foundations`, `71b8784700edf4f9170f206b89ea97ee8cd0e923`
- 작업 브랜치: `feature/b3-1-network-foundations-web`
- Owner가 전달한 Work 독립 검토 R1~R5 및 이번 구현 지시를 반영했다. 이 결과를 구현 후 콘텐츠 독립 재승인·Owner 화면 승인으로 해석하지 않는다.
- main 병합·공개 배포 없음. 기존 Pages workflow는 main push에서만 배포한다.

## 구현 결과와 검수 주소

기존 다섯 Scene을 유지하면서 Scene 01에 카드 A, Scene 02에 B, Scene 03-B의 핵심 설명 아래에 C를 추가했다. 기본은 접힘이며 자동 펼침·방문 기록 저장·정답 자동 판정은 없다. 카드당 이해 확인 두 문항, 강사용 안내·접이식 기대 답, 기존 지도·사전 링크를 제공한다. CIDR과 Public Subnet의 세부 설명은 기존 가이드 2·3장으로 연결했다.

| 확인할 화면 | 로컬 주소 |
| --- | --- |
| 강의 소개·5개 Scene 시작 | <http://127.0.0.1:4186/#/missions/main-M05/story-map> |
| A · IP 주소·공인/사설·서브넷 | <http://127.0.0.1:4186/#/missions/main-M05/story-map?scene=scene-01> |
| B · 패킷·IP/TCP/HTTP | <http://127.0.0.1:4186/#/missions/main-M05/story-map?scene=scene-02> |
| C · B3-1 AWS 설정과 비교 | <http://127.0.0.1:4186/#/missions/main-M05/story-map?scene=scene-03b> |

V1은 IPv4 숫자·주소 종류·구역 범위를, V2는 IP → TCP → HTTP 정보의 겹과 장비별 역할을 그린다. 별도 축소 SVG 두 판 대신 반응형 HTML/CSS 시각 자료 두 개로 구현해 주소·포트·설명이 실제 글자 크기로 표시된다. V3는 5행 비교 표이며 기존 03-B 번호 ①~⑥을 함께 표시한다. 좁은 화면에서는 V1·V2를 세로로 배치한다.

Dark 기본값·Light 선택·저장·차단 저장소 대체 동작은 기존 Presentation 컴포넌트를 재사용한다. Owner의 Dark 지시를 강의 외곽·카드에 적용했고 기존 밝은 SVG 구조도는 원본 그대로 유지했다. 강의 소개·개념지도에는 PresentationSurface를 적용하지 않았다. 공통 테마/지도 CSS는 바꾸지 않았다.

## 독립 검토 반영

| 항목 | 반영 |
| --- | --- |
| R1 · 기초 지도 통합 충돌 | 새 지도 보기·도메인·노드·관계·용어 등록 제외. 기존 링크만 사용 |
| R2 · 보호 범위와 기준선 | 별도 카드 원고 모듈. 기존 원고·SVG·지도·엔진 보호. 과거 golden과 이번 기준 커밋 비교를 구분 |
| R3 · 주소와 NAT | 라우팅 가능한 주소와 실제 접속 조건 구분. 문서용 주소 명시. 일반 NAT와 사례의 IGW 1:1 NAT 구분 |
| R4 · 서브넷과 보안 | 네트워크 정의 추가. 범위 분할 자체는 차단 규칙이 아님을 명시. SG는 ENI에 적용 |
| R5 · 패킷·프로토콜 | HTTP 80 / HTTPS 443 배지와 본문, 요청 일부 `GET /`, 임시 포트, HTTP와 패킷의 비일대일 관계, NAT의 응답 역방향, TCP 신뢰성과 업무 성공의 차이 |

기술 대조 근거는 [수정 설계 §7](../../content/mission-stories/main-m05/network-foundations-patch-v0.1.md#7-근거와-완료-상태)의 AWS 공식 문서와 RFC다. B3-1 사례는 전달된 독립 검토가 확인한 `Codyssey_B3-1` `c689299`의 2026-10-14 기록으로 고정했다. 현재 AWS 자원을 조회하지 않았고 실제 공인 주소·작업자 주소·자원 ID를 추가하지 않았다.

## 실제 수행한 QA

| 검사 | 결과 | 실행 범위 |
| --- | --- | --- |
| `npm run build` | PASS | 데이터·지도 검증, TypeScript, Vite, 기존 B2-1 원고·SVG 빌드 검사 |
| 최종 렌더러 수정 후 `npx tsc -b` / `npx vite build` | PASS | 최종 소스에서 재확인. 기존 chunk 500kB 경고는 남아 있음 |
| 관련 Vitest | **122 PASS** | 11개 파일. 새 카드 3개, 기존 B3-1 원고/가이드, 지도 좌표·경로, B2-1 카메라/탐색, B6-1 Story/지도 |
| 새 브라우저 검사 | **10 PASS** | 4개 viewport × Dark/Light의 8개 사례 + 보호 소스 + 링크/테마 왕복 |
| 기존 브라우저 회귀 | **78 PASS** | B3-1 Story 36, B3-1 지도 16, B6-1 지도/Story 및 B2-1 지도 17, 공통 Story·B2-1 테마/발표자 9 |
| 보호 소스 | **153개 동일** | `71b8784` Git blob와 UTF-8 LF 정규화 비교. [대상 목록](protected-sources.json) |
| 가독성·대비·넘침 | PASS | 1280×720, 1000×720, 360×800, 390×844 × Dark/Light × 카드 A/B/C. 본문/코드/주소/포트/표 최소 14px, 측정 텍스트 대비 4.5:1 이상, 페이지·표 가로 넘침 없음 |
| 카드 키보드·초기 상태 | PASS | 기본 접힘, Enter 열기, Space 닫기, 질문 2개·기대 답 2개. 새 장면에서 이전 카드가 남지 않음 |
| 기존 장면·흐름·종료 | PASS | 다섯 Scene, 이전/다음·선택·새로고침·확대 대화상자·요청/응답 강조·미션 복귀 |
| 지도·사전·Story 왕복 | PASS | 기존 노드/관계 선택, 지도에서 원래 Scene 복귀, 사전 경유 복귀, 지도에 강의 테마 미적용 |
| 실물 기기·강의실 프로젝터·공개 Pages·현재 AWS | **미검증** | 실제 브라우저의 반응형 화면 검사와 구분 |

측정 결과는 `*-metrics.json` 8개에 보존했다. 28개 화면 캡처를 저장했다(카드 24 + 접힘 4). PC의 V1/V2, 모바일의 V1/V2/표, Dark 및 Light 대표 캡처를 직접 열어 카드·주소·중첩 경계·표 셀 줄바꿈을 확인했다. 모든 테마·실물 기기의 시각 검수를 수행했다고 주장하지 않는다.

### 변경에 맞춰 수정한 테스트

- `mission-story-ui-v12.spec.ts`: B3-1 강의의 “presentation-theme 없음” 단언을 Owner 지시의 Dark 기본으로 변경했다. 소개·지도는 여전히 테마 래퍼 없음으로 검사한다.
- `b31-story-map.spec.ts`: 새 강의 테마 선택기와 사이트 테마 선택기가 함께 존재하므로 `화면 테마`를 정확히 일치시켜 찾는다. 기존 기능 단언은 유지했다.
- 기존 golden SVG·데이터·해시·기준선 스크립트는 바꾸지 않았다. 기존 보고서의 캡처는 테스트 실행 시 생성되더라도 이번 변경에 덮어써 커밋하지 않았다.

### 과거 기준선·기존 실패를 별도 기록

`node scripts/qa_b31_story_baseline.mjs`는 **FAIL**이었다. 브라우저 비교 전에 `Golden source changed: src/missionConceptMap/missionConceptMap.css`에서 종료됐다. 이 파일은 이번 브랜치에서 바꾸지 않았으며 위 `71b8784` 보호 검사에서도 동일하다. 해당 스크립트는 과거 `410b3a0`과 비교하므로 이후 반영된 UI 변경을 포함하는 현재 기준과 다르다. 이 실패를 새 카드 회귀나 PASS로 바꾸지 않았고 golden을 현재 값으로 교체하지 않았다.

- 과거 캔버스 **128상태 픽셀 비교는 미실행**이다. 소스 불변·현재 지도 브라우저 기능 검사와 같은 증거로 취급하지 않는다.
- 기존 B2-1 정밀 카메라 스크립트 실패는 이전 B6-1 보고서에서 `d948ecf`에서도 재현된 별도 기존 이슈다. 이번에는 해당 정밀 검사를 재실행하지 않았으며 PASS 수에 넣지 않았다. B2-1의 주요 지도·Story·테마/발표자 검사는 위 78개 회귀에 포함했다.

## 대표 캡처

| 화면 | 접힘 | A · 주소·서브넷 | B · 패킷·프로토콜 | C · AWS 비교 |
| --- | --- | --- | --- | --- |
| 1280×720 Dark | [화면](1280-collapsed.png) | [A](1280-dark-scene-01.png) | [B](1280-dark-scene-02.png) | [C](1280-dark-scene-03b.png) |
| 1000×720 Dark | [화면](1000-collapsed.png) | [A](1000-dark-scene-01.png) | [B](1000-dark-scene-02.png) | [C](1000-dark-scene-03b.png) |
| 360×800 Dark | [화면](360-collapsed.png) | [A](360-dark-scene-01.png) | [B](360-dark-scene-02.png) | [C](360-dark-scene-03b.png) |
| 390×844 Dark | [화면](390-collapsed.png) | [A](390-dark-scene-01.png) | [B](390-dark-scene-02.png) | [C](390-dark-scene-03b.png) |

Light 확인 예시: [1000px V2](1000-light-scene-02.png), [390px V2](390-light-scene-02.png), [360px 비교 표](360-light-scene-03b.png). 카드 캡처는 펼친 카드 전체를 촬영하므로 한 viewport에 모두 보인다는 뜻이 아니다.

## 변경 파일과 기존 기능 영향

- `src/b31Foundations/B31Foundations.tsx`: 카드 원고·V1/V2·표·이해 확인·기존 자료 링크.
- `src/b31Foundations/foundations.css`: 해당 카드에만 적용하는 반응형·Presentation 색 토큰.
- `src/B31StoryMap.tsx`: A/B/C 삽입. 카드와 기존 그림의 React key를 구분해 장면 이동 시 이전 카드가 남지 않게 했다.
- `src/missionUI/B31LearningPage.tsx`: 강의 상태의 Dark/Light 공통 컴포넌트 연결. 소개·지도는 기존 경계 유지.
- `src/b31Foundations/foundations.test.tsx`, `playwright/b31-network-foundations.spec.ts`: 콘텐츠 범위·링크·읽기 크기·대비·기존 소스 보호·실제 동작 검사.
- 기존 Playwright 두 파일의 위 테마 관련 단언/선택자, 수정 설계 문서, `docs/mission-guides/b3-1-status.md`, 이 QA 폴더.

기존 원고·8개 Scene SVG·지도 JSON/엔진/보기 전환·canonical·가이드·B2-1·B6-1 프로덕션 코드는 변경하지 않았다. 기존 장면 위치에는 접힌 카드 높이만큼의 의도된 이동이 있으며, 모바일에서 한 줄만 차지한다고 약속하지 않는다. 새 기초 지도나 사전 항목은 없다.

미해결 신규 기능 실패는 발견하지 않았다. Owner 실제 화면 승인·교육 효과·실물 기기 검수와 위 과거 기준선 이슈는 남아 있다. 이번 작업은 Owner 검수 단계에서 멈춘다.

## 재실행

```powershell
npm run build
npx vitest run src/b31Foundations src/b31StoryMapContent.test.ts src/b31GuideContent.test.ts src/b31GuideView.test.tsx src/missionConceptMap src/b21ConceptExplorer src/b61Story src/b61ConceptMap
$env:PLAYWRIGHT_PORT='4186'
$env:PLAYWRIGHT_CHANNEL='chrome'
$env:B31_QA_OUTPUT='C:/Users/hyun0/AppData/Local/Temp/b31-foundations-regression'
npx playwright test playwright/b31-network-foundations.spec.ts playwright/b31-story-map.spec.ts playwright/mission-concept-map.spec.ts playwright/b61-concept-map.spec.ts playwright/mission-story-ui-v12.spec.ts --workers=2 --reporter=line
```
