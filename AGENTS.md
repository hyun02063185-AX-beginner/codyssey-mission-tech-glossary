# Execution Entry Point

- 먼저 작업 유형·영향 범위와 [거버넌스 계약](docs/knowledge-encyclopedia/06-agent-governance-model.md)을 확인한다. 상설 역할은 Orchestrator, Knowledge Architect, Quality Harness, Owner Gate 네 개를 유지한다.
- canonical·관계·taxonomy·기존 knowledge map·공개 route 등 Owner Gate 영역은 승인 없이 바꾸지 않는다.
- QA는 승인 커밋과 실행 결과를 재사용한다. 승인 이후 바뀐 부분만 영향 범위에 맞게 다시 검증하고, GitHub Actions 빌드 성공을 Playwright·시각 QA 완료로 해석하지 않는다.
- Claude는 로컬 커밋까지만 하고 Push는 사용자가 수행한다. 보고에는 정확한 `git push origin <branch>` 명령을 포함한다.
- Notion은 Milestone·정책·아키텍처 변경 시점에만 동기화한다.
- 신규 미션 스토리·개념지도·학습가이드를 시작할 때는 [학습 운영 정책 및 교육 철학](docs/mission-guides/learning-operation-policy.md)과 [제작·검토·웹 통합 절차](docs/mission-guides/workflow.md)를 필독한다. 대면 강의 필수, 스토리(흐름)·개념지도(미션 관계)·용어사전(확장)·학습가이드(실행)의 역할을 확인하고 독립 검토·웹 통합 전에 다시 점검한다. 역할별 산출물과 Owner 승인 없이 다음 단계 완료를 선언하지 않는다.
- B3-1을 이어받을 때는 [현재 단계와 인수인계](docs/mission-guides/b3-1-status.md)를 먼저 확인한다. 새 채팅이나 별도 작업 디렉터리에서도 PR 상태와 승인된 원고 커밋을 재확인한다.
