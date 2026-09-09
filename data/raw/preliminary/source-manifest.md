# 예비과정 M01~M03 원천 데이터 Manifest

## 원천 메타데이터

- 과정: 예비과정
- 대상 미션: M01~M03
- 원천 생성 주체: Claude
- 원천 유형: AI-assisted terminology extraction
- 프로젝트 등록일: 2026-09-09
- 상태: raw / unnormalized
- 원본 파일명: `preliminary-m01-m03-claude-raw.md`

## 원본 보존 원칙

- `preliminary-m01-m03-claude-raw.md`의 본문은 원천 추출 결과 그대로 보존한다.
- 원천 파일에서 발견한 잘못된 집계, 표현, 중복 또는 분류 문제는 이 단계에서 수정하지 않는다.
- 정규화, 중복 제거, 표준명 결정, 유형 분류 및 출처 상태 검토는 이후 `data/curated/` 단계에서 수행한다.

## 알려진 확인 필요 사항

1. M02 일부 항목은 원문 직접 등장 여부가 불확실함
2. 현재 원천 파일의 중복 제거 총계와 분야별 합계가 일치하지 않을 가능성이 있음
3. `토큰`, `이미지`, `필터` 등은 이후 표준명 충돌 검토 필요
4. `README.md`, `Dockerfile`, `main.py`, `JSON` 등은 이후 type 재분류 가능
5. 이 파일의 수치는 신뢰 기준이 아니라 raw 추출 결과로 간주
