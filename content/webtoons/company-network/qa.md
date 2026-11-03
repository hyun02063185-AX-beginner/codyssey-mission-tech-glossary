# 제작·검수·공개 검증 및 원본 차이 기록

> 최신 상태: 2026-11-03 Owner가 3편의 시각·콘텐츠·그림과 공개를 승인했다. 아래 Stage A/B 검증은 당시 이력이며, 최신 결과는 문서 끝 Stage C를 따른다.

2026-11-03 · 기준 `6b3a7f33e67a3d11a42c13f8a0910782f8701e4a` · 1·2편 v1 / 3편 v2 DRAFT

## 결과

| 항목 | 결과 |
|---|---|
| 원본 확보 | YES · 첨부 PNG 3개 직접 열어 확인·원본 복사 및 해시 보존 |
| 원본 대응표 | 12/12 · 제목·대사·생각·표지·도식·유머·하단 문구 직접 대조 |
| 제작 원고 | 3/3 · 각 편 script.md, source-map.json |
| 그림 / 합성 원본 | art.png 3개 / master.png 3개·모바일 PNG 12개 |
| 규격 | master 1536×1024, 각 컷 736×480 |
| 비공개 WebP 변환 | 33/33 · full 1536/1024/768 + panel 736/368, 각 편 11개 |
| 기존 보호 | 승인 19편 메타데이터 동일, 공개·활성 원본 자산 360개 SHA-256 동일 |
| 공개 데이터 | 19편, 신규 public/ 디렉터리 없음, 신규 episode URL은 미공개 처리 |
| Python | `python3 -m unittest discover -s scripts -p 'test_*webtoon*.py'` · 14 PASS |
| 웹툰·데이터 단위 검사 | `node node_modules/vitest/vitest.mjs run src/webtoons.test.tsx src/data.test.ts` · 20 PASS |
| 빌드 | `npm run build` PASS · 기존 대형 청크 경고 유지 |
| 브라우저 | `node scripts/check_company_network_review.mjs` · 1440/390/360px PASS |
| 독립 GPT 검토 | PASS · 원고·공개 게이트 검토 및 지적 2건 수정 후 해당 컷 재확인 |
| Owner 승인 | **미승인** · 시각·콘텐츠·공개 승인 별도 |

Python 검사는 12컷 전사 일치·원본 해시·기존 19편 해시·신규 draft 비공개·canonical 참조·PNG/WebP 크기·오버레이 누락/범위 오류·승인 없는 공개 거부를 확인한다. 변수 개수 대사가 허용되는지 임시 디렉터리의 **테스트 전용 승인 fixture**로 검사하며 실제 승인 정보는 바꾸지 않는다.

브라우저 검사는 검토 페이지 3개 앵커 진입, 전체 이미지 디코딩, 모바일 12컷 비율, 가로 넘침, 공개 카드 19개, 신규 3개 URL 비공개, 기존 리더의 PC 전체/모바일 4컷 동작을 확인한다. 시각 확인은 합성 master 3장과 실제 390px 모바일 캡처, 수정된 3편의 생각 경계·자물쇠를 직접 열어 수행했다. HTML 조판 중 텍스트 영역의 넘침도 렌더러에서 검사한다. 캡처는 `test-results/company-network/`에 생성된다(기존 ignore 정책에 따라 Git 제외).

전체 Playwright 443개와 전체 단위 검사는 반복하지 않았다. 기존 QA는 기준 커밋과 해시로 보호하고 변경된 웹툰 범위만 검사했다. 실제 휴대전화·공개 Pages 배포·공개 22편 메뉴와 승인 후 신규 URL은 아직 검증 대상이 아니다. 검토 페이지를 채팅 옆 브라우저에 여는 작업은 browser host unavailable로 실패했으나 로컬 Chrome 자동 검사는 정상 완료했다.

## 원본과 새 판형의 차이

1. 세로 4컷을 지정된 1536×1024 2×2로 배치했다. 사건과 읽는 순서는 1→2→3→4로 유지한다.
2. 그림은 첨부 3편만 기준으로 built-in imagegen에서 다시 제작했다. 색감·카메라 거리·가구의 세부 위치는 재그림에 따른 차이가 있다. 택배기사의 파란 모자·조끼, 갈색 긴 머리와 크림색 옷의 김정현, 흰 말티즈와 남색 방화벽 조끼, 현관·거실·계단·창고의 대응을 유지한다. 외형의 최종 수용 여부는 Owner가 판단한다.
3. 한글·말풍선·기술 표지·구조도·목록은 HTML/CSS로 합성했다. 원문 대사와 문구는 보존하고 줄바꿈·크기·좌표만 변경했다. 2편 3컷의 세 말풍선을 모두 유지하기 위해 구조도를 중앙, 작은 인물을 아래에 배치했다.
4. 원본 하단 핵심 요약과 공통 마무리 문구는 4컷 하단에 함께 두었다. 따라서 모바일로 개별 컷을 읽어도 마지막에 원문 요약이 남는다.
5. 원본의 라우터·파란 DMZ 경계·사슬·금지 표식은 그림에, 기술 표지 아이콘·화살표·체크·X·자물쇠·생각 경계는 합성 요소에 보존한다. 간식 목록의 체크와 하트도 유지한다.
6. 3편 4컷 원본 명찰 **김창현**은 2026-11-03 Owner의 **‘김정현’으로 통일** 지시에 따라 3편 v2에서 **김정현**으로 정정했다. 원본 이미지·원본 명찰 전사는 보존하고 승인된 차이는 ownerCorrections에 기록했다. 이 승인은 명찰 수정에 한하며 콘텐츠·공개 승인으로 확대하지 않는다.
7. 기술적 보충은 각 편의 `definition`/`analogyLimit`에만 추가했다. 웹툰 대사를 고치거나 새로운 대사를 추가하지 않았다. DMZ가 모든 회사의 필수 구성은 아니라는 점, 내부 접근 제한과 방화벽·ACL의 정책, 필요한 서비스/DB 통신 범위, 물리 공간 비유의 한계를 포함한다.

기술 설명 검토 근거: [NIST DMZ 용어집](https://csrc.nist.gov/glossary/term/demilitarized_zone), [NIST SP 800-41 Rev.1](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-41r1.pdf) §3.1·§4.1, [NIST SP 800-171 Rev.3](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/800-171r3/NIST.SP.800-171r3.html) 통신 정책. 기존 canonical에서 접근 제어·ACL·관계형 DB ID를 확인해 재사용했으며 DMZ·라우터 등의 새 ID는 만들지 않았다.

## 독립 검토 수정 내역

- 최초 검토: 원고·공개 게이트 PASS, 시각 정보 2건 수정 권고.
- 3편 3컷의 잠금 문자를 실제 SVG 자물쇠로 교체하고 4컷 자료망 표지에도 원본 자물쇠를 반영했다.
- 3편 1·4컷의 간식 상상 그림에 점선 생각 경계와 택배기사 방향 연결 점을 추가했다.
- 독립 검토자가 변경된 master.png를 직접 다시 확인하여 두 지적 해소 및 Stage A PASS를 보고했다. 이것은 Owner 승인을 대신하지 않는다.

## 공개 단계 보류

이번 변경은 원고·이미지·메타데이터·선택적 조판·검토 페이지·검증만 포함한다. 공개 데이터 builder는 `draft`를 계속 제외한다. 신규 텍스트 전사와 다음 편 링크 코드는 승인된 신규 데이터에만 작동하도록 준비했으며 기존 19편의 이동 동작과 결과물은 유지한다. Owner 승인 후 동일 PR에서 공개 WebP, 공개 목록 22편과 3개 진입 경로를 검증한다.

## 2026-11-03 명찰 정정 후 검증

3편 4컷 명찰만 김정현으로 변경했다. HTML/CSS로 다시 합성하여 master.png·panel-4.png와 검토 WebP를 갱신하고 검토 페이지·원고·테스트를 동기화했다. 배경 art.png와 3편 1~3컷 PNG는 동일하다. Python focused 14개 및 웹툰 Vitest 6개를 재검증하고 변경된 4컷의 명찰을 직접 확인했다. 기존 빌드·다른 화면폭 QA는 재사용한다. 상태는 draft, 공개 목록은 19편이다.

## Stage C — Owner 승인 후 웹 메뉴 반영 (2026-11-03)

- 승인 기준은 `484a364d961825bdf258aa7f3e4ec125eba72f23`(1·2편 v1 / 3편 v2)이며 Owner가 시각·콘텐츠·원본 내용·그림을 승인하고 웹 메뉴 공개를 요청했다. 각 편 승인 정보에 일자·콘텐츠·공개 의사·검수 커밋을 기록했다.
- 3편의 status/approval만 전환하고 이미지·대사·표지·줄바꿈·definition/analogyLimit·관련 용어·에피소드 순서는 승인본 그대로다. 승인본의 art/master/개별 PNG 18개 파일과 각 편의 제작 메타데이터(status/approval 제외)가 동일함을 비교했다.
- 공개 WebP 33개(편당 11개)는 보존된 검토 WebP와 바이트가 동일하다. 공개 목록은 기존 19편 다음에 신규 3편을 원본 순서대로 이어서 총 22편이다.
- canonical·용어 본문·기존 지도는 바꾸지 않았다. 생성 glossary의 변화는 access-control/access-control-list/relational-database 세 항목의 hasWebtoon false→true뿐이다. 관련 용어 14개가 웹툰과 연결된다.
- 기존 19편의 메타데이터 및 자산 360개 SHA-256 동일. 원본 12컷 전사·김정현 표기 정정 이력은 유지한다.
- Python focused 14 PASS, 웹툰·데이터 Vitest 20 PASS, npm run build PASS(기존 대형 청크 경고 유지). 전체 Playwright 443개·전체 단위 검사는 반복하지 않았다.
- 빌드 산출물의 실제 리더를 Chrome 1440/390/360px에서 검사하여 PASS했다. 목록 카드 22개, 신규 3개 진입, PC 합본/모바일 4컷 디코딩·가로 넘침, 1→2→3 다음 편, 관련 용어 3개 이동 및 웹툰 복귀, 기존 리더의 PC/모바일 표시를 확인했다. 실행: `WEBTOON_PUBLIC_ONLY=1 node scripts/check_company_network_review.mjs` (Vite preview 5173).
- 실제 배포 후 같은 검사에 `WEBTOON_REVIEW_ORIGIN=https://hyun02063185-ax-beginner.github.io/codyssey-mission-tech-glossary`를 지정해 공개 환경을 확인한다. Pages 실행 ID·배포 커밋 및 실제 결과는 PR #49에 남긴다. GitHub Actions 빌드 성공과 브라우저 QA는 별도로 보고한다.
- 실물 휴대전화는 미검증이며, Owner의 완료된 시각·콘텐츠 검수와 변경 전 제작 QA를 재사용한다.

Stage C 독립 GPT 검토도 PASS: 승인 소스 동일성·33개 공개 자산·기존 19편·정확한 22편·생성 용어 3개 변화·승인 누락 차단을 직접 재확인했으며 차단 이슈는 없었다.
