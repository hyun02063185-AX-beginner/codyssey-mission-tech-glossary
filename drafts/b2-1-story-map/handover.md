# B2-1 Python 학습 스토리맵 — 인수인계

> **최신 (2026-10-24, v3.8):** 현재 기준은 v3 8장면 강의 원고와 미리보기([v3/README.md](v3/README.md))다. v3.8에서 최종 교육 QA([v3/qa-review-v3.8.md](v3/qa-review-v3.8.md))와 React 통합 설계([v3/react-integration-plan.md](v3/react-integration-plan.md))를 작성했다. 판정은 `READY_FOR_REACT_PREVIEW`(조건부)다. 비공개 작업 U1~U3은 바로 시작할 수 있고, 공개 경로 전환은 Owner 결정 D1~D8 뒤에 한다. 이 아래의 Foundation·Sprint 기록은 v2·9단위 기준의 이전 단계다. 그 기준인 [integration-contract.md](integration-contract.md)는 덮어쓰지 않았고, v3와 다른 점은 통합 설계 §9에 정리했다. 이번에 코드·원고·화면은 바꾸지 않았다.

> 갱신일 2026-10-23 · 단계: **`B21_REACT_CONTENT_FOUNDATION_PRIVATE_READY`**
> 이번 시작 HEAD는 **`66cfb7d7c499a64bc27240e6cb492592b3293649`**다. Sprint02에서9개 학습 단위의 비공개 Markdown/Manifest/React 렌더러·무결성 검증을 구현했다. 기존 공개 `/missions/main-M03/story`, 진입 카드, B31, 가이드, 원고·시각자료·운영 데이터는 보존했다. Scene08 탐색형 UX 승인과 관계0추천 보완은 그대로이며 실제 지도 연결은 후속 단계다. 최종 콘텐츠·시각·경로·공개 승인은 완료하지 않았다. 아래 이전 단계 기록과 최신 결과를 구분한다.

## Owner 로컬 Preview (2026-10-23, 최신)

시작 `99a27f3c0ae66d7d3d45bb324f2380cc911ff282`. Owner 화면 검토용 독립 환경을 추가했다. 저장소에서 `npm run b21:preview` → **http://127.0.0.1:4179/**, 종료는 실행 터미널의 **Control+C**다. 포트 충돌 시 종료1로 실패하며 자동 외부 바인딩/주소/포트 전환을 하지 않는다. 검증 후 서버를 종료했으므로 Owner가 직접 실행한다.

9장면 바로 열기와1280/390/360px viewport 도구가 실제 `B21StoryFoundation`·기본 Markdown/SVG 로더를 표시한다. 장면별 상호작용·실행 체험/Scene08 개념지도는 준비 중으로 명시한다. 원고·시각자료·관계·기존React화면은 변경하지 않았다. iframe은 실제React의 검토 viewport이며 기존 HTML 시안을 삽입하지 않는다.

신규4파일은 `scripts/b21_preview.mjs`, `scripts/b21-preview/{index.html,main.tsx,preview.css}`다. 기존 수정3파일은 `package.json`과 준비점검/인수인계뿐이다. Preview는 독립 Vite root이며 기존 App/공개URL/운영빌드/Pages에 등록하지 않았다. 운영 산출물319개가 Sprint02 검증 사본과 byte동일하다.

build PASS, test176/0/0, 기존컴포넌트QA63/0/0, 실제HTTP Preview9장면×3폭27/0/0, 별도 동선/바인딩/포트충돌/종료1그룹PASS, Preview strict TypeScript검사PASS. 최종 브라우저 오류/경고0. 기존서비스13검사 근거는 동일산출물로 재사용했다. 상세 실행/검사/미검증은 [준비점검의 최신 Preview 절](integration-readiness.md)에 기록했다. 이 결과는 Owner의 콘텐츠·시각·공개 승인을 대체하지 않는다. 로컬 커밋만 수행하며 Push·병합·배포는 Owner 범위다.

## Integration Sprint 02 — React Content Foundation (2026-10-23, 최신)

브랜치 `content/b2-1-story-map-foundation`, 시작 HEAD `66cfb7d7c499a64bc27240e6cb492592b3293649`, 작업 트리 깨끗함·fetch후 원격0/0을 확인했다. 원고/그림의 기준도 이 SHA에 고정하고25개 원본의SHA-256을 기록했다. 이 고정은 최종 게시 승인이 아니다.

- **완료:** 명시적9단위(03-A/03-B별도)·138개 안정section ID·본문/강사/질문/출처/활동·이전/다음·자산/상태/출처를 가진 비동기 전체Manifest. 본문은 기존 Markdown의 AST와 원문 위치를 유지한다. 표 셀의 `int | str` 표시 회귀를 재현하고 GFM 문맥 보존으로 해결했다. 원고를 TS문자열로 복제하지 않았다.
- **렌더러:** 제목/질문/진행, 원문 본문과 활동, 코드/명령/데이터/실행 출력/텍스트 구분, 원문 복사·실패 선택, 강사 안내접기·이해 질문·출처·컴포넌트내 장면 이동. 그림은 실제 슬롯 기준으로 선택하고 원본 최소폭·비율을 유지한다. `<img>` 독립문서로 SVG ID/style을 격리하며 전체 원본·설명·다운로드·확대와 Tab/Escape/초점복귀를 제공한다.
- **후속 지점:** Scene08은 원고와 활동 및 candidate 참조/typed slot만 있다. 원본 SVG16개는 분할하지 않았고 segment/fixture 타입만 준비했다. 지도 어댑터·45/24/10 탐색·I1~In·실제용어사전 왕복/history·공개라우트 연결은 미구현이다. Python 실행·사용자파일 업로드는 추가하지 않았다.
- **의존성:** 이미 잠긴 `unified11.0.5`, `remark-parse11.0.0`, `@types/mdast4.0.4`를 직접 사용하므로 명시 선언했다. 기존 해석 패키지 버전 변경0개. F10 업데이트·배포 설정 변경 없음.
- **보호:** 시작 커밋의 기존파일 중 수정 허용된 package/보고서4개를 제외한2519개 Git blob hash가 동일하다. 기존 App/진입카드/B31/가이드/원고·데모·SVG·PNG·HTML/candidate/canonical/운영JSON/확장/배포설정은 변경하지 않았다.
- **파일:** 신규 `src/b21Story/`15개, 검증script3개. 기존 수정은 `package.json`/lock 및 준비점검/이handover4개다. 구체 파일/데이터 계약/실행 명령은 [준비 점검 최신 절](integration-readiness.md)에 모았다.

| 이번 검사 | PASS | FAIL | SKIP | 경계 |
| --- | ---: | ---: | ---: | --- |
| `npm run build` | 1그룹 | 0 | 0 | tsc/기존main번들·데이터+원고/자산검증+비공개Vite빌드 |
| 비공개Vite 빌드(위에포함) | 1그룹 | 0 | 0 | 실제9Scene chunk·16SVG byte동일·155 fenced블록·전Scene React SSR |
| `npm test` | 176 | 0 | 0 | 16파일, 기존132+콘텐츠23+렌더러21 |
| 비공개 Chrome component | 63assert | 0 | 0 | about:blank·fixture 로더·모의clipboard, 앱route/HTTP요청 없음 |
| 기존웹 Playwright | 13 | 0 | 0 | 기존B21체험6/B31기능4/미션진입3. 전체폭matrix 아님 |
| 원고/자산/영역/참조/ID 실패주입 | 8검출 | 0미검출 | 0 | 별도사본에서 정상종료실패를검출하고 원복후 정상검증PASS |

`npm run b21:validate`는 원고·자산 hash와 구조를 검사하며 자동갱신하지 않는다. `npm run build`는 이 검증과 비공개 라이브러리 검증을 포함한다. 후자는 임시 출력만 만들고 정리하며 기존 main배포물에 새컴포넌트를 등록하지 않는다. 명시적 Manifest갱신은 `node scripts/b21_story_integrity.mjs --write --source-revision=<승인원고40자리SHA>`이며25파일을 해당Git revision과 직접 대조한다.

비공개 브라우저는 기존Chrome으로9Scene 제목/활동, Scene01의360/390/1000/1280px 실제그림영역, 원문복사/실패선택, native details, 확대·Tab순환·Escape·초점/스크롤잠금 복원,200%텍스트를 확인했다. 모의clipboard와 검증된 사전로딩fixture의 컴포넌트 검사다. 실제OS clipboard권한·배포HTTP에서의 새로더/서비스왕복·전체테마/글꼴·실물모바일·스크린리더·최종시각은 미검증이다. 이전 Python 검증 기준선은 보호파일이 같으므로 Sprint01 결과를 재사용한다.

로컬 코드 커밋은 `8fc69b5`(원고/Manifest/AST/로더), `9c5cbff`(비공개렌더러/검증)로 분리했다. 보고 문서는 별도 커밋으로 남긴다. Push·병합·배포는 수행하지 않는다.

**다음 단계 진입 가능:** 비공개 콘텐츠 기반은 완료했다. 다음 지시에서 Scene별 상호작용·그림분할·B21지도어댑터/탐색·실제사전 왕복의 범위를 확정한다. 새 공개URL과 기존story전환, 최종게시 원고·시각·배포 승인은 별도Owner Gate다. F03/F05/F06/F08/F09/F10을 이번 결과로 모두 해결했다고 보지 않는다.

## Integration Sprint 01 — QA Baseline Recovery (2026-10-23, 이전 단계)

시작 브랜치 `content/b2-1-story-map-foundation`, HEAD `56d668b1e69c86b01c0914b5dd9a0fba76055c44`, 작업 트리 깨끗함을 확인했다. 검사는 기준 커밋의 외부 임시 사본에서 실행했다. 환경은 macOS·CPython3.12.13, ledger 소스 `d14e812ca1e1caaa88fd23fae7029d95d560c2d9`다. Python3.10/3.11/3.13 이상·Windows/Linux 실제 실행은 미검증이다.

- **F01 해결:** 실행 파일 절대 경로 접두사만 정규화한다. 오류 본문·종료 코드·기존 원고/SVG 검사를 유지했다. 수정 전28 PASS/1 FAIL → 수정 후43 PASS/0 FAIL. 합성 경로·오류 변경 거부 등14개 회귀를 검증기에 추가했다. 외부 사본의 본문/종료코드/코드/SVG 위반4건도 모두 실패로 검출했다. [상세 QA](scene-02/visual-qa.md).
- **F02 해결:** 추적 코드를 임시 `.py`에 쓰고 실제 파일의 줄 번호로 실행한다. 자식 종료 코드/stdout/stderr·마커·JSON/타입 실패를 기록하고 나머지 독립 검사를 계속한다. 수정 전61 PASS 뒤 IndexError 중단 → 수정 후121 PASS/0 FAIL, 메모리·소비5방식·ledger·정리까지 완료했다. 프로토콜 음성 회귀10건을 검증기에 추가했고, 별도 변형10건도 모두 검출했다. 첫 거래가 정상인 뒤의 순서 변경까지 전체 이벤트 검사로 잡았다. [상세 QA](scene-05/visual-qa.md).

### 장면별 실제 실행 결과

PASS/FAIL은 검증기의 출력 행 수다. SKIP은 명시적 SKIP행과 실행 환경 때문에 수행하지 않은 분기를 구분해 기록한다. Scene04의 Windows 전용1분기는 원래 검증기가 INFO로만 출력하므로 아래 SKIP에 별도로 포함했다. Scene08은 per-check 행을 내지 않는 JSON형이므로 **전체 검증1그룹**으로 표기하고 내부14개 오류 주입은 따로 기재한다. 의도한 실패 주입 수를 정상 콘텐츠 FAIL에 합산하지 않는다.

| 단위·검사 | PASS | FAIL | SKIP | 근거·종료 |
| --- | ---: | ---: | ---: | --- |
| 01 원고 내 시연 코드 | 8 | 0 | 0 | 강사용 두 Python블록 그대로 추출, 임시todo로 옵션3형태/기본값/오류/두 도움말 실행, 종료0. 별도 verify_demo.py는 없음 |
| 02 verify_demo.py | 43 | 0 | 0 | 종료0, 새 회귀14건 포함 |
| 03-A verify_demo.py | 33 | 0 | 0 | 종료0 |
| 03-B verify_demo.py | 79 | 0 | 0 | 종료0 |
| 04 verify_demo.py | 136 | 0 | 1 | 종료0, ledger 포함. Windows전용 CSV개행 분기 미실행(INFO); SKIP행 자체는0 |
| 05 verify_demo.py | 121 | 0 | 0 | 종료0, 프로토콜 음성 회귀10건·ledger 포함 |
| 06 verify_demo.py | 91 | 0 | 0 | 종료0, ledger 포함 |
| 07 verify_demo.py | 215 | 0 | 1 | 종료0, OLD_PYTHON 미지정:3.10미만 선택 검사1그룹(예제2개) 생략 |
| 07 verify_ledger.py | 44 | 0 | 0 | 종료0, 실제ledger 원고 기준SHA 확인 |
| 08 verify_candidate.py | 1그룹 | 0 | 0 | 종료0,45노드/24관계/10비교·14/14오류 주입 검출·실제 예제/ledger 정적 출처 확인 |
| 별도 사본 실패 주입02/05 | 14검출 | 0미검출 | 0 | 각각 의도한FAIL·종료1, IndexError 중단 없음. 위 정상 결과와 별도 |

Scene01은 강사용 두 블록을 임시 `todo/{__init__,__main__}.py`로 옮겨 실행했다. 검사8건은 추출구조, `--limit 5`, `-n 5`, `--limit=5`, 기본값10, 잘못된int의 메시지/종료2, 프로그램도움말, Python도움말이다. 경로는 `sys.argv[0]`만 환경값으로 받고 나머지 argv·Namespace·출력·종료 코드를 대조했다. 없는 검증 파일을 PASS 처리하지 않았다.

### F10 재확인 — 패키지 변경 없음

Node24.22.0/npm11.19.1로 잠금파일이 같은 사본에서 `npm audit --json`과 `npm audit --omit=dev --json`을 실행했다. 전체는 **5건(moderate1/high2/critical2)**, 개발 의존성을 제외하면 **0건**이었다. lock의 해당5개는 모두 dev 표시다.

| 잠금 버전 | 심각도 | 노출 판단·후속 범위 |
| --- | --- | --- |
| vite6.4.3 | high | 개발 서버의 파일 접근/미들웨어·에디터 실행 경로 평가 필요 |
| vitest3.2.7 / @vitest/mocker3.2.7 | critical / moderate | 테스트 서버·mock 파일 접근/등록 경로 평가 필요 |
| tinypool1.1.1 | critical | 테스트 worker 옵션의 프로토타입 오염→실행 경로 평가 필요 |
| source-map-js1.2.1 | high | 개발 도구가 처리하는 source map의 DoS 경로 평가 필요 |

근거는 audit가 반환한 [Vite 파일 접근](https://github.com/advisories/GHSA-rq7h-c2jc-7f22), [Vitest 파일 접근](https://github.com/advisories/GHSA-82fw-gwwq-j7x9), [mock 등록](https://github.com/advisories/GHSA-qxg6-89mg-rqv8), [Tinypool](https://github.com/advisories/GHSA-5gmw-xhrv-c9v3), [source-map-js](https://github.com/advisories/GHSA-68fv-2mgg-jv7q) 항목이다. 이는 npm audit 재확인 결과이며 외부 공격 재현 검사는 하지 않았다.

공개 정적 Pages는 Vite개발 서버·Vitest/mock서버·Nodeworker를 서비스하지 않으므로 이 개발 실행 경로가 그대로 공개 엔드포인트가 된다고 볼 수 없다. **production audit0은 공개 산출물 전체의 안전성 증명이 아니다.** 개발/CI 도구가 침해되면 생성 산출물에 영향을 줄 수 있고, 배포 파일·source map·도구 접근 조건은 별도 평가가 필요하다. 후속 의존성 전용 커밋에서 패치 범위·major 변경 영향을 검토하고 build/unit/browser/확장 회귀를 수행한다. 이번에는 install·audit fix·패키지/lock 업데이트·앱 빌드를 하지 않았다.

### 보호 확인·발견 사항·다음 단계 판정

기존 원고·데모/데이터·SVG/PNG/HTML·candidate·React·B31·canonical·운영지도·배포 설정은 변경하지 않았다. 오류 주입은 사본에서만 수행하고 정상 파일로 원복했다. 정상 검사를 통해 새 콘텐츠 오류는 발견하지 않았다. 허용6파일을 제외한 추적파일2517개의 Git blob hash가 시작 커밋과 같음을 확인했다. 추가로 기존 F02의 첫 거래/건수 대조만으로는 이후 순서 변경을 놓칠 수 있음을 확인해 전체 순서 대조를 강화했다.

**진입 판정: F01/F02 검증기 복구 단계 완료. 다음 비공개 콘텐츠 loader/manifest·B21 adapter 구현 단계에 진입 가능.** 현재 검증 범위는 CPython3.12이며 Windows CSV개행1분기·선택적 구버전1그룹(예제2개), 다른OS/Python 실검증은 남는다. F03 서비스 hash링크, F05/F06 상태문구/출처, F08 그림분할, F10 릴리스 판단과 콘텐츠/시각·공개URL·최종공개 Owner Gate는 그대로 유지한다. 이번 결과를 웹 통합·공개 승인으로 확대하지 않는다.

## 통합 준비 결과와 Owner 결정 (2026-10-23, 이전 단계)

- **승인된 표현 방식:** Scene 08은 현재 탐색형 UX를 유지한다. PC는 영역 선택 → 관련 관계 → 상세 패널 → 비교 카드, 모바일은 영역/관계/상세/비교 전환이다. 전체 노드를 연결선으로 배치하는 그래프 중심형으로 재설계하지 않는다. `358927d`의 빈 상태·같은 영역 추천·기존 선택 이력/뒤로 가기를 보존하고 대면 강사 안내와 자유 탐색을 모두 지원한다.
- **승인 경계:** 이 결정은 지도 표현 방식 승인이다. 전체 9단위(03-A/03-B 분리)의 최종 시각 승인, 게시 원고 커밋, 새 공개 경로·진입 문구 확정, 최종 공개 승인은 별도 대기다. 기존 Scene 07 독립 콘텐츠 PASS 기록은 유지한다.
- **준비 산출물:** [integration-readiness.md](integration-readiness.md)에 전9단위 자산·활동·상호작용·지도/사전 대응·QA와 발견 사항을 정리했다. [integration-contract.md](integration-contract.md)에 원고 기준 렌더링·긴 SVG 분할·전용 어댑터·왕복/이력·QA·독립 커밋 계획을 정의했다. 신규 서비스 파일과 URL은 제안이며 미구현이다.
- **기준선 결과:** 기준 커밋의 외부 임시 사본에서 build PASS, Vitest14파일/132검사 PASS, 기존 웹 Playwright13검사와 기존 B2-1 가이드360/390 등3검사 PASS, 확장 빌드 PASS. Scene 08 기존 로컬 모형3755검사는 재사용한 근거다. 신규9단위 웹 QA 완료로 해석하지 않는다.
- **남은 문제:** Scene 02 검증기의 Python 실행 파일 접두사 정규화 실패, Scene 05 검증기의 `python -c`/inspect 소스 추적 실패를 확인했다. 기존 웹 raw hash 링크 결함도 재현했다. 원본은 수정하지 않고 근거·영향을 준비 점검 F01~F11에 기록했다. 원고 상태 문구·출처 anchor·그림 분할, 기존 의존성 audit5건의 릴리스 판단도 후속 범위다.
- **보호:** 이번 추적 변경은 두 준비 문서와 이 파일뿐이다. src·운영 데이터·canonical·B3-1·기존 가이드·Scene 원고/SVG/미리보기·배포 설정은 보존했다.

## 콘텐츠 제작·초기 준비 당시 기준 (이전 기록)

| 항목 | 내용 |
| --- | --- |
| 저장소·브랜치 | `codyssey-mission-tech-glossary` · `content/b2-1-story-map-foundation`. 초기 준비 시작 HEAD `358927d3414e231b81bf975bbf38bc1879cffd7f`·작업 트리 깨끗함·fetch 후 원격과0/0 확인. 아래 제작 당시 기준은 역사 기록 |
| 분기 기준 | 작업 시점 `origin/main` `287de96`(B3-1 최종 병합 PR #19) |
| 구현 사례 | `m03-pocket-money-ledger` `d14e812`(작업일 `origin/main`과 같음) |
| 확인한 기준 문서 | `AGENTS.md`, `docs/mission-guides/learning-operation-policy.md`, `docs/mission-guides/workflow.md`, `content/mission-guides/main-m03/{scenario-v1.1.md, README.md, instructor-notes.md, chapters/01-cli-execution.md}`, `src/B21LearningStoryView.tsx`, `src/B21LearningStoryEntry.tsx`, `src/B31StoryMap.tsx`, `data/mission-story-maps/main-m05/concept-map.json`, M03 `docs/m03-architecture-design.md`·`ledger/*.py` |
| 공식 문서 | Python `using/cmdline`(`-m`), `library/__main__`, `library/runpy`, `reference/import`(§5.2), `tutorial/modules`(§6.1·§6.4), `library/argparse`, `howto/functional`, `library/typing`, `library/csv`, `library/json`, jsonlines.org — 2026-10-22 원문 확인. Scene 02에서 `reference/simple_stmts`(import 문), `reference/compound_stmts`(§8.7 함수 정의), `library/sys_path_init` 추가 확인 |

## 산출물

| 파일 | 내용 |
| --- | --- |
| [`scenario-v2.md`](scenario-v2.md) | 교육 목표, 학습자 수준, 8장면 구성(질문·핵심 개념·다루지 않는 것·내 코드에서 찾아보기), 공식 목표 5개·Owner 지정 입문 개념 대응표, 공통 교수법(대면 강의, 코드 읽기 두 경로, 근거 표기, 시각 약속, 오해 방지 15개), 실행 확인 결과, 기존 자료와의 관계·구버전 문제·재사용 평가 |
| [`concept-map-outline.md`](concept-map-outline.md) | 관계 유형 6종, 영역별 후보 약 90개, R01~R49·C01~C35, 용어사전 연결 주의·장면별 탐색 후보. 최종 운영 JSON 없음. Scene 08 작업 폴더에만 검토용 부분 후보 JSON 작성 |
| [`scene-08/script.md`](scene-08/script.md) | A~H 학습자 원고, 강사 세 경로, 필수 비교 8개, 왕복 시나리오, 자기 코드·AI 확인/수정 양식, 강사용 안내·이해 확인·출처 |
| [`scene-08/design-notes.md`](scene-08/design-notes.md) | 7영역 첫 화면, PC/모바일 분리, 상세 6항목, 관계 유형·비교, 안내/자유 모드, 복귀 상태 계약·실패 대안, 실제 서비스 미구현 명세 |
| [`scene-08/concept-map-preview.html`](scene-08/concept-map-preview.html) | 로컬 탐색 모형. 노드·관계·비교·경로·샘플 왕복만 구현. 실제 라우트·서비스 페이지·browser history 연결 없음 |
| [`scene-08/candidate-map.json`](scene-08/candidate-map.json) | 검토용 45노드·24관계·10비교, 강사 경로 별도 저장. 기존 R/C 번호 재사용. 운영 스키마·데이터가 아님 |
| [`scene-08/visual-qa.md`](scene-08/visual-qa.md) | 후보·소스·모형 검사, 화면 폭·글꼴·상태 복귀, PNG 시각 확인, 보호 범위, 자체/독립/Owner 판정 구분 |
| `scene-08/_tools/` · `scene-08/preview/` | HTML 생성기·후보 검증·모형 브라우저 검사, PC 1280/1000·모바일 390/360 PNG와 검사 결과 |
| [`scene-01/script.md`](scene-01/script.md) | 학습자 원고 10절, 강사용 안내(진행 순서·시연 코드·오해 교정·수준 조절), 이해 확인 질문 6개, 근거와 출처 표 |
| [`scene-01/design-notes.md`](scene-01/design-notes.md) | 네 구역(A 분해·B 처리 순서·C 규칙/해석·D 비교) 구조, 색 없이도 되는 의미 구분, 노트북/휴대전화 적용, 인터랙션 명세 I1~I8과 `data-*` 속성 |
| `scene-01/cli-command-desktop.svg` · `cli-command-mobile.svg` | 노트북용 1280×1672, 휴대전화용 360×3292 |
| [`scene-01/visual-qa.md`](scene-01/visual-qa.md) | 자동 검사(두 글꼴 환경), 표시 크기, 눈으로 본 결과, 원고↔그림 일치, 미검증 |
| `scene-01/_tools/` | `build.py`(생성기), `check.cjs`(검사기), `preview.cjs`(미리보기 생성) |
| `scene-01/preview/` | Pretendard VF로 그린 PNG 4장(노트북 1280·1000, 휴대전화 390·360) |
| [`scene-02/script.md`](scene-02/script.md) | 학습자 원고 11절(모듈·패키지, 학습용 변형 데모 코드 6개, 실행 순서, `__init__.py`·Namespace Package, `python main.py`/`-m 패키지`/`-m 모듈`, `__name__` 조건문, import 읽기, 두 지도, `ledger` 사례, 내 코드에서 시작점 찾기), 강사용 안내, 이해 확인 질문 6개, 근거와 출처 |
| [`scene-02/design-notes.md`](scene-02/design-notes.md) | 그림 A(패키지와 실행 시작점)·B(같은 소스의 두 지도) 구조, 두 경로의 시각 구분, 노트북/휴대전화 적용, 인터랙션 필요성 검토 I1~I6 |
| `scene-02/package-flow-desktop.svg` · `package-flow-mobile.svg` | 노트북용 1280×2290, 휴대전화용 360×4130 |
| [`scene-02/visual-qa.md`](scene-02/visual-qa.md) | 원고·데모·그림 대조, 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 정책 체크, 미검증 |
| `scene-02/_tools/` | `build.py`(생성기, Scene 01 그리기 도구 재사용), `check.cjs`(검사기), `verify_demo.py`(원고·데모·그림 대조), `preview.cjs`, `demo/`(학습용 변형 `todo`·`main.py`·`notes/`) |
| `scene-02/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-03a/script.md`](scene-03a/script.md) | 학습자 원고 10절(나누는 이유, 함수, 클래스·객체·`self`·`__init__()`, 헷갈리는 짝 4쌍, 책임 영역(설계 예시)과 데모 코드, 호출 흐름 ≠ import 의존, 모듈 분리 ≠ 계층 설계, `ledger` 사례, 내 코드에서 찾아보기), 강사용 안내, 이해 확인 질문 6개, 근거와 출처 |
| [`scene-03a/design-notes.md`](scene-03a/design-notes.md) | 그림 A(함수·클래스 문법)·B(책임을 나눈 프로그램) 구조, 시각 약속(return 선·Parameter/전달값 표기 추가), 노트북/휴대전화 적용, 인터랙션 필요성 검토 I1~I6 |
| `scene-03a/class-layer-desktop.svg` · `class-layer-mobile.svg` | 노트북용 1280×2314, 휴대전화용 360×4694 |
| [`scene-03a/visual-qa.md`](scene-03a/visual-qa.md) | 원고·데모·그림 대조(호출 추적·AST 포함), 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 정책 체크, 미검증 |
| `scene-03a/_tools/` | `build.py`(생성기, Scene 01·02 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(`basics.py`, `self_name.py`, 책임별 모듈 `todo/`) |
| `scene-03a/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-03b/script.md`](scene-03b/script.md) | 학습자 원고 11절(CRUD 뜻, 준비 문법(변수·딕셔너리·리스트·`for`·`if`), ID가 필요한 이유, CRUD 함수(바꿈·돌려줌·출력 구분), 검색과 요약, 책임별 패키지 `cashbook`, 수정 한 번의 호출 흐름·실패 두 경우·기능별 책임 표, 메모리 ≠ 파일 저장, `ledger` 사례, 내 코드에서 찾아보기(AI 보조 질문 포함)), 강사용 안내, 이해 확인 질문 6개, 근거와 출처 |
| [`scene-03b/design-notes.md`](scene-03b/design-notes.md) | 그림 A(데이터가 바뀌는 과정)·B(하나의 기능을 처리하는 책임) 구조, 행 표시 약속(추가·읽음·값 변경·삭제), 가로 책임 띠 + `main()` 실행 막대, 노트북/휴대전화 적용, 웹 상호작용 명세 I1~I7과 저장 오해 방지 |
| `scene-03b/crud-flow-desktop.svg` · `crud-flow-mobile.svg` | 노트북용 1280×3984, 휴대전화용 360×6780 |
| [`scene-03b/visual-qa.md`](scene-03b/visual-qa.md) | 원고·데모·그림 대조(호출 추적·AST 책임 분리 포함), 두 글꼴 환경 자동 검사(행 표시·번호 없는 영역 포함), 표시 크기, 눈으로 본 결과, 정책 체크, 미검증 |
| `scene-03b/_tools/` | `build.py`(생성기, 03-A·02·01 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(`data_basics.py`, `why_id.py`, `crud_basics.py`, `search_summary.py`, 거래용 가상 패키지 `cashbook/`) |
| `scene-03b/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-04/script.md`](scene-04/script.md) | 학습자 원고 13절(메모리와 파일, 파일·디렉터리·경로와 현재 작업 디렉터리, 파일 입출력 기본 문법(모드·`with`·`encoding`), JSON(이름·값·직렬화·네 함수), JSONL, CSV(인용 규칙·`newline=""`·문자열 값·가져오기/내보내기), 세 형식 비교, 파일로 CRUD(03-B 함수 + 파일 함수), 운영상 안전 주의(`"w"` 위험·임시 파일 + `os.replace()`의 한계), `ledger` 사례, 내 코드에서 찾아보기(7개 질문·AI 보조 질문), 다음 질문(10만 건), 정리), 강사용 안내, 이해 확인 질문 7개, 근거와 출처 |
| [`scene-04/design-notes.md`](scene-04/design-notes.md) | 그림 A(메모리에서 파일로)·B(세 가지 형식)·C(C-1 JSONL 읽기·쓰기, C-2 수정은 파일 다시 쓰기) 구조, 시각 약속(메모리 파선·파일 실선·변환 청록 선), 노트북/휴대전화 적용, 웹 상호작용 명세 I1~I7과 저장 오해 방지 |
| `scene-04/file-persistence-desktop.svg` · `file-persistence-mobile.svg` | 노트북용 1280×4052, 휴대전화용 360×6490 |
| [`scene-04/visual-qa.md`](scene-04/visual-qa.md) | 03-B 보완 확인, 원고·데모·파일·그림 대조(임시 폴더 실행·재실행·호출 추적·AST·기술 사실·`ledger` 사례), 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 정책 체크, 지시서 §10 기준 자체 확인, 미검증 |
| `scene-04/_tools/` | `build.py`(생성기, 03-B·03-A·02·01 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(`memory_only.py`, `where_file.py`, `text_io.py`, `json_basics.py`, `jsonl_basics.py`, `csv_basics.py`, `file_crud.py`, `w_mode_risk.py`) |
| `scene-04/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-05/script.md`](scene-05/script.md) | 학습자 원고 11절(10만 건 질문, Iterable, Iterator와 두 Iterator, Generator와 `yield`의 멈춤·재개, `return` vs `yield`·포함 관계, JSONL + Generator, 소비 방식 다섯 가지, Generator와 파일 수명, `ledger` 사례, 내 코드에서 찾아보기(AI 보조 질문 포함), 정리), 강사용 안내, 이해 확인 질문 8개, 근거와 출처 |
| [`scene-05/design-notes.md`](scene-05/design-notes.md) | 그림 A(Iterable·Iterator, 포함 관계)·B(Generator 실행 상태)·C(JSONL 스트리밍)·D(다섯 가지 소비 방식) 구조, 시각 약속, 노트북/휴대전화 적용과 탭·단계 탐색 후보, 웹 상호작용 명세 I1~I7, 기존 Iterator 체험 재사용 평가 |
| `scene-05/generator-stream-desktop.svg` · `generator-stream-mobile.svg` | 노트북용 1280×3142, 휴대전화용 360×5622 |
| [`scene-05/visual-qa.md`](scene-05/visual-qa.md) | 원고·데모·그림 대조(임시 폴더 실행·줄 추적·호출 추적·메모리 경향·AST·`ledger` 사례), 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 지시서 §9 항목별 PASS/미검증, 정책 체크, 미검증 |
| `scene-05/_tools/` | `build.py`(생성기, 04·03-B·03-A·02·01 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(`iterable_iterator.py`, `two_iterators.py`, `generator_steps.py`, `yield_vs_return.py`, `jsonl_generator.py`, `five_ways.py`, `file_lifetime.py`, 읽기 전용 `transactions.jsonl`·`broken.jsonl`) |
| `scene-05/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-06/script.md`](scene-06/script.md) | 학습자 원고 11절(반복되는 로그, 함수도 값, wrapper, `@` 문법과 두 시점·import 시점, `*args`·`**kwargs`·`return`, `functools.wraps`, 로그·예외 처리·시간 측정, `@dataclass` vs `@handle_errors`, `ledger` 사례, 내 코드에서 찾아보기, 정리), 강사용 안내(멈출 지점 표), 이해 확인 질문 9개, 근거와 출처 |
| [`scene-06/design-notes.md`](scene-06/design-notes.md) | 그림 A(중복과 분리)·B(두 시점)·C(예외 세 경로)·D(공통 관심사 세 가지) 구조, 시각 약속, 노트북/휴대전화 적용과 탭·전환 후보, 웹 상호작용 명세 I1~I7, 기존 Decorator 체험 재사용 평가 |
| `scene-06/decorator-flow-desktop.svg` · `decorator-flow-mobile.svg` | 노트북용 1280×2754, 휴대전화용 360×5590 |
| [`scene-06/visual-qa.md`](scene-06/visual-qa.md) | 원고·데모·그림 대조(임시 폴더 실행·시간 줄 형식·호출 추적·AST·`ledger` 사례), 두 글꼴 환경 자동 검사, 표시 크기, 눈으로 본 결과, 지시서 §8 항목별 판정, 정책 체크, 미검증 |
| `scene-06/_tools/` | `build.py`(생성기, 05·04·03-B·03-A·02·01 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `preview.cjs`, `demo/`(11개: `repeated_logs.py`, `functions_as_values.py`, `simple_wrapper.py`, `when_applied.py`, `deco_tools.py`, `import_then_call.py`, `args_return.py`, `wraps_compare.py`, `log_decorator.py`, `error_decorator.py`, `timing_decorator.py`) |
| `scene-06/preview/` | Pretendard VF로 그린 PNG 4장 |
| [`scene-07/script.md`](scene-07/script.md) | 학습자 원고 11절(`amount: int` 질문, Parameter·Argument·위치/키워드 인자·기본값, Type Hint 기본 문법과 3.10 `\|` 문법, Type Hint는 검증이 아님(`bool` ⊂ `int`), `list[str]`·`int \| str`·`-> None`의 실제 동작, 읽는 사람·IDE·런타임, argparse `type=int` vs Type Hint vs 범위 검증(`10`·`abc`·`-2`), `None`·기본값·Optional, `ledger` 사례 3개, 내 코드에서 찾아보기(AI 보조 질문 포함), 정리), 강사용 안내(멈출 지점·반대 방향 오해 2개·오해 교정 15개), 이해 확인 질문 9개, 근거와 출처 |
| [`scene-07/design-notes.md`](scene-07/design-notes.md) | 그림 A(Parameter·Argument 연결)·B(Type Hint 유무)·C(입력값이 통과하는 단계)·D(선언 vs 실제 검증 + 비교 카드 4개) 구조, 시각 약속(연결·'표시만'·'실행되지 않음' 추가), 노트북/휴대전화 적용과 탭·전환 후보, 웹 상호작용 명세 I1~I7, 기존 Type Hint 체험 재사용 평가 |
| `scene-07/type-hint-flow-desktop.svg` · `type-hint-flow-mobile.svg` | 노트북용 1280×4348, 휴대전화용 360×7992 |
| [`scene-07/visual-qa.md`](scene-07/visual-qa.md) | 원고·데모·그림 대조(임시 폴더 실행·signature bind·호출 추적·AST·나눈 줄 대조·Python 3.9 확인), `ledger` 사례 대조, 두 글꼴 환경 자동 검사, 검사기 오류 주입 14건, 표시 크기, 눈으로 본 결과, 지시서 §9 항목별 판정, 정책 체크, 미검증 |
| `scene-07/_tools/` | `build.py`(생성기, 06·05·04·03-B·03-A·02·01 그리기 도구 재사용), `check.cjs`, `verify_demo.py`, `verify_ledger.py`(사례 검증, 데모와 분리), `preview.cjs`, `demo/`(9개: `echo_amount.py`, `parameter_argument.py`, `type_hint_basics.py`, `hint_not_validation.py`, `runtime_validation.py`, `typing_contract.py`, `argparse_vs_hint.py`, `argparse_without_type.py`, `none_and_defaults.py`) |
| `scene-07/preview/` | Pretendard VF로 그린 PNG 4장 |

## 검증 요약

- Python 기술 내용: 공식 문서 원문 대조 + 가상 패키지 `todo`로 직접 실행(Python 3.14.6). `__init__.py`가 `__main__.py`보다 먼저 실행됨, `sys.argv`·Namespace 출력, `-n`/`--limit`/`--limit=5`, 잘못된 `int`의 오류와 종료 코드 2, `python -h`와 `python -m todo -h`의 차이, 원고의 시연 코드가 원고에 적은 출력을 그대로 냄.
- 공식 목표 5개: 모두 장면에 대응(시나리오 §4). **목표 4의 로그·시간 측정 Decorator는 `ledger`에 없음** → 일반 예시로만 가르치도록 명시.
- SVG: 검사기 PASS(Pretendard·대체 글꼴 각각, 노트북·휴대전화 의미 일치), XML 구문 통과, 1280·1000·390·360 렌더링 확인.
- 변경 범위: `drafts/b2-1-story-map/`만 추가. 보호 대상(기존 B2-1 웹 스토리·공개 경로, 9장 가이드·그림, B3-1 전체, 용어사전 canonical·기술지도, 진입 UX·내비게이션, 다른 미션) 변경 없음.

## 독립 검토 보완 (2026-10-22)

GPT 독립 검토는 교육 방향과 Scene 01 디자인 구조를 적절하다고 보고 세 가지만 수정하도록 했다. 8개 장면의 학습 목표와 교육 방향은 바꾸지 않았다.

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | 시연용 `todo` 패키지가 '두 파일 모두 빈 파일'로 읽힘 | 수정 | [원고](scene-01/script.md) '강사용 안내'에 폴더 구조·파일별 코드·실행 위치·명령·출력. `__init__.py`는 실행 코드 없음(Scene 01은 초기화 순서를 다루지 않음). [시나리오 v2 §6](scenario-v2.md)은 'Scene 01 시연용'과 '검증용 변형(`__init__.py` 출력, Scene 02 후보)'으로 나눠 기록 |
| 2 | 그림 ⑤ `show_tasks(args.limit)`와 시연 `print(args)`의 목적 | 수정(원고만) | 시연 코드가 `show_tasks()`를 정의·호출(⑤)하고, ③·④ `print`는 시연 확인용 출력으로 표시. 그림은 이미 이 흐름과 같아 **SVG·생성기 변경 없음** |
| 3 | 개념지도 R29(`Parameter ↔ Argument`, 유형 '비교')가 관계 후보 표에 있음 | 수정 | 비교 카드 C16으로 옮기고 관계 후보 표에는 관계선 후보만 남김(R30 → R29). 표 머리에 '비교는 §5 카드로만' 규칙 명시 |

검증: 원고 코드 블록을 그대로 꺼내 실행(Python 3.14.6), 그림 재생성 Git 변경 0, 검사기 PASS, 개념지도 §4에 '비교' 유형 0건·ID 연속 확인, 상대 링크 확인.

## Scene 02 제작 (2026-10-22)

기준 커밋 `c03c452`(원격과 같음 확인). 질문: **내 Python 프로그램은 어디에서 시작하고, 파일들은 어떻게 연결될까?**

- **데모(Scene 02 학습용 변형):** Scene 01의 `todo`를 `__init__.py`·`__main__.py`·`cli.py`·`actions.py`로 나누고 비교용 `main.py`, Namespace Package 예외용 `notes/hello.py`를 더했다. 실행 시점을 보이는 학습용 출력(`[불러올 때]`·`[호출될 때]`)은 실제 프로그램 코드와 구분해 표시했다.
- **확인한 순서(`python -m todo list --limit 3`):** `__init__.py` → `__main__.py` → `cli.py` → `actions.py`(불러올 때) → `main()` → `build_parser()` → `parse_args()` → `show_tasks(3)`(호출될 때). `-m todo.cli`는 `__init__.py` 다음 `cli.py`가 시작 파일이고 `__main__.py`를 쓰지 않음, `python main.py`는 `main.py`가 먼저, `python todo/cli.py`는 `ModuleNotFoundError`, `-h`에서는 `actions.py`를 불러오지만 `show_tasks()`는 호출되지 않음.
- **두 지도의 시각 구분:** import = 파란 파선·빈 화살촉·번호 없음(표준 라이브러리는 회색 칩) / 실행·호출 = 진한 실선·채운 화살촉·번호. 검사기가 선 모양과 번호 원 위치까지 확인한다.
- **검증:** `verify_demo.py` PASS(코드 6/6, 실행 출력 10/10, 그림 순서·import·호출 = 실행·AST, 실행 방식 비교 3/3, 일부러 틀린 코드로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 의미 일치 9항목), XML 구문, 1280·1000·390·360 렌더링 확인.
- **`ledger` 사례:** 설계 문서의 의존 방향(`cli → services → repository`)과 달리 `cli.py`가 `repository`도 직접 import한다는 점, `list` 호출 추적 결과, Decorator가 불러올 때 적용된다는 점을 구현 사례로만 기록했다.

**Scene 02 독립 검토 요청**

1. 그림 A·B 구성과 휴대전화 길이(약 5.1화면) — 웹에서 A/B 탭 전환(I1) 여부
2. 학습용 출력을 `import` 줄 위에 둔 데모 형태(원고에 '실제 코드에서는 넣지 않음' 명시)
3. `python todo/cli.py` 실패 사례와 `-m 모듈` 실행을 입문 장면에 넣는 깊이
4. `__main__.py`에 조건문을 쓰지 않은 예시(공식 문서 권장)와 `ledger`(조건문 사용)의 차이 설명
5. 인터랙션 필요성 판단(I2 단계별 강조·I3 지도 전환은 필요, I6 함수 정의 이동은 보류)

## Scene 02 표현 보완 (2026-10-22, 검토 대상 `0ad46d1`)

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | 모듈 = `.py` 파일, 패키지 = 폴더가 정의처럼 읽힘 | 수정 | **파일 기반 Python 소스의 입문 모델**로 표시. 용어집 정의, 내장 모듈(`sys`·`math`), 확장 모듈(`select.pyd`), Namespace Package 예외를 함께 기록. 원고·생성기·노트북/휴대전화 그림·대체 설명을 같은 뜻으로 수정 |
| 2 | "이때까지 함수는 하나도 호출되지 않았습니다" | 수정 | "이 예시에서 정의한 기능 함수(`main()`·`build_parser()`·`show_tasks()`)의 본문은 아직 실행되지 않았습니다"로. `print()` 같은 내장 함수는 최상위 코드에서 호출된다는 설명 추가. 그림에는 같은 문구가 없어 수정 없음 |

검증: 그림 배치·실행/import 구분 유지(글자만 변경), `check.cjs` PASS, `verify_demo.py` PASS. 상세는 [Scene 02 QA §4-1](scene-02/visual-qa.md).

## Scene 03-A 제작 (2026-10-22)

질문: **Python 프로그램은 왜 여러 함수와 클래스로 나누어 만들까?** 시나리오의 Scene 03을 03-A(구조·문법)와 03-B(CRUD·검색·요약, 미제작)로 나눴다([시나리오 v2 §3](scenario-v2.md)). 공식 목표 5개는 여전히 모두 주 장면을 가진다(목표 2 → 03-A, 목표 1의 CRUD·검색·요약 → 03-B 보조).

- **일반 개념:** `def`·Parameter·전달값·`return`, 클래스·객체(객체마다 데이터), `__init__()` 자동 호출, `self` = Python이 자동으로 넘기는 객체를 받는 **관례적인 이름**(`self_name.py`로 확인), 함수 ≠ 메서드(`a.complete()` = `Task.complete(a)`).
- **설계:** 모델·저장소·서비스·CLI는 **Python 문법이 아닌 설계의 한 예**로 명시. 모듈 분리 ≠ 계층 설계.
- **데모(학습용 변형):** `todo`를 책임별 모듈로 나눔(메모리 저장소, 목록 조회만). 학습용 출력 없이 호출 순서를 `sys.setprofile` 추적으로 확인. `--limit 0`에서 규칙 판단(서비스)과 오류 표시(CLI)가 나뉨.
- **핵심 대조:** `services.py`에는 import가 없지만 ⑦에서 저장소의 `all()`을 호출(받은 객체 사용) / `cli.py`는 서비스·저장소를 모두 import하고 저장소를 직접 만듦 → CLI → 서비스 → 저장소 한 줄이 아님. `ledger`도 import가 설계 문서의 사슬보다 많음(구현 사례로만 기록).
- **시각 약속:** Scene 02 약속 재사용 + **return = 회색 가는 실선·빈 화살촉·번호 없음** 추가, 코드 속 Parameter(초록 밑줄)·전달값(갈색). 그림 A에는 흐름 화살표 없음.
- **검증:** `verify_demo.py` PASS 33항목(원고 코드 8/8, 실행 출력 5/5 줄 전체 일치, 그림 코드 줄·실행 결과·객체 상태, 호출·부른 쪽·번호·return = 추적, import = AST, 일부러 틀린 번호로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 선 모양 약속 3종, 의미 일치 11항목), XML 구문, 1280·1000·390·360 렌더링 확인.

**Scene 03-A 독립 검토 요청**

1. 03-A/03-B 분리 경계: 03-A에서 목록 조회 한 기능만 쓴 범위
2. 새 시각 약속(return 회색 선, Parameter 밑줄·전달값 갈색)과 계층 열(레인) 배치
3. `self` 설명의 깊이(관례적 이름 시연 `self_name.py`를 입문 장면에 넣는 것)
4. "호출은 있지만 import는 없다" 사례의 난이도
5. 휴대전화 길이 약 5.8화면과 탭 전환(I1)

## Scene 03-B 제작 (2026-10-23)

기준 커밋 `74839b0`(지시서의 최신 검토 커밋과 같음 확인). 질문: **데이터는 어떻게 추가·조회·수정·삭제되고, 검색과 요약에 활용될까?**

- **일반 개념 먼저:** CRUD는 Python 문법이 아닌 데이터 처리 개념 → 리스트·딕셔너리·`for`·`if` 최소 문법 → ID(위치는 바뀜, `why_id.py`) → 함수로 만든 CRUD(`crud_basics.py`, 클래스 없는 단일 파일) → 검색과 요약(`search_summary.py`, 같은 원본·원본 그대로) → 책임별 패키지(`cashbook`) → 메모리 ≠ 파일 저장 → `ledger`는 마지막 구현 사례 절에만.
- **학습용 예제:** 거래 4건(1 수입 용돈 30000, 2 지출 식비 8000, 3 지출 교통 2000, 4 지출 식비 5000). 추가 id 5 → 수정 id 2 금액 8000→7000 → 삭제 id 3(가운데, 위치는 당겨지고 ID는 그대로). 검색·요약은 처음 4건에 적용(지출 합계 15000·건수 3·평균 5000.0). 데이터를 바꾸는 함수는 출력하지 않고, 출력 함수는 데이터를 바꾸지 않게 나눔. Scene 05 개념(제너레이터 표현식·컴프리헨션)은 쓰지 않음.
- **`cashbook`(가상 패키지, 메모리 저장소):** 서비스 = 처리 규칙(금액 ≥ 1, 없는 ID 판단, 검색 조건, 요약 계산), 저장소 = 읽기·바꾸기, CLI = 해석·출력, 모델 = 거래의 모양. 매 실행 처음 4건에서 시작하므로 `add` 뒤 `list`에 id 5가 없음 → Scene 04 질문.
- **그림 B 호출 흐름(`update --id 2 --amount 7000`, 추적 확인):** ① `main` ② `build_parser` ③ `TransactionRepository()` ④ `Transaction`×4 ⑤ `TransactionService` ⑥ `change_amount`(규칙) ⑦ `update_amount`(값 변경) ⑧ `get`(id로 찾기) ⑨ `format_row`(출력), return 3개. 실패: 없는 id 9 → `get`이 None → 서비스 오류 / 금액 0 → 서비스에서 멈춤, 저장소 호출 없음.
- **시각 약속:** 03-A 호출(실선·번호)·return(회색) 유지. 데이터 변경은 선이 아니라 **행 표시**(추가 = 초록 실선 + `+ 추가`, 읽음 = 파란 굵은 테두리, 값 변경 = 이전 값 취소선 → 새 값, 삭제 = 빨간 파선 + 취소선). 그림 A 카드·역할 카드·책임 표에는 번호 없음(검사기 확인). B-1은 03-A의 세로 열이 아닌 **가로 책임 띠 + `main()` 실행 막대**.
- **검증:** `verify_demo.py` PASS 79항목(원고 코드 10/10, 실행 출력 13/13 줄 전체 일치, 그림 A 상태·바뀐 행·이전 값 = 실행 출력, 검색·요약 = 실행 출력, 호출·부른 쪽·번호·return = 추적, 실패 경우 호출 범위, AST 책임 분리(print는 CLI에만, 저장 목록 변경·금액 대입은 저장소에만), 책임 표의 서비스 → 저장소 호출, 일부러 틀린 번호·금액으로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 의미 일치 13항목), XML 구문, 1280·1000·390·360 렌더링 확인.
- **개념지도 개요:** 03-B 노드(리스트·딕셔너리, ID·인덱스, 메모리 속 데이터), 관계 R30~R33, 비교 카드 C19~C21, 용어사전 연결 주의(`filter`·`summary-aggregation`·`primary-key`), 탐색 후보 추가. 지도 데이터(JSON)는 만들지 않음.

**Scene 03-B 독립 검토 요청**

1. 일반 개념 → 단일 파일 함수 예제 → 책임별 패키지 → `ledger` 순서와 분량(원고 11절)
2. 가상 예시를 `todo`에서 `cashbook`으로 바꾼 것
3. 그림 A 행 표시 약속과 C·R·U·D 글자(번호 아님), 그림 B-1 가로 책임 띠 배치, import 지도 생략
4. 휴대전화 길이 약 8.4화면(그림 A 약 4.1 + B 약 4.3) — 웹 탭(I1) 또는 B-4를 원고로만 옮기기
5. "없는 id"를 판단하는 곳(예제는 서비스, `ledger`는 수정은 서비스·삭제는 저장소)을 사례 절에서 비교한 깊이
6. 웹 상호작용 I2(CRUD 전환)·I3(검색 조건 전환, 검증된 세 조건만)·I6(처음 상태로)과 '실제 파일에 저장되지 않음' 표시

## Scene 03-B 표현 보완 (2026-10-23, 검토 대상 `df59837`)

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | "ID로 찾으면 언제나 같은 항목입니다."가 지운 ID의 재사용 가능성을 가린다 | 수정 | [원고 3절](scene-03b/script.md): 위치가 바뀌어도 **남아 있는 항목의 ID는 유지**, **지운 ID의 재사용 여부는 ID 생성 규칙에 따름**을 명시하고 바로 아래 규칙 설명에 "예전에 적어 둔 번호가 새 항목을 가리킴"을 더함. [개념지도 개요 C20](concept-map-outline.md)의 "고정된 번호"도 같은 뜻으로 |

- 그림·생성기의 ID 문구("위치가 바뀌어도 id는 그대로" 등)는 남아 있는 항목에 대한 사실이라 같은 오해를 만들지 않는다고 판단해 **SVG·생성기는 바꾸지 않음**. 03-B `verify_demo.py`·`check.cjs` PASS, 재생성 Git 변경 0. 예제 규칙에서 마지막 id 삭제 뒤 추가하면 번호가 다시 쓰이고(5 → 5), 가운데 id는 다시 쓰이지 않음(2 삭제 → 6)을 실행으로 확인([Scene 04 QA §0](scene-04/visual-qa.md)).

## Scene 04 제작 (2026-10-23)

기준 커밋 `df59837`(원격 `origin/content/b2-1-story-map-foundation`과 같음 확인). 질문: **프로그램을 종료해도 데이터가 남는 이유는 무엇일까?**

- **일반 문법·형식 먼저:** 메모리 ≠ 파일(`memory_only.py` 두 번 실행) → 경로와 현재 작업 디렉터리(`where_file.py`를 두 위치에서) → `open()`·모드·`with`·`encoding`(`text_io.py`, 문법만) → JSON(`json_basics.py`) → JSONL(`jsonl_basics.py`) → CSV(`csv_basics.py`) → 세 형식 비교 → 파일 CRUD(`file_crud.py` = 03-B 메모리 CRUD 함수 + `load_all`·`append_one`·`save_all`) → 운영상 안전 주의(`w_mode_risk.py`) → `ledger` 사례 → 내 코드에서 찾아보기 → 10만 건 질문.
- **예시 데이터:** 지시서의 3건(id 1 식비 8000, id 2 교통 2000, id 3 문구 3000)을 세 형식·그림에 공통으로. JSONL은 `separators=(",", ":")`로 한 줄을 짧게(휴대전화 폭 실측 323px, 끊지 않음). 이유는 원고 5절에 명시.
- **핵심 경계:** JSONL은 '한 줄씩 처리할 수 있는' 형식이지 메모리 절약 기능이 아님(`jsonl_basics.py` 마지막 줄, `load_all()`, `ledger`의 `update()`도 리스트로 모음). '저장 JSONL·교환 CSV' 일반 규칙을 만들지 않음. `os.replace()`는 공식 문서의 보장 범위(POSIX 요구, 같은 파일시스템)만 쓰고 전원 차단·동시 쓰기·`fsync`는 한계로 명시. `for line in f`의 원리와 Generator는 Scene 05로.
- **시각 약속 추가:** 메모리 = 파란 파선 + '메모리', 파일 = 초록 굵은 실선 + '파일', 사라짐 = 회색 점선, 변환 = 청록 선 + 함수 이름(번호 없음). 처리 순서(C-2)는 기존 번호·검은 실선. 그림 A·B·C-1·표에는 번호 없음(검사기 확인).
- **검증:** `verify_demo.py` PASS 137항목(원고 코드 8/8, **임시 폴더에서 18번 실행** — 종료 후 재실행 포함 — 출력 줄 전체·종료 코드 일치, 파일 블록 5개, 그림 A 칸 24개 = 실행 출력·실행 전후 파일, 그림 B 세 형식 = 실제 파일·같은 거래 3건·id 2 강조·amount 종류, C-1 = 실행 출력, C-2 = 호출 추적(`load_all` → `update_amount` → `save_all` → `os.replace`)·`.tmp` 내용·교체 뒤 `.tmp` 없음, AST(인코딩 28곳·CSV `newline=""` 4곳·`file_crud.py` 책임), 기술 사실 확인, `ledger` 사례 임시 폴더 실행, 저장소 데모 폴더 변화 없음, 일부러 틀린 그림 3가지로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 의미 일치 12항목), XML 구문, 생성기 재실행 SHA-256 동일, 1280·1000·390·360 렌더링 확인.
- **개념지도 개요:** 04 노드(파일·경로·모드·인코딩·직렬화/역직렬화·임시 파일 교체), 관계 R34~R40, 비교 카드 C22~C25, C10 문구 보완(형식 규칙 아님), 용어사전 연결 주의(`json-lines`·`temporary-file-replace-strategy`·`csv`), 탐색 후보·learningOrder L5. 지도 데이터(JSON)는 만들지 않음.

**Scene 04 독립 검토 요청**

1. 일반 문법·형식(1~7절) → 파일 CRUD(8절) → 안전 주의(9절) → `ledger`(10절) 순서와 분량(원고 13절, 데모 8개)
2. 그림 A '시간 × 저장 위치' 격자(휴대전화는 단계 카드)와 새 시각 약속(메모리 파선·파일 실선·변환 청록 선)
3. 예시 데이터를 3필드로 줄이고 JSONL에 `separators`를 쓴 것
4. `os.replace()`·임시 파일 설명의 깊이(공식 문서 범위만, 한계 3가지)
5. 휴대전화 길이 약 8.1화면 — 웹 탭(I1)
6. 웹 상호작용 I2(저장 안 함/저장함)·I3(형식 전환)·I4(한 줄씩 읽기, Generator 용어 없이)·I5(모드 선택, 실행 결과만)·I6(전후 비교)과 '실제 파일에 저장되지 않음' 표시
7. 용어사전 `json-lines`·`temporary-file-replace-strategy`의 표현(canonical은 수정하지 않음, Owner Gate)

## Scene 04 검토 상태 (2026-10-23 Owner 전달)

- Owner가 전달한 최신 검토 결과: Scene 04(`36d144a`)는 **GPT 독립 콘텐츠 검토 PASS**. 위 'Scene 04 독립 검토 요청'은 그 검토 전에 적은 기록으로 남겨 둔다.
- **Owner 시각 승인, 웹 통합, 공개는 아직 아니다.** 이 저장소에서 별도 검토 문서를 확인하지 못했으므로 이 기록의 근거는 Owner의 작업 지시서다.

## Scene 05 제작 (2026-10-23)

기준 커밋 `36d144a`(원격 `origin/content/b2-1-story-map-foundation`과 같음 확인). 구현 사례 `m03-pocket-money-ledger` `d14e812`(원격 `main`과 같음 확인). 질문: **데이터를 꼭 한꺼번에 꺼내야 할까? Iterable·Iterator·Generator는 무엇이 다를까?**

- **일반 개념 먼저:** 리스트 `[10, 20, 30]`로 Iterable·`iter()`·`next()`·`StopIteration`·풀어 쓴 `for` → 두 Iterator의 독립 진행, Iterator도 Iterable → `count_up(3)`으로 호출 직후 미실행·`yield` 멈춤·재개·종료 → `return` vs `yield`, `collections.abc`로 포함 관계 확인 → JSONL을 읽는 Generator(빈 줄 건너뜀, 잘못된 JSON에서 멈춤, 파일 객체도 Iterator) → 소비 방식 다섯 가지 → 파일 수명(`close()`·`closing()`) → `ledger` → 내 코드에서 찾아보기.
- **핵심 경계:** JSONL = 저장 형식, Generator = 실행 방식. 메모리에 남는 양은 결과 보관 방식이 정하고(방식 2는 Generator 없이 0건, 방식 4는 Generator로도 전부), 보관량 ≠ 처리 시간(시간은 측정하지 않음). `deque(maxlen)`도 끝까지 읽을 수 있음. 참조가 사라진 Generator의 정리 시점은 구현에 따름(CPython 관찰만 기록). Decorator(06)는 다루지 않음.
- **방식 이름:** 원 숫자(①~⑤)는 이 스토리에서 실행 순서 전용이라, 소비 방식은 '방식 1~5'로 표기.
- **데모:** 7개, 표준 라이브러리만, **파일을 쓰지 않음**(함께 둔 JSONL 두 개를 읽기만). 10만 건 파일은 실습 전제로 요구하지 않음.
- **시각 약속 추가:** 포함 = 겹친 상자(선·번호 없음), 만들어 냄 = 보라 점선(Scene 01 '참고'와 같은 모양 — 검토 요청), Iterator 칸(꺼냄/다음), Generator 상태(생성됨/멈춤 파선/종료), 그림 D의 꺼낸 줄(점선 칸)·남긴 거래(굵은 칸).
- **검증:** `verify_demo.py` PASS 98항목(원고 코드 7/7·실행 7/7 줄 전체 일치, **그림 B 실행 줄 = `sys.settrace` 줄 추적·보관된 `n` = 지역변수 추적**, 그림 C 실행 순서 = 호출 추적, 그림 D = 실행 출력, tracemalloc 경향(거래 4배에 전부 리스트·`list(Generator)` ×3.8, 한 줄씩·`deque` ×1.0 — 비율만, 원고에 수치 없음), `ledger` 사례 임시 폴더 실행·AST, 데모 폴더 SHA-256 불변, 일부러 틀린 5가지로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 노트북·휴대전화, 의미 일치 19항목), XML 구문, 생성기 재실행 SHA-256 동일, 1280·1000·390·360 렌더링 눈으로 확인.
- **개념지도 개요:** 기존 R22~R25·C11~C12를 그대로 쓰고 새로 R41~R46·C26~C30만 추가(중복 없음, ID 연속 확인), 05 노드 행 정리, 용어사전 연결 주의(`iterator`·`streaming`), 탐색 후보 갱신. 지도 데이터(JSON)는 만들지 않음.
- **기존 Iterator 체험(`src/B21LearningStoryView.tsx`):** 변경하지 않음. 재사용 조건(리스트 Iterator 상태에 `yield` 이름을 쓰지 않기, `ledger` 코드는 사례로 분리)을 설계 노트 §3에 기록.

**Scene 05 독립 검토 요청**

1. 일반 개념(2~5절) → JSONL(6절) → 소비 방식(7절) → 파일 수명(8절) → `ledger`(9절) 순서와 분량(원고 11절, 데모 7개)
2. 그림 B의 '실행한 줄 · 나온 값 · 상태' 분리 표와 `print(…)` 줄임 표기
3. 그림 D의 보관량 표기(O(N)·O(1)·O(limit), 방식 3은 한 건 보관 O(1)·k건을 모으면 O(k) — 독립 검토 보완으로 고침, '남기는 거래 수' 기준 단순화)와 '꺼낸 줄 = Python 코드가 받은 줄'(내부 버퍼 별도) 설명
4. 파일 수명 절(8절)의 깊이 — `close()`·`closing()`까지만, 예외 처리 강의로 넓히지 않음
5. 보라 점선을 '참고'(Scene 01)와 '만들어 냄'(Scene 05)에 함께 쓰는 것
6. 휴대전화 길이 약 7.0화면 — 탭(I1)·단계 탐색(I3·I5)
7. 용어사전 `iterator`·`streaming`의 표현(canonical은 수정하지 않음, Owner Gate)

## Scene 05 독립 검토 보완 (2026-10-23, 검토 대상 `7363c57`)

독립 검토는 교육 내용과 기술적 정확성을 전반적으로 PASS로 보고 두 가지만 최소 수정하도록 했다. 원고 구조와 디자인은 그 밖에 바꾸지 않았다.

| # | 지적 | 판정 | 수정 |
| --- | --- | --- | --- |
| 1 | `five_ways.py`의 방식 1~5가 변수를 함께 써서 앞 방식의 데이터가 메모리에 남음 | 수정 | 방식마다 독립 함수, `taken`은 방식마다 새로, 결과는 `report()`에 바로. 원고 7절에 '남긴 거래 = 그 방식이 결과로 보관한 거래'. **출력은 바이트까지 같음**(그림 D 값 변경 없음) |
| 2 | 방식 3의 메모리를 O(k)로만 표현 | 수정 | 원고 7절·그림 D: 한 건만 받아 두면 O(1), k건을 따로 모으면 O(k), 최소 메모리는 별도 |

검증: `verify_demo.py` PASS 106항목(새 검사: 독립 함수 AST, 거래 수·limit·k를 바꿔 각 방식을 따로 실행한 보관 건수 = 그림 D 표기, 일부 소비의 메모리 경향 ×1.00), `check.cjs` PASS(의미 일치 20항목), 생성기 재실행 SHA-256 동일, 미리보기 재생성·그림 D 눈으로 확인, Scene 03-B·04 검사기 PASS. 이전 구조로 되돌리면 FAIL 5건, 방식 3을 O(k)로 되돌리면 FAIL 2건. 상세는 [Scene 05 QA §0](scene-05/visual-qa.md).

## Scene 06 제작 (2026-10-23)

기준 커밋 `cec10d5`(원격과 같음 확인). 구현 사례 `m03-pocket-money-ledger` `d14e812`(원격 `main`과 같음 확인). 질문: **여러 함수에 똑같이 필요한 일(로그·예외 처리·시간 측정)을 매번 다시 쓰지 않으려면?**

- **일반 개념 먼저:** 반복되는 로그(원래 기능 ↔ 부가 기능, 다른 해결 방법도 있음) → 함수도 값(`greet` ↔ `greet()`, `run(greet())`는 `TypeError`) → wrapper 6단계(소스를 고치지 않고 이름이 wrapper를 가리킴) → `@` = `func = deco(func)`(공식 문서의 '대체로 같음' 문구 그대로), 정의·import 때 한 번 적용 / 호출할 때마다 wrapper → `*args`·`**kwargs`·`return`(빠뜨리면 `None`, 인자 없는 wrapper는 `TypeError`) → `functools.wraps`(동작에 필수 아님, 정보 보존) → 로그(기록 후 다시 던짐)·예외 처리(`AppError`만, 나머지 전파, 오류 시 `None`)·시간 측정(`perf_counter`, 가짜 시계로 재현) → `@dataclass` vs `@handle_errors` → `ledger` → 자기 코드 탐색.
- **`ledger`(9절에만):** `handle_errors` + `@wraps`, `describe_error`, `LedgerError` 계층, `_dispatch` 한 곳 적용, **반환 약속 변경**(`None` → 종료 코드 0·1), stderr `[오류]`·`[힌트]`, `KeyError` 전파. **로그·시간 측정 Decorator는 `ledger`에 없음**(검증). 설계 문서 §22('각 핸들러에 적용')와 코드(`_dispatch` 한 곳)의 차이는 코드 기준으로 기록.
- **시간 측정(비결정적 수치):** 원고에 실제 값 한 번을 예로 보이되 검증기는 형식만 대조(두 번 실행해 값이 달랐음), 가짜 시계 결과는 글자까지 대조, 그림에는 실제 숫자를 넣지 않음, 성능 수치 서술 없음.
- **시각 약속 추가:** wrapper(파란 상자 + 'wrapper')·원래 함수(초록 상자 + '원래 함수')·반복(갈색 파선 띠 + '반복'), 예외 두 모양(처리 = 긴 파선, 전파 = 점선), 그림 B는 시점별 두 영역·영역마다 번호. 그림 A는 원래 기능 줄을 `…`로 줄이고 실제 줄 범위를 검증.
- **검증:** `verify_demo.py` PASS 91항목(원고 코드 11/11·실행 10개 줄 전체 일치·시간 데모 2회, 그림 A 코드 줄 = 실제 소스, 그림 B = 호출 추적, 그림 C = 실제 호출 결과, 그림 D = 실행 출력·AST, Decorator 12개 구조 AST, `ledger` 사례 실행·AST, 데모 폴더 불변, 일부러 틀린 5가지로 FAIL 확인), `check.cjs` PASS(두 글꼴 × 두 판, 의미 일치 16항목), XML 구문, 생성기 재실행 SHA-256 동일, 1280·390 미리보기 눈으로 확인.
- **개념지도 개요:** 기존 R26·R27·C15를 그대로 쓰고 R47(Decorator → Wrapper)·R48(`functools.wraps` → 원래 함수 정보 보존)·C31~C33만 추가(ID 연속 확인), 06 노드 행 정리, 용어사전 연결 주의(`decorator`·`logging`), 탐색 후보 갱신. 지도 데이터(JSON)는 만들지 않음.
- **기존 Decorator 체험(`src/B21LearningStoryView.tsx`):** 변경하지 않음. 9절 사례로 재사용 가능, 제목('호출 전에')과 전파 경로 추가가 필요하다는 평가를 설계 노트 §3에 기록.

**Scene 06 독립 검토 요청**

1. 일반 개념(1~8절) → `ledger`(9절) 순서와 분량(원고 11절, 데모 11개)
2. 그림 A의 `…` 줄임 표기, 그림 B의 두 영역·영역별 번호·return/가리킴 표현
3. 그림 C 예외 선 두 모양과 세 경로 구성
4. 시간 측정의 실제 값 처리(원고 예시 1회 값 + 형식만 검증, 그림에는 가짜 시계)
5. 휴대전화 약 6.9화면 — 탭(I1)·전환(I3~I5)
6. 용어사전 `decorator`·`logging` 표현(canonical은 수정하지 않음, Owner Gate)

## Scene 06 독립 검토 보완 (2026-10-23, 검토 대상 `9396e29`)

GPT 독립 콘텐츠 검토 PASS(전체 교육 구성·Python 핵심 개념). 표현 세 가지만 보완했고 실행 예제·그림 구성은 그대로다.

| # | 지적 | 판단 | 반영 |
| --- | --- | --- | --- |
| 1 | `@dataclass`가 클래스 정의 시점에만 의미 있는 것처럼 읽힘 | 수정 | 원고 8절 표: 둘 다 정의 시점에 한 번 적용, `@dataclass`는 기본 설정에서 `__init__()` 등을 만들어 클래스에 추가하고 객체 생성 때 그 `__init__()`이 실행됨, `@handle_errors`는 호출 때마다 wrapper가 동작. 근거 표 행 맞춤 |
| 2 | Decorator 정의가 클래스 Decorator까지 일반화됨 | 수정 | 3절 '이 장면에서 다루는 함수 Decorator'로 한정 + wrapper를 돌려주지 않는 Decorator(`@dataclass`) 언급. 10절 표·AI 질문에 '호출 때 wrapper / 정의 시점에 만들어 넣음' 구분. 11절 정리·근거 표 정의 행도 '함수 Decorator'로 한정 |
| 3 | 7-1절 '1절과 출력은 같지만' | 수정 | 정상 실행의 로그 순서는 1절과 같고, 오류 상황의 로그 처리를 추가로 보여 준다는 뜻으로 수정 |

SVG는 같은 오해를 일으키는 문구가 없어 바꾸지 않았다. 검증: `verify_demo.py` PASS 91항목(macOS, Python 3.12.13, `ledger` `d14e812` 포함), 생성기 재실행 SVG SHA-256 동일. `check.cjs`는 이 환경에 Playwright 브라우저가 없어 미실행(SVG 바이트 동일로 기존 PASS 유효). 상세는 [Scene 06 QA §0](scene-06/visual-qa.md).

## Scene 07 제작 (2026-10-23)

기준 커밋 `1bbf824`(원격과 같음 확인). 이번에는 별도 worktree가 아니라 기본 작업 트리에서 이 브랜치로 전환해 작업했다(작업 전 트리 깨끗함 확인). 구현 사례 `m03-pocket-money-ledger` `d14e812`(작업일 `git fetch` 후 원격 `main`과 같음 확인). 질문: **`amount: int`라고 적으면 잘못된 값을 막을 수 있을까?** 공식 목표 5(Type Hint)의 주 장면.

- **일반 개념 먼저:** `echo_amount("1000")`이 문자열을 그대로 돌려줌(2배 → `10001000`) → Parameter·Argument(위치 = 순서, 키워드 = 이름, 순서를 바꾸면 결과는 같아도 `price=3`, 기본값, Argument 부족 `TypeError`) → Type Hint 문법(힌트 유무 두 함수의 결과가 `'100010001000'`까지 같음, `__annotations__` 보관, `|`는 3.10+) → 표시만 vs 검증 코드(값 6개: `-5`·`True`도 선언과 맞지만 규칙에서 거부, `bool` ⊂ `int`) → `list[str]`·`int | str`·`-> None`의 실제 동작 → 읽는 사람·IDE·런타임(검사기는 실행하지 않음, 가능성으로만) → argparse `type=int`(변환) vs `limit: int`(표시) vs `if limit <= 0`(검증), `10`·`abc`·`-2` = 종료 코드 0·2·1, `type=int`를 빼면 `TypeError` → 기본값 vs `None` 허용(2×2, `Optional` ≠ 생략 가능) → `ledger` → 자기 코드 탐색.
- **`ledger`(9절에만):** 사례 1 `--limit` `type=int`(cli.py 57) → `list_transactions(self, limit: int) -> list[Transaction]`(services.py 112) → 양수 검증(124~125), 실제 실행 0·2·1(일반 예제와 같은 구조), `-2` 메시지가 영어인 이유(`describe_error` 기본 문구). 사례 2 `validate_amount(value: int | str)`(validators.py 53~67)와 실제 호출 위치(`input()` 문자열·CSV 문자열·정수). 사례 3 `Transaction.amount: int`·`tags: list[str]`, `SearchCriteria.category: str | None`, `@dataclass`는 값을 검사하지 않음(`amount=-500`도 만들어짐), `from __future__ import annotations`, `mypy` 미실행 기록. **원고에 적은 줄 번호 20개를 모두 검증**.
- **시각 약속 추가:** Parameter 칸(초록·밑줄)·Argument 칩(갈색), 연결 선(보라 점선, Argument → Parameter), Type Hint 조각(파란 바탕), '표시만' 칸(파란 파선), 멈춘 단계(빨간 테두리)·실행되지 않은 단계(회색 점선 + 글자). 변환(청록)·예외 두 모양·return은 기존 약속 그대로.
- **검증:** `verify_demo.py` PASS 217항목(원고 코드 9/9·실행 12개 줄 전체 일치, 표준 출력/오류 구분, 그림 A 연결 = `inspect.signature().bind()`·선 엇갈림, 그림 B 소스·힌트 조각·본문 AST 같음, 그림 C 단계 = `sys.settrace` 호출 추적, 그림 D = 실행 출력·`isinstance`, 나눠 그린 줄 = 실제 출력, Python 3.9.6에서 `|` 문법 `TypeError`), `verify_ledger.py` PASS 44항목(임시 폴더, ledger 저장소·data 폴더 불변), `check.cjs` PASS(두 글꼴 × 두 판, 의미 일치 16항목), 오류 주입 14건 모두 FAIL로 잡음, 생성기 재실행 SHA-256 동일, 1280·390 미리보기 눈으로 확인. 브라우저는 설치된 Google Chrome(`PW_CHANNEL=chrome`)을 썼다(npx 캐시 Playwright에 Chromium이 없음).
- **개념지도 개요:** R28·R29·C03·C13·C14·C16을 그대로 쓰고 R49(`bool` → `int` 종류)·C34(위치 ↔ 키워드 인자)·C35(기본값 ↔ `str | None`)만 추가(ID 연속 확인), 07 노드 4개 추가, 용어사전 연결 주의(`type-hint`·`input-validation`), 탐색 후보 갱신. 지도 데이터(JSON)는 만들지 않음.
- **기존 Type Hint 체험(`src/B21LearningStoryView.tsx`의 `TypeHintEpisode`):** 변경하지 않음. `ledger` `list_transactions` 전후 비교와 세 관점이 정확해 9절 사례의 상호작용으로 재사용 가능, 일반 예제·Parameter/Argument·`type=` 변환 층위가 없다는 평가를 설계 노트 §3에 기록.

**Scene 07 독립 검토 요청**

1. 일반 개념(1~8절) → `ledger`(9절) 순서와 분량(원고 11절, 데모 9개)
2. 그림 A 연결 선(관계, 번호 없음)과 키워드 인자의 엇갈린 선
3. 그림 B에 실행 선 없이 '결과가 같음'으로 보인 것
4. 그림 C: `abc` = 전파되는 종료(`SystemExit(2)`, 점선), `-2` = 처리되는 예외(긴 파선), '표시만' 칸
5. 그림 D '도구가 알려 줄 수 있음'(검사기 미실행, 가능성으로만)과 `bool`·`int` 설명 수준
6. 휴대전화 약 9.9화면 — 탭(I1)·경우/입력 전환(I2·I4·I5)
7. 용어사전 `type-hint`('주석형 정보' 표현)·`input-validation`('M03 API' 표현) 주의 기록(canonical은 수정하지 않음, Owner Gate)

## Scene 08 제작 (2026-10-23)

기준 `bdc0cc5`는 Owner가 지정한 최신 확인 커밋과 같았다. 이번 지시가 승인한 **콘텐츠 제작 단계**로 진행했고, 작성 도구는 Codex이지만 웹 통합 담당 단계까지 넘어가지 않았다. Scene 07 PASS 전달을 반영했으며, Scene 08의 자체 QA를 독립 검토로 간주하지 않는다.

- **원고:** `ledger list --limit 10` 연결 사례 → 지도 읽기 → 강사 경로 3개 → 비교 → 샘플 왕복 → 자기 코드에서 3노드·2관계·1비교 찾기 → AI 결과를 유지/수정/삭제/미확인으로 직접 판단 → 마지막 자기 설명. 단일 파일·클래스 없음·JSON 저장·argparse 없음·미완성 구조를 활동에 포함했다.
- **UX:** 첫 화면은 7개 대표 노드와 관계선 0개. 선택한 관계만 유형·방향·범위와 함께 표시한다. Generator에서 R23·R24를 직접 보고 `list(Generator)` 보관 설명은 Iterator의 R44로 확장한다. PC는 상세 패널, 모바일은 영역/관계/상세/비교 분리. 강사 안내 단계와 의미 관계는 별도 보관한다.
- **후보:** 45노드·24관계·10비교, 새 R/C ID 0. R04는 패키지 분기만, R15는 실제 모듈 한 쌍. R10·R12·R47의 적용 범위를 한정했다. `module`·`json-lines`·`iterator`·`decorator`·`input-validation`은 확장, `init`은 메서드에만 연결. 실제 termId·콘텐츠 존재 확인.
- **검증:** 후보 검증 PASS, 오류 주입 14건 모두 검출. 기존 Scene 05의 인용 줄·AST·임시 사본 실행·Generator/Iterator 객체 확인. `ledger` `d14e812`의 R14·R15·R17·R18 소스 정적 대조(새 실행 추적 없음). 로컬 모형 PC 1280/1000·모바일 390/360·두 글꼴에서 검사. 상세 결과는 [Scene 08 QA](scene-08/visual-qa.md).
- **왕복:** 모형의 선택·이력·필터·모드·스크롤·초점 복원과, 실제 서비스의 장면/사전 링크·history·새로고침 복구 **미구현**을 구분했다.
- **보호:** Scene 01~07 파일, 운영 `data/mission-story-maps/`, B3-1 전체, canonical·기존 기술지도, src·공개 route·정책은 변경하지 않았다. 개요·시나리오·이 인수인계는 Scene 08 연결과 최신 단계만 갱신했다.

**Scene 08 독립 검토 요청:** 관계 행 방식의 학습 밀도, R22/R41 방향, import 중 최상위 실행(C07), Generator 종료(C12), R10/R12/R47의 범위, 직전 선택과 시작 개념을 구별하는 복귀, 학습자 구조 다양성·AI 수정 활동. **Owner 시각 승인과 실제 서비스 QA는 별도 대기**다.

## Owner 판단·독립 검토 요청

1. 8장면 구성과 Scene 03 분할 제안(시나리오 §3)
2. 공통 시각 약속(시나리오 §5.5, Scene 03-A에서 return 선 추가)과 Scene 01 네 구역 구조, 휴대전화 길이(Scene 01 약 4.1, Scene 02 약 5.1, Scene 03-A 약 5.8화면)
3. 가상 예시 `todo` 유지 여부, `ledger` 사례 절의 분량
4. 강사용 안내의 진행 순서와 시연 방식(가상 패키지 실습 준비 필요)
5. 기존 학습 체험 3개(Iterator·Decorator·Type Hint) 재사용 범위(시나리오 §7.2)
6. 개념지도 관계 유형 6종과 노드 묶음 방식(개요 §2·§8)
7. 구버전 문제 기록(시나리오 §7.3) — V01 그림의 순서 문제 등은 기존 자료라 이번에 고치지 않았다

## 남은 미검증·확인 필요

- 코디세이 공식 미션 원문 대조: 공식 목표 1~5 문구, "옵션 표기는 `-`로 통일" 문구 해석, 권장 실행형 `budget_app`, 표준 라이브러리 제한(시나리오 §7.4)
- 실물 휴대전화·프로젝터·다크 테마 웹 표시·화면 낭독기, macOS·Linux 글꼴
- 다른 교육생 구현에서 '내 코드에서 찾아보기'가 통하는지(대체 구조 표는 예상 기반)
- 대면 강의 시간 배분과 학습 효과(시범 운영 전)
- Scene 02 데모의 macOS·Linux 실행(경로 표시, `python`/`python3` 명령 이름), Python 3.14 이외 버전의 오류 문구
- Scene 03-B: 데모의 macOS·Linux 실행(한글 출력 인코딩), AI 보조 질문이 실제 교육생 코드에서 쓸 만한지, 웹 상호작용 I1~I6(구현 전)
- Scene 04: 데모의 macOS·Linux 실행(기본 인코딩이 대개 UTF-8이라 `cp949` 설명은 Windows 사례, `newline=""` 없이 쓴 CSV의 차이는 Windows 전용 현상, `os.replace()` 원자성의 실제 동작), 전원 차단·동시 쓰기 같은 실제 장애, 교육생 코드에서 7개 질문이 통하는지, 웹 상호작용 I1~I6(구현 전)
- Scene 07: Windows·Linux·Python 3.13 이상(오류 문구 `missing 1 required positional argument`·argparse `invalid int value`·`'<=' not supported`는 3.12.13에서만 확인), 정적 타입 검사기(Pylance·mypy 등)의 실제 경고, 교육생 코드에서 10절 활동이 통하는지, 웹 상호작용 I1~I6(구현 전), Owner 시각 승인
- Scene 06: Linux·CPython 이외 구현에서의 실행(macOS·Python 3.12는 확인, 인자 개수 `TypeError` 문구는 버전에 따라 다를 수 있음), 교육생 코드에서 10절 활동이 통하는지, 웹 상호작용 I1~I6(구현 전), Owner 시각 승인
- Scene 05: macOS·Linux·CPython 이외 구현에서의 실행(특히 참조가 사라진 Generator의 정리 시점), 실행 시간(측정하지 않음)·바이트 단위 메모리(경향 비율만), 교육생 코드에서 10절 활동이 통하는지, 웹 상호작용 I1~I6(구현 전), Owner 시각 승인

## 다음 단계 (현재 기준)

1. F01/F02는 이번 스프린트에서 해결했다. 다음 구현에서는 승인 원고·후보·파생 그림의 기준hash와 F05/F06 표시/출처 대응을 고정한다. 검증기 복구 결과와 남은 승인 범위는 위 최신 절을 따른다.
2. Sprint02의 비공개 loader/Manifest/renderer는 완료했다. 후속 Scene상호작용·그림분할·전용adapter/탐색·왕복을 독립 범위로 구현한다. 기존 공개 `/missions/main-M03/story`와9장 가이드는 계속 보호한다.
3. 전9단위 최종 콘텐츠·시각, 별도 지도 URL/진입 문구는 Owner Gate로 확정한다. 승인 후 실제 장면↔지도↔사전 왕복·history/forward/reload·초점/스크롤·모바일·보호 대상 회귀를 검증한다.
4. 최종 공개 승인·PR 검토·병합·배포는 별도 단계다. Scene 08 콘텐츠 PASS와 표현 방식 승인만으로 생략하지 않는다.

Push는 Owner가 수행한다: `git push origin content/b2-1-story-map-foundation`
