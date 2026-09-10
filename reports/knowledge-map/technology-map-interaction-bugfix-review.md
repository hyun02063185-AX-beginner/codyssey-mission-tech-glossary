# Technology Field Map Interaction Bugfix 결과

## Git

- start: `4ae1d08`
- code fix: `f815a5d` (`fix(knowledge-map): stabilize map pan and wheel interaction`)
- push: `origin/main`
- status: GitHub Pages workflow `34489401018` completed successfully

## Root Cause

### Wheel / passive listener

- cause: the SVG `onWheel` handler called `preventDefault()` and changed zoom. React's delegated wheel listener is passive in this browser path, which produced the passive-listener warning and intercepted normal page scrolling.
- fix: removed the wheel handler entirely. Zoom is available only through the existing `+`, `−`, and `맞춤` controls.

### White selection state

- cause: selected/route focus applied `opacity: .3` to every unrelated SVG node group (`.52` for an unrelated overlay node). White node fills and labels therefore composited too faintly against the already-light canvas. Regions themselves were not dimmed; this was an individual node-group opacity rule, not a region-data or overlay-layer failure.
- fix: retained the established focus model but raised unrelated node opacity to `.58`, unrelated overlay-node opacity to `.62`, and unrelated edge opacity to `.2`. Regions remain fully opaque, preserving the map structure.

### `viewX` null crash

- cause: the pan updater closed over `drag.current!.viewX`. React can invoke that updater after `pointerup` or `pointercancel` has already cleared `drag.current`, creating the observed null dereference.
- reproduction: rapid/repeated pan followed by pointer-end makes the queued updater observe a cleared drag ref.
- fix: snapshot the active drag before calling `setView`, give each drag a `pointerId`, and clear it only for that pointer on `pointerup`, `pointercancel`, `pointerleave`, and `lostpointercapture`. The viewport remains an always-valid `INITIAL_VIEW`; zero-size SVG bounds are also ignored.

## Interaction

- wheel: no map wheel listener; viewport scale remains unchanged.
- page scroll: wheel over the production map moved the page (`scrollY: 381`).
- pan: repeated production panning remains rendered with no exception.
- zoom +/- / fit: verified locally and on production.
- selection / route: Frontend Boundary-node and learning-route selection verified on production.

## Tests

- automated: `npm run test:map-interaction` — 3 Playwright tests passed.
- new regression tests: wheel does not zoom while the document scrolls; repeated pan plus controls/selection/route has no console/page error; opacity contract and region visibility; all 10 field maps load.
- atlas: `npm run atlas:validate` — passed (12 fields, 549 terms, 16 missions).
- knowledge-map: `npm run knowledge-map:validate` — passed (10 implemented maps).
- npm test: passed (15 tests).
- build: `npm run build` — passed.
- extension: `npm run build:extension` — passed.
- diff: `git diff --check` — passed.

## Public QA

- deployment: GitHub Pages workflow `34489401018` passed.
- Frontend M01: M01 overlay, GitHub Pages Boundary node, route, repeated pan, `+`/`−`/fit verified.
- Algorithms / AI: production headless smoke performed pan and node selection on both maps.
- wheel: production Frontend viewport unchanged after wheel and normal document scrolling confirmed.
- mobile: 390px production smoke confirmed map canvas, selected-node detail sheet, pan, `+`/`−`/fit, and zero site errors.
- console errors: production Frontend/Algorithms/AI run reported `[]`; no passive-listener warning or `viewX` null error.

## Architecture Regression

- generic engine: `TechnologyFieldMap` remains the only map interaction engine.
- 10 maps: all generic field maps loaded in Playwright.
- 16 mission routing: atlas validation passed.
- canonical 549: atlas validation passed.
- extension 0.4.1: extension build passed; no extension source or version changed.

## Files Changed

- `.gitignore`
- `package.json`
- `playwright.config.ts`
- `playwright/technology-field-map.spec.ts`
- `src/TechnologyFieldMap.tsx`
- `src/styles.css`
- `vite.config.ts`

## Remaining Issues

- None for the scoped interaction bugs. GitHub Actions reports a pre-existing Node 20 deprecation annotation; it does not affect this deployment.

## Status

`MAP_INTERACTION_STABLE: YES`
