# B1-1 포트폴리오

나를 소개하는 반응형 웹페이지. 외부 라이브러리 없이 HTML·CSS·JavaScript만으로 만든다.

## 이 골격의 생각

- 구조(HTML)·표현(CSS)·동작(JS)을 파일로 나눈다. 섞지 않는 게 유지보수의 시작이다.
- CSS 값은 `:root` 변수에 모아 둔다. 테마 변경이 변수 교체 한 번으로 끝나게 하려는 준비다.
- JS는 `defer`로 연결한다. HTML 해석을 막지 않고, 해석이 끝난 뒤 순서대로 실행된다.
- 변수는 기본 `const`, 이벤트는 `addEventListener`로 연결한다. `var`와 인라인 이벤트는 쓰지 않는다.

## 구조

- `index.html` — 페이지 뼈대
- `css/style.css` — 변수와 기본 스타일
- `js/main.js` — 동작 진입점
- `images/` — 이미지 보관

## 실행

1. 이 폴더를 VS Code로 연다.
2. Live Server로 `index.html`을 연다.
3. 5구역·테마 전환·메뉴·스크롤·등장·저장소 목록·폼 검증을 확인한다.

## 기술

- HTML: 시맨틱 5구역(`header`·`nav`·`main`·`section`·`article`·`footer`), 앵커 5개, `label for=id`, `alt` 한 줄
- CSS: `:root` 변수+다크 토큰, Flex 내비, Grid 카드, `min-width: 768px`·`1024px`, 햄버거, `hover`+`transition`+`box-shadow`
- JavaScript: `defer`+`DOMContentLoaded`, 상태→렌더 3흐름(테마·메뉴·위로), `IntersectionObserver` 등장, `fetch`+`async/await`+`try/catch` 4상태, `localStorage` 저장/복원, `<head>` 선주입 FOUC 방지
- 기준값: 스크롤탑 300px·내비 변경 60px·등장 임계값 0.2 (바꾸면 여기 명시)

## 배포

- 배포 URL: https://sarguments.github.io/b1-1-portfolio/
- 저장소: https://github.com/sarguments/b1-1-portfolio

## 스크린샷

- 데스크톱: `images/desktop.png`
- 모바일: `images/mobile.png`
- 다크모드: `images/dark.png`

## 현재 상태

- 5구역·반응형·인터랙션·폼 검증·API 4상태까지 구현, 배포 검증 대기.
