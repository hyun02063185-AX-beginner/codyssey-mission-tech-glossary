import { cloneElement, isValidElement, createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from 'react';
import type { StepAddress } from '../content';

export interface FigureActions {
  reveal: boolean;
  file: string;
  select: (id: string, focusKey?: string, file?: string) => void;
  scene: (index: number) => void;
  review: (target: StepAddress, focusKey?: string) => void;
  toggleReveal: (focusKey?: string) => void;
  register: (key: string, element: HTMLButtonElement | null) => void;
}
export const FigureContext = createContext<FigureActions>(null!);
export const keyed = (nodes: ReactNode): ReactNode => Array.isArray(nodes)
  ? nodes.map((node,i)=>isValidElement(node)?cloneElement(node,{key:node.key??i}):keyed(node))
  : nodes;
interface FigureButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  go?: string; goScene?: number; review?: StepAddress; file?: string;
  focusKey?: string; revealAction?: boolean;
}
export function FigureButton({go, goScene, review, file, focusKey, revealAction, ...props}: FigureButtonProps) {
  const actions = useContext(FigureContext);
  return <button {...props} type="button" ref={node => { if (focusKey) actions.register(focusKey, node); }}
    data-focus-key={focusKey} onClick={() => {
      if (props['aria-disabled'] === true || props['aria-disabled'] === 'true') return;
      if (review) actions.review(review, focusKey);
      else if (goScene !== undefined) actions.scene(goScene);
      else if (revealAction) actions.toggleReveal(focusKey);
      else if (go) actions.select(go, focusKey, file);
    }} />;
}
/** Approved rich text only. No HTML injection; text becomes React text nodes. */
function decode(text: string) {
  const entities: Record<string,string>={lt:'<',gt:'>',amp:'&',quot:'"',apos:"'",nbsp:'\u00a0'};
  return text.replace(/&(#x[\da-f]+|#\d+|lt|gt|amp|quot|apos|nbsp);/gi,(_,key:string)=>key.startsWith('#')?String.fromCodePoint(key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1))):entities[key.toLowerCase()]);
}
export function rich(text: string): ReactNode {
  const tokens = text.split(/(<\/?(?:b|code|span)(?: class="[a-z-]+")?>)/g);
  const stack: {tag: string; className?: string; children: ReactNode[]}[] = [{tag:'root',children:[]}];
  for (const token of tokens) {
    if (!token) continue;
    const open = token.match(/^<(b|code|span)(?: class="([a-z-]+)")?>$/);
    if (open) { stack.push({tag:open[1],className:open[2],children:[]}); continue; }
    if (/^<\//.test(token) && stack.length > 1) {
      const node=stack.pop()!; const Tag=node.tag as 'b'|'code'|'span';
      stack.at(-1)!.children.push(<Tag key={stack.at(-1)!.children.length} className={node.className}>{node.children}</Tag>);
    } else stack.at(-1)!.children.push(decode(token));
  }
  return <>{stack[0].children}</>;
}
