import { requestWithMock } from '@/shared/api/request'

const MOCK_DASHBOARD = {
  greetingName: '동현',
  goalHours: { current: 32, target: 40 },
  jobRecommendations: [
    {
      id: 'job-1',
      name: '가산 오피스 배달',
      status: { tone: 'blue', label: '4시간 남음' },
      hours: 10,
      recommendedHours: 14,
      fatigue: 2.2,
      expectedIncome: 420000,
    },
    {
      id: 'job-2',
      name: '외곽 물류센터 야간',
      status: { tone: 'yellow', label: '추천 달성' },
      hours: 10,
      recommendedHours: 10,
      fatigue: 3.0,
      expectedIncome: 680000,
    },
    {
      id: 'job-3',
      name: '강남 대리운전',
      status: { tone: 'red', label: '2시간 남음' },
      hours: 6,
      recommendedHours: 8,
      fatigue: 2.8,
      expectedIncome: 230000,
    },
  ],
  goalIncome: { amount: 1780000, target: 2500000 },
  fatigueScore: 72,
  realWage: { real: 8400, detail: '이동·대기·피로 반영' },
}

export async function fetchDashboard() {
  return requestWithMock(MOCK_DASHBOARD, (client) => client.get('/home/dashboard'))
}
