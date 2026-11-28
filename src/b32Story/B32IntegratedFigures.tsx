import { useState, type ReactNode } from 'react';
import { Box } from './B32Diagram';
import { Badge, CodeSample, IntegratedDiagram, Steps, evidenceOwner, evidenceSource } from './B32IntegratedDiagram';
import { ApiRequest, DraftValidation, OutputChannels, PromptMapping } from './B32IntegratedApiFigures';
import { CaptureComparison, ContextPreparation, GitAreasSequence, GitDiffComparison, ProcessPipe } from './B32IntegratedGitFigures';
import { contextLength, gitComparison, gitMemo, journeyRows, screenResult } from './integratedEvidence';
import type { InteractiveId } from './parseStoryboardV04';

const roles = [
  { label: '사용자', tone: 'action', does: '명령으로 초안 종류를 고르고, API 키를 안전하게 설정하며, 마지막에 초안을 판단하고 커밋·push·PR 등록을 직접 합니다.',
    limit: '검토를 프로그램에 맡기지 않습니다.' },
  { label: 'Git', tone: 'git', does: '작업 폴더·스테이징 영역·마지막 커밋의 차이를 알려 줍니다.',
    limit: '이 프로그램의 변경 수집 중에는 외부와 통신하지 않습니다.' },
  { label: 'Python', tone: 'python', does: '사용자 입력을 읽고, Git을 실행해 결과를 받고, 보낼 글을 만들어 검사하고, 요청을 보내고, 응답에서 초안을 꺼내 양식을 검사하고, 결과와 진행 정보를 두 통로로 나눠 알립니다.',
    limit: '자동으로 커밋·push·PR 등록을 하지 않습니다.' },
  { label: '외부 AI', tone: 'external', does: '받은 system과 user로 초안 글을 씁니다.',
    limit: '내 저장소를 직접 보거나 바꾸지 않습니다.' },
];
const overview = [
  {
    label: '명령', tasks: {
      0: <><code>python3 main.py commit</code> 입력</>,
      2: <><code>argparse</code>로 <code>commit</code> 읽기</>,
    },
    data: <>명령줄 글자 → <code>args.command</code></>,
  },
  {
    label: '변경 읽기', tasks: {
      1: <><code>status</code>·<code>diff</code>·<code>diff --cached</code> 결과를 stdout으로 출력</>,
      2: <><code>subprocess</code>로 Git 실행, Git 문맥 만들고 검사</>,
    },
    data: <>Git 출력 → Git 문맥 <Badge>{evidenceOwner} · 이번 실행 {contextLength}자</Badge></>,
  },
  {
    label: 'HTTPS 요청', tasks: {
      2: <>HTTPS POST · 헤더에 키, JSON 본문에 <code>system</code>과 <code>user</code></>,
      3: '요청을 받아 초안 작성',
    },
    data: '요청 JSON',
  },
  {
    label: '응답·검증', tasks: {
      2: <><code>content</code> 추출·형식 검사 → stdout에 초안, stderr에 요청 횟수 출력</>,
      3: '응답 JSON 반환',
    },
    data: '응답 JSON → 초안',
  },
  {
    label: '판단', tasks: {
      0: '초안을 diff와 비교하고 커밋·push·PR을 직접 수행',
    },
    data: '초안 → 사람의 결정',
  },
];

function RoleLanes({ active, tasks }: { active: number[]; tasks?: Partial<Record<number, ReactNode>> }) {
  return <div className="b32-integrated-grid b32-integrated-lanes">
    {roles.map(({ label, tone }, index) => <div key={label} data-selected={active.includes(index) || undefined}>
      <Box title={label} tone={tone}>{tasks?.[index]}</Box>
    </div>)}
  </div>;
}

function RoleComparison() {
  const [active, setActive] = useState(0);
  return <>
    <RoleLanes active={[active]}/>
    <div role="group" aria-label="주체 선택" className="b32-diagram-switch">
      {roles.map(role => <button key={role.label} type="button" aria-pressed={roles[active] === role}
        onClick={() => setActive(roles.indexOf(role))}>{role.label}</button>)}
    </div>
    <div aria-live="polite">
      <Box title={roles[active].label} tone={roles[active].tone}>
        <dl><dt>하는 일</dt><dd>{roles[active].does}</dd><dt>하지 않는 일</dt><dd>{roles[active].limit}</dd></dl>
      </Box>
    </div>
  </>;
}

const readme = journeyRows[0];
const diff = journeyRows[1];
const context = journeyRows[2];
const message = journeyRows[3];
const draft = journeyRows[4];
const terminal = journeyRows[5];
const literal = (text: string) => text.replaceAll('`', '');
const pipeline = [
  { title: 'README 줄', value: literal(readme.value), where: literal(readme.place), who: readme.maker, active: [0] },
  { title: 'diff의 +줄', value: literal(diff.value), where: literal(diff.place), who: diff.maker, active: [1] },
  { title: 'result.stdout 문자열', value: JSON.stringify(gitComparison.before.diff.split('\n').at(-1) + '\n'),
    where: 'Python 메모리의 result.stdout (git diff 출력의 마지막 줄)', who: 'Git이 쓰고 Python이 읽음', active: [2], example: true },
  { title: 'GitChanges.unstaged_diff', value: `+${gitMemo}`, where: 'GitChanges.unstaged_diff', who: context.maker, active: [2] },
  { title: `Git 문맥 · 이번 실행 ${contextLength}자`, value: literal(context.value), where: literal(context.place), who: context.maker, active: [2] },
  { title: '딕셔너리의 messages[1].content', value: literal(message.value), where: 'Python 요청 데이터의 user 메시지', who: message.maker, active: [2] },
  { title: '요청 JSON 글과 UTF-8 바이트', value: JSON.stringify({ role: 'user', content: `…\n+\n+${gitMemo}\n` }),
    where: 'HTTPS 요청 본문 · Python → 외부 AI', who: 'B3-2 프로그램이 JSON과 UTF-8 바이트로 변환', active: [2, 3], example: true },
  { title: '응답 content', value: literal(draft.value), where: `${literal(draft.place)} · 외부 AI → Python`, who: draft.maker, active: [2, 3], example: true },
  { title: 'stdout의 초안', value: screenResult('S5-1').split('\n\n=== 검토용 초안: PR')[0],
    where: literal(terminal.place), who: terminal.maker, active: [2] },
];

function FullJourney({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I10" title="사용자·Git·Python·외부 AI의 연결" initial={initial}
    options={{ overview: '전체 흐름', roles: '주체별 역할', pipeline: '데이터의 모습' }}>
    {state => {
      if (state === 'roles') return <RoleComparison/>;
      if (state === 'overview') return <Steps labels={overview.map(item => item.label)}>{step => {
        const { tasks, data } = overview[step];
        return <>
          <RoleLanes active={Object.keys(tasks).map(Number)} tasks={tasks}/>
          <p><strong>오가는 데이터</strong> · {data}</p>
        </>;
      }}</Steps>;
      return <Steps labels={pipeline.map(item => item.title)}>{step => {
        const item = pipeline[step];
        return <>
          <RoleLanes active={item.active}/>
          {step === 6 && <p><strong>여기서 처음 내 컴퓨터 밖으로</strong></p>}
          <Badge>{item.example ? '교육용 예시' : evidenceOwner + ' · 사례 발췌'}</Badge>
          <CodeSample>{item.value}</CodeSample>
          <dl><dt>어디에 있나</dt><dd>{item.where}</dd><dt>누가 만들었나</dt><dd>{item.who}</dd></dl>
          <Badge>{evidenceSource} · 데이터 이동</Badge>
        </>;
      }}</Steps>;
    }}
  </IntegratedDiagram>;
}

const figures = {
  I1: GitAreasSequence, I2: GitDiffComparison, I3: ProcessPipe, I4: CaptureComparison,
  I5: OutputChannels, I6: ContextPreparation, I7: ApiRequest, I8: PromptMapping,
  I9: DraftValidation, I10: FullJourney,
};

export default function B32IntegratedFigures({ id, initial }: { id: InteractiveId; initial: string }) {
  const Figure = figures[id];
  return <Figure initial={initial}/>;
}
