# 본과정 M01 원천 데이터 Manifest

## 원천 메타데이터

- 과정: 본과정
- 미션: M01
- 미션명: 나를 소개하는 웹페이지 처음부터 만들기
- 원천: Notion의 M01 공식 미션 정보 보강 섹션
- 추출 주체: ChatGPT / Sol
- 등록일: 2026-09-09
- 상태: raw / pilot / unnormalized
- 추출 기준: direct / required / related
- Pilot 목적: M02~M13 공통 추출 포맷 검증

## 원본 보존 원칙

- `m01-terminology-raw.md` 본문은 Pilot 추출 결과 그대로 보존한다.
- 이 단계에서는 중복 제거, 표준명 확정, 분야 재분류, 용어 삭제, 설명 추가 및 웹툰 우선순위 재판단을 하지 않는다.
- 정규화와 통합은 이후 `data/curated/` 단계에서 수행한다.

## 알려진 정규화 후보

- Hero / About / Skills 등은 curated 단계에서 사전 용어 제외 가능
- React / Vue / jQuery 등은 금지 대상으로 등장하지만 raw에는 보존
- 403 / API 60회 제한은 상위 개념과 병합 가능
- loading / success / error / empty state는 UI State 하위로 통합 가능
- direct / required / related 판정은 이후 전체 미션 비교 시 조정 가능
