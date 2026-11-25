import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import { PresentationSurface, PresentationThemeSelector } from '../missionUI/PresentationTheme';
import { storyPath } from './content';
import { flowExceptions, flowRoles, flowSlide, flowStages } from './flowPreviewContent';
import './b32FlowPreview.css';

function focusHeading(heading: HTMLHeadingElement | null) {
  heading?.focus({ preventScroll: true });
  heading?.scrollIntoView({ block: 'nearest' });
}

export default function B32FlowPreview() {
  const [params, setParams] = useSearchParams();
  const lecture = params.get('mode') === 'lecture';
  const selectedIndex = flowStages.findIndex(stage => stage.id === params.get('step'));
  const index = lecture && selectedIndex < 0 ? 0 : selectedIndex;
  const selected = flowStages[index];
  const diagramHeading = useRef<HTMLHeadingElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const focusDetail = useRef(false);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'B3-2 · 실행 흐름 미리보기';
    return () => { document.title = previousTitle; };
  }, []);

  useEffect(() => {
    if (!focusDetail.current) return;
    focusDetail.current = false;
    focusHeading(detailHeading.current);
  }, [index]);

  function select(nextIndex: number, inLecture = lecture) {
    const stage = flowStages[nextIndex];
    focusDetail.current = Boolean(stage) && nextIndex !== index;
    setParams({
      ...(inLecture && { mode: 'lecture' }),
      ...(stage && { step: stage.id }),
    });
  }

  function reset() {
    select(-1, false);
    focusHeading(diagramHeading.current);
  }

  return (
    <PresentationSurface>
      <LearningFocusNav missionId="main-m06" active="story">
        <PresentationThemeSelector />
      </LearningFocusNav>
      <main className="b32-flow">
        <header className="b32-flow-heading">
          <div>
            <p className="b32-flow-version">B3-2 · v0.2 검토용</p>
            <h1>Python과 외부 AI의 실행 흐름</h1>
            <p className="b32-flow-description">Git 변경 내용을 설명하는 AI 도우미가 무엇을 보내고 어떤 답을 받는지 살펴봅니다.</p>
          </div>
          <Link className="b32-flow-control" to={storyPath}>강의 소개 <span aria-hidden="true">→</span></Link>
        </header>

        <section className="b32-flow-diagram" aria-labelledby="b32-flow-diagram-title">
          <div className="b32-flow-toolbar">
            <h2 id="b32-flow-diagram-title" tabIndex={-1} ref={diagramHeading}>프로그램 실행 순서</h2>
            <div className="b32-flow-modes" role="group" aria-label="탐색 방식">
              <button className="b32-flow-control" type="button" aria-pressed={!lecture}
                onClick={() => { if (lecture) select(index, false); }}>자유 탐색</button>
              <button className="b32-flow-control" type="button" aria-pressed={lecture}
                onClick={() => { if (!lecture) select(0, true); }}>순서대로 보기</button>
            </div>
          </div>

          <ol className="b32-flow-stages">
            {flowStages.map((stage, position) => (
              <li key={stage.id}>
                <button className="b32-flow-stage" type="button"
                  aria-current={position === index ? 'step' : undefined}
                  aria-controls="b32-flow-detail"
                  disabled={lecture && position !== index}
                  onClick={() => {
                    if (position === index) focusHeading(detailHeading.current);
                    else select(position);
                  }}>
                  <span className="b32-flow-number">{position + 1}</span>
                  {position === index && <span className="b32-flow-current" aria-hidden="true">선택</span>}
                  <span className="b32-flow-stage-title">{stage.title}</span>
                  <span className="b32-flow-stage-roles">
                    {stage.roles.map(role => <span className="b32-flow-role" data-role={role} key={role}>{flowRoles[role]}</span>)}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <details className="b32-flow-exceptions">
            <summary>예외 분기 <span>{flowExceptions.length}개</span></summary>
            <ul>
              {flowExceptions.map(branch => (
                <li key={branch.stageId}>
                  <span>{flowStages.findIndex(stage => stage.id === branch.stageId) + 1}단계</span>
                  <strong>{branch.title}</strong>
                  <p>{branch.result}</p>
                </li>
              ))}
            </ul>
          </details>
        </section>

        <section id="b32-flow-detail" className="b32-flow-detail" aria-labelledby="b32-flow-detail-title">
          {selected ? (
            <>
              <div className="b32-flow-toolbar">
                <h2 id="b32-flow-detail-title" tabIndex={-1} ref={detailHeading}>{index + 1}. {selected.id === 'api' ? 'Python과 외부 AI API가 주고받는 것' : selected.title}</h2>
                <button className="b32-flow-control" type="button" onClick={reset}>↑ 전체 흐름으로</button>
              </div>
              {lecture && (
                <nav className="b32-flow-pagination" aria-label="순서대로 탐색">
                  <button className="b32-flow-control" type="button" disabled={index === 0} onClick={() => select(index - 1)}>← 이전 단계</button>
                  <span>{index + 1} / {flowStages.length}</span>
                  <button className="b32-flow-control" type="button" disabled={index === flowStages.length - 1} onClick={() => select(index + 1)}>다음 단계 →</button>
                </nav>
              )}
              <p className="b32-flow-description">{selected.description}</p>
              {selected.id === 'api' && <ApiExchange />}
              <dl className={`b32-flow-facts${selected.id === 'api' ? ' b32-flow-api-facts' : ''}`}>
                <div><dt>담당 역할</dt><dd>{selected.roles.map(role => flowRoles[role]).join(' · ')}</dd></div>
                {selected.id !== 'api' && <>
                  <div><dt>입력</dt><dd>{selected.input}</dd></div>
                  <div><dt>출력</dt><dd>{selected.output}</dd></div>
                </>}
                <div><dt>소스 코드</dt><dd className="b32-flow-source">{selected.source.map(item => (
                  <a href={item.href} key={item.href} target="_blank" rel="noreferrer"><code>{item.symbol}</code></a>
                ))}</dd></div>
              </dl>
              <nav className="b32-flow-slides" aria-label="연결된 슬라이드">
                {selected.slides.map(id => {
                  const slide = flowSlide(id);
                  return <Link key={id} className="b32-flow-control" to={slide.href}><span>{id}</span> {slide.title} <span aria-hidden="true">→</span></Link>;
                })}
              </nav>
            </>
          ) : (
            <>
              <h2 id="b32-flow-detail-title">단계별 설명</h2>
              <p className="b32-flow-description">상자를 선택하면 입력·출력, 실제 코드와 관련 슬라이드를 볼 수 있습니다.</p>
            </>
          )}
        </section>
      </main>
    </PresentationSurface>
  );
}

function ApiExchange() {
  return <div className="b32-flow-exchange">
    <section aria-labelledby="b32-flow-request-title">
      <h3 id="b32-flow-request-title">요청 · Python → 외부 AI API</h3>
      <dl>
        <div><dt>HTTPS POST</dt><dd><code>Authorization</code> 헤더에 환경변수에서 읽은 API 키를 담습니다.</dd></div>
        <div><dt>JSON 본문</dt><dd><code>model</code>은 모델 ID, <code>messages</code>는 두 메시지입니다.</dd></div>
        <div><dt><code>system</code></dt><dd>초안 작성 규칙</dd></div>
        <div><dt><code>user</code></dt><dd>4단계에서 검사한 Git 변경 문맥</dd></div>
      </dl>
    </section>
    <section aria-labelledby="b32-flow-response-title">
      <h3 id="b32-flow-response-title">응답 · 외부 AI API → Python</h3>
      <dl>
        <div><dt>응답 JSON</dt><dd><code>choices[0].message.content</code>에서 초안 텍스트를 읽습니다.</dd></div>
        <div><dt>다음 단계</dt><dd>꺼낸 글은 6단계에서 검증하고 터미널에 출력합니다.</dd></div>
      </dl>
    </section>
  </div>;
}
