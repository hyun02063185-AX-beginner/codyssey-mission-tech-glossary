# Canonical Term Selection & Growth Policy v1

## Purpose

Codyssey is a growing learning knowledge system, not a count-driven static
dictionary. A canonical term must have a clear reason to exist independently;
missing prose is a maturity gap, not by itself a reason to remove a sound term.

## Canonical selection

Assess a candidate as a whole. It normally needs several of these signals:

- **Independence:** it is not merely an alias, spelling variation, option, or example of another term.
- **Reuse:** it can recur beyond one mission in real development work.
- **Explanatory and search value:** a learner can reasonably search for it and benefit from a standalone definition.
- **Educational value:** knowing it improves understanding of code, systems, or design choices.
- **Connection value:** it forms meaningful relationships with other technical concepts.

Keep genuine technical concepts even before content is mature, such as `mutex`,
`race-condition`, `cgroup`, `convolution`, and `ieee-754`.

## Exclusions and aliases

Do not create canonical terms for example values, temporary variable names,
mission-only files or directories, assignment IDs, literal ports and addresses,
region values, environment-variable values, mission command tokens, or report
section labels. Preserve them in `mission-local-terms-v0.1.json` when their
mission context remains useful.

Use an alias for Korean/English forms, abbreviations, normal formatting and case
variants. Do not alias different layers merely because names look alike: for
example, Fetch API and a `fetch()` call may need separate treatment.

## Current decisions

- `var`, `let`, and `const` are separate canonical language keywords.
- SQL `SELECT`, `INSERT`, `UPDATE`, and `DELETE` remain canonical vocabulary.
- Real libraries remain canonical even when a mission prohibits using them.
- `interaction` is retained as an HCI/UX concept; ambiguous general terms require review rather than automatic deletion.
- Only `expiration` is merged into `time-to-live` for the D8 cluster. Log rotation/logrotate, request-response cycle/HTTP request-response, and state transition/UI state remain distinct.

The current type taxonomy is policy guidance (`concept`, `language`, `protocol`,
`api`, `function`, `library`, `framework`, `tool`, `command`, `architecture`,
`data-format`, `algorithm`, `runtime`, `platform`, `standard`). Schema expansion
requires a separately scoped migration; do not add it only to inflate this
sprint.

## Growth operation

When M02–M13 work discovers a term:

`mission discovery → canonical search → alias check → foundation check → policy assessment → candidate backlog → batch review → canonical/alias/relation update → validator → Atlas/Open-book sync`

Do not promote every discovered word immediately. Batch review records the
reason, evidence, confidence, migration impact, and any remaining uncertainty.

## Quality and validation

The canonical master is the alias source of truth. Open-book and generated
Chrome data consume it; aliases in mission context must be backfilled into the
master or validation fails. The glossary validator treats duplicate IDs/aliases,
broken references, invalid slugs, mission-local contamination, literal-like
canonical names, and Atlas/Open-book reference failures as errors. Missing
descriptions, related terms, or Atlas placement are `glossary_maturity_gap`
warnings only.

## Candidate register — SRE (Knowledge Encyclopedia, Data Enrichment Cycle 01)

These are **candidates only**. Nothing here is a decision to add a canonical term, and
none of them may be added to raise coverage for a view. They are recorded so a later
mission that genuinely needs them can start from evidence instead of memory.

**Finding.** The Encyclopedia's `sre` academic field holds zero terms. A probe of all 519
canonical ids found **none** of the concepts that define the discipline: SLO, SLI, SLA,
error budget, incident, postmortem, on-call, toil, availability target, capacity planning,
MTTR, runbook, rollback, canary or blue-green deployment.

What the dictionary does hold is the **practice layer** — `observability`,
`system-monitoring`, `process-monitoring`, `health-check`, `health-check-endpoint`,
`logging`, `log-rotation`, `logrotate`, `threshold`, `watchdog`, `root-cause-analysis`,
`verification`, `before-after-experiment`, `resource-exhaustion`. Those are already homed
under Operating Systems and DevOps, where they belong. Presenting that set as "SRE" would
misrepresent the discipline, so the field stays `declared` and the role stays `limited`.

**Scope test (the deciding question).** No Codyssey mission currently requires reliability
targets, error budgets or on-call practice. M07 asks a machine to check its own state and
M08 asks for root-cause work; both are already covered by existing canonical terms. So
these candidates fail the mission-evidence test that opens this policy, and adding them
now would be collection for its own sake.

| Candidate | Why it would matter | Precondition to reconsider |
| --- | --- | --- |
| Service Level Objective (SLO) / SLI | Turns "잘 돌아간다"를 측정 가능한 목표로 바꾼다 | A mission that sets a measurable reliability target |
| Error budget | 신뢰성과 변경 속도를 맞바꾸는 판단 기준 | Follows SLO; meaningless without it |
| Incident response / postmortem | 장애를 기록하고 재발을 막는 절차 | A mission with a real failure drill |
| Availability target (nines) | 가용성을 숫자로 말하는 법 | A mission with uptime requirements |
| Toil | 자동화 대상을 고르는 기준 | A mission that automates repeated operations |

**Process.** Any of these enters through the normal growth operation at the top of this
document (mission discovery → canonical search → alias check → foundation check → policy
assessment → batch review). Promotion is an Owner Gate decision. Until then the
Encyclopedia shows SRE as not yet covered rather than filling it in.

## Candidate register — Computer Architecture (Data Enrichment Cycle 02)

Candidates only, same rules as the SRE register above: nothing here is approved, and none
of it may be added to raise a view's coverage.

**Finding.** The Encyclopedia's `computer-architecture` field held only four terms. The audit
found two different causes, not one.

*Mapping, not absence.* `cpu-architecture` (x86/arm64) and `locality` (메모리 지역성) already
existed in the dictionary but were homed under Programming Fundamentals. Both were moved in
this cycle — no new canonical was needed. The field now holds six terms.

*Genuine absence.* Searching all 519 ids for register, instruction, ALU, bus, clock, pipeline,
word, endianness, virtual memory, page and cache line returned **nothing**. These are the
vocabulary that makes the subject teachable beyond number representation and the memory
hierarchy.

**Scope test.** No mission reaches that level. Preliminary M03 needs number representation
(`floating-point`, `ieee-754`, `epsilon`) and accelerator shape (`mac-operation`,
`neural-processing-unit`), which exist. M08 needs CPU and memory *symptoms* (`cpu-spike`,
`memory-leak`, `out-of-memory`), which exist and belong to Operating Systems. Nothing asks
what a register is. So these fail the mission-evidence test and are not added.

| Candidate | Why it would matter | Related mission | Academic justification | Existing workaround | Trigger to reconsider |
| --- | --- | --- | --- | --- | --- |
| Register | 가장 빠른 저장 위치. 메모리 계층의 맨 위 | 없음 | 메모리 계층을 위에서부터 설명하려면 필요 | `locality` + `cache` 로 계층의 효과만 설명 | 어셈블리나 성능 최적화를 다루는 미션 |
| Instruction / ISA | CPU 가 실제로 수행하는 단위 | 예비 M01·M07 (x86/arm64 호환) | `cpu-architecture` 를 '왜 이미지가 안 돌아가는가' 이상으로 설명하려면 필요 | `cpu-architecture` 가 호환성 맥락만 덮음 | 크로스 빌드나 에뮬레이션을 다루는 미션 |
| Memory hierarchy | 레지스터·캐시·메모리·디스크의 속도 차 | M08·M09 | 캐시가 왜 이득인지를 층으로 설명 | `locality` + `cache` 조합 | 성능 프로파일링 미션 |
| Pipeline | 명령어를 겹쳐 실행하는 방식 | 없음 | 처리량과 지연의 구분 | 없음 | 하드웨어 성능을 직접 다루는 미션 |
| Virtual memory / Page | 프로세스가 보는 주소와 실제 메모리의 분리 | M08 (OOM) | OOM 을 '메모리가 없다' 이상으로 설명 | `out-of-memory` 가 증상만 덮음 | 메모리 관리 내부를 다루는 미션 |

**Process.** Same as SRE: mission discovery → canonical search → alias check → foundation
check → policy assessment → batch review, with promotion as an Owner Gate decision.
