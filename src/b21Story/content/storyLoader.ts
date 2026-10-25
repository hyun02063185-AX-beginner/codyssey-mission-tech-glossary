import { parseStory } from './parseStory';
import { sceneOrder, sourceRevision, storyDefinition, storyManifest, sceneNeighbours } from './storyManifest';
import type { AssetDefinition, LoadedAsset, LoadedStory, SceneId } from './storyTypes';
const sources = import.meta.glob<string>('../../../drafts/b2-1-story-map/scene-*/script.md', { query: '?raw', import: 'default' });
const rawArt = import.meta.glob<string>('../../../drafts/b2-1-story-map/scene-*/*-{desktop,mobile}.svg', { query: '?raw', import: 'default' });
const artUrls = import.meta.glob<string>('../../../drafts/b2-1-story-map/scene-*/*-{desktop,mobile}.svg', { query: '?url&no-inline', import: 'default' });
const key = (path: string) => `../../../${path}`;
export function validateCatalog(sourceKeys = Object.keys(sources), assetKeys = Object.keys(rawArt), urlKeys = Object.keys(artUrls)) {
  const expectedSources = storyManifest.map(s => key(s.sourcePath)).sort();
  const expectedAssets = storyManifest.flatMap(s => s.art ? [key(s.art.desktop.sourcePath), key(s.art.mobile.sourcePath)] : []).sort();
  if (JSON.stringify([...sourceKeys].sort()) !== JSON.stringify(expectedSources)) throw new Error('Missing or unexpected B21 source file');
  if ([assetKeys, urlKeys].some(keys => JSON.stringify([...keys].sort()) !== JSON.stringify(expectedAssets))) throw new Error('Missing or unexpected B21 SVG file');
}
export async function verifyTextIntegrity(text: string, sha256: string, name: string) {
  const hash = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text.replace(/\r\n/g, '\n')));
  const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
  if (hex !== sha256) throw new Error(`B21 integrity mismatch: ${name}`);
}
async function loadAsset(asset: AssetDefinition): Promise<LoadedAsset> {
  const [raw, url] = await Promise.all([rawArt[key(asset.sourcePath)](), artUrls[key(asset.sourcePath)]()]);
  await verifyTextIntegrity(raw, asset.sha256, asset.sourcePath);
  return { ...asset, url };
}
export async function loadStory(id: SceneId): Promise<LoadedStory> {
  validateCatalog();
  const definition = storyDefinition(id), markdown = await sources[key(definition.sourcePath)]();
  await verifyTextIntegrity(markdown, definition.sha256, definition.sourcePath);
  const parsed = parseStory(markdown, definition);
  const assets = definition.art ? await Promise.all([loadAsset(definition.art.desktop), loadAsset(definition.art.mobile)]) : null;
  return { ...definition, ...parsed, ...sceneNeighbours(id), sourceRevision,
    contentStatus: { source: 'review-draft', publication: 'not-connected', reviewRecord: 'drafts/b2-1-story-map/handover.md' },
    assets: assets ? { desktop: assets[0], mobile: assets[1] } : null,
    conceptMap: id === 'scene-08' ? { sceneId: id, candidatePath: 'drafts/b2-1-story-map/scene-08/candidate-map.json', status: 'pending-integration' } : null };
}
export async function loadStoryManifest(): Promise<LoadedStory[]> { return Promise.all(sceneOrder.map(loadStory)); }
