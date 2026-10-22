# Scene 04 인수인계

> 미션 스토리맵 · B3-1 · AWS로 다시 이해하는 네트워크 — 마지막 장면(핵심 개념지도). 갱신일 2026-10-21. 단계: **시안, Owner 시각 검토 대기.** 자체 승인하지 않았고 웹 통합을 진행하지 않았다.

## 기준과 변경 범위

| 항목 | 내용 |
| --- | --- |
| 브랜치 | `draft/b3-1-visual-story-scene-04` |
| 시작 커밋 | `fd4af2b`(Scene 03 정합성 패치, 원격 `origin/draft/b3-1-visual-story-scene-03`과 같음) |
| 계승 | Scene 01 `8da2e59`, Scene 02 `1d70843`, Scene 03 `fd4af2b`(모두 Owner 최종 승인 전) |
| `main` | 병합하지 않았다. 작업 시점 `origin/main` `57462a9`와 `drafts/b3-1-visual-story/` 경로가 겹치지 않는다 |
| 변경 범위 | `drafts/b3-1-visual-story/scene-04/` 새 폴더만. Scene 01~03, 기존 학습가이드·기술지도·개념 연결·용어사전, `src/`(생성 데이터 포함), 웹 라우트, AWS 자원은 바꾸지 않았다 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `concept-map.json` | **유일한 원본 데이터**: 노드 14, 관계 15, 학습 순서 3, 장면 5, 연결 정책 |
| `concept-map-desktop.svg` | 1280×990. A·B·C 한 장 |
| `concept-map-mobile.svg` | 360×1768. A → B → C 순서. 참조 상자 사용 |
| `design-notes.md` | 질문, 영역 배치, 관계 시각화, 구조도와의 차이, 노트북·휴대전화 |
| `relationship-review.md` | 관계 15개의 유형·근거·오해 방지, 데이터 QA, 기존 기술지도 비교 메모 |
| `story-map-integration-notes.md` | 제안 주소, 장면 순서, 탐색 설계, 데이터 계약, 통합 시 확인 사항 |
| `visual-qa.md` | 그림 ↔ 데이터 일치, 화면 검사(선 교차 포함), 표시 크기, 흑백, 학습 질문(미검증) |
| `preview/` | PNG 5장(흑백 1장 포함), 검토 페이지 `index.html`(Scene 01~04 순서) |
| `_tools/` | `check_data.py`(데이터 검사, Scene 03 후보와 대조), `build.py`(JSON → SVG), `check.cjs`(그림 검사) |

## 최종 선정(Scene 03 후보 대비)

- 노드 14개, 관계 15개(포함 3 · 연관 8 · 흐름 1 · 대응 3): **변경 없음**. 관계 설명은 원문 그대로다.
- 인터넷은 노드로 세지 않았다. C12의 `path`에 `@internet`(경로 표시)으로만 넣었다.
- 화면 표시 이름(label)만 새로 정했다. 예: C3 "연결", C11 "1:1 짝".
- 학습 순서 L1~L3은 `learningOrder`와 지도 옆 상자로 따로 두었다.

## Owner 승인 대기

1. 포함을 **영역 겹침**으로 보여 준 방식. Scene 03-B와 모양이 닮은 부분이 있다
2. 새 시각 약속 두 가지: 역할 노드(보라 바탕), 휴대전화 참조 상자(점선, "↑ A 영역의 노드")
3. 흑백에서 노드 종류 차이가 약한 점. 색 외의 구분 표시를 더할지
4. Subnet 노드에 `subnet`·`public-subnet` 두 ID를 달았을 때 용어사전 연결의 우선순위
5. 제안 주소(`/missions/main-M05/story-map`, `/story-map/concepts`)와 노드 선택 시 이동 순서(장면 → 용어사전 → 지도 안 설명)
6. 노트북·휴대전화 전환 기준(Scene 04는 960px)

## Codex 웹 통합 참고

- 데이터 계약과 탐색 설계는 `story-map-integration-notes.md`에 있다. SVG 요소의 `data-node`·`data-rel`이 JSON ID와 같다.
- 통합 전에 `python3 -I _tools/check_data.py`와 `node _tools/check.cjs`를 다시 실행한다.
- 공개 route 계약 변경은 Owner Gate다. 기존 학습 가이드·기술 지도·개념 연결은 수정·통합하지 않는다(확정 정책).
