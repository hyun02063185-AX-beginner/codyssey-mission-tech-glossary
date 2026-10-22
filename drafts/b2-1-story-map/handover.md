# B2-1 Python 학습 스토리맵 — 인수인계

> 갱신일 2026-10-22 · 단계: **`B21_SCENE01_REVISION_READY_FOR_REVIEW`** (첫 제출 `dad562e`의 독립 검토 지적 3건 보완 · 아래 '독립 검토 보완')
> 기획 기준과 Scene 01 시안까지 만들었다. **GPT 독립 콘텐츠 검토와 Owner 시각 승인 전**이며, Scene 02 이후 제작·웹 통합·배포로 진행하지 않는다.

## 기준

| 항목 | 내용 |
| --- | --- |
| 저장소·브랜치 | `codyssey-mission-tech-glossary` · `content/b2-1-story-map-foundation` (별도 worktree에서 작업, 기존 브랜치·작업 트리 변경 없음) |
| 분기 기준 | 작업 시점 `origin/main` `287de96`(B3-1 최종 병합 PR #19) |
| 구현 사례 | `m03-pocket-money-ledger` `d14e812`(작업일 `origin/main`과 같음) |
| 확인한 기준 문서 | `AGENTS.md`, `docs/mission-guides/learning-operation-policy.md`, `docs/mission-guides/workflow.md`, `content/mission-guides/main-m03/{scenario-v1.1.md, README.md, instructor-notes.md, chapters/01-cli-execution.md}`, `src/B21LearningStoryView.tsx`, `src/B21LearningStoryEntry.tsx`, `src/B31StoryMap.tsx`, `data/mission-story-maps/main-m05/concept-map.json`, M03 `docs/m03-architecture-design.md`·`ledger/*.py` |
| 공식 문서 | Python `using/cmdline`(`-m`), `library/__main__`, `library/runpy`, `reference/import`(§5.2), `tutorial/modules`(§6.4), `library/argparse`, `howto/functional`, `library/typing`, `library/csv`, `library/json`, jsonlines.org — 2026-10-22 원문 확인 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| [`scenario-v2.md`](scenario-v2.md) | 교육 목표, 학습자 수준, 8장면 구성(질문·핵심 개념·다루지 않는 것·내 코드에서 찾아보기), 공식 목표 5개·Owner 지정 입문 개념 대응표, 공통 교수법(대면 강의, 코드 읽기 두 경로, 근거 표기, 시각 약속, 오해 방지 11개), 실행 확인 결과, 기존 자료와의 관계·구버전 문제·재사용 평가 |
| [`concept-map-outline.md`](concept-map-outline.md) | 관계 유형 6종(포함·종류·호출·사용·역할·비교), 영역별 노드 후보 약 60개, 관계 후보 29개(관계선만), 비교 카드 16개(선 없음), 용어사전 연결 주의, 장면별 탐색 후보. **지도 데이터(JSON)는 만들지 않음** |
| [`scene-01/script.md`](scene-01/script.md) | 학습자 원고 10절, 강사용 안내(진행 순서·시연 코드·오해 교정·수준 조절), 이해 확인 질문 6개, 근거와 출처 표 |
| [`scene-01/design-notes.md`](scene-01/design-notes.md) | 네 구역(A 분해·B 처리 순서·C 규칙/해석·D 비교) 구조, 색 없이도 되는 의미 구분, 노트북/휴대전화 적용, 인터랙션 명세 I1~I8과 `data-*` 속성 |
| `scene-01/cli-command-desktop.svg` · `cli-command-mobile.svg` | 노트북용 1280×1672, 휴대전화용 360×3292 |
| [`scene-01/visual-qa.md`](scene-01/visual-qa.md) | 자동 검사(두 글꼴 환경), 표시 크기, 눈으로 본 결과, 원고↔그림 일치, 미검증 |
| `scene-01/_tools/` | `build.py`(생성기), `check.cjs`(검사기), `preview.cjs`(미리보기 생성) |
| `scene-01/preview/` | Pretendard VF로 그린 PNG 4장(노트북 1280·1000, 휴대전화 390·360) |

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

## Owner 판단·독립 검토 요청

1. 8장면 구성과 Scene 03 분할 제안(시나리오 §3)
2. 공통 시각 약속(시나리오 §5.5)과 Scene 01 네 구역 구조, 휴대전화 길이(약 4.1화면)
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

## 다음 단계 (승인 후에만)

1. GPT 독립 검토 지적 반영 → Owner 승인
2. Scene 02(모듈·패키지·진입점·import, 코드 읽기 두 경로) 원고·그림
3. 장면 전체 완성 뒤 개념지도 데이터 작성, Codex 웹 통합(인터랙션 I1~I8)

Push는 Owner가 수행한다: `git push origin content/b2-1-story-map-foundation`
