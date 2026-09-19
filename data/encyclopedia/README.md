# Knowledge Encyclopedia — authored source

이 디렉터리는 Knowledge Encyclopedia가 **직접 관리하는 유일한 authoring 원본**이다.
여기 없는 사실은 전부 기존 데이터에서 파생한다. 설계 근거는 `docs/knowledge-encyclopedia/`를 본다.

## 파일과 소유 범위

| 파일 | 소유하는 사실 | 소유하지 않는 것 |
| --- | --- | --- |
| `relation-ontology.json` | relation의 **의미**(방향·대칭·역관계·learn-first) | relation **어휘** — `scripts/validate_knowledge_map.py`의 `RELATIONS`가 원본 |
| `academic-fields.json` | 학문 14개, 학문 간 선수 순서, Atlas→학문 crosswalk | term별 학문 배정(파생 + cluster override), term 수(빌더 계산) |
| `missions.json` | 미션 16개의 제목·순서·ID alias·학문 배정·다음 학습 | **미션의 term 목록** (master `mission_refs`가 원본) |
| `roles.json` | 직무 10개의 분야 가중치·커버리지 | 직무별 term 목록(파생) |
| `clusters/*.json` | 신규 edge, 큐레이션 경로, foundation node, 학문 override | canonical 정의, 기존 map edge |

## 절대 규칙

1. **RC1을 건드리지 않는다.** `data/curated/`, `content/`, `data/knowledge-maps/`, `extension/`은 이 작업으로 변경되지 않는다.
2. **같은 사실을 두 번 적지 않는다.** term↔미션, term↔기술분야, 기존 map edge는 여기에 옮겨 적지 않는다.
3. **`related`는 authoring 금지.** 용어 md의 `## 관련 용어`에서 파생한다.
4. **역방향 edge를 저장하지 않는다.** 빌더가 인덱스로 만든다.
5. **generated 파일을 손으로 고치지 않는다.** `src/data/generated/encyclopedia-graph.json`은 빌드 산출물이다.
6. **새 relation type을 만들지 않는다.** 필요하면 Owner Gate.

## relation 방향 계약 (요약 — 정본은 `relation-ontology.json`)

화살표는 **"의존하는 쪽 → 먼저/기반이 되는 쪽"**이다.

```
A prerequisite B   B를 먼저 알아야 A를 이해한다
A based_on B       A가 B에 기반한다
A is_a B           A는 B의 한 종류다
A uses B           A가 B를 사용한다
A provided_by B    B가 A를 제공한다
A evolved_from B   A는 B 이후의 맥락이다
A compare_with B   대칭 (방향 없음)
A interacts_with B 대칭 (방향 없음)
```

## 새 항목을 추가하는 법 (사람용)

**새 학문** → `academic-fields.json`의 `fields`에 한 줄 추가 + 필요하면 `atlasCrosswalk` 수정.
**새 미션** → `missions.json`의 `missions`에 항목 추가(`id`, `aliases`, `order`, `titleKo`, `academic`).
**새 관계** → 해당 주제의 `clusters/<name>.json` `edges`에 다음 6개 필드로 한 줄:

```json
{"from": "term:cache", "relation": "uses", "to": "foundation:key-value-store",
 "reason": "왜 이 관계가 성립하는지 한 문장", "confidence": "HIGH",
 "evidenceType": "official-documentation", "source": "https://..."}
```

`from`/`to`는 `term:<canonical id>`, `foundation:<slug>`, `academic:<id>`, `mission:<id>` 중 하나다.

**새 경로** → 같은 파일 `paths`에 `steps`(노드 ID 순서)와 `why`(왜 이 순서인지)를 적는다. **인접한 두 step 사이에 edge가 없으면 검증에서 실패한다** — 경로보다 관계를 먼저 넣으라는 뜻이다.

## 검증

```bash
python scripts/build_encyclopedia_graph.py
python scripts/validate_encyclopedia.py
```

실패 메시지는 "무엇이 / 어디서 / 어떻게 고치는지"를 함께 출력한다.
