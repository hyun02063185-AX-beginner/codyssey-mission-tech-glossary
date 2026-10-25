/** Fixed HashRouter routes, shared by service entries and the private adapters. */
export const b21StoryPath = '/missions/main-M03/story';
export const b21ConceptPath = `${b21StoryPath}/concepts`;
export const b21MissionPath = '/missions/main-M03';
export const b21PreviewConceptPath = '/concept-explorer';
export type ExplorerPath = typeof b21ConceptPath | typeof b21PreviewConceptPath;
