// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene05: TeachingScene = {
  "id": "05",
  "title": "하나씩 꺼내기: Iterable·Iterator·Generator",
  "question": "Python은 여러 값을 어떻게 하나씩 꺼내고, Generator는 그 과정에서 어떤 역할을 할까?",
  "ctx": "Scene 05",
  "tag": "개념 예시",
  "addressing": "id",
  "legacy": [
    "list",
    "drop",
    "jsonl",
    "gen",
    "give",
    "pause",
    "ask",
    "resume",
    "end",
    "drop",
    "list",
    "keep",
    "real",
    "check",
    "apply",
    "wrap"
  ],
  "home": "iterable",
  "steps": [
    {
      "id": "repeat",
      "mode": "rep",
      "home": "repeat",
      "say": "여러 값에서 값을 하나씩 차례로 꺼내 쓰는 일을 반복이라고 합니다.",
      "title": "반복",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“과일이 세 개 든 리스트가 있습니다. 사과, 바나나, 포도. 이걸 하나씩 꺼내서 쓰고 싶어요. 첫 번째로 사과, 다음에 바나나, 다음에 포도. 이렇게 여러 값에서 하나씩 차례로 꺼내 쓰는 일을 반복이라고 합니다. 오늘은 Python이 이걸 실제로 어떻게 하는지 들여다봅니다.”"
        ]
      }
    },
    {
      "id": "iterable",
      "mode": "itr",
      "sub": "iterable",
      "home": "iterable",
      "say": "리스트처럼 값을 하나씩 꺼내며 반복할 수 있는 대상을 Iterable이라고 합니다.",
      "title": "Iterable",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“리스트처럼 하나씩 꺼내며 반복할 수 있는 대상을 Iterable이라고 해요. ‘반복할 수 있는 것’이라는 뜻입니다. 그런데 리스트가 직접 ‘지금 몇 번째까지 꺼냈지’를 기억하는 건 아니에요.”"
        ]
      }
    },
    {
      "id": "iter",
      "mode": "itr",
      "sub": "iter",
      "home": "iterable",
      "say": "Iterable에서는 Iterator를 얻을 수 있고, 값을 꺼내는 일은 Iterator가 맡습니다.",
      "title": "Iterator 얻기",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“Iterable에서는 Iterator라는 것을 얻을 수 있습니다. 이름표처럼 iter()라고 적어 둘게요. 실제로 하나씩 꺼내는 일은 이 Iterator가 맡습니다. 아직 아무것도 꺼내지 않았어요.”"
        ]
      }
    },
    {
      "id": "next1",
      "mode": "itr",
      "sub": "next1",
      "home": "iterable",
      "say": "Iterator에 다음 값을 요청하면 첫 번째 값을 건네고, 어디까지 꺼냈는지 기억합니다.",
      "title": "다음 값 요청",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“Iterator에 ‘다음 값 줘’라고 요청합니다. 이것도 이름표로 next()라고 적어 둘게요. 그러면 사과를 건네주고, ‘첫 번째까지 꺼냈다’는 위치를 기억합니다.”"
        ]
      }
    },
    {
      "id": "next2",
      "mode": "itr",
      "sub": "next2",
      "home": "iterable",
      "say": "다시 요청하면 기억해 둔 위치 다음의 값을 건넵니다.",
      "title": "다시 요청",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“다시 요청하면 처음부터가 아니라 기억해 둔 위치 다음, 바나나를 줍니다. Iterator가 진행 상태를 기억하고 있기 때문이에요.”"
        ]
      }
    },
    {
      "id": "iterend",
      "mode": "itr",
      "sub": "iterend",
      "home": "iterable",
      "say": "꺼낼 값이 더 없으면 Iterator는 끝나며, 원래 리스트는 그대로 남아 있습니다.",
      "title": "Iterator가 끝남",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“포도까지 꺼낸 뒤 한 번 더 요청하면 ‘더 없어요’라고 알립니다. Iterator는 여기서 끝나요. 그런데 리스트를 보세요. 사과, 바나나, 포도가 그대로 있습니다. 꺼낸다고 리스트에서 빠지는 게 아니라, Iterator가 위치만 옮긴 거예요.”"
        ]
      }
    },
    {
      "id": "rel",
      "mode": "sets",
      "sub": "rel",
      "home": "rel",
      "say": "모든 Iterator는 Iterable이기도 하지만, 리스트처럼 Iterable이라고 모두 Iterator인 것은 아닙니다.",
      "title": "Iterable과 Iterator의 관계",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“둘의 관계를 정리해 봅시다. 큰 원이 Iterable, 반복할 수 있는 것들입니다. 그 안에 Iterator가 있어요. Iterator도 반복할 수 있으니까 Iterable이기도 합니다. 하지만 리스트는 Iterable이지만 Iterator는 아니죠. 위치를 기억하는 일은 리스트가 아니라 리스트에서 얻은 Iterator가 했으니까요.”"
        ]
      }
    },
    {
      "id": "genkind",
      "mode": "sets",
      "sub": "genkind",
      "home": "rel",
      "say": "Generator 객체는 Iterator의 한 종류입니다.",
      "title": "Generator 객체",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "“이제 오늘의 주인공입니다. Iterator 안에 Generator 객체가 있습니다. Generator 객체는 Iterator의 한 종류예요. 그러니까 Generator도 ‘다음 값 줘’ 요청을 받으면 값을 하나 건네고, 어디까지 했는지 기억합니다. 리스트에서 얻은 Iterator와 다른 점은, 미리 담긴 값을 꺼내는 게 아니라 요청을 받을 때 값을 만들어 낸다는 거예요.”"
        ]
      }
    },
    {
      "id": "gen",
      "mode": "gen",
      "sub": "start",
      "home": "gen",
      "say": "Generator는 값을 미리 모두 만들어 두지 않고, 요청이 올 때마다 하나씩 만들어 건넵니다.",
      "title": "Generator",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“Scene 04의 기록 파일로 봅시다. 왼쪽 Generator는 기록을 미리 모두 만들어 두지 않았어요. 파일 줄은 아직 하나도 읽지 않았습니다. 오른쪽에서 앞에서 본 것처럼 ‘다음 값 줘’, 여기서는 ‘다음 기록 줘’라고 요청하면 그때 하나를 만들어 건넵니다.”"
        ]
      }
    },
    {
      "id": "give",
      "mode": "gen",
      "sub": "give",
      "home": "gen",
      "say": "yield는 Generator가 값을 하나 건네는 자리입니다.",
      "title": "yield · 값을 건넴",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“첫 요청이 오면 Generator가 1번 줄을 읽어 기록 #1을 건넵니다. 이렇게 값을 건네는 자리를 yield라고 해요.”"
        ]
      }
    },
    {
      "id": "pause",
      "mode": "gen",
      "sub": "pause",
      "home": "gen",
      "say": "값을 건넨 뒤 Generator는 그 자리에서 잠시 멈추고 다음 요청을 기다립니다.",
      "title": "yield · 잠시 멈춤",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“여기가 가장 중요합니다. 값을 건넨 뒤 Generator는 끝나는 게 아니라, 그 자리에서 잠시 멈춰요. 책갈피를 꽂아 둔 것처럼요. Iterator가 위치를 기억했던 것과 같은 일을 Generator는 ‘멈춘 자리’로 기억합니다.”"
        ]
      }
    },
    {
      "id": "ask",
      "mode": "gen",
      "sub": "ask",
      "home": "gen",
      "say": "처리하는 쪽이 다음 값을 요청하면 Generator가 다시 움직입니다.",
      "title": "다음 요청",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“처리를 마친 오른쪽이 ‘다음 기록 줘’라고 요청합니다. 그러면 멈춰 있던 Generator가 다시 움직여요.”"
        ]
      }
    },
    {
      "id": "resume",
      "mode": "gen",
      "sub": "resume",
      "home": "gen",
      "say": "Generator는 처음부터 다시 시작하지 않고, 멈췄던 바로 그 자리에서 이어서 다음 값을 건넵니다.",
      "title": "멈춘 곳에서 이어감",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“어디서부터 다시 시작할까요?” (답을 들은 뒤) “처음부터가 아니라 책갈피를 꽂아 둔 곳, 멈췄던 바로 그 자리에서 이어 갑니다. 그래서 2번 줄을 읽어 #2를 건네죠.”"
        ]
      }
    },
    {
      "id": "end",
      "mode": "gen",
      "sub": "end",
      "home": "gen",
      "say": "건넬 기록이 더 없으면 Generator는 끝납니다.",
      "title": "Generator가 끝남",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“5번 줄까지 건네고 나면 더 건넬 기록이 없습니다. 앞의 Iterator처럼 Generator도 끝나요.”"
        ]
      }
    },
    {
      "id": "jsonl",
      "mode": "jsonl",
      "home": "jsonl",
      "say": "JSONL은 기록을 한 줄에 하나씩 적는 저장 형식이고, Generator는 그 기록을 요청받을 때 하나씩 건네는 처리 방식입니다.",
      "title": "JSONL과 Generator",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“여기서 자주 섞이는 두 가지를 나눠 봅시다. JSONL은 파일에 기록을 한 줄에 하나씩 적는 저장 형식이에요. Generator는 그 기록을 요청받을 때 하나씩 건네는 처리 방식이고요. 한 줄씩 적힌 파일은 하나씩 건네기에 잘 맞지만, JSONL이라는 형식이 메모리를 아껴 주는 것은 아닙니다.”"
        ]
      }
    },
    {
      "id": "drop",
      "mode": "keep",
      "sub": "drop",
      "home": "keep",
      "say": "받은 기록을 처리하고 보관하지 않으면, 메모리에 기록이 쌓이지 않습니다.",
      "title": "받고 보관하지 않기",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“기록이 10만 줄이라고 상상해 봅시다. 받은 기록의 금액을 합계에 더하고 기록은 버린다면, 메모리에는 합계 하나와 지금 받은 기록 하나만 있습니다.”"
        ]
      }
    },
    {
      "id": "list",
      "mode": "keep",
      "sub": "list",
      "home": "keep",
      "say": "Generator가 건넨 기록을 모두 리스트에 모으면, 결국 모든 기록이 메모리에 쌓입니다.",
      "title": "받은 기록을 모두 모으기",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“그런데 Generator가 건넨 기록을 받는 족족 리스트에 모아 두면 어떻게 될까요?” (답을 들은 뒤) “결국 10만 개가 모두 메모리에 쌓입니다.”"
        ]
      }
    },
    {
      "id": "keep",
      "mode": "keep",
      "sub": "both",
      "home": "keep",
      "say": "메모리 사용은 Generator를 썼는지보다 받은 값을 어떻게 보관하는지에 달려 있습니다.",
      "title": "메모리는 보관 방식에 달림",
      "figure": "s5",
      "example": "fictional-records",
      "instructor": {
        "script": [
          "“그러니까 Generator를 썼다는 것만으로 메모리가 항상 적게 드는 건 아니에요. 받은 값을 어떻게 보관하느냐가 결정합니다. 파일에는 두 경우 모두 10만 줄이 그대로 있습니다.”"
        ]
      }
    },
    {
      "id": "real",
      "mode": "real",
      "home": "real",
      "say": "실제 용돈 기입장은 JSONL 파일을 한 줄씩 읽어 기록을 하나씩 건네는 Generator를 씁니다.",
      "title": "실제 사례 · 용돈 기입장의 Generator",
      "figure": "s5",
      "example": "ledger",
      "real": true,
      "instructor": {
        "script": [
          "“실제 용돈 기입장에도 기록 파일을 한 줄씩 읽어 하나씩 건네는 Generator가 있습니다. 그리고 그 기록을 쓰는 쪽마다 보관하는 양이 달라요. 목록은 최근 몇 개만, 검색은 맞는 기록만, 요약은 합계만 남깁니다.”"
        ]
      }
    },
    {
      "id": "check",
      "kind": "check",
      "say": "설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.",
      "title": "이해 확인",
      "figure": "check",
      "example": "concept",
      "questions": [
        {
          "kind": "기본 · 관계",
          "q": "리스트는 Iterable인가요, Iterator인가요?"
        },
        {
          "kind": "기본 · 종류",
          "q": "Generator 객체와 Iterator는 어떤 관계인가요?"
        },
        {
          "kind": "기본 · yield",
          "q": "yield로 기록 하나를 전달한 뒤 다음 요청이 오면 어디서 실행이 이어질까요?"
        }
      ],
      "reveal": {
        "answers": [
          "Iterable입니다. Iterator는 아닙니다(리스트에서 Iterator를 얻음).",
          "Generator 객체는 Iterator의 한 종류입니다. 그래서 Iterable이기도 합니다.",
          "멈췄던 그 자리(값을 건넨 바로 다음)에서 이어집니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "리스트는 Iterable인가요, Iterator인가요?",
            "a": "Iterable입니다. Iterator는 아닙니다(리스트에서 Iterator를 얻음).",
            "miss": "“둘 다” → 단계 7: 위치를 기억하는 건 리스트가 아니라 얻은 Iterator"
          },
          {
            "q": "Generator 객체와 Iterator는 어떤 관계인가요?",
            "a": "Generator 객체는 Iterator의 한 종류입니다. 그래서 Iterable이기도 합니다.",
            "miss": "“Generator는 Iterator의 기능 중 하나” → 단계 8: 기능이 아니라 종류"
          },
          {
            "q": "yield로 기록 하나를 전달한 뒤 다음 요청이 오면 어디서 실행이 이어질까요?",
            "a": "멈췄던 그 자리(값을 건넨 바로 다음)에서 이어집니다.",
            "miss": "“처음부터 다시” → 단계 13의 책갈피"
          }
        ]
      }
    },
    {
      "id": "apply",
      "kind": "check",
      "say": "새로운 상황에 적용해 봅시다.",
      "title": "적용",
      "figure": "check",
      "example": "concept",
      "questions": [
        {
          "kind": "적용 · 리스트",
          "q": "Iterator로 리스트의 값을 끝까지 꺼낸 뒤, 리스트의 값은 몇 개 남아 있을까요?"
        },
        {
          "kind": "적용 · 보관",
          "q": "Generator가 전달한 기록을 모두 리스트에 모아 둔다면 메모리 사용은 어떻게 달라질까요?"
        },
        {
          "kind": "적용 · 형식",
          "q": "기록을 JSONL 파일로 저장했으니 메모리가 저절로 절약될까요?"
        }
      ],
      "reveal": {
        "answers": [
          "세 개 그대로. 꺼낸다고 리스트에서 빠지지 않습니다.",
          "모든 기록이 메모리에 쌓여, 한꺼번에 모으는 방법과 비슷해집니다.",
          "아니요. JSONL은 저장 형식이고, 메모리는 읽고 처리하고 보관하는 방식에 달려 있습니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "Iterator로 리스트의 값을 끝까지 꺼낸 뒤, 리스트의 값은 몇 개 남아 있을까요?",
            "a": "세 개 그대로. 꺼낸다고 리스트에서 빠지지 않습니다.",
            "miss": "“0개” → 단계 6 ‘리스트는 그대로’"
          },
          {
            "q": "Generator가 전달한 기록을 모두 리스트에 모아 둔다면 메모리 사용은 어떻게 달라질까요?",
            "a": "모든 기록이 메모리에 쌓여, 한꺼번에 모으는 방법과 비슷해집니다.",
            "miss": "“Generator니까 여전히 적다” → 단계 17"
          },
          {
            "q": "기록을 JSONL 파일로 저장했으니 메모리가 저절로 절약될까요?",
            "a": "아니요. JSONL은 저장 형식이고, 메모리는 읽고 처리하고 보관하는 방식에 달려 있습니다.",
            "miss": "“JSONL은 가벼운 형식이라” → 단계 15"
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "sum",
      "home": "iterable",
      "say": "Iterator는 값을 하나씩 꺼내 주고, Generator는 그 한 종류로서 필요할 때 값을 만들어 건네며, 메모리 사용은 받은 값을 보관하는 방식에 달려 있습니다.",
      "title": "정리",
      "figure": "s5",
      "example": "concept",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면(Scene 06 Decorator)으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "기록 추가·수정·삭제 명령마다 같은 오류 처리를 반복해서 적어야 할까요?",
        "target": {
          "scene": "06",
          "step": "reassign"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>비유와 실제 동작:</b> ‘위치를 기억한다’, ‘책갈피’는 비유다. 실제로 Iterator는 다음에 돌려줄 값을 결정하는 내부 상태를 갖고, Generator는 멈춘 지점의 실행 상태(지역 변수 등)를 보존한다.",
      "<b>Iterable과 Iterator:</b> Iterable은 <code>iter()</code>에 넘기면 Iterator를 돌려주는 대상이다(원본 관계 R22 ‘iter()로 Iterator를 내줌’). Iterator는 <code>next()</code>로 다음 값을 주고, 자기 자신도 <code>iter()</code>에 넘기면 자기 자신을 돌려주므로 Iterable이기도 하다(R41 ‘Iterator도 Iterable’). 리스트·문자열은 Iterable이지만 Iterator가 아니다.",
      "<b>리스트는 그대로:</b> 리스트에서 얻은 Iterator를 끝까지 써도 리스트의 값은 줄지 않는다. 같은 리스트에서 Iterator를 새로 얻으면 처음부터 다시 꺼낼 수 있다. 반면 끝난 Iterator·Generator는 다시 처음부터 값을 주지 않는다.",
      "<b>Generator 함수와 Generator 객체:</b> 안에 <code>yield</code>가 있는 함수를 Generator 함수라고 하며, 그 함수를 호출하면 본문이 바로 실행되지 않고 <b>Generator 객체</b>가 만들어진다. 이 객체가 Iterator다(R23 ‘Iterator의 한 종류’). ‘Generator는 Iterator의 하위 기능’이라고 말하지 않는다.",
      "<b>‘끝났다고 알린다’:</b> 실제로는 <code>StopIteration</code>이라는 신호로 알린다. <code>for</code> 문은 이 신호를 받으면 반복을 끝낸다.",
      "<b>JSONL과 메모리:</b> JSONL 형식 자체가 메모리를 절약하지 않는다. 한 줄이 기록 하나라서 한 줄씩 읽어 처리하기 쉬울 뿐이다.",
      "<b>상상한 숫자:</b> 100,000줄은 규모를 느끼기 위한 상상이며 측정값이 아니다.",
      "<b>실제 ledger (<code>d14e812</code>):</b> <code>_iter_jsonl()</code>이 파일을 한 줄씩 읽어 JSON 하나씩 <code>yield</code>하고, <code>iter_all()</code>이 그것을 기록 하나로 만들어 <code>yield</code>한다. 목록은 최근 N개만(<code>deque(maxlen=limit)</code>), 검색은 맞는 기록을 리스트에, 요약은 합계만 보관한다. 기본 강의에서는 이 이상 호출 관계를 따라가지 않는다."
    ],
    "deep": [
      "<code>__iter__</code>와 <code>__next__</code> — Iterable·Iterator가 되기 위한 특별한 메서드",
      "StopIteration — Iterator가 끝났음을 알리는 신호와 <code>for</code> 문의 처리",
      "직접 Iterator 만들기 — 클래스로 진행 상태를 관리하는 예",
      "<code>for</code> 문의 동작 — 내부에서 <code>iter()</code>를 한 번, <code>next()</code>를 반복해서 부르는 방식",
      "Generator 함수 문법 — <code>def</code> 안의 <code>yield</code>, Generator 표현식",
      "소진과 재생성 — 끝난 Generator는 다시 값을 주지 않으며, 다시 받으려면 새로 만든다",
      "파일 자원 수명 — 파일을 읽는 Generator를 끝까지 소비하지 않을 때 파일이 닫히는 시점",
      "<code>yield</code>와 <code>return</code>의 차이, 메모리 측정",
      "기존 자료 — Scene 05 v2 원고와 그림"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-05/storyboard.md",
    "sha256": "9f9a19fafaf448caccc1389ed0724173bf265d0f08a4865a9d2ddccb0411b634"
  }
};
