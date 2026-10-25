import type { ReactNode } from 'react';
import type { ConceptMapSlotContext, LoadedStory } from '../content/storyTypes';
import StoryMarkdown, { sourceUrl, type StoryNavigation } from './StoryMarkdown';
import StoryFigure from './StoryFigure';
import StoryInstructorNotes from './StoryInstructorNotes';
import StoryCheckQuestions from './StoryCheckQuestions';
export type ConceptMapSlot = (context: ConceptMapSlotContext) => ReactNode;
export default function StoryScene({ story, onNavigate, conceptMapSlot }: { story: LoadedStory; onNavigate?: StoryNavigation; conceptMapSlot?: ConceptMapSlot }) {
  return <article className="b21-story-scene" data-scene-id={story.id} aria-labelledby={`${story.id}-title`}>
    <header><p>{story.label} · {story.position}/9</p><h1 id={`${story.id}-title`} tabIndex={-1}>{story.title}</h1><p className="b21-story-question">{story.question}</p></header>
    <dl className="b21-story-scope">{story.teachingMetadata.map(row => <div key={row.label}><dt>{row.label}</dt><dd><StoryMarkdown story={story} area={{ markdown: row.markdown, ast: row.ast, headings: [], codeBlocks: [] }} onNavigate={onNavigate} /></dd></div>)}</dl>
    <StoryFigure key={story.id} story={story} />
    {story.conceptMap && <section className="b21-story-map-slot" aria-label="개념지도" data-candidate-source={story.conceptMap.candidatePath}>
      {conceptMapSlot ? conceptMapSlot(story.conceptMap) : <p>현재는 원고와 활동을 읽을 수 있습니다. 개념지도 탐색은 준비 중입니다.</p>}
    </section>}
    <section aria-labelledby={story.areas.learner.sectionId}><h2 id={story.areas.learner.sectionId} tabIndex={-1}>{story.areas.learner.title}</h2><StoryMarkdown story={story} area={story.areas.learner} onNavigate={onNavigate} /></section>
    <StoryInstructorNotes story={story} onNavigate={onNavigate} />
    <StoryCheckQuestions story={story} onNavigate={onNavigate} />
    <section aria-labelledby={story.areas.sources.sectionId}><h2 id={story.areas.sources.sectionId} tabIndex={-1}>{story.areas.sources.title}</h2><StoryMarkdown story={story} area={story.areas.sources} onNavigate={onNavigate} /></section>
    <details className="b21-story-provenance"><summary>원문과 콘텐츠 기준</summary><p><a href={sourceUrl(story, story.sourcePath)}>기준 원고</a> · <a href={sourceUrl(story, story.contentStatus.reviewRecord)}>검토·승인 기록</a></p></details>
    {onNavigate && <nav aria-label="이전 다음 장면">
      {story.previous ? <button type="button" onClick={() => onNavigate(story.previous!)}>← 이전 장면</button> : <span>첫 장면입니다.</span>}
      {story.next ? <button type="button" onClick={() => onNavigate(story.next!)}>다음 장면 →</button> : <span>마지막 장면입니다. 내 코드 설명을 마무리해 보세요.</span>}
    </nav>}
  </article>;
}
