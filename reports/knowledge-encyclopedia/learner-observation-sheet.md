# 학습자 관찰 기록지

> `scripts/build_learner_test_plan.py` 가 만든다. 직접 고치지 않는다.
> **아직 아무도 테스트하지 않았다.** 관찰이 들어오면 `data/reviews/learner-test-plan.json` 의 `observations` 에 넣는다.

## 진행 방법

- 한 사람당 4개를 읽힌다. 8개는 두 사람 몫이다. 피로가 답을 흐린다.
- 각 사람에게 쉬움 1 · 중간 1~2 · 어려움 1~2 를 섞어 준다.
- CURRENT 와 PROPOSED 를 같은 사람에게 둘 다 보이지 않는다. 두 번째는 첫 번째 때문에 이해된다.
- 진행자는 읽는 동안 설명하지 않는다. 막히는 자리가 자료다.
- '이해되셨나요' 를 묻지 않는다. 거의 모두가 그렇다고 답한다.
- 답을 점수로 바꾸지 않는다. 자기 말로 설명한 문장을 그대로 받아 적는다.

## 물어볼 것

1. 읽기 전 — 이 낱말을 들어 본 적 있습니까? 들어 봤다면 무엇이라고 생각하십니까?
2. 읽는 중 — 읽다가 멈춘 자리가 있으면 그 문장을 짚어 주세요.
3. 화면을 덮고 — 이 용어를 자기 말로 한두 문장으로 설명해 보세요.
4. 이게 왜 필요한지 말해 보세요.
5. 이해되지 않은 낱말이나 문장이 있었습니까?
6. 예시가 이해에 도움이 되었습니까, 아니면 더 헷갈렸습니까?
7. 더 알고 싶습니까, 아니면 정보가 이미 너무 많았습니까?

**3번이 핵심이다.** 문장을 그대로 기억했는지가 아니라 자기 말로 다시 만들 수 있는지를 본다. 전문용어를 못 써도 개념을 설명하면 PASS 다. 반대로 원문을 되풀이하면서 뜻을 설명하지 못하면 PASS 가 아니다.

## 배치

| 참여자 | 순서 |
| --- | --- |
| **P1** | `mysql` 현재 → `variable` 제안 → `commit` 현재 → `process` 제안 → `tcp` 현재 |
| **P2** | `mysql` 제안 → `variable` 현재 → `commit` 제안 → `process` 현재 → `tcp` 제안 |
| **P3** | `dom-update` 현재 → `o-constant-time` 제안 → `temperature` 현재 → `json-web-token` 제안 |
| **P4** | `dom-update` 제안 → `o-constant-time` 현재 → `temperature` 제안 → `json-web-token` 현재 |

참여자가 둘뿐이면 **P1 · P2** 만 진행한다. 용어 5개가 두 판본으로 읽힌다.

---

## 기록지

### P1

```
TERM              mysql  (basic · Data/DB)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              variable  (mid · Programming)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              commit  (mid · SWE/Git)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              process  (hard · OS/System)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              tcp  (hard · Network)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

### P2

```
TERM              mysql  (basic · Data/DB)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              variable  (mid · Programming)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              commit  (mid · SWE/Git)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              process  (hard · OS/System)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              tcp  (hard · Network)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

### P3

```
TERM              dom-update  (mid · Web)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              o-constant-time  (mid · Algorithms)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              temperature  (mid · AI)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              json-web-token  (hard · Security)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

### P4

```
TERM              dom-update  (mid · Web)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              o-constant-time  (mid · Algorithms)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              temperature  (mid · AI)
VERSION           PROPOSED

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

```
TERM              json-web-token  (hard · Security)
VERSION           CURRENT

RESTATE           PASS / PARTIAL / FAIL
  (자기 말로 옮긴 문장을 그대로 받아 적는다)
  

WHY               PASS / PARTIAL / FAIL
  

UNKNOWN_WORDS     

CONFUSION_POINT   (읽다가 멈춘 문장)
  

EXAMPLE_HELPED    YES / NO / N/A

OBSERVER_NOTE     
  
```

---

개인정보는 적지 않는다. 참여자는 P1~P4 로만 구분한다.

