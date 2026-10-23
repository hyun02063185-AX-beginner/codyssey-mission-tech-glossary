# B2-1 통합 준비 점검

2026-10-23 · **설계·준비 완료 / 서비스 통합·공개 미완료**

기준은 `358927d3414e231b81bf975bbf38bc1879cffd7f`다. 작업 시작 시 브랜치 `content/b2-1-story-map-foundation`, HEAD와 `origin/content/b2-1-story-map-foundation`이 이 커밋으로 같았고 작업 트리는 깨끗했다. `git fetch origin` 후 ahead/behind는 0/0이었다. 이번 변경은 이 문서, [통합 계약](integration-contract.md), [인수인계](handover.md)뿐이다. 발견한 오류도 기록만 하고 원본은 고치지 않았다.

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

## 7. 이번에 실행한 QA 기준선

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
| F01 | Scene02 `_tools/verify_demo.py` 정규화는 데모 경로와 `\\`만 처리. 원고 기대 `python: No module...`와 실제 `/usr/local/opt/python@3.12/bin/python3.12: No module...` 불일치. 28성공·1실패, 종료코드1은 기대와 같음 | **검증기 수정 필요**. 별도 허용 범위에서 실행 파일 접두사만 정규화하고 메시지·종료코드를 보존해 회귀. 원고를 가짜 출력으로 바꾸지 않음 |
| F02 | Scene05 `_tools/verify_demo.py:253`에서 `@@`가 없어 IndexError. ORDER를 단독 실행하면 `python -c`의 `inspect.getsourcelines(consume)`이 `OSError: could not get source code`. 61성공 뒤 나머지 미실행 | **검증기 수정 필요**. 임시 `.py` 추적 또는 명시적 소스 대응표, 자식 종료코드/stderr 검사를 적용한 뒤 전체 재검사. Generator 자체의 오류로 단정하지 않음 |
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
2. F01/F02를 별도 허용 범위에서 해결하고 데모 전체 검사를 회복한다. 승인 원고/SVG/candidate hash를 고정하고 F05/F06의 표시/출처 처리를 확정한다.
3. 공개 경로를 연결하지 않는 content/adapter/renderer 테스트부터 구현할 수 있다. B31보호와 관계0허용을 먼저 계약화한다.
4. 공개 전 전9단위 콘텐츠·시각 승인, 실제 왕복·모바일·키보드·history의 신규QA, 의존성 릴리스 판단을 끝낸다. 자동PASS는 Owner 공개 승인을 대신하지 않는다.

이 스프린트는 준비 문서를 완성한 단계다. Blocker 해결이나 웹 통합 완료를 선언하지 않는다. 구현 순서·검사 명령·상태 계약은 [통합 계약](integration-contract.md)에 모은다.
