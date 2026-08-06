import { requestWithMock } from '@/shared/api/request'
import { deriveMonthLabel } from './utils'

export const CATEGORY_COLORS = ['bg-amber-500', 'bg-blue-500', 'bg-violet-500']

// mock 데이터는 실제 백엔드 응답 스펙(reportId/yearMonth/reportTitle/createdAt,
// financialSummary, recommendation)을 그대로 따른다. 단 insight/jobBreakdown/
// totalIncome 등 실 API에 아직 없는 필드도 mock에만 추가로 채워서, 백엔드 미연동
// 배포(mock 모드) 화면은 계속 풍부하게 보이도록 한다. 실 API 응답에는 이 필드들이
// 없으므로 normalize 단계에서 자동으로 null/undefined 처리되어 해당 카드가 숨겨진다.
const MOCK_AI_REPORTS = [
  {
    reportId: 1,
    yearMonth: '2026-07',
    reportTitle: '2026년 7월 리포트',
    createdAt: '2026-08-06T04:40:36',
    totalIncome: 3960000,
    totalExpense: 2540000,
    availableFunds: 1420000,
  },
  {
    reportId: 2,
    yearMonth: '2026-06',
    reportTitle: '2026년 6월 리포트',
    createdAt: '2026-08-06T04:48:05',
    totalIncome: 3720000,
    totalExpense: 2760000,
    availableFunds: 960000,
  },
  {
    reportId: 3,
    yearMonth: '2026-05',
    reportTitle: '2026년 5월 리포트',
    createdAt: '2026-08-06T04:48:05',
    totalIncome: 4080000,
    totalExpense: 2910000,
    availableFunds: 1170000,
  },
  {
    reportId: 4,
    yearMonth: '2026-04',
    reportTitle: '2026년 4월 리포트',
    createdAt: '2026-08-06T04:48:05',
    totalIncome: 3510000,
    totalExpense: 2630000,
    availableFunds: 880000,
  },
  {
    reportId: 5,
    yearMonth: '2026-03',
    reportTitle: '2026년 3월 리포트',
    createdAt: '2026-08-06T04:48:05',
    totalIncome: 3890000,
    totalExpense: 3010000,
    availableFunds: 880000,
  },
  {
    reportId: 6,
    yearMonth: '2026-02',
    reportTitle: '2026년 2월 리포트',
    createdAt: '2026-08-06T04:48:05',
    totalIncome: 3650000,
    totalExpense: 2790000,
    availableFunds: 860000,
  },
]

const MOCK_AI_REPORT_DETAIL_BY_MONTH = {
  '2026-07': {
    reportId: 1,
    yearMonth: '2026-07',
    createdAt: '2026-08-06T04:40:36',
    financialSummary: {
      totalIncome: 3960000,
      totalExpense: 2540000,
      availableFunds: 1420000,
      topCategories: [
        { ratio: 32, category: 'food', displayName: '식비' },
        { ratio: 24, category: 'transport', displayName: '교통비' },
        { ratio: 11, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 142만원 중 60만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 22,800원/월',
      recommendedProduct: {
        summary: '가용자금 142만원 중 60만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: '식비가 줄어 가용자금이 늘었어요',
      description: '지난달보다 소비가 22만원 감소했어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 42, income: 1260000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 36, income: 980000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 28, income: 1720000 },
    ],
  },
  '2026-06': {
    reportId: 2,
    yearMonth: '2026-06',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3720000,
      totalExpense: 2760000,
      availableFunds: 960000,
      topCategories: [
        { ratio: 35, category: 'food', displayName: '식비' },
        { ratio: 22, category: 'transport', displayName: '교통비' },
        { ratio: 13, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 96만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
      recommendedProduct: {
        summary: '가용자금 96만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: '교통비 지출이 꾸준히 늘고 있어요',
      description: '최근 3개월 연속 교통비가 증가했어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 39, income: 1150000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 33, income: 890000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 24, income: 1480000 },
    ],
  },
  '2026-05': {
    reportId: 3,
    yearMonth: '2026-05',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 4080000,
      totalExpense: 2910000,
      availableFunds: 1170000,
      topCategories: [
        { ratio: 30, category: 'food', displayName: '식비' },
        { ratio: 26, category: 'transport', displayName: '교통비' },
        { ratio: 10, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 117만원 중 50만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 19,000원/월',
      recommendedProduct: {
        summary: '가용자금 117만원 중 50만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: '소득이 늘어 가용자금이 크게 늘었어요',
      description: '이번 달 총소득이 408만원으로 6개월 중 최고예요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 45, income: 1340000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 38, income: 1020000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 30, income: 1720000 },
    ],
  },
  '2026-04': {
    reportId: 4,
    yearMonth: '2026-04',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3510000,
      totalExpense: 2630000,
      availableFunds: 880000,
      topCategories: [
        { ratio: 33, category: 'food', displayName: '식비' },
        { ratio: 21, category: 'transport', displayName: '교통비' },
        { ratio: 12, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
      recommendedProduct: {
        summary: '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: 'OTT·구독 지출을 점검해 볼 시점이에요',
      description: '3개월째 구독 지출 비중이 10%를 넘고 있어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 37, income: 1080000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 34, income: 900000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 26, income: 1530000 },
    ],
  },
  '2026-03': {
    reportId: 5,
    yearMonth: '2026-03',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3890000,
      totalExpense: 3010000,
      availableFunds: 880000,
      topCategories: [
        { ratio: 34, category: 'food', displayName: '식비' },
        { ratio: 25, category: 'transport', displayName: '교통비' },
        { ratio: 9, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
      recommendedProduct: {
        summary: '가용자금 88만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: '소비가 늘어 가용자금이 줄었어요',
      description: '식비와 교통비 지출이 함께 늘었어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 40, income: 1190000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 35, income: 950000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 25, income: 1750000 },
    ],
  },
  '2026-02': {
    reportId: 6,
    yearMonth: '2026-02',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3650000,
      totalExpense: 2790000,
      availableFunds: 860000,
      topCategories: [
        { ratio: 31, category: 'food', displayName: '식비' },
        { ratio: 23, category: 'transport', displayName: '교통비' },
        { ratio: 12, category: 'subscription', displayName: 'OTT·구독' },
      ],
    },
    recommendation: {
      reasoning: '가용자금 86만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용 — 예상 추가 소득 약 15,200원/월',
      recommendedProduct: {
        summary: '가용자금 86만원 중 40만원을 자동이체하면 연 3.8% 우대금리 적용',
        provider: 'KB국민은행',
        productId: 'SAVING_001',
        productName: 'KB N잡러 자유적금 (변동소득 특화)',
        productType: 'SAVINGS',
      },
    },
    insight: {
      title: '안정적인 소비 패턴을 유지하고 있어요',
      description: '최근 6개월 중 소비 변동폭이 가장 작았어요.',
    },
    jobBreakdown: [
      { id: 'job-taxi', name: '카카오 T 택시', category: 'driving', hours: 38, income: 1120000 },
      { id: 'job-delivery', name: '배달', category: 'delivery', hours: 32, income: 870000 },
      { id: 'job-design', name: '크몽 디자인 외주', category: 'creative', hours: 27, income: 1660000 },
    ],
  },
}

function normalizeListItem(item) {
  return {
    month: item.yearMonth,
    monthLabel: deriveMonthLabel(item.yearMonth),
    reportTitle: item.reportTitle,
    // 실 목록 API(GET /api/ai-reports)는 아직 요약 수치를 내려주지 않는다.
    // 백엔드에 필드 추가를 요청해둔 상태이며, 그전까지는 화면에서 조건부로 숨긴다.
    totalIncome: item.totalIncome ?? null,
    totalSpend: item.totalExpense ?? null,
    availableFunds: item.availableFunds ?? null,
  }
}

function normalizeDetail(data) {
  const summary = data.financialSummary ?? {}
  const recommendedProduct = data.recommendation?.recommendedProduct

  return {
    month: data.yearMonth,
    monthLabel: deriveMonthLabel(data.yearMonth),
    totalIncome: summary.totalIncome ?? null,
    totalSpend: summary.totalExpense ?? null,
    availableFunds: summary.availableFunds ?? null,
    categories: (summary.topCategories ?? []).map((category) => ({
      id: category.category,
      label: category.displayName,
      percent: category.ratio,
    })),
    recommendedProduct: recommendedProduct
      ? {
          name: recommendedProduct.productName,
          description: recommendedProduct.summary,
          provider: recommendedProduct.provider,
        }
      : null,
    // insight(일반 소비 인사이트)와 jobBreakdown(잡별 근무 성과)은 아직 실 API에 없는
    // 필드다. mock에는 데모용으로 채워두지만, 실 응답에는 없으므로 여기서 null이 되어
    // ReportDetailSection이 해당 카드를 자동으로 숨긴다.
    insight: data.insight ?? null,
    jobBreakdown: data.jobBreakdown ?? null,
  }
}

export async function fetchReportList() {
  const data = await requestWithMock(
    { totalCount: MOCK_AI_REPORTS.length, reports: MOCK_AI_REPORTS },
    (client) => client.get('/ai-reports'),
  )
  return (data.reports ?? []).map(normalizeListItem)
}

export async function fetchReportDetail(yearMonth) {
  const mock = MOCK_AI_REPORT_DETAIL_BY_MONTH[yearMonth] ?? MOCK_AI_REPORT_DETAIL_BY_MONTH['2026-07']
  const data = await requestWithMock(mock, (client) => client.get(`/ai-reports/${yearMonth}`))
  return normalizeDetail(data)
}
