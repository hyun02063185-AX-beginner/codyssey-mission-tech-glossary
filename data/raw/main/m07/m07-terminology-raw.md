# 본과정 M07 기술용어 원천 추출

- 과정: 본과정
- 미션: M07 — 컴퓨터가 알아서 자기 상태를 점검하게 만들기
- 추출 목적: `Codyssey Mission Tech Glossary` 원천 데이터 수집
- 추출 상태: raw / unnormalized
- 기준일: 2026-09-09
- 원천: Notion `M07 — 컴퓨터가 알아서 자기 상태를 점검하게 만들기`
- 원천 URL: https://app.notion.com/p/3d462d4e03808133b4ebc6d921d56d7e?pvs=204
- 원칙: 미션 문서에 직접 등장한 기술 표현과 수행상 필요한 배경 개념을 분리한다.

> 이 파일은 사전 본문이 아니다. 표준명 확정, 중복 제거, 분야 재분류, 설명 본문 작성은 `data/curated/` 단계에서 수행한다.

---

## 1. direct — 미션 원문에 직접 등장한 용어

| 원문 표기 | 표준명 후보 | 분야 후보 | 유형 후보 | 중요도 | 미션 내 맥락 | 웹툰 후보 |
|---|---|---|---|---|---|---|
| Linux | Linux | Linux/OS | operating system | 핵심 | 서버 운영 실습 환경 | 보통 |
| Ubuntu | Ubuntu | Linux/OS | distribution | 보조 | 주요 기술로 명시 | 불필요 |
| SSH | SSH | Network/Security | protocol | 핵심 | 원격 접속과 포트 변경 | 좋음 |
| port 20022 | TCP Port 20022 | Network | port | 핵심 | SSH 변경 포트 | 보통 |
| Root 원격 로그인 | Root Remote Login | Security/Linux | policy | 핵심 | 차단 요구 | 좋음 |
| UFW | UFW | Linux/Security | firewall tool | 핵심 | 방화벽 선택지 | 좋음 |
| firewalld | firewalld | Linux/Security | firewall tool | 핵심 | 방화벽 선택지 | 좋음 |
| TCP | TCP | Network | protocol | 핵심 | 20022/15034 인바운드 규칙 | 좋음 |
| 사용자 | Linux User | Linux/OS | identity | 핵심 | agent 계정 구성 | 좋음 |
| 그룹 | Linux Group | Linux/OS | identity/permission | 핵심 | agent-common/core 권한 구성 | 좋음 |
| ACL | Access Control List | Linux/Security | permission | 핵심 | 세부 파일 접근 권한 | 좋음 |
| 환경변수 | Environment Variable | Linux/OS | config | 핵심 | AGENT_* 경로·포트 설정 | 좋음 |
| 0.0.0.0:15034 | Listen Address | Network | socket/address | 핵심 | 앱 LISTEN 확인 | 좋음 |
| LISTEN | Listening Socket | Network/Linux | state | 핵심 | 서비스 포트 상태 확인 | 좋음 |
| Bash | Bash | Linux/Programming | shell/language | 핵심 | monitor.sh 구현 | 좋음 |
| monitor.sh | monitor.sh | Linux/Operations | script | 핵심 | 시스템 관제 스크립트 | 좋음 |
| process monitoring | Process Monitoring | Linux/Operations | concept | 핵심 | 프로세스 Health Check | 좋음 |
| Health Check | Health Check | Operations | concept | 핵심 | 프로세스·포트 상태 확인 | 좋음 |
| exit 1 | Exit Status 1 | Linux/Programming | exit-code | 핵심 | Health Check 실패 표현 | 좋음 |
| CPU | CPU Usage | Linux/Operations | metric | 핵심 | 리소스 사용률 수집 | 보통 |
| MEM | Memory Usage | Linux/Operations | metric | 핵심 | 리소스 사용률 수집 | 보통 |
| DISK | Disk Usage | Linux/Operations | metric | 핵심 | 리소스 사용률 수집 | 보통 |
| threshold | Threshold | Operations | concept | 핵심 | 임계값 초과 WARNING | 좋음 |
| logging | Logging | Operations | concept | 핵심 | monitor.log 누적 기록 | 좋음 |
| log rotation | Log Rotation | Operations | concept | 핵심 | 10MB/10개 유지 정책 | 좋음 |
| cron | cron | Linux/Operations | scheduler | 핵심 | 매분 자동 실행 | 좋음 |
| crontab | crontab | Linux/Operations | config/command | 핵심 | agent-admin 스케줄 등록 | 좋음 |
| sudo | sudo | Linux/Security | command | 보조 | 필요 시만 사용 | 좋음 |
| x86/arm64 | CPU Architecture | Computer Basics | architecture | 보조 | 바이너리 아키텍처 확인 | 좋음 |

---

## 2. required — 수행·설명을 위해 사실상 필요한 개념

| 개념 | 분야 후보 | 왜 필요한가 | 웹툰 후보 |
|---|---|---|---|
| File Permission | Linux/Security | R/W·소유자·그룹 권한 이해 | 좋음 |
| Owner / Group / Mode | Linux/Security | 스크립트·로그 권한 정책 이해 | 좋음 |
| Socket / Port | Network | LISTEN 및 TCP 15034 Health Check 이해 | 좋음 |
| System Monitoring | Operations | CPU/MEM/DISK·프로세스·포트를 묶는 상위 개념 | 좋음 |

---

## 3. related — 더 깊은 이해를 위한 연관 개념

| 개념 | 분야 후보 | 연결 이유 | 웹툰 후보 |
|---|---|---|---|
| systemd | Linux/Operations | 서비스 자동 실행/관리 확장 개념 | 좋음 |
| logrotate | Linux/Operations | 로그 순환 전문 도구 | 좋음 |
| least privilege | Security | sudo 최소 사용과 계정 분리 원칙 확장 | 좋음 |

---

## 4. 추출 검수 체크
- [x] direct 항목은 원문 근거가 명확하다.
- [x] required 항목을 direct에 섞지 않았다.
- [x] related 항목은 학습 확장용으로만 분리했다.
- [x] 금지/선택/보너스로 등장한 기술도 raw에는 보존했다.
- [x] 설명 본문을 완성하거나 용어를 중복 제거하려 하지 않았다.
- [x] 웹툰 후보는 비유·시각화 효과가 큰 개념에 우선 표시했다.

## 5. 미션 요약

- direct 용어 수: 29
- required 개념 수: 4
- related 개념 수: 3
- 웹툰 우선 후보 예: SSH, Root 원격 로그인, UFW, firewalld, TCP, 사용자, 그룹, ACL, 환경변수, 0.0.0.0:15034
