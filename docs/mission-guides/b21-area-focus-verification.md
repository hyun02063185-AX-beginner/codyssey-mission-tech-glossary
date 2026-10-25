# B2-1 Concept Explorer — Area Focus UX

검증일: 2026-10-25 (Asia/Seoul). 저장소 `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`, 브랜치 `content/b2-1-story-map-foundation`, 작업 폴더 `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`.

## 기준과 작업 범위

시작 HEAD 및 원격 지정 브랜치는 `eeed8cb56ca132ab687ea084c3956a13fe17477e`였고, fetch 후 차이 `0 / 0`을 확인했다. 기존 생성 데이터 33개의 EOL 변경은 원래 바이트 해시와 대조해 보존하고 커밋에서 제외한다([초기 상태](../../reports/b21-area-focus/initial-worktree.json)). 완료 HEAD와 실제 Push 결과는 이 보고서를 포함하는 Git 커밋 및 최종 완료 응답에 기록한다.

이번 지시서 §12는 기존 개발 브랜치에 **커밋·Push까지 명시적으로 요청**했다. 따라서 이전 단계의 ‘로컬 커밋까지만’ 조건 및 AGENTS의 기본 Push 위임보다 이번 사용자 지시를 적용한다. main 병합·공개 배포는 하지 않는다. Pages workflow는 `main` push 또는 수동 실행만 대상으로 하며, 이번 브랜치 Push로 배포하지 않는다.

## 전체 지도와 영역 집중 보기

표시 범위 `scope`를 기존 `area`와 분리했다. `area`는 선택한 노드의 소속 및 기존 주소의 맥락으로 유지하고, **`scope=all` 또는 실제 영역 ID**로 지도 표시 범위를 결정한다. 기본값은 `all`이며 URL에서는 생략하므로 기존 주소를 유지한다.

- **전체 지도:** 45개 개념·7개 영역·24개 원본 관계에서 기존 선택/유형/강조를 적용한다. 전체 지도에서 노드를 골라도 영역 집중으로 바뀌지 않는다.
- **영역 집중:** 명시적으로 영역 드롭다운을 고르면 해당 영역 노드·배경과 양 끝이 모두 그 영역에 있는 관계만 SVG에 렌더링한다. 다른 영역 요소를 흐리게 남기는 방식이 아니다.
- **영역 내 노드 선택:** 현재 scope를 유지한다. 전역 45개 선택에서 다른 영역의 개념을 고르면 전체 지도에서 그 개념을 연다.
- **외부 관계:** 집중 보기의 SVG에서는 숨기고, 상세/관계 패널에 외부 연결 수와 원본 관계 ID·방향을 표시한다. ‘전체 지도에서 연결 보기’는 scope를 `all`로 전환하고 원본 관계 양 끝이 보이도록 맞춘다.
- **비교:** 같은 영역의 쌍은 scope를 유지한다. 다른 영역의 쌍은 전체 지도에서 두 개념이 보이게 맞추며 비교 표식을 사용한다. 비교를 위한 새 관계선은 만들지 않는다.
- **강사 안내:** P1~P3 진입·주소 복원은 전체 지도에서 수행하므로 다른 영역의 안내 노드를 숨기지 않는다. 현재 세션에서 자유 탐색으로 돌아오면 저장한 scope/선택을 복원한다.

큰 왼쪽 ‘영역·개념’ 패널은 제거했다. 전체 지도 버튼, 실제 7개 영역 명칭을 쓰는 범위 선택, 45개 개념 선택, 상세·관계 버튼으로 대체했다. PC 한 줄 도구 구성과 우측 상세, 모바일 하단 시트, 전체 화면 탐색을 재사용했다. 모바일은 범위/개념 두 줄로 배치해 이름이 지나치게 좁은 select에 갇히지 않도록 했다.

## 7개 영역의 데이터 기준 표시 수

| 영역 | 개념 | 내부 관계 | 외부 관계 |
| --- | ---: | ---: | ---: |
| 실행·CLI | 4 | 1 | 1 |
| 모듈·패키지 | 11 | 6 | 1 |
| 함수·계층 책임 | 6 | 2 | 1 |
| CRUD·파일 저장 | 8 | 2 | 1 |
| Iterator·Generator | 6 | 6 | 0 |
| Decorator | 5 | 3 | 0 |
| Type Hint·검증 | 5 | 2 | 0 |

내부 관계 합계는 22개이고 영역 간 관계는 원본 **R04·R19 두 개**다. 외부 관계 열은 각 영역에서 집계하므로 같은 영역 간 관계가 양쪽에 한 번씩 나타난다. 전체 지도 원본 24개를 삭제하거나 재해석하지 않았다. 원본 adapter·좌표·route points·비교·P 경로 데이터도 수정하지 않았다.

## 카메라와 가독성

선택 영역 노드의 실제 카드 좌표와 내부 관계 route points에서 범위를 계산하고 여백을 더해 중심을 맞춘다. 영역 집중의 ‘전체 맞춤’은 해당 영역 전체를, 전체 지도의 ‘전체 맞춤’은 전체 그래프를 대상으로 한다. 단순히 전체 그래프 위에서 카메라만 이동시키지 않는다.

영역 집중의 개념 이름은 SVG 18px을 사용하고 초기 읽기 배율의 하한을 0.75로 정해 실제 글자 크기 **13.5px 이상**을 유지한다. 원래 카드 너비 안에 전체 이름이 들어가는지 검사하며 생략하지 않는다. 패널/시트·큰 화면 크기 변경 시 읽기/수동 카메라의 중심·배율을 보존한다.

**긴 영역의 표시 방식:** 모듈·패키지 11개와 저장 영역 8개는 원래 세로 좌표를 유지한다. 작은 화면에서 이들을 모두 한 번에 맞추면 이름이 작아지므로 기본 읽기는 일부가 viewport 밖에 있을 수 있으며 위아래 이동으로 읽는다. 화면에 이 안내를 표시하고, ‘영역 전체 맞춤’에서는 모든 해당 노드가 화면 안에 들어오도록 별도로 맞춘다. 좌표를 재배치하거나 글씨를 줄여 전체를 억지로 압축하지 않았다. 이 읽기/한눈에 보기 전환은 Owner가 최종 시각 검수할 항목이다.

## 기존 URL과 학습 왕복

`?node=generator`와 기존 `?area=area-iteration`은 계속 전체 지도 의미다. 노드 선택에 의해 채워지는 area로 필터링하지 않는다. 집중 주소 예시는 다음과 같다.

```text
#/missions/main-M03/story/concepts?scope=area-iteration
#/missions/main-M03/story/concepts?scope=area-iteration&node=generator
```

scope는 새로고침·뒤로/앞으로·복습 history state·사전 복귀 주소에 기존 허용 상태와 함께 보존한다. 다른 영역의 노드/관계/비교를 요구하는 모순된 집중 주소는 전체 지도로 안전하게 정규화한다. 알 수 없는 scope와 중복 파라미터는 기존 오류 복구/복귀 거부 계약을 적용한다. 외부 URL이나 미검증 장면을 새 복귀 대상으로 허용하지 않는다.

Generator 집중 → 사전 → 새로고침 → 집중 지도, 집중 → 검증된 Story 복습 → 새로고침 → 집중 지도, 원래 `scene=05&step=gen&back=6` 강의 복귀를 검증한다. v2 03a/03b의 임의 매핑과 기존 연결 보류는 유지한다.

## 수정 파일

- `src/b21ConceptExplorer/state.ts`: 독립 scope 상태, 엄격한 URL 해석·복원 및 모순 상태 안전 복구.
- 새 `scope.ts`, `scope.test.ts`: 원본 참조만 사용하는 영역 projection·외부 관계·좌표 범위와 데이터/주소 검사.
- `ConceptExplorer.tsx`: 컴팩트 범위 드롭다운, 왼쪽 패널 제거, 외부 관계 전환, 비교/강사 안내의 scope 처리.
- `ExplorerCanvas.tsx`, `camera.ts`, `explorer.css`: 실제 SVG 필터링, 범위별 맞춤·읽기·비교 표시, 모바일 시트 보존.
- 기존 SSR/UI·Map-first·U5 브라우저 검사와 새 `scripts/check_b21_area_focus.mjs`, `package.json`: 새로운 범위 계약을 검증하고 기존 데이터/왕복 검사는 보존.
- 본 보고서와 `reports/b21-area-focus/`: 실행 기록·PC/모바일 증빙.

`App.tsx`, Story 8장면·128단계 및 강사 대본/디자인/해시, 45개념·24관계·10비교·7영역 원본, U4 용어 18개·가이드/분야 지도, B3-1, 다른 미션, 배포 설정에는 변경이 없다. [보호 파일 대조](../../reports/b21-area-focus/protection.json)는 **1,590개 PASS**다.

## 자동 검사와 시각 증빙

기존 기능 검사는 삭제하지 않고, 제거된 왼쪽 패널에 대한 배치 조건만 드롭다운/실제 렌더링 범위 검사로 교체했다. 별도 Area Focus 검사는 PC 1280×720, 390×844, 360×800에서 7개 영역 각각의 정확한 DOM 노드·관계·배경 ID, 실제 범위 중심, 초기 글자 크기, 영역 전체 맞춤, 내부 선택, 외부 관계, 패널·전체 화면, 이력·새로고침·Story/사전 왕복을 확인한다.

검사 중 모바일 시트 규칙 누락을 발견해 복원했고, 범위 선택 직후 UI 반영을 확인한 다음 탭을 조작하도록 새 검사 대기 순서를 수정했다. 관계·비교의 선택 노드가 바뀔 때 소속 area도 같은 동작에서 기록하도록 고쳐, 새로고침 전후 주소가 뒤늦게 정규화되는 현상도 해결했다. 데이터·가독성·카메라 중심의 판정 조건이나 기존 회귀 허용치를 넓히지 않았다.

최종 실행 상태는 [회귀 기록](../../reports/b21-area-focus/regressions.json), [Area Focus 결과](../../reports/b21-area-focus/area-results.json), [U5 실제 App 결과](../../reports/b21-area-focus/u5/app-results.json)에 기록한다. 기존 C2·U5·Map-first 증빙을 덮어쓰지 않았다.

| 검사 | 최종 판정 |
| --- | --- |
| `b21:concept-check` | PASS · 1,114 checks, 기존 45/24/10·모든 P 경로·보류·왕복·CSS 격리 + 영역별 표시 |
| `b21:area-focus-check` | PASS · 개발/빌드 각 440, **합계 880 checks** · 7개 영역·카메라·터치·상세·외부 관계·범위 복원 |
| `b21:map-first-check` | PASS · 213 checks, 네 viewport의 공간·패널·전체 화면·입력·왕복 |
| `b21:router-check` | PASS · 209 checks, 기존 U3 단계·발표자·동기화 계약 |
| `b21:u4-check` | PASS · 84 checks, 승인 용어 18개·가이드/분야 지도·왕복 |
| `b21:v3-parity` | PASS · 384화면·5,269 assertions, 기존 강의 디자인 |
| `npm.cmd test` | PASS · 26파일·374 tests, 신규 scope 검사 14개 포함 |
| `npm.cmd run build` | PASS · tsc/Vite/Foundation build-check |
| `b21:u5-check` | PASS · 개발/빌드 합계 352 checks, B3·다른 미션·발표자·실제 서비스 왕복 |

[QA 요약](../../reports/b21-area-focus/qa-summary.json), [빌드 결과 Area Focus 검사](../../reports/b21-area-focus/built-app/area-results.json), [원래 33개 파일 보존](../../reports/b21-area-focus/preserved-worktree.json)을 함께 남겼다. 개발/빌드에서 영역별 수와 카메라 실측 값이 같았다. `regressions.json`은 명령별 최종 판정이고, 첫 실행의 FAIL과 로그는 `initial-regressions.json`, `initial-area-focus.log`, `initial-u5.log`에 보존했다. 수정 후 해당 검사들을 다시 PASS했으며 최종 미해결 FAIL은 없다. 기존 Vite 큰 청크 경고는 한도를 바꾸지 않고 유지했다.

SKIP: Owner의 최종 사람 대상 시각/수업 승인, main 병합, 공개 배포·공개 사이트 갱신, 원격 CI(현재 workflow는 main/수동 실행만 대상). Push는 이번 지시에 포함되며 금지된 공개 전환과 구분한다.

| 화면 | PC 1280×720 | 모바일 390×844 | 모바일 360×800 |
| --- | --- | --- | --- |
| 전체 지도 | [PC](../../reports/b21-area-focus/1280-720-whole.png) | [390](../../reports/b21-area-focus/390-844-whole.png) | [360](../../reports/b21-area-focus/360-800-whole.png) |
| Iterator·Generator 집중 | [PC](../../reports/b21-area-focus/1280-720-area-iteration.png) | [390](../../reports/b21-area-focus/390-844-area-iteration.png) | [360](../../reports/b21-area-focus/360-800-area-iteration.png) |
| 모듈·패키지 집중 | [PC](../../reports/b21-area-focus/1280-720-area-structure.png) | [390](../../reports/b21-area-focus/390-844-area-structure.png) | [360](../../reports/b21-area-focus/360-800-area-structure.png) |
| 집중 상세 패널/시트 | [PC](../../reports/b21-area-focus/1280-720-area-iteration-detail.png) | [390](../../reports/b21-area-focus/390-844-area-iteration-detail.png) | [360](../../reports/b21-area-focus/360-800-area-iteration-detail.png) |
| 외부 관계 전체 지도 전환 | [PC](../../reports/b21-area-focus/1280-720-external-connection.png) | [390](../../reports/b21-area-focus/390-844-external-connection.png) | [360](../../reports/b21-area-focus/360-800-external-connection.png) |

## Push와 남은 Owner 검토

개발 브랜치의 실제 Push 명령 및 결과는 최종 완료 응답과 원격 HEAD 대조로 확인한다. main 병합·배포·공개 사이트 갱신·workflow 수동 실행은 하지 않는다. Owner의 마지막 사람 대상 시각 검수는 자동 PASS로 대신하지 않는다.

```powershell
git push origin content/b2-1-story-map-foundation
```

Owner 검토: [전체 지도](http://127.0.0.1:4180/#/missions/main-M03/story/concepts), [Iterator·Generator 집중](http://127.0.0.1:4180/#/missions/main-M03/story/concepts?scope=area-iteration), [모듈·패키지 집중](http://127.0.0.1:4180/#/missions/main-M03/story/concepts?scope=area-structure).
