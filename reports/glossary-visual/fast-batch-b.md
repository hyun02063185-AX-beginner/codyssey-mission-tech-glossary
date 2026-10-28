# Glossary Visual Fast Batch B — QA

- 작업일: 2026-10-28 (Asia/Seoul)
- 기준: 최신 `origin/main` `f844a662f8e8ce841316b37ad87ac8fd6d703f77` (Batch A 병합).
- 브랜치: `feature/glossary-visual-fast-batch-b`.
- 검증한 구현 Commit SHA: `4c4def710e59a054744183d16c332ecf35c58f65`.
- Push 결과: `git push -u origin feature/glossary-visual-fast-batch-b` 성공, 원격 추적 브랜치 설정 완료. 이 보고서·캡처만 추가한 후속 QA 커밋의 최종 HEAD는 PR·완료 메시지에 기록하며 `git log -1 --format=%H -- reports/glossary-visual/fast-batch-b.md`로 조회한다.

## 적용 결과

| 용어 | 공유 그림 | 기존 본문 보존 | PC/모바일 | 상태 |
| --- | --- | --- | --- | --- |
| public-ip | assets/public-private-ip.svg | 전체 기존 문단·코드·주의·평가 질문 보존, 인터넷 라우팅·접속 조건 연결 문장 추가 | PASS | 완료 |
| private-ip | assets/public-private-ip.svg | RFC 1918 범위·코드·주의·평가 질문 보존, 내부 주소 재사용·사설망 경로·ENI 연결 문장 추가 | PASS | 완료 |

두 용어 모두 기존 절 순서와 관련 용어 목록을 유지하고 그림을 한 번만 표시한다. 미등록 그림 대체 설명 계약도 유지한다. canonical 523개 ID·분류·관계·missionRefs는 기존 계약 해시로 검증했다. 신규 대상 외 521개 생성 용어 객체도 기준 커밋 해시와 일치한다. 기존 Batch A·B6-1 자산 및 B3-1 Story·지도·가이드 원본은 수정하지 않았다.

## 그림 출처와 새 파일

하나의 논리적 비교 그림을 PC·모바일 두 SVG로 구현했다. 기존 승인 SVG 파일을 수정하거나 이미지 생성 도구로 새 시안을 만들지 않았다.

- 메시지·사례: `src/b31Foundations/B31Foundations.tsx`의 `AddressVisual()`·`AwsComparison()`, `foundations.css`, `content/mission-stories/main-m05/network-foundations-patch-v0.1.md`.
- AWS 역할 관계 참조: `content/mission-guides/main-m05/assets/aws-network-roles.svg`.
- 새 PC판: `src/assets/glossary/b3-1/public-private-ip-desktop.svg` (760px 원본, 비교 나란히).
- 새 모바일판: `src/assets/glossary/b3-1/public-private-ip-mobile.svg` (360px 원본, 비교 위아래).
- 등록: 기존 TermRichContent의 figures·700px 이하 모바일 선택 기능을 그대로 사용. 새 network 레이아웃은 PC 최대 760px, 모바일 최대 360px로 제한.
- 접근성·충돌: role=img, title·desc 및 판별 고유 ID `gvb3-ip-d-*` / `gvb3-ip-m-*`. 공통 CSS는 `.gvb3-ip` 내부에 한정. 두 판의 desc 내용 일치. 외부 자원·스크립트·애니메이션 없음.

## 기술 정확성 검토

일반 원리를 위에 두고 과거 AWS IPv4 사례를 아래로 구분했다. 공인 IP는 인터넷 라우팅에 쓰지만 접속 성공을 보장하지 않으며, 사설 IP는 조직 간 재사용 가능·공용 인터넷 직접 라우팅 불가·적절한 사설 경로를 통한 내부망 간 통신 가능을 명시한다. 사설망 통신에 NAT가 항상 필요하지 않다고 표시했다.

AWS 사례는 인터넷 사용자 → EC2에 연결된 공인 IPv4 → IGW의 1:1 변환 → VPC/Public Subnet 안 EC2 ENI의 사설 IPv4 및 Nginx 관계를 보여 준다. 공인 IPv4는 OS 영역 밖에 두고 OS 직접 설정이 아님을 명시한다. Route Table·Security Group은 통과 장비가 아닌 경로 설정·ENI 허용 규칙으로 별도 표시한다. Public Subnet과 공인 IP, IGW 변환과 별도 NAT Gateway를 구분한다. OS 방화벽·서버 수신도 조건에 포함했다.

공인 주소 자리를 대신한 `203.0.113.10`은 문서용·실제 접속 불가로 표시했다. VPC `10.0.0.0/16`, Subnet `10.0.1.0/24`, ENI `10.0.1.x`(범위 예시)를 재사용했다. **2026-10-14 배포 기록 기반이며 현재 AWS 운영 상태가 아님**을 그림·캡션에 남겼다.

현재 공식 문서의 [AWS Internet Gateway: IPv4 NAT 및 OS가 인식하는 사설 주소](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)와 대조했다. 사설 주소 원리는 [RFC 1918](https://www.rfc-editor.org/rfc/rfc1918.html), 문서용 주소 표기는 [RFC 5737](https://www.rfc-editor.org/rfc/rfc5737.html)에 근거한다. 이 검토는 실제 AWS 운영 상태 조회나 별도 GPT 독립 최종 검토가 아니다.

## 자동·집중 QA

Windows 실행 환경: `PYTHONUTF8=1`, `PYTHONIOENCODING=utf-8`.

| 명령 | 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS: 523 canonical, 0 errors / 0 warnings (기존 INFO 788건) |
| `npm run content:integrity` | PASS: 새 경고 0 |
| `npm test` | PASS: 39개 파일, 488개 테스트 |
| `npm run build` | PASS: 기존 B2-1 build-check 포함 |
| `npm run build:extension` | PASS |
| `npx playwright test playwright/glossary-visual-fast-batch-b.spec.ts --workers=2` | PASS: 7개 테스트 |
| `node scripts/check_glossary_visual_extension.mjs --fast-batch-b` | PASS: 실제 MV3 Chromium 153.0.8010.12, 빠른 용어 23개·그림 용어 7개, 오류 0 |
| `git diff --check` | PASS |

브라우저 범위: 두 용어 × 1280/390/360px × Forest/Paper. 원문 절 순서, 그림 한 개, SVG 접근성 이름·설명·캡션, 관련 링크 이동, 페이지/그림 가로 넘침 없음, viewBox 밖 글자 없음, 표시 글자 크기 11px 이상 및 대비 4.5 이상, 필터 미적용을 검사했다. 700/701px 경계 왕복 선택 정상. DOM·JOIN 그림은 같은 두 테마·세 폭에서 간단 회귀했다. 계약 테스트는 두 용어의 원문 모든 문단·기존 코드·RFC 범위·관련 용어·질문을 보존하는지 확인한다.

실제 확장에서는 기존 ERD·FK·JOIN·CIDR·SSH 및 공인/사설 IP 상세가 SVG/img 없이 평문으로 표시되며 이미지 Markdown이 노출되지 않는지 확인했다. 관련 용어 이동 및 기존 오픈북 빠른 용어 23개도 정상이다. Chrome 확장 주요 구조는 변경하지 않았다.

## 대표 캡처 (2장)

그림과 캡션 영역을 저장하고 직접 열어 확인했다. 같은 그림을 공유하므로 중복 캡처를 만들지 않았다.

- PC: `reports/glossary-visual/fast-batch-b/public-ip-1280-forest.png`.
- 모바일: `reports/glossary-visual/fast-batch-b/private-ip-390-paper.png`.

두 판 모두 공통 개념·AWS 사례 구분, 주소·화살표·규칙 영역·출처 문구를 읽을 수 있으며 글자 겹침·잘림을 발견하지 못했다. 긴 실행 로그와 임시 확장 결과는 Git에 넣지 않았다.

## 미검증·공개 경계

미적용·알려진 구현 실패 없음. 실제 휴대폰 Safari/Chrome, 스크린리더 음성 낭독, 프로젝터, Indigo/Signal 별도 시각 검수, 기존 사용자 Chrome 프로필의 네이티브 Side Panel UI, 실제 AWS 자원 및 공개 배포 화면은 미검증이다. Forest/Paper와 세 폭은 위 범위에서 검증했다.

GPT 최종 검토·Owner 공개 승인 대기용 Draft PR까지만 진행한다. main 병합과 배포는 수행하지 않는다.
