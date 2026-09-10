# Wave 2+3 Desktop Full Runtime Regression 결과

Technology Atlas Wave 2 + Wave 3 통합 검증 — Windows Desktop에서 수행된 전체 런타임 회귀 검증 결과.

## Git

- start: `e167750` (pull 후 예상 커밋과 일치, fast-forward)
- end: `7bb1d96` fix(knowledge-map): resolve desktop runtime regression issues
- push: yes (main, force push 없음)
- status: clean

## Environment

- OS: Windows 11 Pro 10.0.26200
- Node: v24.16.0
- npm: 11.13.0
- Python: 3.14.6 (data build 스크립트 실행)
- 의존성: `npm ci` (package-lock 기준, 110 packages)

## Automated Validation

- atlas: PASS — 12 fields · 549 terms · 16 missions (HIGH 539 / MEDIUM 8 / LOW 2)
- knowledge-map: PASS — 10 implemented / 12 registry maps · 2 cross-field layers
- tests: PASS — 15 passed (2 files: data.test 11, extension-handoff 4)
- Vite build: PASS — 79 modules, tsc -b clean
- extension build: PASS
- diff: `git diff --check` PASS

## Atlas State

- taxonomy: 12 fields
- standalone: 10 implemented maps
- cross-field: 2 (Programming Foundations, Developer Workflow / Tools)
- planned: 0
- mission coverage: FULL_PRIMARY 13 / PARTIAL_CROSS_FIELD 3 / NO_MAP 0 (총 16)

## Browser Smoke

Playwright + Chromium(1243) 실브라우저 검증, `npm run dev` 기준 **80/80 체크 통과**, console error 0.

- Atlas landing: 카드 12 (구현 10 클릭 가능 + 공통 계층 2 비클릭), 준비 중 그룹 없음
- Frontend: M01(23 overlay nodes) / M02(12) — title, 49 nodes, 9 regions, 63 edges, 7 route chips
- Git: M04(11) / preliminary M02(12) / main M10(4) — 27 nodes, 6 regions
- Data: M11(21) / preliminary M03(2) / main M03(5) — 27 nodes, 7 regions
- Linux: M07(7) / M08(11) — 20 nodes, 5 regions
- DevOps: preliminary M01(12) — 19 nodes
- Network: M05(14) — 18 nodes
- Backend: M12(17) — 20 nodes
- Security: M13(16) — 20 nodes
- Algorithms: M09(12) / M10(10) — 28 nodes
- AI: M06(14) / preliminary M03(6) — 22 nodes
- legacy M01: `#/maps/main-m01?term=fetch-api` → `/maps/frontend?mission=main-m01&term=fetch-api` redirect + Fetch API 노드 선택 확인
- 인터랙션: 노드 선택/상세, 직접 edge 강조(7 nodes · 6 edges), 무관 노드 dim(42), 사전 deep link, 경로 칩, 검색(6 결과→선택), 확대/축소/맞춤, pan, 키보드 Enter, reset, deep-linked term(React), 잘못된 mission/term 안내, browser back/forward — 전부 PASS
- Webtoons: 5 published pilot 카드

## Mission Multi-map

- preliminary M02: 1 CTA (Git 협업 지도) — Programming Foundations 공통 계층 중심 문구 표시
- preliminary M03: 2 CTA (Data, AI) — 깨짐 없음
- main M03: 1 CTA (Data)
- (추가) main M10: 2 CTA (Algorithms primary + Git 보조 맥락 태그)
- 어떤 미션도 단일 map으로 회귀되지 않음

## Mobile (390×844)

- 390px: horizontal overflow 없음 (Atlas / map / mission detail / terms 전부 scrollWidth=390)
- overflow: 없음
- detail: 노드 탭 → sticky detail sheet 정상 표시
- CTA: multi-map CTA 2개가 viewport 안에 배치 (left 35 / right 355)
- 추가: canvas shell 내부 스크롤 pan(960>334), route chips 가로 스크롤(1371>922), 지역 이동 버튼 9개, console error 0

## Console

- errors: 0 (React error, route error, dynamic import 실패, 404, duplicate key, unhandled rejection 전부 없음)
- warnings: 0 (console.error 계열 없음)

## Performance

- main chunk: 754.65 kB (gzip 142.51 kB)
- largest lazy chunk: frontend-knowledge-map 42.33 kB (gzip 10.09 kB)
- existing warning: 있음 (기존 main chunk >500 kB 경고. Wave 1 기록: baseline 736.18 kB → 742.73 kB. 이번 754.65 kB, +11.92 kB — mission routing/registry 메타데이터 정적 import가 원인)
- regression: 없음 — 10개 map graph와 19개 overlay 전부 별도 lazy chunk로 분리 유지, lazy loading 정상

## Extension Regression

- version: 0.4.1
- build: PASS
- permissions: `sidePanel, storage, contextMenus, search` (불변)
- host permissions: `https://usr.codyssey.kr/*` (불변)
- M01 Open-book: quick terms 23 · requirements 11 · context 23 — intact
- packaged files: manifest.json, background.js, content.js, sidepanel.html/js, glossary.json(549), openbook-main-m01.json

## Fixes Applied

1. **Windows 인코딩 호환성** — `scripts/build_wave2_knowledge_maps.py`, `build_wave3_knowledge_maps.py`, `validate_knowledge_map.py`의 `read_text()`에 `encoding="utf-8"` 명시. 한국어 Windows 기본 로케일(cp949)에서 UTF-8 데이터 파일 읽기 시 `UnicodeDecodeError`가 발생해 data:build가 실패하던 문제 수정. 데이터·로직 변경 없음.
2. **TypeScript 빌드 오류** — `src/App.tsx` MissionMapEntry에서 `Boolean(context.overlayMissionId)` 가드를 `context.overlayMissionId!=null`로 교체. `Boolean()` 호출은 tsc narrowing을 제공하지 않아 `availableMissions.includes()`에 `string | undefined` 전달로 `tsc -b`가 실패하던 문제 수정. 런타임 동작 동일.

## Remaining Warnings

- Vite main chunk 754.65 kB > 500 kB — 기존 경고. 정책(section 14)에 따라 대규모 refactor 하지 않음.
- npm audit: 2 moderate vulnerabilities — 기존 항목. dependency upgrade 금지 정책에 따라 fix하지 않음.
- 관찰: 소문자 mission URL(`/missions/preliminary-m03`)은 "존재하지 않는 미션" 안내 표시. 앱 내부 링크는 항상 대문자(`M03`)로 생성되며 의도된 검증 동작이므로 수정하지 않음.

## Technical Accuracy Regression

canonical 의미 왜곡 없음 — data source level에서 13개 구분 전부 확인:

- authentication token: security map "identity claim을 전달하는 credential artifact" vs AI map token-usage-cost "authentication token과 무관하다" — 구분 유지
- transaction-data: `transaction-data`(M03 거래 데이터)와 `transaction`(M11/M12 DB 트랜잭션) 별개 term, Data map은 M03을 "relational DB work로 가장하지 않음" 의도 유지
- async/await: frontend map "Promise 기반 문법" / queue "FIFO data structure; event loop와 동의어가 아니다" — 구분 유지
- Redis: "abstract data structure가 아니라 여러 자료구조를 제공하는 data store" — 유지
- Git DAG: commit-node "DAG concept의 application node이며 Algorithms의 core는 아니다" — 유지
- AI API/model: "access interface이며 AI 자체가 아니다" / "parameterized model; API와 같은 것이 아니다" — 유지
- inference/training: "training과 구분된다" — 유지
- JWT: "signed token format이며 encryption의 동의어가 아니다" — 유지
- OAuth: "authorization framework; login protocol 자체가 아니다" — 유지
- Docker: image "불변에 가까운 배포 artifact" vs container "image에서 생성된 격리된 process 환경" — 유지
- HTTP/TCP: "application protocol이며 TCP와 같지 않다" / "transport protocol" — 유지
- Backend/Server: fastapi "web server 자체가 아니다", uvicorn "server implementation이며 application 자체가 아니다", asgi "server와 application 사이 interface" — 계층 구분 유지
- DB/DBMS: relational-database "데이터베이스 모델" vs query-execution "DBMS가 SQL을 해석·실행" — 구분 유지

canonical = 549, Webtoon = 5, extension = 0.4.1 — 기준 충족.

## Deployment Readiness

DEPLOYMENT_READY: YES

Reason: atlas validator PASS, knowledge map validator PASS, npm test PASS(15), Vite build PASS, extension build PASS, browser smoke 80/80 PASS, mobile PASS, console error 0, 10 maps 정상, 2 cross-field layers 정상, 16 Mission routing 정상, legacy M01 정상, canonical 549, Webtoon 5, extension 0.4.1, git clean.

## Files Changed

- scripts/build_wave2_knowledge_maps.py (utf-8 encoding)
- scripts/build_wave3_knowledge_maps.py (utf-8 encoding)
- scripts/validate_knowledge_map.py (utf-8 encoding)
- src/App.tsx (TypeScript narrowing)
- reports/validation/wave2-wave3-desktop-runtime-validation-result.md (이 보고서)

## Recommended Next Step

검증 완료 — GitHub Pages Public Deployment 진행 가능. 아직 실행하지 말 것.
