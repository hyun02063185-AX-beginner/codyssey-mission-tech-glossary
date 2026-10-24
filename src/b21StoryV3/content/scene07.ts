// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene07: TeachingScene = {
  "id": "07",
  "title": "기대와 확인: Type Hint·자료형 변환·값 검증",
  "question": "값의 형을 적어 두면 잘못된 값도 막아 줄까?",
  "ctx": "Scene 07",
  "tag": "개념 예시",
  "addressing": "number",
  "home": "hint",
  "steps": [
    {
      "id": "hint",
      "mode": "sign",
      "sub": "base",
      "home": "hint",
      "say": "Type Hint는 이 자리에 어떤 형의 값을 기대하는지 적어 두는 표시입니다.",
      "title": "Type Hint",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“앞 장면 끝에서 물었죠. 금액에 정수라고 형을 적어 두면 잘못된 값도 막아 줄까요? 먼저 ‘형을 적어 둔다’는 게 뭔지 봅시다. amount: int는 ‘amount라는 이름의 자리에는 int, 곧 정수를 기대한다’는 표시예요. 이런 표시를 Type Hint라고 합니다.”"
        ]
      }
    },
    {
      "id": "who",
      "mode": "sign",
      "sub": "who",
      "home": "hint",
      "say": "Type Hint는 코드를 읽는 사람과 검사 도구에게 기대하는 형을 알려 줍니다.",
      "title": "누가 읽을까",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“이 표시는 누가 읽을까요? 먼저 사람입니다. 코드를 읽는 사람이 ‘아, 여기엔 정수가 와야 하는구나’ 하고 알 수 있죠. 그리고 검사 도구가 있어요. 실행하기 전에 코드를 훑어서 기대와 맞지 않는 곳을 찾아 줄 수 있습니다.”"
        ]
      }
    },
    {
      "id": "pass",
      "mode": "sign",
      "sub": "pass",
      "home": "hint",
      "say": "Python은 실행 중에 Type Hint만 보고 잘못된 값을 막지 않습니다.",
      "title": "안내판은 문이 아님",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“그럼 실행 중에는 어떨까요?” (답을 들은 뒤) “Python은 Type Hint만 보고 값을 막지 않습니다. 안내판은 문이 아니에요. 1000도, 글자 \"1000\"도, -5도 안내판 옆을 그대로 지나갑니다. 그래서 정말 막고 싶은 값이 있으면 따로 확인하는 코드가 필요해요.”"
        ]
      }
    },
    {
      "id": "cmp",
      "mode": "cmp",
      "sub": 0,
      "home": "cmp",
      "say": "표시는 기대를 알려 줄 뿐이고, 실제 값이 규칙에 맞는지는 값 검증이 확인합니다.",
      "title": "표시와 실제 검사",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“그래서 두 가지를 나눠 봅니다. 왼쪽은 Type Hint, 기대하는 형을 표시만 합니다. 오른쪽은 값 검증, 실제 값이 규칙에 맞는지 확인합니다. 우리 금액 규칙은 ‘0보다 큰 정수’라고 합시다.”"
        ]
      }
    },
    {
      "id": "v1000",
      "mode": "cmp",
      "sub": 1,
      "home": "cmp",
      "say": "1000은 정수이고 0보다 크므로 기대와 규칙에 모두 맞습니다.",
      "title": "1000",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“1000은 정수이고 0보다 크죠. 표시와도 맞고 규칙도 통과합니다.”"
        ]
      }
    },
    {
      "id": "vstr",
      "mode": "cmp",
      "sub": 2,
      "home": "cmp",
      "say": "\"1000\"은 글자로 된 값이라 int라는 기대와 다르지만, Type Hint가 이 값을 막지는 않습니다.",
      "title": "\"1000\"",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“따옴표가 붙은 \"1000\"은 숫자처럼 보여도 글자, 문자열입니다. int라는 기대와 다르지만, Type Hint가 이 값을 막아 주지는 않아요. 그리고 글자 그대로는 정수가 아니니까, 쓰려면 먼저 정수로 바꿔야 합니다. 그건 다음 그림에서 볼게요.”"
        ]
      }
    },
    {
      "id": "vneg",
      "mode": "cmp",
      "sub": 3,
      "home": "cmp",
      "say": "-5는 int라는 기대에는 맞지만, 금액은 0보다 커야 한다는 규칙에는 맞지 않습니다.",
      "title": "-5",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“-5는 어떨까요?” (답을 들은 뒤) “-5는 정수입니다. int라는 기대에는 맞아요. 하지만 금액은 0보다 커야 한다는 규칙에는 맞지 않죠. ‘정수인가’와 ‘금액으로 쓸 수 있는가’는 다른 질문입니다.”"
        ]
      }
    },
    {
      "id": "flow",
      "mode": "flow",
      "sub": 0,
      "home": "flow",
      "say": "입력을 처리할 때는 글자를 정수로 바꾸는 변환과, 바뀐 값이 규칙에 맞는지 보는 검증을 나누어 생각합니다.",
      "title": "변환과 검증",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“실제로 사용자 입력은 대부분 글자로 들어옵니다. 그래서 두 단계를 나눠 생각해요. 먼저 글자를 정수로 바꾸는 자료형 변환, 그다음 바뀐 값이 규칙에 맞는지 보는 값 검증입니다. 이 화살표는 이 예시의 처리 흐름이에요.”"
        ]
      }
    },
    {
      "id": "f1000",
      "mode": "flow",
      "sub": 1,
      "home": "flow",
      "say": "\"1000\"은 정수 1000으로 바뀌고 금액 규칙도 통과해 사용할 수 있습니다.",
      "title": "\"1000\" 처리",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“\"1000\"은 정수 1000으로 바뀌고, 0보다 크니 규칙도 통과합니다. 이제 사용할 수 있어요.”"
        ]
      }
    },
    {
      "id": "fabc",
      "mode": "flow",
      "sub": 2,
      "home": "flow",
      "say": "\"abc\"는 정수로 바꿀 수 없어 변환 단계에서 멈춥니다.",
      "title": "\"abc\" 처리",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“\"abc\"는 정수로 바꿀 수가 없죠. 그래서 변환 단계에서 멈춥니다. 규칙 검사까지 가지도 않아요.”"
        ]
      }
    },
    {
      "id": "fneg",
      "mode": "flow",
      "sub": 3,
      "home": "flow",
      "say": "\"-5\"는 정수 -5로 바뀌지만, 금액 규칙 검사에서 거부됩니다.",
      "title": "\"-5\" 처리",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "“\"-5\"는 정수 -5로 잘 바뀝니다. 변환은 성공했어요. 하지만 금액 규칙 검사에서 거부됩니다. 변환이 된다고 해서 쓸 수 있는 값이 되는 건 아닙니다.”"
        ]
      }
    },
    {
      "id": "real",
      "mode": "real",
      "home": "real",
      "say": "실제 용돈 기입장은 형을 표시하고, argparse와 validate_amount()가 값을 정수로 바꾸며, validate_amount()가 0보다 큰 정수인지 실제로 검사합니다.",
      "title": "실제 사례 · 표시·변환·검증",
      "figure": "s7",
      "example": "ledger",
      "real": true,
      "instructor": {
        "script": [
          "“실제 용돈 기입장은 어떻게 할까요? 기록의 금액은 정수라고 Type Hint로 표시해 두었습니다. 명령줄에서 --amount로 받은 글자는 Scene 01에서 본 argparse가 type=int 규칙으로 정수로 바꾸고, 대화형 입력이나 CSV처럼 글자로 들어온 금액은 validate_amount()라는 검사 함수가 정수로 바꿉니다. 그리고 그 validate_amount()가 정수인지, 0보다 큰지 실제로 확인해요. 맞지 않으면 금액 오류를 일으키고, Scene 06의 공통 처리가 ‘[오류] 금액은 0보다 큰 정수여야 합니다’라고 알려 줍니다.”"
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
          "kind": "기본 · Type Hint",
          "q": "amount: int라고 적어 두면 Python이 실행 중에 -5를 막아 줄까요?"
        },
        {
          "kind": "기본 · 변환",
          "q": "\"abc\"는 변환과 검증 중 어디에서 멈추나요?"
        },
        {
          "kind": "기본 · 형과 규칙",
          "q": "-5는 어느 단계에서 거부되나요?"
        },
        {
          "kind": "정확성",
          "q": "Type Hint를 적었으니 검증 코드는 지워도 될까요?"
        }
      ],
      "reveal": {
        "answers": [
          "아니요. Type Hint는 표시일 뿐이고, -5는 정수라서 표시와도 맞습니다. 막으려면 검증 코드가 필요합니다.",
          "변환 단계 — 정수로 바꿀 수 없어서",
          "금액 규칙 검사(0보다 커야 함). int 형에는 맞습니다.",
          "아니요. Type Hint는 기대를 알릴 뿐 실제 값을 확인하지 않습니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "amount: int라고 적어 두면 Python이 실행 중에 -5를 막아 줄까요?",
            "a": "아니요. Type Hint는 표시일 뿐이고, -5는 정수라서 표시와도 맞습니다. 막으려면 검증 코드가 필요합니다.",
            "miss": "“막아 준다” → 단계 3의 ‘안내판은 문이 아닙니다’"
          },
          {
            "q": "\"abc\"는 변환과 검증 중 어디에서 멈추나요?",
            "a": "변환 단계 — 정수로 바꿀 수 없어서",
            "miss": "“검증에서” → F3 \"abc\" 줄: 규칙 검사까지 가지 않음"
          },
          {
            "q": "-5는 어느 단계에서 거부되나요?",
            "a": "금액 규칙 검사(0보다 커야 함). int 형에는 맞습니다.",
            "miss": "“int가 아니라서” → 단계 7: 정수인가 / 금액으로 쓸 수 있는가"
          },
          {
            "q": "Type Hint를 적었으니 검증 코드는 지워도 될까요?",
            "a": "아니요. Type Hint는 기대를 알릴 뿐 실제 값을 확인하지 않습니다.",
            "miss": "“타입을 적었으니 안전하다” → F2의 두 칸"
          }
        ]
      }
    },
    {
      "id": "apply",
      "mode": "apply",
      "kind": "check",
      "home": "apply",
      "say": "새로운 값에 표시·변환·검증을 하나씩 적용해 봅시다.",
      "title": "적용 · 새로운 값",
      "figure": "s7",
      "example": "concept",
      "questions": [
        {
          "kind": "3000",
          "q": "3000"
        },
        {
          "kind": "\"15000\"",
          "q": "\"15000\""
        },
        {
          "kind": "\"1,000\"",
          "q": "\"1,000\""
        },
        {
          "kind": "\"0\"",
          "q": "\"0\""
        }
      ],
      "reveal": {
        "answers": [
          "표시 예 · 변환 필요 없음 · 규칙 예",
          "표시 아니요(글자) · 변환 예(15000) · 규칙 예",
          "표시 아니요 · 변환 아니요(쉼표 때문) · 변환에서 멈춤",
          "표시 아니요 · 변환 예(0) · 규칙 아니요"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "3000",
            "a": "표시 예 · 변환 필요 없음 · 규칙 예",
            "miss": ""
          },
          {
            "q": "\"15000\"",
            "a": "표시 아니요(글자) · 변환 예(15000) · 규칙 예",
            "miss": "“표시와 다르니 못 쓴다” → 변환하면 쓸 수 있음(단계 9)"
          },
          {
            "q": "\"1,000\"",
            "a": "표시 아니요 · 변환 아니요(쉼표 때문) · 변환에서 멈춤",
            "miss": "“1000이니까 된다” → 쉼표가 있는 글자는 정수로 바뀌지 않음. Scene 04 CSV에서 금액에 쉼표를 넣지 않은 이유와 연결"
          },
          {
            "q": "\"0\"",
            "a": "표시 아니요 · 변환 예(0) · 규칙 아니요",
            "miss": "“정수로 바뀌었으니 통과” → 0은 0보다 크지 않음"
          }
        ]
      }
    },
    {
      "id": "wrap",
      "mode": "sum",
      "home": "hint",
      "say": "Type Hint는 기대하는 형을 알려 주는 표시이고, 실제 값은 자료형 변환과 값 검증 코드가 다룹니다.",
      "title": "정리",
      "figure": "s7",
      "example": "concept",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 마지막 장면(Scene 08 핵심 개념지도)으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "지금까지 배운 개념들은 한 프로그램 안에서 서로 어떻게 연결될까요?",
        "target": {
          "scene": "08",
          "step": "1"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>런타임 비강제:</b> Python은 Type Hint를 보관하지만 실행 중에 그것만으로 값을 검사·변환·거부하지 않는다. 맞지 않는 값을 쓰는 코드가 실패하면 그때 평소 규칙대로 오류가 날 수는 있다. ‘아무 일도 일어나지 않는다’가 아니라 ‘힌트가 막아 주지는 않는다’로 말한다.",
      "<b>검사 도구:</b> 정적 타입 검사기나 편집기가 실행 전에 맞지 않는 곳을 알려 줄 수 있다. 설치·설정은 다루지 않는다.",
      "<b>변환과 검증의 순서:</b> F3의 순서는 이 예시의 흐름이다. 실제 ledger에서는 <code>validate_amount()</code> 한 함수 안에서 글자를 정수로 바꾼 뒤 검사하고, <code>--amount</code> 같은 명령줄 입력은 argparse가 먼저 정수로 바꿔 둔다. 모든 입력 경로가 같은 곳에서 같은 순서로 처리한다는 일반 규칙으로 말하지 않는다.",
      "<b>argparse의 변환 실패:</b> 명령줄에서 <code>--amount abc</code>처럼 정수로 바꿀 수 없으면 argparse가 사용법과 오류를 보여 주고 멈춘다(종료 코드 2). Scene 06의 <code>handle_errors</code>가 아니라 argparse가 처리한다.",
      "<b>실제 <code>validate_amount()</code> (<code>d14e812</code>):</b> 글자면 앞뒤 공백을 지우고 <code>int()</code>로 바꾸며, 바꿀 수 없으면 금액 오류(<code>InvalidAmountError</code>). 정수가 아니거나 <code>bool</code>이면 금액 오류. 0 이하이면 금액 오류. 통과하면 정수를 돌려준다. 이 오류는 <code>LedgerError</code> 계열이라 <code>handle_errors</code>가 ‘[오류] 금액은 0보다 큰 정수여야 합니다.’ ‘[힌트] 예: 15000’으로 알린다.",
      "<b>실제 타입 표시:</b> <code>models.py</code>의 기록 필드 <code>amount: int</code>, <code>validators.py</code>의 <code>validate_amount(value: int | str) -&gt; int</code>. dataclass 필드의 Type Hint도 실행 중에 값을 검사하지 않으므로 별도 검증 함수가 있다.",
      "<b>개념 예시:</b> F1~F3·F5의 값과 규칙은 개념 예시다. ledger를 실행한 결과가 아니다."
    ],
    "deep": [
      "<code>bool</code>과 <code>int</code> — Python에서 <code>bool</code>은 <code>int</code>의 하위 형이라 <code>True</code>도 int 표시에 맞는다. 그래서 ledger는 <code>bool</code>을 따로 막는다.",
      "정적 타입 검사기 — 실행 전에 Type Hint와 맞지 않는 코드를 찾는 도구",
      "Parameter와 Argument — 함수 정의의 자리 이름과 호출 때 넣는 실제 값의 차이",
      "여러 형을 받는 표시 — <code>int | str</code>, <code>str | None</code>",
      "<code>None</code>과 기본값 — 값이 없을 수 있음을 표시하고 처리 코드를 함께 쓰기",
      "argparse <code>type=int</code>와 Type Hint의 차이 — 하나는 실제로 변환하고, 하나는 표시만 한다",
      "기존 v2 자료 — Scene 07 v2 원고"
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-07/storyboard.md",
    "sha256": "2d16b252ce7e63ad6c2aaf123a867a08078c25acb402e55ab33ca02cd56d4b3e"
  }
};
