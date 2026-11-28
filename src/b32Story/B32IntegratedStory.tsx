import type { ReactNode } from 'react';
import { defaultUrlTransform } from 'react-markdown';
import Markdown from './B32MarkdownV04';
import { Link } from 'react-router-dom';
import B32Story, { type IndexNavigation } from './B32Story';
import B32Figure from './B32Figure';
import B32LabMarkdown, { CodeBlock } from './B32LabMarkdown';
import B32IntegratedFigures from './B32IntegratedFigures';
import { labHref } from './labContent';
import { integratedLesson } from './lessonV04';
import { figureSources, type EditionLesson, type IntegratedScreen, type StoryReference } from './parseStoryboardV04';
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

function explanation(screen: Pick<IntegratedScreen, 'id' | 'explanation'>, referenceSource: string) {
  return <Markdown
    urlTransform={url => labTarget.test(url) ? url : defaultUrlTransform(url)}
    components={{ a: ({ href, children }) => href ? <ReferenceLink href={href} screen={screen.id}>{children}</ReferenceLink> : <>{children}</> }}>
    {`${screen.explanation}\n\n${referenceSource}`}
  </Markdown>;
}

function header(screen: Pick<IntegratedScreen, 'question' | 'badges'>) {
  return <>
    <Markdown components={{ p: ({ children }) => <p className="b32-integrated-question">{children}</p> }}>{screen.question}</Markdown>
    <ul className="b32-integrated-badges" aria-label="화면 근거">
      {screen.badges.map(badge => <li key={badge} className="b32-lab-badge"><Markdown components={{ p: ({ children }) => <>{children}</> }}>{badge}</Markdown></li>)}
    </ul>
  </>;
}

function body<Id extends string>(screen: EditionLesson<Id>['screens'][number],
  renderDiagram: (id: Id, initial: string, screen: EditionLesson<Id>['screens'][number]) => ReactNode) {
  const { figure, table, practice, result, observation } = screen;
  return <>
    {figure.kind === 'svg' && <B32Figure {...figureSources(figure)}/>}
    {figure.kind === 'interactive' && renderDiagram(figure.id, figure.state, screen)}
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

export function IntegratedStoryView<Id extends string>({ lesson, renderDiagram, roadmap, indexNavigation }: {
  lesson: EditionLesson<Id>;
  renderDiagram: (id: Id, initial: string, screen: EditionLesson<Id>['screens'][number]) => ReactNode;
  roadmap?: ReactNode;
  indexNavigation?: IndexNavigation;
}) {
  return <B32Story
    integrated={{
      lesson, header, indexNavigation,
      body: screen => body(screen, renderDiagram),
      explanation: screen => explanation(screen, lesson.referenceSource),
      guides: screen => references(screen.explanationGuides, screen.id),
      introActions: <>{roadmap}<nav className="b32-integrated-entry" aria-label="실습 자료">
        <Link to={labPath}>Lab 목차</Link>
        <Link to={`${labPath}#결과로-찾아보기`}>결과로 찾아보기</Link>
      </nav></>,
      introOrientation: <>
        <h2>실습으로 확인하기</h2>
        <Markdown>{lesson.intro.practice}</Markdown>
        {!roadmap && <><h2>Scene별 학습 질문과 도달 목표</h2>
        <dl>{Object.values(lesson.scenes).map(scene => <div key={scene.title}>
          <dt>{scene.perspective} · {scene.title}</dt>
          <dd><Markdown>{scene.question}</Markdown><Markdown>{scene.goal}</Markdown></dd>
        </div>)}</dl></>}
      </>,
    }}
    returnNote={(id, _screen, dismiss) => <div className="b32-return-note b32-return-heading">
      <p role="status">Lab {id}에서 돌아왔습니다</p>
      <button type="button" aria-label="복귀 안내 닫기" onClick={dismiss}>닫기</button>
    </div>}
  />;
}

export default function B32IntegratedStory() {
  return <IntegratedStoryView lesson={integratedLesson}
    renderDiagram={(id, initial) => <B32IntegratedFigures id={id} initial={initial}/>}/>;
}
