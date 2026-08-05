import axios from 'axios'
import { useAuthStore } from '@/features/auth/store'
import { useToastStore } from '@/shared/store/toast'

// TEMP: 실 로그인이 연동되어 authStore가 진짜 userId를 갖기 전까지, 인증이 없는 요청은
// 이 고정 테스트 유저로 동작한다. 'debug'는 auth/store.js의 DEV 임시 스텁 토큰이라 실 인증으로 치지 않는다.
const FALLBACK_USER_ID = 1

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const hasRealAccessToken = authStore.accessToken && authStore.accessToken !== 'debug'
  if (hasRealAccessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  } else {
    config.params = { userId: FALLBACK_USER_ID, ...config.params }
  }
  return config
})

let refreshPromise = null

axiosInstance.interceptors.response.use(
  (response) => {
    // 이 백엔드의 대부분 엔드포인트는 ApiResponse<T>{success,message,status_code,data} 봉투로
    // 감싸서 내려준다(단, oauthLogin/users 등 일부는 원시 객체를 그대로 반환). 봉투 형태일 때만
    // data를 한 번 풀어서, mock 데이터(항상 unwrap된 payload 모양)와 응답 모양을 통일한다.
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      const authStore = useAuthStore()

      refreshPromise ??= authStore.tryRefresh().finally(() => {
        refreshPromise = null
      })
      const refreshed = await refreshPromise

      if (refreshed) {
        originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`
        return axiosInstance(originalRequest)
      }
      authStore.logout()
    }

    const toastStore = useToastStore()
    toastStore.show(error.response?.data?.message ?? '요청 처리 중 오류가 발생했어요.')

    return Promise.reject(error)
  },
)

export default axiosInstance
