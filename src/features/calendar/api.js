import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay } from '@/shared/api/mockDelay'

export const GREETING_NAME = '동현'

export const DEFENSE_MODE_DATES = ['2026-07-08', '2026-07-09', '2026-07-10']

export const FATIGUE_THRESHOLD = 65

export const MONTH_SUMMARY_TARGET = { hours: 40, income: 2000000 }

// "오늘"을 2026-07-16으로 가정하고, 이후 7일(07-16~07-22)치 날씨만 mock으로 채운다.
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
  if (import.meta.env.DEV) {
    await mockDelay()
    if (year === 2026 && month === 7) {
      return {
        defenseModeDates: DEFENSE_MODE_DATES,
        weatherByDate: WEATHER_BY_DATE,
        summaryTarget: MONTH_SUMMARY_TARGET,
      }
    }
    // TODO: 백엔드 연동 후 이 분기 제거(모든 달이 실제 데이터를 반환)
    return { defenseModeDates: [], weatherByDate: {}, summaryTarget: MONTH_SUMMARY_TARGET }
  }
  const { data } = await axiosInstance.get('/calendar/month', { params: { year, month } })
  return data
}
