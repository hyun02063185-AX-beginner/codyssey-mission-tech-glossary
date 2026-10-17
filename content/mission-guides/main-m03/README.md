# B2-1 학습 가이드 — AI가 만든 용돈 기입장, 이제 프로그램이 움직이는 원리를 이해하기

> **상태:** 완성형 콘텐츠 검토본 v1.0 · 9개 장, 핵심 SVG 9종 + V09 PC용 완성 · **Owner 설명 수준 검토 전 / 기술용어사전 반영 전**
>
> 미션: Codyssey **B2-1 — 나만의 용돈 기입장 프로그램 만들기** (과거 관리 식별자 M03)

## 이 가이드는 무엇을 위한 것인가

AI가 만들어 준 용돈 기입장을 어떻게 사용하는지는 알지만, **그 프로그램이 어떤 원리로 움직이는지는 아직 말로 설명하기 어려운** 성인 교육생을 위한 해설서입니다. 법학·언어·공학 등 전공이 다르더라도 처음 배우는 컴퓨터 개념을 하나씩 쌓을 수 있도록 일상적인 질문과 그림으로 시작합니다.

목표는 Python 문법 암기나 코드 리뷰가 아닙니다. **내 프로그램은 어디에서 시작해 어떻게 입력을 처리하고, 데이터를 남기며 결과를 보여 주는가**를 자신의 말로 설명하는 것입니다. 코드는 필요한 경우에만 보조 자료로 제시합니다.

## 읽는 법

- 📱 **모바일** — 각 장의 질문, 핵심 SVG, 그림 읽는 법, 기본 개념, 마지막 설명 문단을 먼저 읽습니다.
- 💻 **PC** — 이해한 다음 자신의 실행 명령·코드·데이터 파일을 선택적으로 찾아봅니다.
- 각 교육생의 프로젝트는 파일 이름과 실행 방법이 다릅니다. `ledger`와 `TransactionRepository` 같은 이름은 **하나의 실제 구현 사례**이지 모두의 필수 형식이 아닙니다.
- **원본 데이터 보호** — 수정·삭제 예시는 연습용 복사본이나 별도 데이터 경로에서만 실행합니다.

## 목차

| 장 | 제목 | 핵심 그림 |
| --- | --- | --- |
| [01](chapters/01-cli-execution.md) | 터미널에 입력한 한 줄을 컴퓨터는 어떻게 알아들을까? | [V01](assets/v01-cli-execution.svg) |
| [02](chapters/02-transaction-crud.md) | 거래를 '추가'했다는 것은 프로그램 안에서 무슨 일이 일어난 걸까? | [V02](assets/v02-transaction-crud.svg) |
| [03](chapters/03-file-persistence.md) | 프로그램을 껐다 켜도 내역이 남아 있는 이유는 뭘까? | [V03](assets/v03-file-persistence.svg) |
| [04](chapters/04-generator-streaming.md) | 데이터를 꼭 한꺼번에 꺼내야 할까? | [V04](assets/v04-generator-streaming.svg) |
| [05](chapters/05-search-summary.md) | 같은 거래로 목록도 만들고 월별 합계도 낼 수 있을까? | [V05](assets/v05-search-summary.svg) |
| [06](chapters/06-safe-update-delete.md) | 거래 한 건을 수정하면 저장 파일에는 어떤 일이 일어날까? | [V06](assets/v06-safe-update-delete.svg) |
| [07](chapters/07-decorator-error-handling.md) | 같은 오류 처리를 여러 번 만들지 않으려면? | [V07](assets/v07-decorator-error-handling.svg) |
| [08](chapters/08-type-hint-validation.md) | `amount: int`라고 적으면 잘못된 값을 막을 수 있을까? | [V08](assets/v08-type-hint-validation.svg) |
| [09](chapters/09-ledger-overview.md) | 내가 만든 용돈 기입장은 하나의 프로그램으로 어떻게 움직일까? | [V09](assets/v09-ledger-overview.svg), [PC용](assets/v09-ledger-overview-wide.svg) |

## 근거 표기

- **`[개념]`** — Python 및 소프트웨어 분야에서 통용되는 개념 설명
- **`[요구 추적]`** — M03 저장소가 정리한 공식 미션 요구사항 추적표에 기반한 내용. **코디세이 원문을 독립적으로 완전 대조했다는 뜻은 아님**
- **`[프로젝트 사례]`** — `m03-pocket-money-ledger`의 실제 코드·문서에서 확인된 특정 구현
- **`[보충 설명]`** — 학습을 위한 비유·단순화. 실제 내부 구조와 1:1 대응하지 않을 수 있음

공식 필수 조건과 M03 구현 선택은 같은 것으로 취급하지 않습니다. 특히 CLI 옵션 표기에 관한 공식 문구와 이중 하이픈 예시의 표현 차이는 M03 아키텍처 기록에 남아 있어 추가 원문 확인이 필요합니다.

## 실제 구현 사례 출처

- [M03 저장소](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger)
- [README와 명령 개요](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/README.md)
- [요구사항 대응 및 설계 선택](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/docs/m03-reference.md)
- [코드 읽기 가이드](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/docs/m03-code-reading-guide.md)
- [실습 30개 시나리오](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/docs/m03-hands-on-guide.md)
- [아키텍처 설계·공식 요구 추적 매트릭스](https://github.com/hyun02063185-AX-beginner/m03-pocket-money-ledger/blob/main/docs/m03-architecture-design.md)
- [B1-1 승인 학습 가이드](https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/tree/main/content/mission-guides/main-m01)

## 범위와 제약

이 버전은 **내용과 SVG가 포함된 완성형 검토본**입니다. 기술용어사전 서비스용 라우트·네비게이션·테마 통합과 실제 교육생 대상 사용성 검증은 아직 진행하지 않았습니다. 원고는 Owner가 강의 경험에 맞춰 설명 깊이를 조정한 뒤 최종 승인합니다.
