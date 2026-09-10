# Cross-field Layer Architecture

## Wave 2 decision

`Programming Foundations` and `Developer Workflow / Tools` are both `CROSS_FIELD_LAYER`, not standalone maps. They have no empty clickable canvas in the Atlas.

- Programming Foundations supplies language and execution concepts (for example function, type, module, exception, scope, and iteration) only where a field map needs them.
- Developer Workflow / Tools supplies reusable interaction and practice concepts (for example CLI, editor, curl, troubleshooting, and documentation) in their relevant field contexts.

This preserves the field-map rule: a standalone canvas needs a distinct technical structure and independent learning routes, rather than a collection of prerequisites reused by every field.

## Canonical and boundary policy

Each canonical term has one glossary definition and one Atlas home field. A map may show the term only when its classification names that field as the primary or a secondary field. The node's `nodeRole` describes the local context; it does not rewrite the canonical definition.

Examples: HTTP is core in Network / Web Protocol and a boundary in Backend; environment variable is home-field Linux / OS / Runtime and shared in DevOps, Security, and Backend; API key is home-field Security and shared where it is consumed by deployment or application configuration.

Mission overlays remain data on top of maps. Their current primary CTA is one map, while the registry and generated metadata retain an array of mission contexts so a future UI can show multiple maps for a mission.

## Wave 3 boundary

The next standalone candidates are Algorithms / Data Structures and AI / ML / Computing. Add their maps together with mission overlays that have no current primary map; do not turn either cross-field layer into a generic prerequisite canvas first.
