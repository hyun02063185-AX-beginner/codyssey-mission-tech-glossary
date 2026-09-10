#!/usr/bin/env python3
"""Derive the Technology Field Atlas classifications from canonical glossary evidence."""
import json
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GLOSSARY = ROOT / "data/curated/glossary-master-v0.1.yaml"
TAXONOMY = ROOT / "data/knowledge-maps/atlas/field-taxonomy.json"
OUT_CLASSIFICATIONS = ROOT / "data/knowledge-maps/atlas/term-field-classification.json"
OUT_MATRIX = ROOT / "data/knowledge-maps/atlas/mission-field-matrix.json"

CATEGORY_FIELDS = {
    "Web": "frontend-web-ui", "Backend": "backend-server-api", "Data": "data-database",
    "Database": "data-database", "Linux / OS": "systems-runtime", "Container": "devops-infrastructure",
    "Server / Infrastructure": "devops-infrastructure", "Git / Collaboration": "git-collaboration",
    "Security": "security-identity", "Programming": "programming-foundations",
    "Algorithms / Data Structures": "algorithms-data-structures", "Network": "network-web-protocol",
    "AI / Hardware": "ai-ml-computing", "Tools": "developer-workflow-tools",
}

# These are field judgments where a glossary category is too broad, operational, or audit-flagged.
OVERRIDES = {
    "filter": ("data-database", [], "core", "HIGH", "M03 evidence identifies a data.json filtering field; the legacy AI/Hardware category is not used as ownership."),
    "transaction-data": ("data-database", [], "boundary", "LOW", "Mission evidence means transaction data rather than a database transaction; the similar canonical name remains a manual review item."),
    "o": ("algorithms-data-structures", ["programming-foundations"], "foundation", "LOW", "The short canonical name is an audit-flagged duplicate candidate for time complexity; classify conservatively until canonical cleanup."),
    "javascript": ("frontend-web-ui", ["programming-foundations"], "core", "HIGH", "The existing Frontend field graph establishes JavaScript as a core browser/UI map node; language foundations remain a secondary context."),
    "async-await": ("programming-foundations", ["frontend-web-ui"], "boundary", "HIGH", "Async/await is a language feature reused by the existing Frontend map for browser Fetch flows."),
    "http-status-code-403": ("network-web-protocol", ["frontend-web-ui", "backend-server-api"], "boundary", "HIGH", "HTTP 403 has protocol ownership and is surfaced by browser and server API error handling."),
    "typescript": ("programming-foundations", ["frontend-web-ui"], "boundary", "MEDIUM", "A programming language layer commonly consumed by frontend work, without making framework usage its home field."),
    "python": ("programming-foundations", ["backend-server-api", "data-database", "ai-ml-computing"], "shared", "HIGH", "Canonical mission evidence uses Python across program, API, data, and AI workflows."),
    "cli": ("developer-workflow-tools", ["systems-runtime", "programming-foundations", "devops-infrastructure"], "shared", "HIGH", "A command-line interface is a shared developer interaction surface rather than a language-owned concept."),
    "curl": ("network-web-protocol", ["devops-infrastructure", "backend-server-api", "security-identity"], "shared", "HIGH", "HTTP client usage crosses API inspection, infrastructure operations, and authenticated requests."),
    "json": ("data-database", ["frontend-web-ui", "backend-server-api", "ai-ml-computing"], "shared", "HIGH", "JSON is data representation reused across browser, API, and AI structured-output contexts."),
    "data-json": ("data-database", ["ai-ml-computing"], "boundary", "HIGH", "M03 uses a data.json artifact; it is data ownership with an AI exercise context."),
    "json-request-response": ("network-web-protocol", ["backend-server-api", "ai-ml-computing", "frontend-web-ui"], "shared", "HIGH", "The term describes a protocol payload boundary shared by clients, servers, and AI APIs."),
    "http": ("network-web-protocol", ["frontend-web-ui", "backend-server-api", "security-identity", "devops-infrastructure"], "shared", "HIGH", "HTTP is the network home and an explicit boundary for browser, server, security, and deployment work."),
    "https": ("network-web-protocol", ["security-identity", "frontend-web-ui", "backend-server-api", "devops-infrastructure"], "shared", "HIGH", "HTTPS joins web protocol ownership with transport-security and service delivery contexts."),
    "http-request-response": ("network-web-protocol", ["frontend-web-ui", "backend-server-api"], "boundary", "HIGH", "Request/response is the interface between browser clients and server APIs."),
    "http-request": ("network-web-protocol", ["backend-server-api", "ai-ml-computing"], "boundary", "HIGH", "A request is network-owned while directly consumed by API and AI-client workflows."),
    "rest-api": ("backend-server-api", ["frontend-web-ui", "network-web-protocol", "ai-ml-computing"], "shared", "HIGH", "REST API design lives at the server/API home and is consumed by clients over HTTP."),
    "http-get": ("network-web-protocol", ["backend-server-api"], "boundary", "HIGH", "HTTP method semantics are protocol-owned and are consumed by backend route handlers."),
    "http-post": ("network-web-protocol", ["backend-server-api"], "boundary", "HIGH", "HTTP method semantics are protocol-owned and are consumed by backend route handlers."),
    "http-303-see-other": ("network-web-protocol", ["backend-server-api"], "boundary", "HIGH", "HTTP redirect status semantics are protocol-owned and used by backend response flows."),
    "port-mapping": ("network-web-protocol", ["devops-infrastructure"], "boundary", "HIGH", "Port mapping joins a network endpoint to a container deployment boundary; it is not a firewall rule."),
    "crud": ("backend-server-api", ["data-database"], "core", "HIGH", "CRUD names application data operations and is central to backend API handling, while not being synonymous with REST."),
    "sqlalchemy": ("data-database", ["backend-server-api"], "boundary", "HIGH", "SQLAlchemy is a data-access library consumed by backend applications at the persistence boundary."),
    "database-session": ("data-database", ["backend-server-api"], "boundary", "HIGH", "A database session belongs to persistence while backend request handlers use it as a unit-of-work boundary."),
    "html-form": ("frontend-web-ui", ["backend-server-api"], "boundary", "HIGH", "HTML forms are browser-owned controls that create requests consumed by backend handlers."),
    "redis": ("data-database", ["algorithms-data-structures"], "boundary", "HIGH", "Redis is a data store that offers data structures; it is an applied Algorithms context rather than an abstract data structure itself."),
    "commit-node": ("git-collaboration", ["algorithms-data-structures"], "boundary", "HIGH", "A commit node is Git-owned application evidence for a directed acyclic graph, not an Algorithms field core."),
    "parent-commit": ("git-collaboration", ["algorithms-data-structures"], "boundary", "HIGH", "A parent commit is Git history metadata that illustrates a directed graph relation in the Algorithms context."),
    "commit-history": ("git-collaboration", ["algorithms-data-structures"], "boundary", "HIGH", "Commit history is Git-owned and may be traversed using graph concepts without changing Git's home field."),
    "github-api": ("backend-server-api", ["frontend-web-ui", "network-web-protocol", "git-collaboration"], "shared", "HIGH", "GitHub API is an external server API used by browser clients and repository workflows."),
    "fetch-api": ("frontend-web-ui", ["network-web-protocol", "backend-server-api"], "boundary", "HIGH", "The existing Frontend graph treats Fetch as core while its request boundary reaches protocol and server maps."),
    "github-pages": ("devops-infrastructure", ["frontend-web-ui", "git-collaboration"], "boundary", "HIGH", "Static-site delivery is infrastructure-owned and delivers frontend artifacts from repository workflow."),
    "deployment": ("devops-infrastructure", ["frontend-web-ui", "backend-server-api"], "boundary", "HIGH", "Deployment hands frontend or server artifacts to an operating platform."),
    "deployment-url": ("devops-infrastructure", ["frontend-web-ui"], "boundary", "MEDIUM", "A delivery endpoint is an infrastructure result referenced by frontend mission submission."),
    "firebase": ("backend-server-api", ["frontend-web-ui", "data-database", "devops-infrastructure"], "shared", "MEDIUM", "Backend-as-a-service bridges client application, data, and hosted infrastructure."),
    "supabase": ("backend-server-api", ["frontend-web-ui", "data-database", "devops-infrastructure"], "shared", "MEDIUM", "Backend-as-a-service bridges client application, data, and hosted infrastructure."),
    "backend-as-a-service": ("backend-server-api", ["frontend-web-ui", "data-database", "devops-infrastructure"], "shared", "HIGH", "The term names the service boundary spanning client, data, and hosted delivery."),
    "netlify": ("devops-infrastructure", ["frontend-web-ui"], "boundary", "HIGH", "A frontend hosting platform belongs to delivery infrastructure."),
    "vercel": ("devops-infrastructure", ["frontend-web-ui"], "boundary", "HIGH", "A frontend hosting platform belongs to delivery infrastructure."),
    "railway": ("devops-infrastructure", ["backend-server-api", "data-database"], "boundary", "HIGH", "A managed application platform connects server and database delivery."),
    "render": ("devops-infrastructure", ["backend-server-api", "data-database"], "boundary", "HIGH", "A managed application platform connects server and database delivery."),
    "nginx": ("backend-server-api", ["devops-infrastructure", "network-web-protocol"], "boundary", "HIGH", "Nginx is a server gateway configured and operated as infrastructure."),
    "server-side-rendering": ("backend-server-api", ["frontend-web-ui"], "boundary", "HIGH", "Server rendering produces frontend HTML at the server/application boundary."),
    "template-engine": ("backend-server-api", ["frontend-web-ui"], "boundary", "MEDIUM", "Template generation is server-owned while producing browser-facing documents."),
    "templateresponse": ("backend-server-api", ["frontend-web-ui"], "boundary", "HIGH", "A server response renders a browser-facing template."),
    "post-redirect-get": ("backend-server-api", ["network-web-protocol", "frontend-web-ui"], "boundary", "HIGH", "PRG is a server response flow communicated through HTTP to a browser client."),
    "health-check-endpoint": ("backend-server-api", ["devops-infrastructure", "network-web-protocol"], "boundary", "HIGH", "An application endpoint is operated by infrastructure monitoring through a network interface."),
    "docker": ("devops-infrastructure", ["systems-runtime", "backend-server-api"], "boundary", "HIGH", "Container delivery is infrastructure-owned while depending on host runtime and application artifacts."),
    "docker-container": ("devops-infrastructure", ["systems-runtime", "backend-server-api"], "boundary", "HIGH", "A container is an infrastructure unit grounded in host runtime and used for application delivery."),
    "environment-variable": ("systems-runtime", ["devops-infrastructure", "security-identity", "backend-server-api"], "shared", "HIGH", "Environment variables bridge host processes, deployment configuration, secrets, and application runtime."),
    "persistence": ("data-database", ["frontend-web-ui", "backend-server-api"], "boundary", "MEDIUM", "Persistence is data-owned but appears in client storage and server application contexts."),
    "cookie": ("security-identity", ["frontend-web-ui", "network-web-protocol", "backend-server-api"], "shared", "HIGH", "Cookies are identity/session-sensitive network data consumed by browser and server contexts."),
    "authentication-token": ("security-identity", ["backend-server-api", "frontend-web-ui"], "boundary", "HIGH", "Authentication tokens are security-owned credentials passed across application boundaries."),
    "api-key": ("security-identity", ["backend-server-api", "ai-ml-computing", "devops-infrastructure"], "shared", "HIGH", "API keys are secret credentials reused by server, AI API, and deployment configuration contexts."),
    "repository": ("git-collaboration", ["developer-workflow-tools"], "boundary", "HIGH", "A repository is the collaboration home and a project-level developer workflow container."),
    "readme": ("developer-workflow-tools", ["git-collaboration"], "boundary", "HIGH", "README is project documentation surfaced through repository collaboration."),
    "visual-studio-code": ("developer-workflow-tools", ["programming-foundations"], "boundary", "HIGH", "An editor is a workflow tool used to author code, not a programming language concept."),
    "troubleshooting": ("developer-workflow-tools", ["systems-runtime", "devops-infrastructure"], "boundary", "HIGH", "Troubleshooting is a shared diagnostic workflow across host and infrastructure operations."),
    "benchmark": ("developer-workflow-tools", ["algorithms-data-structures", "systems-runtime"], "boundary", "MEDIUM", "Benchmarking is a tooling practice used to assess algorithms and system behavior."),
    "screenshot": ("developer-workflow-tools", ["frontend-web-ui"], "boundary", "HIGH", "A screenshot is a verification artifact for UI work rather than a UI technology itself."),
    "result-report": ("developer-workflow-tools", ["ai-ml-computing", "data-database"], "boundary", "MEDIUM", "A result report is a workflow artifact in data/AI exercises."),
    "code-block": ("developer-workflow-tools", ["programming-foundations"], "foundation", "HIGH", "Code blocks are documentation and instructional tooling around source code."),
    "css-directory": ("frontend-web-ui", ["developer-workflow-tools"], "boundary", "HIGH", "A CSS directory organizes frontend presentation source while remaining a project-structure convention."),
    "javascript-directory": ("frontend-web-ui", ["developer-workflow-tools"], "boundary", "HIGH", "A JavaScript directory organizes frontend behavior source while remaining a project-structure convention."),
    "images-directory": ("frontend-web-ui", ["developer-workflow-tools"], "boundary", "HIGH", "An image directory is a frontend asset convention rather than a standalone tooling map core."),
    "homebrew-apt": ("developer-workflow-tools", ["systems-runtime"], "boundary", "HIGH", "Package-manager use is developer setup tooling on a host operating system."),
}

FOUNDATION_IDS = {
    "asynchronous-programming", "event-loop", "promise", "floating-point", "ieee-754", "epsilon", "cache", "concurrency", "deadlock", "lock", "mutex", "race-condition", "thread", "process", "filesystem", "kernel", "tcp", "serialization", "schema", "encoding", "utf-8", "layer", "vm-vs-container", "shared-responsibility-model", "identity-and-access-management", "access-control", "data-integrity", "normalization", "cardinality", "time-complexity", "big-o-notation", "hash-function", "heap-property", "graph-traversal", "directed-graph", "component-tree", "virtual-dom-rendering", "browser-rendering", "client-side-storage", "request-response-cycle"
}
BOUNDARY_IDS = {"http-get", "http-post", "http-status-code", "http-status-code-403", "http-200-ok", "http-303-see-other", "port-mapping", "ssh", "tls-certificate", "oauth-2-0", "oauth2-authorization-code", "authentication", "authorization", "protected-route", "public-route", "sqlalchemy", "sqlalchemy-orm", "sqlite", "postgresql", "redis", "database-session", "sqlalchemy-session", "fastapi", "uvicorn", "asgi", "jinja2", "jinja2-ssr", "html-form", "template-directory", "router-layer", "repository-layer", "service-layer", "model-layer", "bind-mount", "volume", "base-image"}

ROUTES = {
    "frontend-web-ui": "문서와 스타일 → 상호작용과 상태 → 브라우저 화면",
    "backend-server-api": "요청 → 라우팅과 서비스 → 응답",
    "data-database": "데이터 모델 → 저장과 변환 → 조회",
    "systems-runtime": "명령과 파일 → 프로세스 → 자원 관찰",
    "devops-infrastructure": "애플리케이션 → 컨테이너/클라우드 → 배포와 운영",
    "git-collaboration": "변경 → 브랜치와 검토 → 병합",
    "security-identity": "신원 → 인증 → 권한과 보호",
    "programming-foundations": "입력 → 제어 흐름과 구조 → 결과",
    "algorithms-data-structures": "자료 구조 → 알고리즘 → 복잡도와 선택",
    "network-web-protocol": "주소와 연결 → 요청 → 응답",
    "ai-ml-computing": "입력/프롬프트 → 추론 → 결과 검증",
    "developer-workflow-tools": "작성 → 점검 → 문서화와 보고",
}
STATUS_WEIGHT = {"direct": 3, "required": 2, "related": 1}


def classify(term):
    term_id = term["id"]
    if term_id in OVERRIDES:
        primary, secondary, role, confidence, reason = OVERRIDES[term_id]
    else:
        primary = CATEGORY_FIELDS[term["category"]]
        secondary = []
        role = "foundation" if term_id in FOUNDATION_IDS else "boundary" if term_id in BOUNDARY_IDS else "core"
        confidence = "HIGH"
        reason = f"{term['category']} category, term type '{term['type']}', and mission usage place it in the {primary} home field."
    return {
        "termId": term_id,
        "termKo": term["term_ko"],
        "termEn": term["term_en"],
        "primaryField": primary,
        "secondaryFields": secondary,
        "mapRole": role,
        "missions": sorted({f"{ref['course']}/{ref['mission']}" for ref in term["mission_refs"]}),
        "importance": term["importance"],
        "confidence": confidence,
        "reason": reason,
    }


def build_matrix(terms, classifications, field_labels):
    by_term = {item["termId"]: item for item in classifications}
    refs = defaultdict(list)
    for term in terms:
        for ref in term["mission_refs"]:
            refs[f"{ref['course']}/{ref['mission']}"].append((term["id"], ref["source_status"]))
    matrix = []
    for mission_id in sorted(refs):
        statuses_by_field = defaultdict(dict)
        weights = Counter()
        for term_id, status in refs[mission_id]:
            item = by_term[term_id]
            for field in [item["primaryField"], *item["secondaryFields"]]:
                previous = statuses_by_field[field].get(term_id)
                if previous is None or STATUS_WEIGHT[status] > STATUS_WEIGHT[previous]:
                    statuses_by_field[field][term_id] = status
                weights[field] += STATUS_WEIGHT[status] if field == item["primaryField"] else 1
        ordered = sorted(statuses_by_field, key=lambda field: (-weights[field], field))
        fields = []
        for field in ordered:
            entries = statuses_by_field[field]
            status_counts = Counter(entries.values())
            key_terms = sorted(entries, key=lambda term_id: (-STATUS_WEIGHT[entries[term_id]], term_id))[:6]
            fields.append({
                "fieldId": field,
                "fieldLabel": field_labels[field],
                "role": "primary" if field == ordered[0] else "secondary",
                "termCount": len(entries),
                "sourceStatusCounts": {status: status_counts.get(status, 0) for status in ("direct", "required", "related")},
                "keyTerms": key_terms,
                "expectedLearningRoute": ROUTES[field],
            })
        matrix.append({
            "missionId": mission_id,
            "sourceTermCount": len({term_id for term_id, _ in refs[mission_id]}),
            "primaryField": ordered[0],
            "secondaryFields": ordered[1:],
            "fields": fields,
        })
    return matrix


def main():
    glossary = json.loads(GLOSSARY.read_text(encoding="utf-8"))["terms"]
    taxonomy = json.loads(TAXONOMY.read_text(encoding="utf-8"))
    fields = taxonomy["fields"]
    field_labels = {field["id"]: field["label"] for field in fields}
    classifications = [classify(term) for term in sorted(glossary, key=lambda item: item["id"])]
    payload = {
        "schemaVersion": "1.0", "artifactType": "derived-term-field-classification", "taxonomyId": "technology-field-atlas-v1",
        "generatedFrom": ["data/curated/glossary-master-v0.1.yaml", "data/knowledge-maps/atlas/field-taxonomy.json", "scripts/build_technology_field_atlas.py"],
        "termCount": len(classifications), "classifications": classifications,
    }
    matrix = build_matrix(glossary, classifications, field_labels)
    matrix_payload = {
        "schemaVersion": "1.0", "artifactType": "derived-mission-field-matrix", "taxonomyId": "technology-field-atlas-v1",
        "generatedFrom": ["data/curated/glossary-master-v0.1.yaml", "data/knowledge-maps/atlas/term-field-classification.json"],
        "missionCount": len(matrix), "missions": matrix,
    }
    OUT_CLASSIFICATIONS.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    OUT_MATRIX.write_text(json.dumps(matrix_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
