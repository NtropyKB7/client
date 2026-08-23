import { requestWithMock } from '@/shared/api/request'

export const MONTH_SUMMARY_TARGET = { hours: 40, income: 2000000 }

// userId는 axiosInstance 요청 인터셉터가 인증 상태에 따라 자동으로 붙여준다(FALLBACK_USER_ID 참고).
const SEOUL_COORDS = { latitude: 37.5665, longitude: 126.978 }

const SKY_STATUS_ICON = {
  맑음: '☀️',
  구름많음: '⛅',
  흐림: '☁️',
}

const PRECIPITATION_ICON = {
  비: '🌧️',
  '비/눈': '🌨️',
  눈: '❄️',
  소나기: '🌦️',
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function dateArrayToKey([year, month, day]) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function timeArrayToLabel(time) {
  if (!time) return null
  const [hour, minute] = time
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function timeLabelToArray(label) {
  if (!label) return null
  const [hour, minute] = label.split(':').map(Number)
  return [hour, minute]
}

// skyStatus/precipitationType은 swagger에 enum이 없는 한글 문자열이라 기상청 단기예보 통상값으로
// 추측 매핑한다. 매핑에 없는 값은 raw 문자열을 label로 그대로 보여준다.
function mapForecastToWeather(forecast) {
  if (!forecast) return null
  const { skyStatus, precipitationType, rainSurcharge } = forecast
  const hasPrecipitation = Boolean(precipitationType) && precipitationType !== '없음'
  const icon = hasPrecipitation
    ? (PRECIPITATION_ICON[precipitationType] ?? '🌧️')
    : (SKY_STATUS_ICON[skyStatus] ?? '🌡️')
  const label = hasPrecipitation ? precipitationType : (skyStatus ?? '알 수 없음')
  return { icon, label: rainSurcharge ? `${label}·우천 할증` : label }
}

function normalizeMonthlySummary(data) {
  return {
    year: data.year,
    month: data.month,
    summary: {
      confirmedHours: data.summary?.confirmedHours ?? 0,
      scheduledHours: data.summary?.scheduledHours ?? 0,
      goalHours: data.summary?.goalHours ?? 0,
      expectedIncome: data.summary?.expectedIncome ?? 0,
      targetAmount: data.summary?.targetAmount ?? null,
    },
    days: (data.days ?? []).map((day) => ({
      dateKey: dateArrayToKey(day.date),
      settlementStatus: day.settlementStatus,
      jobs: day.jobs ?? [],
      weather: mapForecastToWeather(day.weather),
    })),
  }
}

function normalizeDailySummary(data) {
  return {
    dateKey: dateArrayToKey(data.date),
    dayOfWeek: data.dayOfWeek,
    works: (data.works ?? []).map((work) => ({
      workId: work.workId,
      jobId: work.jobId,
      jobName: work.jobName,
      startTime: timeArrayToLabel(work.startTime),
      endTime: timeArrayToLabel(work.endTime),
      status: work.status,
      settlementStatus: work.settlementStatus ?? null,
      taskCount: work.taskCount ?? null,
      fatigue: work.fatigue ?? null,
    })),
    fatigue: {
      score: data.fatigue?.score ?? 0,
      level: data.fatigue?.level ?? null,
      isOverThreshold: data.fatigue?.isOverThreshold ?? false,
    },
    weather: mapForecastToWeather(data.weather),
  }
}

function normalizeWeatherByDate(data) {
  const map = {}
  for (const forecast of data.forecasts ?? []) {
    map[dateArrayToKey(forecast.date)] = mapForecastToWeather(forecast)
  }
  return map
}

// TODO(연동 테스트 전용): 백엔드 근무 계획/확정 API(work-log-controller) 연동 후 이 시드 데이터는
// calendarStore 초기값 용도로만 남는다(CalendarView는 더 이상 이 데이터를 직접 그리지 않음).
export const SEED_ENTRIES_2026_07 = [
  {
    id: 'seed-1',
    date: '2026-07-01',
    jobId: 'job-1',
    jobName: '대리운전',
    category: 'driving',
    startTime: '20:00',
    endTime: '00:00',
    count: 8,
    fatigue: 2,
    status: 'settled',
  },
  {
    id: 'seed-2',
    date: '2026-07-02',
    jobId: 'job-2',
    jobName: '배달라이더',
    category: 'delivery',
    startTime: '11:00',
    endTime: '15:00',
    count: 12,
    fatigue: 2,
    status: 'settled',
  },
  {
    id: 'seed-3',
    date: '2026-07-04',
    jobId: 'job-1',
    jobName: '대리운전',
    category: 'driving',
    startTime: '21:00',
    endTime: '01:00',
    count: 10,
    fatigue: 3,
    status: 'settled',
  },
  {
    id: 'seed-4',
    date: '2026-07-05',
    jobId: 'job-2',
    jobName: '배달라이더',
    category: 'delivery',
    startTime: '11:00',
    endTime: '15:00',
    count: 9,
    fatigue: 1,
    status: 'settled',
  },
  {
    id: 'seed-5',
    date: '2026-07-12',
    jobId: 'job-1',
    jobName: '대리운전',
    category: 'driving',
    startTime: '20:00',
    endTime: '23:00',
    count: 7,
    fatigue: 3,
    status: 'confirmed',
  },
  {
    id: 'seed-6',
    date: '2026-07-13',
    jobId: 'job-2',
    jobName: '배달라이더',
    category: 'delivery',
    startTime: '11:00',
    endTime: '15:00',
    count: 11,
    fatigue: 2,
    status: 'confirmed',
  },
  {
    id: 'seed-7',
    date: '2026-07-15',
    jobId: 'job-1',
    jobName: '대리운전',
    category: 'driving',
    startTime: '19:00',
    endTime: '22:00',
    count: null,
    fatigue: null,
    status: 'planned',
  },
  {
    id: 'seed-8',
    date: '2026-07-16',
    jobId: 'job-2',
    jobName: '배달라이더',
    category: 'delivery',
    startTime: '19:00',
    endTime: '23:00',
    count: null,
    fatigue: null,
    status: 'planned',
  },
  {
    id: 'seed-9',
    date: '2026-07-16',
    jobId: 'job-1',
    jobName: '대리운전',
    category: 'driving',
    startTime: '23:30',
    endTime: '02:00',
    count: null,
    fatigue: null,
    status: 'planned',
  },
  {
    id: 'seed-10',
    date: '2026-07-18',
    jobId: 'job-3',
    jobName: '유튜브 애드센스',
    category: 'creative',
    startTime: '20:00',
    endTime: '22:00',
    count: null,
    fatigue: 2,
    status: 'confirmed',
  },
]

const MOCK_WEATHER_BY_DATE = {
  '2026-07-16': { icon: '☁️', label: '비·우천 할증' },
  '2026-07-17': { icon: '🌧️', label: '비·우천 할증' },
  '2026-07-18': { icon: '⛅', label: '흐림' },
  '2026-07-19': { icon: '☀️', label: '맑음' },
  '2026-07-20': { icon: '☀️', label: '맑음' },
  '2026-07-21': { icon: '🌦️', label: '소나기 주의' },
  '2026-07-22': { icon: '⛅', label: '흐림' },
}

// 오늘 기준 5일치 목업 날씨 패턴(고정 시드 데이터와 달리 날짜에 의존하지 않게 순환 사용).
const MOCK_WEATHER_PATTERN = [
  { icon: '☀️', label: '맑음' },
  { icon: '⛅', label: '흐림' },
  { icon: '🌧️', label: '비·우천 할증' },
  { icon: '🌦️', label: '소나기 주의' },
  { icon: '☀️', label: '맑음' },
]

function buildMockWeatherByDate(baseDate = new Date()) {
  const map = {}
  for (let offset = 0; offset < 5; offset += 1) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + offset)
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    map[dateKey] = MOCK_WEATHER_PATTERN[offset]
  }
  return map
}

const MOCK_FATIGUE_THRESHOLD = 65

function mockEntryHours(entry) {
  const [startHour, startMinute] = entry.startTime.split(':').map(Number)
  const [endHour, endMinute] = entry.endTime.split(':').map(Number)
  let hours = endHour + endMinute / 60 - (startHour + startMinute / 60)
  if (hours < 0) hours += 24
  return hours
}

function buildMockMonthlySummary(year, month) {
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  const monthEntries = SEED_ENTRIES_2026_07.filter((entry) => entry.date.startsWith(prefix))

  const entriesByDate = new Map()
  for (const entry of monthEntries) {
    if (!entriesByDate.has(entry.date)) entriesByDate.set(entry.date, [])
    entriesByDate.get(entry.date).push(entry)
  }

  const days = [...entriesByDate.entries()].map(([dateKey, dayEntries]) => ({
    dateKey,
    settlementStatus: dayEntries.every((entry) => entry.status === 'settled')
      ? 'COMPLETED'
      : 'PENDING',
    jobs: [...new Map(dayEntries.map((entry) => [entry.jobId, entry])).values()].map((entry) => ({
      jobId: entry.jobId,
      jobName: entry.jobName,
    })),
    weather: MOCK_WEATHER_BY_DATE[dateKey] ?? null,
  }))

  // 'planned'(아직 근무 전)만 예정 시간으로, 근무일지가 작성된 'confirmed'/'settled'는 확정 시간으로 집계.
  const confirmedHours = Math.round(
    monthEntries
      .filter((entry) => entry.status !== 'planned')
      .reduce((sum, entry) => sum + mockEntryHours(entry), 0),
  )
  const scheduledHours = Math.round(
    monthEntries
      .filter((entry) => entry.status === 'planned')
      .reduce((sum, entry) => sum + mockEntryHours(entry), 0),
  )

  return {
    year,
    month,
    summary: {
      confirmedHours,
      scheduledHours,
      goalHours: MONTH_SUMMARY_TARGET.hours,
      expectedIncome: 0,
      targetAmount: null,
    },
    days,
  }
}

function buildMockDailySummary(dateKey) {
  const dayEntries = SEED_ENTRIES_2026_07.filter((entry) => entry.date === dateKey)
  const rated = dayEntries.filter((entry) => typeof entry.fatigue === 'number')
  const score =
    rated.length === 0
      ? 0
      : Math.round((rated.reduce((sum, entry) => sum + entry.fatigue, 0) / rated.length) * 20)

  return {
    dateKey,
    dayOfWeek: WEEKDAY_LABELS[new Date(dateKey).getDay()],
    // 실제 백엔드는 work.status를 PLANNED/CONFIRMED로만 관리하고, 정산 여부는 별도
    // settlementStatus('COMPLETED' 외 null)로 내려준다. 시드 데이터의 'settled'는
    // "확정 후 정산완료"를 뜻하므로 status는 CONFIRMED로, settlementStatus만 COMPLETED로 맞춘다.
    works: dayEntries.map((entry) => ({
      workId: entry.id,
      jobId: entry.jobId,
      jobName: entry.jobName,
      startTime: entry.startTime,
      endTime: entry.endTime,
      status: entry.status === 'settled' ? 'CONFIRMED' : entry.status.toUpperCase(),
      settlementStatus: entry.status === 'settled' ? 'COMPLETED' : null,
    })),
    fatigue: {
      score,
      level: score > MOCK_FATIGUE_THRESHOLD ? 'HIGH' : 'LOW',
      isOverThreshold: score > MOCK_FATIGUE_THRESHOLD,
    },
    weather: MOCK_WEATHER_BY_DATE[dateKey] ?? null,
  }
}

// axiosInstance 응답 인터셉터가 ApiResponse<T> 봉투를 이미 풀어주므로, 여기서는
// response.data(=payload)를 정규화해 mock과 동일한 모양으로 맞추기만 하면 된다.
export async function fetchCalendarMonth({ year, month }) {
  return requestWithMock(buildMockMonthlySummary(year, month), (client) =>
    client
      .get('/calendar/monthly', { params: { year, month, ...SEOUL_COORDS } })
      .then((response) => ({ data: normalizeMonthlySummary(response.data) })),
  )
}

export async function fetchCalendarDay({ dateKey }) {
  return requestWithMock(buildMockDailySummary(dateKey), (client) =>
    client
      .get('/calendar/daily', { params: { date: dateKey, ...SEOUL_COORDS } })
      .then((response) => ({ data: normalizeDailySummary(response.data) })),
  )
}

// 오늘부터 5일치 날씨(weather-controller). date 문자열을 key로 하는 {icon,label} 맵을 반환한다.
export async function fetchWeatherForecast() {
  return requestWithMock(buildMockWeatherByDate(), (client) =>
    client
      .get('/weather', { params: { ...SEOUL_COORDS } })
      .then((response) => ({ data: normalizeWeatherByDate(response.data) })),
  )
}

// ── work-log-controller ────────────────────────────────────────────────────
// calendarStore(localStorage)를 은퇴시키면서, 근무 등록/수정/확정/삭제는 이제 서버를 직접 호출하고
// 결과는 CalendarView가 캘린더 쿼리를 invalidate해서 반영한다. mock 모드(백엔드 미연동)에서는
// 그럴듯한 성공 응답만 흉내내고 실제로는 아무 데도 저장하지 않는다(로컬 영속 스토어가 없어짐에 따른
// 의도된 트레이드오프).

function workLogBody({ jobId, startTime, endTime, taskCount, fatigue }) {
  return {
    jobId,
    startTime: timeLabelToArray(startTime),
    endTime: timeLabelToArray(endTime),
    taskCount: taskCount ?? 0,
    fatigue: fatigue ?? 0,
  }
}

export async function createWorkPlan({ jobId, dateKey, startTime, endTime }) {
  return requestWithMock({ workId: `mock-${Date.now()}` }, (client) =>
    client.post('/works/plan', {
      workDate: dateKey,
      ...workLogBody({ jobId, startTime, endTime }),
    }),
  )
}

export async function createWorkActual({ jobId, dateKey, startTime, endTime, taskCount, fatigue }) {
  return requestWithMock({ workId: `mock-${Date.now()}` }, (client) =>
    client.post('/works/actual', {
      workDate: dateKey,
      ...workLogBody({ jobId, startTime, endTime, taskCount, fatigue }),
    }),
  )
}

// 계획된 근무(workId 존재)를 실제 근무일지로 확정한다. 기존 workId를 대상으로 하는 PATCH이므로
// 새 레코드를 만드는 POST /api/works/actual(직접 실적 등록용, 이번엔 미사용)과는 다르다.
export async function confirmWorkLog(workId, { jobId, startTime, endTime, taskCount, fatigue }) {
  return requestWithMock(null, (client) =>
    client.patch(
      `/works/${workId}/confirm`,
      workLogBody({ jobId, startTime, endTime, taskCount, fatigue }),
    ),
  )
}

export async function editWorkLog(workId, { jobId, startTime, endTime, taskCount, fatigue }) {
  return requestWithMock(null, (client) =>
    client.patch(
      `/works/${workId}/edit`,
      workLogBody({ jobId, startTime, endTime, taskCount, fatigue }),
    ),
  )
}

export async function deleteWorkLog(workId) {
  return requestWithMock(null, (client) => client.delete(`/works/${workId}`))
}
