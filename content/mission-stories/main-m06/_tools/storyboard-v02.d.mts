type Figure = { desktop: string[]; mobile: string[] };
type LegacyScreen = Figure & { id: string; title: string; message: string; caption: string; technology: string };
type LegacySource = {
  intro: Figure & { title: string; question: string; draftDefinition: string };
  scenes: Record<string, { title: string }>;
  screens: LegacyScreen[];
};

export type LearningCheck = { question: string; answer: string };
export function splitLearningCheck(markdown: string): LearningCheck;

export function lessonFromStoryboard<T extends LegacySource>(source: T, markdown: string, version?: 'v02' | 'r1' | 'v03'): {
  intro: T['intro'] & { subtitle: string; goals: string[]; learningGuide?: string; practice?: string };
  scenes: { [Id in keyof T['scenes']]: T['scenes'][Id] & { question: string } };
  screens: (T['screens'][number] & {
    explanation: string;
    practice?: string;
    check: (LearningCheck & { label: string }) | null;
    wrapUp: LearningCheck | null;
    explanationGuides: { label: string; href: string }[];
  })[];
};
