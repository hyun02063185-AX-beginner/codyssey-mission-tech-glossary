import type { LoadedStory } from '../content/storyTypes';
import StoryMarkdown, { type StoryNavigation } from './StoryMarkdown';
export default function StoryInstructorNotes({ story, onNavigate }: { story: LoadedStory; onNavigate?: StoryNavigation }) {
  const area = story.areas.instructor;
  return <details className="b21-story-instructor"><summary id={area.sectionId}>강사용 안내 펼치기</summary><StoryMarkdown story={story} area={area} onNavigate={onNavigate} /></details>;
}
