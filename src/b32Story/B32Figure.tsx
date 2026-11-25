import { useLayoutEffect, useRef, useState } from 'react';
import { b32Review } from './reviewMode';

const assets = import.meta.glob([
  '../../content/mission-stories/main-m06/assets/*.svg',
  '!../../content/mission-stories/main-m06/assets/*-v03-*.svg',
], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const reviewAssets = b32Review
  ? import.meta.glob('../../content/mission-stories/main-m06/assets/*-v03-*.svg', {
    query: '?raw', import: 'default', eager: true,
  }) as Record<string, string>
  : {};
const style = '<style>:host{display:flex;width:100%;height:100%;align-items:var(--b32-figure-alignment,center);justify-content:center;line-height:normal;letter-spacing:normal}svg{display:block;max-width:100%;max-height:100%;width:auto;height:auto}</style>';

export default function B32Figure({ desktop, mobile, journey = false }: {
  desktop: string[]; mobile: string[]; journey?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(() => window.innerWidth < 900);
  useLayoutEffect(() => {
    const media = window.matchMedia('(max-width:899px)');
    const change = () => setNarrow(media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);

  const [name, state] = narrow ? mobile : desktop;
  useLayoutEffect(() => {
    const element = host.current!;
    const shadow = element.shadowRoot ?? element.attachShadow({ mode: 'open' });
    const path = `../../content/mission-stories/main-m06/assets/${name}`;
    shadow.innerHTML = (assets[path] ?? reviewAssets[path] ?? '') + style;
    shadow.querySelector('svg')?.setAttribute('data-state', state);
  }, [name, state]);

  return <div className={journey ? 'b32-journey' : 'b32-figure'} data-figure={name} data-state={state} ref={host}/>;
}
