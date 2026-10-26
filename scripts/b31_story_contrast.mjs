/** Run in the page. Inspect rendered text nodes, including controls and open details.
 * Shadow-root SVGs deliberately remain outside this HTML contrast audit. */
export function measureB31Text(root) {
 const rgba=value=>{const v=value.match(/[\d.]+/g)?.map(Number)??[0,0,0],scale=value.startsWith('color(srgb')?255:1;return [v[0]*scale,v[1]*scale,v[2]*scale,v[3]??1];};
 const over=(a,b)=>[...a.slice(0,3).map((v,i)=>v*a[3]+b[i]*(1-a[3])),1];
 const lum=rgb=>rgb.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
 const background=el=>{const chain=[];for(let p=el;p;p=p.parentElement)chain.unshift(p);return chain.reduce((bg,p)=>over(rgba(getComputedStyle(p).backgroundColor),bg),[255,255,255,1]);};
 const samples=[],seen=new Set();
 const add=(el,text)=>{
  if(!text.trim()||el.closest('script,style,option,[hidden],button:disabled')||!el.getClientRects().length||getComputedStyle(el).visibility==='hidden')return;
  const key=el.tagName+'|'+el.className+'|'+text.trim();if(seen.has(key))return;seen.add(key);
  const style=getComputedStyle(el),bg=background(el),ink=over(rgba(style.color),bg),a=lum(ink),b=lum(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  samples.push({tag:el.tagName,className:el.className,text:text.trim(),color:style.color,background:bg.slice(0,3),size:parseFloat(style.fontSize),ratio});
 };
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let node;
 while((node=walker.nextNode()))if(node.parentElement)add(node.parentElement,node.textContent??'');
 root.querySelectorAll('select').forEach(el=>add(el,el.selectedOptions[0]?.textContent??''));
 return {samples,minimum:Math.min(...samples.map(s=>s.ratio)),failures:samples.filter(s=>s.ratio<4.5)};
}
