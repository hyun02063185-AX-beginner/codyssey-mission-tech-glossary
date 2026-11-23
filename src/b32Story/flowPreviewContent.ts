import { screenHref } from './content';
import { screens } from './lessonContent';

const sourceRoot = 'https://github.com/hyun02063185-AX-beginner/Codyssey_B3-2/blob/be21c4994a93bc943a6783ea380c50f61aa7c45b';

function source(file: string, line: number, symbol: string) {
  return { symbol, href: `${sourceRoot}/${file}#L${line}` };
}

type Role = 'user' | 'python' | 'git' | 'api';

export const flowRoles: Record<Role, string> = {
  user: '사용자',
  python: 'Python',
  git: '로컬 Git',
  api: '외부 AI API',
};

type FlowStage = {
  id: string;
  title: string;
  roles: readonly Role[];
  description: string;
  input: string;
  output: string;
  source: ReturnType<typeof source>[];
  slides: string[];
};

export const flowStages: readonly FlowStage[] = [
  {
    id: 'command',
    title: '명령 입력',
    roles: ['user', 'python'],
    description: '사용자가 터미널에서 명령을 입력하면 Python의 argparse가 초안 종류와 옵션을 읽습니다.',
    input: 'python main.py commit 또는 python main.py pr, 선택 옵션',
    output: '초안 종류와 실행 옵션을 담은 argparse.Namespace',
    source: [source('main.py', 15, 'build_parser()'), source('main.py', 27, 'parse_args() 호출')],
    slides: ['S1-1', 'S2-1'],
  },
  {
    id: 'git',
    title: '로컬 Git에서 변경 수집',
    roles: ['python', 'git'],
    description: 'Python이 현재 작업 디렉터리에서 로컬 Git을 실행합니다. GitHub 접속 없이 git status와 git diff를 읽습니다.',
    input: '현재 작업 디렉터리의 로컬 Git 저장소',
    output: '브랜치, 상태, 변경 파일명, 추적되지 않은 파일명, staged·unstaged diff',
    source: [
      source('ai_gitgen/git_collector.py', 41, 'collect_changes()'),
      source('ai_gitgen/git_collector.py', 26, '_git()'),
    ],
    slides: ['S1-2'],
  },
  {
    id: 'changes',
    title: '변경 여부 확인',
    roles: ['python'],
    description: '수집한 git status 결과가 비어 있는지 확인합니다. 변경이 있으면 보안 검사로 넘어갑니다.',
    input: 'GitChanges.status의 로컬 Git 상태 문자열',
    output: '변경 여부. 변경이 없으면 안내를 출력하고 AI 요청 없이 종료',
    source: [
      source('ai_gitgen/git_collector.py', 21, 'GitChanges.has_changes'),
      source('main.py', 31, 'main()의 변경 확인'),
    ],
    slides: ['S2-2'],
  },
  {
    id: 'security',
    title: '보낼 Git 문맥 검사',
    roles: ['python'],
    description: '기본 모드는 비밀 파일 경로나 불완전한 개인키 블록을 감지하면 전송을 중단합니다. 이메일·토큰·완전한 개인키 블록 등 감지된 내용은 가리고 계속 진행합니다. --unsafe로 이 검사를 끄더라도 16,000자 제한은 적용됩니다.',
    input: '수집한 Git 변경 정보와 --unsafe 설정',
    output: '전송할 Git 문맥 문자열. 추적되지 않은 파일은 이름만 포함',
    source: [source('ai_gitgen/security.py', 21, 'prepare_context()')],
    slides: ['S3-1'],
  },
  {
    id: 'api',
    title: '외부 AI 요청·응답',
    roles: ['python', 'api'],
    description: '요청은 로컬 Python에서 외부 AI API로 나가고, 응답은 Python으로 돌아옵니다. 모델 실행 위치는 미확인입니다.',
    input: '모델 ID, 초안 작성 지시, 검사한 Git 문맥. API 키는 인증 헤더에 사용',
    output: '응답의 choices[0].message.content에서 읽어 낸 초안 텍스트',
    source: [source('ai_gitgen/ai_client.py', 26, 'AIClient.generate()')],
    slides: ['S3-2'],
  },
  {
    id: 'draft',
    title: '검증·출력과 사람 확인',
    roles: ['python', 'user'],
    description: 'Python이 초안 형식을 검증해 터미널에 표시합니다. PR의 How to Test는 프로그램이 실행 권장 문구로 교체합니다. 커밋·push·PR 등록은 사람이 초안을 확인하고 활용하는 별도 작업입니다.',
    input: 'AI가 응답한 커밋 메시지 또는 PR 초안',
    output: '검토용 초안. PR 테스트 안내는 python -m unittest discover -s tests 실행 권장',
    source: [
      source('ai_gitgen/validators.py', 13, 'validate_commit()'),
      source('ai_gitgen/validators.py', 25, 'validate_pr()'),
      source('main.py', 43, 'main()의 검증·출력'),
    ],
    slides: ['S4-1', 'S4-2'],
  },
];

export const flowExceptions = [
  {
    stageId: 'changes',
    title: '변경 없음',
    result: '변경 사항이 없다고 알리고 성공 상태로 종료합니다. AI 요청 횟수는 0입니다.',
  },
  {
    stageId: 'security',
    title: '보안 차단',
    result: '위험 경로, 불완전한 개인키 블록 또는 16,000자 초과에 해당하면 오류로 종료합니다. AI 요청 횟수는 0입니다.',
  },
  {
    stageId: 'api',
    title: 'API 오류',
    result: '설정 오류는 요청 전에 중단합니다. 인증·네트워크 문제나 읽을 수 없는 응답은 요청 시도 후 오류로 종료합니다.',
  },
  {
    stageId: 'draft',
    title: '형식 검증 실패',
    result: '커밋 제목이나 PR 필수 섹션 등 형식 기준에 맞지 않으면 오류로 종료하고 검토용 초안을 출력하지 않습니다.',
  },
];

export function flowSlide(id: string) {
  const index = screens.findIndex(screen => screen.id === id);
  return { title: screens[index].title, href: screenHref(index) };
}
