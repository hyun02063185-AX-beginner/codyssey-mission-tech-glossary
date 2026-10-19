# B3-1 학습 가이드 인수인계

> 갱신일: 2026-10-19. 단계: **Owner 원고 확인 후 웹 통합 QA 완료, PR #4 검토 대기**. 이 파일은 진행 상태이며 PR 병합·공개 검증 기록이 아니다.

## 목적과 고정된 방향

- 대상: B3-1을 수행하는 코디세이 교육생. 네트워크·AWS 초심자와 다른 배포 방식을 선택한 교육생도 읽는다.
- 중심 질문: 일반 네트워크 구성의 역할·용어가 AWS의 자원·서비스와 어떻게 대응하는가. 물리 장비와 AWS 자원을 1:1로 단정하지 않는다.
- 실제 사례는 `Codyssey_B3-1` 커밋 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`에 고정한다. 당시 기록과 현재 AWS 상태, 미션 요구사항과 구현 선택을 구분한다.

## 현재 산출물과 절차 상태

| 항목 | 현재 사실 | 절차상 판정 |
| --- | --- | --- |
| Codex가 만든 7장 원고·강사 노트·SVG 재사용 | `2ec3aef`까지 작성. [초안 QA](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/2ec3aef/content/mission-guides/main-m05/qa-draft.md)에 확인 범위 기록 | 최초에는 참고 초안. 이후 Claude Code가 원본과 대조하고 SVG 2종을 수정했다. |
| Claude Code 콘텐츠 담당 | 별도 브랜치 `claude/b3-1-learning-guide-review`의 `0c4c2ae`(자체 검토), `958b47a`(그림·기록 수정), `d1de30c`(기록 정확화). 7장 본문은 유지, 가이드 복사본 SVG 2종과 `content/mission-guides/main-m05/author-review.md`를 수정 | **로컬 커밋 완료.** Owner가 2026-10-19 대화에서 원고 내용을 확인했다고 알렸다. 콘텐츠 브랜치의 원격 Push는 Owner 단계로 남아 있다. |
| GPT 독립 콘텐츠 검토 | 원본 배포 커밋과 7장·강사 노트·그림을 대조하여 SVG의 SSH 지문·CIDR `/0` 표현과 검토 기록의 과장을 발견. Claude Code 수정 후 [독립 검토 기록](b3-1-independent-review.md)대로 재확인 | **PASS**. Owner의 원고 확인 보고를 받아 `d1de30c`을 웹 통합 기준으로 사용했다. |
| Codex 웹 연결 | `541eefd`에서 B3-1 미션 링크·7장 route 연결. 이후 `d1de30c`의 SVG 2종·콘텐츠 담당 기록을 통합하고 [웹 QA](../../content/mission-guides/main-m05/qa-web.md)에 재검증 결과를 추가 | 승인 원고와 실제 웹 소스 대조, 영향 범위 브라우저·빌드 QA 완료. 공개 Pages는 미검증. |
| QA 기록 | 빌드·Playwright·일부 시각·경로 검사가 통과했다는 당시 기록 | 해당 커밋의 실행 근거로만 재사용한다. 독립 콘텐츠 검토나 공개 Pages 확인을 대신하지 않는다. |
| GitHub PR | [#4](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/4)에 통합 변경을 반영해 Owner 검토 대상으로 올린다. 역할 절차 PR [#5](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/5)는 2026-10-19 병합됨. | #4의 최종 Push·Ready 상태와 head는 GitHub에서 다시 조회한다. Owner가 병합을 판단한다. |

## 다음 담당자에게

1. **Owner:** 콘텐츠 브랜치를 원격에 별도로 공유하려면 로컬 저장소에서 `git push origin claude/b3-1-learning-guide-review`를 실행한다. 갱신된 PR #4를 검토·병합한다.
2. **Codex:** 병합 후 Pages 공개 주소에서 B3-1 진입과 핵심 표·그림을 확인한다.

원본 미션의 모든 필수·선택 조건, 현재 AWS 자원 상태, 실물 휴대전화·모든 테마, 공개 Pages 화면은 아직 검증하지 않았다. 새 채팅에서는 이 문서의 기록일과 Git·PR의 실제 상태를 먼저 대조한다.
