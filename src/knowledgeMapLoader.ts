import type { KnowledgeMap, MissionOverlay } from './knowledgeMapTypes';

type LoadedMap = { graph: KnowledgeMap; overlays: MissionOverlay[] };
const loaders: Record<string, () => Promise<LoadedMap>> = {
  frontend: async () => ({ graph: (await import('./data/generated/frontend-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/frontend-overlay-main-m01.json')).default as MissionOverlay, (await import('./data/generated/frontend-overlay-main-m02.json')).default as MissionOverlay] }),
  'git-collaboration': async () => ({ graph: (await import('./data/generated/git-collaboration-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/git-collaboration-overlay-main-m04.json')).default as MissionOverlay] }),
  'data-database': async () => ({ graph: (await import('./data/generated/data-database-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/data-database-overlay-main-m11.json')).default as MissionOverlay] })
};

export function loadKnowledgeMap(mapId: string) { return loaders[mapId]?.(); }
