# 본과정 M10 기술용어 원천 추출

- 과정: 본과정
- 미션: M10 — 파일이 언제 어떻게 바뀌었는지 기록하는 작은 프로그램 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M10 — 파일이 언제 어떻게 바뀌었는지 기록하는 작은 프로그램 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e0380816eb1cec9a4338c6e49?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Git | Git | Git/Algorithm | system concept | 핵심 | Mini Git 모사 대상 | 좋음 |
| CLI | Command Line Interface | Programming | interface | 핵심 | Mini Git 인터페이스 | 보통 |
| INIT | INIT command | Git/Algorithm | command | 핵심 | 저장소 초기화 | 불필요 |
| BRANCH | BRANCH command | Git/Algorithm | command | 핵심 | 브랜치 관리 | 불필요 |
| SWITCH | SWITCH command | Git/Algorithm | command | 핵심 | 브랜치 전환 | 불필요 |
| COMMIT | COMMIT command | Git/Algorithm | command | 핵심 | 커밋 생성 | 불필요 |
| commit node | Commit Node | Graph/Git | node/model | 핵심 | hash/message/author/timestamp/parents 보유 | 좋음 |
| DAG | Directed Acyclic Graph | Graph/Algorithm | graph structure | 핵심 | 커밋 그래프 구조 | 좋음 |
| hash | Commit Hash | Git | identifier | 핵심 | 세션 내 유일 커밋 식별자 | 좋음 |
| parent | Parent Commit | Git/Graph | relationship | 핵심 | 커밋 연결 관계 | 좋음 |
| inverted index | Inverted Index | Data Structure | index | 핵심 | keyword/author 검색 | 좋음 |
| sorting algorithm | Sorting Algorithm | Algorithm | algorithm | 핵심 | 표준 정렬 API 없이 직접 구현 | 좋음 |
| LOG | LOG command | Git/Graph | command | 핵심 | 커밋 순서 출력 | 불필요 |
| topological order | Topological Order | Graph/Algorithm | concept | 핵심 | 부모가 자식보다 먼저 출력 | 좋음 |
| PATH | PATH command | Graph/Algorithm | command | 핵심 | 커밋 간 최단 경로 | 불필요 |
| shortest path | Shortest Path | Graph/Algorithm | algorithm concept | 핵심 | 커밋-부모 무방향 경로 | 좋음 |
| lexicographical order | Lexicographical Order | Algorithm | ordering concept | 핵심 | 동률 시 사전순 최소 경로 | 좋음 |
| ANCESTORS | ANCESTORS command | Graph/Algorithm | command | 핵심 | 모든 조상 커밋 탐색 | 보통 |
| graph traversal | Graph Traversal | Graph/Algorithm | algorithm concept | 핵심 | 커밋 그래프 탐색 | 좋음 |
| SEARCH | SEARCH command | Data Structure | command | 핵심 | 역색인 기반 검색 | 보통 |
| REPL | Read-Eval-Print Loop | Programming | interface | 핵심 | 대화형 CLI | 좋음 |
| merge commit | Merge Commit | Git/Graph | concept | 보조 | 부모 2개 보너스 | 좋음 |
| line diff | Line Diff | Algorithm/Git | algorithm | 보조 | 텍스트 diff 보너스 | 좋음 |
| branch pointer | Branch Pointer | Git | concept | 핵심 | 브랜치가 가리키는 커밋 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Directed Graph | Graph | DAG 이해 배경 | 좋음 |
| Cycle | Graph | DAG에서 금지되는 구조 | 좋음 |
| BFS | Graph/Algorithm | 무가중치 최단 경로 구현 후보 | 좋음 |
| DFS | Graph/Algorithm | 조상 탐색 구현 후보 | 좋음 |
| Stable / Custom Comparator | Algorithm | 정렬 기준 date/author 변경 이해 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Topological Sort | Graph/Algorithm | LOG 출력 원리 심화 | 좋음 |
| SHA | Security/Git | 실제 Git 해시 확장 학습 | 좋음 |
| Content-addressable Storage | Git/Storage | 실제 Git 내부 구조 확장 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 24
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: Git, commit node, DAG, hash, parent, inverted index, sorting algorithm, topological order, shortest path, lexicographical order
