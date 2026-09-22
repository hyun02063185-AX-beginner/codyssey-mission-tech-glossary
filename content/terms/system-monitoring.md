# System Monitoring

## 한 줄 설명

시스템 자원과 서비스 상태를 지속적으로 측정하는 운영 활동.

## 쉽게 설명하면

CPU·메모리·응답 시간·오류율이 평소와 다른지 살피는 일이다.

## 정확한 설명

지표 수집, 대시보드, 임계값 경보를 통해 이상을 감지한다. 관측 데이터는 배포·트래픽 변화와 함께 해석해야 한다.

## 언제 쓰나

CPU 사용률 급등과 5xx 오류 증가에 경보를 설정한다.

## 기억할 경계

경보가 많으면 중요한 장애가 묻히므로 행동 가능한 기준이 필요하다.

## 이 미션에서는 왜 필요한가

이 회차가 만드는 자가 점검 프로그램이 하는 일 전체를 가리키는 이름입니다. CPU·메모리·디스크·프로세스·포트를 각각 재는 코드를 따로 보면 도구 사용법이지만, 묶어서 보면 "평소와 다른지"를 판정하는 하나의 활동입니다. 그래서 기준값을 먼저 정해야 합니다.

## 코드 예

```python
import psutil

THRESHOLD = {'cpu': 80.0, 'memory': 85.0, 'disk': 90.0}

def check():
    reading = {
        'cpu': psutil.cpu_percent(interval=1),
        'memory': psutil.virtual_memory().percent,
        'disk': psutil.disk_usage('/').percent,
    }
    return {k: (v, v > THRESHOLD[k]) for k, v in reading.items()}

# 값을 찍는 것과 경고를 내는 것은 다르다. 기준이 있어야 후자가 된다
```

## 관련 용어

- `observability`
- `memory-accounting`
