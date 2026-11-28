import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, CodeSample } from './B32IntegratedDiagram';
import { Simulation } from './B32FiguresV05';
import { connectResponse, validatorCases } from './integratedEvidence';
import { learningScenes } from './learningIndexV05';
import { assumedReasoning, draftPrefix, tokenPresets, tokenRun } from './simulationV05';

const validationExamples = ['P5', 'P4'].map(id => validatorCases.find(item => item.id === id)!);
const [httpUsage, outputRules, validation, finalReview] = ['S4-7', 'S5-2', 'S5-3', 'S5-5'].map(id =>
  learningScenes.flatMap(scene => scene.screens).find(screen => screen.id === id)!,
);

function ProcessedDraft({ output }: { output: string }) {
  const heading = '\n## How to Test\n';
  const start = output.indexOf(heading) + heading.length;
  return <pre className="b32-integrated-scroll" tabIndex={0} aria-label="후처리된 PR 전문"><code>
    {output.slice(0, start)}<mark>{output.slice(start)}</mark>
  </code></pre>;
}

function Limits() {
  return <section className="b32-token-limits" aria-labelledby="b32-token-limits-title">
    <h3 id="b32-token-limits-title">두 가지 제한</h3>
    <table>
      <thead><tr><th scope="col">Python이 결과를 검사하는 규칙</th><th scope="col">외부 AI의 생성 한도</th></tr></thead>
      <tbody><tr>
        <td>커밋 제목 최대 72자 · PR 제목 최대 80자 · PR 필수 섹션과 섹션별 불릿</td>
        <td>요청 JSON의 <code>max_tokens</code></td>
      </tr></tbody>
    </table>
    <p>커밋 제목 50자 이내는 프롬프트 권장이며 Python이 검사하지 않습니다(<Link to={outputRules.href}>{outputRules.id}</Link>).</p>
    <p>두 제한은 서로 대신할 수 없습니다.</p>
  </section>;
}

export default function B32MaxTokensV05() {
  const [limit, setLimit] = useState(20);
  const [reasoning, setReasoning] = useState(false);
  const [step, setStep] = useState<number | null>(null);
  const { reasoningUnits, visibleUnits, remaining, complete, result } = tokenRun(limit, reasoning);
  const playing = step !== null;
  const shown = step ?? visibleUnits;
  const stage = result.stage === 'response' ? '응답 처리 단계에서 거부 · PR 형식 검사 전' : '형식 검증';
  let generation = '생성 한도 도달';
  if (complete) {
    generation = remaining === 0 ? '답변 완성 · 한도와 같은 양'
      : `답변 완성 · 한도 ${limit} 교육용 단위 중 ${visibleUnits} 교육용 단위만 만들었습니다`;
  }

  useEffect(() => {
    if (step === null) return;
    const timer = window.setTimeout(() => {
      setStep(previous => previous !== null && previous + 1 < visibleUnits ? previous + 1 : null);
    }, 40);
    return () => window.clearTimeout(timer);
  }, [step, visibleUnits]);

  function play() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStep(reduceMotion || visibleUnits === 0 ? null : 0);
  }

  function changeLimit(value: number) {
    setStep(null);
    setLimit(value);
  }

  return <Simulation id="I12" title="Max Tokens · 생성 한도와 끊긴 초안" state="stream">
    <p>교육용 단위는 공백이나 줄바꿈으로 나눈 글 조각입니다. 실제 토크나이저의 토큰 수가 아닙니다.</p>
    <label className="b32-simulation-slider">한도 {limit} 교육용 단위
      <input type="range" min={1} max={80} value={limit} aria-label="생성 한도"
        aria-valuetext={`${limit} 교육용 단위`} onChange={event => changeLimit(Number(event.target.value))}/>
    </label>
    <div className="b32-diagram-switch" role="group" aria-label="한도 대표 값 (교육용 단위)">
      {tokenPresets.map(value => <button key={value} type="button" aria-pressed={limit === value}
        onClick={() => changeLimit(value)}>{value}</button>)}
    </div>
    <div className="b32-diagram-switch" role="group" aria-label="생성 재생">
      <button type="button" onClick={play}>생성 시작</button><button type="button" onClick={play}>다시</button>
    </div>
    <div className="b32-diagram-switch" role="group" aria-label="추론 설정">
      <button type="button" aria-pressed={reasoning} onClick={() => { setStep(null); setReasoning(!reasoning); }}>추론 모델 가정</button>
    </div>
    {reasoning && <div className="b32-token-reasoning">
      <p>교육용 가정 · 추론에 {assumedReasoning} 교육용 단위를 가정합니다. 추론 토큰의 양과 계산 방식은 공급자·모델마다 다릅니다. 코디세이 gpt-5-mini 미확인.</p>
      <div className="b32-token-budget" aria-hidden="true">
        <span style={{ width: `${reasoningUnits / limit * 100}%` }}/>
        <span style={{ width: `${shown / limit * 100}%` }}/>
        <span style={{ width: `${(limit - reasoningUnits - shown) / limit * 100}%` }}/>
      </div>
      <p>추론(보이지 않음) {reasoningUnits} 교육용 단위 · 보이는 글 {shown} 교육용 단위 · 남은 한도 {limit - reasoningUnits - shown} 교육용 단위</p>
    </div>}
    <p className="b32-simulation-sr" aria-live="polite">{playing ? '생성 중'
      : `${generation} · ${stage} · ${result.result === 'pass' ? '통과' : result.message}`}</p>
    <div className="b32-token-grid">
      <div>
        <section aria-labelledby="b32-token-draft-title">
          <h3 id="b32-token-draft-title">생성 초안</h3>
          <Badge>교육용 예시 · 2026-11-25 Owner PR 출력 바탕</Badge>
          <p><strong>{playing ? '↻ 생성 중' : complete ? `✓ ${generation}` : `⟂ ${generation}`}</strong></p>
          <p>만든 단위 {shown} 교육용 단위 / 한도 {limit} 교육용 단위</p>
          {!playing && <p>finish_reason: <code>{result.finish_reason}</code> (교육용)</p>}
          <CodeSample>{draftPrefix(shown) || (playing ? '' : '보이는 글 없음')}</CodeSample>
          {!playing && !complete && <p>⟂ 한도에서 끊김</p>}
          {!playing && complete && remaining > 0 && <p><code>max_tokens</code>는 생성량의 상한입니다.</p>}
        </section>
        {!playing && <section aria-labelledby="b32-token-result-title">
          <h3 id="b32-token-result-title">Python 처리 결과</h3>
          <Badge>재현 · Claude 2026-11-28 (R12)</Badge>
          <p>{stage}</p>
          {result.result === 'pass' ? <>
            <p><strong>✓ 통과</strong> · How to Test를 정해진 문구로 교체</p>
            <ProcessedDraft output={result.output ?? ''}/>
            {!complete && <p>검증 통과 ≠ 생성 완료 · 끊긴 문장이 후처리로 교체되어 보이지 않습니다.</p>}
          </> : <>
            <p><strong>× 거부</strong> · {result.message}</p>
            <p>종료 코드 1 · 다시 요청하지 않음 · 이 요청 1회와 사용량은 이미 생겼습니다(프로그램 동작 설명).</p>
          </>}
        </section>}
      </div>
      <Limits/>
    </div>
    <section aria-labelledby="b32-token-other-errors">
      <h3 id="b32-token-other-errors">형식이 완성되어도 실패하는 경우</h3>
      <Badge>재현 · Claude 2026-11-28 (R9)</Badge>
      <ul>{validationExamples.map(({ id, name, outcome }) => <li key={id}>{name} → {outcome} (I9 {id})</li>)}</ul>
      <p><Link to={validation.href}>I9의 판정 사례 보기 ({validation.id})</Link></p>
      <p>내용의 사실 여부는 <Link to={finalReview.href}>사람이 판단합니다 ({finalReview.id})</Link>.</p>
    </section>
    <p><code>max_tokens=500</code>은 PR 초안에 충분한 한도를 가정한 교육용 예시값이며 이 도식의 단위와 1:1로 대응하지 않습니다.
      실제 사용량은 <Link to={httpUsage.href}>응답의 <code>usage</code> ({httpUsage.id})</Link>에서 확인합니다.</p>
    <p><Badge>실제 · 2026-11-25 Owner (최소 연결 테스트)</Badge>{' '}
      <code>{Object.entries(connectResponse.usage).map(([key, value]) => `${key}: ${value}`).join(' · ')}</code></p>
  </Simulation>;
}
