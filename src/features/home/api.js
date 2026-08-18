import { requestWithMock } from '@/shared/api/request'

const MOCK_DASHBOARD = {
  greetingName: '동현',
  goalHours: { current: 32, target: 40 },
  goalIncome: { amount: 1780000, target: 2500000 },
  fatigueScore: 72,
}

const MOCK_RECOMMENDATION_HOURS = {
  targetMonth: '2026-08',
  totalRecommendedHours: 32,
  jobs: [
    {
      jobId: 1,
      jobName: '가산 오피스 배달',
      currentHours: 10,
      recommendedHours: 14,
      baseFatigue: 2,
      expectedIncome: 420000,
    },
    {
      jobId: 2,
      jobName: '외곽 물류센터 야간',
      currentHours: 10,
      recommendedHours: 10,
      baseFatigue: 3,
      expectedIncome: 680000,
    },
    {
      jobId: 3,
      jobName: '강남 대리운전',
      currentHours: 6,
      recommendedHours: 8,
      baseFatigue: 3,
      expectedIncome: 230000,
    },
  ],
}

function toJobRecommendation(job) {
  const remaining = job.recommendedHours - job.currentHours
  const status =
    remaining <= 0
      ? { tone: 'yellow', label: '추천 달성' }
      : { tone: 'blue', label: `${remaining}시간 남음` }

  return {
    id: job.jobId,
    name: job.jobName,
    hours: job.currentHours,
    recommendedHours: job.recommendedHours,
    fatigue: job.baseFatigue,
    expectedIncome: job.expectedIncome,
    status,
  }
}

export async function fetchDashboard() {
  const [dashboard, recommendationHours] = await Promise.all([
    requestWithMock(MOCK_DASHBOARD, (client) => client.get('/dashboard')),
    requestWithMock(MOCK_RECOMMENDATION_HOURS, (client) =>
      client.get('/dashboard/recommendation-hours'),
    ),
  ])

  return {
    ...dashboard,
    targetMonth: recommendationHours.targetMonth,
    jobRecommendations: recommendationHours.jobs.map(toJobRecommendation),
  }
}
