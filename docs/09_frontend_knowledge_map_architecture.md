# 09. Frontend Knowledge Map v1 architecture

## Purpose

The Frontend Knowledge Map is a field-level map for the technologies used to build, style, program, and connect web pages. Its v1 graph begins with the existing verified 37 nodes and 50 edges. It keeps that scope intentionally small: promotion changes the ownership model, not the size of the graph.

Missions are overlays. An overlay selects field nodes and supplies mission-specific context; it does not create a parallel graph or relabel nodes as mission-owned.

## Sources and derived artifacts

| Responsibility | Path |
| --- | --- |
| Authored field graph | `data/knowledge-maps/frontend/knowledge-map.json` |
| M01 derived overlay | `data/knowledge-maps/frontend/overlays/main-m01.json` |
| Overlay generator | `scripts/build_frontend_m01_overlay.py` |
| Generic graph validator | `scripts/validate_knowledge_map.py` |
| Generated web data | `src/data/generated/frontend-knowledge-map.json`, `src/data/generated/frontend-overlay-main-m01.json` |

The M01 overlay is generated from the existing Open-book Quick Terms, glossary metadata, and mission-term map. It must cover all 23 Quick Terms. Wider M01 relations remain in `data/curated/mission-term-map-v0.1.yaml`.

## Node roles

- `core`: a technology that belongs directly to the Frontend field seed.
- `foundation`: a standard, execution model, or fundamental concept needed to explain a field technology. A foundation node requires `foundationRationale`.
- `boundary`: a technology adjacent to Frontend that is important in practical web work but should not be presented as a Frontend core. HTTP, request/response, external APIs, rate limits, and deployment-related nodes are shown this way where applicable.

`nodeOrigin` describes whether the node is authored for the field or supplied as foundation context. `nodeRole` is the visual and explanatory classification. No node has an M01-only identity.

## UI and URL contract

| Purpose | Hash URL |
| --- | --- |
| Frontend field map | `#/maps/frontend` |
| M01 overlay | `#/maps/frontend?mission=main-m01` |
| M01 overlay and selected term | `#/maps/frontend?mission=main-m01&term=<termId>` |
| Legacy M01 entry | `#/maps/main-m01` redirects to the M01 overlay; `term` is preserved |

The map stage keeps route chips, search, pan/zoom, keyboard selection, node and edge highlighting, and the adjacent selected-detail panel. Route chips remain field-level learning routes. When an M01 overlay is active, an explicit context label and node treatment make the mission focus visible without hiding the surrounding field.

## Validation

```bash
npm run knowledge-map:validate
```

The validation covers duplicate or unknown IDs, region and role values, foundation rationale, routes, evidence, orphan nodes, overlay node and route references, M01 Quick Term coverage, and removal of the obsolete map data directory. Build generation copies the authored graph and generated overlay into the web data bundle.

## Growth rule

Future Frontend terms should be added only when a real source supports a field relation or a mission overlay requires the node. New missions receive independent overlays. The shared map remains the owner of reusable nodes and edges.
