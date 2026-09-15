# Sprint 10 — S7-B03 Content Implementation

Baseline은 canonical 519, detailed 210, glossary warning 1,088이었다. 계획 JSON의 S7-B03 40개만 구현했고 Tier는 A=5, B=17, C=18이다. 모든 대상의 `content_status`를 `drafted`로 동기화했으며 B04 이후, Canonical, Atlas, Knowledge Map, Concept Connection은 수정하지 않았다.

Detailed는 210에서 250으로 정확히 40 증가했고 canonical은 519로 유지됐다. S7-B03은 인증·권한·비밀값·원격 접근의 위협 경계에 맞춰 정의, 미션 맥락, 예시, 관련 용어를 제공한다. A는 흐름과 경계를, B는 오해·검토 질문을, C는 짧은 참조 형식을 사용했다.

## Sprint 9 browser QA correction

Sprint 9의 실제 browser route 기록은 21개이며 Tier A=5, Tier B=16, Tier C=0이다. 합계 21과 일치하도록 Sprint 9 보고서를 수정했다.

## Functional QA

| Check | Result |
| --- | --- |
| Tier plan | PASS |
| Unit | PASS — 31/31 |
| Production build | PASS |
| Atlas | PASS |
| Knowledge Map | PASS |
| Playwright | PASS — 5/5 |
| Extension | PASS |

`python3`를 사용한 환경에서 실행했으며, bare `python` 명령은 없다. P0 수정과 candidate signal은 없다. B01~B03이 모두 40–46 항목 범위에서 자동 QA를 통과했으므로 40–46 term batch 정책을 기본 운영 크기로 유지한다. B04는 구현하지 않는다.

## Post-implementation validation and browser QA

Glossary validator final result: **0 errors, 1,048 warnings**. The initial post-implementation run found 18 broken C-tier `security-identity` references; that ID is not canonical. All were replaced with the canonical `authentication` relation and the generator, term files, and generated glossary were rebuilt.

Browser QA reviewed 25 real B03 routes; the list and aggregate are deliberately recorded together:

- Tier A (5): `authentication-token`, `data-masking`, `iam-role`, `identity-and-access-management`, `ssh`
- Tier B (15): `access-control-list`, `firewalld`, `login`, `logout`, `principle-of-least-privilege`, `protected-route`, `public-route`, `root-remote-login`, `safe-mode`, `security-group`, `oauth-2-0`, `password-hashing`, `csrf`, `least-privilege`, `rbac`
- Tier C (5): `env`, `ssh-key`, `sudo`, `pat`, `pii`

Total is **25 = A 5 + B 15 + C 5**. Each route rendered a title and detailed summary through its deep link. Search QA passed for `authentication token`, `데이터 마스킹`, `IAM`, `SSH`, `ACL`, `OAuth2`, `CSRF`, `RBAC`, `.env`, and `PAT`. At 390px, `authentication-token`, `oauth-2-0`, `tls-certificate`, and `oauth2-authorization-code` had no document horizontal overflow.
