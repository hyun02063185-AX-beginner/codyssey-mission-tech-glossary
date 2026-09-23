# Technology Map — Immersive Workspace (V1.1)

> 2026-09-24 · 시작 HEAD **`1c9ee0a`** (tag `encyclopedia-v1`) · branch `main`
> V1 구조 재개발이 아니다. **실제 사용에서 확인된 UX 문제 세 가지**를 고친 V1.1 이다.
> Knowledge Model · canonical · relation · content 는 **한 줄도 바뀌지 않았다.**

**판정: `TECHNOLOGY_MAP_IMMERSIVE_WORKSPACE_READY`**

---

## A. Usage Evidence

이번 작업은 미관 수정이 아니다. 근거를 먼저 적는다.

| ID | 실제로 무엇이 일어났나 |
| --- | --- |
| **UE-01** | 지도를 마우스로 끌어 옮길 때 노드 안 글자가 브라우저 텍스트 선택 상태가 된다. 파란 선택 블록이 생기고, 지도를 미는 느낌이 아니라 문서를 긁는 느낌이 된다 |
| **UE-02** | 지도가 일반 페이지 콘텐츠 폭 안에 들어 있어 모니터에 비해 작다. 실제로 **1920 화면에서 지도 폭이 1280px 로 잘려** 있었고, 지도 위 여백이 **551px** 이라 지도를 보려면 스크롤해야 했다 |
| **UE-03** | 전체를 보는 것과 글자를 읽는 것이 **같은 배율 정책 안에서 경쟁**한다. 전체를 맞추면 노드 label 이 **9.76px** 로 그려져 읽기 어렵다 |

세 가지는 사실 한 가지다 — **지도가 페이지의 한 요소로 취급되고 있었다.**

---

## B. 구현 전 구조 조사

```
Current map shell        <section.knowledge-map-page> in <main>
                         .knowledge-map-page{width:min(1280px,100vw-48px);left:50%;transform:translateX(-50%)}
                         이미 main 을 탈출하고 있었지만 1280px 에서 멈춰 있었다

Current constraints      main{max-width:980px;padding:42px 24px 80px}
                         .map-canvas{aspect-ratio:1280/750}  ← 높이를 폭에서 끌어온다
                         → 세로 viewport 를 전혀 쓰지 않는다

Global layout dependency body > #root > (header 76px, main)
                         header 는 일반 흐름 요소, position:fixed 아님

Pan/zoom                 view={x,y,zoom} → SVG viewBox
                         pan: pointerdown/move (노드 위에서 시작하면 무시)
                         zoom: ±.15 버튼, clamp [0.65, 1.8]
                         '맞춤' = setView({x:0,y:0,zoom:1}) — 진짜 fit 이 아니라 zoom 1 리셋
                         wheel 은 zoom 하지 않는다 (Playwright 가 지키는 계약)
                         cursor grab/grabbing 은 이미 있었다 — UE-01 은 cursor 가 아니라 user-select 문제

Detail overlay           desktop: position:absolute overlay (이미 지도를 줄이지 않는다)
                         mobile: bottom sheet

Mobile                   @media(max-width:700px) — 캔버스 960px 고정 + shell 가로 스크롤
```

**결론: 새 layout system 도 graph engine 도 필요 없다.** 기존 pan/zoom 엔진을 그대로 쓰고,
높이를 폭이 아니라 viewport 에서 끌어오도록 바꾸는 것이 전부다.

---

## C. 구현

### C-1. UE-01 — 선택 경계

```css
.map-canvas{user-select:none;-webkit-user-select:none}
.map-detail-panel,.map-detail-panel *{user-select:text;-webkit-user-select:text}
```

**지도 표면에서만 막고 설명 패널은 되돌려 준다.** 학습자가 기술 설명을 복사할 수 있어야 한다.
cursor 는 이미 `grab`/`grabbing` 이라 건드리지 않았다.

### C-2. UE-02 — 화면을 쓰는 작업공간

route 별로만 적용한다. `:has()` 로 지도 화면일 때만 걸리며 — 이 저장소는 이미
`label:has(select)` 를 쓰고 있어 새 기법이 아니다.

```css
@media(min-width:701px){
  body:has(.knowledge-map-page) #root{display:flex;flex-direction:column;height:100dvh;overflow:hidden}
  main:has(.knowledge-map-page){flex:1;min-height:0;max-width:none;padding:0}
  .knowledge-map-page{flex:1;min-height:0;display:flex;flex-direction:column}
  .map-stage{flex:1;min-height:0}  .map-stage .map-workspace{flex:1;min-height:0}
  .map-stage .map-canvas-shell{height:100%}
  .map-stage .map-canvas{flex:1;min-height:0;aspect-ratio:auto}
}
```

**높이를 마법 숫자가 아니라 flex 사슬에서 받는다.** 지도마다 도구 막대 높이가 달라
`calc(100dvh - 272px)` 같은 상수는 곧 틀린다.

> 중간에 `min-height:100dvh` 로 했다가 실패했다. 높이가 확정되지 않으면 SVG 가
> viewBox 비율대로 **제 키를 스스로 정해 버려** 캔버스가 1343px 까지 자랐다.
> 확정 높이를 줘야 순환이 끊긴다.

머릿글도 눌렀다 — 지도 제목 한 줄(145px → 47px), 도구 막대 3줄 → 2줄(252px → 116px).
**공통 header 는 그대로 뒀다.** 지도에서 빠져나갈 길이기 때문이다(§12 권장 1순위).

### C-3. UE-03 — 두 가지 보기를 가른다

viewBox 높이를 고정 비율이 아니라 **실제 캔버스 비율**에서 만든다.

```tsx
const aspect = immersive && measured ? box.height/box.width : height/WIDTH;
viewBox = `${view.x} ${view.y} ${WIDTH/view.zoom} ${(WIDTH/view.zoom)*aspect}`
```

그 위에서 두 목적을 분리했다.

| | 목적 | 계산 |
| --- | --- | --- |
| **읽기 크기** | 글자를 읽으며 끌어서 탐색 | 노드 label(10px)이 화면에서 **14px** 로 그려지는 zoom.<br>`READING_LABEL_PX*WIDTH/(NODE_LABEL_FONT*box.width)` |
| **전체 보기** | 구조를 한눈에 | 지도 전체가 들어가는 가장 큰 zoom. `min(1, WIDTH*aspect/height)` |

**숫자를 먼저 정하지 않았다.** 기존 화면에서 label 이 9.76px 로 그려지는 것을 재고,
읽히는 크기를 목표로 잡은 뒤 zoom 을 거꾸로 구했다. 그래서 화면 폭이 달라져도 14px 이 나온다.

기본 진입은 **읽기 크기**다(§17). 전체 보기는 지금 데이터에서 label 을 8px 아래로 떨어뜨린다.

### C-4. 구현 중에 찾은 결함 두 가지

**1) 1280×720 에서 전체 보기가 전체가 아니었다.**
필요한 zoom 이 0.45 인데 하한 `MIN_ZOOM=0.5` 에 걸려 **49개 중 일부가 화면 밖에 남았다.**
하한을 fit 아래로 내려가게 고쳤다 — `minZoom = min(MIN_ZOOM, fitZoom)`.
전체 보기가 하한에 막히면 '전체'가 전체가 아니게 된다.

**2) 전체 보기에서 노드를 누르면 읽기 크기로 끌려갔다.**
deep link 를 맞추려고 만든 효과가 **지도 안에서의 선택에도 발동**했다.
사용자가 일부러 전체를 보고 있는데 클릭 한 번에 확대돼 버린다.
지도 안에서 생긴 이동은 '이미 맞춘 것'으로 표시해 효과를 건너뛴다.

둘 다 자동 테스트가 아니라 **실제로 눌러 보다가** 나왔다.

---

## D. Before / After (1920×1080)

| | before | after |
| --- | ---: | ---: |
| 지도 폭 | **1249px** | **1864px** (+49%) |
| 지도 높이 | 878px (대부분 화면 밖) | **735px** (전부 화면 안) |
| 지도 위 여백 | **551px** | **272px** |
| 노드 label 실제 크기 | **9.76px** | **14.0px** (+43%) |
| 지도를 보려고 스크롤 | **필요** (페이지 1608px) | **불필요** |
| 전체 보기 label | (같은 배율) 9.76px | 8.2px · **노드 49/49 전부** |
| 상세 패널 열었을 때 지도 | 1249×878 유지 | **1864×735 유지** |

1440×900 에서도 읽기 크기의 label 은 **14.0px** 이다(zoom 1.4). 폭이 달라도 목표가 유지된다.

---

## E. Browser QA — 직접 확인

| | 확인 | 결과 |
| --- | --- | --- |
| **QA-01** | 여러 방향으로 drag | 선택 문자열 `""` · range **0** |
| **QA-02** | 지도 최초 진입 | 1864×735 · 위 여백 272px · **스크롤 불필요** |
| **QA-03** | 읽기 크기 | label **14.0px** · 끌어서 이동 정상 |
| **QA-04** | 전체 보기 | label 8.2px · **노드 49/49 전부 캔버스 안** |
| **QA-05** | 전체 보기 → 읽기 크기 | **14.0px 복귀** |
| **QA-06** | 노드 선택 | 지도 1864×735 → **1864×735** · 축소 **없음** |
| **QA-07** | 설명 텍스트 drag | `user-select: text` · 선택 가능 |

**click vs drag** — 빈 곳에서 끌어 노드 위에서 뗐을 때 선택 **0건**(우연한 클릭 없음).
짧은 클릭은 정상 선택. Tab 포커스 + Enter 선택 정상. 확대/축소 버튼 전부 focus 가능.

**cross-view** — 패널에서 개념 연결 · 용어 · 선수학습 · 학문 · 미션 **5방향 모두 유지**.

**deep link** — `?term=local-storage` 로 직접 들어가면 해당 노드가 선택되고
**캔버스 정중앙에 놓인다**(중심에서 dx 0 · dy 0). 예전에는 화면 밖일 수 있었다.

**back / forward** — 대백과 → 지도 → 노드 선택 → 용어 → 뒤로 → 뒤로 → 앞으로 **7단계 정상**.

---

## F. Regression

### 다른 화면 (§39)

13개 route 에서 `main{max-width:980px; padding:42px 24px 80px}` 와 `#root{overflow:visible}` 가
**그대로**다 — 홈 · 대백과 · 용어 찾기 · 검색 결과 · 용어 상세 · 선수학습 · 미션 · 학문 ·
직무 · 개념 연결 · 웹툰 · 오픈북 · 지도 목록. **full-screen 이 된 화면은 없다.**

### Mobile 375px (§28)

바뀐 것이 **하나도 없다.** `@media(min-width:701px)` 밖이고, TSX 도 같은 breakpoint 를
`matchMedia` 로 확인해 몰입 동작을 건너뛴다.

| | 값 |
| --- | --- |
| `main` max-width | 980px (그대로) |
| `#root` overflow | visible (그대로) |
| viewBox | `0 0 1280 900` (그대로) |
| 캔버스 | 960px + shell 가로 스크롤 (그대로) |
| 지역 탐색 / bottom sheet | 표시됨 / `position:absolute` (그대로) |
| 가로 overflow | 없음 |

> 중간에 모바일 초기 배율이 1.8 로 바뀐 것을 발견하고 되돌렸다.
> **"모바일에서 억지로 desktop layout 을 적용하지 않는다"** 를 지켰다.

### 데이터 (§40)

```
git diff encyclopedia-v1..HEAD -- data content src/data/generated dist-extension scripts
→ 비어 있음
```

canonical **0** · relation **0** · node **0** · academic **0** · mission **0** ·
learning path **0** · content rewrite **0** · 생성물 **0**.

### RC1 · Release tag

`git diff glossary-rc1 -- data/curated data/knowledge-maps extension` **비어 있음**.
`encyclopedia-v1` tag 는 `1c9ee0a` 에서 **움직이지 않았다.**

---

## G. Tests

| | before | after |
| --- | ---: | ---: |
| unit | 82 PASS | **82 PASS** |
| Playwright | 31 PASS | **39 PASS** (+8) |

새 spec `playwright/map-immersive-workspace.spec.ts` **8건** — UE-01 두 가지(지도 선택 금지 ·
패널 선택 허용) · UE-02 화면 사용 · UE-03 두 보기의 배율 분리와 전체 포함 ·
패널이 지도를 줄이지 않음 · deep link 노드가 화면 안 · 다른 화면 불변 · 좁은 화면 불변.

### 기존 테스트 수정 2건 — 정확히 보고한다

**1) `wheel scrolls the page without changing the map viewport` → `wheel does not hijack the map viewport`**
몰입 route 는 페이지가 스크롤되지 않으므로 `scrollY > 0` 단언이 성립하지 않는다.
**지키려던 계약은 그대로다** — wheel 이 지도를 확대하지 않고 `preventDefault` 로 다투지 않는다.
그 두 가지는 유지하고 `scrollY === 0` 으로 바꿨다. **wheel 처리 코드는 건드리지 않았다.**

> 이 테스트가 처음 실패한 이유는 wheel 이 아니었다. 첫 진입의 읽기 크기 맞춤이 비동기라
> `before` 를 그 전에 읽고 있었다. 값이 멈출 때까지 기다리게 고쳤다.

**2) `맞춤` 버튼 → `읽기 크기` · `전체 보기`**
버튼이 둘로 갈라졌으므로 클릭 대상을 바꿨다. 임의의 노드를 누르는 테스트에는
**전체 보기를 먼저 누르게** 했다 — 읽기 크기에서는 지도 일부만 보이므로 사용자도 그렇게 한다.

### 그 밖

build PASS · extension build PASS · glossary / encyclopedia / atlas / knowledge-map /
content:integrity / qa:console **전부 PASS** · 생성물 drift **0**.

---

## H. Fullscreen

**구현하지 않았다 — `OPTIONAL_FULLSCREEN` 으로 남긴다.**

이유는 §21 이 정한 원칙 그대로다. **Fullscreen 은 좁은 layout 을 보완하는 임시 수단이 아니다.**
기본 route 가 이미 1920 화면에서 1864×735 를 쓰고 스크롤이 필요 없으므로,
Fullscreen 이 더해 줄 것은 header 76px 과 도구 막대뿐이다.
그 대가로 viewport 재계산 · ESC 충돌 · 미지원 fallback · zoom state 보존을 떠안는다.

지금 필요한 것은 **더 넓은 화면이 아니라 Owner 가 실제로 써 보는 것**이다.

---

## I. 남은 선택지 (자동으로 시작하지 않는다)

- **Fullscreen** (`OPTIONAL_FULLSCREEN`) — 기본 route 를 써 본 뒤에도 좁으면
- **읽기 목표 크기 조정** — 14px 이 큰지 작은지는 실제 사용자가 말해야 한다
- **읽기 크기에서의 소형 미니맵** — 지금은 전체 보기로 갈아타는 방식이다. 요구되면 그때
- **좁은 화면의 몰입 layout** — 지금은 의도적으로 기존 동작을 유지했다

전부 **Owner 의 실제 사용 피드백에서 시작한다.**

---

## J. 이번에 하지 않은 것

Map data 재설계 · node/edge 변경 · taxonomy 변경 · academic mapping 변경 ·
신규 canonical · relation 변경 · Map algorithm 교체 · 새 graph library ·
추천 기능 · Timeline · detail content rewrite · Encyclopedia navigation 재설계 — **전부 0**.

바꾼 파일은 넷이다.

```
~ src/TechnologyFieldMap.tsx                        (pan 배율 · viewBox · 두 보기 · deep link 중심)
~ src/styles.css                                    (route 한정 몰입 layout · 선택 경계)
~ playwright/technology-field-map.spec.ts           (기존 2건 수정)
+ playwright/map-immersive-workspace.spec.ts        (신규 8건)
```
