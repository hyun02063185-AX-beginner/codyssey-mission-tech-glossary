# 코디세이 기술용어 사전 — 원천 추출 데이터

**대상**: 예비과정 미션 1\~3
**목적**: 미션 수행 및 동료평가 참고용 기술용어 사전 구축을 위한 원천 목록
**단계**: 용어 추출 (설명 본문 미작성)

## 출처 및 신뢰도

| 미션 근거 신뢰도          |                                       |    |
| ------------------ | ------------------------------------- | -- |
| M01 개발 워크스테이션 구축   | 요구항목 4.2\~4.11 + README 필수구성 + 보너스 전문 | 높음 |
| M02 파이썬 퀴즈 게임      | 제출 조건 목록 (클래스/영속성/커밋/브랜치/README 6항목)  | 중간 |
| M03 Mini NPU 시뮬레이터 | 제출 조건 목록 + data.json 구조               | 중간 |

M02·M03은 조건 요약 기준이라, 실습 과정에서 나왔지만 문서 등장 여부가 불확실한 용어는 **비고**에 `문서확인필요`로 표시했습니다. 원본 문서를 주시면 이 표시를 정리할 수 있습니다.

각 용어는 요청하신 9개 항목(미션/용어/원문/분야/유형/중요도/맥락/연관개념/웹툰후보/비고)을 표 컬럼으로 유지했습니다. 연관 개념은 원칙 7에 따라 미션별 별도 섹션으로 분리했습니다.

---

# M01 — 개발 워크스테이션 구축

## 실제 등장 용어

| 용어 원문 표기 분야 유형 중요도 미션 내 맥락 웹툰 비고  |                             |           |      |    |                                     |     |                  |
| --------------------------------- | --------------------------- | --------- | ---- | -- | ----------------------------------- | --- | ---------------- |
| 명령줄 인터페이스                         | CLI                         | Linux/OS  | 개념   | 핵심 | 모든 작업을 CLI 기반으로 수행하라는 전제 조건         | 좋음  |                  |
| 터미널                               | Terminal                    | Linux/OS  | 도구   | 핵심 | README 실행환경 항목에 OS/셸/터미널 기재 요구      | 보통  |                  |
| 셸                                 | Shell                       | Linux/OS  | 개념   | 핵심 | 실행환경 기재 항목. 터미널과 구분 필요              | 좋음  | 터미널과 혼동 빈발       |
| 절대 경로 / 상대 경로                     | absolute / relative path    | Linux/OS  | 개념   | 핵심 | "설명 가능해야 하는 것" 목록에 명시됨              | 좋음  |                  |
| 파일 권한                             | permission (r/w/x)          | Linux/OS  | 개념   | 핵심 | 4.3 권한 실습. 파일 1개+디렉토리 1개 변경 전후 비교   | 좋음  |                  |
| 권한 숫자 표기                          | 755 / 644                   | Linux/OS  | 설정   | 핵심 | 권한 해석 규칙을 설명할 수 있어야 함               | 좋음  |                  |
| 숨김 파일                             | hidden file                 | Linux/OS  | 개념   | 보조 | 4.2 목록 조회 시 숨김 포함 요구                | 보통  |                  |
| 디렉토리                              | directory                   | Linux/OS  | 개념   | 보조 | 4.2 생성·이동·삭제 실습 대상                  | 불필요 |                  |
| sudo                              | sudo                        | Linux/OS  | 명령어  | 보조 | 실습 환경 sudo 제약 때문에 대체 도구 안내 근거       | 보통  |                  |
| Docker                            | Docker                      | Container | 도구   | 핵심 | 4.4\~4.9 전 항목의 중심 도구                | 좋음  |                  |
| 이미지                               | image                       | Container | 개념   | 핵심 | 4.5 `docker images`, 4.7 커스텀 이미지 제작 | 좋음  | 컨테이너와 구분 필수      |
| 컨테이너                              | container                   | Container | 개념   | 핵심 | 4.6 실행·진입, 4.9 삭제 후 데이터 유지 증명       | 좋음  |                  |
| Dockerfile                        | Dockerfile                  | Container | 파일형식 | 핵심 | 직접 작성 필수. 4.7 커스텀 이미지의 근거           | 좋음  |                  |
| 베이스 이미지                           | base image                  | Container | 개념   | 핵심 | 4.7 웹서버 베이스 또는 리눅스 베이스 선택           | 보통  |                  |
| hello-world                       | hello-world                 | Container | 기타   | 보조 | 4.6 최초 컨테이너 실행 확인용 이미지              | 보통  |                  |
| ubuntu 이미지                        | ubuntu                      | Container | 기타   | 보조 | 4.6 컨테이너 내부 진입 실습 대상                | 불필요 |                  |
| docker info                       | `docker info`               | Container | 명령어  | 핵심 | 4.4 도커 설치·동작 점검 증거                  | 불필요 |                  |
| docker ps / ps -a                 | `docker ps`, `docker ps -a` | Container | 명령어  | 핵심 | 4.5 운영 명령. 실행중/전체 목록 차이             | 보통  |                  |
| docker logs                       | `docker logs`               | Container | 명령어  | 보조 | 4.5 운영 명령                           | 불필요 |                  |
| docker stats                      | `docker stats`              | Container | 명령어  | 보조 | 4.5 자원 사용량 확인                       | 불필요 |                  |
| attach                            | `docker attach`             | Container | 명령어  | 핵심 | 4.6 exec와의 차이를 관찰·정리하라는 요구          | 좋음  |                  |
| exec                              | `docker exec`               | Container | 명령어  | 핵심 | 4.6 attach와의 차이 정리가 채점 항목           | 좋음  |                  |
| 포트 매핑                             | port mapping                | Network   | 개념   | 핵심 | 4.8 브라우저 또는 curl 접속 증거 필요           | 좋음  | "왜 필요한가"를 설명해야 함 |
| 볼륨                                | volume                      | Container | 개념   | 핵심 | 4.9 컨테이너 삭제 전후 데이터 유지 증명            | 좋음  |                  |
| 바인드 마운트                           | bind mount                  | Container | 개념   | 핵심 | 최종 결과물 7번 및 체크리스트. 호스트 변경 전후 비교     | 좋음  | 4번대 별도 번호 없음     |
| 영속성                               | persistence                 | Container | 개념   | 핵심 | 볼륨·바인드 마운트 증거의 목적                   | 좋음  | M02에도 재등장        |
| NGINX                             | NGINX                       | Web       | 도구   | 보조 | 4.7 옵션 A의 웹서버 베이스 예시                | 보통  |                  |
| curl                              | `curl`                      | Network   | 명령어  | 보조 | 4.8 포트 매핑 응답 증거 수집 수단               | 보통  |                  |
| Git                               | Git                         | Git       | 도구   | 핵심 | 4.10 연동 증거. GitHub와의 역할 차이 설명 요구    | 좋음  |                  |
| GitHub                            | GitHub                      | Git       | 도구   | 핵심 | 저장소 링크로 제출. Git과 구분해 설명해야 함         | 좋음  |                  |
| git config                        | `git config --list`         | Git       | 명령어  | 보조 | 4.10 설정 확인 증거                       | 불필요 |                  |
| 저장소                               | repository                  | Git       | 개념   | 핵심 | 제출 단위 그 자체                          | 보통  |                  |
| README                            | README.md                   | Tool      | 파일형식 | 핵심 | README만 읽고 전체 수행 내용 파악 가능해야 함       | 보통  |                  |
| 코드블록                              | code block                  | Tool      | 설정   | 보조 | 명령·출력을 코드블록으로 남기라는 형식 요구            | 불필요 |                  |
| VSCode                            | Visual Studio Code          | Tool      | 도구   | 보조 | 4.10 GitHub 로그인·저장소 연동 증거           | 불필요 |                  |
| 토큰                                | token                       | Security  | 개념   | 핵심 | 4.11 토큰·비밀번호 마스킹 요구                 | 좋음  |                  |
| 마스킹                               | masking                     | Security  | 개념   | 핵심 | 4.11 증거 캡처 시 비밀정보 가림                | 좋음  |                  |
| OrbStack                          | OrbStack                    | Container | 도구   | 보조 | sudo 제약 대응 도구로 문서에 안내됨              | 불필요 |                  |
| Docker Compose                    | Compose                     | Container | 도구   | 보조 | 보너스. 멀티 컨테이너 구성                     | 보통  | 선택 항목            |
| 환경변수 주입                           | environment variable        | Linux/OS  | 설정   | 보조 | 보너스. Compose 환경변수 전달                | 보통  | 선택 항목            |
| SSH 키                             | SSH key                     | Security  | 설정   | 보조 | 보너스. GitHub 인증 방식                   | 좋음  | 선택 항목            |
| 트러블슈팅                             | troubleshooting             | Tool      | 개념   | 핵심 | 2건 이상 필수. 문제→가설→확인→해결 구조            | 보통  | 동료평가 배점 요소       |

## 연관 개념 (문서 미등장, 이해에 필요)

| 개념 원문 분야 왜 필요한가 웹툰  |                  |           |                                 |     |
| ------------------- | ---------------- | --------- | ------------------------------- | --- |
| 커널                  | kernel           | Linux/OS  | 컨테이너 격리가 성립하는 근거                | 좋음  |
| 네임스페이스              | namespace        | Linux/OS  | 컨테이너가 왜 가벼운지의 절반                | 좋음  |
| cgroup              | cgroup           | Linux/OS  | 자원 제한. `docker stats`의 원리       | 좋음  |
| 프로세스 / PID 1        | process, PID 1   | Linux/OS  | `docker run ubuntu`가 즉시 종료되는 이유 | 좋음  |
| 종료 코드               | exit code        | Linux/OS  | 컨테이너 비정상 종료 진단 (137 등)          | 보통  |
| 데몬                  | daemon, dockerd  | Container | 도커가 상주 프로세스로 도는 구조              | 보통  |
| 컨테이너 런타임            | containerd, runc | Container | Docker 내부 계층 구조                 | 불필요 |
| 이미지 레이어             | layer            | Container | Dockerfile 각 줄이 쌓이는 방식          | 좋음  |
| 레지스트리               | Docker Hub       | Container | 이미지를 어디서 받아오는가                  | 보통  |
| 가상머신 대비             | VM vs Container  | Container | 컨테이너의 존재 이유                     | 좋음  |
| 포트 / localhost      | port, localhost  | Network   | 포트 매핑을 이해하기 위한 전제               | 좋음  |
| HTTP                | HTTP             | Network   | 브라우저 접속 증거의 동작 원리               | 보통  |
| 파일시스템               | filesystem       | Linux/OS  | 마운트 개념의 전제                      | 보통  |
| zsh / bash          | zsh, bash        | Linux/OS  | 실행환경 기재 시 셸 종류 구분               | 보통  |
| 패키지 관리자             | Homebrew, apt    | Tool      | 도구 설치 경로                        | 불필요 |
| CPU 아키텍처            | arm64, x86\_64   | Linux/OS  | 이미지 플랫폼 불일치 트러블슈팅의 원인           | 보통  |
| 개인 액세스 토큰           | PAT              | Security  | 토큰 마스킹 항목의 실제 대상                | 좋음  |

---

# M02 — 파이썬 퀴즈 게임

## 실제 등장 용어

| 용어 원문 표기 분야 유형 중요도 미션 내 맥락 웹툰 비고  |                    |             |      |    |                             |     |            |
| --------------------------------- | ------------------ | ----------- | ---- | -- | --------------------------- | --- | ---------- |
| 파이썬                               | Python             | Programming | 도구   | 핵심 | 미션 주제 자체. 터미널 실행 프로그램 작성    | 보통  |            |
| 콘솔                                | console            | Programming | 개념   | 핵심 | 터미널에서 동작하는 프로그램이라는 형태 규정    | 보통  |            |
| 클래스                               | class              | Programming | 개념   | 핵심 | 2개 이상 필수 (Quiz, QuizGame 등) | 좋음  | 최대 배점 조건   |
| 객체 / 인스턴스                         | object, instance   | Programming | 개념   | 핵심 | 클래스 요구를 이해하기 위한 짝 개념        | 좋음  | 문서확인필요     |
| 메서드                               | method             | Programming | 개념   | 핵심 | 클래스 내부 동작 정의                | 좋음  | 문서확인필요     |
| 속성                                | attribute          | Programming | 개념   | 보조 | 클래스가 보유하는 데이터               | 보통  | 문서확인필요     |
| 함수                                | function           | Programming | 개념   | 핵심 | 반복 로직 분리 (read\_int 등)      | 좋음  | 문서확인필요     |
| 예외 처리                             | exception handling | Programming | 개념   | 핵심 | 잘못된 입력에도 프로그램이 죽지 않아야 함     | 좋음  | 문서확인필요     |
| 반복문                               | loop               | Programming | 개념   | 핵심 | 메뉴 반복 구조                    | 좋음  | 문서확인필요     |
| 조건문                               | if / elif / else   | Programming | 개념   | 핵심 | 메뉴 분기 처리                    | 좋음  | 문서확인필요     |
| 변수                                | variable           | Programming | 개념   | 보조 | 상태 보관                       | 보통  | 문서확인필요     |
| JSON                              | JSON               | Data        | 파일형식 | 핵심 | state.json으로 상태 저장          | 좋음  |            |
| UTF-8                             | UTF-8              | Data        | 개념   | 핵심 | state.json 인코딩 명시 조건        | 좋음  | 한글 깨짐과 직결  |
| 인코딩                               | encoding           | Data        | 개념   | 핵심 | UTF-8 지정의 이유                | 좋음  |            |
| 영속성                               | persistence        | Data        | 개념   | 핵심 | 프로그램 종료 후에도 상태 유지           | 좋음  | M01과 동일 개념 |
| 파일 입출력                            | file I/O           | Programming | 개념   | 핵심 | 저장·불러오기 구현 수단               | 보통  | 문서확인필요     |
| 커밋                                | commit             | Git         | 개념   | 핵심 | 10개 이상 필수                   | 좋음  |            |
| 브랜치                               | branch             | Git         | 개념   | 핵심 | 생성·병합 1회 이상 필수              | 좋음  |            |
| 병합                                | merge              | Git         | 개념   | 핵심 | 브랜치 요구의 후반부                 | 좋음  |            |
| 클론                                | clone              | Git         | 명령어  | 핵심 | 1회 이상 실습 필수                 | 좋음  |            |
| 풀                                 | pull               | Git         | 명령어  | 핵심 | 1회 이상 실습 필수                 | 좋음  |            |
| 푸시                                | push               | Git         | 명령어  | 핵심 | 원격 반영. 커밋 요구의 전제            | 보통  | 문서확인필요     |
| 원격 저장소                            | remote             | Git         | 개념   | 핵심 | clone/pull이 성립하는 전제         | 좋음  | 문서확인필요     |
| README 필수 항목                      | README.md          | Tool        | 파일형식 | 핵심 | 6가지 항목 구성 조건                | 불필요 |            |
| .gitignore                        | .gitignore         | Git         | 파일형식 | 보조 | 불필요 파일 추적 제외                | 보통  | 문서확인필요     |

## 연관 개념 (문서 미등장, 이해에 필요)

| 개념 원문 분야 왜 필요한가 웹툰  |                         |             |                        |    |
| ------------------- | ----------------------- | ----------- | ---------------------- | -- |
| 인터프리터               | interpreter             | Programming | 파이썬이 실행되는 방식           | 좋음 |
| 생성자                 | `__init__`              | Programming | 클래스 작성 시 첫 관문          | 보통 |
| 리스트 / 딕셔너리          | list, dict              | Programming | 퀴즈 데이터 구조              | 좋음 |
| 직렬화 / 역직렬화          | serialize / deserialize | Data        | 객체와 JSON 사이의 변환        | 좋음 |
| 표준 입출력              | stdin, stdout           | Programming | 콘솔 입력 처리의 기반           | 보통 |
| 스테이징                | staging area, `git add` | Git         | 커밋 전 단계                | 좋음 |
| HEAD                | HEAD                    | Git         | 브랜치 이동의 기준점            | 좋음 |
| 충돌                  | conflict                | Git         | 병합 실습에서 반드시 마주치는 상황    | 좋음 |
| 리베이스                | rebase                  | Git         | 두 대의 PC 작업 시 이력 정리     | 보통 |
| 강제 푸시               | force push              | Git         | 이력 재작성 후 반영. 위험성 인지 필요 | 좋음 |
| 커밋 이력               | commit history          | Git         | 커밋 10개 요구의 평가 대상       | 보통 |

---

# M03 — Mini NPU 시뮬레이터

## 실제 등장 용어

| 용어 원문 표기 분야 유형 중요도 미션 내 맥락 웹툰 비고  |                        |             |      |    |                                      |     |             |
| --------------------------------- | ---------------------- | ----------- | ---- | -- | ------------------------------------ | --- | ----------- |
| NPU                               | Neural Processing Unit | AI/HW       | 개념   | 핵심 | 미션 주제. AI 계산 방식을 흉내 내는 대상            | 좋음  |             |
| MAC 연산                            | Multiply-Accumulate    | AI/HW       | 개념   | 핵심 | 반복문으로 직접 구현하라는 최우선 조건                | 좋음  | 미션의 중심 개념   |
| 시뮬레이터                             | simulator              | AI/HW       | 개념   | 보조 | 하드웨어 동작을 소프트웨어로 흉내 내는 형태             | 보통  |             |
| 표준 라이브러리                          | standard library       | Programming | 개념   | 핵심 | 표준 라이브러리만 사용 가능이라는 제약                | 보통  |             |
| 외부 라이브러리                          | NumPy, pandas          | Programming | 도구   | 핵심 | 사용 금지 대상으로 문서에 명시                    | 보통  | 금지 근거 이해 필요 |
| 반복문                               | loop                   | Programming | 개념   | 핵심 | 라이브러리 없이 연산을 직접 구현하는 수단              | 좋음  |             |
| 행렬 / 2차원 배열                       | matrix, 2D array       | Data        | 개념   | 핵심 | 모드1의 3×3 입력, 크기별 3/5/13/25           | 좋음  |             |
| 필터                                | filter                 | AI/HW       | 개념   | 핵심 | data.json의 filters. 패턴 판별 기준         | 좋음  |             |
| 패턴                                | pattern                | Data        | 개념   | 핵심 | data.json의 patterns. 판정 대상 데이터       | 보통  |             |
| 라벨 정규화                            | label normalization    | Data        | 개념   | 핵심 | Cross/X, `x`/`+` 등 표기 통일 요구          | 좋음  |             |
| 엡실론                               | epsilon (1e-9)         | Programming | 개념   | 핵심 | 동점 판정 허용 오차로 명시된 상수                  | 좋음  |             |
| 부동소수점                             | floating point         | Programming | 개념   | 핵심 | epsilon이 필요한 근본 원인                   | 좋음  |             |
| 동점 처리                             | tie handling           | Programming | 개념   | 핵심 | UNDECIDED 케이스 판정 규칙                  | 좋음  |             |
| 시간 복잡도                            | O(N²)                  | Programming | 개념   | 핵심 | 크기별 측정 결과를 근거로 분석 요구                 | 좋음  |             |
| 성능 측정                             | benchmark              | Tool        | 개념   | 핵심 | 크기별 10회 평균 측정                        | 보통  |             |
| JSON                              | data.json              | Data        | 파일형식 | 핵심 | 모드2 입력 데이터. meta/filters/patterns 구조 | 보통  | M02와 동일 형식  |
| 표준 입력                             | user input             | Programming | 개념   | 보조 | 모드1 사용자 직접 입력                        | 불필요 |             |
| main.py                           | main.py                | Programming | 파일형식 | 핵심 | 제출 산출물 지정 파일명                        | 불필요 |             |
| 결과 리포트                            | result report          | Tool        | 기타   | 핵심 | README에 측정 결과와 분석 포함                 | 불필요 |             |

## 연관 개념 (문서 미등장, 이해에 필요)

| 개념 원문 분야 왜 필요한가 웹툰  |                |             |                        |    |
| ------------------- | -------------- | ----------- | ---------------------- | -- |
| 합성곱                 | convolution    | AI/HW       | 필터가 패턴 위를 훑는 동작의 정식 명칭 | 좋음 |
| 내적                  | dot product    | AI/HW       | MAC 연산의 수학적 정체         | 좋음 |
| 가중치                 | weight         | AI/HW       | 필터 값이 의미하는 것           | 좋음 |
| 텐서                  | tensor         | AI/HW       | 행렬의 일반화. 딥러닝 데이터 단위    | 보통 |
| 추론                  | inference      | AI/HW       | NPU가 실제로 담당하는 작업       | 좋음 |
| GPU와의 차이            | GPU vs NPU     | AI/HW       | NPU가 왜 따로 존재하는가        | 좋음 |
| IEEE 754            | IEEE 754       | Programming | 부동소수점 오차의 규격상 근거       | 보통 |
| 빅오 표기법              | Big-O notation | Programming | O(N²) 표기를 읽는 법         | 좋음 |
| 메모리 지역성             | locality       | Programming | 1D와 2D 배열 성능 차이의 원인    | 좋음 |
| 캐시                  | cache          | Linux/OS    | 지역성이 성능으로 이어지는 경로      | 좋음 |
| 어텐션                 | attention      | AI/HW       | 컨텍스트 길이가 O(N²)인 이유와 연결 | 좋음 |

---

# 예비과정 전체 — 중복 제거 용어 목록

동일 개념을 하나로 합치고 등장 미션을 표시했습니다. (실제 등장 용어만 집계, 연관 개념 제외)

| 용어 분야 M01 M02 M03       |             |   |   |   |
| ----------------------- | ----------- | - | - | - |
| CLI                     | Linux/OS    | ● |   |   |
| 터미널                     | Linux/OS    | ● | ● |   |
| 셸                       | Linux/OS    | ● |   |   |
| 절대/상대 경로                | Linux/OS    | ● |   |   |
| 파일 권한 (r/w/x)           | Linux/OS    | ● |   |   |
| 권한 숫자 표기 (755/644)      | Linux/OS    | ● |   |   |
| 숨김 파일                   | Linux/OS    | ● |   |   |
| 디렉토리                    | Linux/OS    | ● |   |   |
| sudo                    | Linux/OS    | ● |   |   |
| 환경변수 주입                 | Linux/OS    | ● |   |   |
| Docker                  | Container   | ● |   |   |
| 이미지                     | Container   | ● |   |   |
| 컨테이너                    | Container   | ● |   |   |
| Dockerfile              | Container   | ● |   |   |
| 베이스 이미지                 | Container   | ● |   |   |
| hello-world             | Container   | ● |   |   |
| ubuntu 이미지              | Container   | ● |   |   |
| docker info             | Container   | ● |   |   |
| docker ps / ps -a       | Container   | ● |   |   |
| docker logs             | Container   | ● |   |   |
| docker stats            | Container   | ● |   |   |
| attach                  | Container   | ● |   |   |
| exec                    | Container   | ● |   |   |
| 볼륨                      | Container   | ● |   |   |
| 바인드 마운트                 | Container   | ● |   |   |
| OrbStack                | Container   | ● |   |   |
| Docker Compose          | Container   | ● |   |   |
| 포트 매핑                   | Network     | ● |   |   |
| curl                    | Network     | ● |   |   |
| NGINX                   | Web         | ● |   |   |
| Git                     | Git         | ● | ● |   |
| GitHub                  | Git         | ● | ● |   |
| git config              | Git         | ● |   |   |
| 저장소                     | Git         | ● | ● |   |
| 커밋                      | Git         |   | ● |   |
| 브랜치                     | Git         |   | ● |   |
| 병합                      | Git         |   | ● |   |
| 클론                      | Git         |   | ● |   |
| 풀                       | Git         |   | ● |   |
| 푸시                      | Git         |   | ● |   |
| 원격 저장소                  | Git         |   | ● |   |
| .gitignore              | Git         |   | ● |   |
| 파이썬                     | Programming |   | ● | ● |
| 콘솔                      | Programming |   | ● | ● |
| 클래스                     | Programming |   | ● |   |
| 객체 / 인스턴스               | Programming |   | ● |   |
| 메서드                     | Programming |   | ● |   |
| 속성                      | Programming |   | ● |   |
| 함수                      | Programming |   | ● |   |
| 예외 처리                   | Programming |   | ● |   |
| 반복문                     | Programming |   | ● | ● |
| 조건문                     | Programming |   | ● |   |
| 변수                      | Programming |   | ● |   |
| 파일 입출력                  | Programming |   | ● |   |
| 표준 라이브러리                | Programming |   |   | ● |
| 외부 라이브러리 (NumPy/pandas) | Programming |   |   | ● |
| 엡실론                     | Programming |   |   | ● |
| 부동소수점                   | Programming |   |   | ● |
| 동점 처리                   | Programming |   |   | ● |
| 시간 복잡도 O(N²)            | Programming |   |   | ● |
| 표준 입력                   | Programming |   |   | ● |
| main.py                 | Programming |   |   | ● |
| JSON                    | Data        |   | ● | ● |
| UTF-8                   | Data        |   | ● |   |
| 인코딩                     | Data        |   | ● |   |
| 영속성                     | Data        | ● | ● |   |
| 행렬 / 2차원 배열             | Data        |   |   | ● |
| 패턴                      | Data        |   |   | ● |
| 라벨 정규화                  | Data        |   |   | ● |
| NPU                     | AI/HW       |   |   | ● |
| MAC 연산                  | AI/HW       |   |   | ● |
| 시뮬레이터                   | AI/HW       |   |   | ● |
| 필터                      | AI/HW       |   |   | ● |
| 토큰                      | Security    | ● |   |   |
| 마스킹                     | Security    | ● |   |   |
| SSH 키                   | Security    | ● |   |   |
| README                  | Tool        | ● | ● | ● |
| 코드블록                    | Tool        | ● |   |   |
| VSCode                  | Tool        | ● |   |   |
| 트러블슈팅                   | Tool        | ● |   |   |
| 성능 측정                   | Tool        |   |   | ● |
| 결과 리포트                  | Tool        |   |   | ● |

**중복 제거 후 총 82개**

## 분야별 용어 수 (실제 등장 용어 기준)

| 분야 개수       |         |
| ----------- | ------- |
| Programming | 21개     |
| Container   | 17개     |
| Git         | 12개     |
| Linux/OS    | 10개     |
| Data        | 7개      |
| Tool        | 6개      |
| AI/HW       | 4개      |
| Security    | 3개      |
| Network     | 2개      |
| Web         | 1개      |
| **합계**      | **82개** |

연관 개념까지 포함하면 **총 121개** (실제 등장 82 + 연관 39).

## 미션별 용어 수

| 미션 실제 등장 연관 개념  |     |     |
| --------------- | --- | --- |
| M01             | 42개 | 17개 |
| M02             | 25개 | 11개 |
| M03             | 19개 | 11개 |

---

# 웹툰 설명 후보

비유·상황극으로 설명할 때 특히 효과가 큰 용어만 추렸습니다. 선정 기준은 (1) 혼동이 잦거나 (2) 눈에 보이지 않아 추상적이거나 (3) "왜 이렇게 되는가"가 직관에 반하는 경우입니다.

## 1순위 — 혼동 해소형 (두 개념을 나란히 놓아야 이해되는 것)

| 용어 쌍 미션 왜 웹툰인가  |          |                                 |
| --------------- | -------- | ------------------------------- |
| 이미지 ↔ 컨테이너      | M01      | 붕어빵 틀과 붕어빵. 그림 한 장이 설명 열 줄을 이긴다 |
| attach ↔ exec   | M01      | 같은 방에 들어가는 두 가지 방법. 나올 때 결과가 다름 |
| 셸 ↔ 터미널         | M01      | 창구 직원과 창구. 실무자도 자주 섞어 씀         |
| Git ↔ GitHub    | M01, M02 | 미션 문서가 직접 "역할 차이를 설명하라"고 요구     |
| 볼륨 ↔ 바인드 마운트    | M01      | 둘 다 데이터를 남기는데 주인이 다름            |
| 절대 경로 ↔ 상대 경로   | M01      | 주소 적는 두 방식. 지도 비유가 잘 맞음         |
| 클래스 ↔ 객체        | M02      | 설계도와 실제 제품                      |

## 2순위 — 추상 개념 시각화형

| 용어 미션 왜 웹툰인가    |     |                               |
| --------------- | --- | ----------------------------- |
| 포트 매핑           | M01 | 건물 정문과 호실 번호. "왜 필요한가"가 핵심 질문 |
| 파일 권한 / 755     | M01 | 출입증 등급. 숫자가 왜 그 숫자인지          |
| 브랜치와 병합         | M02 | 갈라진 길이 다시 합쳐지는 그림             |
| 충돌 (연관)         | M02 | 두 사람이 같은 문장을 다르게 고친 상황극       |
| MAC 연산          | M03 | 곱하고 더하기를 계속 쌓는 컨베이어 벨트        |
| 필터와 합성곱         | M03 | 도장을 찍어가며 훑는 동작                |
| 시간 복잡도 O(N²)    | M03 | 사람이 2배면 악수는 4배. 체감 예시가 강력     |
| NPU vs GPU (연관) | M03 | 만능 일꾼과 한 가지만 잘하는 전문가          |

## 3순위 — 직관에 반해서 설명이 필요한 것

| 용어 미션 왜 웹툰인가  |          |                           |
| ------------- | -------- | ------------------------- |
| 부동소수점 / 엡실론   | M03      | 0.1+0.2가 0.3이 아니라는 충격     |
| 영속성           | M01, M02 | 지웠는데 남아 있고, 남을 줄 알았는데 사라짐 |
| UTF-8 / 인코딩   | M02      | 한글이 깨지는 순간의 좌절이 곧 교재      |
| 토큰 마스킹        | M01      | 캡처 한 장으로 계정이 털리는 상황극      |
| 커널 (연관)       | M01      | 보이지 않지만 모든 것을 중개하는 존재     |
| 네임스페이스 (연관)   | M01      | 같은 건물인데 서로 다른 층만 보이는 상태   |
| PID 1 (연관)    | M01      | 컨테이너가 즉시 죽는 이유. 왜?가 강렬함   |
| 강제 푸시 (연관)    | M02      | 남의 작업을 지워버리는 사고 시나리오      |

**웹툰 후보 총 27개** (1순위 7 · 2순위 8 · 3순위 12)

---

# 다음 단계 제안

1. 원본 미션 문서 3개를 확인해 `문서확인필요` 표시 정리 (M02 11건, M03 0건)
2. 중요도 `핵심` 용어부터 설명 본문 작성 — 동료평가 질의응답에 직결
3. 웹툰 1순위 7개를 우선 제작 — 혼동 해소형이 학습 효과가 가장 큼
4. 본과정 미션 10개 진행 시 같은 형식으로 추가 추출해 사전 확장