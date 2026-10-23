import type { LoadedStory } from '../content/storyTypes';
import StoryMarkdown, { type StoryNavigation } from './StoryMarkdown';
export default function StoryCheckQuestions({ story, onNavigate }: { story: LoadedStory; onNavigate?: StoryNavigation }) {
  const area = story.areas.checks;
  return <section aria-labelledby={area.sectionId}><h2 id={area.sectionId} tabIndex={-1}>{area.title}</h2><StoryMarkdown story={story} area={area} onNavigate={onNavigate} /></section>;
}
