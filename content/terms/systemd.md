# systemd

## 한 줄 설명

Linux service와 boot process를 관리하는 init system.

## 쉽게 설명하면

서비스를 자동으로 띄우고, 죽으면 다시 살리고, 부팅할 때 켜 주는 관리자입니다.

## 정확한 설명

서비스 정의 파일에 실행 명령과 재시작 정책, 의존 관계를 적어 두면 그에 따라 프로세스를 관리한다. 표준 출력은 자체 로그 저장소로 모이므로 파일을 따로 만들지 않아도 조회할 수 있고, 부팅 시 자동 시작은 별도로 켜 줘야 한다.

## 이 미션에서는 왜 필요한가

이 회차의 자동 실행을 다루는 확장 개념입니다. 일정 주기 실행에는 앞서 본 방식이 맞지만, 계속 떠 있어야 하는 프로그램은 이쪽이 맞습니다. 죽었을 때 다시 살리는 일을 대신해 주기 때문입니다.

## 코드 예

```text
# /etc/systemd/system/agent.service
[Unit]
Description=점검 에이전트
After=network.target

[Service]
User=agent
ExecStart=/usr/bin/python3 /opt/agent/main.py
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target

# 고친 뒤에는 다시 읽어야 한다
# sudo systemctl daemon-reload
# sudo systemctl enable --now agent     enable 이 부팅 시 자동 시작
# journalctl -u agent -f                로그는 여기로 모인다
```

## 주의할 점 / 경계 조건

설정 파일을 고친 뒤에는 다시 읽어 들이는 명령이 필요합니다. 재시작만 하면 옛 설정으로 뜹니다.

## 관련 용어

- `process`
- `linux`

## 흔한 오해

시작했으니 부팅 때도 뜬다고 생각하기 쉽지만, 지금 띄우는 것과 부팅 시 자동 시작은 다른 설정입니다. 둘 다 해야 합니다.

## 동료평가 질문

주기 실행과 상주 서비스 중 이번 점검이 어느 쪽에 맞는지 정하고, 그 이유를 설명할 수 있나요?
