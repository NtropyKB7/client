import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { exchangeOAuthCode, refreshTokens, fetchMyInfo, logoutRequest } from './api'
import { unsubscribeFromPush } from '@/features/notification/push'

const REFRESH_TOKEN_STORAGE_KEY = 'ntropy_refresh_token'

function loadPersistedRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

function persistRefreshToken(token) {
  try {
    if (token) {
      localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token)
    } else {
      localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
    }
  } catch {
    // localStorage 접근 실패(프라이빗 브라우징 등) 시 무시 — 메모리 상 토큰은 이미 갱신된 상태를 유지
  }
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)
  const refreshToken = ref(loadPersistedRefreshToken())
  const user = ref(null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  function setAccessToken(token) {
    accessToken.value = token
  }

  function setTokens(newAccessToken, newRefreshToken) {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    persistRefreshToken(newRefreshToken)
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    persistRefreshToken(null)
  }

  async function fetchMe() {
    const data = await fetchMyInfo()
    user.value = data
    return data
  }

  async function loginWithOAuth(provider, code) {
    const data = await exchangeOAuthCode(provider, code)
    setTokens(data.accessToken, data.refreshToken)
    user.value = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      onboardingCompleted: data.onboardingCompleted,
    }
    return user.value
  }

  let refreshPromise = null

  // 같은 탭 안에서 main.js 부팅 시점 호출과 axiosInstance의 401 재시도 호출이 겹칠 수 있어,
  // 진행 중인 재발급 요청을 공유해 실제 네트워크 요청은 한 번만 나가도록 한다.
  async function tryRefresh() {
    refreshPromise ??= performRefresh().finally(() => {
      refreshPromise = null
    })
    return refreshPromise
  }

  async function performRefresh() {
    // TEMP: 백엔드 미연동(VITE_API_BASE_URL 비어있음) 환경에서 탭 화면들을 로컬/배포에서 확인하기 위한 스텁.
    // VITE_API_BASE_URL이 채워지면(백엔드 연동되면) 이 if 블록은 더 이상 타지 않는다.
    if (!import.meta.env.VITE_API_BASE_URL) {
      accessToken.value = 'debug'
      return true
    }

    if (!refreshToken.value) {
      return false
    }

    // 리프레시 토큰은 백엔드에서 사용 시 새 값으로 회전(1회성)된다. 탭을 여러 개 열어두었거나
    // 새로고침이 짧은 간격으로 겹치면, 이미 다른 요청이 이 토큰으로 회전에 성공한 뒤에 뒤늦게
    // 같은 토큰으로 재발급을 시도하는 요청이 실패할 수 있다. 이때 무조건 clearTokens()를 하면
    // 방금 다른 요청이 저장해 둔 유효한 새 토큰까지 지워버려, 이후로는 새로고침할 때마다
    // 로그아웃되는 문제가 생긴다. 그래서 실패 시 localStorage의 현재 값을 다시 확인해서,
    // 이미 다른 값으로 바뀌어 있다면(=다른 요청이 성공한 것) 그 값으로 한 번만 더 시도해 본다.
    const attemptedToken = refreshToken.value
    try {
      const data = await refreshTokens(attemptedToken)
      setTokens(data.accessToken, data.refreshToken)
    } catch {
      const currentPersisted = loadPersistedRefreshToken()
      if (currentPersisted && currentPersisted !== attemptedToken) {
        refreshToken.value = currentPersisted
        try {
          const data = await refreshTokens(currentPersisted)
          setTokens(data.accessToken, data.refreshToken)
        } catch {
          clearTokens()
          return false
        }
      } else {
        clearTokens()
        return false
      }
    }

    try {
      await fetchMe()
    } catch {
      // 토큰 재발급은 이미 성공했으므로 로그인 상태는 유지한다. /auth/me 조회 실패(일시적
      // 네트워크 오류 등)만으로 세션을 끊으면 새로고침할 때마다 로그아웃되는 문제가 생긴다.
    }

    return true
  }

  async function logout() {
    try {
      if (accessToken.value && accessToken.value !== 'debug') {
        // 공용 PC 등 같은 기기를 다른 계정이 이어 쓰는 경우를 대비해 로그아웃 시 브라우저
        // 구독까지 완전히 해지한다(서버 등록 해제 + unsubscribe). 재로그인 시엔
        // ensurePushSubscription이 조용히 재구독한다.
        await unsubscribeFromPush()
        await logoutRequest()
      }
    } catch {
      // 서버 로그아웃 실패와 무관하게 로컬 로그아웃은 항상 진행한다.
    } finally {
      clearTokens()
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setAccessToken,
    loginWithOAuth,
    fetchMe,
    tryRefresh,
    logout,
  }
})
