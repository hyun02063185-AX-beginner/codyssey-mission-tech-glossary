# 미션 중심 학습 진입 UX 개편

기준: `feature/b3-1-story-map-web-integration`의 `7cfdecc1935f43814b2a09313e75fdcca786939c`. 작업 시작 시 `git fetch origin`으로 원격 HEAD와 로컬 HEAD가 같고 작업 트리가 깨끗함을 확인했다. `origin/main`은 `517c33edd0eb28b596e44d8673fb0b4d5757b0ed`였다.

[AGENTS.md](../../AGENTS.md), [학습 운영 정책](../../docs/mission-guides/learning-operation-policy.md), [workflow](../../docs/mission-guides/workflow.md), [B3-1 인수인계](../../docs/mission-guides/b3-1-status.md)를 읽고 기존 콘텐츠·거버넌스·Owner Gate를 유지했다. 이번 변경은 기존 자료를 발견하고 탐색하는 UI다. 새 미션 원고·학습 데이터·canonical·공개 route를 추가하지 않는다.

## 확인할 화면

로컬 미리보기: [미션 목록](http://127.0.0.1:4174/#/missions), [B3-1 상세](http://127.0.0.1:4174/#/missions/main-M05), [개념지도](http://127.0.0.1:4174/#/missions/main-M05/story-map/concepts).

전 화면은 수정 전 `7cfdecc`의 프로덕션 빌드 사본을 별도 preview 서버 `4175`에서 실행해 캡처했다. 후 화면은 수정본 `4174`에서 캡처했다. 기준 빌드 사본을 고정했으므로 현재 빌드에 의해 전 화면이 바뀌지 않는다.

| 화면 | 1280px 전 | 1280px 후 | 360px 전 | 360px 후 |
| --- | --- | --- | --- | --- |
| 미션 목록 | [전](before-1280-list.png) | [후](after-1280-forest-list.png) | [전](before-360-list.png) | [후](after-360-forest-list.png) |
| B3-1 상세 | [전](before-1280-b31.png) | [후](after-1280-forest-b31.png) | [전](before-360-b31.png) | [후](after-360-forest-b31.png) |
| B2-1 상세 | [전](before-1280-b21.png) | [후](after-1280-forest-b21.png) | [전](before-360-b21.png) | [후](after-360-forest-b21.png) |
| B6-1 상세 | [전](before-1280-b61.png) | [후](after-1280-forest-b61.png) | [전](before-360-b61.png) | [후](after-360-forest-b61.png) |
| 별도 학습 자료가 없는 미션 | [전](before-1280-no-guide.png) | [후](after-1280-forest-no-guide.png) | [전](before-360-no-guide.png) | [후](after-360-forest-no-guide.png) |
| 홈페이지 | [전](before-1280-home.png) | [후](after-1280-forest-home.png) | [전](before-360-home.png) | [후](after-360-forest-home.png) |

1000·390px도 같은 이름 규칙으로 보관했다. 네 테마의 목록·B3-1 캡처는 `after-{1280|1000|390|360}-{forest|indigo|paper|signal}-{list|b31}.png`다.

## 달라진 학습 진입

- 상단 메뉴의 이름을 미션 학습·학습 지도로 바꾸고 기존 여섯 주소·순서를 유지했다. 홈페이지에는 미션 시작 링크를 검색 위에 추가했다.
- 목록은 실제 자료가 있는 미션을 먼저 추천한다. 예비 3개·본 13개 카드는 공식 제목, 실제 자료 종류와 미션/자료 링크를 보여 준다.
- 상세는 미션 소개 → 학습 시작 → 접힌 지식 확장 → 접힌 전체 용어 세 분류 순서다. 학습 경로는 권장이며 강제 순서가 아니다.
- 지식 확장에는 기존 학문·선수학습·핵심 개념·다음 학습·기술지도가 남아 있다. 용어는 원래 데이터에서 계산한 수와 canonical 링크를 그대로 사용한다.
- 자료가 없는 미션에는 가짜 스토리·가이드 링크 대신 지식 확장을 여는 버튼을 제공한다. 네이티브 `details/summary`는 Enter·Space로 열고 닫으며 브라우저 접근성 트리에 펼침 상태를 제공한다.

| 미션 | 상단에서 이용 가능한 실제 자료 | 근거 |
| --- | --- | --- |
| 본과정 B3-1 (`main-M05`) | 스토리 → 개념지도 → 실습가이드, 기업망 보강 링크 | 기존 스토리/지도 route, `content/mission-guides/main-m05` |
| 본과정 B2-1 (`main-M03`) | 학습 스토리 → 실습가이드 | 기존 B2-1 story route, `content/mission-guides/main-m03` |
| 본과정 B1-1 (`main-M01`) | 실습가이드 | `content/mission-guides/main-m01` |
| 본과정 B6-1 (`main-M11`) | 실습가이드 | `content/mission-guides/main-m11` |
| 예비과정 M03 | 기존 MAC 이야기·체험 학습 | `M03LearningStory`, 기존 오프라인 asset route |
| 나머지 11개 | 관련 지식·기술지도·분류별 용어 탐색 | 기존 Encyclopedia graph·mission-map-routing·glossary |

B3-1의 가이드·보강 링크는 각각 한 번만 표시한다. 전용 개념지도와 분야 기술지도를 다른 자료 종류로 취급하며, 다른 미션에 전용 개념지도 배지를 붙이지 않는다. 소개/질문은 기존 자료를 짧게 안내하고, 별도 원고가 없는 미션의 소개는 기존 연결 데이터에서 계산한다.

## 검증

- `npm run build`: **PASS**. 데이터 검증·TypeScript·Vite 빌드 성공. 기존 대용량 chunk 경고는 남아 있다. [로그](build.log)
- `npm test`: **132/132 PASS**, 14개 파일. [로그](unit-tests.log)
- `PLAYWRIGHT_PORT=4174 npx playwright test --workers=2 --reporter=line`: **191/191 PASS**. [로그](playwright.log)
- 새 브라우저 검사는 16개 미션의 공식 제목·세 분류의 실제 용어 수·모든 canonical 링크를 대조하고, Enter·Space로 열고 닫았다. 실제 자료 종류와 B3-1 가이드/보강 링크 각 1개, 추천 5개·카드 3+13개·메뉴 6개를 확인했다.
- 1280·1000·390·360px × Forest·Indigo·Paper·Signal에서 홈·목록·B3-1·B2-1·B6-1·별도 자료 없는 상세를 검사했다. 가로 넘침 없음, 학습→지식→용어 순서, 지식 기본 접힘, 메뉴의 키보드·터치 이동을 확인했다. 각 크기/테마의 상세 영역 위치는 `{width}-{theme}.json`에 있다.
- 기존 B1-1·B2-1·B3-1·B6-1 가이드, B2-1 스토리, 예비 M03 이야기/체험, `/terms` 한글 검색·조합·필터·뒤로가기, 분야 기술지도와 B3-1 지도/스토리 복귀 검사를 모두 통과했다.
- [접근성 트리 기록](accessibility-disclosures.json): Chromium이 네 요약을 `DisclosureTriangle`로 노출하고, 지식 확장의 `expanded`가 false→true로 바뀌며 초점을 유지한다. 실제 음성 출력은 미검증이다.
- [390px 홈페이지 첫 화면](home-top-390.png)에서 미션 시작 링크가 viewport 안에 보임을 추가 확인했다.

### B3-1 승인 시각 자료 보호

`node scripts/qa_mission_learning_visuals.mjs`로 보호 소스와 그림을 대조했다. 최종 결과는 [시각 비교 기록](protected-visuals.json)과 [로그](visual-comparison.log)에 남긴다. 변경이 허용된 전역 메뉴는 양쪽 비교 페이지에서만 숨기고, 일시적인 Windows 스크롤바도 제외했다. 이 설정은 서로 다른 헤더 높이에 따른 소수점 Y 위치의 안티앨리어싱 차이를 제거하며, 캔버스/그림의 크기·스타일·배치·데이터는 수정하지 않는다. 실제 전후 전체 화면에는 메뉴를 그대로 캡처했다.

- **보호 소스 20개 변경 없음:** 지도 JSON, 지도 런타임·배치·팔레트·패널, 스토리 런타임·복귀·스타일, Scene SVG 8개를 `7cfdecc`와 대조했다. Windows checkout의 줄 끝만 정규화한다.
- **캔버스 128개 픽셀 일치:** 네 화면 크기 × 네 테마 × OS light/dark × 기본/노드/관계/흐름 선택.
- **스토리 그림 16개 픽셀 일치:** 네 화면 크기 × Scene 01/02/03-A/03-B. 전체 144개 비교에서 불일치 0개다.
- `git diff 7cfdecc -- data content drafts src/missionConceptMap …`도 변경 없음이다. canonical·원고·원본 그림·기존 지도 데이터 계약을 보존했다. 이전 승인 지도 `410b3a0`과 `7cfdecc`의 대조 근거는 기존 [통합 기록](../b3-1-story-map-integration/README.md)을 재사용한다.

문서의 로컬 링크 **68개 누락 0개**를 [링크 검사 기록](document-links.json)에 남겼다. `git diff --check`, `git diff --cached --check`, `git diff origin/main --check`도 **PASS**다.

## 변경 파일과 검토 경계

- [App.tsx](../../src/App.tsx): 메뉴·홈 진입·공통 페이지 연결. 기존 스토리·지도·가이드 주소와 URL 복귀 로직 유지.
- [missionLearning.ts](../../src/missionLearning.ts): 실제 제공 자료·가이드 route의 작은 공통 설정, 기존 graph/registry를 이용한 미션·기술지도 정보.
- [MissionLearningPages.tsx](../../src/MissionLearningPages.tsx), [missionLearning.css](../../src/missionLearning.css): 목록·상세·자료 진입·네이티브 접힘 UI.
- [MissionEncyclopedia.tsx](../../src/MissionEncyclopedia.tsx): 기존 예비 M03 이야기를 상단 학습 영역으로 옮겼다. 이야기 원문·링크·나머지 지식 정보는 유지했다.
- [missionLearning.test.ts](../../src/missionLearning.test.ts), [mission-learning-entry.spec.ts](../../playwright/mission-learning-entry.spec.ts): 실제 자료 차이·16개 제목/분류/링크·화면 크기/테마/키보드/터치 검사.
- 기존 B2-1·B3-1·Encyclopedia·개념지도 브라우저 검사는 변경된 메뉴·학습 진입·접힌 지식 영역에 맞춰 조정했다. 스토리·지도 상호작용 검사는 유지했다.
- [시각 대조 스크립트](../../scripts/qa_mission_learning_visuals.mjs): `7cfdecc`와 보호 소스·지도 캔버스·스토리 원본 그림 비교.

**미검증:** 실물 휴대전화, NVDA/VoiceOver의 실제 음성 출력, 강의실 프로젝터와 공개 Pages. Chromium의 터치 에뮬레이션·키보드·접근성 구조는 실물 보조공학 검증과 구분한다. 기존 [B3-1 통합 기록](../b3-1-story-map-integration/README.md)의 Scene 원고·그림 독립 검토 및 Owner 게시 승인 대기는 그대로다. 이번 UI 검증은 그 승인을 대신하지 않는다.

작업은 로컬 커밋까지다. Push·main 병합·배포는 수행하지 않았다. Owner 실행 명령:

```powershell
git push origin feature/b3-1-story-map-web-integration
```
