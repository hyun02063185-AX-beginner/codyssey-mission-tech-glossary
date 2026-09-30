# Visual Foundation V1.2 Candidate

> Status: `VISUAL_FOUNDATION_V1_2_READY_FOR_RELEASE` candidate. V1.1 (`encyclopedia-v1.1`) remains the only formal release until a separate release gate creates a tag.

## Supported themes

| Theme | Role | Typography | Character |
| --- | --- | --- | --- |
| Forest | Default | Pretendard heading/body | Friendly, calm learning environment with green accents. |
| Indigo | Technical / structured | IBM Plex Sans KR heading; Pretendard body | Indigo-blue structure and technical reference tone. |
| Paper | Reading / editorial | System serif heading; Pretendard body | Warm neutral long-form reading surface. |
| Signal | High contrast / focus | IBM Plex Sans KR heading; Pretendard body | Cobalt interaction and focus without a saturated reading surface. |

The selector remains labelled **화면 테마**. Only these four values are valid. Missing, invalid, and historic `ocean`, `amber`, and `mono` localStorage values resolve to Forest; no migration layer is needed.

## Token contract

`src/repair.css` has one authoritative token block per supported theme. It defines typography (`--font-*`, heading/body roles), surfaces, text, borders, accents, and the Map interaction tokens together. `@font-face` is self-hosted with `font-display: swap`; there is no CDN dependency.

Technology Map uses `--map-interaction`, `--map-selection-fill`, `--map-selection-border`, `--map-selection-glow`, `--map-hover-fill`, and `--map-highlight-edge`. Global accent is visible in the workspace, toolbar, controls, route/filter selection, drawer, links, focus, and product copy. Nodes use soft tint, border, low glow, and dark labels; region, relation, foundation, boundary, role, and other semantic/data colors remain independent.

## Accessibility and extension rule

Reading surfaces keep high-contrast primary text and restrained secondary text. Focus uses the theme focus token; Signal concentrates saturated cobalt on interaction rather than body surfaces. A future theme must add one complete token block, preserve the Map data-color boundary, and extend the four-theme contract tests. It must not reintroduce a global accent solid fill for selected Map nodes.

## V1.2 cleanup record

- Consolidated Forest, Indigo, and Paper from two token declarations each to one; Signal already had one. The four final blocks now include Map interaction values, so there is no later theme-token override layer.
- Removed three obsolete Map selection/highlight declarations that were always superseded by the approved restrained Map interaction contract.
- Audited legacy green literals: component foundations that are superseded by visual tokens remain historical CSS, while Map relation/region/foundation/boundary and warning/limited/error/success literals remain semantic/data-owned. No mechanical color sweep was performed.
- The self-hosted WOFF2 payload is 2,862,664 bytes across Pretendard Variable and IBM Plex Sans KR SemiBold/Bold. Browser verification confirmed both requested faces load with no font 404s; `font-display: swap` prevents blocking text.

Historical decision and Owner-review records remain in `reports/knowledge-encyclopedia/visual-design-foundation-audit.md`, `visual-theme-typography-owner-review.md`, and `technology-map-theme-refinement.md`.

## Verification

- Unit suite: 84 passing. Playwright: 47 passing, including four-theme selector, legacy preference fallback, typography, and Map interaction contracts.
- Production build, extension build, Technology Map validation, glossary/content/atlas/content-plan validators, and cp949 console audit pass.
- Manual Chromium smoke matrix: 32 desktop checks (four themes × Home, Redis detail, preliminary-M03/Learning Story, Academic, Role, Prerequisite, Atlas, and Technology Map) plus Home, Redis detail, preliminary-M03, and Technology Map at 375px; no console/network errors or document overflow.
- `git diff encyclopedia-v1.1..HEAD -- data content src/data/generated extension` and the working-tree equivalent are empty.
