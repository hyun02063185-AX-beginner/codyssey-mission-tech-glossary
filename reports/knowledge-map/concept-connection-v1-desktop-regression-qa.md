# Concept Connection v1 Desktop Regression QA

Date: 2026-09-14

## A. Environment

- OS: Windows desktop
- Node: v24.16.0
- npm: 11.13.0
- Package manager: npm (`package-lock.json`, clean install via `npm ci`)

## B. Git

- Start commit: `1c96f77` (`docs(knowledge-map): report concept connection v1`)
- Branch: `main`, synchronized with `origin/main` before QA
- Initial working tree: clean
- End state: one QA-fix commit required; see section M

## C. Python Validation

| Command | Result |
| --- | --- |
| `npm run glossary:validate` | PASS — 514 canonical, 46 mission-local, 0 errors, 1,207 existing maturity warnings |
| `npm run atlas:validate` | PASS — 12 fields, 514 terms, 16 missions |
| `npm run knowledge-map:validate` | PASS — 10 implemented maps, 2 cross-field layers |

## D. Node Tests

- `npm test`: PASS — 3 files, 28 tests.
- `npm run test:map-interaction`: PASS — 5 Playwright interaction tests.

## E. Build

- `npm run build`: PASS.
- `npm run build:extension`: PASS.

## F. Playwright / Interaction

- Desktop map pan, zoom, fit, node selection, overlay detail, route chips, and generic-map loading passed.
- Mobile map bottom-sheet and no-horizontal-overflow test passed.
- Local browser checks found no console/runtime errors for the Concept Connection list and detail flows.
- Mobile (390 × 844) Concept Connection list and first detail: six cards, no horizontal overflow, relation rows visible.

## G. Concept Connection QA

All six published connection pages rendered through direct hash URLs after reload. Each has overview, explanatory sections, relation diagram, misconceptions, canonical related-term links, and Mission Context.

| Connection | Result |
| --- | --- |
| AJAX / XMLHttpRequest / Fetch API | PASS |
| Callback / Promise / async-await | PASS |
| Event family | PASS |
| HTML / DOM | PASS |
| SPA / MPA | PASS |
| var / let / const | PASS |

## H. Navigation / Deep Link

- `/connections` shows six cards, title, type, core terms, and working entry links.
- Direct connection URLs reload without a missing-page state.
- Term → Connection entries pass for Promise, DOM, SPA, and var.
- Connection → Term link pass for Promise and var; browser Back navigation retained the originating route.
- Atlas → Connection pass for Promise; its selected detail panel links to Callback / Promise / async-await.
- Connection → Atlas is not implemented; this is not a v1 requirement failure.

## I. Atlas Regression

PASS. Automated interaction coverage confirms selection, pan, zoom, fit, deep-link state, desktop detail overlay, mobile sheet behavior, mission overlays, and all implemented maps. Live Promise Atlas selection retained the map panel and Concept Connection entry.

## J. Term / Alias / Open-book Regression

- Canonical search and first-result routes passed for JSX, useState, Neural Network, Node.js, npm, CORS, XSS, SQL Injection, LLM, Hallucination, AJAX, Callback, and MPA.
- Alias search passed for `페치 API`, `비동기 대기`, `로컬스토리지`, and `이벤트 리스너`.
- M01 Open-book rendered its quick-term links, requirement cards, and preserved unchecked stored state; no state-changing interaction was performed.

## K. Bugs Found

1. **C — broken detailed related-term deep links.** Markdown-formatted IDs in detailed term content were emitted with literal backticks, making routes such as `/terms/%60async-await%60` invalid. The new detailed-term validation also exposed two pre-existing noncanonical detailed references (`xmlhttprequest`, `package-json`).

## L. Fixes

- Normalized Markdown backticks while building `detailRelatedTerms`.
- Added glossary validation for detailed related-term targets.
- Removed the two noncanonical detailed references rather than adding out-of-scope terms.
- Added regression coverage for the Promise related-term IDs.

## M. Commit / Push

QA-fix commit and push required after this report is added.

## N. Final Verdict

PASS — Sprint can be closed.
