# Scene 07 시각·기술 QA

> 검증일 2026-10-23 · macOS(Darwin 24.6.0), Python 3.12.13(CPython), Node 24.22.0, Playwright 1.64.1(npx 캐시) + 설치된 Google Chrome 146(`PW_CHANNEL=chrome`)
> 대상: `_tools/build.py` 최종 출력 `type-hint-flow-desktop.svg`(1280×4348), `type-hint-flow-mobile.svg`(360×7992), 원고 `script.md`, 데모 `_tools/demo/`(9개), `ledger` `d14e812`
> 판정 표기: **PASS** / **수정 필요** / **미검증**. 자동 검사의 성공을 사람의 시각 확인으로 대신하지 않는다(§6은 미리보기 PNG를 직접 보고 적음).

## 1. 원고·데모·그림 대조 (`_tools/verify_demo.py`)

결과 **PASS 217항목**, 종료 코드 0(`OLD_PYTHON=/usr/bin/python3`로 3.9 확인 2항목 포함, 없으면 215항목·SKIP 1). 데모는 **저장소 밖 임시 폴더**에 복사해 실행하고(바이트코드 쓰기 끔) 끝나면 지운다.

| 검사 | 결과 |
| --- | --- |
| 원고 코드 블록 = 데모 파일(글자까지), 데모가 모두 원고에 있음 | 9/9 |
| 원고 `<!-- run: … -->` 출력 = 실제 실행(**줄 전체 일치**, 표준 출력·오류를 나온 순서대로) + 종료 코드 | 12개 실행(데모 9개 모두). `argparse_vs_hint.py`는 `--limit 10`·`abc`·`-2` = 종료 코드 0·2·1 |
| 표준 출력/표준 오류 구분 | `abc`: 표준 출력 없음, 사용법·`error:`는 표준 오류 / `-2`: `[CLI]`는 표준 출력, `[오류]`는 표준 오류 / `10`: 표준 오류 없음 |
| 그림 A 연결 | 경우 4개의 호출식(`data-call-expr`)을 실제 정의(`parameter_argument.py`의 두 `calculate_total`)에 `inspect.signature().bind()` + `apply_defaults()` → 그림의 `data-bind`와 같고, 실행 출력의 '연결: …' 줄에도 있음 × 두 판. 연결 선 = 실제로 Argument를 받은 Parameter만(기본값 경우 `quantity` 칸에 선 없음), 칩 글자 = 넣은 값, **키워드 인자만 선이 엇갈림**(칩 순서 ≠ 칸 순서), 위치 인자·순서를 바꾼 경우는 같은 순서 |
| 그림 B | 코드 줄 = 실제 소스(휴대전화에서 괄호 안에서 나눈 줄은 이어 붙여 대조), 강조한 힌트 조각 = `: int`·`: int`·`-> int`(힌트 없는 함수는 0개), AST: 두 함수 본문이 같고 다른 것은 annotation뿐, 결과 줄·`__annotations__` 줄 = 실행 출력 × 두 판 |
| 그림 C 단계(호출 추적 `sys.settrace`) | `10`: `list_transactions` 호출 → return / `abc`: **호출되지 않음**(종료 코드 2) / `-2`: 호출 → `raise ValueError` → 종료 코드 1. 그림의 단계 상태(`data-stage`) = 이 추적에서 나온 상태, 변환 칩 `'10'`→`10`·`'-2'`→`-2` = 실제 `args.limit`, `abc`는 변환 선·정수 칩 없음, 끝 선(return / 전파 `exc2` / 처리 `exc`) = 실제 경로, 실행 순서 번호 = 실행된 단계 사이(1~3 / 1) × 두 판. AST: `add_argument('--limit', type=int, …)`, `limit: int`, `if limit <= 0: raise ValueError(…)`, `argparse_without_type.py`에는 `type` 없음 |
| 그림 D | 행 6개: '표시만'·'검증' 결과 = 각 데모의 실행 출력 줄, 선언 판단(맞음/다름) = `isinstance(값, int)`(`True`는 '맞음'), 그린 값 = 실행 결과 × 두 판. 비교 카드 4개의 출력 = `none_and_defaults.py`·`typing_contract.py` 실행 출력. AST: 검증 함수의 `isinstance(int)`·`isinstance(bool)`·`amount <= 0` → `raise ValueError` 두 곳, 표시만 함수의 본문은 `return amount` 하나 |
| 나눠 그린 출력 줄 | 모든 `data-out`(노트북·휴대전화 각 28개, 그림 D 표의 값 칸 12개는 따로 대조)이 실제 출력 줄이고, 그린 글자를 이어 붙이면 그 줄(또는 '→' 뒤 부분)과 같음 |
| Python 3.10 미만 | macOS 기본 Python 3.9.6: `none_and_defaults.py`·`typing_contract.py`가 정의 줄에서 `TypeError: unsupported operand type(s) for \|: 'type' and 'NoneType'`(·`'type' and 'type'`) |
| 저장소 데모 폴더 | 파일 목록·내용이 실행 전후로 같음 |

## 2. `ledger` 사례 대조 (`_tools/verify_ledger.py`, 데모 검사와 분리)

결과 **PASS 44항목**, 종료 코드 0. `LEDGER_REPO=~/m03-pocket-money-ledger`(HEAD `d14e812` = `git fetch` 후 `origin/main`).

| 검사 | 결과 |
| --- | --- |
| 인용한 줄 | `CITED` 20줄(cli.py 32·57·164·202, services.py 97·112·124·125·197·283·357, validators.py 53·67, models.py 22·23·37·40·81·82·98)에 인용한 코드가 실제로 있음, **원고 본문에 적은 줄 번호 20개가 모두 이 목록에 있음** |
| 옮긴 코드 | 원고의 `validate_amount` 코드 = validators.py 53~67행(설명 문자열만 `...`) |
| 실행(임시 폴더, `add`로 거래 2건) | `list --limit 10` → 2줄·종료 코드 0 / `--limit abc` → argparse 사용법·`invalid int value: 'abc'`·종료 코드 2 / `--limit -2` → `[오류] limit must be positive, got -2`·`[힌트] 입력값을 다시 확인하세요.`·종료 코드 1. 오류 두 경우는 표준 출력이 비고 표준 오류에만 출력 |
| 함수·클래스 직접 확인(`ledger-probe` 13줄) | `validate_amount`: `15000`·`'15000'`·`' 15000 '` → 15000, `'abc'`·`'3.5'`·`3.5`·`True`·`0`·`-500` → `InvalidAmountError` / `Transaction(…, amount=-500, …, tags=['식비', 3])` 오류 없이 만들어짐 / `Transaction.__annotations__['amount']` = `'int'`(문자열) / `SearchCriteria().category` = `None` / `list_transactions('10')` → `TypeError` |
| 문서 기록 | `from __future__ import annotations`(4개 파일), 설계 문서·QA 보고서의 'mypy 등 정적 검사기 미실행' |
| 원본 보호 | ledger 저장소 `git status` 실행 전후 같음, 운영용 `data/` 폴더 내용 실행 전후 같음 |

## 3. SVG 자동 검사 (`_tools/check.cjs`)

두 글꼴 환경 ① **Pretendard VF**(웹 서비스 글꼴, data URL 적재·적재 확인) ② **시스템 대체 글꼴**(이 환경에서는 Apple SD Gothic Neo, 고정폭은 Chrome 기본 고정폭 글꼴). 결과 **PASS**.

| 검사 | 노트북 · Pretendard | 휴대전화 · Pretendard | 노트북 · 대체 | 휴대전화 · 대체 |
| --- | --- | --- | --- | --- |
| SVG XML 구문(`xml.etree`, verify_demo.py) | 통과 | 통과 | — | — |
| 뷰박스 이탈 / 글자 겹침 / 상자 넘침 / 상자 어긋난 겹침 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 선이 글자 위를 지남 | 0 | 0 | 0 | 0 |
| 선 끝이 상자에 닿음(실행 순서 7 · return 1 · 예외 2 · 변환 2 · 연결 7) | 통과 | 통과 | 통과 | 통과 |
| 선 모양 5종 약속 + 두 예외 선의 모양이 다름 + return·변환·연결 선 16px 안 번호 없음 | 통과 | 통과 | 통과 | 통과 |
| 상자 글자: Parameter 칸의 이름, '표시만', '실행되지 않음'(색만으로 구분하지 않음) | 통과 | 통과 | 통과 | 통과 |
| 번호 원이 그림 A·B·D 안에 없음 | 통과 | 통과 | 통과 | 통과 |
| 최소 글자 | 16단위 | 14단위 | 16단위 | 14단위 |

| 노트북·휴대전화 의미 일치(16항목) | 결과 |
| --- | --- |
| 소스 줄 4(휴대전화 나눈 줄은 이어 붙여) · 그림 A 경우 4 · 그림 C 경우 3 · 단계 상태 12 · 출력 40 · 힌트 설명 3 · 달라지는 것 4 · 넣은 값 6 · 카드 4 · 카드 정리 4 · 실행 순서 선 7 · return 1 · 예외 2(모양 포함) · 변환 2 · 연결 7 · 번호 원 8 | 모두 같음 |

**생성기 = SVG:** `build.py`를 다시 실행해도 두 SVG의 SHA-256이 같음(`7f148761…`, `2d4df44b…`). 래스터 이미지 0개.

**중간 실행에서 고친 것**
- 노트북 그림 C 넷째 열이 카드 밖으로 나감, 범례 첫 줄이 오른쪽 끝에 닿음 → 단계 폭·간격 조정, 범례를 세 줄로.
- 휴대전화에서 긴 줄(기본값 정의, `[오류] … (받은 값: -2)`, `join_tags` 오류, 비교 카드 정리 문장)이 칸 밖으로 → 한글을 1em으로 세는 고정폭 너비 어림(`mw`), 뜻이 끊기지 않는 곳에서 나누는 표(`WRAP`), 낱말 단위 나누기(괄호 묶음 유지).
- **눈으로 본 뒤 고친 것(검사기는 통과했던 것):** ① Argument 칩이 실제 글자와 몇 px 어긋나 `=`·`,`를 덮음 → 코드 조각마다 위치를 정한 글자로 그려 칩과 글자가 같은 좌표를 쓰게 함. ② 키워드 인자의 `=`까지 Parameter 밑줄 → 이름만 밑줄. ③ 기본값 카드 외의 카드에 빈 정의 줄 → '정의: 위와 같음(기본값 없음)'. ④ 휴대전화에서 나눈 줄의 들여쓰기가 사라짐(나누기 함수의 앞 공백 처리) → 고침. ⑤ `(받은 / 값: -2)`, `invalid int / value:`처럼 뜻 중간에서 끊김 → `WRAP`으로 지정. 이 뒤 '나눈 줄을 이어 붙이면 실제 출력' 검사를 추가했다.

## 4. 검사기가 틀린 것을 잡는지 (오류 주입)

장면 폴더를 임시 위치에 복사해 하나씩 고친 뒤 해당 도구를 `SCENE_DIR`로 실행했다(저장소 파일은 건드리지 않음). **14건 모두 FAIL(종료 코드 1)로 잡음.**

| # | 넣은 오류 | 도구 | 잡은 검사 |
| --- | --- | --- | --- |
| 1 | 그림 A 키워드 인자의 연결을 `price=3, quantity=1000`으로 | verify_demo | signature bind 결과 ≠ 그림 |
| 2 | 휴대전화 그림 A 위치 인자 칩 `3` → `4` | verify_demo | 칩 글자 = 넣은 값 |
| 3 | 그림 B 힌트 조각 `: int` → `: str` | verify_demo | 코드 줄 = 실제 소스, 힌트 조각 |
| 4 | 그림 C `-2`의 범위 검증 상태 `fail` → `ok` | verify_demo | 단계 상태 = 호출 추적 |
| 5 | 휴대전화 그림 C `abc`의 끝 선을 처리되는 예외(`exc`)로 | verify_demo | 끝 선 = 실제 경로(전파) |
| 6 | 그림 D `True`의 선언 판단 '맞음' → '다름' | verify_demo | `isinstance(True, int)` |
| 7 | 원고 `echo_amount.py` 출력 한 줄 변경 | verify_demo | 실행 출력 = 원고 |
| 8 | 휴대전화에서 나눠 그린 `(받은 값: -2)` → `(받은 값: 2)` | verify_demo | 이어 붙인 글자 = 실제 출력 |
| 9 | 원고 `ledger --limit -2`의 종료 코드 1 → 2 | verify_ledger | 실행 출력·종료 코드 |
| 10 | 원고 인용 줄 `services.py 124~125행` → `126~127행` | verify_ledger | 원고 줄 번호 ⊂ 확인한 줄 |
| 11 | 원고 probe의 `validate_amount(True)` 결과를 통과로 | verify_ledger | probe = 실제 호출 |
| 12 | 노트북 글자 하나를 오른쪽 밖으로(x 42 → 1242) | check.cjs | 뷰박스 이탈·상자 넘침 |
| 13 | 휴대전화에서 `data-out` 하나 삭제 | check.cjs | 의미 일치 outs |
| 14 | 연결 선에 화살촉을 붙임 | check.cjs | 연결 선 모양(화살촉 없음) |

## 5. 표시 크기

| 그림 | 1280px | 1144px | 1000px | 960px | 390px 화면(칸 358) | 360px 화면(칸 328) |
| --- | --- | --- | --- | --- | --- | --- |
| 노트북용(최소 16단위) | 16.0px | 14.3px | 12.5px | **12.0px** | — | — |
| 휴대전화용(최소 14단위) | — | — | — | — | 13.9px | **12.8px** |

길이: 노트북 약 4.8화면(1280×900 기준), 휴대전화 약 9.9화면(390×800 기준, 칸 358px) — 설계 노트 §4의 탭·전환 제안.

## 6. 눈으로 확인한 렌더링

미리보기: `preview/desktop-1280.png`, `preview/desktop-1000.png`, `preview/mobile-390.png`, `preview/mobile-360.png`(Pretendard VF). 1280·390은 전체를 구간별로 잘라 확인했고, 1000은 그림 C·D 구간, 360은 그림 A 구간을 확인했다.

| 확인 항목 | 노트북 | 휴대전화 |
| --- | --- | --- |
| 글자 잘림·겹침 | 없음 | 없음 |
| 그림 A | 정의 줄의 Parameter 밑줄, 카드 2×2. 위치 인자는 연결 선 둘이 나란히, **키워드 인자는 X자로 엇갈림**, 순서를 바꾼 경우 `price ← 3`과 굵은 주의 문장, 기본값 경우 `quantity ← 1 기본값` 칸에 선 없음. 칩이 값 글자에 정확히 맞음 | 호출식이 두 줄(`calculate_total(` / Argument), 칸 두 개가 나란히 |
| 그림 B | 두 열의 코드가 힌트 조각(파란 바탕)만 다르고, 결과 칸 두 줄이 글자까지 같음, '두 함수의 실행 결과는 같다' 띠, `__annotations__` 줄 | 힌트 정의가 괄호 안에서 두 줄, 설명 칸 세 개 |
| 그림 C | 경우 3줄이 같은 네 칸이라 멈춘 곳만 눈에 띔: `abc`는 둘째 칸 빨간 테두리 + 뒤 두 칸 회색 점선 '실행되지 않음' + 빨간 점선 `SystemExit(2)`, `-2`는 넷째 칸 빨간 테두리 + 빨간 긴 파선, `10`은 회색 return. '표시만' 칸이 파란 파선 | 세로 카드, 끝 선은 오른쪽 가장자리, 사용법·오류 줄은 뜻 단위로 나뉨 |
| 그림 D | 표에서 `-5`·`True` 행의 선언 칸이 '맞음'(굵게)인데 검증 칸은 '거부' — 선언과 규칙의 차이가 한눈에, 카드 2×2 | 넣은 값 카드 6개, 비교 카드 4개 |
| 남은 시각 쟁점 | 길이 약 4.8화면(강의 화면은 탭 권장) | **길이 약 9.9화면** → 탭(I1)·전환(I2·I4·I5) 제안 |

## 7. 지시서 §9 QA 기준

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| Parameter와 Argument 구분 | PASS | 원고 2절 표(정의의 이름 / 호출의 값 / 키워드 인자), 그림 A 칸·칩, 공식 용어집·FAQ |
| 위치·키워드 인자 대응 | PASS | `inspect.signature().bind()`로 4경우 확인, 실행 출력 '연결:', 그림의 선 엇갈림 검사 |
| Type Hint 문법 | PASS | `type_hint_basics.py` AST(annotation `int`·`int`·`-> int`), 원고 3절 표, 3.10 `\|` 문법(3.9에서 `TypeError` 확인) |
| 반환 타입과 실제 반환값 구분 | PASS | 원고 3절(`-> int` = 표시, `return` = 실행), `-> int` 함수가 `'100010001000'`을 돌려줌, `-> None` 카드 |
| Type Hint의 런타임 비강제성 | PASS | `echo_amount.py`·`hint_not_validation.py`(6값 모두 통과)·`typing_contract.py`, typing 문서 원문 인용 |
| `str \| None`과 기본값의 차이 | PASS | `none_and_defaults.py`의 2×2(`greet(None)` 통과, `category_label()` `TypeError`), `Optional` ≠ 생략 가능(typing 문서) |
| `list[str]`의 실제 의미 | PASS | `count_tags(['식비', 3])` → 2(원소 검사 없음), `join_tags`의 `TypeError`는 본문 `join()`이 냄 |
| `argparse type=int`의 입력 변환 | PASS | `'10'` → `10`(변환 칩 = 실제 `args.limit`), `type=int`를 빼면 `'10'`(str)과 `TypeError` |
| 서비스의 양수 범위 검증 | PASS | 일반 예제 `if limit <= 0` AST·`-2` 거부, `ledger` services.py 124~125행·실행 |
| 성공·변환 실패·범위 검증 실패의 경로 | PASS | 호출 추적(호출 안 됨 / 호출 후 예외 / 호출 후 return), 종료 코드 0·2·1, 표준 출력/오류 구분 × 일반 예제와 `ledger` |
| `bool`과 `int`의 Python 타입 관계 | PASS | `issubclass(bool, int)`·`isinstance(True, int)` 출력, 검증 함수의 별도 `bool` 확인, `ledger` `validate_amount(True)` 거부 |
| 실제 `ledger` 코드와 학습용 코드의 구분 | PASS | 9절에만 `ledger`, `[구현 사례]` 표기, 검증 도구 분리(`verify_ledger.py`), 일반 예제는 `ledger` 없이 실행, '여러 교육생 중 한 사람의 구현' 명시 |
| 코드·출력·SVG의 일치 | PASS | §1·§2 |
| PC·모바일 정보 의미 일치 | PASS | §3 의미 일치 16항목, 나눠 그린 줄 대조 |
| 글꼴 대체, 줄바꿈, 겹침, 잘림, 화살표 연결 | PASS(자동·눈) | §3 두 글꼴 × 두 판, §6 |
| 생성기 재현성 | PASS | 재실행 SHA-256 동일 |
| 기존 Scene 01~06 자료 보호 | PASS | `git status`: 변경은 `scene-07/`(새 폴더)와 `scenario-v2.md`·`concept-map-outline.md`·`handover.md`뿐. Scene 01~06 파일·생성기 변경 0(생성기는 불러 쓰기만) |
| 실제 교육생 코드와 달라도 적용 가능한 안내 | PASS(자체) / 효과는 미검증 | 10절 '내 코드의 모습' 4가지(힌트 없음·검사 없음·`input()`+`int()`·검증이 CLI에만), Type Hint가 없어도 참여, AI 답의 직접 확인 |
| Python 버전에 따른 오류 문자열 | 부분 확인 | 3.12.13에서 전부, 3.9.6에서 `\|` 문법만. 3.13 이상·Windows는 미검증(§9) |
| 검사기가 잘못된 출력·경로를 잡는지 | PASS | §4 오류 주입 14건 |

**교육 정확성(자체)** — 일반 예제가 먼저(1~8절), `ledger`는 9절에만 / Scene 01(명령줄 인자는 문자열, `type=int`)·03-A(Parameter·전달값·기본값)·06(`@dataclass`, `*args`는 재설명하지 않음) 연결 / '도구가 알려 줄 수 있음'은 가능성으로만, 검사기 결과를 주장하지 않음 / 두 반대 방향 오해('Type Hint가 있으면 검증 불필요', 'Type Hint는 쓸모없음')를 모두 교정 / 공식 목표 5의 '활용 이점'은 6절(읽는 사람·도구)로 / 강사용 안내 10단계(예측 먼저)·오해 교정 15개·자기 코드 탐색(찾을 것 7가지·대체 구조 4가지·AI 보조 질문 4개). 판정 **PASS(자체)**, 독립 검토 전.

## 8. 정책 체크(학습 운영 정책 §7 콘텐츠 검토 항목 자체 점검)

| 항목 | 판정 | 근거 |
| --- | --- | --- |
| 불필요한 선·용어·장식 | PASS(자체) | 고급 `typing`·위치 전용/키워드 전용 Parameter·검사기 설정·검증 라이브러리 제외. 그림 A·B·D에 번호 없음, 그림 B에 실행 선 없음 |
| 흐름·관계 유형·기술 사실·구현 경계 | PASS(자체) / 검토 요청 | 실행 순서(그림 C만)·변환·return·예외 두 모양·연결 관계 구분. 보라 점선을 '연결'(07)과 '감쌈'(06)·'만들어 냄'(05)·'참고'(01)에 함께 쓰는 것은 검토 요청 |
| 장면↔개념지도↔용어사전 ID | 미검증 | 개념지도 데이터 미작성. 개요에서 R28·R29·C03·C13·C14·C16을 재사용하고 R49·C34·C35만 추가(ID 연속 확인), 용어 연결 주의(`type-hint`·`input-validation`) 기록 |
| 강사 설명·학습자 혼자 탐색 | PASS(자체) | §7 교육 정확성 참고 |

## 9. 미검증

- GPT 독립 콘텐츠 검토, Owner 시각 승인
- 실물 휴대전화·강의실 프로젝터·다크 테마 웹 표시·화면 낭독기
- Windows·Linux, Python 3.13 이상(특히 3.14의 argparse 출력 형식)·CPython 이외 구현에서의 데모 실행. 오류 문구 `calculate_total() missing 1 required positional argument: 'quantity'`, `invalid int value: 'abc'`, `'<=' not supported between instances of 'str' and 'int'`, `sequence item 1: expected str instance, int found`는 Python 3.12.13에서만 확인했다(Owner 환경 Windows·Python 3.14.6에서 한 번 실행해 볼 것)
- 정적 타입 검사기(Pylance·mypy 등)가 이 데모에 실제로 내는 경고(설치·실행하지 않음)
- 대체 글꼴 환경의 Windows 글꼴(Malgun Gothic·Cascadia Mono) — 이번 대체 글꼴 검사는 macOS 글꼴
- 실제 교육생 코드에서 10절 활동과 AI 보조 질문이 통하는지
- 웹 상호작용 I1~I6(구현 전)
