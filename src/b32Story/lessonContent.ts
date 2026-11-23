import source from '../../content/mission-stories/main-m06/_tools/screens.json';
import storyboard from '../../content/mission-stories/main-m06/storyboard-v0.2.md?raw';
import { lessonFromStoryboard } from '../../content/mission-stories/main-m06/_tools/storyboard-v02.mjs';

export const { intro, scenes, screens } = lessonFromStoryboard(source, storyboard);
