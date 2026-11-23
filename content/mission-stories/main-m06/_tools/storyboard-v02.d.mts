type Figure = { desktop: string[]; mobile: string[] };
type LegacyScreen = Figure & { id: string; title: string; message: string; caption: string };
type LegacySource = {
  intro: Figure & { title: string; question: string; draftDefinition: string };
  scenes: Record<string, { title: string }>;
  screens: LegacyScreen[];
};

export function lessonFromStoryboard<T extends LegacySource>(source: T, markdown: string): {
  intro: T['intro'] & { subtitle: string; goals: string[] };
  scenes: { [Id in keyof T['scenes']]: T['scenes'][Id] & { question: string } };
  screens: (T['screens'][number] & {
    explanation: string;
    explanationGuides: { label: string; href: string }[];
  })[];
};
