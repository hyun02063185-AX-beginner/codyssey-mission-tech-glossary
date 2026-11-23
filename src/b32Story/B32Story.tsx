import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import LearningFocusNav from '../missionUI/LearningFocusNav';
import MissionStoryOverview from '../missionUI/MissionStoryOverview';
import { PresentationSurface, PresentationThemeSelector } from '../missionUI/PresentationTheme';
import { storyPath, screenHref, readStoryState, authoredScreen, introNotes, demoNotes, guideLinks } from './content';
import { intro, scenes, screens } from './lessonContent';
import B32Figure from './B32Figure';
import './b32Story.css';

const sceneLinks = Object.entries(scenes).map(([id, scene]) => ({
  id, label: `Scene ${id}`, title: scene.title, href: screenHref(screens.findIndex(screen => screen.scene === id)),
}));
const explanationId = 'b32-slide-explanation';

export default function B32Story() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = readStoryState(location.search);
  const screen = screens[state.index];
  const authored = authoredScreen(screen.id);
  const activeScreen = state.overview ? null : screen.id;
  const previousScreen = useRef<string | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const explanation = useRef<HTMLElement>(null);
  const explanationHeading = useRef<HTMLHeadingElement>(null);
  const explanationButton = useRef<HTMLButtonElement>(null);
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.notice) setNotice(state.notice);
    if (!state.overview && location.pathname + location.search !== state.canonical) {
      navigate(state.canonical, { replace: true });
    }
  }, [state.notice, state.overview, state.canonical, location.pathname, location.search, navigate]);

  useEffect(() => {
    document.title = state.overview ? `B3-2 · ${intro.title}` : `${screen.id} · ${screen.title}`;
    return () => { document.title = '코디세이 기술용어 사전'; };
  }, [state.overview, screen.id, screen.title]);

  useLayoutEffect(() => {
    const moved = previousScreen.current !== activeScreen;
    previousScreen.current = activeScreen;
    if (!activeScreen) {
      setOpen(false);
    } else if (open) {
      explanationHeading.current?.focus({ preventScroll: true });
      explanation.current?.scrollIntoView({ block: 'end' });
    } else if (moved) {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo(0, 0);
    }
  }, [activeScreen, open]);

  const closeExplanation = useCallback(() => {
    setOpen(false);
    explanationButton.current?.focus();
  }, []);

  useEffect(() => {
    if (state.overview) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const shortcut = event.key.toLowerCase() === 'p';
      if (shortcut && target instanceof HTMLElement && target.closest('input,textarea,select,[contenteditable]:not([contenteditable=false]),dialog')) return;
      if (shortcut || (open && event.key === 'Escape')) {
        event.preventDefault();
        if (open) closeExplanation();
        else setOpen(true);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.overview, open, closeExplanation]);

  if (state.overview) return <>
    <LearningFocusNav missionId="main-m06" active="story" />
    <MissionStoryOverview missionCode={intro.code} title={intro.title} subtitle={intro.subtitle} question={intro.question}
      scenes={sceneLinks} orientation={<>
        <p>{intro.draftDefinition}</p>
        <ol>{intro.goals.map(goal => <li key={goal}>{goal}</li>)}</ol>
        <PresentationSurface><div className="b32-intro-figure"><B32Figure desktop={intro.desktop} mobile={intro.mobile} /></div></PresentationSurface>
        <details><summary>발표자 노트 · 시작</summary><Markdown>{introNotes}</Markdown></details>
      </>} />
  </>;

  function move(index: number) {
    if (screens[index]) navigate(screenHref(index));
  }

  function handleSlideKeys(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (event.altKey || event.ctrlKey || event.metaKey || event.isDefaultPrevented() ||
        target.closest('button,a,select,input,textarea,summary,.b32-explanation-body')) return;
    if (['ArrowRight', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      move(state.index + 1);
    }
    if (['ArrowLeft', 'PageUp'].includes(event.key)) {
      event.preventDefault();
      move(state.index - 1);
    }
  }

  return <PresentationSurface>
    <div className="b32-story">
      <LearningFocusNav missionId="main-m06" active="story" storyHref={screenHref(state.index)}>
        <Link to={storyPath}>강의 소개 보기</Link>
        <PresentationThemeSelector />
      </LearningFocusNav>

      <div className="b32-deck" onKeyDown={handleSlideKeys}>
        <article className="b32-lesson" data-screen={screen.id} aria-labelledby="b32-message">
          {notice && <p role="status">{notice} <button onClick={() => setNotice('')}>안내 닫기</button></p>}
          <header className="b32-heading">
            <div className="b32-heading-top">
              <div className="b32-slide-meta">
                <p className="b32-slide-title">{screen.id} · {screen.title}</p>
                <p className="b32-technology" aria-label="현재 학습 기술">{screen.technology}</p>
              </div>
              <nav className="b32-controls b32-top-controls" aria-label="슬라이드 상단 탐색">
                <button type="button" ref={explanationButton} aria-expanded={open} aria-controls={explanationId}
                  aria-keyshortcuts="P" onClick={() => open ? closeExplanation() : setOpen(true)}>
                  {open ? '설명 닫기' : '설명 보기'} <kbd aria-hidden="true">P</kbd>
                </button>
                <button disabled={!state.index} onClick={() => move(state.index - 1)}>이전</button>
                <span aria-label="현재 슬라이드">{state.index + 1} / {screens.length}</span>
                <button disabled={state.index === screens.length - 1} onClick={() => move(state.index + 1)}>다음</button>
              </nav>
            </div>
            <h1 id="b32-message" tabIndex={-1} ref={heading}>{screen.message}</h1>
            <Markdown components={{ p: ({ children }) => <p className="b32-caption">{children}</p> }}>{screen.caption}</Markdown>
          </header>
          <B32Figure journey desktop={['f0-journey-v02-desktop.svg', screen.journey]} mobile={['f0-journey-v02-mobile.svg', screen.journey]} />
          <B32Figure desktop={screen.desktop} mobile={screen.mobile} />
          <nav className="b32-controls" aria-label="B3-2 강의 조작">
            <label>Scene <select aria-label="Scene 선택" value={screen.scene}
              onChange={event => move(screens.findIndex(item => item.scene === event.target.value))}>
              {Object.entries(scenes).map(([id, item]) => <option key={id} value={id}>{id} · {item.title}</option>)}
            </select></label>
            <span>{state.index + 1} / {screens.length}</span>
            <button disabled={!state.index} onClick={() => move(state.index - 1)}>이전</button>
            <button disabled={state.index === screens.length - 1} onClick={() => move(state.index + 1)}>다음</button>
          </nav>
        </article>

        <section className="b32-explanation" id={explanationId} ref={explanation} hidden={!open}
          aria-labelledby="b32-explanation-title">
          <div className="b32-explanation-header">
            <div>
              <p>화면 해설 · {screen.id}</p>
              <h2 id="b32-explanation-title" ref={explanationHeading} tabIndex={-1}>{screen.title}</h2>
            </div>
            <button type="button" aria-label="화면 해설 닫기" onClick={closeExplanation}>닫기</button>
          </div>
          <div className="b32-explanation-body" key={screen.id} tabIndex={0} role="region" aria-label="해설 본문">
            <Markdown>{screen.explanation}</Markdown>
            <div className="b32-explanation-guides">
              {screen.explanationGuides.map(guide => <a key={guide.href} href={guide.href} target="_blank" rel="noreferrer">{guide.label} ↗</a>)}
            </div>
          </div>
        </section>
      </div>

      <div className="b32-review" key={screen.id}>
        <details><summary>학습자 접힘 설명 · 이해 확인</summary><Markdown>{authored.explanation}</Markdown><Markdown>{authored.check}</Markdown></details>
        {authored.output && <details><summary>실제 COMMIT·PR 출력 전문</summary><Markdown remarkPlugins={[remarkGfm]}>{authored.output}</Markdown></details>}
        <details><summary>발표자 노트 · 강사 스크립트</summary><p>학습 질문: {screen.question}</p>
          <Markdown urlTransform={url => url === 'review.md' ? 'https://github.com/hyun02063185-AX-beginner/codyssey-mission-tech-glossary/blob/264cb6983974a6bfafe143e805249716771e6ec3/content/mission-stories/main-m06/review.md' : url}>{authored.notes}</Markdown>
          {authored.output && <Markdown>{authored.output}</Markdown>}
        </details>
        <details><summary>실제 시연 · 발표자 노트</summary><Markdown>{demoNotes}</Markdown></details>
        <details><summary>관련 용어사전 · 학습가이드</summary><p>개념지도 준비 중 · 미제공</p>
          <div className="b32-links">
            {screen.terms.map(id => <Link key={id} to={`/terms/${id}?b32-story=${encodeURIComponent(screenHref(state.index).split('?')[1])}`}>{id} · 용어사전</Link>)}
            {screen.guide.map(chapter => <a key={chapter} href={guideLinks[chapter]} target="_blank" rel="noreferrer">{chapter} 학습가이드 ↗</a>)}
          </div>
        </details>
      </div>
    </div>
  </PresentationSurface>;
}
