# B2-1 U3-C — 360px 레이아웃 원인 분석과 승인용 수정안

검증일: 2026-10-24 (Asia/Seoul). Windows PowerShell, 설치된 Chrome 155.0.8059.85의 실제 headless 브라우저를 사용했다. 아래의 원본 결과와 실험 결과를 구분한다.

## 시작 상태와 결론

- 작업 폴더: `C:/Users/hyun0/codyssey-mission-tech-glossary-b21-story`
- 브랜치: `content/b2-1-story-map-foundation`
- 시작 HEAD: `bf01ac1184a4dbc22743bc6d16f790e95d7c177e`
- `git fetch origin` 후 지정 원격 브랜치와의 차이: `0 / 0`. 시작 작업 트리 Clean.
- **원본의 실제 CSS Grid 최소 너비 문제다. QA 환경 오류가 아니다.** 원본 HTML QA의 허용값과 검사항목을 바꾸지 않았다.
- **현재 U4 진입은 보류한다.** 원본 QA가 FAIL이며, 원본 CSS와 해당 Preview 승인 해시 수정은 Owner 승인을 기다린다.

## 직접 원인: Grid의 자동 최소 너비와 줄바꿈 금지

Scene 04-1의 측정값은 다음과 같다. Scene 04-2·04-4에서도 같은 문제가 재현된다.

| 요소 | 위치·너비 | 중요한 computed style |
| --- | --- | --- |
| `#stage .s4` | x=16, width=328, right=344 | `width:328px`, `overflow-x:visible` |
| `.mf` | x=16, width=328, scrollWidth=346 | `display:grid`, `grid-template-columns:169px 169px`, `gap:8px` |
| `.pane.memp` | x=16, width=169, height=244 | `min-width:auto`, `display:flex`, 좌우 padding 6px, 좌우 border 3px |
| `.pane.filep` | x=193, width=169, right=362 | `min-width:auto`, `overflow-x:visible` |
| `.pane .rec` | width=151, height=32 | `grid-template-columns:20px 60px 45px`, gap 5px, 좌우 padding 6px, 좌우 border 2px |
| `.rec .mm`의 `아이스크림` | width=60 | `font-size:12px`, 실제 Malgun Gothic, `white-space:nowrap` |
| `.rec .am`의 `2,000원` | width=45 | bold 12px, 숫자·쉼표 Consolas / `원` D2Coding, `white-space:nowrap` |

너비가 만들어지는 과정을 실제 측정으로 확인했다.

```text
기록 행 최소 너비 = 20 + 60 + 45 + (5 × 2) + (6 × 2) + (2 × 2) = 151px
패널 최소 너비    = 151 + (6 × 2) + (3 × 2) = 169px
두 패널과 간격   = 169 + 169 + 8 = 346px
오른쪽 패널 끝   = 왼쪽 시작 16 + 346 = 362px
```

부모의 328px보다 18px 넓어 오른쪽 여백 16px을 소비하고 문서 밖으로 2px 더 나간다. `1fr` 열의 자동 최소 크기와 패널의 `min-width:auto`가 줄바꿈 불가 콘텐츠의 최소 너비를 유지하는 것이 원인이다. 상속된 `overflow-wrap:anywhere`는 `.rec .mm`의 명시적 `white-space:nowrap`를 해제하지 못한다. 브라우저 메모리에서 `word-break:break-all`만 추가해도 문서 폭은 362px 그대로였다.

Chrome DevTools Protocol의 `CSS.getPlatformFontsForNode`로 실제 사용 글꼴을 확인했다. CSS의 글꼴 목록만 보고 추정하지 않았다. 웹 글꼴을 새로 로드하거나 텍스트를 대체하지 않았다.

## Windows·macOS와 QA 환경

- 같은 원본을 파일 URL로 직접 열고 `document.fonts.ready` 후 측정해도 362px이다. 임시 QA 사본의 줄바꿈 정규화가 만든 오류가 아니다.
- 기존 HTML QA와 같은 `isMobile:true`, `hasTouch:true`, 요청 viewport 360px에서도 3개 단계의 `clientWidth=360`, `visualViewport.width=360`, `visualViewport.scale=1`, `scrollWidth=362`가 재현된다. 이때 `innerWidth`도 362로 보고되므로 **문서 폭을 `innerWidth`와만 비교하면 결함을 놓친다**. 요청한 360px 기준은 유지했다.
- 글꼴 대체 실험은 브라우저 메모리에서만 했다. 기본 Windows 조합은 문서 폭 362px, monospace를 D2Coding으로 바꾸면 360px, Courier New로 바꾸면 368px이었다. D2Coding에서도 `.mf`의 내부 scrollWidth는 340px로 부모 328px보다 넓다. 문서 폭 검사만 통과하는 환경에서도 자동 최소 너비 문제는 남을 수 있다.
- Arial 지정으로 한글의 fallback이 유지되는 경우에는 362px 그대로였다. CSS font-family 문자열과 실제 글꼴은 구분해야 한다.
- macOS는 목록 앞쪽의 Apple SD Gothic Neo·SF Mono·Menlo 등 설치 글꼴과 메트릭이 달라질 수 있다. **이것은 환경 차이 가능성에 대한 추론이며 macOS 실측 결과가 아니다.** 네이티브 macOS 실행은 SKIP이다. 과거 macOS PASS 기록만으로 현재 Windows 실패를 무효화하지 않는다.

## React가 통과하는 이유

U2에서 승인된 모바일 접근성 CSS는 무대의 조작 버튼에 `min-width:44px`을 명시한다. 따라서 같은 패널의 자동 최소 너비 제한이 풀리고 `.mf`의 두 열은 `160px 160px`으로 들어간다. 원본은 `auto`, React는 `44px`이라는 computed style 차이를 실제로 확인했다. React의 교육 데이터나 승인 디자인을 새로 고쳐야 하는 문제는 아니다.

## 전체 범위 조사

원본을 매 단계 새로 열고, 8장면·128개 기본 단계와 답 공개 15개 상태를 각각 측정했다. 첫 실패에서 중단하지 않았다.

| 폭 | 원본 143상태 | 현재 React 143상태 |
| --- | --- | --- |
| 360px | **FAIL 3개**: Scene 04의 1·2·4단계가 각각 362px. 나머지 140상태는 문서 가로 넘침 없음 | PASS 143/143 |
| 390px | PASS 143/143 | PASS 143/143 |
| 1280px | PASS 143/143 | PASS 143/143 |

별도로 기존 HTML QA와 같은 모바일·터치 모드에서도 360px 143상태를 전부 조사했으며 같은 3개 실패만 확인했다. 이는 가로 레이아웃 전수 조사 결과다. 원본 HTML QA가 첫 실패 이후에 실행하지 못한 다른 의미·초점 검사항목까지 PASS라고 간주하지 않는다.

## Owner 검토용 최소 수정안 — 아직 원본에 적용하지 않음

독립 HTML의 기존 `<style>` 마지막에 다음 한 줄을 추가하는 안이다.

```css
@media (max-width:360px){.mf>.pane{min-width:0}}
```

360px 이하의 메모리/파일 패널만 자동 최소 너비에서 해제한다. 색상·폰트·글자 크기·문구·줄바꿈·패딩·테두리·간격은 바꾸지 않는다. `overflow:hidden`이나 콘텐츠 삭제를 사용하지 않는다. `.mf`의 실제 두 열이 160px이 되어 기존 8px 간격과 양쪽 16px 여백에 들어간다.

| 비교 | 수정안의 예상·실측 시각 차이 |
| --- | --- |
| 360px Scene 04-1·2·4 | 패널 폭 169→160px. 왼쪽 패널 x=16 유지, 오른쪽 패널 x=193→184. 패널 높이 244px 유지. 문서 폭 362→360px. 줄바꿈과 내용 동일 |
| 390px Scene 04-1·2·4 | 전체 페이지 스크린샷 바이트 동일. 패널 175px 유지 |
| 1280px Scene 04-1·2·4 | 전체 페이지 스크린샷 바이트 동일. 패널 548px 유지 |
| U2 모바일 접근성 CSS가 적용된 동등성 기준 | 3개 단계 × 3개 폭 모두 수정안 전후 이미지 바이트 동일. 기존 44px 규칙의 우선순위와 실제 너비 유지 |

기록 행 안의 가장 긴 항목은 현재 React와 동일하게 행 배경의 안쪽 padding 일부를 사용한다. 두 `아이스크림` 행의 `scrollWidth=141`, `clientWidth=138`인 내부 overflow도 숨기지 않고 기록했다. `overflow-x:visible`이므로 글자가 잘린 것은 아니며, 실제 텍스트 범위가 패널 테두리 안에 있고 항목명·금액이 겹치지 않는 것을 별도로 측정했다. 360px의 새 기록 배지도 패널과 함께 이동하므로 아래 전후 이미지에서 검토해야 한다.

대안으로 항목명의 `white-space:normal` 한 줄을 실험하면 넘침은 없어지지만 `아이스크림`이 두 줄이 되고 행 높이가 바뀐다. 승인된 React 화면과의 차이를 줄이기 위해 이 대안을 권장하지 않는다.

수정안은 브라우저 메모리의 429상태와 별도 360px 모바일 모드 143상태에서 문서 넘침 없이 동작했다. 패널 텍스트 잘림·항목명/금액 겹침도 없었다. 이 결과는 **승인 전 수정안 실험**이며 현재 승인 원본의 PASS가 아니다.

## 첫 실패 뒤에 가려져 있던 추가 QA 실패

위 CSS를 **임시 사본에만** 적용하고 기존 HTML QA를 그대로 실행하자, 360px 전체 128단계의 가로 넘침 검사는 통과했지만 5,803번째 검사에서 다음 항목이 FAIL했다.

```text
360: role tiles keep identical positions in F2/F4/F7
```

Scene 02-2(역할 설명), 02-10(파일명), 02-15(실제 ledger)의 카드 사각형이 같아야 한다는 기존 검사다. 다른 원인이며 Scene 04 CSS가 영향을 주는 선택자도 아니다.

| 360px 단계 | 원본 HTML의 위쪽 두 카드 높이 | 원본 HTML의 아래쪽 두 카드 높이 | 현재 React의 위/아래 카드 높이 |
| --- | --- | --- | --- |
| Scene 02-2 | 118.375px | 137.5625px | 118.375 / 137.5625px |
| Scene 02-10 | 118px | 118px | 98 / 98px |
| Scene 02-15 | 118px | 118px | 118 / 118px |

원본 모바일 `.grid`는 `grid-template-rows:auto auto`, `.tile`은 `min-height:118px`다. 360px에서 타일 폭은 144px이고, Scene 02-2의 긴 15px 한글 설명은 세 줄로 감겨 두 번째 행을 137.5625px까지 늘린다. 파일명 단계의 짧은 내용은 118px에 머문다. 직접 진입과 처음부터 다음 버튼으로 탐색한 경우가 같았고, 각 비교의 `scrollY=0`이므로 스크롤이나 캡처 위치 오차도 아니다. 기존 검사는 x/y만이 아니라 width/height도 비교하므로 이 차이를 실제로 검출한다.

현재 React의 02-10은 기존 U2 접근성 규칙이 버튼의 `min-height`를 44px로 지정해 자연 높이가 98px이다. 따라서 React 384화면 동등성 PASS는 **접근성 CSS를 적용한 기준과의 단계별 일치**이며, F2/F4/F7 사이의 카드 높이 동일성 PASS를 뜻하지 않는다. 이번 작업에서 React CSS는 바꾸지 않았다.

이 추가 실패도 테스트 환경 오류로 처리하거나 height 비교를 제거하지 않는다. Scene 04 최소안만 반영해도 전체 HTML QA는 여전히 FAIL이다. Scene 02 카드 높이의 일관성을 고치려면 승인된 모바일 디자인과 React 유지 범위까지 함께 판단해야 하므로 후속 범위에 대한 Owner 결정이 필요하다.

최종적으로 별도 진단 사본에서 기존 `check` 호출과 허용값을 모두 유지하고 첫 실패의 throw만 실패 누적으로 바꾸어 **6,033개 검사를 끝까지 실행**했다. 실패 목록과 종료 코드를 FAIL로 유지했다.

- 원본 진단 사본: FAIL 4건 — 360px의 Scene 04-1·2·4 넘침, Scene 02의 역할 카드 사각형 동일성.
- Scene 04 최소안 진단 사본: FAIL 1건 — 역할 카드 사각형 동일성. 가로 넘침 3건은 해소됐다.
- 두 사본 모두 1280·390 PASS, 360 FAIL. 나머지 단언의 추가 실패·브라우저 오류·외부 요청은 없었다.

이는 실패를 통과로 바꾼 QA가 아니라 남은 실패를 수집하는 별도 분석이다. `npm.cmd run b21:html-qa`의 원래 첫 실패 중단 동작도 보존했다. [역할 설명 단계](../../reports/b21-u3-c/360-02-2-html.png)와 [파일명 단계](../../reports/b21-u3-c/360-02-10-html.png)의 실제 이미지도 보존한다.

승인 대상 파일은 다음 두 곳으로 제한할 수 있다.

1. `drafts/b2-1-story-map/v3/teaching-preview/index.html`: 위 CSS 한 줄 추가.
2. `src/b21StoryV3/content/integrity.json`의 `preview.sha256`: 이 CSS 변경에 대응하는 승인값 1개만, Owner 승인 후 명시적으로 갱신. 원고 해시·지도 해시·장면 데이터는 불변.

검토용 [정확한 HTML 패치](../../reports/b21-u3-c/proposed-html.patch), [CSS 사본](../../reports/b21-u3-c/proposed-360.css), [기존·제안 해시](../../reports/b21-u3-c/proposal-metadata.json)를 별도 파일로 준비했다. 패치와 제안 해시는 원본에 적용하지 않았다. `--write`는 실행하지 않았다.

## U3 회귀와 원본 QA

| 검사 | 결과 | 확인 범위 |
| --- | --- | --- |
| `npm.cmd run b21:validate` | PASS | Foundation 9단위·16 SVG |
| `npm.cmd run b21:v3-validate` | PASS | React 승인 데이터 8장면·128단계·legacy 16/13 |
| `npm.cmd run b21:eol-check` | PASS | LF·CRLF 실제 입력, 원래 바이트 복원 |
| `npm.cmd run b21:v3-parity` | PASS | 384화면·5,269검사·브라우저 오류 0 |
| `npm.cmd run b21:router-check` | PASS | 209검사·URL·복습 복귀·발표자 창·오류 0 |
| `npm.cmd test` | PASS | 19파일·238테스트 |
| `npm.cmd run build` | PASS | 공개 빌드와 Foundation 별도 빌드 검사. 기존 큰 청크 경고 유지 |
| `npm.cmd run b21:browser-check` | PASS | 설치 Chrome 명시 실행, 63검사 |
| `npm.cmd run b21:html-qa` — 승인 원본 | **FAIL** | 5,010검사 진행, 1280·390 PASS, 360 Scene 04-1에서 중단 |
| Scene 04 최소안만 넣은 임시 사본의 기존 HTML QA | **FAIL** | 5,803검사 진행, 360 가로 넘침 전수 검사는 통과했으나 Scene 02 역할 카드 사각형 동일성 실패 |
| 원본 진단 사본 — 모든 단언 누적 | **FAIL** | 6,033검사 완료, 넘침 3건 + 카드 사각형 동일성 1건 |
| 최소안 진단 사본 — 모든 단언 누적 | **FAIL** | 6,033검사 완료, 카드 사각형 동일성 1건 |
| 승인 원본 QA의 360px 나머지 의미·초점 검사 | SKIP | 기존 QA의 첫 실패 중단. 별도 전수 레이아웃 조사는 위에 기록 |
| 실제 macOS·물리 프로젝터 | SKIP | Windows 호스트의 자동 브라우저 조사와 구분 |
| 수정안의 원본 반영·승인 해시 갱신·반영 후 최종 회귀 | SKIP | Owner 승인 전 |

## 수정 파일과 보호 범위

이번 커밋은 별도 분석 스크립트 3개, 이 보고서, 신규 QA 증빙·승인용 패치만 추가한다. 기존 QA 스크립트·검사항목·허용값도 변경하지 않았다.

- `scripts/diagnose_b21_360_overflow.mjs`: 승인 HTML 해시 확인, 실제 Chrome의 전체 상태·computed style·bounding box·CDP 글꼴 수집.
- `scripts/probe_b21_360_proposal.mjs`: 브라우저 메모리 CSS 실험·전후 이미지·텍스트 범위·접근성 기준 동일성·모바일 모드 비교.
- `scripts/diagnose_b21_html_qa.mjs`: 별도 원본/수정안 사본에서 모든 기존 단언을 유지하고 실패를 누적한다. 첫 실패 중단만 진단 사본에서 해제하며 실패는 끝까지 FAIL로 보고한다. 승인 원본 QA를 대체하지 않는다.
- `docs/mission-guides/b21-u3-c-verification.md`, `reports/b21-u3-c/`: 결과와 승인용 산출물.

시작 SHA와 비교하여 승인 원고·독립 HTML·기존 이미지·Foundation/v3 무결성 JSON·React 코드/데이터/CSS·공개 라우트·용어 링크·학습가이드·다른 미션·의존성·배포 설정은 불변이다. 빌드가 생성한 33개 JSON의 CRLF 차이는 HEAD와 CRLF→LF 동등성을 각각 검증한 뒤 그 경로만 복원했다.

재현 명령:

```powershell
node scripts/diagnose_b21_360_overflow.mjs
node scripts/probe_b21_360_proposal.mjs
node scripts/diagnose_b21_html_qa.mjs
```

상세 원시 측정값과 실행 로그는 `node_modules/.cache/b21-u3-c/`와 `node_modules/.cache/b21-u3-c-*.log`에 있다. 저장소에는 [집계와 핵심 측정값](../../reports/b21-u3-c/results.json), [원본 360px](../../reports/b21-u3-c/360-04-1-before.png), [수정안 360px](../../reports/b21-u3-c/360-04-1-proposal.png), [390px 원본](../../reports/b21-u3-c/390-04-1-before.png), [390px 수정안](../../reports/b21-u3-c/390-04-1-proposal.png), [1280px 원본](../../reports/b21-u3-c/1280-04-1-before.png), [1280px 수정안](../../reports/b21-u3-c/1280-04-1-proposal.png)을 보존한다.

## U4 판단과 Owner 결정

현재 U3 React 회귀는 유지됐지만, 승인 원본 HTML QA는 FAIL이므로 U4 진입을 보류한다. 요청서 5항의 **“Owner 승인 없이 원본을 변경하거나 승인 해시를 갱신하지 않는다”**에 따라 이 단계에서는 조사와 구체적인 수정안까지만 커밋한다.

Owner 결정 항목은 다음 두 가지다.

1. Scene 04의 CSS 한 줄과 이에 대응하는 `preview.sha256` 한 개 갱신의 승인 여부.
2. 추가 발견한 Scene 02 카드 높이 일관성 문제를 해결할 후속 범위. 승인된 HTML과 React의 모바일 디자인이 함께 관련되므로 현재의 React 불변 범위를 임의로 넓히지 않았다.

**Scene 04 최소안 승인만으로 U4 진입을 확정할 수 없다.** 추가 실패도 해소하고 원본 HTML QA 및 영향받는 회귀를 통과시켜야 한다. macOS 실측과 실제 강의 모니터 육안 검수는 별도 확인 항목이다. Push·공개 라우트 변경·용어사전 연결·배포는 수행하지 않는다.
