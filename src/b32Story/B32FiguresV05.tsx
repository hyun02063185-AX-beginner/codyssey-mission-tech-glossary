import { useMemo, useState, type ReactNode } from 'react';
import Markdown from './B32MarkdownV04';
import { Box } from './B32Diagram';
import { Badge, CodeSample, evidenceSource } from './B32IntegratedDiagram';
import { captureCases, formatProbability, gitCases, inheritedStdout, temperatureCandidates, temperatureProbabilities } from './simulationV05';
import './b32FiguresV05.css';

export function Simulation({ id, title, state, children }: {
  id: string; title: string; state: string; children: ReactNode;
}) {
  return <figure className="b32-diagram b32-simulation" data-diagram={id} data-state={state} aria-labelledby={id}>
    <figcaption id={id}>{title}</figcaption>
    <div className="b32-simulation-badges">
      <Badge>교육용 시뮬레이션 · 실제 AI 출력·측정값이 아닙니다</Badge>
      <Badge>실제 AI API 호출 없음</Badge>
    </div>
    {children}
  </figure>;
}

const captureLabels = {
  compare: '나란히', direct: '①만', capture: '②만', redirect: '③ 출력을 파일로',
} as const;
type CaptureState = keyof typeof captureLabels;

export function CaptureV05({ initial, output }: { initial: string; output: string }) {
  const [state, setState] = useState(initial as CaptureState);
  const [direct, captured] = useMemo(() => captureCases(output), [output]);
  return <Simulation id="I4" title="일반 실행과 capture_output" state={state}>
    <div className="b32-diagram-switch" role="group" aria-label="출력 통로 사례">
      {Object.entries(captureLabels).map(([key, label]) => <button key={key} type="button"
        aria-pressed={state === key} onClick={() => setState(key as CaptureState)}>{label}</button>)}
    </div>
    <p className="b32-simulation-sr" aria-live="polite">{captureLabels[state]}</p>
    <div className="b32-integrated-grid">
      {(state === 'compare' || state === 'direct') && <Box title="① 일반 실행" tone="git">
        <Badge>재현 · Claude 2026-11-28 · R6</Badge>
        <p>출력 통로 지정 없음 → Git이 Python의 통로를 물려받아 직접 씁니다(지금은 터미널 → 화면).</p>
        <p><code>stdout</code>·<code>stderr</code>는 <code>None</code>이고 <code>returncode</code>는 받습니다.</p>
        <CodeSample>{direct}</CodeSample>
      </Box>}
      {(state === 'compare' || state === 'capture') && <Box title="② capture_output=True, text=True" tone="python">
        <Badge>재현 · Claude 2026-11-28 · R6</Badge>
        <p>Git → 파이프 → Python 문자열</p><CodeSample>{captured}</CodeSample>
      </Box>}
      {state === 'redirect' && <Box title="③ Python의 stdout을 파일로 보낸 경우" tone="git">
        <Badge>재현 · Claude 2026-11-28 · R11</Badge>
        <p>Python의 stdout → out.txt. Git도 같은 통로를 물려받아 파일에 직접 씁니다.</p>
        <p>화면 출력: {inheritedStdout.screenOutput} · <code>a.stdout</code>은 <code>None</code></p>
        <CodeSample>{inheritedStdout.command}</CodeSample>
        <p>out.txt 내용</p><CodeSample>{inheritedStdout.file}</CodeSample>
      </Box>}
    </div>
    <p><Badge>재현 · Claude 2026-11-28 · R11</Badge>{' '}
      <code>capture_output=True</code> = <code>stdout=PIPE, stderr=PIPE</code></p>
    <CodeSample>{inheritedStdout.pipeComparison}</CodeSample>
  </Simulation>;
}

const gitJudgments = [
  'stdout을 돌려줍니다. 변경 사항이 없습니다. · AI API 요청 0회(실제 기록)',
  'stdout을 돌려주고 다음 단계로 갑니다.',
  'stderr는 보지 않고 stdout을 돌려줍니다. 일반 Git 예이며 B3-2는 clone을 실행하지 않습니다.',
  'stderr를 담아 GitError를 일으킵니다. · 프로그램 종료 코드 1 · AI API 요청 0회',
];
const gitCallouts: Record<number, string> = {
  0: 'stdout이 비었지만 성공', 2: 'stderr에 글이 있지만 성공',
};

export function GitCasesV05({ output }: { output: string }) {
  const [selected, setSelected] = useState(0);
  const [compare, setCompare] = useState(false);
  const cases = useMemo(() => gitCases(output), [output]);
  return <Simulation id="I5" title="종료 코드와 출력 통로" state="git-cases">
    <div className="b32-diagram-switch" role="group" aria-label="Git 사례 선택">
      {cases.map((item, index) => <button key={item.name} type="button" aria-pressed={index === selected}
        onClick={() => { setSelected(index); setCompare(false); }}>{item.name}</button>)}
    </div>
    <div className="b32-diagram-switch" role="group" aria-label="Git 사례 비교">
      <button type="button" aria-pressed={compare} onClick={() => setCompare(!compare)}>네 사례 나란히</button>
    </div>
    <p className="b32-simulation-sr" aria-live="polite">{compare ? '네 사례 비교' : `${cases[selected].name} · returncode ${cases[selected].returncode}`}</p>
    <div className="b32-integrated-grid">
      {cases.map((item, index) => (compare || index === selected) && <div key={item.name}
        className="b32-git-case" data-failed={item.returncode !== 0 || undefined}>
        <Box title={item.returncode === 0
          ? `${item.name} · ✓ 성공 · returncode ${item.returncode}`
          : `${item.name[0]} ✕ 실패`}>
          <Badge>재현 · Claude 2026-11-28 (R10)</Badge>
          <dl className="b32-integrated-output">
            <dt>실행 명령</dt><dd><code>{item.command}</code> <small>(cwd: {item.cwd})</small></dd>
            <dt>returncode</dt><dd><code>{item.returncode}</code></dd>
            <dt>stdout</dt><dd><CodeSample>{item.stdout}</CodeSample></dd>
            <dt>stderr</dt><dd><CodeSample>{item.stderr}</CodeSample></dd>
            <dt>Python의 판단</dt><dd><Badge>{evidenceSource}</Badge><p>{gitJudgments[index]}</p></dd>
          </dl>
          {gitCallouts[index] && <p className="b32-simulation-callout">{gitCallouts[index]}</p>}
        </Box>
      </div>)}
    </div>
  </Simulation>;
}

type Candidate = ReturnType<typeof temperatureCandidates>['sentence'][number];

function temperatureLabel(temperature: number) {
  return temperature === 0 ? '0 (극한)' : temperature.toFixed(1);
}

function ProbabilityChart({ candidates, temperature }: { candidates: readonly Candidate[]; temperature: number }) {
  const probabilities = temperatureProbabilities(candidates.map(candidate => candidate.probability), temperature);
  const total = probabilities.reduce((sum, probability) => sum + probability, 0);
  return <section className="b32-temperature-chart" aria-label={`temperature ${temperatureLabel(temperature)} 확률`}>
    <h3>temperature {temperatureLabel(temperature)}</h3>
    <ul>
      {candidates.map(({ label, probability }, index) => {
        const value = probabilities[index];
        const change = temperature === 1 || value === probability ? '=' : value > probability ? '▲' : '▼';
        return <li key={label}>
          <div className="b32-temperature-label">
            <span><Markdown components={{ p: ({ children }) => <>{children}</> }}>{label}</Markdown></span>
            <strong>{formatProbability(value)}</strong>
            <span aria-hidden="true">{change}</span>
            <span className="b32-simulation-sr">{change === '=' ? '기준과 같음' : change === '▲' ? '기준보다 증가' : '기준보다 감소'}</span>
          </div>
          <div className="b32-temperature-track" aria-hidden="true">
            <span className="b32-temperature-fill" style={{ width: `${value * 100}%` }}/>
            <span className="b32-temperature-baseline" style={{ left: `${probability * 100}%` }}/>
          </div>
        </li>;
      })}
    </ul>
    <p>합계 {formatProbability(total)} · 점선은 1.0 기준</p>
  </section>;
}

export function TemperatureV05({ initial, table }: { initial: string; table: string }) {
  const [example, setExample] = useState<'sentence' | 'commit'>(initial === 'commit' ? 'commit' : 'sentence');
  const [temperature, setTemperature] = useState(1);
  const [compare, setCompare] = useState(false);
  const candidates = useMemo(() => temperatureCandidates(table), [table])[example];
  const values = temperatureProbabilities(candidates.map(candidate => candidate.probability), temperature);
  const label = temperatureLabel(temperature);

  function changeTemperature(value: number) {
    setCompare(false);
    setTemperature(value);
  }

  return <Simulation id="I11" title="Temperature · 후보의 선택 확률" state={example}>
    <div className="b32-simulation-badges">
      <Badge>후보는 실제 모델의 토큰 후보가 아닌 단순화된 예시</Badge>
      <Badge>temperature=0.2는 교육용 설정 예시 (미션 공식 값 아님)</Badge>
      <Badge>코디세이 gpt-5-mini 지원 미확인</Badge>
    </div>
    <div className="b32-diagram-switch" role="group" aria-label="Temperature 예시 선택">
      <button type="button" aria-pressed={example === 'sentence'} onClick={() => setExample('sentence')}>문장 예시</button>
      <button type="button" aria-pressed={example === 'commit'} onClick={() => setExample('commit')}>커밋 제목 예시</button>
    </div>
    {example === 'commit' && <p>같은 README 변경: README.md 끝에 메모 한 줄 추가</p>}
    <label className="b32-simulation-slider">temperature {label}
      <input aria-label="temperature" aria-valuetext={`temperature ${label}`}
        type="range" min={0} max={2} step={.1} value={temperature}
        onChange={event => changeTemperature(Number(event.target.value))}/>
    </label>
    <div className="b32-diagram-switch" role="group" aria-label="온도 대표 값">
      {[.2, 1, 2].map(value => <button key={value} type="button" aria-pressed={!compare && temperature === value}
        onClick={() => changeTemperature(value)}>{value.toFixed(1)}</button>)}
      <button type="button" onClick={() => changeTemperature(1)}>초기화</button>
      <button type="button" aria-pressed={compare} onClick={() => setCompare(!compare)}>0.2와 1.0 나란히 비교</button>
    </div>
    <p className="b32-simulation-sr" aria-live="polite">
      {compare ? 'temperature 0.2와 1.0 비교' : `temperature ${label} · ${candidates.map(({ label }, index) => `${label.replaceAll('**', '')} ${formatProbability(values[index])}`).join(' · ')}`}
    </p>
    {!compare && temperature === 0 && <p>식에 0을 넣으면 0으로 나누게 됩니다. 가장 높은 후보만 고르는 극한을 표시합니다. 실제 서비스의 0 처리 방식은 미확인입니다.</p>}
    <div className="b32-integrated-grid">
      {compare ? <><ProbabilityChart candidates={candidates} temperature={.2}/><ProbabilityChart candidates={candidates} temperature={1}/></>
        : <ProbabilityChart candidates={candidates} temperature={temperature}/>}
    </div>
    {example === 'commit' && <ul>
      <li>낮은 값: 가장 흔하고 일관된 표현이 거의 매번 나옵니다.</li>
      <li>높은 값: 표현이 다양해지고, 변경에 없는 내용을 추측한 후보도 뽑힐 가능성이 커집니다.</li>
      <li>낮은 값이 늘 정확한 것은 아닙니다. 가장 높은 후보가 틀렸다면 그 틀린 표현이 일관되게 나옵니다.</li>
    </ul>}
  </Simulation>;
}
