import { createContext } from 'react';
/** Source manuscripts and independent HTML retain their approved historical status. */
export const LearningServiceConnected=createContext(false);
export const serviceMapCaption='영역을 누르면 그 장면으로 복습 이동 · 전체 개념지도와 용어사전에서 더 살펴보고 원래 학습 위치로 돌아올 수 있습니다.';
const historical='실제 서비스의 용어사전 이동·복귀는 <b>미연결</b>이다.';
const connected='React 서비스에서는 용어사전과 전체 개념지도로 이동하고 원래 학습 위치로 돌아올 수 있습니다. 독립 HTML 미리보기의 연결 상태와 구분합니다.';
export function serviceNote(text: string) {return text.replace(historical,connected);}
