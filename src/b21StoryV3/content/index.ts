import { scene01 } from './scene01';
import { scene02 } from './scene02';
import { scene03 } from './scene03';
import { scene04 } from './scene04';
import { scene05 } from './scene05';
import { scene06 } from './scene06';
import { scene07 } from './scene07';
import { scene08 } from './scene08';
import type { TeachingScene } from './types';

export const scenes: readonly TeachingScene[] = [scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08];
export { scene01, scene02, scene03, scene04, scene05, scene06, scene07, scene08 };
export type * from './types';
export { lectureAreas, lectureMap, relationTypes, relationReviews, comparisonReviews, lectureTasks } from './map';
