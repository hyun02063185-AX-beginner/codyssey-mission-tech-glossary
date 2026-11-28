import { useState, type ComponentProps, type ReactNode } from 'react';
import { Diagram } from './B32Diagram';

export const evidenceOwner = '실제 · 2026-11-25 Owner';
export const evidenceRepro = '재현 · Claude 2026-11-28';
export const evidenceLab = '재현 · Claude 2026-11-25';
export const evidenceSource = '구현 · 소스 be21c49';

export function Badge({ children }: { children: ReactNode }) {
  return <span className="b32-lab-badge">{children}</span>;
}

export function IntegratedDiagram(props: Omit<ComponentProps<typeof Diagram>, 'caption'>) {
  return <Diagram {...props} caption={<p className="b32-integrated-figure-badge">
    <Badge>교육용 시뮬레이션 · 실제 실행 기록이 아닙니다</Badge>
  </p>}/>;
}

export function CodeSample({ children }: { children: ReactNode }) {
  return <pre className="b32-integrated-scroll" tabIndex={0}><code>{children}</code></pre>;
}

export function Steps({ start = 0, labels, children }: {
  start?: number; labels: readonly string[]; children: (step: number) => ReactNode;
}) {
  const [step, setStep] = useState(start);
  return <div data-step={step + 1}>
    <div aria-live="polite">
      <p><strong>{step + 1}단계 · {labels[step]}</strong></p>
      {children(step)}
    </div>
    <div className="b32-integrated-steps" aria-label="도식 단계 이동" role="group">
      <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}>이전 단계</button>
      <span>{step + 1} / {labels.length}</span>
      <button type="button" disabled={step === labels.length - 1} onClick={() => setStep(step + 1)}>다음 단계</button>
    </div>
  </div>;
}
