'use strict';

// 재할당하지 않는 값은 const가 기본이다. var는 쓰지 않는다.
const statusMessage = 'B1-1 skeleton loaded';

// HTML에 onclick을 쓰지 않고 여기서 이벤트를 연결한다.
// DOMContentLoaded는 "HTML 해석이 끝난 뒤"를 보장하는 신호다.
// (defer로 연결했으므로 순서도 보장된다)
document.addEventListener('DOMContentLoaded', () => {
  console.log(statusMessage);
});
