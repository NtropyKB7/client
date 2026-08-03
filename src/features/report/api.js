import { requestWithMock } from '@/shared/api/request'

export const CATEGORY_COLORS = ['bg-amber-500', 'bg-blue-500', 'bg-violet-500']

const MONTH_SUMMARIES = [
  { month: '2026-07', monthLabel: '7월', totalIncome: 3960000, totalSpend: 2540000 },
  { month: '2026-06', monthLabel: '6월', totalIncome: 3720000, totalSpend: 2760000 },
  { month: '2026-05', monthLabel: '5월', totalIncome: 4080000, totalSpend: 2910000 },
  { month: '2026-04', monthLabel: '4월', totalIncome: 3510000, totalSpend: 2630000 },
  { month: '2026-03', monthLabel: '3월', totalIncome: 3890000, totalSpend: 3010000 },
  { month: '2026-02', monthLabel: '2월', totalIncome: 3650000, totalSpend: 2790000 },
]

const MOCK_REPORT_LIST = MONTH_SUMMARIES.map((entry) => ({
  ...entry,
  availableFunds: entry.totalIncome - entry.totalSpend,
}))

const MOCK_REPORT_DETAIL_BY_MONTH = {
  '2026-07': {
    categories: [
      { id: 'food', label: '식비', percent: 32 },
      { id: 'transport', label: '교통비', percent: 24 },
      { id: 'subscription', label: 'OTT·구독', percent: 11 },
    ],
    insight: {
      title: '식비가 줄어 가용자금이 늘었어요',
      description: '지난달보다 소비가 22만원 감소했어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 42, income: 1260000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 36, income: 980000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 28,
        income: 1720000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 142만원 중 60만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 22,800원/월',
    },
  },
  '2026-06': {
    categories: [
      { id: 'food', label: '식비', percent: 35 },
      { id: 'transport', label: '교통비', percent: 22 },
      { id: 'subscription', label: 'OTT·구독', percent: 13 },
    ],
    insight: {
      title: '교통비 지출이 꾸준히 늘고 있어요',
      description: '최근 3개월 연속 교통비가 증가했어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 39, income: 1150000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 33, income: 890000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 24,
        income: 1480000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 96만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
    },
  },
  '2026-05': {
    categories: [
      { id: 'food', label: '식비', percent: 30 },
      { id: 'transport', label: '교통비', percent: 26 },
      { id: 'subscription', label: 'OTT·구독', percent: 10 },
    ],
    insight: {
      title: '소득이 늘어 가용자금이 크게 늘었어요',
      description: '이번 달 총소득이 408만원으로 6개월 중 최고예요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 45, income: 1340000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 38, income: 1020000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 30,
        income: 1720000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 117만원 중 50만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 19,000원/월',
    },
  },
  '2026-04': {
    categories: [
      { id: 'food', label: '식비', percent: 33 },
      { id: 'transport', label: '교통비', percent: 21 },
      { id: 'subscription', label: 'OTT·구독', percent: 12 },
    ],
    insight: {
      title: 'OTT·구독 지출을 점검해 볼 시점이에요',
      description: '3개월째 구독 지출 비중이 10%를 넘고 있어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 37, income: 1080000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 34, income: 900000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 26,
        income: 1530000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
    },
  },
  '2026-03': {
    categories: [
      { id: 'food', label: '식비', percent: 34 },
      { id: 'transport', label: '교통비', percent: 25 },
      { id: 'subscription', label: 'OTT·구독', percent: 9 },
    ],
    insight: {
      title: '소비가 늘어 가용자금이 줄었어요',
      description: '식비와 교통비 지출이 함께 늘었어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 40, income: 1190000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 35, income: 950000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 25,
        income: 1750000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
    },
  },
  '2026-02': {
    categories: [
      { id: 'food', label: '식비', percent: 31 },
      { id: 'transport', label: '교통비', percent: 23 },
      { id: 'subscription', label: 'OTT·구독', percent: 12 },
    ],
    insight: {
      title: '안정적인 소비 패턴을 유지하고 있어요',
      description: '최근 6개월 중 소비 변동폭이 가장 작았어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 38, income: 1120000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 32, income: 870000 },
      {
        id: 'job-design',
        name: '크몽 디자인 외주',
        category: 'creative',
        hours: 27,
        income: 1660000,
      },
    ],
    recommendedProduct: {
      name: 'KB N잡러 자유적금 (변동소득 특화)',
      description:
        '가용자금 86만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
    },
  },
}

export async function fetchReportList() {
  return requestWithMock(MOCK_REPORT_LIST, (client) => client.get('/report/list'))
}

export async function fetchReportDetail(month) {
  const summary = MOCK_REPORT_LIST.find((entry) => entry.month === month) ?? MOCK_REPORT_LIST[0]
  const rest = MOCK_REPORT_DETAIL_BY_MONTH[month] ?? MOCK_REPORT_DETAIL_BY_MONTH['2026-07']
  return requestWithMock(
    {
      month: summary.month,
      totalIncome: summary.totalIncome,
      totalSpend: summary.totalSpend,
      availableFunds: summary.availableFunds,
      ...rest,
    },
    (client) => client.get('/report/detail', { params: { month } }),
  )
}
