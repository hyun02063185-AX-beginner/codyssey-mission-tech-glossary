# Learning Story M03 — 첫 Visual Learning Asset 적용

> 2026-09-28 · 범위: 예비 M03의 기존 `mac-operation` canonical과 실행형 시각 자료 1건

## Learning Evidence

사용자는 예비 M03 학습 중 “MAC 연산이 옆으로 이동하면서 계산하는 방식은 어떤 경우에 사용하는가?”라고 질문했다. 슬라이딩 애니메이션은 작은 필터를 큰 입력의 여러 위치에 적용할 때 위치별 결과가 쌓이고, 패턴과 맞는 위치에서 값이 커지는 모습을 확인하는 데 도움이 되었다.

이후 동료평가에서 이 자료를 다른 교육생에게 보여 주며 MAC의 사용 목적을 설명하는 데 활용했고, 직관적이라는 긍정적 반응을 관찰했다. 이는 단일 학습 사례와 관찰이며, 정식 사용자 연구나 학습효과 검증으로 일반화하지 않는다.

## Product Insight

시간·위치·상태 변화가 핵심인 개념은 정적 텍스트만보다 상호작용이나 애니메이션이 이해를 도울 수 있다는 첫 사례다. 이 사례가 유효한지 Owner가 실제 화면에서 확인한 뒤에만 여러 Story를 위한 모델 또는 플랫폼 일반화를 판단한다.

## Implementation Boundary

- Story는 예비 M03에서만 렌더한다. 모든 mission schema에 빈 필드를 추가하지 않는다.
- 기존 `mac-operation` canonical을 사용한다. canonical, relation, Knowledge Graph는 변경하지 않는다.
- 실행본은 sandboxed iframe을 쓰는 별도 app route다. 원본은 `content/learning-assets/`에 보존하며 서비스 실행 대상으로 쓰지 않는다.

## QA Record

| Check | Result |
| --- | --- |
| Unit / graph data | `npm run test` — 82 PASS; encyclopedia validator 0 error / 0 warning |
| Web build | `npm run build` — PASS |
| Extension bundle | `npm run build:extension` — PASS |
| Browser regression | `python3 scripts/qa_playwright.py` — 42 PASS (existing 39 + Story 3) |
| Asset controls | Browser and Playwright: step, autoplay, pause, reset all confirmed |
| Deep link / back | Story CTA → `/learning-assets/mac-sliding-window` → browser Back to preliminary M03 confirmed |
| Desktop map workspace | Existing 1600px Playwright workspace contract PASS; manual browser view kept the full canvas area |
| 375px | Manual browser: Story → asset document width `360/360` (no overflow); map document width `360/360`, existing 960px canvas scroll model retained |
| Original preservation | SHA-256 `b348416f03437fd08390ff976a9875f72bd1469da39c725593311e21c9722b57` matches supplied original byte-for-byte |
| Standalone safety | No external script, font, CDN, or URL reference; calculation/animation script diff is empty |
| Generated / graph drift | `src/data/generated`, `data/curated`, `data/knowledge-maps`, `extension` unchanged |

## Browser Observation

Desktop: the compact product line sits in the existing map toolbar beside the overlay controls; it does not create a hero or claim vertical workspace. The M03 card is placed immediately under the mission encyclopedia title, before the existing six-question content. The asset loads in its own route with the explanatory context outside the sandboxed simulator.

375px: the Story card remains readable as one column and the embedded simulator stays within the page width. Its own vertical scrolling is intentional so the original fixed-size interaction can remain unchanged.
