import authClient from '@/shared/api/authClient'
import axiosInstance from '@/shared/api/axiosInstance'

// oauth/refresh는 로그인 전(미인증) 상태로 호출된다. axiosInstance를 쓰면 FALLBACK_USER_ID가
// 쿼리/바디에 끼어들기 때문에, 인터셉터 없는 authClient로 직접 호출하고 ApiResponse 봉투를 여기서 푼다.
export async function exchangeOAuthCode(provider, code) {
  const { data } = await authClient.get(`/auth/oauth/${provider}`, { params: { code } })
  return data.data
}

export async function refreshTokens(refreshToken) {
  const { data } = await authClient.post('/auth/refresh', { refreshToken })
  return data.data
}

export async function fetchMyInfo() {
  const { data } = await axiosInstance.get('/auth/me')
  return data
}

export async function logoutRequest() {
  await axiosInstance.post('/auth/logout')
}
