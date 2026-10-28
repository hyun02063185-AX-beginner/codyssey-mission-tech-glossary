# Glossary Visual Fast Batch C — QA

- 작업일: 2026-10-28 (Asia/Seoul), 브랜치: `feature/glossary-visual-fast-batch-c`.
- 기준: 최신 origin/main `37acdf1fb91aea697c6d0ce9274ade887ac1ed89` (Batch B PR #32 병합).
- 검증한 구현 HEAD SHA: `40147a28bca72e583fa98a0c2321968733d70c8d`.
- Push: `git push -u origin feature/glossary-visual-fast-batch-c` 성공. 이후 보고서·대표 PNG만 추가한 QA 커밋의 최종 HEAD는 완료 메시지와 PR에 남긴다. `git log -1 --format=%H -- reports/glossary-visual/fast-batch-c.md`로 보고서를 포함한 최종 QA 커밋을 조회할 수 있다.

## 적용 및 본문 개선

| 용어 | 그림 | 본문 | PC·모바일 | 결과 |
| --- | --- | --- | --- | --- |
| packet | IP → TCP → HTTP 포함 구조와 역할 비교, PC/모바일 신규 SVG | 기존 정의·비유·IP/TCP/HTTP 설명·B3-1 사례·코드 도식 보존. TCP 기반 예시의 범위를 한정하고 HTTP/3·TCP 보장 범위·NAT/경로/허용 규칙을 보완 | PASS | 완료 |
| responsive-web-design | 같은 콘텐츠 A/B/C를 1·2·3열로 재배치, PC/모바일 신규 SVG | 한 줄 정의 보존. 단순 축소와 재배치 구분, HTML/CSS·Media Query·Breakpoint·Mobile First 설명 및 짧은 Grid CSS 예시 추가 | PASS | 완료 |

정의 → 비유·쉬운 설명 → 그림 → 기술 설명 → 미션 사례 순서로 읽도록 기존 쉽게 설명하면 절 끝에 그림을 배치했다. 모든 기존 절 순서·관련 용어·평가 질문·흔한 오해를 유지했다. 패킷의 고정폭 텍스트 코드는 기술 정보 보존을 위해 그대로 남겼으며 웹의 기존 코드 스크롤 영역에서 표시한다. 새 절이나 canonical 용어를 만들지 않았다.

## 그림 출처·제작

신규 벡터 SVG 4개를 코드로 제작했다. 기존 자료는 메시지·관계·주소·기준 폭을 참고했으며 원본 파일은 수정하지 않았다. 추가 시안·디자인 승인 브랜치는 만들지 않았다.

- 패킷 참고: `src/b31Foundations/B31Foundations.tsx`의 PacketVisual(), `foundations.css`, `content/mission-stories/main-m05/network-foundations-patch-v0.1.md`.
- 반응형 참고: `content/mission-guides/main-m01/assets/v03-responsive-layout.svg`, `chapters/03-responsive-layout.md`.
- 새 파일: `src/assets/glossary/p2/packet-layers-desktop.svg`, `packet-layers-mobile.svg`, `responsive-layout-desktop.svg`, `responsive-layout-mobile.svg`.
- 등록 경로: `assets/packet-layers.svg`, `assets/responsive-layout.svg`.
- PC판 원본 폭 760px, 모바일판 원본 폭 360px. 기존 network 표시 규칙과 700px 이하 모바일 선택 기능 재사용. `repair.css` 및 렌더러 구조 변경 없음. 그림 안 768/1024px는 학습용 레이아웃 기준이며 SVG 전환 기준 700px와는 별개다.
- 고유 title·desc·ID: `gvc-packet-layers-d/m-*`, `gvc-responsive-layout-d/m-*`. CSS는 각 SVG 루트 클래스 아래에 한정한다. 판별 desc 내용 일치. 외부 이미지·리소스·스크립트·애니메이션 없음.

## 기술 정확성·입문자 관점 확인

패킷은 IP 패킷 안 TCP 세그먼트, 그 안 HTTP 요청 데이터 일부를 상자로 포함시켰다. IP 헤더의 출발지 `198.51.100.25`·목적지 `203.0.113.10`, TCP 헤더의 출발지 포트 `51514`·목적지 포트 `80`, HTTP 일부 `GET /`를 구분했다. 두 IP는 문서용으로 실제 접속 주소가 아니다. IP=주소·전달, TCP=포트·신뢰성 있는 전송, HTTP=웹 요청의 의미를 상자·예시·본문으로 연결했다.

한 HTTP 요청이 여러 TCP 세그먼트·IP 패킷으로 나뉠 수 있으며 연결용 TCP 패킷에는 HTTP가 없을 수 있음을 그림에 남겼다. 링크 계층·MAC 주소 생략도 표시했다. HTTP/3는 QUIC을 사용하고 TCP가 암호화·HTTP 성공을 보장하지 않는다는 범위는 본문·캡션에 명시했다. 그림은 B3-1 기반 IPv4·TCP·HTTP 80 교육용 사례이며 실제 AWS 운영 상태를 뜻하지 않는다.

라우터는 목적지 IP·라우팅 정보, 방화벽/SG는 IP·프로토콜·포트 규칙, NAT는 필요한 주소·포트 변환, 웹 서버는 HTTP 요청을 활용하는 목록으로 분리했다. 장비 통과 순서가 아니라고 표시하고, Route Table·SG를 물리 장비로 그리지 않았다. 본문에서 B3-1 IGW의 공인·사설 IPv4 1:1 변환도 일반 NAT와 구분했다.

반응형은 하나의 HTML 콘텐츠 A 소개·B 작업·C 연락을 세 화면 모두에 유지했다. 모바일 1열/접힌 메뉴, 태블릿 2열/가로 메뉴, PC 3열/가로 메뉴로 배치만 바뀐다. HTML/CSS 역할과 Media Query/Breakpoint를 그림·본문에서 연결했다. 여백·글자·터치 공간도 조정 가능하며 단순 축소가 아님을 명시했다. 768/1024px는 B1-1 자료 기반 예시이고 모든 사이트의 공통 정답이 아니다. 메뉴 표시 규칙과 버튼 클릭 시 여닫는 JavaScript 동작을 구분했다.

사실 대조 근거: TCP의 헤더·전송 범위는 [RFC 9293](https://www.rfc-editor.org/rfc/rfc9293.html), HTTP/3의 QUIC 사용은 [RFC 9114](https://www.rfc-editor.org/rfc/rfc9114.html), 반응형 원리는 [MDN Responsive design](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design)과 저장소 B1-1 학습가이드에 대조했다. 이 확인을 실제 L0 학습자 실험이나 별도 GPT 독립 최종 검토 완료로 해석하지 않는다.

## 검증 결과

Windows: `PYTHONUTF8=1`, `PYTHONIOENCODING=utf-8`.

| 명령 | 결과 |
| --- | --- |
| `npm run glossary:validate` | PASS: 523 canonical, errors 0 / warnings 0, 기존 INFO 788 |
| `npm run content:integrity` | PASS: 새 경고 0 |
| `npm test` | PASS: 39개 파일, 492개 테스트 |
| `npm run build` | PASS: 기존 B2-1 build-check 포함 |
| `npm run build:extension` | PASS |
| `npx playwright test playwright/glossary-visual-fast-batch-c.spec.ts --workers=2` | PASS: 7개 테스트 |
| `node scripts/check_glossary_visual_extension.mjs --fast-batch-c` | PASS: 실제 MV3 Chromium 153.0.8010.12, 그림 용어 7개·기존 quickTerms 23개, 오류 0 |
| `git diff --check` | PASS |

두 용어 × 1280/390/360px × Forest/Paper에서 그림 1개, title/desc·캡션, 원문 절 순서, 관련 용어 이동, 표시 글자 크기 11px 이상·대비 4.5 이상, 글자 간 겹침 없음·viewBox 밖 잘림 없음, 페이지/그림 가로 넘침 없음·필터 미적용을 확인했다. 700/701px 전환·복귀 정상. DOM·Generator·JOIN·공인 IP·CIDR·SSH 그림은 같은 폭·테마에서 간단 회귀했다.

과거 B6-1 승인 자산의 고정 파일 수·승인 해시·원본 일치 검사를 그대로 유지했다. Batch A/B 기준 파일·해시를 덮어쓰지 않았으며 기존 변경 허용 대상을 원래 객체로 복원한 상태에서 과거 계약도 검증한다. 별도 Batch C 기준은 대상 외 521개 생성 용어 객체가 최신 main과 완전히 같은지 검사한다. canonical 523개 ID·분류·관계·missionRefs 해시도 유지한다. 기존 Story·학습가이드·승인 SVG·지도·웹툰·미션 UI·라우팅·다른 용어 본문은 변경하지 않았다.

실제 확장 페이지에서 대상 2개와 기존 ERD·FK·JOIN·CIDR·SSH가 SVG/img 없이 평문으로 표시되고 이미지 Markdown이 노출되지 않는지 확인했다. 기존 코드·설명과 관련 용어 이동·오픈북 빠른 용어도 정상이다. 확장 구조는 변경하지 않았다.

## 대표 캡처 (4장)

그림과 캡션 영역만 저장해 직접 열어 확인했다. PC는 구조의 넓은 배치, 모바일은 단순 축소 대신 세로 배치를 확인했다. 색상 외에 상자 포함 관계·이름·콘텐츠 순서로 의미를 구분한다.

- `reports/glossary-visual/fast-batch-c/packet-1280-forest.png`.
- `reports/glossary-visual/fast-batch-c/packet-390-paper.png`.
- `reports/glossary-visual/fast-batch-c/responsive-web-design-1280-forest.png`.
- `reports/glossary-visual/fast-batch-c/responsive-web-design-390-paper.png`.

중복 화면과 긴 실행 로그는 Git에 넣지 않았다.

## 알려진 문제·미검증

알려진 구현 실패·미적용 항목 없음. 실제 L0 학습자 이해도 실험, 휴대폰 Safari/Chrome, 스크린리더 음성 낭독, 프로젝터, Indigo/Signal 별도 시각 검수, 사용자 Chrome 프로필의 네이티브 Side Panel UI 및 공개 배포 화면은 미검증이다. 웹 검증은 로컬 Chromium의 지정 폭·테마 범위다.

GPT 최종 독립 검토와 Owner 최종 공개 승인은 대기 상태다. 한 브랜치·한 Draft PR까지만 준비하고 main 병합·배포는 하지 않는다.
