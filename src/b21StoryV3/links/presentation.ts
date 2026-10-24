import { lectureAreas, scenes } from '../content';
import { termConnections } from './catalog';
import type { StoryRoute } from '../routing/storyRoute';

// Selected-area semantics are narrower than U4-A's scene-wide comparison panel.
export const areaTermIds: Readonly<Record<string, readonly string[]>> = {
  't-exec':['cli'],
  't-struct':['module','repository-pattern','layered-architecture'],
  't-crud':['crud','summary-aggregation'],
  't-store':['persistence','file-io','json-lines','csv'],
  't-gen':['iterator','generator','yield'],
  't-deco':['decorator','function','exception-handling'],
  't-valid':['type-hint','input-validation'],
};
export function learningPresentation(route: StoryRoute) {
  const scene=scenes[route.scene];
  const area=route.scene===7 && route.step>=1 && route.step<=7 ? lectureAreas[route.step-1] : null;
  const areaTerms=area ? termConnections.filter(term=>areaTermIds[area.id].includes(term.termId)) : [];
  const noteTerms=route.scene===7 ? areaTerms : termConnections.filter(term=>term.sources.some(source=>source.scene===scene.id));
  return {scene,area,areaTerms,noteTerms,isSummary:route.step===scene.steps.length-1};
}
