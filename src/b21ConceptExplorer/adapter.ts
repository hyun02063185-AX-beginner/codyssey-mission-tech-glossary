import candidate from '../../drafts/b2-1-story-map/scene-08/candidate-map.json';
import { adaptConceptMap, layoutConceptMap } from '../missionConceptMap/conceptMapAdapter';
import type { ConceptMapData } from '../missionConceptMap/conceptMapTypes';
import { termConnections } from '../b21StoryV3/links/catalog';
import { lectureAreas, relationReviews, comparisonReviews, type ReviewLink } from '../b21StoryV3/content';

// Read-only projection. v2 sceneIds and draft glossary routeStatus are never navigation.
export const explorerData = candidate;
export type ExplorerNode = typeof candidate.nodes[number];
export type ExplorerRelation = typeof candidate.relations[number];
export const nodeById = new Map(candidate.nodes.map(node => [node.id, node]));
export const typeMeanings: Readonly<Record<string, string>> = {
  '포함': '한 개념이 다른 개념을 안에 담습니다.',
  '종류': '한 개념이 다른 개념의 한 종류입니다.',
  '사용': '한 개념이 일을 하려고 다른 개념을 씁니다.',
  '역할': '한 개념이 맡는 일이나 뜻을 나타냅니다.',
  '호출': '특정 사례에서 한 함수나 역할이 다른 함수를 부릅니다. 전체 실행 순서는 아닙니다.',
};

/** B3-1 engine is used ONLY for geometry. The neutral edge type is never rendered.
 * B2-1's original five types, labels and scopes are rendered from candidate below.
 * No B3-1 component, data, type contract or stylesheet needs modification.
 */
const geometry: ConceptMapData = {
  mapId: 'b21-private-geometry', title: '', question: '',
  nodes: candidate.nodes.map((node, order) => ({
    id: node.id, label: node.label, region: node.area, order, domain: 'common',
    importance: 'core', conceptType: '', implementationStatus: '', summary: '', description: '', termIds: [], storyScenes: [],
  })),
  relations: candidate.relations.map(rel => ({
    id: rel.id, from: rel.from, to: rel.to, type: '연관', scope: 'geometry',
    importance: 'core', label: '', description: '', source: [], storyScenes: [],
  })),
  regions: candidate.areas.map((area, order) => ({id: area.id, label: area.label, description: '', domain: 'common', order})),
  views: [{id: 'all', label: '', nodeDomains: ['common'], relationScopes: ['geometry'], initialImportance: ['core'], description: ''}],
  contrasts: [], scenes: [], sources: [], learningOrder: [], linkPolicy: {doNotAutoLink: [], conceptConnection: {id: ''}},
};
export const explorerLayout = layoutConceptMap(adaptConceptMap(geometry, {view: 'all', more: true, selection: null}));

export function termForNode(node: ExplorerNode) {
  return termConnections.find(term => term.termId === node.glossary.termId);
}

// Exact U4 evidence first. Other explicitly listed v3 nodes use the approved
// Scene 08 area review, not a guessed conversion from v2 Scene 03a/03b.
const u4ReviewNodes = new Set(['cli','module','repository','crud','persistence','file-io','jsonl',
  'iterator','generator','yield','decorator','exceptions','type-hint','validation']);
export function nodeReviews(nodeId: string): readonly ReviewLink[] {
  const node = nodeById.get(nodeId);
  if (!node) return [];
  const term = termForNode(node);
  if (term && u4ReviewNodes.has(nodeId)) return term.sources.map(target => ({target, label: `Scene ${target.scene} · ${term.label}`}));
  return lectureAreas.filter(area => [...area.originalNodeIds, ...area.originalDeepNodeIds].includes(nodeId))
    .map(area => ({target: area.review, label: `Scene ${area.scene} · ${area.name}`}));
}
export function itemReviews(kind: 'relation' | 'comparison', id: string): readonly ReviewLink[] {
  if (kind === 'relation') return Object.entries(relationReviews).find(([key]) => key === id)?.[1] ?? [];
  return Object.entries(comparisonReviews).find(([key]) => key === id)?.[1] ?? [];
}

export function relatedRelations(nodeId: string | null, type = 'all') {
  return candidate.relations.filter(rel => (!nodeId || rel.from === nodeId || rel.to === nodeId) && (type === 'all' || rel.type === type));
}
