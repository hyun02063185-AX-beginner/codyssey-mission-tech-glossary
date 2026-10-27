import {createContext,useContext} from 'react';
import {conceptHref,mapQuery,sceneLabel,storyHref,storyScene} from '../b31StoryNavigation';
import type {MapState} from './conceptMapTypes';
export type ConceptMapNavigation={
  missionId:string;title:string;originKey:string;defaultScene:string;returnKey:string;
  origin:(value:string|null)=>string|null;scene:(value:string)=>string|null;sceneLabel:(value:string)=>string;
  storyHref:(scene:string,map:string)=>string;conceptHref:(query:string)=>string;mapQuery:(query:string)=>string;
  searchPlaceholder:string;help:string;initialFit?:boolean;missionLegend?:boolean;
  selectionExtras?:(params:URLSearchParams,state:MapState)=>URLSearchParams;
};
export const b31Navigation:ConceptMapNavigation={
  missionId:'main-m05',title:'B3-1 개념지도',originKey:'scene',defaultScene:'scene-01',returnKey:'b31-map',
  origin:storyScene,scene:storyScene,sceneLabel:id=>sceneLabel(storyScene(id)!),storyHref:(id,map)=>storyHref(storyScene(id)!,map),conceptHref,mapQuery,
  searchPlaceholder:'방화벽, NAT, Security Group…',help:'일반망의 역할은 AWS에서 어떻게 구현될까요? 개념을 선택해 연결 이유와 차이를 읽어 보세요.',
};
export const ConceptMapNavigationContext=createContext(b31Navigation);
export const useConceptMapNavigation=()=>useContext(ConceptMapNavigationContext);
