// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene06: TeachingScene = {
  "id": "06",
  "title": "함수를 감싸 꾸미기: Decorator",
  "question": "함수를 그대로 사용하면서 앞뒤에 새로운 일을 붙일 수 있을까?",
  "ctx": "Scene 06",
  "tag": "개념 그림",
  "addressing": "id",
  "legacy": [
    "rep",
    "gather",
    "deco",
    "inner",
    "outer",
    "ok",
    "err",
    "real",
    "real",
    "uses",
    "check",
    "apply",
    "wrap"
  ],
  "home": "deco",
  "steps": [
    {
      "id": "reassign",
      "mode": "reassign",
      "home": "reassign",
      "say": "a = a + 1은 a의 값으로 새 값을 만든 뒤, 그 결과에 다시 a라는 이름을 연결합니다.",
      "title": "같은 이름에 새 결과 연결",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“a = 1이라고 적으면 a라는 이름이 1을 가리킵니다. 그다음 a = a + 1을 보세요. 오른쪽부터 읽습니다. 지금 a가 가리키는 1에 1을 더해 2라는 새 값을 만들고, 그 결과에 다시 a라는 이름을 붙여요. 이미 있는 값을 써서 새 결과를 만들고, 같은 이름에 다시 연결한 겁니다. 1이라는 값 자체가 2로 바뀐 게 아니라, a라는 이름이 새 값을 가리키게 된 거예요. 이 모양을 기억해 두세요. 곧 함수에서 똑같이 씁니다.”"
        ]
      }
    },
    {
      "id": "pass",
      "mode": "fn",
      "sub": "pass",
      "home": "pass",
      "say": "Python에서는 함수도 숫자나 글자처럼 다른 함수에 넘겨줄 수 있습니다.",
      "title": "함수를 넘기기",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“Python에서는 함수도 숫자나 글자처럼 다룰 수 있습니다. 기록을 추가하는 함수 work가 있다고 합시다. 이 work를 다른 함수, 예를 들어 decorate라는 꾸미는 함수에 넘겨줄 수 있어요. 함수를 실행하는 게 아니라 함수 자체를 값처럼 건네는 겁니다.”"
        ]
      }
    },
    {
      "id": "ret",
      "mode": "fn",
      "sub": "ret",
      "home": "pass",
      "say": "함수는 결과로 새 함수를 돌려줄 수도 있습니다.",
      "title": "함수를 돌려받기",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“그리고 함수는 결과로 새 함수를 돌려줄 수도 있습니다. decorate는 work를 받아서, 새 함수를 만들어 돌려줘요.”"
        ]
      }
    },
    {
      "id": "rebind",
      "mode": "fn",
      "sub": "rebind",
      "home": "pass",
      "say": "work = decorate(work)는 돌려받은 새 함수에 다시 work라는 이름을 연결합니다.",
      "title": "work = decorate(work)",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“이제 a = a + 1과 같은 모양이 나옵니다. work = decorate(work). 오른쪽부터 읽어요. work를 decorate에 넘기고, 돌려받은 새 함수에 다시 work라는 이름을 붙입니다. 원래 함수가 고쳐지거나 사라진 게 아니에요. 원래 함수는 그대로 있고, 새 함수 안에서 쓰입니다. 바뀐 건 work라는 이름이 가리키는 대상이에요.”"
        ]
      }
    },
    {
      "id": "wrapfn",
      "mode": "wrapfn",
      "sub": "wrap",
      "home": "wrapfn",
      "say": "새 함수가 안에서 원래 함수를 실행하도록 만들면, 원래 함수를 감쌌다고 말합니다.",
      "title": "함수 감싸기",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“그 새 함수는 어떻게 생겼을까요? 안에서 원래 함수를 실행하도록 만들 수 있습니다. 원래 함수를 바깥에서 감싼 모양이죠. 이걸 함수를 감싼다고 말합니다.”"
        ]
      }
    },
    {
      "id": "prepost",
      "mode": "wrapfn",
      "sub": "prepost",
      "home": "wrapfn",
      "say": "감싼 함수는 원래 함수를 실행하기 전과 후에 새로운 일을 덧붙일 수 있습니다.",
      "title": "실행 전·후 꾸미기",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“감쌌으니 원래 함수를 실행하기 전과 후에 일을 덧붙일 수 있어요. 실행 전에 ‘시작합니다’라고 알리고, 원래 함수로 기록을 추가하고, 끝난 뒤 ‘끝났습니다’라고 알립니다. 원래 함수는 한 글자도 고치지 않았어요. 이렇게 앞뒤를 꾸며 준다고 해서 Decorator, ‘꾸미는 것’이라는 이름이 붙었습니다. 이 그림은 정상적으로 끝난 경우예요.”"
        ]
      }
    },
    {
      "id": "deco",
      "mode": "wrap",
      "sub": "whole",
      "home": "deco",
      "say": "Decorator는 원래 기능을 그대로 두고, 그 바깥을 감싸 공통 처리를 덧붙이는 방법입니다.",
      "title": "Decorator",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“지금까지 본 걸 한 그림으로 보면 이렇습니다. 원래 기능을 바깥에서 감싸는 테두리, 이게 Decorator예요. 원래 기능을 고치지 않고 바깥에 공통 처리를 덧붙입니다.”"
        ]
      }
    },
    {
      "id": "inner",
      "mode": "wrap",
      "sub": "inner",
      "home": "deco",
      "say": "안쪽의 원래 기능은 자기 일을 그대로 하며, Decorator가 그 일을 대신하지 않습니다.",
      "title": "안쪽 · 원래 기능",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“안쪽을 보세요. 기록을 확인하고 저장하는 원래 일은 여전히 원래 기능이 합니다. Decorator가 그 일을 대신하는 게 아니에요.”"
        ]
      }
    },
    {
      "id": "outer",
      "mode": "wrap",
      "sub": "outer",
      "home": "deco",
      "say": "바깥 테두리는 Decorator에 정해 둔 공통 처리만 합니다.",
      "title": "바깥 · 공통 처리",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“바깥 테두리는 우리가 Decorator에 정해 둔 공통 처리만 합니다. 앞뒤 알림으로 정해 두었으면 알림을, 오류 처리로 정해 두었으면 오류 처리를 하죠.”"
        ]
      }
    },
    {
      "id": "ok",
      "mode": "wrap",
      "sub": "ok",
      "home": "deco",
      "say": "원래 기능이 정상적으로 끝나면, 공통 처리는 정해 둔 정상 결과를 돌려줍니다.",
      "title": "정상으로 끝날 때",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“원래 기능이 문제없이 끝나면, 바깥은 정해 둔 정상 결과를 돌려주고 끝납니다.”"
        ]
      }
    },
    {
      "id": "err",
      "mode": "wrap",
      "sub": "err",
      "home": "deco",
      "say": "원래 기능에서 정해 둔 종류의 오류가 나면, 바깥의 공통 처리가 그 오류를 받아 다룹니다.",
      "title": "정해 둔 오류가 날 때",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“원래 기능을 하다가 잘못된 금액처럼 미리 정해 둔 종류의 오류가 나면, 바깥의 공통 처리가 그 오류를 받아 사용자에게 알려 줍니다. 오류가 ‘해결’되는 건 아니에요. 무엇이 잘못됐는지 알려 주는 겁니다.”"
        ]
      }
    },
    {
      "id": "rep",
      "mode": "rep",
      "home": "gather",
      "say": "여러 기능마다 오류가 나면 알려 주는 같은 처리가 되풀이될 수 있습니다.",
      "title": "언제 쓸까 · 같은 처리의 반복",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“그럼 언제 쓰면 좋을까요? 기록 추가·수정·삭제·검색처럼 여러 기능에 같은 처리, 예를 들어 오류 알림이 되풀이될 때입니다. 이 그림은 실제 코드가 아니라 그런 상황을 그린 개념 그림이에요.”"
        ]
      }
    },
    {
      "id": "gather",
      "mode": "gather",
      "home": "gather",
      "say": "되풀이되는 처리를 공통 처리로 한곳에 모아 두면, 고칠 때도 한 곳만 보면 됩니다.",
      "title": "공통 처리 모으기",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“되풀이되는 처리를 한곳에 모아 감싸면, 오류 문구를 바꾸고 싶을 때 네 군데가 아니라 한 곳만 고치면 됩니다.”"
        ]
      }
    },
    {
      "id": "uses",
      "mode": "uses",
      "home": "uses",
      "say": "Decorator로 로그 기록이나 실행 시간 측정 같은 다른 공통 처리도 붙일 수 있지만, 용돈 기입장에는 오류 처리만 있습니다.",
      "title": "다른 Decorator 쓰임",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "“오류 처리 말고도 로그 기록, 실행 시간 측정 같은 공통 처리에 많이 씁니다. 다만 모든 기능을 꼭 꾸며야 하는 건 아니에요. 그리고 용돈 기입장에는 오류 처리 Decorator만 있습니다.”"
        ]
      }
    },
    {
      "id": "real",
      "mode": "real",
      "sub": "all",
      "home": "real",
      "say": "실제 용돈 기입장은 모든 명령이 지나는 한 지점을 handle_errors로 감싸, LedgerError 계열 오류만 [오류]·[힌트]로 알리고 그 밖의 오류는 그대로 드러냅니다.",
      "title": "실제 사례 · handle_errors",
      "figure": "s6",
      "example": "ledger",
      "real": true,
      "instructor": {
        "script": [
          "“실제 용돈 기입장은 모든 명령이 지나가는 한 지점을 handle_errors라는 Decorator로 감쌌습니다. 정상으로 끝나면 종료 코드 0, 정해 둔 LedgerError 계열 오류가 나면 [오류]와 [힌트]를 보여 주고 종료 코드 1이에요. 그 밖의 오류, 예를 들어 코드를 잘못 짠 실수는 일부러 잡지 않고 그대로 드러나게 했습니다.”"
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
          "kind": "기본 · 재연결",
          "q": "work = decorate(work) 뒤에 원래 함수는 고쳐지나요?"
        },
        {
          "kind": "기본 · 역할",
          "q": "Decorator는 원래 기능을 대신하는 것일까요, 아니면 공통 처리를 덧붙이는 것일까요?"
        },
        {
          "kind": "정확성",
          "q": "오류 처리 Decorator가 붙으면 모든 오류가 자동으로 해결될까요?"
        },
        {
          "kind": "기본 · 실제 사례",
          "q": "용돈 기입장에 로그 기록이나 실행 시간 측정 Decorator가 있나요?"
        }
      ],
      "reveal": {
        "answers": [
          "아니요. 원래 함수는 그대로이고, work라는 이름이 돌려받은 새 함수를 가리킵니다. 원래 함수는 새 함수 안에서 실행됩니다.",
          "공통 처리를 덧붙입니다. 원래 일은 원래 기능이 합니다.",
          "아니요. 정해 둔 오류만 받아 알려 줄 뿐 해결하지는 않고, 그 밖의 오류는 그대로 드러납니다.",
          "없습니다. 오류 처리(handle_errors)만 있습니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "work = decorate(work) 뒤에 원래 함수는 고쳐지나요?",
            "a": "아니요. 원래 함수는 그대로이고, work라는 이름이 돌려받은 새 함수를 가리킵니다. 원래 함수는 새 함수 안에서 실행됩니다.",
            "miss": "“원래 함수가 바뀐다” → 단계 1의 ‘값 1이 바뀌는 게 아님’과 단계 4"
          },
          {
            "q": "Decorator는 원래 기능을 대신하는 것일까요, 아니면 공통 처리를 덧붙이는 것일까요?",
            "a": "공통 처리를 덧붙입니다. 원래 일은 원래 기능이 합니다.",
            "miss": "“대신한다” → 단계 8"
          },
          {
            "q": "오류 처리 Decorator가 붙으면 모든 오류가 자동으로 해결될까요?",
            "a": "아니요. 정해 둔 오류만 받아 알려 줄 뿐 해결하지는 않고, 그 밖의 오류는 그대로 드러납니다.",
            "miss": "“모든 오류를 막아 준다” → 단계 11·15"
          },
          {
            "q": "용돈 기입장에 로그 기록이나 실행 시간 측정 Decorator가 있나요?",
            "a": "없습니다. 오류 처리(handle_errors)만 있습니다.",
            "miss": "“있다” → 단계 14"
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
          "kind": "적용 · 반복",
          "q": "여러 명령에서 같은 종류의 오류 메시지를 반복해서 만들고 있다면 어떻게 정리하면 좋을까요?"
        },
        {
          "kind": "적용 · 다른 공통 처리",
          "q": "모든 명령의 실행 시간을 재고 싶습니다. 원래 기능을 하나하나 고쳐야 할까요?"
        },
        {
          "kind": "적용 · 쓸 곳 고르기",
          "q": "기록 추가 명령 하나에서만 쓰는 특별한 금액 계산이 있습니다. 이것도 Decorator로 만들어야 할까요?"
        }
      ],
      "reveal": {
        "answers": [
          "오류를 알리는 공통 처리를 한곳(예: Decorator)에 모으고, 명령들이 지나는 곳을 감쌉니다.",
          "아니요. 시간을 재는 공통 처리를 Decorator로 감싸 붙일 수 있습니다(일반 개념 예시).",
          "꼭 그럴 필요는 없습니다. Decorator는 여러 함수에 같은 처리가 반복될 때 특히 유용합니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "여러 명령에서 같은 종류의 오류 메시지를 반복해서 만들고 있다면 어떻게 정리하면 좋을까요?",
            "a": "오류를 알리는 공통 처리를 한곳(예: Decorator)에 모으고, 명령들이 지나는 곳을 감쌉니다.",
            "miss": "“명령마다 복사해 두면 된다” → 단계 12·13"
          },
          {
            "q": "모든 명령의 실행 시간을 재고 싶습니다. 원래 기능을 하나하나 고쳐야 할까요?",
            "a": "아니요. 시간을 재는 공통 처리를 Decorator로 감싸 붙일 수 있습니다(일반 개념 예시).",
            "miss": "“기능마다 시간 재는 코드를 넣는다” → 단계 6·14"
          },
          {
            "q": "기록 추가 명령 하나에서만 쓰는 특별한 금액 계산이 있습니다. 이것도 Decorator로 만들어야 할까요?",
            "a": "꼭 그럴 필요는 없습니다. Decorator는 여러 함수에 같은 처리가 반복될 때 특히 유용합니다.",
            "miss": "“모든 기능에 Decorator를 쓴다” → 단계 12~14"
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "sum",
      "home": "deco",
      "say": "Decorator는 흔히 원래 함수를 감싼 새 함수를 돌려주어, 원래 함수를 그대로 둔 채 공통 처리를 덧붙이는 방법입니다.",
      "title": "정리",
      "figure": "s6",
      "example": "concept",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면(Scene 07 Type Hint·검증)으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "금액에 정수라고 형을 적어 두면, 음수 같은 잘못된 값도 막아 줄까요?",
        "target": {
          "scene": "07",
          "step": "1"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>재대입은 객체를 바꾸지 않는다:</b> <code>a = a + 1</code>은 1이라는 값을 바꾸지 않고, 새 값 2를 만들어 이름 a에 연결한다. 마찬가지로 <code>work = decorate(work)</code>는 원래 함수 객체를 고치지 않고, 이름 work를 돌려받은 함수에 다시 연결한다. 원래 함수는 새 함수가 내부에서 참조하므로 계속 존재한다.",
      "<b>비유의 한계:</b> <code>a = a + 1</code>은 ‘같은 이름에 새 결과 연결’을 보여 주는 비유다. 숫자 덧셈과 함수 감싸기는 다른 동작이다.",
      "<b>함수가 자기 자신을 반환하는 것:</b> 가능하지만 Decorator의 필수 원리가 아니다. 이 장면에서는 다루지 않는다.",
      "<b>흔한 구현이지 유일한 구현이 아님:</b> 일반적인 Decorator는 원래 함수를 감싼 새 함수를 돌려준다. 그러나 원래 함수를 그대로 돌려주면서 어딘가에 등록만 하는 등 다른 방식의 Decorator도 있다. 클래스에 붙는 Decorator도 있다.",
      "<b>전·후 처리 예시의 범위:</b> ‘시작합니다·끝났습니다’는 정상 실행의 입문 예시다. 원래 함수에서 오류가 나면, 실행 후 처리는 그 오류를 어떻게 다루도록 만들었는지에 따라 실행되지 않을 수도 있다. Decorator가 할 수 있는 일을 앞뒤 알림으로 제한하지 않는다.",
      "<b>해결이 아니라 처리:</b> 오류 처리 Decorator는 정해 둔 오류를 받아 정해 둔 방식으로 다룬다. 원인을 고치지 않는다.",
      "<b>실제 <code>handle_errors</code> (<code>d14e812</code>):</b> <code>decorators.py</code>. 감싼 <code>_dispatch</code>가 정상으로 끝나면 0, <code>LedgerError</code>(와 하위 오류)가 나면 <code>[오류]</code>·<code>[힌트]</code>를 표준 오류 출력에 쓰고 1을 돌려준다. 그 밖의 예외는 잡지 않는다. <code>cli.py</code>의 <code>_dispatch</code> 한 곳에만 붙어 있고, argparse 사용법 오류(종료 코드 2)는 그보다 먼저 처리된다.",
      "<b>‘같은 처리의 반복’은 가상 상황:</b> 실제 ledger에 ‘기능마다 따로 처리’한 코드가 있었던 것은 아니다.",
      "<b>일반 개념 예시:</b> 로그 기록·실행 시간 측정 Decorator는 용돈 기입장에 없다."
    ],
    "deep": [
      "<code>@</code> 표기 — <code>@decorate</code>를 함수 위에 적는 것은 <code>work = decorate(work)</code>를 짧게 쓴 표기다",
      "wrapper — Decorator가 만들어 돌려주는 ‘감싼 함수’를 흔히 부르는 이름",
      "<code>*args</code>·<code>**kwargs</code> — 감싼 함수가 원래 함수의 인자를 그대로 넘겨받는 방법",
      "<code>functools.wraps</code> — 감싼 뒤에도 원래 함수의 이름·설명을 유지하기",
      "적용 시점 — Decorator는 함수를 정의할 때 한 번 적용된다",
      "예외 전파와 <code>try</code>/<code>except</code>·<code>finally</code> — 오류가 나도 실행 후 처리를 하려면",
      "여러 Decorator 겹치기, 함수를 반환하는 다른 방식",
      "기존 v2 자료 — Scene 06 v2 원고"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-06/storyboard.md",
    "sha256": "a8a26d610ff685badfb0168460d8f9a17fbe3747fee66d15dc7dbd79053a3ba5"
  }
};
