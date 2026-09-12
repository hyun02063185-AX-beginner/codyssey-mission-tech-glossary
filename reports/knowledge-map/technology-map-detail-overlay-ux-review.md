# Technology Field Map UX Improvement 결과

## Git

- start: `fe0ae57`
- end: `5b9881b` (`feat(knowledge-map): improve map detail overlay ux`)
- push: `origin/main` pushed; GitHub Pages workflow `34693352262` succeeded
- status: clean after this report commit and push

## Selected Node Contrast

- root cause: `.map-node.is-selected` filled every selected card with dark green and changed marker, title, and layer text to white. This made the light Boundary card lose its intended readable contrast.
- Boundary: keeps its cream background, dark title (`#17212b`) and medium layer text (`#617067`); selected state uses a deeper amber border and shadow.
- Core: keeps a light card and dark text when selected; green border and shadow indicate selection.
- Foundation: keeps its light neutral background and dark text when selected; border and shadow indicate selection.
- fix: selected styling is no longer text inversion. Border, stroke width, focus outline, shadow, relation highlight, and existing subtle dimming communicate selection.

## Desktop Layout

- before: `map-workspace` used a two-column grid with a persistent 350px detail column, reducing the map canvas even before a user selected anything.
- after: the workspace is a full-width map canvas. A selected node or route mounts a right-side `map-detail-panel` inside the map shell as an absolute overlay.
- map width: the Playwright regression test records workspace width before and after selection and verifies no material width loss.
- overlay panel: `clamp(340px, 31vw, 400px)`, internal scrolling, content renderer reuse, no global backdrop, and only the panel captures pointer input.
- close behavior: close hides the panel while preserving the selected-node or route highlight; a different selection reopens it.
- animation: 180ms opacity + `translateX`; disabled under `prefers-reduced-motion`.

## Mobile

- bottom sheet: at the existing `700px` breakpoint, the selected detail panel becomes an in-workspace bottom sheet rather than a right drawer.
- pan: map remains available outside the sheet; the panel alone captures its own scrolling and pointer input.
- overflow: 390px Playwright regression and production smoke both confirmed no page-level horizontal overflow.
- detail: deep-link and node selection open the sheet; horizontal route/filter chip scrolling remains unchanged.

## Map Interaction

- pan: retained and covered by repeated-pan regression test.
- zoom +/-: retained through existing explicit controls.
- fit: retained through the existing `맞춤` control.
- wheel: still does not change the map viewport; normal page scrolling remains covered by regression test.
- selected node: panel opens for node selection and deep-linked `term` selection.
- route: route selection opens the same overlay renderer with Route Detail and preserves route highlighting.

## Deep Link

- mission: `#/maps/frontend?mission=main-m01&term=github-pages` retained its mission overlay.
- term: GitHub Pages Boundary term was selected on public GitHub Pages.
- panel: public deep-link automatically opened the detail panel, and its close action was verified.
- selected node: selection URL contract remains unchanged; no route or extension code changed.

## Tests

- new tests: Boundary selected-text computed colors; desktop overlay/no workspace shrink; close and reselection; mobile bottom-sheet/no overflow.
- map interaction: `npm run test:map-interaction` — 5 passed.
- atlas: `npm run atlas:validate` — passed (12 fields, 549 terms, 16 missions).
- knowledge-map: `npm run knowledge-map:validate` — passed (10 implemented maps, 2 cross-field layers).
- npm test: `npm test` — 26 passed.
- build: `npm run build` — passed.
- extension build: `npm run build:extension` — passed.
- diff: `git diff --check` — passed.

## Public QA

- Frontend: public M01 GitHub Pages Boundary deep-link loaded the selected node and overlay panel; close worked while the selection remained.
- GitHub Pages Boundary: title, layer metadata, and summary remained readable; the deployed build exposed the new close control.
- Algorithms: public Boundary-node selection opened its detail overlay.
- AI: public M06 mission overlay and AI / ML / Computing map loaded normally.
- mobile 390px: selected detail sheet opened; no page-level horizontal overflow.
- console: public desktop and mobile smoke runs reported 0 console errors.
- network: public desktop smoke run reported 0 4xx/5xx responses.

## Architecture Regression

- canonical: unchanged; atlas validation confirms 549 terms.
- maps: unchanged data; 10 standalone maps load through the same `TechnologyFieldMap` engine.
- layers: unchanged; knowledge-map validation confirms 2 cross-field layers.
- missions: unchanged; atlas validation confirms 16 missions.
- extension: Chrome Open-book source/version untouched; `build:extension` passed.
- route contract: unchanged (`#/maps/<mapId>?mission=<missionId>&term=<termId>`).

## Files Changed

- `src/TechnologyFieldMap.tsx`
- `src/styles.css`
- `playwright/technology-field-map.spec.ts`
- `reports/knowledge-map/technology-map-detail-overlay-ux-review.md`

## Remaining Issues

- None in the scoped overlay, selected contrast, map interaction, and deployment checks.

## Notion Update Payload

Latest Git: `5b9881b`

Milestone: Technology Field Map detail overlay UX improvement

Desktop Map Layout: Full-width map-first canvas; no persistent split detail column

Detail Panel: Selected node/route opens a map-container right overlay drawer with close, internal scroll, 180ms reduced-motion-safe transition

Mobile Detail: Existing breakpoint uses an in-map bottom sheet; 390px no-overflow QA passed

Selected Node Contrast: Dark title and readable metadata remain on light selected cards; selection uses border/shadow/edge emphasis

Boundary Node Fix: Cream Boundary card retains dark text with deeper amber selected border

Map Interaction Stability: Pan, explicit zoom +/−, fit, route selection, and wheel-no-zoom behavior retained

Public QA: GitHub Pages deployment `34693352262` passed; Frontend M01 deep link, Algorithms Boundary detail, AI M06 overlay, mobile 390px, console/network smoke passed

Extension Compatibility: Chrome Open-book 0.4.2 source and route contract unchanged; extension build passed

Architecture: Generic `TechnologyFieldMap` remains the sole map interaction engine; canonical/map/layer/mission data unchanged

Known Issues: None in scoped work

Next Stage: PENDING SOL SYNC

Status: PENDING SOL SYNC

## Status

`TECHNOLOGY_MAP_UX_POLISHED: YES`
