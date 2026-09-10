# Chrome Open-book Public Web / Atlas Integration 결과

## Git

- start: `7508606` (예상과 일치, pull 불필요)
- end: 작업 커밋 (feat + docs, 아래 참조)
- push: yes (origin/main, force push 없음)
- status: clean

## Extension

- before version: 0.4.1
- after version: 0.4.2
- permissions: `sidePanel, storage, contextMenus, search` (불변)
- host permissions: `https://usr.codyssey.kr/*` (불변, `<all_urls>`/GitHub Pages 추가 없음)
- package: `releases/codyssey-openbook-v0.4.2.zip` (9 files, 75,217 bytes)

## Public Web

- base URL: `https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/`
- term detail route: `#/terms/<termId>`
- map route: `#/maps/<mapId>?mission=<missionId>&term=<termId>`

## Link Architecture

- helper: `src/publicWebLinks.ts` — `PUBLIC_WEB_BASE_URL`, `buildTermDetailUrl`, `buildTechnologyMapUrl`, `resolveTechnologyMap` 단일 모듈. Extension build가 esbuild IIFE(`PublicWebLinks`)로 `dist-extension/publicWebLinks.js` 컴파일.
- base URL config: helper 상수 1곳, 코드 곳곳 문자열 반복 없음
- term-map resolution: mission overlay 우선 → primary field map → node 존재 map → 없으면 null (CTA 숨김)
- mission context: M01 맥락 term은 `mission=main-m01` 유지, 그 외 mission 확장 가능한 형태 (`resolveTechnologyMap(termId, missionId, index)`)

## Generated Data

- map link index: `src/data/generated/term-map-links.json` — 227 mapped terms · 236 term-map edges · 16 missions (549 canonical 중 node 존재 term만)
- source-of-truth: 기존 atlas 소스(glossary-master / map-registry / 각 graph nodes / term-field-classification / mission-map-routing). 수작업 mapping 없음.
- validator: `build_term_map_links.py` 생성 시 전 항목 assert + `validate_knowledge_map.py`가 생성 결과 재검증 (canonical term / implemented map / graph node / mission overlay route). deterministic 재생성 확인.

## UI

- Web detail CTA: 모든 canonical term 결과 카드에 **웹에서 자세히 보기 ↗**
- Map CTA: resolution 성공 시에만 **기술 지도에서 보기 ↗** (M01 term은 mission query 유지)
- no-map term: `amazon-ebs` 등 322개 — web CTA만, map CTA 없음 (broken button 0)
- new-tab behavior: `target="_blank" rel="noopener"` — 클릭 1회 = 탭 1개, about:blank 없음, Side Panel context 유지, console error 0

## Chrome QA (실제 Chromium + dist-extension)

- HTML: PASS — web `#/terms/html`(h1=HTML) / map `#/maps/frontend?mission=main-m01&term=html` (selected=1, overlay badge=1)
- JavaScript: PASS — 동일 패턴 (selected title=JavaScript)
- DOM: PASS — 동일 패턴
- fetch: PASS — `#/terms/fetch-api` / map selected title=Fetch API
- localStorage: PASS — 동일 패턴
- GitHub Pages: PASS — `#/terms/github-pages` / map selected title=GitHub Pages (frontend boundary node)
- context-menu lookup: PASS — pending query hydrate, live storage change 재검색, duplicate requestId 무시, hydrate 결과에 CTA 표시 (실제 storage.session 주입 4/4)

## Atlas QA

- selected term: map 진입 시 `.map-node.is-selected` 1개 + detail title 일치
- mission overlay: `main-m01` overlay badge + overlay filter 활성 유지
- boundary node: GitHub Pages(frontend boundary role) 정상 선택·표시
- multi-map behavior: `api-key` 등 8개 multi-map term — primary field 우선, mission overlay 있으면 그 map 우선 (unit test 검증)

## Regression

- canonical: 549 유지
- maps: 10 / layers: 2 / missions: 16 routing 유지
- webtoons: 5 유지
- Web build: PASS (기존 chunk 경고만)
- Extension build: PASS

## Validation

- atlas: PASS — 12 fields · 549 terms · 16 missions
- knowledge-map: PASS — 10 implemented · 2 layers + term-map-links index 검증 포함
- npm test: PASS — 26 tests (publicWebLinks 11 신규 포함)
- build: PASS
- build:extension: PASS (deep-link artifacts 검증 포함)
- package: PASS — v0.4.2.zip, 9 files, zip root manifest OK
- diff: `git diff --check` PASS

## Performance

- extension before: v0.4.1.zip 65,268 bytes
- extension after: v0.4.2.zip 75,217 bytes (+9,949 bytes ≈ +15%)
- notes: 증가분은 publicWebLinks.js(2.2KB) + term-map-links.json(14.2KB). 전체 10개 map graph는 포함하지 않음. Web main chunk / Atlas lazy loading 무변경.

## Files Changed

- extension/manifest.json (0.4.2)
- extension/sidepanel.html (web-links 스타일 + publicWebLinks.js 로드)
- extension/sidepanel.js (term-map-links 로드 + CTA 렌더)
- src/publicWebLinks.ts (신규 — URL 헬퍼 단일 모듈)
- src/publicWebLinks.test.ts (신규 — 11 tests)
- src/data/generated/term-map-links.json (신규 — 생성 index)
- scripts/build_term_map_links.py (신규 — index 생성 + assert)
- scripts/build_extension.py (esbuild 컴파일 + 복사 + 검증)
- scripts/package_extension.py (REQUIRED_FILES 9개)
- scripts/validate_knowledge_map.py (index 재검증)
- package.json (data:build에 index 빌더 추가)
- README.md (0.4.2 + deep-link 안내)
- reports/extension/public-web-deep-link-integration-review.md (신규)
- reports/extension/openbook-web-atlas-integration-result.md (이 보고서)
- dist-extension/ (재생성 산출물)

## Remaining Issues

- 없음. 기존 항목: Web main chunk >500kB 경고(기존), npm audit 2 moderate(기존).
- 참고: GitHub Pages는 Web 코드 무변경이므로 재배포 불필요. Extension은 사용자가 새 버전 폴더를 직접 로드(unpacked 특성상 자동 업데이트 없음).

## Notion Update Payload

Latest Git: d79b9fb
Milestone: Chrome Open-book ↔ Public Web / Atlas Deep-link Integration
Extension Version: 0.4.2
Public Web Base URL: https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/
Term Detail Deep Link: #/terms/<termId>
Technology Map Deep Link: #/maps/<mapId>?mission=<missionId>&term=<termId>
Mission Context: M01 맥락 term은 mission=main-m01 유지 (sidepanel의 quick_term_context 기준)
Map Resolution Policy: mission overlay map → primary field map → graph-node 존재 map → 없으면 CTA 숨김 (227/549 mapped)
Permissions: sidePanel, storage, contextMenus, search (불변)
Package: releases/codyssey-openbook-v0.4.2.zip (9 files, 75KB)
Chrome QA: 6 term deep-link + no-map + unknown + context-menu lookup — 실제 Chromium 전부 PASS
Regression: canonical 549 / 10 maps / 2 layers / 16 missions / webtoon 5 — 유지, Web build PASS
Known Limitations: Extension은 main M01 openbook 전용 (helper는 mission 확장 가능 구조), unpacked 수동 업데이트
Next Stage: Web → Extension 역방향 연결 없음 / Chrome Web Store publish는 미결정
Status: PENDING SOL SYNC

## Status

OPEN_BOOK_WEB_ATLAS_INTEGRATED: YES
