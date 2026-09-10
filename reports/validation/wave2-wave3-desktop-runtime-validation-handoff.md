# Wave 2 + Wave 3 Desktop Runtime Validation Handoff

## Git baseline

Expected latest commit: replace this placeholder with the Wave 3 final commit after pull. Work on `main` with a clean worktree.

## Preconditions

Use the existing Windows Desktop development environment with Node.js and npm available. Do not install dependencies on the public Mac.

## Commands

```powershell
git pull
npm test
npm run atlas:validate
npm run knowledge-map:validate
npm run build
npm run build:extension
git diff --check
```

## Browser routes

- Atlas: `#/maps`
- Existing primary overlays: Frontend M01/M02, Git M04, Data M11, Linux M07/M08, DevOps preliminary M01, Network M05, Backend M12, Security M13.
- Algorithms: `#/maps/algorithms-data-structures?mission=main-m09` and `#/maps/algorithms-data-structures?mission=main-m10`
- AI: `#/maps/ai-ml-computing?mission=main-m06`
- Cross-field partial contexts: `#/maps/git-collaboration?mission=preliminary-m02`, `#/maps/data-database?mission=preliminary-m03`, `#/maps/ai-ml-computing?mission=preliminary-m03`, `#/maps/data-database?mission=main-m03`
- Legacy regression: `#/maps/main-m01?term=fetch-api`

## Browser checks

Verify ten standalone cards and two non-clickable cross-field cards; all overlays, search, node selection, route highlighting, term deep links, and Mission Detail multi-map CTAs. At 390px, inspect touch navigation and horizontal overflow. Check browser console errors, Vite chunks, and extension build regression.

## Expected status

This handoff is `PENDING_DESKTOP_VALIDATION`: the public Mac intentionally has no Node/npm, so no npm, Vite, extension, or browser-runtime command was attempted here.
