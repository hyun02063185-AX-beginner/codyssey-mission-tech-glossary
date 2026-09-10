# M01 Knowledge Map data

`knowledge-map.json`은 사람이 검토·수정하는 **source data**다. 노드의 분류, foundation 추가 이유, 방향성 있는 edge와 근거는 이 파일에서 관리한다.

`term-inventory.json`은 **derived artifact**다. 다음 기존 source에서 M01 Open-book의 Quick Terms만 읽어 만든 점검용 스냅샷이며, wider `mission-term-map`을 대체하지 않는다.

- `content/peer-review/main-m01-openbook.yaml`
- `data/curated/glossary-master-v0.1.yaml`
- `data/curated/mission-term-map-v0.1.yaml`
- `content/terms/<termId>.md`
- `content/webtoons/<termId>/concept.md`

재생성 및 검사:

```bash
npm run knowledge-map:validate
```

검사 범위는 mission term coverage, node/edge ID, region/layer 필수값, foundation rationale, relation/evidence 값, traceable source, orphan, duplicate edge, 의도하지 않은 방향성 cycle이다.
