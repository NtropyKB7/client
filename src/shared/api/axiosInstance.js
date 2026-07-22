import axios from 'axios'
import { useAuthStore } from '@/features/auth/store'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

let refreshPromise = null

axiosInstance.interceptors.response.use(
  (response) => response,
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

    return Promise.reject(error)
  },
)

export default axiosInstance
