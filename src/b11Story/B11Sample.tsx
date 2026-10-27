import {useRef,useState} from 'react';
const files=import.meta.glob('../../content/mission-stories/main-m01/sample/*.html',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
import css from '../../content/mission-stories/main-m01/sample/css/style.css?raw';
import js from '../../content/mission-stories/main-m01/sample/js/menu.js?raw';
import profile from '../../content/mission-stories/main-m01/sample/images/profile.svg?url';
const names=['state-1-html.html','state-2-css.html','index.html'];
export function sampleDocument(index:number) {
  return files[`../../content/mission-stories/main-m01/sample/${names[index]}`]
    .replace(/<link\b[^>]*href="css\/style.css"[^>]*>/,`<style>${css}</style>`)
    .replace(/<script\b[^>]*src="js\/menu.js"[^>]*><\/script>/,'')
    .replace(/images\/profile.svg/g,new URL(profile,document.baseURI).href)
    .replace('</body>',`${index===2?`<script>${js}</script>`:''}</body>`);
}
export default function B11Sample(){
  const dialog=useRef<HTMLDialogElement>(null),button=useRef<HTMLButtonElement>(null);
  const [index,setIndex]=useState(0),[width,setWidth]=useState('390');
  return <><button ref={button} type="button" onClick={()=>dialog.current?.showModal()}>세 상태 실제 시연</button><dialog className="b11-sample" ref={dialog} onClose={()=>button.current?.focus()}>
    <header><h2>같은 문서, 세 상태</h2><button type="button" onClick={()=>dialog.current?.close()}>시연 닫기</button></header>
    <div className="b11-sample-controls"><label>상태 <select aria-label="시연 상태" value={index} onChange={event=>setIndex(Number(event.target.value))}><option value={0}>① HTML만</option><option value={1}>② CSS 연결</option><option value={2}>③ JavaScript 연결</option></select></label><label>화면 폭 <select aria-label="시연 화면 폭" value={width} onChange={event=>setWidth(event.target.value)}><option value="390">모바일 390px</option><option value="960">PC 960px</option></select></label></div>
    <p>교육용 예시 페이지 (실제 교육생 프로젝트 아님)</p><div className="b11-sample-scroll"><iframe key={index} title="김코디 자기소개 시연" sandbox="allow-scripts" srcDoc={sampleDocument(index)} style={{width:Number(width)}}/></div>
  </dialog></>;
}
