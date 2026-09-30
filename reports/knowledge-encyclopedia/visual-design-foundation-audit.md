# Knowledge Encyclopedia — Visual Design Foundation & Readability Sprint

> 2026-09-30 · baseline: `encyclopedia-v1.1` → `e3b6e39`
> Candidate verdict: **`VISUAL_DESIGN_FOUNDATION_READY_FOR_OWNER_REVIEW`**
> V1.1 remains the current release. This candidate does **not** create an `encyclopedia-v1.2` tag.

## 1. Audit scope and evidence

The review covered the Encyclopedia home, a term detail page, preliminary M03's “점이 선이 되는 순간” story card, and Technology Map. The pre-existing app was functional and consistently Green, but the old Accent Theme candidate changed chiefly interactive color. It did not give headings, reading width, surfaces, borders, or map chrome distinct visual roles.

The CSS audit found direct Green values throughout the UI (`#1d4d42` 57 occurrences and `#315f52` 22 occurrences) and no explicit heading/body/mono token system. The term page also inherited the general 980px container, making long prose compete with index-like and map-like screens. The map's region, relation, role, warning, and metadata colors are information colors, not brand colors, so they are excluded from theme recoloring.

## 2. Foundation decisions

| Layer | Decision |
| --- | --- |
| Typography | `--font-heading`, `--font-body`, and `--font-mono`; no CDN or remote font loading. Windows uses Malgun Gothic and macOS uses Apple SD Gothic Neo/system fallbacks. |
| Reading layout | Detail articles are capped at 760px; headings, summaries, hero copy, cards, and code have separate readable measures and spacing. |
| Surfaces and borders | `--surface-page`, `--surface-raised`, `--surface-soft`, `--surface-selected`, `--border-subtle/default/strong`, and primary/secondary/muted text roles replace one-color treatment. |
| Interaction | Accent, hover, selected, focus, and on-accent text are tokenized. Native controls retain familiar keyboard behavior. |
| Data integrity | Canonical/data/relations/graph/mission/academic/path sources and generated data are untouched. |

The standalone MAC iframe/asset remains its own runtime. Only its surrounding Learning Story and entry wrappers receive the shared page surface treatment.

## 3. Screen themes for review

| Theme | Intended reading character | Visible treatment |
| --- | --- | --- |
| Forest | Continuity with the established Green identity | Deep green accent, calm green-soft panels, familiar navigation and focus state. |
| Indigo | Structured technology reference | Indigo accent, cooler blue-violet surfaces, clearer control/selection contrast. |
| Paper | Editorial, long-form reading | Warm paper canvas, restrained ink/brown accent, serif-first headings with Korean-safe fallback body text. |

The selector is named **화면 테마** and persists locally; an invalid stored value falls back to Forest. It intentionally exposes three reviewable directions rather than five minor color variants.

## 4. Technology Map boundary

Theme coverage is limited to workspace/page canvas, toolbar, control chrome, drawer/detail panel, borders, and selection affordances. Region fills, edge/relation semantics, node role colors, warning/error semantics, and established map metadata colors remain data-owned. Dragging the canvas cannot select text; the detail drawer remains copyable text.

## 5. Browser review matrix

Browser-driven Chromium checks exercise each theme and the representative routes below. They establish functional/style contracts, not a substitute for Owner visual judgment.

| Screen | Forest | Indigo | Paper | Owner visual check |
| --- | --- | --- | --- | --- |
| Encyclopedia Home | pass | pass | pass | hierarchy, card density, first action |
| Term Detail | pass | pass | pass | long-form measure and code readability |
| M03 Learning Story | pass | pass | pass | story wrapper versus isolated asset boundary |
| Technology Map | pass | pass | pass | chrome contrast; data colors unchanged |

## 6. Accessibility and responsive guardrails

- Body text uses a Korean-capable system stack, 16px base size, and 1.72 line-height (15.5px / 1.75 on narrow screens).
- Heading levels use a deliberate scale and tighter display tracking; mono text is restricted to code-like UI.
- Accent and focus use explicit tokens rather than relying on a theme's raw primary color alone.
- Small screens reduce whitespace and preserve mobile map behavior without changing the standalone asset.

## 7. Verification record

- `npm run test` — 84 passing tests.
- `python scripts/qa_playwright.py` — 45 passing Chromium tests, including theme persistence, Map chrome change, map data-color preservation, no canvas text selection, and copyable detail text.
- `npm run build` — PASS (the pre-existing Vite large-chunk advisory remains non-blocking).
- `npm run build:extension` — PASS; deep-link artifacts verified.
- `npm run knowledge-map:validate` — PASS (10 implemented maps / 12 registry maps, 2 cross-field layers).
- `npm run qa:console` — PASS (9/9); the data build's encyclopedia validation reports 0 errors and 0 warnings.
- `git diff encyclopedia-v1.1..HEAD -- data content src/data/generated extension` and the working-tree scoped drift check found no candidate data, generated-data, or extension change.

## 8. Owner review protocol

1. Open each row in the matrix under Forest, Indigo, and Paper.
2. Compare readability before judging preference: heading/body distinction, paragraph width, card scanability, control discoverability, and Map chrome/data separation.
3. On M03, verify that the shared story wrapper feels cohesive while the standalone MAC interaction remains unchanged.
4. Record a preferred direction or specific revisions. No release decision follows automatically from this candidate.

## 9. Known limitations

- The work uses available local/system fonts only, so exact glyph metrics vary slightly by operating system.
- Automated browser checks cannot approve subjective brand fit, illustration balance, or editorial tone. Owner side-by-side review is still pending.
- Vite's existing large-chunk advisory is unrelated and non-blocking.
