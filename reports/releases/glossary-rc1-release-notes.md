# Glossary RC1 Release Notes

## Release summary

Release stage: **Release Candidate**.

- Canonical terms: 519
- Detailed terms: 519
- Detailed coverage: 100%
- Content-quality warnings: 0
- Blocking issues: 0
- Post-RC planning items: 293 Atlas coverage INFO signals (not release blockers)

The release includes the Tier A/B/C content model, Technology Atlas, Concept Connection, glossary search, Open-book learning flow, five webtoon pilots, and the Chrome Side Panel extension.

## Major work completed

- Normalized the mission-derived canonical glossary and established its data contracts.
- Classified content depth into Tier A/B/C and completed S7-B01 through S7-B09.
- Reached complete detailed-content coverage for all 519 canonical terms.
- Resolved the `README` content-path collision without changing the canonical `readme` term.
- Validated detailed learner-navigation relations, search, browser routes, mobile layout, maps, and extension integration.
- Consolidated validator signals: relation metadata and Atlas coverage gaps remain visible as planning INFO, while content and relation integrity failures remain blocking.
- Approved the RC gate in `c2e29bd` with no relation or Concept Connection backlog.

## Version policy

The web UI package version is `0.1.0` in `package.json`. The independently distributed Chrome Extension uses manifest version `0.4.2` in `extension/manifest.json`; this manifest version is the extension package source of truth and determines the generated ZIP filename. The two versions serve separate distribution channels and are intentionally not synchronized for this RC freeze.

## Release quality

All final QA checks are green: unit tests (31/31), production build, Atlas validation, Knowledge Map validation, Concept Connection/glossary validation, Playwright map tests (5/5), and Chrome Extension build and package verification. The Vite chunk-size advisory is unchanged and non-blocking.
