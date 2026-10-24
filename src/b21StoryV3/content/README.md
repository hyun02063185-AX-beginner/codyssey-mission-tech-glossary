# B2-1 Story React Integration U1

기준: `88f1f892d1784c9c3a665618ab2382c719ffbf0d` (v3.8 설계, Owner 승인 v3.7 콘텐츠).
시작 브랜치 `content/b2-1-story-map-foundation`, 원격과 0/0, 미커밋 변경 0.

`react-integration-plan.md` §3·§7.5·§8 U1에 따른 **화면용 콘텐츠 사본**이다.
원천은 `drafts/b2-1-story-map/v3/scene-01`~`scene-08/storyboard.md`이며,
그림 매개변수·대본·질문·노트는 승인된 `teaching-preview/index.html`의 `SCENES`를 보존한다.
원고·미리보기·기존 v2 Foundation을 수정하지 않는다.

- `scene01.ts`~`scene08.ts`: 13 / 17 / 12 / 14 / **22 / 18** / 15 / 17단계, 총 **128단계**.
- `types.ts`, `index.ts`: 독립된 8장면 타입과 순서. 01~04·07·08의 주소는 1부터 세는 숫자 문자열, 05·06은 의미 기반 ID다. `home`은 모든 장면에서 내부 단계 ID다.
- `instructor`: 강사 대본·기대 답·흔한 오답·정확성 노트·심화. 승인된 노트의 `<b>`·`<code>` 표기를 보존했다. `questions`와 `reveal.answers`는 학습자 질문·공개 답이며 같은 순서다.
- `example`·`real`: 가상 todo / 학습용 가상 기록 / 개념 예시 / 실제 ledger / 개념지도 복습을 구분한다. `next.target`·`review`는 v3 목적지만 담는다.
- `integrity.json`: 원고 8개, 승인 HTML, 원본 개념지도의 SHA-256과 단계 ID를 고정했다. Windows/macOS Git 체크아웃을 위해 **UTF-8의 CRLF만 LF로 정규화**한다. 나머지 공백·문구 변경은 SHA 검사에서 실패한다. 자동 갱신·`--write` 모드는 없다. Owner 승인 없는 새 SHA 수용은 금지한다.
- `map.ts`: 원본 JSON에서 **R09·R23·R28·R37·R41 / C13·C30**과 양 끝 노드의 표시 필드만 투영한다. 강의 영역 7개의 원본 영역·노드·심화 노드는 원고 대응표와 검사한다. 원본 **45노드·24관계·10비교**는 보존한다. v2 `sceneIds`(03a·03b 포함)와 용어 링크 데이터는 투영하지 않는다.
- `content.test.ts`: 정상 데이터와 원고 변경·누락·중복·순서·문장·대본·질문·답·예시 구분·그림 상태·이동·지도·용어 존재의 실패 사례를 검사한다.
- `scripts/b21_v3_content_check.mjs`: 작업 디렉터리와 관계없이 실행되는 읽기 전용 검사기. 실행 명령은 `npm run b21:v3-validate`다. 기존 build/test 체인은 변경하지 않았다.

## 원고와 화면의 대응

새로 작성하거나 요약한 교육 문구는 없다. 128개 화면 문장은 승인 미리보기와 동일하다.
124개는 원고의 단계 표·확인 질문·정리와 직접 대조한다. 나머지 **기존 승인 표현 4곳**은
기존 `check-preview.mjs`의 별도 규칙을 이어받아 더 엄격한 고정 문구로 검사한다.

| 화면 | 출처와 처리 |
| --- | --- |
| 01-11, 02-16 | 원고의 설명 후 이해 확인 원칙을 나타내는 기존 화면 안내 문장 |
| 02-8, 02-9 | 원고 F3의 ‘바꾸고 싶은 것 / 먼저 볼 역할’ 표를 문장으로 표현한 기존 승인 문구. 원본 상황과 역할도 대조 |

Scene 02 원고 단계 7은 미리보기의 7~9 세 화면으로 나뉘어 있다. 원고 단계 8~13은 화면 10~15에 대응한다.
Scene 01·02의 확인·적용·정리는 원고 3절에 있다. 이 대응을 임의로 단계 추가나 원고 수정으로 해석하지 않는다.
Scene 05의 숫자 주소 16개, Scene 06의 숫자 주소 13개는 원고의 범위·나열 표기를 읽어 확장하여 대조한다.
특히 06-8·06-9는 모두 `real`로 연결된다.

## 다음 작업 경계

U2에서 이 데이터를 사용해 그림 함수·DOM·CSS를 React로 이식하고 비공개 Preview에서 동등성을 확인할 수 있다.
이번에는 화면·라우트·발표자 창을 만들지 않았다. QA v3.8의 연결 가능 용어 18개는 Markdown 파일과
생성 그래프의 존재만 검사하며, `terms`·`TermRef`·실제 링크는 넣지 않았다(U4).
기존 모바일 조작·가독성 문제는 U2, 주소·복습 복귀 문제는 U3 범위다.
원고 권장 보완과 실제 강의 효과·프로젝터·Windows 실기기 확인은 이번에 수행하지 않았다.

## U1 실행 기록 — 2026-10-24

| 검사 | 결과 |
| --- | --- |
| `npm run b21:v3-validate` | PASS · 8장면·128단계·124 직접 문장·4 기존 승인 표현·주소 대응 16/13·지도 투영·용어 존재 18개 |
| `npm run b21:validate` | PASS · 기존 9원고·16 SVG·section·activity·reference 기준 유지 |
| `npm run build` | PASS · 기존 Foundation 빌드 검사 포함(9장면·16 SVG 바이트 동일·155 코드 블록·SSR). 기존 500kB 청크 경고 유지 |
| `npm test` | PASS · 17파일·200테스트(신규 24개 포함) |
| `B21_BROWSER_CHANNEL=chrome npm run b21:browser-check` | PASS · 실제 Chrome 63검사 |
| `node drafts/b2-1-story-map/v3/teaching-preview/qa/check-preview.mjs` | PASS · 6,033단언·1280/390/360px·ledger 대조 8개·오류 0·외부 요청 0. `LEDGER_REPO=/Users/hyun020631854123/m03-pocket-money-ledger`를 함께 지정 |
| 추가 확인 | 고정 SHA 10개가 시작 커밋 Git blob과 동일. 저장소 밖 cwd 실행 PASS. CRLF 체크아웃 모의 검사 PASS |

전체 테스트 첫 실행은 Chrome 검사들과 동시에 실행되어 기존 개념지도 `edge corridors > all`이
5초 제한을 초과했다(199 PASS / 1 FAIL). 기존 제한·검사 기준은 바꾸지 않았다.
반복 원고 파싱을 재사용하도록 새 검증기만 개선했고, Chrome 검사가 끝난 뒤 `npm test` 단독 실행은
200/200 PASS했다(해당 기존 테스트 약 2.84초). 최종 FAIL·SKIP은 없다.

HTML QA가 재생성한 `results.json`은 날짜만 달랐고, PNG 7개는 기존 다음 버튼의 44×5px 눌림 표시만 달랐다.
차이를 확인한 뒤 모두 원복했다. 보호 파일 diff 0, package.json은 신규 명령 한 줄만 변경했다.
학습 정책 점검: 콘텐츠 역할 구분·가상/실제 경계·원본 관계 투영은 PASS.
실제 v3 UI·용어 왕복·학습 효과는 이번 범위에서 미구현/미검증이며, U2 이후의 검증을 대신하지 않는다.
U2 데이터 진입 준비 완료. U2는 비공개 화면 이식과 3폭 동등성 검사를 수행해야 한다.
