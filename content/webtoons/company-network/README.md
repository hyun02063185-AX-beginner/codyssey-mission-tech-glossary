# B3-1 일반 회사망 웹툰 3편 · Owner 검토

2026-11-03 · **Stage C 웹 반영 및 검증 / Owner 시각·콘텐츠·그림·공개 승인 완료**

승인 기준: `484a364d961825bdf258aa7f3e4ec125eba72f23` · 1·2편 v1 / 3편 v2. 승인받은 그림·대사·편집 원본을 다시 생성하지 않고 공개 WebP만 추가했다. 기존 19편 + 신규 3편 = 총 22편.

기준 브랜치: `feature/b31-company-network-webtoons`

BASE: `6b3a7f33e67a3d11a42c13f8a0910782f8701e4a`

## 검토하기

- [PC 2×2·모바일 4컷·원본 비교 페이지](review.html): 파일을 브라우저로 직접 열거나 로컬 Vite에서 `/content/webtoons/company-network/review.html`로 연다. 승인본 비교용 저장소 자료다. 서비스에서는 기존 `/#/webtoons?episode=<ID>` 경로로 읽는다.
- [원본 12컷 대응표](panel-mapping.md), [전사 데이터](source-map.json), [QA·원본 차이 목록](qa.md).
- 각 편의 `script.md`는 원본 전사 원고, `image-prompt.md`는 실제 built-in imagegen 생성 프롬프트다. CLI/API fallback은 사용하지 않았다.

| 순서 | 원고 | PC 2×2 | 모바일 PNG | WebP 시안 |
|---|---|---|---|---|
| 1 · 정상적인 외부 요청 | [원고](../episodes/b31-network-external-dmz-01/script.md) | [1536×1024](../episodes/b31-network-external-dmz-01/master.png) | 같은 폴더 `panel-1.png` ~ `panel-4.png` | 같은 폴더 `preview/` |
| 2 · 내부 구역 사이의 접근 통제 | [원고](../episodes/b31-network-internal-policy-02/script.md) | [1536×1024](../episodes/b31-network-internal-policy-02/master.png) | 같은 폴더 `panel-1.png` ~ `panel-4.png` | 같은 폴더 `preview/` |
| 3 · 수상한 택배기사 | [원고](../episodes/b31-network-suspicious-access-03/script.md) | [1536×1024](../episodes/b31-network-suspicious-access-03/master.png) | 같은 폴더 `panel-1.png` ~ `panel-4.png` | 같은 폴더 `preview/` |

### 1편

![정상적인 외부 요청 시안](../episodes/b31-network-external-dmz-01/master.png)

### 2편

![내부 구역 사이의 접근 통제 시안](../episodes/b31-network-internal-policy-02/master.png)

### 3편

![수상한 택배기사 시안](../episodes/b31-network-suspicious-access-03/master.png)

## 파일과 재현

- 제공된 원본: `originals/episode-1.png` ~ `episode-3.png` (첨부파일 그대로 복사, SHA-256 보존).
- 그림 원본: 각 에피소드 디렉터리 `art.png`. 글자·말풍선 없는 이미지이며 덮어쓰지 않고 보존한다.
- 편집 가능한 조판 원본: `../episodes.json` 마지막 3편 + `layout-v1.css` + `scripts/webtoon_company_network_layout.mjs`.
- 합성 원본: `master.png` 3개, `panel-{1..4}.png` 12개.
- 검토용 WebP: 각 편 `preview/` 아래 11개씩, 총 33개. Stage A 비교본으로 보존하며, 동일한 WebP 33개를 `public/webtoons/<ID>/`에 추가했다.
- 실제 생성 그림의 행 경계는 `artRows`로 지정한다. 1편 512/512, 2편 560/464, 3편 539/485를 각각 정확한 736×480 컷에 배치한다.
- 2편 3컷은 세 말풍선과 구조도를 모두 보존하기 위해 그림을 아래에 작게 배치하는 `artFrame`을 적용한다.

```sh
# Node·npm, Python/Pillow, Playwright와 Chrome이 설치된 환경
WEBTOON_CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  node scripts/render_webtoon_episodes.mjs --include-drafts \
  b31-network-external-dmz-01 b31-network-internal-policy-02 b31-network-suspicious-access-03
python3 scripts/export_webtoon_assets.py \
  b31-network-external-dmz-01 b31-network-internal-policy-02 b31-network-suspicious-access-03
node scripts/build_company_network_review.mjs
python3 -m unittest discover -s scripts -p 'test_*webtoon*.py'
```

로컬 Vite가 5173에서 실행 중이면 `node scripts/check_company_network_review.mjs`로 1440/390/360px 검사를 재현한다. Chrome 경로는 `WEBTOON_CHROME_PATH`, 서버는 `WEBTOON_REVIEW_ORIGIN`으로 변경할 수 있다.

## Owner Gate

3편 마지막 컷의 원본 명찰은 **김창현**, 나머지 컷은 **김정현**이다. **2026-11-03 Owner 지시(‘김정현’으로 통일)에 따라 3편 v2의 마지막 명찰을 김정현으로 수정했다.** 원본 이미지와 source-map.json의 원본 명찰 전사는 김창현으로 보존하고, episodes.json의 ownerCorrections에 승인된 차이를 기록했다. 당시 승인은 명찰 수정에 한했다. 이후 아래와 같이 전체 콘텐츠·공개 승인도 받았다.

2026-11-03 Owner가 **“3편의 웹툰 시각·콘텐츠 검수를 완료했어. 원본 내용과 그림도 승인해. 웹 메뉴 공개 작업을 진행하자.”**라고 명시했다. 세 편의 `approval.date/content/publication/reviewedCommit`에 기록하고 `status: approved`로 전환했다.

`npm run build`로 공개 데이터 22편과 관련 용어 3개의 생성된 웹툰 연결을 갱신한다. 콘텐츠·공개 승인 누락 차단 검사는 유지하며, 새 가변 말풍선도 같은 승인 절차를 통과해야 한다. 기존 19편 메타데이터·공개/활성 원본 자산 360개는 그대로다.

공개 메뉴·신규 3개 URL·관련 용어·PC/모바일 검사 및 독립 검토를 마친 뒤 같은 [PR #49](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/pull/49)로 반영한다. 실제 Pages 배포 SHA·실행 결과·공개 화면 확인은 PR의 배포 기록에서 추적한다. [QA 기록](qa.md)의 Stage A/B 표는 당시 이력이며 최신 Stage C 결과를 함께 확인한다.
