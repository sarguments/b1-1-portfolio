# B1-1 포트폴리오

나를 소개하는 반응형 웹페이지. 외부 라이브러리 없이 HTML·CSS·JavaScript만으로 만든다.

## 설계 기록

- 접근성: 스킵링크·`aria-expanded`·`aria-describedby`·`role=status/alert`로 키보드·스크린리더 흐름을 챙긴다.
- 상태 관리: 화면을 결정하는 값은 `STATE` 한 곳에 모으고 `setState`로만 바꾼다. 추적은 조건부 디버그 로그로 한다.
- 견고성: 테마 저장은 try/catch, 목록 요청은 8초 타임아웃+수동 재시도, 외부 데이터는 이스케이프 후 삽입한다.
- 금지 준수: `var`·인라인 이벤트·인라인 스타일·외부 라이브러리 없음.

## 구조

- `index.html` — 페이지 뼈대
- `css/style.css` — 변수와 기본 스타일
- `js/main.js` — 동작 진입점
- `images/` — 이미지 보관
- 배포 파일: GitHub Pages는 추가 파일이 필요 없고 루트 `index.html` 기준으로 서빙한다. `CNAME`은 커스텀 도메인을 연결할 때만 추가한다.

## 실행

1. 이 폴더를 VS Code로 연다.
2. Live Server로 `index.html`을 연다.
3. 5구역·테마 전환·메뉴·스크롤·등장·저장소 목록·폼 검증을 확인한다.

## 기술

- HTML: 시맨틱 5구역(`header`·`nav`·`main`·`section`·`article`·`footer`), 앵커 5개, `label for=id`, `alt` 한 줄
- CSS: `:root` 변수+다크 토큰, Flex 내비, Grid 카드, `min-width: 768px`·`1024px`, 햄버거, `hover`+`transition`+`box-shadow`
- JavaScript: `defer`+`DOMContentLoaded`, STATE 중앙 상태+적용 함수, 상태→렌더 5흐름(테마·메뉴·위로·목록·폼), `IntersectionObserver` 등장, `fetch`+`async/await`+`try/catch` 4상태, 언어 필터(`filter`), `localStorage` 저장/복원, `<head>` 선주입 FOUC 방지
- 재시도·캐싱: 저장소 목록 실패 시 수동 다시 시도 버튼+8초 타임아웃, 목록 캐싱은 없고 새로고침 때마다 다시 요청한다.
- 선택 이유: 내비는 가로 한 줄 1차원 정렬이라 Flex(`space-between`)이 맞고, 카드 격자는 행·열 2차원 배치라 Grid(`auto-fit minmax`)가 맞다. `auto-fit minmax`는 카드 수가 적어도 남은 폭을 채워 격자가 꽉 차 보이게 한다.
- 모바일 퍼스트: 좁은 화면을 기본으로 스타일을 쓰고 `min-width` 미디어쿼리로 넓혀 간다. 저사양·터치 환경을 먼저 챙긴다.
- 기준값: 스크롤탑 300px·내비 변경 60px·등장 임계값 0.2. 바꾸면 이 줄을 고친다.
- 반응형 360px(모바일): 카드 1열+햄버거 메뉴. 아래 모바일 스크린샷 참고.
- 반응형 768px(태블릿): 내비 펼침+카드 2열.
- 반응형 1024px(데스크톱): 최대폭 1024px 중앙 정렬+카드 4열. 아래 데스크톱·다크모드 스크린샷 참고.

## 배포

- 배포 URL: https://sarguments.github.io/b1-1-portfolio/
- 저장소: https://github.com/sarguments/b1-1-portfolio

## 스크린샷

| 데스크톱 | 모바일 | 다크모드 |
| --- | --- | --- |
| <img src="images/desktop.png" alt="데스크톱 화면" width="300" /> | <img src="images/mobile.png" alt="모바일 화면" width="300" /> | <img src="images/dark.png" alt="다크모드 화면" width="300" /> |
