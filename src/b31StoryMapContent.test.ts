import { describe, expect, it } from 'vitest';
import { b31StoryScenes } from './b31StoryMapContent';
import { b31SceneIds, conceptHref, mapQuery, storyHref, storyScene } from './b31StoryNavigation';
import source from '../data/mission-story-maps/main-m05/concept-map.json';

describe('B3-1 story content and learning context', () => {
  it('only highlights scene references present in the approved map', () => {
    expect(b31StoryScenes.map(scene => scene.id)).toEqual([...b31SceneIds]);
    expect(source.nodes).toHaveLength(44);
    expect(source.relations).toHaveLength(67);
    for (const scene of b31StoryScenes.filter(item => item.id !== 'scene-04')) {
      for (const query of [scene.map, ...scene.concepts.map(item => item.query)]) {
        const params = new URLSearchParams(query);
        const item = params.has('node') ? source.nodes.find(node => node.id === params.get('node'))
          : source.relations.find(relation => relation.id === (params.get('rel') ?? params.get('flow')));
        expect(item, `${scene.id} ${query}`).toBeDefined();
        expect(item!.storyScenes).toContain(scene.id);
      }
    }
  });

  it('keeps node, relationship, flow, view and supplementary state across scene and glossary detours', () => {
    for (const selected of ['node=gen%3Afirewall', 'rel=GN14', 'flow=GF02']) {
      const query = `view=general&more=1&${selected}&scene=scene-02`;
      const story = new URL(storyHref('scene-03a', query), 'http://localhost');
      expect(story.searchParams.get('map')).toBe(query);
      expect(conceptHref(story.searchParams.get('map')!).endsWith(query)).toBe(true);
    }
    expect(storyHref('scene-01', '')).toContain('map=');
  });

  it('restricts context links to local known routes and discards unrelated query parameters', () => {
    expect(mapQuery('view=aws&scene=bad&redirect=https://example.com')).toBe('view=aws');
    expect(conceptHref('https://example.com')).toBe('/missions/main-M05/story-map/concepts');
    expect(storyScene('scene-03a')).toBe('scene-03a');
    expect(storyScene('../bad')).toBeNull();
  });
});
