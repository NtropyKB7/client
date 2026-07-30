/**
 * mock API 응답에 네트워크 지연을 흉내낸다.
 * 백엔드 연동 전까지 모든 mock API 함수가 공통으로 사용한다.
 */
export function mockDelay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * VITE_API_BASE_URL이 비어있으면(백엔드 미연동) 배포 환경(Vercel 등)에서도 mock을 사용한다.
 * VITE_API_BASE_URL이 채워지면(백엔드 연동되면) 이 헬퍼 대신 실제 로직만 남길 것.
 */
export function shouldUseMock() {
  return import.meta.env.DEV || !import.meta.env.VITE_API_BASE_URL
}
