# B2-1 Python 학습 스토리맵 — 인수인계

> 갱신일 2026-10-22 · 단계: **`B21_SCENE03A_READY_FOR_INDEPENDENT_REVIEW`**
> 기획 기준, Scene 01(독립 검토 보완 `c03c452`까지), Scene 02(표현 보완 포함), **Scene 03-A 시안**을 만들었다. Scene 03-A는 **GPT 독립 콘텐츠 검토와 Owner 시각 승인 전**이며, Scene 03-B 이후 제작·웹 통합·배포로 진행하지 않는다.

## 기준

| 항목 | 내용 |
| --- | --- |
| 저장소·브랜치 | `codyssey-mission-tech-glossary` · `content/b2-1-story-map-foundation` (별도 worktree에서 작업, 기존 브랜치·작업 트리 변경 없음) |
| 분기 기준 | 작업 시점 `origin/main` `287de96`(B3-1 최종 병합 PR #19) |
| 구현 사례 | `m03-pocket-money-ledger` `d14e812`(작업일 `origin/main`과 같음) |
| 확인한 기준 문서 | `AGENTS.md`, `docs/mission-guides/learning-operation-policy.md`, `docs/mission-guides/workflow.md`, `content/mission-guides/main-m03/{scenario-v1.1.md, README.md, instructor-notes.md, chapters/01-cli-execution.md}`, `src/B21LearningStoryView.tsx`, `src/B21LearningStoryEntry.tsx`, `src/B31StoryMap.tsx`, `data/mission-story-maps/main-m05/concept-map.json`, M03 `docs/m03-architecture-design.md`·`ledger/*.py` |
| 공식 문서 | Python `using/cmdline`(`-m`), `library/__main__`, `library/runpy`, `reference/import`(§5.2), `tutorial/modules`(§6.1·§6.4), `library/argparse`, `howto/functional`, `library/typing`, `library/csv`, `library/json`, jsonlines.org — 2026-10-22 원문 확인. Scene 02에서 `reference/simple_stmts`(import 문), `reference/compound_stmts`(§8.7 함수 정의), `library/sys_path_init` 추가 확인 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| [`scenario-v2.md`](scenario-v2.md) | 교육 목표, 학습자 수준, 8장면 구성(질문·핵심 개념·다루지 않는 것·내 코드에서 찾아보기), 공식 목표 5개·Owner 지정 입문 개념 대응표, 공통 교수법(대면 강의, 코드 읽기 두 경로, 근거 표기, 시각 약속, 오해 방지 11개), 실행 확인 결과, 기존 자료와의 관계·구버전 문제·재사용 평가 |
| [`concept-map-outline.md`](concept-map-outline.md) | 관계 유형 6종(포함·종류·호출·사용·역할·비교), 영역별 노드 후보 약 60개, 관계 후보 29개(관계선만), 비교 카드 18개(선 없음), 용어사전 연결 주의, 장면별 탐색 후보. **지도 데이터(JSON)는 만들지 않음** |
| [`scene-01/script.md`](scene-01/script.md) | 학습자 원고 10절, 강사용 안내(진행 순서·시연 코드·오해 교정·수준 조절), 이해 확인 질문 6개, 근거와 출처 표 |
| [`scene-01/design-notes.md`](scene-01/design-notes.md) | 네 구역(A 분해·B 처리 순서·C 규칙/해석·D 비교) 구조, 색 없이도 되는 의미 구분, 노트북/휴대전화 적용, 인터랙션 명세 I1~I8과 `data-*` 속성 |
| `scene-01/cli-command-desktop.svg` · `cli-command-mobile.svg` | 노트북용 1280×1672, 휴대전화용 360×3292 |
| [`scene-01/visual-qa.md`](scene-01/visual-qa.md) | 자동 검사(두 글꼴 환경), 표시 크기, 눈으로 본 결과, 원고↔그림 일치, 미검증 |
| `scene-01/_tools/` | `build.py`(생성기), `check.cjs`(검사기), `preview.cjs`(미리보기 생성) |
| `scene-01/preview/` | Pretendard VF로 그린 PNG 4장(노트북 1280·1000, 휴대전화 390·360) |
| [`scene-02/script.md`](scene-02/script.md) | 학습자 원고 11절(모듈·패키지, 학습용 변형 데모 코드 6개, 실행 순서, `__init__.py`·Namespace Package, `python main.py`/`-m 패키지`/`-m 모듈`, `__name__` 조건문, import 읽기, 두 지도, `ledger` 사례, 내 코드에서 시작점 찾기), 강사용 안내, 이해 확인 질문 6개, 근거와 출처 |
| [`scene-02/design-notes.md`](scene-02/design-notes.md) | 그림 A(패키지와 실행 시작점)·B(같은 소스의 두 지도) 구조, 두 경로의 시각 구분, 노트북/휴대전화 적용, 인터랙션 필요성 검토 I1~I6 |
| `scene-02/package-flow-desktop.svg` · `package-flow-mobile.svg` | 노트북용 1280×2290, 휴대전화용 360×4130 |
| [`scene-02/visual-qa.md`](scene-02/visual-qa.md) | 원고·데모·그림 대조, 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 정책 체크, 미검증 |
| `scene-02/_tools/` | `build.py`(생성기, Scene 01 그리기 도구 재사용), `check.cjs`(검사기), `verify_demo.py`(원고·데모·그림 대조), `preview.cjs`, `demo/`(학습용 변형 `todo`·`main.py`·`notes/`) |
| `scene-02/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-03a/script.md`](scene-03a/script.md) | 학습자 원고 10절(나누는 이유, 함수, 클래스·객체·`self`·`__init__()`, 헷갈리는 짝 4쌍, 책임 영역(설계 예시)과 데모 코드, 호출 흐름 ≠ import 의존, 모듈 분리 ≠ 계층 설계, `ledger` 사례, 내 코드에서 찾아보기), 강사용 안내, 이해 확인 질문 6개, 근거와 출처 |
| [`scene-03a/design-notes.md`](scene-03a/design-notes.md) | 그림 A(함수·클래스 문법)·B(책임을 나눈 프로그램) 구조, 시각 약속(return 선·Parameter/전달값 표기 추가), 노트북/휴대전화 적용, 인터랙션 필요성 검토 I1~I6 |
| `scene-03a/class-layer-desktop.svg` · `class-layer-mobile.svg` | 노트북용 1280×2314, 휴대전화용 360×4694 |
| [`scene-03a/visual-qa.md`](scene-03a/visual-qa.md) | 원고·데모·그림 대조(호출 추적·AST 포함), 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 정책 체크, 미검증 |
| `scene-03a/_tools/` | `build.py`(생성기, Scene 01·02 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(`basics.py`, `self_name.py`, 책임별 모듈 `todo/`) |
| `scene-03a/preview/` | Pretendard VF로 그린 PNG 4장 |

## 검증 요약

- Python 기술 내용: 공식 문서 원문 대조 + 가상 패키지 `todo`로 직접 실행(Python 3.14.6). `__init__.py`가 `__main__.py`보다 먼저 실행됨, `sys.argv`·Namespace 출력, `-n`/`--limit`/`--limit=5`, 잘못된 `int`의 오류와 종료 코드 2, `python -h`와 `python -m todo -h`의 차이, 원고의 시연 코드가 원고에 적은 출력을 그대로 냄.
- 공식 목표 5개: 모두 장면에 대응(시나리오 §4). **목표 4의 로그·시간 측정 Decorator는 `ledger`에 없음** → 일반 예시로만 가르치도록 명시.
- SVG: 검사기 PASS(Pretendard·대체 글꼴 각각, 노트북·휴대전화 의미 일치), XML 구문 통과, 1280·1000·390·360 렌더링 확인.
- 변경 범위: `drafts/b2-1-story-map/`만 추가. 보호 대상(기존 B2-1 웹 스토리·공개 경로, 9장 가이드·그림, B3-1 전체, 용어사전 canonical·기술지도, 진입 UX·내비게이션, 다른 미션) 변경 없음.

## 독립 검토 보완 (2026-10-22)

GPT 독립 검토는 교육 방향과 Scene 01 디자인 구조를 적절하다고 보고 세 가지만 수정하도록 했다. 8개 장면의 학습 목표와 교육 방향은 바꾸지 않았다.

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | 시연용 `todo` 패키지가 '두 파일 모두 빈 파일'로 읽힘 | 수정 | [원고](scene-01/script.md) '강사용 안내'에 폴더 구조·파일별 코드·실행 위치·명령·출력. `__init__.py`는 실행 코드 없음(Scene 01은 초기화 순서를 다루지 않음). [시나리오 v2 §6](scenario-v2.md)은 'Scene 01 시연용'과 '검증용 변형(`__init__.py` 출력, Scene 02 후보)'으로 나눠 기록 |
| 2 | 그림 ⑤ `show_tasks(args.limit)`와 시연 `print(args)`의 목적 | 수정(원고만) | 시연 코드가 `show_tasks()`를 정의·호출(⑤)하고, ③·④ `print`는 시연 확인용 출력으로 표시. 그림은 이미 이 흐름과 같아 **SVG·생성기 변경 없음** |
| 3 | 개념지도 R29(`Parameter ↔ Argument`, 유형 '비교')가 관계 후보 표에 있음 | 수정 | 비교 카드 C16으로 옮기고 관계 후보 표에는 관계선 후보만 남김(R30 → R29). 표 머리에 '비교는 §5 카드로만' 규칙 명시 |

검증: 원고 코드 블록을 그대로 꺼내 실행(Python 3.14.6), 그림 재생성 Git 변경 0, 검사기 PASS, 개념지도 §4에 '비교' 유형 0건·ID 연속 확인, 상대 링크 확인.

## Scene 02 제작 (2026-10-22)

기준 커밋 `c03c452`(원격과 같음 확인). 질문: **내 Python 프로그램은 어디에서 시작하고, 파일들은 어떻게 연결될까?**

- **데모(Scene 02 학습용 변형):** Scene 01의 `todo`를 `__init__.py`·`__main__.py`·`cli.py`·`actions.py`로 나누고 비교용 `main.py`, Namespace Package 예외용 `notes/hello.py`를 더했다. 실행 시점을 보이는 학습용 출력(`[불러올 때]`·`[호출될 때]`)은 실제 프로그램 코드와 구분해 표시했다.
- **확인한 순서(`python -m todo list --limit 3`):** `__init__.py` → `__main__.py` → `cli.py` → `actions.py`(불러올 때) → `main()` → `build_parser()` → `parse_args()` → `show_tasks(3)`(호출될 때). `-m todo.cli`는 `__init__.py` 다음 `cli.py`가 시작 파일이고 `__main__.py`를 쓰지 않음, `python main.py`는 `main.py`가 먼저, `python todo/cli.py`는 `ModuleNotFoundError`, `-h`에서는 `actions.py`를 불러오지만 `show_tasks()`는 호출되지 않음.
- **두 지도의 시각 구분:** import = 파란 파선·빈 화살촉·번호 없음(표준 라이브러리는 회색 칩) / 실행·호출 = 진한 실선·채운 화살촉·번호. 검사기가 선 모양과 번호 원 위치까지 확인한다.
- **검증:** `verify_demo.py` PASS(코드 6/6, 실행 출력 10/10, 그림 순서·import·호출 = 실행·AST, 실행 방식 비교 3/3, 일부러 틀린 코드로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 의미 일치 9항목), XML 구문, 1280·1000·390·360 렌더링 확인.
- **`ledger` 사례:** 설계 문서의 의존 방향(`cli → services → repository`)과 달리 `cli.py`가 `repository`도 직접 import한다는 점, `list` 호출 추적 결과, Decorator가 불러올 때 적용된다는 점을 구현 사례로만 기록했다.

**Scene 02 독립 검토 요청**

1. 그림 A·B 구성과 휴대전화 길이(약 5.1화면) — 웹에서 A/B 탭 전환(I1) 여부
2. 학습용 출력을 `import` 줄 위에 둔 데모 형태(원고에 '실제 코드에서는 넣지 않음' 명시)
3. `python todo/cli.py` 실패 사례와 `-m 모듈` 실행을 입문 장면에 넣는 깊이
4. `__main__.py`에 조건문을 쓰지 않은 예시(공식 문서 권장)와 `ledger`(조건문 사용)의 차이 설명
5. 인터랙션 필요성 판단(I2 단계별 강조·I3 지도 전환은 필요, I6 함수 정의 이동은 보류)

## Scene 02 표현 보완 (2026-10-22, 검토 대상 `0ad46d1`)

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | 모듈 = `.py` 파일, 패키지 = 폴더가 정의처럼 읽힘 | 수정 | **파일 기반 Python 소스의 입문 모델**로 표시. 용어집 정의, 내장 모듈(`sys`·`math`), 확장 모듈(`select.pyd`), Namespace Package 예외를 함께 기록. 원고·생성기·노트북/휴대전화 그림·대체 설명을 같은 뜻으로 수정 |
| 2 | "이때까지 함수는 하나도 호출되지 않았습니다" | 수정 | "이 예시에서 정의한 기능 함수(`main()`·`build_parser()`·`show_tasks()`)의 본문은 아직 실행되지 않았습니다"로. `print()` 같은 내장 함수는 최상위 코드에서 호출된다는 설명 추가. 그림에는 같은 문구가 없어 수정 없음 |

검증: 그림 배치·실행/import 구분 유지(글자만 변경), `check.cjs` PASS, `verify_demo.py` PASS. 상세는 [Scene 02 QA §4-1](scene-02/visual-qa.md).

## Scene 03-A 제작 (2026-10-22)

질문: **Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?** 시나리오의 Scene 03을 03-A(구조·문법)와 03-B(CRUD·검색·요약, 미제작)로 나눴다([시나리오 v2 §3](scenario-v2.md)). 공식 목표 5개는 여전히 모두 주 장면을 가진다(목표 2 → 03-A, 목표 1의 CRUD·검색·요약 → 03-B 보조).

- **일반 개념:** `def`·Parameter·전달값·`return`, 클래스·객체(객체마다 데이터), `__init__()` 자동 호출, `self` = Python이 자동으로 넘기는 객체를 받는 **관례적인 이름**(`self_name.py`로 확인), 함수 ≠ 메서드(`a.complete()` = `Task.complete(a)`).
- **설계:** 모델·저장소·서비스·CLI는 **Python 문법이 아닌 설계의 한 예**로 명시. 모듈 분리 ≠ 계층 설계.
- **데모(학습용 변형):** `todo`를 책임별 모듈로 나눔(메모리 저장소, 목록 조회만). 학습용 출력 없이 호출 순서를 `sys.setprofile` 추적으로 확인. `--limit 0`에서 규칙 판단(서비스)과 오류 표시(CLI)가 나뉨.
- **핵심 대조:** `services.py`에는 import가 없지만 ⑦에서 저장소의 `all()`을 호출(받은 객체 사용) / `cli.py`는 서비스·저장소를 모두 import하고 저장소를 직접 만듦 → CLI → 서비스 → 저장소 한 줄이 아님. `ledger`도 import가 설계 문서의 사슬보다 많음(구현 사례로만 기록).
- **시각 약속:** Scene 02 약속 재사용 + **return = 회색 가는 실선·빈 화살촉·번호 없음** 추가, 코드 속 Parameter(초록 밑줄)·전달값(갈색). 그림 A에는 흐름 화살표 없음.
- **검증:** `verify_demo.py` PASS 33항목(원고 코드 8/8, 실행 출력 5/5 줄 전체 일치, 그림 코드 줄·실행 결과·객체 상태, 호출·부른 쪽·번호·return = 추적, import = AST, 일부러 틀린 번호로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 선 모양 약속 3종, 의미 일치 11항목), XML 구문, 1280·1000·390·360 렌더링 확인.

**Scene 03-A 독립 검토 요청**

1. 03-A/03-B 분리 경계: 03-A에서 목록 조회 한 기능만 쓴 범위
2. 새 시각 약속(return 회색 선, Parameter 밑줄·전달값 갈색)과 계층 열(레인) 배치
3. `self` 설명의 깊이(관례적 이름 시연 `self_name.py`를 입문 장면에 넣는 것)
4. "호출은 있지만 import는 없다" 사례의 난이도
5. 휴대전화 길이 약 5.8화면과 탭 전환(I1)

## Owner 판단·독립 검토 요청

1. 8장면 구성과 Scene 03 분할 제안(시나리오 §3)
2. 공통 시각 약속(시나리오 §5.5, Scene 03-A에서 return 선 추가)과 Scene 01 네 구역 구조, 휴대전화 길이(Scene 01 약 4.1, Scene 02 약 5.1, Scene 03-A 약 5.8화면)
3. 가상 예시 `todo` 유지 여부, `ledger` 사례 절의 분량
4. 강사용 안내의 진행 순서와 시연 방식(가상 패키지 실습 준비 필요)
5. 기존 학습 체험 3개(Iterator·Decorator·Type Hint) 재사용 범위(시나리오 §7.2)
6. 개념지도 관계 유형 6종과 노드 묶음 방식(개요 §2·§8)
7. 구버전 문제 기록(시나리오 §7.3) — V01 그림의 순서 문제 등은 기존 자료라 이번에 고치지 않았다

## 남은 미검증·확인 필요

- 코디세이 공식 미션 원문 대조: 공식 목표 1~5 문구, "옵션 표기는 `-`로 통일" 문구 해석, 권장 실행형 `budget_app`, 표준 라이브러리 제한(시나리오 §7.4)
- 실물 휴대전화·프로젝터·다크 테마 웹 표시·화면 낭독기, macOS·Linux 글꼴
- 다른 교육생 구현에서 '내 코드에서 찾아보기'가 통하는지(대체 구조 표는 예상 기반)
- 대면 강의 시간 배분과 학습 효과(시범 운영 전)
- Scene 02 데모의 macOS·Linux 실행(경로 표시, `python`/`python3` 명령 이름), Python 3.14 이외 버전의 오류 문구

## 다음 단계 (승인 후에만)

1. Scene 03-A GPT 독립 검토 지적 반영 → Owner 승인
2. Scene 03-B(CRUD·검색·요약을 계층 위에서 따라가기) 원고·그림 — 승인 전에는 시작하지 않음
3. 장면 전체 완성 뒤 개념지도 데이터 작성, Codex 웹 통합(Scene 01 I1~I8, Scene 02 I1~I5, Scene 03-A I1~I5)

Push는 Owner가 수행한다: `git push origin content/b2-1-story-map-foundation`
