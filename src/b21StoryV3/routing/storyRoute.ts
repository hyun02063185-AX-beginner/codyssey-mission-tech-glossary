import { scenes } from '../content';
export const storyPath = '/missions/main-M03/story';
export interface Position { scene: number; step: number }
export interface StoryRoute extends Position { back: number | null; presenter: boolean }
export function routeURL(route: StoryRoute): string {
  const scene = scenes[route.scene];
  const query = new URLSearchParams({scene: scene.id, step: scene.addressing === 'id' ? scene.steps[route.step].id : String(route.step + 1)});
  if (route.back !== null && route.scene !== 7) query.set('back', String(route.back));
  if (route.presenter) query.set('view', 'presenter');
  return `${storyPath}?${query}`;
}
/** Only local scene/step/back tokens survive; never accepts a return URL. */
export function resolveStoryRoute(pathname: string, search: string) {
  const query = new URLSearchParams(search.slice(0, 513));
  const sceneIndex = scenes.findIndex(s => s.id === query.get('scene'));
  const scene = sceneIndex < 0 ? 0 : sceneIndex;
  const definition = scenes[scene], token = query.get('step');
  let step = 0;
  if (definition.addressing === 'id') {
    const id = token && /^\d+$/.test(token) ? definition.legacy?.[Number(token) - 1] : token;
    step = definition.steps.findIndex(s => s.id === id);
  } else if (token && /^\d+$/.test(token)) step = Number(token) - 1;
  else step = -1;
  const validStep = Number.isSafeInteger(step) && step >= 0 && step < definition.steps.length;
  const backToken = query.get('back');
  const back = backToken && /^[1-9]\d*$/.test(backToken) && Number(backToken) <= scenes[7].steps.length && scene !== 7 ? Number(backToken) : null;
  const route: StoryRoute = {scene, step: validStep ? step : 0, back, presenter: query.get('view') === 'presenter'};
  const canonical = routeURL(route);
  const changed = pathname + search !== canonical;
  const invalid = pathname !== storyPath || (query.has('scene') && sceneIndex < 0) || (query.has('step') && !validStep) || (query.has('back') && back === null) || search.length > 513 || [...query.keys()].some(k => !['scene','step','back','view'].includes(k) || query.getAll(k).length > 1) || (query.has('view') && !route.presenter);
  return {route, canonical, changed, notice: invalid ? '잘못된 강의 주소를 복구했습니다. 유효한 장면을 유지하고 단계·복귀 위치를 확인했습니다.' : ''};
}
export function adjacent(position: Position, delta: number): Position {
  let {scene, step} = position; step += delta;
  if (step < 0) {scene--; step = scenes[scene]?.steps.length - 1;}
  else if (step >= scenes[scene].steps.length) {scene++; step = 0;}
  return scenes[scene]?.steps[step] ? {scene, step} : position;
}
