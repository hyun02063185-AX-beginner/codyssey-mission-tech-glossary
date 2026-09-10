# Technology Atlas Expansion Wave 2 Review

## Result

Start commit: `04b9f7c`. Wave 2 implements Linux / OS / Runtime (20 nodes, 16 edges, M07 and M08), DevOps / Infrastructure (19, 18, preliminary M01), Network / Web Protocol (18, 16, M05), Backend / Server / API (20, 16, M12), and Security / Identity (20, 19, M13). The Atlas now exposes 8 implemented maps.

## Boundary and accuracy review

The canonical classification is the machine-readable boundary matrix: every map node is validated against its home or secondary field. New explicit secondary contexts cover HTTP methods for backend handling, port mapping for DevOps, CRUD for backend/data, SQLAlchemy/database session for backend/data, and HTML forms for frontend/backend.

- Linux distinguishes program/process, process/thread, PID/process, CPU usage/load-style observations, shell/terminal, and service/daemon context. `ps` and `top` are observation tools, not runtime entities.
- DevOps distinguishes Docker/image/container, container/VM, port mapping/firewall, volume/bind mount, and build/deployment. Nginx is presented as a web server/proxy boundary rather than an application-server replacement.
- Network distinguishes HTTP/TCP, HTTPS/HTTP semantics, CIDR/subnet, route table/router, VPC/network, and NAT/firewall. Vendor products are not the map's organizing structure.
- Backend distinguishes backend/server, API/REST, CRUD/REST, route/network route, FastAPI/server, and ORM/database. Architecture edges marked `MEDIUM` identify optional layering rather than framework mandates.
- Security distinguishes authentication/authorization, JWT/authentication/encryption, OAuth delegated authorization/login, access/refresh token, cookie/session, hashing/encryption, and HTTPS/application authorization. Protected routes require server authorization.

## Cross-field decision

Programming Foundations and Developer Workflow / Tools are confirmed `CROSS_FIELD_LAYER`: they recur across maps but do not currently have an independent field structure more useful than contextual nodes. See `docs/12_cross_field_layer_architecture.md`.

## Current limitations and Wave 3

The v1 graphs are curated learning views rather than all 549 terms. Full multi-map CTA selection, deep content expansion, public deployment, and browser-extension changes remain out of scope. Wave 3 should batch Algorithms / Data Structures and AI / ML / Computing with overlays for currently uncovered missions, sharing the same boundary review first.

## Notion Update Payload

Latest Git: pending commit
Milestone: Technology Atlas Expansion Wave 2
Implemented Maps: Linux / OS / Runtime; DevOps / Infrastructure; Network / Web Protocol; Backend / Server / API; Security / Identity
Mission Overlays: main M05, M07, M08, M12, M13; preliminary M01
Cross-field Decisions: Programming Foundations and Developer Workflow / Tools = CROSS_FIELD_LAYER
Architecture Changes: eight lazy-loaded generic field maps; canonical home/secondary-field validation; `cross-field-layer` registry status
Current Atlas State: 8 implemented, 2 planned standalone, 2 cross-field layers
Accuracy Notes: explicit boundary distinctions recorded in each graph and this report
Known Limitations: curated v1 graphs; no multi-map selector UI yet
Next Integrated Wave: Algorithms / Data Structures + AI / ML / Computing and uncovered overlays
Status: PENDING SOL SYNC
