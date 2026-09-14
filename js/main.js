'use strict';

// 재할당하지 않는 값은 const가 기본이다. var는 쓰지 않는다.
const statusMessage = 'B1-1 skeleton loaded';

// HTML에 onclick을 쓰지 않고 여기서 이벤트를 연결한다.
// DOMContentLoaded는 "HTML 해석이 끝난 뒤"를 보장하는 신호다.
// (defer로 연결했으므로 순서도 보장된다)
document.addEventListener('DOMContentLoaded', () => {
  // 집기: 테마 버튼 1개 + 테마값이 붙는 html 1개.
  const themeButton = document.querySelector('#theme-toggle');
  const root = document.documentElement;

  // 클릭 1번 = 읽기 → 뒤집기 → 붙이기+저장+글자 바꾸기.
  themeButton.addEventListener('click', () => {
    // 읽기: 선주입이 붙여놓은 현재값. 첫 클릭부터 정확하다.
    const current = root.getAttribute('data-theme');
    // 뒤집기: dark면 light, 아니면 dark. ? : 는 한 줄 분기다.
    const next = current === 'dark' ? 'light' : 'dark';

    // 붙이기: 화면 전체가 새 변수값으로 바뀐다.
    root.setAttribute('data-theme', next);
    // 저장하기: 키는 선주입이 읽는 키와 같아야 복원이 된다.
    localStorage.setItem('user-theme', next);
    // 글자 바꾸기: 다음 동작이 아니라 현재 상태를 보여준다.
    themeButton.textContent = next === 'dark' ? '라이트 모드' : '다크 모드';
  });

  // 집기: 메뉴 버튼 1개 + 여닫을 nav 1개.
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('nav');

  // 클릭 1번 = open 표시 붙였다 뗐다 + 글자 바꾸기.
  // toggle은 붙었는지(true/false)를 돌려준다.
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('open');
    menuButton.textContent = opened ? '닫기' : '메뉴';
  });

  // 1. 집기: 위로 버튼 1개
  const topButton = document.querySelector('#top-button');

  // 2. 스크롤하면: 300px 넘었는지 보고 show 표시를 붙였다 뗐다 한다
  window.addEventListener('scroll', () => {
  const over = window.scrollY > 300;
  topButton.classList.toggle('show', over);
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

  // 폼 검증: 제출 막고 빈값·형식 검사한다.
  // 통과하면 성공 문구만 남긴다. 실제 전송은 안 한다.
  const form = document.querySelector('#contact form');
  const userName = document.querySelector('#contact-name');
  const userEmail = document.querySelector('#contact-email');
  const userMessage = document.querySelector('#contact-message');

  form.addEventListener('submit', (event) => {
    // 기본 전송(새로고침)을 막는다. 없으면 검사 결과가 날아간다.
    event.preventDefault();
    let valid = true;

    // 이름: 비었으면 오류, 아니면 지운다.
    if (userName.value.trim() === '') {
      document.querySelector('#name-error').textContent = '이름을 입력해주세요.';
      valid = false;
    } else {
      document.querySelector('#name-error').textContent = '';
    }

    // 이메일: "문자@문자.문자" 형태만 통과시킨다.
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

    // 전부 맞으면 성공 문구를 확정하고 입력칸을 비운다.
    if (valid) {
      document.querySelector('#form-result').textContent = '메시지를 받았습니다.';
      form.reset();
    }
  });

  // 저장소 목록: 상태 1개가 화면을 결정한다.
  // 로딩 → 성공·빈 결과·오류. 실패해도 망 단절이 아니면 ok 검사로 잡는다.
  const reposStatus = document.querySelector('#repos-status');
  const reposList = document.querySelector('#repos-list');
  const reposRetry = document.querySelector('#repos-retry');
  const reposURL = 'https://api.github.com/users/sarguments/repos';

  // 목록 그리기: 성공 응답을 카드로 바꾼다. 비어 있으면 빈 결과 안내다.
  function renderRepos(repos) {
    reposList.innerHTML = '';
    if (repos.length === 0) {
      reposStatus.textContent = '공개 저장소가 없습니다.';
      return;
    }
    reposStatus.textContent = '';
    repos
      .map((repo) => {
        const name = repo.name;
        const desc = repo.description || '설명 없음';
        const url = repo.html_url;
        return `<article><a href="${url}">${name}</a><p>${desc}</p></article>`;
      })
      .forEach((html) => {
        reposList.insertAdjacentHTML('beforeend', html);
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
