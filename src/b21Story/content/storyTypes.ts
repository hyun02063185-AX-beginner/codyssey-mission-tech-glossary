export const sceneOrder = ['scene-01', 'scene-02', 'scene-03a', 'scene-03b', 'scene-04', 'scene-05', 'scene-06', 'scene-07', 'scene-08'] as const;
export type SceneId = typeof sceneOrder[number];
export type StoryAreaId = 'learner' | 'instructor' | 'checks' | 'sources';
export type SectionDefinition = { id: string; title: string; depth: number };
export type AssetDefinition = {
  sourcePath: string; sha256: string; width: number; height: number; alt: string; description: string;
};
export type StoryDefinition = {
  id: SceneId; label: string; sourcePath: string; sha256: string;
  sections: SectionDefinition[];
  art: { desktop: AssetDefinition; mobile: AssetDefinition; splitStatus: 'whole-source-only' } | null;
  references: string[];
};
export type StoryCode = {
  id: string; offset: number; language: string; raw: string;
  kind: 'code' | 'command' | 'data' | 'output'; partial: boolean; sourceFile?: string;
  // Future fixtures must cite this block and the approved source hash. No Python execution here.
  fixture?: { sourceSha256: string; fixtureId: string };
};
export type StoryArea = {
  id: StoryAreaId; sectionId: string; title: string; markdown: string;
  headings: (SectionDefinition & { offset: number })[]; codeBlocks: StoryCode[];
};
export type StoryReference = { url: string; kind: 'link' | 'image'; localPath?: string };
export type ParsedStory = {
  title: string; question: string; teachingMetadata: { label: string; markdown: string }[];
  areas: Record<StoryAreaId, StoryArea>;
  activities: { sectionId: string; title: string; markdown: string }[];
  references: StoryReference[];
  provenance: { editorialMarkdown: string; evidenceTags: string[] };
};
export type LoadedAsset = AssetDefinition & { url: string };
export type ConceptMapSlotContext = {
  sceneId: 'scene-08'; candidatePath: 'drafts/b2-1-story-map/scene-08/candidate-map.json';
  status: 'pending-integration';
};
export type LoadedStory = ParsedStory & Omit<StoryDefinition, 'references'> & {
  position: number; previous: SceneId | null; next: SceneId | null;
  sourceRevision: string;
  contentStatus: { source: 'review-draft'; publication: 'not-connected'; reviewRecord: string };
  assets: { desktop: LoadedAsset; mobile: LoadedAsset } | null;
  conceptMap: ConceptMapSlotContext | null;
};
