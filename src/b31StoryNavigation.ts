export const b31StoryPath = '/missions/main-M05/story-map';
export const b31ConceptPath = `${b31StoryPath}/concepts`;
export const b31SceneIds = ['scene-01', 'scene-02', 'scene-03a', 'scene-03b', 'scene-04'] as const;
export type B31SceneId = typeof b31SceneIds[number];
export const b31IntroSlideIds = ['slide-intro', 'slide-network', 'slide-packet'] as const;
export type B31LectureId = B31SceneId | typeof b31IntroSlideIds[number];

export function sceneLabel(id: B31LectureId) {
  if (id === 'slide-intro') return 'Slide 1';
  if (id === 'slide-network') return 'Slide 2';
  if (id === 'slide-packet') return 'Slide 3';
  return `Scene ${id.slice(6).replace(/^03([ab])$/, '03-$1').toUpperCase()}`;
}

export function storyScene(value: string | null): B31LectureId | null {
  return [...b31IntroSlideIds, ...b31SceneIds].find(id => id === value) ?? null;
}

// Only map state can travel with a lesson. Destinations are always local routes.
export function mapQuery(value: string) {
  const input = new URLSearchParams(value), output = new URLSearchParams();
  for (const key of ['view', 'more', 'node', 'rel', 'flow', 'scene']) {
    const item = input.get(key);
    if (item && item.length <= 120 && (key !== 'scene' || storyScene(item))) output.set(key, item);
  }
  return output.toString();
}

export function storyHref(scene: B31LectureId, returnMap?: string) {
  const params = new URLSearchParams({ scene });
  if (returnMap !== undefined) params.set('map', mapQuery(returnMap));
  return `${b31StoryPath}?${params}`;
}

export function conceptHref(query = '', scene?: B31LectureId) {
  const params = new URLSearchParams(mapQuery(query));
  if (scene) params.set('scene', scene);
  return `${b31ConceptPath}${params.size ? `?${params}` : ''}`;
}
