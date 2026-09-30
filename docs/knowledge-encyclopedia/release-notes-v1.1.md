# 코디세이 기술용어 사전 — Knowledge Encyclopedia V1.1

> **정식 릴리스** · `encyclopedia-v1.1` · 2026-09-30
> V1 이후 실제 사용에서 확인한 문제를 해결한 첫 개선 릴리스입니다. 배포는 tag가 아니라 `main` push 기준입니다.

---

## Why

기술용어를 개별적으로 암기하는 데서 끝나지 않고, 개념 사이의 관계와 실제 미션에서 형성된 이해를 연결해 기술의 흐름을 볼 수 있게 합니다.

**점이 선이 되어, 당신의 길을 만듭니다.**

“점이 선이 되는 순간”은 하나의 용어를 아는 데서 끝나지 않고 질문·실습·시각화를 통해 다른 개념과 활용 목적에 연결되어 이해가 확장된 실제 학습 경험을 뜻합니다.

## Added / Improved

### Technology Map Immersive Workspace

- Technology Map을 desktop viewport에 가깝게 확대했습니다.
- drag 중 노드 글자가 선택되지 않으며, detail overlay는 지도를 줄이지 않습니다.
- **읽기 크기**와 **전체 보기**를 분리해 글자를 읽는 일과 전체 구조를 보는 일을 나눴습니다.
- deep link, browser history, node selection, 기존 mobile 동작을 유지했습니다.

### Point-to-Line Learning Experience

- 기술지도에 브랜드 문구를 추가했습니다. **코디세이 기술지도 · 점이 선이 되어, 당신의 길을 만듭니다.**
- 예비 M03에만 evidence-backed **점이 선이 되는 순간** Story를 추가했습니다.
- MAC을 어디에 쓰는지 설명하고 **움직여서 이해하기** CTA로 연결합니다.
- MAC Sliding Window Visual Learning Asset을 별도 route에서 실행할 수 있습니다.
- `mac-operation` 용어 상세에서도 Story와 Asset으로 연결됩니다.
- 학습 당시 원본은 수정하지 않고 보존했습니다. 서비스 실행본은 외부 dependency 없는 standalone 파일이며 원본의 계산·animation logic을 유지합니다.

## Unchanged

- Canonical glossary
- relation model / graph ontology
- academic model
- mission registry, prerequisite graph, learning path

## Operating Policy

Mission Learning Story는 optional이며 evidence-driven입니다. 모든 Mission에 Story를 강제하지 않고, AI가 이야기를 만들었다는 이유만으로 등록하지 않습니다. 실제 학습 근거와 Owner의 판단을 정확하게 편집한 뒤 공개합니다. M02처럼 **NO STORY**가 정상일 수 있습니다.

Visual Learning Asset은 데이터 이동, 상태 변화, 알고리즘 단계, 필터 이동, 요청/응답 흐름처럼 시간·위치·상태 변화 자체가 이해의 핵심일 때 우선 검토합니다. 모든 개념에 확대하지 않으며 범용 Visual Asset engine은 만들지 않았습니다.

## Deferred

- Timeline
- contribution system 및 다른 사용자의 Story 등록
- 다른 Mission Story
- Visual Learning Asset 일반화

## Next Candidate

**Accent Theme System** — 현재 Green 계열 accent를 사용자가 선택하는 아이디어입니다.

- Forest
- Ocean
- Indigo
- Amber
- Mono

V1.1에는 구현하지 않았습니다. Evidence 또는 Owner 승인이 있는 별도 작업에서만 검토합니다.
