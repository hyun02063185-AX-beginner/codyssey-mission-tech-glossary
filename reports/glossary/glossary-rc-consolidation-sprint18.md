# Sprint 18 — Glossary RC Consolidation

## Baseline and decision

Authoritative inputs were the Sprint 17 audit and report. Baseline was 519 canonical and detailed terms, 100% coverage, 0 content-quality errors, and 780 maturity warnings. Final state retains 519/519 detailed coverage and has 0 validator errors, 0 content-quality warnings, and 780 informational signals.

This is a reclassification, not a mechanical content expansion: the old 780 warnings were 487 missing canonical metadata relations and 293 Atlas-unmapped terms. Sprint 17 established that neither signal alone proves deficient detailed content.

## Validator rule inventory and changes

| Prior rule | Purpose | Before | Action | After |
| --- | --- | ---: | --- | ---: |
| `no related terms` in master metadata | Identify absent centrally curated structural relations | 487 warnings | **MOVE_TO_SEPARATE_METRIC** as `relation_metadata_gap` INFO | 487 INFO |
| `Atlas unmapped` | Surface knowledge-map coverage | 293 warnings | **MOVE_TO_SEPARATE_METRIC** as `atlas_coverage_gap` INFO | 293 INFO |
| Detailed related ID validity/self-reference | Protect learner-navigation integrity | ERROR invariant | **KEEP** | ERROR invariant |
| Missing detailed content / placeholder prose / broken mapping | Content-quality correctness | ERROR or quality warning | **KEEP** | unchanged |

Tier policy: Tier A still requires parser-standard summary, easy explanation, technical explanation, mission context, and peer-review question. Tier B requires the core explanatory fields; enrichment remains optional. Tier C is intentionally concise and is not warned merely for lacking a relation, code, comparison, or long detail.

## Relation contract

Canonical/master relations are centrally curated, machine-oriented structural knowledge-graph metadata. Detailed Markdown relations are learner-navigation links selected for the explanation currently being read. Exact equality is not required. Every detailed relation must reference a canonical ID and must not self-reference; those are validation errors. Metadata absence and Atlas coverage remain visible as informational planning metrics rather than content-quality defects.

## P2 review and backlog

All 56 Sprint 17 P2 candidates were reviewed. `FIX_NOW=0`; `BACKLOG=23` Tier A learning-navigation candidates; `NO_CHANGE_NEEDED=33` Tier B entries where relation enrichment is optional and the definition is self-contained. No term was mass-rewritten or given an arbitrary relation.

The non-blocking backlog is `data/reviews/glossary-polish-backlog-rc.json` and marks every item `rc_blocking: false`.

## Integrity and regression

Coverage integrity remains PASS: canonical=519, detailed=519, undetailed=0, canonical without content=0, content without canonical=0, duplicate mappings=0. Relation integrity remains PASS: 1,063 references checked, invalid=0, self-reference=0, non-canonical=0.

Search regression passed for 15 representative queries: `Security Group`, `ACID`, `branch`, `HTTP`, `CSS Flexbox`, `Docker`, `exception handling`, `fetch API`, `React state`, `SQL`, `AI model`, `output validation`, `README`, `structured output`, `VPC`.

Browser regression passed for 15 routes: `security-group`, `acid`, `branch`, `client-side-route`, `css-flexbox`, `docker`, `exception-handling`, `fetch-api`, `form-validation`, `react-state`, `sql`, `ai-model`, `output-validation`, `readme`, `structured-output`. At 390px, `security-group`, `acid`, `ai-model`, and `readme` had no document horizontal overflow.

Tier-plan validation, glossary/Concept Connection validation, unit tests (31/31), production build, Atlas validator, Knowledge Map validator, Playwright map tests (5/5), and Chrome Extension build all PASS. The Vite chunk-size advisory remains non-blocking.

## RC gate and recommendation

**RC_READY_WITH_POLISH_BACKLOG.** Blocking errors=0; blocking warnings=0; P0=0; P1=0; coverage, relation integrity, functional QA, browser, search, and mobile QA are GREEN. The 23 Tier A relation-navigation candidates are useful but non-blocking polish work.

The next step is release-candidate approval or a small, manual Tier A relation-polish batch. It is not another bulk-content sprint, and Atlas coverage should be planned independently from glossary content quality.
