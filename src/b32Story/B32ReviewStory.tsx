import B32Story from './B32Story';
import { reviewLesson } from './reviewLessonContent';
import { readStoryReturn } from './labContent';
import { PracticeLinks, StoryReturnNote, StoryDraftRecords } from './B32CycleLinks';

export default function B32ReviewStory() {
  return <B32Story
    lesson={reviewLesson}
    readReturn={readStoryReturn}
    practice={(screen, copy) => <PracticeLinks screen={screen} copy={copy} />}
    returnNote={(id, screen, dismiss) => <StoryReturnNote id={id} screen={screen} dismiss={dismiss} />}
    drafts={previous => <StoryDraftRecords previous={previous} />}
  />;
}
