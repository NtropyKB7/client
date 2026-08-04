import axios from 'axios'
import { requestWithMock } from '@/shared/api/request'

export const FATIGUE_THRESHOLD = 65

export const MONTH_SUMMARY_TARGET = { hours: 40, income: 2000000 }

// "오늘"을 2026-07-16으로 가정한다(실제 백엔드 연동 전까지 고정).
export const TODAY_DATE_KEY = '2026-07-16'

// 이후 7일(07-16~07-22)치 날씨만 mock으로 채운다.
// TODO: 외부 날씨 API 연동 후 이 mock을 실제 예보 데이터로 교체.
const WEATHER_BY_DATE = {
  '2026-07-16': { icon: '☁️', label: '비·우천 할증' },
  '2026-07-17': { icon: '🌧️', label: '비·우천 할증' },
  '2026-07-18': { icon: '⛅', label: '흐림' },
  '2026-07-19': { icon: '☀️', label: '맑음' },
  '2026-07-20': { icon: '☀️', label: '맑음' },
  '2026-07-21': { icon: '🌦️', label: '소나기 주의' },
  '2026-07-22': { icon: '⛅', label: '흐림' },
}

// TODO(연동 테스트 전용): 백엔드 GET /api/weather 연동 확인용 코드.
// /api/weather는 오늘 기준 5일치만 반환하고, entries/jobs와 무관하게 날씨만 따로 내려준다.
// 캘린더 전체가 /api/calendar/daily·monthly(날씨 내장)로 마이그레이션되면 이 블록은 통째로 제거된다.
const WEATHER_API_BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL
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

function forecastDateToKey([year, month, day]) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// skyStatus/precipitationType은 swagger에 enum이 없는 한글 문자열이라 기상청 단기예보 통상값으로
// 추측 매핑한다. 매핑에 없는 값은 raw 문자열을 label로 그대로 보여준다.
function mapForecastToWeather({ skyStatus, precipitationType, rainSurcharge }) {
  const hasPrecipitation = Boolean(precipitationType) && precipitationType !== '없음'
  const icon = hasPrecipitation
    ? (PRECIPITATION_ICON[precipitationType] ?? '🌧️')
    : (SKY_STATUS_ICON[skyStatus] ?? '🌡️')
  const label = hasPrecipitation ? precipitationType : (skyStatus ?? '알 수 없음')
  return { icon, label: rainSurcharge ? `${label}·우천 할증` : label }
}

// VITE_WEATHER_API_BASE_URL 미설정 시(다른 개발자 환경) 조용히 스킵하고 빈 맵을 반환한다.
export async function fetchWeatherForecast(coords = SEOUL_COORDS) {
  if (!WEATHER_API_BASE_URL) return {}
  try {
    const { data } = await axios.get(`${WEATHER_API_BASE_URL}/api/weather`, { params: coords })
    const forecasts = data?.data?.forecasts ?? []
    return Object.fromEntries(
      forecasts.map((forecast) => [
        forecastDateToKey(forecast.date),
        mapForecastToWeather(forecast),
      ]),
    )
  } catch {
    return {}
  }
}

// TODO: 백엔드 근무 계획/확정 API 연동 후 이 시드 데이터는 최초 진입 시 서버 응답으로 교체.
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

export async function fetchCalendarMonth({ year, month }) {
  const mockConfig =
    year === 2026 && month === 7
      ? { weatherByDate: WEATHER_BY_DATE, summaryTarget: MONTH_SUMMARY_TARGET }
      : { weatherByDate: {}, summaryTarget: MONTH_SUMMARY_TARGET }
  // TODO: 백엔드 연동 후 mockConfig의 연/월 분기 제거(모든 달이 실제 데이터를 반환)
  return requestWithMock(mockConfig, (client) =>
    client.get('/calendar/month', { params: { year, month } }),
  )
}
