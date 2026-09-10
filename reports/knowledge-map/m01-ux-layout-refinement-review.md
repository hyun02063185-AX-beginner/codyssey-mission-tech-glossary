# M01 Knowledge Map UX Layout Refinement Review

## Objective

The first map implementation placed selected detail and learning routes below the canvas. This refinement groups the controls, routes, canvas, and detail into one Map Stage so a selection and its visible graph change remain in the same viewport.

## Layout change

Desktop Map Stage has three adjacent areas:

1. A stage toolbar: legend, four route chips, term search, and zoom controls.
2. The map canvas: the main visual surface.
3. A persistent right-side panel: empty, selected-node, or selected-route state.

Route chips now live above the canvas. Selecting a route clears a prior node selection, highlights the route in the graph, marks the active chip, and immediately replaces the right panel with the route’s description and node sequence. Selecting a node keeps the active graph focus and immediately replaces the right panel with its detail.

The former large route-card section below the map was removed. A single short helper sentence remains below the Stage as secondary information.

## Visual feedback

- Selected node: stronger outline, shadow, direct edge and neighbor highlight, `선택됨 · <term>` panel state.
- Selected route: active chip, route node/edge highlight, non-related nodes and roads dimmed, `경로 강조 중 · <route>` panel state.
- The map canvas remains the primary surface; the panel is constrained to the Stage height and scrolls internally when needed.

## Mobile

The toolbar becomes vertically ordered, with horizontally scrollable route chips and region navigation. The canvas stays inside its own horizontal scroll container; the selected panel immediately follows it in the same Stage and becomes a sticky, height-limited bottom-sheet-like detail surface. This avoids a separate long explanatory section later in the page and preserves document-level horizontal overflow at zero.

## Preserved behavior

- Graph source, 37 nodes, and 50 edges unchanged.
- `#/maps/main-m01` and `?term=<termId>` selection behavior unchanged.
- Search, pan/zoom, reset, keyboard node selection, route highlighting, and glossary detail links retained.
- No Chrome Extension, Webtoon, or canonical glossary changes.

## QA

Chromium smoke at 1440px confirmed route selection displays graph emphasis and route explanation in the Stage; Fetch selection updates the nearby panel and active node. At 390px, deep-linked Fetch detail and all four route chips render, selection remains usable, and page-level horizontal overflow is false. Console/page errors: 0.

## Known limitations

At mobile width the spatial map remains an optional horizontally pannable canvas; readable route chips, region buttons, search, and the sticky detail panel are the primary exploration controls. Long node relationship lists scroll inside the detail panel by design.
