# Accent Theme System — V1.2 Candidate

> 2026-09-30 · baseline: `encyclopedia-v1.1` → `e3b6e39`
> 판정: **`ACCENT_THEME_SYSTEM_READY_FOR_OWNER_REVIEW`**
> 이것은 V1.1 이후의 표현 개선이다. V1.2 release tag는 아직 만들지 않는다.

## Usage Evidence

Owner가 기존 Green 정체성은 유지하면서 사용자가 전체 Accent 색감을 선택할 수 있기를 요청했다. 이는 전면 재디자인이나 typography 변경이 아니라, Brand/interactive accent에 대한 개인 표현 설정이다.

## Color Audit

| 분류 | 현재 위치와 처리 |
| --- | --- |
| Accent / brand | `src/styles.css`, `src/repair.css`의 Green 계열 primary CTA, interactive link, selected state, card border, story/mission/encyclopedia surface, focus ring. **Theme 대상** |
| Semantic | warning/attention Amber (`#cf7d29`, map boundary), role limited Amber, role declared/error Red. **Theme 제외** |
| Data visualization | Technology Map region, foundation/boundary node, relation/field visual 색과 SVG label/stroke. **Theme 제외** |
| Standalone asset | `public/learning-assets/mac_sliding_window_demo.standalone.html`의 독립 palette. 원본/실행 보존 계약상 **Theme 제외** |
| Extension | `extension/sidepanel.html`은 별도 runtime이며 Web localStorage를 공유하지 않는다. **Theme 제외** |

감사 시 Web CSS에는 `#1d4d42` 57회, `#315f52` 22회 등 Green 계열 legacy 선언이 분산되어 있었다. 이번에는 위험한 대량 색상 치환 대신, 마지막 cascade layer에서 역할 기반 token으로 interactive/brand 표면을 일관되게 덮는 migration을 적용했다. 새 component에는 색 literal을 추가하지 않는다.

## Token Architecture

`<html data-accent-theme="…">`가 CSS token 값을 제공하고 React는 선택/저장만 담당한다.

```
--accent-primary     --accent-strong       --accent-soft
--accent-muted       --accent-border       --accent-text
--accent-hover       --accent-selected     --accent-focus
--accent-on-primary
```

Brand 및 interactive accent는 이 token을 쓴다. semantic/data 색은 해당 의미를 보존하며 Accent token으로 바꾸지 않는다. 이 분리는 미래의 Light/Dark appearance 축과 Accent 축을 섞지 않는다.

## Presets

| Theme | primary | visual observation |
| --- | --- | --- |
| Forest | `#1d4d42` | V1.1 Green identity를 기본값으로 유지 |
| Ocean | `#0d5d78` | 차분한 blue/cyan, white text와 선명한 대비 |
| Indigo | `#4940a3` | blue-violet, 카드·CTA 식별 명확 |
| Amber | `#8a4b09` | warm accent, warning 색과 역할을 혼동하지 않도록 warning palette는 보존 |
| Mono | `#3f4850` | 낮은 채도의 graphite, interactive affordance 유지 |

모든 primary는 white button text와 WCAG AA 일반 텍스트 대비를 충족하도록 선택했다. Focus ring은 각 theme에서 primary와 분리된 고대비 색을 사용한다.

## Selector and Persistence

- 위치: Header의 navigation 다음 compact native `<select>` — 다섯 개 버튼을 늘어놓지 않는다.
- 표시: **색상 테마** / Forest, Ocean, Indigo, Amber, Mono.
- 키보드: native select의 Tab/arrow/Enter 동작, visible focus, accessible name을 사용한다.
- 저장: `localStorage['codyssey-accent-theme']`.
- reload/route: 선택은 Terms → Mission → Map → Academic 이동과 reload 후 유지한다.
- invalid/missing 저장값: Forest fallback.
- history 및 URL: 변경하지 않는다.
- FOUC: `index.html`의 작은 선행 스크립트가 React 시작 전에 root attribute를 설정한다.

## Map and Learning Boundary

Map에서는 toolbar/overlay/selected interactive state만 Accent token을 따른다. region, boundary, node role, relation 의미를 전달하는 색은 그대로다. Learning Story의 card, CTA, wrapper는 token을 따르지만 sandboxed MAC iframe 내부 palette와 메시징 contract는 바꾸지 않았다.

## QA

| Check | Result |
| --- | --- |
| Unit | 84 PASS (theme validation/fallback 포함) |
| Playwright | 44 PASS (5 presets, persistence, fallback, route persistence 포함) |
| Build | PASS |
| Extension build | PASS |
| Knowledge validators | 0 error / 0 warning |
| Generated drift | 0 |
| Data model diff vs V1.1 | 0 |

Desktop browser scenarios covered Encyclopedia Home, Term Detail, preliminary M03, Technology Map 및 five preset selection. 375px regression contract also remains in the full Playwright suite: Header selector is a full-width compact row below navigation and does not create horizontal overflow.

## Known Issues / Owner Review

No blocker is known. The project retains pre-existing Vite large-chunk warnings. Before release, Owner must review Forest, Ocean, Indigo, Amber, and Mono on the same representative screens, especially theme names, brightness, selector location, and Map impression. Owner approval is required before any `encyclopedia-v1.2` tag.
