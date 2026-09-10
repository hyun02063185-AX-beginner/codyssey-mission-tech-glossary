# 11. Generic Knowledge Map Engine

## Field map first

A map belongs to one technology field. Missions do not own graphs: they are overlays that select nodes, routes, and mission context on a field map. A canonical glossary term remains one record even when it is reused as a boundary on another map.

## Runtime structure

```text
#/maps
  └─ map-registry.json → Atlas landing status and cards

#/maps/:mapId
  └─ TechnologyFieldMap
       └─ knowledgeMapLoader
            └─ lazy graph + overlay JSON for that mapId
```

`TechnologyFieldMap` owns the verified Map Stage UX: search, deterministic region layout, pan/zoom, keyboard selection, route highlighting, dimming, detail panel, and mobile sticky detail sheet. It has no field-specific rendering branch.

## Data contract

- `data/knowledge-maps/map-registry.json` is the authored registry. It declares field identity, status, route availability, source graph, and overlays.
- Each implemented map owns `knowledge-map.json` with `mapId`, `fieldId`, status, regions/layout, nodes, edges, and learning routes.
- Mission overlay JSON is derived from canonical mission term relations and only references nodes curated into its field map.
- `scripts/build_web_data.py` generates browser data and enriched registry metadata. It does not load SVG map data on the Atlas landing route.

Node roles remain `core`, `foundation`, `boundary`, and `shared`. A foundation can be canonical or explicitly synthetic; synthetic nodes do not get a glossary link. A map is a curated learning view, not a canvas dump of every field term.

## Wave 1 maps

| Map | Curated graph | Overlay |
| --- | ---: | --- |
| Frontend | 49 nodes / 63 edges | M01 (23 Quick Terms), M02 (12 React/client nodes) |
| Git / Collaboration | 27 nodes / 24 edges | M04 (11 collaboration nodes) |
| Data / Database | 21 nodes / 17 edges | M11 (21 database nodes) |

The M01 node and edge seed remains intact; Wave 1 only adds the React/client region and its field routes.

## Validation and growth

`npm run knowledge-map:validate` checks every implemented registry map, graph/registry identity, canonical term-field context, regions, node roles, edges, routes, overlays, mission matrix membership, M01 Quick Term coverage, and the legacy M01 redirect contract.

To add the next field map, add curated source graph and overlay paths to the registry, implement its derived overlay source, then extend the centralized loader with one lazy data entry. No Field-specific React component is created.
# Wave 2 update

The engine remains field-agnostic. Wave 2 adds five registry entries and lazy loader functions; it adds no map-id-specific rendering branch. Every graph uses the same regions, canonical `term:<termId>` nodes, relation ontology, learning routes, and mission overlay contract. The registry status `cross-field-layer` is intentionally non-clickable on the Atlas landing page.
