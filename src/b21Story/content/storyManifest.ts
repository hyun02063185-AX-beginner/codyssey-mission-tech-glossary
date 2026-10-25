import snapshot from './storyIntegrity.json';
import { sceneOrder, type SceneId, type StoryDefinition } from './storyTypes';
export { sceneOrder };
export const sourceRevision = snapshot.sourceRevision;
export const storyManifest: readonly StoryDefinition[] = snapshot.scenes as StoryDefinition[];
export function validateManifest(entries: readonly StoryDefinition[] = storyManifest) {
  if (entries.length !== sceneOrder.length || entries.some((e, i) => e.id !== sceneOrder[i])) throw new Error('B21 scene order/membership changed');
  const ids = entries.flatMap(e => e.sections.map(s => s.id));
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate B21 section ID');
  for (const entry of entries) {
    if (!/^[a-f\d]{64}$/.test(entry.sha256)) throw new Error(`Missing source hash: ${entry.id}`);
    if ((entry.id === 'scene-08') !== (entry.art === null)) throw new Error(`Invalid B21 figure: ${entry.id}`);
  }
}
validateManifest();
export function storyDefinition(id: SceneId): StoryDefinition {
  const definition = storyManifest.find(item => item.id === id);
  if (!definition) throw new Error(`Unknown B21 scene: ${id}`);
  return definition;
}
export function sceneNeighbours(id: SceneId) {
  const i = sceneOrder.indexOf(id);
  if (i < 0) throw new Error(`Unknown B21 scene: ${id}`);
  return { position: i + 1, previous: sceneOrder[i - 1] ?? null, next: sceneOrder[i + 1] ?? null };
}
