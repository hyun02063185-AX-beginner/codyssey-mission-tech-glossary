/** v3 is eight teaching scenes, independent of the nine-unit v2 Foundation. */
export type SceneId = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08';
export type Addressing = 'number' | 'id';
export type FigureId = 'f1' | 'cmd' | 'f4' | 'check' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8';
export type RelationId = 'R09' | 'R23' | 'R28' | 'R37' | 'R41';
export type ComparisonId = 'C13' | 'C30';
export type ExampleKind = 'fictional-todo' | 'fictional-records' | 'concept' | 'ledger' | 'review';

/** Numeric-address scenes use a one-based string; 05/06 use semantic step IDs. */
export interface StepAddress { scene: SceneId; step: string }
export interface ReviewLink { label: string; target: StepAddress }
export interface ExpectedAnswer { q: string; a: string; miss: string }

export interface TeachingStep {
  id: string;
  title: string;
  figure: FigureId;
  say: string;
  example: ExampleKind;
  real?: boolean;
  // Preserve all approved figure parameters, including null and numeric states.
  mode?: string;
  sub?: string | number;
  home?: string;
  hl?: string | null;
  sel?: string | number | null;
  opt?: boolean;
  sit?: string | null;
  op?: string | null;
  sr?: string | null;
  st?: string;
  kind?: string;
  rel?: RelationId;
  cmp?: ComparisonId;
  questions?: readonly { kind: string; q: string }[];
  reveal?: { answers: readonly string[] };
  review?: readonly StepAddress[];
  next?: { question: string; target: StepAddress };
  instructor?: {
    script?: readonly string[];
    expected?: readonly ExpectedAnswer[];
  };
}

export interface TeachingScene {
  id: SceneId;
  title: string;
  question: string;
  ctx: string;
  tag?: string;
  addressing: Addressing;
  legacy?: readonly string[];
  home: string;
  steps: readonly TeachingStep[];
  /** Approved preview markup (<b>, <code>) is retained verbatim. */
  instructor: { notes: readonly string[]; deep: readonly string[] };
  source: { storyboard: string; sha256: string };
}

export interface LectureArea {
  /** Teaching display ID; never a new candidate-map node/area ID. */
  id: string;
  scene: SceneId;
  name: string;
  say: string;
  concepts: readonly string[];
  review: StepAddress;
  originalAreaIds: readonly string[];
  originalNodeIds: readonly string[];
  originalDeepNodeIds: readonly string[];
}
