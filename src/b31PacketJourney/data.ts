// Ported from the Owner handoff source; topology, 26 hops, packet values and
// device decisions are kept separate from playback and React rendering.
export type NodeId = 'pc' | 'home' | 'r1' | 'r2' | 'r3' | 'r4' | 'dns' | 'edge' | 'firewall' | 'web';
export type Kind = 'dns' | 'request' | 'response';
export type Phase = { name: string; kind: Kind; route: NodeId[]; protocol: string; payload: string };
export type Step = { p: number; node: NodeId; hop: number; kind: Kind };

export const definitions = {
  pc: { label: '내 PC', sub: '192.168.0.20', width: 126 },
  home: { label: '공유기', sub: '라우팅 · NAT', width: 124 },
  r1: { label: '라우터 R1', sub: '다음 경로 선택', width: 108 },
  r2: { label: '라우터 R2', sub: '다음 경로 선택', width: 108 },
  r3: { label: '라우터 R3', sub: '다음 경로 선택', width: 108 },
  r4: { label: '라우터 R4', sub: '다음 경로 선택', width: 108 },
  dns: { label: 'DNS 서버', sub: '192.0.2.53', width: 116 },
  edge: { label: '회사 경계 라우터', sub: '경로 선택', width: 142 },
  firewall: { label: '방화벽 · NAT', sub: 'HTTP 80 허용', width: 142 },
  web: { label: 'DMZ 웹 서버', sub: '10.20.10.20', width: 142 }
};
export const links: [NodeId, NodeId][] = [['pc','home'],['home','r1'],['r1','r2'],['r1','r3'],['r2','r3'],['r2','r4'],['r3','r4'],['r2','dns'],['r4','edge'],['edge','firewall'],['firewall','web']];
export const phases: Phase[] = [
  { name:'DNS 조회', kind:'dns', route:['pc','home','r1','r2','dns'], protocol:'UDP · DNS', payload:'example.com의 A 레코드 조회' },
  { name:'DNS 응답', kind:'dns', route:['dns','r2','r1','home','pc'], protocol:'UDP · DNS', payload:'example.com → 198.51.100.80' },
  { name:'웹 요청', kind:'request', route:['pc','home','r1','r2','r4','edge','firewall','web'], protocol:'TCP · HTTP', payload:'GET / (대표 데이터 패킷)' },
  { name:'웹 응답', kind:'response', route:['web','firewall','edge','r4','r3','r1','home','pc'], protocol:'TCP · HTTP', payload:'200 OK (대표 데이터 패킷)' }
];
export const steps: Step[] = [];
phases.forEach((phase, p) => phase.route.forEach((node, hop) => steps.push({ p, node, hop, kind:phase.kind })));
export function packet(step: Step) {
  const { p, hop } = step;
  if (p === 0) return { source:hop >= 1 ? '203.0.113.10:61000' : '192.168.0.20:53000', destination:'192.0.2.53:53' };
  if (p === 1) return { source:'192.0.2.53:53', destination:hop >= 3 ? '192.168.0.20:53000' : '203.0.113.10:61000' };
  if (p === 2) return { source:hop >= 1 ? '203.0.113.10:62000' : '192.168.0.20:50000', destination:hop >= 6 ? '10.20.10.20:80' : '198.51.100.80:80' };
  return { source:hop >= 1 ? '198.51.100.80:80' : '10.20.10.20:80', destination:hop >= 6 ? '192.168.0.20:50000' : '203.0.113.10:62000' };
}

export function description(s: Step) {
  const { p, node, hop } = s;
  const next = phases[p].route[hop + 1];
  if (node === 'pc') return ['PC가 설정된 DNS 서버로 도메인 조회를 보냅니다.','PC가 서버 IP를 확인했습니다. 다음은 별도의 웹 접속입니다.','PC가 확인한 IP로 웹 접속을 시작합니다.','웹 응답 도착 · 인터넷에서는 요청과 다른 경로를 거쳤습니다.'][p];
  if (node === 'home') return p === 0 || p === 2 ? '공유기 NAT · 출발지 사설 IP·포트를 공인 IP·포트로 변환합니다.' : '공유기 NAT · 기록된 매핑으로 목적지 IP·포트를 PC 주소로 복원합니다.';
  if (node === 'dns') return p === 0 ? 'DNS가 캐시에서 도메인에 대응하는 IP를 찾습니다.' : 'DNS가 IP 정보를 응답합니다. 웹 요청을 대신 보내지는 않습니다.';
  if (node === 'firewall') return p === 2 ? '방화벽이 HTTP를 허용하고 목적지를 DMZ 사설 IP로 변환합니다.' : '방화벽이 기존 연결의 응답을 허용하고 출발지 공인 IP를 복원합니다.';
  if (node === 'web') return p === 2 ? 'DMZ 웹 서버가 HTTP 요청을 받았습니다.' : '웹 서버가 PC를 향해 HTTP 응답 데이터를 보냅니다.';
  if (node === 'edge') return p === 2 ? '회사 경계 라우터가 방화벽 쪽으로 전달합니다. 주소 변환은 하지 않습니다.' : '회사 경계 라우터가 외부 목적지의 응답을 R4로 전달합니다.';
  if (node === 'r4' && p === 3) return 'R4는 PC 쪽 목적지 경로를 R3로 선택합니다. 요청 때와 다른 경로입니다.';
  return definitions[node].label + '가 목적지 IP의 경로표를 보고 ' + (next ? definitions[next].label : '수신 장비') + '로 전달합니다.';
}

export function decision(s: Step) {
  const { p, node } = s;
  const target = packet(s).destination.split(':')[0];
  const rows: [string, string, boolean][] = [];
  if (/^r[1-4]$/.test(node)) {
    const routes = {
      r1:[['192.0.2.0/24','R2'],['198.51.100.0/24','R2'],['203.0.113.0/24','공유기']],
      r2:[['192.0.2.0/24','DNS 서버'],['198.51.100.0/24','R4'],['203.0.113.0/24','R1']],
      r3:[['198.51.100.0/24','R4'],['203.0.113.0/24','R1']],
      r4:[['198.51.100.0/24','회사 경계'],['203.0.113.0/24','R3'],['192.0.2.0/24','R2']]
    };
    routes[node as keyof typeof routes].forEach(([prefix, next]) => rows.push([prefix, next, target.startsWith(prefix.split('.').slice(0,3).join('.') + '.')]));
    return {title:definitions[node].label + '의 경로표',rows};
  }
  if (node === 'edge') return {title:'회사 경계 라우터의 경로표',rows:[['198.51.100.0/24','방화벽',p===2],['203.0.113.0/24','R4',p===3]]};
  if (node === 'home') return {title:'공유기의 처리',rows:[[p===0||p===2 ? '출발지 사설 주소' : '기존 NAT 매핑',p===0||p===2 ? '출발지 공인 주소로 변환' : '목적지 PC 주소로 복원',true],[p===0||p===2 ? '인터넷 목적지' : '집 내부 목적지',p===0||p===2 ? '다음 경로: R1' : '다음 전달: PC',false]]};
  if (node === 'firewall') return {title:'방화벽의 처리',rows:[[p===2?'신규 TCP 80 요청':'허용된 연결의 응답','허용',true],[p===2?'목적지 공인 주소':'출발지 사설 주소',p===2?'10.20.10.20으로 변환':'198.51.100.80으로 복원',false]]};
  if (node === 'dns') return {title:'DNS 서버의 처리',rows:[['도메인 example.com','캐시에서 A 레코드 확인',true],['IP 조회 결과','198.51.100.80',false]]};
  if (node === 'web') return {title:'웹 서버의 처리',rows:[['수신 TCP 포트','80 · 웹 서버',true],['HTTP 요청','페이지 데이터 응답',false]]};
  return {title:'PC의 처리',rows:p===0 ? [['도메인의 IP 미확인','DNS 조회 생성',true],['설정된 DNS 서버','192.0.2.53',false]] : p===1 ? [['DNS 조회 결과','198.51.100.80',true],['다음 통신','해당 IP로 HTTP 요청',false]] : p===2 ? [['웹 서버 주소','198.51.100.80:80',true],['게이트웨이','공유기로 전달',false]] : [['HTTP 응답','200 OK · 페이지 데이터',true],['인터넷 구간','요청 R2 / 응답 R3',false]]};
}

export function natChange(step: Step) {
  if (step.node !== 'home' && step.node !== 'firewall') return null;
  const before = packet({ ...step, hop: step.hop - 1 });
  const after = packet(step);
  return { before, after, field: before.source !== after.source ? 'source' as const : 'destination' as const };
}

export function routeReason(step: Step) {
  const selected = decision(step).rows.find(row => row[2]);
  const destination = packet(step).destination.split(':')[0];
  if (/^r[1-4]$/.test(step.node) || step.node === 'edge') {
    return `목적지 ${destination}은 이 경로표의 ${selected?.[0]}에 포함됩니다. 따라서 다음 전달 방향으로 ${selected?.[1]}를 선택합니다.`;
  }
  return description(step);
}

export type Point = [number, number];
export function topology(width: number) {
  const w = Math.max(320, width), compact = w < 680;
  const sx = (x: number) => x * w / 736;
  const positions: Record<NodeId, Point> = compact
    ? {pc:[w*.25,70],home:[w*.75,70],r1:[w*.5,206],r2:[w*.23,306],r3:[w*.77,306],dns:[w*.23,409],r4:[w*.77,409],edge:[w*.65,535],firewall:[w*.65,617],web:[w*.65,705]}
    : {pc:[sx(78),96],home:[sx(222),96],r1:[sx(362),96],r2:[sx(506),96],dns:[sx(654),96],r3:[sx(424),235],r4:[sx(654),235],edge:[sx(654),395],firewall:[sx(440),395],web:[sx(210),395]};
  const zones = compact
    ? [[8,16,w-16,100,'방문자 네트워크'],[8,151,w-16,300,'인터넷 · 여러 경로'],[8,478,w-16,264,'회사 네트워크'],[w*.65-80,660,160,76,'DMZ']]
    : [[8,36,sx(286)-8,110,'방문자 네트워크'],[sx(298),36,w-sx(298)-8,260,'인터넷 · 여러 경로'],[sx(98),328,w-sx(98)-8,130,'회사 네트워크'],[sx(210)-85,350,170,92,'DMZ']];
  return {width:w,height:compact?752:480,positions,zones:zones as [number,number,number,number,string][]};
}

// Retain all completed phases; dim them and distinguish response traces by dashes.
export function traces(index: number) {
  const current = steps[index];
  return phases.flatMap((phase,p) => {
    const count = p < current.p ? phase.route.length : p === current.p ? current.hop + 1 : 0;
    return phase.route.slice(1,count).map((node,i) => ({from:phase.route[i],to:node,p,kind:phase.kind,current:p===current.p}));
  });
}
