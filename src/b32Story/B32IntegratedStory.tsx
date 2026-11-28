import type { ReactNode } from 'react';
import { defaultUrlTransform } from 'react-markdown';
import Markdown from './B32MarkdownV04';
import { Link } from 'react-router-dom';
import B32Story from './B32Story';
import B32Figure from './B32Figure';
import B32LabMarkdown, { CodeBlock } from './B32LabMarkdown';
import B32IntegratedFigures from './B32IntegratedFigures';
import { labHref } from './labContent';
import { integratedLesson } from './lessonV04';
import { figureSources, type IntegratedScreen, type StoryReference } from './parseStoryboardV04';
import { labPath } from './reviewMode';
import './b32Cycle.css';
import './b32Lab.css';
import './b32Integrated.css';

const labTarget = /^lab:(0[1-9])$/;

function ReferenceLink({ href, screen, children }: { href: string; screen: string; children: ReactNode }) {
  const lab = labTarget.exec(href)?.[1];
  return lab ? <Link to={labHref(lab, screen)}>{children}</Link>
    : <a href={href} target="_blank" rel="noreferrer">{children} ↗</a>;
}

function references(items: StoryReference[], screen: string) {
  return items.map(({ href, label }) => <ReferenceLink key={`${href}:${label}`} href={href} screen={screen}>{label}</ReferenceLink>);
}

function explanation(screen: IntegratedScreen) {
  return <Markdown
    urlTransform={url => labTarget.test(url) ? url : defaultUrlTransform(url)}
    components={{ a: ({ href, children }) => href ? <ReferenceLink href={href} screen={screen.id}>{children}</ReferenceLink> : <>{children}</> }}>
    {`${screen.explanation}\n\n${integratedLesson.referenceSource}`}
  </Markdown>;
}

function header(screen: IntegratedScreen) {
  return <>
    <Markdown components={{ p: ({ children }) => <p className="b32-integrated-question">{children}</p> }}>{screen.question}</Markdown>
    <ul className="b32-integrated-badges" aria-label="화면 근거">
      {screen.badges.map(badge => <li key={badge} className="b32-lab-badge"><Markdown components={{ p: ({ children }) => <>{children}</> }}>{badge}</Markdown></li>)}
    </ul>
  </>;
}

function body(screen: IntegratedScreen) {
  const { figure, table, practice, result, observation } = screen;
  return <>
    {figure.kind === 'svg' && <B32Figure {...figureSources(figure)}/>}
    {figure.kind === 'interactive' && <B32IntegratedFigures id={figure.id} initial={figure.state}/>}
    {table && <B32LabMarkdown integrated text={table}/>}
    {(practice || result || observation) && <section className="b32-integrated-practice" aria-label={practice ? '함께 실습' : '실습 결과'}>
      {practice && <>
        <h2>함께 실습</h2><Markdown>{practice.title}</Markdown>
        <CodeBlock text={practice.command} kind="bash" record="" sends={false} politeCopyFeedback/>
        {practice.notes && <Markdown>{practice.notes}</Markdown>}
      </>}
      {result && <CodeBlock text={result.output} kind="text" record={`실습 결과 · ${result.badge}`} sends={false}/>}
      {observation && <div><h3>관찰 질문</h3><Markdown>{observation}</Markdown></div>}
    </section>}
  </>;
}

export default function B32IntegratedStory() {
  return <B32Story
    integrated={{
      lesson: integratedLesson,
      header, body, explanation,
      guides: screen => references(screen.explanationGuides, screen.id),
      introActions: <nav className="b32-integrated-entry" aria-label="실습 자료">
        <Link to={labPath}>Lab 목차</Link>
        <Link to={`${labPath}#결과로-찾아보기`}>결과로 찾아보기</Link>
      </nav>,
      introOrientation: <>
        <h2>실습으로 확인하기</h2>
        <Markdown>{integratedLesson.intro.practice}</Markdown>
        <h2>Scene별 학습 질문과 도달 목표</h2>
        <dl>{Object.values(integratedLesson.scenes).map(scene => <div key={scene.title}>
          <dt>{scene.perspective} · {scene.title}</dt>
          <dd><Markdown>{scene.question}</Markdown><Markdown>{scene.goal}</Markdown></dd>
        </div>)}</dl>
      </>,
    }}
    returnNote={(id, _screen, dismiss) => <div className="b32-return-note b32-return-heading">
      <p role="status">Lab {id}에서 돌아왔습니다</p>
      <button type="button" aria-label="복귀 안내 닫기" onClick={dismiss}>닫기</button>
    </div>}
  />;
}
