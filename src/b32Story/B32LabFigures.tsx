import { useState, type ReactNode } from 'react';
import { getLab } from './labContent';
import { draftRecords } from './B32CycleLinks';
import B32Figure from './B32Figure';
import { reviewLesson } from './reviewLessonContent';

const memo = '실습 메모: AI가 작성한 초안은 사람이 검토한다.';
const statusLine = ' M README.md';

function Box({ title, tone = 'plain', children }: { title: string; tone?: string; children: ReactNode }) {
  return <div className={`b32-diagram-box b32-diagram-${tone}`}>
    <strong>{title}</strong>
    <div>{children}</div>
  </div>;
}

function Arrow({ children, compare = false }: { children: ReactNode; compare?: boolean }) {
  return <div className={`b32-diagram-arrow ${compare ? 'b32-diagram-compare' : ''}`}>
    <span aria-hidden="true"/>{children}
  </div>;
}

function Diagram({ id, title, options, initial, children }: {
  id: string; title: string; options?: Record<string, string>; initial?: string; children: (state: string) => ReactNode;
}) {
  const [state, setState] = useState(initial ?? 'all');
  return <figure className="b32-diagram" data-state={state} data-diagram={id} aria-labelledby={id}>
    <figcaption id={id}>{title}</figcaption>
    {options && <div className="b32-diagram-switch" role="group" aria-label="도식 보기 선택">
      {Object.entries(options).map(([value, label]) => <button key={value} type="button"
        aria-pressed={state === value} onClick={() => setState(value)}>{label}</button>)}
    </div>}
    <div aria-live={options ? 'polite' : undefined}>{children(state)}</div>
  </figure>;
}

function GitAreas() {
  return <Diagram id="lab-d01-git-areas" title="도식 01 · Git 변경 영역 비교" initial="before" options={{
    before: 'add 이전', after: 'add 이후', mm: '양쪽에 나뉜 변경',
  }}>{state => {
    const staged = state !== 'before';
    const split = state === 'mm';
    return <>
      <p className="b32-diagram-annotation"><code>git add README.md</code> · 작업 폴더의 README.md를 스테이징 영역으로 복사</p>
      <div className="b32-diagram-flow">
        <Box title="마지막 커밋 (HEAD)" tone="git">메모 없음</Box>
        <Arrow compare><code>git diff --cached</code><span>{staged ? '다름 → 메모 줄 출력' : '같음 → 출력 없음'}</span></Arrow>
        <Box title="스테이징 영역" tone={staged ? 'action' : 'git'}>{staged ? '메모 있음' : '메모 없음'}</Box>
        <Arrow compare><code>git diff</code><span>{split ? '다름 → 두 번째 메모 줄' : staged ? '같음 → 출력 없음' : '다름 → 메모 줄 출력'}</span></Arrow>
        <Box title="작업 폴더 (README.md)" tone="git">{split ? '메모 + 두 번째 메모' : '메모 있음'}</Box>
      </div>
      <div className="b32-diagram-status">
        <code>git status --short</code>
        <span>스테이징 <code>{staged ? 'M' : '\u00a0'}</code></span>
        <span>작업 폴더 <code>{staged && !split ? '\u00a0' : 'M'}</code></span>
        <code>README.md</code>
      </div>
      <p><mark>실습 메모</mark> <code>+{memo}</code></p>
      <p className="b32-diagram-evidence">실제 실행 · 2026-11-25 add 전후, 재현 일치 · MM 재현<br/>스토리 S1-2의 그림은 add 이전 상태입니다.</p>
    </>;
  }}</Diagram>;
}

function Subprocess() {
  return <Diagram id="lab-d02-subprocess" title="도식 02 · Python과 외부 프로그램의 관계"
    initial="in" options={{ in: '저장소 안', out: '저장소 밖' }}>{state => {
    const inside = state === 'in';
    return <>
      <div className="b32-diagram-flow">
        <Box title="Python" tone="python"><code>subprocess.run([...])</code></Box>
        <Arrow>실행 요청</Arrow>
        <Box title="운영체제">Git 프로세스 시작</Box>
        <Arrow>실행</Arrow>
        <Box title="Git" tone="git"><code>git status --short</code></Box>
      </div>
      <dl className="b32-diagram-returns">
        <div><dt>종료 상태 · Git → 운영체제 → Python</dt><dd><code>result.returncode = {inside ? '0' : '128'}</code></dd></div>
        <div><dt>stdout · 표준 출력 통로 → Python</dt><dd><code>result.stdout = {inside ? `'${statusLine}\\n'` : "''"}</code></dd></div>
        <div><dt>stderr · 표준 오류 출력 통로 → Python</dt><dd><code>result.stderr = {inside ? "''" : "'fatal: not a git repository …'"}</code></dd></div>
      </dl>
      <p className="b32-diagram-evidence">재현 검증 · 상태 B · 통로 끝은 Python (<code>capture_output=True</code>). 오류 문구의 언어는 환경에 따라 달라집니다.</p>
    </>;
  }}</Diagram>;
}

function ContextSample() {
  return <div className="b32-diagram-document">
    <strong>Git 문맥 · 이번 실행 535자</strong>
    <code>Branch: main</code><code>{statusLine}</code>
    <code>…</code><code><mark>+{memo}</mark></code>
  </div>;
}

function ContextRequest({ initial }: { initial: string }) {
  return <Diagram id="lab-d03-context-to-request" title="도식 03 · Git 문맥에서 요청 JSON으로"
    initial={initial} options={{ context: 'Git 문맥', request: '요청 JSON', all: '전체' }}>{state => <>
    {state !== 'request' && <div className="b32-diagram-flow">
      <Box title="Git 출력" tone="git"><code>status · diff · diff --cached</code></Box><Arrow>수집</Arrow>
      <Box title="Python" tone="python"><code>collect_changes()</code><br/><code>prepare_context()</code> · 여섯 칸 · 검사</Box>
      <Arrow>검사를 마친 글</Arrow><ContextSample/>
    </div>}
    {state !== 'context' && <>
      {state === 'all' && <p className="b32-diagram-annotation">↓ 같은 글을 <code>user</code> 자리에 넣음</p>}
      <div className="b32-diagram-flow">
        {state === 'request' && <><ContextSample/><Arrow>같은 글</Arrow></>}
        <Box title="요청 JSON" tone="python">
          <code>model: gpt-5-mini</code><br/><code>system: 작성 규칙</code><br/>
          <code>user:</code><ContextSample/>
        </Box>
        <Arrow>딕셔너리 → JSON 글</Arrow>
        <Box title="user 메시지 == Git 문맥: True">
          <code>{'{"role":"user","content":"Branch: main\\n…\\n+실습 메모: …\\n"}'}</code>
          <p>줄바꿈은 <code>{'\\n'}</code>으로 표시됩니다. API 키는 인증 헤더에 들어갑니다.</p>
        </Box>
      </div>
    </>}
    <p className="b32-diagram-evidence">Git 문맥 · 실제 실행 2026-11-25 / 요청 JSON · 재현 검증 · 미전송</p>
  </>}</Diagram>;
}

const connectionRecord = getLab('08')!.results.match(/```json\n([\s\S]*?)\n```/)?.[1] ?? '';
const connection = JSON.parse(connectionRecord) as { object: string; model: string; choices: { message: { content: string } }[] };

function ApiExchange({ initial }: { initial: string }) {
  return <Diagram id="lab-d04-api-request-response" title="도식 04 · AI API 요청과 응답" initial={initial}
    options={{ request: '요청과 오류', response: '응답과 답 글', all: '전체' }}>{state => <>
    <p className="b32-lab-badge">실제 실행 · 최소 연결 테스트 (2026-11-25) — COMMIT·PR 응답 아님</p>
    <div className="b32-diagram-flow">
      {state !== 'response' && <>
        <Box title="내 컴퓨터 · HTTPS 요청" tone="python">
          <code>POST https://copa.codyssey.kr/v1/chat/completions</code><br/>
          <code>Authorization: Bearer ••••</code><br/>
          <code>{'{"model":"gpt-5-mini","messages":[{"role":"user","content":"안녕하세요"}]}'}</code>
          <p>주소·모델·키 설정이 부족해 여기서 멈추면 요청 0회</p>
        </Box>
        <Arrow>요청</Arrow>
      </>}
      <Box title="외부 · 코디세이 AI API" tone="external">
        <ul>
          <li><strong>200</strong> · JSON 응답</li>
          <li><strong>400</strong> · HTML 오류 페이지 (실제)</li>
          <li><strong>401·403</strong> · 인증·권한 오류 (구현)</li>
        </ul>
      </Box>
      {state !== 'request' && <>
        <Arrow>응답</Arrow>
        <Box title="내 컴퓨터 · 응답 JSON 읽기" tone="result">
          <code>HTTP/2 200</code><br/><code>content-type: application/json</code><br/>
          <code>object: {connection.object}</code><br/><code>model: {connection.model}</code>
          <p><code>choices → [0] → message → content</code></p>
          <strong>꺼낸 답 글</strong><p>{connection.choices[0].message.content}</p>
        </Box>
      </>}
    </div>
    {state !== 'response' && <div className="b32-diagram-annotation">
      <strong>B3-2 출력 · 실제 실행</strong>
      <p><code>오류: AI API 응답 오류 (HTTP 400).</code><br/><code>AI API 요청 횟수: 1</code></p>
      <p>키를 다시 입력한 뒤 성공했습니다. 잘못된 입력의 정확한 원인은 확인되지 않았습니다.</p>
    </div>}
    <p className="b32-diagram-evidence">200은 최소 연결 테스트의 응답 발췌입니다. B3-2는 400의 응답 본문을 표시하지 않습니다.</p>
  </>}</Diagram>;
}

function TwoDrafts() {
  return <Diagram id="lab-d05-same-context-two-drafts" title="도식 05 · 같은 재료에서 다른 결과">{() => <>
    <ContextSample/>
    <p className="b32-diagram-annotation">↓ 두 명령의 <code>user</code>는 같은 Git 문맥</p>
    <div className="b32-diagram-pair">
      {['commit', 'pr'].map((command, index) => <div className="b32-diagram-branch" key={command}>
        <Box title={`system · ${index ? 'PR' : '커밋'} 작성 규칙`} tone="python">
          {index ? 'Title(80자 이하) · Why · What · How to Test' : '제목(72자 이하) · 선택 본문'}
        </Box>
        <p className="b32-diagram-annotation">↓ 외부 AI → Python · {index ? '형식 검사 · 재조립 · How to Test 교체 · 안내문' : '형식 검사 · 안내문'}</p>
        <Box title={`${command} · 실제 실행 2026-11-25`} tone="result">
          <strong>AI가 쓴 초안</strong><p>{draftRecords[index].split('\n')[1]}</p>
          <strong>Python이 넣은 문구</strong>
          <p><mark>{draftRecords[index].split('\n')[0]}</mark></p>
          {index > 0 && <p><mark>- 실행 권장: python -m unittest discover -s tests</mark></p>}
          <p><code>AI API 요청 횟수: 1 ← stderr</code></p>
        </Box>
      </div>)}
    </div>
    <p className="b32-diagram-annotation">↓ 사람 · 내용과 이유를 실제 diff와 비교 → 사람 · 직접 사용</p>
    <p className="b32-diagram-evidence">실제 두 초안과 소스로 확인한 처리 과정. 초안 요청의 원본 응답은 미확보.</p>
  </>}</Diagram>;
}

function Channels({ initial }: { initial: string }) {
  return <Diagram id="lab-d06-output-channels" title="도식 06 · stdout과 stderr" initial={initial}
    options={{ terminal: '터미널에서 보기', python: 'Python이 받기', file: '파일로 나누기' }}>{state => {
      const terminal = state === 'terminal';
      const python = state === 'python';
      return <>
        <div className="b32-diagram-channels">
          <Box title="실행하는 프로그램" tone={python ? 'git' : 'python'}>{python ? 'Git' : 'B3-2 (Python)'}</Box>
          <div>
            <Box title="stdout (1번) · 결과물" tone="result"><span aria-hidden="true">→ </span>{
              terminal ? '터미널 · 변경 사항이 없습니다.' : python ? 'Python 문자열 · result.stdout' : '> ../lab09-stdout.txt · COMMIT 초안'
            }</Box>
            <Box title="stderr (2번) · 진단·오류"><span aria-hidden="true">→ </span>{
              terminal ? '같은 터미널 · AI API 요청 횟수: 0' : python ? 'Python 문자열 · result.stderr' : '2> ../lab09-stderr.txt · AI API 요청 횟수: 1'
            }</Box>
          </div>
        </div>
        <p className="b32-diagram-annotation">별도 전달 · 종료 상태 → <code>{python ? 'result.returncode' : '$?'}</code></p>
        <p className="b32-diagram-evidence">{python ? '재현 검증 · Lab 04' : terminal
          ? '실제 실행 · Lab 02. 같은 터미널 화면에 두 통로의 글이 표시됩니다.'
          : '실제 실행 · Lab 09의 별도 API 호출. 파일 이름과 위치는 r1 실습 기준입니다.'}</p>
      </>;
    }}</Diagram>;
}

export default function B32LabFigures({ id }: { id: string }) {
  switch (id) {
    case '02': {
      const screen = reviewLesson.screens.find(item => item.id === 'S2-2')!;
      return <><div className="b32-lab-story-figure"><B32Figure desktop={screen.desktop} mobile={screen.mobile}/></div><Channels initial="terminal"/></>;
    }
    case '03': return <GitAreas/>;
    case '04': return <><Subprocess/><Channels initial="python"/></>;
    case '05': return <ContextRequest initial="context"/>;
    case '06': return <ContextRequest initial="request"/>;
    case '07': return <ApiExchange initial="request"/>;
    case '08': return <><TwoDrafts/><ApiExchange initial="response"/></>;
    case '09': return <Channels initial="file"/>;
    default: return null;
  }
}
