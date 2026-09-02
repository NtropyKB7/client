import { isMockMode } from './mockMode'

/**
 * mock API 응답 지연 없이 즉시 resolve한다.
 * 백엔드 연동 전까지 모든 mock API 함수가 공통으로 사용한다.
 */
export function mockDelay() {
  return Promise.resolve()
}

/**
 * VITE_API_BASE_URL이 비어있으면(백엔드 미연동) DEV/배포 환경 모두 mock을 사용한다.
 * VITE_API_BASE_URL이 채워지면(백엔드 연동되면) DEV에서도 실제 API를 호출하되,
 * 로그인 화면의 '목데이터로 둘러보기'로 진입한 체험 모드에서는 실제 백엔드가 붙은
 * 배포에서도 계속 mock을 쓴다.
 */
export function shouldUseMock() {
  return isMockMode() || !import.meta.env.VITE_API_BASE_URL
}
