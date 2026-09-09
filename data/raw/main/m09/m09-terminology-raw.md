# 본과정 M09 기술용어 원천 추출

- 과정: 본과정
- 미션: M09 — 정보를 엄청 빠르게 찾아주는 작은 저장소 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M09 — 정보를 엄청 빠르게 찾아주는 작은 저장소 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e038081219a0fc3358bbdf9f0?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Redis | Redis | Data/Storage | database/cache | 핵심 | Mini Redis 모사 대상 | 좋음 |
| CLI | Command Line Interface | Programming | interface | 핵심 | Mini Redis 인터페이스 | 보통 |
| 이중 연결 리스트 | Doubly Linked List | Data Structure | structure | 핵심 | LRU 순서 관리 | 좋음 |
| O(1) | O(1) Constant Time | Algorithm | complexity | 핵심 | 삽입/삭제/이동 성능 요구 | 좋음 |
| 해시맵 | Hash Map | Data Structure | structure | 핵심 | 키 저장 구조 | 좋음 |
| chaining | Separate Chaining | Data Structure | collision strategy | 핵심 | 해시 충돌 처리 | 좋음 |
| load factor | Load Factor | Data Structure | metric | 핵심 | 0.75 초과 시 리사이징 | 좋음 |
| bucket | Hash Bucket | Data Structure | concept | 핵심 | 해시맵 저장 단위 | 좋음 |
| 최소 힙 | Min Heap | Data Structure | structure | 핵심 | TTL 만료 관리 | 좋음 |
| expire_at | Expiration Timestamp | Data/Storage | field/concept | 핵심 | TTL 힙 요소 | 보통 |
| TTL | Time To Live | Data/Storage | concept | 핵심 | 키 만료 기능 | 좋음 |
| SET | SET command | Data/Storage | command | 핵심 | 키 저장 | 불필요 |
| GET | GET command | Data/Storage | command | 핵심 | 키 조회 | 불필요 |
| DEL | DEL command | Data/Storage | command | 핵심 | 키 삭제 | 불필요 |
| EXISTS | EXISTS command | Data/Storage | command | 보조 | 키 존재 확인 | 불필요 |
| DBSIZE | DBSIZE command | Data/Storage | command | 보조 | 키 개수 | 불필요 |
| KEYS | KEYS command | Data/Storage | command | 보조 | 키 목록 | 불필요 |
| maxmemory | Max Memory | Data/Storage | config | 핵심 | 메모리 제한 | 좋음 |
| used_memory | Used Memory | Data/Storage | metric | 핵심 | 메모리 산정 | 좋음 |
| LRU | Least Recently Used | Algorithm/Storage | eviction policy | 핵심 | 메모리 초과 시 제거 정책 | 좋음 |
| OOM | Out of Memory | Storage/OS | error/state | 핵심 | 단일 엔트리 초과 시 반환 | 좋음 |
| EXPIRE | EXPIRE command | Data/Storage | command | 핵심 | TTL 설정 | 보통 |
| REPL | Read-Eval-Print Loop | Programming | interface concept | 핵심 | mini-redis> 대화형 실행 | 좋음 |
| Stack | Stack | Data Structure | structure | 보조 | 보너스 문서화 | 좋음 |
| Queue | Queue | Data Structure | structure | 보조 | 보너스 문서화 | 좋음 |
| Deque | Deque | Data Structure | structure | 보조 | 보너스 문서화 | 좋음 |
| BST | Binary Search Tree | Data Structure | structure | 보조 | 보너스 요구 | 좋음 |
| Pub/Sub | Publish/Subscribe | Architecture | messaging pattern | 보조 | 보너스 기능 | 좋음 |
| 시간복잡도 | Time Complexity | Algorithm | concept | 핵심 | 자료구조 성능 설명 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| Hash Function | Data Structure | 해시맵 키→버킷 변환 이해 | 좋음 |
| Collision | Data Structure | chaining이 해결하는 문제 | 좋음 |
| Heap Property | Data Structure | 최소 힙 동작 원리 | 좋음 |
| Cache Eviction | Storage/Algorithm | LRU 상위 개념 | 좋음 |
| Expiration | Storage | TTL 만료 처리 상위 개념 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| Amortized Complexity | Algorithm | 해시맵 리사이징 비용 이해 | 좋음 |
| Memory Accounting | Storage | used_memory 계산과 연결 | 좋음 |
| Cache | Storage | Redis의 대표 활용 맥락 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 29
- required 개념 수: 5
- related 개념 수: 3
- 웹툰 우선 후보 예: Redis, 이중 연결 리스트, O(1), 해시맵, chaining, load factor, bucket, 최소 힙, TTL, maxmemory
