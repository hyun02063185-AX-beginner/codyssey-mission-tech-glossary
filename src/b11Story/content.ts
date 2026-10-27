import source from '../../content/mission-stories/main-m01/_tools/screens.json';
import storyboard from '../../content/mission-stories/main-m01/storyboard-v0.2.md?raw';

export const storyPath = '/missions/main-M01/story';
export const conceptPath = `${storyPath}/concepts`;
export const {intro, scenes, screens} = source;
export type Screen = typeof screens[number];
export const chapters = Object.keys(import.meta.glob('../../content/mission-guides/main-m01/chapters/*.md')).map(path => path.split('/').pop()!.replace('.md','')).sort();
export const guideChapter = (name:string) => chapters.find(id => id.startsWith(name === '전체 통합' ? '09-' : name.replace('Ch','').padStart(2,'0')+'-'));
export function authoredScreen(id:string) {
  const block = storyboard.split(`### ${id} · `)[1]?.split('\n---')[0] ?? '';
  const field = (name:string) => block.match(new RegExp(`\\*\\*${name}\\*\\* ?([\\s\\S]*?)(?=\\n\\*\\*|$)`))?.[1].trim() ?? '';
  return {notes:field('강사 스크립트'), explanation:field('학습자 접힘 설명'), check:field('이해 확인'), alt:block.match(/\| 대체텍스트 \| (.*?) \|/)?.[1] ?? ''};
}
export const introNotes = storyboard.split('**강사 스크립트 — 시작 (3분)**')[1]?.split('\n---')[0].trim() ?? '';
