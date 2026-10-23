# B2-1 Story v3.1 — Owner 검토 안내

2026-10-24 · Claude의 v3 독립 교육 검토에서 Owner가 전달한 보정 지시를 반영했다. **Scene 01·02 새 HTML 시안 검토 대기**다. 이번 수정은 v3 폴더에 한정하며 Scene 03~08 화면 제작·React 통합·Push·병합·배포는 하지 않았다.

## 기준과 수정 파일

브랜치 `content/b2-1-story-map-foundation`, 시작 HEAD **e622f469321cc82ccdf7afb4ea0ef96bfc02f06e**, 시작 작업 트리 clean을 확인했다. 기준 차이·기존 미커밋 변경은 없었다. 최종 로컬 SHA는 완료 응답과 `git log -1 --format=%H`로 확인한다.

수정한 교육/시안 파일:

- [scenario-v3.md](scenario-v3.md): 01·02 새 단계, 05 기본/심화 범위, 8장면 설계
- [content-scope.md](content-scope.md): v3→v3.1 이동·축소·보존표
- [screen-guidelines.md](screen-guidelines.md): 큰 그림·한 문장·마지막 확인/정리·반응형·조작
- [Scene 01 storyboard](scene-01/storyboard.md), [Scene 02 storyboard](scene-02/storyboard.md)
- [독립 HTML](prototypes/scene-01-02.html), [검사 스크립트](prototypes/check-preview.mjs)
- 이 README와 [qa.md](qa.md), `qa/browser-results.json`, 기존 대표 PNG12장 갱신
- 신규 `qa/scene-02-output-{1280,390,360}.png` 3장: 출력 변경 상황 증빙

총 변경 25파일(문서·코드·JSON10 + PNG15). 기존 `qa/v2-preview-results.json`은 **이전 v3 단계의 역사적 회귀 증빙**으로 그대로 보존했고 이번에 재실행한 결과로 세지 않는다.

## 화면 구조 전후와 단계 수

| 장면 | v3 이전 | v3.1 현재 | 총 단계 |
| --- | --- | --- | --- |
| 01 | A 네 블록4, B argparse3 | A GUI/CLI 비교2, B 네 블록4+마지막 argparse1 | 7→7 |
| 02 | A 네 역할4, B 특수 파일 포함5 | A 네 책임4+변경 상황2, B 모듈·패키지·import·시작 파일4 | 9→10 |

그림 옆의 긴 설명+고정 요점3개를 **큰 그림 아래 현재 개념 한 문장**으로 바꿨다. 확인/정리는 각 장면 전체 마지막인 01의7/7·02의10/10에서만 보인다. A/B 화면 전환을 이전/다음으로 자연스럽게 이어 간다. 기본 개념 질문과 새 상황 적용 질문을 하나씩 둔다.

Scene 01은 실행 도구 / 실행할 프로그램 / 할 일 / 조건으로 네 블록 이름을 통일했다. 전문 용어는 작은 라벨이며 argparse는 같은 명령의 마지막 해석 단계다. 가상 todo의 기존 지원 기능인 list의 limit 값만 바꾸므로 미지원 명령을 지원하는 것처럼 제시하지 않는다.

Scene 02는 실제 ledger 파일명과 모델·저장소·서비스·CLI를 연결한다. 저장 변경 상황은 저장소, 출력 변경 상황은 CLI를 강조한다. 책임 그림의 번호·화살표는 제거했다. 역할/파일 필수 일대일 관계가 아니라는 경계는 강사 노트에 둔다. __main__.py는 앞 장면 todo와 간단히 연결하고 __init__.py는 선택 보충에만 둔다.

Scene 05는 **Generator·yield와 한 번에/하나씩 처리**를 기본 목표로 보정했다. Iterable·Iterator는 기존 자료를 보존한 선택 심화다. Scene 03~08의 새 화면은 없다.

## 미리보기와 조작

[scene-01-02.html](prototypes/scene-01-02.html)을 브라우저에서 직접 연다. 서버/API/Python 실행 환경이 필요 없다. Windows 저장소 루트에서:

```powershell
Start-Process .\drafts\b2-1-story-map\v3\prototypes\scene-01-02.html
```

Scene 선택 → A/B 화면 선택 → 그림 블록/상황 선택 또는 이전/다음. Tab·Enter/Space로 버튼을 고른다. 강의 영역의 ←/→는 단계 이동, Home/End는 **장면 전체** 처음/마지막이다. 선택 보충·강사 노트는 펼쳐 읽는다. 답은 마지막 단계의 보충 안에서만 연다.

기존 `npm run b21:preview`는 계속 v2를 표시한다. 이번 HTML은 기존 Preview·React Manifest·운영 경로에 등록하지 않았다.

## QA 요약

Chrome 155 / Windows에서 1280×720, 390×800, 360×800으로 **17단계×3폭=51조합, 778 assertions PASS**. 단계·버튼·키보드·장면 끝 확인/정리·상황별 책임 선택·번호/화살표 부재·모바일 명령/파일명 줄바꿈·그림 재배치를 확인했다. 대표 PNG15장을 실제로 검토했다. 신규 브라우저 오류/경고0·외부 요청0이다.

기존 v2 무결성 PASS. 외부 사본에서 build PASS(9Scene·16SVG byte동일·155 fenced블록 검증 포함), 단위 테스트16파일/176 PASS. 초기 높이 초과·모바일 파일명 분리와 QA 사본의 불필요한 junction 아래 테스트 수집 실패는 해결 과정을 [qa.md](qa.md)에 구분해 기록했다. 기존 큰 chunk 경고는 남아 있다.

v3 밖 기존 추적 파일2545개는 시작 HEAD와 Git 콘텐츠 동일하다. v2 원고·데모·SVG·JSON·React 로더·검증기·Owner Preview·운영 서비스·package/lock 변경0. 기존 45노드·24관계·10비교카드를 보존했다.

## 남은 교육 설계 검토

1. Scene 01의 7단계·Scene 02의10단계가 실제 대면 수업에서 각3~5분에 적절한지
2. Scene 01 네 블록 보조 라벨의 밀도와 마지막 argparse 해석이 자연스러운지
3. 네 책임과 실제 파일 연결이 다른 교육생 구조에도 적용 가능한 설명인지
4. ledger 실제 사례에서 앞 장면 todo의 시작 파일로 돌아오는 연결이 명확한지
5. 금액 출력 상황에서 배운 책임을 날짜 출력 질문으로 옮겨 설명할 수 있는지
6. 강사 노트로 옮긴 정확성 경계와 선택 보충 분량, 공식 미션 원문/평가 기준 대조

Owner의 새 HTML 검토와 v3.1 재검토, 실물 프로젝터·휴대전화·스크린리더·시범 수업은 미완료다. 검토 후 Scene 03~08 제작을 결정한다.

이번에는 로컬 커밋까지만 수행한다. 아래 명령은 Owner 참고용으로 **실행하지 않았다**:

```text
git push origin content/b2-1-story-map-foundation
```

이전 v3 작업 기록(초기 HEAD 차이, 폴더 보관 이동, 줄바꿈 복원)은 시작 커밋 e622f46의 README/qa와 Git 이력에 남아 있다.
