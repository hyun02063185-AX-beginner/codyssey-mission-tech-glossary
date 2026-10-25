import { lazy, Suspense, useState } from 'react';
import { HashRouter } from 'react-router-dom';
import B21StoryRouter from '../../src/b21StoryV3/routing/B21StoryRouter';
import { createRoot } from 'react-dom/client';
import B21StoryFoundation from '../../src/b21Story/B21StoryFoundation';
import { storyManifest } from '../../src/b21Story/content/storyManifest';
import B21TeachingStory from '../../src/b21StoryV3/B21TeachingStory';
import { scenes } from '../../src/b21StoryV3/content';
import './preview.css';

const U4LearningPreview=lazy(()=>import('./U4LearningPreview'));
const ConceptExplorerPreview=lazy(()=>import('./ConceptExplorerPreview'));

const icon=document.createElement('link'); icon.rel='icon'; icon.href='data:,'; document.head.appendChild(icon);

function OwnerPreview() {
  const [mode, setMode] = useState<'foundation'|'v3'|'router'|'u4'|'concepts'>('v3');
  const [v3Scene, setV3Scene] = useState(0);
  const [v3Step, setV3Step] = useState(0);
  const [width, setWidth] = useState(1280);
  const [scene, setScene] = useState('scene-01');
  const [sceneRequest, setSceneRequest] = useState(0);
  return <>
    <header className="owner-preview-toolbar">
      <h1>B2-1 React · Owner 로컬 미리보기</h1>
      <p>기존 Foundation의 원고·전체 그림과 신규 v3 React 강의 8장면·128단계를 검토합니다. Router 강의 테스트에서 주소·복습 복귀·발표자 창을 확인합니다. 공개 서비스 연결은 별도 단계입니다.</p>
      <div role="group" aria-label="검토 버전"><button aria-pressed={mode==='foundation'} onClick={()=>setMode('foundation')}>기존 Foundation</button><button aria-pressed={mode==='v3'} onClick={()=>setMode('v3')}>v3 React 강의</button><button aria-pressed={mode==='router'} onClick={()=>setMode('router')}>Router 강의 테스트</button><button aria-pressed={mode==='u4'} onClick={()=>setMode('u4')}>U4 연결 검토</button><button aria-pressed={mode==='concepts'} onClick={()=>setMode('concepts')}>전체 개념지도</button></div>
      <div role="group" aria-label="검토 화면 너비">
        {([1280, 390, 360] as const).map(value => <button type="button" key={value} aria-pressed={width === value} onClick={() => setWidth(value)}>
          {value === 1280 ? 'PC' : '모바일'} {value}px
        </button>)}
        <span role="status">실제 미리보기 영역: {width}px</span>
        {mode==='foundation'?<label>장면 바로 열기 <select aria-label="장면 바로 열기" value="" onChange={event => {
          setScene(event.currentTarget.value);
          // Reopen even when navigation inside the frame changed the current scene.
          setSceneRequest(value => value + 1);
        }}>
          <option value="" disabled>Scene 선택</option>
          {storyManifest.map(story => <option key={story.id} value={story.id}>{story.label}</option>)}
        </select></label>:<><label>v3 장면 <select aria-label="v3 장면" value={v3Scene} onChange={e=>{setV3Scene(Number(e.currentTarget.value));setV3Step(0);setSceneRequest(x=>x+1);}}>{scenes.map((s,i)=><option key={s.id} value={i}>Scene {s.id} · {s.title}</option>)}</select></label><label>v3 단계 <select aria-label="v3 단계" value={v3Step} onChange={e=>{setV3Step(Number(e.currentTarget.value));setSceneRequest(x=>x+1);}}>{scenes[v3Scene].steps.map((s,i)=><option key={s.id} value={i}>{i+1}. {s.title}</option>)}</select></label></>}
      </div>
      <p className="owner-preview-help">장면은 아래 화면에서 직접 선택하세요. 화면보다 넓은 미리보기는 가로로 이동할 수 있습니다. 종료: 터미널에서 Control+C.</p>
    </header>
    <main className="owner-preview-canvas">
      {/* This is the real React entry in its own viewport, not a draft HTML mockup. */}
      <iframe key={`${mode}-${sceneRequest}`} title="B2-1 React 장면 미리보기" src={mode==='concepts'?'/?view=concept-explorer#/concept-explorer':mode==='u4'?`/?view=v3-links#/missions/main-M03/story?scene=${scenes[v3Scene].id}&step=${scenes[v3Scene].addressing==='id'?scenes[v3Scene].steps[v3Step].id:v3Step+1}`:mode==='router'?`/?view=v3-router#/missions/main-M03/story?scene=${scenes[v3Scene].id}&step=${scenes[v3Scene].addressing==='id'?scenes[v3Scene].steps[v3Step].id:v3Step+1}`:mode==='foundation'?`/?view=scene&scene=${scene}`:`/?view=v3&scene=${scenes[v3Scene].id}&step=${scenes[v3Scene].addressing==='id'?scenes[v3Scene].steps[v3Step].id:v3Step+1}`} style={{ width,...(mode!=='foundation'?{height:width===1280?720:800}:{}) }} />
    </main>
  </>;
}

const sceneView = new URLSearchParams(window.location.search).get('view') === 'scene';
const initialSceneId = storyManifest.find(story => story.id === new URLSearchParams(window.location.search).get('scene'))?.id ?? 'scene-01';
const params=new URLSearchParams(window.location.search);
const v3SceneIndex=Math.max(0,scenes.findIndex(s=>s.id===params.get('scene')));
const v3Target=scenes[v3SceneIndex];
const v3StepIndex=v3Target.addressing==='id'?Math.max(0,v3Target.steps.findIndex(s=>s.id===params.get('step'))):Math.max(0,Math.min(v3Target.steps.length-1,Number(params.get('step')||1)-1));
createRoot(document.getElementById('root')!).render(params.get('view')==='concept-explorer'?<HashRouter><Suspense fallback={<p>전체 개념지도를 불러옵니다.</p>}><ConceptExplorerPreview/></Suspense></HashRouter>:params.get('view')==='v3-links'?<HashRouter><Suspense fallback={<p>U4 검토 화면을 불러옵니다.</p>}><U4LearningPreview/></Suspense></HashRouter>:params.get('view')==='v3-router'?<HashRouter><B21StoryRouter/></HashRouter>:params.get('view')==='v3'?<B21TeachingStory initialScene={v3SceneIndex} initialStep={Number.isFinite(v3StepIndex)?v3StepIndex:0}/>:sceneView
  ? <><aside className="owner-preview-pending">Owner 검토용 · 장면별 인터랙션과 실행 체험은 준비 중입니다. Scene 08 개념지도 탐색도 준비 중입니다.</aside><B21StoryFoundation initialSceneId={initialSceneId} /></>
  : <OwnerPreview />);
