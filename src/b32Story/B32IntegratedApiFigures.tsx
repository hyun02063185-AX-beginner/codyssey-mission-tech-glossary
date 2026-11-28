import { useState, type ReactNode } from 'react';
import { Box, ContextSample } from './B32Diagram';
import {
  Badge, CodeSample, IntegratedDiagram, evidenceLab, evidenceOwner, evidenceRepro, evidenceSource,
} from './B32IntegratedDiagram';
import { connectResponse, gitContext, prompts, record, screenResult, validatorCases } from './integratedEvidence';

type Output = { name: string; exit: number; stdout?: string; stderr?: string; requests?: number; evidence: string };

function channels(text: string) {
  return {
    stdout: text.match(/^\[stdout\] (.+)$/m)?.[1],
    stderr: [...text.matchAll(/^\[stderr\] (.+)$/gm)].map(match => match[1]).join('\n'),
  };
}

function OutputCard({ name, exit, stdout, stderr, requests, evidence }: Output) {
  return <Box title={name}>
    <Badge>{evidence}</Badge>
    <dl className="b32-integrated-output">
      <dt>종료 코드</dt><dd><code>{exit}</code></dd>
      <dt>stdout</dt><dd><CodeSample>{stdout || '출력 없음'}</CodeSample></dd>
      <dt>stderr</dt><dd><CodeSample>{stderr || '출력 없음'}</CodeSample></dd>
      <dt>AI API 요청 횟수</dt><dd>{requests ?? '해당 없음 (Git 실행)'}</dd>
    </dl>
  </Box>;
}

const gitOutputs = screenResult('S3-5').split('===== 저장소 밖 =====');
const httpFailure = screenResult('S4-6').split('\n').slice(1, 3).join('\n');
const programOutputs: Output[] = [
  { name: '정상 초안 출력', exit: 0, stdout: screenResult('S5-1').split('\n\n=== 검토용 초안: PR')[0],
    stderr: 'AI API 요청 횟수: 1', requests: 1, evidence: evidenceOwner + ' · 종료 코드 기준은 구현' },
  { name: '변경 없음', exit: 0, ...channels(record(1)), requests: 0, evidence: evidenceRepro + ' · Owner 기록과 일치' },
  { name: '설정 없음', exit: 1, ...channels(record(2)), requests: 0, evidence: evidenceRepro + ' · R2' },
  { name: 'HTTP 400', exit: 1, stderr: httpFailure, requests: 1, evidence: evidenceOwner + ' · 종료 코드 기준은 구현' },
];

const httpOutputs = [
  ['HTTP 401·403', '인증 또는 권한 오류'], ['그 밖의 HTTP 오류', 'AI API 응답 오류 (HTTP 번호)'],
  ['네트워크 연결 실패 또는 30초 초과', '네트워크 연결에 실패'],
  ['응답이 JSON 아님', '올바른 JSON이 아닙니다'], ['content 없음 또는 빈 값', 'AI API 응답에 텍스트가 없습니다'],
];

export function OutputChannels({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I5" title="종료 코드와 출력 통로" initial={initial}
    options={{ git: 'Git 프로세스', program: 'B3-2 프로그램', http: 'HTTP·응답 오류' }}>
    {state => <div className="b32-integrated-grid">
      {state === 'git' && gitOutputs.map((output, index) => <OutputCard key={index} name={index ? '저장소 밖' : '저장소 안'}
        exit={Number(output.match(/^returncode: (\d+)/m)?.[1])}
        stdout={output.match(/^stdout: (.+)$/m)?.[1]} stderr={output.match(/^stderr: (.+)$/m)?.[1]}
        evidence={evidenceLab + ' · Lab 04'}/>)}
      {state === 'program' && programOutputs.map(output => <OutputCard key={output.name} {...output}/>)}
      {state === 'http' && <>
        <OutputCard {...programOutputs[3]}/>
        {httpOutputs.map(([name, stderr]) => <OutputCard key={name} name={name} exit={1} stderr={stderr} requests={1} evidence={evidenceSource}/>)}
        <p>요청 시도 직전에 횟수를 셉니다. 실패하면 다시 보내지 않습니다.</p>
      </>}
    </div>}
  </IntegratedDiagram>;
}

const endpoint = 'https://copa.codyssey.kr/v1/chat/completions';
const payload = {
  model: connectResponse.model,
  messages: [
    { role: 'system', content: prompts.commit },
    { role: 'user', content: gitContext.split('\n전체 글자 수:')[0] },
  ],
};

function Parameters() {
  const [useTemperature, setUseTemperature] = useState(false);
  const [temperature, setTemperature] = useState(0.2);
  const [useMaxTokens, setUseMaxTokens] = useState(false);
  const [maxTokens, setMaxTokens] = useState(500);
  const [showInvalid, setShowInvalid] = useState(false);
  const request = {
    ...payload, ...(useTemperature ? { temperature } : {}), ...(useMaxTokens ? { max_tokens: maxTokens } : {}),
  };
  const quality = temperature < .5 ? '비슷한 표현이 반복되기 쉽습니다.'
    : temperature <= 1.4 ? '표현에 어느 정도 변화를 줄 수 있습니다.'
    : '표현이 더 다양해지고 정해진 양식에서 벗어날 가능성도 있습니다.';
  return <div className="b32-integrated-grid">
    <Box title="요청에 넣을 선택값" tone="python">
      <div className="b32-integrated-parameters">
        <label><input type="checkbox" checked={useTemperature} onChange={event => setUseTemperature(event.target.checked)}/> temperature 사용</label>
        <label>temperature {temperature.toFixed(1)}<input aria-label="temperature" type="range" min="0" max="2" step=".1"
          value={temperature} disabled={!useTemperature} onChange={event => setTemperature(Number(event.target.value))}/></label>
        <label><input type="checkbox" checked={useMaxTokens} onChange={event => setUseMaxTokens(event.target.checked)}/> max_tokens 사용</label>
        <label>max_tokens <select value={maxTokens} disabled={!useMaxTokens} onChange={event => setMaxTokens(Number(event.target.value))}>
          {[20, 100, 500, 2000].map(value => <option key={value}>{value}</option>)}
        </select></label>
        <button type="button" aria-expanded={showInvalid} onClick={() => setShowInvalid(!showInvalid)}>범위 밖 입력 예시</button>
        {showInvalid && <div><Badge>{evidenceRepro} · R4</Badge><p><code>--temperature 3</code></p>
          <CodeSample>{record(4)}</CodeSample></div>}
      </div>
    </Box>
    <Box title="미리 보는 요청 JSON · Git 문맥 발췌"><CodeSample>{JSON.stringify(request, null, 2)}</CodeSample></Box>
    <Box title="결과 품질 예시" tone="result">
      <Badge>교육용 시뮬레이션 · 실제 AI 출력 아님</Badge> <Badge>코디세이 지원 미확인</Badge>
      <p>{useTemperature ? quality : 'temperature를 생략해 공급자의 기본 동작에 맡깁니다.'}</p>
      {useMaxTokens && maxTokens === 20 && <p>PR 섹션이 끊겨 검증에 실패할 수 있습니다. 이 경우에도 요청은 1회 사용합니다.</p>}
    </Box>
  </div>;
}

export function ApiRequest({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I7" title="HTTPS 요청과 응답 살펴보기" initial={initial}
    options={{ key: '인증 헤더', body: '요청 본문', params: '선택 파라미터', response: '응답 본문' }}>
    {state => <>
      <div className="b32-integrated-grid">
        <Box title="주소·방식" tone="external"><code>POST {endpoint}</code></Box>
        <Box title="인증 헤더" tone={state === 'key' ? 'action' : 'plain'}><code>Authorization: Bearer ••••</code></Box>
        <Box title="JSON 본문" tone={state === 'body' || state === 'params' ? 'action' : 'plain'}>
          <code>model</code> · <code>messages</code><br/>인증 키는 헤더에만 있습니다.
        </Box>
        <Box title="응답" tone={state === 'response' ? 'action' : 'plain'}><code>choices[0].message.content</code> · <code>usage</code></Box>
      </div>
      {state === 'key' && <p><Badge>{evidenceRepro} · R8</Badge> 환경변수에서 읽은 키를 인증 헤더에 넣습니다.</p>}
      {state === 'body' && <>
        <div className="b32-integrated-grid">
          <Box title="model"><code>{payload.model}</code></Box>
          <Box title="messages[0] · system" tone="python"><CodeSample>{prompts.commit}</CodeSample></Box>
          <Box title="messages[1] · user" tone="python"><ContextSample heading="Git 문맥 발췌"/></Box>
        </div>
        <Badge>{evidenceLab} · Lab 06 발췌</Badge><CodeSample>{screenResult('S4-4')}</CodeSample>
      </>}
      {state === 'params' && <Parameters/>}
      {state === 'response' && <div className="b32-integrated-grid">
        <Box title="HTTP/2 200 · 최소 연결 테스트">
          <Badge>{evidenceOwner} · COMMIT·PR 응답 아님</Badge><CodeSample>{screenResult('S4-7')}</CodeSample>
        </Box>
        <Box title="응답에서 읽는 값" tone="result">
          <code>choices[0].message.content</code><p>{connectResponse.choices[0].message.content}</p>
          <dl>{Object.entries(connectResponse.usage).map(([key, value]) =>
            <div key={key}><dt><code>{key}</code></dt><dd>{value}</dd></div>)}</dl>
        </Box>
      </div>}
    </>}
  </IntegratedDiagram>;
}

const requirements: Record<'commit' | 'pr', { label: string; quote: string; note?: string }[]> = {
  commit: [
    { label: '커밋 제목 한 줄과 선택 본문', quote: 'one informative subject, then an optional blank line and body' },
    { label: '제목 최대 72자, 50자 권장', quote: 'The subject must be at most 72 characters (prefer 50).', note: '50자 권장은 프롬프트에서 부탁만 함' },
    { label: '변경 내용에 근거한 요약', quote: 'Describe only changes shown in the Git context.' },
    { label: '본문이 있으면 파일 1~3개 또는 핵심 변경 1~2개 불릿', quote: '', note: '프롬프트에 없음 · 검증기에도 없음' },
    { label: '테스트 실행 주장 금지', quote: 'Do not claim tests ran.' },
  ],
  pr: [
    { label: 'PR 제목 한 줄, 최대 80자', quote: 'Title: <specific title, at most 80 characters>' },
    { label: 'Why · What · How to Test 필수', quote: '## Why\n- <reason grounded in the change>\n## What\n- <specific change>\n## How to Test' },
    { label: '각 섹션에 불릿 하나 이상', quote: 'Each section needs at least one bullet.' },
    { label: '변경 내용에 근거한 요약', quote: 'Use only the supplied Git context.' },
    { label: '테스트 실행 주장 금지', quote: 'Do not invent completed tests.' },
  ],
};

function PromptRules({ type }: { type: 'commit' | 'pr' }) {
  const [index, setIndex] = useState(0);
  const rule = requirements[type][index];
  const prompt = prompts[type];
  const position = rule.quote ? prompt.indexOf(rule.quote) : -1;
  const highlighted: ReactNode = position < 0 ? prompt : <>
    {prompt.slice(0, position)}<mark>{rule.quote}</mark>{prompt.slice(position + rule.quote.length)}
  </>;
  return <div className="b32-integrated-grid">
    <div className="b32-diagram-switch" role="group" aria-label="과제 요구사항">
      {requirements[type].map(({ label }, i) => <button key={label} type="button" aria-pressed={i === index}
        onClick={() => setIndex(i)}>{label}</button>)}
    </div>
    <Box title={type === 'commit' ? 'COMMIT_SYSTEM' : 'PR_SYSTEM'} tone="python">
      <Badge>{evidenceSource} · prompts.py</Badge>
      {rule.note && <p>{rule.note}</p>}
      <CodeSample>{highlighted}</CodeSample>
    </Box>
  </div>;
}

const draftTypes = { commit: 'commit', pr: 'pr' };
export function PromptMapping({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I8" title="과제 요구사항에서 프롬프트로" options={draftTypes} initial={initial}>
    {state => <PromptRules key={state} type={state === 'commit' ? 'commit' : 'pr'}/>}
  </IntegratedDiagram>;
}

function ValidatorExample({ type }: { type: string }) {
  const cases = validatorCases.filter(item => item.id.startsWith(type === 'commit' ? 'C' : 'P'));
  const [index, setIndex] = useState(0);
  const selected = cases[index];
  return <>
    <div className="b32-diagram-switch" role="group" aria-label="검증할 기록">
      {cases.map(({ id, name }, i) =>
        <button key={id} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>{id} · {name}</button>)}
    </div>
    <div className="b32-integrated-grid" aria-live="polite">
      <Box title={`${selected.id} · 검증 입력`}>
        <Badge>교육용 예시</Badge><CodeSample>{selected.input}</CodeSample>
      </Box>
      <Box title={`${selected.id} · 검증 결과`} tone="result">
        <Badge>{evidenceRepro} (실제 검증기 실행)</Badge><p>{selected.outcome}</p>
        {selected.id === 'C6' && <p>공식 본문 규칙에는 어긋나지만 검증기에 그 규칙이 없어 통과(G4)</p>}
      </Box>
    </div>
    {selected.processed && <>
      <div className="b32-integrated-grid" role="group" aria-label="How to Test 교체 전후">
        <Box title="How to Test · 교체 전"><CodeSample>{selected.input.split('\n## How to Test\n')[1]}</CodeSample></Box>
        <Box title="How to Test · 교체 후" tone="result"><CodeSample>{selected.processed.split('\n## How to Test\n')[1]}</CodeSample></Box>
      </div>
      <details>
        <summary>후처리된 PR 전문</summary><CodeSample>{selected.processed}</CodeSample>
      </details>
    </>}
    <p>거부되면 종료 코드 1 · 재요청 없음</p>
  </>;
}

export function DraftValidation({ initial }: { initial: string }) {
  return <IntegratedDiagram id="I9" title="출력 검증과 후처리 기록" options={draftTypes} initial={initial}>
    {state => <ValidatorExample key={state} type={state}/>}
  </IntegratedDiagram>;
}
