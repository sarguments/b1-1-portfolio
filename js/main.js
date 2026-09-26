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
    // 목록을 9개 제한으로 접어 둘지, 전부 펼칠지
    reposExpanded: false,
  };

  // STATE는 화면 상태의 단일 진실 원천이다. 호출부는 새 patch 객체를 전달한다.
  // 현재는 Object.assign으로 병합하고, 불변 복사 방향으로 확장할 수 있게 한다.
  function setState(patch) {
    Object.assign(STATE, patch);
    console.log('[B1-1 STATE]', patch);
  }

  // 적용: 테마 상태값을 화면에 반영한다.
  function applyTheme() {
    root.setAttribute('data-theme', STATE.theme);
    try {
      localStorage.setItem('user-theme', STATE.theme);
    } catch {
      // 저장하지 못하면 대체값으로 메모리 상태만 유지한다.
    }
    themeButton.textContent = STATE.theme === 'dark' ? '라이트 모드' : '다크 모드';
  }

  // 클릭 1번 = 뒤집기 → 적용.
  themeButton.addEventListener('click', () => {
    setState({ theme: STATE.theme === 'dark' ? 'light' : 'dark' });
    applyTheme();
  });
  applyTheme();

  // 메뉴 버튼 1개 + 여닫을 nav 1개.
  const menuButton = document.querySelector('#menu-button');
  const nav = document.querySelector('nav');

  // 적용: 메뉴 상태값을 화면에 반영한다.
  // 버튼 이름은 '메뉴'로 고정. 열림/닫힘은 aria-expanded(스크린리더) + CSS 아이콘 형태로 전달.
  function applyMenu() {
    nav.classList.toggle('active', STATE.menuOpen);
    menuButton.setAttribute('aria-expanded', String(STATE.menuOpen));
  }

  // 클릭 1번 = 상태 뒤집기 → 적용.
  menuButton.addEventListener('click', () => {
    setState({ menuOpen: !STATE.menuOpen });
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
  }, { threshold: [0, 0.2] });

  // reveal 표시 붙은 구역 전부 감시 시작한다.
  document.querySelectorAll('.reveal').forEach((el) => watcher.observe(el));

  // 폼 검증: 막고 검사하고 통과하면 성공 문구만 남긴다.
  const form = document.querySelector('#contact form');
  const userName = document.querySelector('#contact-name');
  const userEmail = document.querySelector('#contact-email');
  const userMessage = document.querySelector('#contact-message');
  const nameError = document.querySelector('#name-error');
  const emailError = document.querySelector('#email-error');
  const messageError = document.querySelector('#message-error');

  function setFieldError(input, errorEl, msg) {
    errorEl.textContent = msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearFieldError(input, errorEl) {
    errorEl.textContent = '';
    input.setAttribute('aria-invalid', 'false');
  }

  // 필드 검사 3종: 오류 문구를 갱신하고 통과 여부를 돌려준다.
  function checkName() {
    const ok = userName.value.trim() !== '';
    if (ok) {
      clearFieldError(userName, nameError);
    } else {
      setFieldError(userName, nameError, '이름을 입력해주세요.');
    }
    return ok;
  }

  function checkEmail() {
    // "문자@문자.문자" 형태만 통과.
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value.trim());
    if (ok) {
      clearFieldError(userEmail, emailError);
    } else {
      setFieldError(userEmail, emailError, '올바른 이메일 형식을 입력해주세요.');
    }
    return ok;
  }

  function checkMessage() {
    const ok = userMessage.value.trim() !== '';
    if (ok) {
      clearFieldError(userMessage, messageError);
    } else {
      setFieldError(userMessage, messageError, '메시지를 입력해주세요.');
    }
    return ok;
  }

  let submitAttempted = false;

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // 안 막으면 검사 결과가 새로고침에 날아간다.
    submitAttempted = true;
    // 배열을 먼저 만들어 3필드를 모두 검사한 뒤 통과 여부를 합친다.
    const valid = [checkName(), checkEmail(), checkMessage()].every((ok) => ok);

    if (valid) {
      submitAttempted = false;
      document.querySelector('#form-result').textContent = '메시지를 받았습니다.';
      form.reset();
    }
  });

  // 첫 제출 실패 전에는 입력 시 오류를 지우기만 하고, 실패 후에는 그 필드만 즉시 재검사한다.
  userName.addEventListener('input', () => {
    if (submitAttempted) {
      checkName();
    } else {
      clearFieldError(userName, nameError);
    }
  });
  userEmail.addEventListener('input', () => {
    if (submitAttempted) {
      checkEmail();
    } else {
      clearFieldError(userEmail, emailError);
    }
  });
  userMessage.addEventListener('input', () => {
    if (submitAttempted) {
      checkMessage();
    } else {
      clearFieldError(userMessage, messageError);
    }
  });

  // 저장소 목록. fetch는 망 단절 때만 실패해서 ok 검사가 필수다.
  const reposStatus = document.querySelector('#repos-status');
  const reposList = document.querySelector('#repos-list');
  const reposRetry = document.querySelector('#repos-retry');
  const reposFilters = document.querySelector('#repos-filters');
    const reposMore = document.querySelector('#repos-more');
  const featuredStatus = document.querySelector('#featured-status');
  const featuredList = document.querySelector('#featured-list');

  // 주요 프로젝트로 고정할 저장소 이름. 여기 올린 저장소는 아래 목록에서 빠진다.
  const PINNED = [
    'smart-factory-sim', // 협동로봇 셀 시뮬레이터(웹 three.js)
    'b1-1-portfolio', // 스마트팩토리·로봇 소재 자기소개 페이지(코딧세이 B1-1)
    'codyssey-e1-3', // Mini NPU 시뮬레이터(MAC 연산 유사도)
    'codyssey-e1-1', // 터미널·Docker 개발 워크스테이션 구축 기록
  ];
  // 아래 목록에 한 번에 보여 줄 저장소 수. 나머지는 '전체 보기'로 펼친다.
  const REPO_LIMIT = 9;

  // 기본 30개만 오면 나중에 만든 저장소가 목록에서 빠진다.
  // 전체 저장소를 최근 수정순으로 받아 최신 작업이 위에 오게 한다.
  const reposURL = 'https://api.github.com/users/sarguments/repos?per_page=100&sort=updated&direction=desc';

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 주요 프로젝트 그리기: 손으로 고른 저장소만 언어·주제와 함께 크게 보여 준다.
  // 설명과 주제는 같은 API 응답에서 꺼내므로 GitHub 저장소 정보와 어긋나지 않는다.
  function renderPinned(repos) {
    featuredList.innerHTML = '';
    const cards = PINNED.map((name) => repos.find((repo) => repo.name === name)).filter(Boolean);
    if (cards.length === 0) {
      featuredStatus.textContent = '';
      return;
    }
    featuredStatus.textContent = '';
    cards.forEach((repo) => {
      const { name, html_url: url, description, language, topics } = repo;
      const tags = [language, ...(topics || [])]
        .filter(Boolean)
        .slice(0, 5)
        .map((tag) => `<li>${escapeHTML(tag)}</li>`)
        .join('');
      featuredList.insertAdjacentHTML(
        'beforeend',
        `<article><span class="badge">고정</span><h3><a href="${escapeHTML(url)}">${escapeHTML(name)}</a></h3>` +
          `<p>${escapeHTML(description || '설명 없음')}</p><ul class="tags">${tags}</ul></article>`,
      );
    });
  }

  // 목록 그리기: 고정한 저장소를 빼고, 필터로 고른 뒤 REPO_LIMIT개까지만 보여 준다.
  function renderRepos(repos) {
    STATE.repos = repos;
    const rest = repos.filter((repo) => !PINNED.includes(repo.name));
    const matched = rest.filter((repo) => STATE.reposFilter === '전체' || (repo.language || '기타') === STATE.reposFilter);
    const shown = STATE.reposExpanded ? matched : matched.slice(0, REPO_LIMIT);
    reposList.innerHTML = '';
    if (shown.length === 0) {
      reposStatus.textContent = '표시할 프로젝트가 없습니다.';
      reposMore.hidden = true;
      return;
    }
    reposStatus.textContent = `최근 작업 순으로 ${shown.length}개를 보여 줍니다. 전체 ${matched.length}개.`;
    shown
      .map((repo) => {
        // 구조분해: 객체에서 값을 꺼내 변수에 담는다.
        const { name, html_url: url, description } = repo;
        const desc = description || '설명 없음';
        return `<article><a href="${escapeHTML(url)}">${escapeHTML(name)}</a><p>${escapeHTML(desc)}</p></article>`;
      })
      .forEach((html) => {
        reposList.insertAdjacentHTML('beforeend', html);
      });
    reposMore.hidden = matched.length <= REPO_LIMIT;
    reposMore.textContent = STATE.reposExpanded ? `${REPO_LIMIT}개만 보기` : `전체 보기 (${matched.length}개)`;
  }

  // 필터 그리기: 전체 + 저장소에 있는 언어만 버튼으로 만든다.
  // 버튼마다 리스너를 달지 않는다. 버튼은 값(data-filter)만 싣고, 클릭은 아래 위임 리스너 하나가 받는다.
  function renderFilters(repos) {
    const filters = document.querySelector('#repos-filters');
    filters.innerHTML = '';
    // 아래 목록에 실제로 나오는 저장소만 언어 후보로 삼는다
    const rest = repos.filter((repo) => !PINNED.includes(repo.name));
    const langs = ['전체', ...new Set(rest.map((repo) => repo.language || '기타'))];
    langs.forEach((lang) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = lang;
      btn.dataset.filter = lang;
      filters.appendChild(btn);
    });
  }

  // 이벤트 위임: 리스너는 부모(#repos-filters)에 하나. 클릭은 자식 버튼에서 여기로 올라오고,
  // closest로 '어떤 버튼이 눌렸나'만 확인한다. 목록을 다시 그려도 다시 붙일 게 없다.
  document.querySelector('#repos-filters').addEventListener('click', (event) => {
    const btn = event.target.closest('button[data-filter]');
    if (!btn) return;
    setState({ reposFilter: btn.dataset.filter });
    renderRepos(STATE.repos);
  });

  // 재시도 정책: 수동 재시도 버튼만 제공하고 자동 재시도하지 않는다.
  // 요청은 8초 뒤 중단하며, 결과는 캐싱하지 않는다.
  async function loadRepos() {
    reposStatus.textContent = '저장소 목록을 불러오는 중입니다.';
    reposList.innerHTML = '';
    reposRetry.hidden = true;
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 8000);
    try {
      const res = await fetch(reposURL, { signal: controller.signal });
      if (!res.ok) {
        if (res.status === 403) throw new Error('API 호출 한도를 초과했습니다. 잠시 후 다시 시도해주세요.');
        if (res.status === 404) throw new Error('사용자를 찾을 수 없습니다.');
        throw new Error(`로드 실패 (HTTP ${res.status})`);
      }
      const repos = await res.json();
      renderPinned(repos);
      renderRepos(repos);
      renderFilters(STATE.repos);
    } catch (err) {
      // 망 단절이면 err로 바로 온다. 404·403은 위에서 만든 메시지다.
      reposStatus.textContent = timedOut ? '요청 시간이 초과됐습니다. 다시 시도해주세요.' : err.message;
      reposRetry.hidden = false;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  // 전체 보기/접기: 목록을 9개 제한과 전체 사이에서 바꾼다.
  // 이벤트 위임이 필요 없는 단일 버튼이라 직접 연결한다.
  reposMore.addEventListener('click', () => {
    setState({ reposExpanded: !STATE.reposExpanded });
    renderRepos(STATE.repos);
  });

  // 다시 시도 버튼과 첫 진입에 연결한다.
  reposRetry.addEventListener('click', loadRepos);
  loadRepos();
});
