# B2-1 Story v3 — Owner 검토 안내

2026-10-23 · **시나리오 초안 + Scene 01·02 대표 시안 제작 완료**. 독립 콘텐츠 검토와 Owner 확정은 대기 중이다. 나머지 장면 제작·React 통합·Push·병합·배포는 수행하지 않았다.

## 시작 상태와 커밋

- 저장소: `hyun02063185-AX-beginner/codyssey-mission-tech-glossary`
- 브랜치: `content/b2-1-story-map-foundation`
- 최초 발견 HEAD: `9396e293e7521069136da5abf200106e02d55499`, tracked/untracked 변경 없음.
- 지시서 기준보다 10커밋 뒤인 조상임을 확인해 차이를 보고하고 fast-forward. 실제 v3 제작 기준은 **`b7207cd90414fb50180026e17d8cd619ac14ce9f`**다. reset·이력 재작성·기존 변경 덮어쓰기 없음.
- 최종 로컬 커밋의 정확한 SHA는 작업 완료 응답 및 `git log -1 --format=%H`로 확인한다. 이 문서 자체가 해당 커밋에 포함되므로 자기 자신의 SHA를 본문에 고정하지 않는다.

## 새 파일

필수 산출물 6개:

1. [scenario-v3.md](scenario-v3.md) — 교육 목표, 8장면, 공식 목표 대응
2. [content-scope.md](content-scope.md) — 유지·축소·제외·심화 이동
3. [screen-guidelines.md](screen-guidelines.md) — PC/모바일·조작·강사 보조 기준
4. [Scene 01 storyboard](scene-01/storyboard.md)
5. [Scene 02 storyboard](scene-02/storyboard.md)
6. [독립 HTML](prototypes/scene-01-02.html)

추가 검토 자료: 이 `README.md`, [qa.md](qa.md), [브라우저 검사 스크립트](prototypes/check-preview.mjs), `qa/browser-results.json`, `qa/v2-preview-results.json`, `qa/scene-0{1,2}-{a,b}-{1280,390,360}.png` 12장. 새 파일은 모두 `v3/` 안에 있다.

## 8장면 개요와 범위 변경

| 장면 | 개념 중심 내용 |
| --- | --- |
| 01 | CLI·GUI, 명령 네 블록과 argparse의 역할 |
| 02 | 네 역할, 모듈·패키지·import, 실행 진입점·초기화 파일 |
| 03 | CRUD, 검색과 요약의 목적·차이 |
| 04 | 메모리와 파일, JSON·JSONL·CSV |
| 05 | Iterable·Iterator·Generator·yield, 소비 방식 |
| 06 | Decorator와 공통 처리의 목적·범위 |
| 07 | Type Hint와 실제 값 검증의 차이 |
| 08 | 7개 대표 개념 영역의 관계 복습 |

큰 명령 분해·핵심 개념·공식 목표 대응은 유지했다. API 목록·세밀한 실행·import 추적·긴 구현 설명은 축소하거나 심화로 이동했다. 기존 03-A 함수·클래스·객체·self·`__init__()` 문법 강의와 필수 코드 리뷰는 v3 기본 학습에서 제외했다. 클래스 구조화 공식 요구는 그대로 추적하며 실제 구현·검증을 별도로 확인한다. 기존 45노드·24관계·10비교카드와 v2 자료는 모두 보존했다.

## 미리보기 실행

`prototypes/scene-01-02.html`을 Chrome 등 브라우저에서 직접 연다. 외부 서버·API·npm·Python 실행 환경이 필요 없다. Windows에서는 저장소 루트에서:

```powershell
Start-Process .\drafts\b2-1-story-map\v3\prototypes\scene-01-02.html
```

장면 선택 → A/B 화면 선택 → 그림 블록 또는 이전/다음 단계. 키보드는 Tab·Enter/Space, 강의 영역의 ←/→·Home/End를 사용한다. 답·심화와 강사 노트는 펼쳐 읽는다.

기존 `npm run b21:preview`는 **v2**이고 주소는 `http://127.0.0.1:4179/`다. v3 HTML은 이 경로와 React Manifest에 연결하지 않았다. 회귀 확인에 사용한 서버는 종료했다.

## 검증 요약

Chrome에서 v3 4화면×3해상도(1280×720, 390×800, 360×800) 12조합, **366 assertions PASS**. 단계 선택·버튼·키보드·펼침·링크·PC 높이·가로 넘침을 검사했다. 스크린샷의 실제 그림·글자 재배치를 확인했다. 신규 시안의 브라우저 오류·경고·외부 요청은 0이다.

기존 build PASS, 단위 테스트 **16파일/176검사 PASS**, v2 무결성 PASS, v2 실제 HTTP Preview **9장면×3폭 27조합 로딩 PASS**. v2의 기존 favicon 404 한 건은 별도 기록하고 보호 파일을 수정하지 않았다. 운영 빌드의 기존 큰 chunk 경고는 남아 있다. 상세한 실패·해결 과정과 미검증 범위는 [qa.md](qa.md)에 기록했다.

기준 커밋의 기존 추적 파일 2545개와 비교해 Git 콘텐츠 변경은 0개다. 기존 v2·SVG·검증기·JSON·React·Manifest·Owner Preview·운영 경로·package/lock은 변경하지 않았다. Windows 체크아웃에서 CRLF가 된 6파일은 **기준 커밋과 동일한 LF 바이트로 복원**했으며 hash 승인 갱신이나 Git 콘텐츠 변경은 없다.

## 작업 폴더 정리

이전 정책·콘텐츠 검토 worktree 5개를 아래 보관 폴더로 `git worktree move`했다. 브랜치·커밋·ignored 파일까지 보존하고 등록 경로도 함께 갱신했다.

`C:\Users\hyun0\glossary-work-archive\2026-10-23\`

- `codyssey-mission-tech-glossary-learning-policy`
- `codyssey-mission-tech-glossary-story-content-baseline`
- `codyssey-mission-tech-glossary-story-content-reference`
- `codyssey-mission-tech-glossary-story-content-web`
- `codyssey-mission-tech-glossary-story-qa`

기본 저장소와 현재 B2-1 폴더는 원래 위치다. `story-integration`은 Windows Permission denied로 이동하지 못해 원래 위치를 유지했다. 다른 프로세스를 강제 종료하지 않았다. B2-1 승인 패키지·QA 아카이브와 다른 프로젝트는 보존했다. 보관 폴더의 `README.txt`·`worktree-state.txt`에 이동·복원 방법이 있다. 삭제한 폴더는 없다.

## Owner 검토 항목

1. 3~5분 분량과 8장면 질문이 입문자 대면 수업에 맞는지
2. Scene 01 네 블록의 크기·설명량, Scene 02 역할/파일 두 화면의 밀도
3. 함수·클래스 문법을 선수 학습으로 돌린 범위와 공식 클래스 요구의 별도 확인 방식
4. v3 7영역 묶음과 기존 45/24/10 심화 탐색 유지 방식
5. 공식 미션 원문·최신 평가 기준 대조, 실물 프로젝터·모바일·시범 수업 확인

Owner 검토 후 다음 제작·통합 범위를 결정한다. 다음 명령은 Owner가 나중에 사용할 참고용이며 이번에는 실행하지 않았다:

```text
git push origin content/b2-1-story-map-foundation
```
