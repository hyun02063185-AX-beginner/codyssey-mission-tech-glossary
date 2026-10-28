import type {B31LectureId} from './b31StoryNavigation';

// The five original scene IDs remain stable for existing URLs and map returns.
export const lectureSlides: ReadonlyArray<{id:B31LectureId;title:string}> = [
  {id:'slide-intro',title:'왜 네트워크를 다시 배울까?'},
  {id:'slide-network',title:'네트워크 기초: 주소와 구역'},
  {id:'slide-packet',title:'패킷과 프로토콜'},
  {id:'scene-01',title:'전체 연결망 한눈에 보기'},
  {id:'scene-02',title:'패킷의 여행 직접 시연'},
  {id:'scene-03a',title:'AWS에서 다시 보기'},
  {id:'scene-03b',title:'B3-1 접속 조건 확인'},
  {id:'scene-04',title:'내 말로 설명하기'},
];
