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
  // DatePicker는 'YYYY-MM-DD'로 emit하지만 서버는 'YYYYMMDD'를 기대한다(Swagger AccountRegistrationRequest.birthDate 기준).
  if (birthDate) payload.birthDate = birthDate.replaceAll('-', '')
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

// ── job-controller: 잡 후보(GET /api/jobs/candidates) ──────────────────────
// 계좌 거래내역을 카테고리·플랫폼 단위로 집계한 결과다. jobName/임금/근무스케줄은 내려주지 않는다
// (그건 사용자가 후보를 실제 자기 잡으로 확정할 때 JobFormModal에서 직접 채운다).
const MOCK_JOB_CANDIDATES = [
  {
    categoryId: 1,
    categoryName: '배달',
    platforms: [
      { platformId: 1, platformName: '배민', depositName: '우아한형제들' },
      { platformId: 2, platformName: '쿠팡이츠', depositName: '쿠팡이츠' },
    ],
    settlementCount: 12,
    totalAmount: 540000,
  },
  {
    categoryId: 2,
    categoryName: '대리운전',
    platforms: [{ platformId: 4, platformName: '카카오T대리', depositName: '카카오모빌리티' }],
    settlementCount: 8,
    totalAmount: 320000,
  },
  {
    categoryId: 10,
    categoryName: '콘텐츠 제작',
    platforms: [{ platformId: 18, platformName: '유튜브', depositName: '구글코리아' }],
    settlementCount: 3,
    totalAmount: 150000,
  },
]

export async function fetchJobCandidates() {
  return requestWithMock(MOCK_JOB_CANDIDATES, (client) =>
    client.get('/jobs/candidates').then((response) => ({ data: response.data?.candidates ?? [] })),
  )
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

// ── platform-controller ────────────────────────────────────────────────────
// GET /api/platforms는 categoryId 쿼리 파라미터를 지원하지 않고 전체 목록을 한 번에 내려준다
// (PlatformSummary에 categoryId가 실려 있어 카테고리별 매칭은 클라이언트에서 필터링).
const MOCK_PLATFORMS = [
  { platformId: 1, categoryId: 1, platformName: '배민' },
  { platformId: 2, categoryId: 1, platformName: '쿠팡이츠' },
  { platformId: 3, categoryId: 1, platformName: '요기요' },
  { platformId: 4, categoryId: 2, platformName: '카카오T대리' },
  { platformId: 5, categoryId: 2, platformName: '티맵대리' },
  { platformId: 6, categoryId: 3, platformName: '부릉' },
  { platformId: 7, categoryId: 3, platformName: '생각대로' },
  { platformId: 8, categoryId: 4, platformName: '쿠팡물류' },
  { platformId: 9, categoryId: 4, platformName: 'CJ대한통운' },
  { platformId: 10, categoryId: 5, platformName: '청소연구소' },
  { platformId: 11, categoryId: 5, platformName: '대리주부' },
  { platformId: 12, categoryId: 6, platformName: '알바몬' },
  { platformId: 13, categoryId: 6, platformName: '알바천국' },
  { platformId: 14, categoryId: 8, platformName: 'CS링크' },
  { platformId: 15, categoryId: 8, platformName: '헬프미' },
  { platformId: 16, categoryId: 9, platformName: '펫시터코리아' },
  { platformId: 17, categoryId: 9, platformName: '도그메이트' },
  { platformId: 18, categoryId: 10, platformName: '유튜브' },
  { platformId: 19, categoryId: 10, platformName: '인스타그램' },
  { platformId: 20, categoryId: 11, platformName: '패널나우' },
  { platformId: 21, categoryId: 11, platformName: '오베이' },
]

export async function fetchPlatforms() {
  return requestWithMock(MOCK_PLATFORMS, (client) =>
    client.get('/platforms').then((response) => ({ data: response.data?.platforms ?? [] })),
  )
}

function platformIdsToPlatforms(platformIds) {
  return (platformIds ?? [])
    .map((platformId) => MOCK_PLATFORMS.find((platform) => platform.platformId === platformId))
    .filter(Boolean)
    .map(({ platformId, platformName }) => ({ platformId, platformName }))
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
    platformIds: (job.platforms ?? []).map((platform) => platform.platformId),
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
    platformIds: draft.platformIds ?? [],
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
    platforms: [{ platformId: 4, platformName: '카카오T대리' }],
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
    platforms: [
      { platformId: 1, platformName: '배민' },
      { platformId: 2, platformName: '쿠팡이츠' },
    ],
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
    platforms: [{ platformId: 18, platformName: '유튜브' }],
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
    mockJobs.push({
      jobId: mockJobIdSeq,
      isActive: true,
      ...payload,
      platforms: platformIdsToPlatforms(payload.platformIds),
    })
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
    if (index !== -1) {
      mockJobs[index] = {
        ...mockJobs[index],
        ...payload,
        platforms: platformIdsToPlatforms(payload.platformIds),
      }
    }
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

// ── 저축목표(saving-goal-controller) ────────────────────────────────────────
// 조회/수정 API는 없고 등록(POST)만 존재한다. targetMonth는 이 저장소의 다른 월 필드
// (예: GET /api/ai-reports/{yearMonth})와 동일하게 'YYYY-MM' 문자열로 보낸다.
let mockSavingGoalIdSeq = 1

export function currentTargetMonth() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function createSavingGoal({ targetAmount, laborIntensity, targetMonth }) {
  const payload = { targetAmount, laborIntensity, targetMonth }
  if (shouldUseMock()) {
    await mockDelay()
    mockSavingGoalIdSeq += 1
    return { savingGoalId: mockSavingGoalIdSeq }
  }
  const { data } = await axiosInstance.post('/saving-goals', payload)
  return data
}
