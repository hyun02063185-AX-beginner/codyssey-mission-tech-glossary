# B3-1 통합 인터랙티브 개념지도 · Phase 1 검토 결과

2026-10-21 · 구현 및 로컬 QA 완료, **Owner의 사용성·디자인 검토 대기**.

## Git와 승인 범위

- 작업 브랜치: `feature/b3-1-interactive-concept-map-poc`
- 시작 커밋: `4e688f6d3d9076f5864646f27da7777466e1614a`
- 시작 시 로컬과 `origin/draft/b3-1-concept-map-v2-design`이 위 커밋과 일치했다. `git fetch origin`으로 확인했고 미커밋 변경은 없었다.
- 완료 커밋: 이 보고서를 포함하는 로컬 커밋. 정확한 SHA는 완료 메시지와 `git log -1 --format=%H`로 확인할 수 있다.
- 사용자가 제공한 Phase 1 작업 지시를 새 후보 데이터·전용 화면·지정 경로·미션 진입점의 구현 승인으로 적용했다. 초안 문서의 추가 구현 보류·모바일 기본 보기·엔진 추출 제안보다 이번 지시를 우선했다.
- 기존 가이드 상태도 확인했다. GitHub PR #4는 `624d56bd36f07ab5257eedb00c39f7a5558425cf`에서 병합된 상태였다. 이번 작업은 지정된 설계 브랜치에서 진행했다.
- Push·main 병합·서비스 배포는 수행하지 않았다. AWS 자원·기존 가이드 원고·용어사전·기존 지도 데이터는 변경하지 않았다.

## 실행과 접근

실제 QA 서버 실행 명령:

```powershell
cd C:\Users\hyun0\codyssey-mission-tech-glossary
npx vite --host 0.0.0.0 --port 4174 --strictPort
```

- [실행 중인 개념지도](http://localhost:4174/#/missions/main-M05/story-map/concepts)
- [B3-1 미션 진입점](http://localhost:4174/#/missions/main-M05)
- 동일 네트워크 휴대전화 검토용 주소: `http://192.168.35.31:4174/#/missions/main-M05/story-map/concepts`. 실물 기기 접속은 아직 확인하지 않았다.

서버를 다시 시작할 때 데이터 검증까지 포함하는 명령:

```powershell
npm run dev -- --host 0.0.0.0 --port 4174 --strictPort
```

이미 실행 중이면 기존 서버 주소를 사용한다. Playwright는 별도 `4173` 포트를 사용했다.

## 주요 파일

| 파일 | 책임 |
| --- | --- |
| `data/mission-story-maps/main-m05/concept-map.json` | 노드·관계·설명·비교·보기·흐름의 단일 런타임 원본 |
| `src/missionConceptMap/MissionConceptMap.tsx` | 보기, 검색, 목록, 선택, URL, 미션 탐색 |
| `src/missionConceptMap/ConceptMapCanvas.tsx` | 실제 SVG 그래프, 경계점 연결, 확대·이동·Fit·읽기 크기 |
| `src/missionConceptMap/ConceptMapDetailPanel.tsx` | 개념·관계·흐름 설명, 비교 카드, Scene, 실제 사전 링크 |
| `src/missionConceptMap/conceptMapAdapter.ts` | 보기·이웃·흐름 구간·강조·배치·URL 복원 순수 함수 |
| `src/missionConceptMap/conceptMapTypes.ts` | 다른 미션에서도 사용할 수 있는 데이터 계약 |
| `src/missionConceptMap/missionConceptMap.css` | 새 화면 아래로 한정한 스타일 |
| `scripts/validate_mission_concept_map.py` | 기존 설계 검증기를 후보 JSON에 그대로 적용 |
| `src/App.tsx` | lazy route와 B3-1 시안 카드 추가 |
| `playwright/mission-concept-map.spec.ts` | 새 화면 수용·시각·터치·기존 화면 이동 검증 |
| `src/missionConceptMap/conceptMapAdapter.test.ts` | 데이터 차이, 6가지 보기 조합, 흐름·URL·선택 검증 |

`package.json`의 `data:build` 마지막에 후보 데이터 검증을 추가했다. 별도 생성 복사본 없이 후보 JSON을 직접 import한다. 초안·운영 후보·React 코드 사이에 같은 콘텐츠를 반복 작성하지 않는다.

## 구현된 기능

- 전체 관계(기본 23개/31개), 일반망(26개/34개), AWS(15개/17개). 두 좁은 보기에서는 보충 개념도 기본 표시.
- 보충 개념 토글, 선택 동안의 이웃 임시 표시, 범위 밖 선택에 대한 안내·대응 개념 이동, 공통 노드 선택 유지.
- 실제 좌표에서 생성한 노드와 선, 노드 클릭·Enter·Space, 관계선의 실제 hit 영역 및 패널 관계 버튼.
- 선택 노드·연결된 관계·상대 노드 강조와 나머지 약화. 노드 선택에서는 흐름 전체 대신 인접 구간만 강조.
- 유형별 포함·역할·요청·응답·대응·연관 표현. 비교 카드 6개와 ≠ 상대 표시. 잘못된 직접 대응선 추가 없음.
- A1~A5, R1~R5, W1~W4 칩과 구간 표식. 흐름 선택 시 숨은 스위치까지 표시. AWS 흐름에서 Route Table·SG를 경유지로 강조하지 않으며 설정 설명은 별도로 표시.
- 확대·축소·드래그 이동·전체 Fit·읽기 크기·영역 이동. 휠을 가로채지 않음.
- 상세 설명·B3-1 참고·관계 이유·교차 공통점/차이점/주의·기술 근거·학습 순서·Scene 이름·실재 용어사전 링크.
- 데스크톱 겹침 패널, 모바일 최대 43dvh 하단 시트, 패널 내부 스크롤, 닫기·다시 열기·선택 해제.
- 용어 ID가 없는 개념도 찾는 검색, 영역별 목록 선택, 모바일 터치 선택.
- `view`, `node`, `rel`, `flow`, `more`, `term` 딥링크와 새로고침·뒤로/앞으로 복원. `rel > flow > node > term` 우선순위를 적용하고 정규화. 잘못된 값은 지도와 안내 표시.
- 지정 개념지도 경로와 미션 상세 시안 카드. 기존 학습 가이드 카드 유지. 없는 전체 스토리맵이나 Scene 경로로 가는 링크 없음.

## 원안과 달라진 구현 판단

1. **기존 엔진 추출을 하지 않았다.** 기존 함수는 파일 내부 상태와 강하게 결합돼 있다. 이번 지시대로 viewport 동작과 SVG/UI 구조를 참고한 전용 구현으로 격리했다. 기존 `TechnologyFieldMap.tsx`, `knowledgeMapTypes.ts`, 지도 CSS, `knowledgeMapLoader.ts`, Atlas 및 지도 JSON에 diff가 없다. 공통화는 후속 승인 범위다.
2. **기본 읽기 크기와 Fit을 구분했다.** 36개를 모두 축소하면 글자가 너무 작다. 첫 진입은 14px로 읽히는 배율에서 위쪽부터 탐색하고, 전체 보기는 구조 확인용이다. 보이는 노드 수는 렌더링된 개수이며 첫 화면에 모두 들어온다는 뜻은 아니다. 모바일 기본 보기 역시 전체 관계다.
3. **선택 노드 가림 방지.** 축소 상태에서 선택하면 최소 읽기 크기로 맞추고, 패널에 가려질 때 시점을 보정한다. 보기 전환은 재배치·Fit 또는 유지된 선택 중심 읽기 크기를 적용한다. 패널이 지도 크기를 줄이지 않는다. 패널을 연 Fit은 가리지 않는 영역을 사용한다.
4. **관계 글자 겹침 방지.** 노드 탐색 중에는 선의 강조와 패널의 관계 목록으로 읽는다. 선 위 이름은 개별 관계·흐름 선택 및 기본 교차 대응에 우선 노출한다. 모든 관계를 진하게 펼치지 않는다.
5. **모바일 목록 선택 이후 목록을 닫는다.** 선택한 노드와 하단 시트를 바로 확인하도록 작업공간으로 돌아온다. 지도 SVG는 기존처럼 960px이며, 지도 내부 가로 탐색과 별개로 페이지는 넘치지 않는다.

### SH01 변경

초안은 유지했다. 후보 JSON의 **SH01 한 관계에서 label·description·perSystem만** 변경했다. 이외의 데이터가 초안과 같은지는 Vitest로 비교한다.

- 표시 이름: `1:1 짝` → `주소 변환 관계`
- 일반망: **이번 그림에서의 주소 대응 방식**이라는 한계를 명시. 일반 NAT가 항상 1:1이라는 일반화 금지.
- AWS: **IGW의 1:1 Public·Private IPv4 변환**으로 표현.

## 검증 결과와 증거

| 검사 | 결과 | 기록 |
| --- | --- | --- |
| 원본 설계 검증기 | PASS · 36노드/57관계/6카드, 6가지 보기 고립 0 | 최초 실행 도구 출력 |
| 후보 검증기 | PASS · 같은 수량·참조·유형·범위 검사 | [build.log](build.log) 마지막 데이터 검증 부분 |
| `npm run build` | PASS · TypeScript + Vite. 큰 기존 공통 번들에 대한 경고는 남음 | [build.log](build.log) |
| `npm test` | PASS · 12파일, **120개** (신규 어댑터 23개 포함) | [vitest.log](vitest.log) |
| 기존 Playwright 전체 | PASS · **85개** | [existing-suite-85.log](existing-suite-85.log) |
| 새 화면 + 기존 지도 2파일 | PASS · **29개** (새 화면16 + 기존13) | [playwright.log](playwright.log) |
| 마지막 문구 정리 후 새 화면 | PASS · **16개**, 캡처 갱신 | [new-screen.log](new-screen.log) |
| `git diff --check` | PASS | 커밋 전 확인 |
| 변경 금지 파일·생성 JSON | diff 없음 | `git diff -- data/knowledge-maps src/data/generated src/TechnologyFieldMap.tsx src/knowledgeMapTypes.ts src/styles.css src/repair.css` |

회귀 실행은 기존 기대값이나 테스트 파일을 바꾸지 않았다. 최종 지도 회귀 명령:

```powershell
npx playwright test playwright/mission-concept-map.spec.ts playwright/technology-field-map.spec.ts playwright/map-immersive-workspace.spec.ts --workers=2
```

수용 검사는 실제 노드와 관계선 클릭, Enter 선택, URL 복원, 비교 6개, 사전 이동, 모든 흐름 단계, 실제 드래그·확대·Fit·휠, 반복 전환, 360/390px 목록·시트, 터치 에뮬레이션을 포함한다. 새 CSS를 읽은 뒤 기존 지도로 이동하는 회귀도 검사했다.

### 시각 QA

Chromium, 1280×900·1000×900·390×844·360×844에서 렌더링했다. 캡처 이미지를 직접 확인했다. 노드 겹침은 6가지 보기의 좌표 교차 검사, 가로 넘침·선택 노드 가림·패널 높이·지도 크기 유지는 브라우저 검사도 수행했다. 구조용 Fit에서는 글자가 작아지며 읽기 크기와 목록을 함께 제공한다.

| 폭 | 전체 구조 | 방화벽 선택 |
| --- | --- | --- |
| 1280px | [1280-overview.png](1280-overview.png) | [1280-firewall.png](1280-firewall.png) |
| 1000px | [1000-overview.png](1000-overview.png) | [1000-firewall.png](1000-firewall.png) |
| 390px | [390-overview.png](390-overview.png) | [390-firewall.png](390-firewall.png) |
| 360px | [360-overview.png](360-overview.png) | [360-firewall.png](360-firewall.png) |

추가: [초기 읽기 크기](1280-reading.png), [AWS 요청 흐름](1280-aws-flow.png), [경로 선택 ≈ Route Table](1280-routing-comparison.png).

## Owner 확인 시나리오

1. B3-1 미션에서 **B3-1 통합 개념지도 — 인터랙티브 시안 보기**를 연다.
2. **일반 네트워크** → 검색 또는 목록으로 **방화벽** 선택. 역할 목록에서 경로 선택·접근 통제·NAT·상태 추적을 읽는다. 관계 버튼을 눌러 연결 이유도 확인한다.
3. **전체 관계**로 전환한다. 경로 선택 또는 접근 통제를 선택하고 **관련 기술 비교**를 펼쳐 Route Table·Security Group의 공통점과 차이를 읽는다.
4. DMZ, 경계 라우터, NAT의 ≠ 비교 카드를 펼친다. 같은 장비·서비스로 오해하게 하는 직접선이 없는지 확인한다.
5. 일반망 요청·응답 칩을 눌러 스위치가 임시 표시되는지, A/R 구간 순서가 맞는지 확인한다.
6. **AWS 네트워크** → **AWS B3-1 HTTP 80 요청 W1~W4**. Route Table·SG가 패킷 경유지로 강조되지 않는지 확인한다.
7. `?node=aws:subnet`, `?rel=CR01`, `?flow=AF01`, `?term=security-group`으로 직접 진입·새로고침하고 용어사전으로 이동한다.
8. **읽기 크기 / 전체 보기**, 드래그·확대·영역 이동을 반복한다. 설명 닫기·다시 열기도 확인한다.
9. 휴대전화에서 기본 전체 관계를 확인한 뒤 **목록으로 보기**로 방화벽을 선택한다. 하단 시트 내부 스크롤과 다른 노드 선택을 확인한다.

## 남은 범위와 다음 개선

- 요청된 Phase 1 핵심 기능의 미구현 항목은 없다. 전체 스토리맵·Scene 이동·서비스 배포는 이번 범위 밖이다.
- 실물 휴대전화, Safari/Firefox, 모든 테마·화면 높이, 화면 낭독기 및 실제 교육생 이해도는 미검증이다. 360/390px Chromium과 터치 에뮬레이션을 실물 검증으로 부르지 않는다.
- 여섯 영역을 모두 볼 때는 글자가 작다. Owner가 읽기 크기·Fit·영역 이동·목록의 조합을 평가한 뒤 관계가 많은 노드의 배치와 도구 줄 밀도를 조정할 수 있다.
- 기존 자료의 Route Table/SG 통과 순서 문장, 기존 B3-1 overlay의 NAT Gateway 등 초안 QA 문서에 기록된 차이는 그대로 남아 있다. 이번 후보 데이터나 기존 콘텐츠를 임의로 수정하지 않았다.
- 엔진 공통화, 다른 미션의 데이터 연결, 실물 기기 검수는 후속 개선 항목이다. 현재 AWS 상태는 조회하지 않았으며, 콘텐츠는 고정된 2026-10-14 기록 기준이다.

Owner Push 명령:

```powershell
git push origin feature/b3-1-interactive-concept-map-poc
```
