# B2-1 미션 개념지도 — 개요 (후보)

> **상태:** 후보 정리. **최종 지도 데이터(JSON)는 만들지 않았다.** 노드·관계·탐색 순서는 GPT 독립 검토와 Owner 승인 뒤 확정한다.
> 기준: [시나리오 v2](scenario-v2.md) · 2026-10-22 · 참고 구조: B3-1 [`concept-map.json`](../../data/mission-story-maps/main-m05/concept-map.json)(스키마 형식만 참고, 내용·배치 복제 안 함)

## 1. 이 지도가 답하는 질문

**스토리에서 만난 Python 개념들은 서로 어떤 관계이고, 내 코드에서는 어디에 있을까?**

정책 §3에 따라 미션과 관련된 개념만 골라 **좁은 맥락에서 관계를 밀도 있게** 보여 준다. 정확한 정의·예외는 용어사전으로 넘긴다. 처음 화면에서는 핵심 노드와 관계만 강조하고 보충 개념은 탐색할 때 드러낸다.

## 2. 관계 유형 (6종)

| 유형 | 뜻 | 방향 | 쓰는 예 | 쓰지 않는 예 |
| --- | --- | --- | --- | --- |
| **포함** | A 안에 B가 구성요소로 들어 있다 | A → B | 패키지 ⊃ 모듈, 패키지 ⊃ `__init__.py`, 명령줄 ⊃ 옵션 | EC2 ⊃ ENI처럼 '연결된 것'을 포함으로 그리기(B3-1의 교훈) |
| **종류** | B는 A의 한 종류다(is-a) | B → A | Generator → Iterator, 짧은 옵션 → 옵션, JSONL → 텍스트 파일 형식 | 비슷한 역할을 '종류'로 묶기 |
| **호출** | 실행 중 A가 B를 부른다(실제 실행 경로) | A → B | `__main__.py` → `main()`, `main()` → `parse_args()`, Wrapper → 원래 함수 | import 연결, 정의 관계 |
| **사용** | A가 B를 이용한다. 실행 순서를 뜻하지 않는다 | A → B | 모듈 A가 모듈 B를 import, `parse_args()`가 `sys.argv`를 읽음, for문이 Iterator 프로토콜을 씀 | 실행 순서를 암시하는 번호 |
| **역할** | A는 B를 위한 것이다 / A가 B를 맡는다 | A → B | Decorator → 공통 관심사 분리, Type Hint → 입출력 계약 표시, `__main__.py` → 패키지 실행 진입점, 저장소 계층 → 파일 읽기·쓰기 | 두 개념의 비교 |
| **비교** | 헷갈리기 쉬운 두 개념. **선으로 잇지 않고 비교 카드(§5)로만** 둔다. §4 관계 후보 표에는 넣지 않는다 | 없음 | 카드 C16 Parameter ↔ Argument, C06 `__init__.py` ↔ `__init__()`, C07 import ↔ 함수 호출 | 관계선, 관계 후보 ID(R…) |

**흐름과 관계를 섞지 않는다.** 실제 실행 순서(예: `python -m todo list` → `__main__.py` → `main()` → `parse_args()` → 처리 함수)는 지도 관계가 아니라 **장면의 실행 경로(path)**로만 표시한다. 선행 학습 순서는 그래프 관계로 그리지 않고 `learningOrder`(§5)로 따로 둔다.

## 3. 영역과 노드 후보

`importance`: core = 첫 화면에 보이는 핵심, supplementary = 탐색할 때 드러나는 보충. `termId`는 이번 작업에서 `content/terms/`에 존재를 확인한 ID만 적었다(—: 없음).

| 영역 | 노드 후보 | importance | 장면 | termId 후보 |
| --- | --- | --- | --- | --- |
| 실행·CLI | CLI | core | 01 | `cli`, `python-cli` |
| | GUI | supplementary | 01 | — |
| | 명령줄 인자(command-line argument) | core | 01 | — |
| | 하위 명령(sub-command) | core | 01 | — (`commit-subcommand`는 Git 용어라 연결하지 않음) |
| | 옵션 · 짧은 옵션 · 긴 옵션 | core / supplementary ×2 | 01 | — |
| | 옵션 값 | supplementary | 01 | — |
| | Python의 `-m` | core | 01·02 | — |
| | `sys.argv` | core | 01 | — |
| | argparse | core | 01 | — |
| | `ArgumentParser` · `add_argument()` · `add_subparsers()` · `parse_args()` · Namespace | supplementary | 01 | — |
| 구조 | 모듈 | core | 02 | `module`(주의 §6) |
| | 패키지 | core | 02 | — |
| | `__init__.py` | core | 02 | — (`init`은 클래스 메서드라 연결 금지 §6) |
| | Namespace Package | supplementary | 02 | — |
| | `__main__.py` | core | 02 | — (`main-py`는 `main.py` 파일 이름 관례라 연결 금지 §6) |
| | `if __name__ == "__main__"` | supplementary | 02 | — |
| | import | core | 02 | — |
| | 진입점 | core | 01·02 | — |
| 함수·클래스·계층 | 함수 · 함수 호출 | core | 02·03-A | `function` |
| | 클래스 · 객체 · `__init__()` 메서드 · `self` | core / core / supplementary / supplementary | 03-A | `class`, `init` |
| | 모델 · 저장소 · 서비스 · CLI 계층 | core | 03-A·03-B | `layered-architecture`, `repository-pattern` |
| | CRUD · 검색 · 요약 | core | 03-B | `crud` / `filter`(주의 §6) / `summary-aggregation`(주의 §6) |
| | 리스트 · 딕셔너리 | core | 03-B | `list-dict` |
| | ID(식별자) · 인덱스(위치) | core / supplementary | 03-B | — (`primary-key`는 DB 테이블 용어라 '확장'으로만, 주의 §6) |
| | 메모리 속 데이터 | core | 03-B·04 | — (`persistence`는 영구 저장 쪽 노드에 연결) |
| 데이터·파일 | 영구 저장 · 파일 입출력 | core | 04 | `file-io` |
| | JSON · JSONL | core | 04 | `json`, `json-lines` |
| | CSV · `csv.DictReader/DictWriter` | core / supplementary | 04 | `csv` |
| | 직렬화(`json.dumps/loads`) | supplementary | 04 | `serialization` |
| 반복·스트리밍 | Iterable · Iterator · Generator · `yield` | core | 05 | — / `iterator` / `generator` / `yield` |
| | `next()` · `StopIteration` | supplementary | 05 | — |
| | 스트리밍 · 메모리 사용 | core | 04·05 | `streaming` |
| | `deque(maxlen=N)` | supplementary(구현 사례) | 05 | `deque` |
| 공통 관심사 | Decorator · Wrapper · `functools.wraps` | core / core / supplementary | 06 | `decorator` |
| | 공통 관심사(로그·예외 처리·시간 측정) | core | 06 | `logging` |
| 계약·검증 | Parameter · Argument | core | 07 | — |
| | Type Hint | core | 07 | `type-hint` |
| | 값 검증(Validator) | core | 07 | — |
| | argparse `type=` 변환 | supplementary | 01·07 | — |
| 코드 읽기 | 모듈 의존 관계 · 함수 실행 흐름 | core | 02·08 | — |

노드 수: core 약 40, 전체 약 60(묶음 노드 분리 방식에 따라 달라짐). 첫 화면에는 장면별 core만 보이게 하는 방식을 제안한다.

## 4. 관계 후보 (예시 33개)

이 표는 **관계선으로 그릴 후보**만 담는다(포함·종류·호출·사용·역할). 비교는 §5 비교 카드로만 다루며 같은 두 개념을 이 표와 §5에 중복해 올리지 않는다. (2026-10-22 독립 검토 보완: 이전 R29 `Parameter ↔ Argument` 비교를 §5 C16으로 옮기고 이전 R30을 R29로 바꿈)

근거: P = Python 공식 문서, X = 이번 작업의 실행 확인, R = `ledger` 구현 사례(`d14e812`).

| ID | from | to | 유형 | 라벨 | 근거 | 장면 |
| --- | --- | --- | --- | --- | --- | --- |
| R01 | 명령줄 | 하위 명령 · 옵션 · 옵션 값 | 포함 | 구성요소 | P(argparse), X | 01 |
| R02 | 짧은 옵션 | 옵션 | 종류 | 한 글자 이름(`-n`) | P(argparse), X | 01 |
| R03 | 긴 옵션 | 옵션 | 종류 | 긴 이름(`--limit`) | P, X | 01 |
| R04 | Python의 `-m` | 모듈 · 패키지 | 사용 | 실행 대상으로 찾음 | P(cmdline) | 01·02 |
| R05 | `parse_args()` | `sys.argv` | 사용 | 기본 입력 | P(argparse) | 01 |
| R06 | `parse_args()` | Namespace | 역할 | 해석 결과를 담아 반환 | P, X | 01 |
| R07 | `parse_args()` | `add_argument()`로 등록한 규칙 | 사용 | 규칙 참고(실행 순서 아님) | P | 01 |
| R08 | argparse | 명령줄 인자 | 역할 | 해석(Parsing) | P | 01 |
| R09 | 패키지 | 모듈 | 포함 | 모듈 묶음 | P(tutorial §6.4) | 02 |
| R10 | 패키지(일반) | `__init__.py` | 포함 | 초기화 파일 | P(import §5.2) | 02 |
| R11 | Namespace Package | 패키지 | 종류 | `__init__.py` 없는 패키지 | P(import §5.2.2) | 02 |
| R12 | 패키지 | `__main__.py` | 포함 | `-m` 실행 시 main 모듈 | P(`__main__`) | 02 |
| R13 | `__main__.py` | 진입점 | 역할 | 패키지 실행 진입점 | P | 02 |
| R14 | `__main__.py` | `main()` | 호출 | 실행 시작 | R(`ledger/__main__.py`) | 02 |
| R15 | 모듈 | 모듈 | 사용 | import(연결, 순서 아님) | P | 02 |
| R16 | 클래스 | 객체 | 역할 | 객체를 만드는 틀 | P(tutorial §9) | 03-A |
| R17 | CLI 계층 | 서비스 계층 | 호출 | 기능 요청 | R(`cli.py` → `LedgerService`), X(03-A 데모 ⑥) | 03-A·03-B |
| R18 | 서비스 계층 | 저장소 계층 | 호출 | 저장·조회 요청(import 없이 받은 객체를 호출할 수 있음) | R, X(03-A 데모 ⑦) | 03-A·03-B |
| R19 | 저장소 계층 | 파일 입출력 | 역할 | 파일 읽기·쓰기 담당 | R | 03-A·04 |
| R20 | JSONL | 텍스트 파일 형식 | 종류 | 한 줄 = JSON 값 하나 | jsonlines.org | 04 |
| R21 | CSV | 텍스트 파일 형식 | 종류 | 행·열 구분 | P(csv) | 04 |
| R22 | Iterable | Iterator | 역할 | `iter()`로 Iterator를 내준다 | P(Functional HOWTO) | 05 |
| R23 | Generator | Iterator | 종류 | Iterator의 한 종류 | P | 05 |
| R24 | `yield` | Generator | 역할 | 값을 내보내고 일시정지 | P | 05 |
| R25 | for문 | Iterator | 사용 | `next()` 반복 | P | 05 |
| R26 | Decorator | 공통 관심사 분리 | 역할 | 공통 동작 덧붙이기 | P(glossary) | 06 |
| R27 | Wrapper | 원래 함수 | 호출 | 앞뒤에 동작 추가 | P, R(`handle_errors`) | 06 |
| R28 | Type Hint | 입출력 계약 | 역할 | 기대 형식 표시(런타임 비강제) | P(typing) | 07 |
| R29 | 값 검증 | Argument | 역할 | 넣은 값의 범위·형식 검사 | R(`validators.py`) | 07 |
| R30 | 수정·삭제(Update·Delete) | ID로 찾기(Read) | 사용 | 대상을 id로 찾은 뒤 바꾸거나 지움 | X(03-B `crud_basics.py`·`cashbook` 추적 ⑦→⑧) | 03-B |
| R31 | 검색 · 요약 | 원본 목록 | 사용 | 원본을 읽어 새 목록·새 값을 만듦(원본은 그대로) | X(03-B `search_summary.py`) | 03-B |
| R32 | 요약 | `sum()` · `len()` | 사용 | 합계·건수 계산 | P(functions), X | 03-B |
| R33 | 저장소 계층 | 데이터 변경(추가·수정·삭제) | 역할 | 데이터를 바꾸는 곳(이 예시, AST 확인) | X(03-B `verify_demo.py`), R(`ledger` repository) | 03-B |

## 5. 비교 카드 후보 (선을 긋지 않음)

| ID | 두 개념 | 핵심 차이 | 장면 |
| --- | --- | --- | --- |
| C01 | Python 옵션(`-m`) ↔ 프로그램 옵션(`--limit`) | 해석 주체가 다르다. 모듈 이름 뒤는 프로그램 몫 | 01 |
| C02 | `-h` ↔ `--help` | 같은 옵션의 짧은·긴 이름. 위치에 따라 Python/프로그램 도움말 | 01 |
| C03 | 명령줄 인자 ↔ 함수 인자 | 문자열로 도착해 argparse가 해석 / Python 값이 매개변수에 바로 연결 | 01·07 |
| C04 | CLI ↔ GUI | 문자 명령 / 화면 요소 조작 | 01 |
| C05 | 모듈 ↔ 패키지 | `.py` 파일 / 모듈 묶음(점 이름 구조) | 02 |
| C06 | `__init__.py` ↔ `__init__()` | 패키지 파일 / 객체 초기화 메서드 | 02·03-A |
| C07 | import(모듈 연결) ↔ 함수 호출(실행) | 이름을 쓸 수 있게 연결 / 실제 실행 | 02 |
| C08 | 모듈 의존 관계 ↔ 함수 실행 흐름 | import 단서 / 호출 단서. 두 그림은 다를 수 있다 | 02·03-A·08 |
| C09 | JSONL ↔ CSV | 한 줄 = JSON 값(중첩 가능) / 행·열(평면 표) | 04 |
| C10 | 저장 형식 ↔ 가져오기·내보내기 형식 | 프로그램이 계속 쓰는 파일 / 교환용 파일 | 04 |
| C11 | Iterable ↔ Iterator | 반복할 수 있는 대상 / 다음 값을 꺼내는 진행 상태 | 05 |
| C12 | `yield` ↔ `return` | 일시정지 후 재개 / 함수 종료 | 05 |
| C13 | Type Hint ↔ 값 검증 | 계약 표시(비강제) / 실행 중 실제 검사 | 07 |
| C14 | argparse `type=int` ↔ Type Hint `int` | 실행 중 문자열을 변환 / 변환·검사 없음 | 01·07 |
| C15 | `@dataclass` ↔ `@handle_errors` | 같은 `@` 문법, 다른 목적(클래스 생성 보조 / 함수 감싸기) | 06 |
| C16 | Parameter ↔ Argument | 함수 정의에서 값을 **받는 자리**(이름) / 함수를 부를 때 **실제로 넣은 값**. 근거: Python 용어집 parameter·argument | 07 (01의 C03에서 예고) |
| C17 | 함수 ↔ 메서드 | 모듈에 정의, 이름으로 부름 / 클래스 안에 정의, 객체를 통해 부르며 그 객체가 첫 Parameter(`self`)로 전달 | 03-A |
| C18 | 모듈 분리 ↔ 계층 설계 | 파일을 나누는 일 / 책임을 나누는 일(한 파일 안에서도 가능) | 03-A |
| C19 | 검색 ↔ 요약 | 조건에 맞는 항목을 **고름**(새 목록) / 여러 값을 **계산**(새 값). 둘 다 원본은 그대로 | 03-B |
| C20 | 인덱스(위치) ↔ ID | 삭제·추가로 바뀜 / 항목마다 고정된 번호. 수정·삭제 대상은 ID로 찾음 | 03-B |
| C21 | 메모리 속 변경 ↔ 영구 저장 | 프로그램이 끝나면 사라짐 / 파일 등에 남음 | 03-B·04 |

## 6. 용어사전 연결 주의 (canonical은 수정하지 않음)

| termId | 주의 | 처리 제안 |
| --- | --- | --- |
| `module` | JavaScript ES Module 중심. Python 모듈·패키지 구분이 없다 | 지도 패널에서 Python 정의를 먼저 보여 주고 사전 연결은 '확장'으로 표시. 사전 보강은 별도 Owner Gate |
| `init` | 클래스의 `__init__` 메서드 정의. `__init__.py`와 다르다 | `__init__()` 노드에만 연결. `__init__.py` 노드에는 연결하지 않음 |
| `main-py` | `main.py` 파일 이름 관례 | `__main__.py` 노드에 연결하지 않음 |
| `commit-subcommand` | Git 하위 명령 | 하위 명령 노드에 연결하지 않음 |
| `filter` | 예비 M03의 '판별 기준 격자'(본보기) 뜻이 섞여 있다 | 03-B 검색 노드에는 '조건으로 고르기' 정의를 지도 패널에 먼저 두고, 사전 연결은 '확장'으로만 표시 |
| `summary-aggregation` | 텍스트 요약(긴 기록을 압축)과 데이터 집계(합계·분류별)가 섞여 있다 | 03-B 요약 노드는 '값 계산(집계)' 정의를 먼저 두고 사전 연결은 '확장'. `aggregate-function`은 SQL 함수라 연결하지 않음 |
| `primary-key` | 데이터베이스 테이블의 기본 키 | ID 노드에 '확장(데이터베이스에서는)'으로만 연결 |
| 없음 | argparse, package, `__main__.py`, Parameter/Argument, Iterable, 옵션 | 사전 신규 항목은 이번 범위 밖. 연결 없음으로 표시하고 미구현으로 기록 |

## 7. 탐색 후보

| 장면 | 기본 선택 | 추가 시연 | 이유 |
| --- | --- | --- | --- |
| 01 | Python의 `-m` | C01, R05→R06 | 해석 주체 구분 → `sys.argv` → Namespace |
| 02 | `__main__.py` | R10·R12, C07, C08 | 패키지 구조와 두 읽기 경로 |
| 03-A | 서비스 계층 | R16, R17·R18, C17, C18, C08 | 클래스와 객체, 계층 책임과 호출 방향, 호출 ≠ import |
| 03-B | CRUD | C20, R30, C19·R31, R17·R18·R33, C21 | 위치 대신 ID → 수정·삭제는 조회 위에 → 검색·요약은 원본 그대로 → 한 기능의 책임 → 메모리 ≠ 저장(04로) |
| 04 | JSONL | C09, C10 | 형식 차이와 저장/교환 구분 |
| 05 | Generator | R23, C11 | Iterator의 한 종류라는 핵심 |
| 06 | Decorator | R26, R27, C15 | 역할과 감싸기 |
| 07 | Type Hint | C16, C13, C14, R29 | 받는 자리/넣은 값 → 계약·검증·변환의 층위 |
| 08 | 선택 없음 | 자유 탐색 | 자기 코드 탐색으로 연결 |

**learningOrder 후보(그래프 밖):** L1 Scene 01(명령 구조) → Scene 02(파일 구조), L2 함수·호출 → Decorator, L3 Iterator → Generator → 스트리밍 소비 방식, L4 Parameter/Argument → Type Hint.

## 8. 미결정

- 노드 묶음 방식(argparse 함수 4개를 한 노드로 둘지), 보충 노드의 첫 화면 노출 범위
- B3-1 개념지도 엔진 재사용 여부와 영역 배치(웹 통합 담당 Codex·Owner 결정)
- 사전에 없는 핵심 용어의 신규 작성 여부(Owner Gate)
