import { useEffect, useState } from 'react';
import { loadStory } from './content/storyLoader';
import { storyManifest } from './content/storyManifest';
import type { LoadedStory, SceneId } from './content/storyTypes';
import StoryScene, { type ConceptMapSlot } from './components/StoryScene';
import './b21Story.css';
// Private, reusable component. Deliberately not imported by App/missionLearning.
export default function B21StoryFoundation({ initialSceneId = 'scene-01', conceptMapSlot, loadScene = loadStory }: { initialSceneId?: SceneId; conceptMapSlot?: ConceptMapSlot; loadScene?: (id: SceneId) => Promise<LoadedStory> }) {
  const [id, setId] = useState<SceneId>(initialSceneId), [story, setStory] = useState<LoadedStory | null>(null);
  const [error, setError] = useState(false), [attempt, setAttempt] = useState(0), [section, setSection] = useState<string>();
  useEffect(() => {
    let cancelled = false; setStory(null); setError(false);
    loadScene(id).then(value => { if (!cancelled) setStory(value); }).catch(() => { if (!cancelled) setError(true); });
    return () => { cancelled = true; };
  }, [id, attempt, loadScene]);
  useEffect(() => {
    if (!story) return;
    const target = document.getElementById(section ?? `${story.id}-title`);
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'start' });
  }, [story, section]);
  const navigate = (next: SceneId, anchor?: string) => { setSection(anchor); setId(next); };
  return <div className="b21-story-foundation">
    <nav aria-label="학습 장면"><ol>{storyManifest.map(s => <li key={s.id}><button type="button" aria-current={id === s.id ? 'step' : undefined} onClick={() => navigate(s.id)}>{s.label}</button></li>)}</ol></nav>
    {error ? <div role="alert"><p>장면을 불러오지 못했습니다.</p><button type="button" onClick={() => setAttempt(v => v + 1)}>다시 불러오기</button></div>
      : !story ? <p role="status">장면을 불러오는 중입니다.</p> : <StoryScene story={story} onNavigate={navigate} conceptMapSlot={conceptMapSlot} />}
  </div>;
}
// A private build verifier consumes these exports without registering any route.
export { loadStoryManifest } from './content/storyLoader';
export { default as StoryScene } from './components/StoryScene';
