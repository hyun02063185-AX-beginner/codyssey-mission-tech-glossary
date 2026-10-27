# B3-1 네트워크 기초 개념지도 구현 QA

- 구현 브랜치: `feature/b3-1-network-basics-map-web`
- 구현 소스 커밋: `3b4157c` (기능 `44fc749` + 모바일 공간 회귀 수정). QA 기록 후속 커밋은 실행 코드 변경 없이 추가한다.
- 설계: `content/b3-1-network-basics-map-design` / `410da9d736947eca6dcd33e600a6dfda27489bc0`
- main 보호 기준: `2149a66b9f9ecda0a4d2373d67c8d13b614f52ad`
- 2026-10-27, 교육장 Mac, 시스템 Chrome, sudo 미사용.
- 상태: 구현·자동 QA 후 **Owner 실제 화면 검수 대기**. main 병합·배포 없음. 최종 구현 HEAD는 이 보고서를 포함한 브랜치의 `git rev-parse HEAD` 및 완료 응답에 기록한다.

## 구현

후보 D 데이터를 원본과 비교 검토한 뒤 적용했다. 신규 8노드·10관계·3비교 카드를 추가하고 공인 IP·사설 IP·포트 3개는 공유한다. CIDR은 관련 용어로 연결하며 AWS 자원은 기존 보기에서만 표시한다. `subnet` 직접 소유권은 `bas:subnet`으로 옮겼다. 기존 링크·설명은 보존하고, 일반망 주소 범위의 오래된 termIdNote만 승인 설계에 맞췄다.

보기 소속은 `viewHasNode`/`viewHasRelation`으로 통일했다. URL·검색·관계 선택은 대상을 표시하는 보기로 이동한다. 엔진은 보기 밖 끝점·경유점을 가진 관계를 배치하지 않으며 독립 런타임 검증기가 이를 오류로 보고한다. `appliedIn`과 역방향 링크로 사례 이동·기초 개념 복귀를 제공한다. 상세 제목은 요청대로 **관련 사례에서 보기**, 항목은 **일반망 예시 / B3-1 AWS**로 표시한다.

보기 버튼은 네 번째에 추가했다. 700px 이하에서는 한 줄 가로 스크롤로 표시해 기존 툴바 높이와 지도 공간을 보존한다. 기존 엔진·캔버스·좌표 알고리즘을 유지하고, 선 불투명도만 개요 .28→.52, 비선택 .055→.24로 올렸다. 선택 관계와 비교 대상은 실선 강조·점선 테두리·상세 비교 카드를 구별한다. Story 카드 A/B 링크와 원고·SVG·canonical·B2-1/B6-1 콘텐츠는 변경하지 않았다.

## 파일

| 구분 | 파일 |
| --- | --- |
| 데이터 | `data/mission-story-maps/main-m05/concept-map.json` |
| 엔진·타입 | `src/missionConceptMap/conceptMapAdapter.ts`, `conceptMapTypes.ts` |
| 화면 | `src/missionConceptMap/MissionConceptMap.tsx`, `ConceptMapDetailPanel.tsx`, `missionConceptMap.css` |
| 독립 검증 | `scripts/validate_mission_concept_map.py` (drafts 검증기의 모든 기존 검사 유지 + 기초 보기 규칙, drafts 파일 불변) |
| 단위·변이 | `src/missionConceptMap/conceptMapAdapter.test.ts`, `src/b31StoryMapContent.test.ts`, `scripts/test_validate_mission_concept_map.py`, `scripts/b31_runtime_validator.test.mjs` |
| 기하 보호 | `scripts/qa_b31_map_geometry.mjs`, `scripts/b31_map_geometry.test.mjs`, `src/missionConceptMap/fixtures/b31-main-2149a66-geometry.json`, `scripts/b31_network_basics_emphasis.json` |
| 소스 보호 | `playwright/b31-network-foundations.spec.ts`, `scripts/b31_network_basics_contract.json` |
| 브라우저·대비 | `playwright/b31-network-basics.spec.ts`, `scripts/qa_b31_basics_contrast.mjs` |
| 보고 | 본 폴더, `docs/mission-guides/b3-1-status.md` |

## 데이터·레이아웃

[런타임 검사](validator.txt): 전체 **44노드 / 67관계 / 9비교 카드**, canonical 직접 연결 중복 0, 고립 0, 끝점·경유점·출처·장면·주소 참조 유효. glossary validator **523 canonical / 오류 0 / 경고 0** ([로그](glossary.txt)).

| 보기 | 핵심 노드/관계 | 보충 포함 노드/관계 | 기본 표시 |
| --- | --- | --- | --- |
| 전체 관계 | 23/31 | 36/57 | 핵심 |
| 일반 네트워크 | 15/15 | 26/34 | 보충 포함 |
| AWS 네트워크 | 12/12 | 15/17 | 보충 포함 |
| 네트워크 기초 | 10/9 | **11/10** | 보충 포함 |

기초 보기는 **1536×400, 4열**이다. 카드 관통·대각선·경계·끝점 중복과 선택 시 좌표·경로 안정성 검사를 기존 테스트에 추가했다.

별도 main fixture는 `git show 2149a66:...`로 main 데이터·엔진에서 생성했다. 재현: `node scripts/qa_b31_map_geometry.mjs --generate` (이 별도 fixture만 생성), 검증: `node scripts/qa_b31_map_geometry.mjs`. 기존 Golden Baseline은 덮어쓰지 않았다.

- [Phase 1 링크 보강 직후](phase1-geometry.json): 1,128 상태, 기하·투영·강조 차이 0.
- [엔진 확장 직후](engine-geometry.json): 1,128 상태, 기하·투영·강조 차이 0.
- [최종 후보 D](final-geometry.json): 1,128 상태, **기하·투영 차이 0**. CB01 강조 변화 24건만 정확한 상태별 SHA로 별도 고정. 나머지 강조 변화 0.
- B2-1 45노드/24관계, B6-1 11노드/12관계: main fixture와 기하·투영 동일.
- 기존 `71b8784` 소스 보호 기준은 보존한다. 이번 요청의 정확한 파일 차이·SHA만 별도 계약으로 검사한다. 나머지 콘텐츠·SVG·UI 인벤토리는 기존 바이트 동일 검사 유지.
- 과거 `qa_b31_story_baseline.mjs`, `qa_mission_learning_visuals.mjs`의 역사적 바이트·픽셀 기준은 변경하지 않았다. 이번 기능은 의도적으로 지도 데이터·스타일을 바꾸므로 그 과거 동일 화면 판정의 대용으로 보고하지 않는다.

## 실행 결과

| 실행 | 결과 |
| --- | --- |
| `npm run build` / `npx tsc -b` | PASS ([빌드](build.txt), [TypeScript](typescript.txt)); 기존 청크 크기 경고 유지 |
| `npm run build:extension` | PASS ([로그](extension.txt)) |
| `npm test -- --maxWorkers=1` | **458 PASS / 기존 2 FAIL** ([최종](vitest-final.txt)). main은 452 PASS / 같은 2 FAIL ([main](baseline-vitest.txt)) |
| 신규 기초 보기 | **42 PASS**: 5폭×4테마×Light/Dark 40 + 전체 탐색/노드·관계·줌·드래그 2 |
| main 전체 Playwright | **236 PASS / 기존 44 FAIL**, skipped/flaky 0 ([원본](baseline-playwright.json)) |
| 최초 구현 전체 Playwright | **233 PASS / 47 FAIL**: main과 동일한 기존 44 + 모바일 회귀 3 ([원본](implementation-playwright-initial.json)) |
| 모바일 수정 후 영향 QA | **70 PASS**: 신규 42 + 기존 레이아웃 6 + 선택/왕복/모바일/기하/소스 보호 22 ([48건](playwright-mobile-fix.txt), [22건](playwright-affected.txt)) |
| 런타임·변이·기하 | PASS ([검증](validator.txt), [변이](mutations.txt), [기하](final-geometry.json)) |
| `npm run content:plan` | 기존 `S7-B01 has 0 terms` ValueError, main 동일 ([구현](sprint7.txt), [main](baseline-sprint7.txt)) |
| glossary / content integrity | 오류 0 / 새 경고 0 ([glossary](glossary.txt), [integrity](integrity.txt)) |

[실패 대조](regression-summary.json): 기존 44건은 B2-1 story 6, B3-1 content-final QA 16, map palette 17, lanes 4, guide 1로 main과 정확히 일치한다. 미해결 신규 실패 **0**. 전체 최초 실행을 PASS로 바꿔 적지 않았고, CSS만 바뀐 후 영향 범위 70건을 재실행했다. 기존 44건을 다시 전체 실행하지 않았다.

이번에 발견한 모바일 회귀는 2열 보기 버튼의 툴바 높이 156px(기존 기대 <110px), 리사이즈 후 선택 카드 가림이었다. 한 줄 가로 스크롤로 바꿔 기존 지도 공간을 회복했고, 기존 테스트 기대값·타임아웃을 변경하지 않았다. 마지막 캡처는 수정 후 화면이다.

전체 Vitest를 두 브라우저 회귀와 동시에 실행할 때 기하 all 테스트가 5초 제한에 걸린 기록은 [중간 로그](vitest-full.txt)에 보존했다. 같은 소스·기대값·제한 시간으로 단독 33건 및 최종 전체 460건을 재실행해 신규 시간 초과가 없음을 확인했다. 기존 실패 2건은 `b21Learning/service.test.tsx`의 다른 미션 정의 보호와 `missionUI/missionUI.test.tsx`의 B6-1 링크 기대값이다.

실행 환경: Playwright 시스템 Chrome, headless, `--workers=2`; main 포트 4181 / 최초 구현 4182, 별도 main worktree 사용. 최초 구현 전체 실행에 전달한 `--ignore-snapshots`는 저장소의 screenshot/snapshot matcher가 0개라 적용 대상이 없다. 모든 DOM·좌표·CSS·기능 단언은 그대로 실행했고, 수정 후 70건은 이 옵션 없이 실행했다.

[변이 검사](mutations.txt): Claude 설계 8개 모두 검출. common 전체 포함, subnet 중복 소유, 보기 밖 끝점, appliedIn 보기 불일치, 3노드 카드 내부 관계, 보충 끝점 핵심 관계, 그림 밖 주소, AWS 노드 공유. 추가로 없는 경유점과 잘못된 경로 양끝도 검출한다. Vitest가 Python 회귀 검사를 직접 실행한다.

[대비 측정](contrast.json): 4 사이트 테마 × OS Light/Dark, 보기 버튼·선택/연결/비교 노드 글자·영역 제목·관련 사례·상세 제목/문단의 최저 대비 **5.73:1**, 4.5:1 미만 0. 캔버스는 기존 규격의 밝은 학습 팔레트를 유지하며 Presentation Dark를 지도에 적용하지 않는다. 흐린 비관련 노드의 의도적 opacity는 기존 hover/focus 회귀로 따로 검증한다.

## 화면·Owner 검수

- [1920 Light 개요](captures/1920-light-overview.png) / [1920 Dark TCP](captures/1920-dark-tcp.png)
- [1280 Light 개요](captures/1280-light-overview.png) / [1280 Dark TCP](captures/1280-dark-tcp.png)
- [1000 Light 개요](captures/1000-light-overview.png) / [1000 Dark TCP](captures/1000-dark-tcp.png)
- [390 Light 개요](captures/390-light-overview.png) / [390 Dark TCP](captures/390-dark-tcp.png)
- [360 Light 개요](captures/360-light-overview.png) / [360 Dark TCP](captures/360-dark-tcp.png)

모바일 전체 맞춤은 전체 구조 확인용으로 글자가 작아진다. 읽기 크기·선택 초점·드래그로 개념을 읽는다. 실제 프로젝터·실물 모바일 터치·공개 Pages 및 교육 효과는 미검증이다.

로컬 실행 중: **http://127.0.0.1:4190/#/missions/main-M05/story-map/concepts?view=basics**

서버 재시작: `npx vite --host 127.0.0.1 --port 4190 --strictPort`.

Owner 시연: 네트워크→서브넷→IP 주소, 패킷→IP 주소, TCP 비교 카드, 관련 사례의 Security Group 이동·복귀, 용어사전과 Story 왕복. Owner의 화면 확인 전 병합·배포하지 않는다.
