export type Domain = 'general' | 'aws' | 'common' | 'basics' | 'web';
export type ViewId = 'all' | 'general' | 'aws' | 'basics';
export type Importance = 'core' | 'supplementary';
export type RelationType = '포함' | '역할' | '흐름' | '대응' | '연관' | '선행';
export type ConceptNode = {
  id: string; label: string; domain: Domain; conceptType: string; region: string; order: number;
  importance: Importance; implementationStatus: string; summary: string; description: string;
  b31Note?: string; termIds: string[]; relatedTermIds?: string[]; storyScenes: string[];
  appliedIn?: Array<{ nodeId: string; view: ViewId; note: string }>;
  extensions?: Array<{id:string;title:string;termIds:string[];body:string}>;
};
export type ConceptRelation = {
  id: string; from: string; to: string; type: RelationType; scope: string; importance: Importance;
  label: string; description: string; source: string[]; storyScenes: string[];
  path?: string[]; pathStepIds?: string[]; relatedTermIds?: string[];
  comparisonNote?: { same: string; different: string; caution: string };
  perSystem?: Record<string, string>;
};
export type ConceptMapData = {
  mapId: string; title: string; question: string;
  nodes: ConceptNode[]; relations: ConceptRelation[];
  regions: Array<{ id: string; domain: Domain; label: string; description: string; order: number }>;
  views: Array<{ id: ViewId; label: string; nodeDomains: Domain[]; sharedNodeIds?: string[]; relationScopes: string[]; initialImportance: Importance[]; description: string }>;
  contrasts: Array<{ id: string; title: string; nodeIds: string[]; explanation: string; noLineReason: string; storyScenes: string[] }>;
  scenes: Array<{ id: string; title: string; order: number }>;
  sources: Array<{ id: string; label: string; url?: string; kind: string }>;
  learningOrder: Array<{ id: string; first: string; then: string; firstRefs: string[]; thenRefs: string[] }>;
  linkPolicy: { doNotAutoLink: string[]; conceptConnection: { id: string } };
  relationTypes?: Record<string,string>;
  layout?: {width:number;height:number;positions:Record<string,Position>;regions:Record<string,Position>;routes:Record<string,[number,number][]>;annotations?:Array<{x:number;y:number;title:string;caption:string}>};
};
export type MapSelection = { kind: 'node' | 'rel' | 'flow'; id: string } | null;
export type MapState = { view: ViewId; more: boolean; selection: MapSelection };
export type Position = { x: number; y: number; width: number; height: number };
export type DrawEdge = { id: string; relation: ConceptRelation; from: string; to: string; step?: string; omitted?: string[] };

export const domainLabel: Record<Domain, string> = { general: '일반망', aws: 'B3-1 AWS', common: '공통', basics: '기초', web:'웹페이지' };
export const conceptTypeLabel: Record<string, string> = {
  language:'언어', file:'파일', concept:'개념',
  actor: '사람', area: '영역', address: '주소', port: '통신', device: '장비', server: '서버',
  endpoint: '단말', technology: '기술', role: '역할', 'aws-location': '리전',
  'aws-resource': 'AWS 자원', 'aws-setting': '설정', software: '프로그램', 'data-unit': '데이터 단위', protocol: '프로토콜',
};
