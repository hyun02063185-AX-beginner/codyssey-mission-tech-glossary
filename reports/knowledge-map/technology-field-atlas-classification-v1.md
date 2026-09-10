# Technology Field Atlas Classification v1

## Basis

- Canonical glossary analyzed: 549 terms
- Mission overlays analyzed: preliminary M01–M03 and main M01–M13 (16 total)
- Classification source: canonical category, type, mission references, existing Frontend field-map ownership, and explicit cross-field/audit overrides
- Categories were evidence only. For example, Web delivery platforms move to Infrastructure, server rendering moves to Backend, and the M03 `filter` term moves to Data based on its mission evidence.

## Recommended Field Maps

| Field map | Purpose | Terms | Core | Foundation | Boundary / Shared |
| --- | --- | ---: | ---: | ---: | ---: |
| Frontend / Web UI | Browser documents, styling, interaction, client rendering | 69 | 60 | 4 | 5 / 0 |
| Backend / Server / API | Servers, API boundaries, service architecture | 26 | 5 | 1 | 15 / 5 |
| Data / Database | Data modeling, persistence, querying, transformation | 77 | 58 | 7 | 11 / 1 |
| Linux / Operating System / Runtime | Host OS, files, shells, processes, resources | 53 | 47 | 5 | 0 / 1 |
| DevOps / Infrastructure / Cloud | Containers, cloud, deployment, operations | 34 | 20 | 2 | 12 / 0 |
| Git / Collaboration / Software Engineering | Version control, review, repository workflow | 57 | 56 | 0 | 1 / 0 |
| Security / Authentication / Authorization | Credentials, permissions, secrets, access policy | 47 | 33 | 3 | 9 / 2 |
| Programming Foundations | Language constructs, execution, implementation concepts | 86 | 72 | 12 | 1 / 1 |
| Algorithms / Data Structures | Structures, traversal, ordering, complexity | 36 | 30 | 6 | 0 / 0 |
| Network / Web Protocol | HTTP, TCP, ports, routes, request boundaries | 33 | 19 | 1 | 9 / 4 |
| AI / ML / Computing Hardware | Models, prompting, inference, accelerators | 22 | 22 | 0 | 0 / 0 |
| Developer Workflow / Tools | Editor, diagnostics, documentation, reporting | 9 | 0 | 1 | 7 / 1 |

Twelve maps are recommended. Network / Web Protocol remains independent because it has 33 home terms and is the strongest evidence-weighted field in main M05; it is still deliberately a shared boundary for application maps. Developer Workflow / Tools is a low-priority supporting map, not a UI implementation commitment.

## Mission × Field

The primary field is selected from source-status-weighted term evidence (`direct` > `required` > `related`). Secondary fields are ordered by the same evidence and include reused boundary terms, so their counts intentionally overlap.

| Mission | Primary field | Secondary fields | Key terms |
| --- | --- | --- | --- |
| 예비 M01 | DevOps / Infrastructure / Cloud | System, Security, Developer Tools, Backend, Git, Network | Docker, Compose, Nginx, SSH, volume |
| 예비 M02 | Programming Foundations | Git, Data, Backend, Developer Tools, System, AI, Frontend | Python, function, class, branch, JSON |
| 예비 M03 | Programming Foundations | AI/ML, Data, Developer Tools, Algorithms, System | data.json, NumPy/pandas, NPU, floating point, loop |
| 본 M01 | Frontend / Web UI | Programming, Developer Tools, Network, Backend, DevOps, Git, Security, AI, Data | HTML, CSS, JavaScript, Fetch API, React |
| 본 M02 | Frontend / Web UI | Security, DevOps, Backend, Data, Programming, Git, System, AI | React, state, hooks, routing, protected route |
| 본 M03 | Programming Foundations | Data, System, Algorithms, Developer Tools, Backend, AI, DevOps, Frontend | Python, CSV, streaming, generator, schema |
| 본 M04 | Git / Collaboration | — | branch protection, code review, pull request, rebase |
| 본 M05 | Network / Web Protocol | Security, DevOps, Backend, System, Frontend | VPC, route table, subnet, HTTPS, security group |
| 본 M06 | AI / ML / Computing Hardware | Security, Git, Network, Backend, Programming, System, DevOps, Frontend | AI API, prompt design, temperature, output validation, API key |
| 본 M07 | Linux / Operating System / Runtime | Security, Programming, Network, Backend, DevOps | Linux, cron, process monitoring, SSH, UFW |
| 본 M08 | Linux / Operating System / Runtime | Programming, DevOps, Backend | process, thread, deadlock, memory leak, watchdog |
| 본 M09 | Algorithms / Data Structures | Data, Programming, System, Developer Tools, DevOps | Redis, hash map, LRU, queue, time complexity |
| 본 M10 | Algorithms / Data Structures | Git, Programming, Developer Tools, DevOps, Security, System | DAG, commit graph, BFS/DFS, topological order, Git |
| 본 M11 | Data / Database | — | SQL, table, join, primary key, normalization |
| 본 M12 | Backend / Server / API | Programming, Data, Network, Frontend | FastAPI, router, service, SQLAlchemy, template response |
| 본 M13 | Security / Authentication / Authorization | Data, Backend, DevOps, Programming, Frontend, Network | authentication, authorization, JWT, OAuth, session |

## Cross-field Terms — Top 20

| Term | Home field | Reused field contexts | Role |
| --- | --- | --- | --- |
| HTTP | Network / Web Protocol | Frontend, Backend, Security, DevOps | shared |
| HTTPS | Network / Web Protocol | Security, Frontend, Backend, DevOps | shared |
| JSON | Data / Database | Frontend, Backend, AI/ML | shared |
| REST API | Backend / Server / API | Frontend, Network, AI/ML | shared |
| API key | Security | Backend, AI/ML, DevOps | shared |
| Cookie | Security | Frontend, Network, Backend | shared |
| CLI | Developer Tools | System, Programming, DevOps | shared |
| curl | Network / Web Protocol | DevOps, Backend, Security | shared |
| environment variable | System | DevOps, Security, Backend | shared |
| Python | Programming Foundations | Backend, Data, AI/ML | shared |
| GitHub API | Backend / Server / API | Frontend, Network, Git | shared |
| Backend as a Service | Backend / Server / API | Frontend, Data, DevOps | shared |
| Firebase | Backend / Server / API | Frontend, Data, DevOps | shared |
| Supabase | Backend / Server / API | Frontend, Data, DevOps | shared |
| Fetch API | Frontend / Web UI | Network, Backend | boundary |
| Docker | DevOps / Infrastructure | System, Backend | boundary |
| deployment | DevOps / Infrastructure | Frontend, Backend | boundary |
| GitHub Pages | DevOps / Infrastructure | Frontend, Git | boundary |
| authentication token | Security | Backend, Frontend | boundary |
| Nginx | Backend / Server / API | DevOps, Network | boundary |

## Frontend Expansion

- Current graph: 37 nodes / 50 edges; current M01 overlay: 23 Quick Terms.
- Related mission evidence: main M01 has 55 Frontend-home terms; main M02 has 28 Frontend-relevant terms and is the next clear overlay; main M12 adds 5 browser/server-boundary terms; main M13 adds authentication-token and cookie boundary contexts.
- Next overlay recommendation: **main M02**. It is Frontend-primary and contributes a coherent React/client application unit rather than isolated terms.
- Additional core candidates (do not add in this sprint): React, React state, props, hooks, custom hook, useEffect, useMemo, useCallback, React Context, React Router, client-side routing, controlled input, reusable component, component tree, virtual DOM rendering, SPA, not-found page.
- Boundary candidates (do not add in this sprint): TypeScript, Firebase, Supabase, Backend as a Service, Netlify, Vercel, protected route; later M12 adds server-side rendering and template response.

## Atlas Architecture

- Field maps: the 12 taxonomy fields above, each with one term home and reusable cross-map contexts.
- Map-to-map relation: Frontend → HTTP/Fetch → Backend; Backend → SQL/ORM → Data; Application → Docker/Cloud → DevOps; Security supplies credentials and policy at the client/server/infrastructure boundaries.
- Mission overlay model: each mission selects terms from existing field maps, preserves direct/required/related source status, and adds mission-specific explanation without copying nodes.
- Canonical term reuse: a term has one canonical glossary record and one primary field. Secondary contexts reference that record rather than make alias graphs.
- Relation layer: existing `uses`, `provided_by`, `interacts_with`, `prerequisite`, `cs_foundation`, `defined_by`, `compare_with`, and `evolved_from` relations are sufficient for the next field maps. No schema expansion is recommended.

## Confidence

- HIGH: 539 classifications.
- MEDIUM: 8 classifications — `benchmark`, `deployment-url`, `firebase`, `persistence`, `result-report`, `supabase`, `template-engine`, `typescript`.
- LOW: 2 classifications — `o` and `transaction-data`; both are already glossary-audit canonical/meaning review candidates.
- Manual review: preserve the existing glossary-audit decisions for the two LOW entries before treating them as durable graph nodes. `filter` is classified as Data with HIGH confidence because the M03 source specifically identifies a data filtering field despite the legacy category mismatch.

## Validation

- total classified: 549 / 549
- taxonomy: 12 known fields
- mission matrix: 16 / 16 with source term counts and direct/required/related consistency checked per field
- regression policy: no canonical term, frontend graph, Web UI, Chrome UI/version, or extension package change in this sprint

## Next Recommended Step

Do not execute as part of this sprint:

1. **Frontend Map Expansion Sprint** — generate a main M02 overlay first, then review the listed React/client-routing core and BaaS/platform boundary candidates before adding graph nodes.
2. **Next Field Map candidate** — Git / Collaboration is the best independent first implementation because main M04 has complete single-field coverage; Data / Database (main M11) is the next strongest domain map.
