// Screen copy of the approved v3.7 preview; storyboard remains the source.
import type { TeachingScene } from './types';

export const scene01: TeachingScene = {
  "id": "01",
  "title": "명령 한 줄로 일을 부탁하기",
  "question": "명령 한 줄로 프로그램에 어떻게 일을 부탁할까?",
  "ctx": "Scene 01",
  "tag": "가상 todo 예시",
  "addressing": "number",
  "home": "all",
  "steps": [
    {
      "id": "gui",
      "hl": "gui",
      "home": "gui",
      "say": "GUI는 화면의 버튼과 메뉴를 눌러 프로그램에 일을 부탁하는 방법입니다.",
      "title": "GUI",
      "figure": "f1",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“할 일 목록을 다섯 개만 보고 싶다고 해 봅시다. 화면이 있는 프로그램이라면 무엇을 누를까요?” (답을 들은 뒤) “맞아요. ‘목록 보기’ 버튼을 누르고 개수를 5로 고르겠죠. 이렇게 화면을 눌러서 부탁하는 방법을 GUI라고 합니다.”"
        ]
      }
    },
    {
      "id": "cli",
      "hl": "cli",
      "home": "gui",
      "say": "CLI는 같은 부탁을 글자로 입력해 전하는 방법입니다.",
      "title": "CLI",
      "figure": "f1",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“같은 부탁을 글자로 할 수도 있습니다. 오른쪽처럼 터미널에 명령 한 줄을 입력하는 방법이에요. 이것을 CLI라고 합니다. 부탁하는 내용은 왼쪽과 똑같고, 전하는 방법만 다릅니다.”"
        ]
      }
    },
    {
      "id": "all",
      "mode": "parts",
      "sel": null,
      "say": "명령 한 줄은 네 부분으로 나누어 읽을 수 있습니다.",
      "title": "명령의 네 부분",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“이 한 줄이 처음엔 암호처럼 보이지만, 네 부분으로 나누면 읽을 수 있습니다. 실행 도구, 실행할 대상, 할 일, 조건이에요. 왼쪽부터 하나씩 보겠습니다.”"
        ]
      }
    },
    {
      "id": "python",
      "mode": "parts",
      "sel": "python",
      "say": "python은 Python으로 만든 프로그램을 실행해 주는 도구입니다.",
      "title": "실행 도구 python",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“맨 앞의 python은 ‘Python으로 만든 프로그램을 실행해 줄 도구를 쓰겠다’는 뜻입니다. 우리가 부탁할 todo 프로그램이 Python으로 만들어졌기 때문에, 먼저 이 도구를 부르는 거예요.”"
        ]
      }
    },
    {
      "id": "target",
      "mode": "parts",
      "sel": "target",
      "say": "-m todo는 Python에게 “todo라는 프로그램을 찾아 실행해 줘”라고 알려 줍니다.",
      "title": "실행할 대상 -m todo",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“다음은 무엇을 실행할지입니다. -m todo는 Python에게 ‘todo라는 이름의 프로그램을 찾아서 실행해 줘’라고 알려 주는 부분이에요. 여기까지는 Python에게 하는 말입니다.”"
        ]
      }
    },
    {
      "id": "task",
      "mode": "parts",
      "sel": "task",
      "say": "list는 todo 프로그램에게 맡길 일, 곧 ‘목록 보기’입니다.",
      "title": "할 일 list",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“이제부터는 todo 프로그램에게 하는 말입니다. list는 ‘목록을 보여 줘’라는 할 일이에요. 화면 프로그램의 ‘목록 보기’ 버튼에 해당합니다.”"
        ]
      }
    },
    {
      "id": "cond",
      "mode": "parts",
      "sel": "cond",
      "opt": true,
      "say": "--limit 5는 ‘최대 5개까지만’이라는 조건입니다. 이렇게 조건을 붙이는 부분을 옵션이라고 부릅니다.",
      "title": "조건 --limit 5",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“마지막 --limit 5는 조건입니다. ‘최대 다섯 개까지만’이라는 뜻이죠. 화면 프로그램에서 개수를 5로 고른 것과 같습니다. 이렇게 하이픈 두 개로 시작해서 할 일에 조건을 붙이는 부분을 옵션이라고 부릅니다.”"
        ]
      }
    },
    {
      "id": "who",
      "mode": "who",
      "sel": null,
      "say": "앞부분은 Python이 읽고, 뒷부분은 todo 프로그램이 넘겨받아 읽습니다.",
      "title": "누가 어느 부분을 읽을까",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“그런데 이 한 줄을 한 사람이 다 읽는 건 아닙니다. 앞의 python -m todo는 Python이 읽고 ‘아, todo를 실행하면 되는구나’ 하고 todo를 시작합니다. 그리고 남은 list --limit 5는 그대로 todo 프로그램에게 넘겨줘요. 그러니까 할 일과 조건을 알아듣는 것은 todo 프로그램의 몫입니다.”"
        ]
      }
    },
    {
      "id": "argparse",
      "hl": "flow",
      "home": "argparse",
      "say": "argparse는 프로그램이 받은 글자를 미리 정한 규칙에 맞춰 알아듣도록 돕는 Python 도구입니다.",
      "title": "argparse가 하는 일",
      "figure": "f4",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“todo 프로그램이 받은 것은 그냥 ‘list’, ‘--limit’, ‘5’라는 글자입니다. 이 글자를 알아들으려면 규칙이 필요하죠. ‘할 일 자리에는 정해 둔 이름이 온다’, ‘--limit 뒤에는 숫자 하나가 온다’ 같은 규칙이요. 프로그램을 만든 사람이 이 규칙을 미리 정해 두면, argparse라는 Python 도구가 받은 글자를 규칙에 맞춰 ‘할 일은 목록 보기, 최대 개수는 5’로 정리해 줍니다.”",
          "(비유가 필요하면) “식당의 주문 접수 창구를 떠올려 보세요. 손님의 말을 정해진 주문서 양식에 맞춰 정리해 주방에 넘기는 역할입니다.”"
        ]
      }
    },
    {
      "id": "boundary",
      "hl": "edge",
      "home": "argparse",
      "say": "argparse는 부탁을 알아듣는 데까지 돕고, 실제로 목록을 찾아 보여 주는 일은 프로그램의 다른 부분이 합니다.",
      "title": "argparse가 하지 않는 일",
      "figure": "f4",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "“중요한 점이 하나 있습니다. argparse는 부탁을 알아듣는 데까지만 돕습니다. 저장된 할 일을 실제로 찾아오고 다섯 개를 골라 화면에 보여 주는 일은 프로그램의 다른 부분이 해요. 접수 창구가 요리를 하지 않는 것과 같습니다. 그 ‘다른 부분’이 누구인지는 다음 장면에서 봅니다.”"
        ]
      }
    },
    {
      "id": "check",
      "kind": "check",
      "say": "설명을 모두 마쳤습니다. 답을 보기 전에 먼저 말로 답해 봅시다.",
      "title": "이해 확인",
      "figure": "check",
      "example": "fictional-todo",
      "questions": [
        {
          "kind": "기본 · 구조",
          "q": "이 명령에서 ‘할 일’과 ‘조건’은 어느 부분인가요?"
        },
        {
          "kind": "기본 · 누가 읽나",
          "q": "--limit 5는 Python과 todo 프로그램 중 누가 읽나요?"
        },
        {
          "kind": "역할 구분 (선택)",
          "q": "argparse가 저장된 할 일을 꺼내 오나요?"
        }
      ],
      "reveal": {
        "answers": [
          "할 일 list, 조건 --limit 5",
          "todo 프로그램 (argparse의 도움을 받아)",
          "아니요. 부탁을 알아듣는 데까지 돕고, 실제 일은 프로그램의 다른 부분이 합니다."
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "이 명령에서 ‘할 일’과 ‘조건’은 어느 부분인가요?",
            "a": "할 일 list, 조건 --limit 5",
            "miss": "-m todo를 할 일로 답함 → “-m todo는 무엇을 실행할지, 곧 Python에게 하는 말이었죠.”"
          },
          {
            "q": "--limit 5는 Python과 todo 프로그램 중 누가 읽나요?",
            "a": "todo 프로그램 (argparse의 도움을 받아)",
            "miss": "Python이라고 답함 → F3을 다시 가리키며 “Python은 -m todo까지 읽고 나머지를 넘겨줬습니다.”"
          },
          {
            "q": "argparse가 저장된 할 일을 꺼내 오나요?",
            "a": "아니요. 부탁을 알아듣는 데까지 돕고, 실제 일은 프로그램의 다른 부분이 합니다.",
            "miss": "“네”라고 답함 → F4의 경계선과 접수 창구 비유로 다시 설명"
          }
        ]
      }
    },
    {
      "id": "apply",
      "mode": "apply",
      "sel": null,
      "kind": "check",
      "say": "목록을 최대 3개만 보고 싶다면 명령의 무엇을 바꾸면 될까요?",
      "title": "적용 · 최대 3개",
      "figure": "cmd",
      "example": "fictional-todo",
      "questions": [
        {
          "kind": "적용 · 새 조건",
          "q": "목록을 최대 3개만 보고 싶다면 명령의 무엇을 바꾸면 될까요?"
        }
      ],
      "reveal": {
        "answers": [
          "조건의 5를 3으로: python -m todo list --limit 3. 나머지 세 부분은 그대로"
        ]
      },
      "instructor": {
        "expected": [
          {
            "q": "목록을 최대 3개만 보고 싶다면 명령의 무엇을 바꾸면 될까요?",
            "a": "조건의 5를 3으로: python -m todo list --limit 3. 나머지 세 부분은 그대로",
            "miss": "할 일이나 실행 대상을 바꾸려 함 → “바뀐 것은 ‘몇 개까지’라는 조건뿐이죠.”"
          }
        ]
      }
    },
    {
      "id": "summary",
      "mode": "summary",
      "sel": null,
      "say": "명령 한 줄은 실행 도구·실행할 대상·할 일·조건으로 나뉘고, 앞부분은 Python이, 뒷부분은 프로그램이 argparse의 도움을 받아 알아듣습니다.",
      "title": "정리",
      "figure": "cmd",
      "example": "fictional-todo",
      "instructor": {
        "script": [
          "한 문장 정리를 함께 읽고, 다음 장면 질문으로 넘어갑니다."
        ]
      },
      "next": {
        "question": "부탁을 알아들은 뒤, 프로그램 안에서는 누가 어떤 일을 맡을까요?",
        "target": {
          "scene": "02",
          "step": "1"
        }
      }
    }
  ],
  "instructor": {
    "notes": [
      "<b>가상 예시:</b> todo는 설명용 가상 프로그램이다. 실행 결과를 만들어 보여 주지 않는다. 적용 질문은 이미 있는 조건의 값만 바꾼다. 없는 할 일(예: 새 명령)을 추가로 예시할 때는 ‘가상 확장 예시’라고 밝힌다.",
      "<b><code>python</code>을 찾는 주체:</b> 엄밀히는 터미널(셸)이 <code>python</code>이라는 이름의 프로그램을 찾아 실행한다. 환경에 따라 <code>python3</code>, <code>py</code>로 입력하기도 한다.",
      "<b>해석 주체의 경계:</b> Python 자신의 옵션은 <code>-m 대상</code> 앞에 쓴다. <code>-m todo</code> 뒤에 오는 글자는 모두 todo 프로그램의 몫으로 넘어간다.",
      "<b><code>-m</code>의 뜻:</b> ‘이름으로 모듈을 찾아 실행’이다. 대상은 파일 하나(모듈)일 수도, 여러 파일의 묶음(패키지)일 수도 있다. 모듈·패키지는 Scene 02에서 다룬다.",
      "<b>argparse의 위치:</b> 모든 CLI 프로그램이 argparse를 써야 하는 것은 아니다. argparse는 해석을 돕고 데이터를 처리하지 않는다.",
      "<b>GUI와 CLI:</b> 서로 반드시 다른 프로그램이라는 뜻이 아니다. 한 프로그램이 두 방식을 모두 제공할 수도 있다.",
      "<b>비유의 한계:</b> argparse는 사람처럼 짐작하지 않는다. 프로그램이 정해 둔 규칙을 그대로 적용하며, 규칙에 맞지 않으면 알아듣지 못한다."
    ],
    "deep": [
      "기술 용어 대응 — 실행 도구 = Python 인터프리터, 할 일 = 하위 명령(subcommand), 조건 = 옵션(<code>--limit</code>)과 그 값(<code>5</code>), 프로그램 이름 뒤의 글자들 = 명령줄 인자",
      "짧은 옵션과 긴 옵션 — <code>-h</code>와 <code>--help</code>처럼 같은 뜻을 두 형태로 두기도 한다.",
      "값이 없는 옵션 — <code>--help</code>처럼 켜기만 하는 옵션도 있다.",
      "규칙에 맞지 않는 입력 — <code>--limit</code> 뒤에 숫자가 아닌 글자를 쓰면 argparse가 사용법과 오류 메시지를 보여 주고 멈춘다.",
      "글자 ‘5’와 숫자 5 — 규칙에 ‘숫자로 바꾸기’를 정해 두면 argparse가 바꿔 준다. → Scene 07의 Type Hint·검증과 비교",
      "도움말 자동 생성 — 규칙을 정해 두면 <code>--help</code> 안내문을 argparse가 만들어 준다.",
      "내부 동작 — 프로그램이 받은 글자 목록(<code>sys.argv</code>)과 argparse 사용 코드는 학습가이드에서 실행과 함께 다룬다."
    ]
  },
  "source": {
    "storyboard": "drafts/b2-1-story-map/v3/scene-01/storyboard.md",
    "sha256": "1652537060dbe60047a020b93f745e3131ea8328310fec1b4be3d5bb19e37666"
  }
};
