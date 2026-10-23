# B2-1 통합 준비 점검

2026-10-23 · **비공개 React 콘텐츠 기반 구현 / 공개 연결·최종 시각 승인 미완료**

초기 준비 점검 기준은 `358927d3414e231b81bf975bbf38bc1879cffd7f`였다. 작업 시작 시 브랜치 `content/b2-1-story-map-foundation`, HEAD와 `origin/content/b2-1-story-map-foundation`이 이 커밋으로 같았고 작업 트리는 깨끗했다. `git fetch origin` 후 ahead/behind는 0/0이었다. 그 준비 단계의 변경은 이 문서, [통합 계약](integration-contract.md), [인수인계](handover.md)뿐이었다. 당시 발견한 오류는 기록만 했다. 이후 검증기 복구와 이번 비공개 구현은 아래 최신 기록으로 구분한다.

## Integration Sprint 02 — React Content Foundation (최신)

시작 HEAD는 `66cfb7d7c499a64bc27240e6cb492592b3293649`, 브랜치는 `content/b2-1-story-map-foundation`이다. 시작 작업 트리는 깨끗했고 fetch 후 원격과0/0이었다. 아래 §1~9는 최초 준비 점검 및 Sprint01 기록이며, 이번 구현 범위와 검사 수치는 이 절을 우선한다. **공개 `/missions/main-M03/story`와 진입 카드는 변경하지 않았다.**

### 구현 파일과 데이터 흐름

| 신규 경로 | 역할 |
| --- | --- |
| `src/b21Story/content/storyTypes.ts` | 명시적9단위 순서·영역·코드/출력·자산·전체 로딩 결과 타입. 후속 fixture/그림 segment 타입 포함 |
| `content/storyIntegrity.json`(위 디렉터리) | 원고9개/SVG16개의 SHA-256·자산 치수/설명·138개 안정section ID·로컬 참조. 생성된 metadata이며 본문 복제본이 아님 |
| `content/storyManifest.ts` | 고정 descriptor·중복ID/순서 검사·이전/다음 데이터 |
| `content/parseStory.ts` | unified/remark AST 분석,4영역·질문·활동·출처·코드/주석/표/목록 구분·원문 위치 보존 |
| `content/storyLoader.ts` | Vite raw/URL literal glob, SHA 대조, `loadStory()`/`loadStoryManifest()`로 본문까지 결합한 전체 Manifest 반환 |
| `content/storyContent.test.ts` | 23개 구조/누락/무결성/코드·메타데이터 검사 |
| `src/b21Story/B21StoryFoundation.tsx` | 라우터에 등록하지 않은 진입 컴포넌트·9장면 선택·이전/다음·loading/error. 기본 로더와 검사용 주입 지점 |
| `components/StoryScene.tsx`, `StoryMarkdown.tsx`(같은 b21Story 아래) | 제목/질문/진행·학습자·활동·강사·질문·출처 렌더링. Scene 간 이동은 컴포넌트 콜백, 보조 원문 링크는 기준SHA의GitHub 파일 |
| `components/StoryCodeBlock.tsx` | 코드/명령/데이터/실행 출력/일반 텍스트 구분·원문 복사·실패 시 선택 |
| `components/StoryFigure.tsx` | 실제 그림 영역 ResizeObserver·PC/모바일 선택·원본 전체 그림·확대·Tab/Escape/초점 복귀 |
| `components/StoryInstructorNotes.tsx`, `StoryCheckQuestions.tsx` | 강사용 native details와 이해 확인 영역 |
| `components/storyRenderer.test.tsx`, `b21Story.css` | React SSR/복사/그림 선택21검사·기존 테마 변수에 맞춘 국소 스타일 |
| `scripts/b21_story_integrity.mjs` | 기본은 검증만 수행. 명시적 갱신 때만 Git 원고기준과 대조해 Manifest 생성 |
| `scripts/check_b21_foundation_build.mjs` | 비공개 Vite 라이브러리 빌드·실제glob chunk 로딩·emitted SVG 동일성·전Scene React SSR |
| `scripts/check_b21_foundation_browser.mjs` | HTTP서버/앱route 없는 about:blank 컴포넌트 검사. 검증된 원고fixture·원본SVG data URL·모의clipboard 사용 |

수정한 기존 파일은 `package.json`, `package-lock.json`, 이 문서와 `handover.md`뿐이다. src15개·scripts3개가 신규다. 본문은 Markdown의 원래 AST 노드와 위치를 유지하며 TS 문자열로 복제하지 않는다. 표 셀의 GFM 이스케이프와 영역 밖 참조 정의도 원래 문맥으로 렌더링한다. `storyManifest`는 고정 descriptor, `loadStoryManifest()`의9개 결과는 제목/질문/본문4영역/활동/이웃/상태/출처/자산이 결합된 실제 데이터다. `scene-03a → scene-03b`, `scene-07 → scene-08`을 별도 순서로 유지한다. 학습 질문·범위·도달기준은 원고 표에서 가져온다.

직접 import한 `unified@11.0.5`, `remark-parse@11.0.0`, 개발 타입 `@types/mdast@4.0.4`를 명시적으로 선언했다. 이미 잠금파일에 있던 전이 의존성을 직접 선언한 것으로 **기존 패키지 해석 버전 변경은0개**다. 기존 GFM/ReactMarkdown을 활용했다. 관련 없는 업데이트와 F10 패치는 하지 않았다.

### 표시·복사·그림 계약의 현재 구현

- 원고4영역은 AST heading으로 구분한다. 표 셀을 따로 다시 파싱하면 `int | str`에 불필요한 역슬래시가 표시되는 문제를 회귀 검사에서 재현하고 원래 AST 보존으로 해결했다. Python의 `#`은 코드로 유지한다. 제작 상태/요구 추적 등은 provenance로 보관하고 학습자의 범위·활동·주의(미검증 포함)는 원문대로 남긴다. 출처 영역은 비어 있지 않아도 인용이 없으면 실패한다.
- 코드본문은 source offset으로 추출하여 들여쓰기·마지막 개행·빈 줄·CRLF를 유지한다. 복사는 코드본문만 전달한다. `demo/file` 원본 표시가 없는 Python조각은 문맥 확인 안내를 붙인다. 폴더 트리·활동 양식을 실행 출력으로 표시하지 않는다. 웹Python/사용자 파일 업로드/실행 결과 생성은 없다. fixture는 source hash/block ID를 연결할 타입만 준비했다.
- 정적 SVG는 `<img>`의 독립 문서로 ID/style을 격리한다. 선택 기준은 viewport가 아닌 그림 슬롯≥960px이다. 원본 글자보다 작아지지 않도록 PC1280/모바일360px을 최소 그림 폭으로 두고 내부 스크롤한다. 모바일 표시는 최대420px, 확대는 비율을 유지한다. 그림 설명·원본 내려받기·확대 대화상자·키보드 초점 순환/복귀가 있다.
- **A/B/C/D 분할은 없다.** 현재자산은 `whole-source-only`, segment 값은 없고 후속 검토용 viewBox/source hash 타입만 있다. 원본16개는 그대로다. 이 정적 격리 방식에서 SVG 요소 제어가 필요한 단계는 후속 검토한다.
- Scene08은 원고/질문/F·G·H활동, `candidate-map.json`의 정확한 참조와 typed slot만 제공한다. 45/24/10 데이터 이식·탐색·비교·관계0추천은 미구현이다. HTML iframe·B31canvas는 사용하지 않는다.

### 실행한 검사

macOS·Node24.22.0/npm11.19.1·기존Chrome 환경. 전체 빌드/회귀/실패 주입은 외부 사본을 사용했고 단위 검사 일부는 기본 작업 트리에서도 실행했다. 기존 데이터 생성 명령의 실행 뒤에도 보호 파일의 내용은 동일하다. 수정 허용된 package/보고서4파일을 제외한 시작 커밋의 추적파일2519개 Git blob hash가 같다. 원고 기술내용의 실행 근거는 Sprint01 기준선을 재사용하며 이번에 Python 검증기 전체를 재실행했다고 주장하지 않는다.

| 검사 | PASS | FAIL | SKIP | 범위 |
| --- | ---: | ---: | ---: | --- |
| `npm run b21:validate` | 1그룹 | 0 | 0 | 9원고/16SVG SHA·영역·활동·출처·로컬파일 참조·순서 |
| `npm run build` | 1그룹 | 0 | 0 | 위검증+기존data/tsc/main번들+별도비공개빌드. 기존 큰chunk 경고는 유지 |
| 비공개 Vite 빌드(위build에 포함) | 1그룹 | 0 | 0 | 9Scene 실제chunk 로딩·16emitted SVG byte동일·155 fenced블록·전Scene React SSR |
| `npm test` | 176 | 0 | 0 | 16파일. 기존132+신규44(콘텐츠23/렌더러21). 중복실행을 합산하지 않음 |
| 비공개 Chrome 컴포넌트 | 63assert | 0 | 0 | 9Scene·4폭의 실제slot·copy/실패선택·notes·zoom/Tab/Escape/focus·200%텍스트·HTTP요청0 |
| 기존웹 Playwright | 13 | 0 | 0 | 기존B21 story6, B31 기능4, 전체미션 진입3. 폭/테마 전체matrix는 아님 |
| 외부 사본 무결성 실패 주입 | 8검출 | 0미검출 | 0 | 원고/SVG 바이트변경·필수영역/SVG/이미지/인용 누락·중복section ID·추가Scene |

코드/정합/기능검사는 PASS이며 최종 콘텐츠·시각 승인이 아니다. 외부 HTTP 링크는 구문과 프로토콜을 검사했고, 로컬 참조 파일은 실제 존재를 검사했다. 모든 외부 사이트의 응답/문서 내용은 이번에 재검증하지 않았다. 비공개 브라우저는 fixture 로더와 모의clipboard로 경계를 통제했다. 실제OS clipboard권한, 배포HTTP환경의 새로더·새URL왕복, 실물휴대폰/전체테마·폰트/스크린리더·Owner시각은 미검증이다.

```bash
npm run b21:validate
npm run build
npm test
B21_BROWSER_CHANNEL=chrome npm run b21:browser-check
```

Manifest 갱신은 자동 승인하지 않는다. 승인된 원고 변경을 반영할 때만 `node scripts/b21_story_integrity.mjs --write --source-revision=<원고의40자리SHA>`를 사용한다. 갱신 시25파일을 해당 Git revision과 직접 대조하며, 일반검사는 Git 과거 이력이나 네트워크를 요구하지 않아 shallow CI에서도 실행된다. section ID/출처/원고diff를 함께 검토해야 한다. Manifest 생성은 콘텐츠·시각·공개 승인을 대신하지 않는다.

### 다음 단계 판정

**비공개 콘텐츠 기반 수용 조건 충족. 다음 구현 스프린트 진입 가능.** 다음 지시에서 Scene I1~In, B21지도 어댑터/탐색기, 그림 분할, 실제용어사전/왕복/상태계약의 범위를 확정한다. 새 공개URL/기존story전환과 최종시각·게시 승인은 Owner Gate로 남는다. F03/F05/F06/F08/F09/F10의 남은 범위를 이 결과로 해결 처리하지 않는다.

## 1. 판단 기준과 승인 범위

[AGENTS](../../AGENTS.md), [운영 정책](../../docs/mission-guides/learning-operation-policy.md), [제작·검토 절차](../../docs/mission-guides/workflow.md), [거버넌스](../../docs/knowledge-encyclopedia/06-agent-governance-model.md)를 적용했다. 대면 강의는 이 교육 모델의 운영 선택이며 코디세이 공식 출석 규정으로 설명하지 않는다. 스토리는 흐름, 지도는 미션 내 의미 관계, 사전은 확장, 기존 가이드는 실행을 맡는다.

- Owner의 2026-10-23 결정: Scene 08 **현재 탐색형** 유지. PC 영역 → 관련 관계 → 상세 → 비교, 모바일 영역/관계/상세/비교. 전체 연결선 그래프로 바꾸지 않는다.
- Scene 08 독립 콘텐츠·개념 관계 PASS는 앞선 Owner 지시로 전달받았다. `358927d`의 관계 0개 노드 보완도 유지한다. 이는 전체 Scene의 최종 시각 승인·공개 승인이 아니다.
- Scene 07 독립 콘텐츠 PASS는 기존 인수인계의 전달 기록을 재사용한다. 다른 Scene의 제작 당시 자체 PASS를 새로운 독립 검토 완료로 승격하지 않는다.
- 아래 PASS는 **명시한 검사 범위만** 뜻한다. 미검증은 실패와 구분한다. 현재 웹의 빌드 성공은 신규 9단위 통합의 성공이 아니다.

## 2. 자산 전수 인벤토리

실제 폴더는 `scene-01`, `02`, `03a`, `03b`, `04`, `05`, `06`, `07`, `08`의 **9단위**다. 모두 `script.md`, `design-notes.md`, `visual-qa.md`가 있다. 앞의 8단위는 SVG 2개와 PNG 4개씩, Scene 08은 반응형 HTML 1개와 PNG 14개다. 합계 SVG 16개, PNG 46개. 아래 비율은 **원본 높이/너비**이며 미리보기 캔버스 비율과 다르다.

| 단위·실제 원본(접미사 `-desktop.svg`, `-mobile.svg`) | PC px · 비율 | 모바일 px · 비율 | 그림 구역·표시 전략 |
| --- | --- | --- | --- |
| [01](scene-01/script.md) · `cli-command` | 1280×1672 · 1.306 | 360×3292 · 9.144 | A 명령 분해 / B 단계 / C 규칙·결과 / D 비교; 모바일 I8 접기 |
| [02](scene-02/script.md) · `package-flow` | 1280×2290 · 1.789 | 360×4130 · 11.472 | A 패키지·시작점 / B import·호출 지도; 탭 |
| [03-A](scene-03a/script.md) · `class-layer` | 1280×2314 · 1.808 | 360×4694 · 13.039 | A 함수·클래스 / B 책임·호출; 탭 |
| [03-B](scene-03b/script.md) · `crud-flow` | 1280×3984 · 3.113 | 360×6780 · 18.833 | A CRUD·검색·요약 / B 처리 책임; 탭 + 동작·경우 선택 |
| [04](scene-04/script.md) · `file-persistence` | 1280×4052 · 3.166 | 360×6490 · 18.028 | A 메모리·파일 / B 형식 / C 읽기·쓰기(C-1/C-2); 탭·하위 전환 |
| [05](scene-05/script.md) · `generator-stream` | 1280×3142 · 2.455 | 360×5622 · 15.617 | A 반복 객체 / B Generator / C 스트리밍 / D 소비 방식; 탭 |
| [06](scene-06/script.md) · `decorator-flow` | 1280×2754 · 2.152 | 360×5590 · 15.528 | A 중복·분리 / B 두 시점 / C 예외 / D 관심사; 탭 |
| [07](scene-07/script.md) · `type-hint-flow` | 1280×4348 · 3.397 | 360×7992 · 22.200 | A 인자 연결 / B 힌트 / C 입력 단계 / D 선언·검증; 탭 |
| [08](scene-08/script.md) · [HTML](scene-08/concept-map-preview.html) | 고정 SVG 없음 | 고정 SVG 없음 | 승인된 탐색형을 React로 이식; HTML iframe 게시 금지 |

각 원본은 해당 `scene-*/` 바로 아래에 있다. XML의 width/height/viewBox와 PNG 헤더로 측정했다. SVG 최소 글자는 PC 16, 모바일 14 원본 단위다. 실제 컨테이너 960px에서 PC의 16은 12px, 모바일 328px에서는 14가 약 12.8px, 358px에서는 약 13.9px다. 따라서 viewport가 1000이라고 PC 그림을 무조건 선택하지 않는다. 슬롯 폭으로 판단한다. 작은 글자를 한 화면에 억지로 축소하는 방식은 채택하지 않는다.

PNG 파일은 각 `preview/`에 있다. 앞 8단위의 실제 캔버스 폭별 높이는 다음과 같다. 360/390 이미지에는 여백이 있어 원본 SVG의 폭 360과 혼동하면 안 된다.

| 단위 | 1280px | 1000px | 390px | 360px |
| --- | ---: | ---: | ---: | ---: |
| 01 | 1672 | 1306 | 3274 | 2999 |
| 02 | 2290 | 1789 | 4107 | 3763 |
| 03-A | 2314 | 1808 | 4668 | 4277 |
| 03-B | 3984 | 3113 | 6742 | 6177 |
| 04 | 4052 | 3166 | 6454 | 5913 |
| 05 | 3142 | 2455 | 5591 | 5122 |
| 06 | 2754 | 2152 | 5559 | 5093 |
| 07 | 4348 | 3397 | 7948 | 7282 |

Scene 08 PNG: overview는 1280×1725, 1000×1858, 390×1610, 360×1632; Generator는 1280×1899, 1000×2032, 390×1380, 360×1403; 390 detail은 390×1962; comparison은 1280×1899·390×1303; CLI empty는 1280×1992·390×1524·360×1572. 총14장이다. 이미지의 존재·치수 확인은 실기기나 최종 React 통합의 시각 승인을 뜻하지 않는다.

**분할 구현 주의:** SVG에는 `data-token`, `data-op`, `data-case` 등 세부 `<g>` 그룹이 있다. 그러나 16개에 공통으로 적용할 수 있는 A/B/C/D 그림 단위 경계·선택자 계약은 없다. 세부 그룹을 숨기기만 하면 탭이 된다는 전제는 틀리다. 승인 원본을 보존하고, 그림별 viewBox와 필요한 defs/marker를 지정하는 파생 manifest를 만들어 글자·선·화살표 잘림을 대조해야 한다. 구체적인 계약은 통합 계약 §3에 둔다.

## 3. 학습 활동·실행 근거·판정

모든 원고에 학습자 활동, 강사용 설명, 이해 확인, 출처가 있다. 아래 절 번호는 각 원고를 참조한다. 각 `visual-qa.md`는 제작 당시 근거로 재사용하며 새로운 승인과 혼동하지 않는다.

| 단위 | 학습자 활동 / 강사·이해 확인 | 실행 자료·이번 확인 | 판정과 남은 경계 |
| --- | --- | --- | --- |
| 01 | §9 명령 분해·해석 주체·내 코드 / 강사용 안내·6문항 | 원고 내 todo 시연 코드. 독립 `verify_demo.py` 없음. 기존 QA의 코드 추출 실행·SVG 검사를 재사용 | **PASS(자산·구조)**. 현재 환경에서 원고 내 시연 재실행은 미검증. I7 ledger 전체 그림 미제작 |
| 02 | §10 시작 파일·import와 호출을 따로 추적 / 강사용 안내·6문항 | `_tools/demo/` 6코드와 `verify_demo.py`. 이번28 PASS·1 FAIL | **수정 필요(검증기)**. 실행 파일 접두사 차이이며 내용 오류로 단정하지 않음. Python 버전별 문구·서비스 UI 미검증 |
| 03-A | §9 함수·클래스·생성·책임·호출/return / 강사용 안내·6문항 | `_tools/demo/`, AST·호출 대조 `verify_demo.py` 이번33 PASS | **PASS(실행·정적 대조)**. 다른 학습자 구조 적용·최종 웹·시각 미검증 |
| 03-B | §10 ID·검색/집계·기능 책임·저장 여부 / 강사용 안내·6문항 | `crud_basics.py`, `search_summary.py`, `cashbook/`. 이번79 PASS | **PASS(실행·대조)**. 사용자 입력 UI는 보류. 실제 학습자 코드 활동의 유효성 미검증 |
| 04 | §11 저장 경로·형식·다시 쓰기·안전의7질문 / 강사용 안내·7문항 | JSON/JSONL/CSV, `file_crud.py` 등. 이번136 PASS | **PASS(이번 환경 실행)**. Windows 개행 조건·전원 차단/동시 쓰기·실제 FS 원자성 미검증 |
| 05 | §10 Iterable/Iterator/Generator·소비/보관·파일 수명 / 강사용 안내·8문항 | 7데모+2데이터, `verify_demo.py` 이번61 PASS 후 중단 | **수정 필요(검증기)**. 나머지 재검증 미완료. 제작 당시 QA와 범위를 구분 |
| 06 | §10 함수 값·적용/호출·관심사·전파 / 강사용 안내·9문항 | 11데모, `verify_demo.py` 이번91 PASS | **PASS(이번 환경 실행)**. 실행 시간 수치·다른 Python 구현·최종 웹·시각 미검증 |
| 07 | §10 Parameter/Argument·계약/변환/값 검사 / 강사용 안내·9문항 | 9데모 `verify_demo.py` 이번215 PASS, `verify_ledger.py` PASS | **PASS(실행·기존 독립 콘텐츠)**. 구버전 Python 선택 검사·실제 IDE 경고·학습 효과 미검증 |
| 08 | F 내 코드3노드/2관계/1비교, G AI결과 판단, H 자기 설명 / P1~P3·이해 확인 | 후보45/24/10·오류 주입14건 검출 PASS. 기존 모형QA3755 PASS 재사용 | **PASS(전달된 독립 콘텐츠·승인 UX)**. 실제 서비스 왕복·history 미구현. 공개 시 상태 문구 정리 필요 |

이는 교육 모델 적합성·구현 준비 점검이며 모든 행의 새 독립 콘텐츠 승인·최종 시각 승인이 아니다. 전9단위의 '내 코드에서 찾아보기'를 보존한다. 클래스 없음·argparse 없음·단일 파일·JSON 저장·미완성 구조도 수용하며 정해진 패키지 구조를 강요하지 않는다. AI 결과는 학습자가 근거로 유지/수정/삭제/미확인으로 판단한다.

## 4. Scene 순서와 구현할 I1~In

순서는 **01 → 02 → 03-A → 03-B → 04 → 05 → 06 → 07 → 08**. 끝에서는 가상의 Scene09로 가지 않고 원래 Scene/기존 가이드/자기 설명으로 연결한다. '필수'는 초기 구현 수용 조건, '유용'은 후속 독립 커밋, '보류'는 이 통합에서 만들지 않을 항목이다. 근거는 각 `design-notes.md`의 I 표다.

| 단위 | 이전→현재→다음 질문 | 필수 | 유용·조건부 | 보류 |
| --- | --- | --- | --- | --- |
| 01 | 입력 → 누가 해석할까 → 02 어디서 시작할까 | I1토큰, I2주체, I3수동 단계, I4고정 입력, I5 `-h` 위치, I6규칙/결과, I8모바일 접기 | I7 ledger 전환은 대응표·그림 추가 승인 후 | 임의 입력 실행 |
| 02 | 01 → 시작/import/호출 → 03-A 책임 분담 | I1 A/B, I2①~⑧, I3 import/호출/둘 다 | I4파일 선택, I5실행 방식5종 | I6편집기 정의 점프 |
| 03-A | 02 → 함수/클래스/책임 → 03-B 기능과 데이터 | I1 A/B, I2문법 부분, I4호출/return | I3객체 상태, I5의존/호출 겹쳐 보기 | I6자기 코드 표 업로드 |
| 03-B | 03-A → CRUD/ID/검색/집계 → 04 종료 뒤 남을까 | I1 A/B, I2전후, I3고정 검색, I5처리/실패/return, I6초기화 | I4집계에 쓰인 행 | I7이용자 데이터 추가/수정 |
| 04 | 03-B → 파일 저장/형식 → 05 10만 건 읽기 | I1 A/B/C, I2메모리/파일6단계, I3형식, I4다음 줄, I6저장 전후 | I5고정 쓰기 모드 결과 | I7실제 파일 저장. I4에 Generator/yield 선행 도입 금지 |
| 05 | 04 → 꺼낸 양/보관량 → 06 반복 처리 | I1 A~D, I2독립Iterator, I3Generator 단계, I4한 줄 스트리밍, I5소비5방식 | I6파일 열림/닫힘 | I7자유 코드/성능 실험. 리스트Iterator에 yield 멈춤 표시 금지 |
| 06 | 05 → 함수를 감싸는 두 시점 → 07 약속은 검사일까 | I1 A~D, I3정의/호출 시점, I4정상/처리/전파 | I2반복/분리, I5관심사, I6수정된 ledger 체험 | I7자유 실행/시간 측정 |
| 07 | 06 → 인자/타입/값 검사 → 08 내 코드 관계 설명 | I1 A~D, I2호출4예, I4 `10/abc/-2` | I3힌트 전환(결과 불변), I5값6예, I6기존 체험 제한 재사용 | I7브라우저Python |
| 08 | 07 → 의미 관계/비교/내 코드 → 원래 Scene·기존 가이드 | I1~I6 승인 탐색+빈 상태, I7실제 왕복, I8원고 활동 제시 | 강사/자유 양쪽 복원 | 자동 코드 분석·업로드 |

## 5. 장면에서 복습할 지도·사전 대응

후보의 노드/의미를 재작성하지 않는다. 아래 '관계'는 **양 끝이 해당 Scene의 후보 노드 집합에 있는 기존 관계**, '비교'는 candidate의 `sceneIds`에 기록된 카드다. 설명 순서를 관계선으로 바꾸지 않는다. 빈칸도 유효하다. Scene08은 전체 탐색·자기 코드 활동을 맡는다. 후보의 원고 참조 `scenes`에08이 없는 것은 원래 설명 Scene이01~07이기 때문이다.

| Scene | 후보 노드ID | 관계ID | 비교ID |
| --- | --- | --- | --- |
| 01 | `cli, python-m, argparse, command-arguments` | R08 | 없음 |
| 02 | `python-m, package, module, package-init, package-main, entry, ledger-main, ledger-cli-module, ledger-services-module, import, function-call, module-dependency, call-flow` | R04,R09,R10,R12,R13,R14,R15 | C06,C07,C08 |
| 03-A | `function-call, object-init, cli-layer, service, repository, return, module-dependency, call-flow` | R17,R18 | C06,C08 |
| 03-B | `cli-layer, service, crud, memory, id, index` | R17 | C20,C21 |
| 04 | `repository, memory, persistence, file-io, jsonl, text-format` | R19,R20,R37 | C21,C30 |
| 05 | `jsonl, iterable, iterator, generator, yield, for, list-collect, return` | R22,R23,R24,R25,R41,R44 | C11,C12,C30 |
| 06 | `decorator, wrapper, original, cross-cutting, exceptions` | R26,R27,R47 | 없음 |
| 07 | `argparse, exceptions, parameter, argument, type-hint, contract, validation` | R28,R29 | C13,C16 |
| 08 | 위45노드 중 자기 코드3개 개념 선택 | 의미에 맞는 기존24관계 중 선택 | 승인된10카드 |

[개념도 개요](concept-map-outline.md)의49관계/35비교는 후보24/10보다 넓다. 예를 들어01 C01~C04, 03-B R30~R33/C19, 04 R34~R36/C22~C24, 05 R42~R46/C26~C29, 06 C15/C31~C33, 07 R49/C34/C35는 **초기 후보 데이터에 없다**. 원고에서 배우고 해당 Scene으로 복귀할 수 있지만 존재하는 카드/관계처럼 링크하지 않는다. 추가 채택은 별도 콘텐츠 검토·승인 단위다.

### 현재 후보에서 연결 가능한 사전

`content/terms/<termId>.md` 존재를 이번에 확인했다. 링크가 있는 노드19개, 고유ID17개다. `direct/extension/none`과 서비스 연결 구현 여부는 별개다. 현재 candidate의 `routeStatus`는 미구현이다.

| Scene·노드 | direct | extension(범위 주의를 먼저 표시) |
| --- | --- | --- |
| 01 `cli` | `cli` | — |
| 02 `function-call`, `module` | `function` | `module`: JS 중심 설명 |
| 03-A `object-init`, `cli-layer/service`, `repository` | `init`, `layered-architecture`, `repository-pattern` | — |
| 03-B `crud` | `crud` | — |
| 04 `persistence/file-io/jsonl` | `persistence`, `file-io` | `json-lines`: 형식 자체가 메모리 절약을 보장하지 않음 |
| 05 `generator/yield/iterator` | `generator`, `yield` | `iterator`: 보관량은 소비 쪽에도 의존 |
| 06 `original/exceptions/decorator` | `function`, `exception-handling` | `decorator`: 적용 시점·wrapper 구분 |
| 07 `type-hint/validation` | `type-hint`(annotation과 `#`주석 구별) | `input-validation`: M03 API 문맥을 일반화하지 않음 |

다른 후보 노드는 `none`을 유지한다. 비슷한 문자열의ID로 추정 연결하지 않는다. `package-init`→`init`, `package-main`→`main-py`, 하위 명령→Git의 `commit-subcommand` 연결은 금지한다.

원고/개요의 추가 사전 후보 중 존재 확인된ID: 01 `python-cli`; 03-A `class`; 03-B `list-dict/filter/summary-aggregation/primary-key`; 04 `json/serialization/csv/context-manager/directory/absolute-relative-path/encoding/utf-8/temporary-file-replace-strategy`; 05 `deque/streaming/context-manager`; 06 `logging`. **후보 지도 연결 승인과는 다르다.** `filter/summary-aggregation/primary-key/temporary-file-replace-strategy/streaming/logging`은 확장, CSV는 인용 안 줄바꿈 주의, primary-key는 DB 확장으로 다룬다. 추가 링크 구현 전에 설명 범위를 다시 대조한다. 근거는 [개요](concept-map-outline.md) §6이며 canonical은 이번에 수정하지 않는다.

## 6. 기존 세 체험 재사용 판단

근거는 [현재 서비스](../../src/B21LearningStoryView.tsx)와 각 Scene 설계의 기존 체험 평가다.

| 대상 | 네 선택지 중 판단 | 이동 위치·조건 |
| --- | --- | --- |
| IteratorEpisode | **수정 후 재사용** | Scene05 I2의 독립 카운터·초기화 구조. 현재 리스트 모델의 `yield 일시정지`와 Generator식 출력은 잘못된 일반화를 유발하므로 가져오지 않는다. 실제Generator I3/I4는 새 자료로 구현 |
| DecoratorEpisode | **수정 후 재사용** | Scene06 §9 ledger 사례/I6. 정상→0·LedgerError→1을 사례로 유지하고 처리 범위 밖 예외 전파를 추가. 적용=정의/import, wrapper호출=매 실행을 먼저 구별. 일반 예시A~D를 대체하지 않음 |
| TypeHintEpisode | **수정 후 재사용** | Scene07 §9 list_transactions 사례(+§6 세 주체)에 한정. 인자 연결/입력 검사 전체를 대체하지 않음. 소스 조각은 승인 자료에서 생성하여 이중 관리 해소 |
| 기존 세 체험 페이지 전체 구성 | **기존 파일 보존 후 화면에서는 미노출**(후속 구현·승인 뒤) | 이번에는 미노출 처리하지 않는다. 신규9단위 수용 조건 충족 전까지 기존 공개 페이지 유지. 파일 삭제를 전제하지 않음 |

현재 `TermLinks`에는 B2-1 복귀 문맥이 없다. 체험을 재사용해도 샘플 패널 왕복으로 끝내지 않고 새 계약의 링크를 연결해야 한다.

## 7. 초기 준비 단계 QA 기준선 (이전 기록)

생성물을 보호하기 위해 기준 커밋을 `git archive`로 저장소 밖 임시 사본에 펼쳐 실행했다. 검사 전용 Playwright 설정/진단spec·의존성·생성물은 사본에만 있다. 원래 저장소의 생성 데이터는 업데이트하지 않았다. 환경은 macOS, CPython3.12.13, 로컬Chrome. lock 해석 버전은 React19.2.8, Router7.18.3, Vite6.4.3, Vitest3.2.7, Playwright1.63.0이다.

| 실행 | 결과 | 입증 범위·한계 |
| --- | --- | --- |
| `npm ci` | PASS(213 packages) | lock 기준 설치. audit는 별도 |
| `npm run build` | PASS, 520 modules | 현재 서비스 타입·데이터 검사·번들. 새B21 원고는 import되지 않아 대상 밖. 기존 큰chunk 경고 |
| `npm test` | **14 files / 132 tests PASS** | 현재 데이터·missionLearning·publicWebLinks·확장handoff 등. 신규9단위 테스트가 아님 |
| `npx playwright test --list` | 20 files / 207 tests 열거 | 207개 전체 실행이 아님 |
| 기존B21 story+B31story-map+mission-learning-entry, `--grep-invert 'px' --workers=1` | **13 tests PASS** | 기존3체험/테마, B31실제 왕복·그림 확대, 전체16미션 진입. 폭matrix 전체 실행은 아님 |
| `b2-1-guide.spec.ts --grep '360:|390:|entry, mobile navigation'` | **3 tests PASS** | 360/390 전9장·SVG·탐색, 관련 용어/문서/테마. 신규 스토리와 별개 |
| 임시 기존hash링크 진단spec | 1관측 테스트PASS, **결함 재현** | `#iterator-generator` 클릭 뒤 경로가 바뀌고 episode0개. 앱 정상PASS를 뜻하지 않음 |
| `npm run build:extension` | PASS | MV3/우클릭/생성 사전·공개deep-link 빌드assert. 실제Chrome 확장 조작은 미검증 |
| Python Scene02/03a/03b/04/05/06/07/08 +07 ledger | §3 결과 | Scene02/05 실패·중단을 포함. 전체PASS 아님. ledger 사례는 로컬 `d14e812` 참조 |
| Scene08 기존 `preview/qa-results.json` | 3755 PASS **재사용** | 1280/1000/390/360·2글꼴·13고립노드·터치/이력. 로컬HTML 모형만. 이번 브라우저 실행 수에 합산하지 않음 |
| 전Scene md 상대 파일 링크·자산 존재 | 누락0 | fragment 의미·외부URL 전건 생존 검사는 아님. R참조fragment 문제는 다음 절 |

Playwright는 사본 설정에서 `use.channel='chrome'`, port4176, `reuseExistingServer:false`로 실행했다. 기본 [설정](../../playwright.config.ts)은 Vite개발 서버이므로 **production dist 직접 검증이 아니다**. 본문·코드·이미지의 최종 통합 시각QA, 신규9단위 서비스 테스트, 실제 스크린리더 검사는 아직 없다.

## 8. 발견 사항·미검증·Blocker

| ID | 근거·영향 | 필요한 대응·단계 |
| --- | --- | --- |
| F01 | **해결 — Integration Sprint01, 2026-10-23.** 시작 `56d668b`에서 28 PASS/1 FAIL/0 SKIP·종료1 재현. 원인은 Python 실행 파일 절대 경로 접두사 차이 | 줄 시작의 Python 경로 접두사만 정규화하고 본문·종료 코드의 기존 대조를 유지. 수정 후 **43 PASS/0 FAIL/0 SKIP·종료0**. 본문/종료 코드·SVG import·원고 코드 위반4건 모두 검출. [Scene02 이번 QA](scene-02/visual-qa.md) 참조. 실제 다른 OS/Python 버전 검증은 별도 |
| F02 | **해결 — Integration Sprint01, 2026-10-23.** 시작 `56d668b`에서61 PASS 후 OSError→IndexError 중단 재현 | ORDER를 임시 `.py`에서 실행. 종료 코드/stdout/stderr·마커/JSON/타입을 검사하고 전체 거래의 실제 순서를 대조. **121 PASS/0 FAIL/0 SKIP·종료0**, 메모리/소비5방식/ledger/정리까지 수행. 순서 변경 포함10개 변형 검출. [Scene05 이번 QA](scene-05/visual-qa.md). 제작 당시·§3/§7 수치는 이전 실행 기록이며 이번 수치와 합산하지 않음 |
| F03 | 기존 [B21LearningStoryView](../../src/B21LearningStoryView.tsx)의 `<a href="#iterator-generator">` 등이 HashRouter 바깥hash를 바꿈. 브라우저에서 `/#iterator-generator`, episode0 확인 | **전환 시 수정 필요**. 새 링크는 Router API+scene/section query. 이번에 서비스 수정하지 않음. 기존 테스트는 이nav 클릭을 잡지 않았음 |
| F04 | 기존 리스트Iterator의yield멈춤 문구가 Scene05 I2와 충돌. Decorator의 두 시점·범위 밖 전파 부족 | 재사용 시 필수 수정. 기존 체험 무검토 복사 금지 |
| F05 | Scene08 원고/설계/QA 첫머리는 독립 검토 전 상태, 원고E에 실제 서비스 미구현이라는 제작 시점 문구. QA본문811건과 최신JSON3755건의 시점 차이 | 이 문서·handover에 최신 사실 구분. 공개 전에 Owner 승인된 상태/학습자 표시 대응 필요. 미구현 문구를 임의로 실구현 설명으로 읽지 않음 |
| F06 | candidate `outlineRef: ...#R23` 등에 맞는 명시anchor가 개요에 없음 | 참조ID로 보존. 출처 레지스트리에서 해당 표 행을 해석하거나 별도 승인으로 안정anchor 제공. 해결 전 깨진href를 내보내지 않음 |
| F07 | 개요§4의 '같은 노드 쌍에 관계와 비교를 겹쳐 늘리지 않음'과 R22/R41+C11 병존이 문면상 모호. Scene05 그림의 '포함'은 집합 포함, 지도R23/R41은 '종류' | 비교는 별도 카드이며 edge가 아님. 집합 포함과 패키지 포함을 범례로 구분. 승인ID·의미를 바꾸거나 validator에서 모든 같은쌍을 금지하지 않음. 문구 정리는 콘텐츠 담당 검토 |
| F08 | SVG에 세부g는 있지만 A~D 공통 분할 경계 계약이 없음. 긴 모바일 그림의 탭 분할 범위·의미 동등한HTML 미작성 | renderer 전에manifest·대조 검사. 잘림 없음·시각/읽기 순서Owner 확인이 공개 조건 |
| F09 | B31스키마/검사는 AWS영역·다른 관계어·고립 금지. B21은13개 관계0노드를 허용 | 전용adapter/validator 필요. cast·전역 관계형 확대·허위 관계로 회피하지 않음 |
| F10 | `npm audit --json`: moderate1/high2/critical2, 총5. vite(high), vitest(critical), @vitest/mocker(moderate), source-map-js(high), tinypool(critical) | **의존성 릴리스 판단 필요**. 실제 기존 의존 문제. dev/test와 공개 정적 산출물 도달성을 구분해 조사. major변경 포함이므로 별도 수정·회귀. 이번audit fix/lock변경 없음 |
| F11 | 기존 index chunk 약2.31MB(gzip약573KB), >500KB 경고. 데이터 생성 시 git-collaboration의 term:remote 자기참조를 제외하는 기존 알림(validator error0/warning0) | 새 원고 lazy분할·증분 측정. 자기참조는 별도Owner Gate 기록. 이번에 수정하지 않음 |
| U01 | 공식 미션 원문 대조는 기존 미검증을 계승. 목표 문구·`budget_app`·표준 라이브러리 제한 등 | 공식 확인 전 공식 요건으로 단정하지 않음. Owner가 원문 대조 범위 확정 |
| U02 | 다른 교육생 코드 적용·강의 배분/효과·실물프로젝터/휴대폰/스크린리더·전OS/Python버전 | 구현 수용과 강의 시범 운영을 구분. 브라우저 치수만으로 실기기PASS 선언 금지 |
| U03 | 전9단위 최종 시각·파생 그림·새 경로/진입 문구·최종 공개 원고 커밋 | **Owner Gate 미완료**. 현재 Scene08 표현 방식 승인과 별도 |

개별advisory와lock버전은 실행 시 `npm audit --json`으로 확인했다. 세 번째 추적 보고서는 추가하지 않으며 구현 시작 때 같은 명령으로 갱신한다. 이 건수만으로 공개 정적 사이트가 공격 가능하다고 단정하지 않는다.

## 9. 다음 구현 스프린트 진입 조건

1. Owner가 [통합 계약](integration-contract.md)의 순서·재사용·공개URL제안·원고 기준을 확인한다. 새URL 적용 승인과 공개 승인은 별도로 기록한다.
2. F01/F02는 Integration Sprint01에서 해결하고 기존 전Scene 검증을 재실행했다(상세 수치는 handover의 최신 스프린트 표). 다음에는 승인 원고/SVG/candidate hash를 고정하고 F05/F06의 표시/출처 처리를 확정한다.
3. Sprint02에서 비공개 content/renderer와 무결성 기반을 구현했다. 다음에는 B21전용 adapter·관계0허용·장면 상호작용·왕복을 별도 범위로 검증하며 공개 경로는 연결하지 않는다.
4. 공개 전 전9단위 콘텐츠·시각 승인, 실제 왕복·모바일·키보드·history의 신규QA, 의존성 릴리스 판단을 끝낸다. 자동PASS는 Owner 공개 승인을 대신하지 않는다.

초기 준비 점검은 문서를 완성한 단계였으며, 현재 비공개 구현 결과는 최신 Sprint02 절을 따른다. 남은 Blocker 해결이나 공개 웹 통합 완료를 선언하지 않는다. 구현 순서·검사 명령·상태 계약은 [통합 계약](integration-contract.md)에 모은다.
