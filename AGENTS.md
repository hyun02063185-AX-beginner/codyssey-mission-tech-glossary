# Execution Entry Point

- 먼저 작업 유형·영향 범위와 [거버넌스 계약](docs/knowledge-encyclopedia/06-agent-governance-model.md)을 확인한다. 상설 역할은 Orchestrator, Knowledge Architect, Quality Harness, Owner Gate 네 개를 유지한다.
- canonical·관계·taxonomy·기존 knowledge map·공개 route 등 Owner Gate 영역은 승인 없이 바꾸지 않는다.
- QA는 승인 커밋과 실행 결과를 재사용한다. 승인 이후 바뀐 부분만 영향 범위에 맞게 다시 검증하고, GitHub Actions 빌드 성공을 Playwright·시각 QA 완료로 해석하지 않는다.
- Claude는 로컬 커밋까지만 하고 Push는 사용자가 수행한다. 보고에는 정확한 `git push origin <branch>` 명령을 포함한다.
- Notion은 Milestone·정책·아키텍처 변경 시점에만 동기화한다.
