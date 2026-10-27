// 김코디 자기소개 — 교육용 예시. 이 파일은 기능 하나만 맡는다: 메뉴 버튼을 누를 때마다 메뉴를 열고 닫는다.
// HTML 파일은 바꾸지 않는다. 브라우저 안의 DOM에서 nav의 is-open 이름표와 버튼의 aria-expanded 값만 바꾼다.
const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

menuButton.addEventListener('click', () => {
  if (siteNav.classList.contains('is-open')) {
    siteNav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  } else {
    siteNav.classList.add('is-open');
    menuButton.setAttribute('aria-expanded', 'true');
  }
});
