# 추상화·알고리즘 두 편 추가

2026-10-20 · 기준 main 5341feb · 브랜치 feat/webtoon-abstraction-algorithm.

- Owner가 완성본을 확인하고 ‘지금 두편도 적용해주면 되겟어’라고 승인했다. 기존 모델·프롬프트와 함께 총 4편을 공개하며 이전 5편은 보관 상태를 유지한다.
- 원본·합본·네 컷·대본·생성 프롬프트·공개 승인 기록을 보존했다. 합본 SHA-256은 추상화 abba98a77df26e0db20e66ba9a7cbb96fcd8df01eb5cd01749db7e0675156f9e, 알고리즘 e16bf78dc890c61eb8dc8c70c8b0f04cfbf6b67054193baedfd40e7ca614fc2a로 Owner가 본 파일과 동일하다.
- 추상화·알고리즘에 정확히 대응하는 canonical이 없어 새 ID를 만들지 않았다. termId null·빈 relatedTerms를 허용하되 unmapped-concept 상태와 이유를 필수로 검증한다. 새 작품에는 자체 쉬운 뜻·비유 경계·전체 대사가 있다.
- 기존 React 화면과 CSS, 공개 route·canonical 519개·관계·taxonomy·지도·Chrome 스키마는 변경하지 않았다. generated glossary.json도 기준 main과 동일하다.
- 2×2 1536×1024 합본과 736×480 네 컷을 재사용한다. 새 그림은 artFit contain-scene으로 하단 소품을 보존하며 컷선·여백·말풍선 규격은 유지한다. 제작 명령은 작품 ID를 선택할 수 있어 기존 이미지를 재출력할 필요가 없다.
- npm run build 성공. 관련 Vitest 19개, Python 공개 상태 검사 6개 통과. 전체 회귀는 이전 검증을 재사용하고 변경 영향 범위만 검사했다.
- 로컬 Chrome 1440/390/375/360px에서 네 편·이미지 디코딩·전체 대사·키보드·기존 두 편 사전 왕복·새 개념의 임의 링크 부재·이전 다섯 편 비노출·필터를 확인했다. 브라우저/네트워크 오류 0. 목록·PC·모바일 캡처를 직접 검수했다.
- 이 기록은 배포 전 검증 근거다. 병합·공개 사이트의 최종 확인은 릴리스 결과 및 Notion 마일스톤 기록으로 남긴다. PR #8은 별도 초안으로 유지한다.
- 원격 반영 명령: git push -u origin feat/webtoon-abstraction-algorithm
