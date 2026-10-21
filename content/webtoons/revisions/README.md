# 2026-10-21 교체 승인

Owner가 완성된 세 편 확인 후 “교체해줘”라고 요청했다. 모델 v2·추상화 v2·클라우드 v3를 episodes.json의 승인 회차로 승격하고, 검토한 master/panel PNG 그대로 WebP 파생본으로 출력한다. 새로 그림을 생성하거나 조판하지 않는다. 이전 원본은 episodes/에 보존한다. 아래는 제작 당시 검토 기록이다.

# 2026-10-21 구도 개선 검토본

Owner 요청: 기존 모델·추상화·클라우드 웹툰의 단순하고 반복적인 구도를 다양화한다.

- 기준: main 10ab089. 모델 v1 → v2, 추상화 v1 → v2, 클라우드 v2 → v3.
- 이야기·대사·용어 설명·사전 연결·2×2 규격 유지. 컷별 샷·동작·인물 노출·배경을 재구성했다.
- `../composition-revisions.json`은 새 그림과 일치하는 컷 설명·shot·offscreen·대사를 보관한다. 원본 `../episodes.json`과 공개 WebP는 바꾸지 않았으며, 새 버전은 draft다. 이전 버전의 승인을 새 그림에 승계하지 않았다.
- `image-prompt.md`: 실제 built-in image_gen 편집 프롬프트. 공개 합본을 참조했다. 모델 세부명·seed 미제공.
- Apple SD Gothic Neo로 조판했으며 기존 환경과 글꼴이 달라 전 작품의 말풍선·줄바꿈을 시각 확인했다.
- 재출력: `WEBTOON_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' node scripts/render_webtoon_episodes.mjs --source content/webtoons/composition-revisions.json --include-drafts`
- 앱 공개용 builder는 이 별도 검토 manifest를 읽지 않는다. 사용자 확인 후 해당 버전의 대본·원본을 적용하고 공개 자산을 다시 내보내야 한다.

검증: Python 공개 상태 검사 6개, Vitest src/webtoons.test.tsx 5개, npm run build 성공. 세 합본 및 모바일 개별 컷 시각 확인. 비교 HTML의 Chrome 1440/390/360px에서 이미지 18개 로딩, 가로 넘침 없음. 공개 사이트 배포·원격 push 없음.

승인 후 통합 QA: 검토한 PNG 바이트를 유지하고 공개 WebP 33개를 교체했다. Python 공개 상태 검사 6개, 웹툰 Vitest 5개 및 앱 빌드 성공. Chrome 1440/390px에서 변경한 세 편의 새 장면 설명·전체 대사·PC/모바일 이미지·공개 목록 8편을 확인했고 15개 공개 이미지의 파일 해시가 로컬 산출물과 일치했다. 페이지/네트워크 오류 0. 검토 시점 이후 대사·그림 재생성·조판 변경은 없다.
