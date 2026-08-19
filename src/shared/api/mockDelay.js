/**
 * mock API 응답 지연 없이 즉시 resolve한다.
 * 백엔드 연동 전까지 모든 mock API 함수가 공통으로 사용한다.
 */
export function mockDelay() {
  return Promise.resolve()
}

/**
 * VITE_API_BASE_URL이 비어있으면(백엔드 미연동) DEV/배포 환경 모두 mock을 사용한다.
 * VITE_API_BASE_URL이 채워지면(백엔드 연동되면) DEV에서도 실제 API를 호출한다.
 */
export function shouldUseMock() {
  return !import.meta.env.VITE_API_BASE_URL
}
