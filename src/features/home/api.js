import { requestWithMock } from '@/shared/api/request'

const MOCK_DASHBOARD = {
  greetingName: '동현',
  goalHours: { current: 32, target: 40 },
  jobRecommendations: [
    {
      id: 'job-1',
      name: '가산 오피스 배달',
      fatigue: 1.8,
      roi: 30000,
      recommendedHours: 14,
      expectedIncome: 420000,
      reduced: false,
    },
    {
      id: 'job-2',
      name: '외곽 물류센터 야간',
      fatigue: 4.9,
      roi: 7200,
      recommendedHours: 10,
      expectedIncome: 360000,
      reduced: true,
    },
    {
      id: 'job-3',
      name: '강남 대리운전',
      fatigue: 2.5,
      roi: 12000,
      recommendedHours: 8,
      expectedIncome: 240000,
      reduced: false,
    },
  ],
  achievementRate: {
    percent: 78,
    amount: 1950000,
    target: 2500000,
    detail: '목표 250만원 중 195만원 달성',
  },
  settlementAmount: {
    percent: 71,
    amount: 2010000,
    target: 2830000,
    detail: '이번 달 3개 잡 정산 합계',
  },
  fatigueScore: 72,
  realWage: { nominal: 12000, real: 8400, detail: '이동·대기·피로 차감' },
}

export async function fetchDashboard() {
  return requestWithMock(MOCK_DASHBOARD, (client) => client.get('/home/dashboard'))
}
