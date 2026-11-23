import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import { PresentationSurface, PresentationThemeSelector } from '../missionUI/PresentationTheme';
import { intro, storyPath } from './content';
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
            <p className="b32-flow-version">{intro.code} · v0.2 검토용</p>
            <h1>Git 변경에서 AI 초안까지</h1>
            <p className="b32-flow-description">명령을 입력하고, 변경을 읽어, 초안을 활용하기까지.</p>
          </div>
          <Link className="b32-flow-control" to={storyPath}>기존 강의 소개 <span aria-hidden="true">→</span></Link>
        </header>

        <section className="b32-flow-diagram" aria-labelledby="b32-flow-diagram-title">
          <div className="b32-flow-toolbar">
            <h2 id="b32-flow-diagram-title" tabIndex={-1} ref={diagramHeading}>전체 실행 흐름</h2>
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
                <h2 id="b32-flow-detail-title" tabIndex={-1} ref={detailHeading}>{index + 1}. {selected.title}</h2>
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
              <dl className="b32-flow-facts">
                <div><dt>담당 역할</dt><dd>{selected.roles.map(role => flowRoles[role]).join(' · ')}</dd></div>
                <div><dt>입력</dt><dd>{selected.input}</dd></div>
                <div><dt>출력</dt><dd>{selected.output}</dd></div>
                <div><dt>소스 코드</dt><dd className="b32-flow-source">{selected.source.map(item => (
                  <a href={item.href} key={item.href} target="_blank" rel="noreferrer"><code>{item.symbol}</code></a>
                ))}</dd></div>
              </dl>
              <nav className="b32-flow-slides" aria-label="연결된 기존 슬라이드">
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
