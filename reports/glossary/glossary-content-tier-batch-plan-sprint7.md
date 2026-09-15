# Sprint 7 — Full Content Tier Classification & Batch Planning

## 결과

기준 commit `09b6036`의 Canonical **519개 전부**에 설명 깊이 계약을 부여했다. 실제 상세 본문이 없는 **395개**만 새 작성 대상으로 잡고, 서로 겹치지 않는 **9개** 구현 배치(각 40–50개)에 고정 배정했다. 이번 Sprint는 콘텐츠를 대량 작성하거나 Canonical을 변경하지 않는다.

기계 판독 가능한 전수 원본은 [content-tier-sprint7.json](../../data/reviews/content-tier-sprint7.json)이다. 이 파일의 `items`는 519개 각각의 tier, 필요 섹션, 근거, 권장 설명 방식, 배치 ID를 담고, `implementation_batches`는 실제 term ID 순서를 담는다.

## Tier 계약

| Tier | 대상 수 | 설명 깊이 | 작성 완료 조건 |
| --- | ---: | --- | --- |
| A — Deep learning concept | 95 | Quick + Mission + Deep | 동작 흐름 또는 비교, 구체적 코드·명령 또는 시나리오, 경계/엣지 케이스, 흔한 오해, 관련 용어 경로, 동료평가 질문 |
| B — Standard mission concept | 247 | Quick + Mission + focused Deep | 정확한 정의, 대표 예시 하나, 적용되는 경계 또는 비교 하나, 관련 용어와 동료평가 질문 |
| C — Reference/supporting term | 177 | Quick reference | 정확한 짧은 정의, 미션 단서, 필요할 때만 명령·문법·값 예시. 인위적인 Deep 섹션은 쓰지 않음 |

Tier는 작성되어 있는지와 별개다. mission 중요도·직접 등장·재사용, 난이도, 기존 학습 연결, 그리고 보안·상태·생명주기·인과·trade-off 경계가 필요한지로 판정했다. 좁은 명령·옵션·설정 파일·제품/참조 항목은 C로 유지해 모든 항목을 불필요하게 길게 만들지 않는다.

## 현황

| 항목 | 수 |
| --- | ---: |
| Canonical | 519 |
| 기존 상세 콘텐츠 | 124 |
| 새 작성 대상 | 395 |
| 새 작성 A / B / C | 44 / 186 / 165 |

`content/terms/README.md`는 디렉터리 안내 문서이며 Canonical `readme`의 본문으로 세지 않았다. 따라서 `readme`는 S7-B06의 정상 작성 대상이다. 해당 배치 시작 전에는 안내 문서 파일명 충돌을 해소해야 한다.

## 확정 구현 배치

| 순서 | Batch | 주제 | 수 | A / B / C |
| ---: | --- | --- | ---: | ---: |
| 1 | S7-B01 | Programming foundations and execution | 44 | 7 / 31 / 6 |
| 2 | S7-B02 | Web rendering, interaction, and React | 42 | 5 / 16 / 21 |
| 3 | S7-B03 | Security, identity, and safe request handling | 40 | 5 / 17 / 18 |
| 4 | S7-B04 | Database modeling and data lifecycle | 45 | 11 / 29 / 5 |
| 5 | S7-B05 | Linux runtime and operations | 44 | 1 / 19 / 24 |
| 6 | S7-B06 | Git history and collaboration | 46 | 4 / 19 / 23 |
| 7 | S7-B07 | Network, backend, and deployment path | 45 | 3 / 18 / 24 |
| 8 | S7-B08 | Algorithms, data structures, and remaining language mechanics | 46 | 6 / 21 / 19 |
| 9 | S7-B09 | AI/data tools and remaining infrastructure references | 43 | 2 / 16 / 25 |

각 Batch의 정확한 대상과 순서는 JSON `implementation_batches[].term_ids`가 단일 기준이다. 이미 상세 콘텐츠가 있는 124개는 새 작성 배치에 넣지 않았다. 기존 본문의 품질 보강은 별도 repair 작업으로만 잡아, 신규 작성량과 섞지 않는다.

## 후속 실행 규칙

1. 한 번에 하나의 Batch만 진행하고, JSON에 기록된 `term_ids` 순서를 유지한다.
2. 각 term은 자신의 Tier `required_sections`를 충족해야 한다. A를 B/C 수준으로 축약하거나 C에 일반론을 덧붙여 부풀리지 않는다.
3. Batch를 끝낸 뒤 `npm run content:plan`, `npm run content:plan:validate`, `npm run glossary:validate`, `npm test`, `npm run build`를 실행한다.
4. Canonical 병합·분리·이름 변경이 생기면, 그 변경을 먼저 검토·검증한 후 계획을 재생성한다. 배치 ID만 임의로 옮기지 않는다.

## 검증

`content:plan:validate`는 다음을 보장한다.

- 519개 계획 항목이 현재 Canonical과 정확히 일치한다.
- 모든 항목이 A/B/C 중 하나이며 설명 깊이 계약을 가진다.
- 미작성 395개는 정확히 한 배치에만 속하고, 작성된 124개는 새 작성 배치에 없다.
- 모든 Batch 크기는 40–50개다.
