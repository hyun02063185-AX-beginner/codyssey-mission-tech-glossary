# 본과정 M03 기술용어 원천 추출

- 과정: 본과정
- 미션: M03 — 나만의 용돈 기입장 프로그램 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M03 — 나만의 용돈 기입장 프로그램 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e03808192a875fc8153cf7ad3?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Python 3.10+ | Python | Programming | language/runtime | 핵심 | CLI 애플리케이션 구현 언어 | 보통 |
| CLI | Command Line Interface | Programming | interface | 핵심 | 콘솔 가계부 실행 인터페이스 | 좋음 |
| --help | --help option | Programming | CLI option | 보조 | 도움말 제공 | 불필요 |
| Transaction | Transaction Model | Programming/Data | model | 핵심 | 거래 데이터 모델 | 좋음 |
| dataclass | Python dataclass | Programming | language feature | 핵심 | Transaction 구조 구현 후보 | 좋음 |
| class | Class | Programming | concept | 핵심 | 최소 2개 이상의 클래스 사용 | 좋음 |
| 입력 검증 | Input Validation | Programming | concept | 핵심 | 잘못된 입력 방지 | 좋음 |
| JSONL | JSON Lines | Data | data-format | 핵심 | 영구 저장 포맷 선택지 | 좋음 |
| CSV | CSV | Data | data-format | 핵심 | 저장 및 import/export 포맷 | 좋음 |
| 파일 I/O | File I/O | Programming/OS | concept | 핵심 | 파일 기반 영구 저장 | 좋음 |
| 영구 저장 | Persistence | Data | concept | 핵심 | transactions/categories/budgets 저장 | 좋음 |
| generator | Generator | Programming | concept | 핵심 | 파일 전체 로드 없이 스트리밍 | 좋음 |
| yield | yield | Programming | keyword | 핵심 | 제너레이터 구현 핵심 | 좋음 |
| streaming | Streaming | Programming/Data | concept | 핵심 | list/search를 순차 처리 | 좋음 |
| summary | Summary/Aggregation | Data | operation | 핵심 | 월별 총수입/총지출/잔액 집계 | 보통 |
| TOP N | Top N | Data/Algorithm | concept | 보조 | 카테고리 상위 N개 출력 | 좋음 |
| import/export | Import / Export | Data | operation | 핵심 | CSV 데이터 입출력 | 보통 |
| schema | Schema | Data | concept | 핵심 | CSV 필드 구조 고정 | 좋음 |
| decorator | Decorator | Programming | language feature | 핵심 | 공통 관심사 분리 | 좋음 |
| type hint | Type Hint | Programming | language feature | 핵심 | 유지보수 가능한 설계 | 좋음 |
| module | Module | Programming | structure | 핵심 | 최소 3개 이상 모듈 분리 | 좋음 |
| stack trace | Stack Trace | Programming | debugging | 보조 | 사용자에게 그대로 노출하지 않음 | 좋음 |
| exit code | Exit Code | OS/Programming | concept | 핵심 | 오류 시 0이 아닌 종료코드 | 좋음 |
| backup | Backup | Data | operation | 보조 | 보너스 요구 | 보통 |
| atomicity | Atomicity | Data/OS | concept | 보조 | update/delete 저장 원자성 강화 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| CRUD | Programming/Data | add/list/update/delete 기능의 상위 개념 | 좋음 |
| Serialization | Data | Python 객체를 JSONL/CSV로 저장하는 과정 | 좋음 |
| Iterator | Programming | generator 동작 이해의 배경 개념 | 좋음 |
| Separation of Concerns | Software Design | 모듈 책임 경계 설계 | 좋음 |
| Temporary File / Replace Strategy | OS/Data | 파일 기반 update/delete 안전성 이해 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Exception Handling | Programming | 입력·파일 오류 처리 확장 | 좋음 |
| Context Manager | Programming | 파일 I/O의 안전한 열기/닫기 | 좋음 |
| Standard Library | Programming | 외부 pip 패키지 금지 조건과 연결 | 보통 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 25
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: CLI, Transaction, dataclass, class, 입력 검증, JSONL, CSV, 파일 I/O, 영구 저장, generator
