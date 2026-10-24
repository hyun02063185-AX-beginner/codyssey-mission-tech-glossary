# B2-1 Story v3.2 — Owner 검토 안내

2026-10-24 · v3.1 독립 검토 결과와 Owner 피드백을 반영해 **Scene 01·02 교육 콘텐츠를 다시 설계**했다. **Owner·GPT 교육 내용 검토 대기**다. 이번 작업은 교육 콘텐츠 문서 개편이며 HTML·CSS·JavaScript·SVG·PNG 제작·수정, Scene 03~08 원고·화면 제작, React 통합, Push·병합·배포는 하지 않았다. 승인된 콘텐츠를 기준으로 디자인 작업을 별도로 진행한다.

## 기준

브랜치 `content/b2-1-story-map-foundation`, 시작 기준 `ad2b1fd13bd97cbaf939fbd49ab3aded9b357606`. 작업 시작 시 로컬 브랜치는 `b7207cd`(origin보다 2커밋 뒤, 작업 트리 clean)였고, 기준 커밋으로 fast-forward한 뒤 시작했다. 미커밋 변경은 없었다.

## 문서 상태

| 문서 | 상태 | 내용 |
| --- | --- | --- |
| [scenario-v3.md](scenario-v3.md) | **v3.2 개편** | 교육 목표·선수 조건·시간 추정, Scene 01·02 요약, 예시 사용 원칙, **Scene 03~08 제작 기준표**, 공식 목표 대응, 남은 Owner 결정 |
| [scene-01/storyboard.md](scene-01/storyboard.md) | **v3.2 개편** | 그림 4개의 표시 문구, 단계별 가리킬 곳·화면 한 문장·강사 대본, 확인 질문, 정리, 강사 노트, 선택형 심화 |
| [scene-02/storyboard.md](scene-02/storyboard.md) | **v3.2 개편** | 그림 7개, 13단계 대본, 설계 선택/Python 규칙 구분, ledger 실제 사례 대조 결과 |
| [content-scope.md](content-scope.md) | **v3.2 개편** | v3.1→v3.2 변경표, 정확성 경계, **완료 조건 점검표** |
| [screen-guidelines.md](screen-guidelines.md) | **v3.2 개편** | 한 화면 3요소, 그림 종류(흐름·구조·비교·관계) 규칙, 용어·문장·질문 작성 기준 |
| [prototypes/](prototypes/) | v3.1 그대로 | **v3.2 원고와 내용이 다르다.** 개편 전 비교 자료로만 사용 |
| [qa.md](qa.md), [qa/](qa/) | v3.1 그대로 | v3.1 시안의 브라우저 검사 기록. v3.2 원고를 검사한 결과가 아님 |

## 검토 순서 제안

1. [Scene 01 원고](scene-01/storyboard.md) — 핵심 구조도(F2)와 해석 주체 그림(F3), 단계 4~10의 대본
2. [Scene 02 원고](scene-02/storyboard.md) — 네 역할(F2)과 역할→파일(F4)의 연결, 실제 사례 단계(F7)
3. [시나리오 §5](scenario-v3.md#5-scene-0308-콘텐츠-설계-기준) — Scene 03~08 제작 기준
4. [시나리오 §9](scenario-v3.md#9-남은-owner-결정-사항) — Owner 결정 사항

## 미검증

실제 강의 시간(원고의 시간은 모두 추정), 입문자 학습 효과, 공식 미션 원문·최신 평가 기준 대조, Owner·GPT 교육 내용 검토. 새 디자인과 화면 QA는 콘텐츠 승인 후의 일이다.

이번에는 로컬 커밋까지만 수행했다. 아래 명령은 Owner 참고용이며 **실행하지 않았다**:

```text
git push origin content/b2-1-story-map-foundation
```

v3.1 작업 기록(시안 구조·브라우저 QA·단계 수)은 커밋 `ad2b1fd`의 README와 [qa.md](qa.md)에 남아 있다.
