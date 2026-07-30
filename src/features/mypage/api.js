import axiosInstance from '@/shared/api/axiosInstance'
import { mockDelay } from '@/shared/api/mockDelay'

const MOCK_PROFILE = {
  name: '김동현',
  email: 'kdongh0406@gmail.com',
  avatarLabel: '동현',
}

export const PLAN_OPTIONS = [
  {
    id: 'basic',
    name: 'Basic',
    description: '대시보드, 캘린더, 소득 분석',
    priceLabel: '무료',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Basic 모든 기능, 방어모드, AI 리포트 제공',
    priceLabel: '4,900 ₩ / 월',
  },
]

const MOCK_SUBSCRIPTION = {
  planId: 'pro',
  startedAt: '2026-07-13',
  nextBillingDate: '2026-08-16',
  autoRenew: true,
  paymentMethod: { label: '신한 카드', maskedNumber: '**** 1111' },
  billingHistory: [
    { id: 'bill-1', label: 'Pro 정기결제', date: '2026-08-16', amount: 4900 },
    { id: 'bill-2', label: 'Pro 정기결제', date: '2026-07-16', amount: 4900 },
    { id: 'bill-3', label: 'Pro 정기결제', date: '2026-06-16', amount: 4900 },
  ],
}

const MOCK_NOTIFICATIONS = [
  {
    id: 'noti-1',
    title: '7월 28일 근무 확인 알림',
    timeRangeLabel: '11:00 - 15:00',
    detailLabel: '배달 3건',
    fatigueLabel: '피로도 보통',
  },
  {
    id: 'noti-2',
    title: '7월 26일 근무 확인 알림',
    timeRangeLabel: '19:00 - 23:00',
    detailLabel: '대리운전 2건',
    fatigueLabel: '피로도 힘듦',
  },
]

export async function fetchProfile() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_PROFILE // TODO: 백엔드 사용자 프로필 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/mypage/profile')
  return data
}

export async function fetchSubscription() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_SUBSCRIPTION // TODO: 백엔드 구독/결제 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/mypage/subscription')
  return data
}

export async function fetchNotifications() {
  if (import.meta.env.DEV) {
    await mockDelay()
    return MOCK_NOTIFICATIONS // TODO: 백엔드 알림 이력 API 연동 후 이 분기 제거
  }
  const { data } = await axiosInstance.get('/mypage/notifications')
  return data
}
