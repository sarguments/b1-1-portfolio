'use strict';

// onclick 대신 여기서 묶는다. defer + DOMContentLoaded라 순서 보장된다.
document.addEventListener('DOMContentLoaded', () => {
  // 테마 버튼 1개 + 테마값이 붙는 html 1개.
  const themeButton = document.querySelector('#theme-toggle');
  const root = document.documentElement;

  // 화면을 결정하는 값은 한 곳에. 이벤트는 값만 바꾸고 적용 함수가 그린다.
  const STATE = {
    theme: root.getAttribute('data-theme') || 'light',
    menuOpen: false,
    repos: [],
    reposFilter: '전체',
  };

  // 적용: 테마 상태값을 화면에 반영한다.
  function applyTheme() {
    root.setAttribute('data-theme', STATE.theme);
    localStorage.setItem('user-theme', STATE.theme);
    themeButton.textContent = STATE.theme === 'dark' ? '라이트 모드' : '다크 모드';
  }

  // 클릭 1번 = 뒤집기 → 적용.
  themeButton.addEventListener('click', () => {
    STATE.theme = STATE.theme === 'dark' ? 'light' : 'dark';
    applyTheme();
  });
  applyTheme();

  // 메뉴 버튼 1개 + 여닫을 nav 1개.
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('nav');

  // 적용: 메뉴 상태값을 화면에 반영한다.
  function applyMenu() {
    nav.classList.toggle('active', STATE.menuOpen);
    menuButton.textContent = STATE.menuOpen ? '닫기' : '메뉴';
  }

  // 클릭 1번 = 상태 뒤집기 → 적용.
  menuButton.addEventListener('click', () => {
    STATE.menuOpen = !STATE.menuOpen;
    applyMenu();
  });

  // 1. 집기: 위로 버튼 1개
  const topButton = document.querySelector('#top-button');

  // 2. 스크롤하면: 300px 넘었는지 보고 show 표시를 붙였다 뗐다 한다.
  // 60px 넘으면 nav에 scrolled 표시를 붙여 배경색을 바꾼다.
  window.addEventListener('scroll', () => {
    const over = window.scrollY > 300;
    topButton.classList.toggle('show', over);
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // 3. 클릭하면: 맨 위로 미끄러지듯 간다
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 등장 감시: 구역이 20% 보이면 visible 표시를 붙인다.
  // scroll 직접 계산 대신 브라우저 감시 API를 쓴다.
  const watcher = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // 보이는 중이면 표시 붙이고 감시 종료한다.
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        watcher.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  // reveal 표시 붙은 구역 전부 감시 시작한다.
  document.querySelectorAll('.reveal').forEach((el) => watcher.observe(el));

  // 폼 검증: 막고 검사하고 통과하면 성공 문구만 남긴다.
  const form = document.querySelector('#contact form');
  const userName = document.querySelector('#contact-name');
  const userEmail = document.querySelector('#contact-email');
  const userMessage = document.querySelector('#contact-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // 안 막으면 검사 결과가 새로고침에 날아간다.
    let valid = true;

    // 이름: 비었으면 오류, 아니면 지운다.
    if (userName.value.trim() === '') {
      document.querySelector('#name-error').textContent = '이름을 입력해주세요.';
      valid = false;
    } else {
      document.querySelector('#name-error').textContent = '';
    }

    // 이메일: "문자@문자.문자" 형태만 통과.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value.trim())) {
      document.querySelector('#email-error').textContent = '올바른 이메일 형식을 입력해주세요.';
      valid = false;
    } else {
      document.querySelector('#email-error').textContent = '';
    }

    // 메시지: 비었으면 오류, 아니면 지운다.
    if (userMessage.value.trim() === '') {
      document.querySelector('#message-error').textContent = '메시지를 입력해주세요.';
      valid = false;
    } else {
      document.querySelector('#message-error').textContent = '';
    }

    // 전부 맞으면 성공 문구 확정하고 비운다.
    if (valid) {
      document.querySelector('#form-result').textContent = '메시지를 받았습니다.';
      form.reset();
    }
  });

  // 입력하면 해당 오류 문구를 바로 지운다.
  userName.addEventListener('input', () => {
    document.querySelector('#name-error').textContent = '';
  });
  userEmail.addEventListener('input', () => {
    document.querySelector('#email-error').textContent = '';
  });
  userMessage.addEventListener('input', () => {
    document.querySelector('#message-error').textContent = '';
  });

  // 저장소 목록. fetch는 망 단절 때만 실패해서 ok 검사가 필수다.
  const reposStatus = document.querySelector('#repos-status');
  const reposList = document.querySelector('#repos-list');
  const reposRetry = document.querySelector('#repos-retry');
  const reposURL = 'https://api.github.com/users/sarguments/repos';

  // 목록 그리기: 저장 후 필터로 고르고 카드로 바꾼다.
  function renderRepos(repos) {
    STATE.repos = repos;
    const shown = repos.filter((repo) => STATE.reposFilter === '전체' || (repo.language || '기타') === STATE.reposFilter);
    reposList.innerHTML = '';
    if (shown.length === 0) {
      reposStatus.textContent = '표시할 프로젝트가 없습니다.';
      return;
    }
    reposStatus.textContent = '';
    shown
      .map((repo) => {
        // 구조분해: 객체에서 값을 꺼내 변수에 담는다.
        const { name, html_url: url, description } = repo;
        const desc = description || '설명 없음';
        return `<article><a href="${url}">${name}</a><p>${desc}</p></article>`;
      })
      .forEach((html) => {
        reposList.insertAdjacentHTML('beforeend', html);
      });
  }

  // 필터 그리기: 전체 + 저장소에 있는 언어만 버튼으로 만든다.
  // 누르면 필터 상태를 바꾸고 목록을 다시 그린다.
  function renderFilters(repos) {
    const filters = document.querySelector('#repos-filters');
    filters.innerHTML = '';
    const langs = ['전체', ...new Set(repos.map((repo) => repo.language || '기타'))];
    langs.forEach((lang) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = lang;
      btn.addEventListener('click', () => {
        STATE.reposFilter = lang;
        renderRepos(STATE.repos);
      });
      filters.appendChild(btn);
    });
  }

  // 불러오기: 로딩 표시 후 fetch, ok 검사, 상태별 분기다.
  async function loadRepos() {
    reposStatus.textContent = '저장소 목록을 불러오는 중입니다.';
    reposList.innerHTML = '';
    reposRetry.hidden = true;
    try {
      const res = await fetch(reposURL);
      if (!res.ok) {
        if (res.status === 403) throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        if (res.status === 404) throw new Error('사용자를 찾을 수 없습니다.');
        throw new Error(`로드 실패 (HTTP ${res.status})`);
      }
      renderRepos(await res.json());
      renderFilters(STATE.repos);
    } catch (err) {
      // 망 단절이면 err로 바로 온다. 404·403은 위에서 만든 메시지다.
      reposStatus.textContent = err.message;
      reposRetry.hidden = false;
    }
  }

  // 다시 시도 버튼과 첫 진입에 연결한다.
  reposRetry.addEventListener('click', loadRepos);
  loadRepos();
});
