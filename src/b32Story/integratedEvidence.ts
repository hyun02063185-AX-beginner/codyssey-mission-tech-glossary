import labGuide from '../../content/mission-stories/main-m06/lab-guide-v0.3-r1.md?raw';
import evidence from '../../content/mission-stories/main-m06/assets/evidence/repro-v0.4-claude-2026-11-28.txt?raw';
import promptSource from './prompts-v04.txt?raw';
import { integratedLesson } from './lessonV04';

function required(value: string | undefined, label: string) {
  if (!value) throw new Error(`B3-2 v0.4 근거 누락 · ${label}`);
  return value;
}

export function screenResult(id: string) {
  return required(integratedLesson.screens.find(screen => screen.id === id)?.result?.output, id);
}

export function record(id: number) {
  return required(evidence.split(new RegExp(`^## R${id} · [^\\n]+\\n`, 'm'))[1]?.split(/^## /m)[0]?.trimEnd(), `R${id}`);
}

const lab03 = labGuide.split('\n## Lab 03.')[1].split('\n## Lab 04.')[0];
function gitOutput(suffix = '') {
  const header = `===== git status =====\n([^\n]*)\n===== git diff${suffix} =====\n([\\s\\S]*?)\n?===== git diff --cached${suffix} =====`;
  const match = new RegExp(header).exec(lab03);
  if (!match) throw new Error('B3-2 v0.4 Lab 03 비교 기록 누락');
  return {
    status: match[1],
    diff: match[2],
    cached: match.input.slice(match.index + match[0].length).split(/^\x60{3,}/m)[0].replace(/^\n|\n$/g, ''),
  };
}

const before = gitOutput();
export const gitComparison = {
  before, after: { status: `M  ${before.status.slice(3)}`, diff: '', cached: before.diff },
  mm: gitOutput(' \\(끝 2줄\\)'),
};

export const gitContext = screenResult('S3-7');
export const contextLength = required(gitContext.match(/^전체 글자 수: (\d+)$/m)?.[1], '문맥 글자 수');
export const changedStatus = required(gitContext.match(/^Status:\n([^\n]+)/m)?.[1], '수집 상태');
export const branch = required(gitContext.match(/^Branch: (.+)$/m)?.[1], '브랜치');
export const gitMemo = required(gitContext.match(/^\+([^\n]+)$/m)?.[1], '메모');
export const connectResponse = JSON.parse(screenResult('S4-7').slice('HTTP/2 200\n'.length)) as {
  model: string;
  choices: [{ message: { content: string } }];
  usage: Record<string, number>;
};

export const prompts = {
  commit: required(promptSource.match(/COMMIT_SYSTEM = """([\s\S]*?)"""/)?.[1], 'COMMIT_SYSTEM'),
  pr: required(promptSource.match(/PR_SYSTEM = """([\s\S]*?)"""/)?.[1], 'PR_SYSTEM'),
};

const validation = record(9);
const recordedInputs = required(evidence.split(/^## R9 입력 전문[^\n]*\n/m)[1], 'R9 입력 전문');
const validatorNames: Record<string, string> = {
  C1: '정상 제목+본문',
  C2: '제목만',
  C3: '너무 짧은 제목',
  C4: '73자 제목',
  C5: '코드 블록',
  C6: '본문에 파일·불릿 없음',
  P1: 'How to Test에 통과 주장',
  P2: 'How to Test 없음',
  P3: 'Why에 불릿 없음',
  P4: 'Why에 통과 주장',
  P5: '81자 제목',
};
export const validatorCases = Array.from(recordedInputs.matchAll(/^----- ([CP]\d)\n([\s\S]*?)\n(?=-----)/gm), ([, id, input]) => {
  const outcome = required(validation.match(new RegExp(`^${id} .+?→ (.+)$`, 'm'))?.[1], id);
  const processed = id === 'P1'
    ? required(validation.match(/^P1 [^\n]+\n([\s\S]*?)(?=^P2 )/m)?.[1], 'P1 후처리').trimEnd().replace(/^ {3}/gm, '')
    : undefined;
  return { id, name: required(validatorNames[id], id), input, outcome, processed };
});

const trip = labGuide.split('## 데이터의 여행')[1].split('## 실습 상태 카드')[0];
export const journeyRows = trip.split('\n').filter(line => /^\| [^|-]/.test(line)).slice(1).map(line => {
  const [step, value, place, maker] = line.slice(1, -1).split('|').map(cell => cell.trim());
  return { step, value, place, maker };
});
