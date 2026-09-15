# Sprint 20 — Glossary RC1 Release Freeze

## Freeze baseline

The approved RC baseline is `c2e29bd docs(glossary): approve glossary release candidate`. Sprint 20 does not add canonical terms, rewrite glossary content, alter validator policy, expand maps or Concept Connection, upgrade dependencies, or refactor unrelated application code.

## Release metadata

RC1 has 519 canonical terms, 519 detailed terms, 100% detailed coverage, 0 content-quality warnings, and 0 blocking issues. The remaining 293 Atlas coverage signals are INFO planning items and explicitly not release blockers.

The web UI package remains `0.1.0`. The Chrome Extension remains `0.4.2`; `extension/manifest.json` is its package source of truth and is intentionally independent from the web UI package version.

## Release-facing corrections

The root README now presents the current RC metrics while retaining historical Sprint reports as historical records. The Chrome Extension search input now correctly states that the dictionary contains 519 terms. No glossary content or canonical data changed.

## Verification scope

The final gate reruns unit tests, production build, Atlas validation, Knowledge Map validation, glossary/Concept Connection validation, Playwright map tests, Chrome Extension build, and ZIP packaging. The release workflow, production artifacts, extension artifacts, and repository hygiene are also checked before publication.

## Final QA and artifact results

- Unit tests: 31/31 PASS.
- Production build: PASS. The existing Vite chunk-size advisory is non-blocking.
- Atlas validation: PASS (12 fields, 519 terms, 16 missions).
- Knowledge Map validation: PASS (10 implemented field maps, 2 cross-field layers).
- Glossary / Concept Connection validation: PASS (0 errors, 0 warnings, 780 INFO).
- Playwright map interaction: 5/5 PASS.
- Chrome Extension build and package: PASS. The generated package is `releases/codyssey-openbook-v0.4.2.zip`; it contains nine required root-level files and is intentionally ignored as a local release artifact.

The production `dist/` build contains its entry document and hashed assets. Browser smoke checks rendered the README term, AI model term, and frontend map routes successfully. The extension distribution contains its Manifest V3 root manifest, background/content/side-panel files, glossary data, Open-book data, and deep-link artifacts. The Pages workflow is configured to run `npm ci`, `npm run build`, and deploy `dist/` on a `main` push.

## Hygiene result

Current release-facing README and release metadata contain no absolute local path. A local ignored `releases/.DS_Store` was observed and left untouched because it is not part of the release package or Git worktree. Historical documents retain their historical metrics and placeholder wording; the current README and extension-facing count have been corrected.
