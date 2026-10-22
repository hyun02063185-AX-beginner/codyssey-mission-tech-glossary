# B3-1 관계선 통로·상세 패널 헤더 수정

- 작업일: 2026-10-22 (Asia/Seoul)
- 브랜치: `feature/b3-1-interactive-concept-map-poc`
- 수정 전 기준: `8116411420dd35c64e5c4e084cb96962d5561432`
- 단계: 로컬 구현·QA 완료, Owner 화면 검토 대기. Push·main 병합·배포 없음.
- 영향 범위: 개념지도 전용 배치·SVG 경로·선 강조·상세 패널 DOM/CSS와 해당 검사. 36개 노드·57개 관계, JSON, 기존 기술지도 엔진·전역 CSS·route, 학습 가이드·Scene 01~04는 변경하지 않았다.

## 관계선

카드 너비 **206**, 높이 **76**은 유지했다. 컬럼 pitch는 264에서 최소 **378**로 늘려 카드 사이 여백을 **58 → 최소 172 지도 단위**로 확보했다. 읽기 배율 0.875에서는 약 **51 → 151px**다. 특정 보기·선택에서 필요한 평행선 수가 많아지면 통로 폭이 추가로 늘어난다.

1. 인접 컬럼: 카드에서 10단위 떨어진 연결점 → 짧은 수평선 → 컬럼 사이 세로 통로 → 도착 카드의 연결점 순서로 그린다.
2. 같은 컬럼: 해당 컬럼 오른쪽 통로로 나갔다가 도착지 높이에서 되돌아온다. 곡선이 중간 카드 위를 통과하지 않는다.
3. 여러 컬럼: 출발 통로 → 카드 행 사이 26단위 여백의 가로 통로 → 도착 통로로 이동한다. 중간 컬럼의 카드를 관통하지 않는다. 가로 통로도 겹치는 컬럼 구간에는 서로 다른 자리를 배정한다.
4. 세로 구간이 겹치는 선은 interval colouring으로 12단위 간격의 평행 트랙을 배정한다. 겹치지 않는 높이 구간은 트랙을 재사용한다. 연결점은 반대편 노드 높이와 관계 ID 순으로 나눠 같은 카드의 선 끝이 한 점에 모이지 않게 했다.
5. 직각 경로의 모서리만 최대 6단위로 둥글게 한다. 화살표 끝은 카드에서 10단위 떨어뜨리고, 화살표/대응 마커 크기를 `userSpaceOnUse`로 고정해 강조 두께에 따라 커지지 않게 했다. 라벨용 역방향 경로도 같은 연결점·통로를 그대로 뒤집는다.
6. 기본 선 opacity는 .36 → .22, 선택과 무관한 선은 .09 → .055로 낮췄다. 직접 연결된 선은 opacity 1과 밝은 외곽선을 사용하고 나중에 그린다. 기본 대응 라벨은 접고, 관계·흐름 선택 시 해당 라벨과 단계 번호를 표시한다. 노드 선택에서는 연결선과 상세 패널의 관계 설명을 함께 읽는다.

트랙 분리는 평행 구간의 중첩을 줄인다. 서로 다른 방향의 모든 선 교차를 없애는 평면 그래프 변환은 아니다.

## 상세 패널

이전에는 `aside` 전체가 스크롤되고, 헤더에 sticky·음수 margin·상단 offset을 적용했다. 이제 구조는 아래와 같다.

```text
aside (flex column, padding 0, overflow hidden, isolation isolate)
├─ header (축소하지 않는 고정 높이 영역, 불투명 배경, z-index 2)
└─ body   (min-height 0, overflow auto, 불투명 배경, z-index 0)
```

헤더는 스크롤 컨테이너 밖에 있어 sticky 보정 없이 항상 패널 상단을 유지한다. 헤더 아래의 border와 shadow, 빈틈 없이 맞닿는 본문 배경으로 정보 레이어를 구분했다. 음수 margin을 제거하고 입장 애니메이션도 헤더/본문에 적용되지 않게 했다. 모바일 하단 시트도 같은 구조를 사용한다.

본문은 키보드로 집중·스크롤할 수 있는 영역이다. 선택을 바꾸면 본문 스크롤만 0으로 초기화하며 Escape·닫기·다시 열기 동작을 유지한다. 네 viewport에서 헤더 하단과 본문 상단 좌표가 같고, 본문 scrollTop=180 상태에서도 패널 자체 scrollTop=0임을 캡처 측정으로 확인했다.

## 주요 파일

| 파일 | 변경 |
| --- | --- |
| `src/missionConceptMap/conceptMapAdapter.ts` | 통로·트랙·연결점 배정, 카드 행 사이 장거리 경로, 둥근 직각 경로, Fit 범위 |
| `src/missionConceptMap/ConceptMapCanvas.tsx` | 계산된 경로 사용, 일정 크기 마커, 강조 외곽선·라벨 우선순위 |
| `src/missionConceptMap/ConceptMapDetailPanel.tsx` | 고정 헤더와 독립 스크롤 본문, 선택 변경 시 본문 스크롤 초기화 |
| `src/missionConceptMap/missionConceptMap.css` | 선 농도, 불투명 패널 레이어·경계·반응형 |
| `src/missionConceptMap/conceptMapAdapter.test.ts` | 보기·선택·보충 표시 조합의 카드 충돌, 연결점 중복, Fit 경계 검사 |
| `playwright/mission-concept-map-lanes.spec.ts` | 실제 둥근 SVG 경로 충돌, 네 크기의 헤더·본문 스크롤·닫기·다시 열기 |
| `playwright/mission-concept-map.spec.ts` | 모바일 스크롤 컨테이너 검사를 새 본문으로 변경 |
| `scripts/qa_b31_edge_lanes.mjs` | 동일 시나리오의 전후 캡처·측정 |

## 전후 화면

아래는 동일 viewport·URL·조작 순서의 Chromium 캡처다. **집중 모드**에서 전체 보기는 Fit, 방화벽은 선택 후 본문 180px 스크롤, AWS는 HTTP 80 요청 흐름을 선택했다. 이전 작업의 `b3-1-map-first` 증빙은 보존했다.

| 화면 | 전체 보기 전 / 후 | 방화벽·헤더 전 / 후 | AWS 흐름 전 / 후 |
| --- | --- | --- | --- |
| 1280×900 | [전](1280-before-overview.png) / [후](1280-after-overview.png) | [전](1280-before-firewall.png) / [후](1280-after-firewall.png) | [전](1280-before-aws-flow.png) / [후](1280-after-aws-flow.png) |
| 1000×900 | [전](1000-before-overview.png) / [후](1000-after-overview.png) | [전](1000-before-firewall.png) / [후](1000-after-firewall.png) | [전](1000-before-aws-flow.png) / [후](1000-after-aws-flow.png) |
| 390×844 | [전](390-before-overview.png) / [후](390-after-overview.png) | [전](390-before-firewall.png) / [후](390-after-firewall.png) | [전](390-before-aws-flow.png) / [후](390-after-aws-flow.png) |
| 360×844 | [전](360-before-overview.png) / [후](360-after-overview.png) | [전](360-before-firewall.png) / [후](360-after-firewall.png) | [전](360-before-aws-flow.png) / [후](360-after-aws-flow.png) |

측정 원본: [before.json](before.json), [after.json](after.json).

## 검증

| 명령·범위 | 결과 |
| --- | --- |
| `npm test` | **123개 PASS**, [로그](vitest.log). 기존 120개 + 경로 검사 3개 |
| `npm run build` | **PASS**, [로그](build.log). 기존 공통 번들 500kB 초과 경고 유지 |
| `npm run test:map-interaction -- --workers=2` | **111개 PASS**, [로그](playwright-full.log). 기존 기술지도 13개·개념지도 16개·레이아웃 6개와 새 패널 4개 포함 |
| 최종 SVG 샘플링 검사를 추가한 패널 테스트 4개 | **PASS**, [로그](playwright-lanes.log) |
| 1280×900 / 1000×900 / 390×844 / 360×844 | 헤더·선택·흐름 전후 캡처 확인, 페이지 가로 넘침 없음 |
| 전체 선택 조합 | 세 보기·보충 on/off에서 경로가 카드의 3단위 외곽 영역을 통과하지 않음, 연결점 중복 없음, 경로가 Fit 범위 안에 있음 |
| `git diff --check` | PASS |

브라우저 회귀에는 노드 선택, 관계 hit area 실제 클릭, 연결선 강조, 전체/일반망/AWS 전환, 확대/축소·Fit·읽기 크기, 드래그·휠·키보드·터치, 패널 닫기/다시 열기, 모바일 시트, 집중 모드·창 크기 변경이 포함된다. 신규 검사는 실제 SVG의 둥근 경로를 4단위 간격으로 샘플링해 카드 영역 통과 여부도 확인한다.

## 남은 가독성 제약·미검증

- 넓어진 통로로 전체 지도 폭이 증가했다. Fit은 구조를 살피는 개요이며, 작은 글자·관계 라벨은 읽기 크기나 확대 후 읽어야 한다. 특히 모바일 전체 보기는 축소 정도가 크다.
- 모바일 읽기 크기에서는 선택 카드와 먼 도착지를 동시에 담기 어렵다. 선은 가로 이동·드래그·확대/축소로 따라가고, 관계 의미는 상세 시트에서도 읽을 수 있다.
- 1000px 화면에서 상세 패널을 열면 일부 이웃 카드와 선 끝이 패널 뒤에 있을 수 있다. 패널 닫기 또는 Fit으로 확인한다. 선택 카드가 패널에 가리지 않는 기존 동작은 유지했다.
- 다수 관계를 모두 켜면 수평·수직 선의 교차는 남는다. 직접 연결된 선의 농도·외곽선과 개별 관계 선택으로 구분하며, 모든 교차 제거를 보장하지 않는다.
- 실물 휴대전화, Safari/Firefox, 모든 OS 배율·테마 조합, 공개 Pages는 이번에 검증하지 않았다.

## 재실행·Owner Push

```powershell
npx vite --host 127.0.0.1 --port 4173
# 해당 단계의 소스를 실행 중일 때 각각 촬영
node scripts/qa_b31_edge_lanes.mjs before
node scripts/qa_b31_edge_lanes.mjs after
```

```powershell
git push origin feature/b3-1-interactive-concept-map-poc
```
