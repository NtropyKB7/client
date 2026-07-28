import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay } from '@/shared/api/mockDelay'

const MOCK_DASHBOARD = {
  greetingName: '동현',
  goalHours: { current: 32, target: 40 },
  jobRecommendations: [
    {
      id: 'job-1',
      name: '대리운전',
      fatigue: 3,
      roi: 1.8,
      recommendedHours: 14,
      expectedIncome: 980000,
      reduced: true,
    },
    {
      id: 'job-2',
      name: '배달라이더',
      fatigue: 2,
      roi: 1.5,
      recommendedHours: 10,
      expectedIncome: 650000,
      reduced: false,
    },
    {
      id: 'job-3',
      name: '유튜브 애드센스',
      fatigue: 1,
      roi: 2.4,
      recommendedHours: 8,
      expectedIncome: 420000,
      reduced: false,
    },
  ],
  fixedCostSummary: 850000,
  achievementRate: { percent: 78, amount: 1950000, detail: '목표 250만원 중 195만원 달성' },
  settlementAmount: { amount: 2010000, detail: '이번 달 3개 잡 정산 합계' },
  fatigueScore: 72,
  realWage: { nominal: 15000, real: 11200, detail: '이동시간·수수료 차감 반영' },
}

export async function fetchDashboard() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_DASHBOARD // TODO: 백엔드 최적화 엔진 결과 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/home/dashboard')
  return data
}
