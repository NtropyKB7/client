import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { exchangeOAuthCode, refreshTokens, fetchMyInfo, logoutRequest } from './api'

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

  async function tryRefresh() {
    // TEMP: 백엔드 미연동(VITE_API_BASE_URL 비어있음) 환경에서 탭 화면들을 로컬/배포에서 확인하기 위한 스텁.
    // VITE_API_BASE_URL이 채워지면(백엔드 연동되면) 이 if 블록은 더 이상 타지 않는다.
    if (!import.meta.env.VITE_API_BASE_URL) {
      accessToken.value = 'debug'
      return true
    }

    if (!refreshToken.value) {
      return false
    }

    try {
      const data = await refreshTokens(refreshToken.value)
      setTokens(data.accessToken, data.refreshToken)
      await fetchMe()
      return true
    } catch {
      clearTokens()
      return false
    }
  }

  async function logout() {
    try {
      if (accessToken.value && accessToken.value !== 'debug') {
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
