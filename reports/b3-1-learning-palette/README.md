# B3-1 밝은 학습용 팔레트·정보 우선순위

- 작업일: 2026-10-22 (Asia/Seoul)
- 브랜치: `feature/b3-1-interactive-concept-map-poc`
- 기준: `28838a192d1897ee0b674e43bded9ad9acb2f8d5`. 시작 전 로컬 HEAD와 `git ls-remote`의 대상 브랜치 SHA가 일치함을 확인했다.
- 상태: 로컬 구현·자동 QA·실제 화면 검토 완료, Owner 디자인 검토 대기. Push·main 병합·서비스 배포 없음.
- 변경 범위: B3-1 전용 CSS, SVG 마커의 강조/기본 색 분리와 작은 선택 문구, 해당 테스트·증빙. 36개 노드·57개 관계, 데이터·용어·스토리맵, 보기·자동 표시·좌표·lane·카메라·패널 로직은 변경하지 않았다. `repair.css`, `styles.css`, 기존 기술지도 엔진도 변경하지 않았다.

## 어두워진 정확한 원인

1. `--cm-selection-fill:var(--accent-strong)`와 `--cm-selection-text:#fff`가 선택 카드를 어두운 면으로 만들었다. 개념지도 전용 선택 규칙이 공통 지도의 밝은 선택 배경보다 우선했다.
2. `@media(prefers-color-scheme:dark)`가 `.mission-concept-map`의 surface·text·accent 토큰을 덮어썼다. 캔버스는 `#101c18`, 패널은 `#192a23` 등으로 바뀌었다. 부모의 Forest/Indigo/Paper/Signal 토큰보다 컴포넌트 자신의 녹색 토큰이 우선해 OS 다크에서는 네 테마의 색 차이도 사라졌다.
3. 선택 카드의 녹색 계열 이중 그림자가 무거운 인상을 더했다. 일부 화살표는 공통 CSS의 accent 색, 선은 별도 관계색을 사용해 끝과 몸통 색도 일치하지 않았다.

## 색상·명도 원칙

캔버스는 고명도 공통 학습 팔레트로 고정하고, 색의 강도는 선택 정보와 중요한 조작에 집중한다. 영역 제목·경계, 선형·화살표·마름모·단계 표기를 함께 유지해 색에만 의미를 맡기지 않는다.

| 역할 | 최종 색/표현 |
| --- | --- |
| 캔버스 | `#fcfdfd`, 약한 중립 격자 `#e6ebee` |
| 일반망 영역 | 밝은 저채도 녹색 `#f2f7f3`, 제목 `#46604e`, 경계 `#ccd8d0` |
| AWS 영역 | 밝은 베이지 `#faf6ef`, 제목 `#775d33`, 경계 `#ded3bf` |
| 공통 영역 | 밝은 청색 `#f1f5fa`, 제목 `#4c627c`, 경계 `#cdd8e5` |
| 기본·연결 카드 | 흰색 `#fff`, 이름 `#17212b`, 메타 설명 `#52645a` |
| 선택 카드 | 밝은 청색 `#edf4fb`, 진한 글자 `#17212b`, 테마 선택 테두리 |
| hover/focus 카드 | 밝은 `#f4f7fb`, 테마 focus 테두리, opacity 1 |

학습 팔레트는 CSS 상단 `--cm-*` 토큰에 모았다. 도메인별 카드 테두리도 변수로 배정해, 높은 선택자 우선순위가 hover/선택 테두리를 가리는 일을 피했다. 공통 CSS의 중요한 글자색 규칙은 개념지도 범위에서 명시적으로 재정의했다.

## OS·사이트 테마 정책

**OS dark 전용 덮어쓰기 블록을 제거했다.** 같은 사이트 테마에서 OS 밝음/어두움을 바꿔도 캔버스·영역·카드·패널 색은 동일하다. 외부 헤더·내비게이션·일반 페이지와 전역 테마 정의는 그대로다.

`repair.css`의 밝은 `--map-selection-fill`도 검토했다. 이번에는 학습 면의 일관성을 위해 공통 선택 배경을 쓰고, 아래 상호작용 토큰을 재사용했다.

| 사이트 테마 | 선택 테두리 `--map-selection-border` | 연결·일반 강조 선 |
| --- | --- | --- |
| Forest | `#477465` | `--map-interaction` / `--map-highlight-edge` |
| Indigo | `#4f5fae` | 동일한 테마 토큰 |
| Paper | `#806546` | 동일한 테마 토큰 |
| Signal | `#1648ff` | 동일한 테마 토큰 |

보기·줌·탐색 버튼은 기존 accent 색, 주변 UI·상세 패널은 기존 surface·text 토큰을 따른다. 네 테마의 글꼴·주변 색·버튼·선택 테두리가 살아 있고, 캔버스 안의 학습 배경은 일관되게 밝다. 상세 패널 닫기 버튼도 현재 테마의 글자·배경 토큰을 사용한다.

## 선택·연결·비관련 상태

| 상태 | 최종 스타일 |
| --- | --- |
| 선택 노드 | opacity **1**, 밝은 선택 배경, 진한 글자, **3.5** SVG 테두리, 작은 `선택 · 핵심/보충` 문구, 약한 단일 그림자 |
| 직접 연결 노드 | opacity **0.95**, 흰색 카드, 테마 상호작용 테두리 **2** |
| 무관한 노드 | opacity **0.32**. 이전 0.25보다 선택 가능한 카드의 존재가 잘 보이도록 조정 |
| 비교 대상 | opacity **0.95**, 기존 `≠` 문구·점선 테두리, 차이를 알리는 `#995916` |
| hover/focus | opacity **1**, 밝은 배경·명확한 focus 테두리로 즉시 복원 |
| 선택 해제 | 표시 노드 모두 opacity **1** |

클릭·키보드 선택과 `aria-pressed`는 유지했다. 노드를 `pointer-events:none`으로 처리하지 않았다. 짙은 면 채우기·흰 글자·광택성 그림자는 제거했다.

관계선은 기본 **중립 `#74838d` / opacity 0.28**, 무관한 관계는 **0.055**, 선택 관계는 **1 / 굵기 2.6**이다. 흰 외곽선은 7 → 5로 줄였다.

- 일반 강조 관계: 기존 `--map-highlight-edge`.
- 요청: `#25765b`, 실선·화살표·기존 단계 번호.
- 응답: `#985c20`, 점선·화살표·기존 단계 번호.
- 일반망↔AWS 대응: `#7652a0`, 긴 점선·양끝 마름모·기존 대응 설명.
- 연관: 짧은 점선 유지.

SVG 마커를 강조용/중립용으로 나눠 **화살표·마름모의 fill과 해당 선의 stroke가 항상 같은 색**이 되게 했다. 마커 크기·연결점·경로는 유지했다.

## 대비·자동 검증

네 테마 × 네 viewport × OS 두 모드 × 9개 상태인 **288개 실제 렌더 상태**를 검사했다. 같은 페이지에서 네 테마와 OS 모드를 전환하는 **8개 상태**도 별도로 확인했다. [측정 요약](summary.json), [실시간 테마 전환](theme-switch.json), 각 `contrast-<width>-<theme>.json`에 원본을 저장했다.

| 측정 대상 | 최소 대비 | 기준 |
| --- | --- | --- |
| 정상·선택·연결 카드의 이름/메타, 영역 제목 | **5.61:1** | 4.5:1 이상 |
| 선택 카드 이름 | **14.69:1** | 4.5:1 이상 |
| 상세 제목·핵심 요약 본문 | **9.99:1** | 4.5:1 이상 |
| 활성 보기 버튼 | **6.16:1** | 4.5:1 이상 |
| 선택 테두리 대 카드/영역 배경 | **4.78:1** | 중요 비텍스트 3:1 이상 |
| 강조 관계선 대 영역 배경 | **4.85:1** | 중요 비텍스트 3:1 이상 |

수치는 표시 색의 상대 휘도로 계산했다. opacity 0.95 연결 카드는 영역 배경과 합성한 색으로 검사했다. 의도적으로 흐린 0.32 노드는 AA 글자 대비 대상에서 제외하고, 실제 hover/focus 복원·클릭·키보드 동작을 기존 수용 검사로 확인했다. 페이지 전체 WCAG 적합성 인증을 뜻하지 않는다.

| 실행 | 결과 |
| --- | --- |
| `npm test` | **126개 PASS**, [로그](vitest.log) |
| `npm run build` | **PASS**, [로그](build.log). 기존 공통 번들 500kB 초과 경고 유지 |
| `npm run test:map-interaction -- --workers=2` | **136개 PASS**, [로그](playwright-full.log). 기존 119개 + 팔레트·테마 17개 |
| 기존 기술지도 | 기존 13개 회귀 포함 통과, 전역 CSS·엔진 수정 없음 |
| 노드·관계 배치 | 기존 좌표·lane 안정성 검사 통과. 테마·OS 전환에서도 SVG 월드 좌표·관계선 경로 동일 |
| 색·화살표·넘침 | 같은 테마의 OS 두 모드에서 팔레트 동일, 모든 측정 상태의 마커 색 일치, 가로 넘침 없음 |
| `git diff --check` | PASS |

각 조합에서 일반 진입, 집중 모드 전체 지도, 경계 라우터·방화벽·DMZ, CR01 교차 관계, AWS Public Subnet, 요청·응답 흐름을 렌더했다. 패널이 열린 상태와 보기 전환도 포함한다. 보충 자동 표시·Fit·확대/축소·pan·패널 헤더·모바일 시트는 기존 전체 회귀로 확인했다.

## 실제 화면 검토·전후 캡처

PC 전체 지도와 선택 상태를 직접 열어 확인했다. 이후 네 테마, 교차 관계·Public Subnet, 작은 화면도 확인했다. 화면 전체의 어두운 면이 사라지고, 영역은 배경으로 물러나며 선택 테두리·이름·연결선이 먼저 읽힌다. Paper의 따뜻한 주변 UI와 Signal의 강한 버튼도 밝은 중립 캔버스와 구분된다.

**OS dark에서의 핵심 전후:**

- 전체 지도: [전](1280-forest-dark-before-overview.png) / [후](1280-forest-dark-after-overview.png)
- 방화벽 선택: [전](1280-forest-dark-before-firewall.png) / [후](1280-forest-dark-after-firewall.png)
- OS light 선택: [전](1280-forest-light-before-firewall.png) / [후](1280-forest-light-after-firewall.png)

| 테마 | PC 전체 지도 | 선택·light | 선택·dark |
| --- | --- | --- | --- |
| Forest | [전체](1280-forest-light-after-overview.png) | [선택](1280-forest-light-after-firewall.png) | [선택](1280-forest-dark-after-firewall.png) |
| Indigo | [전체](1280-indigo-light-after-overview.png) | [선택](1280-indigo-light-after-firewall.png) | [선택](1280-indigo-dark-after-firewall.png) |
| Paper | [전체](1280-paper-light-after-overview.png) | [선택](1280-paper-light-after-firewall.png) | [선택](1280-paper-dark-after-firewall.png) |
| Signal | [전체](1280-signal-light-after-overview.png) | [선택](1280-signal-light-after-firewall.png) | [선택](1280-signal-dark-after-firewall.png) |

| 테마 | 경계 라우터 | DMZ | 일반망↔AWS | AWS Public Subnet |
| --- | --- | --- | --- | --- |
| Forest | [화면](1280-forest-light-after-router.png) | [화면](1280-forest-light-after-dmz.png) | [화면](1280-forest-light-after-cross.png) | [화면](1280-forest-light-after-subnet.png) |
| Indigo | [화면](1280-indigo-light-after-router.png) | [화면](1280-indigo-light-after-dmz.png) | [화면](1280-indigo-light-after-cross.png) | [화면](1280-indigo-light-after-subnet.png) |
| Paper | [화면](1280-paper-light-after-router.png) | [화면](1280-paper-light-after-dmz.png) | [화면](1280-paper-light-after-cross.png) | [화면](1280-paper-light-after-subnet.png) |
| Signal | [화면](1280-signal-light-after-router.png) | [화면](1280-signal-light-after-dmz.png) | [화면](1280-signal-light-after-cross.png) | [화면](1280-signal-light-after-subnet.png) |

추가: [요청](1280-forest-light-after-request.png) / [응답](1280-forest-light-after-response.png), [1000px](1000-forest-light-after-firewall.png), [390px](390-forest-light-after-firewall.png), [360px](360-forest-light-after-firewall.png). 다른 테마·OS의 작은 화면도 `<width>-<theme>-<light|dark>-after-firewall.png`로 저장했다.

총 **수정 전 16장·수정 후 58장**과 [전 측정](before.json) / [후 측정](after.json)이 있다. 같은 viewport·theme·OS·URL·조작 순서로 비교했다. 이전 작업의 증빙은 덮어쓰지 않았다.

## Owner 디자인 판단·검증 한계

확정 정책과 충돌하는 미해결 구현 사항은 없다. 최종 UX 검토에서는 **밝은 선택 배경과 3.5 테두리의 균형**, **무관한 노드 0.32의 발견 가능성**, **요청·응답·대응 선형과 색의 구분**을 확인하면 된다. 이번에 적용한 값으로 로컬 구현과 QA를 완료했으며 Owner의 시각 승인을 대신하지 않는다.

Fit의 작은 글자·모바일의 먼 연결은 여전히 읽기 크기·확대·이동이 필요하다. 실물 휴대전화, Safari/Firefox, 모든 OS 배율·브라우저 강제 색상 모드는 이번에 검증하지 않았다. 공개 서비스 화면은 배포하지 않았으므로 미검증이다.

## 파일·재실행

- `src/missionConceptMap/missionConceptMap.css`: 공통 밝은 팔레트, 테마 토큰 접점, 선택/연결/비관련 스타일, OS dark 덮어쓰기 제거.
- `src/missionConceptMap/ConceptMapCanvas.tsx`: 마커의 강조/중립 변형과 선택 문구. 배치·카메라 변경 없음.
- `playwright/mission-concept-map-palette.spec.ts`: 네 테마·네 크기·두 OS 모드의 실제 색·대비·마커·배치 불변 검사.
- `playwright/mission-concept-map-stability.spec.ts`: 확정한 비관련 opacity 0.32에 맞춰 기존 수용 기준 조정.
- `scripts/qa_b31_learning_palette.mjs`: 단계별 전후 캡처·색 측정.

```powershell
npx vite --host 127.0.0.1 --port 4173
# 각 단계의 소스를 실행 중일 때 촬영
node scripts/qa_b31_learning_palette.mjs before
node scripts/qa_b31_learning_palette.mjs after
```

Owner Push:

```powershell
git push origin feature/b3-1-interactive-concept-map-poc
```
