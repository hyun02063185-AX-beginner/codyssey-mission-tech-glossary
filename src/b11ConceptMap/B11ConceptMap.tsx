import {MissionConceptMapEngine} from '../missionConceptMap/MissionConceptMap';
import {data,navigation} from './navigation';
import './conceptMap.css';
export default function B11ConceptMap(){return <div className="b11-concept-map"><MissionConceptMapEngine data={data} navigation={navigation}/></div>;}
