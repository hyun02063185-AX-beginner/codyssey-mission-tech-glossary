# Concept Connection v1 구현 보고서

## 범위와 기준선

- 기준 커밋: `eb2dec3` (`main`, 원격보다 5개 커밋 앞선 상태)
- 기존 Technology Atlas의 10개 구현 지도, 2개 교차 분야 레이어와 HashRouter 구조를 유지했다.
- 작업 트리의 기존 미추적 `.DS_Store`는 변경하거나 커밋하지 않았다.

## 제공한 개념 연결

`data/curated/concept-connections-v1.json`에 다음 6개 `PUBLISHED` 연결을 추가했다.

1. AJAX / XMLHttpRequest / Fetch
2. Callback / Promise / async-await
3. Event / Event Handler / addEventListener / preventDefault / Event Propagation
4. HTML / DOM
5. SPA / MPA
6. var / let / const

각 항목은 질문, 요약, 관계 그림, 설명 섹션, 흔한 오해, 용어 ID, Mission Context를 가진 데이터 레코드다. canonical 용어의 이름과 설명을 복사하지 않고 canonical ID를 참조한다. 아직 canonical 승격 대상이 아닌 `XMLHttpRequest`, `Event`는 관계 그림의 라벨 노드로만 표현했다.

## 화면과 탐색

- 헤더에 `개념 연결`을 추가했다.
- HashRouter에 `/connections`, `/connections/:connectionId`를 추가했다.
- 목록은 6개 카드, 상세는 관계 그림 → 설명 → 흔한 오해 → 관련 용어 → Mission Context 순서로 제공한다.
- 관련 canonical 용어는 용어 상세로 직접 이동한다.
- 용어 상세와 Atlas 노드 상세 패널에서 해당 용어가 포함된 개념 연결로 이동할 수 있다.
- 작은 화면에서는 카드와 관계 표가 한 열로 전환되며, 키보드 포커스가 드러난다.

## Atlas 관계 원칙

개념 연결의 설명용 그림은 Atlas 그래프 관계 taxonomy를 확장하지 않는다. 따라서 기존 `based_on`, `compare_with`, `evolved_from` 등 관계 체계와 시각적 구분을 보존했다. 프론트엔드 지도에서 async-await와 callback의 관계는 오해를 줄이기 위해 `compare_with`로 유지하고, Promise 기반 흐름은 별도의 설명용 관계 그림에서 표현한다. 지도 노드·엣지의 대규모 재구성은 하지 않았다.

## 데이터 파이프라인과 회귀 방지

- `scripts/build_web_data.py`가 개념 연결 원본을 검증하고 `src/data/generated/concept-connections.json`을 생성한다.
- `scripts/validate_glossary.py`가 연결 ID 중복, PUBLISHED 상태, canonical 참조, 그림 노드와 엣지 무결성을 검사한다.
- `src/data.test.ts`는 6개 연결의 ID, 상태, canonical 용어 참조를 검증한다.
- 새 연결은 같은 스키마의 데이터 레코드만 추가하면 목록·상세·용어/Atlas 역링크에 자동으로 나타난다.

## 검증 결과

- `python3 -m py_compile scripts/build_web_data.py scripts/validate_glossary.py` 통과
- 전체 생성 체인 통과
- `python3 scripts/validate_glossary.py` 통과: 514 canonical, 46 mission-local, 0 error
- `python3 scripts/validate_technology_field_atlas.py` 통과: 12 fields, 514 terms, 16 missions
- `python3 scripts/validate_knowledge_map.py` 통과: 10 implemented / 12 registry maps, 2 cross-field layers
- 이 환경에는 `node`와 `npm` 실행 파일이 없어 `npm test`, production build, 브라우저 E2E는 실행하지 못했다.
