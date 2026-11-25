# B3-2 미션 스토리 v0.2 자체 검토

**검토일** 2026-11-23 · **상태** Owner 콘텐츠 검수 대기

| 대상 | 대조 기준 |
| --- | --- |
| 공개 v0.1 | 용어사전 `origin/main` `e13f3f69`, 원고와 `_tools/screens.json`의 4 Scene·8화면. [v0.1 원고](storyboard-v0.1.md) · [v0.1 웹 QA](../../../reports/b32-story-web/README.md) |
| 흐름 탐색 PoC | `feature/b32-flow-navigator-v02` `f39ace15`의 6단계 ID, 역할, 분기와 슬라이드 연결. [Draft PR #53](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/53) |
| 실제 프로그램 | `Codyssey_B3-2` 원격 `main`과 로컬 `be21c499` 일치. [실제 소스][b32] |
| 운영 기준 | [학습 운영 정책 v1.1](../../../docs/mission-guides/learning-operation-policy.md) · [공통 UI 기준 v1.2](../../../docs/mission-guides/mission-ui-standard.md) · [제작·검토·통합 절차](../../../docs/mission-guides/workflow.md) |

대화와 저장소에서 별도로 작성된 S1-1~S4-2 해설 시안 원문은 확인되지 않았습니다. v0.1의 해당 화면, 실습 증거와 이번 작업 지시의 교육 방향을 바탕으로 8개 해설을 작성했습니다.

## v0.1 대비 변경 요약

| 항목 | v0.2 원고에서 제안한 변경 |
| --- | --- |
| 제목과 학습 목표 | Python에서 외부 AI 서비스를 호출하는 방법을 앞으로 가져왔습니다. Git 변경과 커밋 메시지·PR 설명은 같은 기술을 배울 수 있는 한 가지 사례로 사용합니다. |
| Scene 1·2 | Scene 1은 서비스에 맡길 일과 설명에 필요한 자료를 먼저 소개합니다. Scene 2는 그 자료를 Python이 로컬 Git을 실행해 수집하고 판단하는 방법으로 이어 갑니다. |
| Scene 3 | S3-1의 검사한 Git 문맥이 S3-2 요청의 `user` 메시지에 들어갑니다. S3-2의 제목, 설명, 그림 제안에서 요청·응답 방향과 인증 헤더·본문·응답 텍스트의 차이를 강조합니다. |
| Scene 4 | 같은 변경으로 얻은 실제 초안과 후처리를 사례로 사용합니다. 프로그램의 검사와 사용자의 사실 확인을 차례로 보여 줍니다. |
| 자율 복습 | 화면별 **화면 해설**을 8개 추가합니다. 기존 강사 스크립트, 학습자 접힘 설명, 발표자 시연, 관련 링크는 화면 ID로 이어 씁니다. |
| 전체 흐름 | 실행 순서 6단계와 교육 순서 4 Scene의 관계를 명시하고, 5단계에 요청·응답 상세를 제안합니다. [흐름 탐색 제안](flow-preview-content-v0.2.md) |

## 소스 및 실행 근거 대조

| 확인 항목 | 판정과 근거 |
| --- | --- |
| 로컬 Git과 실행 순서 | **PASS.** `main()`은 인수를 읽고 현재 디렉터리의 Git 변경을 수집합니다. `_git()`은 인수 목록으로 Git을 실행하며, `collect_changes()`는 상태·파일명·staged/unstaged diff를 로컬에서 읽습니다. Git 성공 후 `has_changes`가 보는 값은 상태 문자열입니다. 실패와 변경 없음은 둘 다 AI 요청 0회이며 종료 상태는 다릅니다. [진입점][main] · [Git 수집][git] |
| 문맥과 보안 | **PASS.** 브랜치, 상태, 변경 파일명, 미추적 파일명, staged/unstaged diff를 순서대로 묶습니다. 마스킹은 일부 패턴의 값을 가리는 처리입니다. 위험 경로·불완전한 개인키 블록은 기본 모드에서 차단하고, 16,000자를 넘으면 `--unsafe`에서도 막습니다. 자동 검사의 탐지 한계를 S3-1 해설에 명시했습니다. [전송 문맥 검사][security] |
| API 요청·응답 | **PASS.** Python이 HTTPS POST로 인증 헤더와 UTF-8 JSON을 보냅니다. 모델 ID, 작성 규칙(`system`), 검사한 Git 문맥(`user`)이 요청 본문의 기본 내용입니다. 선택 파라미터는 지정 시에만 추가됩니다. Python은 응답 JSON의 `choices[0].message.content`에서 글을 읽습니다. 모델 실행 위치와 공급자의 선택 파라미터 지원은 미확인입니다. [클라이언트][client] · [작성 규칙][prompts] |
| 결과 검증과 사람이 하는 일 | **PASS.** `validate_commit()`은 커밋 제목 등을, `validate_pr()`은 제목, 필수 섹션과 불릿, 제목·Why·What의 대표적 테스트 수행 주장을 검사합니다. 통과한 PR의 How to Test 전체는 `- 실행 권장: python -m unittest discover -s tests`로 교체합니다. 프로그램은 초안을 터미널에 출력합니다. 실제 커밋·push·PR 등록은 사람이 수행하는 별도 작업입니다. [검증기][validators] · [진입점][main] |
| 근거의 종류 | **PASS.** 2026-10-20 실제 API 실행의 터미널 출력은 보존된 전문에 연결했습니다. 806자 문맥과 요청 JSON은 재현이며, 검증기 입력 예시는 교육용입니다. 응답 원본 JSON과 실습 메모의 당시 위치는 미확인입니다. 원문 “파일 끝에”를 실제 오류로 판정하지 않았습니다. [실제 출력](assets/evidence/real-output-2026-10-20.txt) · [요청 재현](assets/evidence/demo-request.json) · [검증기 예시](assets/evidence/validator-demo.txt) |

## 자체 QA와 다음 검토

| 항목 | 결과 |
| --- | --- |
| 원고 구조 | **PASS.** 기존 JSON의 제목·메시지와 대응표의 v0.1 열을 글자 단위로 대조했습니다. 4 Scene·8화면 ID·순서와 새 제목 연결을 확인했습니다. |
| 화면 해설 | **PASS.** P 해설 8건에 화면별 핵심 개념, 그림의 동작, B3-2 실제 사용을 담았습니다. 각 해설은 4~5문장이고 더 읽기는 별도 가이드 링크입니다. 기존 강사 스크립트와 학습자 접힘 설명은 v0.1 원고의 같은 화면 ID로 보존했습니다. |
| 흐름 탐색 연결 | **PASS.** PoC의 6단계 ID·8슬라이드 링크와 제안 표를 대조했습니다. 화면 S1-2와 S2-1에서 달라 보이는 교육 순서와 실행 순서를 설명했습니다. |
| 교육 설계 | **PASS(자체).** 대면 설명은 Scene 3의 요청·응답에 가장 많은 시간을 두고, 복습용 P 해설과 실습용 가이드로 상세를 이어 갑니다. B3-2 개념지도 연결은 미구현입니다. |
| 근거와 변경 범위 | **PASS.** B3-2 로컬·모의 단위 테스트 14건과 문서의 근거 파일·가이드 경로를 확인했습니다. 이번 브랜치의 변경은 신규 Markdown 3개입니다. 공개 원고·SVG·웹 구현·라우트·배포 설정은 기준 커밋과 같습니다. |
| 실제 재호출·공식 원문 | **미검증.** 외부 AI를 새로 호출하지 않았습니다. 실제 실행은 보존된 기록에 근거합니다. 공식 평가 원문 직접 대조는 기존 기록의 미확인 항목입니다. |
| 승인 및 화면 확인 | **미검증.** 독립 콘텐츠 검토와 Owner 승인 이후의 웹 통합 단계에서 제목·부제 배치, S3-2 그림, P 키·터치 동작, 강의실 PC와 360/390px 모바일 가독성을 확인합니다. |

검토 순서는 제목·부제와 학습 목표 → S3-2 그림에서 요청과 응답의 방향 → 8개 화면 해설과 실제 사례 표기입니다. Owner 콘텐츠 검수 전에는 병합과 배포를 보류합니다. 승인할 콘텐츠 커밋을 정한 뒤 Codex 단계에서 슬라이드 메타데이터, SVG 및 미리보기에 반영합니다. [v0.2 원고](storyboard-v0.2.md)

[b32]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/tree/be21c4994a93bc943a6783ea380c50f61aa7c45b
[main]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/main.py#L26-L52
[git]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/git_collector.py#L21-L63
[security]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/security.py#L21-L43
[client]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/ai_client.py#L26-L58
[prompts]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/prompts.py
[validators]: https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b/ai_gitgen/validators.py#L13-L43
