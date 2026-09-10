import type { KnowledgeMap, MissionOverlay } from './knowledgeMapTypes';

type LoadedMap = { graph: KnowledgeMap; overlays: MissionOverlay[] };
const loaders: Record<string, () => Promise<LoadedMap>> = {
  frontend: async () => ({ graph: (await import('./data/generated/frontend-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/frontend-overlay-main-m01.json')).default as MissionOverlay, (await import('./data/generated/frontend-overlay-main-m02.json')).default as MissionOverlay] }),
  'git-collaboration': async () => ({ graph: (await import('./data/generated/git-collaboration-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/git-collaboration-overlay-main-m04.json')).default as MissionOverlay] }),
  'data-database': async () => ({ graph: (await import('./data/generated/data-database-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/data-database-overlay-main-m11.json')).default as MissionOverlay] }),
  'linux-runtime': async () => ({ graph: (await import('./data/generated/linux-runtime-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/linux-runtime-overlay-main-m07.json')).default as MissionOverlay, (await import('./data/generated/linux-runtime-overlay-main-m08.json')).default as MissionOverlay] }),
  'devops-infrastructure': async () => ({ graph: (await import('./data/generated/devops-infrastructure-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/devops-infrastructure-overlay-preliminary-m01.json')).default as MissionOverlay] }),
  'network-web-protocol': async () => ({ graph: (await import('./data/generated/network-web-protocol-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/network-web-protocol-overlay-main-m05.json')).default as MissionOverlay] }),
  'backend-server-api': async () => ({ graph: (await import('./data/generated/backend-server-api-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/backend-server-api-overlay-main-m12.json')).default as MissionOverlay] }),
  'security-identity': async () => ({ graph: (await import('./data/generated/security-identity-knowledge-map.json')).default as KnowledgeMap, overlays: [(await import('./data/generated/security-identity-overlay-main-m13.json')).default as MissionOverlay] })
};

export function loadKnowledgeMap(mapId: string) { return loaders[mapId]?.(); }
