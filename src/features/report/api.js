import { requestWithMock } from '@/shared/api/request'

export const CATEGORY_COLORS = ['bg-amber-500', 'bg-blue-500', 'bg-violet-500']

const MOCK_REPORT_LIST = [
  { month: '2026-07', monthLabel: '7월' },
  { month: '2026-06', monthLabel: '6월' },
  { month: '2026-05', monthLabel: '5월' },
  { month: '2026-04', monthLabel: '4월' },
  { month: '2026-03', monthLabel: '3월' },
  { month: '2026-02', monthLabel: '2월' },
]

const MOCK_REPORT_DETAIL = {
  totalIncome: 3960000,
  totalSpend: 2540000,
  availableFunds: 1420000,
  spendChangePercent: -8,
  categories: [
    { id: 'food', label: '식비', percent: 32 },
    { id: 'transport', label: '교통비', percent: 24 },
    { id: 'subscription', label: 'OTT·구독', percent: 11 },
  ],
  recommendedProduct: {
    name: 'KB N잡러 자유적금 (변동소득 특화)',
    description:
      '가용자금 142만원 중 60만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 22,800원/월',
  },
}

export async function fetchReportList() {
  return requestWithMock(MOCK_REPORT_LIST, (client) => client.get('/report/list'))
}

export async function fetchReportDetail(month) {
  return requestWithMock({ month, ...MOCK_REPORT_DETAIL }, (client) =>
    client.get('/report/detail', { params: { month } }),
  )
}
