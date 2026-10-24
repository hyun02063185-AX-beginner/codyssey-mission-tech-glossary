# B2-1 Story v3 — React 서비스 통합 설계

2026-10-24 · 기준 HEAD `a94c413bc6d7a7e81ee7e5771afa50b9cf6deb23`(v3.7, Owner 승인) · **설계 문서다. 아래 파일·컴포넌트·쿼리·스크립트는 아직 하나도 만들지 않았다. 공개 주소·라우트·미션 카드도 바꾸지 않았다.**

교육 QA 결과는 [qa-review-v3.8.md](qa-review-v3.8.md)에 있다. 이전의 v2·9단위 기준 계약 [integration-contract.md](../integration-contract.md)는 덮어쓰지 않았다. 그 계약과 어긋나는 점은 §9에 모았다.

## 1. 결론

- **통합 방식:** v3.7 강의 미리보기를 React 컴포넌트로 **옮겨 만든다**(iframe 삽입이 아님). 미리보기는 데이터(`SCENES`)·그림 함수 11개·CSS·조작으로 나뉘어 있어서, 데이터는 타입 있는 모듈로, 그림은 같은 DOM 구조의 컴포넌트로, 조작은 훅으로 옮긴다.
- **기존 9단위를 8장면으로 바꿔 쓰지 않는다.** Foundation(9단위 Markdown/SVG 렌더러)은 v2 원고의 보관·검증 도구로 그대로 두고, v3는 새 폴더에서 만든다. 무결성 고정·대화상자 초점 복원·Preview 도구 같은 **방식**만 가져온다.
- **공개 주소 `/missions/main-M03/story`는 그대로 둔다.** 상태는 HashRouter 안의 쿼리(`?scene=05&step=iterable`)로 나타낸다. 새 라우트는 만들지 않는다. `/story/concepts`는 제안으로만 남긴다(§5.5).
- **원고(storyboard.md)가 원천이다.** React 데이터는 원고에서 파생한 화면용 사본이다. 화면 문장·단계 수·주소·대응표가 원고와 같은지를 검증기가 확인한다.
- 작업은 5단위다(§8). U1~U3은 비공개(라우트 미등록)로 바로 시작할 수 있다. U4의 앱 장착과 U5는 Owner 결정(§10) 뒤에 한다.

## 2. 세 구현 비교와 분류

분류: **재사용** = 그대로 씀 / **수정 재사용** = 일부 고쳐 씀 / **교체** = v3.7로 교체 필요 / **보존** = 과거 자료로 보존 / **검증 필요** = 추가 검증 필요.

### A. 공개 React Story (`/missions/main-M03/story`)

| 구성 요소 | 지금 하는 일 | 분류 | 판단 |
| --- | --- | --- | --- |
| `App.tsx`의 경로·lazy 로딩 | 공개 경로 | **재사용** | 경로 문자열과 lazy 방식 그대로. 가리키는 컴포넌트만 U5에서 바꾼다(Owner Gate) |
| `B21_LEARNING_STORY_ROUTE` 상수 (`B21LearningStoryEntry.tsx`) | 경로 상수 | **재사용** | |
| `B21LearningStoryView.tsx` 본문 (세 에피소드, 코드 중심) | 공개 화면 | **교체** (파일은 **보존**) | 목적이 다르다(코드 중심 vs 개념 중심). 파일은 지우지 않고 남긴다. 에피소드 바로가기의 맨 해시 링크는 HashRouter에서 404가 난다(QA §5 S-1) |
| `IteratorControl`(Iterator A/B 두 위치) | 상호작용 | **보존** | v3 Scene 05 F2와 겹친다. 선택형 심화 후보로 남긴다 |
| Decorator 정상·오류 경로 전환 | 상호작용 | **보존** | v3 Scene 06 F4·F6과 겹친다. 심화 후보 |
| `EvidencePair`(학습자 이해 / 코드 사실) | 출처 구분 | **보존** | v3는 ‘가상 예시 / 실제 사례’ 라벨로 구분한다 |
| `TermLinks`(`/terms/<id>` 링크) | 용어 연결 | **수정 재사용** | 복귀 쿼리(`b21-story`)를 붙여야 한다(§7.1) |
| 미션 복귀 링크·분야 지도 링크 (`/maps/data-database?mission=main-m03`) | 넓은 맥락 | **재사용** | 링크 그대로. 지도에서 돌아오는 장치는 없음(§7.2) |
| `missionLearning.ts` main-m03 카드(“코드에서 이해가 바뀐 세 장면”) | 진입 카드 | **교체** | 문구는 Owner Gate(D4) |
| 화면 위 ‘검토 시안’ 표시 | 상태 표시 | **검증 필요** | 교체 뒤에도 표시를 둘지 Owner가 정한다(D1) |

### B. React Story Foundation (`src/b21Story/`, 비공개)

| 구성 요소 | 분류 | 판단 |
| --- | --- | --- |
| `storyTypes.ts`의 9단위 `sceneOrder` | **교체** (Foundation 안에서는 **보존**) | v3는 8장면·128단계. 9단위 배열을 고쳐 쓰지 않고 v3 타입을 새로 만든다 |
| `storyManifest.ts` + `storyIntegrity.json`(원고 SHA-256 고정, section ID) | **수정 재사용** (방식만) | v3 원고 8개의 해시를 고정하는 방식을 가져온다. 데이터는 v2 기준이라 그대로 둔다 |
| `storyLoader.ts`의 `verifyTextIntegrity` | **재사용** | 함수 자체는 범용. v3에서는 빌드 검증기에서 쓴다 |
| `storyLoader.ts`의 glob·로딩(v2 `script.md`·SVG) | **보존** | v2 원고 전용 |
| `parseStory.ts`(Markdown AST의 학습자·강사·질문·출처 영역) | **검증 필요** | v3 원고는 단계 표 중심이라 구조가 다르다. 실행 화면 렌더러로는 쓰지 않는다. 원고와 데이터를 대조하는 검증기의 표 파서로 쓸 수 있을지 U1에서 확인한다 |
| `StoryScene`(긴 문서형 배치) | **교체** | v3는 무대·한 문장·조작 막대의 단계형 |
| `StoryFigure`(SVG 원본 + 확대 대화상자, 초점 복원·Tab 가두기) | **보존** (컴포넌트) / **재사용** (초점 복원·Tab 가두기 방식) | v3 그림은 HTML/CSS 상호작용이고 SVG가 아니다 |
| `StoryMarkdown`·`StoryCodeBlock`(복사 버튼) | **검증 필요** | v3 기본 화면에는 코드가 없다. 선택형 심화를 Markdown으로 둘 때만 쓴다 |
| `StoryCheckQuestions`·`StoryInstructorNotes`(Markdown 감싸기 6줄) | **교체** | v3는 ‘답 보기’ 공개와 단계를 따라가는 노트 |
| `B21StoryFoundation`의 장면 목록 | **교체** | |
| `ConceptMapSlot`(Scene 08 자리) | **검증 필요** | v3 Scene 08은 강의용 부분 지도. 45개념 탐색기와는 별개(§5.5) |
| `scripts/b21_preview.mjs`·`scripts/b21-preview/`(Owner 로컬 Preview, 폭 1280/390/360, iframe 뷰포트) | **수정 재사용** | v3 컴포넌트를 볼 화면을 하나 더한다. iframe은 Preview 도구 안의 **뷰포트 흉내**일 뿐, 서비스 통합 방식이 아니다 |
| `b21_story_integrity.mjs`·`check_b21_foundation_{build,browser}.mjs`·`storyContent.test.ts`·`storyRenderer.test.tsx` | **재사용** (그대로 실행) | v2 원고·Foundation 회귀 검사로 계속 돌린다. 기준을 바꾸지 않는다. v3 검사는 따로 추가한다 |

### C. v3.7 강의 미리보기 (`teaching-preview/index.html`)

| 구성 요소 | 분류 | 판단 |
| --- | --- | --- |
| `SCENES` 데이터(장면 8, 단계 128: `id,t,fig,mode,sub,say,script,qs,home,real`, 장면의 `q,ctx,tag,notes,deep,ids,legacy`) | **수정 재사용** | 타입 있는 TS 모듈로 옮긴다. 학습자 필드와 강사 필드를 나눈다(§3) |
| 그림 함수 11개(`figF1, figCmd, figF4, figCheck, figS2`~`figS8`, HTML 문자열) | **수정 재사용** | 같은 DOM·클래스 구조의 React 컴포넌트로 옮긴다. `data-go`/`data-key`는 props와 콜백으로 바꾼다 |
| CSS(약 1,000줄, `:root` 토큰) | **수정 재사용** | 루트 클래스 아래로 범위를 좁히고, 앱 전역 스타일(`button`, `h1` 등)이 새어 들어오지 않게 막는다 |
| `render`/`goTo`/`step`, 키보드 | **수정 재사용** | `useStoryNavigator` 훅으로 |
| `hashOf`/`resolveHash`/`legacy` | **수정 재사용** | 쿼리 `scene`·`step`의 해석·정규화로 바꾼다(§5) |
| `st.returnTo`(메모리 안), `#backMap`, `pushState`/`popstate` | **수정 재사용** | 복귀 대상을 주소의 `back`에 담아 새로고침에도 남게 한다(§5.2) |
| 목차·강사 노트 서랍 | **수정 재사용** | 발표자 창 선택지를 더한다(§6.2) |
| `MAP8_SRC`(원본 지도에서 뽑아 넣은 부분집합) | **교체** | 빌드 때 `candidate-map.json`에서 명시적으로 투영하고, 원본과 같은지 테스트로 확인 |
| `qa/check-preview.mjs` | **재사용** | 독립 HTML의 회귀·원고 대조 기준. React 동등성 검사의 비교 대상(정답지)으로 쓴다 |
| 194개 PNG | **보존** | 시각 기준 자료 |
| 독립 HTML 파일 자체 | **보존** | 콘텐츠 승인 기록. 앞으로 원고를 고칠 때 시안 도구로 계속 쓸지는 D1과 함께 정한다 |

## 3. 콘텐츠 데이터 모델

### 3.1 원천과 파생

```text
v3/scene-0N/storyboard.md   ← 원천 원고 (교수 설계·화면 문장·대본·질문·노트·대응표)
        │  (사람이 옮김 + 검증기가 대조)
src/b21StoryV3/content/scene0N.ts   ← 화면용 데이터 (그림 매개변수 포함)
        │
src/b21StoryV3/content/integrity.json   ← 원고 8개 SHA-256 + 단계 ID 목록 (자동 갱신 금지)
```

- 원고의 단계 표에는 그림 매개변수(`fig`, `mode`, `sub`, `home`)가 없다. 그래서 원고에서 데이터를 **자동 생성하지 않는다.** 데이터는 사람이 옮기고, 검증기가 대조한다.
- 대조 항목은 다섯 가지다.
  1. 장면별 단계 수.
  2. 단계 순서와 주소 토큰(05·06은 원고 표의 `#5-…` ID).
  3. 화면 한 문장(`say`)이 원고 표의 문장과 같은지(공백·코드 표기만 정규화).
  4. v3.6 숫자 주소 대응표가 원고와 같은지.
  5. 원고 파일의 SHA-256이 `integrity.json`과 같은지. 다르면 실패하고, 승인 해시를 자동으로 고치지 않는다(Foundation `b21_story_integrity.mjs`와 같은 원칙).

  check-preview.mjs가 독립 HTML에 하는 원고 대조와 같은 기준을 쓴다.

### 3.2 타입 (제안)

```ts
type SceneId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';
type Addressing = 'number' | 'id';            // 05·06만 'id' (screen-guidelines §8)

interface TeachingScene {
  id: SceneId; title: string; question: string; ctx: string; tag?: string;
  addressing: Addressing;
  legacy?: readonly string[];                 // v3.6 숫자 n → 단계 id (05·06)
  home: string;                               // ‘전체 구조’ 단계 id
  steps: readonly TeachingStep[];
  instructor: { notes: readonly string[]; deep: readonly string[] };
  source: { storyboard: string; sha256: string };
  guideChapter?: string;                      // §7.4, D8 승인 뒤
}

interface TeachingStep {
  id: string;                                 // 장면 안에서 고유. 그림 선택·주소에 씀
  title: string;
  figure: FigureId;                           // 'f1'|'cmd'|'f4'|'check'|'s2'..'s8'
  mode?: string; sub?: string; home?: string;
  say: string;                                // 화면 한 문장 = 원고 문장
  real?: boolean;                             // ‘실제 사례 · ledger’ 라벨
  reveal?: { answers: readonly string[] };    // 확인·적용 단계의 공개 답(학습자 화면)
  review?: readonly StepAddress[];            // Scene 08 복습 버튼의 목적지
  instructor?: { script?: readonly string[]; expected?: readonly { q: string; a: string; miss: string }[] };
  terms?: readonly TermRef[];                 // §7.1, D8 승인 뒤
}

type StepAddress = { scene: SceneId; step: string };  // step = 숫자 문자열 또는 id
type TermRef = { termId: string; label: string; scope: 'direct' | 'extension' };
```

- **학습자 필드와 강사 필드를 나눈다.** 대본·기대 답·흔한 오답은 `instructor` 아래에만 둔다. 학습자 화면과 발표자 창이 같은 데이터에서 서로 다른 부분을 읽는다.
- **주소 토큰:** `addressing: 'number'`인 장면은 1부터 세는 숫자, `'id'`인 장면은 `step.id`를 쓴다. 원고 §8 규칙 그대로다. 모든 장면을 ID 주소로 통일할지는 D2에서 정하고, 정하기 전에는 바꾸지 않는다.
- **Scene 08 지도 데이터:** `lectureAreas[]`(7개: 이름·한 줄 뜻·대표 개념·복습 주소·`originalAreaIds`·`originalNodeIds`)와 `relations`/`comparisons`(원본 ID 목록만)를 둔다. 문구는 빌드 때 `candidate-map.json`에서 가져온다. 원본 노드의 `sceneIds`는 v2 번호(`03a`·`03b`)라서 v3 복습 주소로 쓰지 않는다.

## 4. React 컴포넌트

```text
B21TeachingStory                 (공개 경로에 붙일 페이지. U5 전에는 Preview에서만)
 ├─ StoryTopBar                  ctx · 예시/실제 사례 라벨 · ‘개념지도로 돌아가기’ 칩
 ├─ StoryQuestion                핵심 질문 (h1, tabIndex=-1, 장면 이동 때 초점)
 ├─ StoryStage                   figure → <FigureRenderer>
 │   └─ FigF1 · FigCmd · FigF4 · FigCheck · FigS2 … FigS8
 ├─ StorySentence                화면 한 문장 (aria-live=polite)
 ├─ StoryControls                목차 · 강사 노트(또는 발표자 창) · 전체 구조 · ‹ · › · 진행 막대
 ├─ StoryDrawer kind="toc"       128단계 목록, aria-current=step
 └─ StoryDrawer kind="notes"     <InstructorNotes step scene/>
B21PresenterView                 ?view=presenter (§6.2)
B21StoryReturn                   용어 페이지 복귀 배너 (§7.1, 장착은 U5)

hooks   useStoryAddress()   주소 ↔ {scene, step, back, view} (해석·정규화·REPLACE)
        useStoryNavigator() 이전/다음/처음/끝/목차 이동 + 이력 정책 (§5.3)
        useStepKeyboard()   ←/→/PageUp/PageDown/Home/End, Esc
        usePresenterSync()  BroadcastChannel
lib     b21StoryAddress.ts     순수 함수 (테스트 대상)
        b21StoryNavigation.ts  고정 경로 helper (b31StoryNavigation과 같은 방식)
```

- **그림 컴포넌트:** 미리보기의 HTML 구조·클래스·텍스트를 그대로 둔다. 같은 원고 문장과 같은 시각 결과가 나와야 한다(§8 U2 동등성 검사). 선택 가능한 부분은 `<button aria-pressed>`로 두고, 다시 누르면 전체 상태로 돌아가는 동작도 그대로 둔다.
- **CSS 격리:** 루트 `.b21t` 아래로 범위를 좁힌다. 앱 전역 CSS가 버튼·제목을 바꾸지 못하게 한다. 미리보기의 `:root` 토큰은 `.b21t` 변수로 옮긴다.
- **그대로 지킬 동작:** 단계를 옮기면 답을 다시 숨기고, 장면이 바뀌면 핵심 질문에 초점을 주고, 목차에서 고르면 서랍을 닫고 초점을 질문에 준다. 노트는 단계를 따라 바뀐다. 목차가 열린 동안 방향키를 무시하고, summary 위에서도 무시한다.

## 5. 주소·새로고침·이력

### 5.1 주소 형식 (제안, D2)

모든 상태는 **HashRouter 안의 경로와 쿼리**다. 브라우저 바깥 쿼리를 쓰지 않는다. 맨 해시 링크도 쓰지 않는다.

```text
#/missions/main-M03/story                               → Scene 01 · 1단계 (주소는 깨끗하게 유지)
#/missions/main-M03/story?scene=03&step=4                → Scene 03 · 4단계
#/missions/main-M03/story?scene=05&step=iterable         → Scene 05 · Iterable
#/missions/main-M03/story?scene=05&step=iterable&back=6  → 위 + ‘Scene 08 · 6단계로 돌아가기’ 칩
#/missions/main-M03/story?scene=02&step=1&view=presenter → 발표자 창 (D5)
```

| 키 | 허용 값 | 잘못된 값 |
| --- | --- | --- |
| `scene` | `01`~`08` (앞에 0이 붙은 두 자리. `1`~`8`도 받아서 두 자리로 정규화) | 무시하고 Scene 01 · 1단계로. ‘요청한 장면을 찾지 못했습니다’를 안내 |
| `step` | 숫자 주소 장면: `1`~단계 수. ID 주소 장면: 그 장면의 `step.id`. **05·06의 숫자**는 원고 대응표로 바꾼다 | 장면은 살리고 그 장면 1단계로. 안내 문장 표시 |
| `back` | Scene 08의 단계 번호 `1`~`17`. `scene≠08`일 때만 | 버림(칩 없음) |
| `view` | `presenter` | 버림 |

- **정규화는 REPLACE다.** 허용하지 않은 키, 같은 키가 두 번 나오는 경우, 숫자 형식 차이, 05·06의 숫자 주소를 정규 주소로 바꿀 때 새 이력을 만들지 않는다. 쿼리 길이는 512자로 제한한다.
- 외부 문자열로 DOM 선택자를 만들지 않는다. 데이터의 ID 목록에서 찾아서 쓴다.
- 미리보기 주소와의 관계: 독립 HTML의 `#S-T`는 서비스의 `?scene=0S&step=T`에 1:1로 대응한다. 이 표를 [teaching-preview/README.md](teaching-preview/README.md)에 적어 두면 된다(U5).

### 5.2 새로고침 복원

- 새로고침하면 `scene`·`step`·`back`·`view`가 주소에서 그대로 돌아온다. QA에서 찾은 ‘복습 중 새로고침하면 칩이 사라짐’ 문제가 여기서 해결된다.
- 답 공개 상태와 서랍 열림은 주소에 넣지 않는다. 새로고침하거나 단계가 바뀌면 닫힌 상태로 시작한다(지금 동작과 같음).
- 초점: 처음 열 때와 새로고침했을 때는 핵심 질문. 복귀할 때 초점을 줄 버튼 ID는 `history.state`(앱 소유 키 `b21`)에 둔다. 상태가 없으면 질문에 초점을 준다. Router가 관리하는 `idx/key/usr`는 덮어쓰지 않는다.
- `sessionStorage`는 쓰지 않아도 된다. 필요한 상태가 주소 하나로 다 표현된다. 개인 정보·자유 입력은 저장하지 않는다.

### 5.3 이력 정책 (제안, D3)

| 동작 | 이력 | 이유 |
| --- | --- | --- |
| 이전·다음·방향키·Home·End (장면 경계를 넘는 경우 포함) | **REPLACE** | 지금 미리보기와 같다. 128단계가 이력에 쌓이면 ‘뒤로’가 쓸모없어진다 |
| 목차에서 고르기, 장면 끝의 ‘Scene 0n로 ›’ | **PUSH** | 학습자가 고른 이동이다. ‘뒤로’로 돌아갈 수 있어야 한다 |
| Scene 08 → 앞 장면 복습 | **PUSH** + `back` | 지금 미리보기와 같다 |
| ‘개념지도로 돌아가기’ 칩 | 바로 앞 이력이 앱이 남긴 Scene 08 기록으로 확인되면 **뒤로(-1)**, 아니면 `?scene=08&step=<back>`으로 **REPLACE** | 확인 없이 `navigate(-1)`을 하면 다른 사이트로 나갈 수 있다(계약 §6의 원칙 유지) |
| 브라우저 뒤로·앞으로 | 그 이력의 주소를 그대로 복원 | 복원하면서 다시 PUSH하지 않는다 |
| 용어 페이지로 이동 / 용어 페이지에서 복귀 | **PUSH** / **PUSH** (B3-1과 같은 `Link`) | B3-1 동작과 맞춘다 |

### 5.4 v3.6 이전 주소 호환 범위

- **포함:** Scene 05·06의 v3.6 숫자 주소를 `step` 쿼리에서 받아 원고 대응표로 옮긴다(독립 HTML과 같은 표, 검증기로 원고와 대조).
- **제외:** 독립 HTML의 맨 해시(`#5-3`)를 서비스 주소로 받는 것. 서비스는 그 주소를 가진 적이 없다. 지금 공개 화면의 `#iterator-generator`·`#decorator`·`#type-hint`도 제외한다. 이 주소들은 이미 404가 나므로 지킬 사용자 주소가 없다. v2 Foundation의 `scene-03a`·section ID도 공개된 적이 없어 제외한다.

### 5.5 개념지도 경로

- v3 Scene 08 자체가 강의용 개념지도이고, Story 경로 안의 장면이다. **새 경로가 필요 없다.**
- 45개념·24관계·10비교 전체 탐색기(계약 §4·§5의 `B21ConceptExplorer`)는 이번 계획에 넣지 않는다. 만들게 되면 그때 `/missions/main-M03/story/concepts`를 Owner Gate에 올린다(**미승인 제안**). 용어 복귀 쿼리 이름 `b21-map`은 그 탐색기를 위해 비워 둔다(§7.1).

## 6. 화면 모드

### 6.1 강의 모드 (기본)

지금 미리보기와 같다. 투영 화면 1280×720 기준, 조작 버튼 5개.

### 6.2 발표자 창 (D5)

[qa-review §3.1](qa-review-v3.8.md#31-발표자-창설계만)의 설계를 따른다.

- `?view=presenter`를 붙인 같은 경로를 새 창으로 연다.
- `BroadcastChannel('b21-story')`로 `{type:'goto', scene, step}`과 `{type:'reveal', on}`을 주고받는다. 주인은 투영 창이고, 발표자 창은 요청만 보낸다.
- 연결이 없으면 지금의 노트 서랍을 쓴다.

### 6.3 테마 (D7)

미리보기는 밝은 팔레트 하나뿐이다. 선택지는 둘이다.

- ① 강의 화면은 투영 가독성을 위해 고정 팔레트를 쓰고, 앱 강조색 테마는 바깥 틀에만 적용한다(권장).
- ② 앱 테마 토큰으로 옮긴다. 이때는 대비를 다시 검사해야 한다.

어느 쪽이든 `prefers-reduced-motion`은 유지한다.

### 6.4 혼자 복습하는 학습자 (설계만)

대본은 강사용이라 학습자에게 보이지 않는다. 혼자 복습하는 학습자가 화면 한 문장만으로 부족하면, 확인 단계의 ‘답 보기’ 아래에 원고의 ‘기대 답’ 한 줄을 학습자용으로 따로 둘 수 있다. 이것은 원고 변경이라 콘텐츠 작업으로 분리한다(D6과 함께 검토).

## 7. 연결 체인: Story → 개념지도 → 용어사전·분야 지도 → 복귀

```text
Scene 0n 단계 ──(목차·다음)──▶ Scene 08 영역/관계 ──복습(PUSH, back=k)──▶ Scene 0n 단계
     ▲                                  │                                       │
     │                                  │ 용어 링크(D8)                          │ 칩·뒤로
     │                                  ▼                                       ▼
     │                         /terms/<id>?b21-story=…  ──‘B2-1 Story로’──▶ Scene 08 · k단계
     │
     └── 장면 끝·Scene 08-17 ──▶ /missions/main-M03/guide/<chapter> (실습, D8)
                                /maps/data-database?mission=main-m03 (분야 지도, 복귀 보류)
```

### 7.1 용어사전 왕복

- 링크: `/terms/<termId>?b21-story=<URLSearchParams로 한 번 인코딩한 scene·step(·back)>`.
- 복귀 배너 `B21StoryReturn`은 `B31LearningReturn`과 같은 방식이다. `/terms/*`이면서 `b21-story`가 정규화를 통과할 때만 “← B2-1 Story로 돌아가기 (Scene 08 · 6단계)”를 보여 준다. 목적지는 고정 Story 경로와 정규화한 쿼리뿐이다. 임의의 `returnUrl`은 받지 않는다.
- `b31-map`과 `b21-story`가 둘 다 있으면 B3-1 배너만 보여 준다(계약 §6과 같음). B21 링크는 `b31-map`을 복사하지 않는다.
- 연결할 용어는 QA §6.1의 **연결 가능 18개**다. `extension` 항목에는 “용어사전의 설명은 이 강의보다 넓습니다” 안내를 붙인다. **연결 보류**(Iterable, python -m, argparse, 패키지, `__main__.py`, import, Model, 메모리, 재대입·wrapper, 자료형 변환, Parameter·Argument, `init`, `loop`)는 링크를 만들지 않고, 비슷한 용어로 대체하지도 않는다.
- 링크를 둘 자리: 기본 화면에는 링크를 두지 않는다(원고 §1). 후보는 ① 강사 노트의 ‘선택형 심화’, ② Scene 08 영역을 고르면 나오는 옆 칸, ③ 각 장면의 정리 단계 아래다. Scene 08 원고의 “용어사전 연결은 아직 미연결” 문구를 바꾸는 일이 함께 따라온다 → 원고 변경, D8.

### 7.2 분야 지도

미션 상세의 `/maps/data-database?mission=main-m03` 링크(강조 5개: schema·csv·json-lines·serialization·streaming)를 Scene 04·05의 심화나 Scene 08 끝에 둘 수 있다. **분야 지도에서 B2-1로 돌아오는 배너는 연결 보류다.** `TechnologyFieldMap`(보호 대상)을 바꿔야 하기 때문이다. 그때까지 돌아오는 길은 브라우저 ‘뒤로’뿐이고, 그렇게 안내한다.

### 7.3 ‘링크 존재’와 ‘복귀 동작’을 따로 확인

| 확인 | 방법 | 단위 |
| --- | --- | --- |
| 링크 존재 | 데이터의 모든 `TermRef.termId`가 `content/terms/<id>.md`와 `encyclopedia-graph.json`의 `term:<id>`에 있는지 단위 테스트로 확인. 보류 목록의 ID가 데이터에 없는지도 확인 | U1·U4 |
| 링크 모양 | 생성된 href가 고정 경로 + 허용 쿼리뿐인지(정규화 왕복 테스트) | U4 |
| 복귀 동작 | MemoryRouter 테스트: Scene 08 · 6 → 용어 → 배너 → Scene 08 · 6. 이어서 브라우저 뒤로·앞으로, `b31-map`과 함께 있을 때 B3-1이 우선하는지 | U4 |
| 실제 앱 복귀 | 실제 Chrome에서 용어 페이지 배너 클릭 → 원래 단계와 초점. 새로고침한 용어 페이지에서도 확인 | U5(장착 뒤) |

### 7.4 학습가이드(실습) 연결 (D8)

| 장면 | 학습가이드 장 (`/missions/main-M03/guide/<id>`) |
| --- | --- |
| 01 | `01-cli-execution` |
| 02 | `09-ledger-overview` |
| 03 | `02-transaction-crud`, `05-search-summary` (수정·삭제의 안전성은 `06-safe-update-delete`) |
| 04 | `03-file-persistence` (수정·삭제 저장 전략은 `06-safe-update-delete`) |
| 05 | `04-generator-streaming` |
| 06 | `07-decorator-error-handling` |
| 07 | `08-type-hint-validation` |
| 08 | `09-ledger-overview` |

Story는 개념을 맡고, 학습가이드는 실행·구현·검증을 맡는다. 이 둘을 섞지 않는다. 학습가이드 내용은 바꾸지 않는다.

### 7.5 강의 영역 7개와 원본 영역 대응

[scene-08/storyboard.md §1](scene-08/storyboard.md#1-기존-개념지도와-v36-강의-영역-대응표)의 표가 기준이다. 데이터의 `lectureAreas[].originalAreaIds/originalNodeIds`를 검증기가 원본과 대조한다. 확인 내용은 세 가지다. 모든 ID가 원본에 있어야 한다. 새 ID가 없어야 한다. 원본에 없는 v3 개념(Model·검색·요약·CSV·재대입·함수 전달/반환·자료형 변환)에는 노드 ID가 없어야 한다.

## 8. Codex 구현 계획 — 5개 작업 단위

**공통 보호 파일** (모든 단위. 따로 적지 않으면 diff가 0이어야 한다):

- 공개 B2-1 Story: `src/B21LearningStoryView.tsx`, `src/B21LearningStoryEntry.tsx`, 관련 CSS
- B2-1 Foundation: `src/b21Story/**`, `scripts/b21_story_integrity.mjs`, `scripts/check_b21_foundation_*.mjs`
- v2 원고·그림·후보 지도: `drafts/b2-1-story-map/scene-*/**` (특히 `scene-08/candidate-map.json`)
- v3 원고·미리보기: `drafts/b2-1-story-map/v3/scene-*/**`, `v3/teaching-preview/**`. 읽기 기준으로만 쓴다. 고치려면 콘텐츠 작업으로 따로 한다
- 용어·가이드·지도 데이터: `content/terms/**`, `content/mission-guides/**`, `data/**`, `src/data/generated/**`
- 다른 미션과 B3-1: `src/B31*`, `src/b31*`, `src/missionConceptMap/**`, `src/M03LearningStory.tsx`, `src/MissionGuide*`
- 라우팅·공개 URL: `src/App.tsx`, `src/main.tsx`, `src/missionLearning.ts`(U5 전까지)
- 확장 프로그램·배포: `extension/**`, `dist-extension/**`, `.github/workflows/**`, `vite.config.ts`

**공통 완료 규칙:**

- 로컬 커밋만 한다(Push·병합·배포는 하지 않는다). 커밋 메시지 끝에 저장소 규칙의 attribution을 붙인다.
- 최종 SHA, 변경 파일, 보호 파일 diff 0을 보고한다. 검사 기준을 완화하지 않는다. 생성 파일의 잡음은 확인한 뒤 되돌린다.

### U1. v3 콘텐츠 데이터와 원고 대조 검증기

| 항목 | 내용 |
| --- | --- |
| 시작 기준 | v3.8 커밋(이 문서). 작업 트리 깨끗함. check-preview·`b21:validate`·build·test PASS |
| 변경 허용 파일 | 새 폴더 `src/b21StoryV3/content/**` (`types.ts`, `scene01.ts`~`scene08.ts`, `index.ts`, `integrity.json`, `map.ts`, `*.test.ts`), 새 스크립트 `scripts/b21_v3_content_check.mjs`, `package.json`의 scripts에 `b21:v3-validate` 한 줄 추가 |
| 보호 파일 | 공통 목록 전부. `package.json`의 기존 scripts·의존성(특히 `build`·`test` 체인)은 바꾸지 않는다 |
| 기능 요구사항 | ① 미리보기 `SCENES`를 §3.2 타입으로 옮긴다(128단계, 학습자·강사 필드 분리). ② 원고 8개의 SHA-256과 단계 ID를 `integrity.json`에 고정한다. 해시가 다르면 실패하고, 자동으로 고치지 않는다. ③ 원고 대조 다섯 가지(§3.1). ④ Scene 08 지도는 `candidate-map.json`에서 명시적으로 투영한다. 원본 문구와 같은지, 원본 파일이 바뀌지 않았는지 확인한다. ⑤ `lectureAreas`와 원본 ID를 대조한다(§7.5). ⑥ 이 단계에서는 용어 ID를 데이터에 넣지 않는다(D8 전). 대신 QA §6.1의 연결 가능 18개 ID가 실제로 있는지만 테스트한다 |
| 완료 조건 | 128단계·8장면. 화면 문장 128개가 원고와 일치. 대응표 05(16개)·06(13개) 일치. 지도 투영이 원본과 같음. UI 파일 없음. 라우트 없음 |
| 자동 QA | `npm run b21:v3-validate` PASS. 새 vitest 테스트 PASS. 기존 `npm test`(176 이상)·`b21:validate`·`npm run build`·`b21:browser-check`·check-preview 모두 PASS(기준 그대로) |
| Owner 확인 | 없음(데이터 이식). 원고와 데이터가 다르면 원고를 기준으로 고친다. 원고가 틀렸다고 보이면 고치지 말고 보고한다 |

### U2. 강의 화면 컴포넌트·그림 이식과 비공개 Preview

| 항목 | 내용 |
| --- | --- |
| 시작 기준 | U1 커밋. 모든 검사 PASS |
| 변경 허용 파일 | `src/b21StoryV3/components/**`, `src/b21StoryV3/figures/**`, `src/b21StoryV3/b21StoryV3.css`, `src/b21StoryV3/B21TeachingStory.tsx`, `scripts/b21-preview/main.tsx`·`preview.css`(v3 화면 선택 추가), 새 `scripts/check_b21_v3_parity.mjs`, `package.json` scripts에 `b21:v3-parity` 한 줄 |
| 보호 파일 | 공통 목록. Preview의 기존 Foundation 화면·동작(9장면 선택, 1280/390/360)은 그대로 둔다 |
| 기능 요구사항 | ① 그림 함수 11개를 같은 DOM·클래스·텍스트의 컴포넌트로 옮긴다. ② `.b21t`로 CSS를 격리한다. ③ 조작 막대 5개 버튼, 목차·노트 서랍, 답 공개, ‘전체 구조’. ④ 이 단계의 상태는 컴포넌트 안에만 둔다(주소 연결은 U3). ⑤ QA §7 A의 1번(모바일 44px)을 시각 배치는 유지한 채 반영한다. ⑥ Preview 도구에서 `view=v3&scene=..&step=..`로 연다. 앱 라우트에는 등록하지 않는다 |
| 완료 조건 | 128단계 × 1280/390/360에서 독립 HTML과 비교해 `#stage` 텍스트·화면 문장·진행 표시·노트 텍스트가 같음. 화면 차이가 허용 범위 안. 모바일 무대 안 버튼 전부 44px 이상. 가로 넘침 0. 외부 요청 0. 콘솔 오류 0 |
| 자동 QA | `npm run b21:v3-parity`(실제 Chrome, 독립 HTML을 비교 기준으로). 화면 차이 허용치는 이 단위에서 정하고 문서에 적는다. 단, 44px을 반영하려고 바꾼 요소는 텍스트 동등성만 본다. 그 밖에 기존 검사 전부 PASS |
| Owner 확인 | Preview(`npm run b21:preview`)로 몇 단계를 눈으로 비교: 05·06 전 단계, 08의 영역·관계, 모바일 01·04 |

### U3. 주소·이력·복습 왕복·키보드·발표자 창

| 항목 | 내용 |
| --- | --- |
| 시작 기준 | U2 커밋. D2·D3 결정(결정 전이면 §5의 제안값으로 구현하고, 상수 한 곳에 모아 바꾸기 쉽게 한다). D5가 미정이면 발표자 창은 빼고 진행 |
| 변경 허용 파일 | `src/b21StoryV3/lib/b21StoryAddress.ts`, `src/b21StoryV3/lib/b21StoryNavigation.ts`, `src/b21StoryV3/hooks/**`, `src/b21StoryV3/B21PresenterView.tsx`, U2 컴포넌트, 테스트, Preview 진입 |
| 보호 파일 | 공통 목록. `src/b31StoryNavigation.ts`는 읽기만 하고 바꾸지 않는다 |
| 기능 요구사항 | ① §5.1 해석·정규화(REPLACE)와 05·06 대응표. ② §5.3 이력 정책. ③ `back`으로 칩 표시. 칩을 누르면 검증된 이전 이력이 있을 때 -1, 없으면 REPLACE. ④ `history.state.b21`로 초점 복원. ⑤ 키보드(←/→/PageUp/PageDown/Home/End/Esc, 목차가 열린 동안·summary 위에서는 무시). ⑥ 잘못된 주소는 맞는 부분을 살리고 안내(QA §7 A의 3번). ⑦ (D5 승인 시) 발표자 창과 BroadcastChannel 동기화, 연결이 없을 때의 대체 동작 |
| 완료 조건 | MemoryRouter 테스트: QA 시나리오 1~10을 모두 재현. 그중 복습 중 새로고침해도 칩이 남는 것, 뒤로·앞으로를 해도 칩과 초점이 맞는 것을 반드시 포함. 정규화 왕복 테스트(잘못된 값 20가지 이상) |
| 자동 QA | vitest(주소 순수 함수 + 컴포넌트). Preview에서 실제 Chrome으로 뒤로·앞으로·새로고침 확인(`b21:v3-parity`에 시나리오 추가). 기존 검사 전부 PASS |
| Owner 확인 | D2(주소 모양), D3(이력), D5(발표자 창). 투영 환경에서 발표자 창을 한 번 시연 |

### U4. 용어사전·학습가이드·분야 지도 링크 체인 (장착 전)

| 항목 | 내용 |
| --- | --- |
| 시작 기준 | U3 커밋. **D8 결정**(링크 자리, 원고 문구 변경). 원고를 바꿔야 하면 콘텐츠 작업으로 먼저 커밋하고, U1의 해시를 Owner 승인 아래 다시 고정 |
| 변경 허용 파일 | `src/b21StoryV3/content/*`(`terms`, `guideChapter` 필드 추가), `src/b21StoryV3/components/StoryTermLinks.tsx`, `src/b21StoryV3/B21StoryReturn.tsx`, `src/b21StoryV3/lib/*`, 테스트 |
| 보호 파일 | 공통 목록. 특히 `src/App.tsx`(배너는 아직 장착하지 않음), `src/B31LearningReturn.tsx`, `content/terms/**`, 지도 화면 |
| 기능 요구사항 | ① QA §6.1 연결 가능 18개만 `TermRef`로. extension이면 안내 문구. ② `b21-story` 쿼리 생성·해석(고정 경로, 한 번 인코딩, 중첩 금지). ③ `B21StoryReturn`: `/terms/*` + 유효한 `b21-story`일 때만 표시하고, `b31-map`이 함께 있으면 숨김. ④ §7.4 학습가이드 링크. ⑤ 분야 지도 링크(복귀 없음을 안내) |
| 완료 조건 | §7.3의 ‘링크 존재’·‘링크 모양’·‘복귀 동작’ 테스트 PASS. 보류 목록의 ID가 데이터에 없음 |
| 자동 QA | vitest(MemoryRouter로 Story → 용어 → 배너 → Story). 기존 검사 전부 PASS |
| Owner 확인 | D8(링크 자리·문구), 용어 extension 안내 문구 |

### U5. Owner Gate — 공개 경로 전환과 통합 QA

| 항목 | 내용 |
| --- | --- |
| 시작 기준 | U1~U4 커밋. **D1·D4·D7 명시 승인**(+ 적용되는 D2·D3·D5·D6·D8). 이 단위는 승인 범위 밖의 일을 하지 않는다 |
| 변경 허용 파일 | `src/App.tsx`(같은 경로 `/missions/main-M03/story`의 lazy 대상만 `B21TeachingStory`로 바꾸고, `B21StoryReturn`을 `B31LearningReturn` 옆에 장착), `src/missionLearning.ts`(main-m03 카드 문구만, D4), `src/missionLearning.test.ts`(main-m03 기대값만), `v3/teaching-preview/README.md`(주소 대응표 §5.1), 상태 문서 |
| 보호 파일 | `src/B21LearningStoryView.tsx`(**지우지 않음**, 연결만 끊음), Foundation, 다른 미션의 카드·경로, B3-1, 가이드, 지도, 확장 프로그램, 배포 설정. 새 라우트 추가 금지 |
| 기능 요구사항 | ① 공개 경로 문자열은 바꾸지 않고 렌더러만 바꾼다. ② 미션 카드의 story 항목 문구(D4). concepts 카드는 추가하지 않는다(§5.5). ③ 용어 페이지 배너 장착. ④ ‘검토 시안’ 표시 여부(D1) |
| 완료 조건 | 실제 앱(dev와 dist)에서 미션 상세 → Story → Scene 08 → 복습 → 용어 → 배너 → 원래 단계까지 이어짐. 새로고침·뒤로·앞으로 확인. 다른 미션·B3-1·가이드·용어 페이지의 동작과 화면 변화 없음. `missionLearning` 테스트는 main-m03만 바뀜 |
| 자동 QA | 위 모든 검사 + 실제 Chrome 통합 동선(§7.3 ‘실제 앱 복귀’) + 보호 파일 diff 0 + 기존 B3-1 검사 |
| Owner 확인 | 최종 화면·문구. 공개 여부(Push·배포는 Owner가 함) |

## 9. integration-contract.md(v2·9단위)와 다른 점

계약 문서는 v2 원고·9단위를 기준으로 했다. 덮어쓰지 않고 역사 기록으로 둔다. 위 설계와 다른 점은 다음과 같다.

| 계약 (v2) | 이 설계 (v3) | 이유 |
| --- | --- | --- |
| §1 장면 순서: 명시적 9단위(`scene-03a`·`scene-03b`), 진행 n/9 | 8장면·128단계, 진행은 ‘Scene 0n · i / N’ | v3 원고 구조 |
| §2 Markdown 원문을 AST로 그대로 렌더링(단일 원천) | 원고가 원천이고, 화면은 파생 데이터 + 대조 검증기 | v3 원고에는 그림 매개변수가 없고, 화면은 단계 표에서 나온다 |
| §3 SVG 원본 표시·확대 | HTML/CSS 상호작용 그림 | v3 그림 형식 |
| §4 장면별 상호작용 탐색기(I번호), 기존 3체험을 05·06·07에 수정 재사용 | 3체험은 과거 자료로 보존(심화 후보). 기본 화면은 v3 그림 | v3의 개념 중심 교수 순서 |
| §4·§5 Scene 08 = 45개념 탐색기(trail/cursor/filter/mode) | Scene 08 = 강의용 부분 지도(원본 투영). 전체 탐색기는 뒤로 미룸 | v3 Scene 08 원고 |
| §6 쿼리 `scene=scene-05&section=s05-generator` | `scene=05&step=iterable(&back=6)` | 단계형 화면. section 앵커가 없다 |
| §6 Scene 이동 PUSH | 이전·다음은 REPLACE, 목차·복습·용어는 PUSH (D3) | 128단계에서 이력이 넘치는 것을 막음 |
| §6 sessionStorage snapshot(12시간 TTL, 20 context) | 주소만으로 복원, `history.state`에는 초점만 | 상태가 작아 주소로 충분 |
| §6 용어 복귀 쿼리 `b21-map`(지도 쿼리) | `b21-story`(Story 쿼리). `b21-map`은 미래 탐색기용으로 남김 | 출발점이 지도가 아니라 Story 단계 |
| §1 지도 경로 제안 `/story/concepts` | 이번에는 필요 없음(미승인 제안으로 유지) | §5.5 |
| **같은 원칙** | HashRouter 안의 쿼리만, 맨 해시 금지, 임의 returnUrl 금지, 고정 경로 helper, B3-1 배너 우선, 공개 등록 전 MemoryRouter·비공개 Preview, Owner Gate 뒤 경로 전환, 기존 파일 보존, 확인 없는 `navigate(-1)` 금지 | 그대로 따른다 |

## 10. Owner 결정 항목

| ID | 결정할 것 | 권장 | 막는 단위 |
| --- | --- | --- | --- |
| D1 | 공개 `/missions/main-M03/story`를 v3로 바꾸는 시점. ‘검토 시안’ 표시를 둘지. 그 전에 지금 화면의 맨 해시 404(QA §5 S-1)를 따로 고칠지 | U1~U4 확인 뒤 바꾼다. 404는 바꾸면서 함께 사라지므로 따로 고치지 않는다(바꾸는 시점이 늦어지면 별도 작은 수정) | U5 |
| D2 | 주소 모양 `?scene=05&step=iterable&back=6`. 05·06 말고도 모든 장면을 ID 주소로 통일할지. 쿼리 없는 첫 진입의 위치 | 제안 그대로. 숫자·ID 혼용은 원고 §8 규칙을 유지. 첫 진입은 Scene 01 · 1단계 | U3 |
| D3 | 이력 정책(§5.3) | 제안 그대로 | U3 |
| D4 | 미션 카드 문구(지금 “코드에서 이해가 바뀐 세 장면”) | 예: “명령 한 줄부터 개념지도까지 — 8장면 개념 강의” | U5 |
| D5 | 발표자 창(`?view=presenter`) | 채택. 연결이 없으면 서랍을 씀 | U3(선택) |
| D6 | 두 차시로 나누기(01~04 / 05~08), 혼자 복습할 때 기대 답 공개 | 두 차시 표시만(구조는 그대로) | — (콘텐츠) |
| D7 | 강의 화면 팔레트 고정 vs 앱 강조색 테마 | 고정 팔레트, 바깥 틀만 앱 테마 | U2·U5 |
| D8 | 용어·학습가이드·분야 지도 링크의 자리와 원고 문구 변경(Scene 08 ‘미연결’ 문구 포함) | 강사 노트 심화 + Scene 08 영역 칸 + 정리 단계 아래 | U4 |

권장 원고 보완(QA §7 B)과 새 용어(Iterable 등) 추가는 이 결정들과 별개의 콘텐츠·용어 작업이다.

## 11. 위험

| 위험 | 대응 |
| --- | --- |
| 그림을 옮기는 동안 시각이 조금씩 달라짐 | 독립 HTML을 기준으로 128단계 × 3폭 동등성 검사(U2). 차이는 허용치와 함께 기록 |
| 앱 전역 CSS가 강의 화면으로 새어 들어옴 | `.b21t` 범위 격리와 동등성 검사 |
| 원고와 데이터가 따로 놂 | 원고 해시 고정과 문장 대조. 자동 갱신 금지 |
| 공개 경로 전환이 다른 미션에 영향을 줌 | U5에서만 하고, 보호 diff 0과 `missionLearning` 테스트로 확인 |
| HashRouter와 맨 해시가 충돌 | 맨 해시 금지. 리뷰 체크리스트에 넣음 |
| 용어 뜻이 강의보다 넓어 혼동 | extension 안내. 보류 항목은 연결하지 않음 |
| 번들 크기(이미 2.3MB 경고) | 경로 단위 lazy 로딩 유지. v3 데이터와 그림은 Story 청크 안에만 |
