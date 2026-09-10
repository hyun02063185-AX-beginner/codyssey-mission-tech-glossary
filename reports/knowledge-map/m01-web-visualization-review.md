# M01 Knowledge Map Web Visualization Review

## Implementation choice

Custom SVG/CSS was selected instead of a graph dependency. The M01 graph has a bounded 37-node / 50-edge scope, needs a deterministic educational layout rather than physics simulation, and benefits from a route-level lazy chunk. Region boxes are the only layout constants; node cards are derived from `knowledge-map.json` by region, so node and edge metadata is not duplicated in the UI.

The map route is `#/maps/main-m01`; `#/maps/main-m01?term=<termId>` selects a mission node. Unknown term queries retain the map and display a fallback message.

## Semantic gate

The existing graph was re-reviewed before UI work. It remains at 37 nodes and 50 edges.

- Replaced the redundant `GitHub Pages → CSS` deployment edge with `Mobile First → CSS`; this makes the responsive route start from the actual CSS authoring basis.
- Replaced the redundant `Form Validation → DOM` edge with `Dark Mode ↔ JavaScript`; it records the M01 theme-toggle behavior separately from CSS presentation and localStorage persistence.
- Dark mode is intentionally not included in the responsive-layout route. It has its own theme-preference route: Dark Mode + CSS + JavaScript + localStorage + Web Storage.
- The three `evolved_from` edges remain MEDIUM architectural comparisons: async/await ↔ Callback Pattern, Fetch API ↔ XMLHttpRequest, localStorage ↔ Cookie. The panel explicitly says they are historical context, not single-cause claims.
- No LOW-confidence edge exists. `async/await`, Fetch API, and DOM are never presented as Queue, JavaScript, or HTML subtypes.

## Layout and interaction

The desktop map uses eight stable regions: Document & Structure, Presentation & UI, JavaScript Language, Browser & Web APIs, Async Execution, Network & External API, State & Persistence, and Development / Platform. Mission nodes use an `M01` text marker and solid outline; foundation nodes use a `기초` text marker and dashed outline.

Overview shows only selected high-value relations. Selecting a node highlights its direct edges and neighbors; selecting one of four data-defined learning routes highlights its included nodes and actual internal graph edges. The map supports pointer pan, wheel/+/- zoom, fit/reset, node click, keyboard Enter/Space selection, and shared glossary alias search. Nodes are not draggable.

## Detail and links

The selected panel shows summary, region, technology layer, standard/provider, M01 context, directional relation reason, evolution context, CS/foundation connections, and the term-detail link only for canonical mission nodes.

- Mission M01 includes a map entry CTA.
- Only M01 Quick Terms include the term-detail map CTA.
- No Chrome Extension behavior, version, or deep link implementation changed.

## Responsive and accessibility

At mobile width, readable region buttons, search, route cards, and detail panel are the primary navigation. The canvas stays in an internal horizontal scroller rather than creating page-level overflow. SVG nodes are focusable controls with labels that include layer and origin; controls and route selectors use native buttons and text markers supplement color.

## Bundle impact

The map is loaded with `React.lazy`.

| Output | Before | After |
| --- | ---: | ---: |
| Initial JS | 732.50 kB / 137.33 kB gzip | 735.21 kB / 138.35 kB gzip |
| Map chunk | — | 41.39 kB / 11.49 kB gzip |

The pre-existing initial-chunk warning remains, but the map itself is not loaded on Home, Terms, or Mission routes.

## QA

Playwright smoke checks passed in Chromium:

- Desktop 1440: 8 regions and 37 nodes render; selection, panel, route highlight, reset, detail link, mission CTA, and term CTA work.
- Deep link: `?term=fetch-api` selects Fetch API; an invalid term falls back without error.
- Mobile 390: region navigation and search selection work; document-level horizontal overflow is false.
- Console and page errors: 0.

Known limitations: edge labels are intentionally available through hover title and the selected-node panel instead of being permanently printed on all roads; the mobile canvas remains available for spatial exploration but is secondary to readable navigation controls. Public GitHub Pages URL smoke and Chrome Web/Map deep links are deferred.
