const MOCK_MODE_STORAGE_KEY = 'ntropy_mock_mode'

/**
 * 로그인 화면의 '목데이터로 둘러보기'로 진입한 체험 모드 여부. localStorage에 저장해
 * 새로고침 후에도 유지하고, shouldUseMock()이 VITE_API_BASE_URL 설정과 무관하게
 * (실제 백엔드가 붙은 배포에서도) mock 데이터를 쓰도록 한다.
 */
export function isMockMode() {
  try {
    return localStorage.getItem(MOCK_MODE_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMockMode(enabled) {
  try {
    if (enabled) {
      localStorage.setItem(MOCK_MODE_STORAGE_KEY, '1')
    } else {
      localStorage.removeItem(MOCK_MODE_STORAGE_KEY)
    }
  } catch {
    // localStorage 접근 실패(프라이빗 브라우징 등) 시 무시
  }
}
