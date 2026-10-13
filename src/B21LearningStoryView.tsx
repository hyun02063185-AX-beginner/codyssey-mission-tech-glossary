import { useState } from 'react';
import { Link } from 'react-router-dom';

const exampleValues = [
  { id: 'TX-001', label: '식비 · 8,000원' },
  { id: 'TX-002', label: '교통 · 1,450원' },
  { id: 'TX-003', label: '급여 · 200,000원' },
];

function EvidencePair({ learner, code }: { learner: string; code: React.ReactNode }) {
  return <div className="b21-evidence-grid">
    <article className="b21-evidence-card is-learner">
      <b>학습자가 이해한 핵심</b>
      <p>{learner}</p>
    </article>
    <article className="b21-evidence-card is-code">
      <b>코드에서 확인한 사실</b>
      <p>{code}</p>
    </article>
  </div>;
}

function TermLinks({ terms }: { terms: Array<{ id: string; label: string }> }) {
  return <nav className="b21-term-links" aria-label="이 에피소드의 관련 용어">
    {terms.map(term => <Link key={term.id} to={`/terms/${term.id}`}>{term.label}<span aria-hidden="true">→</span></Link>)}
  </nav>;
}

function IteratorControl({ name }: { name: 'A' | 'B' }) {
  const [consumed, setConsumed] = useState(0);
  const stopped = consumed > exampleValues.length;
  const yielded = consumed > 0 && consumed <= exampleValues.length;
  const lastValue = yielded ? exampleValues[consumed - 1] : null;
  const stateLabel = stopped ? '종료됨' : yielded ? 'yield 일시정지' : '생성됨';

  const advance = () => setConsumed(value => Math.min(value + 1, exampleValues.length + 1));

  return <article className="b21-iterator" data-iterator={name.toLowerCase()}>
    <div className="b21-iterator-heading">
      <b>Iterator {name}</b>
      <span className={`b21-state is-${stopped ? 'stopped' : yielded ? 'yielded' : 'created'}`}>{stateLabel}</span>
    </div>
    <ol className="b21-progress" aria-label={`Iterator ${name} 진행 위치`}>
      {exampleValues.map((value, index) => <li className={index < Math.min(consumed, exampleValues.length) ? 'is-consumed' : ''} key={value.id}><span className="sr-only">{value.id}</span></li>)}
    </ol>
    <button type="button" onClick={advance} disabled={stopped}>Iterator {name}의 next()</button>
    <p className="b21-iterator-output" aria-live="polite">
      {stopped
        ? <><code>StopIteration</code> · 더 꺼낼 값이 없어 종료되었습니다.</>
        : lastValue
          ? <><code>next()</code> 실행 → <code>yield</code> {lastValue.id} · {lastValue.label}<br/><small>값을 내보낸 위치에서 일시정지했습니다.</small></>
          : <>아직 값을 요청하지 않았습니다. Iterator만 생성된 상태입니다.</>}
    </p>
  </article>;
}

function IteratorEpisode() {
  const [resetKey, setResetKey] = useState(0);
  return <section className="b21-episode" id="iterator-generator" aria-labelledby="iterator-generator-title">
    <header className="b21-episode-heading">
      <span aria-hidden="true">A</span>
      <div><p className="eyebrow">Iterator / Generator</p><h2 id="iterator-generator-title">저장된 값과 다음 값을 꺼내는 상태는 다르다</h2></div>
    </header>
    <EvidencePair
      learner="인덱스를 직접 조작하지 않고 다음 값을 하나씩 받으며, 각 Iterator가 자신의 진행 상태를 가진다는 점."
      code={<><code>_iter_jsonl()</code>은 JSONL 한 줄을 파싱해 <code>yield</code>하고, <code>iter_all()</code>은 이를 <code>Transaction</code>으로 바꿔 다시 <code>yield</code>합니다.</>}
    />
    <div className="b21-split">
      <article className="b21-panel">
        <header><div><h3>같은 값 목록, 서로 다른 두 진행 상태</h3><p>List로 단순화한 개념 모델 · 실제 거래 데이터가 아닌 예시입니다.</p></div><button className="b21-reset" type="button" onClick={() => setResetKey(value => value + 1)}>처음부터</button></header>
        <ol className="b21-example-list">
          {exampleValues.map((value, index) => <li key={value.id}><small>{index}</small><span>{value.label}</span><b>{value.id}</b></li>)}
        </ol>
        <div className="b21-iterator-grid" key={resetKey}>
          <IteratorControl name="A"/>
          <IteratorControl name="B"/>
        </div>
        <p className="b21-boundary"><b>상태 읽기</b> · <code>next()</code>를 누르면 Generator가 실행 중 상태를 거쳐 값을 내보내고, <code>yield</code> 위치에서 일시정지합니다. 같은 Iterator의 다음 호출은 그 지점 다음부터 재개합니다.</p>
      </article>
      <article className="b21-panel">
        <header><div><h3>B2-1 실제 코드</h3><p>ledger/repository.py</p></div></header>
        <pre className="b21-code"><code>{`def _iter_jsonl(path: Path) -> Iterator[dict]:
    ...
    for raw_line in f:
        ...
        yield json.loads(line)

def iter_all(self) -> Iterator[Transaction]:
    for record in _iter_jsonl(self.path):
        yield Transaction.from_dict(record)`}</code></pre>
        <p className="b21-boundary"><b>실제 구현과의 경계</b> · 위 개념 모델은 진행 상태를 보기 위해 List로 단순화했습니다. 실제 구현은 JSONL 파일을 한 줄씩 읽으며 전체 파일을 먼저 List로 만들지 않습니다.</p>
      </article>
    </div>
    <TermLinks terms={[{ id: 'iterator', label: 'Iterator' }, { id: 'generator', label: 'Generator' }, { id: 'yield', label: 'yield' }]}/>
  </section>;
}

type DecoratorPath = 'normal' | 'ledger-error';

function DecoratorEpisode() {
  const [path, setPath] = useState<DecoratorPath>('normal');
  const steps = path === 'normal'
    ? [<><code>main(args)</code>가 꾸며진 <code>_dispatch</code>를 호출합니다.</>, <><code>wrapper(*args, **kwargs)</code>에 진입합니다.</>, <>원래 <code>_dispatch</code>와 선택된 명령 핸들러가 정상 실행됩니다.</>, <><code>wrapper</code>가 종료 코드 <b>0</b>을 반환합니다.</>]
    : [<><code>main(args)</code>가 꾸며진 <code>_dispatch</code>를 호출합니다.</>, <><code>wrapper(*args, **kwargs)</code>에 진입합니다.</>, <>원래 <code>_dispatch</code> 안에서 <code>LedgerError</code>가 전파됩니다.</>, <><code>describe_error()</code> 결과를 출력하고 종료 코드 <b>1</b>을 반환합니다.</>];

  return <section className="b21-episode" id="decorator" aria-labelledby="decorator-title">
    <header className="b21-episode-heading">
      <span aria-hidden="true">B</span>
      <div><p className="eyebrow">Decorator</p><h2 id="decorator-title"><code>@handle_errors</code>는 호출 전에 함수를 감싼다</h2></div>
    </header>
    <EvidencePair
      learner="실제 예시 코드를 따라가며 원래 함수가 Wrapper에 감싸지고, 호출이 Wrapper를 거쳐 실행되는 구조를 이해한 것."
      code={<><code>_dispatch()</code> 한 곳에 <code>@handle_errors</code>가 적용되고, Wrapper가 정상 실행을 0으로, <code>LedgerError</code>를 오류 문구와 종료 코드 1로 바꿉니다.</>}
    />
    <div className="b21-split">
      <article className="b21-panel">
        <header><div><h3>Decorator 적용 전과 후</h3><p>ledger/cli.py · ledger/decorators.py</p></div></header>
        <div className="b21-transform" aria-label="Decorator 함수 변환">
          <code>def _dispatch(...)</code><span aria-hidden="true">→</span><code>handle_errors(_dispatch)</code><span aria-hidden="true">→</span><code>wrapper</code>
        </div>
        <pre className="b21-code"><code>{`def handle_errors(
    func: Callable[..., None]
) -> Callable[..., int]:
    @wraps(func)
    def wrapper(*args, **kwargs) -> int:
        try:
            func(*args, **kwargs)
        except LedgerError as exc:
            message, hint = describe_error(exc)
            print(f"[오류] {message}", file=sys.stderr)
            print(f"[힌트] {hint}", file=sys.stderr)
            return 1
        return 0
    return wrapper

@handle_errors
def _dispatch(args: argparse.Namespace) -> None:
    ...`}</code></pre>
        <p className="b21-boundary"><b>문법을 풀어 쓰면</b> · <code>_dispatch = handle_errors(_dispatch)</code>와 같은 함수 변환입니다.</p>
      </article>
      <article className="b21-panel">
        <header><div><h3>Wrapper 호출 경로</h3><p>자동 재생 없이 두 경로를 직접 비교합니다.</p></div></header>
        <div className="b21-path-switch" aria-label="Decorator 실행 경로 선택">
          <button type="button" aria-pressed={path === 'normal'} onClick={() => setPath('normal')}>정상 실행</button>
          <button type="button" aria-pressed={path === 'ledger-error'} onClick={() => setPath('ledger-error')}>LedgerError 처리</button>
        </div>
        <ol className="b21-trace" aria-live="polite">{steps.map((step, index) => <li key={index}>{step}</li>)}</ol>
        <p className="b21-boundary"><b>처리 경계</b> · 이 Wrapper는 <code>LedgerError</code>만 처리합니다. 다른 프로그래밍 오류를 임의로 잡아 정상 결과처럼 바꾸지 않습니다.</p>
      </article>
    </div>
    <TermLinks terms={[{ id: 'decorator', label: 'Decorator' }, { id: 'function', label: '함수' }]}/>
  </section>;
}

function TypeHintEpisode() {
  return <section className="b21-episode" id="type-hint" aria-labelledby="type-hint-title">
    <header className="b21-episode-heading">
      <span aria-hidden="true">C</span>
      <div><p className="eyebrow">Type Hint</p><h2 id="type-hint-title">함수 이름 옆에 입력과 반환의 계약이 보인다</h2></div>
    </header>
    <EvidencePair
      learner="Type Hint가 코드를 읽는 사람에게 입력·출력과 작성 의도를 전달한다는 목적이 새로웠던 것."
      code={<><code>limit: int</code>와 <code>-&gt; list[Transaction]</code>이 입력과 반환 형태를 드러냅니다. 양수 범위 검사는 함수 본문이 별도로 수행합니다.</>}
    />
    <article className="b21-panel">
      <header><div><h3>표시 전후 비교</h3><p>ledger/services.py · list_transactions()</p></div></header>
      <div className="b21-code-compare">
        <div><b>타입 표시가 없다면</b><pre className="b21-code"><code>{`def list_transactions(self, limit):
    ...
    return result`}</code></pre></div>
        <div><b>B2-1 실제 선언</b><pre className="b21-code"><code>{`def list_transactions(
    self, limit: int
) -> list[Transaction]:
    ...`}</code></pre></div>
      </div>
      <div className="b21-contract-grid">
        <article><b>코드를 읽는 사람</b><p><code>limit</code>에 정수를 넣고 <code>Transaction</code> 목록을 받는다는 작성 의도를 본문을 읽기 전에 파악합니다.</p></article>
        <article><b>IDE · Type Checker</b><p>선언과 호출부의 타입 불일치 가능성을 실행 전에 표시할 수 있습니다. 결과는 도구 설정과 분석 범위의 영향을 받습니다.</p></article>
        <article><b>Python 런타임</b><p>Type Hint 자체가 값을 자동으로 막지는 않습니다. 필요한 런타임 검증은 함수 본문에 별도로 작성합니다.</p></article>
      </div>
      <p className="b21-runtime-check"><b>이 코드의 실제 값 검증</b><code>if limit &lt;= 0: raise ValidationError(...)</code><span>양수 범위를 검사하며, <code>limit: int</code> 표기와는 다른 책임입니다.</span></p>
    </article>
    <TermLinks terms={[{ id: 'type-hint', label: 'Type Hint' }, { id: 'function', label: '함수' }]}/>
  </section>;
}

export default function B21LearningStoryView() {
  return <article className="b21-story-page" aria-labelledby="b21-story-title">
    <Link className="b21-back" to="/missions/main-M03">← B2-1 미션으로</Link>
    <header className="b21-story-header">
      <div className="b21-story-kicker"><p className="eyebrow">본과정 B2-1 · 점이 선이 되는 순간</p><span>검토 시안</span></div>
      <h1 id="b21-story-title">용돈 기입장 코드에서 이어진 세 가지 이해</h1>
      <p className="b21-story-intro">궁금했던 개념을 실제 코드에서 확인하고, 코드를 읽는 관점이 어떻게 달라졌는지 따라갑니다.</p>
      <p className="b21-story-scope"><b>읽는 기준</b> · 세 에피소드는 같은 미션 안에서 만났지만 서로의 원인과 결과는 아닙니다. 필수 학습 순서가 아닌 독립된 이해 경험을 한 화면에서 비교합니다.</p>
      <ul className="b21-source-legend" aria-label="콘텐츠 출처 구분">
        <li className="is-learner">학습자가 이해한 핵심</li>
        <li className="is-code">코드에서 확인한 사실</li>
        <li className="is-editor">연결 문구와 화면 구성은 편집 제안</li>
      </ul>
    </header>
    <nav className="b21-episode-nav" aria-label="에피소드 바로가기">
      <a href="#iterator-generator"><b>A</b><span>저장과 순회</span></a>
      <a href="#decorator"><b>B</b><span>함수 감싸기</span></a>
      <a href="#type-hint"><b>C</b><span>입력·반환 계약</span></a>
    </nav>
    <IteratorEpisode/>
    <DecoratorEpisode/>
    <TypeHintEpisode/>
    <footer className="b21-story-footer">
      <p className="eyebrow">다시 점으로, 다시 면으로</p>
      <h2>필요한 곳으로 돌아가기</h2>
      <p>이 Story는 용어 설명을 복제하지 않습니다. 용어 페이지에서 정확한 정의를 확인하고, 미션과 기술 지도에서 더 넓은 맥락으로 돌아갈 수 있습니다.</p>
      <div>
        <Link to="/missions/main-M03">← B2-1 미션 상세</Link>
        <Link to="/maps/data-database?mission=main-m03">B2-1의 데이터 저장 맥락 보기 →</Link>
      </div>
    </footer>
  </article>;
}
