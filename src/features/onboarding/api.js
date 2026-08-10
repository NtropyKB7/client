import axiosInstance from '@/shared/api/axiosInstance'
import { requestWithMock } from '@/shared/api/request'
import { mockDelay, shouldUseMock } from '@/shared/api/mockDelay'

// 은행 선택 모달/연결 계좌 카드의 아바타 배지 스타일(색상 · 이니셜). Figma 은행 선택 시안 기준.
// GET /api/banks가 내려주는 은행 중 여기 없는 곳은 getBankStyle()이 기본 스타일로 폴백한다.
export const BANK_META = {
  KB국민은행: { initial: 'KB', bg: '#F2D140', text: '#181B1A' },
  신한은행: { initial: 'S', bg: '#3885E0', text: '#FCFCFC' },
  우리은행: { initial: '우', bg: '#B9BABA', text: '#181B1A' },
  하나은행: { initial: 'H', bg: '#0DA18F', text: '#FCFCFC' },
  카카오뱅크: { initial: 'K', bg: '#FFD900', text: '#181B1A' },
  토스뱅크: { initial: '토', bg: '#B9BABA', text: '#181B1A' },
}

const DEFAULT_BANK_STYLE = { initial: '?', bg: '#E5E5E5', text: '#181B1A' }

export function getBankStyle(bankName) {
  return BANK_META[bankName] ?? { ...DEFAULT_BANK_STYLE, initial: bankName?.[0] ?? '?' }
}

// 생년월일 DatePicker를 열었을 때 처음 보여줄 연도. 대부분의 사용자가 성인일 것으로 보고
// 오늘로부터 20년 전 근방에서 시작해 연도를 거슬러 올라가는 수고를 줄인다.
export const BIRTH_DATE_DEFAULT_YEAR = new Date().getFullYear() - 20

// ── 금융계좌(account-controller) ───────────────────────────────────────────
// 이번 스코프는 connectionType: 'CODEF'(실제 은행 로그인 기반 계좌 연결)만 지원한다. 'VIRTUAL'은
// 범위 밖. AccountRegistrationRequest 스키마엔 생년월일 필드가 문서화돼 있지 않지만,
// BankSummary.birthDateRequired가 true인 은행(인터넷은행 등)은 CODEF 로그인에 생년월일이
// 실제로 필요해 요청 바디에 birthDate를 실어 보낸다 — 백엔드가 미문서화 필드를 무시하더라도
// 필요한 은행에서 누락되는 것보다는 안전하다.

const MOCK_BANKS = [
  {
    organizationCode: '0004',
    bankName: 'KB국민은행',
    codefSupported: true,
    birthDateRequired: false,
  },
  {
    organizationCode: '0088',
    bankName: '신한은행',
    codefSupported: true,
    birthDateRequired: false,
  },
  {
    organizationCode: '0020',
    bankName: '우리은행',
    codefSupported: true,
    birthDateRequired: false,
  },
  {
    organizationCode: '0081',
    bankName: '하나은행',
    codefSupported: true,
    birthDateRequired: false,
  },
  {
    organizationCode: '0090',
    bankName: '카카오뱅크',
    codefSupported: true,
    birthDateRequired: true,
  },
  { organizationCode: '0092', bankName: '토스뱅크', codefSupported: true, birthDateRequired: true },
]

export async function fetchBanks() {
  const banks = await requestWithMock(MOCK_BANKS, (client) =>
    client.get('/banks').then((response) => ({ data: response.data?.banks ?? [] })),
  )
  return banks.filter((bank) => bank.codefSupported)
}

let mockAccountIdSeq = 100
const mockAccounts = []

export async function fetchAccounts() {
  return requestWithMock(
    mockAccounts.map((account) => ({ ...account })),
    (client) =>
      client.get('/accounts').then((response) => ({ data: response.data?.accounts ?? [] })),
  )
}

export function isAccountActive(account) {
  return (account?.status ?? '').toUpperCase() === 'ACTIVE'
}

export async function registerAccount({
  organizationCode,
  bankLoginId,
  bankLoginPassword,
  birthDate,
}) {
  const payload = { connectionType: 'CODEF', organizationCode, bankLoginId, bankLoginPassword }
  if (birthDate) payload.birthDate = birthDate
  if (shouldUseMock()) {
    await mockDelay()
    const bank = MOCK_BANKS.find((candidate) => candidate.organizationCode === organizationCode)
    mockAccountIdSeq += 1
    mockAccounts.push({
      accountId: mockAccountIdSeq,
      bankName: bank?.bankName ?? '연결된 은행',
      organizationCode,
      connectionType: 'CODEF',
      accountNoMasked: `${organizationCode}-***-******`,
      status: 'ACTIVE',
    })
    return { accountCount: 1, connectionType: 'CODEF', organizationCode }
  }
  const { data } = await axiosInstance.post('/accounts', payload)
  return data
}

export async function activateAccount(accountId) {
  if (shouldUseMock()) {
    await mockDelay()
    const account = mockAccounts.find((candidate) => candidate.accountId === accountId)
    if (account) account.status = 'ACTIVE'
    return
  }
  await axiosInstance.patch(`/accounts/${accountId}/activate`)
}

export async function deactivateAccount(accountId) {
  if (shouldUseMock()) {
    await mockDelay()
    const account = mockAccounts.find((candidate) => candidate.accountId === accountId)
    if (account) account.status = 'INACTIVE'
    return
  }
  await axiosInstance.patch(`/accounts/${accountId}/deactivate`)
}

/**
 * 은행 로그인 row들을 순서대로 등록한다. 실패 지점에서 즉시 중단하고, 그 전까지 성공한 row는
 * onRowRegistered로 알려 호출부(반응형 리스트)에서 바로 제거할 수 있게 한다.
 */
export async function registerAccountRows(rows, { onRowRegistered } = {}) {
  for (const row of rows) {
    await registerAccount({
      organizationCode: row.bank.organizationCode,
      bankLoginId: row.bankLoginId,
      bankLoginPassword: row.bankLoginPassword,
      birthDate: row.bank.birthDateRequired ? row.birthDate : undefined,
    })
    onRowRegistered?.(row)
  }
}

// NOTE(2026-07-28, 공통 컴포넌트 PR 반영): JobCard가 docs/JobCard.png 실제 디자인 기준으로
// { id, name, incomeMethodLabel, incomeAmount, fatigue, isRegular, workDays, startTime, endTime }
// 형태의 job 객체 prop을 받도록 이미 구현되어 있다. 최초 계획의 { name, cyclePattern, settlementCycle }
// 3필드 스펙은 폐기하고 아래 실제 JobCard API에 맞춘 mock 데이터를 사용한다.
const MOCK_DETECTED_JOBS = [
  {
    id: 'job-1',
    name: '대리운전',
    incomeMethodLabel: '건당 정산',
    incomeAmount: 15000,
    fatigue: 3,
    isRegular: true,
    workDays: ['화', '목', '토'],
    startTime: '19:00',
    endTime: '23:00',
    category: 'driving',
  },
  {
    id: 'job-2',
    name: '배달라이더',
    incomeMethodLabel: '건당 정산',
    incomeAmount: 4500,
    fatigue: 2,
    isRegular: true,
    workDays: ['토', '일'],
    startTime: '11:00',
    endTime: '15:00',
    category: 'delivery',
  },
  {
    id: 'job-3',
    name: '유튜브 애드센스',
    incomeMethodLabel: '월 정산',
    incomeAmount: 0,
    fatigue: 1,
    isRegular: false,
    workDays: [],
    startTime: '',
    endTime: '',
    category: 'creative',
  },
]

export async function fetchDetectedJobs() {
  return requestWithMock(MOCK_DETECTED_JOBS, (client) => client.get('/onboarding/detected-jobs'))
}

/**
 * 저축목표 슬라이더 값에 따른 달성 가능 범위를 계산한다.
 * TODO: 백엔드 최적화 엔진(가산 배점) 연동 후 이 함수를 API 호출로 교체.
 */
export function calculateAchievableRange(goalAmount, fatigue) {
  const fatigueFactor = 0.9 - fatigue * 0.05
  const min = Math.round((goalAmount * fatigueFactor) / 10000) * 10000
  const max = Math.round((goalAmount * 1.05) / 10000) * 10000
  return { min, max }
}

// ── job-controller / category-controller ──────────────────────────────────
// 잡 데이터는 더 이상 onboardingStore(localStorage)에 캐시하지 않는다. onboarding/mypage/캘린더가
// 각자 useQuery(['jobs'])/useQuery(['categories'])로 직접 조회하고, 변경 시 해당 쿼리를 무효화한다.

const MOCK_CATEGORIES = [
  { categoryId: 1, name: '배달' },
  { categoryId: 2, name: '대리운전' },
  { categoryId: 3, name: '퀵서비스' },
  { categoryId: 4, name: '택배/물류 상하차' },
  { categoryId: 5, name: '가사·청소 도우미' },
  { categoryId: 6, name: '아르바이트' },
  { categoryId: 8, name: '콜센터·CS상담' },
  { categoryId: 9, name: '펫시터·돌봄' },
  { categoryId: 10, name: '콘텐츠 제작' },
  { categoryId: 11, name: '설문·리서치 참여' },
]

export async function fetchCategories() {
  return requestWithMock(MOCK_CATEGORIES, (client) =>
    client.get('/categories').then((response) => ({ data: response.data?.categories ?? [] })),
  )
}

const SETTLEMENT_TYPE_TO_LABEL = { HOURLY: '시급', MONTHLY: '월 정산', PER_TASK: '건당 정산' }
const LABEL_TO_SETTLEMENT_TYPE = { 시급: 'HOURLY', '월 정산': 'MONTHLY', '건당 정산': 'PER_TASK' }
const SETTLEMENT_TYPE_TO_WAGE_FIELD = {
  HOURLY: 'hourlyWage',
  MONTHLY: 'monthlyWage',
  PER_TASK: 'perTaskWage',
}

const KOREAN_DAY_TO_ENGLISH = {
  월: 'MONDAY',
  화: 'TUESDAY',
  수: 'WEDNESDAY',
  목: 'THURSDAY',
  금: 'FRIDAY',
  토: 'SATURDAY',
  일: 'SUNDAY',
}
const ENGLISH_DAY_TO_KOREAN = Object.fromEntries(
  Object.entries(KOREAN_DAY_TO_ENGLISH).map(([ko, en]) => [en, ko]),
)

function timeLabelToArray(label) {
  if (!label) return null
  const [hour, minute] = label.split(':').map(Number)
  return [hour, minute]
}

// 백엔드가 LocalTime을 [hour,minute] 배열로 내려주는 걸 캘린더 연동에서 확인했다. schedules도
// 같은 방식일 것으로 보고 처리하되, 문자열("HH:mm[:ss]")로 오는 경우도 방어적으로 처리한다.
function timeToLabel(time) {
  if (!time) return ''
  if (Array.isArray(time)) {
    const [hour, minute] = time
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }
  return String(time).slice(0, 5)
}

/**
 * JobResponse(GET) → 클라이언트 잡 모델. schedules는 아직 백엔드 GET 응답에 없는 걸 실측으로 확인했으나
 * (POST/PUT은 씀), 곧 보강될 예정이라 있다고 가정하고 매핑해둔다(없으면 workDays/startTime/endTime이
 * 빈 값으로 떨어질 뿐 에러는 안 남).
 */
function normalizeJob(job) {
  const schedules = job.schedules ?? []
  return {
    id: job.jobId,
    name: job.jobName,
    categoryId: job.categoryId,
    incomeMethodLabel: SETTLEMENT_TYPE_TO_LABEL[job.settlementType] ?? '시급',
    incomeAmount: job.hourlyWage ?? job.monthlyWage ?? job.perTaskWage ?? 0,
    fatigue: job.baseFatigue,
    isRegular: job.isRegular,
    workDays: schedules.map(
      (schedule) => ENGLISH_DAY_TO_KOREAN[schedule.dayOfWeek] ?? schedule.dayOfWeek,
    ),
    startTime: schedules[0] ? timeToLabel(schedules[0].startTime) : '',
    endTime: schedules[0] ? timeToLabel(schedules[0].endTime) : '',
    isActive: job.isActive ?? true,
  }
}

function toJobRequestPayload(draft) {
  const settlementType = LABEL_TO_SETTLEMENT_TYPE[draft.incomeMethodLabel] ?? 'HOURLY'
  const wageField = SETTLEMENT_TYPE_TO_WAGE_FIELD[settlementType]
  const payload = {
    categoryId: draft.categoryId,
    jobName: draft.name,
    settlementType,
    isRegular: draft.isRegular,
    baseFatigue: draft.fatigue,
    [wageField]: draft.incomeAmount,
  }
  if (draft.isRegular && draft.workDays?.length > 0) {
    payload.schedules = draft.workDays.map((day) => ({
      dayOfWeek: KOREAN_DAY_TO_ENGLISH[day] ?? day,
      startTime: timeLabelToArray(draft.startTime),
      endTime: timeLabelToArray(draft.endTime),
    }))
  }
  return payload
}

// mock 모드(백엔드 미연동)에서 등록/수정/비활성화가 그럴듯하게 동작하도록 세션 동안만 유지하는
// 인메모리 목록. 새로고침하면 초기 시드로 돌아간다(localStorage에 영속하던 이전 calendarStore/
// onboardingStore.jobs와 달리, 이번에 스토어를 은퇴시키면서 의도적으로 영속성을 포기함).
let mockJobIdSeq = 1000
const mockJobs = [
  {
    jobId: 1,
    categoryId: 2,
    jobName: '대리운전',
    settlementType: 'PER_TASK',
    hourlyWage: null,
    monthlyWage: null,
    perTaskWage: 15000,
    taskPerHour: null,
    isRegular: true,
    baseFatigue: 3,
    isActive: true,
    schedules: [
      { dayOfWeek: 'TUESDAY', startTime: [19, 0], endTime: [23, 0] },
      { dayOfWeek: 'THURSDAY', startTime: [19, 0], endTime: [23, 0] },
      { dayOfWeek: 'SATURDAY', startTime: [19, 0], endTime: [23, 0] },
    ],
  },
  {
    jobId: 2,
    categoryId: 1,
    jobName: '배달라이더',
    settlementType: 'PER_TASK',
    hourlyWage: null,
    monthlyWage: null,
    perTaskWage: 4500,
    taskPerHour: null,
    isRegular: true,
    baseFatigue: 2,
    isActive: true,
    schedules: [
      { dayOfWeek: 'SATURDAY', startTime: [11, 0], endTime: [15, 0] },
      { dayOfWeek: 'SUNDAY', startTime: [11, 0], endTime: [15, 0] },
    ],
  },
  {
    jobId: 3,
    categoryId: 10,
    jobName: '유튜브 애드센스',
    settlementType: 'MONTHLY',
    hourlyWage: null,
    monthlyWage: 0,
    perTaskWage: null,
    taskPerHour: null,
    isRegular: false,
    baseFatigue: 1,
    isActive: true,
    schedules: [],
  },
]

export async function fetchJobs() {
  const jobs = await requestWithMock(mockJobs.map(normalizeJob), (client) =>
    client
      .get('/jobs')
      .then((response) => ({ data: (response.data?.jobs ?? []).map(normalizeJob) })),
  )
  // GET /api/jobs는 isActive=false 잡도 그대로 내려주는 걸 실측으로 확인함 — 클라이언트에서 필터링.
  return jobs.filter((job) => job.isActive)
}

export async function createJob(draft) {
  const payload = toJobRequestPayload(draft)
  if (shouldUseMock()) {
    await mockDelay()
    mockJobIdSeq += 1
    mockJobs.push({ jobId: mockJobIdSeq, isActive: true, ...payload })
    return { jobId: mockJobIdSeq }
  }
  const { data } = await axiosInstance.post('/jobs', payload)
  return data
}

export async function updateJob(jobId, draft) {
  const payload = toJobRequestPayload(draft)
  if (shouldUseMock()) {
    await mockDelay()
    const index = mockJobs.findIndex((job) => job.jobId === jobId)
    if (index !== -1) mockJobs[index] = { ...mockJobs[index], ...payload }
    return
  }
  await axiosInstance.put(`/jobs/${jobId}`, payload)
}

export async function deactivateJob(jobId) {
  if (shouldUseMock()) {
    await mockDelay()
    const job = mockJobs.find((j) => j.jobId === jobId)
    if (job) job.isActive = false
    return
  }
  await axiosInstance.patch(`/jobs/${jobId}/deactivate`)
}
