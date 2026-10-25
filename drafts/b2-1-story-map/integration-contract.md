# B2-1 웹 통합 계약 제안

2026-10-23 · 기준 `358927d3414e231b81bf975bbf38bc1879cffd7f` · **설계 문서: 아래 신규 파일·라우트·테스트는 아직 구현되지 않았다.**

콘텐츠·실행 근거·발견 사항·승인 상태는 [준비 점검](integration-readiness.md)에 둔다. 이 문서는 실제 구현 담당자가 따라야 할 계약이다. 이번 스프린트는 문서와 handover만 변경한다. 공개 URL 확정, 서비스 연결, 운영 JSON 작성, 배포는 하지 않는다.

## 1. 실제 코드 경계와 화면 전환

| 현재 근거 | 구현 판단 |
| --- | --- |
| [main.tsx](../../src/main.tsx)의 HashRouter, [App.tsx](../../src/App.tsx)의 lazy B21LearningStoryView | 기존 `/missions/main-M03/story`를 보존. 후속 승인 후 이 경로의 렌더러를 신규9단위로 전환. 외부 hash와 내부 section hash를 혼동하지 않음 |
| [missionLearning.ts](../../src/missionLearning.ts), [MissionLearningPages](../../src/MissionLearningPages.tsx) | 실제 미션 진입 카드의 데이터 원천. B21LearningStoryEntry만 고쳐서는 실제 진입 카드가 바뀌지 않음 |
| [missionLearning.test.ts](../../src/missionLearning.test.ts) | 현재 main-M03 자료종류는 story/guide. 후속 승인 후에만 concepts 추가 기대값 갱신. 16미션 이름·다른 미션 자료·대소문자 alias 보존 |
| [MissionGuide](../../src/MissionGuide.tsx), [missionGuideContent](../../src/missionGuideContent.ts) | 기존9장 가이드·assets·학습 경로 유지. Markdown/용어·그림 해석 패턴 참고. 신규Scene이 기존chapter를 덮어쓰지 않음 |
| [B31StoryMap](../../src/B31StoryMap.tsx), [b31StoryNavigation](../../src/b31StoryNavigation.ts) | 그림 격리·실제폭 측정·확대 초점 복귀·고정 목적지 helper 패턴 참고. AWS 화면·5Scene ID·B31 query schema 자체를 복사하지 않음 |
| [missionConceptMap 타입](../../src/missionConceptMap/conceptMapTypes.ts)·adapter·canvas·detail panel | B21 전용 탐색기와 adapter 작성. 기존canvas·AWS domain·강제고립제거·B31사전복귀를 재사용하지 않음 |

### 진입과 라우팅 제안(Owner Gate 전 미적용)

- 기존 공개 주소 `/missions/main-M03/story`: 유지. 최상단 핵심 질문·대면 강의 안내, 현재 Scene/전체9단위, 장면 목록, 기존 가이드/미션 복귀를 제공한다. 파라미터 없는 첫 진입은 Scene01이다.
- B21 전용 지도 주소 **제안**: `/missions/main-M03/story/concepts`. B31의 story-map/concepts처럼 독립 탐색 가능한 하위 경로다. 이 문서로 새 공개 주소를 확정하거나 적용하지 않는다.
- 미션 상세 카드 제안: **스토리 — 명령 실행부터 내 코드 설명까지**, **개념지도 — 배운 개념의 관계 복습**, **학습가이드 — 기존9장 실행 안내**. 강의 안내 경로와 자유 탐색을 둘 다 설명한다. '정답 코드', '자동 분석' 기능으로 소개하지 않는다.
- `missionLearning`의 main-M03만 승인 후 갱신한다. 기존 lowercase 데이터ID와 uppercase URL alias를 보존한다. B31·preliminary-M03 학습 자료는 영향 범위 밖이다.
- 신규9단위 수용 전에는 현재3체험 화면을 계속 제공한다. 후속 전환 뒤에도 기존 파일은 보존하고 필요한 부분만 Scene05/06/07에 수정 후 재사용한다. 판단 근거는 준비 점검 §6.
- 공개 route 활성화 전에는 MemoryRouter 기반 component/test harness에서 검토한다. 테스트용 공개 경로나 feature URL을 임의 추가하지 않는다.

### 장면 순서

`scene-01, scene-02, scene-03a, scene-03b, scene-04, scene-05, scene-06, scene-07, scene-08`의 명시적 배열을 사용한다. 문자열 정렬이나 `1..8` 계산을 사용하지 않는다. 표시명은 Scene03-A/03-B, 진행은 각각3/9·4/9다. 이전·다음은 이 배열의 이웃이며 첫/마지막 경계에서 해당 버튼을 비활성화하고 이유를 표시한다. 새 장면 선택은 제목으로 초점·스크롤을 옮기고, 복귀는 저장한 읽기 위치를 우선한다. 07→08은 '관계를 지도에서 확인하고 내 코드로 설명하기'로 연결한다.

## 2. 콘텐츠 기준과 실제 빌드 경로

### 단일 기준

원고는 기존 `drafts/b2-1-story-map/scene-*/script.md`, 그림은 같은 폴더의 승인 SVG, 예제는 `_tools/demo/`와 원고의 대응 블록을 기준으로 한다. 내용 전체를 React 문자열로 복사하지 않는다. 후보 지도는 별도의 명시적 변환을 거친다(§5).

후속 구현 파일 제안:

| 파일 | 역할 |
| --- | --- |
| `src/b21StoryContent.ts` | 9단위 순서·제목/질문 참조·section 안정ID·그림/상호작용/복습노드 참조의 좁은manifest, raw loader |
| `src/b21StoryContent/parseStory.ts` | Markdown AST로 학습자/강사/확인/출처 영역 분리, 참조 해석·메타데이터 처리 |
| `scripts/build_b21_story_content.py` | 필요한 예제 결과·그림 분할manifest의 재현 가능한 생성/원본hash 대조. 승인된 예제만 사용 |
| `src/data/generated/b21-story-examples.json` | 검증된 고정 입력/출력/단계와 출처 파일·코드블록ID·SHA/hash. 생성물이며 수동 편집 금지 |

구체적인 loader 형태는 Vite에서 지원하는 literal glob을 사용한다.

```ts
const storySources = import.meta.glob(
  '../drafts/b2-1-story-map/scene-*/script.md',
  { query: '?raw', import: 'default' },
);
const artSources = import.meta.glob(
  '../drafts/b2-1-story-map/scene-*/*-{desktop,mobile}.svg',
  { query: '?raw', import: 'default' },
);
const artDownloads = import.meta.glob(
  '../drafts/b2-1-story-map/scene-*/*-{desktop,mobile}.svg',
  { query: '?url&no-inline', import: 'default' },
);
```

manifest는 위 key가 실제 존재하는지 빌드 시 검증한다. 현재 `missionGuideContent.ts`의 raw/url glob과 `b31StoryMapContent.ts`의 명시적 SVG `?raw` import가 실제 선례다. 기존 `vite.config.ts`의 `base:'./'`를 유지하며, bundler가 내보낸 URL로 자산을 읽는다. `/drafts/...` 또는 개발 환경 절대 경로를 서비스 URL로 만들지 않는다. `drafts/`에 파일이 있다는 이유만으로 배포된다고 가정하지 않는다. 승인된 import 대상만 번들에 들어간다. Vite의 [glob import](https://vite.dev/guide/features.html#glob-import)·[정적 자산](https://vite.dev/guide/assets.html) 설명은 이 선택의 참고이며, 적용 버전은 현재 lock의6.4.3으로 실제 빌드 검증한다. 후속 구현에서는 `build_b21_story_content.py`의 생성/검증을 기존 데이터 생성 뒤·`tsc -b` 앞에 연결하고, 기존 B31 생성·검증 명령은 유지한다.

모듈은 Scene 선택 시 lazy load하고 인접Scene prefetch 정도만 허용한다. PC/모바일 두 SVG를 항상 모두 렌더링하지 않는다. 기준commit·파일별SHA256·추출범위·생성기version을 생성manifest에 남기고 원고/데모/그림이 바뀌면 검증 실패로 드러낸다. 승인되지 않은 변경을 자동 최신으로 채택하지 않는다.

### Markdown 표시·메타데이터·코드

- 실제 `## 학습자 원고`, `## 강사용 안내`, `## 이해 확인 질문`, `## 근거와 출처`를 AST heading node로 분리한다. 원고 내부 설명은 주로 `###`이다. Scene07 코드의 `#` 주석을 heading으로 읽는 정규식 분할을 금지한다. 제목 변경/중복/참조누락은 생성 검증 오류로 보고한다.
- 학습자는 원고 본문·자기 코드 활동·이해 질문을 읽는다. 강사 안내는 명시적 펼침 영역, 출처는 접을 수 있는 영역에 둔다. 강사 안내·확인 질문을 생성에서 버리지 않는다. 학습효과·공식 규정·실구현 여부를 승인 이상으로 확정하지 않는다.
- 문서 첫머리의 제작 상태·검토 담당·커밋/요구 추적은 학습 본문에서 제외하고 provenance에 보존한다. 머리표의 학습 질문·도달 기준·이전 장면·범위·다루지 않는 내용은 학습자 화면에 의미를 그대로 투영한다. 공식 목표 문구의 미확인 상태도 보존한다. `[구현 사례]`는 'ledger 구현 사례', `[학습용 예제]`는 같은 뜻의 배지, `[설계 예시]`·`[단순화]`는 범위 설명으로 표시한다. `[미검증]`의 실질적 제한은 '아직 확인하지 않은 범위'로 반드시 노출한다. 태그만 일괄 삭제하는 정규식은 금지한다.
- Scene08 E의 '실제서비스 미구현' 등은 구현 후 시점과 충돌한다. 콘텐츠 담당/Owner가 승인한 표시 대응을 먼저 만들고 반영한다. renderer가 미구현을 실구현으로 임의 치환하지 않는다. 이번에는 원고 수정 없음.
- ReactMarkdown+remarkGfm을 기존 가이드처럼 사용하되 manifest의 안정sectionID를 부여한다. raw HTML 실행·원고의 inline script는 허용하지 않는다. 소스 주석 `<!-- demo:... -->` 등은 provenance로 해석하고 학습자 코드에 섞지 않는다. [react-markdown](https://github.com/remarkjs/react-markdown)의 AST 기반 변환 패턴을 참고한다.
- Python/bash/JSON/출력 블록을 구분한다. **복사 버튼은 해당 코드블록 원문만** 복사한다. 들여쓰기·빈줄·줄바꿈·문자열을 보존하고 줄번호/배지/프롬프트를 삽입하지 않는다. 출력 블록은 실행 명령처럼 보이지 않게 표시한다. `...`가 있는 부분 예시는 '부분 예시'로 설명하며 실행 가능한 완성 파일로 다운로드하지 않는다.
- 파일별 완성 예제 다운로드는 검증된 원본파일의 emitted URL만 제공한다. 파일 이름·실행 위치·Python전제·고정 데이터 여부를 함께 표시한다. 복사 성공/실패는 `aria-live=polite`, 실패 시 선택 가능한 코드 제공. 코드블록 내부 가로스크롤은 허용하되 페이지 전체 가로넘침은 금지한다. 200%확대에서도 복사 버튼이 가려지지 않아야 한다.
- 웹에서 Python을 실행하지 않는다. 상호작용 결과는 예제에서 검증된 fixture를 보여 주고 '검증된 예제의 단계 보기'라고 설명한다. 리스트Iterator 자유next 순서 같은 작은 상태 전이는 검증된 규칙으로만 계산한다. 사용자 코드/파일·비밀정보를 자동 수집하거나 업로드하지 않는다.

## 3. SVG와 표시 동일성

원본 SVG에는 토큰·행·경우별 `<g>`가 있지만 16개 전체에 적용할 A~D 공통 분할 경계 계약은 없다. 따라서 탭용 파생 manifest가 필요하다. 원본·생성기 자체는 별도 승인 없이는 바꾸지 않는다.

1. 각 A/B/C/D(04 C-1/C-2 등)의 `viewBox` 사각형과 해당 도형·텍스트·선·marker ID를 manifest에 기록한다. 단순 screenshot crop을 새 기준 그림으로 쓰지 않는다.
2. 전체 원본 좌표계를 유지한 파생SVG viewport 또는 의미가 같은 파생fragment를 생성한다. defs/marker/style을 보존하고, 선 끝·범례·주의 문장이 잘리지 않도록 범위를 검토한다. 개별 도형을 옮겨 새 의미를 만드는 편집은 콘텐츠 승인 대상이다.
3. 원본과 파생의 텍스트·코드 줄·핵심 data속성·방향/선모양을 자동 대조한다. 그림별1280/1000/390/360 PNG를 비교하고 Owner가 경계를 확인한다. 확인 전에는 전체 그림 확대와 HTML 설명을 대안으로 제공하며 분할완료라고 하지 않는다.
4. 저장소에서 신뢰하는 SVG raw만 B31처럼 ShadowRoot로 격리한다. 원고 HTML을 임의로 주입하지 않는다. 원본의 marker/style ID 충돌을 격리하고 색만으로 의미를 전달하지 않는다.
5. 실제 그림 슬롯을 ResizeObserver로 측정한다. PC원본은 슬롯≥960px에서 사용, 그보다 작으면 모바일원본. 모바일원본도 슬롯<309px(14→12px미만)이면 더 축소하지 않고 원래 폭 스크롤/확대·동등HTML을 제공한다. PC1000px viewport라도 side panel 때문에 슬롯이 작으면 모바일 그림을 사용한다.
6. 그림은 `width:100%`, 원본 viewBox비율로 높이를 예약한다. 탭은 선택한 그림만 배치하여 수천px의 빈 공간을 남기지 않는다. Scene01은 I8접기, 나머지는 준비 점검의 구역표대로 탭/하위경우를 사용한다. 전체 원본 보기·다운로드는 언제든 가능하게 한다.
7. 확대는 대화상자로 열고 Escape/닫기·초점가두기·원래 트리거 복귀·배경 스크롤 잠금을 검증한다. 선택한 그림 구역과 단계가 확대 전후 동일해야 한다.

SVG만으로 모든 조작을 구현하지 않는다. 그림 바깥 HTML 버튼·코드·결과표·관계 설명이 의미를 제공하고, 활성 요소와 그림 강조를 연결한다. 접근 가능한 제목/긴 설명이 있는 정적 그림으로 제공하며, 동등HTML이 완전한 경우 중복 낭독을 피하도록 SVG를 보조표현으로 숨긴다. 단계 결과는 짧게 읽고 그림 전체를 매번 재낭독하지 않는다.

## 4. 컴포넌트와 반응형 동작

아래 이름/파일은 제안이며 이번에 생성하지 않는다.

```text
B21StoryPage
 ├─ B21SceneNav (9단위/진행/이전/다음/미션·가이드)
 ├─ B21SceneRenderer
 │   ├─ StoryMarkdown + CodeBlock
 │   ├─ B21StoryFigure + FigureZoomDialog
 │   ├─ Scene01CommandExplorer / Scene02ModuleExplorer
 │   ├─ Scene03aResponsibilityExplorer / Scene03bCrudExplorer
 │   ├─ Scene04PersistenceExplorer / Scene05IterationExplorer
 │   ├─ Scene06DecoratorExplorer / Scene07ContractExplorer
 │   └─ Scene08Review (B21ConceptExplorer + F/G/H활동)
 └─ InstructorNotes / CheckQuestions / Sources
B21ConceptPage → B21ConceptExplorer (Scene08과 같은 데이터·상태 로직)
B21LearningReturn + b21StoryNavigation (실제 사전·스토리 복귀)
```

이식의 단위는 각 설계 I번호다. 준비 점검 §4의 필수 항목을 모두 구현하되 유용 항목은 독립 커밋으로 분리한다. 상호작용은 수동 다음/이전/초기화, 고정 경우 선택을 기본으로 한다. 자동재생·임의실행·검증하지 않은 성능 수치는 넣지 않는다. Scene01 I7/03a I6 등 보류·조건부 항목을 구현완료로 세지 않는다.

- PC 지도: 7영역 대표노드 선택 → 직접 관계/유형 필터 → 상세6항목 → 비교카드. 관련 정보만 보여 주며 전체노드 선 배치는 만들지 않는다.
- 모바일 지도: 영역/관계/상세/비교를 명명된 탭으로 분리한다. 노드를 선택하면 관계탭으로 이동하되 관계0이면 빈 상태/같은영역 버튼을 함께 표시한다. 상세·비교 접근은 유지한다. 탭이 바뀌어도 선택·필터·모드·이력은 보존한다.
- Scene08 내 지도에서 별도 지도 페이지로 열 때도 같은state snapshot을 전달한다. 새 사본의 iframe을 띄우거나 원고E의 샘플사전 패널을 서비스로 사용하지 않는다.
- `tablist/tab/tabpanel`은 방향키·Home/End·선택 상태, 버튼은 `aria-pressed`, 현재Scene은 `aria-current=step`을 제공한다. touch target은44px 이상, 키보드 초점은 대비가 보이는 외곽선으로 표시한다. disabled의 이유를 인접 문장으로 설명한다.
- 강사모드는 P1~P3의 복습 순서·질문·현재단계/전체를 표시한다. 실제 실행 경로로 번호를 붙이지 않는다. 자유모드로 바꿀 때 안내 진행을 저장하고, 복귀하면 그 단계로 돌아간다. 자유모드 마지막 선택도 별도로 보존한다. 안내 중 관계 끝 노드·같은 영역 추천 등으로 자유 선택하면 안내 snapshot을 저장하고 free로 전환한다. 경로 단계로 강제로 되돌리지 않는다. 단계 끝 자동이동은 없다.
- 본문은200%글자확대·reduced-motion·기존4테마/명암에서 사용 가능해야 한다. 긴 모바일 도표는 구역/경우로 나누되 범례와 출력·주의를 동등HTML로 함께 제공한다. screen reader 순서는 제목→질문→제어→현재 결과→그림 설명→활동→이전/다음이다.

## 5. B2-1 전용 데이터 변환 계약

[B31 운영JSON](../../data/mission-story-maps/main-m05/concept-map.json)은 B21에 그대로 맞지 않는다. B31의 `general/aws/common`, `'흐름/대응/연관/선행'` 관계어, 그래프 뷰와 orphan불허는 B21의 탐색형·종류/호출/사용·관계0허용과 다르다. `src/missionConceptMap/` 타입을 cast하거나 전역 의미를 넓히지 않는다.

후속 제안은 `src/b21ConceptMap/{types,adapter,state}.ts`와 별도 `scripts/validate_b21_story_map.py`다. 원본 candidate를 이름만 바꿔 운영폴더로 복사하지 않는다. 명시적 projection으로 변환하고 fixture/원본hash 대조를 통과한 데이터만 import한다. 미래의 운영파일 경로 제안은 `data/mission-story-maps/main-m03/concept-map.json`이며, 작성·등록은 별도Owner승인 후다.

| 필드 | 변환·검증 계약 |
| --- | --- |
| `schemaVersion`, `mapId`, `sourceRevision` | `1`, `main-m03`, Owner가 승인한 정확한 원고/candidate SHA. 현재문서 작성SHA를 콘텐츠 승인SHA로 대체하지 않음 |
| `nodes[].id` | 기존45ID를 그대로 유지. canonical termID와 동일하다고 가정하지 않음. 고유성/빈값 검사 |
| 노드 본문 | label/easy/missionReason/codeClue와 glossary.warning을 보존. 상세6항목으로 투영하며 근거/범위 생략 금지 |
| `nodes[].sceneRefs` | candidate `01/03a` 등을 `scene-01/scene-03a`로 명시 변환. sectionID는 승인manifest에서만 매핑. 잘못된Scene/anchor는 빌드 오류 |
| `areas[]` | 기존7ID·이름·대표노드 유지. 모든노드 영역이 존재하고 대표가 해당영역에 속함을 검사 |
| `relations[]` | 24개 R ID/from/to/type/label/scope 보존. 타입은 `포함/종류/호출/사용/역할` 5종. 개요의6번째 '비교'는 edge타입이 아님. 양끝·방향·범위·중복(type,from,to) 검사 |
| `comparisons[]` | 10개 C ID/left/right/설명/Scene참조 보존. 방향/실행순서 없음. 비교pair고유성은 관계pair와 따로 검사. R22/R41과 C11의 병존 허용 |
| `teacherPaths[]` | 기존P1~P3·prompt·steps·`teacher-exploration-order` 보존. 실제 실행흐름/의미edge로 변환하지 않음 |
| `glossary` | `mode:direct/extension/none`, nullable termId, warning. 구현된 route capability는 별도 계산. 19노드/17고유ID를 실제 사전 registry와 대조 |
| provenance | candidate의제작기준 `bdc0cc5`는 역사정보로 유지. 현재 채택SHA/hash·outline R/C ID·원고 출처를 별도 저장. `outlineRef#Rxx`는 실제anchor확인 전href로 내보내지 않음 |

관계24개 ID는 `R04,R08,R09,R10,R12,R13,R14,R15,R17,R18,R19,R20,R22,R23,R24,R25,R26,R27,R28,R29,R37,R41,R44,R47`이다. 비교10개는 `C06,C07,C08,C20,C11,C12,C30,C13,C16,C21`이다. 누락된 R01~R49/C01~C35를 임의 생성하거나 재번호하지 않는다.

다음 범위를 의미 검증에 고정한다: R04는 모듈/패키지 전체가 아닌 **패키지 분기**; R10은 일반패키지, R12는 이 실행가능 예시; R14/R15는 ledger 실제한쌍; R17/R18은 제시된 책임분리 설계; R19는 파일기반저장소 사례; R23 Generator→Iterator, R41 Iterator→Iterable; R47은 wrapper를 돌려주는 wrapping함수 예시. 파일형식·계층·decorator 전반의 보편적 실행 규칙으로 확대하지 않는다.

### 관계0의 유효성

초기13개는 `cli, import, function-call, object-init, crud, memory, id, index, exceptions, parameter, return, module-dependency, call-flow`다. 이들을 오류/누락으로 처리하거나 연결을 만들지 않는다.

직접관계0이면 명확한 빈문장을 보여 주고 '같은 영역의 다른 개념'으로 **모든 추천 버튼의 성격을 명시**한다. 자기자신/중복을 제외하고 같은영역에서 최대3개, 직접관계가 있는동료 우선·기존노드순으로 계산한다. 관계/실행경로로 저장하지 않는다. 정상select action을 거쳐 이력·뒤로가기를 지원하고 기존 '다른 개념 찾기'도 보존한다. 관계는 있으나 현재 필터에서0인 경우는 '필터 결과 없음'과 필터 해제로 구분하고 고립추천을 잘못 표시하지 않는다. 같은영역에 다른개념이 없는 미래 데이터는 추천 없이 영역선택/다른개념찾기를 제공한다.

## 6. URL·이력·복귀 계약

### 정규화된 주소 상태

모든 경로·query는 **HashRouter 내부**다. 예시는 `/#/missions/main-M03/story?scene=scene-05&section=s05-generator`다. 새 링크는 `Link`/`navigate`로 만들며 `<a href="#...">`로 앱의 hash를 덮어쓰지 않는다. HashRouter의 location/search와 브라우저 URL의 바깥 search를 혼동하지 않는다. [HashRouter 문서](https://reactrouter.com/api/declarative-routers/HashRouter)는 참고이며 실제 호환성은 설치된7.18.3으로 검사한다.

`b21StoryNavigation.ts`를 새로 만들고 고정 storyPath/conceptPath만 목적지로 사용한다. 임의 `returnUrl`은 받지 않는다. 다음은 허용 query 제안이다.

| 문맥 | 허용 키·값 |
| --- | --- |
| story | `scene`=9개ID, `section`=해당 Scene 안정anchor, `figure/case/stage`=manifest의 허용값, `b21-context`=정규화한 지도query(지도→Scene 왕복 때만) |
| map | `node`=45개ID, `start`=탐색 시작ID, `trail`=최대16개 허용nodeID의 쉼표 목록, `cursor`=trail 범위 정수 |
| map 필터/선택 | `filter=all/contains/kind/calls/uses/role`, `relation`=실제R ID(선택node의 직접 관계만), `compare`=C ID, `tab=areas/relations/detail/compare` |
| map 모드 | `mode=free/guided`, `path=P1/P2/P3`, `step`=해당 경로0기반 정수 |
| map 출발 | `originScene`=9개ID, `originSection`=안정anchor, `figure/case/stage`=originScene manifest 허용값 |
| term | `b21-map`=위 허용mapquery를 URLSearchParams로 한 번 인코딩한 문자열. 일반 사전query는 기존 계약 유지 |

기본 map은 영역탭·선택 없음·filter all·free다. `trail/cursor`가 정합하면 node는 그 위치에서 파생하고 충돌하는 node를 복원하지 않는다. trail이 없으면 유효node 하나로 시작한다. 새 노드 선택은 cursor 이후 목록을 잘라낸 뒤 추가하고, 16개를 넘으면 앞부분을 버리고 cursor를 조정한다. 같은 노드 재선택은 이력을 추가하지 않는다. guided는 path/step이 선택node를 결정한다. 잘못된 path/step은 free로 복구하고 안내한다. 모드 전환 snapshot은 세션에 따로 보존한다. filter 문자열은 데이터의 한글 타입으로 명시 매핑한다.

정규화 규칙은 다음과 같다. 허용 키만 유지하고, 중복 키는 그 키 전체를 버린다. ID는 registry, 숫자는 엄격한 정수/범위로 검사한다. 알 수 없는 값·잘못된 중첩 인코딩은 안전한 기본값으로 복구한다. 바깥 query는2048자, 개별ID는120자 이내로 제한한다. 중첩context는 한 단계만 허용하며 `b21-map` 안에 또 다른 `b21-map/b21-context`를 넣지 않는다. 길이 초과 때는 이력/선택적 UI상태부터 버리고 유효 선택/출발Scene을 보존하며 안내한다. canonicalization은 REPLACE이며 새 이력 항목을 만들지 않는다.

### 저장 위치와 수명

- URL은 공유/직접 진입/새로고침용 최소 논리 상태다. nodeHistory는 URL의 trail/cursor로 최대16개 복원한다. 더 오래된 세부 이력은 세션 snapshot에서 최대32개까지 허용한다.
- `history.state`에는 앱이 소유한 `b21ContextId`, 직전entry의 Router key/목적지 증명을 둔다. Router가 관리하는 `idx/key/usr`를 raw `window.history.replaceState`로 덮어쓰지 않는다.
- sessionStorage의 `b21.ui.v1:<contextId>:<locationKey>`에 원래Scene/section, 선택/필터/모드/경로, free/guided 각각의 snapshot, 탭, 페이지/패널 스크롤, 허용focusID, viewport 폭을 저장한다. schemaVersion/sourceRevision을 검사하고12시간TTL·최대20context로 제한한다. 세션 쓰기 실패/사생활 모드에서도 URL 기반 탐색은 동작해야 한다. localStorage 영구 진도는 추가하지 않는다.
- 저장 대상은 UI상태뿐이다. 개인 코드/파일 내용/로컬 경로/자유 텍스트/API키/비밀값은 URL·history·storage·분석로그에 자동 저장하지 않는다. F/G활동은 원고의 수기/본인 편집기 양식이며 자동 업로드가 없다.

### 요구된 실제 왕복

| 단계 | 동작·필수 상태 | history 처리 |
| --- | --- | --- |
| S | Scene05 §4 Generator 읽기. 안정ID `s05-generator`를 원고의 해당 AST section에 매핑 | 현재 Scene의 scroll/focus·figure상태 snapshot |
| G | '개념지도에서 Generator 보기' → node=generator, start=generator, trail=[generator], cursor0, originScene05/section | PUSH. 출발 정보를 URL과 snapshot에 남김 |
| I | R23의 방향/종류/범위 확인 후 Iterator 선택 → trail=[generator,iterator], cursor1 | PUSH. G의 필터/스크롤/초점을 먼저 저장 |
| T | Iterator 상세에서 확장 주의를 읽고 `/terms/iterator?b21-map=...` 이동 | PUSH. I의 선택/모드/이력·패널scroll 저장 |
| I 복귀 | 'B2-1 개념지도로 돌아가기' → Iterator 선택·같은 필터/모드 | 앱이 소유한 직전 I entry가 검증되면 POP(-1). 아니면 고정map 목적지로 REPLACE |
| G 복귀 | 지도 내 '직전 선택으로' → Generator의 이전 snapshot | 직전entry가 검증된 G면 POP(-1), 아니면 trail cursor 감소 후 REPLACE. URL 직접 진입에도 동작 |
| S 복귀 | '원래 Scene05 읽던 곳' → 원래anchor·그림/단계·읽기 위치 | 검증된 직전 S면 POP(-1), 아니면 고정story Scene/section으로 REPLACE |

단순히 `navigate(-1)`을 호출하면 외부 사이트로 갈 수 있으므로 금지한다. POP 가능 판단은 같은context·Router locationKey·예상 목적지·세션의 직전entry 증명을 모두 만족해야 한다. 새로고침 직후도 증거가 남을 때만 POP한다. 검증할 수 없으면 안전한 로컬 목적지로 REPLACE한다. 앞뒤 이동 때마다 PUSH하면 I↔T 반복이 생기므로 금지한다.

브라우저 뒤로/앞으로는 기존entry를 그대로 POP하여 그 entry의 URL+snapshot을 복구한다. POP을 받는 effect가 선택을 다시 PUSH하거나 이력 배열을 파괴적으로 pop하지 않는다. 새 의미 선택/강사 단계/Scene 이동은 PUSH, 필터/모바일 탭/단순 표시 변경은 현재entry를 REPLACE한다. 명시적 새 탐색을 시작한 뒤에는 브라우저 정상 동작대로 forward 분기가 끝난다.

사전의 새 `B21LearningReturn`은 `/terms/`이면서 유효 `b21-map`인 경우만 표시한다. 기존 `B31LearningReturn`은 보존한다. B21 링크는 b31-map을 복사하지 않는다. 수동으로 둘 다 주어지면 기존 B31 표시를 우선하고 B21 banner는 숨겨 두 복귀 목적지가 경쟁하지 않게 한다. 임의 termURL을 지도 노드로 추측하지 않는다.

### 새로고침·직접 접근·오류·초점

- G/I/T 각 URL을 세션 없이 열어도 유효node/필터/모드/원래Scene으로 복구한다. 세션이 없으면 정확한 픽셀scroll은 복원할 수 없으며 section 제목으로 돌아간다. nodeHistory는 허용trail로 최대16개 복원한다.
- 없는 node는 선택을 지우고 영역탭+안내를 표시한다. 유효origin은 유지한다. 없는 relation/compare는 그 선택만 지운다. 없는 termId는 기존 사전 Empty를 보여주고 유효 B21 복귀는 남긴다. 유사 term으로 자동 대체하지 않는다.
- 오래된 section은 해당Scene 제목으로 복귀하며 '이전 읽기 위치를 찾지 못했습니다'라고 알린다. 잘못된 Scene은 Scene01로 복구한다. 외부 문자열로 DOM query selector를 직접 구성하지 않고 manifest의 안정ID를 조회한다.
- 새 장면/새 노드의 명시적 선택은 대상 제목을 우선한다. 기존 문맥 복귀는 DOM·폰트·그림 레이아웃 준비 후 anchor+저장offset을 복원한다(최대2초 대기 후 anchor 대안). viewport가 바뀌었으면 픽셀값보다 anchor를 우선한다. 패널과 페이지scroll은 따로 복원한다.
- 초점은 저장한 허용triggerID가 존재하면 그곳, 없으면 해당section/노드 제목(`tabIndex=-1`)으로 옮긴다. 렌더effect 반복이나 폰트 지연으로 초점을 다시 빼앗지 않는다. reduced-motion에서는 즉시 이동한다. dialog 복귀와 term 복귀도 각각 검사한다.

## 7. QA: 현재 검사와 추가 검사

이번 실행 결과는 준비 점검 §7에 기록했다. 아래 기존 명령은 현재 사용 가능하고, `b21-*` 신규 파일/validator는 **작성 예정**이다. 준비 단계의 모형3755검사를 실제 서비스 PASS로 세지 않는다.

### 현재 사용 가능한 명령

생성 스크립트가 운영 데이터를 다시 출력하므로 문서 점검에는 깨끗한 임시 사본을 쓰고, 구현 검사에는 검사 전후 diff를 확인한다.

```bash
npm ci
npm run build
npm test
npm run build:extension
npx playwright test --list
npx playwright test playwright/b2-1-learning-story.spec.ts playwright/b31-story-map.spec.ts playwright/mission-learning-entry.spec.ts
npx playwright test playwright/b2-1-guide.spec.ts
npx playwright test playwright/term-search.spec.ts playwright/technology-field-map.spec.ts playwright/map-immersive-workspace.spec.ts
npx playwright test playwright/mission-concept-map.spec.ts playwright/mission-concept-map-stability.spec.ts
```

브라우저가 설치되지 않은 환경은 `npx playwright install chromium` 후 표준 설정을 사용한다. Chrome은 별도 복사config의 `use.channel='chrome'`으로 실행할 수 있다. 포트는 `PLAYWRIGHT_PORT=4176`처럼 전용 지정하고 기존 서비스 재사용 여부를 검사한다. 현재 config는 dev server만 대상이다.

현재 Python 검증기 경로는 다음과 같다. 저장소 루트에서 실행한다. ledger를 확인할 때는 별도 저장소의 승인SHA와 `LEDGER_REPO`를 명시한다. 없으면 SKIP으로 보고하며 임시 데모 폴더를 쓰는 원래 검증 방식을 보존한다.

```bash
python3 -I drafts/b2-1-story-map/scene-02/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-03a/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-03b/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-04/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-05/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-06/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-07/_tools/verify_demo.py
python3 -I drafts/b2-1-story-map/scene-07/_tools/verify_ledger.py
python3 -I drafts/b2-1-story-map/scene-08/_tools/verify_candidate.py
```

Scene02/05의 F01/F02는 수정 승인 전의 기준 실패로 기록한다. Scene01은 기존 원고 내 코드 추출 검증을 재사용하며 별도 데모 검증기가 있다고 보고하지 않는다.

### 신규 자동화 명세(아직 없음)

| 제안 파일·명령 | 수용 조건 |
| --- | --- |
| `src/b21StoryContent.test.ts` | 9단위 순서·전원고/그림/강사/활동/질문/출처 존재, section 안정ID, 코드 복사 원문, AST 코드주석 분리, metadata 제외 범위·경고 보존, manifest hash |
| `src/b21ConceptMap/adapter.test.ts` + `python3 scripts/validate_b21_story_map.py` | 45/24/10/7/3, ID/끝점/방향/범위/Scene/term 존재,13고립 허용·추천의 비관계성, mutation으로 깨진ID/허위유형/누락warning 검출 |
| `src/b21StoryNavigation.test.ts` | allowlist·중복키·과대URL·잘못된 인코딩·없는ID/anchor·guided 불일치·trail/cursor·세션 실패·외부return 차단·B31 문맥 분리 |
| `playwright/b21-story-map.spec.ts` | 9단위 직접 진입/이전·다음(03-A→03-B,07→08 포함), raw hash 회귀, 강사/활동 표시, 예제 단계·복사, 그림 구역·확대·초점·자산404 없음 |
| `playwright/b21-concept-explorer.spec.ts` | 45노드/24관계/10비교 접근,7영역/3경로/자유 복원,13고립노드 전건 추천(360/390 터치 포함), 필터0 구별, 선택 이력 뒤로, 추천 라벨·관계 불변 |
| `playwright/b21-learning-return.spec.ts` | §6 S→G→I→T→I→G→S를 실제 서비스 링크로 검증. 매 단계 선택/이력/필터/모드/scroll/focus assert. goBack/goForward/reload/세션 없는 새context/직접term/깨진query |
| `playwright.b21-dist.config.ts`(신규 제안) | `npm run build` 후 `npx vite preview --host 127.0.0.1 --port 4177 --strictPort --base=/codyssey-mission-tech-glossary/`, baseURL은 `http://127.0.0.1:4177/codyssey-mission-tech-glossary/`. 같은하위경로에서 상대base·코드/그림URL·직접hash 새로고침 확인. spec은 선행 `/`로 하위경로를 지우지 않음. dev server 통과와 별도 |

구현 후 명령은 `npx vitest run src/b21StoryContent.test.ts src/b21ConceptMap/adapter.test.ts src/b21StoryNavigation.test.ts`, `python3 scripts/validate_b21_story_map.py`, `npx playwright test playwright/b21-story-map.spec.ts playwright/b21-concept-explorer.spec.ts playwright/b21-learning-return.spec.ts`다. 위 파일을 만들기 전에는 존재하는 검사로 보고하지 않는다.

### 브라우저·수동 수용 기준

- PC1280/1000, 모바일390/360에서 story9단위·지도·빈 상태·사전 복귀를 검사한다. viewport와 실제 그림 폭을 모두 기록한다. 모바일은 touch, PC는 키보드 검사를 포함한다.
- 기존4테마·light/dark·Pretendard/대체글꼴,200%글자 확대에서 본문·버튼·긴 그림·코드가 읽혀야 한다. 페이지 가로넘침은0, 코드 안 스크롤은 명시적으로 허용한다. 모든 조작은 키보드로 가능하고 보이는 초점·dialog 복귀·탭 역할을 검사한다.
- 스크린리더 수동 명세: Scene 제목/진행, 영역명, 관계 유형/방향/범위, 추천이 관계가 아님, 비교카드 양쪽, 단계 결과, 확장 사전 주의·복귀 목적지를 읽을 수 있어야 한다. VoiceOver+Safari 또는 NVDA+Chrome으로 실제 확인하며 DOM속성 검사만으로 PASS라 하지 않는다.
- 원고/그림/예제 출력의 동일성과 수업 시연 가능성은 수동 검토한다. 프로젝터/실물휴대폰·다른 교육생 코드·강의 효과는 별도 시범 운영이며 미확인 범위를 기록한다.

### 보호 대상 회귀

현재132unit검사 중 `missionLearning.test.ts`, `missionConceptMap/conceptMapAdapter.test.ts`, `publicWebLinks.test.ts`, `extension-handoff.test.ts`를 유지한다. extension-handoff 일부는 모델 단위 검사여서 실제 확장 동작을 완전히 증명하지 않는다. `build:extension` 및 수동 우클릭→검색/용어 상세/기술지도 연결을 별도로 확인한다.

B31은 `playwright/b31-story-map.spec.ts`의 기능4개와 폭/테마matrix, 기존 `mission-concept-map-{layout,lanes,palette,stability}.spec.ts` 및 기본map spec을 검사한다. 기존 B21가이드9장·미션16개 진입·사전 검색/상세·기술지도·preliminary-M03체험·HashRouter 직접 접근을 보존한다. 기존 B21story spec의 yield표현 기대는 승인된 새 모델에 맞게 교체하되, 테스트 삭제로 회귀를 숨기지 않고 리스트Iterator와 Generator 각각의 검사를 추가한다. 변경 없는 대상의 승인 기준 QA를 재사용할 때도 이번 영향 범위와 실제 재실행 수를 구분한다.

## 8. 독립 커밋 계획과 Owner Gate

| 순서·커밋 범위 | 완료 근거·다음 조건 |
| --- | --- |
| 0. 준비 문서(이번) | readiness/contract/handover만. 로컬 커밋. 구현/공개 승인이 아님 |
| 1. 별도 허용된 검증기 보완 | F01/F02 수정·실패 재현/해결·전체 데모 검사. 원고 변경이 필요하면 콘텐츠 담당 검토 |
| 2. 콘텐츠 loader/manifest/fixture | 승인 원고hash·AST·코드/그림 대조unit. 라우트 연결 없음 |
| 3. B21 adapter/validator | 후보 명시projection·13고립·R/C 의미/출처 검사. B31 불변 |
| 4. renderer/figure/접근성 | MemoryRouter에서9단위, 원문 복사·긴SVG 분할/확대. 파생 그림 Owner 검토 |
| 5. Scene01~04 상호작용 | 필수I목록·fixture 단계·상태 초기화. 보류 항목은 미구현 |
| 6. Scene05~07 + 기존 체험 수정 재사용 | Iterator/yield 구분·두 시점/3예외·힌트/검증·실행 출력 검사 |
| 7. Scene08 탐색기 | 승인PC/모바일·빈 상태·비교·강사/자유. 모형과 동등한QA |
| 8. navigation/return 내부 테스트 | 실제 컴포넌트의 S/G/I/T상태·POP/forward/reload/불량입력·scroll/focus. 새 공개route 미등록 |
| 9. Owner Gate 뒤 route/미션 진입 전환 | **공개주소 제안·원고 기준·문구·파생 시각 승인 명시 후** 기존story 주소를 보존하며 등록. 가이드/B31 보호diff 확인 |
| 10. 통합QA·검토 가능한PR 준비 | dev+dist·전체 동선·영향 회귀·접근성/시각 기록. 의존성 릴리스 평가. Owner의 PR검토·병합·공개 결정은 별도 |

유용한 I항목은 필수 항목 수용 뒤 독립 커밋으로 추가한다. 한 커밋이 이후의 미구현 파일에 의존해 build를 깨뜨리지 않도록 공개 등록을 마지막에 둔다. 모든 단계에서 보호 대상 diff와 기준 승인SHA 차이를 보고한다.

Owner 확인이 남은 항목은 전9단위 최종 콘텐츠/시각·게시 원고 커밋, 긴 그림 분할/표현, 기존 체험 재사용 범위·진입 문구, 별도 개념지도 공개URL/전환, 실제 서비스QA 결과·미검증 수용, 최종 공개다. Scene08 탐색형 승인만으로 이 항목을 대체하지 않는다. 공식 미션 문구·교육 효과 미검증도 그대로 기록한다.

이번에는 로컬 커밋까지만 한다. Push·병합·배포는 하지 않는다. Owner용 명령은 `git push origin content/b2-1-story-map-foundation` 이다.
