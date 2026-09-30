# 코디세이 기술용어 사전 — Knowledge Encyclopedia V1.2

> **정식 릴리스** · `encyclopedia-v1.2` · 2026-10-01
> V1.2는 단순한 색상 테마 추가가 아니라, 많은 기술 정보를 오래 읽고 빠르게 구조를 파악하도록 시각적 기반을 정리한 릴리스입니다. 배포는 tag가 아니라 `main` push 기준입니다.

---

## Why

기술용어 사전의 화면은 정보가 많고 읽는 시간이 길다. V1.2는 본문 폭·문단 계층·표면·경계·글꼴 역할을 한 체계로 정리해, 학습자가 정보 구조를 빠르게 파악하고 긴 설명을 편하게 읽도록 합니다.

## Visual Foundation

### Four supported themes

- **Forest** — 기본 학습형. Pretendard와 차분한 green accent.
- **Indigo** — technical / structured. IBM Plex Sans KR heading과 indigo-blue hierarchy.
- **Paper** — reading / editorial. serif heading과 warm neutral surface.
- **Signal** — high contrast / focus. cobalt interaction을 쓰되 본문 reading surface는 차분하게 유지.

선택은 **화면 테마** selector에 저장된다. 누락값·잘못된 값·이전 Ocean/Amber/Mono 값은 안전하게 Forest로 돌아간다.

### Typography and reading

- Pretendard Variable과 IBM Plex Sans KR을 self-host한다. CDN 의존성은 없다.
- `font-display: swap`으로 텍스트를 막지 않는다.
- Paper는 editorial reading을 위해 system serif heading을 유지하며, code는 mono stack을 사용한다.
- Reading width, line height, type hierarchy, card/page spacing은 장문 읽기와 정보 우선순위를 위해 정리했다.

### Technology Map

Theme은 workspace, toolbar, controls, selected filter/route, drawer, focus, links, brand copy에 분명하게 반영한다.

Node hover, selected node, highlighted relation에는 절제해서 반영한다. 선택 node는 **pale tint + contained border + subtle glow + dark label**이며 solid accent fill로 돌아가지 않는다. region, foundation, boundary, role, relation의 semantic/data colors는 Theme과 독립이다.

## Accessibility and responsive behavior

네 Theme 모두 읽기 표면의 body/secondary text와 CTA 대비를 확인했고, theme focus token을 유지했다. Theme selector와 대표 화면은 mobile viewport에서도 overflow 없이 동작한다.

## Unchanged

- Canonical glossary, content, relation ontology, Encyclopedia graph
- Mission, academic, prerequisite, learning path, Technology Map data
- Chrome Extension content and standalone learning asset

## Known issues

- Vite의 large-chunk warning은 남아 있다. 현재 UX blocker가 아니므로 V1.2에서 font subset, chunk split, performance sprint를 시작하지 않는다.
- Human Calibration은 계속 `POST_RELEASE_CONTINUOUS_VALIDATION`이다. 실제 관찰 없이 학습자 경험이 검증되었다고 선언하지 않는다.

## Deferred

Dark Mode, custom theme, font optimization, new Theme, Map redesign, Timeline, contribution flow, new Learning Story는 V1.2에 포함하지 않는다. 후속 개선은 실제 사용 근거에서 다시 시작한다.
