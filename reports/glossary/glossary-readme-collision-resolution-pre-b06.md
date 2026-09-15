# Pre-B06 — README Collision Resolution

## A. Problem and root cause

The directory guide at `content/terms/README.md` collides with the planned canonical ID `readme`. Runtime generation and glossary validation resolve detailed content by constructing `content/terms/<term-id>.md`. On case-insensitive filesystems, that lookup can resolve `README.md` for `readme`, making the guide appear to be term content or suppressing its missing-content warning. Sprint 7 planning had a local `term_id != "readme"` exception, but it did not remove the filesystem-level ambiguity.

Affected paths were `scripts/build_web_data.py`, `scripts/validate_glossary.py`, and future runs of `scripts/build_content_tier_plan.py`; extension data inherits generated glossary output. The immediate generated detailed flag happened to remain false because the guide has no `##` sections, but validator existence checks were still affected. This was a real runtime/build risk, not a planning-only issue.

## B. Chosen fix

Option B was chosen: move the directory guide to `content/README.md`, leaving `content/terms/` for canonical `<term-id>.md` files only. The planning scanner now uses its ordinary exact filename lookup without a `readme` exception. The plan validator rejects a recreated `content/terms/README.md` and requires the guide at its new location.

Option A (scanner-only exclusion) was rejected because multiple direct canonical-path consumers would still share a case-insensitive collision. Option C (renaming inside `terms/`) was rejected because generic Markdown scans could still treat it as a candidate and the guide does not belong in the term-content directory.

## C. Regression protection

`scripts/validate_content_tier_plan.py` now enforces the directory boundary. `src/data.test.ts` asserts that the canonical `readme` generated entry has no detailed content before its actual future file is authored. Unit total remains 31/31.

## D. Metrics and direct collision QA

| Metric | Before | After |
| --- | ---: | ---: |
| Canonical | 519 | 519 |
| Detailed | 339 | 339 |
| Glossary warnings | 959 | 960 |

The one additional maturity warning is correct: canonical `readme` is now recognized as missing detail instead of its existence check matching the guide. Direct checks: README term candidate **NO**; README generated as canonical content **NO**; detailed-count impact **NO**.

## E. Functional QA

Tier plan, glossary (0 errors), unit (31/31), production build, Atlas, Knowledge Map, Concept Connection, Playwright map tests (5/5), and extension build all PASS.

## F. B06 readiness

**READY_FOR_S7_B06**. This change only resolves the directory collision; no B06 content was added.
