import { screenHref } from './content';
import { lessonV05 } from './lessonV05';

const { scenes, screens } = lessonV05;
const addresses = screens.map((screen, index) => ({
  id: screen.id, scene: screen.scene, title: screen.title, href: screenHref(index, screens),
}));

export const learningScenes = Object.entries(scenes).map(([id, scene]) => ({
  ...scene, id, concepts: scene.concepts ?? [],
  screens: addresses.filter(screen => screen.scene === id),
}));

export type LearningScene = typeof learningScenes[number];

export const learningPositions = addresses.map((screen, index) => {
  const scene = learningScenes.find(item => item.id === screen.scene)!;
  return {
    id: screen.id, scene,
    withinScene: scene.screens.findIndex(item => item.id === screen.id) + 1,
    overall: index + 1, total: addresses.length,
  };
});

export type LearningPosition = typeof learningPositions[number];

export function learningLocation(position: LearningPosition, sceneCount: number) {
  const { scene, withinScene, overall, total } = position;
  return `Scene ${scene.id} / ${sceneCount} · ${scene.perspective} · 화면 ${withinScene} / ${scene.screens.length} · 전체 ${overall} / ${total}`;
}
