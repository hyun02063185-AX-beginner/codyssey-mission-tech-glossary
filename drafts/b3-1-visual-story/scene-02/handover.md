# Scene 02 인수인계

> 미션 스토리맵 · B3-1 · AWS로 다시 이해하는 네트워크. 갱신일 2026-10-21. 단계: **시안, Owner 시각 검토 대기.** 다음 단계(Scene 03)로 자동 진행하지 않는다.

## 시작 기준과 변경 범위

| 항목 | 내용 |
| --- | --- |
| 브랜치 | `draft/b3-1-visual-story-scene-02` |
| 시작 커밋 | `8da2e59`(Scene 01 검토 완료. 원격 `origin/draft/b3-1-visual-story-scene-01`과 같음) |
| `main`과의 관계 | 병합하지 않았다. 작업 시점의 `origin/main`은 `eb0bd4c`로, Scene 01 분기점(`10ab089`) 이후 웹툰 관련 변경(파일 60개)이 있다. Scene 02는 그 변경과 겹치는 파일이 없다 |
| 변경 범위 | `drafts/b3-1-visual-story/scene-02/` 새 폴더만. Scene 01 파일, 기존 학습가이드·보강 자료·승인 SVG, 용어사전·지식지도, 웹 코드는 바꾸지 않았다 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| `request-response-desktop.svg` | 노트북용. 1280×1272. Scene 01 노트북용과 장비 좌표가 같다 |
| `request-response-mobile.svg` | 휴대전화용. 360×2626 |
| `design-notes.md` | 재사용 판단, 단계 표시 방식 결정, Scene 01과의 시각 일관성 |
| `terminology-review.md` | 단계별 기술 검증, 기존 그림 2에 대한 수정 의견 |
| `concept-candidates.md` | 개념 19개, 관계 후보 20개(포함·선행·역할·흐름·대응·연관) |
| `visual-qa.md` | 자동 검사·렌더링·글자 크기 결과 |
| `preview/` | PNG 4장, 검토 페이지 `index.html` |
| `_tools/` | 생성기(Scene 01 생성기를 불러 씀), 검사기 |

## 확정 정책과 기존 문서의 차이(보고만 함)

| 기존 문서 | 내용 | 정책과의 차이 |
| --- | --- | --- |
| `drafts/b3-1-visual-story/scene-01/handover.md` | "이번 시안을 장면 0에 쓰면 보강 README 원고를 반드시 함께 수정" | 정책 5·6(기존 학습가이드는 수정하지 않고, 모든 미션의 스토리맵을 정비한 뒤 다시 검토)에 따라 **지금은 원고를 수정할 대상이 아니다.** Scene 01 handover의 "Owner 판단 대기 1"은 정책상 보류로 읽어야 한다 |
| `docs/mission-guides/b3-1-status.md` 끝 절 | 같은 취지("채택하면 장면 0 원고를 함께 고쳐야 한다") | 위와 같다 |
| `content/mission-guides/main-m05/supplement/existing-material-review.md` | 기존 개념 연결(`ConceptConnections.tsx`, `concept-connections-v1.json`) 수정 제안 | 정책 5(기존 개념지도 수정·통합 금지)에 따라 적용 대상이 아니다. 제안 문서로만 남아 있다 |
| Scene 01 문서들의 "Scene 01 / 시각 스토리" 표기 | 프로젝트명이 "미션 스토리맵"으로 확정됨 | 폴더명 `b3-1-visual-story`와 문서 제목은 그대로 두었다. 이름 변경 여부는 Owner가 판단한다 |

## 승인 대기

1. 단계 표시 방식: SVG 1개에 요청·응답을 함께 그리고 단계 번호를 다는 방식. 웹에서 상태를 나눠 보여 주는 기능은 후속 제안이다
2. 새 시각 약속: 응답 = 갈색 점선 + 네모 R 표식, 설명 단계 = 흰 원 숫자
3. 노트북용 왼쪽 열을 단계 목록으로 쓰고 범례를 아래로 옮긴 것
4. Scene 02 그림 안에 "라우터·방화벽·NAT는 한 장비일 수 있음" 각주를 다시 넣을지(지금은 Scene 01에만 있음)
5. 휴대전화용 길이(약 3.5화면)
6. 폴더명·문서 제목을 "미션 스토리맵"으로 바꿀지

## 다음 작업에 필요한 정보

- Scene 03 후보: 웹 서버의 DB 조회 흐름(웹 서버가 연결을 시작하는 방향, 허용 규칙 "조회용 포트만"). 그림 2의 6·7을 분리하는 내용이다. **Owner 승인과 GPT 독립 검토 결과에 따라 결정한다.**
- 개념지도는 정책 3·4에 따라 스토리맵에서 실제 설명한 관계로만 만든다. 후보는 `concept-candidates.md`에 있다.
- 다시 생성하려면 `python3 -I _tools/build.py`를 실행한 뒤 `_tools/check.cjs`로 검사한다(실행 방법은 파일 머리말). Scene 01을 바꾸면 Scene 02도 다시 생성하고 검사한다.
