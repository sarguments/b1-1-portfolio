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
3. 빈 페이지와 콘솔 로그(`B1-1 skeleton loaded`)를 확인한다.

## 기술

- HTML, CSS, JavaScript (외부 라이브러리 없음)

## 현재 상태

- 빈 골격과 외부 연결 확인 완료. 섹션·스타일·동작은 이후 커밋에서 채운다.
- 배포 URL은 준비되는 대로 추가한다.
