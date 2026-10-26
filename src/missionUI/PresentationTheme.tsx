import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import './presentationTheme.css';
export const PRESENTATION_THEME_KEY='codyssey-presentation-theme';
export type PresentationTheme='dark'|'light';
export function readPresentationTheme(storage?:Pick<Storage,'getItem'>|null):PresentationTheme{
  try{
    const source=storage===undefined?(typeof localStorage==='undefined'?null:localStorage):storage;
    return source?.getItem(PRESENTATION_THEME_KEY)==='light'?'light':'dark';
  }catch{return 'dark';}
}
const Context=createContext<{theme:PresentationTheme;change:(theme:PresentationTheme)=>void}|null>(null);
/** Slide-only surface. Never wraps concept maps or the structural diagram renderer. */
export function PresentationSurface({children}:{children:ReactNode}){
  const [theme,setTheme]=useState(readPresentationTheme);
  useEffect(()=>{
    const sync=(event:StorageEvent)=>{if(event.key===PRESENTATION_THEME_KEY||event.key===null)setTheme(readPresentationTheme());};
    window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
  },[]);
  const change=(next:PresentationTheme)=>{setTheme(next);try{localStorage.setItem(PRESENTATION_THEME_KEY,next);}catch{/* Selection still works when storage is unavailable. */}};
  return <Context.Provider value={{theme,change}}><div className="mission-presentation" data-presentation-theme={theme}>{children}</div></Context.Provider>;
}
export function PresentationThemeSelector(){
  const context=useContext(Context);
  if(!context)return null;
  return <label className="theme-selector">강의 화면 테마 <select aria-label="강의 화면 테마" value={context.theme} onChange={event=>context.change(event.target.value==='light'?'light':'dark')}><option value="dark">Dark</option><option value="light">Light</option></select></label>;
}
