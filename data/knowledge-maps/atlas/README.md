# Technology Field Atlas data

This directory defines the technology-field map system; it does not create a new Web or Chrome UI.

- `field-taxonomy.json` is the authored source of truth for field IDs, purpose, order, and classification policy.
- `term-field-classification.json` is a derived, complete classification of every canonical glossary term.
- `mission-field-matrix.json` is a derived overlay analysis of each mission over the classified fields.

Regenerate and validate:

```bash
python3 scripts/build_technology_field_atlas.py
python3 scripts/validate_technology_field_atlas.py
```

The generator uses canonical glossary category/type/mission evidence plus explicit, documented overrides for cross-field, operational, and glossary-audit collision cases. A glossary category is therefore an input signal, not the Atlas taxonomy itself.
