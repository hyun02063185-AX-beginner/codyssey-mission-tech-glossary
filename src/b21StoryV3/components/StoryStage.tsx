import type { TeachingStep } from '../content';
import { FigF1, FigCmd, FigF4, FigCheck, FigS2, FigS3, FigS4, FigS5, FigS6, FigS7, FigS8 } from '../figures/ApprovedFigures';
const figures = { f1:FigF1, cmd:FigCmd, f4:FigF4, check:FigCheck, s2:FigS2, s3:FigS3, s4:FigS4, s5:FigS5, s6:FigS6, s7:FigS7, s8:FigS8 };
export function StoryStage({step}: {step:TeachingStep}) {
  const Figure=figures[step.figure];
  return <main className="stage" id="stage"><Figure step={step}/></main>;
}
