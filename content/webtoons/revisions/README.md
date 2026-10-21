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
