// Opt-in layout. Legacy template-v1 episodes never use this markup or CSS.
import fs from 'node:fs/promises';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const icons={
 laptop:'<rect x="5" y="4" width="26" height="19" rx="2"/><path d="M2 29h32l-4-6H6z"/>',
 database:'<ellipse cx="18" cy="7" rx="13" ry="5"/><path d="M5 7v22c0 7 26 7 26 0V7M5 16c0 7 26 7 26 0M5 23c0 7 26 7 26 0"/>',
 shield:'<path d="M18 2 33 8l-3 16-12 10L6 24 3 8z"/><path fill="currentColor" stroke="none" d="M18 10c2 6 8 8 6 14-2 7-13 7-13-1 0-4 3-6 4-9 0 4 2 5 3 6 3-3 0-6 0-10z"/>',
 person:'<circle cx="18" cy="9" r="7"/><path d="M4 34V26c0-14 28-14 28 0v8z"/>',
 sofa:'<path d="M7 18V8c0-6 22-6 22 0v10M3 16h6v12h18V16h6v16H3zM7 32v3m22-3v3"/>',
 lock:'<path d="M10 17V10a8 8 0 0 1 16 0v7"/><rect x="5" y="17" width="26" height="19" rx="3"/><circle cx="18" cy="25" r="2"/><path d="M18 27v4"/>'
};
const icon=name=>`<svg class="cn-icon" viewBox="0 0 36 38" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.3">${icons[name]||''}</svg>`;
const position=o=>`left:${o.x}px;top:${o.y}px;width:${o.width}px;height:${o.height}px;${o.fontSize?`font-size:${o.fontSize}px;`:''}`;
function diagram(d){
 return `<div class="cn-diagram ${escape(d.direction)}" style="${position(d)}">${d.nodes.map((n,i)=>`${i?'<span class="cn-arrow">'+(d.direction==='vertical'?'↓':'→')+'</span>':''}<div class="cn-node theme-${escape(n.theme)}">${icon(n.icon)}<span>${escape(n.text)}</span>${n.mark?`<b class="cn-mark ${n.mark==='×'?'denied':'allowed'}">${escape(n.mark)}</b>`:''}${n.locked?`<b class="cn-lock">${icon('lock')}</b>`:''}</div>`).join('')}</div>`;
}
export async function companyNetworkDocument(episode,directory){
 const css=await fs.readFile(new URL('../content/webtoons/company-network/layout-v1.css',import.meta.url),'utf8');
 const panels=episode.panels.map((p,index)=>`<section class="cn-panel"><div class="cn-art" style="--x:${index%2?'100%':'0%'};--y:${index>1?'100%':'0%'};${episode.artRows?`background-size:200% ${1024/episode.artRows[index>1?1:0]*100}%;`:''}${p.artFrame?`top:${p.artFrame.y}px;height:${p.artFrame.height}px;bottom:auto;`:''}"></div><h2 class="cn-title">${p.number}. ${escape(p.title)}</h2>${p.textOverlays.map(o=>{
  const speech=o.kind==='dialogue'?p.dialogue[o.dialogueIndex]:null;
  return `<div class="cn-overlay ${speech?`cn-speech ${speech.kind==='thought'?'cn-thought':''}`:`cn-label theme-${escape(o.theme)}`}" style="${position(o)}" ${speech?`data-dialogue-index="${o.dialogueIndex}"`:''}>${o.icon?icon(o.icon):''}<span>${escape(speech?speech.text:o.text)}</span></div>`;
 }).join('')}${(p.visualOverlays||[]).map(o=>`<div class="cn-thought-frame" style="${position(o)}"></div>${o.dots.map(([x,y,r])=>`<i class="cn-thought-dot" style="left:${x}px;top:${y}px;width:${r}px;height:${r}px"></i>`).join('')}`).join('')}${p.diagram?diagram(p.diagram):''}${p.number===4?`<footer class="cn-footer"><strong>${escape(episode.coreSummary)}</strong><span>💡 ${escape(episode.closingCopy)}</span></footer>`:''}</section>`).join('');
 const art=(await fs.readFile(new URL('art.png',`file://${directory}/`))).toString('base64');
 return `<!doctype html><html lang="ko"><meta charset="utf-8"><style>${css}.cn-art{background-image:url(data:image/png;base64,${art})}</style><main class="cn-comic">${panels}</main></html>`;
}
