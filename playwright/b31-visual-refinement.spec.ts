import {test,expect} from '@playwright/test';
import {mkdirSync} from 'node:fs';
const story='/#/missions/main-M05/story-map?scene=';
for(const width of [1440,390,360])for(const theme of ['dark','light'])test(`${width} ${theme}: refined visuals, packet differences, glossary and mask roundtrip`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.emulateMedia({reducedMotion:'reduce'});
  await page.addInitScript(value=>localStorage.setItem('codyssey-presentation-theme',value),theme);
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  const noOverflow=async()=>expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)).toBe(false);
  const capture=async(name:string,selector:string)=>{if(process.env.B31_REFINEMENT_CAPTURE==='1'&&theme==='dark'){mkdirSync('reports/b31-network-visual-refinement',{recursive:true});await page.locator(selector).screenshot({path:`reports/b31-network-visual-refinement/${width}-${name}.png`,animations:'disabled'})}};
  await page.goto(story+'slide-intro');await expect(page.locator('.b31-slide-lead')).toHaveText('AWS를 이해하기 위해 네트워크를 먼저 배웁니다.');
  await expect(page.getByLabel('Scene 선택',{exact:true}).locator('option')).toHaveCount(8);
  await page.goto(story+'scene-01');await expect(page.locator('.b31-overview-figure')).toHaveCount(0);
  const figure=page.locator('.b31-enterprise-overview .b31-story-figure');await expect(figure).toBeVisible();await expect(figure.locator('svg')).toHaveCount(1);
  expect(await figure.evaluate(el=>el.closest('details'))).toBeNull();await expect(page.locator('.b31-company-notes')).toContainText('업무망');
  await figure.getByRole('button',{name:'그림 확대하기'}).click();await expect(page.getByRole('dialog')).toBeVisible();await page.keyboard.press('Escape');await expect(page.getByRole('dialog')).toHaveCount(0);
  await capture('slide4','.b31-current-scene');await noOverflow();
  await page.goto(story+'scene-02');const journey=page.locator('.packet-journey');
  await expect(page.locator('.b31-packet-lesson .b31-story-art')).toHaveCount(0);
  const next=journey.getByRole('button',{name:'한 단계 진행',exact:true});
  const changed=()=>journey.locator('.pj-packet [data-changed=true]');
  await expect(changed()).toHaveCount(0);await next.click();await expect(changed()).toHaveAttribute('data-field','source');
  await expect(journey.locator('[data-field=destination]')).toHaveAttribute('data-changed','false');
  await next.click();await expect(changed()).toHaveCount(0);
  for(let step=3;step<=16;step++)await next.click();
  await expect(journey).toHaveAttribute('data-step','16');await expect(changed()).toHaveAttribute('data-field','destination');
  await expect(journey.locator('[data-packet=source]')).toHaveText('203.0.113.10:62000');
  await capture('packet-change','.pj-information');
  await journey.getByRole('button',{name:'이전 단계',exact:true}).click();await expect(journey).toHaveAttribute('data-step','15');await expect(changed()).toHaveAttribute('data-field','destination');
  await journey.getByRole('button',{name:'처음부터 재시작',exact:true}).click();await expect(journey).toHaveAttribute('data-step','0');await expect(changed()).toHaveCount(0);await noOverflow();
  await page.goto(story+'scene-03a&map=view%3Daws%26node%3Daws%253Asubnet');
  const detail=page.locator('.b31-slide-extra').filter({hasText:'기존 AWS 역할 비교 그림 더 보기'});
  await detail.locator('summary').click();const before=page.url(),overflow=await page.evaluate(()=>document.body.style.overflow);
  const trigger=page.getByRole('button',{name:'서브넷 마스크 체험하기',exact:true});await trigger.click();
  const dialog=page.getByRole('dialog');await expect(dialog).toBeVisible();
  await dialog.getByLabel('CIDR 선택').selectOption('16');await expect(dialog.locator('[data-same-network]')).toHaveAttribute('data-same-network','true');
  await expect(dialog.locator('[data-network-address=A]')).toHaveText('192.168.0.0/16');await expect(dialog.locator('[data-network-address=B]')).toHaveText('192.168.0.0/16');
  await capture('subnet-dialog','.sm-dialog');await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(trigger).toBeFocused();
  expect(page.url()).toBe(before);await expect(detail).toHaveAttribute('open','');expect(await page.evaluate(()=>document.body.style.overflow)).toBe(overflow);
  await trigger.click();await page.getByRole('button',{name:'닫고 슬라이드로 돌아가기'}).click();await expect(trigger).toBeFocused();await noOverflow();
  for(const term of ['tcp','http']){
    await page.goto('/#/terms/'+term);const art=page.locator('.rich-figure');await expect(art.locator('svg')).toHaveCount(1);
    await expect(art).toHaveAttribute('data-variant',width<=700?'mobile':'desktop');
    const outside=await art.locator('svg').evaluate(svg=>{const box=svg.getBoundingClientRect();return [...svg.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<box.left-1||r.right>box.right+1||r.top<box.top-1||r.bottom>box.bottom+1}).map(t=>t.textContent)});
    expect(outside).toEqual([]);await capture(term,'.rich-figure');await noOverflow();
  }
  await page.goto('/#/terms/cidr');const demo=page.locator('.subnet-experience');await expect(demo).toHaveCount(1);
  await expect(page.locator('[data-figure="assets/cidr-range.svg"]')).toHaveCount(1);
  for(const [prefix,mask,a,b,same] of [['16','255.255.0.0','192.168.0.0','192.168.0.0','true'],['24','255.255.255.0','192.168.1.0','192.168.2.0','false'],['26','255.255.255.192','192.168.1.0','192.168.2.0','false']]){
    await demo.getByLabel('CIDR 선택').selectOption(prefix);await expect(demo.locator('[data-subnet-mask]')).toHaveText(mask);
    await expect(demo.locator('[data-network-address=A]')).toHaveText(a+'/'+prefix);await expect(demo.locator('[data-network-address=B]')).toHaveText(b+'/'+prefix);
    await expect(demo.locator('[data-same-network]')).toHaveAttribute('data-same-network',same);
    await expect(demo.locator('[data-part=network]')).toHaveCount(Number(prefix)*2);await expect(demo.locator('[data-part=host]')).toHaveCount((32-Number(prefix))*2);
  }
  await capture('cidr','.subnet-experience');await noOverflow();expect(errors).toEqual([]);
});

test('changed packet fields briefly animate while unchanged fields stay ordinary',async({page})=>{
  await page.emulateMedia({reducedMotion:'no-preference'});await page.goto(story+'scene-02');
  const journey=page.locator('.packet-journey');await journey.getByRole('button',{name:'한 단계 진행',exact:true}).click();
  await expect(journey).toHaveAttribute('data-step','1');
  const source=journey.locator('[data-field=source]'),destination=journey.locator('[data-field=destination]');
  await expect(source).toHaveAttribute('data-changed','true');
  expect(await source.evaluate(el=>getComputedStyle(el).animationName)).toBe('pj-field-change');
  expect(await destination.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await source.evaluate(async el=>{await Promise.all(el.getAnimations().map(animation=>animation.finished))});
  expect(await source.evaluate(el=>getComputedStyle(el).boxShadow)).toBe('none');
  await journey.getByRole('button',{name:'한 단계 진행',exact:true}).click();await expect(journey).toHaveAttribute('data-step','2');
  await expect(journey.locator('[data-changed=true]')).toHaveCount(0);
});
