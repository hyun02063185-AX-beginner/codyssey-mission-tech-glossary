# U2 comparison contract (fixed before the first comparison)

Baseline: `0de51ce63e9aaa6394c91859bc77b8d9d3ad552b`. Approved reference: v3.7 teaching-preview/index.html.

- Chrome, device scale factor 1, the same installed fonts and completed font loading, viewport 1280×720 / 390×800 / 360×800. Pointer parked outside the content; animations disabled for capture.
- Screen questions, step titles, stage text, emphasis targets, sentences, progress, instructor notes and disclosed answers must match exactly after whitespace normalization. No semantic or emphasis exception.
- Screenshot tolerance, fixed now: per-channel difference <= 16 is antialiasing noise; at most 0.1% of pixels may exceed that threshold. Any larger difference fails and must be investigated, without increasing tolerance.
- PC uses the original reference without visual changes. Mobile also saves the untouched original. For mobile parity only, the reference receives the **same declared mobile CSS** as React: actionable stage buttons at least 44×44, labels previously below 12px raised to 12px, and the Decorator label moved into normal flow to accommodate its touch target. This isolates intentional accessibility changes; no text, emphasis or other layout changes are allowed. Both original and adjusted reference screenshots are retained.
- Mobile vertical scrolling is permitted, measured per step and recorded. Horizontal overflow, clipped text, visible actionable targets smaller than 44×44, and visible labels below 12px fail.
- Compare all 128 steps at all three widths. Independently exercise selection, answers/reset, drawers/focus, keyboard, scene boundaries and review/return with React state only. Browser history, service URL state and presenter synchronization remain U3.

## 구현과 검토 경로

- `B21TeachingStory.tsx`: U1 데이터의 8장면·128단계를 내부 상태로 탐색한다. 이전/다음·직접 선택·전체 구조·목차·강사 노트·답 공개·키보드·Scene 08 복습/복귀를 제공한다. 이동 시 답을 숨기고, 장면/목차 이동 시 질문에, 서랍을 닫으면 열었던 버튼에 초점을 돌린다. 그림 버튼이 교체된 뒤에도 키보드 탐색이 이어진다.
- `figures/ApprovedFigures.tsx`: 승인 HTML의 11개 그림을 **JSX**로 이식했다. 단계 배열·화면 문장·대본은 중복 작성하지 않고 U1에서 읽는다. 그림 자체의 예시·문구·도형·클래스·상태 조건은 기준본을 보존한다.
- `figures/FigureContext.tsx`: 그림 선택·복습·다음 장면·답 공개를 React props/callback으로 처리한다. HTML 문자열 삽입·DOM 이벤트 위임·HTML iframe 렌더링은 사용하지 않는다. 승인 노트의 제한된 `<b>`·`<code>` 표기와 JSONL 강조는 React 노드로 변환한다.
- `b21StoryV3.css`: 승인 CSS를 강의 루트 안으로 한정하고, 루트에서 본문 기본값을 다시 설정해 앱의 글자 간격·줄 높이·글꼴·카드 규칙이 스며들지 않도록 했다. 승인된 밝은 팔레트를 고정했다.
- `scripts/b21-preview/main.tsx`: 기존 Foundation 선택을 유지하면서 v3 버전·장면·단계 선택을 추가했다. 기존 `view=scene`과 신규 `view=v3`는 각각 실제 React 진입점이다. iframe은 기존 Preview의 뷰포트 분리를 위해서만 사용한다.
- `scripts/check_b21_v3_parity.mjs`: 실제 Chrome에서 문구·강조·질문·기대 답·노트·진행 표시와 스크린샷을 비교한다. 기본 384개 화면에 더해 답 공개, 서랍, 세로 스크롤 전체 페이지, React 내부 이동과 Preview 선택, 실제 앱 CSS 주입을 검사한다. 기준 HTML은 단계마다 새로고침해 앞 검사에서 남은 초점 표시를 비교에 섞지 않는다.

실행: `npm run b21:preview`, 기본 주소 `http://127.0.0.1:4179/`.
직접 검토 예: `http://127.0.0.1:4179/?view=v3&scene=05&step=iterable`.
Preview 쿼리는 초기 화면 선택만 담당한다. 강의 중 조작은 URL·History·저장소를 갱신하지 않는다.
새로고침 복귀·서비스 주소 해석·발표자 창·용어 링크는 U3/U4 범위이며 이번에 임시 구현하지 않았다.

## 의도적인 모바일 차이

- 무대 안에서 조작할 수 있는 모든 버튼에 최소 **44×44px**을 제공한다. 답 보기·다음 장면·JSONL/CSV 줄·Decorator 테두리 이름표를 포함한다.
- 기존 9~11px 라벨과 11.2px 취소선 금액을 최소 **12px**로 높였다. 구조도 전체를 축소하지 않는다.
- Decorator 바깥 이름표는 커진 터치 영역이 안쪽 버튼을 덮지 않도록 모바일에서 정상 문서 흐름에 둔다.
- 세로 스크롤은 내용·표·공개 답의 높이를 보존하기 위해 허용한다. 결과의 단계별 높이와 전체 페이지 이미지를 별도 기록한다.
- PC는 승인 배치·비율·색·글꼴을 유지한다. 모바일 기준 화면에 적용하는 CSS는 위 세 가지 개선과 동일하며, 원본 HTML 파일 자체는 수정하지 않는다.

## 검사 중 발견하고 수정한 항목

대표 비교에서는 초기 초점 표시, 작은 취소선 글자, React 목록 key 경고와 CSS 초기화 후 hidden 버튼 표시를 검출해 수정했다.
전수 비교의 초기 실패도 생략하지 않았다:

1. 26개 화면 후 Scene 02 실행 흐름에 React 노드가 문자열로 합쳐지던 문제를 검출해 JSX 자식으로 수정했다.
2. 96개 화면 후 Scene 07 노트의 `&gt;` 문자 디코딩 차이와 표 내부 공백 경고를 수정했다.
3. 9개 화면 후 0.1015625% 픽셀 차이로 실패했다. 기준 HTML의 이전 ‘강사 노트’ 버튼 초점 표시가 남은 비교 상태였으며, 기준 페이지를 단계마다 새로고침하도록 수정했다. **0.1% 허용값은 늘리지 않았다.**
4. PC 128개 비교 후 Preview 선택 상자의 이름으로 찾는 검사가 시간 초과했다. 선택 상자에 명시적인 접근성 이름을 부여하고 실제 장면·단계·Foundation 선택을 별도 확인했다.
5. 254개 화면 후 Scene 08 모바일 정답 공개 시 초점 버튼이 화면 밖으로 밀리는 차이를 검출했다. 초점 대상을 가장 가까운 화면 안으로 스크롤하는 동작을 기준본에 맞췄다.

앱 본문의 줄 높이·글자 간격 상속도 별도로 재현해 강의 루트 초기화로 차단했다. 모든 수정은 동일한 허용 기준으로 다시 검사한다.

## Owner가 유지하기로 결정한 원본 제약

정답 공개 상태 45개를 추가 점검한 결과, PC 1280×720의 **Scene 03-11·08-15**에서 카드가 무대 경계를 넘어 질문·하단 문장 영역과 겹친다.
독립 HTML에서도 같은 현상을 직접 재현했다. 기본 128단계의 무대 배치 검사와 별개의, **답을 모두 공개한 상태**의 원본 제약이다.

2026-10-24 Owner 응답: **“승인 디자인 유지, 기존 겹침을 검토 사항으로 기록”**.
따라서 PC 스크롤 수정 후보는 소스에 반영하지 않았다. 이 두 상태의 React/HTML 시각 동일성은 통과하지만,
원본 제약이 해결됐다고 보고하지 않는다. `pc-revealed-boundary.json`과 양쪽 공개 상태·스크롤 후보 이미지를 QA 캐시에 남겼다.

추가 공개 상태 감사는 45개에서 가로 넘침 0, 모바일 44×44 터치 영역과 최소 12px 텍스트 조건을 확인했다.
모바일 공개 상태 최대 문서 높이는 997px이다. 스크린샷과 단계별 높이는 `answers-audit.json` 및 `*-answers-full.png`에 있다.

## 최종 실행 결과 — 2026-10-24

| 명령 | 결과 |
| --- | --- |
| `npm run b21:v3-validate` | PASS · U1 원고·데이터·지도·주소 대응 유지 |
| `npm run b21:v3-parity` | PASS · 384개 화면 · 5,248단언 · 콘솔 오류/경고 0 · 외부 요청 0 |
| `npm run b21:validate` | PASS · 기존 9원고·16 SVG·section/activity/reference 기준 유지 |
| `npm run build` | PASS · 기존 Foundation 빌드 검사(9장면·16 SVG 바이트 동일·155 코드 블록·SSR) 포함. 기존 500kB 청크 경고 유지 |
| `npm test` | PASS · 17파일·200테스트. 브라우저 검사와 겹치지 않게 실행 |
| `B21_BROWSER_CHANNEL=chrome npm run b21:browser-check` | PASS · 실제 Chrome 63검사 |
| `node drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs` | PASS · 6,033단언 · 1280/390/360 · ledger 8개 대조 · 오류 0 · 외부 요청 0. `LEDGER_REPO=/Users/hyun020631854123/m03-pocket-money-ledger` 함께 지정 |

기존 검사들은 이번 첫 실행부터 PASS했다. 최종 자동 검사 FAIL·SKIP은 없다. 앞선 동등성 검사 실패와 수정은 위에 모두 기록했다.

| 폭 | 기본 화면 수 | 기준 대비 최대 픽셀 차이 |
| --- | --- | --- |
| 1280 | 128 | 0.072808% |
| 390 | 128 | 0.070833% |
| 360 | 128 | 0.061806% |

모두 최초 고정한 0.1% 이내다. **모바일 수치는 동일한 사전 명시 접근성 CSS를 적용한 기준과의 비교**다.
접근성 개선 전 원본 이미지도 별도로 저장하며, 그 차이를 0.1% 이내라고 주장하지 않는다.
원본과의 가장 큰 의도적 차이는 360px Scene 08-17(요약 카드의 설명이 12px로 커져 줄바꿈/높이 증가),
Scene 07-12(작은 실제 사례 라벨 확대)다. 원본 대비 차이는 `intentionalMobileRatio`로 따로 기록했다.

기본 모바일 세로 스크롤은 폭마다 다음 14단계, 총 28개 조합에서 발생했다:
02-14·15·17 / 03-7·8·9 / 04-5 / 05-11·12·13 / 07-12 / 08-3·6·17.
문서 높이는 802~1000px이다. 표·파일·코드 구조를 축소하지 않고 작은 라벨을 키우면서 필요한 높이를 보존한 결과다.
각 조합은 전체 페이지 스크린샷도 비교하여 통과했다. 기본 PC 128단계는 스크롤·무대 침범 없이 통과했다.
공개 답 상태의 원본 PC 제약 2곳은 위 Owner 결정에 따라 별도 기록으로 유지한다.

QA 파일: `node_modules/.cache/b21-v3-parity/`의 `results.json`, `original-html-qa-results.json`,
`answers-audit.json`, `pc-revealed-boundary.json`, 원본/보정 기준/React/전체 페이지 PNG.
원본 HTML QA가 다시 쓴 results.json은 날짜만 달랐고 PNG 11장은 44×5px의 다음 버튼 눌림 표시만 달랐다. 확인 후 모두 원복했다.

변경 범위는 새 React 진입점·그림·보조 컴포넌트·격리 CSS·QA 문서와 스크립트, 기존 Owner Preview 진입 파일,
package.json의 신규 명령 한 줄뿐이다. U1 데이터·기존 Foundation·원고·승인 HTML/CSS/QA·지도·용어·가이드·공개 라우트·다른 미션·배포 설정 diff 0.

U3 구현을 시작할 기술적 기반은 준비됐다. Owner가 실제 React 디자인·조작을 확인한 뒤 진행한다.
실물 프로젝터·Windows 글꼴·모바일 실기기·스크린리더·200% 확대·실제 학습 효과는 이번에 검증하지 않았다.
