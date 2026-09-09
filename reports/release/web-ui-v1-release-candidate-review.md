# Web UI v1 Release Candidate Review

## Verdict

**PASS WITH KNOWN LIMITATIONS**

## QA 결과

- UX: 홈 검색을 첫 행동으로 유지하고 초기 목록은 핵심 용어 중심으로 제한
- Content: 50개 핵심 설명과 500개 index-only 용어 상태를 분리
- Responsive: 1440·1024·768·390px에서 header·검색·필터·목록의 단일 열 전환 확인
- Accessibility: landmark, heading, label, 링크/버튼 구분, 텍스트 상태 적용
- Search: 한국어·영문·alias exact/prefix/substring 순위 적용
- Mission navigation: 예비/본과정 M01 구분
- Term detail / Peer review: 미션 맥락과 동료평가 질문을 별도 섹션으로 표시
- Webtoon readiness: Pilot 5개가 이미지 없는 제작 준비 상태를 정확히 표시하며 향후 파일을 감지
- Deployment: workflow 준비 완료, 실제 Pages 활성화는 GitHub 설정 필요
- Console: Playwright Chromium의 홈 검색·상세 이동·미션·없는 용어·웹툰 fallback·모바일 QA에서 console error 0건
- Automated tests: PASS (2)

## Known limitations

- 실제 GitHub Pages 공개 URL smoke는 Pages 설정 및 workflow 실행 뒤 확인해야 한다.
- 500개 index-only 용어에는 상세 설명이 없다.
