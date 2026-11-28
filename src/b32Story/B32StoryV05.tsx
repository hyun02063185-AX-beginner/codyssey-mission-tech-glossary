import { IntegratedStoryView } from './B32IntegratedStory';
import B32IntegratedFigures from './B32IntegratedFigures';
import { CaptureV05, GitCasesV05, TemperatureV05 } from './B32FiguresV05';
import B32MaxTokensV05 from './B32MaxTokensV05';
import { LearningIndexLayout, LearningIndexTrigger, LearningPositionStrip, LearningRoadmap } from './B32LearningIndex';
import type { IndexNavigation } from './B32Story';
import { learningPositions, learningScenes } from './learningIndexV05';
import { lessonV05 } from './lessonV05';

const indexNavigation: IndexNavigation = {
  Frame: ({ index, explanationOpen, children }) => <LearningIndexLayout scenes={learningScenes}
    current={learningPositions[index]} explanationOpen={explanationOpen}>{children}</LearningIndexLayout>,
  trigger: <LearningIndexTrigger/>,
  position: index => <LearningPositionStrip scenes={learningScenes} current={learningPositions[index]}/>,
};

export default function B32StoryV05() {
  return <IntegratedStoryView lesson={lessonV05}
    roadmap={<LearningRoadmap scenes={learningScenes} description={lessonV05.intro.roadmap}/>}
    indexNavigation={indexNavigation} renderDiagram={(id, initial, screen) => {
      if (id === 'I4') return <CaptureV05 initial={initial} output={screen.result!.output}/>;
      if (id === 'I5' && initial === 'git-cases') return <GitCasesV05 output={screen.result!.output}/>;
      if (id === 'I11') return <TemperatureV05 initial={initial} table={screen.table!}/>;
      if (id === 'I12') return <B32MaxTokensV05/>;
      return <B32IntegratedFigures id={id} initial={initial}/>;
    }}/>;
}
