import { requestWithMock } from '@/shared/api/request'
import { deriveMonthLabel } from './utils'

export const CATEGORY_COLORS = ['bg-[#0a7059]', 'bg-[#57c99c]', 'bg-[#9edebf]', 'bg-[#d6e0db]']

// mock 데이터는 실제 백엔드 응답 스펙(reportId/yearMonth/reportTitle/createdAt,
// financialSummary.jobSummaries/topCategories/incomeChangeRate/expenseChangeRate,
// recommendation.recommendedProduct.details 등)을 그대로 따른다. 2026-07 항목은
// 백엔드가 실제로 반환한 응답 예시를 그대로 옮긴 것이다.
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
  // 백엔드 GET /ai-reports/2026-07 실제 응답을 그대로 옮김.
  '2026-07': {
    reportId: 3,
    yearMonth: '2026-07',
    createdAt: '2026-08-01T02:00:00',
    financialSummary: {
      totalIncome: 3960000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '배달',
          incomeRatio: 0.2525,
          incomeAmount: 1000000,
          totalWorkMinutes: 2400,
        },
        {
          jobId: 2,
          jobName: '카페 알바',
          incomeRatio: 0.3939,
          incomeAmount: 1560000,
          totalWorkMinutes: 4200,
        },
        {
          jobId: 3,
          jobName: '행사 스태프',
          incomeRatio: 0.3535,
          incomeAmount: 1400000,
          totalWorkMinutes: 1800,
        },
      ],
      totalExpense: 2540000,
      topCategories: [
        { ratio: 0.315, amount: 800000, category: 'FOOD', displayName: '식비' },
        { ratio: 0.2441, amount: 620000, category: 'SHOPPING', displayName: '쇼핑' },
        { ratio: 0.1102, amount: 280000, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.0433, amount: 110000, category: 'COMMUNICATION', displayName: '통신' },
      ],
      availableFunds: 1420000,
      incomeChangeRate: 0.125,
      expenseChangeRate: -0.08,
    },
    recommendation: {
      reasoning:
        '이번 달 가용자금이 142만 원 남아 있어 생활비를 해치지 않는 선에서 저축을 시작하기 좋습니다.',
      jobInsight:
        '카페 알바와 행사 스태프 소득 비중이 높고, 배달은 보조 수입원 역할을 하고 있습니다.',
      financialType: 'SURPLUS',
      futureIncomeTrend:
        '현재처럼 복수의 잡 소득원이 유지되면 다음 달에도 가용자금 확보 가능성이 높은 편입니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 500000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '배달 소득이나 단기 알바 소득 일부를 자동이체로 연결해 보세요.',
      },
      simulatedExtraIncome: 1900,
      financialActivityInsight:
        '전월 대비 소비는 8% 감소했고 소득은 12.5% 증가해 전체 현금흐름이 개선된 상태입니다.',
    },
  },
  '2026-06': {
    reportId: 2,
    yearMonth: '2026-06',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3720000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '카카오 T 택시',
          incomeRatio: 0.3091,
          incomeAmount: 1150000,
          totalWorkMinutes: 2340,
        },
        {
          jobId: 2,
          jobName: '배달',
          incomeRatio: 0.2392,
          incomeAmount: 890000,
          totalWorkMinutes: 1980,
        },
        {
          jobId: 3,
          jobName: '크몽 디자인 외주',
          incomeRatio: 0.4032,
          incomeAmount: 1480000,
          totalWorkMinutes: 1440,
        },
      ],
      totalExpense: 2760000,
      topCategories: [
        { ratio: 0.35, amount: 966000, category: 'FOOD', displayName: '식비' },
        { ratio: 0.22, amount: 607200, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.13, amount: 358800, category: 'SUBSCRIPTION', displayName: 'OTT·구독' },
        { ratio: 0.3, amount: 828000, category: 'ETC', displayName: '기타' },
      ],
      availableFunds: 960000,
      incomeChangeRate: -0.0882,
      expenseChangeRate: -0.0515,
    },
    recommendation: {
      reasoning:
        '가용자금 96만 원 중 40만 원을 자동이체하면 연 3.8% 우대금리 적용을 기대할 수 있습니다.',
      jobInsight: '크몽 디자인 외주 소득 비중이 가장 높고, 카카오 T 택시가 그 뒤를 잇고 있습니다.',
      financialType: 'SURPLUS',
      futureIncomeTrend:
        '교통비 지출 증가세가 이어지면 다음 달 가용자금이 소폭 줄어들 수 있습니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 400000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '택시 운행 소득 일부를 자동이체로 연결해 보세요.',
      },
      simulatedExtraIncome: 1270,
      financialActivityInsight:
        '전월 대비 소비는 5% 감소했지만 소득도 9% 줄어 현금흐름 개선폭은 크지 않습니다.',
    },
  },
  '2026-05': {
    reportId: 3,
    yearMonth: '2026-05',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 4080000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '카카오 T 택시',
          incomeRatio: 0.3284,
          incomeAmount: 1340000,
          totalWorkMinutes: 2700,
        },
        {
          jobId: 2,
          jobName: '배달',
          incomeRatio: 0.25,
          incomeAmount: 1020000,
          totalWorkMinutes: 2280,
        },
        {
          jobId: 3,
          jobName: '크몽 디자인 외주',
          incomeRatio: 0.4216,
          incomeAmount: 1720000,
          totalWorkMinutes: 1800,
        },
      ],
      totalExpense: 2910000,
      topCategories: [
        { ratio: 0.3, amount: 873000, category: 'FOOD', displayName: '식비' },
        { ratio: 0.26, amount: 756600, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.1, amount: 291000, category: 'SUBSCRIPTION', displayName: 'OTT·구독' },
        { ratio: 0.34, amount: 989400, category: 'ETC', displayName: '기타' },
      ],
      availableFunds: 1170000,
      incomeChangeRate: 0.1624,
      expenseChangeRate: 0.1065,
    },
    recommendation: {
      reasoning:
        '가용자금 117만 원 중 50만 원을 자동이체하면 연 3.8% 우대금리 적용을 기대할 수 있습니다.',
      jobInsight: '크몽 디자인 외주와 카카오 T 택시 소득이 고르게 늘어 전체 소득이 증가했습니다.',
      financialType: 'SURPLUS',
      futureIncomeTrend: '소득 증가세가 유지되면 다음 달에도 가용자금 여력이 클 것으로 보입니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 500000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '디자인 외주 소득이 들어오는 달에는 자동이체 금액을 늘려보세요.',
      },
      simulatedExtraIncome: 1580,
      financialActivityInsight:
        '이번 달 총소득이 408만원으로 6개월 중 가장 높아 가용자금이 크게 늘었습니다.',
    },
  },
  '2026-04': {
    reportId: 4,
    yearMonth: '2026-04',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3510000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '카카오 T 택시',
          incomeRatio: 0.3077,
          incomeAmount: 1080000,
          totalWorkMinutes: 2220,
        },
        {
          jobId: 2,
          jobName: '배달',
          incomeRatio: 0.2564,
          incomeAmount: 900000,
          totalWorkMinutes: 2040,
        },
        {
          jobId: 3,
          jobName: '크몽 디자인 외주',
          incomeRatio: 0.4359,
          incomeAmount: 1530000,
          totalWorkMinutes: 1560,
        },
      ],
      totalExpense: 2630000,
      topCategories: [
        { ratio: 0.33, amount: 867900, category: 'FOOD', displayName: '식비' },
        { ratio: 0.21, amount: 552300, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.12, amount: 315600, category: 'SUBSCRIPTION', displayName: 'OTT·구독' },
        { ratio: 0.34, amount: 894200, category: 'ETC', displayName: '기타' },
      ],
      availableFunds: 880000,
      incomeChangeRate: -0.0977,
      expenseChangeRate: -0.1263,
    },
    recommendation: {
      reasoning:
        '가용자금 88만 원 중 40만 원을 자동이체하면 연 3.8% 우대금리 적용을 기대할 수 있습니다.',
      jobInsight: '세 잡의 소득 비중이 비교적 고르게 분산되어 있습니다.',
      financialType: 'SURPLUS',
      futureIncomeTrend: '구독 지출 비중이 계속 늘면 가용자금 확보 여력이 줄어들 수 있습니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 400000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '고정 지출인 구독료를 점검하고 남는 금액을 자동이체로 돌려보세요.',
      },
      simulatedExtraIncome: 1270,
      financialActivityInsight: '3개월째 OTT·구독 지출 비중이 10%를 넘어 점검이 필요한 시점입니다.',
    },
  },
  '2026-03': {
    reportId: 5,
    yearMonth: '2026-03',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3890000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '카카오 T 택시',
          incomeRatio: 0.3059,
          incomeAmount: 1190000,
          totalWorkMinutes: 2400,
        },
        {
          jobId: 2,
          jobName: '배달',
          incomeRatio: 0.2442,
          incomeAmount: 950000,
          totalWorkMinutes: 2100,
        },
        {
          jobId: 3,
          jobName: '크몽 디자인 외주',
          incomeRatio: 0.4499,
          incomeAmount: 1750000,
          totalWorkMinutes: 1500,
        },
      ],
      totalExpense: 3010000,
      topCategories: [
        { ratio: 0.34, amount: 1023400, category: 'FOOD', displayName: '식비' },
        { ratio: 0.25, amount: 752500, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.09, amount: 270900, category: 'SUBSCRIPTION', displayName: 'OTT·구독' },
        { ratio: 0.32, amount: 963200, category: 'ETC', displayName: '기타' },
      ],
      availableFunds: 880000,
      incomeChangeRate: 0.0658,
      expenseChangeRate: 0.0789,
    },
    recommendation: {
      reasoning:
        '가용자금 88만 원 중 40만 원을 자동이체하면 연 3.8% 우대금리 적용을 기대할 수 있습니다.',
      jobInsight: '크몽 디자인 외주 소득 비중이 가장 크지만 식비·교통비 지출도 함께 늘었습니다.',
      financialType: 'BALANCED',
      futureIncomeTrend: '지출 증가세를 관리하지 않으면 다음 달 가용자금이 더 줄어들 수 있습니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 400000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '지출이 늘어난 달일수록 자동이체 금액은 보수적으로 설정해 보세요.',
      },
      simulatedExtraIncome: 1270,
      financialActivityInsight:
        '식비와 교통비 지출이 함께 늘어 소비가 증가하고 가용자금이 줄었습니다.',
    },
  },
  '2026-02': {
    reportId: 6,
    yearMonth: '2026-02',
    createdAt: '2026-08-06T04:48:05',
    financialSummary: {
      totalIncome: 3650000,
      jobSummaries: [
        {
          jobId: 1,
          jobName: '카카오 T 택시',
          incomeRatio: 0.3068,
          incomeAmount: 1120000,
          totalWorkMinutes: 2280,
        },
        {
          jobId: 2,
          jobName: '배달',
          incomeRatio: 0.2384,
          incomeAmount: 870000,
          totalWorkMinutes: 1920,
        },
        {
          jobId: 3,
          jobName: '크몽 디자인 외주',
          incomeRatio: 0.4548,
          incomeAmount: 1660000,
          totalWorkMinutes: 1620,
        },
      ],
      totalExpense: 2790000,
      topCategories: [
        { ratio: 0.31, amount: 864900, category: 'FOOD', displayName: '식비' },
        { ratio: 0.23, amount: 641700, category: 'TRANSPORTATION', displayName: '교통' },
        { ratio: 0.12, amount: 334800, category: 'SUBSCRIPTION', displayName: 'OTT·구독' },
        { ratio: 0.34, amount: 948600, category: 'ETC', displayName: '기타' },
      ],
      availableFunds: 860000,
      incomeChangeRate: 0.021,
      expenseChangeRate: -0.034,
    },
    recommendation: {
      reasoning:
        '가용자금 86만 원 중 40만 원을 자동이체하면 연 3.8% 우대금리 적용을 기대할 수 있습니다.',
      jobInsight: '세 잡의 소득 비중이 지난 몇 달과 비슷하게 안정적으로 유지되고 있습니다.',
      financialType: 'SURPLUS',
      futureIncomeTrend:
        '소비 변동폭이 작게 유지되면 다음 달에도 안정적인 가용자금을 기대할 수 있습니다.',
      recommendedProduct: {
        details: { interestRate: 3.8, savingPeriod: 12, maxMonthlyAmount: 400000 },
        summary: '자동이체 조건 충족 시 우대금리를 제공하는 자유적금 상품',
        provider: 'KB국민은행',
        productId: 'SAVINGS_001',
        productName: 'KB N챌린지 자유적금',
        productType: 'SAVINGS',
        targetGroup: 'N잡러',
        njobTrendTip: '소비가 안정적인 달에는 자동이체 금액을 늘려 저축을 극대화해 보세요.',
      },
      simulatedExtraIncome: 1270,
      financialActivityInsight:
        '최근 6개월 중 소비 변동폭이 가장 작아 안정적인 소비 패턴을 유지하고 있습니다.',
    },
  },
}

function normalizeListItem(item) {
  const totalIncome = item.totalIncome ?? null
  const totalSpend = item.totalExpense ?? null

  return {
    month: item.yearMonth,
    monthLabel: deriveMonthLabel(item.yearMonth),
    reportTitle: item.reportTitle,
    totalIncome,
    totalSpend,
    // 목록 API는 availableFunds를 내려주지 않는다(상세 API에만 존재).
    // 상세 API 기준 availableFunds는 항상 totalIncome - totalExpense와 같으므로 동일하게 계산한다.
    availableFunds:
      item.availableFunds ??
      (totalIncome != null && totalSpend != null ? totalIncome - totalSpend : null),
  }
}

function toPercent(rate) {
  return rate != null ? Math.round(rate * 100) : null
}

function normalizeDetail(data) {
  const summary = data.financialSummary ?? {}
  const recommendation = data.recommendation ?? {}
  const recommendedProduct = recommendation.recommendedProduct

  return {
    month: data.yearMonth,
    monthLabel: deriveMonthLabel(data.yearMonth),
    totalIncome: summary.totalIncome ?? null,
    totalSpend: summary.totalExpense ?? null,
    availableFunds: summary.availableFunds ?? null,
    incomeChangePercent: toPercent(summary.incomeChangeRate),
    expenseChangePercent: toPercent(summary.expenseChangeRate),
    categories: (summary.topCategories ?? []).map((category) => ({
      id: category.category,
      label: category.displayName,
      percent: Math.round(category.ratio * 100),
    })),
    jobs: (summary.jobSummaries ?? []).map((job) => ({
      id: job.jobId,
      name: job.jobName,
      incomeAmount: job.incomeAmount,
      totalWorkMinutes: job.totalWorkMinutes,
    })),
    recommendedProduct: recommendedProduct
      ? {
          name: recommendedProduct.productName,
          description: recommendedProduct.summary,
          provider: recommendedProduct.provider,
          interestRate: recommendedProduct.details?.interestRate ?? null,
          savingPeriod: recommendedProduct.details?.savingPeriod ?? null,
          maxMonthlyAmount: recommendedProduct.details?.maxMonthlyAmount ?? null,
          targetGroup: recommendedProduct.targetGroup ?? null,
          njobTrendTip: recommendedProduct.njobTrendTip ?? null,
        }
      : null,
    insight: recommendation.financialActivityInsight ?? null,
    reasoning: recommendation.reasoning ?? null,
    jobInsight: recommendation.jobInsight ?? null,
    futureIncomeTrend: recommendation.futureIncomeTrend ?? null,
    financialType: recommendation.financialType ?? null,
    simulatedExtraIncome: recommendation.simulatedExtraIncome ?? null,
  }
}

// GET /ai-reports는 다른 컨트롤러와 달리 Bearer 인증과 별개로 userId를 필수 쿼리로 요구한다
// (스웨거 실측 확인) — axiosInstance의 FALLBACK_USER_ID는 미인증 상태에서만 주입되므로,
// 실 로그인 사용자는 호출부에서 userId를 직접 넘겨야 한다.
export async function fetchReportList(userId) {
  const data = await requestWithMock(
    { totalCount: MOCK_AI_REPORTS.length, reports: MOCK_AI_REPORTS },
    (client) => client.get('/ai-reports', { params: { userId } }),
  )
  return (data.reports ?? []).map(normalizeListItem)
}

export async function fetchReportDetail(yearMonth) {
  const mock =
    MOCK_AI_REPORT_DETAIL_BY_MONTH[yearMonth] ?? MOCK_AI_REPORT_DETAIL_BY_MONTH['2026-07']
  const data = await requestWithMock(mock, (client) => client.get(`/ai-reports/${yearMonth}`))
  return normalizeDetail(data)
}
