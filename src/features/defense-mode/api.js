import { FALLBACK_USER_ID } from '@/shared/api/axiosInstance'
import { requestWithMock } from '@/shared/api/request'
import { useAuthStore } from '@/features/auth/store'
import { formatNextDueLabel } from './utils'

const MOCK_CAUSES = [
  {
    causeCode: 'ACCIDENT_INJURY',
    causeGroup: 'ACCIDENT',
    causeName: '사고',
    checklist: [
      '안전 확보',
      '사고 기록 보관',
      '진료 및 증빙 보관',
      '업무상 재해 적용 가능성 확인',
      '복귀일 재확인',
    ],
    guideMessage: null,
  },
  {
    causeCode: 'ILLNESS',
    causeGroup: 'HEALTH',
    causeName: '질병',
    checklist: ['진료 및 증빙 보관', '치료 계획 확인', '보장 내역 확인', '복귀일 재확인'],
    guideMessage: null,
  },
  {
    causeCode: 'PLATFORM_RESTRICTION',
    causeGroup: 'PLATFORM',
    causeName: '계정정지',
    checklist: ['제한 통지 보관', '플랫폼 이의제기 확인', '업무 이력 보관', '복귀일 재확인'],
    guideMessage: null,
  },
  {
    causeCode: 'EQUIPMENT_FAILURE',
    causeGroup: 'EQUIPMENT',
    causeName: '장비고장',
    checklist: ['수리 범위 확인', '대체 장비 확인', '손해 보장 확인', '복귀일 재확인'],
    guideMessage: null,
  },
  {
    causeCode: 'FAMILY_CARE_CRISIS',
    causeGroup: 'FAMILY',
    causeName: '육아·돌봄',
    checklist: ['돌봄 기간 확인', '돌봄 지원 확인', '복귀일 재확인'],
    guideMessage: null,
  },
  {
    causeCode: 'OTHER',
    causeGroup: 'ETC',
    causeName: '기타',
    checklist: ['상황 기록', '복귀일 재확인'],
    guideMessage: '이 사유는 공통 체크리스트만 제공해요. 필요한 내용을 별도로 메모해두세요.',
  },
]

const MOCK_ACTIVE_DEFENSE = {
  defenseId: 1,
  userId: FALLBACK_USER_ID,
  causeCode: 'ILLNESS',
  causeName: '질병',
  unavailableStartDate: '2026-08-05',
  expectedReturnDate: '2026-08-31',
  returnDate: null,
  reserveAmountSnapshot: 1280000,
  safeAssetAmountSnapshot: 3400000,
  availableAssetsSnapshot: 4680000,
  averageMonthlyExpense: 3300000,
  dailyExpense: 110000,
  survivalDays: 42,
  calculationStatus: 'CALCULATED',
  status: 'ACTIVE',
  createdAt: '2026-08-05T04:24:32',
  checklist: [
    {
      code: 'VISIT_MEDICAL_PROVIDER',
      title: '진료 및 증빙 보관',
      description: '의료기관 진료 후 진료기록과 영수증을 보관하세요.',
    },
    {
      code: 'FOLLOW_TREATMENT_PLAN',
      title: '치료 계획 확인',
      description: '예상 치료기간과 근무 가능 시점을 의료진과 확인하세요.',
    },
    {
      code: 'REVIEW_HEALTH_COVERAGE',
      title: '보장 내역 확인',
      description: '가입한 보험의 청구 가능 여부와 필요 서류를 확인하세요.',
    },
    {
      code: 'REVIEW_RETURN_DATE',
      title: '복귀일 재확인',
      description: '예상 복귀일이 현실적인지 확인하고 필요하면 기간을 조정하세요.',
    },
  ],
  fixedExpenseCheck: {
    totalExpectedAmount: 1280000,
    expenses: [
      {
        commitmentId: 1,
        accountId: 1,
        expenseName: '대출상환',
        expenseType: 'LOAN',
        productName: null,
        expectedAmount: 500000,
        nextPaymentDate: '2026-08-05',
        outstandingBalance: 4000000,
        maintainStatus: 'NORMAL',
        amountStatus: 'NORMAL',
        dateStatus: 'NORMAL',
        survivalDaysBefore: 42,
        survivalDaysAfter: 37,
        reducedDays: 5,
      },
      {
        commitmentId: 2,
        accountId: 1,
        expenseName: '실비 보험료',
        expenseType: 'INSURANCE',
        productName: null,
        expectedAmount: 500000,
        nextPaymentDate: '2026-08-10',
        outstandingBalance: null,
        maintainStatus: 'DIFFICULT',
        amountStatus: 'DIFFICULT',
        dateStatus: 'NORMAL',
        survivalDaysBefore: 37,
        survivalDaysAfter: 32,
        reducedDays: 5,
      },
      {
        commitmentId: 3,
        accountId: 1,
        expenseName: 'OTT 구독료',
        expenseType: 'SUBSCRIPTION',
        productName: null,
        expectedAmount: 280000,
        nextPaymentDate: '2026-08-14',
        outstandingBalance: null,
        maintainStatus: 'REVIEW_SUSPENSION',
        amountStatus: 'REVIEW_SUSPENSION',
        dateStatus: 'NORMAL',
        survivalDaysBefore: 32,
        survivalDaysAfter: 29,
        reducedDays: 3,
      },
    ],
  },
  expectedIncomeLoss: {
    calculationStatus: 'PARTIALLY_CALCULATED',
    jobs: [
      { jobId: 101, jobName: '배달의민족 라이더', expectedIncomeLoss: 864000 },
      { jobId: 102, jobName: 'GS25 야간 알바', expectedIncomeLoss: 620000 },
    ],
    periodStartDate: '2026-08-05',
    periodEndDate: '2026-08-31',
    totalAmount: 1484000,
  },
  growthMode: {
    integrationStatus: 'DISPLAY_ONLY',
    isPaused: true,
    message: '근무 추천과 자동 저축을 잠시 멈춘 상태입니다.',
  },
}

// 캘린더용 방어모드 기간 mock. 현재 활성 기간(MOCK_ACTIVE_DEFENSE와 동일한 구간) 하나와,
// 지난(종료된) 기간 하나를 섞어 두어 캘린더에서 두 경우를 모두 확인할 수 있게 한다.
const MOCK_DEFENSE_CALENDAR_PERIODS = [
  { defenseId: 1, startDate: '2026-08-05', endDate: '2026-08-31' },
  { defenseId: 0, startDate: '2026-07-10', endDate: '2026-07-15' },
]

function buildMockDefenseCalendar(year, month) {
  const monthStart = `${year}-${String(month).padStart(2, '0')}-01`
  // 실제 말일이 아니어도 ISO 날짜 문자열 비교의 상한으로만 쓰이므로 31로 고정해도 안전하다.
  const monthEnd = `${year}-${String(month).padStart(2, '0')}-31`
  return {
    periods: MOCK_DEFENSE_CALENDAR_PERIODS.filter(
      (period) => period.startDate <= monthEnd && period.endDate >= monthStart,
    ),
  }
}

// 이 백엔드는 LocalDate 필드를 swagger 선언(string/format:date)과 달리 실제로는
// [year, month, day] 배열로 내려주는 경우가 있다(calendar/api.js의 dateArrayToKey 참고 —
// CalendarDaySummary.date가 동일한 swagger 선언인데도 배열로 옴). 문자열/배열 둘 다 방어적으로 처리한다.
function normalizeDateValue(value) {
  if (Array.isArray(value)) {
    const [year, month, day] = value
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }
  return value
}

function normalizeDefenseCalendar(data) {
  return (data?.periods ?? []).map((period) => ({
    defenseId: period.defenseId,
    startDate: normalizeDateValue(period.startDate),
    endDate: normalizeDateValue(period.endDate),
  }))
}

function mapMaintainStatus(maintainStatus) {
  if (maintainStatus === 'DIFFICULT') return 'tight'
  if (maintainStatus === 'REVIEW_SUSPENSION') return 'review'
  return 'ok' // NORMAL, UNDETERMINED
}

function normalizeFixedExpenses(fixedExpenseCheck) {
  return (fixedExpenseCheck?.expenses ?? []).map((expense) => ({
    id: `commitment-${expense.commitmentId}`,
    name: expense.expenseName,
    amount: expense.expectedAmount,
    nextDueLabel: formatNextDueLabel(expense.nextPaymentDate),
    status: mapMaintainStatus(expense.maintainStatus),
  }))
}

function normalizeDefenseMode(data) {
  if (!data) return null
  return {
    defenseId: data.defenseId,
    status: data.status,
    causeCode: data.causeCode,
    causeName: data.causeName,
    unavailableStartDate: data.unavailableStartDate,
    expectedReturnDate: data.expectedReturnDate,
    survivalDays: data.survivalDays,
    finance: {
      reserve: data.reserveAmountSnapshot,
      safeAssets: data.safeAssetAmountSnapshot,
      dailySpend: data.dailyExpense,
    },
    checklist: data.checklist ?? [],
    fixedExpenses: normalizeFixedExpenses(data.fixedExpenseCheck),
    expectedLossAmount: data.expectedIncomeLoss?.totalAmount ?? 0,
    growthMode: {
      isPaused: data.growthMode?.isPaused ?? false,
      message: data.growthMode?.message ?? '',
    },
  }
}

export async function fetchDefenseCauses() {
  const data = await requestWithMock({ causes: MOCK_CAUSES }, (client) =>
    client.get('/defense/causes'),
  )
  return data.causes
}

export async function fetchDefenseModeData() {
  const data = await requestWithMock(MOCK_ACTIVE_DEFENSE, async (client) => {
    try {
      return await client.get('/defense/active', { suppressErrorToast: true })
    } catch (error) {
      // 활성 방어모드가 없는 경우(404)는 정상 상태이지 에러가 아니다.
      if (error.response?.status === 404) return { data: null }
      throw error
    }
  })
  return normalizeDefenseMode(data)
}

// 캘린더 화면에서 특정 연/월에 걸치는 방어모드 기간(활성+지난 기간 모두)을 표시하기 위한 조회.
// /defense/active와 달리 없어도 404가 아니라 periods:[]로 내려온다고 가정한다.
export async function fetchDefenseCalendar({ year, month }) {
  const data = await requestWithMock(buildMockDefenseCalendar(year, month), (client) =>
    client.get('/defense/calendar', { params: { year, month } }),
  )
  return normalizeDefenseCalendar(data)
}

export async function enterDefenseMode({ causeCode, unavailableStartDate, expectedReturnDate }) {
  const data = await requestWithMock(MOCK_ACTIVE_DEFENSE, (client) =>
    client.post('/defense', { causeCode, unavailableStartDate, expectedReturnDate }),
  )
  return normalizeDefenseMode(data)
}

export async function releaseDefenseMode({ defenseId, returnDate }) {
  const data = await requestWithMock(MOCK_ACTIVE_DEFENSE, (client) => {
    const authStore = useAuthStore()
    const hasRealAccessToken = authStore.accessToken && authStore.accessToken !== 'debug'
    const body = hasRealAccessToken ? { returnDate } : { returnDate, userId: FALLBACK_USER_ID }
    return client.patch(`/defense/${defenseId}/return`, body)
  })
  return normalizeDefenseMode(data)
}
