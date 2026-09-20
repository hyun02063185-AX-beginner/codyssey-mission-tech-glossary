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
