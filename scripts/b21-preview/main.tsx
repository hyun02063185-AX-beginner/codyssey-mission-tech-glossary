import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import B21StoryFoundation from '../../src/b21Story/B21StoryFoundation';
import { storyManifest } from '../../src/b21Story/content/storyManifest';
import './preview.css';

function OwnerPreview() {
  const [width, setWidth] = useState(1280);
  const [scene, setScene] = useState('scene-01');
  const [sceneRequest, setSceneRequest] = useState(0);
  return <>
    <header className="owner-preview-toolbar">
      <h1>B2-1 React · Owner 로컬 미리보기</h1>
      <p>원고와 전체 그림을 검토하는 화면입니다. 장면별 인터랙션·실행 체험과 Scene 08 개념지도 탐색은 준비 중입니다.</p>
      <div role="group" aria-label="검토 화면 너비">
        {([1280, 390, 360] as const).map(value => <button type="button" key={value} aria-pressed={width === value} onClick={() => setWidth(value)}>
          {value === 1280 ? 'PC' : '모바일'} {value}px
        </button>)}
        <span role="status">실제 미리보기 영역: {width}px</span>
        <label>장면 바로 열기 <select value="" onChange={event => {
          setScene(event.currentTarget.value);
          // Reopen even when navigation inside the frame changed the current scene.
          setSceneRequest(value => value + 1);
        }}>
          <option value="" disabled>Scene 선택</option>
          {storyManifest.map(story => <option key={story.id} value={story.id}>{story.label}</option>)}
        </select></label>
      </div>
      <p className="owner-preview-help">장면은 아래 화면에서 직접 선택하세요. 화면보다 넓은 미리보기는 가로로 이동할 수 있습니다. 종료: 터미널에서 Control+C.</p>
    </header>
    <main className="owner-preview-canvas">
      {/* This is the real React entry in its own viewport, not a draft HTML mockup. */}
      <iframe key={sceneRequest} title="B2-1 React 장면 미리보기" src={`/?view=scene&scene=${scene}`} style={{ width }} />
    </main>
  </>;
}

const sceneView = new URLSearchParams(window.location.search).get('view') === 'scene';
const initialSceneId = storyManifest.find(story => story.id === new URLSearchParams(window.location.search).get('scene'))?.id ?? 'scene-01';
createRoot(document.getElementById('root')!).render(sceneView
  ? <><aside className="owner-preview-pending">Owner 검토용 · 장면별 인터랙션과 실행 체험은 준비 중입니다. Scene 08 개념지도 탐색도 준비 중입니다.</aside><B21StoryFoundation initialSceneId={initialSceneId} /></>
  : <OwnerPreview />);
