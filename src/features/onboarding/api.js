import axiosInstance from '@/shared/api/axiosInstance'
import { requestWithMock } from '@/shared/api/request'
import { mockDelay, shouldUseMock } from '@/shared/api/mockDelay'

export const BANK_LIST = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  '카카오뱅크',
  '토스뱅크',
]

// 은행 선택 모달의 아바타 배지 스타일(색상 · 이니셜). Figma 은행 선택 시안 기준.
export const BANK_META = {
  KB국민은행: { initial: 'KB', bg: '#F2D140', text: '#181B1A' },
  신한은행: { initial: 'S', bg: '#3885E0', text: '#FCFCFC' },
  우리은행: { initial: '우', bg: '#B9BABA', text: '#181B1A' },
  하나은행: { initial: 'H', bg: '#0DA18F', text: '#FCFCFC' },
  카카오뱅크: { initial: 'K', bg: '#FFD900', text: '#181B1A' },
  토스뱅크: { initial: '토', bg: '#B9BABA', text: '#181B1A' },
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
