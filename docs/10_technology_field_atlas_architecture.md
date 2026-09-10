# 10. Technology Field Atlas architecture

## Model

Technology maps are owned by a stable technology field, not by a mission. A canonical term has one primary home field and may be reused by other maps as a secondary context. A mission is an overlay whose terms can span several field maps.

```text
Technology Atlas
├─ Field maps (stable ownership)
│  ├─ Frontend / Web UI
│  ├─ Backend / Server / API
│  ├─ Data / Database
│  └─ …
└─ Mission overlays (contextual selection)
   ├─ M01 → Frontend primary + protocol/platform boundaries
   ├─ M02 → Frontend primary + security/BaaS/platform boundaries
   └─ future missions → existing field maps, without duplicating terms
```

## Ownership and reuse

- `primaryField` is the term's home map and avoids duplicate graph ownership.
- `secondaryFields` records a repeatable consumer, provider, operation, or security context; it does not create a duplicate canonical term.
- `core`, `foundation`, `boundary`, and `shared` describe the term's role in its home map.
- Field-to-field links use existing graph relations where possible: `uses`, `provided_by`, `interacts_with`, `prerequisite`, and `cs_foundation` remain reusable across field maps. No ontology expansion is needed yet.

Examples: HTTP has the Network / Web Protocol home and is shared with frontend, backend, security, and infrastructure. Fetch API has the Frontend home and is a network/server boundary. GitHub Pages has the DevOps / Infrastructure home and is a frontend/repository boundary.

## Data contract

| Artifact | Status | Responsibility |
| --- | --- | --- |
| `data/knowledge-maps/atlas/field-taxonomy.json` | authored | Field IDs, purpose, map order, policy |
| `scripts/build_technology_field_atlas.py` | authored | Deterministic classification rules and explicit cross-field overrides |
| `term-field-classification.json` | derived | Complete 549-term field classification |
| `mission-field-matrix.json` | derived | 16 mission overlay analysis |
| `scripts/validate_technology_field_atlas.py` | authored | Coverage and matrix consistency checks |

The derived files are regenerated with `npm run atlas:validate`. They do not alter canonical glossary terms, frontend graph nodes, Web UI, or Chrome Extension behavior.

## Implementation order

1. Expand the existing Frontend field map with the M02 overlay and React/client-routing core terms.
2. Implement Git / Collaboration as the next self-contained field map because M04 has complete single-field coverage.
3. Implement Data / Database from M11, then Backend / Server / API from M12.
4. Add Infrastructure / Network and Security maps as connected boundary maps rather than duplicating HTTP, credentials, or deployment nodes.
# Wave 2 update

The Atlas has 12 taxonomy fields: 8 implemented field maps, 2 planned standalone maps (Algorithms / Data Structures; AI / ML / Computing), and 2 confirmed cross-field layers (Programming Foundations; Developer Workflow / Tools). Linux / OS / Runtime, DevOps / Infrastructure, Network / Web Protocol, Backend / Server / API, and Security / Identity all use the same generic map engine and lazy loader introduced in Wave 1.

Canonical definitions remain single-source glossary records. Field maps may reuse a canonical term only in a declared home or secondary-field context, with core/foundation/boundary/shared roles describing the map context rather than changing the meaning. See `docs/12_cross_field_layer_architecture.md` for the Wave 2 layer decision and examples.

# Wave 3 completion

The Technology Atlas is now complete at its planned field-map boundary: 10 standalone implemented maps and 2 cross-field layers. Algorithms / Data Structures and AI / ML / Computing use the same generic engine and lazy loading as every prior field. There are no planned field maps remaining in the v1 taxonomy.

Mission routing is now a first-class authored artifact at `data/knowledge-maps/atlas/mission-map-routing.json`. A mission may be field-primary or cross-field-layer-primary and may list multiple implemented map contexts. The Mission Detail view exposes every context with an overlay, while non-map cross-field layers are explained rather than linked to an empty canvas. Runtime validation is deferred to the desktop environment; public deployment is the next lifecycle stage, not part of Atlas completion.
