# B2-1 Story v3 — 현재 상태 (v3.7 · 8개 장면, Scene 05·06 재구성)

2026-10-24 · 브랜치 `content/b2-1-story-map-foundation` · **Scene 05·06 교수 순서 재구성 Owner 검토 대기** · 독립 강의 미리보기의 콘텐츠 완성이며 서비스 배포가 아님

## 장면별 상태

| 장면 | 원고 | 강의 화면 ([teaching-preview](teaching-preview/index.html)) | 상태 |
| --- | --- | --- | --- |
| 01 명령 한 줄로 일을 부탁하기 | [scene-01/storyboard.md](scene-01/storyboard.md) (v3.2) | `#1-1`~`#1-13`, 13단계 (v3.3) | 화면 승인됨 (v3.3) |
| 02 역할을 나누고 파일로 묶기 | [scene-02/storyboard.md](scene-02/storyboard.md) (v3.2) | `#2-1`~`#2-17`, 17단계 (v3.3, 마지막 단계에 Scene 03 연결만 추가) | 화면 승인됨 (v3.3) |
| 03 기록 다루기: CRUD·검색·요약 | [scene-03/storyboard.md](scene-03/storyboard.md) (v3.4) | `#3-1`~`#3-12`, 12단계, 그림 4개 (v3.4) | 승인됨 (v3.4) |
| 04 기록 남기기: 메모리·파일·JSONL·CSV | [scene-04/storyboard.md](scene-04/storyboard.md) (v3.4) | `#4-1`~`#4-14`, 14단계, 그림 5개 (v3.4, 마지막 단계에 Scene 05 연결만 추가) | 승인됨 (v3.4) |
| 05 하나씩 꺼내기: Iterable·Iterator·Generator | [scene-05/storyboard.md](scene-05/storyboard.md) (**v3.7 재구성**) | `#5-repeat`~`#5-wrap`, 22단계, 그림 6개 (v3.6 주소는 자동 이동) | **Owner 검토 대기** |
| 06 함수를 감싸 꾸미기: Decorator | [scene-06/storyboard.md](scene-06/storyboard.md) (**v3.7 재구성**) | `#6-reassign`~`#6-wrap`, 18단계, 그림 6개 (v3.6 주소는 자동 이동) | **Owner 검토 대기** |
| 07 기대와 확인: Type Hint·변환·검증 | [scene-07/storyboard.md](scene-07/storyboard.md) (v3.6) | `#7-1`~`#7-15`, 15단계, 그림 5개 | 승인됨 (v3.6) |
| 08 한눈에 연결하기: 핵심 개념지도 | [scene-08/storyboard.md](scene-08/storyboard.md) (v3.6, **v3.7 보정**: 영역 05·‘종류’ 예 R23·R41·질문 1개) | `#8-1`~`#8-17`, 17단계 | v3.6 승인, v3.7 보정 검토 대기 |
| **합계** | 8개 원고 | **128단계** | |

Scene 03부터는 **용돈 기입장 학습용 가상 기록**(4개, 합계 14,500원)을 예시로 쓴다. v3.2에서 권장한 안을 적용한 것이며 Owner 확인 대상이다([시나리오 §4](scenario-v3.md#4-예시-사용-원칙)).

## 문서

| 문서 | 내용 |
| --- | --- |
| [scenario-v3.md](scenario-v3.md) | 교육 목표·시간 추정, 장면 요약, 예시 원칙, Scene 03~08 제작 기준, 공식 목표 대응, Owner 결정 |
| [content-scope.md](content-scope.md) | 버전별 범위 변경, 정확성 경계, 완료 조건 점검, **남은 작업** |
| [screen-guidelines.md](screen-guidelines.md) | 대면 설명용 콘텐츠 기준 |
| [teaching-preview/](teaching-preview/) | Scene 01~08 강의 화면(128단계), [README](teaching-preview/README.md)(여는 법·조작), [qa.md](teaching-preview/qa.md) |
| [design-exploration/](design-exploration/) | v3.2 디자인 A/B 탐색 (비교 자료) |
| [prototypes/](prototypes/), [qa.md](qa.md), [qa/](qa/) | v3.1 시안과 그 검사 기록 (비교 자료, 현재 원고와 다름) |

## 버전 기록

| 버전 | 커밋 | 내용 |
| --- | --- | --- |
| v3.1 | `ad2b1fd` | Scene 01·02 HTML 시안 |
| v3.2 | `47cbde2` | Scene 01·02 교육 원고 재구성, Scene 03~08 제작 기준 |
| v3.2 디자인 탐색 | `e358f17` | 디자인 A/B 시안 |
| v3.3 | `18a0fcb` | Scene 01·02 전체 강의 화면 |
| v3.4 | `dd03189` | Scene 03·04 원고·강의 화면, Scene 01·02 회귀 검사 |
| v3.5 | `6d1ce8f` | Scene 05·06 원고·강의 화면, Scene 01~04 회귀 검사, ledger 소스 자동 대조 |
| v3.6 | `9e884d9` | Scene 07·08 원고·강의 화면, 개념지도 원본 대응표·대조, 복습 왕복, Scene 01~06 회귀 검사 — **8개 장면 완성** |
| v3.7 | 이 문서를 포함한 커밋 | Scene 05·06 교수 순서 재구성(Iterable→Iterator→Generator, 재대입→함수 전달·반환→감싸기→Decorator), 단계 ID 주소와 v3.6 주소 호환, Scene 08 관계 보강 |

## 미검증

Scene 05·06 재구성의 Owner 교수설계·디자인 확인, 실제 강의 시간(원고 시간은 추정), 입문자 학습 효과, 공식 미션 원문·최신 평가 기준 대조, Windows 글꼴·실물 프로젝터.

로컬 커밋까지만 수행한다. Push는 Owner가 한다:

```text
git push origin content/b2-1-story-map-foundation
```
