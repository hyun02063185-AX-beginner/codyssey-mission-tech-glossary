# 본과정 M08 기술용어 원천 추출

- 과정: 본과정
- 미션: M08 — 컴퓨터가 갑자기 느려지거나 멈췄을 때 원인 찾아 고치기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M08 — 컴퓨터가 갑자기 느려지거나 멈췄을 때 원인 찾아 고치기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081e4afddc74379e1602b?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| process | Process | Linux/OS | concept | 핵심 | 장애 관제 대상 | 좋음 |
| thread | Thread | Linux/OS | concept | 핵심 | Deadlock·top -H·ps -L 분석 | 좋음 |
| Memory Leak | Memory Leak | Linux/OS | failure concept | 핵심 | OOM 장애 원인 | 좋음 |
| OOM | Out of Memory | Linux/OS | failure state | 핵심 | 메모리 고갈 장애 | 좋음 |
| MemoryGuard | MemoryGuard | Operations | watchdog/component | 보조 | 강제 종료 로그 식별 | 좋음 |
| MEMORY_LIMIT | MEMORY_LIMIT | Config | environment variable | 핵심 | Before/After 실험 변수 | 보통 |
| CPU Spike | CPU Spike | Linux/Operations | failure concept | 핵심 | CPU 급상승 장애 | 좋음 |
| Watchdog | Watchdog | Operations | concept/component | 핵심 | CPU 과점유 종료 로그 | 좋음 |
| CPU_MAX_OCCUPY | CPU_MAX_OCCUPY | Config | environment variable | 핵심 | CPU 실험 변수 | 보통 |
| Deadlock | Deadlock | Concurrency | concept | 핵심 | 락 대기 장애 | 좋음 |
| PID | Process ID | Linux/OS | identifier | 핵심 | 프로세스 존재 증명 | 좋음 |
| lock | Lock | Concurrency | concept | 핵심 | Deadlock 원인 추론 | 좋음 |
| MULTI_THREAD_ENABLE | MULTI_THREAD_ENABLE | Config | environment variable | 핵심 | deadlock 재현/회피 변수 | 보통 |
| Description | Description | Docs | report section | 보조 | 기술 리포트 필수 섹션 | 불필요 |
| Evidence & Logs | Evidence & Logs | Operations/Docs | report section | 핵심 | 증거 기반 분석 | 좋음 |
| Root Cause Analysis | Root Cause Analysis | Operations | concept | 핵심 | 근본 원인 분석 | 좋음 |
| Workaround | Workaround | Operations | concept | 핵심 | 임시 조치 | 좋음 |
| Verification | Verification | QA/Operations | concept | 핵심 | Before/After 검증 | 좋음 |
| Round-Robin | Round-Robin Scheduling | OS/Algorithm | scheduling | 보조 | 스케줄링 추론 보너스 | 좋음 |
| FCFS | First-Come First-Served | OS/Algorithm | scheduling | 보조 | 스케줄링 추론 보너스 | 좋음 |
| Priority | Priority Scheduling | OS/Algorithm | scheduling | 보조 | 스케줄링 추론 보너스 | 좋음 |
| ps | ps | Linux | command | 핵심 | 프로세스 확인 | 좋음 |
| top | top | Linux | command | 핵심 | CPU/MEM 관제 | 좋음 |
| top -H | top -H | Linux | command | 핵심 | 스레드 단위 관제 | 좋음 |
| ps -L | ps -L | Linux | command | 핵심 | 스레드 확인 | 좋음 |
| Docker | Docker | Container | tool | 보조 | 격리 환경 권장 | 보통 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Resource Exhaustion | OS/Operations | OOM·CPU spike를 묶는 상위 장애 개념 | 좋음 |
| Concurrency | Programming/OS | thread·lock·deadlock 이해 배경 | 좋음 |
| Before/After Experiment | QA/Operations | 환경변수 변경 효과 비교 | 좋음 |
| Observability | Operations | 관제 데이터와 로그를 증거로 활용 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Mutex | Concurrency | lock의 대표 구현 | 좋음 |
| Race Condition | Concurrency | Deadlock과 대비되는 동시성 문제 | 좋음 |
| Heap Memory | OS/Programming | Memory Leak 이해 심화 | 좋음 |
| Scheduler | OS | Round-Robin/FCFS/Priority의 상위 개념 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 26
- required 개념 수: 4
- related 개념 수: 4
- 웹툰 우선 후보 예: process, thread, Memory Leak, OOM, MemoryGuard, CPU Spike, Watchdog, Deadlock, PID, lock
