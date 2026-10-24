import type { TeachingScene, TeachingStep } from '../content';
import { rich } from '../figures/FigureContext';
export function InstructorNotes({scene,step,index,expanded=false}: {scene:TeachingScene;step:TeachingStep;index:number;expanded?:boolean}) {
  return <><h3>이 단계 · {scene.ctx} {index+1}. {step.title}</h3>
    {step.instructor?.script?.map((text,i)=><blockquote key={i}>{text}</blockquote>)}
    {step.instructor?.expected&&<><h3>기대 답과 흔한 오답</h3><ol>{step.instructor.expected.map((q,i)=><li key={i}><b>{q.q}</b><br/>→ {q.a}<br/><span style={{color:'var(--muted)'}}>{q.miss}</span></li>)}</ol></>}
    <details open={expanded}><summary>강사 노트 — 정확성 경계</summary><ul>{scene.instructor.notes.map((text,i)=><li key={i}>{rich(text)}</li>)}</ul></details>
    <details open={expanded}><summary>선택형 심화</summary><ul>{scene.instructor.deep.map((text,i)=><li key={i}>{rich(text)}</li>)}</ul></details>
  </>;
}
