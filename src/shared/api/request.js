import axiosInstance from './axiosInstance'
import { mockDelay, shouldUseMock } from './mockDelay'

/**
 * DEV/미연동 환경(shouldUseMock)에서는 mockData를, 그 외에는 realRequest(axiosInstance) 결과의
 * data를 반환하는 공용 래퍼. 각 feature api.js에 반복되던
 * `if (shouldUseMock()) {...} else { axiosInstance... }` 분기를 이 함수 하나로 대체한다.
 * @param {*} mockData
 * @param {(client: import('axios').AxiosInstance) => Promise<import('axios').AxiosResponse>} realRequest
 */
export async function requestWithMock(mockData, realRequest) {
  if (shouldUseMock()) {
    await mockDelay()
    return mockData
  }
  const { data } = await realRequest(axiosInstance)
  return data
}
