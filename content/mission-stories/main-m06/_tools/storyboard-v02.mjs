function required(value, field) {
  if (!value?.trim()) throw new Error(`B3-2 v0.2 원고에서 ${field}을 찾을 수 없습니다.`);
  return value.trim();
}

const REVISED = new Set(['f1-overview', 'f2-why', 'f6-context', 'f7-api']);
const R1_FIGURES = new Set(['f1-overview', 'f2-why', 'f4-subprocess', 'f5-result', 'f6-context', 'f7-api', 'f8-drafts']);

export function splitLearningCheck(markdown) {
  const separator = markdown.lastIndexOf(' → *');
  if (separator < 0 || !markdown.endsWith('*')) throw new Error('B3-2 이해 확인에 정답이 없습니다.');
  return { question: markdown.slice(0, separator), answer: markdown.slice(separator + 4, -1) };
}

const V03_FIGURES = new Set(['f2-why', 'f3-diff', 'f5-result', 'f6-context', 'f7-api', 'f8-drafts']);

function revision([file, state], version) {
  const match = file.match(/^(.*)-(desktop|mobile)\.svg$/);
  if (!match) throw new Error(`B3-2 그림 이름 오류: ${file}`);
  const [, name, device] = match;
  if (version === 'v03' && V03_FIGURES.has(name)) return [`${name}-v03-${device}.svg`, state];
  if (version !== 'v02' && R1_FIGURES.has(name)) return [`${name}-r1-${device}.svg`, state];
  const revised = REVISED.has(name) || (name === 'f4-subprocess' && device === 'desktop');
  return [revised ? `${name}-v02-${device}.svg` : file, state];
}

/** Explanations and revised copy are read directly from the authored Markdown. */
export function lessonFromStoryboard(source, markdown, version = 'v02') {
  const text = markdown.replace(/\r\n/g, '\n');
  const sections = [...text.matchAll(/^### (S\d-\d) · (.+)\n([\s\S]*?)(?=^#{2,3} |$(?![\s\S]))/gm)];
  const ids = source.screens.map(screen => screen.id);
  if (sections.map(section => section[1]).join('|') !== ids.join('|')) {
    throw new Error('B3-2 v0.2 원고와 기존 화면 ID 순서가 다릅니다.');
  }

  const matches = [...text.matchAll(/^\| (S\d-\d) \| [^|]+ \| [^|]+ \| ([^|]+) \| ([^|]+) \|$/gm)];
  if (matches.map(row => row[1]).join('|') !== ids.join('|')) {
    throw new Error('B3-2 v0.2 제목·메시지 표의 화면 ID 순서가 다릅니다.');
  }

  const guideLinks = Object.fromEntries([...text.matchAll(/^\[(g\d+)\]: (https:\/\/\S+)$/gm)].map(([, id, href]) => [id, href]));
  const screens = source.screens.map((screen, index) => {
    const [, id, title, block] = sections[index];
    const [, , tableTitle, message] = matches[index];
    if (title !== tableTitle.trim()) throw new Error(`${id} 제목이 대응표와 다릅니다.`);
    const guides = [...required(block.match(/^\*\*더 읽기\*\* (.+)$/m)?.[1], `${id} 더 읽기`).matchAll(/\[([^\]]+)\]\[(g\d+)\]/g)]
      .map(([, label, key]) => ({ label, href: required(guideLinks[key], `${id} ${key} 링크`) }));
    if (!guides.length) throw new Error(`${id} 해설 가이드 연결이 없습니다.`);
    const check = version !== 'v02' && block.match(/^\*\*(이해 확인|Scene 3 이해 확인)\*\* (.+)$/m);
    const wrapUp = version !== 'v02' && block.match(/^\*\*마무리 · 스스로 설명하기\*\* (.+)$/m);
    return {
      ...screen,
      technology: block.match(/^\*\*학습 기술\*\* (.+)$/m)?.[1] ?? screen.technology,
      check: check ? { ...splitLearningCheck(check[2]), label: check[1] } : null,
      wrapUp: wrapUp ? splitLearningCheck(wrapUp[1]) : null,
      title,
      message: required(message, `${id} 핵심 메시지`),
      caption: required(block.match(/^\*\*화면 설명\*\* (.+)$/m)?.[1], `${id} 화면 설명`),
      explanation: required(block.match(/^\*\*화면 해설\*\*\n\n([\s\S]+?)(?=\n\n\*\*더 읽기\*\*)/m)?.[1], `${id} 화면 해설`),
      explanationGuides: guides,
      practice: version === 'v03' ? required(block.match(/^\*\*실습으로 확인하기\*\* (.+)$/m)?.[1], `${id} 실습 연결`) : undefined,
      desktop: revision(screen.desktop, version),
      mobile: revision(screen.mobile, version),
    };
  });

  const goals = text.match(/^\*\*학습 목표\*\*\n\n((?:\d+\. .+\n)+)/m)?.[1];
  const scenes = Object.fromEntries(Object.entries(source.scenes).map(([id, scene]) => {
    const row = text.match(new RegExp(`^\\| ${id} \\| ([^|]+) \\| ([^|]+) \\| ([^|]+) \\|$`, 'm'));
    return [id, {
      ...scene,
      title: required(row?.[1], `Scene ${id} 제목`),
      question: required(row?.[2], `Scene ${id} 학습 질문`),
    }];
  }));
  return {
    ...source,
    intro: {
      ...source.intro,
      title: required(text.match(/^# B3-2 미션 스토리 v0\.[23] — (.+)$/m)?.[1], '강의 제목'),
      subtitle: required(text.match(/^\*\*부제\*\* (.+)$/m)?.[1], '부제'),
      question: required(text.match(/^\*\*핵심 질문\*\* (.+)$/m)?.[1], '핵심 질문'),
      draftDefinition: required(text.match(/^\*\*초안 안내\*\* (.+)$/m)?.[1], '초안 안내'),
      learningGuide: text.match(/^\*\*학습 안내\*\* (.+)$/m)?.[1],
      practice: version === 'v03' ? required(text.match(/^\*\*실습으로 확인하기\*\* (.+)$/m)?.[1], '인트로 실습 연결') : undefined,
      goals: required(goals, '학습 목표').split('\n').map(goal => goal.replace(/^\d+\. /, '')),
      desktop: revision(source.intro.desktop, version),
      mobile: revision(source.intro.mobile, version),
    },
    scenes,
    screens,
  };
}
