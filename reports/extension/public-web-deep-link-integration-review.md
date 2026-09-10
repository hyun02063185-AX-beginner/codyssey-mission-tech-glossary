# Chrome Open-book → Public Web / Technology Atlas Deep-link Integration Review

Extension 0.4.2 — Side Panel에서 공개 Web 사전과 Technology Field Map으로 연결하는 단방향 deep-link 통합 검토.

## Architecture

- 링크 생성 로직은 단일 모듈 `src/publicWebLinks.ts`에 중앙화. UI 컴포넌트(sidepanel.js)는 URL을 직접 조립하지 않는다.
- Extension build(`scripts/build_extension.py`)가 esbuild로 `PublicWebLinks` IIFE 전역으로 컴파일해 `dist-extension/publicWebLinks.js`로 내보낸다. Side Panel은 기존 plain script 구조와 CSP를 그대로 유지한다.
- term → map 해석은 build-time에 생성되는 `src/data/generated/term-map-links.json`을 사용한다. 전체 map graph를 extension에 넣지 않는다.

## URL Contract

Web은 HashRouter + GitHub Pages 기준.

- Term detail: `https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary/#/terms/<termId>`
- Map: `...#/maps/<mapId>?mission=<missionId>&term=<termId>` (mission query는 유효할 때만)
- 모든 id는 `encodeURIComponent` 처리. URL에는 canonical id(termId/mapId/missionId)만 전달되고 사용자 입력 텍스트는 절대 들어가지 않는다.

## Map Resolution Policy

`resolveTechnologyMap(termId, missionId?, index)`:

1. 현재 mission overlay가 노출된 map 중 term이 실제 graph node로 존재하는 map (mission 유지)
2. canonical home(primary field)의 implemented map — index가 첫 번째로 정렬
3. term이 실제 node로 존재하는 다른 implemented map
4. 없으면 `null` → map CTA 미표시

term-field-classification에 field가 있어도 graph node가 아니면 링크를 만들지 않는다. index 자체가 graph node 존재 기준으로만 생성된다.

## Generated Data

- `src/data/generated/term-map-links.json`: 227 mapped terms · 236 term-map edges · 16 missions
  - `terms[termId] = [mapIds]` (primary-field map 우선)
  - `missions[missionId] = [mapIds]` (routing의 overlay contexts 순서)
- Source of truth는 기존 atlas 소스(glossary-master, map-registry, 각 graph, term-field-classification, mission-map-routing)이며 수작업 mapping 없음.
- `scripts/build_term_map_links.py`가 생성 시 전 항목 assert, `scripts/validate_knowledge_map.py`가 생성 결과를 재검증(canonical term / implemented map / graph node / mission overlay route)해 drift를 차단한다.

## UI

- 검색 결과 카드 하단에 `.web-links` 영역 추가:
  - **웹에서 자세히 보기 ↗** — 모든 canonical term에 표시 (Web 상세 페이지는 모든 term에 존재)
  - **기술 지도에서 보기 ↗** — map resolution 성공 시에만 표시, M01 맥락 term은 `mission=main-m01` 유지
- 두 CTA 모두 `target="_blank" rel="noopener"`로 새 탭에서 열린다. Side Panel context는 그대로 유지된다. 클릭 1회 = 탭 1개, about:blank 발생 없음.

## Version / Permissions / Package

- version: 0.4.1 → **0.4.2** (기능 추가)
- permissions: `sidePanel, storage, contextMenus, search` — 불변. 새 탭 anchor 이동이라 추가 permission 불필요. `<all_urls>`·GitHub Pages host permission 미추가.
- package: `releases/codyssey-openbook-v0.4.2.zip` (9 files, 75,217 bytes)
  - before v0.4.1.zip: 65,268 bytes / after: 75,217 bytes (+9,949 bytes, 약 15%)
  - 증가분 = publicWebLinks.js(2.2KB) + term-map-links.json(14.2KB, 압축 후). 전체 map graph는 포함하지 않음.

## Chrome QA (실제 Chromium, dist-extension 로드)

- manifest 0.4.2, permissions 불변, service worker 정상
- HTML / JavaScript / DOM / fetch / localStorage / GitHub Pages 6개 term: 검색 → 결과 → 두 CTA href 정확 → web CTA 새 탭 = public term detail(h1 일치) → map CTA 새 탭 = frontend map에 selected term + mission overlay badge
- no-map term(`amazon-ebs`): web CTA만 표시, map CTA 숨김 — broken button 없음
- unknown term: 기존 웹 검색 폴백 유지, CTA 미표시
- side panel console error 0

## Context-menu Lookup Regression

- background.js / content.js 무변경.
- pending query hydrate, panel open 상태의 storage onChanged 재검색, hydrate 후 CTA 표시, duplicate requestId 무시 — 실제 storage.session 주입으로 전부 PASS. 기존 extension-handoff 테스트 4건 유지.

## Regression

- canonical 549 / 10 maps / 2 layers / 16 mission routing / webtoon 5 — 전부 유지
- Web build, atlas/knowledge-map validator, npm test(26) — PASS
- Web main chunk 및 Atlas lazy loading 변경 없음
