# Technology Map — Theme Intensity Refinement

> 2026-10-01 · baseline: `encyclopedia-v1.1` → `e3b6e39`
> Verdict: **`TECHNOLOGY_MAP_THEME_REFINEMENT_READY_FOR_OWNER_REVIEW`**
> V1.1 remains the current release. No `encyclopedia-v1.2` tag or release is created.

## Scope

Only Technology Map interaction intensity changed. Typography, global theme palettes, term detail, mission view, Learning Story, MAC asset, canonical data, graph, relations, and generated data remain out of scope.

## Interaction treatment

Map-specific tokens separate data reading from global theme accents:

`--map-interaction` · `--map-selection-fill` · `--map-selection-border` · `--map-selection-glow` · `--map-hover-fill` · `--map-highlight-edge`

- Neutral nodes preserve their data/role treatment.
- Hover adds only a very soft tint and a modest border.
- Selected nodes use a pale Map selection fill, 2.25px theme border, low-opacity 4px glow, and dark labels. No selected node receives `accent-on-primary` white text.
- Foundation and boundary nodes retain their information fill through a weighted mix when selected.
- Highlighted edges use the Map token at 2.15px / 0.82 opacity; base relation colors remain unchanged.
- Toolbar, filter/route controls, workspace, drawer, links, focus, and product copy retain their normal theme presence. The drawer therefore carries more theme expression than the selected node.

Signal keeps its cobalt border and drawer/control emphasis, but its selected fill is `#eef3ff` and glow opacity is deliberately low so it does not read as a button.

## Browser state coverage

The four-theme Playwright contract verifies, for Forest / Indigo / Paper / Signal:

1. neutral core node;
2. hover tint weaker than selection;
3. selected node + open drawer;
4. dark readable selected label;
5. subdued highlighted relation;
6. unchanged Map region, relation, foundation, and boundary data colors.

Existing Map tests continue to cover pan/drag, text-selection prevention, reading/fit controls, click, overlay, deep link, history, and mobile sheet behavior.

## Owner comparison assets

[Same-viewport before/after Map comparison](map-theme-refinement-screenshots/index.html): 1440×1100 Chromium captures for the Data / Database Map, preliminary-M03 overlay, and the same JSON node.

- Before: `#/maps/data-database?mission=preliminary-m03`
- Selected: `#/maps/data-database?mission=preliminary-m03&term=json`

Review whether the selected border is unmistakable without becoming the largest color area, and whether Signal still keeps Map data colors ahead of theme expression.

## Verification

- `python scripts/qa_playwright.py` — 47 passing Chromium tests.
- Production build, extension build, map validation, unit suite, console encoding, and scoped V1.1 drift checks are recorded in the candidate closeout commit.
