# Reviews

감사(audit)와 사람 검토 항목을 machine-readable로 관리합니다.

- `glossary-content-audit-v1.json` — 550개 canonical term 전수 감사 결과 (verdict·confidence·근거·권장 조치). `reports/glossary/glossary-content-audit-v1.md`의 기계 판독 버전.
- `deep-content-priority-v1.json` — 다음 Deep Content Sprint용 Top 50 우선순위(P0/P1/P2).
- `content-tier-sprint7.json` — 현재 519개 Canonical의 A/B/C 설명 깊이 계약과, 미작성 395개를 빠짐없이 한 번씩 배정한 Sprint 7 고정 구현 배치 9개.
- `manual-review.json` — 사용자가 Web을 보다가 발견한 오류를 계속 등록하는 backlog.

규칙:

- audit verdict는 후보(candidate)일 뿐 자동 merge/split/remove하지 않는다.
- generated 파일(`src/data/generated/`)은 build 산출물이며 여기에 review 데이터를 넣지 않는다.
- manual-review 항목은 resolved 시 `decision`과 `resolved_commit`을 반드시 채운다.
- Sprint 7 계획은 `python3 scripts/build_content_tier_plan.py`로 재생성하고, 변경 후 `python3 scripts/validate_content_tier_plan.py`로 전수성·중복·배치 크기(40–50)를 검증한다.
