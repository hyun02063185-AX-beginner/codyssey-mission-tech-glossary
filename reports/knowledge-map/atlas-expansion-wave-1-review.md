# Atlas Expansion Wave 1 Review

## Architecture migration

The prior Frontend-only component is now the generic `TechnologyFieldMap` engine. A central lazy loader resolves graph and overlay JSON by `mapId`; no Git or Data component copy was created. `#/maps` is a registry-driven Atlas entrance that presents all 12 fields honestly, with only the three implemented maps clickable.

## Standalone suitability

| Field | Disposition |
| --- | --- |
| Frontend / Web UI | STANDALONE |
| Git / Collaboration | STANDALONE |
| Data / Database | STANDALONE |
| Linux / OS / Runtime | STANDALONE_WITH_BOUNDARY |
| DevOps / Infrastructure | STANDALONE_WITH_BOUNDARY |
| Security / Identity | STANDALONE_WITH_BOUNDARY |
| Algorithms / Data Structures | STANDALONE |
| Network / Web Protocol | STANDALONE_WITH_BOUNDARY |
| AI / ML / Computing | STANDALONE |
| Backend / Server / API | STANDALONE_WITH_BOUNDARY; graph shape needs review because most terms are boundary/shared |
| Programming Foundations | CROSS_FIELD_LAYER_CANDIDATE |
| Developer Workflow / Tools | CROSS_FIELD_LAYER_CANDIDATE; 9 terms, no core nodes |

The 12-field taxonomy is unchanged. Registry statuses surface these decisions without claiming planned maps are implemented.

## Implemented maps

| Map | Nodes | Edges | Overlays | Curated scope |
| --- | ---: | ---: | ---: | --- |
| Frontend | 49 | 63 | M01, M02 | Existing M01 seed plus React/component/state/routing flow |
| Git / Collaboration | 27 | 24 | M04 | Workspace, history, branching, remote, integration, collaboration |
| Data / Database | 21 | 17 | M11 | Relational structure, keys, query, integrity, performance |

M02 adds React, props, state, custom Hook, useEffect, React Router, client-side routing, controlled input, SPA, component tree, and virtual-DOM rendering. Firebase, Supabase, hosting, TypeScript, and protected-route remain Atlas boundary candidates rather than automatic canvas nodes.

The M04 graph keeps Git distinct from GitHub workflow: staging → commit → repository, branch/HEAD references, remote push/pull, merge versus rebase, and Pull Request/code review are modeled as separate concepts. The M11 graph distinguishes relational structure, key/foreign-key relations, SQL commands, JOIN, constraints, and index/query execution. `transaction-data` is not used; its LOW-confidence canonical review remains open.

## Routes and compatibility

- `#/maps`
- `#/maps/frontend?mission=main-m01`
- `#/maps/frontend?mission=main-m02&term=react`
- `#/maps/git-collaboration?mission=main-m04`
- `#/maps/data-database?mission=main-m11`
- Legacy `#/maps/main-m01?term=fetch-api` redirects to the canonical Frontend M01 URL.

Mission pages for M01, M02, M04, and M11 now expose the primary implemented field map CTA. A term page deep-links to an implemented map when its curated node exists; M01 Quick Terms retain their M01 overlay link.

## Performance

The Atlas landing loads only its 1.80 kB lazy landing chunk plus registry metadata. Map graphs remain route/map lazy chunks: Frontend 42.33 kB, Git 16.98 kB, Data 13.99 kB (uncompressed build output). The existing main chunk warning remains; its 736.18 kB baseline became 742.73 kB, a 6.55 kB increase, while graphs are not bundled into it.

## Validation and browser QA

- `npm test`: 11 tests passed.
- `npm run build`: passed.
- `npm run build:extension`: passed.
- `npm run atlas:validate`: 12 fields, 549 terms, 16 missions passed.
- `npm run knowledge-map:validate`: 3 implemented / 12 registry maps passed.
- Desktop smoke: Atlas cards, all three maps, M02 route highlight, search/node detail, and legacy redirect passed with no console errors.
- Mobile 390px smoke: Data M11 map loaded with no document horizontal overflow and no console errors.

## Known limitations and Wave 2

- Only three field maps are implemented; planned maps intentionally remain non-clickable.
- The generic loader has one centralized lazy entry per implemented map; adding a map requires that data entry, but no rendering component.
- Wave 2 should be data-first: review Frontend M02 boundary candidates, then add the Git/Data adjacent overlays or select Linux / OS as the next standalone graph. Do not auto-promote LOW-confidence `o` or `transaction-data`.
