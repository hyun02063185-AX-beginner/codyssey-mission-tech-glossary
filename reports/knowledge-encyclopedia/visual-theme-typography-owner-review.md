# Visual Theme Typography — Owner Review Candidate

> 2026-09-30 · baseline: `encyclopedia-v1.1` → `e3b6e39`
> Verdict: **`VISUAL_THEME_TYPOGRAPHY_READY_FOR_OWNER_REVIEW`**
> This candidate supersedes the earlier three-theme comparison. V1.1 remains the current release; no `encyclopedia-v1.2` tag is created.

## Decision

| Theme | Typography identity | Surface and accent direction |
| --- | --- | --- |
| Forest | Pretendard Variable for heading and body; softer tracking and wider visual rhythm for long Korean reading | Existing Green continuity and quiet learning surfaces |
| Indigo | IBM Plex Sans KR in headings, Pretendard Variable in body; tighter heading tracking and tabular numerals make Korean/English/numeric technical labels more structured | Cool indigo information surfaces; not a recolored Forest |
| Paper | Serif-first system heading (`ui-serif` / Noto Serif KR / Batang fallback) with Pretendard body | Warm editorial reading surface, unchanged direction |
| Signal | IBM Plex Sans KR heading with Pretendard body; compact technical hierarchy | Cobalt selected/CTA/focus/nav accent on a neutral blue-white reading surface |

## Self-hosted font strategy

Only two webfont families are shipped, from their official upstream projects and bundled by Vite with no CDN request:

- **Pretendard Variable** — 2,057,688 bytes WOFF2. It supplies the body face across themes and Forest headings, ensuring Korean glyph coverage plus coherent English technical terms and numerals on Windows and macOS.
- **IBM Plex Sans KR** — 434,484 byte SemiBold and 370,492 byte Bold WOFF2. It is requested only where Indigo/Signal headings need the more technical character; regular body text does not pay for a separate Plex regular face.
- Both use `font-display: swap`: no FOIT; the Korean-capable system stack remains the immediate fallback while the local files load. Vite fingerprints the assets, so GitHub Pages paths remain correct.
- Paper retains its system-serif heading strategy instead of adding a third self-hosted family. This keeps the candidate at two shipped families while preserving its editorial distinction.

The sources are OFL-licensed; the included license files are `src/assets/fonts/LICENSE-Pretendard-OFL.txt` and `src/assets/fonts/LICENSE-IBMPlex-OFL.txt`.

## Contrast and data boundary

Signal applies cobalt to headings, active navigation, CTA, selected state, focus, and Map chrome. Its page and long-form surfaces remain pale and low-saturation. Forest/Indigo/Paper/Signal do not recolor semantic warning/error/success states or Map region and relation data colors. Browser assertions compare the Map region fill and relation stroke across themes while requiring the workspace chrome to differ.

## Owner comparison set

The refreshed [four-theme screenshot index](owner-review-screenshots/index.html) contains 16 viewport captures (1440×1100): Encyclopedia Home, Redis Term Detail, preliminary M03 Learning Story, and Data/Database Technology Map with the preliminary-M03 overlay.

Review these questions directly:

1. Forest versus Indigo heading glyphs, spacing, and hierarchy are visibly distinct without reducing body readability.
2. Signal’s selected/CTA/focus emphasis is clear without tiring the long-form Redis page.
3. Paper still reads as editorial rather than merely warm-colored.
4. On Map, theme chrome changes while region/relation/role semantics remain independently legible.

## Verification

- `npm run test` — 84 passing tests.
- `npm run build` — PASS; self-hosted WOFF2 files emitted with hashed, GitHub-Pages-safe URLs.
- `python scripts/qa_playwright.py` — 46 passing Chromium tests, including loaded Forest/Indigo heading-family differentiation and Signal Map data-color contract.

The existing Vite large-chunk advisory remains unrelated and non-blocking.
