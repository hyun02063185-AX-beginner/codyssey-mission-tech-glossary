import { useState } from 'react';
import { Arrow, Box, ContextSample, GitAreasContents } from './B32Diagram';
import {
  Badge, CodeSample, IntegratedDiagram, Steps, evidenceLab, evidenceOwner, evidenceRepro, evidenceSource,
} from './B32IntegratedDiagram';
import { branch, changedStatus, contextLength, gitComparison, gitContext, gitMemo, record, screenResult } from './integratedEvidence';

export function GitAreasSequence({ initial }: { initial: string }) {
  const stages = ['edit', 'add', 'commit', 'push'];
  return <IntegratedDiagram id="I1" title="Git의 네 영역" initial={initial}
    options={{ edit: '처음부터', add: 'git add', commit: 'git commit', push: 'git push' }}
    canSelect={(state, target) => target === 'edit' || target === state || stages.indexOf(target) === stages.indexOf(state) + 1}>
    {state => {
      const step = stages.indexOf(state);
      return <>
        <fieldset className="b32-integrated-read-range">
          <legend>B3-2 프로그램이 읽는 범위</legend>
          <div className="b32-diagram-flow">
            <Box title="작업 폴더" tone="git">{step === 0 ? gitMemo : '메모 있음'}</Box>
            <Arrow><code>git add</code></Arrow>
            <Box title="스테이징 영역" tone="git">{step >= 1 ? gitMemo : '메모 없음'}</Box>
            <Arrow><code>git commit</code></Arrow>
            <Box title="로컬 저장소 (.git)" tone="git">{step >= 2 ? '새 커밋에 메모가 있음' : '메모 없음'}</Box>
          </div>
        </fieldset>
        <div className="b32-diagram-flow">
          <Arrow><code>git push</code></Arrow>
          <Box title="원격 저장소" tone="external">{step === 3 ? '새 커밋 반영됨' : '이 변경은 아직 없음'}</Box>
        </div>
        <p><code>git status --short</code> · <Badge>교육용 예시</Badge></p>
        <CodeSample>{[gitComparison.before.status, gitComparison.after.status, '출력 없음', '출력 없음'][step]}</CodeSample>
        <p>B3-2는 커밋·push를 하지 않습니다.</p>
      </>;
    }}
  </IntegratedDiagram>;
}

export function GitDiffComparison({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I2" title="스테이징 전후의 세 가지 출력" initial={initial}
    options={{ before: 'add 이전', after: 'add 이후', mm: '양쪽에 나뉜 변경' }}>
    {state => {
      const output = gitComparison[state as keyof typeof gitComparison];
      return <>
        <GitAreasContents state={state}/>
        <Badge>{evidenceLab} · Lab 03{state === 'mm' ? ' B' : ''}</Badge>
        <div className="b32-integrated-grid">
          <Box title="git status --short"><CodeSample>{output.status}</CodeSample></Box>
          <Box title="git diff"><CodeSample>{output.diff || '출력 없음'}</CodeSample></Box>
          <Box title="git diff --cached"><CodeSample>{output.cached || '출력 없음'}</CodeSample></Box>
        </div>
      </>;
    }}
  </IntegratedDiagram>;
}

const pipeSteps = [
  'Python이 운영체제에 요청', 'Git 프로세스 시작', 'stdout·stderr 파이프 연결',
  'Git이 stdout에 바이트 기록', 'Python이 읽어 문자열에 저장', '운영체제가 종료 코드 전달',
];
const pipeDetails = [
  'Python: subprocess.run(["git", "status", "--short"])',
  '운영체제 → Git: git status --short',
  'capture_output=True → stdout 파이프와 stderr 파이프를 각각 연결',
  'Git이 stdout의 쓰기 쪽으로 바이트를 보냅니다.',
  'Python은 읽기 쪽에서 받은 바이트를 문자열로 저장합니다.',
  '운영체제는 출력 파이프와 별도로 종료 코드를 전달합니다.',
];

const [, returncode, stdout, stderr] = screenResult('S3-5').match(
  /===== 저장소 안 =====\nreturncode: (\d+)\nstdout: ([^\n]+)\nstderr: ([^\n]+)/,
)!;

export function ProcessPipe({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I3" title="Python과 Git 사이의 파이프" initial={initial}
    options={{ launch: '프로세스 시작', pipe: '파이프로 읽기' }}>
    {state => <Steps key={state} labels={pipeSteps} start={state === 'pipe' ? 2 : 0}>{step => <>
      <div className="b32-diagram-flow">
        <Box title="Python 프로세스" tone="python"><code>subprocess.run([...])</code></Box>
        <Arrow>실행 요청 · 메모리 공유 없음</Arrow>
        <Box title="운영체제">{step < 2 ? 'Git 프로세스 시작' : 'stdout·stderr 파이프와 종료 상태'}</Box>
        <Arrow>{step < 2 ? '실행' : '통로 연결'}</Arrow>
        <Box title="Git 프로세스" tone="git"><code>git status --short</code></Box>
      </div>
      <p>{pipeDetails[step]}</p>
      {step >= 2 && <div className="b32-integrated-pipes" role="group" aria-label="Git 출력이 돌아오는 길">
        <div className="b32-diagram-flow" role="group" aria-label="stdout 경로">
          <Box title="Git · stdout" tone="git">쓰기 쪽</Box>
          <Arrow>바이트</Arrow>
          <Box title="stdout 파이프">{step === 2 ? '운영체제가 연결' : <code>{stdout}</code>}</Box>
          <Arrow>읽기 쪽</Arrow>
          <Box title="Python 메모리" tone="python">
            <code>result.stdout{step >= 3 && ` = ${stdout}`}</code>
          </Box>
        </div>
        <div className="b32-diagram-flow" role="group" aria-label="stderr 경로">
          <Box title="Git · stderr" tone="git">쓰기 쪽</Box>
          <Arrow>별도 통로</Arrow>
          <Box title="stderr 파이프">{step === 2 ? '운영체제가 연결' : '이 실행에서는 출력 없음'}</Box>
          <Arrow>읽기 쪽</Arrow>
          <Box title="Python 메모리" tone="python">
            <code>result.stderr{step >= 3 && ` = ${stderr}`}</code>
          </Box>
        </div>
        {step === 5 && <div className="b32-diagram-flow" role="group" aria-label="종료 코드 경로">
          <Box title="Git 프로세스 종료" tone="git">종료 코드 {returncode}</Box>
          <Arrow>종료 상태</Arrow>
          <Box title="운영체제">종료 코드 전달</Box>
          <Arrow>파이프와 별도로 전달</Arrow>
          <Box title="Python" tone="python"><code>result.returncode = {returncode}</code></Box>
        </div>}
      </div>}
      <ol className="b32-integrated-flow-steps">{pipeSteps.map((label, index) =>
        <li key={label} aria-current={step === index ? 'step' : undefined}>{label}</li>)}</ol>
      <Badge>{step >= 3 ? evidenceLab : evidenceSource}</Badge>
    </>}</Steps>}
  </IntegratedDiagram>;
}

export function CaptureComparison({ initial }: { initial: string }) {
  const [direct, captured] = record(6).split(/\n(?=----- ②)/);
  return <IntegratedDiagram id="I4" title="일반 실행과 capture_output" initial={initial}
    options={{ compare: '나란히', direct: '①만', capture: '②만' }}>
    {state => <>
      <Badge>{evidenceRepro} · R6</Badge>
      <div className="b32-integrated-grid">
        {state !== 'capture' && <Box title="① 일반 실행" tone="git">
          Git → 터미널로 직접 출력<CodeSample>{direct}</CodeSample>
        </Box>}
        {state !== 'direct' && <Box title="② capture_output=True, text=True" tone="python">
          Git → 파이프 → Python 문자열<CodeSample>{captured}</CodeSample>
        </Box>}
      </div>
    </>}
  </IntegratedDiagram>;
}

const collectSteps = [
  '작업 폴더 안인지 사전 확인', '현재 브랜치', '짧은 상태', '파일 목록과 미추적 목록', '작업 폴더 diff', '스테이징 diff',
];
const collectCommands = [
  'rev-parse --is-inside-work-tree', 'branch --show-current', 'status --short --untracked-files=all',
  'status --porcelain=v1 -z --untracked-files=all', 'diff', 'diff --cached',
];
const collectFields = [
  { step: 1, name: 'branch', value: branch },
  { step: 2, name: 'status', value: changedStatus },
  { step: 3, name: 'files', value: "['README.md']" },
  { step: 3, name: 'untracked_files', value: '[]' },
  { step: 4, name: 'unstaged_diff', value: gitComparison.before.diff },
  { step: 5, name: 'staged_diff', value: "''" },
];

function PrepareContext() {
  const [risky, setRisky] = useState(false);
  const [mask, setMask] = useState(false);
  return <>
    <div className="b32-diagram-switch" role="group" aria-label="경로 검사 예시">
      <button type="button" aria-pressed={!risky} onClick={() => setRisky(false)}>통과</button>
      <button type="button" aria-pressed={risky} onClick={() => setRisky(true)}>.env 예</button>
    </div>
    {risky ? <p><Badge>교육용 예시</Badge> <code>.env</code> 감지 · 준비 중단 · 요청 0회</p>
      : <Steps labels={['위험 경로 검사', '여섯 칸을 문맥으로 묶기', '민감한 값 가림', '16,000자 검사']}>{step => [
        <p key="check">위험 경로가 없으면 문맥 만들기로 넘어갑니다.</p>,
        <div key="context"><ContextSample heading="여섯 칸을 제목 줄이 있는 글로 묶기"/><CodeSample>{gitContext}</CodeSample><Badge>{evidenceOwner}</Badge></div>,
        <div key="redact"><ul><li>개인 키 블록</li><li>이메일</li><li>Bearer 토큰</li><li>비밀값 할당</li><li>알려진 토큰 형태</li></ul>
          <button type="button" aria-pressed={mask} onClick={() => setMask(!mask)}>이메일 가림 예시</button>
          <p><Badge>교육용 예시</Badge> <code>{mask ? '[REDACTED EMAIL]' : '이메일 값'}</code></p></div>,
        <p key="limit">16,000자를 넘으면 중단합니다. <Badge>{evidenceOwner} · 이번 실행 {contextLength}자</Badge></p>,
      ][step]}</Steps>}
  </>;
}

export function ContextPreparation({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I6" title="GitChanges를 모아 문맥으로 만들기" initial={initial}
    options={{ collect: '수집', prepare: '전처리' }}>
    {state => state === 'prepare' ? <PrepareContext/> : <Steps labels={collectSteps}>{step => <>
      <p><code>git {collectCommands[step]}</code></p>
      {step === 0 && <Box title="사전 확인"><code>true</code> → 계속 · 실패 → <code>GitError</code></Box>}
      <div className="b32-integrated-grid">
        {collectFields.map(field => <Box key={field.name} title={field.name} tone={step === field.step ? 'action' : 'plain'}>
          {step >= field.step ? <CodeSample>{field.value}</CodeSample> : '수집 전'}
        </Box>)}
      </div>
      {step > 0 && <Badge>{evidenceOwner} · README.md 메모 사례</Badge>}
      {step === collectSteps.length - 1 && <p><code>has_changes = bool(status)</code> → <code>True</code></p>}
    </>}</Steps>}
  </IntegratedDiagram>;
}
