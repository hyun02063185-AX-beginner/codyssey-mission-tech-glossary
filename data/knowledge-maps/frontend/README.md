# Frontend Knowledge Map data

`knowledge-map.json` is the authored **Frontend field map v1**. It owns the 37-node / 50-edge seed graph, regions, Core/Foundation/Boundary roles, and field-level learning routes. It is deliberately not identified as an M01 graph.

`overlays/main-m01.json` is a derived mission overlay. It reads the existing M01 Open-book Quick Terms and curated mission relationships, then marks the relevant field nodes without changing their field identity.

Sources:

- `content/peer-review/main-m01-openbook.yaml`
- `data/curated/glossary-master-v0.1.yaml`
- `data/curated/mission-term-map-v0.1.yaml`
- `content/terms/<termId>.md`
- `content/webtoons/<termId>/concept.md`

Regenerate and validate:

```bash
npm run knowledge-map:validate
```

The validator checks graph IDs, regions, roles, foundation rationale, evidence, edge integrity, and overlay coverage. M01 Quick Terms must resolve to the derived `main-m01` overlay; the overlay does not replace the wider mission-term map.
