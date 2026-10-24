import { scenes, lectureAreas } from '../content';
import { missionGuidePaths } from '../../missionLearning';
import { termConnections, guideConnections, fieldMapConnections } from './catalog';
import { parseStorySource, storySource, termStoryHref } from './returnAddress';
import type { StoryRoute } from '../routing/storyRoute';

export function connectionsForSource(input: StoryRoute) {
  const source=parseStorySource(storySource(input))!;
  const scene=scenes[source.scene];
  const area=source.scene===7 ? lectureAreas[source.step-1] : undefined;
  const terms=termConnections.filter(term=>source.scene===7&&!area || term.sources.some(anchor=>anchor.scene===(area?.scene??scene.id)));
  return {
    terms:terms.map(term=>({...term,from:{scene:scene.id,step:scene.addressing==='id'?scene.steps[source.step].id:String(source.step+1)},returnTo:storySource(source),href:termStoryHref(term.termId,source)})),
    guides:guideConnections[scene.id].map(chapter=>({chapter,href:`${missionGuidePaths['main-m03']}/${chapter}`})),
    maps:fieldMapConnections.filter(link=>link.scene===scene.id),
  };
}
