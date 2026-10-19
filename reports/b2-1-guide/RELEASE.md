# B2-1 approved guide integration — 2026-10-19

- Approved branch baseline: `10c638469c579cf5a46b81008cbc040ff6086e74`.
- Integrated main baseline: `5855b7645ca8372a38e23da0d324ec14fde537c6`.
- Merge resolution: retain B2-1 entry/routes together with main's B3-1 and B6-1 entries/routes. No approved B2-1 Markdown or SVG changed. Existing B1-1/B3-1/B6-1 source and B2-1 Story unchanged.
- Validation: `npm ci`, `npm run build` PASS; `npm test` 8 files / 88 tests PASS; `npx playwright test` 85 PASS (1.4m). Chromium 153, macOS, Node 24.22.0. Full regression includes B2-1 320/360/390/768/1024/1280 widths, all nine chapters, SVG geometry/text, original links, navigation, themes, existing Story and B1-1/B3-1/B6-1 guides.
- Visual spot checks: regenerated 360px CLI diagram and 1280px overview; no clipping or overlap observed. Previous approved content/design retained.
- Final review: all main routes preserved; no canonical, taxonomy, existing maps, extension, dependencies or deployment configuration changes. Build and unit generators leave tracked data unchanged.
- Deployment: existing main push workflow builds Vite dist and deploys with GitHub Pages Actions. Squash merge selected as requested: obsolete QA PNG objects in feature commit history will not become main ancestors. Only existing curated 13 PNG / 770,164 bytes remain in the final tree.
- Existing notices: large bundle warning; encyclopedia builder reports an upstream excluded self-reference (`remote`) with validation 0 errors / 0 warnings. npm install reports existing dependency audit findings; dependency updates are outside this approved-content release.
- Scope limit: Chromium automated checks and targeted image inspection; no physical iOS/Android device test or new content redesign/reapproval.
