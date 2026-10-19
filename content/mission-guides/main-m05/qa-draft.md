# B3-1 별도 학습 가이드 — 초안 QA

> 기준: 웹 소스 저장소 `main`의 `84a4f9013ef3ea3a7bedd1ceaa1302b30c7310de`에서 분기한 `content/b3-1-learning-guide-draft`. 사례 출처는 `Codyssey_B3-1`의 `c68929943f1904a5c7c8033d2d49a30ace56e3d1`.

후속 검토에서 사용자가 밝힌 핵심 학습 목표는 **AWS 구성 요소를 일반적인 네트워크 구성의 역할·용어와 연결하는 것**입니다. 첫 초안은 해당 요소들을 여러 장에 흩어 설명했으므로, 2장을 전체 역할 대응의 중심 장으로 수정했습니다. 기존 미션 수행 중 질문 원문을 대조한 것은 아닙니다.

## 변경 전후

| 항목 | 변경 전 | 변경 후 |
| --- | --- | --- |
| B3-1 학습 경로 | SSH 키·CIDR 용어와 AWS 역할 설명은 있으나 별도 장별 가이드 없음 | `main-m05`에 입문용 7개 장·강사 노트 추가. **2장에서 일반 네트워크 ↔ AWS 역할 대응을 전체 학습의 중심으로 제시** |
| 사례 연결 | 배포 기록과 개념 자료가 분산 | 당시의 빌드 → 주소 → 경로 → 보안 → 접속 → 웹 제공 → 검증 흐름으로 연결 |
| 그림 | 기존 용어/역할 설명에 3종 SVG | 검토된 같은 파일 3종을 가이드에 복사하여 사용 |
| 공개 경로 | B3-1 장별 가이드 없음 | **변경 없음**. 메뉴·라우트 연결은 이번 초안 범위 밖 |

## 확인 결과

| 결과 | 항목 | 근거와 범위 |
| --- | --- | --- |
| PASS | 7개 장의 사례 사실 | 고정 커밋의 README·배포 기록·Nginx 설정·재배포 설계와 대조. 당시 구성과 향후 제안을 구분 |
| PASS | 일반 네트워크 ↔ AWS 대응 | 이미 공개된 `network-aws-role-comparison`의 역할표·그림·주의점과 2장을 대조. VPC·Subnet·ENI·Route Table·IGW·SG·EC2/Nginx가 맡는 일을 물리 장비와 1:1로 단정하지 않음 |
| PASS | CIDR·IGW·보안 그룹 설명 | [AWS VPC 개요](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html), [Subnet·Route Table](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html), [Subnet CIDR](https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html), [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html), [EC2 Security Group](https://docs.aws.amazon.com/us_en/AWSEC2/latest/UserGuide/ec2-security-groups.html) 공식 문서와 대조 |
| PASS | Markdown 내부 상대경로 | 초안 Markdown의 로컬 링크·이미지 경로를 파일 존재 여부로 검사 |
| PASS | 외부 사례 링크의 파일 경로 | 고정 커밋으로 지정한 B3-1 경로가 로컬 복제본에 존재함을 검사. URL의 섹션 앵커 동작은 별도 미검증 |
| PASS | SVG 원본 재사용 | 3개 복사본을 기존 `src/assets/b3-1/`와 바이트 단위 비교하고 XML 파싱. 기존 파일의 텍스트와 의미는 변경하지 않음 |
| PASS | Git 변경 범위 | `content/mission-guides/main-m05/`만 추가. 기존 용어·관계·taxonomy·웹 route 변경 없음 |
| 미검증 | 현재 AWS 상태 | 실계정에 접속하지 않음. 2026-10-14의 IP·서버 상태·외부 접속 결과를 현재 상태로 주장하지 않음 |
| 미검증 | 기존 개념 연결의 현재 접속 상태 | 저장소의 `PUBLISHED` 데이터와 화면 route는 확인했지만, 현재 GitHub Pages 화면의 실제 접속은 이 QA에서 확인하지 못함 |
| 미검증 | 원본 미션의 모든 필수·선택 조건 | 미정제 용어 추출본만 확인. `GET /health`·HTTPS·Docker의 완료를 주장하지 않음 |
| 미검증 | 새 가이드의 실제 브라우저 렌더링 | 공개 route 미연결. Markdown 리더/사이트에서의 모바일·테마·접근성 화면 QA 미실시 |

## 남은 검토

1. **교육 내용 검토:** 교육생 대상의 난이도·분량, 실제 미션 요구와의 부합 여부를 Owner가 확인합니다. 원본 미션 문서가 제공되면 `GET /health` 등 필수 조건과 사례 차이를 다시 대조합니다.
2. **모바일 그림:** 재사용 SVG는 폭 520px이며 텍스트가 작습니다. 2장에서는 두 그림을 사용합니다. Markdown 화면은 그림이 축소될 수 있으므로 파일을 따로 확대해 읽도록 안내했습니다. 공개 사이트에 연결할 때 가로 스크롤 또는 반응형 처리와 시각 QA가 필요합니다.
3. **공개 연결:** 장별 가이드를 웹의 B3-1 메뉴에 노출하려면 route 계약에 닿습니다. 이 초안에는 적용하지 않았으며, 게시 단계에서 Owner 검토 후 별도 구현·QA가 필요합니다.
4. **배포 현재성:** AWS 버전을 최신으로 소개하려면 실제 재배포 커밋·시각·내외부 화면 증빙이 필요합니다. 현재 기록만으로는 판단할 수 없습니다.

**판정:** 별도 학습 가이드의 **검토용 초안으로 사용 가능**. 공개 게시 판정은 원본 미션 대조와 모바일·웹 통합 QA 뒤에 합니다.
