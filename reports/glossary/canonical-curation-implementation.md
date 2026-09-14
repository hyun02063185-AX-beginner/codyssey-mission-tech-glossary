# Canonical Curation Implementation

- Date: 2026-09-14
- Start commit: `616649a`
- Start working tree: only pre-existing untracked `.DS_Store`; it was not changed.
- Review source: Phase 1.5 term curation and coverage-gap audit, with Owner Decisions D1–D8 taking precedence.

## Results

| Metric | Before | After |
| --- | ---: | ---: |
| Canonical terms | 549 | 514 |
| Mission-local terms | 0 | 46 |
| Canonical aliases | not governed | 620 |
| Terms with detailed content | 65 | 84 |
| Terms without detailed content | 484 | 430 |
| Atlas eligible terms* | n/a | 506 |
| Atlas-mapped eligible terms | n/a | 222 |
| Atlas-unmapped eligible terms | n/a | 284 |

*Eligible means a canonical term whose type is not `other`, `source-file`,
`document`, `artifact`, or `config`. Mapping remains a maturity/coverage
measure, not a canonical admission requirement.

- Added: 18 canonical terms.
- Merged: 7 source canonical terms into survivors; source spellings and mission
  references were migrated to the survivor.
- Moved to mission-local: 46 mission-only commands, values, paths, file names,
  project-structure names, and report vocabulary.
- Permanently discarded: none. Every removed canonical record is either retained
  in the mission-local store or represented by its surviving canonical term.

## Owner decisions

| Decision | Implementation | Affected terms |
| --- | --- | --- |
| D1 | Moved mission-command tokens out of canonical/Atlas bindings. | `ANCESTORS`, `BRANCH`, `COMMIT`, `DBSIZE`, `DEL`, `EXISTS`, `EXPIRE`, `GET`, `INIT`, `KEYS`, `LOG`, `PATH`, `SEARCH`, `SET`, `SWITCH` |
| D2 | Moved project directories/layers and literal file context out of canonical; any necessary Atlas context is now a non-canonical foundation node. | auth/model/repository/router/service layers; components/css/hooks/images/javascript/lib/pages/template directories; `monitor.sh` |
| D3 | Retained separate `var`, `let`, and `const` terms and added their comparison links. | `var`, `let`, `const` |
| D4 | Retained SQL vocabulary. | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| D5 | Retained real technologies despite mission restrictions. | Vue, jQuery, Bootstrap, Tailwind CSS |
| D6 | Kept `workaround` and `verification`; moved report-only labels. | `evidence-logs`, `result-report`, `description` |
| D7 | Retained all seven reviewed programming/HCI terms, including `interaction`; no ambiguous term was automatically removed. | variable, attribute, console, directory, interaction, benchmark, backup |
| D8 | Merged only `expiration` into `time-to-live`; kept the other three concept pairs distinct. | TTL/expiration merged; log rotation/logrotate, request-response cycle/HTTP request-response, state transition/UI state retained |

Additional high-confidence literal and mission artifacts (`ap-northeast-2`,
environment-variable values, port/address literals, submission URLs, and
`code-block`) were moved to the same mission-local store under the policy.

## Canonical additions

P0: JSX, useState, Neural Network.

High-confidence P1: Node.js, npm, Recursion, CORS, ACID, Salt, SQL Injection,
XSS, LLM, Hallucination.

M01: AJAX, Callback, preventDefault, Event Propagation, Multi-page Application.

The medium-confidence P1 candidates (DNS/domain name, middleware, database
migration, context switch, context window, reverse proxy, data type,
parameter/argument, scope, parallelism) remain a review backlog rather than
being promoted automatically. XMLHttpRequest, Browser Web API, and Call Stack
remain foundation/HOLD candidates as directed.

## Alias and relation migration

- `arm64-x86-64` → `cpu-architecture`
- `data-json` → `json`
- `http-request` → `http-request-response`
- `o` → `time-complexity`
- `remote-repository` → `remote`
- `serialize-deserialize` → `serialization`
- `expiration` → `time-to-live`

Open-book aliases were backfilled into the canonical master. Chrome search now
uses canonical aliases directly. The incorrect `async-await evolved_from
callback` Atlas edge is represented as `compare_with`; async/await remains
`based_on` Promise.

## Technology Atlas and Chrome/Open-book

- Converted the frontend’s promise, HTTP, cookie, and callback shadow
  foundations into canonical term routes.
- Updated graph references and overlays for canonical migrations; mission-local
  graph context has no canonical deep-link.
- Rebuilt generated web data, term-map links, and Chrome extension data files.
- The glossary validator verifies Open-book/Chrome canonical references and
  canonical-master alias divergence.

## Validator

`scripts/validate_glossary.py` reports errors for duplicate IDs, duplicate or
colliding aliases, broken related/mission/Atlas/Open-book references, invalid
slugs, mission-local contamination, literal-like canonical values, missing
required fields, and duplicate foundation shadows. Missing descriptions,
relations, and Atlas placement are `WARNING: glossary_maturity_gap`, never
validation errors.

## Validation

Passed:

- `python3 scripts/validate_glossary.py` — 0 errors, 1,207 maturity warnings
- `python3 scripts/validate_technology_field_atlas.py`
- `python3 scripts/validate_knowledge_map.py`
- `git diff --check`

Not runnable in this environment: `npm test`, `npm run build`, map-interaction
tests, and `npm run build:extension`; `npm`/Node.js is not installed. The
Python data build chain was run manually and the generated Chrome dictionary,
Open-book, term-map-link, and side-panel artifacts were synchronized.

## Remaining work

- Rewrite the remaining 430 detailed-content gaps.
- Review the medium-confidence P1 backlog in a later batch.
- Expand Concept Connection content and the relation graph deliberately.
- Improve Atlas coverage only for terms that are actually map-eligible.
- Run the Node, extension packaging, and visual-regression checks in an
  environment with Node.js installed.
