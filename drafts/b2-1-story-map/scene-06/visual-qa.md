# Scene 06 시각·기술 QA

> 검증일 2026-10-23 · Windows 11, Python 3.14.6(CPython), Node 24.16, Playwright Chromium(저장소 `node_modules/playwright`)
> 대상: `_tools/build.py` 최종 출력 `decorator-flow-desktop.svg`(1280×2754), `decorator-flow-mobile.svg`(360×5590), 원고 `script.md`, 데모 `_tools/demo/`
> 판정 표기: **PASS** / **수정 필요** / **미검증**. 자동 검사의 성공을 사람의 시각 확인으로 대신하지 않는다(§4는 미리보기 PNG를 직접 보고 적음).

## 0. 독립 검토 보완 (2026-10-23, 대상 `9396e29`)

GPT 독립 콘텐츠 검토 PASS 이후 표현 세 가지만 보완했다. 실행 예제·그림 구성·그 밖의 원고 내용은 바꾸지 않았다.

| # | 지적 | 수정 | 영향받은 결과 |
| --- | --- | --- | --- |
| 1 | 8절 표의 '실행할 때 덧붙는 동작: 없음(클래스를 만드는 단계에서 끝남)'이 `@dataclass`의 효과가 클래스 정의 시점에만 의미 있는 것처럼 읽힘 | 8절 표를 '적용되는 때(둘 다 정의 시점 한 번)' · '하는 일(기본 설정에서 `__init__()` 등 메서드를 만들어 클래스에 추가 / wrapper를 돌려줌)' · '사용할 때 실행되는 것(객체 생성 때 생성된 `__init__()` 실행, wrapper 없음 / 호출할 때마다 wrapper가 `try`·`except`)'으로 나누고, 차이를 한 문단으로 설명. 근거 표의 `@dataclass` 행도 같은 뜻으로 맞춤 | 원고만 |
| 2 | 3절 Decorator 정의가 클래스 Decorator까지 포함해 모든 Decorator가 wrapper를 돌려준다고 읽힘 | 3절을 '이 장면에서 다루는 **함수 Decorator**'의 기본 구조로 한정하고, `@dataclass`처럼 wrapper를 돌려주지 않는 Decorator가 있음을 한 문장으로 덧붙임(8절 참조). 10절 찾을 것 표·`@dataclass`만 있음 행·AI 보조 질문 1번에 '호출 때마다 wrapper가 동작하는 방식 / 정의 시점에 메서드 등을 만들어 넣는 방식'의 구분을 반영. 같은 일반화가 있던 11절 정리 문장과 근거 표의 Decorator 정의 행도 '함수 Decorator'로 한정 | 원고만 |
| 3 | 7-1절 '1절과 출력은 같지만'이 오류 호출까지 같은 것처럼 읽힘 | '정상 실행에서 로그의 순서(`시작` → `끝` → `결과`)는 1절과 같고, 마지막 호출은 1절에 없던 오류 상황의 로그 처리도 추가로 보여 준다'로 수정 | 원고만 |

**SVG:** 두 판의 글자(`<text>`·`<title>`·`<desc>`)를 모두 확인했다. Decorator 관련 문구는 `trace`·`log_calls`·`handle_app_errors` 등 장면의 구체적인 함수 Decorator에 대한 서술뿐이고 `@dataclass`나 '모든 Decorator' 일반화, '1절과 출력이 같음' 문구가 없어 **수정하지 않았다.**

**재실행 결과 (macOS Darwin 24.6.0, Python 3.12.13 CPython, Node 24.22.0)**
- `verify_demo.py`(`LEDGER_REPO=~/m03-pocket-money-ledger`, HEAD `d14e812` = 원고 기준): **PASS 91항목**, 종료 코드 0. 원고 코드 블록 = 데모 파일, 실행 출력 줄 전체 일치(시간 줄은 형식만, 2회 실행 값이 달랐음), AST, `ledger` 사례 포함. 이번 수정은 코드·출력 블록을 건드리지 않음.
- 생성기 재실행: 두 SVG SHA-256이 이전과 같음(`c099b858…`, `1aa7b71d…`) → SVG·미리보기 PNG 변경 없음, 재생성하지 않음.
- `check.cjs`: **이 환경에서 미실행**. 저장소에 `node_modules`가 없고, 찾은 Playwright(npx 캐시)에 Chromium 브라우저가 설치되어 있지 않다(`npx playwright install` 필요, 내려받기를 하지 않음). SVG가 바이트까지 같으므로 §2의 기존 PASS 결과가 그대로 유효하다.
- 이번 실행으로 macOS에서의 데모 실행(§7 미검증 항목 중 일부)이 확인되었다: 인자 개수 `TypeError` 문구를 포함해 원고 출력과 같았다(Python 3.12).

## 1. 원고·데모·그림 대조 (`_tools/verify_demo.py`)

결과 **PASS(91항목)**, 종료 코드 0. 데모는 **저장소 밖 임시 폴더**에 복사해 실행하고(바이트코드 쓰기 끔) 끝나면 지운다.

| 검사 | 결과 |
| --- | --- |
| 원고 코드 블록 = 데모 파일(글자까지), 데모가 모두 원고에 있음 | 11/11 |
| 원고 `<!-- run: … -->` 출력 = 실제 실행(**줄 전체 일치**) + 종료 코드 | 10개 데모 모두 정상 종료 0(예외는 데모 안에서 잡아 출력). `deco_tools.py`는 `import_then_call.py`가 불러옴 |
| 시간 측정(비결정적 수치) | `timing_decorator.py`를 **두 번** 실행: `[시간] total_amount:` 줄은 **형식만**(숫자 자리) 대조 — 이번 실행 값 `0.002506`·`0.002498`(실행마다 다름), 나머지 줄과 **가짜 시계 결과 `0.250000초`는 두 번 모두 글자까지 같음** |
| 그림 A | 보인 줄 = 데모의 실제 함수 소스(줄 번호 그대로), `…` 줄은 로그가 없는 원래 기능 범위, 함수의 모든 줄을 빠짐없이 다룸(4개 함수), '반복' = 실제 `[로그]` 줄 수(왼쪽 4, 오른쪽 0), wrapper 설명의 호출 줄 = `log_calls`의 실제 줄 × 두 판 |
| 그림 B 정의 시점·호출 시점(호출 추적 `sys.setprofile`) | `trace`는 정의할 때 `greet`·`hello`에 **한 번씩**, 첫 wrapper 호출보다 **먼저** / wrapper는 호출마다(3번) 실행되고 원래 함수는 언제나 wrapper가 부름. 그림의 단계(정의 3·호출 4)와 선(원래 함수 → `trace` 호출 ②, `trace`가 wrapper를 return, wrapper → 원래 함수 ③, 원래 함수 return), 출력 순서(앞 → 본문 → 뒤) × 두 판 |
| 감싼 뒤의 이름, import 시점 | `simple_wrapper.py`: 감싼 뒤 `greet`는 `wrapper`, `greet is original → False` / `import_then_call.py`: 적용 출력은 import 줄에서, wrapper 출력은 호출 때 |
| 그림 C 세 경로(실제 호출) | 정상 → `dict`, 처리하는 예외 → `None`, 처리 범위 밖 → `KeyError` 전파 = 그림의 '받는 것', 출력 줄 = 실행 출력, 예외 선: 처리 = `exc`(원래 함수 → wrapper), 전파 = `exc2`(원래 함수 → 호출한 쪽), return 선 정상 2·처리 1·전파 0 × 두 판. AST: `handle_app_errors`의 `except`는 `AppError` 하나 |
| 그림 D | 세 관심사의 출력 = 각 데모 실행 출력, 비교 15칸 × 두 판. AST: 로그 wrapper는 `except`에서 `raise`, 예외 처리 wrapper는 `AppError`에서 `None`, 시간 wrapper는 `clock()` 두 번. **실제 시간 숫자는 그림에 없고** 가짜 시계 결과만 |
| 학습용 Decorator 구조(AST) | 12개 Decorator 모두 wrapper를 돌려줌, 인자를 받는 wrapper는 `func(*args, **kwargs)`로 넘김(인자 없는 `no_arguments`·`trace`(1~4절)는 의도된 예외), 공통 관심사 Decorator(`keeps`·`log_calls`·`handle_app_errors`·`timed`)는 `@wraps(func)` |
| `ledger` 사례(HEAD `d14e812` = 원격 `main`, 임시 폴더의 빈 데이터) | `_dispatch.__name__` = `_dispatch`·`__wrapped__` 있음, 원래 `_dispatch` → `None` / 감싼 `_dispatch` → `0`(반환 약속 변경), `KeyError` 전파, `describe_error` (원인, 힌트)와 등록 안 된 종류의 기본 힌트, `delete --id 99` → stderr `[오류] 존재하지 않는 거래 ID입니다.`·`[힌트] list 명령으로 거래 ID를 확인하세요.`·stdout 없음·종료 코드 1, `category list` → 종료 코드 0. AST: `except LedgerError` 하나, `@handle_errors`는 `_dispatch` 한 곳, **`perf_counter`·`logging` 없음**(쓰인 Decorator: `dataclass`·`classmethod`·`handle_errors`·`wraps(func)`) |
| 저장소 데모 폴더 | 파일 목록·내용이 실행 전후로 같음 |

**검사기가 틀린 것을 잡는지 확인(일부러 고친 뒤 되돌림):** ① 그림 A에서 로그 줄을 `…` 범위에 숨김 → 두 판 코드 줄·반복 수 FAIL. ② 그림 C 처리 예외를 점선(`exc2`)으로 → FAIL. ③ 그림 B wrapper → 원래 함수 호출 번호를 2로 → FAIL. ④ 원고의 가짜 시계 결과를 `0.300000`으로 → 두 번 모두 FAIL. ⑤ 원고의 실제 시간 줄을 소수 넷째 자리 형식으로 → 두 번 모두 FAIL. 되돌린 뒤 PASS, 생성기·원고가 백업과 같음(`cmp`).

## 2. SVG 자동 검사 (`_tools/check.cjs`)

두 글꼴 환경 ① **Pretendard VF**(웹 서비스 글꼴, data URL 적재·적재 확인) ② **시스템 대체 글꼴**(Malgun Gothic, 고정폭은 Cascadia Mono). 결과 **PASS**.

| 검사 | 노트북 · Pretendard | 휴대전화 · Pretendard | 노트북 · 대체 | 휴대전화 · 대체 |
| --- | --- | --- | --- | --- |
| SVG XML 구문(`xml.etree`, verify_demo.py) | 통과 | 통과 | — | — |
| 뷰박스 이탈 / 글자 겹침 / 상자 넘침 / 상자 어긋난 겹침 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 선이 글자 위를 지남 | 0 | 0 | 0 | 0 |
| 선 끝이 상자에 닿음(실행 순서 9 · return 5 · 예외 2 · 관계 3) | 통과 | 통과 | 통과 | 통과 |
| 선 모양 4종 약속 + 두 예외 선의 모양이 다름 + return·관계 선 16px 안 번호 없음 | 통과 | 통과 | 통과 | 통과 |
| 상자 글자: wrapper·원래 함수·반복(색만으로 구분하지 않음) | 통과 | 통과 | 통과 | 통과 |
| 번호 원이 그림 A·D 안에 없음 | 통과 | 통과 | 통과 | 통과 |
| 최소 글자 | 16단위 | 14단위 | 16단위 | 14단위 |

| 노트북·휴대전화 의미 일치(16항목) | 결과 |
| --- | --- |
| 코드 줄 16 · 반복 4 · 단계 7 · 출력 12 · 경로 3 · 받는 것 3 · 실행 순서 선 9 · return 5 · 예외 2(모양 포함) · 관계 3 · 관심사 3 · 비교 칸 15 · 책임 3 · wrapper 설명 3 · 시간 안내 1 · 번호 원 17 | 모두 같음 |

**생성기 = SVG:** `build.py`를 다시 실행해도 두 SVG의 SHA-256이 같음(`c099b858…`, `1aa7b71d…`). 래스터 이미지 0개.

**중간 실행에서 고친 것**
- 휴대전화에서 소스 줄이 화면 밖으로 나감 → 그림 A는 `def`·로그 줄만 그대로 두고 원래 기능 줄을 `…`로 줄임(두 판 같게), 코드 상자를 화면 폭 거의 전체로, '반복' 표시를 줄 위 따로(실측: 가장 긴 줄 14단위 335px).
- 그림 D 값이 칸을 넘침 → 이름 위·값 아래 두 줄로, 카드 높이를 내용에 맞춰 계산.
- '가리킴'과 'return wrapper' 글자 겹침, 관계 선 시작점이 wrapper 상자 밖 → 위치 조정.
- 그림 B 호출 시점: wrapper 안에서 원래 함수로 가는 선이 상자 경계에서 시작하지 않음 → '앞부분' 줄에서 원래 함수 상자로 가게 고침.
- **눈으로 본 뒤 고친 것(검사기는 통과했던 것):** 휴대전화 그림 A의 wrapper 설명이 실제 코드를 줄여 다른 코드(`print(f"[로그] 시작")`)처럼 보임 → 두 판 모두 앞·뒤를 말로 설명하고 실제 호출 줄만 코드로(검증 추가). 그림 D에서 코드가 아닌 값까지 고정폭 글꼴 → 코드인 값만. 노트북 그림 B의 return 선이 너무 짧고 ③ 번호 원이 원래 함수 상자 모서리에 걸침 → 상자·선 위치 조정.

## 3. 표시 크기

| 그림 | 1280px | 1144px | 1000px | 960px | 390px 화면(칸 358) | 360px 화면(칸 328) |
| --- | --- | --- | --- | --- | --- | --- |
| 노트북용(최소 16단위) | 16.0px | 14.3px | 12.5px | **12.0px** | — | — |
| 휴대전화용(최소 14단위) | — | — | — | — | 13.9px | **12.8px** |

## 4. 눈으로 확인한 렌더링

미리보기: `preview/desktop-1280.png`, `preview/desktop-1000.png`, `preview/mobile-390.png`, `preview/mobile-360.png`(Pretendard VF). 1280·390은 전체를 잘라 확인했고, 1000·360은 생성 크기만 확인했다(배치는 같은 SVG의 축소).

| 확인 항목 | 노트북 | 휴대전화 |
| --- | --- | --- |
| 글자 잘림·겹침 | 없음 | 없음 |
| 그림 A | 왼쪽은 로그 4줄이 갈색 파선 띠 + '반복', 오른쪽은 파란 wrapper 상자 하나와 원래 기능만 남은 두 함수, 보라 점선 '@log_calls로 감쌈' | 위아래, '반복 ↓'가 줄 위에 |
| 그림 B | 회색 영역 둘로 '정의 시점 · 한 번'과 '호출 시점 · 부를 때마다'가 분리. 정의 쪽은 원래 함수 → ② trace → (return wrapper) → wrapper, 이름 greet가 점선으로 wrapper를 '가리킴'(③). 호출 쪽은 ① greet() → wrapper 안 ② 앞부분 → ③ 원래 함수 → return → ④ 뒷부분과 실제 출력 | 두 영역 위아래 |
| 그림 C | 세 경로가 같은 네 칸이라 차이만 보임: 정상은 회색 return 둘, 처리하는 예외는 빨간 긴 파선(원래 함수 → wrapper) + 회색 return, 전파는 빨간 점선이 wrapper 아래로 지나 호출한 쪽으로 | 경로 카드, 전파 점선은 오른쪽 가장자리 |
| 그림 D | 같은 wrapper 틀(앞·원래 함수 호출·뒤·예외·반환값)의 칸 내용만 다름. 시간 측정은 가짜 시계 결과와 '실제 숫자는 실행마다 다름' | 세 카드 |
| 남은 시각 쟁점 | 길이 약 3.1화면 | **길이 약 6.9화면** → 탭(I1)·전환(I3~I5) 제안 |

## 5. 지시서 §8 QA 기준

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| 함수 객체와 함수 호출 결과를 구별 | PASS | `functions_as_values.py` 실행(`run(greet)` / `run(greet())` → `'str' object is not callable`), 원고 2절 표 |
| `@decorator` 문법의 정확한 해석 | PASS | 공식 문서 문구(대체로 같음, 원래 함수가 이름에 잠시도 연결되지 않는 점만 다름), `when_applied.py`에서 `@`와 풀어 쓴 문법이 같은 출력 |
| 정의 시점과 호출 시점의 차이 | PASS | 호출 추적(적용은 정의 때 한 번, 첫 wrapper 호출보다 먼저), import 시점(`import_then_call.py`), 그림 B 두 영역 |
| wrapper의 원래 함수 호출 위치 | PASS | 추적: 원래 함수는 언제나 wrapper가 부름, AST: `func(*args, **kwargs)` |
| `*args`·`**kwargs` 전달 | PASS | `args_return.py`(위치·키워드 인자 출력, 인자 없는 wrapper는 `TypeError`), AST |
| 반환값의 전달·변경 여부 | PASS | `return`을 빠뜨리면 `None`, 예외 처리 Decorator의 `None` 반환, `ledger`의 `None` → 종료 코드 변경 |
| `functools.wraps` 적용 전후 | PASS | `wraps_compare.py`: `__name__`·`__doc__`·`__wrapped__` 차이, 결과는 둘 다 1100 |
| 로그의 정상·예외 경로 | PASS | `log_decorator.py`: 시작·끝 / 시작·예외 기록 후 다시 던짐 |
| 예외 처리 범위와 전파 | PASS | `error_decorator.py` 세 경로, AST(`AppError`만), `ledger`(`LedgerError`만, `KeyError` 전파) |
| 시간 측정의 비결정적 수치 처리 | PASS | 실제 값은 형식만 검증(두 번 실행, 값이 달랐음), 가짜 시계 결과는 글자까지 검증, 그림에 실제 숫자 없음, 성능 수치 서술 없음 |
| 실제 `ledger` 코드와 학습용 예제의 구분 | PASS | 9절에만 `ledger`, `[구현 사례]` 표기, 로그·시간 측정 Decorator가 `ledger`에 없음을 검증하고 명시, 학습용 예외는 `AppError`로 이름을 달리함 |
| 원고·코드·SVG의 실행 결과 일치 | PASS | §1 |
| PC·모바일의 시각적·의미적 일치 | PASS | §2 의미 일치 16항목, §4 |
| 접근성·글꼴 대체·뷰박스·겹침 | PASS(자동·눈) / 화면 낭독기 **미검증** | SVG `title`·`desc`, 색 외 구분(글자·선 모양), 두 글꼴 검사 |
| 기존 Scene 03-B~05 콘텐츠 보호 | PASS | `git diff`에 `scene-03b`·`scene-04`·`scene-05` 변경 없음, 세 장면 검사기 재실행 PASS·SVG 재생성 변경 없음 |

**교육 정확성(자체)** — 일반 Python 예제가 먼저(1~8절), `ledger`는 9절에만 / Scene 03-A(함수·Parameter·전달값·`add_tax`)와 Scene 02(import ≠ 호출) 연결, import 과정 전체는 다시 설명하지 않음 / Parameter·Argument 체계와 Type Hint는 Scene 07로 / 'Decorator만 정답이 아님', 'Decorator가 없어도 실패가 아님'을 명시 / 공식 목표 4(로그·예외·시간 측정) 세 관심사를 모두 일반 예제로 / 강사용 안내 12단계(멈출 지점 포함)·오해 교정 13개·자기 코드 탐색(찾을 것 8가지·대체 구조 4가지·AI 보조 질문 4개). 판정 **PASS(자체)**, 독립 검토 전.

## 6. 정책 체크(학습 운영 정책 §7 콘텐츠 검토 항목 자체 점검)

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| 불필요한 선·용어·장식 | PASS(자체) | 인자를 받는 Decorator·클래스 Decorator·겹치기·클로저 내부·`logging` 설정 제외. 그림 A·D에 번호 없음 |
| 흐름·관계 유형·기술 사실·구현 경계 | PASS(자체) / 검토 요청 | 호출(번호)·return(회색)·예외 두 모양·관계(점선) 구분, 시점 영역 분리. 보라 점선을 '감쌈'·'가리킴'(06)과 '만들어 냄'(05)·'참고'(01)에 함께 쓰는 것은 검토 요청 |
| 장면↔개념지도↔용어사전 ID | 미검증 | 개념지도 데이터 미작성. 개요에서 R26·R27·C15를 재사용하고 R47~R48·C31~C33만 추가, 용어 연결 주의(`decorator`·`logging`) 기록 |
| 강사 설명·학습자 혼자 탐색 | PASS(자체) | §5 교육 정확성 참고 |

## 7. 미검증

- Owner 시각 승인(GPT 독립 콘텐츠 검토는 PASS, §0 보완 반영)
- 실물 휴대전화·강의실 프로젝터·다크 테마 웹 표시·화면 낭독기
- Linux, CPython 이외 구현에서의 데모 실행(macOS·Python 3.12는 §0에서 확인. 오류 문구 `no_arguments.<locals>.wrapper() takes 0 positional arguments but 1 was given`은 Python 버전에 따라 다를 수 있음)
- 실제 교육생 코드에서 10절 활동과 AI 보조 질문이 통하는지
- 웹 상호작용 I1~I6(구현 전)
