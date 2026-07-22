import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authClient from '@/shared/api/authClient'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref(null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  function setAccessToken(token) {
    accessToken.value = token
  }

  async function tryRefresh() {
    // TEMP: 백엔드 /auth/refresh가 아직 없어 탭 화면들을 로컬에서 확인하기 위한 임시 스텁.
    // 백엔드 연동되면 이 if 블록을 삭제하고 아래 실제 로직만 남길 것.
    if (import.meta.env.DEV) {
      accessToken.value = 'debug'
      return true
    }

    try {
      const { data } = await authClient.post('/auth/refresh')
      accessToken.value = data.accessToken
      return true
    } catch {
      accessToken.value = null
      return false
    }
  }

  function logout() {
    accessToken.value = null
  }

  return { accessToken, isAuthenticated, setAccessToken, tryRefresh, logout }
})
