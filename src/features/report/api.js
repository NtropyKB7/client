import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay, shouldUseMock } from '@/shared/api/mockDelay'

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
  if (shouldUseMock()) {
    await mockDelay()
    return MOCK_REPORT_LIST // TODO: 백엔드 월별 리포트 목록 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/report/list')
  return data
}

export async function fetchReportDetail(month) {
  if (shouldUseMock()) {
    await mockDelay()
    return { month, ...MOCK_REPORT_DETAIL } // TODO: 백엔드 월별 리포트 상세 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/report/detail', { params: { month } })
  return data
}
