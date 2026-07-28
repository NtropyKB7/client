import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay } from '@/shared/api/mockDelay'

export const BANK_LIST = [
  'KB국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  '카카오뱅크',
  '토스뱅크',
]

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
  },
]

export async function fetchDetectedJobs() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_DETECTED_JOBS // TODO: 백엔드 입출금 내역 기반 잡 자동추정 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/onboarding/detected-jobs')
  return data
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
