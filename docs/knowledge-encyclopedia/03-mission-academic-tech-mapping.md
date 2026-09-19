# 03. Mission · Academic · Technology Mapping

> 상태: **PROPOSED**. §3의 학문 배정과 §4의 study-next는 Sprint 0 작성자의 판단이며 **커리큘럼 소유자 검토가 필요하다.**
> 사실(데이터에서 집계한 값)과 제안(판단)을 표에서 구분해 표기한다: `[data]` = 저장소 집계, `[proposal]` = 제안.

## 1. 미션 범위 — 16개

요청서의 "M01~M13"은 본과정 13개이며, 저장소에는 **예비 3 + 본과정 13 = 16개**가 있다. 모델은 16개 전부를 다룬다.

| 순서 | mission ID (정규) | master 표기 | 제목 `[data]` (출처: 본과정 = `data/raw/main/mXX/source-manifest.md`의 `미션명`, 예비 = `preliminary-m01-m03-claude-raw.md` 섹션 헤더) |
| ---: | --- | --- | --- |
| 1 | `mission:preliminary-m01` | `preliminary/M01` | 개발 워크스테이션 구축 |
| 2 | `mission:preliminary-m02` | `preliminary/M02` | 파이썬 퀴즈 게임 |
| 3 | `mission:preliminary-m03` | `preliminary/M03` | Mini NPU 시뮬레이터 |
| 4 | `mission:main-m01` | `main/M01` | 나를 소개하는 웹페이지 처음부터 만들기 |
| 5 | `mission:main-m02` | `main/M02` | 버튼 누르면 화면이 스르륵 바뀌는 요즘 웹사이트 만들기 |
| 6 | `mission:main-m03` | `main/M03` | 나만의 용돈 기입장 프로그램 만들기 |
| 7 | `mission:main-m04` | `main/M04` | 친구 3~5명과 함께 프로그램 만드는 법 연습하기 |
| 8 | `mission:main-m05` | `main/M05` | 내가 만든 웹사이트를 인터넷에 올려 누구나 쓰게 하기 |
| 9 | `mission:main-m06` | `main/M06` | 내가 고친 코드 설명을 AI가 대신 써주는 도우미 만들기 |
| 10 | `mission:main-m07` | `main/M07` | 컴퓨터가 알아서 자기 상태를 점검하게 만들기 |
| 11 | `mission:main-m08` | `main/M08` | 컴퓨터가 갑자기 느려지거나 멈췄을 때 원인 찾아 고치기 |
| 12 | `mission:main-m09` | `main/M09` | 정보를 엄청 빠르게 찾아주는 작은 저장소 만들기 |
| 13 | `mission:main-m10` | `main/M10` | 파일이 언제 어떻게 바뀌었는지 기록하는 작은 프로그램 만들기 |
| 14 | `mission:main-m11` | `main/M11` | 정보를 깔끔하게 정리하는 디지털 서랍장 만들기 |
| 15 | `mission:main-m12` | `main/M12` | 글을 쓰고·보고·고치고·지울 수 있는 게시판형 웹 서비스 만들기 |
| 16 | `mission:main-m13` | `main/M13` | 로그인이 되고 회원끼리 연결되는 웹 서비스 만들기 |

- 순서(`order`)는 표기 순(예비 → 본과정 번호)을 **가정**한 것이다. 실제 커리큘럼 진행 순서와 다르면 `missions.json`의 `order`만 고치면 된다. `[미확정 U4]`
- `missions.json` 도입 시 이 표가 초기 값이 된다. **raw 원본은 그대로 둔다**(raw는 추출 시점 보존이 원칙). 제목의 SoT는 이후 `missions.json`으로 옮겨간다.

## 2. 미션이 답해야 하는 7개 질문 — 데이터 출처

| # | 질문 | 출처 | authoring 필요? |
| --- | --- | --- | --- |
| 1 | 어떤 컴퓨터공학 과목과 연결되는가 | `missions.json` `academic[]` (primary 1 + supporting ≤3) | **필요 (16 entry)** |
| 2 | 어떤 기초 과목을 먼저 공부하면 좋은가 | primary academic의 `prerequisiteFields` **closure** | 불필요 (계산) |
| 3 | 어떤 기술 분야를 다루는가 | `mission-map-routing.json` + `mission-field-matrix.json` | 불필요 (기존) |
| 4 | 핵심 canonical term | master `mission_refs` 중 `source_status=direct` ∧ `importance=core` | 불필요 (계산) |
| 5 | prerequisite term | (a) 해당 미션의 `required` term + (b) 핵심 term들의 learn-first closure 중 이 미션에 없는 것 | 불필요 (계산). **단, prerequisite edge가 채워져야 (b)가 의미 있음** |
| 6 | 실습에서 사용하게 되는 term | `direct` term | 불필요, 단 한계 있음 ↓ |
| 7 | 이 미션 이후 무엇을 공부하면 좋은가 | `missions.json` `studyNext[]` (academic 또는 mission 참조) | **필요 (16 entry)** |

한계: master의 `source_status`(direct/required/related)는 "미션 문서에 나온다/필수 배경/연관"의 구분이지 **"실습에서 코드로 쓴다"의 구분이 아니다**(Frontend map의 `mission_uses`는 edge 0개). Q6은 `direct`로 근사하고, 필요해지면 미션별 선택 필드 `practiceTermIds`를 추후 추가한다. `[미확정]`

## 3. Mission → Academic · Technology 매핑 (제안)

기술 분야 열은 `[data]` (`mission-map-routing.json`의 primaryContext, 괄호는 cross-field layer / 추가 map). 학문 열은 `[proposal]`.
"핵심 term 예시"는 `[data]` — master에서 direct∧core인 term 중 일부(전체 개수는 괄호).

| 미션 | 기술 분야 (Atlas) `[data]` | academic primary → supporting `[proposal]` | 핵심 term 예시 `[data]` |
| --- | --- | --- | --- |
| pre M01 | devops-infrastructure (+dev-tools) | **operating-systems** → devops(applied), computer-networks | docker, docker-image, docker-container, bind-mount, cli, 755-644 (26) |
| pre M02 | Programming Foundations layer (+git map) | **programming-fundamentals** → software-engineering | function, class, exception-handling, file-io, loop, branch, merge (22) |
| pre M03 | Programming Foundations layer (+data, ai maps) | **programming-fundamentals** → computer-architecture, data-structures, artificial-intelligence | floating-point, epsilon, mac-operation, matrix-2d-array, neural-processing-unit (15) |
| main M01 | frontend-web-ui | **web-programming** → programming-fundamentals, computer-networks | add-event-listener, async-await, fetch-api, css-flexbox, css-grid, defer (36) |
| main M02 | frontend-web-ui | **web-programming** → software-engineering, information-security | react, react-state, react-props, client-side-route, single-page-application, firebase (15) |
| main M03 | Programming Foundations layer (+data map) | **programming-fundamentals** → database-systems, software-engineering | python, module, decorator, generator, csv, json-lines, persistence (20) |
| main M04 | git-collaboration | **software-engineering** | git, github-flow, code-review, branch-protection, git-revert, git-stash (16) |
| main M05 | network-web-protocol | **computer-networks** → cloud-computing(applied), information-security, operating-systems | amazon-ec2, route-table, internet-gateway, public-subnet, nginx, iam-role (18) |
| main M06 | ai-ml-computing (+dev-tools) | **artificial-intelligence** → information-security, software-engineering, computer-networks | ai-api, ai-model, api-key, prompt-design, max-tokens, output-validation (18) |
| main M07 | systems-runtime (linux-runtime map) | **operating-systems** → devops(applied), information-security, computer-networks | linux, cron, crontab, cpu-usage, disk-usage, firewalld, listening-socket (23) |
| main M08 | systems-runtime | **operating-systems** → computer-architecture, programming-fundamentals, sre(applied) | process, thread, deadlock, memory-leak, out-of-memory, cpu-spike, root-cause-analysis (16) |
| main M09 | algorithms-data-structures | **data-structures** → algorithms, database-systems, operating-systems | hash-map, hash-bucket, load-factor, least-recently-used, redis, min-heap (17) |
| main M10 | algorithms-data-structures (+git map) | **algorithms** → data-structures, software-engineering | directed-acyclic-graph, graph-traversal, commit-node, inverted-index, topological-order (14) |
| main M11 | data-database | **database-systems** | primary-key, foreign-key, join, inner-join, group-by, database-index, data-integrity (22) |
| main M12 | backend-server-api (+Programming layer) | **web-programming**(server-side) → database-systems, software-engineering | fastapi, crud, http-get, http-post, layered-architecture, dependency-injection (21) |
| main M13 | security-identity | **information-security** → web-programming, database-systems | authentication, authorization, json-web-token, login-session, protected-route (18) |

`[data]` 미션별 총 term 수와 direct/required/related 비율은 [01 §3-E](01-current-architecture-audit.md) 및 `mission-field-matrix.json` 참조.

### 3-1. 관찰 (데이터가 제안에 준 힌트)
- **한 미션 = 한 학문이 아니다.** M05는 network 19·security 9·devops 6, M07은 systems 16·security 9, M06은 ai 14·security 7이다. → academic은 `primary 1 + supporting ≤3` 구조가 필요하다.
- **Information Security는 거의 모든 미션에 supporting으로 등장**한다(M02, M05, M06, M07, M13, pre M01). 학문 지도에서 "횡단 학문"으로 보일 수 있다.
- **Computer Architecture는 어떤 미션에서도 primary가 아니다.** pre M03(NPU/부동소수점), M08(CPU·메모리)에서 supporting으로만 나오며 term이 얇다 (02 §5-3a).

## 4. Study-next 제안 `[proposal]`

| 미션 | 다음 미션 흐름 | 이후 학문 (studyNext) |
| --- | --- | --- |
| pre M01 | pre M02, main M07 | operating-systems |
| pre M02 | pre M03, main M03 | data-structures |
| pre M03 | main M03, main M06 | computer-architecture, artificial-intelligence |
| main M01 | main M02 | computer-networks (HTTP), software-engineering |
| main M02 | main M12 | information-security (인증), web-programming(server) |
| main M03 | main M11 | database-systems |
| main M04 | main M10 | software-engineering (리뷰·릴리스) |
| main M05 | main M07 | information-security (IAM), cloud-computing |
| main M06 | — | artificial-intelligence, information-security (secret 관리) |
| main M07 | main M08 | sre(요건 충족 전까지 operating-systems 심화) |
| main M08 | — | computer-architecture, operating-systems (동시성) |
| main M09 | main M11 | algorithms (복잡도), database-systems |
| main M10 | — | algorithms (그래프), software-engineering (VCS 내부) |
| main M11 | main M12 | database-systems (트랜잭션·인덱스) |
| main M12 | main M13 | software-engineering (계층·테스트) |
| main M13 | — | information-security, cloud-computing, devops |

## 5. Academic Field ↔ 미션 ↔ 기술 분야 crosswalk

행 = academic, 열 = Atlas field. `●` = academic이 해당 field의 primary crosswalk, `○` = 부분/보조. `[proposal]`

| academic \ Atlas field | prog-found | algo-ds | systems | network | data-db | security | ai-ml | frontend | backend | git | devops | dev-tools |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| programming-fundamentals | ● | | | | | | | ○ | | | | |
| data-structures | | ● | | | ○ | | | | | | | |
| algorithms | | ● | | | | | ○ | | | | | |
| computer-architecture | ○ | | ○ | | | | ○ | | | | | |
| operating-systems | ○ | | ● | | | | | | | | ○ | |
| computer-networks | | | | ● | | | | | ○ | | ○ | |
| database-systems | | | | | ● | | | | ○ | | | |
| software-engineering | | | | | | | | | ○ | ● | | ● |
| web-programming | | | | ○ | | | | ● | ● | | | |
| information-security | | | | | | ● | | | | | | |
| artificial-intelligence | | | | | | | ● | | | | | |
| cloud-computing (applied) | | | | ○ | | | | | | | ● | |
| devops (applied) | | | ○ | | | | | | | ○ | ● | ○ |
| sre (applied) | | | ○ | | | | | | | | ○ | |

`● 가 두 개인 열/행`(algo-ds 열의 data-structures·algorithms, devops-infrastructure 열의 cloud·devops)은 **term 단위 분할**이 필요함을 뜻한다 — 이것이 pilot에서 검증할 override 메커니즘이다 (05).

## 6. 학문 간 prerequisiteFields 초안 `[proposal]`

```
programming-fundamentals  ←  (없음)
data-structures           ←  programming-fundamentals
algorithms                ←  data-structures, programming-fundamentals
computer-architecture     ←  programming-fundamentals
operating-systems         ←  computer-architecture, programming-fundamentals
computer-networks         ←  programming-fundamentals
database-systems          ←  data-structures, programming-fundamentals
software-engineering      ←  programming-fundamentals
web-programming           ←  computer-networks, programming-fundamentals
information-security      ←  computer-networks, operating-systems
artificial-intelligence   ←  algorithms, programming-fundamentals
cloud-computing (applied) ←  operating-systems, computer-networks
devops (applied)          ←  software-engineering, operating-systems, computer-networks
sre (applied)             ←  devops, operating-systems, computer-networks
```
- 예: main M08(primary operating-systems)의 "먼저 공부하면 좋은 과목" = closure → computer-architecture, programming-fundamentals. main M13(information-security) = computer-networks, operating-systems, programming-fundamentals.
- 이 표는 대학 커리큘럼의 관용적 순서이며 Codyssey 공식 커리큘럼이 아니다. `[미확정 — 소유자 검토]`
