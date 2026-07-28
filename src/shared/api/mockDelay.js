/**
 * mock API 응답에 네트워크 지연을 흉내낸다.
 * 백엔드 연동 전까지 모든 mock API 함수가 공통으로 사용한다.
 */
export function mockDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
