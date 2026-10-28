# 잔여 raw 2개 콘텐츠 보완 검토 보고서

- 작업일: 2026-10-28 (Asia/Seoul), Windows.
- 기준: main `76534116832b8ee1cec46d31a8aebdcaf7cf027b`. 시작 시 작업 트리 깨끗함, fetch 후 origin/main 일치.
- 브랜치: `content/glossary-final-raw-two`.
- 콘텐츠·데이터·테스트 검증 커밋: `66553cb0df8d3756fbc6b8181b36ca76cd6f3afd`. 이후 이 보고서만 추가한다.

## 실제 보완과 기술 검토

**Thread — PASS.** Process의 공유 메모리·열린 파일과 Thread별 실행 위치·스택을 구분했다. 전역 counter의 읽기→계산→쓰기에서 두 Thread가 같은 0을 읽어 갱신 하나가 유실되는 과정을 설명했다. Barrier로 읽기 시점을 맞추고 Lock은 전체 임계 구역을 보호한다. GIL이 복합 공유 상태 변경을 자동으로 안전하게 만들지 않음을 명시했다.

**Thread 실행 예제 — PASS.** Markdown에서 Python 코드를 추출해 `python3 -X utf8 -c <code>`로 20회 실행했고, 20/20 모두 `without lock: 1` / `with lock: 2`였다. 외부 의존성·sleep·우연한 경쟁 발생에 의존하지 않는다. Barrier는 첫 사례에서 읽기 완료를 맞추는 도구이고 counter 임계 구역 보호용이 아님을 설명했다. Lock 내부 Barrier 대기가 진행을 막는 이유도 명시했다. 추가 단위 테스트가 원고의 실제 코드를 실행하고 생성 데이터의 codeExample과 동일함을 검사한다.

**JWT RFC 대조 — PASS.** 다음 공식 규격에 따라 역할·형태·검증 경계를 보완했다.

| 근거 | 반영 |
| --- | --- |
| [RFC 7519 §3](https://www.rfc-editor.org/rfc/rfc7519.html#section-3) | JWT의 JSON Claim 묶음은 JWS 또는 JWE 구조에 담길 수 있음 |
| [RFC 7515 §3.1](https://www.rfc-editor.org/rfc/rfc7515.html#section-3.1) | JWS 서명/MAC과 Compact 3부분; MAC은 같은 키를 가진 주체들이 생성·검증할 수 있음을 설명 |
| [RFC 7516 §3.1](https://www.rfc-editor.org/rfc/rfc7516.html#section-3.1) | JWE 암호화와 Compact 5부분: protected header / encrypted key / IV / ciphertext / tag |

서명과 암호화, 인코딩을 구분했다. 서명된 payload를 비밀 저장소로 쓰지 않으며, 암호학적 검증과 서비스 정책에 따른 exp/iss/aud 존재·값 검증은 별개다. JWT만으로 인증·인가 정책이 완성되지 않는다. 예시는 형태 비교용 자리표시자로 명시했고 실제 보안 토큰이나 인증 시스템을 구현하지 않았다.

두 원고 모두 기존 섹션 순서·미션 문맥·관련 용어·동료평가 질문을 기준 Git blob과 비교해 보존했다. 코드 절에는 코드 블록만 두어 기존 빌더가 설명 문장을 codeExample에 포함하지 않도록 했다. 빌더는 수정하지 않았다.

GPT-6.1 Sol / Medium 별도 검토자가 원고와 테스트 계약을 독립 검토했다. 사실·입문 난이도·보호 범위에서 필수 수정 0건. 새 fixture의 두 객체가 기준 커밋과 동일함도 독립 확인했다. 이는 Owner 최종 승인이나 reviewed/published 승격을 뜻하지 않는다.

## 상태·생성 데이터 정합성

| 항목 | 전 | 후 |
| --- | ---: | ---: |
| Canonical | 523 | 523 |
| drafted | 521 | 523 |
| raw | 2 | 0 |

`thread`, `json-web-token`만 raw→drafted. Canonical의 나머지 521개 객체 및 두 항목의 상태 외 메타데이터가 기준과 동일하다. ID·순서·상위 구조 유지. reviewed/published 0개.

웹·확장 생성 JSON 각각에서 정확히 두 항목만 변경됐다. thread는 technicalExplanation/codeExample/limitationsOrEdgeCases, JWT는 summary/easyExplanation/technicalExplanation/codeExample/limitationsOrEdgeCases 및 각각 contentStatus만 변경됐다. 다른 필드와 다른 521개 전체 객체는 동일하다. hasDetailedContent는 523개 모두 true 유지. 웹·확장 JSON 바이트 단위 동일. 두 codeExample이 원고 코드 블록과 일치하며 Markdown fence나 절 밖 설명이 섞이지 않는 것도 확인했다. JSON 전체 재포맷 없음.

## 테스트 계약 및 QA

기존 33개 명시 목록·drafted·523개 고유 ID 검사를 유지했다. 신규 2개 상태·최종 집계, 두 항목 기타 모든 필드 불변, Thread 코드 실행 검사를 추가했다.

과거 상태 투영 helper는 기존 33개와 신규 2개의 contentStatus만 raw로 투영한다. 이번에는 본문도 바뀌므로 별도 beforeFinalRawTwo에서 두 항목의 위 명시된 콘텐츠 필드만 과거 값으로 재구성한다. 새 `final-raw-two-baseline.json`은 기준 커밋의 두 객체만 저장하며 기존 fixture의 해시는 바꾸지 않는다. 두 항목의 나머지 필드는 현재값을 유지하고 별도 전체 객체 비교로 보호한다. 기존 본문·시각자료·링크·메타데이터 검사와 역사 해시 기대값 유지, skip·검사 삭제·fixture 일괄 재생성 없음.

Python 3.14.6의 python3 명령 정상 작동. 프로세스 환경 PYTHONUTF8=1 사용, 프로젝트 환경·빌드 설정 변경 없음.

| 명령 | 최종 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS: canonical 523, mission-local 46, 오류 0 / 경고 0 |
| `npm run content:integrity` | PASS: 검사 대상 상세 522, 고유 미션 본문 522, 템플릿·모순·새 경고 0 |
| `npm run build:extension` | PASS: 기존 deep-link·생성물 계약 검사 포함 |
| `npm run build` | PASS: TypeScript·Vite·B2-1 빌드 계약 통과, 청크 크기 경고 있음 |
| `npm test -- --maxWorkers=2 --testTimeout=20000` | 512 통과 / 기존 실패 1 (513개), 파일 40 통과 / 1 실패 |
| `git diff --check` | PASS |

같은 Windows·Python·Node·의존성으로 별도 detached worktree의 main `7653411`에서 동일 npm test를 실행했다. 기준선은 509 통과 / 1 실패(510개). 보완 후 추가 3개 검사 모두 통과하며 **신규 실패 0건**이다.

양쪽의 유일한 실패는 `scripts/b31_packet_journey.test.ts:16` 원본 HTML의 Windows CRLF 증빙 해시 불일치다. 기대 `24e3c557520bb57a6044648d985a1445da1dba2a3a4324066f732fbef7430410`, 실제 `e3fe28c0e6ed6cd12f3d1c18024437897bc709615fccb69eeea0662b7728cb8d`. 이번 범위에서 수정하지 않았다. 전체 단위 테스트 종료 코드는 1이며 전체 PASS로 보고하지 않는다.

## 변경 파일 및 Owner Gate

1. `content/terms/thread.md`
2. `content/terms/json-web-token.md`
3. `data/curated/glossary-master-v0.1.yaml`
4. `src/data/generated/glossary.json`
5. `dist-extension/glossary.json`
6. `scripts/glossary_visual_contract.test.mjs`
7. `scripts/fixtures/final-raw-two-baseline.json` — 두 대상의 변경 전 데이터만 신규 기록
8. `reports/glossary/glossary-final-raw-two.md` — 본 보고서

다른 용어 본문·B3-1·Atlas/Encyclopedia·관계·분류·Chrome UI·공개 route·기존 빌더 변경 0건. 의도하지 않은 변경 없음.

Draft PR로 검토 요청한다. GPT 독립 검토 완료, Owner 최종 승인 대기. main 병합·GitHub Pages 배포 없음. 기존 Windows CRLF 해시 실패는 별도 작업으로 남긴다.
